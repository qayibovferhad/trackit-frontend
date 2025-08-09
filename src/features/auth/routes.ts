import { lazy } from "react";
import { PATHS } from "../../routes/constants";
import type { RoutesConfig } from "../../routes/types";
import AuthLayout from "../../layouts/AuthLayout";

const Login = lazy(() => import("./components/Login"));

const Register = lazy(() => import("./components/Register"));

const ForgotPassword = lazy(() => import("./components/ForgotPassword"));

const VerifyOtp = lazy(() => import("./components/VerifyOtp"));

const ResetPassword = lazy(() => import("./components/ResetPassword"));

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
