/* eslint-disable no-template-curly-in-string */
import { useEffect, useState } from "react";
import isURL from "validator/es/lib/isURL";
import * as yup from "yup";

import useDebounced from "../../hooks/useDebounced";

import { post } from "../fetcher";

import { PUBLIC_DEALS_ENDPOINTS } from ".";

interface InjectLeadBody {
  email: string;
  name?: string;
  phone?: string;
  url?: string;
}

export const EmailSchema = yup.string().email().required("Required");
export const NameSchema = yup
  .string()
  .max(191, "Must be shorter than ${max}")
  .required("Required");
// export const PhoneNumberSchema = yup
//   .string()
//   .max(191, "Must be shorter than ${max}")
//   .phone()
//   .required("Required");
export const URLSchema = yup
  .string()
  .required("Required")
  .max(2083, "Must be shorter than ${max}")
  .test("is-url", "Must be a valid URL", (value) => !!value && isURL(value)); // Using isURL from validator.js to match server-side validation

async function validateAndConvertDataToInjectLeadBody(
  email: string,
  name: string,
  phone: string,
  url: string
): Promise<Partial<InjectLeadBody>> {
  const keys = ["email", "name", "phone", "url"] as const;

  const result = await Promise.allSettled([
    EmailSchema.validate(email),
    NameSchema.validate(name),
    // PhoneNumberSchema.validate(phone),
    URLSchema.validate(url),
  ]);

  const data = result.reduce((acc, curr, i) => {
    if (curr.status === "fulfilled") acc[keys[i]] = curr.value; // Promise will only be fulfilled if validation passes

    return acc;
  }, {} as Partial<InjectLeadBody>);

  return data;
}

async function injectLead(
  body: InjectLeadBody & {
    productId: string;
  }
): Promise<any> {
  const resp = await post<any>(PUBLIC_DEALS_ENDPOINTS.injectLead, body);

  return resp.data;
}

export function useInjectLead(
  productId: string,
  email: string,
  name: string,
  phone: string,
  url: string,
  active = true
) {
  // Debounced functions use same logic as those using useEffectEvent. This means the object reference stays the same, even if dependencies change.
  const handleSubmit = useDebounced(async () => {
    const data = await validateAndConvertDataToInjectLeadBody(
      email,
      name,
      phone,
      url
    );

    if (data.email) {
      try {
        await injectLead({ productId, email: data.email, ...data });
      } catch (e) {
        console.error(e);
      }
    }
  }, 2000);

  useEffect(() => {
    if (active) handleSubmit();
  }, [email, name, phone, url, handleSubmit, active]);
}
