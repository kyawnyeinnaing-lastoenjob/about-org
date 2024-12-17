"use client";
import React from "react";

import Layout from "@/components/layout/admin";

import SettingTable from "./SettingTable";

const Setting: React.FC = () => {
  const breadcrumbs = [
    {
      title: "Setting",
      link: null,
    },
  ];

  return (
    <Layout title="Setting" breadcrumbs={breadcrumbs}>
      <SettingTable />
    </Layout>
  );
};

export default Setting;
