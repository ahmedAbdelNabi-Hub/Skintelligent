using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SkinTelIigent.Contracts.DTOs.Chat
{
    public class ConversationResponse
    {
        [JsonPropertyName("response")]
        public string Reply { get; set; } = string.Empty;

        [JsonPropertyName("finished")]
        public bool Finished { get; set; }

        [JsonPropertyName("full_conversation")]
        public List<ConversationTurn> Full_conversation { get; set; } = new();
    }
}
