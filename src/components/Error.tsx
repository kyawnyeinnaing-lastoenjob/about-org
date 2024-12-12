import React from "react";

import { Stack, Typography } from "@mui/material";

import { gray } from "./shared/themes/themePrimitives";

interface ErrorUIProps {
  icon?: React.ReactNode;
  title?: string;
  desc?: string;
  btn?: React.ReactNode;
}

const ErrorUI: React.FC<ErrorUIProps> = ({ icon, title, desc, btn }) => {
  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        width: "100% !important",
        height: {
          xs: "calc(100dvh - 298px - 71px)",
          lg: "calc(100dvh - 197px)",
        },
        flexGrow: 1,
        flexDirection: "column",
      }}
    >
      <Stack
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          width: "60%",
          rowGap: {
            xs: "16px",
            lg: "40px",
          },
        }}
      >
        {icon && icon}
        <Stack>
          {title && (
            <Typography
              variant="body1"
              sx={{
                color: gray[500],
                textAlign: "center",
                marginBottom: "4px",
                fontWeight: "bold",
              }}
            >
              {" "}
              {title}{" "}
            </Typography>
          )}
          {desc && (
            <Typography
              variant="body1"
              sx={{
                color: gray[500],
                textAlign: "center",
              }}
            >
              {" "}
              {desc}{" "}
            </Typography>
          )}
        </Stack>
        {btn && btn}
      </Stack>
    </Stack>
  );
};

export default ErrorUI;
