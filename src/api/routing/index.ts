import useSWRImmutable from "swr/immutable";

import { PublicRouting } from "./types";

import { fetcher } from "../fetcher";

export function usePublicRouting(uuid: string) {
  return useSWRImmutable(`/api/routing/${uuid}`, fetcher<PublicRouting>);
}
