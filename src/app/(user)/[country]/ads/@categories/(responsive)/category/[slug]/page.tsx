import React from "react";
import { NextPage } from "next";

import SubCategories from "@/components/pages/user/List/SubCategories";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const SubCategoriesPage: NextPage<PageProps> = async (props) => {
  const { slug } = await props.params;
  return <SubCategories mainCategory={slug} />;
};

export default SubCategoriesPage;
