using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkinTelIigent.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace SkinTelIigent.Infrastructure.Configruations
{
    public class ConversationConfigurations : IEntityTypeConfiguration<Conversation>
    {
        public void Configure(EntityTypeBuilder<Conversation> builder)
        {
            builder.HasOne(c => c.Appointment)
                   .WithOne(a => a.Conversation)
                   .HasForeignKey<Conversation>(c => c.AppointmentId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.Patient)
                   .WithMany(p => p.Conversations)
                   .HasForeignKey(c => c.PatientId)
                   .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
