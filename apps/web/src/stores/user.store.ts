/**
 * User profile and address state management
 */

import { create } from "zustand";
import type { AddressData, UserProfile } from "@sniffles/types";

interface UserStore {
  profile: UserProfile | null;
  setAddressData: (data: AddressData) => void;
  setKycCompleted: (completed: boolean) => void;
  setHipaaCompliant: (compliant: boolean) => void;
  reset: () => void;
}

const initialState = {
  profile: null,
};

export const useUserStore = create<UserStore>((set) => ({
  ...initialState,

  setAddressData: (data) =>
    set((state) => ({
      profile: {
        ...state.profile,
        addressData: data,
      } as UserProfile,
    })),

  setKycCompleted: (completed) =>
    set((state) => ({
      profile: {
        ...state.profile,
        kycCompleted: completed,
      } as UserProfile,
    })),

  setHipaaCompliant: (compliant) =>
    set((state) => ({
      profile: {
        ...state.profile,
        hipaaCompliant: compliant,
      } as UserProfile,
    })),

  reset: () => set(initialState),
}));
