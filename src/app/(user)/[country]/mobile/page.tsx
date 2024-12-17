import * as React from "react";
import { NextPage } from "next";
import MobileCategoriesList from "@/components/pages/user/List/MobileCategoryList";
import { checkMaintenance } from "@/lib/settings";
import { redirect } from "next/navigation";

const CategoriesListPage: NextPage = async () => {
  const maintenance = await checkMaintenance();
  if (maintenance) {
    return redirect("/maintenance");
  }
  return <MobileCategoriesList />;
};

export default CategoriesListPage;
