import { useRoutes, type RouteObject } from "react-router-dom";
import { allRoutes } from ".";
import PrivateRoute from "../components/PrivateRoute";
import type { RouteConfig } from "./types";

const createRoute = ({
  path,
  element: Component,
  isPrivate,
  layout: Layout,
  children,
}: RouteConfig): RouteObject => {
  const element = isPrivate ? (
    <PrivateRoute>
      <Component />
    </PrivateRoute>
  ) : (
    <Component />
  );

  return {
    path,
    element: Layout ? <Layout>{element}</Layout> : element,
    ...(children && { children: children.map(createRoute) }),
  };
};

export default function RouteConfig() {
  const routes = useRoutes([
    ...allRoutes.map(createRoute),
    { path: "*", element: <div>404 Not Found</div> },
  ]);

  return routes;
}
