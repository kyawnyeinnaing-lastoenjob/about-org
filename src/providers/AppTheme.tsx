import * as React from "react";

import { dataDisplayCustomizations } from "@/components/shared/themes/admin/customizations/dataDisplay";
import { feedbackCustomizations } from "@/components/shared/themes/admin/customizations/feedback";
import { inputsCustomizations } from "@/components/shared/themes/admin/customizations/inputs";
import { navigationCustomizations } from "@/components/shared/themes/admin/customizations/navigation";
import { surfacesCustomizations } from "@/components/shared/themes/admin/customizations/surfaces";
import {
  colorSchemes,
  shadows,
  typography,
} from "@/components/shared/themes/themePrimitives";
import { DialogProvider } from "@/context/dialog";
import type { PaletteMode, ThemeOptions } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface AppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
  modeStorageKey?: string;
  mode?: PaletteMode;
}

export default function AppTheme({
  children,
  disableCustomTheme,
  themeComponents,
  modeStorageKey,
}: AppThemeProps) {
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          // palette: {
          //   mode,
          // },
          cssVariables: {
            colorSchemeSelector: "data-mui-color-scheme",
            cssVarPrefix: "template",
          },
          colorSchemes: {
            ...colorSchemes,
          },
          typography: typography,
          shadows: shadows,
          components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
            ...themeComponents,
          },
        });
  }, [disableCustomTheme, themeComponents]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <ThemeProvider
      theme={theme}
      disableTransitionOnChange
      defaultMode="light"
      modeStorageKey={modeStorageKey}
    >
      <DialogProvider>{children}</DialogProvider>
    </ThemeProvider>
  );
}
