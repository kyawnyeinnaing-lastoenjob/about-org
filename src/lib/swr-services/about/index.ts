import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { AboutProps } from "@/lib/zod";

import appAxios from "../axios";

import { AboutResponse } from "./types";

type AboutArgs = {
  arg: AboutProps;
};

export const useGetAbout = () => {
  const res = useSWR<AboutResponse>(`/about`);
  return {
    data: res?.data,
  };
};

export const useAboutMutation = () =>
  useSWRMutation(`/about`, (url, { arg }: AboutArgs) => {
    return appAxios.post<AboutResponse>(url, arg);
  });

type UpdateContactArgs = {
  arg: {
    data: AboutProps;
    id: string | undefined;
  };
};
export const useUpdateAbout = () =>
  useSWRMutation(`/about`, (url, { arg }: UpdateContactArgs) => {
    return appAxios.put<AboutResponse>(`${url}/${arg.id}`, arg.data);
  });
