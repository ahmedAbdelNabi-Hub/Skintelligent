using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkinTelIigent.Contracts.DTOs.Chat
{
    public class ConversationTurn
    {
        public string Role { get; set; } = string.Empty;   
        public string Content { get; set; } = string.Empty;
    }
}
