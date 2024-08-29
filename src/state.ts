import { useState, useContext, createContext, useCallback, useMemo } from 'react';

import { BookMeetingResponse } from './api/deals/types';
import { Exception } from './api/fetcher';

export type WidgetState =
  | {
      state: 'form';
    }
  | {
      state: 'error';
      error: string;
    }
  | {
      state: 'confirm';
      meeting: BookMeetingResponse;
    };

export function useWidgetState() {
  const [state, setState] = useState<WidgetState>({
    state: 'form',
  });

  const setError = useCallback((error: Error | string) => {
    let errorMessage = '';

    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Exception) {
      errorMessage = error.response
        ? `${error.response.error}: ${error.response.message}`
        : error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = 'An unknown error occurred';
    }

    setState({ state: 'error', error: errorMessage });
  }, []);

  const setConfirm = useCallback(
    (meeting: BookMeetingResponse) => setState({ state: 'confirm', meeting }),
    []
  );

  return useMemo(() => [state, setError, setConfirm] as const, [state, setError, setConfirm]);
}

export const WidgetStateContext = createContext<ReturnType<typeof useWidgetState> | null>(null);

export function useWidgetStateContext() {
  const context = useContext(WidgetStateContext);

  if (!context) {
    throw new Error('useWidgetStateContext must be used within a WidgetStateProvider');
  }

  return context;
}
