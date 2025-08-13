import { Navigate } from "react-router-dom";
import { PATHS } from "../constants/routes";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = true;

  return isLoggedIn ? children : <Navigate to={PATHS.LOGIN} />;
}
