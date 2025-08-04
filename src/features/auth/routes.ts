import { lazy } from "react";
import { PATHS } from "../../routes/constants";
import type { RoutesConfig } from "../../routes/types";

const Login = lazy(() => import("./components/Login"));

export const authRoutes: RoutesConfig = [
  {
    path: PATHS.LOGIN,
    element: Login,
    children: [],
    isPrivate: false,
  },
];
