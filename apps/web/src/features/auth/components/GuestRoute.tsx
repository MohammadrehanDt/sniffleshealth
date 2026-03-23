import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { getDefaultRouteForRole } from "../utils/auth-routing";
import { useAuthStore } from "@/stores/auth.store";

export function GuestRoute({ children }: PropsWithChildren) {
  const { isBootstrapped, user } = useAuthStore();

  if (!isBootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-default text-text-secondary">
        Loading session...
      </div>
    );
  }

  if (user) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  return <>{children}</>;
}
