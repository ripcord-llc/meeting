import { forwardRef, useState, useCallback } from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';

import { PublicRouting } from '../../api/routing/types';
import { InjectLeadContext, useInjectLead } from '../../api/deals/actions';

import { useErrorHandler } from '../ErrorBoundary';

import PersonalInfoForm from './PersonalInfoForm';

import { FormValues, FormScreenStatus, PersonalInfoFormStatus } from './types';

const FormScreen = forwardRef<HTMLDivElement, { routing: PublicRouting; productId?: string }>(
  ({ routing, productId }, ref) => {
    const errorHandler = useErrorHandler();

    const [status, setStatus] = useState<FormScreenStatus>('personal-info');

    // This is called here so that the returned lead data isn't lost when the user moves to the calendar form.
    const injectLead = useInjectLead(routing.uuid, productId, errorHandler);
    // This stores the furthest stage the user has reached in the personal info form. Once a stage is reached, the user can't go back to a previous stage.
    // Basically, we don't want to hide the name, phone, or questions once they are visible.
    const [personalInfoFormStatus, setPersonalInfoFormStatus] = useState<PersonalInfoFormStatus[]>([
      'initial',
    ]);

    const [formValues, setFormValues] = useState<FormValues | null>(null);

    const moveToCalendar = useCallback(async (values: FormValues) => {
      setFormValues(values);
      setStatus('calendar');
    }, []);

    const moveToPersonalInfo = useCallback(() => {
      setStatus('personal-info');
    }, []);

    return (
      <Box
        ref={ref}
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
        }}
      >
        <InjectLeadContext.Provider value={injectLead}>
          <PersonalInfoForm
            routing={routing}
            productId={productId}
            disabled={status === 'calendar'}
            status={personalInfoFormStatus}
            setStatus={setPersonalInfoFormStatus}
            onSubmit={moveToCalendar}
            onGoBack={moveToPersonalInfo}
            formValues={formValues}
          />
        </InjectLeadContext.Provider>
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
