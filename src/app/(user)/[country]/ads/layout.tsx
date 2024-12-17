import React from "react";
import { redirect } from "next/navigation";

import AdsLayoutContainer from "@/components/pages/user/List/AdsListLayoutContainer";
import { checkMaintenance } from "@/lib/settings";

const JobLayout = async (props: {
  children: React.ReactNode;
  categories: React.ReactNode;
  lists: React.ReactNode;
}) => {
  const maintenance = await checkMaintenance();
  if (maintenance) {
    return redirect("/maintenance");
  }
  return (
    <AdsLayoutContainer
      categoriesLists={props.categories}
      lists={props.lists}
    />
  );
};

export default JobLayout;
