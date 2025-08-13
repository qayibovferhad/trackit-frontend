import { NavLink } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import type { NavItem } from "../types/nav.types";

interface NavItemLinkProps extends NavItem {
  className?: string;
}

export function NavItemLink({
  to,
  label,
  icon: Icon,
  exact,
  className,
}: NavItemLinkProps) {
  return (
    <NavLink
      key={to}
      to={to}
      end={!!exact}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition mb-5",
          isActive
            ? "bg-accent text-accent-foreground bg-gray-300"
            : "text-gray-700 hover:bg-gray-200",
          className
        )
      }
    >
      {Icon && <Icon className="size-5 shrink-0" />}
      <span className="truncate">{label}</span>
    </NavLink>
  );
}
