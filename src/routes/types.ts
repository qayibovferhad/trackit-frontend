import type { ComponentType, ReactNode } from "react";
import type { ValueOf } from "../shared/types/utils";
import type { PATHS } from "./constants";

export interface RouteConfig {
  path: ValueOf<typeof PATHS> | "*";
  element: ComponentType;
  children?: RouteConfig[];
  isPrivate: boolean;
  layout?: ComponentType<{ children: ReactNode }>;
  meta?: {
    title?: string;
    requiresAuth?: boolean;
    [key: string]: any;
  };
}

export type RoutesConfig = RouteConfig[];
