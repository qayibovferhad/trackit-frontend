import { PATHS } from "@/routes/constants";
import type { RoutesConfig } from "@/routes/types";
import Login from "../auth/pages/Login";
import AppLayout from "@/layouts/AppLayout/AppLayout";

const routes: RoutesConfig = [
  {
    path: PATHS.SETTINGS,
    element: Login,
    children: [],
    isPrivate: true,
    layout: AppLayout,
  },
  {
    path: PATHS.SETTINGS_PASSWORD,
    element: Login,
    children: [],
    isPrivate: true,
    layout: AppLayout,
  },
];

export default routes;
