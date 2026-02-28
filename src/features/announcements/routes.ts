import { lazy } from "react";
import type { RoutesConfig } from "@/shared/types/routes.types";
import { PATHS } from "@/shared/constants/routes";
import AppLayout from "@/layouts/AppLayout";

const Announcements = lazy(() => import("./pages/Announcements"));

const announcementRoutes: RoutesConfig = [
  {
    path: PATHS.ANNOUNCEMENTS,
    element: Announcements,
    children: [],
    isPrivate: true,
    layout: AppLayout,
  },
];

export default announcementRoutes;
