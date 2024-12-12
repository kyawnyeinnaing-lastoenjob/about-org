"use client";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import useSWRInfinite from "swr/infinite";

import Breadcrumb from "@/components/Breadcrumb";
import { countrySlugAtom } from "@/components/layout/user/atoms";
import { ItemListSkeleton } from "@/components/Skeletons";
import Toolbar from "@/components/Toolbar";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Sorting } from "@/lib/enum";
import { useGetCategoriesByCountry } from "@/lib/swr-services/country";
import { fetcher } from "@/lib/swr-services/fetcher";
import { useGetListingBySubCategoryAndCountry } from "@/lib/swr-services/listing";
import {
  ListData,
  ListingPaginationResponse,
} from "@/lib/swr-services/listing/types";
// import { ListingPaginationResponse } from '@/lib/swr-services/listing/types';
import {
  Backdrop,
  Box,
  CircularProgress,
  Skeleton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import ImageList from "../../../ImageList";
import { checkCountryChangeAtom } from "../atoms";

import NoDataUI from "./NoDataUI";

interface ItemListProps {
  subCategorySlug: string;
  hideBack?: boolean;
}

const ItemList: React.FC<ItemListProps> = ({ subCategorySlug }) => {
  const [sorting, setSorting] = useState<Sorting | null>(null);
  const [loading, setLoading] = useState(false);
  const pageLimit = 20;
  const [pageStart] = useState(1);

  const [countrySlug] = useAtom(countrySlugAtom);
  const [checkCountryChange] = useAtom(checkCountryChangeAtom);

  const observer = useRef(null);
  const theme = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isPC = useMediaQuery(theme.breakpoints.up("lg"));

  const { data: mainCategoryData = [] } = useGetCategoriesByCountry({
    country: countrySlug,
  });

  const { data: listData } = useGetListingBySubCategoryAndCountry({
    slugs: {
      subCategorySlug,
      countrySlug,
    },
    params: {
      page: 1,
      limit: 20,
      dateSorting: sorting as Sorting,
      // keyword: sorting,
    },
  });

  const { data, setSize, size, isLoading } =
    useSWRInfinite<ListingPaginationResponse>((index) => {
      if (!countrySlug && !sorting) return null;
      return `/listing/sub-category/${subCategorySlug}/${countrySlug}?page=${index + pageStart}&limit=${pageLimit}&dateSorting=${sorting}`;
    }, fetcher);

  const newData = useMemo<ListData[]>(() => {
    setLoading(false);
    if (data) {
      return data.flatMap((el) => el.data);
    }
    return [];
  }, [data]);

  const isEnd = newData.length === data?.[0]?.pagination.totalCount;
  const { lastDataRendered } = useInfiniteScroll(
    setLoading,
    setSize,
    observer,
    { size, loading },
    isEnd,
  );

  const firstSubCategories = useMemo(() => {
    return mainCategoryData
      ?.filter((item) => item.SubCategory && item.SubCategory.length > 0)
      .map((item) => ({
        categorySlug: item.slug,
        subCategorySlug: item?.SubCategory[0]?.slug,
      }));
  }, [mainCategoryData]);

  useEffect(() => {
    if (isPC) {
      if (checkCountryChange) {
        if (listData?.data?.length === 0 && firstSubCategories?.length > 0) {
          startTransition(() => {
            router.push(
              `/${countrySlug}/ads/list/${firstSubCategories[0].categorySlug}/${firstSubCategories[0].subCategorySlug}`,
            );
          });
        }
      }
    } else {
      if (checkCountryChange) {
        if (listData?.data?.length === 0 && firstSubCategories?.length > 0) {
          startTransition(() => {
            router.push("/${countrySlug}/mobile");
          });
        }
      }
    }
  }, [
    countrySlug,
    checkCountryChange,
    firstSubCategories,
    listData,
    router,
    isPC,
  ]);

  const breadcrumbs = [
    {
      title: `${listData?.meta?.mainCategory?.name ?? ""}`,
      link: isPC
        ? null
        : `/${countrySlug}/ads/category/${listData?.meta?.mainCategory?.slug}`,
    },
    {
      title: `${listData?.meta?.subCategory?.name ?? ""}`,
      link: null,
    },
  ];

  if (isPending) {
    return (
      <Backdrop
        open
        sx={(theme) => ({
          color: theme.palette.colors.white,
          zIndex: theme.zIndex.drawer + 1,
          m: "0 !important",
        })}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isLoading) {
    return (
      <Stack width="100%" direction="column" rowGap={{ lg: 3, xs: 1 }}>
        <Skeleton variant="rounded" />
        <Skeleton variant="rounded" />
        <ItemListSkeleton item={8} />
      </Stack>
    );
  }

  return (
    <Box width="100%">
      {listData?.meta?.mainCategory?.name && (
        <Breadcrumb
          breadcrumbs={breadcrumbs}
          hideBack={isPC}
          backRoute={
            isPC
              ? `/${countrySlug}/ads`
              : `/${countrySlug}/ads/category/${listData?.meta?.mainCategory?.slug}`
          }
        />
      )}

      {listData?.pagination && listData?.pagination?.totalCount > 0 && (
        <Box sx={{ margin: { xs: "16px 0", lg: "24px: 0" } }}>
          <Toolbar
            listLength={newData.length}
            itemCount={listData?.pagination?.totalCount ?? 0}
            sorting={sorting as Sorting}
            setSorting={setSorting}
          />
        </Box>
      )}

      {/* <Box sx={{ height: 'calc(100vh - 160px)', overflow: 'scroll' }}> */}
      <Box>
        {newData && newData.length > 0 ? (
          <ImageList list={newData} />
        ) : (
          <NoDataUI />
        )}
        {newData?.length > 0 && !isEnd && (
          <Stack rowGap={1} ref={lastDataRendered} mt={1}>
            <ItemListSkeleton item={4} />
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default ItemList;
