import { PATHS } from "@/routes/constants";
import type { RoutesConfig } from "@/routes/types";
import AppLayout from "@/layouts/AppLayout";
import SettingsLayout from "@/layouts/SettingsLayout";
import DeactivationSettings from "./pages/Deactivation";
import NotificationSettings from "./pages/Notification";
import PasswordChangeSettings from "./pages/PasswordChange";

const routes: RoutesConfig = [
  {
    path: PATHS.SETTINGS,
    element: SettingsLayout,
    children: [
      {
        path: PATHS.SETTINGS_PASSWORD,
        element: PasswordChangeSettings,
        children: [],
        isPrivate: true,
      },
      {
        path: PATHS.SETTINGS_DEACTIVATION,
        element: DeactivationSettings,
        children: [],
        isPrivate: true,
      },
      {
        path: PATHS.SETTINGS_NOTIFICATION,
        element: NotificationSettings,
        children: [],
        isPrivate: true,
      },
    ],
    isPrivate: true,
    layout: AppLayout,
  },
];

export default routes;
