import { useState } from 'react';
import {
  Stack,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  styled,
  Skeleton,
  CircularProgress,
  alpha,
} from '@mui/material';
import { DateCalendar, PickerValidDate } from '@mui/x-date-pickers';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { CONFIG } from '../../../config';

import {
  BookingSlotHookProps,
  useUserSlots,
  convertDayToUTCString,
  useDealSlots,
  useTeamSlots,
} from '../../../api/bookings';
import { Slot } from '../../../api/bookings/types';

import { RouteResult, RoutingOutcomeType } from '../../../api/routing/types';
import { useInjectLeadContext } from '../../../api/deals/hooks';

import BaseCalendarForm, { StyledDateCalendar } from './CalendarForm';

dayjs.extend(utc);
dayjs.extend(timezone);

function UserCalendarForm({ userId }: { userId: string }) {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);

  const resp = useUserSlots(userId, convertDayToUTCString(date), {
    keepPreviousData: true,
  });

  const onConfirm = (slot: Slot) => {
    console.log('Confirming slot', slot);
  };

  return <BaseCalendarForm date={date} setDate={setDate} onConfirm={onConfirm} {...resp} />;
}

function DealCalendarForm({ dealId }: { dealId: string }) {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);

  const resp = useDealSlots(dealId, convertDayToUTCString(date), {
    keepPreviousData: true,
  });

  return (
    <BaseCalendarForm
      date={date}
      setDate={setDate}
      onConfirm={(slot) => console.log('Confirming slot', slot)}
      {...resp}
    />
  );
}

function TeamCalendarForm({ teamId }: { teamId: string }) {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);

  const resp = useTeamSlots(teamId, convertDayToUTCString(date), {
    keepPreviousData: true,
  });

  return (
    <BaseCalendarForm
      date={date}
      setDate={setDate}
      onConfirm={(slot) => console.log('Confirming slot', slot)}
      {...resp}
    />
  );
}

function RecordedDemoLink({ productId }: { productId: string }) {
  return (
    <Stack p={4} flex={1} gap={2} justifyContent="center" alignItems="center">
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
        href={`${CONFIG.CLIENT_URL}/d/${productId}`}
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

function DisabledState() {
  return (
    <Stack
      p={4}
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
        <StyledDateCalendar disablePast disabled />
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
        Please fill out the form to book a meeting with Cheese Corp.
      </Box>
    </Stack>
  );
}

export default function RoutingResultForm({
  routeResult,
  disabled,
}: {
  routeResult: RouteResult | null;
  disabled: boolean;
}) {
  const { data } = useInjectLeadContext();

  if (disabled || !routeResult) {
    return <DisabledState />;
  }

  if (data?.deal && data.deal.started && data.deal.userId) {
    // Show calendar with slots for user of existing deal;
    return <DealCalendarForm dealId={data.deal.uuid} />;
  }

  switch (routeResult.outcome) {
    case RoutingOutcomeType.RECORDING:
      return <RecordedDemoLink productId={routeResult.productId} />;
    case RoutingOutcomeType.TEAM:
      return <TeamCalendarForm teamId={routeResult.teamId} />;
    case RoutingOutcomeType.USER:
      return <UserCalendarForm userId={routeResult.userId} />;
    default:
      return null;
  }
}
