"use client";
import React from "react";
import Image from "next/image";

import ErrorUI from "@/components/Error";
import { Box } from "@mui/material";

const Maintain = () => {
  return (
    <ErrorUI
      icon={
        <Box
          sx={{
            width: {
              xs: "120px",
              lg: "240px",
            },
            height: {
              xs: "80px",
              lg: "160px",
            },
          }}
        >
          <Image
            width={100}
            height={100}
            alt="404 icon"
            src={"/error/maintain.svg"}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      }
      title="We Are Fixing Things Up for You!"
      desc="The system is currently now undergoing some maintenances and will be right back."
    />
  );
};

export default Maintain;
