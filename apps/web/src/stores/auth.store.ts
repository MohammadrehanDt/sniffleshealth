import type { AuthUser } from "@sniffles/types";
import { create } from "zustand";

interface AuthState {
  user: AuthUser | null;
  isBootstrapped: boolean;
  setUser: (user: AuthUser | null) => void;
  setBootstrapped: (value: boolean) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isBootstrapped: false,
  setUser: (user) => set({ user }),
  setBootstrapped: (value) => set({ isBootstrapped: value }),
  clearSession: () => set({ user: null, isBootstrapped: true }),
}));
