import { NavLink, useLocation, useResolvedPath } from "react-router-dom";
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
  badge
}: NavItemLinkProps) {
  const { pathname } = useLocation();
  const resolved = useResolvedPath(to);

  const base = resolved.pathname;
  const isExactActive =
    pathname === base || pathname === (base.endsWith("/") ? base : base + "/");

  const isActive = exact ? isExactActive : pathname.startsWith(base);

  return (
    <NavLink
      key={to}
      to={to}
      end={!!exact}
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition mb-5",
        isActive
          ? "bg-accent text-accent-foreground bg-gray-300"
          : "text-gray-700 hover:bg-gray-200",
        className
      )}
    >
      {Icon && <Icon className="size-5 shrink-0" />}
      <span className="truncate">{label}</span>
            {badge !== undefined && badge > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </NavLink>
  );
}
