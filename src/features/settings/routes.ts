import { PATHS } from "@/routes/constants";
import type { RoutesConfig } from "@/routes/types";
import AppLayout from "@/layouts/AppLayout";
import SettingsLayout from "@/layouts/SettingsLayout";
import PasswordChange from "./pages/PasswordChange";

const routes: RoutesConfig = [
  {
    path: PATHS.SETTINGS,
    element: SettingsLayout,
    children: [
      {
        path: PATHS.SETTINGS_PASSWORD,
        element: PasswordChange,
        children: [],
        isPrivate: true,
      },
    ],
    isPrivate: true,
    layout: AppLayout,
  },
];

export default routes;
