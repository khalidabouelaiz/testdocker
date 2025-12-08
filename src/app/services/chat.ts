import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  sendMessageToAI(userText: string): Observable<{ text: string; products: any[] }> {
    const products = [
      {
        id: '1',
        name: 'Basket blanche minimaliste',
        price: 39.99,
        currency: 'EUR',
        img: 'https://fromjak.com/cdn/shop/files/mercury-II-white-site-2.jpg?v=1693491172',
      },
      {
        id: '2',
        name: 'Sneaker blanche confort',
        price: 44.9,
        currency: 'EUR',
        img: 'https://images.unsplash.com/photo-1695073621086-aa692bc32a3d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8',
      },
      {
        id: '3',
        name: 'Basket running légère',
        price: 49.99,
        currency: 'EUR',
        img: 'https://static2.goldengoose.com/public/Style/ECOMM/GWF00126.F003928-10100.jpg',
      },
    ];

    const text = `Voici les meilleures options que j’ai trouvées pour "${userText}" 👇`;

    return of({ text, products }).pipe(delay(800));
  }
}
