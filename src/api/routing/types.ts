export enum RoutingOutcomeType {
  RECORDING = 'RECR',
  USER = 'USER',
  TEAM = 'TEAM',
}

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

export type RouteResult = { productId: string } & (
  | {
      outcome: RoutingOutcomeType.RECORDING;
    }
  | {
      outcome: RoutingOutcomeType.USER;
      userId: string;
    }
  | {
      outcome: RoutingOutcomeType.TEAM;
      teamId: string;
    }
);
