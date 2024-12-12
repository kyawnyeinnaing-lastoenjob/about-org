"use client";
import React from "react";

import Layout from "@/components/layout/admin";

import CategoryTable from "./CategoryTable";

const Category: React.FC = () => {
  const breadcrumbs = [
    {
      title: "Category",
      link: null,
    },
  ];

  return (
    <Layout title="Category" breadcrumbs={breadcrumbs}>
      <CategoryTable />
    </Layout>
  );
};

export default Category;
