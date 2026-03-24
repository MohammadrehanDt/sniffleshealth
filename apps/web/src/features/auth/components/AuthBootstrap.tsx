import { useEffect, useRef } from "react";
import { useCurrentUser, clearSessionFlag } from "../hooks/useAuth";
import { useAuthStore } from "@/stores/auth.store";

export function AuthBootstrap() {
  const didRunRef = useRef(false);
  const { setUser, clearSession, setBootstrapped, isBootstrapped } =
    useAuthStore();

  const { data, error, isFetched, fetchStatus } = useCurrentUser();

  useEffect(() => {
    if (didRunRef.current || isBootstrapped) return;

    // Query disabled (no session flag) — user is a guest
    if (fetchStatus === "idle" && !isFetched) {
      didRunRef.current = true;
      setBootstrapped(true);
      return;
    }

    if (!isFetched) return;

    didRunRef.current = true;

    if (error) {
      clearSessionFlag();
      clearSession();
    } else if (data) {
      setUser(data);
    }

    setBootstrapped(true);
  }, [
    clearSession,
    data,
    error,
    fetchStatus,
    isBootstrapped,
    isFetched,
    setBootstrapped,
    setUser,
  ]);

  return null;
}
