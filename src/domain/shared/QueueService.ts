export interface QueueService {
  sendPurchaseConfirmationEmail(params: {
    email: string;
    bookTitle: string;
    bookPrice: number;
  }): void;
  sendLowerPriceNotification(params: {
    email: string;
    bookTitle: string;
    bookPrice: number;
  }): void;
}
