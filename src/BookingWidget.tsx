'use client';

import { StrictMode } from 'react';
import { Fade, Stack, Avatar, Typography } from '@mui/material';

import Dialog from './components/dialog/Dialog';

import FormScreen from './components/FormScreen';
import ErrorScreen from './components/ErrorScreen';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import ConfirmationScreen from './components/ConfirmationScreen';

import { usePublicRouting } from './api/routing';

import { ConfigurationProvider } from './config';

import { useWidgetState, WidgetStateContext } from './state';

export interface BookingWidgetProps {
  open: boolean;
  onClose: () => void;
  routingId: string;
  productId?: string;
}

function BookingWidget({ open, onClose, routingId, productId }: BookingWidgetProps) {
  const widgetState = useWidgetState();

  const [state] = widgetState;

  const { data, isLoading, error } = usePublicRouting(routingId);

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm">
        <LoadingScreen />
      </Dialog>
    );
  }

  if (!data || error || state.state === 'error') {
    const message =
      state.state === 'error' ? state.error : error?.response?.message || error?.message;

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm">
        <ErrorScreen error={message} />
      </Dialog>
    );
  }

  if (state.state === 'confirm') {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" enableConfirmedDesign>
        <ConfirmationScreen {...state} />
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
      <WidgetStateContext.Provider value={widgetState}>
        <Fade in appear timeout={750}>
          <FormScreen routing={data} productId={productId} />
        </Fade>
      </WidgetStateContext.Provider>
    </Dialog>
  );
}

export default function Main(props: BookingWidgetProps) {
  return (
    <StrictMode>
      <ConfigurationProvider>
        <ErrorBoundary {...props}>
          <BookingWidget {...props} />
        </ErrorBoundary>
      </ConfigurationProvider>
    </StrictMode>
  );
}
