const UTM_KEY = 'ripcord-booking-widget-utm';

interface UTMValues {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
}

const defaultUTMValues: UTMValues = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_term: null,
  utm_content: null,
};

function setUTMParams(params: UTMValues): void {
  localStorage.setItem(UTM_KEY, JSON.stringify(params));
}

export function getUTMParams(): UTMValues {
  try {
    const utm = localStorage.getItem(UTM_KEY);
    return utm ? JSON.parse(utm) : defaultUTMValues;
  } catch (e) {
    return defaultUTMValues;
  }
}

export function initUTMCapture() {
  window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);

    setUTMParams({
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_term: params.get('utm_term'),
      utm_content: params.get('utm_content'),
    });
  });
}
