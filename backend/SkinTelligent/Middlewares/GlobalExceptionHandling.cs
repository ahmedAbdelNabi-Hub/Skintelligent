using SkinTelIigentContracts.CustomResponses;
using System.Net;
using System.Text.Json;

namespace SkinTelligent.Api.Middlewares
{
    public class GlobalExceptionHandling
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandling> _logger;
        private readonly IHostEnvironment _environment;


        public GlobalExceptionHandling(IHostEnvironment environment, RequestDelegate next, ILogger<GlobalExceptionHandling> logger)
        {
            _next = next;
            _logger = logger;
            _environment = environment;

        }

        public async Task InvokeAsync(HttpContext Context)
        {
            try
            {
                await _next(Context);
            }
            catch (Exception ex)
            {

                _logger.LogError(ex, ex.Message);
                Context.Response.ContentType = "application/json";
                Context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                var response = new ExceptionServerResponse(ex.Message, ex.StackTrace ?? "No stack trace available"); // Safely getting StackTrace

                var jsonResponse = JsonSerializer.Serialize(response);
                await Context.Response.WriteAsync(jsonResponse);
            }
        }

    }
}
