import React from "react";
import { Metadata, NextPage, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import ItemList from "@/components/pages/user/List/ItemList";
import NoDataUI from "@/components/pages/user/List/NoDataUI";
import { getMainCategoryBySlug } from "@/lib/services/mainCategory";
import {
  checkSubCategoryBySlug,
  getSubCategoryBySlug,
} from "@/lib/services/subCategory";
import { decodeSlug } from "@/utils";

interface PageProps {
  params: Promise<{
    country: string;
    mainCategorySlug: string;
    subCategorySlug: string;
  }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { country, mainCategorySlug, subCategorySlug } = await params;

  const result = await getSubCategoryBySlug(decodeSlug(subCategorySlug));
  const imgUrl = result.url ?? "";
  const previousImages = (await parent).openGraph?.images || [];
  // const currentImage = result.url ? [result.url] : [];

  const currentHeaders = await headers();
  const host = currentHeaders.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return {
    title: `${result?.title} | Shwe Charity`,
    description:
      "Shwe Charity right away. There will be everything you need Shwe Charity.",
    openGraph: {
      url: `${baseUrl}/${country}/ads/list/${decodeSlug(mainCategorySlug)}/${decodeSlug(subCategorySlug)}`,
      images: [imgUrl, ...previousImages],
    },
  };
}

const ListPages: NextPage<PageProps> = async (props) => {
  const { mainCategorySlug, subCategorySlug } = await props.params;
  const checkMainCateSlug = await getMainCategoryBySlug(
    decodeSlug(mainCategorySlug),
  );
  const checkSubCategory = await checkSubCategoryBySlug(
    decodeSlug(subCategorySlug),
  );

  if (!checkMainCateSlug) {
    return notFound();
  }

  if (!checkSubCategory) {
    return <NoDataUI />;
  }

  return <ItemList subCategorySlug={subCategorySlug} />;
};

export default ListPages;
