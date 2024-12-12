import React, { createContext, ReactNode, useState } from "react";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export interface DialogOptions {
  title?: string;
  content?: ReactNode;
  actions?: ReactNode | (() => ReactNode);
  onClose?: () => void;
}

export interface DialogContextProps {
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
}

export const DialogContext = createContext<DialogContextProps | undefined>(
  undefined,
);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogOptions, setDialogOptions] = useState<DialogOptions>({});

  const openDialog = (options: DialogOptions) => {
    setDialogOptions(options);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    if (dialogOptions.onClose) dialogOptions.onClose();
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        PaperProps={{
          elevation: 20,
        }}
      >
        {dialogOptions.title && (
          <DialogTitle align="center">{dialogOptions.title}</DialogTitle>
        )}
        <DialogContent>{dialogOptions.content}</DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
          }}
        >
          {typeof dialogOptions.actions === "function"
            ? dialogOptions.actions()
            : dialogOptions.actions}
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  );
};
