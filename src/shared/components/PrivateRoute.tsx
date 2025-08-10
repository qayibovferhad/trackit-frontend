import { Navigate } from "react-router-dom";
import { PATHS } from "../../routes/constants";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = true;

  return isLoggedIn ? children : <Navigate to={PATHS.LOGIN} />;
}
