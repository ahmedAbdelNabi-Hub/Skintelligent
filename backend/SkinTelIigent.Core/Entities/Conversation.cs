using SkinTelIigent.Core.Entities.Appointment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkinTelIigent.Core.Entities
{
    public class Conversation : BaseEntity
    {
        public string SessionId { get; set; } = Guid.NewGuid().ToString();
        public int? AppointmentId { get; set; }
        public int PatientId { get; set; }
        public string JsonData { get; set; } = string.Empty;
        public DateTime CreateAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Patient? Patient { get; set; }
        public Appointment.Appointment Appointment { get; set; }


        public ConversationSummary Summary { get; set; }  


    }
}
