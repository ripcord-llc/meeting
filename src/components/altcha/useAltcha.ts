import { useState, useCallback, useMemo } from 'react';

export interface UseAltchaProps {
  state: AltchaState;
  payload: string | null;
  onStateChange: (data: { state: AltchaState; payload?: string }) => void;
}

export default function useAltcha(): UseAltchaProps {
  const [state, setState] = useState<AltchaState>('unverified');
  const [payload, setPayload] = useState<string | null>(null);

  const onStateChange = useCallback((data: { state: AltchaState; payload?: string }) => {
    setState(data.state);

    if (data.state === 'verified' && data.payload) setPayload(data.payload);
  }, []);

  return useMemo(
    () => ({ state, setState, payload, setPayload, onStateChange }),
    [state, setState, payload, setPayload, onStateChange]
  );
}
