import { alpha, Box, BoxProps, styled } from "@mui/material";

import { fontSize, fontWeight } from "../../fontStyles";

type StyledBoxProps = BoxProps & { component?: React.ElementType };
export const StyledBox = styled(
  ({ component = "div", ...props }: StyledBoxProps) => (
    <Box component={component} {...props} />
  ),
)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: "10px 16px",
  marginTop: theme.spacing(1),
  minWidth: 250,
  color: "rgb(55, 65, 81)",
  boxShadow: "0px 3px 8px 2px rgba(0,0,0,0.1)",
  backgroundColor: theme.palette.colors.white,
  ["& .MuiMenu-list"]: {
    padding: 0,
  },
  ["& .MuiMenuItem-root"]: {
    padding: "12px 16px",
    backgroundColor: theme.palette.colors.orange[200],
    marginBottom: "8px",
    ["& span"]: {
      marginLeft: theme.spacing(2),
    },
    ["&:first-of-type"]: {
      padding: 0,
      backgroundColor: "transparent",
    },
    ["& .MuiSvgIcon-root"]: {
      fontSize: 18,
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(1.5),
    },
    ["&:active"]: {
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.selectedOpacity,
      ),
    },
    ["& .share-btn"]: {
      display: "flex",
      alignItems: "center",
    },
  },
  ["& p"]: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: theme.palette.colors.blue[900],
  },
}));
