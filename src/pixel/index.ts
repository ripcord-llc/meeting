import { trackPixelEvent } from './facebook';
import gtag from './gtag';

export function sendPixelEvent(data: { name: string; email: string; productId: string }): void {
  try {
    trackPixelEvent('NewLead', data);
    gtag('event', 'NewLead', data);
  } catch (error) {
    console.error('Error sending pixel event', error);
  }
}
