import { useState } from 'react';
import { Stack, Box, Typography, Button, Select, MenuItem, styled } from '@mui/material';
import {
  DateCalendar,
  PickerValidDate,
  PickersCalendarHeader,
  PickersCalendarHeaderProps,
} from '@mui/x-date-pickers';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import dayjs from 'dayjs';

import { CONFIG } from '../../config';

import { RouteResult, RoutingOutcomeType } from '../../api/routing/types';
import { useInjectLeadContext } from '../../api/deals/actions';

const StyledDateCalendar = styled(DateCalendar)(({ theme }) => ({
  margin: 0,
  width: '100%',
  height: 348,
  maxHeight: 348,

  '& .MuiDayCalendar-weekDayLabel': {
    width: 48,
  },

  '& .MuiPickersDay-root': {
    width: 48,
    height: 48,
  },

  '& .MuiPickersSlideTransition-root': {
    minHeight: 252,
  },
}));

function TimeList({ times }: { times: { startTime: string }[] }) {
  const [selected, setSelected] = useState<{ startTime: string } | null>(null);

  return (
    <Stack mt={3} gap={1}>
      {times.map((time) => {
        const isSelected = time === selected;

        return (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1,

              '& .MuiButton-root': {
                '&:nth-child(1)': {
                  gridColumn: 'span 2',
                },

                '&:only-child': {
                  gridColumn: 'span 3',
                },
              },
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              fullWidth
              onClick={() => setSelected(isSelected ? null : time)}
            >
              {dayjs(time.startTime).format('h:mm A')}
            </Button>
            {isSelected && (
              <Button variant="outlined" color="primary" size="large" fullWidth>
                Confirm
              </Button>
            )}
          </Box>
        );
      })}
    </Stack>
  );
}

function UserCalendarForm({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Box p={4}>
      <Typography variant="subtitle2" textAlign="center">
        Select a Date
      </Typography>
      <StyledDateCalendar disablePast />
      <TimeList
        times={[...new Array(20).keys()].map((key) => ({
          startTime: dayjs()
            .startOf('hour')
            .add(key * 30, 'minute')
            .toJSON(),
        }))}
      />
    </Box>
  );
}

function DealCalendarForm({ dealId }: { dealId: string }) {
  return (
    <Box p={4}>
      <Typography variant="subtitle2" textAlign="center">
        Select a Date
      </Typography>
      <StyledDateCalendar disablePast />
      <TimeList
        times={[...new Array(20).keys()].map((key) => ({
          startTime: dayjs()
            .startOf('hour')
            .add(key * 30, 'minute')
            .toJSON(),
        }))}
      />
    </Box>
  );
}

function TeamCalendarForm({ teamId }: { teamId: string }) {
  return (
    <Box p={4}>
      <Typography variant="subtitle2" textAlign="center">
        Select a Date
      </Typography>
      <StyledDateCalendar disablePast />
      <TimeList
        times={[...new Array(20).keys()].map((key) => ({
          startTime: dayjs()
            .startOf('hour')
            .add(key * 30, 'minute')
            .toJSON(),
        }))}
      />
    </Box>
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
