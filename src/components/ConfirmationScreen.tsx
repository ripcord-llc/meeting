import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
  Link,
  ButtonBase,
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LinkIcon from '@mui/icons-material/Link';
import NotesIcon from '@mui/icons-material/Notes';

import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

import { BookMeetingResponse } from '../api/deals/types';

import useCopyToClipboard from '../hooks/useCopyToClipboard';

import { CONFIG } from '../config';

dayjs.extend(advancedFormat);

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
        <Typography variant="body1" color="text.secondary">
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
  const formattedStartTime = dayjs(startTime).format('dddd, MMM D, h:mma');
  const formattedEndTime = dayjs(endTime).format('h:mma z');

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

  const link = `${CONFIG.CLIENT_URL}/m/${uuid}`;

  const onClick = () => {
    copyToClipboard(link);
  };

  return (
    <DetailsRow
      icon={<LinkIcon />}
      label="Link"
      text={
        <Box>
          <ButtonBase
            sx={(theme) => ({
              ...theme.typography.body1,
              display: 'block',
              color: theme.palette.text.secondary,
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

export default function ConfirmationScreen({
  meeting,
  formValues,
}: {
  meeting: BookMeetingResponse;
  formValues: { email: string; name: string; phone: string; url: string };
}) {
  const { event, user } = meeting;

  return (
    <Stack spacing={4} pt={2} px={4} pb={4}>
      <Typography variant="h6" textAlign="center">
        🎉 Thank you! You meeting has been scheduled 🎉
      </Typography>
      <Stack
        sx={(theme) => ({
          gap: 2,
          p: 2,
          borderRadius: 1,
          alignSelf: 'stretch',
          bgcolor:
            theme.palette.mode === 'light'
              ? theme.palette.success.lighter
              : theme.palette.success.darker,
        })}
      >
        <Box>
          <Typography
            variant="subtitle2"
            color={(theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.success.darker
                : theme.palette.success.lighter
            }
            textAlign="center"
          >
            An email has been sent with the booking details!
          </Typography>
          <Typography variant="body2" color="text.primary" textAlign="center">
            Did you see the email?
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="inherit"
          fullWidth
          sx={{
            bgcolor: 'background.paper',
            color: 'text.primary',
          }}
        >
          Add to Calendar
        </Button>
      </Stack>
      <Paper variant="outlined" sx={{ p: 2, alignSelf: 'stretch' }}>
        <Stack gap={2} divider={<Divider flexItem />}>
          <UserDetailsRow user={user} />
          <TimeRow startTime={event.startTime} endTime={event.endTime} />
          <LinkRow uuid={event.uuid} />
          <DetailsRow
            icon={<NotesIcon />}
            label="Details"
            text="We sent you an email with your meeting details"
          />
        </Stack>
      </Paper>
    </Stack>
  );
}
