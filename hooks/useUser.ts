import useSWR, { useSWRConfig } from "swr";
import { MeResponse } from "../api/handlers/users/meHandler";
import { axiosFetcher } from "../api/request/axios";

const userApiPath = "/users";

export function useUser() {
  const { data } = useSWR<MeResponse>(userApiPath, axiosFetcher);

  return data?.authenticated ? data.user : undefined;
}

export function useRefreshUser() {
  const { mutate } = useSWRConfig();
  return () => mutate(userApiPath);
}