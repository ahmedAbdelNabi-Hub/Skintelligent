import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  inject,
  effect,
  DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatGroupService } from '../../../core/services/chatGroup.service';
import { AuthService } from '../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chat-group',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.scss'],
})
export class ChatGroupComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatGroupService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  message = signal('');
  currentUserName = this.authService.getUsername()!;

  readonly messages = computed(() =>
    this.chatService.messages().map((msg) => ({
      ...msg,
      isSelf: msg.username === this.currentUserName,
    }))
  );

  readonly onlineUsers = this.chatService.onlineUsers;

  ngOnInit(): void {
    this.chatService.startConnection();

    // Optional: Load chat history on init
    this.chatService
      .getMessages()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((msgs) => {
        const updated = msgs.map((msg) => ({
          ...msg,
          isSelf: msg.username === this.currentUserName,
        }));
        this.chatService.setMessages(updated);
      });
  }

  sendMessage(): void {
    const trimmed = this.message().trim();
    if (!trimmed) return;

    this.chatService.sendToClinicGroup(trimmed);
    this.message.set('');
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  ngOnDestroy(): void {
    this.chatService.stopConnection();
    this.chatService.clearMessages();
  }
}
