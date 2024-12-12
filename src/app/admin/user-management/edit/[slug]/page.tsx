import React from "react";
import { NextPage } from "next";

import UpdateUser from "@/components/pages/admin/UserManagement/Update/UpdateUser";

interface UpdateUserPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const UpdateUserPage: NextPage<UpdateUserPageProps> = async ({ params }) => {
  const { slug } = await params;
  return <UpdateUser id={slug} />;
};

export default UpdateUserPage;
