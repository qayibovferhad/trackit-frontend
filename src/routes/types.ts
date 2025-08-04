import type { ComponentType } from "react";
import type { PATHS } from "./constants";
import type { ValueOf } from "../types/utils";

export interface RouteConfig {
  path: ValueOf<typeof PATHS> | "*";
  element: ComponentType;
  children?: RouteConfig[];
  isPrivate: boolean;
  meta?: {
    title?: string;
    requiresAuth?: boolean;
    [key: string]: any;
  };
}

export type RoutesConfig = RouteConfig[];
