import { lazy } from "react";
import type { RoutesConfig } from "@/shared/types/routes.types";
import { PATHS } from "@/shared/constants/routes";
import AppLayout from "@/layouts/AppLayout";

const Profile = lazy(() => import("./pages/Profile"));

const notificationRoutes: RoutesConfig = [
  {
    path: PATHS.PROFILE,
    element: Profile,
    children: [],
    isPrivate: false,
    layout: AppLayout,
  },
];

export default notificationRoutes;
