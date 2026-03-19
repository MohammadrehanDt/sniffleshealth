/**
 * Doctor consultation state management
 * Manages consultation answers, phase progress, and prescription readiness
 */

import { create } from "zustand";

export type ConsultationPhase =
  | "initial"
  | "category_specific"
  | "medical_review"
  | "final"
  | "complete";

export interface DoctorConsultationState {
  // Consultation answers (key-value pairs)
  consultationAnswers: Record<string, string | string[]>;

  // Phase tracking
  currentPhase: ConsultationPhase;
  currentQuestionIndex: number;

  // Phase completion flags
  phase1Completed: boolean;
  phase2Completed: boolean;
  phase3Completed: boolean;
  phase4Completed: boolean;

  // Status flags
  consultationComplete: boolean;
  prescriptionReady: boolean;

  // Additional data
  consultationNotes: string;
  safetyStopTriggered: boolean;
  safetyStopMessage: string | null;

  // Actions
  setConsultationAnswer: (key: string, value: string | string[]) => void;
  setCurrentPhase: (phase: ConsultationPhase) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setPhaseCompleted: (phase: 1 | 2 | 3 | 4, completed: boolean) => void;
  setConsultationComplete: (complete: boolean) => void;
  setPrescriptionReady: (ready: boolean) => void;
  setSafetyStop: (triggered: boolean, message: string | null) => void;
  setConsultationNotes: (notes: string) => void;
  resetConsultation: () => void;
}

const initialState: Omit<
  DoctorConsultationState,
  | "setConsultationAnswer"
  | "setCurrentPhase"
  | "setCurrentQuestionIndex"
  | "setPhaseCompleted"
  | "setConsultationComplete"
  | "setPrescriptionReady"
  | "setSafetyStop"
  | "setConsultationNotes"
  | "resetConsultation"
> = {
  consultationAnswers: {},
  currentPhase: "initial",
  currentQuestionIndex: 0,
  phase1Completed: false,
  phase2Completed: false,
  phase3Completed: false,
  phase4Completed: false,
  consultationComplete: false,
  prescriptionReady: false,
  consultationNotes: "",
  safetyStopTriggered: false,
  safetyStopMessage: null,
};

export const useDoctorConsultationStore = create<DoctorConsultationState>(
  (set) => ({
    ...initialState,

    setConsultationAnswer: (key, value) =>
      set((state) => ({
        consultationAnswers: {
          ...state.consultationAnswers,
          [key]: value,
        },
      })),

    setCurrentPhase: (phase) => set({ currentPhase: phase }),

    setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

    setPhaseCompleted: (phase, completed) =>
      set((state) => {
        const updates: Partial<DoctorConsultationState> = {};
        if (phase === 1) updates.phase1Completed = completed;
        if (phase === 2) updates.phase2Completed = completed;
        if (phase === 3) updates.phase3Completed = completed;
        if (phase === 4) updates.phase4Completed = completed;
        return updates;
      }),

    setConsultationComplete: (complete) =>
      set({ consultationComplete: complete }),

    setPrescriptionReady: (ready) => set({ prescriptionReady: ready }),

    setSafetyStop: (triggered, message) =>
      set({ safetyStopTriggered: triggered, safetyStopMessage: message }),

    setConsultationNotes: (notes) => set({ consultationNotes: notes }),

    resetConsultation: () => set(initialState),
  }),
);

