import { cn } from "@/shared/lib/utils";
import type { NavItem } from "@/shared/types/nav.types";
import { NavLink } from "react-router-dom";

type SettingsSidebarProps = {
  items: NavItem[];
  className?: string;
};

export default function Sidebar({ items, className }: SettingsSidebarProps) {
  return (
    <aside className={cn("w-72 px-4", className)}>
      {/* Header */}
      <div className="px-2 py-3">
        <h2 className="text-base font-semibold text-foreground">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You can find all settings here.
        </p>
      </div>

      {/* Nav */}
      <nav className="mt-2 space-y-1">
        {items.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={!!exact}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors mb-3",
                isActive
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100"
              )
            }
          >
            {({ isActive }) => (
              <>
                {Icon && (
                  <Icon
                    className={cn(
                      "size-5 shrink-0",
                      isActive
                        ? "text-gray-900"
                        : "text-gray-800 group-hover:text-gray-700"
                    )}
                  />
                )}
                <span
                  className={cn("truncate", isActive && "font-medium text-md")}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
