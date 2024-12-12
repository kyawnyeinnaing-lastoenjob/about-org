"use client";

import useSWR, { SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";

import { CountryProps } from "@/lib/zod";
import { Status } from "@prisma/client";

import appAxios from "../axios";

import { CategoryByCountryResponse, CountryResponse } from "./types";

export const useGetCategoriesByCountry = ({
  country,
}: {
  country: string | undefined;
}) => {
  const key = country ? `/category/country/${country}` : null;
  const result = useSWR<CategoryByCountryResponse>(key);
  return {
    data: result.data?.data,
    mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

export const useGetCountries = () => {
  const result = useSWR<CountryResponse>(`/country`);
  return {
    data: result.data?.data,
    mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

export const useGetBinCountries = (config?: SWRConfiguration) => {
  const result = useSWR<CountryResponse>(`/country/bin`, config);
  return {
    data: result.data?.data,
    mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

type CountryArgs = {
  arg: CountryProps;
};
export const useCountryMutation = () =>
  useSWRMutation(`/country`, (url, { arg }: CountryArgs) => {
    return appAxios.post<CountryResponse>(url, arg);
  });

type UpdateCountryArgs = {
  arg: {
    data: CountryProps;
    id: string;
  };
};
export const useUpdateCountry = () =>
  useSWRMutation(`/country`, (url, { arg }: UpdateCountryArgs) => {
    return appAxios.put<CountryResponse>(`${url}/${arg.id}`, arg.data);
  });

type UpdateBulkCountriesArgs = {
  arg: {
    data: {
      name: string;
      countryCode: string;
      status: Status;
      isDeleted: boolean;
    }[];
  };
};
export const useUpdateMultipleCountries = () =>
  useSWRMutation(
    `/country/bin/bulk`,
    (url, { arg }: UpdateBulkCountriesArgs) => {
      return appAxios.put<CountryResponse>(`${url}`, arg.data);
    },
  );

type UpdateCountriesSortNumberArgs = {
  arg: {
    data: {
      id1: string;
      id2: string;
    };
  };
};
export const useUpdateCountriesSortNumber = () =>
  useSWRMutation(`/country`, (url, { arg }: UpdateCountriesSortNumberArgs) => {
    return appAxios.put<CountryResponse>(`${url}`, arg.data);
  });

type RestoreArgs = {
  arg: {
    id: string;
    data: {
      name: string;
      countryCode: string;
      status: Status;
      isDeleted: boolean;
    };
  };
};
export const useRestoreCountry = () =>
  useSWRMutation(`/country/bin/restore`, (url, { arg }: RestoreArgs) => {
    return appAxios.put<CountryResponse>(`${url}/${arg.id}`, arg.data);
  });

type DeleteCountryArgs = {
  arg: {
    id: string;
    hardDelete?: boolean;
  };
};
export const useDeleteCountry = () => {
  return useSWRMutation(`/country`, (url, { arg }: DeleteCountryArgs) => {
    return appAxios.delete<CountryResponse>(`${url}/${arg.id}`, {
      data: {
        hardDelete: arg?.hardDelete,
      },
    });
  });
};
