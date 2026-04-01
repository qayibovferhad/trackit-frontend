import {
  Bell,
  ChevronLeft,
  ClipboardList,
  LogOut,
  Megaphone,
  NotepadTextIcon,
  Plus,
  Search,
  Users,
  UserPlus,
} from "lucide-react";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";
import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUnreadCount } from "@/features/notifications/services/notifications.service";
import { logoutRequest } from "@/features/auth/services/auth.service";
import SearchDropdown from "@/features/search/components/SearchDropdown";
import { addRecentSearch } from "@/features/search/services/search.service";
import { PATHS } from "@/shared/constants/routes";
import { createTask } from "@/features/tasks/services/tasks.service";
import { createAnnouncement } from "@/features/announcements/services/announcements.service";
import type { AnnouncementFormData } from "@/features/announcements/schemas/announcement.schema";
import type { CreateTaskPayload } from "@/features/tasks/types/tasks";
import { toast } from "sonner";

const TaskModal = lazy(() => import("@/features/tasks/components/task/TaskModal"));
const AnnouncementModal = lazy(() => import("@/features/announcements/components/AnnouncementModal"));
const TeamModal = lazy(() => import("@/features/teams/components/TeamModal"));

export const SIDEBAR_WIDTH_PX = 256;

type TopbarProps = {
  menus?: NavItem[];
  onSearchSubmit?: (q: string) => void;
  rightSlot?: React.ReactNode;
  showBack?: boolean;
};
export default function Topbar({
  menus,
  onSearchSubmit,
  rightSlot,
  showBack = true,
}: TopbarProps) {
  const computedTitle = usePageTitle(menus, "Back");
  const { user, logout } = useUserStore();
  const [q, setQ] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const isCompany = user?.accountType === "company";

  const { mutate: handleCreateTask } = useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTaskModalOpen(false);
      toast.success("Task created");
    },
    onError: () => toast.error("Failed to create task"),
  });

  const { mutate: handleCreateAnnouncement, isPending: announcementPending } = useMutation({
    mutationFn: (data: AnnouncementFormData) => createAnnouncement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setAnnouncementModalOpen(false);
      toast.success("Announcement created");
    },
    onError: () => toast.error("Failed to create announcement"),
  });

  // Sync input with URL when on search page
  useEffect(() => {
    const urlQ = searchParams.get("q");
    if (urlQ && window.location.pathname === PATHS.SEARCH) {
      setQ(urlQ);
    }
  }, [searchParams]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const submit = useCallback(() => {
    const value = q.trim();
    if (!value) return;
    addRecentSearch(value);
    navigate(`${PATHS.SEARCH}?q=${encodeURIComponent(value)}`);
    setDropdownOpen(false);
    onSearchSubmit?.(value);
  }, [q, navigate, onSearchSubmit]);

  const { mutate: handleLogout } = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => logout(),
  });
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
        <div ref={searchRef} className="relative w-full">
          <div className="flex w-full items-center gap-2 rounded-md border px-2 bg-gray-200">
            <Search size={16} />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => setDropdownOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Search…"
              className="h-9 w-full bg-transparent text-sm outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
              aria-label="Search"
            />
          </div>
          {dropdownOpen && (
            <SearchDropdown
              query={q}
              onClose={() => setDropdownOpen(false)}
              onSelectRecent={(val) => setQ(val)}
            />
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="iconSoft"
              size="icon"
              className="rounded-md p-2 hover:bg-muted [&>svg]:size-6"
              aria-label="New"
            >
              <Plus className="!size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuRow
              iconCircle
              icon={<ClipboardList className="!size-5" />}
              label="New Task"
              onClick={() => setTaskModalOpen(true)}
            />
            <DropdownMenuRow
              iconCircle
              icon={<Megaphone className="!size-5" />}
              label="New Announcement"
              onClick={() => setAnnouncementModalOpen(true)}
            />
            {isCompany && (
              <DropdownMenuRow
                iconCircle
                icon={<Users className="!size-5" />}
                label="New Team"
                onClick={() => setTeamModalOpen(true)}
              />
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <NotificationBell />
        <DropdownMenu modal={false}>
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
              {user?.accountType === "company" && user.companyName && (
                <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {user.companyName}
                </span>
              )}
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
              onClick={handleLogout}
            />
          </DropdownMenuContent>
        </DropdownMenu>

        {rightSlot}
      </div>

      <Suspense fallback={null}>
        <TaskModal
          open={taskModalOpen}
          onOpenChange={setTaskModalOpen}
          onAddTask={(payload) => handleCreateTask(payload)}
        />
      </Suspense>

      <Suspense fallback={null}>
        <AnnouncementModal
          open={announcementModalOpen}
          onOpenChange={setAnnouncementModalOpen}
          mode="create"
          onSubmit={(data) => handleCreateAnnouncement(data)}
          isLoading={announcementPending}
        />
      </Suspense>

      {isCompany && (
        <Suspense fallback={null}>
          <TeamModal
            open={teamModalOpen}
            onOpenChange={setTeamModalOpen}
          />
        </Suspense>
      )}
    </header>
  );
}

const NotificationBell = memo(function NotificationBell() {
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
});
