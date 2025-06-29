using SkinTelIigent.Core.Entities;
using SkinTelIigent.Core.Entities.Appointment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkinTelIigent.Core.Specification
{
    public class ConversationSpecifications : BaseSpecifications<Conversation>
    {
        public ConversationSpecifications(){}
        public ConversationSpecifications(int AppointmentId , int? PatientId)
        {
            AddCriteria(c=>c.AppointmentId == AppointmentId && c.PatientId== PatientId);   
        }
    }
}
