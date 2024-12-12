import * as React from "react";

import Typography, { TypographyProps } from "@mui/material/Typography";

export default function Copyright(props: TypographyProps) {
  return (
    <Typography
      variant="body2"
      align="center"
      {...props}
      sx={[
        {
          color: "text.secondary",
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      {"Copyright © "}
      Admin Panel {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
