import React from "react";
import { Metadata, NextPage } from "next";

import LatestItemList from "@/components/pages/user/List/LatestItemList";

export const metadata: Metadata = {
  title: "Home | Shwe Charity",
  description:
    "Shwe Charity right away. There will be everything you need Shwe Charity.",
  openGraph: {
    images: [
      "https://shwecharity-production.s3.ap-southeast-1.amazonaws.com/SEO+image.png",
      "/uploads/images/logo/logo-1200x630.png",
    ],
  },
};

// get listing with last main category
const ListPages: NextPage = async () => {
  return <LatestItemList />;
};

export default ListPages;
