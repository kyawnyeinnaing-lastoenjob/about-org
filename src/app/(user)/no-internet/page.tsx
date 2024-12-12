import React from "react";
import { NextPage } from "next";

import Layout from "@/components/layout/user";
import NoInternet from "@/components/pages/user/NoInternet/NoInternet";

const MaintainPage: NextPage = () => {
  return (
    <Layout>
      <NoInternet />
    </Layout>
  );
};

export default MaintainPage;
