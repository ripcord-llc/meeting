/* eslint-disable react/no-unused-prop-types */
import { useState, useEffect, useMemo } from 'react';
import { LoadingButton } from '@mui/lab';
import { Stack, Box, Typography, Button, InputAdornment, Collapse, Fade } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  EmailSchema,
  NameSchema,
  PhoneNumberSchema,
  URLSchema,
  useInjectLeadContext,
  useValidatedLeadInjectionValues,
} from '../../api/deals/actions';

import TextField from '../form/TextField';
import RadioGroup from '../form/RadioGroup';
import { PhoneInput } from '../form/phone-input';

import { PublicRouting } from '../../api/routing/types';

import FieldWrapper from '../form/FieldWrapper';

import { FormValues, PersonalInfoFormStatus } from './types';

interface Props {
  routing: PublicRouting;
  productId?: string;
  disabled: boolean;
  status: PersonalInfoFormStatus[];
  setStatus: React.Dispatch<React.SetStateAction<PersonalInfoFormStatus[]>>;
  onSubmit: (values: FormValues) => Promise<void>;
  onGoBack: () => void;
  formValues: FormValues | null;
}

// TODO: Make sure latest enrichment data is fetched (maybe polled) when the client changes the url

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

export default function PersonalInfoForm(props: Props) {
  const { disabled } = props;

  return (
    <Box
      sx={{
        p: 4,
        height: '100%',
        overflow: 'auto',
      }}
    >
      {disabled ? <StaticState {...props} /> : <FormState {...props} />}
    </Box>
  );
}

function FormState({ routing, productId, onSubmit, formValues, status, setStatus }: Props) {
  const { uuid: routingId, account, questions } = routing;

  const { inject, data, flush, isProcessing } = useInjectLeadContext();

  const allFieldsVisibleOnce = status.includes('all-fields');
  const questionsVisibleOnce = status.includes('questions');

  // If client has enrichment data, only show questions that are always visible
  const visibleQuestions = useMemo(() => {
    if (!data?.client?.hasEnrichmentData) return questions;

    return questions.filter((q) => q.alwaysVisible);
  }, [questions, data]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        email: EmailSchema,
        name: NameSchema,
        phone: PhoneNumberSchema,
        url: URLSchema,
        ...(visibleQuestions.length && {
          answers: yup.object().shape(
            visibleQuestions.reduce(
              (acc, q) => {
                acc[q.id] = yup.number().min(0, 'Required').required('Required');

                return acc;
              },
              {} as Record<number, yup.AnySchema>
            )
          ),
        }),
      }),
    [visibleQuestions]
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      email: formValues?.email || '',
      name: formValues?.name || '',
      phone: formValues?.phone || '',
      url: formValues?.url ? formValues.url.replace(/^https?:\/\//, '') : '',
      answers:
        formValues?.answers ||
        questions.reduce(
          (acc, q) => {
            acc[q.id] = -1;
            return acc;
          },
          {} as Record<number, number>
        ),
    },
    resolver: yupResolver(schema) as any,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onBlur = () => {
    flush(); // Run latest call to injectLead when input fields are blurred. This flushes the debounced function.
  };

  const [email, name, phone, url] = watch(['email', 'name', 'phone', 'url']);

  const validated = useValidatedLeadInjectionValues(email, name, phone, url);

  useEffect(() => {
    if (validated.email) {
      inject({
        email: validated.email,
        ...(validated.name && { name: validated.name }), // Strip null values
        ...(validated.phone && { phone: validated.phone }),
        ...(validated.url && { url: validated.url }),
      });
    }
  }, [inject, routingId, validated.email, validated.name, validated.phone, validated.url]);

  const emailAndUrlEnteredAndValid = validated.email && validated.url;

  const questionsLoading = !!validated.phone && isProcessing;
  // Should only be visible if the phone number is valid, the injection has stopped processing, and the URL matches the client's URL
  // The goal is to give the Enrichment API time to process the data before showing the questions
  const questionsVisible =
    !!validated.phone && !isProcessing && validated.url === data?.client?.url;

  useEffect(() => {
    if (emailAndUrlEnteredAndValid && !allFieldsVisibleOnce) {
      setStatus((s) => [...s, 'all-fields']);
    }
  }, [setStatus, allFieldsVisibleOnce, emailAndUrlEnteredAndValid]);

  useEffect(() => {
    if (questionsVisible && !questionsVisibleOnce) {
      setStatus((s) => [...s, 'questions']);
    }
  }, [setStatus, questionsVisible, questionsVisibleOnce]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormHeader account={account} />
        <Stack gap={2} mt={3}>
          <FieldWrapper label="Email">
            <TextField name="email" fullWidth variant="outlined" onBlur={onBlur} />
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
              onBlur={onBlur}
            />
          </FieldWrapper>
          {(allFieldsVisibleOnce || emailAndUrlEnteredAndValid) && (
            <>
              <FieldWrapper label="Full Name">
                <TextField name="name" fullWidth variant="outlined" onBlur={onBlur} />
              </FieldWrapper>
              <FieldWrapper label="Cell Number">
                <PhoneInput name="phone" fullWidth variant="outlined" />
              </FieldWrapper>
            </>
          )}
          {!questionsVisibleOnce && questionsLoading && (
            <Fade in={questionsLoading} appear exit={false} timeout={750}>
              <Typography textAlign="center" variant="caption" color="text.secondary">
                Counting sheep...
              </Typography>
            </Fade>
          )}
          {(questionsVisibleOnce || questionsVisible) && (
            <Collapse in appear exit={false} timeout={750}>
              <Box>
                {visibleQuestions.map((q) => (
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
              </Box>
            </Collapse>
          )}
        </Stack>
        {(questionsVisibleOnce || questionsVisible) && (
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            fullWidth
            variant="outlined"
            color="inherit"
            sx={{ mt: 3 }}
          >
            Continue
          </LoadingButton>
        )}
      </form>
    </FormProvider>
  );
}

function StaticState({ onGoBack }: Props) {
  return (
    <Button variant="outlined" onClick={onGoBack} fullWidth>
      Edit
    </Button>
  );
}
