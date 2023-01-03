import useSWR, { useSWRConfig } from "swr";
import { MeResponse } from "../services/users/handlers/meHandler";
import { axiosFetcher } from "../util/api/axios";

const userApiPath = "/users";

export function useUser() {
  const { data } = useSWR<MeResponse>(userApiPath, axiosFetcher);

  return data?.authenticated ? data.user : undefined;
}

export function useRefreshUser() {
  const { mutate } = useSWRConfig();
  return () => mutate(userApiPath);
}