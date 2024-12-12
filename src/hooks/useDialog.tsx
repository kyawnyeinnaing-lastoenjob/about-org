import { useContext } from "react";

import { DialogContext, DialogContextProps } from "../context/dialog";

export const useDialog = (): DialogContextProps => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(
      "useGlobalDialog must be used within a GlobalDialogProvider",
    );
  }
  return context;
};
