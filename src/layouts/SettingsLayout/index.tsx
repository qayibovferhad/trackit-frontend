import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { SETTINGS_MENU } from "@/shared/constants/menus";

export default function SettingsLayout() {
  return (
    <div className="flex">
      <Sidebar items={SETTINGS_MENU} />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}
