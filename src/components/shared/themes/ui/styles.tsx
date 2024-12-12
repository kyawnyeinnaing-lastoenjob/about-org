import { LoadingButton } from "@mui/lab";
import {
  alpha,
  Stack,
  StackProps,
  styled,
  Switch,
  SwitchProps,
} from "@mui/material";

import { gray } from "../themePrimitives";

export const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#65C466",
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "#2ECA45",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));

export const TableWrapStyled = styled(Stack)<StackProps>({
  "& .table-top-toolbar-wrap > div:last-child": {
    "& .MuiBox-root": {
      "& button": {
        marginRight: "10px",
        "&:last-child": {
          marginRight: 0,
        },
      },
    },
  },

  "& .MuiCheckbox-root": {
    width: 20,
    height: 20,
  },
  "& .MuiTableCell-head .MuiInputAdornment-root": {
    maxHeight: "none",
  },
});

export const LoadingButtonStyled = styled(LoadingButton)(({ theme }) => ({
  minWidth: "2.5rem",
  width: "2.5rem",
  height: "2.5rem",
  backgroundColor: alpha(gray[50], 0.3),
  border: "1px solid ",
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
}));