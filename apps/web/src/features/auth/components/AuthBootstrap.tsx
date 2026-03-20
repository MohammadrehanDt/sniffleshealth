import { useEffect, useRef } from "react";
import { useCurrentUser } from "../hooks/useAuth";
import { useAuthStore } from "@/stores/auth.store";

export function AuthBootstrap() {
  const didRunRef = useRef(false);
  const {
    token,
    setUser,
    clearSession,
    setBootstrapped,
    isBootstrapped,
    hasHydrated,
  } = useAuthStore();

  const { data, error, isFetched } = useCurrentUser();

  useEffect(() => {
    if (!hasHydrated || didRunRef.current || isBootstrapped) {
      return;
    }

    if (!token) {
      didRunRef.current = true;
      setBootstrapped(true);
      return;
    }

    if (!isFetched) return;

    didRunRef.current = true;

    if (error) {
      clearSession();
    } else if (data) {
      setUser(data);
    }

    setBootstrapped(true);
  }, [
    clearSession,
    data,
    error,
    hasHydrated,
    isBootstrapped,
    isFetched,
    setBootstrapped,
    setUser,
    token,
  ]);

  return null;
}
