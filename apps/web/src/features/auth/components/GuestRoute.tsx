import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { getDefaultRouteForRole } from "../utils/auth-routing";
import { useAuthStore } from "@/stores/auth.store";

export function GuestRoute({ children }: PropsWithChildren) {
  const { hasHydrated, isBootstrapped, token, user } = useAuthStore();
  const hasPersistedSession = Boolean(token && user);

  if (!hasHydrated || (hasPersistedSession && !isBootstrapped)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-default text-text-secondary">
        Loading session...
      </div>
    );
  }

  if (token && user) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  return <>{children}</>;
}
