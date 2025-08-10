import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import type { ReactNode } from "react";
import { MAIN_MENU, SETTINGS_MENU } from "@/shared/constants/menus";

export default function AppLayout({ children }: { children: ReactNode }) {
  const menus = [...MAIN_MENU, ...SETTINGS_MENU].flat();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar items={MAIN_MENU} title="Trackit" />
      <Topbar menus={menus} />
      <main className="pl-64 pt-14 p-4">{children ?? <Outlet />}</main>
    </div>
  );
}
