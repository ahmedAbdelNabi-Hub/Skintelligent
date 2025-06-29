using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SkinTelIigent.Core.Entities
{
    public class ConversationSummaryConfigurations : IEntityTypeConfiguration<ConversationSummary>
    {
        public void Configure(EntityTypeBuilder<ConversationSummary> builder)
        {
            builder.HasKey(cs => cs.Id);

            builder.HasOne(cs => cs.Conversation) 
                .WithOne(c => c.Summary) 
                .HasForeignKey<ConversationSummary>(cs => cs.ConversationId) 
                .OnDelete(DeleteBehavior.Cascade); 

            builder.Property(cs => cs.ConversationId)
                .IsRequired(); 

            builder.Property(cs => cs.SummaryJson)
                .IsRequired(); 

            builder.Property(cs => cs.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()"); 

            builder.ToTable("ConversationSummaries");
        }
    }
}
