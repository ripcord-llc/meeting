import { useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
  ButtonBase,
  alpha,
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LinkIcon from '@mui/icons-material/Link';
import NotesIcon from '@mui/icons-material/Notes';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';

import { BookMeetingResponse } from '../api/deals/types';

import useCopyToClipboard from '../hooks/useCopyToClipboard';

import { useTimezoneStateContext } from './timezone-select/TimezoneProvider';

import { parseEmailIntoEvent } from '../utils';

import { CONFIG } from '../config';

dayjs.extend(utc);
dayjs.extend(advancedFormat);
dayjs.extend(tz);

function makeEventLink(uuid: string): string {
  return `${CONFIG.CLIENT_URL}/m/${uuid}`;
}

function DetailsRow({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  text: React.ReactNode;
}) {
  return (
    <Box
      sx={(theme) => ({
        [theme.breakpoints.up('md')]: {
          display: 'grid',
          gridTemplateColumns: '150px 1fr',
          alignItems: 'center',
        },
      })}
    >
      <Stack
        direction="row"
        gap={1.5}
        alignItems="center"
        sx={(theme) => ({
          [theme.breakpoints.down('md')]: {
            marginBottom: theme.spacing(1),
          },
        })}
      >
        <Box
          sx={(theme) => ({
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2],

            '& svg': {
              width: 16,
              height: 16,
              display: 'block',
            },
          })}
        >
          {icon}
        </Box>
        <Typography variant="subtitle1">{label}</Typography>
      </Stack>
      {typeof text === 'string' ? (
        <Typography
          variant="body1"
          color="text.secondary"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {text}
        </Typography>
      ) : (
        text
      )}
    </Box>
  );
}

function UserDetailsRow({ user }: { user: BookMeetingResponse['user'] }) {
  const { name, avatar } = user;

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="body2" color="text.secondary">
          You are meeting with
        </Typography>
        <Typography variant="h6">{name}</Typography>
      </Box>
      <Avatar variant="rounded" sx={{ width: 48, height: 48 }} src={avatar?.fileUrl} />
    </Stack>
  );
}

function TimeRow({ startTime, endTime }: { startTime: string; endTime: string }) {
  const [timezone] = useTimezoneStateContext();

  const formattedStartTime = dayjs(startTime).tz(timezone).format('dddd, MMM D, h:mma');
  const formattedEndTime = dayjs(endTime).tz(timezone).format('h:mma (zzz)');

  return (
    <DetailsRow
      icon={<ScheduleIcon />}
      label="Time"
      text={`${formattedStartTime}-${formattedEndTime}`}
    />
  );
}

function LinkRow({ uuid }: { uuid: string }) {
  const { copied, copyToClipboard } = useCopyToClipboard();

  const link = makeEventLink(uuid);

  const onClick = () => {
    copyToClipboard(link);
  };

  return (
    <DetailsRow
      icon={<LinkIcon />}
      label="Link"
      text={
        <Box
          sx={{
            overflow: 'hidden',
          }}
        >
          <ButtonBase
            sx={(theme) => ({
              ...theme.typography.body1,
              width: 1,
              display: 'block',
              color: theme.palette.text.secondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              '&:hover': {
                textDecoration: 'underline',
              },
            })}
            onClick={onClick}
          >
            {link}
          </ButtonBase>
          {copied && (
            <Typography variant="caption" color="text.secondary" textAlign="center">
              Copied!
            </Typography>
          )}
        </Box>
      }
    />
  );
}

function AddToCalendarAlert({ email, response }: { email: string; response: BookMeetingResponse }) {
  const { event, meeting } = response;

  const { url, isICS } = useMemo(
    () =>
      parseEmailIntoEvent(email, {
        title: event.title,
        start: dayjs(event.startTime).toDate(),
        end: dayjs(event.endTime).toDate(),
        url: makeEventLink(meeting.uuid),
      }),
    [email, event, meeting]
  );

  return (
    <Stack
      sx={(theme) => ({
        gap: 2,
        p: 2,
        borderRadius: 1,
        alignSelf: 'stretch',
        bgcolor:
          theme.palette.mode === 'light'
            ? alpha(theme.palette.success.lighter, 0.7)
            : theme.palette.success.darker,
      })}
    >
      <Typography variant="body2" color="text.primary">
        A confirmation email is on its way to {email}. Please open it and add the event to your
        calendar. If that doesn&apos;t work, feel free to use the button below to add it manually.
      </Typography>
      <Button
        variant="contained"
        color="inherit"
        fullWidth
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          textTransform: 'none',
        }}
        startIcon={<OpenInNewIcon />}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        download={isICS ? 'event.ics' : undefined}
      >
        Add to Calendar
      </Button>
    </Stack>
  );
}

export default function ConfirmationScreen({
  meeting,
  contactEmail,
  confirmationMessage = 'Thank you! Your meeting has been scheduled',
}: {
  meeting: BookMeetingResponse;
  contactEmail: string;
  confirmationMessage?: string;
}) {
  const { event, user } = meeting;

  return (
    <Stack
      spacing={4}
      justifyContent="center"
      sx={(theme) => ({
        height: 1,
        py: 4,
        px: 6,
        [theme.breakpoints.down('md')]: {
          py: 2,
          px: 3,
        },
      })}
    >
      <Typography variant="h6" textAlign="center">
        🎉 {confirmationMessage} 🎉
      </Typography>
      <AddToCalendarAlert email={contactEmail} response={meeting} />
      <Paper variant="outlined" sx={{ p: 2, alignSelf: 'stretch' }}>
        <Stack gap={2} divider={<Divider flexItem />}>
          <UserDetailsRow user={user} />
          <TimeRow startTime={event.startTime} endTime={event.endTime} />
          <LinkRow uuid={meeting.meeting.uuid} />
          <DetailsRow
            icon={<NotesIcon />}
            label="Details"
            text="We sent you an email with your meeting details."
          />
        </Stack>
      </Paper>
    </Stack>
  );
}
