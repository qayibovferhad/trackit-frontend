import type { ComponentType, ReactNode } from "react";
import type { ValueOf } from "./utils";
import type { PATHS } from "../constants/routes";

export interface RouteConfig {
  path?: ValueOf<typeof PATHS> | "*";
  element: ComponentType;
  children?: RouteConfig[];
  isPrivate: boolean;
  layout?: ComponentType<{ children: ReactNode }>;
  index?: boolean;
  meta?: {
    title?: string;
    requiresAuth?: boolean;
    [key: string]: any;
  };
}

export type RoutesConfig = RouteConfig[];
