import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

function uuid() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class ChatComponent implements OnInit {
  // MODE
  isSearchMode = true;

  // Home search
  searchQuery = '';

  // Chat mode
  messages: ChatMessage[] = [];
  userInput = '';
  loading = false;

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef // 👈 important pour zoneless
  ) {}

  ngOnInit(): void {
    // rien au début, on attend la recherche
  }

  startFromSearch(): void {
    const text = this.searchQuery.trim();
    if (!text || this.loading) return;

    this.isSearchMode = false;
    this.sendMessageInternal(text);
    this.searchQuery = '';
    this.cdr.detectChanges(); // 👈 on force l’update de la vue
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text || this.loading) return;

    this.sendMessageInternal(text);
    this.userInput = '';
    this.cdr.detectChanges();
  }

  private sendMessageInternal(text: string): void {
    // message user
    this.messages.push({
      id: uuid(),
      sender: 'user',
      text,
    });
    this.loading = true;
    this.cdr.detectChanges();

    this.chatService.sendMessageToAI(text).subscribe({
      next: (aiMessage) => {
        this.messages.push({
          id: uuid(),
          sender: 'ai',
          text: aiMessage.text,
          products: aiMessage.products,
        });
        this.cdr.detectChanges(); // 👈 update après la réponse
      },
      error: () => {
        this.messages.push({
          id: uuid(),
          sender: 'ai',
          text: '❌ Erreur côté IA, réessaie.',
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges(); // 👈 enlève “Recherche en cours”
      },
    });
  }

  handleKeydownChat(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  handleKeydownSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.startFromSearch();
    }
  }
}
