import { useNavigate } from "react-router-dom";
import { useConsultationStore } from "@/stores";
import { ROUTES } from "@/constants";
import type { MedicalData } from "@sniffles/types";

export interface UseConsultationFlowReturn {
  // State
  selectedSymptoms: string[];
  medicalData: MedicalData | null;
  aiAssessment: string | null;
  additionalInfo: string;

  // Symptom actions
  toggleSymptom: (symptomId: string) => void;
  setSelectedSymptoms: (symptomIds: string[]) => void;
  hasSymptoms: boolean;

  // Medical data actions
  setMedicalData: (data: MedicalData) => void;
  updateMedicalData: (updates: Partial<MedicalData>) => void;
  hasMedicalData: boolean;

  // Assessment actions
  setAiAssessment: (assessment: string) => void;
  setAdditionalInfo: (info: string) => void;

  // Navigation helpers
  goToSymptoms: () => void;
  goToMedicalProfile: () => void;
  goToSummary: () => void;
  goToConsultation: () => void;

  // Validation
  canProceedToMedicalProfile: boolean;
  canProceedToConsultation: boolean;

  // Reset
  reset: () => void;
}

/**
 * useConsultationFlow - Hook for managing consultation flow state
 * Provides centralized access to consultation state and navigation
 */
export function useConsultationFlow(): UseConsultationFlowReturn {
  const navigate = useNavigate();
  const {
    selectedSymptoms,
    medicalData,
    aiAssessment,
    additionalInfo,
    toggleSymptom,
    setSelectedSymptoms,
    setMedicalData,
    updateMedicalData,
    setAiAssessment,
    setAdditionalInfo,
    reset,
  } = useConsultationStore();

  const hasSymptoms = selectedSymptoms.length > 0;
  const hasMedicalData = medicalData !== null;

  const canProceedToMedicalProfile = hasSymptoms;
  const canProceedToConsultation = hasSymptoms && hasMedicalData;

  const goToSymptoms = () => navigate(ROUTES.SYMPTOMS);
  const goToMedicalProfile = () => navigate(ROUTES.MEDICAL_PROFILE);
  const goToSummary = () => navigate(ROUTES.SUMMARY);
  const goToConsultation = () => navigate(ROUTES.CONSULTATION);

  return {
    // State
    selectedSymptoms,
    medicalData,
    aiAssessment,
    additionalInfo,

    // Symptom actions
    toggleSymptom,
    setSelectedSymptoms,
    hasSymptoms,

    // Medical data actions
    setMedicalData,
    updateMedicalData,
    hasMedicalData,

    // Assessment actions
    setAiAssessment,
    setAdditionalInfo,

    // Navigation helpers
    goToSymptoms,
    goToMedicalProfile,
    goToSummary,
    goToConsultation,

    // Validation
    canProceedToMedicalProfile,
    canProceedToConsultation,

    // Reset
    reset,
  };
}
