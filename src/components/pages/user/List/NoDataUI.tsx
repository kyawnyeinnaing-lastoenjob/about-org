import React from "react";
import Image from "next/image";

import ErrorUI from "@/components/Error";
import { Box } from "@mui/material";

const NoDataUI = () => {
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <ErrorUI
        icon={
          <Box
            sx={{
              width: { xs: "120px", lg: "240px" },
              height: { xs: "80px", lg: "160px" },
            }}
          >
            <Image
              width={100}
              height={100}
              alt="404 icon"
              src={"/error/no-list-item.svg"}
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        }
        title="The List is Empty!"
        desc="No data available for display at the moment."
      />
    </Box>
  );
};

export default NoDataUI;
