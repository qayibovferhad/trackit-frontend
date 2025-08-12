import { PATHS } from "@/routes/constants";
import type { RoutesConfig } from "@/routes/types";
import Login from "../auth/pages/Login";
import AppLayout from "@/layouts/AppLayout";
import SettingsLayout from "@/layouts/SettingsLayout";

const routes: RoutesConfig = [
  {
    path: PATHS.SETTINGS,
    element: SettingsLayout,
    children: [
      {
        path: PATHS.SETTINGS_PASSWORD,
        element: Login,
        children: [],
        isPrivate: true,
      },
    ],
    isPrivate: true,
    layout: AppLayout,
  },
];

export default routes;
