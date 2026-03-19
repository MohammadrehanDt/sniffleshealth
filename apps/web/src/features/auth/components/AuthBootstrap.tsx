import { useEffect, useRef } from "react";
import { authApi } from "../services/auth.api";
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

  useEffect(() => {
    if (!hasHydrated || didRunRef.current || isBootstrapped) {
      return;
    }

    didRunRef.current = true;

    if (!token) {
      setBootstrapped(true);
      return;
    }

    authApi
      .me(token)
      .then((user) => {
        setUser(user);
      })
      .catch(() => {
        clearSession();
      })
      .finally(() => {
        setBootstrapped(true);
      });
  }, [
    clearSession,
    hasHydrated,
    isBootstrapped,
    setBootstrapped,
    setUser,
    token,
  ]);

  return null;
}
