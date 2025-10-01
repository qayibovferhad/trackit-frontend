import AppLayout from "@/layouts/AppLayout";
import type { RoutesConfig } from "@/shared/types/routes.types";
import { PATHS } from "@/shared/constants/routes";
import { lazy } from "react";

const Boards = lazy(() => import("./pages/Boards"));

const Task = lazy(() => import("./pages/Task"));

const routes: RoutesConfig = [
  {
    path: PATHS.BOARDS,
    element: Boards,
    children: [],
    isPrivate: true,
    layout: AppLayout,
  },
  {
    path: PATHS.TASK,
    element: Task,
    children: [],
    isPrivate: true,
    layout: AppLayout,
  },
];

export default routes;
