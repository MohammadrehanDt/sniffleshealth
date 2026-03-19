/**
 * Consultation flow state management
 * Manages symptoms, medical data, and consultation state
 */

import { create } from "zustand";
import type {
  ConsultationState,
  HealthCategory,
  MedicalData,
  Symptom,
} from "@sniffles/types";

interface ConsultationStore extends ConsultationState {
  // Actions
  setSelectedCategory: (category: HealthCategory) => void;
  setSelectedSymptoms: (symptomIds: string[]) => void;
  toggleSymptom: (symptomId: string) => void;
  setMedicalData: (data: MedicalData) => void;
  updateMedicalData: (updates: Partial<MedicalData>) => void;
  setAiAssessment: (assessment: string) => void;
  setAdditionalInfo: (info: string) => void;
  setPhaseACompleted: (completed: boolean) => void;
  setPhaseBCompleted: (completed: boolean) => void;
  setSafetyStop: (triggered: boolean, message: string | null) => void;
  reset: () => void;
}

const initialState: ConsultationState = {
  selectedCategory: null,
  selectedSymptoms: [],
  medicalData: null,
  aiAssessment: null,
  additionalInfo: "",
  phaseACompleted: false,
  phaseBCompleted: false,
  safetyStopTriggered: false,
  safetyStopMessage: null,
};

export const useConsultationStore = create<ConsultationStore>((set) => ({
  ...initialState,

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  setSelectedSymptoms: (symptomIds) =>
    set({ selectedSymptoms: symptomIds }),

  toggleSymptom: (symptomId) =>
    set((state) => ({
      selectedSymptoms: state.selectedSymptoms.includes(symptomId)
        ? state.selectedSymptoms.filter((id) => id !== symptomId)
        : [...state.selectedSymptoms, symptomId],
    })),

  setMedicalData: (data) => set({ medicalData: data }),

  updateMedicalData: (updates) =>
    set((state) => ({
      medicalData: state.medicalData
        ? { ...state.medicalData, ...updates }
        : null,
    })),

  setAiAssessment: (assessment) => set({ aiAssessment: assessment }),

  setAdditionalInfo: (info) => set({ additionalInfo: info }),

  setPhaseACompleted: (completed) => set({ phaseACompleted: completed }),

  setPhaseBCompleted: (completed) => set({ phaseBCompleted: completed }),

  setSafetyStop: (triggered, message) =>
    set({ safetyStopTriggered: triggered, safetyStopMessage: message }),

  reset: () => set(initialState),
}));
