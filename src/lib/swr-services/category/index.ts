import useSWR, { SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";

import { MainCategoryProps } from "@/lib/zod";
import { Status } from "@prisma/client";

import appAxios from "../axios";

import { CategoryResponse } from "./types";

export const useGetCategories = () => {
  const result = useSWR<CategoryResponse>(`/category`);
  return {
    data: result.data?.data,
    mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

type CategoryArgs = {
  arg: MainCategoryProps;
};
export const useCategoryMutation = () =>
  useSWRMutation(`/category`, (url, { arg }: CategoryArgs) => {
    return appAxios.post<CategoryResponse>(url, arg);
  });

type UpdateCountryArgs = {
  arg: {
    data: MainCategoryProps;
    id: string;
  };
};
export const useUpdateCategory = () =>
  useSWRMutation(`/category`, (url, { arg }: UpdateCountryArgs) => {
    return appAxios.put<CategoryResponse>(`${url}/${arg.id}`, arg.data);
  });

type DeleteCountryArgs = {
  arg: {
    id: string;
    hardDelete?: boolean;
  };
};
export const useDeleteCategory = () => {
  return useSWRMutation(`/category`, (url, { arg }: DeleteCountryArgs) => {
    return appAxios.delete<CategoryResponse>(`${url}/${arg.id}`, {
      data: {
        hardDelete: arg?.hardDelete,
      },
    });
  });
};

export const useGetBinCategory = (config?: SWRConfiguration) => {
  const result = useSWR<CategoryResponse>(`/category/bin`, config);
  return {
    data: result.data?.data,
    mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

type RestoreArgs = {
  arg: {
    id: string;
    data: {
      name: string;
      countryId: string;
      status: Status;
      isDeleted: boolean;
      categoryImage: string;
    };
  };
};

type UpdateMainCategorySortNumberArgs = {
  arg: {
    data: {
      id1: string;
      id2: string;
    };
  };
};
export const useUpdateMainCategorySortNumber = () =>
  useSWRMutation(
    `/category`,
    (url, { arg }: UpdateMainCategorySortNumberArgs) => {
      return appAxios.put<CategoryResponse>(`${url}`, arg.data);
    },
  );

export const useRestoreCategory = () =>
  useSWRMutation(`/category/bin/restore`, (url, { arg }: RestoreArgs) => {
    return appAxios.put<CategoryResponse>(`${url}/${arg.id}`, arg.data);
  });

type UpdateBulkCategoriesArgs = {
  arg: {
    data: MainCategoryProps[];
  };
};
export const useUpdateMultipleCategories = () =>
  useSWRMutation(
    `/category/bin/bulk`,
    (url, { arg }: UpdateBulkCategoriesArgs) => {
      return appAxios.put<CategoryResponse>(`${url}`, arg.data);
    },
  );
