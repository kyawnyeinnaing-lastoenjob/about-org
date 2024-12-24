"use client";
import React, { useEffect } from "react";
import { useAtom } from "jotai";
import Image from "next/image";

import Breadcrumb from "@/components/Breadcrumb";
import UserLayout from "@/components/layout/user";
import { countrySlugAtom, isSearchAtom } from "@/components/layout/user/atoms";
import { brand, gray } from "@/components/shared/themes/themePrimitives";
import { DetailTitle } from "@/components/shared/themes/ui/styles/Typography";
import SocialShare from "@/components/SocialShare";
import { useGetListByCountrySlug } from "@/lib/swr-services/listing";
import {
  Box,
  Stack,
  styled,
  useMediaQuery as useMuiMediaQuery,
  useTheme,
} from "@mui/material";
import { ItemDetailSkeleton } from "@/components/Skeletons";

interface ItemDetailProps {
  subCategorySlug: string;
  listSlug: string;
}

const StyledDetailImage = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  [theme.breakpoints.down("md")]: {
    marginTop: theme.spacing(3),
  },
  ["& img"]: {
    [theme.breakpoints.down("md")]: {
      width: 430,
      height: 430,
      aspectRatio: 1 / 1,
      objectFit: "cover",
    },
    [theme.breakpoints.down("sm")]: {
      width: 325,
      height: 325,
      aspectRatio: 1 / 1,
      objectFit: "cover",
    },
  },
}));

const ItemDetail: React.FC<ItemDetailProps> = ({ listSlug }) => {
  const [countrySlug] = useAtom(countrySlugAtom);
  const [isSearch] = useAtom(isSearchAtom);

  const theme = useTheme();
  const isPC = useMuiMediaQuery(theme.breakpoints.up("lg"));

  const { data: listDetail, isLoading } = useGetListByCountrySlug({
    listSlug,
    countrySlug,
  });

  const breadcrumbs = [
    {
      title: `${listDetail?.data?.mainCategory?.name ?? ""}`,
      link: isPC
        ? `/${countrySlug}/ads/list/${listDetail?.data?.mainCategory?.slug}/${listDetail?.data?.subCategory?.slug}`
        : `/${countrySlug}/ads/category/${listDetail?.data?.mainCategory?.slug}`,
      color: "#1E1E1E",
    },
    {
      title: `${listDetail?.data?.subCategory?.name ?? ""}`,
      link: isPC
        ? `/${countrySlug}/ads/list/${listDetail?.data?.mainCategory?.slug}/${listDetail?.data?.subCategory?.slug}`
        : `/${countrySlug}/ads/item-list/${listDetail?.data?.subCategory?.slug}`,
      color: "#1E1E1E",
    },
  ];

  useEffect(() => {
    if (isSearch && listDetail?.data) {
      const existingData = JSON.parse(localStorage.getItem("search") || "[]");

      const newItem = {
        slug: listDetail.data.slug,
        categorySlug: listDetail.data.mainCategory?.slug,
        subCategorySlug: listDetail.data.subCategory?.slug,
        title: listDetail.data.title,
        imgUrl: listDetail.data.detailImage,
        countrySlug: listDetail.data.country?.slug,
      };

      const isValidNewItem =
        newItem.slug && newItem.categorySlug && newItem.subCategorySlug;

      if (!isValidNewItem) {
        console.warn("Invalid new item data:", newItem);
        return;
      }

      const isDuplicate = existingData.some(
        (item: { slug: string }) => item.slug === newItem.slug,
      );

      if (!isDuplicate) {
        const updatedData = [...existingData, newItem].slice(-5);
        localStorage.setItem("search", JSON.stringify(updatedData));
      }
    }
  }, [isSearch, listDetail]);

  if (isLoading) {
    return (
      <UserLayout>
        <Stack width="100%" mx="auto" mb={{ xs: 2, md: 4 }}>
          <Stack
            p={{ xs: "24px 16px", sm: "24px 56px", lg: "24px 104px" }}
            direction="row"
            alignItems="center"
          >
            <ItemDetailSkeleton />
          </Stack>
        </Stack>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Stack width="100%" minHeight="100vh">
        {listDetail?.data && (
          <Stack
            p={{ xs: "16px 16px", sm: "16px 56px", lg: "16px 104px" }}
            gap={{ xs: 0, md: 3 }}
            direction={{ sm: "column", lg: "row-reverse" }}
            justifyContent={{
              xs: "flex-start",
              md: "space-between",
            }}
            sx={() => ({ width: "100%" })}
          >
            {/* detail image */}
            <Box>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="flex-end"
                sx={() => ({
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                })}
              >
                {isPC && (
                  <StyledDetailImage>
                    <Image
                      width={400}
                      height={476}
                      style={{ borderRadius: theme.spacing(1) }}
                      src={
                        listDetail?.data?.detailImage ||
                        "/uploads/images/default/detail.svg"
                      }
                      alt={listDetail?.data?.title ?? ""}
                    />
                  </StyledDetailImage>
                )}
              </Stack>
            </Box>

            {/* desc */}
            <Stack width="100%" position="relative" gap={3}>
              <Box width="100%">
                <Stack direction="row" justifyContent="space-between">
                  <Breadcrumb
                    breadcrumbs={breadcrumbs}
                    loading={isLoading}
                    backRoute={
                      isPC
                        ? `/${countrySlug}/ads/list/${listDetail?.data?.mainCategory?.slug}/${listDetail?.data?.subCategory?.slug}`
                        : `/${countrySlug}/ads/item-list/${listDetail?.data?.subCategory?.slug}`
                    }
                    detail
                  />
                  {isPC && (
                    <Box>
                      <SocialShare
                        item={listDetail?.data}
                        hashtag={listDetail?.data?.shareHashTag ?? ""}
                        title={listDetail?.data?.shareTitle ?? ""}
                        detail
                      />
                    </Box>
                  )}
                </Stack>

                {!isPC && (
                  <StyledDetailImage>
                    <Image
                      width={400}
                      height={400}
                      style={{ borderRadius: theme.spacing(1) }}
                      src={
                        listDetail?.data?.detailImage ||
                        "/uploads/images/default/detail.svg"
                      }
                      alt={listDetail?.data?.title ?? ""}
                    />
                  </StyledDetailImage>
                )}
              </Box>
              <Stack rowGap={3}>
                <Stack>
                  <DetailTitle as="h3">
                    {listDetail?.data?.title ?? ""}
                  </DetailTitle>
                </Stack>
                <Box
                  sx={(theme) => ({
                    background: theme.palette.colors.orange[250],
                    padding: 3,
                    borderRadius: 2,
                  })}
                >
                  <Box
                    component={"div"}
                    className="text-editor-view"
                    dangerouslySetInnerHTML={{
                      __html: listDetail?.data?.description,
                    }}
                    sx={{
                      color: gray[850],
                      "& a": { color: brand[400], textDecoration: "underline" },
                      "& ul, & ol": { paddingLeft: "40px" },
                      "& img": { width: "auto" },
                    }}
                  />
                </Box>
                {!isPC && (
                  <SocialShare
                    item={listDetail?.data}
                    hashtag={listDetail?.data?.shareHashTag ?? ""}
                    title={listDetail?.data?.shareTitle ?? ""}
                    detail
                    fullWidth
                    placement="bottom"
                  />
                )}
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>
    </UserLayout>
  );
};

export default ItemDetail;
