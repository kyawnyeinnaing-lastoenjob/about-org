import Link from "next/link";
import { usePathname } from "next/navigation";

import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import ContactPageIcon from "@mui/icons-material/ContactPage";
// import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
// import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";

const superAdminRoutes = [
  // { text: 'Dashboard', href: '/admin/dashboard', icon: <HomeRoundedIcon /> },
  { text: "Country", href: "/admin/country", icon: <AnalyticsRoundedIcon /> },
  { text: "Category", href: "/admin/category", icon: <PeopleRoundedIcon /> },
  {
    text: "Sub Category",
    href: "/admin/sub-category",
    icon: <AssignmentRoundedIcon />,
  },
  {
    text: "Listing",
    href: "/admin/listing",
    icon: <AssignmentRoundedIcon />,
  },
  {
    text: "Users Management",
    href: "/admin/user-management",
    icon: <AssignmentRoundedIcon />,
  },
];

const userRoutes = [
  // { text: 'Dashboard', href: '/admin/dashboard', icon: <HomeRoundedIcon /> },
  { text: "Country", href: "/admin/country", icon: <AnalyticsRoundedIcon /> },
  { text: "Category", href: "/admin/category", icon: <PeopleRoundedIcon /> },
  {
    text: "Sub Category",
    href: "/admin/sub-category",
    icon: <AssignmentRoundedIcon />,
  },
  {
    text: "Listing",
    href: "/admin/listing",
    icon: <AssignmentRoundedIcon />,
  },
];

const secondaryListItems = [
  // { text: 'Settings', href: '/admin/settings', icon: <SettingsRoundedIcon /> },
  { text: "About", href: "/admin/about", icon: <InfoRoundedIcon /> },
  { text: "Contact", href: "/admin/contact", icon: <ContactPageIcon /> },
];

interface MenuContentProps {
  isSuperAdmin: boolean;
}

export default function MenuContent({ isSuperAdmin }: MenuContentProps) {
  const pathname = usePathname();
  const mainListItems = isSuperAdmin ? superAdminRoutes : userRoutes;

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton selected={pathname === item.href}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton selected={pathname === item.href}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Stack>
  );
}
