'use client';

import { Fade, Stack, Avatar, Typography } from '@mui/material';

import Dialog from './components/dialog/Dialog';

import ErrorScreen from './components/ErrorScreen';
import LoadingScreen from './components/LoadingScreen';
import FormScreen from './components/FormScreen';

import { usePublicRouting } from './api/routing';

import { ConfigurationProvider } from './config';

export interface BookingWidgetProps {
  open: boolean;
  onClose: () => void;
  routingId: string;
  productId?: string;
}

function BookingWidget({ open, onClose, routingId }: BookingWidgetProps) {
  const { data, isLoading, error } = usePublicRouting(routingId);

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm">
        <LoadingScreen />
      </Dialog>
    );
  }

  if (!data || error) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm">
        <ErrorScreen />
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      slots={{
        headerLeft: (
          <Stack direction="row" gap={1} alignItems="center">
            <Avatar
              src={data.account?.avatar?.fileUrl}
              sx={{
                width: 32,
                height: 32,
              }}
            />
            <Typography variant="subtitle2">{data.account.name}</Typography>
          </Stack>
        ),
      }}
    >
      <Fade in appear timeout={750}>
        <FormScreen routing={data} />
      </Fade>
    </Dialog>
  );
}

export default function Main(props: BookingWidgetProps) {
  return (
    <ConfigurationProvider>
      <BookingWidget {...props} />
    </ConfigurationProvider>
  );
}
