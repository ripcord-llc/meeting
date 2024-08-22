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
