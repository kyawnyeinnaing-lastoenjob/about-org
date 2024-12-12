"use client";
import { PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { SWRConfig } from "swr";
import { SWRDevTools } from "swr-devtools";

import { fetcher } from "@/lib/swr-services/fetcher";

import { useSnackbar } from "../hooks/useSnackbar";

export default function SWRConfigProvider({ children }: PropsWithChildren) {
  const { openSnackbar } = useSnackbar();
  const router = useRouter();
  return (
    <SWRDevTools>
      <SWRConfig
        value={{
          fetcher,
          revalidateOnFocus: false,
          onError: (error) => {
            if (error.code == "ERR_NETWORK") {
              openSnackbar(error.message, "error");
              router.push(`/no-internet`);
            } else {
              openSnackbar(
                error?.response?.data?.message || "Something went wrong!",
                "error",
              );
            }
            if (error.status === 500) {
              openSnackbar(error?.response?.data?.message, "error");
            } else if (error.status === 503) {
              openSnackbar(error?.response?.data?.message, "error");
              router.push(`/maintain`);
            }
          },
        }}
      >
        {children}
      </SWRConfig>
    </SWRDevTools>
  );
}
