"use client";
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material";

import { fontWeight } from "../../fontStyles";

export const StyledLoadingButton = styled(LoadingButton)(({ theme }) => ({
  width: "40px",
  height: "40px",
  justifyContent: "center",
  backgroundColor: theme.palette.colors.white,
  border: "1px solid",
  borderColor: theme.palette.colors.orange[350],
  fontSize: theme.spacing(2),
  fontWeight: fontWeight.regular,
  borderRadius: "10px",
  color: theme.palette.colors.gray[900],
  [theme.breakpoints.up("md")]: {
    ["& .MuiLoadingButton-label"]: {
      marginLeft: "-5px"
    },
    width: "80px"
  }
}));
