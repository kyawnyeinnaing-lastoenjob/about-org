"use client";
import { PropsWithChildren } from "react";
import { Provider } from "jotai";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

import { SnackbarProvider } from "../context/snackbar";

import SWRConfigProvider from "./swrConfig";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <SnackbarProvider>
      <SWRConfigProvider>
        <Provider>{children}</Provider>
      </SWRConfigProvider>
      <ProgressBar
        height="4px"
        color="#D69C17"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </SnackbarProvider>
  );
}
