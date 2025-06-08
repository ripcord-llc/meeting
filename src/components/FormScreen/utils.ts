export const COMMON_EMAIL_DOMAINS: string[] = [
  // **Google**
  'gmail.com',
  'googlemail.com',

  // **Microsoft (Outlook/Hotmail)**
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'hotmail.co.uk',
  'hotmail.fr',
  'hotmail.de',
  'hotmail.it',
  'windowslive.com',
  'passport.com',

  // **Yahoo!**
  'yahoo.com',
  'ymail.com',
  'rocketmail.com',
  'yahoo.co.uk',
  'yahoo.fr',
  'yahoo.de',
  'yahoo.it',
  'yahoo.com.br',
  'yahoo.co.in',
  'yahoo.ca',

  // **AOL**
  'aol.com',
  'love.com',
  'ygm.com',
  'games.com',
  'wow.com',

  // **Apple / iCloud**
  'icloud.com',
  'me.com',
  'mac.com',

  // **Zoho**
  'zoho.com',

  // **ProtonMail**
  'protonmail.com',
  'proton.me',

  // **GMX**
  'gmx.com',
  'gmx.net',
  'gmx.de',
  'gmx.at',
  'gmx.co.uk',
  'gmx.es',
  'gmx.fr',

  // **Mail.com**
  'mail.com',
  // various proprietary aliases provided by Mail.com
  'email.com',
  'usa.com',

  // **Fastmail** (Branded & alias domains)
  'fastmail.com',
  'fastmail.co.uk',
  'fastmail.jp',
  '123mail.org',
  'airpost.net',
  'mailbolt.com',
  'sent.as',

  // **Tutanota**
  'tutanota.com',
  'tutanota.de',

  // **Yandex**
  'yandex.ru',
  'yandex.com',

  // **Other widespread/free ISP & regional domains**
  'comcast.net',
  'sbcglobal.net',
  'bellsouth.net',
  'cox.net',
  'verizon.net',
  'att.net',
  'charter.net',
  'earthlink.net',
  'bigpond.com',
  'bigpond.net.au',
  'libero.it',
  'mail.ru',
  'rediffmail.com',
  'qq.com',
  'naver.com',
];

export function getEmailDomain(email: string): string | null {
  const atIndex = email.lastIndexOf('@');

  if (atIndex === -1 || atIndex === email.length - 1) {
    return null; // invalid or incomplete email
  }

  return email.slice(atIndex + 1).toLowerCase();
}
