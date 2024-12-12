// import Typography from '@mui/material/Typography';
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useSessionLogout } from "@/lib/swr-services/login";
import { useGetUser } from "@/lib/swr-services/user";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
// import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
// import Avatar from '@mui/material/Avatar';
import { LoadingButton } from "@mui/lab";
import { useTheme } from "@mui/material";
// import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";

// import MenuButton from './MenuButton';
import MenuContent from "./MenuContent";

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({
  open,
  toggleDrawer,
}: SideMenuMobileProps) {
  const router = useRouter();
  const theme = useTheme();
  const { trigger, isMutating } = useSessionLogout();
  const { data: userData } = useGetUser();
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: "none",
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: "70dvw",
          height: "100%",
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: "center", flexGrow: 1, p: 1 }}
          >
            {/* <Avatar
              sizes="small"
              alt="Shwe Charity"
              src="/static/images/avatar/7.jpg"
              sx={{ width: 24, height: 24 }}
            /> */}
            {/* <Typography component="p" variant="h6">
              Shwe Charity
            </Typography> */}
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
          </Stack>
          {/* <MenuButton showBadge>
            <NotificationsRoundedIcon />
          </MenuButton> */}
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent
            isSuperAdmin={userData?.data?.role?.roleName === "Super Admin"}
          />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <LoadingButton
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={() =>
              trigger().then(() => {
                router.refresh();
              })
            }
            loading={isMutating}
          >
            Logout
          </LoadingButton>
        </Stack>
      </Stack>
    </Drawer>
  );
}
