import { Stack, Box, Typography, Button } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { CONFIG } from '../../config';

import { RouteResult, RoutingOutcomeType } from '../../api/routing/types';
import { useInjectLead, useInjectLeadContext } from '../../api/deals/actions';

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
        <DateCalendar disablePast disabled />
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

function UserCalendarForm(props: { userId: string }) {
  return 'user calendar form';
}

function DealCalendarForm(props: { dealId: string }) {
  return 'deal calendar form';
}

function TeamCalendarForm(props: { teamId: string }) {
  return 'team calendar form';
}

function RecordedDemoLink({ productId }: { productId: string }) {
  return (
    <Stack p={4} flex={1} gap={2} justifyContent="center" alignItems="center">
      <Box>
        <Typography textAlign="center" variant="h5">
          Recorded Demo
        </Typography>
        <Typography textAlign="center" variant="body1" color="text.secondary">
          Watch a recorded demo of the product.
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

export default function RoutingResultForm({
  routeResult,
  disabled,
}: {
  routeResult: RouteResult | null;
  disabled: boolean;
}) {
  return <RecordedDemoLink productId="123" />;

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
