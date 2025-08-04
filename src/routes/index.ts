import { authRoutes } from "../features/auth/routes";
import type { RoutesConfig } from "./types";

export const allRoutes: RoutesConfig = [...authRoutes];
