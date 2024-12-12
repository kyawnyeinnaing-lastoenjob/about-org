"use client";
import React from "react";

import Layout from "@/components/layout/admin";

import CountryTable from "./CountryTable";

const Country: React.FC = () => {
  const breadcrumbs = [
    {
      title: "Country",
      link: null,
    },
  ];
  return (
    <Layout title="Country" breadcrumbs={breadcrumbs}>
      <CountryTable />
    </Layout>
  );
};

export default Country;
