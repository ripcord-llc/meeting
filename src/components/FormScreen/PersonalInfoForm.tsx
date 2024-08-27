import { useEffect, useMemo } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Box,
  Typography,
  Button,
  InputAdornment,
  Collapse,
  Fade,
  useMediaQuery,
  Theme,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { parsePhoneNumber } from 'react-phone-number-input';

import { EmailSchema, NameSchema, PhoneNumberSchema, URLSchema } from '../../api/deals/actions';

import { useValidatedLeadInjectionValues, useInjectLeadContext } from '../../api/deals/hooks';

import TextField from '../form/TextField';
import RadioGroup from '../form/RadioGroup';
import { PhoneInput } from '../form/phone-input';

import { PublicRouting } from '../../api/routing/types';

import FieldWrapper from '../form/FieldWrapper';

import { FormValues, PersonalInfoFormStatus } from './types';

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

export default function PersonalInfoForm(props: {
  routing: PublicRouting;
  productId?: string;
  disabled: boolean;
  status: PersonalInfoFormStatus[];
  setStatus: React.Dispatch<React.SetStateAction<PersonalInfoFormStatus[]>>;
  onSubmit: (values: FormValues) => Promise<void>;
  onGoBack: () => void;
  formValues: FormValues | null;
}) {
  const { disabled } = props;

  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

  if (disabled && isMobile) return null;

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
      }}
    >
      {disabled ? <StaticState {...props} /> : <FormState {...props} />}
    </Box>
  );
}

function FormState({
  routing,
  onSubmit,
  formValues,
  status,
  setStatus,
}: {
  routing: PublicRouting;
  disabled: boolean;
  status: PersonalInfoFormStatus[];
  setStatus: React.Dispatch<React.SetStateAction<PersonalInfoFormStatus[]>>;
  onSubmit: (values: FormValues) => Promise<void>;
  onGoBack: () => void;
  formValues: FormValues | null;
}) {
  const { uuid: routingId, account, questions } = routing;

  const { inject, data, flush, isProcessing, calledWithAllData } = useInjectLeadContext();

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

  const validated = useValidatedLeadInjectionValues(...watch(['email', 'name', 'phone', 'url']));

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

  // Phone and name are only visible if the email and URL are valid
  useEffect(() => {
    if (emailAndUrlEnteredAndValid && !allFieldsVisibleOnce) {
      setStatus((s) => [...s, 'all-fields']);
    }
  }, [setStatus, allFieldsVisibleOnce, emailAndUrlEnteredAndValid]);

  const questionsLoading = !!validated.phone && isProcessing;
  // Should only be visible if the phone number is valid, the injection has stopped processing, and the URL matches the client's URL
  // The goal is to give the Enrichment API time to process the data before showing the questions
  const questionsVisible = calledWithAllData && !isProcessing; // !isProcessing is probably redundant

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
            <Collapse in appear={!formValues} exit={false} timeout={750}>
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

function StaticLine({ title, description }: { title: string; description: React.ReactNode }) {
  return (
    <Stack>
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="subtitle1">{description}</Typography>
    </Stack>
  );
}

function StaticState({
  onGoBack,
  formValues,
  routing,
}: {
  routing: PublicRouting;
  onGoBack: () => void;
  formValues: FormValues | null;
}) {
  const { questions } = routing;

  const listedAnswers = useMemo<{ question: string; answer: string }[]>(() => {
    if (!formValues?.answers) return [];

    const { answers } = formValues;

    return questions
      .map((q) => {
        const answer = q.answers.find((a) => a.id === answers[q.id]);
        return answer ? { question: q.question, answer: answer.answer } : null;
      })
      .filter((a) => a !== null) as { question: string; answer: string }[];
  }, [questions, formValues]);

  return (
    <Stack gap={3} height={1} justifyContent="space-between">
      <Typography variant="h5">Personal Info</Typography>
      <Stack gap={2}>
        <StaticLine title="Email" description={formValues?.email} />
        <StaticLine title="Name" description={formValues?.name} />
        <StaticLine
          title="Phone"
          description={
            parsePhoneNumber(formValues?.phone || '')?.formatNational() || formValues?.phone
          }
        />
        <StaticLine title="Company Website" description={formValues?.url} />
        {listedAnswers.map((a) => (
          <StaticLine key={a.question} title={a.question} description={a.answer} />
        ))}
      </Stack>
      <Button
        variant="outlined"
        onClick={onGoBack}
        fullWidth
        color="inherit"
        sx={{
          mt: 'auto',
        }}
      >
        Edit
      </Button>
    </Stack>
  );
}
