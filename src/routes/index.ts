import type { RoutesConfig } from "@/shared/types/routes.types";

export const featureRoutes = import.meta.glob("../features/*/routes.ts", {
  eager: true,
  import: "default",
});

export const allRoutes: RoutesConfig = Object.values(
  featureRoutes
).flat() as RoutesConfig;

console.log("allRoutes", allRoutes);
