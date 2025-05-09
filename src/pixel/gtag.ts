/* eslint-disable prefer-rest-params */
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function initGtag(trackingId: string, additionalConfigInfo = {}) {
  const scriptId = 'ga-gtag';

  if (document.getElementById(scriptId)) return;

  const { head } = document;
  const script = document.createElement('script');
  script.id = scriptId;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  head.insertBefore(script, head.firstChild);

  window.dataLayer = window.dataLayer || [];

  gtag('js', new Date());
  gtag('config', trackingId, additionalConfigInfo);
}

function gtag(...args: any[]) {
  if (!window.dataLayer) {
    console.warn('window.dataLayer is not set. Gtag must be initialized first.');
    return;
  }

  // Can't use arrow func + destructuring as Google expects
  // arguments objects in dataLayer (not an array of arguments).
  window.dataLayer.push(arguments);
}

export default gtag;
