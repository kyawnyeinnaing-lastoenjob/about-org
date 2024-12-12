import useSWR, { SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";

import { Sorting } from "@/lib/enum";
import { ListingProps } from "@/lib/zod";
import { routeFilter } from "@/utils";

import appAxios from "../axios";
import { Params } from "../types";

import {
  ListDetailResponse,
  ListingBySubCategoryResponse,
  ListingResponse,
} from "./types";

interface UseGetAllListingsProps {
  pageIndex: number;
  pageSize: number;
}

export const useGetAllListings = ({
  pageIndex,
  pageSize,
}: UseGetAllListingsProps) => {
  const result = useSWR(`/listing?page=${pageIndex}&limit=${pageSize}`);
  return {
    data: result.data?.data,
    mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

export const useGetListing = () => {
  const result = useSWR(`/listing/category`);
  return {
    data: result.data?.data,
    mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

interface getListByCategoryProps {
  slug: string;
  params: {
    page: number;
    limit: number;
    keyword: Sorting;
    dateSorting: Sorting;
    search?: string;
  };
}
export const useGetListingBySubCategory = ({
  slug,
  params,
}: getListByCategoryProps) => {
  const newParams = {
    ...params,
    ...(params.search && { search: params.search }),
  };

  const result = useSWR<ListingBySubCategoryResponse>(
    `/listing/sub-category/${slug}?${routeFilter(newParams)}`,
  );

  return {
    data: result.data,
    mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

interface getListByCategoryAndCountryProps {
  slugs: {
    subCategorySlug: string;
    countrySlug: string;
  };
  params: {
    page: number;
    limit: number;
    keyword?: Sorting | undefined;
    dateSorting: Sorting | undefined;
    search?: string;
  };
}
export const useGetListingBySubCategoryAndCountry = ({
  slugs,
  params,
}: getListByCategoryAndCountryProps) => {
  const { dateSorting, ...restParams } = params;

  const newParams = {
    ...restParams,
    ...(params.search && { search: params.search }),
    ...(dateSorting !== undefined && { dateSorting }),
  };

  const key = slugs?.countrySlug
    ? `/listing/sub-category/${slugs.subCategorySlug}/${slugs.countrySlug}?${routeFilter(newParams)}`
    : null;

  const result = useSWR<ListingBySubCategoryResponse>(key);

  return {
    data: result.data,
    mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

export const useGetListingsByCountrySlug = (slug: string, params?: Params) => {
  const key = params
    ? params.search
      ? `/listing/country/${slug}?${routeFilter(params)}`
      : null
    : `/listing/country/${slug}`;

  const result = useSWR<ListingBySubCategoryResponse>(key);
  return {
    data: result.data?.data,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
  };
};

export const useGetListByCountrySlug = ({
  listSlug,
  countrySlug,
}: {
  listSlug: string;
  countrySlug: string;
}) => {
  const key =
    listSlug && countrySlug ? `/listing/${listSlug}/${countrySlug}` : null;
  return useSWR<ListDetailResponse>(key);
};

// export const useGetListByCountrySlug = ({
//   listSlug,
//   countrySlug,
// }: {
//   listSlug: string;
//   countrySlug: string;
// }) => {
//   const key = listSlug && countrySlug && `/listing/${listSlug}/${countrySlug}`;
//   return useSWR<ListDetailResponse>(key);

export const useUpdateListingSortNumber = () =>
  useSWRMutation(`/listing`, (url, { arg }: UpdateListingSortNumberArgs) => {
    return appAxios.put<ListDetailResponse>(`${url}`, arg.data);
  });

type UpdateListingSortNumberArgs = {
  arg: {
    data: {
      id1: string;
      id2: string;
    };
  };
};

export const useGetBinListing = (config?: SWRConfiguration) => {
  const result = useSWR<ListingResponse>(`/listing/bin`, config);
  return {
    data: result.data?.data,
    mutate: result.mutate,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    error: result.error,
  };
};

type ListingArgs = {
  arg: ListingProps;
};
export const useListingMutation = () =>
  useSWRMutation(`/listing`, (url, { arg }: ListingArgs) => {
    return appAxios.post<ListingResponse>(url, arg);
  });

type UpdateListArgs = {
  arg: {
    data: ListingProps;
    id: string;
  };
};
export const useUpdateList = () =>
  useSWRMutation(`/listing`, (url, { arg }: UpdateListArgs) => {
    return appAxios.put<ListingResponse>(`${url}/${arg.id}`, arg.data);
  });

type DeleteListArgs = {
  arg: {
    id: string;
    hardDelete?: boolean;
  };
};
export const useDeleteList = () => {
  return useSWRMutation(`/listing`, (url, { arg }: DeleteListArgs) => {
    return appAxios.delete<ListingResponse>(`${url}/${arg.id}`, {
      data: {
        hardDelete: arg?.hardDelete,
      },
    });
  });
};

type RestoreArgs = {
  arg: {
    id: string;
    data: ListingProps;
  };
};
export const useRestoreListing = () =>
  useSWRMutation(`/listing/bin/restore`, (url, { arg }: RestoreArgs) => {
    return appAxios.put<ListingResponse>(`${url}/${arg.id}`, arg.data);
  });

type UpdateBulkListingArgs = {
  arg: {
    data: ListingProps[];
  };
};
export const useUpdateMultipleListings = () =>
  useSWRMutation(`/listing/bin/bulk`, (url, { arg }: UpdateBulkListingArgs) => {
    return appAxios.put<ListingResponse>(`${url}`, arg.data);
  });
