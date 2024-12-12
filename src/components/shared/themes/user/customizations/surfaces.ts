import { Components, Theme } from "@mui/material/styles";

export const surfacesUserCustomizations: Components<Theme> = {
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "none",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(3),
        border: "0.5px solid",
        borderColor: theme.palette.colors.blue[50],
        borderRadius: theme.spacing(2),
        backgroundColor: theme.palette.colors.blue[50],
        transition: "background .3s ease, box-shadow .3s ease, border .3s ease",
        height: "130px",
        [theme.breakpoints.up("md")]: {
          height: "165px",
        },
        ["&:hover"]: {
          borderColor: theme.palette.colors.blue[300],
          backgroundColor: theme.palette.colors.white,
          boxShadow: `0px 3px 10px 0px rgba(0,0,0,0.1)`,
        },
      }),
    },
  },
  MuiCardActionArea: {
    styleOverrides: {
      root: () => ({
        height: "100%",
        ["& img"]: {
          aspectRatio: "1 / 1",
        },
      }),
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: "0 !important",
        paddingLeft: "16px !important",
        // padding: '10px 10px !important',
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        [theme.breakpoints.up("md")]: {
          width: "100%",
          paddingLeft: "24px !important",
          // padding: '10px 0 10px 10px !important',
        },
      }),
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 0,
        ["& .icon-btn"]: {
          width: "auto",
          height: "auto",
          marginLeft: 0,
          padding: "10px",
        },
      },
    },
  },
};
