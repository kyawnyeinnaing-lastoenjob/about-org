"use client";
import * as React from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import MediaQuery from "react-responsive";

import { countrySlugAtom } from "@/components/layout/user/atoms";
import { fontSize } from "@/components/shared/themes/fontStyles";
import { useGetCategoriesByCountry } from "@/lib/swr-services/country";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Skeleton, useTheme } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import MainCategoryListItem from "./MainCategoryListItem";

const CategoriesList: React.FC = () => {
  const [countrySlug] = useAtom(countrySlugAtom);
  const [selectedMainCate, setSelectedMainCate] = React.useState("");

  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const slug = params?.mainCategorySlug;

  const { data: mainCategories, isLoading } = useGetCategoriesByCountry({
    country: countrySlug,
  });

  const filteredData = mainCategories
    ?.map((mainCategory) => ({
      ...mainCategory,
      SubCategory: mainCategory.SubCategory.filter(
        (subCategory) => subCategory._count.Listing > 0,
      ),
    }))
    .filter((mainCategory) => mainCategory.SubCategory.length > 0);

  React.useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <MediaQuery minWidth={1024}>
      {(matches) =>
        matches ? (
          <List
            sx={{ width: "100%", maxWidth: 290, rowGap: 1 }}
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
                  ?.map((category, index) => {
                    return (
                      <MainCategoryListItem
                        key={index}
                        category={category}
                        open={
                          category?.slug === selectedMainCate ||
                          category?.slug === slug
                        }
                        onClick={(slug) => setSelectedMainCate(slug)}
                      />
                    );
                  })}
          </List>
        ) : (
          <List
            sx={(theme) => ({
              width: "100%",
              p: { xs: "32px 16px", sm: "32px 56px", lg: "32px 104px" },
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
              : filteredData
                  ?.filter((item) => item?.SubCategory?.length > 0)
                  ?.map((category, index) => (
                    <Link
                      href={`/${countrySlug}/ads/category/${category?.slug}`}
                      key={index}
                    >
                      <ListItemButton className="item-btn">
                        <Image
                          width={32}
                          height={32}
                          src={
                            category?.categoryImage ||
                            "/uploads/images/default/main-category.svg"
                          }
                          alt="icon"
                          style={{
                            borderRadius: theme.spacing(1),
                            marginRight: "8px",
                          }}
                        />
                        <ListItemText
                          primaryTypographyProps={{
                            style: {
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              WebkitLineClamp: 2,
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
        )
      }
    </MediaQuery>
  );
};

export default CategoriesList;
