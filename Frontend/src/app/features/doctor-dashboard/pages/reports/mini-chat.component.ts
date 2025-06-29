import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ChatService } from '../../../../core/services/chat.service';
import { IConversation } from '../../../../core/models/interface/IConversation';

@Component({
  selector: 'app-mini-chat',
  templateUrl: './mini-chat.component.html',
  styleUrls: ['./mini-chat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class MiniChatComponent implements OnInit, OnDestroy, OnChanges {
  @Input() patientName: string = '';
  messages: { role: string; content: string }[] = [];
  @Output() close = new EventEmitter<void>();
  @Input() conversationId !: number
  newMessage: string = '';
  @Input() isOpened: boolean = false;
  conversation: IConversation | null = null;
  private destroy$ = new Subject<void>();

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversationId']) {
      this.chatService
        .getConversationById(this.conversationId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.conversation = data;
            if (this.conversation?.jsonData?.messages) {
              this.messages = this.conversation.jsonData.messages;
              console.log(this.messages);
            }
          },
          error: (err) => console.error('Error loading conversation', err),
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClose() {
    this.close.emit();
  }
}
