"use client";
import * as React from "react";

import Layout from "@/components/layout/admin";

import MainGrid from "./MainGrid";

const Dashboard: React.FC = () => {
  const breadcrumbs = [
    {
      title: "Dashboard",
      link: null,
    },
  ];
  return (
    <Layout title="Overview" breadcrumbs={breadcrumbs}>
      <MainGrid />
    </Layout>
  );
};

export default Dashboard;
