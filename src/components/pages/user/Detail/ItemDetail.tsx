"use client";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import Image from "next/image";

import Breadcrumb from "@/components/Breadcrumb";
import UserLayout from "@/components/layout/user";
import { countrySlugAtom, isSearchAtom } from "@/components/layout/user/atoms";
import { fontWeight } from "@/components/shared/themes/fontStyles";
import { brand, gray } from "@/components/shared/themes/themePrimitives";
import { DetailTitle } from "@/components/shared/themes/ui/styles/Typography";
import SocialShare from "@/components/SocialShare";
import { useGetListByCountrySlug } from "@/lib/swr-services/listing";
import {
  Box,
  Skeleton,
  Stack,
  styled,
  Typography,
  useMediaQuery as useMuiMediaQuery,
  useTheme,
} from "@mui/material";

interface ItemDetailProps {
  subCategorySlug: string;
  listSlug: string;
}

const StyledDetailImage = styled(Box)(({ theme }) => ({
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
    // [theme.breakpoints.down('xs')]: {
    //   width: 325,
    //   height: 325,
    //   aspectRatio: 1 / 1,
    //   objectFit: 'cover',
    // },
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
      // color: 'white',
    },
    {
      title: `${listDetail?.data?.subCategory?.name ?? ""}`,
      link: isPC
        ? `/${countrySlug}/ads/list/${listDetail?.data?.mainCategory?.slug}/${listDetail?.data?.subCategory?.slug}`
        : `/${countrySlug}/ads/item-list/${listDetail?.data?.subCategory?.slug}`,
      // color: 'white',
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

  return (
    <UserLayout>
      <Stack width="100%">
        <Box
          width="100%"
          height="400px"
          p={{ xs: "24px 16px", sm: "24px 56px", lg: "24px 104px" }}
          //? no needed detail banner bg for shwe charity
          // sx={{
          //   background: {
          //     xs: "url('/uploads/mobile-detail-banner.svg') no-repeat center / cover",
          //     lg: "url('/uploads/detail-banner.svg') no-repeat center / cover",
          //   },
          // }}
        >
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
        </Box>

        <Stack
          p={{ xs: "8px 16px", sm: "8px 56px", md: "8px 104px" }}
          gap={3}
          direction={{ sm: "column", lg: "row-reverse" }}
          justifyContent="space-between"
          sx={(theme) => ({
            width: "100%",
            [theme.breakpoints.up("lg")]: { marginTop: "-21.8%" },
          })}
        >
          <Box mt={{ xs: "-85%", sm: "-40%", lg: 0 }}>
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                sx={(theme) => ({
                  borderRadius: theme.spacing(2),
                  width: { xs: "200px", lg: "350px" },
                  height: { xs: "200px", lg: "350px" },
                  m: { xs: "-110px auto 0", lg: "-176px auto 0" },
                  background: gray[100],
                })}
              />
            ) : (
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
              </Stack>
            )}
          </Box>
          <Stack width="100%" position="relative">
            {isLoading && (
              <Skeleton
                variant="rectangular"
                sx={(theme) => ({
                  borderRadius: theme.spacing(2),
                  width: "100%",
                  height: "200px",
                  background: gray[200],
                })}
              />
            )}

            {!isLoading && listDetail?.data?.description && (
              <Stack>
                <Stack>
                  <Box
                    sx={{
                      borderRadius: theme.spacing(3),
                      background: {
                        xs: `url('/uploads/detail-desc-bg-mobile.svg') no-repeat center / cover`,
                        md: `url('/uploads/detail-desc-bg.svg') no-repeat center / cover`,
                      },
                      pt: "14px",
                      px: { xs: 2, md: 3 },
                      pb: 4,
                    }}
                  >
                    <DetailTitle as="h3">
                      {listDetail?.data?.title ?? ""}
                    </DetailTitle>
                  </Box>
                  {isPC && (
                    <Box
                      sx={{ position: "absolute", right: 0, top: "-4.5rem" }}
                    >
                      <SocialShare
                        item={listDetail?.data}
                        hashtag={listDetail?.data?.shareHashTag ?? ""}
                        title={listDetail?.data?.shareTitle ?? ""}
                        detail
                      />
                    </Box>
                  )}
                </Stack>
                <Box
                  sx={(theme) => ({
                    background: theme.palette.colors.blue[50],
                    padding: { xs: 2, md: 3 },
                    borderRadius: theme.spacing(3),
                    mt: -4,
                  })}
                >
                  <Box
                    component={"div"}
                    className="text-editor-view"
                    dangerouslySetInnerHTML={{
                      __html: listDetail?.data?.description,
                    }}
                    sx={{
                      minHeight: "285px",
                      color: gray[850],
                      "& p": { lineHeight: "28px" },
                      "& a": { color: brand[400], textDecoration: "underline" },
                      "& ul, & ol": { paddingLeft: "40px" },
                      "& img": { width: "auto" },
                    }}
                  />
                </Box>
                <Typography
                  sx={(theme) => ({
                    display: "flex",
                    alignItems: "center",
                    background: theme.palette.colors.blue[50],
                    px: 2,
                    py: 1,
                    borderRadius: theme.spacing(3),
                    my: 2,
                    minWidth: { xs: "100%", md: "300px" },
                    mx: "auto",
                    "& span": {
                      ml: theme.spacing(1),
                      color: theme.palette.colors.blue[800],
                      fontSize: "13px",
                      fontWeight: fontWeight.regular,
                      [theme.breakpoints.up("lg")]: {},
                    },
                  })}
                >
                  <Image
                    src="/uploads/icons/date.svg"
                    alt="date icon"
                    width={20}
                    height={20}
                  />
                  <span>
                    Last updated on{" "}
                    {dayjs(listDetail?.data?.updatedAt).format(
                      "DD MMM YYYY, HH:mm",
                    )}
                  </span>
                </Typography>
                {!isPC && (
                  <SocialShare
                    item={listDetail?.data}
                    hashtag={listDetail?.data?.shareHashTag ?? ""}
                    title={listDetail?.data?.shareTitle ?? ""}
                    detail
                    fullWidth
                  />
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </UserLayout>
  );
};

export default ItemDetail;
