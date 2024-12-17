import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { SettingProps } from "@/lib/zod";

import appAxios from "../axios";

import { SettingResponse } from "./types";

export const useGetSetting = () => {
  const result = useSWR<SettingResponse>(`/setting`);
  return {
    data: result.data?.data,
    mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

type UpdateContactArgs = {
  arg: {
    data: SettingProps;
    id: string | undefined;
  };
};
export const useUpdateSetting = () =>
  useSWRMutation(`/setting`, (url, { arg }: UpdateContactArgs) => {
    return appAxios.put<SettingResponse>(`${url}/${arg.id}`, arg.data);
  });
