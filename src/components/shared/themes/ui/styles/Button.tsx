"use client";
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material";

import { fontSize, fontWeight } from "../../fontStyles";

export const StyledLoadingButton = styled(LoadingButton)(({ theme }) => ({
  width: "40px",
  height: "40px",
  justifyContent: "center",
  backgroundColor: theme.palette.colors.blue[50],
  border: "2px solid",
  borderColor: theme.palette.colors.blue[300],
  fontSize: fontSize.sm,
  fontWeight: fontWeight.regular,
  borderRadius: theme.spacing(2),
  color: theme.palette.colors.gray[900],
  [theme.breakpoints.up("md")]: {
    ["& .MuiLoadingButton-label"]: {
      marginLeft: "-5px",
    },
    width: "90px",
  },
}));
