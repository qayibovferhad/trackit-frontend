import { lazy } from "react";
import type { RoutesConfig } from "@/shared/types/routes.types";
import { PATHS } from "@/shared/constants/routes";

const Onboarding = lazy(() => import("./pages/Onboarding"));

const homeRoutes: RoutesConfig = [
  {
    path: PATHS.ONBOARDING,
    element: Onboarding,
    children: [],
    isPrivate: false,
  },
];

export default homeRoutes;
