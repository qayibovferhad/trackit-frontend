import { Bell, ChevronLeft, Plus, Search, User2 } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import type { NavItem } from "@/shared/types/nav.types";
import { SIDEBAR_WIDTH_PX } from "@/layouts/constants";

type TopbarProps = {
  title?: string;
  menus?: NavItem[];
  onSearchSubmit?: (q: string) => void;
  rightSlot?: React.ReactNode;
  showBack?: boolean;
};
export default function Topbar({
  menus,
  title,
  onSearchSubmit,
  rightSlot,
  showBack = true,
}: TopbarProps) {
  const computedTitle = usePageTitle(menus, title);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const submit = () => {
    const value = q.trim();
    if (!value) return;
    onSearchSubmit?.(value);
  };
  return (
    <header
      className="fixed top-0 z-30 flex h-14 items-center gap-3 border-b bg-background px-4"
      style={{
        left: SIDEBAR_WIDTH_PX,
        width: `calc(100% - ${SIDEBAR_WIDTH_PX}px)`,
      }}
    >
      <div className="flex min-w-0 items-center gap-2">
        {showBack && (
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="rounded-md p-1.5 hover:bg-muted"
            aria-label="Go back"
          >
            <ChevronLeft size={18} />
          </Button>
        )}
        <h1 className="truncate text-sm font-medium">{computedTitle}</h1>
      </div>

      <div className="mx-auto flex w-full max-w-xl items-center gap-2">
        <div className="flex w-full items-center gap-2 rounded-md border px-2 bg-gray-200">
          <Search size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Search…"
            className="h-9 w-full bg-transparent text-sm outline-none"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="iconSoft"
          size="icon"
          className="rounded-md p-2 hover:bg-muted"
          aria-label="New"
        >
          <Plus size={18} />
        </Button>
        <Button
          variant="ghost"
          className="rounded-md p-2 hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-md p-1.5 pl-2 pr-3 hover:bg-muted"
        >
          <User2 size={18} />
          <span className="hidden sm:inline text-sm">Username</span>
        </Button>
        {rightSlot}
      </div>
    </header>
  );
}
