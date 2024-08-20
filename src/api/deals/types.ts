export interface LeadInjectionResponse {
  client: {
    id: number;
    url: string | null;
    hasEnrichmentData: boolean;
  };
  deal: {
    id: number;
    started: boolean;
  };
}
