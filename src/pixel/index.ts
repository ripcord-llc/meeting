import { FacebookPixel, GooglePixel } from '../api/routing/types';

import { trackPixelEvent } from './facebook';
import gtag from './gtag';

export function sendPixelEvent({
  facebookPixel,
  googlePixel,
  data,
}: {
  facebookPixel: FacebookPixel | null;
  googlePixel: GooglePixel | null;
  data: { name: string; email: string; productId: string };
}): void {
  try {
    if (facebookPixel) {
      trackPixelEvent('NewLead', data);
    }

    if (googlePixel) {
      gtag('event', 'conversion', {
        ...data,
        ...(googlePixel.conversionId ? { send_to: googlePixel.conversionId } : {}),
      });
    }
  } catch (error) {
    console.error('Error sending pixel event', error);
  }
}
