"use client";
import React from "react";

import Layout from "@/components/layout/admin";

import BinTable from "./BinTable";

const Bin: React.FC = () => {
  const breadcrumbs = [
    {
      title: "Category",
      link: "/admin/category",
    },
    {
      title: "Bin",
      link: null,
    },
  ];
  return (
    <Layout title="Bin" breadcrumbs={breadcrumbs}>
      <BinTable />
    </Layout>
  );
};

export default Bin;