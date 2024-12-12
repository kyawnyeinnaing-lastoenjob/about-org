import useSWR, { SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";

import { SubCategoryProps } from "@/lib/zod";
import { Status } from "@prisma/client";

import appAxios from "../axios";

import { SubCategoryResponse } from "./type";

interface GetSubCategoryProps {
  country: string | undefined;
  mainCategory: string | undefined;
}

export const useGetSubCategoryByMainCategory = ({
  country,
  mainCategory,
}: GetSubCategoryProps) => {
  const key = mainCategory ? `/sub-category/${country}/${mainCategory}` : null;
  const result = useSWR<SubCategoryResponse>(key);
  return {
    data: result.data,
    // mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

export const useGetSubCategories = () => {
  const result = useSWR<SubCategoryResponse>(`/sub-category`);
  return {
    data: result.data?.data,
    mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

type CategoryArgs = {
  arg: SubCategoryProps;
};
export const useSubCategoryMutation = () =>
  useSWRMutation(`/sub-category`, (url, { arg }: CategoryArgs) => {
    return appAxios.post<SubCategoryResponse>(url, arg);
  });

type UpdateCountryArgs = {
  arg: {
    data: SubCategoryProps;
    id: string;
  };
};
export const useUpdateSubCategory = () =>
  useSWRMutation(`/sub-category`, (url, { arg }: UpdateCountryArgs) => {
    return appAxios.put<SubCategoryResponse>(`${url}/${arg.id}`, arg.data);
  });

type DeleteCountryArgs = {
  arg: {
    id: string;
    hardDelete?: boolean;
  };
};
export const useDeleteSubCategory = () => {
  return useSWRMutation(`/sub-category`, (url, { arg }: DeleteCountryArgs) => {
    return appAxios.delete<SubCategoryResponse>(`${url}/${arg.id}`, {
      data: {
        hardDelete: arg?.hardDelete,
      },
    });
  });
};
export const useUpdateSubCategorySortNumber = () =>
  useSWRMutation(
    `/sub-category`,
    (url, { arg }: UpdateSubCategorySortNumberArgs) => {
      return appAxios.put<SubCategoryResponse>(`${url}`, arg.data);
    },
  );

type UpdateSubCategorySortNumberArgs = {
  arg: {
    data: {
      id1: string;
      id2: string;
    };
  };
};
export const useGetBinSubCategory = (config?: SWRConfiguration) => {
  const result = useSWR<SubCategoryResponse>(`/sub-category/bin`, config);
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
      mainCategoryId: string;
      status: Status;
      isDeleted: boolean;
      subCategoryImage: string;
    };
  };
};
export const useRestoreSubCategory = () =>
  useSWRMutation(`/sub-category/bin/restore`, (url, { arg }: RestoreArgs) => {
    return appAxios.put<SubCategoryResponse>(`${url}/${arg.id}`, arg.data);
  });

type UpdateBulkCategoriesArgs = {
  arg: {
    data: SubCategoryProps[];
  };
};
export const useUpdateMultipleSubCategories = () =>
  useSWRMutation(
    `/sub-category/bin/bulk`,
    (url, { arg }: UpdateBulkCategoriesArgs) => {
      return appAxios.put<SubCategoryResponse>(`${url}`, arg.data);
    },
  );
