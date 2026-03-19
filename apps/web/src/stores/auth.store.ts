import type { AuthResponse, AuthUser } from "@sniffles/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isBootstrapped: boolean;
  hasHydrated: boolean;
  setSession: (session: AuthResponse) => void;
  setUser: (user: AuthUser) => void;
  setBootstrapped: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isBootstrapped: false,
      hasHydrated: false,
      setSession: (session) =>
        set({
          token: session.accessToken,
          user: session.user,
          isBootstrapped: true,
        }),
      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),
      setBootstrapped: (value) =>
        set((state) => ({
          ...state,
          isBootstrapped: value,
        })),
      setHasHydrated: (value) =>
        set((state) => ({
          ...state,
          hasHydrated: value,
        })),
      clearSession: () =>
        set({
          token: null,
          user: null,
          isBootstrapped: true,
        }),
    }),
    {
      name: "sniffles-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
