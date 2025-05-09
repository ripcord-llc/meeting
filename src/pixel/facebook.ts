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

/**
 * Initialize Facebook Meta Pixel by injecting the original pixel code directly as a script tag
 * @param pixelId Your Facebook pixel ID
 */
export function initFacebookPixelSimple(pixelId: string): void {
  if (document.getElementById('fb-pixel-script')) {
    console.warn('Facebook Pixel script already exists in the document');
    return;
  }

  // Create script element for the pixel code
  const pixelScript = document.createElement('script');
  pixelScript.id = 'fb-pixel-script';

  // Use the exact code from Facebook's Meta Pixel documentation
  // with the pixel ID replaced with the provided one
  pixelScript.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `;

  // Append the script to the document head
  document.head.appendChild(pixelScript);
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
