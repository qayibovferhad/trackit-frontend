import { Home, Lock, User } from "lucide-react";
import type { NavItem } from "../types/nav.types";

export const MAIN_MENU: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    name: "Tasks",
    icon: Home,
    exact: true,
  },
  { to: "/teams", label: "Teams" },
  { to: "/inbox", label: "Inbox" },
];

export const SETTINGS_MENU: NavItem[] = [
  { to: "/settings/profile", label: "Profile", name: "Settings", icon: User },
  { to: "/settings/password", label: "Password", name: "Settings", icon: Lock },
];
