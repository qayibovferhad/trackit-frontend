import {
  Bell,
  ChevronLeft,
  LogOut,
  NotepadTextIcon,
  Plus,
  Search,
  User2,
  UserIcon,
  UserPlus,
} from "lucide-react";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import type { NavItem } from "@/shared/types/nav.types";
import { Input } from "@/shared/ui/input";
import { useUserStore } from "@/stores/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import UserAvatar from "@/shared/components/UserAvatar";

export const SIDEBAR_WIDTH_PX = 256;

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
  const { user } = useUserStore();
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const submit = () => {
    const value = q.trim();
    if (!value) return;
    onSearchSubmit?.(value);
  };

  function logout() {}
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
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Search…"
            className="h-9 w-full bg-transparent text-sm outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="iconSoft"
          size="icon"
          className="rounded-md p-2 hover:bg-muted [&>svg]:size-6"
          aria-label="New"
        >
          <Plus className="!size-4" />
        </Button>
        <Button
          variant="ghost"
          className="rounded-md p-2 hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="!size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-md p-1.5 pl-1.5 pr-3 hover:bg-muted
               outline-none ring-0 ring-offset-0
               focus:outline-none focus:ring-0 focus:ring-offset-0
               focus-visible:ring-0 focus-visible:outline-none"
              aria-label="Account menu"
            >
              <UserAvatar
                src={user?.profileImage}
                name={user?.name}
                email={user?.email}
                size="md"
                className="border-0"
              />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <MenuRow
              iconCircle
              icon={
                <UserAvatar
                  src={user?.profileImage}
                  name={user?.name}
                  email={user?.email}
                  size="sm"
                  className="border-0"
                />
              }
              label="My Profile"
              onClick={() => navigate("/settings")}
            />
            <MenuRow
              iconCircle
              icon={<NotepadTextIcon className="!size-5" />}
              label="Help and Support"
              onClick={() => navigate("/settings")}
            />
            <MenuRow
              iconCircle
              icon={<UserPlus className="!size-5" />}
              label="Invite Friends"
              onClick={() => navigate("/settings")}
            />
            <MenuRow
              iconCircle
              icon={<LogOut className="!size-5" />}
              label="Logout"
              onClick={() => logout()}
            />
          </DropdownMenuContent>
        </DropdownMenu>

        {rightSlot}
      </div>
    </header>
  );
}

function MenuRow({
  icon,
  label,
  onClick,
  danger,
  iconCircle = true,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  iconCircle?: boolean;
}) {
  return (
    <DropdownMenuItem
      onSelect={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={[
        "cursor-pointer rounded-md px-2 py-2 text-sm",
        "flex items-center gap-3",
        "focus:bg-muted focus:text-foreground",
        danger ? "text-red-600 focus:text-red-600" : "",
      ].join(" ")}
    >
      <span
        className={[
          iconCircle
            ? "h-7 w-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center"
            : "",
          "[&>svg]:size-4",
        ].join(" ")}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </DropdownMenuItem>
  );
}
