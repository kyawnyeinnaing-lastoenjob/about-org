import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { UserProps } from "@/lib/zod";

import appAxios from "../axios";

import { UserDetailResponse, UserManagementResponse } from "./type";

type UserArgs = {
  arg: UserProps;
};

export const useUserMutation = () =>
  useSWRMutation(`/user`, (url, { arg }: UserArgs) => {
    return appAxios.post<UserManagementResponse>(url, arg);
  });

export const useGetUserList = () => {
  const result = useSWR<UserManagementResponse>(`/user`);
  return {
    data: result.data?.data,
    mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

interface GetUserDetailsArg {
  id: string;
}

export const useGetUserDetailById = ({ id }: GetUserDetailsArg) => {
  const result = useSWR<UserDetailResponse>(`/user/${id}`);
  return {
    data: result.data?.data,
    mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

// type UpdateUserSortNumberArgs = {
//   arg: {
//     data: {
//       id1: string;
//       id2: string;
//     };
//   };
// };

// export const useUpdateUserSortNumber = () =>
//   useSWRMutation(`/user`, (url, { arg }: UpdateUserSortNumberArgs) => {
//     return appAxios.put<UserManagementResponse>(`${url}`, arg.data);
//   });

type UserContactArgs = {
  arg: {
    data: UserProps;
    id: string | undefined;
  };
};

export const useUpdateUser = () =>
  useSWRMutation(`/user`, (url, { arg }: UserContactArgs) => {
    return appAxios.put<UserManagementResponse>(`${url}/${arg.id}`, arg.data);
  });
