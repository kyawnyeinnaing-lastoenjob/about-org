import React from "react";
import { NextPage } from "next";

import Layout from "@/components/layout/user";
import Page404 from "@/components/pages/user/Page404/Page404";

const NotFoundPage: NextPage = () => {
  return (
    <Layout>
      <Page404 />
    </Layout>
  );
};

export default NotFoundPage;
