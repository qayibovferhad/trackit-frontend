import { lazy } from "react";
import type { RoutesConfig } from "@/shared/types/routes.types";
import { PATHS } from "@/shared/constants/routes";
import AppLayout from "@/layouts/AppLayout";

const Subscription = lazy(() => import("./pages/Subscription"));

const homeRoutes: RoutesConfig = [
  {
    path: PATHS.SUBSCRIPTION,
    element: Subscription,
    children: [],
    isPrivate: true,
    layout: AppLayout,
  },
];

export default homeRoutes;
