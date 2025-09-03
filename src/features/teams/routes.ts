import { lazy } from "react";
import type { RoutesConfig } from "@/shared/types/routes.types";
import { PATHS } from "@/shared/constants/routes";
import AppLayout from "@/layouts/AppLayout";

const Teams = lazy(() => import("./pages/Teams"));

const teamRoutes: RoutesConfig = [
  {
    path: PATHS.TEAMS,
    element: Teams,
    children: [],
    isPrivate: false,
    layout: AppLayout,
  },
];

export default teamRoutes;
