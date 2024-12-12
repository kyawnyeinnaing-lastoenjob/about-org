import { alpha, Components, Theme } from "@mui/material/styles";

import { gray } from "../../themePrimitives";

export const inputsUserCustomizations: Components<Theme> = {
  MuiTextField: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: "16px",
        ["&.search"]: {
          ["& label"]: {
            color: gray[500],
            marginLeft: theme.spacing(4),
            transform: "translate(14px, 0px) scale(1)",
            marginBottom: 0,
            ["&.MuiInputLabel-root.Mui-focused"]: {
              transform: "translate(14px, -14px) scale(0.75)",
            },
            ["&.MuiInputLabel-root.MuiInputLabel-shrink"]: {
              transform: "translate(14px, -14px) scale(0.75)",
            },
          },
          ["& input, &:hover, &:focus"]: {
            padding: 0,
            border: "none",
            outline: "none",
          },
          ["& button"]: {
            padding: 0,
            height: "auto",
            width: "auto",
            border: 0,
          },
        },
      }),
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        ["& fieldset"]: {
          borderColor: "transparent",
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        ["&.Mui-focused fieldset.MuiOutlinedInput-notchedOutline"]: {
          borderColor: "transparent",
        },
        ["&:hover fieldset.MuiOutlinedInput-notchedOutline"]: {
          borderColor: "transparent",
        },
      },
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: "none",
        borderRadius: theme.shape.borderRadius,
        textTransform: "none",
        fontWeight: theme.typography.fontWeightMedium,
        letterSpacing: 0,
        color: theme.palette.text.primary,
        border: "1px solid ",
        borderColor: gray[200],
        backgroundColor: alpha(gray[50], 0.3),
        "&:hover": {
          backgroundColor: gray[100],
          borderColor: gray[300],
        },
        "&:active": {
          backgroundColor: gray[200],
        },
        ...theme.applyStyles("dark", {
          backgroundColor: gray[800],
          borderColor: gray[700],
          "&:hover": {
            backgroundColor: gray[900],
            borderColor: gray[600],
          },
          "&:active": {
            backgroundColor: gray[900],
          },
        }),
        variants: [
          {
            props: {
              size: "small",
            },
            style: {
              width: "2.25rem",
              height: "2.25rem",
              border: 0,
              padding: 0,
            },
          },
          {
            props: {
              size: "medium",
            },
            style: {
              width: "2.5rem",
              height: "2.5rem",
            },
          },
        ],
      }),
    },
  },
};
