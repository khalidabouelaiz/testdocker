import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  sendMessageToAI(userText: string): Observable<{ text: string; products: any[] }> {
    const products = [
      { id: '1', name: 'Basket blanche minimaliste', price: 39.99, currency: 'EUR' },
      { id: '2', name: 'Sneaker blanche confort', price: 44.9, currency: 'EUR' },
    ];

    const text = `Voilà quelques idées pour "${userText}". Le moins cher est à ${products[0].price} ${products[0].currency}.`;

    return of({ text, products }).pipe(delay(800));
  }
}
