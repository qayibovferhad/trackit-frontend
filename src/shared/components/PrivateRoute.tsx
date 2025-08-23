import { Navigate, useLocation } from "react-router-dom";
import { PATHS } from "../constants/routes";
import { hasAccessToken } from "../lib/authStorage";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();

  if (!hasAccessToken) {
    return <Navigate to={PATHS.LOGIN} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
