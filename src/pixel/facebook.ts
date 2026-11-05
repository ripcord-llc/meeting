/* eslint-disable prefer-destructuring */
/* eslint-disable func-names */
/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */
/**
 * Initialize Facebook Meta Pixel tracking with the provided pixel ID
 * @param pixelId Your Facebook pixel ID
 * @param trackPageView Whether to automatically track a PageView event (default: true)
 */
export function initFacebookPixel(pixelId: string, trackPageView: boolean = true): void {
  // Define the fbq function on the window object if it doesn't exist
  if (!(window as any).fbq) {
    // Create the fbq function
    (window as any).fbq = function () {
      const fbq = (window as any).fbq;
      if (fbq.callMethod) {
        fbq.callMethod.apply(fbq, arguments);
      } else {
        fbq.queue.push(arguments);
      }
    };

    // Set up the fbq object properties
    const fbq = (window as any).fbq;
    if (!(window as any)._fbq) {
      (window as any)._fbq = fbq;
    }
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];

    // Create and insert the script tag
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';

    // Find the first script tag to insert before, or append to head if none exists
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  // Initialize the pixel with the provided ID
  (window as any).fbq('init', pixelId);

  // Track the initial PageView if requested
  if (trackPageView) {
    (window as any).fbq('track', 'PageView');
  }
}

let initializedPixelId: string | null = null;

/**
 * Initialize Facebook Meta Pixel once per page.
 * The pixel ID comes from the API and must never be written into script source.
 * @param pixelId Your Facebook pixel ID
 */
export function initFacebookPixelSimple(pixelId: string): void {
  if (!/^\d{1,20}$/.test(pixelId)) {
    console.warn('Ignoring invalid Facebook Pixel ID');
    return;
  }

  if (initializedPixelId) {
    if (initializedPixelId !== pixelId) {
      console.warn('Facebook Pixel already initialized with a different ID');
    }
    return;
  }

  initializedPixelId = pixelId;
  initFacebookPixel(pixelId, true);
}

/**
 * Track a Facebook Pixel event after the pixel has been initialized
 * @param eventName The name of the event to track
 * @param parameters Optional parameters for the event
 */
export function trackPixelEvent(eventName: string, parameters?: Record<string, any>): void {
  // Check if fbq is available
  if (typeof (window as any).fbq !== 'function') {
    console.warn(
      'Facebook Pixel (fbq) not available. Make sure initFacebookPixelSimple was called first.'
    );
    return;
  }

  // Call fbq with the provided parameters
  if (parameters) {
    (window as any).fbq('track', eventName, parameters);
  } else {
    (window as any).fbq('track', eventName);
  }
}

// Usage example:
// import { initFacebookPixelSimple, trackPixelEvent } from './facebook-pixel-simple';
//
// // Initialize
// initFacebookPixelSimple('YOUR_PIXEL_ID_HERE');
//
// // Track events later
// trackPixelEvent('Purchase', { value: 99.99, currency: 'USD' });
