export interface PublicRouting {
  uuid: string;
  name: string;
  account: {
    id: number;
    name: string;
    avatar: {
      fileUrl: string;
    } | null;
  };
  questions: {
    id: number;
    label: string;
    question: string;
    alwaysVisible: boolean;
    answers: {
      id: number;
      answer: string;
    }[];
  }[];
}
