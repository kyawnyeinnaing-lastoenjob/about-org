"use client";
import React from "react";

import { Backdrop, CircularProgress } from "@mui/material";

const PageLoading = () => {
  return (
    <Backdrop
      sx={(theme) => ({
        color: "#fff",
        zIndex: theme.zIndex.drawer + 1,
        m: "0 !important",
      })}
      open
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default PageLoading;
