import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import appAxios from "../axios";

import { UserResponse } from "./types";

export const useGetUser = () => {
  return useSWR<UserResponse>(`/auth/session/user`, {
    revalidateOnFocus: true,
  });
};

export const useSessionLogout = () =>
  useSWRMutation("/auth/session", (url: string) => appAxios.delete(url));
