import { CalendarEvent, google, outlook, yahoo, aol, ics } from 'calendar-link';

export function parseEmailIntoEvent(
  email: string,
  event: CalendarEvent
): { url: string; isICS: boolean } {
  const [, domain] = email.split('@');

  if (!domain) throw new Error('Invalid email');

  const conditions: [string[], (event: CalendarEvent) => string][] = [
    [['gmail'], google],
    [['outlook', 'hotmail'], outlook],
    [['yahoo', 'ymail'], yahoo],
    [['aol'], aol],
  ];

  for (const [domains, action] of conditions) {
    for (const d of domains) {
      if (domain.includes(d)) {
        return { url: action(event), isICS: false };
      }
    }
  }

  return { url: ics(event), isICS: true };
}
