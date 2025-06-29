using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkinTelIigent.Contracts.DTOs.Chat
{
    public class MessageRequest
    {
        [Required]
        public int AppointmentId { get; set; }
        [Required]
        public string Message { get; set; } = string.Empty;

        [Required]
        public int PatinetId { get; set; }
    }
}
