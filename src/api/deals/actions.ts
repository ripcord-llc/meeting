/* eslint-disable no-template-curly-in-string */
import { useState, useMemo, useCallback } from 'react';
import isURL from 'validator/es/lib/isURL';
import * as yup from 'yup';
import { parsePhoneNumber, isPossiblePhoneNumber } from 'react-phone-number-input';

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

async function validateAndConvertDataToInjectLeadBody(body: {
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

async function injectLead(
  body: InjectLeadBody & {
    routingId: string;
    productId?: string;
  }
): Promise<LeadInjectionResponse> {
  return post<LeadInjectionResponse>(PUBLIC_DEALS_ENDPOINTS.injectLead, body);
}

export function useInjectLead() {
  const [response, setResponse] = useState<LeadInjectionResponse | null>(null);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  // Debounced functions use same logic as those using useEffectEvent. This means the object reference stays the same, even if dependencies change.
  const handler = useDebounced(
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
          setLoading(true);

          const resp = await injectLead({
            routingId,
            productId,
            email: data.email,
            ...data,
          });

          setResponse(resp);
        } catch (e) {
          setError(e);
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    },
    2000
  );

  const inject = useCallback(
    async (params: {
      routingId: string;
      productId?: string;
      email: string;
      name: string;
      phone: string;
      url: string;
    }) => {
      setError(null);
      setProcessing(true);

      try {
        await handler(params);
      } catch (e) {
        console.error(e);
      } finally {
        setProcessing(false);
      }
    },
    [handler]
  );

  return {
    response,
    processing,
    loading,
    error,
    inject,
  };
}
