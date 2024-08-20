export interface LeadInjectionResponse {
  client: {
    id: number;
    hasEnrichmentData: boolean;
  };
  deal: {
    id: number;
    started: boolean;
  };
}
