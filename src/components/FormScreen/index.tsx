import { forwardRef, useState, useCallback } from 'react';
import { Box, Divider } from '@mui/material';

import { PublicRouting, RouteResult, RoutingOutcomeType } from '../../api/routing/types';
import { handleRouting } from '../../api/routing';

import { InjectLeadContext, useInjectLead } from '../../api/deals/hooks';

import { useWidgetStateContext } from '../../state';

import PersonalInfoForm from './PersonalInfoForm';
import RoutingResultForm from './RoutingResultForm';

import { FormValues, FormScreenStatus, PersonalInfoFormStatus } from './types';

function convertFormAnswersToRoutingParams(
  answers: Record<number, number>
): { questionId: number; answerId: number }[] {
  return Object.entries(answers)
    .filter((entry) => entry[1] > 0) // Filter out answers that are not selected
    .map(([questionId, answerId]) => ({
      questionId: parseInt(questionId, 10),
      answerId,
    }));
}

const FormScreen = forwardRef<HTMLDivElement, { routing: PublicRouting; productId?: string }>(
  ({ routing, productId }, ref) => {
    const [, onError] = useWidgetStateContext();

    const [status, setStatus] = useState<FormScreenStatus>('personal-info');
    // This stores the furthest stage the user has reached in the personal info form. Once a stage is reached, the user can't go back to a previous stage.
    // Basically, we don't want to hide the name, phone, or questions once they are visible.
    const [personalInfoFormStatus, setPersonalInfoFormStatus] = useState<PersonalInfoFormStatus[]>([
      'initial',
    ]);

    // This is called here so that the returned lead data isn't lost when the user moves to the calendar form.
    const injectLead = useInjectLead(routing.uuid, productId, onError);

    const [formValues, setFormValues] = useState<FormValues | null>(null);
    const [routeResult, setRouteResult] = useState<RouteResult | null>(null);

    const moveToCalendar = useCallback(
      async (values: FormValues) => {
        setFormValues(values);

        try {
          const result = await handleRouting({
            routingId: routing.uuid,
            email: values.email,
            answers: convertFormAnswersToRoutingParams(values.answers),
          });

          setRouteResult(result);
          setStatus('calendar');
        } catch (e) {
          onError(e as Error);
        }
      },
      [onError, routing.uuid]
    );

    const moveToPersonalInfo = useCallback(() => {
      setStatus('personal-info');
    }, []);

    return (
      <Box
        ref={ref}
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          height: 1,
          overflow: 'hidden',
          '& > .MuiBox-root': {
            overflow: 'auto',
          },
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
          <Divider orientation="vertical" />
          <RoutingResultForm
            routing={routing}
            productId={productId}
            routeResult={routeResult}
            formValues={formValues}
            disabled={status === 'personal-info'}
          />
        </InjectLeadContext.Provider>
      </Box>
    );
  }
);

FormScreen.displayName = 'FormScreen';

export default FormScreen;
