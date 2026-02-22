import { Suspense } from "react";
import { useRoutes, type RouteObject } from "react-router-dom";
import { allRoutes } from ".";
import PrivateRoute from "../shared/components/PrivateRoute";
import Spinner from "../shared/components/Spinner";
import type { RouteConfig } from "@/shared/types/routes.types";

const createRoute = ({
  path,
  element: Component,
  isPrivate,
  layout: Layout,
  children,
  index = false,
}: RouteConfig): RouteObject => {
  const element = isPrivate ? (
    <PrivateRoute>
      <Component />
    </PrivateRoute>
  ) : (
    <Component />
  );

  if (index) {
    return {
      index: true,
      element,
    };
  }
  return {
    path,
    index,
    element: Layout ? <Layout>{element}</Layout> : element,
    ...(children && { children: children.map(createRoute) }),
  };
};

export default function RouteConfig() {
  const routes = useRoutes([
    ...allRoutes.map(createRoute),
    { path: "*", element: <div>404 Not Found</div> },
  ]);

  return (
    <Suspense fallback={<Spinner />}>
      {routes}
    </Suspense>
  );
}
