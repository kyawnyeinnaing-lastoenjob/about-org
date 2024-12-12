import React from "react";

import AdsLayoutContainer from "@/components/pages/user/List/AdsListLayoutContainer";

const JobLayout = (props: {
  children: React.ReactNode;
  categories: React.ReactNode;
  lists: React.ReactNode;
}) => {
  return (
    <AdsLayoutContainer
      categoriesLists={props.categories}
      lists={props.lists}
    />
  );
};

export default JobLayout;
