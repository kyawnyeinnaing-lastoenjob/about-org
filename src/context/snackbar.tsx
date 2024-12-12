"use client";
import * as React from "react";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Alert, AlertColor } from "@mui/material";
import Fade from "@mui/material/Fade";
import Slide, { SlideProps } from "@mui/material/Slide";
import MuiSnackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { TransitionProps } from "@mui/material/transitions";

export interface SnackbarContextType {
  openSnackbar: (
    message: string,
    variant?: AlertColor,
    Transition?: React.ComponentType<TransitionProps>,
  ) => void;
}

interface State extends SnackbarOrigin {
  open: boolean;
  message: string;
  variant?: AlertColor | undefined;
  Transition: React.ComponentType<
    TransitionProps & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      children: React.ReactElement<unknown, any>;
    }
  >;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

export const SnackbarContext = React.createContext<
  SnackbarContextType | undefined
>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = React.useState<State>({
    open: false,
    message: "",
    variant: "info",
    vertical: "top",
    horizontal: "center",
    Transition: Fade,
  });

  const openSnackbar = (message: string, variant?: AlertColor) => {
    setState({
      open: true,
      message,
      variant,
      vertical: "top",
      horizontal: "center",
      Transition: SlideTransition,
    });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const getIcon = () => {
    switch (state.variant) {
      case "success":
        return {
          icon: <DoneAllIcon />,
        };
    }
  };

  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      {children}
      <MuiSnackbar
        anchorOrigin={{
          vertical: state.vertical,
          horizontal: state.horizontal,
        }}
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        message={state.message}
        autoHideDuration={3000}
      >
        <Alert
          severity={state.variant}
          variant="filled"
          icon={getIcon()?.icon}
          sx={{
            borderRadius: "30px",
            minWidth: "auto",
            padding: "0 12px",
            fontSize: "12px",
            "& .MuiAlert-icon": {
              marginRight: "7px",
              "& svg": {
                width: "18px",
                height: "18px",
              },
            },
          }}
        >
          {state.message}
        </Alert>
      </MuiSnackbar>
    </SnackbarContext.Provider>
  );
};
