export interface User {
  id: string;
  name: string;
  email: string;
  pin?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  qrCode?: string; // Content of QR or URL
  qrUrl?: string;
  logo?: string; // URL to user logo
  createdAt: string;
}

export interface Settings {
  paymentKey: string;
  price: number;
}
