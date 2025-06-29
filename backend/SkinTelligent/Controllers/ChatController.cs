using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using SkinTelIigent.Contracts.DTOs;
using SkinTelIigent.Contracts.DTOs.Chat;
using SkinTelIigent.Core.Entities;
using SkinTelIigent.Core.Entities.Appointment;
using SkinTelIigent.Core.Interface;
using SkinTelIigent.Core.Specification;
using SkinTelIigentContracts.CustomResponses;
using System.Text.Json;
using static System.Net.WebRequestMethods;


namespace SkinTelligent.Api.Controllers
{
   public class ChatController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _http;

        public ChatController(HttpClient http, IConfiguration configuration, IUnitOfWork unitOfWork, IMapper mapper, UserManager<ApplicationUser> userManager)
       {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _http = http;
       }
        [HttpPost("/api/chats/send")]
        public async Task<ActionResult<ConversationResponse>> SendMessage([FromBody] MessageRequest request)
        {
            var ConversationRepo = _unitOfWork.Repository<Conversation>();
            var Conversation = await ConversationRepo.GetByIdSpecAsync(new ConversationSpecifications(request.AppointmentId, request.PatinetId));
            string sessionId = Conversation?.SessionId ?? Guid.NewGuid().ToString();
            var payload = new
            {
                session_id = sessionId,
                message = request.Message
            };

            var patientExists = await _unitOfWork.Repository<Patient>().GetByIdAsync(request.PatinetId);
            if (patientExists ==null)
                return NotFound(new BaseApiResponse(404, "Invalid PatientId"));

            var appointmentExists = await _unitOfWork.Repository<Appointment>().GetByIdAsync(request.AppointmentId);
            if (appointmentExists ==null)
                return NotFound(new BaseApiResponse(404, "Invalid AppointmentId"));
           
            var ChatUrl = EndpointStorage.Chat;
            var response = await _http.PostAsJsonAsync($"{ChatUrl}/chat/${sessionId}", payload);
            if (!response.IsSuccessStatusCode)
                return StatusCode(500, new BaseApiResponse(500, "AI service error"));

            var aiResponse = await response.Content.ReadFromJsonAsync<ConversationResponse>();
            if (aiResponse == null)
                return StatusCode(500, new BaseApiResponse(500, "AI InValid Response"));

            var jsonOptions = new JsonSerializerOptions
            {
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };

            if (Conversation == null)
            {
                Conversation = new Conversation
                {
                    SessionId = sessionId,
                    AppointmentId = request.AppointmentId,
                    PatientId = request.PatinetId,
                    JsonData = JsonSerializer.Serialize(aiResponse, jsonOptions),
                    CreateAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await ConversationRepo.AddAsync(Conversation);
            }
            else
            {
                Conversation.JsonData = JsonSerializer.Serialize(aiResponse, jsonOptions);
                Conversation.UpdatedAt = DateTime.UtcNow;
            }

            try
            {
                await _unitOfWork.SaveChangeAsync();
            }
            catch (Exception ex)
            {
                var error = ex.GetBaseException().Message;
                return StatusCode(500, new BaseApiResponse(500, error));
            }
            if (aiResponse.Finished)
            {
                await SummaryChat(aiResponse, Conversation.Id);
            }
            return Ok(new ConversationResponse
            {
                Finished = aiResponse.Finished,
                Full_conversation = aiResponse.Full_conversation
            });
        }
        private async Task<IActionResult> SummaryChat(ConversationResponse data , int ConversationId)
        {
            if (data == null || data.Full_conversation == null || !data.Full_conversation.Any())
                return BadRequest("Invalid conversation data");

            var payload = new
            {
                messages = data.Full_conversation.Select(turn => new
                {
                    role = turn.Role,
                    content = turn.Content
                }).ToList()
            };

            var summaryUrl = EndpointStorage.Summary;

            var response = await _http.PostAsJsonAsync($"{summaryUrl}/summary", payload);
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode(500, new BaseApiResponse(500, "Failed to generate summary from AI model"));
            }

            var summaryResult = await response.Content.ReadAsStringAsync();
            if (string.IsNullOrEmpty(summaryResult))
            {
                return StatusCode(500, "AI model returned an empty summary");
            }
            var conversationSummary = new ConversationSummary
            {
                ConversationId = ConversationId, 
                SummaryJson = summaryResult,            
                CreatedAt = DateTime.UtcNow           
            };

            try
            {
                await _unitOfWork.Repository<ConversationSummary>().AddAsync(conversationSummary);
                await _unitOfWork.SaveChangeAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error saving summary to the database: {ex.Message}");
            }
            return Ok(new { Summary = summaryResult });
        }


        private int? GetAuthenticatedPatientId()
        {
            var patientIdClaim = User.FindFirst("patientId");
            if (patientIdClaim == null || !int.TryParse(patientIdClaim.Value, out int patientId))
                return null;

            return patientId;
        }

    }
}

