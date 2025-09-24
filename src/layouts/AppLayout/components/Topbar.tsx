import {
  Bell,
  ChevronLeft,
  LogOut,
  NotepadTextIcon,
  Plus,
  Search,
  UserPlus,
} from "lucide-react";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import type { NavItem } from "@/shared/types/nav.types";
import { Input } from "@/shared/ui/input";
import { useUserStore } from "@/stores/userStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRow,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import UserAvatar from "@/shared/components/UserAvatar";
import { useQuery } from "@tanstack/react-query";
import { fetchUnreadCount } from "@/features/notifications/services/notifications.service";

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
        <h1 className="truncate text-md font-medium text-gray-700">
          {computedTitle}
        </h1>
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
        <NotificationBell />
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
            <DropdownMenuRow
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
            <DropdownMenuRow
              iconCircle
              icon={<NotepadTextIcon className="!size-5" />}
              label="Help and Support"
              onClick={() => navigate("/settings")}
            />
            <DropdownMenuRow
              iconCircle
              icon={<UserPlus className="!size-5" />}
              label="Invite Friends"
              onClick={() => navigate("/settings")}
            />
            <DropdownMenuRow
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

function NotificationBell() {
  const navigate = useNavigate();
  const { data: unread = 0 } = useQuery({
    queryKey: ["unread-count"],
    queryFn: fetchUnreadCount,
    refetchInterval: 10000,
  });

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="rounded-md p-2 hover:bg-muted"
        aria-label="Notifications"
        onClick={() => navigate("/notifications")}
      >
        <Bell className="!size-5" />
      </Button>

      {unread > 0 && (
        <span
          aria-label={`${unread} unread notifications`}
          className="absolute top-1.5 right-1.5 inline-flex h-2.5 w-2.5 rounded-full bg-red-500"
        />
      )}
    </div>
  );
}
