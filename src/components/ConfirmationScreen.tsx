import { Avatar, Box, Button, Divider, Paper, Stack, Typography, Link } from '@mui/material';

import { CreateMeetingResponse } from '../api/deals/types';

export default function ConfirmationScreen({ meeting }: { meeting: CreateMeetingResponse }) {
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            color="inherit"
            sx={{
              bgcolor: 'background.paper',
              color: 'text.primary',
            }}
          >
            Thanks, I see it
          </Button>
          <Button
            variant="contained"
            color="inherit"
            sx={{
              bgcolor: 'background.paper',
              color: 'text.primary',
            }}
          >
            Add to Calendar
          </Button>
        </Box>
      </Stack>
      <Paper variant="outlined" sx={{ p: 2, alignSelf: 'stretch' }}>
        <Stack gap={2} divider={<Divider flexItem />}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body2" color="text.secondary">
                You are meeting with
              </Typography>
              <Typography variant="h6">James Smith</Typography>
            </Box>
            <Avatar variant="rounded" sx={{ width: 48, height: 48 }} />
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">Time</Typography>
            <Typography variant="body1" color="text.secondary">
              Thursday, Sep 14th, 11:00AM-11:30AM EST
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">Link</Typography>
            <Link variant="body1" color="text.secondary">
              https://ripcord.io/m/123345
            </Link>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">Details</Typography>
            <Typography variant="body1" color="text.secondary">
              We sent you an email with your meeting details
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
