import type { AuthResponse, AuthUser } from "@sniffles/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const AUTH_STORAGE_KEY = "sniffles-auth";

function getBrowserStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return {
    local: window.localStorage,
    session: window.sessionStorage,
  };
}

const authStorage = createJSONStorage(() => ({
  getItem: (name) => {
    const storage = getBrowserStorage();
    if (!storage) {
      return null;
    }

    return storage.local.getItem(name) ?? storage.session.getItem(name);
  },
  setItem: (name, value) => {
    const storage = getBrowserStorage();
    if (!storage) {
      return;
    }

    const shouldRemember = JSON.parse(value).state?.rememberSession === true;
    const target = shouldRemember ? storage.local : storage.session;
    const other = shouldRemember ? storage.session : storage.local;

    other.removeItem(name);
    target.setItem(name, value);
  },
  removeItem: (name) => {
    const storage = getBrowserStorage();
    if (!storage) {
      return;
    }

    storage.local.removeItem(name);
    storage.session.removeItem(name);
  },
}));

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isBootstrapped: boolean;
  hasHydrated: boolean;
  rememberSession: boolean;
  setSession: (session: AuthResponse, rememberSession?: boolean) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  setUser: (user: AuthUser) => void;
  setBootstrapped: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isBootstrapped: false,
      hasHydrated: false,
      rememberSession: false,
      setSession: (session, rememberSession = false) =>
        set({
          token: session.accessToken,
          refreshToken: session.refreshToken,
          user: session.user,
          isBootstrapped: true,
          rememberSession,
        }),
      setTokens: (tokens) =>
        set((state) => ({
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          rememberSession: state.rememberSession,
        })),
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
          refreshToken: null,
          user: null,
          isBootstrapped: true,
          rememberSession: false,
        }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: authStorage,
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        rememberSession: state.rememberSession,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
