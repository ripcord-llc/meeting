export interface FormValues {
  email: string;
  name: string;
  phone: string;
  url: string;
  answers: Record<number, number>;
  altchaPayload: string;
}

export type FormScreenStatus = 'personal-info' | 'calendar';
export type PersonalInfoFormStatus = 'initial' | 'all-fields' | 'questions';
