export interface LeadInjectionResponse {
  client: {
    id: number;
    url: string | null;
    hasEnrichmentData: boolean;
  };
  deal: {
    id: number;
    uuid: string;
    userId: number;
    started: boolean;
  };
}

export type UTMParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

export type EventParams = {
  startTime: Date;
  endTime: Date;
};

export type BookingParams = EventParams &
  (
    | {
        type: 'user';
        userId: string;
      }
    | {
        type: 'team';
        teamId: string;
        users: number[];
      }
  );

export interface CreateMeetingParams {
  email: string;
  productId: string;
  booking: BookingParams;
  name?: string;
  phone?: string;
  url?: string;
  utm?: UTMParams;
}

export interface CreateExistingDealMeetingParams {
  dealId: string;
  email: string;
  event: EventParams;
  userId?: string;
  name?: string;
  phone?: string;
  url?: string;
  utm?: UTMParams;
}

export interface CreateMeetingResponse {
  id: number;
  userId: number;
}
