import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat';

interface ProductResult {
  id: string;
  name: string;
  price: number;
  currency: string;
  img: string;
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
  // Référence au container des messages pour le scroll auto
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef<HTMLDivElement>;

  // Écran 1 : moteur de recherche
  isSearchMode = true;
  searchQuery = '';

  // Écran 2 : chat
  messages: ChatMessage[] = [];
  userInput = '';
  loading = false;

  constructor(private chatService: ChatService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Rien au début : on attend la première recherche
  }

  /* ================================
     MOTEUR DE RECHERCHE
  ================================= */

  startFromSearch(): void {
    const text = this.searchQuery.trim();
    if (!text || this.loading) {
      return;
    }

    // Passer au mode chat
    this.isSearchMode = false;
    this.cdr.detectChanges();

    // Envoyer ce texte comme premier message du chat
    this.sendMessageInternal(text);

    // Nettoyer le champ de recherche
    this.searchQuery = '';
    this.cdr.detectChanges();
  }

  handleKeydownSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.startFromSearch();
    }
  }

  /* ================================
     CHAT
  ================================= */

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text || this.loading) {
      return;
    }

    this.sendMessageInternal(text);
    this.userInput = '';
    this.cdr.detectChanges();
  }

  handleKeydownChat(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /** Logique commune pour envoyer un message + gérer la réponse IA */
  private sendMessageInternal(text: string): void {
    // Message utilisateur
    this.messages.push({
      id: uuid(),
      sender: 'user',
      text,
    });

    this.loading = true;
    this.cdr.detectChanges();
    this.scrollToBottom();

    this.chatService.sendMessageToAI(text).subscribe({
      next: (aiMessage) => {
        this.messages.push({
          id: uuid(),
          sender: 'ai',
          text: aiMessage.text,
          products: aiMessage.products as ProductResult[],
        });
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: () => {
        this.messages.push({
          id: uuid(),
          sender: 'ai',
          text: '❌ Erreur côté IA, réessaie.',
        });
        this.loading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
    });
  }

  /* ================================
     SCROLL AUTOMATIQUE
  ================================= */

  private scrollToBottom(): void {
    try {
      if (!this.messagesContainer) return;
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {
      // silencieux, pour éviter les erreurs si la vue n'est pas encore prête
    }
  }
}
