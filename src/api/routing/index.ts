import useSWRImmutable from 'swr/immutable';

import { PublicRouting, RouteResult } from './types';

import { initFacebookPixelSimple } from '../../pixel/facebook';
import { initGtag } from '../../pixel/gtag';

import { fetcher, post, Exception } from '../fetcher';

const PUBLIC_ROUTING_ENDPOINTS = {
  getRouting: (uuid: string) => `/public/routing/${uuid}`,
  postRouting: '/public/routing',
};

export function usePublicRouting(uuid: string) {
  return useSWRImmutable<PublicRouting, Exception>(
    PUBLIC_ROUTING_ENDPOINTS.getRouting(uuid),
    fetcher<PublicRouting>,
    {
      revalidateOnMount: true,
      onSuccess: (data) => {
        if (data.account.facebookPixel) {
          initFacebookPixelSimple(data.account.facebookPixel.pixelId);
        }

        if (data.account.googlePixel) {
          initGtag(data.account.googlePixel.pixelId);
        }
      },
    }
  );
}

export async function handleRouting(body: {
  routingId: string;
  email: string;
  answers?: { questionId: number; answerId: number }[];
}): Promise<RouteResult> {
  return post<RouteResult>(PUBLIC_ROUTING_ENDPOINTS.postRouting, body);
}
