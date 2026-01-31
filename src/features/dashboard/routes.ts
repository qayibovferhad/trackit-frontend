import AppLayout from "@/layouts/AppLayout";
import type { RoutesConfig } from "@/shared/types/routes.types";
import { PATHS } from "@/shared/constants/routes";
import { lazy } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));


const routes: RoutesConfig = [
  {
    path: PATHS.DASHBOARD,
    element: Dashboard,
    isPrivate: true,
    layout: AppLayout,
  },
];

export default routes;
