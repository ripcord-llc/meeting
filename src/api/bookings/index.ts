import useSWR, { SWRConfiguration } from 'swr';

import { fetcher } from '../fetcher';

import { Slot, TeamSlot } from './types';

const BOOKING_ENDPOINTS = {
  user: (userId: string, date: string) => `/public/bookings/user/${userId}?date=${date}`,
  team: (teamId: string, date: string) => `/public/bookings/team/${teamId}?date=${date}`,
  deal: (dealId: string, date: string) => `/public/bookings/deal/${dealId}?date=${date}`,
};

export function useUserSlots(
  userId: string,
  date: string | null,
  config?: SWRConfiguration<Slot[]>
) {
  return useSWR(date ? BOOKING_ENDPOINTS.user(userId, date) : null, fetcher<Slot[]>, config);
}

export function useTeamSlots(
  teamId: string,
  date: string | null,
  config?: SWRConfiguration<TeamSlot[]>
) {
  return useSWR(date ? BOOKING_ENDPOINTS.team(teamId, date) : null, fetcher<TeamSlot[]>, config);
}

export function useDealSlots(
  dealId: string,
  date: string | null,
  config?: SWRConfiguration<Slot[]>
) {
  return useSWR(date ? BOOKING_ENDPOINTS.deal(dealId, date) : null, fetcher<Slot[]>, config);
}
