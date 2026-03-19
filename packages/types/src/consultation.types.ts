/**
 * Consultation-related types
 */

import { SocialHistoryItem } from "./common.types";

export type HealthCategory = "FEVER_FLU" | "SKIN_ISSUES" | "INFECTIONS" | "SEXUAL_HEALTH" | "MEDICATION_REFILL" | "ASTHMA_ALLERGIES" | "UTIS_YEAST_INFECTION" | "WEIGHT_LOSS";

export interface Symptom {
  id: string;
  name: string;
  category: string;
}

export interface MedicalData {
  age: string;
  sex: string;
  weight: string;
  height: string;
  allergies: string[];
  chronicConditions: string[];
  surgicalHistory: string[];
  socialHistory: SocialHistoryItem[];
  familyHistory: string[];
  // Phase B category-specific answers
  phaseBAnswers?: Record<string, string>;
}

export interface ConsultationState {
  selectedCategory: HealthCategory | null;
  selectedSymptoms: string[];
  medicalData: MedicalData | null;
  aiAssessment: string | null;
  additionalInfo: string;
  // Track chat phase completion
  phaseACompleted: boolean;
  phaseBCompleted: boolean;
  safetyStopTriggered: boolean;
  safetyStopMessage: string | null;
}

