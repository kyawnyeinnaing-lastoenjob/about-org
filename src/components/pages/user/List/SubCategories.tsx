"use client";
import React, { useEffect } from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MediaQuery from "react-responsive";

import Breadcrumb from "@/components/Breadcrumb";
import { countrySlugAtom } from "@/components/layout/user/atoms";
import { fontSize } from "@/components/shared/themes/fontStyles";
import { useGetSubCategoryByMainCategory } from "@/lib/swr-services/subCategory";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Box,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
} from "@mui/material";

import { checkCountryChangeAtom } from "../atoms";

interface SubCategoriesProps {
  mainCategory: string;
}

const SubCategories: React.FC<SubCategoriesProps> = ({ mainCategory }) => {
  const [checkCountryChange] = useAtom(checkCountryChangeAtom);
  const [countrySlug] = useAtom(countrySlugAtom);

  const router = useRouter();
  const { data: subCategoryData, isLoading } = useGetSubCategoryByMainCategory({
    country: countrySlug ?? "",
    mainCategory,
  });

  const breadcrumbs = [
    {
      title: `${subCategoryData?.meta?.mainCategory?.name}`,
      link: null,
    },
  ];

  useEffect(() => {
    if (checkCountryChange) {
      if (subCategoryData?.data?.length === 0) {
        router.push(`/${countrySlug}/mobile`);
      }
    }
  }, [subCategoryData, router, countrySlug, checkCountryChange]);

  return (
    <MediaQuery minWidth={1200}>
      {(matches) =>
        !matches ? (
          <Box
            sx={() => ({
              p: {
                xs: "8px 16px",
                sm: "8px 56px",
                lg: "8px 104px",
              },
              width: "100%",
            })}
          >
            <Stack sx={{ margin: "8px 0" }}>
              {isLoading ? (
                <Skeleton
                  variant="rectangular"
                  height={50}
                  sx={(theme) => ({
                    width: "50%",
                    borderRadius: theme.spacing(2),
                  })}
                />
              ) : (
                <Breadcrumb
                  breadcrumbs={breadcrumbs}
                  backRoute={`/${countrySlug}/mobile`}
                />
              )}
            </Stack>
            <List
              component="div"
              disablePadding
              sx={(theme) => ({
                width: "100%",
                rowGap: theme.spacing(1),
              })}
            >
              {isLoading
                ? [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                    <Skeleton
                      key={index}
                      variant="rectangular"
                      height={50}
                      sx={(theme) => ({
                        width: "100%",
                        borderRadius: theme.spacing(2),
                      })}
                    />
                  ))
                : subCategoryData?.data
                    ?.filter((each) => each?._count?.Listing > 0)
                    ?.map((each, index) => (
                      <Link
                        href={`/${countrySlug}/ads/item-list/${each.slug}`}
                        key={index}
                      >
                        <ListItemButton
                          sx={(theme) => ({
                            pl: 2,
                            bgcolor: theme.palette.colors.blue[50],
                            border: "none",
                          })}
                          key={index}
                        >
                          <Image
                            width={32}
                            height={32}
                            src={
                              each?.subCategoryImage ||
                              "/uploads/images/default/sub-category.svg"
                            }
                            alt="icon"
                            style={{
                              marginRight: "8px",
                              borderRadius: "50%",
                            }}
                          />

                          <ListItemText
                            secondaryTypographyProps={{
                              sx: {
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 2,
                                fontSize: fontSize.sm,
                              },
                            }}
                            secondary={each?.name}
                          />
                          <Stack
                            direction="row"
                            alignItems="center"
                            sx={{
                              position: "relative",
                            }}
                          >
                            <Chip
                              label={each?._count?.Listing}
                              variant="filled"
                            />
                            <ChevronRightIcon
                              sx={(theme) => ({
                                color: theme.palette.grey[600],
                                ml: 1,
                              })}
                            />
                          </Stack>
                        </ListItemButton>
                      </Link>
                    ))}
            </List>
          </Box>
        ) : (
          <></>
        )
      }
    </MediaQuery>
  );
};

export default SubCategories;
