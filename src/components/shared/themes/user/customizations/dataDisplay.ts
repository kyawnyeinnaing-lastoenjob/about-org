import { Components, Theme } from "@mui/material/styles";

import { fontSize, fontWeight } from "../../fontStyles";
import { gray } from "../../themePrimitives";

export const dataDisplayUserCustomizations: Components<Theme> = {
  MuiTypography: {
    styleOverrides: {
      root: {
        color: gray[900],
        fontSize: fontSize.md,
        fontWeight: fontWeight.regular,
        lineHeight: "23px",
        variants: [
          {
            props: {
              variant: "caption",
            },
            style: {
              color: gray[900],
              fontWeight: fontWeight.bold,
              fontSize: fontSize.lg,
            },
          },
          {
            props: {
              variant: "body1",
            },
            style: {
              color: gray[900],
              fontWeight: fontWeight.regular,
              fontSize: fontSize.md,
            },
          },
        ],
      },
    },
  },
  MuiList: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: "8px 0",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        ["&.search-list .search-list-item"]: {
          padding: 0,
        },
        ["&.search-list"]: {
          "& span": {
            transition: "color .2s ease",
          },
          ["&:hover span"]: {
            color: theme.palette.colors.orange[900],
          },
        },
        ["& .search-list-item"]: {
          ["&:hover"]: {
            "& svg": {
              color: theme.palette.colors.orange[900],
            },
          },
          ["& .MuiListItemSecondaryAction-root"]: {
            right: 0,
            "& button": {
              width: "auto",
              height: "auto",
              padding: 0,
            },
          },
        },
      }),
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: "1px solid transparent",
        borderRadius: theme.spacing(1),
        "&.item-btn": {
          border: "none",
          backgroundColor: theme.palette.colors.orange[100],
          borderColor: theme.palette.colors.orange[350],
          ["&.Mui-selected"]: {
            backgroundImage: `linear-gradient(to right bottom, ${theme.palette.colors.orange[900]}, ${theme.palette.colors.orange[900]})`,
            ["& .MuiListItemText-primary, & .MuiSvgIcon-root"]: {
              color: theme.palette.colors.white,
            },
          },
        },
        "&.sub-item-btn": {
          backgroundColor: theme.palette.colors.white,
          border: "1px solid theme.palette.colors.orange[900]",
        },
        ["&:hover"]: {
          border: `1px solid ${theme.palette.colors.orange[900]}`,
          color: theme.palette.colors.black,
          transition: "color .3s ease",
          ["& .MuiListItemText-primary"]: {
            color: theme.palette.colors.black,
          },
          ["& .MuiListItemText-secondary"]: {
            color: theme.palette.colors.black,
          },
        },
      }),
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: ({ theme }) => ({
        minWidth: 0,
        marginRight: theme.spacing(1),
      }),
    },
  },
  MuiListItemText: {
    styleOverrides: {
      root: () => ({
        color: gray[900],
      }),
    },
  },

  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: gray[400],
        color: theme.palette.colors.white,
        minWidth: 22,
        minHeight: 22,
        variants: [
          {
            props: {
              variant: "filled",
            },
            style: {
              padding: "2px 4px",
              height: "100%",
              ["& .MuiChip-label"]: {
                padding: 0,
                fontSize: fontSize.xs,
              },
            },
          },
        ],
      }),
    },
  },
};
