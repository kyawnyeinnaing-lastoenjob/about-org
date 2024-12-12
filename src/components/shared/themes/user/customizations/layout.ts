import { Components, Theme } from "@mui/material/styles";

export const layoutCustomizations: Components<Theme> = {
  MuiImageList: {
    styleOverrides: {
      root: {
        overflow: "hidden",
      },
    },
  },
  MuiImageListItemBar: {
    styleOverrides: {
      root: {
        display: "flex",
        justifyContent: "center",
        background: "transparent",
        zIndex: 9,
        bottom: "10px",
        ["& .MuiImageListItemBar-title"]: {
          textAlign: " center",
        },
      },
    },
  },
};
