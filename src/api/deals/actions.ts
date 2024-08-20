/* eslint-disable no-template-curly-in-string */
import { useState, useMemo, useCallback, useEffect } from 'react';
import isURL from 'validator/es/lib/isURL';
import * as yup from 'yup';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

import useDebounced from '../../hooks/useDebounced';

import { post } from '../fetcher';

import { LeadInjectionResponse } from './types';

import { PUBLIC_DEALS_ENDPOINTS } from '.';

interface InjectLeadBody {
  email: string;
  name?: string;
  phone?: string;
  url?: string;
}

export const EmailSchema = yup.string().email().required('Required');
export const NameSchema = yup.string().max(191, 'Must be shorter than ${max}').required('Required');
export const PhoneNumberSchema = yup
  .string()
  .test('phone-valid', 'Must be a valid phone number', (value?: string) => {
    if (!value) return true;

    return isPossiblePhoneNumber(value);
  })
  .max(191, 'Must be shorter than ${max}')
  .required('Required');
export const URLSchema = yup
  .string()
  .transform((value: string) => `https://${value}`)
  .required('Required')
  .max(2083, 'Must be shorter than ${max}')
  .test('is-url', 'Must be a valid URL', (value) => !!value && isURL(value)); // Using isURL from validator.js to match server-side validation

export async function validateAndConvertDataToInjectLeadBody(body: {
  email: string;
  name: string;
  phone: string;
  url: string;
}): Promise<Partial<InjectLeadBody>> {
  const keys = ['email', 'name', 'phone', 'url'] as const;

  const result = await Promise.allSettled([
    EmailSchema.validate(body.email),
    NameSchema.validate(body.name),
    PhoneNumberSchema.validate(body.phone),
    URLSchema.validate(body.url),
  ]);

  const data = result.reduce((acc, curr, i) => {
    if (curr.status === 'fulfilled') acc[keys[i]] = curr.value; // Promise will only be fulfilled if validation passes

    return acc;
  }, {} as Partial<InjectLeadBody>);

  return data;
}

export async function injectLead(
  body: InjectLeadBody & {
    routingId: string;
    productId?: string;
  }
): Promise<LeadInjectionResponse> {
  return post<LeadInjectionResponse>(PUBLIC_DEALS_ENDPOINTS.injectLead, body);
}

export function useValidatedLeadInjectionValues(
  email: string,
  name: string,
  phone: string,
  url: string
): {
  email: string | null;
  name: string | null;
  phone: string | null;
  url: string | null;
} {
  const [validEmail, setValidEmail] = useState<string | null>(null);
  const [validName, setValidName] = useState<string | null>(null);
  const [validPhone, setValidPhone] = useState<string | null>(null);
  const [validUrl, setValidUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const validated = await validateAndConvertDataToInjectLeadBody({
        email,
        name,
        phone,
        url,
      });

      if (cancelled) return;

      setValidEmail(validated.email || null);
      setValidName(validated.name || null);
      setValidPhone(validated.phone || null);
      setValidUrl(validated.url || null);
    })();

    return () => {
      cancelled = true;
    };
  }, [email, name, phone, url]);

  return useMemo(
    () => ({ email: validEmail, name: validName, phone: validPhone, url: validUrl }),
    [validEmail, validName, validPhone, validUrl]
  );
}

export function useInjectLead(routingId: string, productId?: string) {
  const [data, setData] = useState<LeadInjectionResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // true when inject is called, false when inject is done
  const [isLoading, setIsLoading] = useState(false); // true when inject is loading, false when inject is done
  const [error, setError] = useState<unknown>(null);
  // Debounced functions use same logic as those using useEffectEvent. This means the object reference stays the same, even if dependencies change.
  const handler = useDebounced(
    async (params: { email?: string; name?: string; phone?: string; url?: string }) => {
      if (params.email) {
        try {
          setIsLoading(true);

          const resp = await injectLead({
            ...data,
            email: params.email,
            routingId,
            productId,
          });

          setData(resp);
        } catch (e) {
          setError(e);
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }

      setIsProcessing(false);
    },
    2000,
    true
  );

  const inject = useCallback(
    async (params: { email?: string; name?: string; phone?: string; url?: string }) => {
      setError(null);
      setIsProcessing(true);

      try {
        await handler(params);
      } catch (e) {
        console.error(e);
      }
    },
    [handler]
  );

  return {
    data,
    isProcessing,
    isLoading,
    error,
    inject,
  };
}
