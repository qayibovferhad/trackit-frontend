import type { LucideIcon } from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon?: LucideIcon;
  exact?: boolean;
  name?: string;
  badge?:number
};

export type NavListProps = {
  items: NavItem[];
  className?: string;
};
