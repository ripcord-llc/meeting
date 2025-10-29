export enum RoutingOutcomeType {
  RECORDING = 'RECR',
  USER = 'USER',
  TEAM = 'TEAM',
}

export enum AccountType {
  B2B = 'B2B',
  B2C = 'B2C',
}

export interface FacebookPixel {
  pixelId: string;
}

export interface GooglePixel {
  pixelId: string;
  conversionId: string | null;
}

export interface PublicRouting {
  id: number;
  uuid: string;
  name: string;
  account: {
    id: number;
    name: string;
    avatar: {
      fileUrl: string;
    } | null;
    accountType: AccountType;
    googlePixel: GooglePixel | null;
    facebookPixel: FacebookPixel | null;
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
