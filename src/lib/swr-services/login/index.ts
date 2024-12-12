import useSWRMutation from "swr/mutation";

import { LoginProps } from "@/lib/zod";

import appAxios from "../axios";
import { UserResponse } from "../user/types";

type LoginArgs = {
  arg: LoginProps;
};
export const useLogin = () =>
  useSWRMutation(`/auth/login`, (url, { arg }: LoginArgs) => {
    return appAxios.post<UserResponse>(url, arg);
  });

export const useSessionLogout = () =>
  useSWRMutation("/auth/session", (url: string) => appAxios.delete(url));
