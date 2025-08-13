import AppLayout from "@/layouts/AppLayout";
import SettingsLayout from "@/layouts/SettingsLayout";
import DeactivationSettings from "./pages/Deactivation";
import NotificationSettings from "./pages/Notification";
import PasswordChangeSettings from "./pages/PasswordChange";
import type { RoutesConfig } from "@/shared/types/routes.types";
import { PATHS } from "@/shared/constants/routes";

const routes: RoutesConfig = [
  {
    path: PATHS.SETTINGS,
    element: SettingsLayout,
    children: [
      {
        index: true,
        element: PasswordChangeSettings,
        isPrivate: true,
      },
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
