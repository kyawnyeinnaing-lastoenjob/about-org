import { alpha, Components, Theme } from "@mui/material/styles";

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
              variant: "caption"
            },
            style: {
              color: gray[900],
              fontWeight: fontWeight.bold,
              fontSize: fontSize.lg
            }
          },
          {
            props: {
              variant: "body1"
            },
            style: {
              color: gray[900],
              fontWeight: fontWeight.regular,
              fontSize: fontSize.md
            }
          }
        ]
      }
    }
  },
  MuiList: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: "8px 0",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        ["&.search-list .search-list-item"]: {
          padding: 0
        },
        ["&.search-list"]: {
          "& span": {
            transition: "color .2s ease"
          },
          ["&:hover span"]: {
            color: theme.palette.colors.blue[900]
          }
        },
        ["& .search-list-item"]: {
          ["&:hover"]: {
            "& svg": {
              color: theme.palette.colors.blue[900]
            }
          },
          ["& .MuiListItemSecondaryAction-root"]: {
            right: 0,
            "& button": {
              width: "auto",
              height: "auto",
              padding: 0
            }
          }
        }
      })
    }
  },
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: "1px solid",
        borderRadius: theme.spacing(1),
        "&.item-btn": {
          border: "1px solid",
          backgroundColor: theme.palette.colors.blue[100],
          borderColor: theme.palette.colors.blue[350],
          ["&.Mui-selected"]: {
            backgroundImage: `linear-gradient(to right bottom, ${theme.palette.colors.blue[200]}, ${theme.palette.colors.blue[200]})`,
            ["& .MuiListItemText-primary, & .MuiSvgIcon-root"]: {
              color: theme.palette.colors.blue[600]
            }
          }
        },
        "&.sub-item-btn": {
          backgroundColor: theme.palette.colors.white,
          border: "1px solid transparent",
          ["&:hover"]: {
            backgroundColor: theme.palette.colors.blue[50]
          }
        },
        ["&:hover"]: {
          backgroundColor: alpha(theme.palette.colors.blue[400], 0.2),
          color: theme.palette.colors.blue[600],
          transition: "color .3s ease",
          ["& .MuiListItemText-primary"]: {
            color: theme.palette.colors.blue[600]
          },
          ["& .MuiListItemText-secondary"]: {
            color: theme.palette.colors.blue[600]
          },
          ["& .MuiChip-filled"]: {
            backgroundColor: theme.palette.colors.blue[600]
          }
        }
      })
    }
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: ({ theme }) => ({
        minWidth: 0,
        marginRight: theme.spacing(1)
      })
    }
  },
  MuiListItemText: {
    styleOverrides: {
      root: () => ({
        color: gray[900]
      })
    }
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
              variant: "filled"
            },
            style: {
              padding: "2px 4px",
              height: "100%",
              ["& .MuiChip-label"]: {
                padding: 0,
                fontSize: fontSize.xs
              }
            }
          }
        ]
      })
    }
  }
};
