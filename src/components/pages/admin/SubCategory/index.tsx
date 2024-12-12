"use client";
import React from "react";

import Layout from "@/components/layout/admin";

import SubCategoryTable from "./SubCategoryTable";

const SubCategory: React.FC = () => {
  const breadcrumbs = [
    {
      title: "Sub Category",
      link: null,
    },
  ];
  return (
    <Layout title="Sub Category" breadcrumbs={breadcrumbs}>
      <SubCategoryTable />
    </Layout>
  );
};

export default SubCategory;
