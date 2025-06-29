using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkinTelIigent.Contracts.DTOs.Chat
{
    public class ConversationAiResponse
    {
        public List<ConversationTurn> Full_conversation { get; set; } = new();

    }
}
