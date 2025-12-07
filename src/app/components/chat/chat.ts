import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat';

interface ProductResult {
  id: string;
  name: string;
  price: number;
  currency: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  products?: ProductResult[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  userInput = '';
  loading = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.messages.push({
      id: 'welcome',
      sender: 'ai',
      text: `Salut 👋 Je suis ton assistant shopping IA.
Écris par exemple : "basket blanche taille 40, max 50€, livraison 5 jours".`,
    });
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text || this.loading) return;

    this.messages.push({
      id: crypto.randomUUID(),
      sender: 'user',
      text,
    });
    this.userInput = '';
    this.loading = true;

    this.chatService.sendMessageToAI(text).subscribe({
      next: (aiMessage) => {
        this.messages.push({
          id: crypto.randomUUID(),
          sender: 'ai',
          text: aiMessage.text,
          products: aiMessage.products,
        });
      },
      error: () => {
        this.messages.push({
          id: crypto.randomUUID(),
          sender: 'ai',
          text: '❌ Erreur côté IA, réessaie.',
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
