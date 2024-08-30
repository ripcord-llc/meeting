import { useCallback, useState } from 'react';
import { Stack, Box, Typography, Button, useMediaQuery, Theme } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { CONFIG } from '../../../config';

import RecordedDemoIllustration from '../../illustrations/RecordedDemoIllustration';

import {
  useUserSlots,
  convertDayToUTCString,
  useDealSlots,
  useTeamSlots,
} from '../../../api/bookings';
import { Slot, TeamSlot } from '../../../api/bookings/types';

import {
  bookMeetingIntoExistingDeal,
  bookMeetingIntoLatestNonStartedDeal,
  bookMeetingIntoProduct,
} from '../../../api/deals/actions';

import { PublicRouting, RouteResult, RoutingOutcomeType } from '../../../api/routing/types';
import { useInjectLeadContext } from '../../../api/deals/hooks';

import BaseCalendarForm, { StyledDateCalendar } from './CalendarForm';
import { useWidgetStateContext } from '../../../state';

import { FormValues } from '../types';
import { BookingParams } from '../../../api/deals/types';

dayjs.extend(utc);
dayjs.extend(timezone);

type CalendarFormProps = {
  onSubmit: (booking: BookingParams) => Promise<void>;
  loading: boolean;
};

function UserCalendarForm({ userId, onSubmit, loading }: { userId: string } & CalendarFormProps) {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);

  const resp = useUserSlots(userId, convertDayToUTCString(date), {
    keepPreviousData: true,
  });

  const onConfirm = useCallback(
    async (slot: Slot) => {
      await onSubmit({
        type: 'user',
        userId,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    },
    [userId, onSubmit]
  );

  return (
    <BaseCalendarForm
      date={date}
      setDate={setDate}
      onConfirm={onConfirm}
      loading={loading}
      {...resp}
    />
  );
}

function DealCalendarForm({
  dealId,
  onSubmit,
  loading,
}: {
  dealId: string;
  loading: boolean;
  onSubmit: (slot: { startTime: Date; endTime: Date }) => Promise<void>;
}) {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);

  const resp = useDealSlots(dealId, convertDayToUTCString(date), {
    keepPreviousData: true,
  });

  const onConfirm = useCallback(
    async (slot: Slot) => {
      await onSubmit({
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    },
    [onSubmit]
  );

  return (
    <BaseCalendarForm
      date={date}
      setDate={setDate}
      onConfirm={onConfirm}
      loading={loading}
      {...resp}
    />
  );
}

function TeamCalendarForm({ teamId, onSubmit, loading }: { teamId: string } & CalendarFormProps) {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);

  const resp = useTeamSlots(teamId, convertDayToUTCString(date), {
    keepPreviousData: true,
  });

  const onConfirm = useCallback(
    async (slot: TeamSlot) => {
      await onSubmit({
        type: 'team',
        teamId,
        ...slot,
      });
    },
    [teamId, onSubmit]
  );

  return (
    <BaseCalendarForm
      date={date}
      setDate={setDate}
      onConfirm={onConfirm}
      loading={loading}
      {...resp}
    />
  );
}

function RecordedDemoLink({ productId }: { productId: string }) {
  return (
    <Stack p={4} flex={1} gap={2} justifyContent="center" alignItems="center">
      <RecordedDemoIllustration sx={{ width: 200 }} />
      <Box>
        <Typography textAlign="center" variant="h5">
          Watch our demo now!
        </Typography>
        <Typography textAlign="center" variant="body1" color="text.secondary">
          You&apos;ve qualified to watch an immediate recorded demo of our product. If any questions
          come up, our team will be there to answer.
        </Typography>
      </Box>
      <Button
        href={`${CONFIG.CLIENT_URL}/p/${productId}`}
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
        color="inherit"
        startIcon={<OpenInNewIcon />}
      >
        Watch Demo
      </Button>
    </Stack>
  );
}

function ExistingDealLink({ dealId }: { dealId: string }) {
  return (
    <Stack p={4} flex={1} gap={2} justifyContent="center" alignItems="center">
      <RecordedDemoIllustration sx={{ width: 200 }} />
      <Box>
        <Typography textAlign="center" variant="h5">
          View your progress!
        </Typography>
        <Typography textAlign="center" variant="body1" color="text.secondary">
          Looks like you&apos;re already working on a deal with us. Click below to view your
          progress.
        </Typography>
      </Box>
      <Button
        href={`${CONFIG.CLIENT_URL}/d/${dealId}`}
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
        color="inherit"
        startIcon={<OpenInNewIcon />}
      >
        Watch Demo
      </Button>
    </Stack>
  );
}

function DisabledState({ routing }: { routing: PublicRouting }) {
  return (
    <Stack
      flex={1}
      justifyContent="center"
      sx={{
        position: 'relative',
      }}
    >
      <Box sx={{ opacity: 0.7 }}>
        <Typography variant="subtitle2" textAlign="center">
          Select a Date
        </Typography>
        <StyledDateCalendar date={dayjs()} onChange={() => {}} disablePast disabled />
      </Box>
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: theme.shadows[4],
        })}
      >
        Please fill out the form to book a meeting with {routing.account.name}
      </Box>
    </Stack>
  );
}

interface Props {
  routing: PublicRouting;
  routeResult: RouteResult | null;
  formValues: FormValues | null;
  disabled: boolean;
  productId?: string;
}

function RoutingResultFormInner({ routing, productId, routeResult, formValues, disabled }: Props) {
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

  const [, , setConfirm] = useWidgetStateContext();

  const { data } = useInjectLeadContext();

  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    async (booking: BookingParams) => {
      setLoading(true);

      try {
        if (!formValues || !routeResult) return;

        const { email, name, phone, url } = formValues;

        if (productId) {
          const meeting = await bookMeetingIntoProduct({
            email,
            productId,
            booking,
            name,
            phone,
            url,
          });

          setConfirm({ meeting, formValues: { email, name, phone, url } });
          return;
        }

        const { productId: routedProductId } = routeResult;

        const meeting = await bookMeetingIntoLatestNonStartedDeal({
          email,
          productId: routedProductId,
          booking,
          name,
          phone,
          url,
        });

        setConfirm({ meeting, formValues: { email, name, phone, url } });
      } catch (e) {
        console.error('Error booking meeting', e);
      } finally {
        setLoading(false);
      }
    },
    [formValues, routeResult, productId, setConfirm]
  );

  const onDealSubmit = useCallback(
    async (slot: { startTime: Date; endTime: Date }) => {
      if (!formValues || !data?.deal) return;

      const { email, name, phone, url } = formValues;

      setLoading(true);

      try {
        const meeting = await bookMeetingIntoExistingDeal({
          dealId: data?.deal?.uuid,
          event: slot,
          email,
          name,
          phone,
          url,
        });

        setConfirm({ meeting, formValues: { email, name, phone, url } });
      } catch (e) {
        console.error('Error booking meeting', e);
      }
    },
    [formValues, data?.deal, setConfirm]
  );

  if (disabled) {
    if (isMobile) return null;

    return <DisabledState routing={routing} />;
  }

  if (data?.deal && data.deal.started) {
    if (!data.deal.primaryUserId) return <ExistingDealLink dealId={data.deal.uuid} />; // If deal is started but no user assigned, show link to deal;

    // Show calendar with slots for user of existing deal;
    return <DealCalendarForm dealId={data.deal.uuid} onSubmit={onDealSubmit} loading={loading} />;
  }

  switch (routeResult?.outcome) {
    case undefined:
    case null:
      return <DisabledState routing={routing} />;
    case RoutingOutcomeType.RECORDING:
      return <RecordedDemoLink productId={routeResult.productId} />;
    case RoutingOutcomeType.TEAM:
      return <TeamCalendarForm teamId={routeResult.teamId} onSubmit={onSubmit} loading={loading} />;
    case RoutingOutcomeType.USER:
      return <UserCalendarForm userId={routeResult.userId} onSubmit={onSubmit} loading={loading} />;
    default:
      return null;
  }
}

export default function RoutingResultForm({
  onGoBack,
  ...rest
}: Props & {
  onGoBack: () => void;
}) {
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

  return (
    <Box position="relative">
      {isMobile && (
        <Button onClick={onGoBack} color="inherit" startIcon={<ChevronLeftIcon />}>
          Go Back
        </Button>
      )}
      <RoutingResultFormInner {...rest} />
    </Box>
  );
}
