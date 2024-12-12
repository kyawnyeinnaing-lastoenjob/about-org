import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { ContactProps } from "@/lib/zod";

import appAxios from "../axios";

import { ContactResponse } from "./types";

export const useGetContacts = () => {
  const result = useSWR<ContactResponse>(`/contact`);
  return {
    data: result.data?.data,
    mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

type ContactArgs = {
  arg: ContactProps;
};
export const useContactMutation = () =>
  useSWRMutation(`/contact`, (url, { arg }: ContactArgs) => {
    return appAxios.post<ContactResponse>(url, arg);
  });

type UpdateContactArgs = {
  arg: {
    data: ContactProps;
    id: string | undefined;
  };
};
export const useUpdateContact = () =>
  useSWRMutation(`/contact`, (url, { arg }: UpdateContactArgs) => {
    return appAxios.put<ContactResponse>(`${url}/${arg.id}`, arg.data);
  });
