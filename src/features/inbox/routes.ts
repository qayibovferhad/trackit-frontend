import { lazy } from "react";
import type { RoutesConfig } from "@/shared/types/routes.types";
import { PATHS } from "@/shared/constants/routes";
import AppLayout from "@/layouts/AppLayout";

const Inbox = lazy(() => import("./pages/Inbox"));

const inboxRoutes: RoutesConfig = [
  {
    path: PATHS.INBOX,
    element: Inbox,
    children: [],
    isPrivate: false,
    layout: AppLayout,
  },
];

export default inboxRoutes;
