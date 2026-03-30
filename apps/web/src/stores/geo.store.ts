import { create } from "zustand";

interface GeoStore {
  detectedStateCode: string | null;
  detectedStateName: string | null;
  isLoading: boolean;
  isDetected: boolean;
  setDetected: (code: string | null, name: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useGeoStore = create<GeoStore>((set) => ({
  detectedStateCode: null,
  detectedStateName: null,
  isLoading: true,
  isDetected: false,
  setDetected: (code, name) =>
    set({
      detectedStateCode: code,
      detectedStateName: name,
      isDetected: true,
      isLoading: false,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
