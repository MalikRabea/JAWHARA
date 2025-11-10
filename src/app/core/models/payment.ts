export type PaymentMethod = 'card' | 'cod' | 'paypal' | 'bank';

export interface CardPaymentDetails {
  cardholderName: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
}

export interface PaymentDetails {
  method: PaymentMethod;
  card?: CardPaymentDetails;
  transactionId?: string;
  status?: 'initiated' | 'authorized' | 'captured' | 'failed' | 'refunded';
}





