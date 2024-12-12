"use client";
import React from "react";

import Layout from "@/components/layout/admin";

import ListingTable from "./ListingTable";

const Listing: React.FC = () => {
  const breadcrumbs = [
    {
      title: "Listing",
      link: null,
    },
  ];
  return (
    <Layout title="Listing" breadcrumbs={breadcrumbs}>
      <ListingTable />
    </Layout>
  );
};

export default Listing;
