"use client";
import React from "react";
import { useAtom } from "jotai";

import { countrySlugAtom } from "@/components/layout/user/atoms";
import { useGetCategoriesByCountry } from "@/lib/swr-services/country";

// import { useGetSubCategoryByMainCategory } from '@/lib/swr-services/subCategory';
import ItemList from "./ItemList";

const LatestItemList: React.FC = () => {
  const [countrySlug] = useAtom(countrySlugAtom);

  const { data: mainCategoryData = [] } = useGetCategoriesByCountry({
    country: countrySlug,
  });

  const getMainCateSortNum = mainCategoryData?.filter(
    (category) => category.SubCategory[0],
  );
  const getFirstSubCate = getMainCateSortNum[0]?.SubCategory?.find(
    (each) => each._count.Listing > 0,
  );

  // .reduce((prev, current) => (prev.sortingNumber < current.sortingNumber ? prev : current), {
  //   sortingNumber: Infinity,
  //   slug: '',
  // });

  // const mainCategory = getFirstSubCate?.slug ?? '';

  // const { data: subCategoryData } = useGetSubCategoryByMainCategory({
  //   mainCategory,
  //   country: countrySlug,
  // });

  // const smallestItem = subCategoryData?.data?.reduce((prev, current) =>
  //   prev.sortingNumber < current.sortingNumber ? prev : current
  // );

  return <ItemList subCategorySlug={getFirstSubCate?.slug ?? ""} />;
};

export default LatestItemList;
