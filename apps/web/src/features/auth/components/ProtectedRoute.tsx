import type { PropsWithChildren } from "react";
import type { UserRole } from "@sniffles/types";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/stores/auth.store";

type ProtectedRouteProps = PropsWithChildren<{
  roles?: UserRole[];
}>;

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const location = useLocation();
  const { isBootstrapped, user } = useAuthStore();

  if (!isBootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-default text-text-secondary">
        Checking session...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />
    );
  }

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}
