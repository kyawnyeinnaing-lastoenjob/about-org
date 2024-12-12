import { styled, Typography } from "@mui/material";

import { fontSize, fontWeight } from "../../fontStyles";

export const DetailTitle = styled(Typography)(({ theme }) => ({
  marginTop: 3,
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
  color: theme.palette.colors.white,
  [theme.breakpoints.up("lg")]: {
    fontSize: fontSize.lg,
  },
  // display: { lg: 'none' },
}));

export const CardContentTitle = styled(Typography)(({ theme }) => ({
  fontWeight: fontWeight.regular,
  fontSize: fontSize.md,
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  WebkitLineClamp: 2,
  marginBottom: theme.spacing(1),
  [theme.breakpoints.up("md")]: {
    WebkitLineClamp: 2,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.lg,
    marginBottom: theme.spacing(2),
  },
}));

export const CardContentDesc = styled(Typography)(({ theme }) => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  WebkitLineClamp: 2,
  [theme.breakpoints.down("sm")]: {
    fontSize: fontSize.sm,
  },
}));
