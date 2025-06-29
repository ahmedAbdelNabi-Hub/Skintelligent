using Microsoft.AspNetCore.Mvc;
using SkinTelIigent.Contracts.DTOs;

namespace SkinTelligent.Api.Controllers
{
    public class LinkDTo
    {
        public string Chat {  get; set; }   
        public string summary { get; set; }
    }


    public class LinkController : BaseController
    {
        [HttpPost("set-link")]
        public IActionResult SetBaseUrl([FromBody] LinkDTo Url)
        {
            EndpointStorage.Chat = Url.Chat;
            EndpointStorage.Summary = Url.summary;
            return Ok(new { message = "Base URL updated successfully." });
        }

        [HttpGet("get-link")]
        public IActionResult GetBaseUrl()
        {
            return Ok(new { Chat = EndpointStorage.Chat , Summary = EndpointStorage.Summary});
        }
    }
}
