import { SIDEBAR_WIDTH_PX } from "@/layouts/constants";
import type { NavItem } from "@/shared/types/nav.types";
import { NavLink } from "react-router-dom";

export default function Sidebar({
  items,
  title,
}: {
  items?: NavItem[];
  title?: string;
}) {
  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-background"
      style={{ width: SIDEBAR_WIDTH_PX }}
      aria-label="Primary navigation"
    >
      <div className="h-14 flex items-center px-4 font-semibold border-b">
        {title ?? "Menu"}
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {items &&
          items.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition
               ${
                 isActive
                   ? "bg-accent text-accent-foreground"
                   : "hover:bg-muted"
               }`
              }
            >
              {Icon && <Icon size={18} className="shrink-0" />}
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}
