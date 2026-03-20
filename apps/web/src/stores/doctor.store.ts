/**
 * Doctor selection and chat state management
 */

import { create } from "zustand";
import type { Doctor } from "@sniffles/types";

interface DoctorStore {
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doctor: Doctor) => void;
  clearSelectedDoctor: () => void;
}

export const useDoctorStore = create<DoctorStore>((set) => ({
  selectedDoctor: null,

  setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),

  clearSelectedDoctor: () => set({ selectedDoctor: null }),
}));
