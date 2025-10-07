'use client';

import 'altcha';
import { useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';

import { CONFIG } from '../../config';

import { UseAltchaProps } from './useAltcha';

const CHALLENGE_URL = `${CONFIG.API_URL}/altcha`;

const HIDDEN_STATES: AltchaState[] = ['unverified', 'verifying', 'verified'];

interface Props extends UseAltchaProps {}

const Altcha = ({ state, onStateChange }: Props) => {
  const theme = useTheme();
  const widgetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const { current: altcha } = widgetRef;

    if (!altcha) return () => {};

    const handler = (e: AltchaStateChangeEvent) => {
      const { detail } = e;

      if (!detail) return;

      onStateChange(detail);
    };

    altcha.addEventListener('statechange', handler as any);

    return () => {
      altcha.removeEventListener('statechange', handler as any);
    };
  }, [onStateChange]);

  const visible = !HIDDEN_STATES.includes(state);

  return (
    <Box
      sx={{
        display: visible ? 'block' : 'none',
      }}
    >
      <altcha-widget
        ref={widgetRef}
        auto="onload"
        challengeurl={CHALLENGE_URL}
        style={{
          '--altcha-color-base': theme.palette.background.neutral,
          '--altcha-color-border': theme.palette.divider,
          '--altcha-color-text': theme.palette.text.primary,
          '--altcha-color-error-text': theme.palette.error.main,
          '--altcha-max-width': '100%',
        }}
      />
    </Box>
  );
};

export default Altcha;
