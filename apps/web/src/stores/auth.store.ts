import type { AuthResponse, AuthUser } from "@sniffles/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

function hasCoherentPersistedSession(state: Partial<AuthState> | undefined) {
  if (!state) {
    return false;
  }

  const hasAnyAuthValue = !!(state.token || state.refreshToken || state.user);
  if (!hasAnyAuthValue) {
    return true;
  }

  return Boolean(state.token && state.refreshToken && state.user);
}

const authStorage = {
  getItem: (name: string) => {
    const storage = getBrowserStorage();
    if (!storage) {
      return null;
    }

    const rawValue = storage.local.getItem(name) ?? storage.session.getItem(name);
    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue);
    } catch {
      storage.local.removeItem(name);
      storage.session.removeItem(name);
      return null;
    }
  },
  setItem: (name: string, value: unknown) => {
    const storage = getBrowserStorage();
    if (!storage) {
      return;
    }

    const serializedValue = JSON.stringify(value);
    const shouldRemember =
      typeof value === "object" &&
      value !== null &&
      "state" in value &&
      typeof value.state === "object" &&
      value.state !== null &&
      "rememberSession" in value.state &&
      value.state.rememberSession === true;

    const target = shouldRemember ? storage.local : storage.session;
    const other = shouldRemember ? storage.session : storage.local;

    other.removeItem(name);
    target.setItem(name, serializedValue);
  },
  removeItem: (name: string) => {
    const storage = getBrowserStorage();
    if (!storage) {
      return;
    }

    storage.local.removeItem(name);
    storage.session.removeItem(name);
  },
};

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
        set({
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }),
      setUser: (user) => set({ user }),
      setBootstrapped: (value) => set({ isBootstrapped: value }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
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
        if (state && !hasCoherentPersistedSession(state)) {
          state.clearSession();
        }

        state?.setHasHydrated(true);
      },
    },
  ),
);
