import { lazy } from "react";
import type { RoutesConfig } from "@/shared/types/routes.types";
import { PATHS } from "@/shared/constants/routes";
import AppLayout from "@/layouts/AppLayout";

const Notifications = lazy(() => import("./pages/Notifications"));

const notificationRoutes: RoutesConfig = [
  {
    path: PATHS.NOTIFICATIONS,
    element: Notifications,
    children: [],
    isPrivate: false,
    layout: AppLayout,
  },
];

export default notificationRoutes;
