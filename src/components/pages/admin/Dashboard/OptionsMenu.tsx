import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import MenuButton from "@/components/layout/admin/MenuButton";
import { useDialog } from "@/hooks/useDialog";
import { useSessionLogout } from "@/lib/swr-services/login";
import { useGetUser } from "@/lib/swr-services/user";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";
import Divider, { dividerClasses } from "@mui/material/Divider";
import { listClasses } from "@mui/material/List";
import ListItemIcon, { listItemIconClasses } from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import { paperClasses } from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

const MenuItem = styled(MuiMenuItem)({
  margin: "2px 0",
});

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const { openDialog, closeDialog } = useDialog();
  const { data: userData } = useGetUser();

  // api
  const { trigger, isMutating } = useSessionLogout();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    openDialog({
      title: "Confirmation",
      content: "Are you sure you want to proceed?",
      actions: () => (
        <>
          <Button onClick={closeDialog} variant="text">
            Cancel
          </Button>
          <LoadingButton
            variant="outlined"
            onClick={() =>
              trigger().then(() => {
                router.refresh();
              })
            }
            loading={isMutating}
            autoFocus
          >
            Logout
          </LoadingButton>
        </>
      ),
    });
  };
  return (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: "transparent", width: "36px", height: "36px" }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: "4px",
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: "4px -4px",
          },
        }}
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
        {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
        {userData?.data?.role?.roleName === "Super Admin" && (
          <>
            <Divider />
            <Link href="/admin/user-management/create">
              <MenuItem onClick={handleClose}>Add another account</MenuItem>
            </Link>
            <Divider />
          </>
        )}

        {/* <MenuItem onClick={handleClose}>Settings</MenuItem> */}

        <MenuItem
          onClick={handleClose}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: "auto",
              minWidth: 0,
            },
          }}
        >
          <ListItemText onClick={handleLogout}>Logout</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
