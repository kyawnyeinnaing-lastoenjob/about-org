"use client";
import React, { PropsWithChildren } from "react";

import Footer from "@/components/Footer";
import { dataDisplayUserCustomizations } from "@/components/shared/themes/user/customizations/dataDisplay";
import { inputsUserCustomizations } from "@/components/shared/themes/user/customizations/inputs";
import { layoutCustomizations } from "@/components/shared/themes/user/customizations/layout";
import { surfacesUserCustomizations } from "@/components/shared/themes/user/customizations/surfaces";
import AppTheme from "@/providers/AppTheme";
import { Stack } from "@mui/material";

import AppHeader from "./AppHeader";

interface LayoutProps extends PropsWithChildren {
  theme?: object;
  title?: string;
  breadcrumbs?: {
    title: string;
    link: string | null;
  }[];
}

const UserLayout: React.FC<LayoutProps> = ({
  // theme,
  // title,
  // breadcrumbs,
  children,
}) => {
  return (
    <AppTheme
      themeComponents={{
        ...dataDisplayUserCustomizations,
        ...layoutCustomizations,
        ...inputsUserCustomizations,
        ...surfacesUserCustomizations,
      }}
      mode="light"
      modeStorageKey="mode"
    >
      <AppHeader />
      <Stack
        component="main"
        direction="row"
        alignItems="flex-start"
        justifyContent="flex-start"
        sx={{
          mt: "72px",
          width: "100%",
          minHeight: {
            xs: "calc(100dvh - 298px - 20px)",
            lg: "calc(100dvh - 197px)",
          },
        }}
      >
        {children}
      </Stack>
      <Footer />
    </AppTheme>
  );
};

export default UserLayout;
