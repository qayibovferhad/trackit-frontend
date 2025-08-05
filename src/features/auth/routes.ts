import { lazy } from "react";
import { PATHS } from "../../routes/constants";
import type { RoutesConfig } from "../../routes/types";
import AuthLayout from "../../layouts/AuthLayout";

const Login = lazy(() => import("./components/Login"));

const Register = lazy(() => import("./components/Register"));

const authRoutes: RoutesConfig = [
  {
    path: PATHS.LOGIN,
    element: Login,
    children: [],
    isPrivate: false,
    layout: AuthLayout,
  },
  {
    path: PATHS.REGISTER,
    element: Register,
    children: [],
    isPrivate: false,
    layout: AuthLayout,
  },
];

export default authRoutes;
