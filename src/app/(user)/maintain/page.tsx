import React from "react";
import { NextPage } from "next";

import Layout from "@/components/layout/user";
import Maintain from "@/components/pages/user/Maintain/Maintain";

const MaintainPage: NextPage = () => {
  return (
    <Layout>
      <Maintain />
    </Layout>
  );
};

export default MaintainPage;
