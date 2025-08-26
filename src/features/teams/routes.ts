import { lazy } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import type { RoutesConfig } from "@/shared/types/routes.types";
import { PATHS } from "@/shared/constants/routes";

const Login = lazy(() => import("../auth/pages/Login"));

const teamRoutes: RoutesConfig = [
  {
    path: PATHS.TEAMS,
    element: Login,
    children: [],
    isPrivate: false,
    layout: AuthLayout,
  },
];

export default teamRoutes;
