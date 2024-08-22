'use client';

import { useState } from 'react';
import { Fade, Stack, Avatar, Typography } from '@mui/material';

import Dialog from './components/dialog/Dialog';

import ErrorScreen from './components/ErrorScreen';
import LoadingScreen from './components/LoadingScreen';
import FormScreen from './components/FormScreen';

import { usePublicRouting } from './api/routing';

import { ConfigurationProvider } from './config';

import ErrorBoundary, { ErrorHandlerContext } from './components/ErrorBoundary';

export interface BookingWidgetProps {
  open: boolean;
  onClose: () => void;
  routingId: string;
  productId?: string;
  widgetKey: string; // This is used to force a re-render of the widget when the key changes
}

function BookingWidget({ open, onClose, routingId, productId, widgetKey }: BookingWidgetProps) {
  const [globalError, setGlobalError] = useState<Error | null>(null);

  const { data, isLoading, error } = usePublicRouting(routingId);

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm">
        <LoadingScreen />
      </Dialog>
    );
  }

  if (!data || error || globalError) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm">
        <ErrorScreen error={error?.response?.message || error?.message} />
      </Dialog>
    );
  }

  return (
    <ErrorHandlerContext.Provider value={setGlobalError}>
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
          <FormScreen routing={data} productId={productId} />
        </Fade>
      </Dialog>
    </ErrorHandlerContext.Provider>
  );
}

export default function Main(props: BookingWidgetProps) {
  const { widgetKey } = props;

  return (
    <ConfigurationProvider>
      <ErrorBoundary {...props}>
        <BookingWidget key={widgetKey} {...props} />
      </ErrorBoundary>
    </ConfigurationProvider>
  );
}
