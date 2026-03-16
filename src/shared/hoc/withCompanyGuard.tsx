import { Navigate } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";
import { PATHS } from "../constants/routes";
import type { ComponentType } from "react";

export default function withCompanyGuard<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  return function CompanyGuarded(props: P) {
    const user = useUserStore((s) => s.user);

    if (user && user.accountType !== "company") {
      return <Navigate to={PATHS.HOME} replace />;
    }

    return <Component {...props} />;
  };
}
