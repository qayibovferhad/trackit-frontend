import { NavList } from "@/shared/components/NavList";
import { cn } from "@/shared/lib/utils";
import type { NavItem } from "@/shared/types/nav.types";

type SettingsSidebarProps = {
  items: NavItem[];
  className?: string;
};

export default function Sidebar({ items, className }: SettingsSidebarProps) {
  return (
    <aside className={cn("w-72 px-4", className)}>
      <div className="px-2 py-3">
        <h2 className="text-base font-semibold text-foreground">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You can find all settings here.
        </p>
      </div>

      <NavList items={items} className="mt-2 space-y-1" />
    </aside>
  );
}
