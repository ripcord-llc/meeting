import { Stack, Typography } from '@mui/material';

import { CreateMeetingResponse } from '../api/deals/types';

export default function ConfirmationScreen({ meeting }: { meeting: CreateMeetingResponse }) {
  return (
    <Stack spacing={2} p={4}>
      <Typography variant="h5">Meeting Scheduled</Typography>
      <Typography variant="body1">Your meeting has been scheduled</Typography>
    </Stack>
  );
}
