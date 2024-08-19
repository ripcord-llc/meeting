import { useEffect, useMemo, forwardRef } from 'react';
import { Stack, Box, Divider, Typography, Button, InputAdornment } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  EmailSchema,
  NameSchema,
  PhoneNumberSchema,
  URLSchema,
  useInjectLead,
} from '../../api/deals/actions';

import TextField from '../form/TextField';
import RadioGroup from '../form/RadioGroup';
import { PhoneInput } from '../form/phone-input';

import { PublicRouting } from '../../api/routing/types';

import FieldWrapper from '../form/FieldWrapper';

interface FormValues {
  email: string;
  name: string;
  phone: string;
  url: string;
  answers: Record<number, number>;
}

const FormScreen = forwardRef<HTMLDivElement, { routing: PublicRouting }>(({ routing }, ref) => {
  const { uuid: routingId, account, questions } = routing;

  const injectLead = useInjectLead();

  const { inject } = injectLead;

  const schema = useMemo(
    () =>
      yup.object().shape({
        email: EmailSchema,
        name: NameSchema,
        phone: PhoneNumberSchema,
        url: URLSchema,
        ...(questions.length && {
          answers: yup.object().shape(
            questions.reduce(
              (acc, q) => {
                acc[q.id] = yup.number().min(0, 'Required').required('Required');

                return acc;
              },
              {} as Record<number, yup.AnySchema>
            )
          ),
        }),
      }),
    [questions]
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      email: '',
      name: '',
      phone: '',
      url: '',
      answers: questions.reduce(
        (acc, q) => {
          acc[q.id] = -1;
          return acc;
        },
        {} as Record<number, number>
      ),
    },
    resolver: yupResolver(schema) as any,
  });

  const { watch, handleSubmit } = methods;

  const email = watch('email');
  const name = watch('name');
  const phone = watch('phone');
  const url = watch('url');

  useEffect(() => {
    if (email) {
      inject({
        email,
        name,
        phone,
        url,
        routingId,
      });
    }
  }, [inject, routingId, email, name, phone, url]);

  const emailAndUrlEnteredAndValid = useMemo(() => {
    if (!email || !url) return false;

    try {
      EmailSchema.validateSync(email);
      URLSchema.validateSync(url);

      return true;
    } catch {
      return false;
    }
  }, [email, url]);

  return (
    <Box
      ref={ref}
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
      }}
    >
      <Box
        sx={{
          p: 4,
          height: '100%',
          overflow: 'auto',
        }}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(console.log)}>
            <FormHeader account={account} />
            <Stack gap={2} mt={3}>
              <FieldWrapper label="Email">
                <TextField name="email" fullWidth variant="outlined" />
              </FieldWrapper>
              <FieldWrapper label="Company Website">
                <TextField
                  name="url"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 0 }}>
                        https://
                      </InputAdornment>
                    ),
                  }}
                />
              </FieldWrapper>
              {emailAndUrlEnteredAndValid && (
                <>
                  <FieldWrapper label="Full Name">
                    <TextField name="name" fullWidth variant="outlined" />
                  </FieldWrapper>
                  <FieldWrapper label="Cell Number">
                    <PhoneInput name="phone" fullWidth variant="outlined" />
                  </FieldWrapper>
                  {questions.map((q) => (
                    <FieldWrapper key={q.id} label={q.question}>
                      <RadioGroup
                        name={`answers.${q.id}`}
                        options={q.answers.map((a) => ({
                          label: a.answer,
                          value: a.id,
                        }))}
                      />
                    </FieldWrapper>
                  ))}
                </>
              )}
            </Stack>
            {emailAndUrlEnteredAndValid && (
              <Button type="submit" fullWidth variant="outlined" color="inherit" sx={{ mt: 3 }}>
                Continue
              </Button>
            )}
          </form>
        </FormProvider>
      </Box>
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
});

function FormHeader({ account }: { account: PublicRouting['account'] }) {
  return (
    <>
      <Typography variant="h5">Book a Meeting</Typography>
      <Typography variant="body1" color="text.secondary">
        Schedule a demo with {account.name} now.
      </Typography>
    </>
  );
}

FormScreen.displayName = 'FormScreen';

export default FormScreen;
