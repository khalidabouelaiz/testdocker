export type SenderType = 'user' | 'ai';

export interface ProductResult {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  currency: string;
  size?: string;
  deliveryDays?: number;
  merchant: string;
  productUrl: string;
}

export interface ChatMessage {
  id: string;
  sender: SenderType;
  text: string;
  createdAt: Date;
  products?: ProductResult[];
}
