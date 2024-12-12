"use client";
import * as React from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import UserLayout from "@/components/layout/user";
import { countrySlugAtom } from "@/components/layout/user/atoms";
import { checkCountryChangeAtom } from "@/components/pages/user/atoms";
import { fontSize } from "@/components/shared/themes/fontStyles";
import { useGetCategoriesByCountry } from "@/lib/swr-services/country";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Skeleton } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

const CategoriesList: React.FC = () => {
  const [countrySlug] = useAtom(countrySlugAtom);
  const [, setCheckCountryChange] = useAtom(checkCountryChangeAtom);

  const router = useRouter();

  const { data: mainCategories, isLoading } = useGetCategoriesByCountry({
    country: countrySlug,
  });

  React.useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <UserLayout>
      <List
        sx={(theme) => ({
          width: "100%",
          p: {
            xs: "8px 16px",
            sm: "8px 56px",
            lg: "8px 104px",
          },
          rowGap: theme.spacing(1),
        })}
        component="nav"
        aria-labelledby="nested-list-subheader"
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
          : mainCategories
              ?.filter((item) => item?.SubCategory?.length > 0)
              ?.map((category, index) => (
                <Link
                  href={`/${countrySlug}/ads/category/${category?.slug}`}
                  key={index}
                  onClick={() => setCheckCountryChange(false)}
                >
                  <ListItemButton
                    sx={(theme) => ({
                      bgcolor: theme.palette.colors.blue[50],
                      border: "none",
                    })}
                  >
                    <Image
                      width={32}
                      height={32}
                      src={
                        category?.categoryImage ||
                        "/uploads/images/default/main-category.svg"
                      }
                      alt="icon"
                      style={{ borderRadius: "50%", marginRight: "8px" }}
                    />

                    <ListItemText
                      primaryTypographyProps={{
                        style: {
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: 2,
                        },
                      }}
                      sx={{
                        "& span": {
                          fontSize: fontSize.sm,
                        },
                      }}
                      primary={category?.name}
                    />
                    <ChevronRightIcon
                      sx={(theme) => ({
                        color: theme.palette.grey[600],
                        ml: 1,
                      })}
                    />
                  </ListItemButton>
                </Link>
              ))}
      </List>
    </UserLayout>
  );
};

export default CategoriesList;
