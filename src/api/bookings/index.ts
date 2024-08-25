import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { Exception, fetcher } from '../fetcher';

import { Slot, TeamSlot } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);

const BOOKING_ENDPOINTS = {
  user: (userId: string, date: string) => `/public/bookings/user/${userId}?date=${date}`,
  team: (teamId: string, date: string) => `/public/bookings/team/${teamId}?date=${date}`,
  deal: (dealId: string, date: string) => `/public/bookings/deal/${dealId}?date=${date}`,
};

export function convertDayToUTCString(date: dayjs.Dayjs | null): string | null {
  if (!date) return null;

  return date.utc().startOf('D').toISOString();
}

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

export type BookingSlotHookProps<T extends Slot> = SWRResponse<
  T[],
  Exception,
  SWRConfiguration<Slot[]>
> & {
  onConfirm: (slot: T) => void;
};
