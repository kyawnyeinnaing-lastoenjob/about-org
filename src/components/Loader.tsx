import React from "react";

import { Box, CircularProgress } from "@mui/material";

import { red } from "./shared/themes/themePrimitives";

const Loader = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress
        size={30}
        sx={{
          color: red[500],
        }}
      />
    </Box>
  );
};

export default Loader;
