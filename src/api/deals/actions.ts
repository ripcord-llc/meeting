import isURL from "validator/es/lib/isURL";
import * as yup from "yup";
import {
  parsePhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";

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
export const PhoneNumberSchema = yup
  .string()
  .transform(
    (value: string) => parsePhoneNumber(value, "US")?.format("E.164") || value
  )
  .test(
    "phone-valid",
    "${value} must be a valid phone number",
    (value?: string) => {
      if (!value) return true;

      return isPossiblePhoneNumber(value, "US");
    }
  )
  .max(191, "Must be shorter than ${max}")
  .required("Required");
export const URLSchema = yup
  .string()
  .transform((value: string) => "https://" + value)
  .required("Required")
  .max(2083, "Must be shorter than ${max}")
  .test("is-url", "Must be a valid URL", (value) => !!value && isURL(value)); // Using isURL from validator.js to match server-side validation

async function validateAndConvertDataToInjectLeadBody(body: {
  email: string;
  name: string;
  phone: string;
  url: string;
}): Promise<Partial<InjectLeadBody>> {
  const keys = ["email", "name", "phone", "url"] as const;

  const result = await Promise.allSettled([
    EmailSchema.validate(body.email),
    NameSchema.validate(body.name),
    PhoneNumberSchema.validate(body.phone),
    URLSchema.validate(body.url),
  ]);

  const data = result.reduce((acc, curr, i) => {
    if (curr.status === "fulfilled") acc[keys[i]] = curr.value; // Promise will only be fulfilled if validation passes

    return acc;
  }, {} as Partial<InjectLeadBody>);

  return data;
}

async function injectLead(
  body: InjectLeadBody & {
    routingId: string;
    productId?: string;
  }
): Promise<void> {
  await post<any>(PUBLIC_DEALS_ENDPOINTS.injectLead, body);
}

export function useInjectLead() {
  // Debounced functions use same logic as those using useEffectEvent. This means the object reference stays the same, even if dependencies change.
  return useDebounced(
    async ({
      routingId,
      productId,
      ...rest
    }: {
      routingId: string;
      productId?: string;
      email: string;
      name: string;
      phone: string;
      url: string;
    }) => {
      const data = await validateAndConvertDataToInjectLeadBody(rest);

      if (data.email) {
        try {
          await injectLead({
            routingId,
            productId,
            email: data.email,
            ...data,
          });
        } catch (e) {
          console.error(e);
        }
      }
    },
    2000
  );
}
