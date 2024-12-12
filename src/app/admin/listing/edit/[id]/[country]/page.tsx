import React from "react";
import { NextPage } from "next";

import UpdateListingItem from "@/components/pages/admin/Listing/Update";

interface PageProps {
  params: Promise<{
    id: string;
    country: string;
  }>;
}

const UpdateListingItemPage: NextPage<PageProps> = async ({ params }) => {
  const { id, country } = await params;

  return <UpdateListingItem id={id} country={country} />;
};

export default UpdateListingItemPage;
