import React from "react";
import { Metadata, NextPage, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import ItemDetail from "@/components/pages/user/Detail/ItemDetail";
import {
  getListByIdWithCountry,
  getListingBySlug,
} from "@/lib/services/listing";
import { getMainCategoryBySlug } from "@/lib/services/mainCategory";
import { decodeSlug } from "@/utils";

interface PageProps {
  params: Promise<{
    country: string;
    mainCategorySlug: string;
    subCategorySlug: string;
    listSlug: string;
  }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { country, mainCategorySlug, subCategorySlug, listSlug } = await params;
  const result = await getListingBySlug(listSlug);
  const imgUrl = result?.seo?.meta?.url ?? "";
  const previousImages = (await parent).openGraph?.images || [];
  // const currentImage = result.seo.meta.url ? [result.seo.meta.url] : [];

  const currentHeaders = await headers();
  const host = currentHeaders.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return {
    title: `${result?.seo?.meta?.title} | Shwe Charity`,
    description: result?.seo?.meta?.description,
    openGraph: {
      url: `${baseUrl}/${country}/ads/list/${decodeSlug(mainCategorySlug)}/${decodeSlug(subCategorySlug)}`,
      images: [imgUrl, ...previousImages],
    },
  };
}

const ItemDetailsPages: NextPage<PageProps> = async (props) => {
  const { country, mainCategorySlug, subCategorySlug, listSlug } =
    await props.params;
  const checkMainCateSlug = await getMainCategoryBySlug(
    decodeSlug(mainCategorySlug),
  );
  const checkItemIsExit = await getListByIdWithCountry(
    decodeSlug(listSlug),
    decodeSlug(country),
  );

  if (!checkItemIsExit) {
    return redirect(`/${country}/ads`);
  }

  if (!checkMainCateSlug) {
    return notFound();
  }

  return <ItemDetail subCategorySlug={subCategorySlug} listSlug={listSlug} />;
};

export default ItemDetailsPages;
