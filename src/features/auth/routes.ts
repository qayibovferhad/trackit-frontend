import { lazy } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import type { RoutesConfig } from "@/shared/types/routes.types";
import { PATHS } from "@/shared/constants/routes";

const Login = lazy(() => import("./pages/Login"));

const Register = lazy(() => import("./pages/Register"));

const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));

const ResetPassword = lazy(() => import("./pages/ResetPassword"));

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
  {
    path: PATHS.FORGOT_PASSWORD,
    element: ForgotPassword,
    children: [],
    isPrivate: false,
    layout: AuthLayout,
  },
  {
    path: PATHS.VERIFY_OTP,
    element: VerifyOtp,
    children: [],
    isPrivate: false,
    layout: AuthLayout,
  },
  {
    path: PATHS.RESET_PASSWORD,
    element: ResetPassword,
    children: [],
    isPrivate: false,
    layout: AuthLayout,
  },
];

export default authRoutes;
