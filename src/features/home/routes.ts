import { lazy } from "react";
import type { RoutesConfig } from "@/shared/types/routes.types";
import { PATHS } from "@/shared/constants/routes";
import AppLayout from "@/layouts/AppLayout";

const Home = lazy(() => import("./pages/Home"));

const homeRoutes: RoutesConfig = [
  {
    path: PATHS.HOME,
    element: Home,
    children: [],
    isPrivate: false,
    layout: AppLayout,
  },
];

export default homeRoutes;
