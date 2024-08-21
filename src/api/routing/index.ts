import useSWRImmutable from 'swr/immutable';

import { PublicRouting, RouteResult } from './types';

import { fetcher, post } from '../fetcher';

const PUBLIC_ROUTING_ENDPOINTS = {
  getRouting: (uuid: string) => `/public/routing/${uuid}`,
  postRouting: '/public/routing',
};

export function usePublicRouting(uuid: string) {
  return useSWRImmutable(PUBLIC_ROUTING_ENDPOINTS.getRouting(uuid), fetcher<PublicRouting>, {
    revalidateOnMount: true,
  });
}

export async function handleRouting(body: {
  routingId: string;
  email: string;
  answers?: { questionId: number; answerId: number }[];
}): Promise<RouteResult> {
  return post<RouteResult>(PUBLIC_ROUTING_ENDPOINTS.postRouting, body);
}
