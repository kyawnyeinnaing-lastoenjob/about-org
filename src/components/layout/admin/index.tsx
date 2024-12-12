import React, { PropsWithChildren } from "react";
import Link from "next/link";

// import {
//   chartsCustomizations,
//   dataGridCustomizations,
//   datePickersCustomizations,
//   treeViewCustomizations
// } from "@/components/shared/themes/customizations";
// import CustomDatePicker from '@/components/pages/admin/Dashboard/CustomDatePicker';
import ColorModeIconDropdown from "@/components/shared/themes/admin/ColorModeIconDropdown";
import AppTheme from "@/providers/AppTheme";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
// import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import {
  alpha,
  Box,
  Breadcrumbs,
  breadcrumbsClasses,
  CssBaseline,
  Stack,
  styled,
  Typography,
} from "@mui/material";

import AppNavbar from "./AppNavbar";
// import MenuButton from './MenuButton';
// import Search from './Search';
import SideMenu from "./SideMenu";

// const xThemeComponents = {
//   ...chartsCustomizations,
//   ...dataGridCustomizations,
//   ...datePickersCustomizations,
//   ...treeViewCustomizations
// };

interface LayoutProps extends PropsWithChildren {
  title?: string;
  breadcrumbs?: {
    title: string;
    link: string | null;
  }[];
}

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    // color: theme.palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

const Layout: React.FC<LayoutProps> = ({ title, breadcrumbs, children }) => {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />

        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: alpha(theme.palette.background.default, 1),
            // backgroundColor: theme.vars
            //   ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            //   : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Stack
              direction="row"
              sx={{
                display: { xs: "none", md: "flex" },
                width: "100%",
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                maxWidth: { sm: "100%", md: "1700px" },
                pt: 1.5,
              }}
              spacing={2}
            >
              <StyledBreadcrumbs
                aria-label="breadcrumb"
                separator={<NavigateNextRoundedIcon fontSize="small" />}
              >
                <Link href="/admin/country">
                  <Typography variant="body1">Home</Typography>
                </Link>
                {breadcrumbs?.map((each, key) =>
                  key === breadcrumbs.length - 1 ? (
                    <Typography
                      key={key}
                      variant="body1"
                      sx={{ color: "text.primary", fontWeight: 600 }}
                    >
                      {each?.title}
                    </Typography>
                  ) : (
                    <Link key={key} href={each?.link || ""}>
                      <Typography
                        variant="body1"
                        sx={{ color: "text.primary", fontWeight: 600 }}
                      >
                        {each?.title}
                      </Typography>
                    </Link>
                  ),
                )}
              </StyledBreadcrumbs>
              <Stack direction="row" sx={{ gap: 1 }}>
                {/* <Search />
                <CustomDatePicker />
                <MenuButton showBadge aria-label="Open notifications">
                  <NotificationsRoundedIcon />
                </MenuButton> */}
                <ColorModeIconDropdown />
              </Stack>
            </Stack>
            <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
              <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                {title}
              </Typography>
              {children}
            </Box>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default Layout;
