import React from "react";
import { NextPage } from "next";

import ListMobileLayout from "@/components/layout/user/ListMobileLayout";
import ItemList from "@/components/pages/user/List/ItemList";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const CategoriesPage: NextPage<PageProps> = async (props) => {
  const { slug } = await props.params;
  return (
    <ListMobileLayout>
      <ItemList subCategorySlug={slug} />
    </ListMobileLayout>
  );
};

export default CategoriesPage;
