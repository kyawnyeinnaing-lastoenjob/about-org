import React, { PropsWithChildren } from "react";

import { Box } from "@mui/material";

const ListMobileLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      sx={{
        width: "100%",
        p: {
          xs: "8px 16px",
          sm: "8px 56px",
          lg: "8px 104px",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default ListMobileLayout;
