import { Box, Stack, Typography, Button, InputAdornment } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  EmailSchema,
  NameSchema,
  PhoneNumberSchema,
  URLSchema,
} from "../../api/deals/actions";

import TextField from "../form/TextField";
import RadioGroup from "../form/RadioGroup";

import { PublicRouting } from "../../api/routing/types";

import FieldWrapper from "../form/FieldWrapper";
import { useMemo } from "react";

interface FormValues {
  email: string;
  name: string;
  phone: string;
  url: string;
  answers: Record<number, number>;
}

export default function PersonalInfoForm({
  routing,
}: {
  routing: PublicRouting;
}) {
  const { account, questions } = routing;

  const schema = useMemo(
    () =>
      yup.object().shape({
        email: EmailSchema,
        name: NameSchema,
        phone: PhoneNumberSchema,
        url: URLSchema,
        ...(questions.length && {
          answers: yup.object().shape(
            questions.reduce((acc, q) => {
              acc[q.id] = yup.number().min(0, "Required").required("Required");

              return acc;
            }, {} as Record<number, yup.AnySchema>)
          ),
        }),
      }),
    [questions]
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      url: "",
      answers: questions.reduce((acc, q) => {
        acc[q.id] = -1;
        return acc;
      }, {} as Record<number, number>),
    },
    resolver: yupResolver(schema) as any,
  });

  const { watch, handleSubmit } = methods;

  // const email = watch("email");
  // const name = watch("name");
  // const phone = watch("phone");
  // const url = watch("url");

  return (
    <Box
      sx={{
        p: 4,
        height: "100%",
        overflow: "auto",
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
            <FieldWrapper label="Full Name">
              <TextField name="name" fullWidth variant="outlined" />
            </FieldWrapper>
            <FieldWrapper label="Cell Number">
              <TextField name="phone" fullWidth variant="outlined" />
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
          </Stack>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            color="inherit"
            sx={{ mt: 3 }}
          >
            Continue
          </Button>
        </form>
      </FormProvider>
    </Box>
  );
}

function FormHeader({ account }: { account: PublicRouting["account"] }) {
  return (
    <>
      <Typography variant="h5">Book a Meeting</Typography>
      <Typography variant="body1" color="text.secondary">
        Schedule a demo with {account.name} now.
      </Typography>
    </>
  );
}
