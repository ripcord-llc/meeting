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
import { CalendarPicker } from '@mui/x-date-pickers';

import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

import { BookingSlotHookProps } from '../../../api/bookings';
import { Slot } from '../../../api/bookings/types';

import TimezonePopover from '../../timezone-select/TimezonePopover';
import { TIMEZONE_LABELS } from '../../timezone-select/constants';
import { useTimezoneStateContext } from '../../timezone-select/TimezoneProvider';

dayjs.extend(utc);
dayjs.extend(tz);

export const StyledDateCalendar = styled(CalendarPicker<Dayjs>)(({ theme }) => ({
  margin: 0,
  width: '100%',
  height: 348,
  maxHeight: 348,

  '& .MuiDayPicker-weekDayLabel': {
    width: 48,
  },

  '& .MuiPickersDay-root': {
    width: 48,
    height: 48,
  },

  '& .MuiDayPicker-slideTransition': {
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
  date,
}: BookingSlotHookProps<T> & {
  date: dayjs.Dayjs;
}) {
  const [timezone] = useTimezoneStateContext();
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
      <Typography mt={3} variant="subtitle2" textAlign="center">
        No slots available
      </Typography>
    );

  return (
    <Stack mt={3} gap={1} position="relative">
      {slots.map((slot) => {
        const isSelected = slot === selected;

        const startOfDayInTz = date.tz(timezone, true);
        const startTimeInTz = dayjs(slot.startTime).tz(timezone);

        const formattedTime = startTimeInTz.format('h:mm A');
        const isDifferentDay = !startTimeInTz.isSame(startOfDayInTz, 'date');

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
              sx={{
                flexDirection: 'column',
                lineHeight: '1.2',
              }}
            >
              {formattedTime}
              {isDifferentDay && (
                <Typography variant="caption" color="text.secondary" display="block">
                  {startTimeInTz.format('ddd, MMM D')}
                </Typography>
              )}
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
  date: Dayjs | null;
  setDate: (date: Dayjs | null) => void;
}) {
  return (
    <>
      <Stack
        direction={{
          xs: 'column',
          md: 'row',
        }}
        justifyContent="space-between"
        alignItems="center"
        gap={0.5}
      >
        <Typography variant="subtitle2" textAlign="center">
          Select a Date
        </Typography>
        <TimezoneButton />
      </Stack>
      <StyledDateCalendar disablePast date={date} onChange={setDate} />
      {!!date && <TimeSlots {...rest} date={date} />}
    </>
  );
}

function TimezoneButton() {
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [timezone, setTimezone] = useTimezoneStateContext();

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        size="small"
        onClick={(e) => setOpen(e.currentTarget)}
      >
        {TIMEZONE_LABELS[timezone] ?? timezone}
      </Button>
      <TimezonePopover
        open={!!open}
        anchorEl={open}
        onClose={() => setOpen(null)}
        onChange={(value) => {
          setTimezone(value);
          setOpen(null);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      />
    </>
  );
}
