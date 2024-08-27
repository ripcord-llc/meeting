import { UTMParams } from '../api/deals/types';

const UTM_KEY = 'ripcord-booking-widget-utm';

function setUTMParams(params: UTMParams): void {
  localStorage.setItem(UTM_KEY, JSON.stringify(params));
}

export function getUTMParams(): UTMParams {
  try {
    const utm = localStorage.getItem(UTM_KEY);
    return utm ? JSON.parse(utm) : {};
  } catch (e) {
    return {};
  }
}

export function initUTMCapture() {
  window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);

    setUTMParams({
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_term: params.get('utm_term') || undefined,
      utm_content: params.get('utm_content') || undefined,
    });
  });
}
