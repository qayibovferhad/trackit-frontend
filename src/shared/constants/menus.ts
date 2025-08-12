import {
  Bell,
  ChartBar,
  CircuitBoard,
  Home,
  Inbox,
  Lock,
  Settings,
  User,
  Users,
} from "lucide-react";
import type { NavItem } from "../types/nav.types";

export const MAIN_MENU: NavItem[] = [
  {
    to: "/dashboard",
    label: "Home",
    name: "Tasks",
    icon: Home,
    exact: true,
  },
  { to: "/teams", label: "Dashboard", icon: ChartBar },
  { to: "/inbox", label: "Teams", icon: Users },
  { to: "/inbox", label: "Boards", icon: CircuitBoard },
  { to: "/inbox", label: "Inbox", icon: Inbox },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const SETTINGS_MENU: NavItem[] = [
  {
    to: "/settings",
    label: "General Settings",
    name: "Settings",
    icon: Settings,
    exact: true,
  },
  {
    to: "/settings/password",
    label: "Password Settings",
    name: "Settings",
    icon: Lock,
  },
  {
    to: "/settings/notifications",
    label: "Notification Settings",
    name: "Settings",
    icon: Bell,
  },
  {
    to: "/settings/deactivation",
    label: "Deactivation",
    name: "Settings",
    icon: User,
  },
];
