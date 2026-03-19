/**
 * Pharmacy selection state management
 */

import { create } from "zustand";
import type { Pharmacy, PharmacyOrder, PrescriptionItem } from "@sniffles/types";

interface PharmacyStore {
  selectedPharmacy: Pharmacy | null;
  prescriptionItems: PrescriptionItem[];
  order: PharmacyOrder | null;
  setSelectedPharmacy: (pharmacy: Pharmacy) => void;
  setPrescriptionItems: (items: PrescriptionItem[]) => void;
  setOrder: (order: PharmacyOrder) => void;
  setPharmacyAsDefault: (pharmacyId: string) => void;
  reset: () => void;
}

const initialState = {
  selectedPharmacy: null,
  prescriptionItems: [],
  order: null,
};

export const usePharmacyStore = create<PharmacyStore>((set) => ({
  ...initialState,

  setSelectedPharmacy: (pharmacy) => set({ selectedPharmacy: pharmacy }),

  setPrescriptionItems: (items) => set({ prescriptionItems: items }),

  setOrder: (order) => set({ order }),

  setPharmacyAsDefault: (pharmacyId) =>
    set((state) => ({
      selectedPharmacy: state.selectedPharmacy
        ? { ...state.selectedPharmacy, isDefault: state.selectedPharmacy.id === pharmacyId }
        : null,
    })),

  reset: () => set(initialState),
}));

