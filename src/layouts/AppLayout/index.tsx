import { Outlet } from "react-router-dom";
import Topbar from "./components/Topbar";
import type { ReactNode } from "react";
import { MAIN_MENU, SETTINGS_MENU } from "@/shared/constants/menus";
import { SidebarBase } from "./components/Sidebar";
import { Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "@/features/teams/services/teams.service";

const SIDEBAR_WIDTH = "w-64";

export default function AppLayout({ children }: { children: ReactNode }) {
  const menus = [...MAIN_MENU, ...SETTINGS_MENU].flat();

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    staleTime: 10_000,
    gcTime: 30 * 60_000,
  });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SidebarBase
        items={MAIN_MENU}
        teams={teams}
        isLoadingTeams={isLoading}
        widthClass={SIDEBAR_WIDTH}
        headerSlot={
          <div className="flex items-center gap-2 py-2 px-10">
            <Zap className="size-6" color="purple" />
            <span className="text-2xl font-semibold">Trackit</span>
          </div>
        }
      />
      <Topbar menus={menus} />
      <main className={`pl-80 pt-[90px] p-4 `}>{children ?? <Outlet />}</main>
    </div>
  );
}
