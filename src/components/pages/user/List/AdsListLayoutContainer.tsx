"use client";
import React from "react";
import dynamic from "next/dynamic";
import MediaQuery from "react-responsive";

import UserLayout from "@/components/layout/user";
import { Stack } from "@mui/material";

interface JobLayout {
  categoriesLists: React.ReactNode;
  lists: React.ReactNode;
}

const AdsLayoutContainer: React.FC<JobLayout> = ({
  categoriesLists,
  lists,
}) => {
  return (
    <UserLayout>
      <MediaQuery minWidth={1024}>
        {(matches) =>
          matches ? (
            <Stack
              direction="row"
              spacing={3}
              width="100%"
              alignItems="flex-start"
              justifyContent="flex-start"
              sx={{
                p: {
                  xs: "16px 16px",
                  sm: "16px 56px",
                  lg: "32px 104px",
                },
              }}
            >
              {categoriesLists}
              {lists}
            </Stack>
          ) : (
            categoriesLists
          )
        }
      </MediaQuery>
    </UserLayout>
  );
};

export default dynamic(() => Promise.resolve(AdsLayoutContainer), {
  ssr: false,
});
