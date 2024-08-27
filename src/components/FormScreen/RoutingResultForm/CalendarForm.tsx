import { useState } from 'react';
import {
  Stack,
  Box,
  Typography,
  Button,
  styled,
  Skeleton,
  CircularProgress,
  alpha,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DateCalendar, PickerValidDate } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { BookingSlotHookProps } from '../../../api/bookings';
import { Slot } from '../../../api/bookings/types';

dayjs.extend(utc);
dayjs.extend(timezone);

export const StyledDateCalendar = styled(DateCalendar)(({ theme }) => ({
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

function TimeSlotsSkeleton() {
  return (
    <Stack mt={3} gap={1}>
      {[...new Array(3).keys()].map((_, index) => (
        <Skeleton key={index} variant="rounded" height={48} />
      ))}
    </Stack>
  );
}

function TimeSlots<T extends Slot>({
  data,
  isLoading,
  error,
  loading,
  onConfirm,
}: BookingSlotHookProps<T>) {
  const [selected, setSelected] = useState<Slot | null>(null);

  const slots = data || [];
  const isLoadingFirst = !data && isLoading;
  const isLoadingMore = data && isLoading;

  if (isLoadingFirst) return <TimeSlotsSkeleton />;

  if (error) {
    return (
      <Typography mt={3} variant="subtitle2" textAlign="center" color="error.main">
        Error loading slots
      </Typography>
    );
  }

  if (!data?.length)
    return (
      <Typography mt={3} variant="subtitle2">
        No slots available
      </Typography>
    );

  return (
    <Stack mt={3} gap={1} position="relative">
      {slots.map((slot) => {
        const isSelected = slot === selected;

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
              onClick={() => setSelected(isSelected ? null : slot)}
              disabled={isLoading}
            >
              {dayjs(slot.startTime).format('h:mm A')}
            </Button>
            {isSelected && (
              <LoadingButton
                loading={loading}
                variant="outlined"
                color="primary"
                size="large"
                fullWidth
                onClick={() => onConfirm(slot)}
              >
                Confirm
              </LoadingButton>
            )}
          </Box>
        );
      })}
      {isLoadingMore && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.5),
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
    </Stack>
  );
}

export default function BaseCalendarForm<T extends Slot>({
  date,
  setDate,
  ...rest
}: BookingSlotHookProps<T> & {
  date: PickerValidDate | null;
  setDate: (date: PickerValidDate) => void;
}) {
  return (
    <Box p={4}>
      <Typography variant="subtitle2" textAlign="center">
        Select a Date
      </Typography>
      <StyledDateCalendar disablePast value={date} onChange={setDate} />
      {!!date && <TimeSlots {...rest} />}
    </Box>
  );
}
