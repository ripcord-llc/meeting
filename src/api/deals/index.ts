import { SWRConfiguration } from 'swr';
import useSWRImmutable from 'swr/immutable';

import { post } from '../fetcher';

import { LeadInjectionResponse } from './types';

export const PUBLIC_DEALS_ENDPOINTS = {
  findLead: '/public/deals/find-lead',
  injectLead: '/public/deals/inject-lead',
  bookMeetingIntoLatestNonStartedDeal: '/public/deals/routing-meeting',
  bookMeetingIntoProduct: '/public/deals/product-meeting',
  bookMeetingIntoExistingDeal: '/public/deals/existing-deal-meeting',
};

export function useFindLead(
  params?: { routingId?: string; productId?: string; email?: string } | null,
  config?: SWRConfiguration<LeadInjectionResponse>
) {
  return useSWRImmutable(
    params?.email ? [PUBLIC_DEALS_ENDPOINTS.findLead, params] : null,
    async (key) => post<LeadInjectionResponse>(key[0], key[1] as Record<string, any>),
    config
  );
}
