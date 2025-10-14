'use client';

import { StrictMode } from 'react';
import { Fade, Stack, Avatar, Typography } from '@mui/material';

import Dialog, { DialogInline } from './components/dialog/Dialog';

import FormScreen from './components/FormScreen';
import ErrorScreen from './components/ErrorScreen';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import ConfirmationScreen from './components/ConfirmationScreen';

import { TimezoneStateProvider } from './components/timezone-select/TimezoneProvider';

import { usePublicRouting } from './api/routing';

import { ConfigurationProvider } from './config';

import { useWidgetState, WidgetStateContext } from './state';

interface BookingProps {
  routingId: string;
  productId?: string;
}

export interface BookingWidgetProps extends BookingProps {
  open: boolean;
  onClose: () => void;
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
        <ConfirmationScreen {...state} contactEmail={state.formValues.email} />
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

function BookingInline({ routingId, productId }: BookingProps) {
  const widgetState = useWidgetState();

  const [state] = widgetState;

  const { data, isLoading, error } = usePublicRouting(routingId);

  if (isLoading) {
    return (
      <DialogInline sx={{ maxWidth: 'sm' }}>
        <LoadingScreen />
      </DialogInline>
    );
  }

  if (!data || error || state.state === 'error') {
    const message =
      state.state === 'error' ? state.error : error?.response?.message || error?.message;

    return (
      <DialogInline sx={{ maxWidth: 'sm' }}>
        <ErrorScreen error={message} />
      </DialogInline>
    );
  }

  if (state.state === 'confirm') {
    return (
      <DialogInline sx={{ maxWidth: 'sm' }} enableConfirmedDesign>
        <ConfirmationScreen {...state} contactEmail={state.formValues.email} />
      </DialogInline>
    );
  }

  return (
    <DialogInline
      sx={{ maxWidth: 'md' }}
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
    </DialogInline>
  );
}

function Main(props: BookingWidgetProps) {
  return (
    <StrictMode>
      <ConfigurationProvider>
        <ErrorBoundary {...props}>
          <TimezoneStateProvider>
            <BookingWidget {...props} />
          </TimezoneStateProvider>
        </ErrorBoundary>
      </ConfigurationProvider>
    </StrictMode>
  );
}

export function MainInline(props: BookingProps) {
  return (
    <StrictMode>
      <ConfigurationProvider>
        <TimezoneStateProvider>
          <BookingInline {...props} />
        </TimezoneStateProvider>
      </ConfigurationProvider>
    </StrictMode>
  );
}

export default Main;
