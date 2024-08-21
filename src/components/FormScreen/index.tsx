import { forwardRef, useState, useCallback } from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';

import { PublicRouting } from '../../api/routing/types';

import PersonalInfoForm from './PersonalInfoForm';

import { FormValues, FormScreenStatus } from './types';

const FormScreen = forwardRef<HTMLDivElement, { routing: PublicRouting; productId?: string }>(
  ({ routing, productId }, ref) => {
    const [status, setStatus] = useState<FormScreenStatus>('personal-info');
    const [formValues, setFormValues] = useState<FormValues | null>(null);

    const moveToCalendar = useCallback(async (values: FormValues) => {
      setFormValues(values);
      setStatus('calendar');
    }, []);

    const moveToPersonalInfo = useCallback(() => {
      setStatus('personal-info');
      setFormValues(null);
    }, []);

    return (
      <Box
        ref={ref}
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
        }}
      >
        <PersonalInfoForm
          routing={routing}
          productId={productId}
          status={status}
          onSubmit={moveToCalendar}
          onGoBack={moveToPersonalInfo}
          formValues={formValues}
        />
        <Divider orientation="vertical" />
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
              bgcolor: 'common.white',
              borderRadius: 1,
              boxShadow: theme.shadows[4],
            })}
          >
            Please fill out the form to book a meeting with Cheese Corp.
          </Box>
        </Stack>
      </Box>
    );
  }
);

FormScreen.displayName = 'FormScreen';

export default FormScreen;
