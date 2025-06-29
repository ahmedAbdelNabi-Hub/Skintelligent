import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-with-ai',
  templateUrl: './chat-with-ai.component.html',
  styleUrls: ['./chat-with-ai.component.scss'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class ChatWithAIComponent implements OnInit {
  selectedRoom: any = { id: 1, name: 'General' };
  firstMessage: boolean = true;
  @ViewChild('chatBox') private chatBox!: ElementRef;

  messages: { sender: string; text: string; sources?: string }[] = [];
  newMessage: string = '';
  chatRooms = [
    { id: 1, name: 'General' },
    { id: 2, name: 'Patient Cases' },
    { id: 3, name: 'Research' },
  ];

  constructor() {}

  ngOnInit(): void {
    // Initialize with a welcome message from AI
    this.messages.push({
      sender: 'AI',
      text: 'Hello! How can I assist you with your patient case today?',
    });
  }

  selectRoom(room: any) {}

  sendMessage(): void {
    this.firstMessage = false;
    if (this.newMessage.trim() === '') return;

    // Add user message to the chat
    this.messages.push({ sender: 'User', text: this.newMessage });
    this.newMessage = '';

    // Simulate AI response
    setTimeout(() => {
      this.messages.push({
        sender: 'AI',
        text: 'This is a sample response from the AI.',
        sources: 'Source: Example Source',
      });
      this.scrollToBottom();
    }, 1000);

    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatBox.nativeElement.scrollTop =
        this.chatBox.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }
}
