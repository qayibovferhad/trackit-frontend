import AppLayout from "@/layouts/AppLayout";
import type { RoutesConfig } from "@/shared/types/routes.types";
import { PATHS } from "@/shared/constants/routes";
import { lazy } from "react";

const TimelinePage = lazy(() => import("./pages/TimelinePage"));

const routes: RoutesConfig = [
  {
    path: PATHS.TIMELINE,
    element: TimelinePage,
    children: [],
    isPrivate: true,
    layout: AppLayout,
  },
];

export default routes;
