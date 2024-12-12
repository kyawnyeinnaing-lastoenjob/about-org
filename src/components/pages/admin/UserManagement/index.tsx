"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import Layout from "@/components/layout/admin";
import { useGetUser } from "@/lib/swr-services/user";

import UserTable from "./UserTable";

const UserManagement = () => {
  const router = useRouter();
  const { data: userData, isLoading } = useGetUser();
  const breadcrumbs = [
    {
      title: "User Management",
      link: null,
    },
  ];

  useEffect(() => {
    if (!isLoading) {
      if (!(userData?.data?.role?.roleName === "Super Admin")) {
        router.push("/admin/login");
      }
    }
  }, [isLoading]);

  return (
    <Layout title="User Management" breadcrumbs={breadcrumbs}>
      <UserTable />
    </Layout>
  );
};

export default UserManagement;
