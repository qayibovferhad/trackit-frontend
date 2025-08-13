import type { LucideIcon } from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon?: LucideIcon;
  exact?: boolean;
  name?: string;
};

export type NavListProps = {
  items: NavItem[];
  className?: string;
};
