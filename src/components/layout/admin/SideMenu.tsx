"use client";
import Image from "next/image";
import Link from "next/link";

import OptionsMenu from "@/components/pages/admin/Dashboard/OptionsMenu";
import { useGetUser } from "@/lib/swr-services/user";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import MenuContent from "./MenuContent";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu() {
  const { data: userData } = useGetUser();
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 1.5,
        }}
      >
        <Link href={"/admin/country"}>
          {theme?.palette?.mode === "dark" ? (
            <Image
              src="/uploads/logo-white.svg"
              width={130}
              height={40}
              alt="logo"
            />
          ) : (
            <Image
              src="/uploads/logo-black.svg"
              width={130}
              height={40}
              alt="logo"
            />
          )}
        </Link>

        {/* <SelectContent /> */}
      </Box>
      <Divider />
      <MenuContent
        isSuperAdmin={userData?.data?.role?.roleName === "Super Admin"}
      />
      <Stack
        direction="row"
        sx={{
          p: "16px",
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt="Riley Carter"
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: "auto", width: "calc(100% - 88px)" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {userData?.data?.name}
          </Typography>

          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Typography
              noWrap
              variant="caption"
              sx={{ color: "text.secondary" }}
            >
              {userData?.data?.email}
            </Typography>
          </div>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
