import useSWR, { useSWRConfig } from "swr";
import { MeResponse } from "../services/api/handlers/users/meHandler";
import { axiosFetcher } from "../services/api/request/axios";

const userApiPath = "/users";

export function useUser() {
  const { data } = useSWR<MeResponse>(userApiPath, axiosFetcher);

  return data?.authenticated ? data.user : undefined;
}

export function useRefreshUser() {
  const { mutate } = useSWRConfig();
  return () => mutate(userApiPath);
}