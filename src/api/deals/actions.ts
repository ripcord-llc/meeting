/* eslint-disable no-template-curly-in-string */
import isURL from 'validator/es/lib/isURL';
import * as yup from 'yup';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

import { post } from '../fetcher';

import {
  LeadInjectionResponse,
  CreateMeetingParams,
  CreateExistingDealMeetingParams,
  CreateMeetingResponse,
} from './types';

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

export function injectLead(
  body: InjectLeadBody & {
    routingId: string;
    productId?: string;
  }
): Promise<LeadInjectionResponse> {
  return post<LeadInjectionResponse>(PUBLIC_DEALS_ENDPOINTS.injectLead, body);
}

export async function bookMeetingIntoLatestNonStartedDeal(
  body: CreateMeetingParams
): Promise<CreateMeetingResponse> {
  return post<CreateMeetingResponse>(
    PUBLIC_DEALS_ENDPOINTS.bookMeetingIntoLatestNonStartedDeal,
    body
  );
}

export async function bookMeetingIntoProduct(
  body: CreateMeetingParams
): Promise<CreateMeetingResponse> {
  return post<CreateMeetingResponse>(PUBLIC_DEALS_ENDPOINTS.bookMeetingIntoProduct, body);
}

export async function bookMeetingIntoExistingDeal(
  body: CreateExistingDealMeetingParams
): Promise<CreateMeetingResponse> {
  return post<CreateMeetingResponse>(PUBLIC_DEALS_ENDPOINTS.bookMeetingIntoExistingDeal, body);
}
