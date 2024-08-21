export interface FormValues {
  email: string;
  name: string;
  phone: string;
  url: string;
  answers: Record<number, number>;
}

export type FormScreenStatus = 'personal-info' | 'calendar';
