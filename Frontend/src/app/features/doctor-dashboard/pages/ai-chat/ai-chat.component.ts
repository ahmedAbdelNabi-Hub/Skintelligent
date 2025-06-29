import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../../core/services/chat.service';
import { IAssistantRequestDTO } from '../../../../core/models/interface/IAssistantRequestDTO';
import { IAssistantResponse } from '../../../../core/models/interface/IAssistantResponse';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './ai-chat.component.html',
})
export class AiChatComponent implements OnInit {
  messages: { role: 'user' | 'assistant'; content: string }[] = [];
  newMessage: string = '';
  isLoading: boolean = false;

  conversationId!: number;

  constructor(
    private aiChatService: ChatService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const idParam = params['id'];
      if (idParam) {
        this.conversationId = +idParam;
        console.log(this.conversationId);
      } else {
        console.error('❌ Missing "id" query parameter.');
      }
    });
  }

  sendMessage(): void {
    const trimmed = this.newMessage.trim();
    if (!trimmed || !this.conversationId) return;

    this.messages.push({ role: 'user', content: trimmed });

    const request: IAssistantRequestDTO = {
      conversationId: this.conversationId,
      message: trimmed,
    };

    this.isLoading = true;

    this.aiChatService.sendMessage(request).subscribe({
      next: (res: IAssistantResponse) => {
        this.messages.push({ role: 'assistant', content: res.response });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('AI Error:', err);
        this.messages.push({ role: 'assistant', content: 'An error occurred. Please try again later.' });
        this.isLoading = false;
      }
    });

    this.newMessage = '';
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  trackByIndex(index: number) {
    return index;
  }
}
