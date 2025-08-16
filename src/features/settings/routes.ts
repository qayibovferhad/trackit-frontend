import AppLayout from "@/layouts/AppLayout";
import SettingsLayout from "@/layouts/SettingsLayout";
import type { RoutesConfig } from "@/shared/types/routes.types";
import { PATHS } from "@/shared/constants/routes";
import { lazy } from "react";

const PersonalDetailsSettings = lazy(() => import("./pages/PersonalDetails"));

const PasswordChangeSettings = lazy(() => import("./pages/PasswordChange"));

const DeactivationSettings = lazy(() => import("./pages/Deactivation"));

const NotificationSettings = lazy(() => import("./pages/Notification"));

const routes: RoutesConfig = [
  {
    path: PATHS.SETTINGS,
    element: SettingsLayout,
    children: [
      {
        index: true,
        element: PersonalDetailsSettings,
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
