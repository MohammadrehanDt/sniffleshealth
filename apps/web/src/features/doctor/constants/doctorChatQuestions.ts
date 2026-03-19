/**
 * Doctor Chat Consultation Questions
 * Question definitions for doctor chat consultation flow
 */

import type { HealthCategory } from "@sniffles/types";
import {
  getSymptomName,
  getSymptomNamesFromIds,
} from "@/features/consultation/utils/symptomUtils";

export interface DoctorChatQuestion {
  id: string;
  text: string; // May contain placeholders like {primarySymptom}, {allergyName}
  type: "text" | "yes_no" | "yes_no_with_followup" | "multiple_choice";
  followup?: string;
  options?: string[];
  allowMultiple?: boolean;
  key: string; // Storage key for answer
  phase: 1 | 2 | 3 | 4;
  category?: HealthCategory; // For Phase 2 questions
  conditional?: {
    // Conditions for when to ask this question
    requiresAllergy?: boolean;
    requiresChronicCondition?: boolean;
    requiresMedication?: boolean;
    requiresSymptom?: string; // e.g., "Fever"
    requiresGender?: "M" | "F";
  };
}

export interface QuestionContext {
  primarySymptom?: string;
  allergies?: string[];
  chronicConditions?: string[];
  medications?: string[];
  sex?: string;
  selectedSymptoms?: string[];
}

// Phase 1: Initial Assessment (Universal Questions)
export const PHASE_1_QUESTIONS: DoctorChatQuestion[] = [
  {
    id: "phase_1_severity",
    text: "On a scale of 1 to 10, how would you rate the severity of your {primarySymptom}? (1 = mild, 10 = severe)",
    type: "multiple_choice",
    options: [
      "1-2 (Mild)",
      "3-4 (Moderate)",
      "5-6 (Moderately Severe)",
      "7-8 (Severe)",
      "9-10 (Very Severe)",
    ],
    key: "symptom_severity",
    phase: 1,
  },
  {
    id: "phase_1_duration",
    text: "How long have you been experiencing these symptoms?",
    type: "multiple_choice",
    options: [
      "Less than 24 hours",
      "1-2 days",
      "3-5 days",
      "1-2 weeks",
      "More than 2 weeks",
    ],
    key: "symptom_duration",
    phase: 1,
  },
  {
    id: "phase_1_impact",
    text: "Are these symptoms affecting your daily activities, such as work or sleep?",
    type: "yes_no_with_followup",
    followup: "Can you describe how it's affecting you?",
    key: "affects_daily_activities",
    phase: 1,
  },
  {
    id: "phase_1_otc",
    text: "Have you tried any over-the-counter medications or home remedies for these symptoms?",
    type: "yes_no_with_followup",
    followup:
      "Which medications or remedies have you tried, and did they help?",
    key: "tried_otc_medications",
    phase: 1,
  },
  {
    id: "phase_1_progression",
    text: "How would you describe how your symptoms have changed since they started?",
    type: "multiple_choice",
    options: [
      "Getting better",
      "Staying the same",
      "Getting worse",
      "Coming and going",
    ],
    key: "symptom_progression",
    phase: 1,
  },
];

// Phase 2: Category-Specific Questions
export const PHASE_2_QUESTIONS: Record<HealthCategory, DoctorChatQuestion[]> = {
  FEVER_FLU: [
    {
      id: "phase_2_fever_pattern",
      text: "Is your fever continuous, or does it come and go throughout the day?",
      type: "multiple_choice",
      options: ["Continuous fever", "Comes and goes", "No fever"],
      key: "fever_pattern",
      phase: 2,
      category: "FEVER_FLU",
      conditional: {
        requiresSymptom: "Fever",
      },
    },
    {
      id: "phase_2_body_aches",
      text: "Are you experiencing body aches or muscle pain?",
      type: "yes_no",
      key: "body_aches",
      phase: 2,
      category: "FEVER_FLU",
    },
    {
      id: "phase_2_respiratory",
      text: "Which of these respiratory symptoms are you experiencing?",
      type: "multiple_choice",
      options: [
        "Nasal congestion",
        "Runny nose",
        "Sneezing",
        "Sore throat",
        "Cough",
        "None of these",
      ],
      allowMultiple: true,
      key: "respiratory_symptoms",
      phase: 2,
      category: "FEVER_FLU",
    },
    {
      id: "phase_2_contact",
      text: "Have you been in close contact with anyone who has similar symptoms in the past week?",
      type: "yes_no",
      key: "contact_with_sick_person",
      phase: 2,
      category: "FEVER_FLU",
    },
    {
      id: "phase_2_appetite",
      text: "How would you describe your appetite and energy level?",
      type: "multiple_choice",
      options: [
        "Normal appetite and energy",
        "Reduced appetite, normal energy",
        "Normal appetite, low energy",
        "Reduced appetite and low energy",
      ],
      key: "appetite_energy",
      phase: 2,
      category: "FEVER_FLU",
    },
  ],
  SKIN_ISSUES: [
    {
      id: "phase_2_skin_location",
      text: "Can you describe exactly where on your body the skin issue is located?",
      type: "text",
      key: "skin_location_details",
      phase: 2,
      category: "SKIN_ISSUES",
    },
    {
      id: "phase_2_skin_appearance",
      text: "Which of these best describes the appearance?",
      type: "multiple_choice",
      options: [
        "Red or pink",
        "Raised bumps",
        "Flat rash",
        "Blisters",
        "Open sores",
        "Dry or scaly",
        "Other",
      ],
      allowMultiple: true,
      key: "skin_appearance",
      phase: 2,
      category: "SKIN_ISSUES",
    },
    {
      id: "phase_2_skin_sensation",
      text: "How would you describe any itching or pain?",
      type: "multiple_choice",
      options: [
        "No itching or pain",
        "Mild itching",
        "Moderate itching",
        "Severe itching",
        "Painful",
      ],
      key: "skin_sensation",
      phase: 2,
      category: "SKIN_ISSUES",
    },
    {
      id: "phase_2_skin_spreading",
      text: "Is the affected area spreading or getting larger?",
      type: "yes_no",
      key: "skin_spreading",
      phase: 2,
      category: "SKIN_ISSUES",
    },
    {
      id: "phase_2_skin_changes",
      text: "Have you started using any new skincare products, detergents, or medications recently?",
      type: "yes_no_with_followup",
      followup: "What products or medications?",
      key: "recent_skin_changes",
      phase: 2,
      category: "SKIN_ISSUES",
    },
  ],
  INFECTIONS: [
    {
      id: "phase_2_urination_frequency",
      text: "How often are you urinating compared to your normal pattern?",
      type: "multiple_choice",
      options: [
        "Normal frequency",
        "Slightly more frequent",
        "Much more frequent",
        "Less frequent than normal",
      ],
      key: "urination_frequency",
      phase: 2,
      category: "INFECTIONS",
    },
    {
      id: "phase_2_urination_discomfort",
      text: "When you urinate, how would you describe any discomfort?",
      type: "multiple_choice",
      options: [
        "No discomfort",
        "Mild burning",
        "Moderate burning",
        "Severe burning or pain",
      ],
      key: "urination_discomfort",
      phase: 2,
      category: "INFECTIONS",
    },
    {
      id: "phase_2_urine_appearance",
      text: "Have you noticed any changes in your urine appearance?",
      type: "multiple_choice",
      options: [
        "Normal appearance",
        "Cloudy",
        "Dark colored",
        "Blood visible",
        "Strong odor",
      ],
      key: "urine_appearance",
      phase: 2,
      category: "INFECTIONS",
    },
    {
      id: "phase_2_lower_abdominal",
      text: "Do you have any pain or pressure in your lower abdomen or pelvic area?",
      type: "yes_no",
      key: "lower_abdominal_pain",
      phase: 2,
      category: "INFECTIONS",
    },
    {
      id: "phase_2_previous_infections",
      text: "Have you had similar symptoms or infections in the past?",
      type: "yes_no",
      key: "previous_infections",
      phase: 2,
      category: "INFECTIONS",
    },
  ],
  SEXUAL_HEALTH: [
    {
      id: "phase_2_discharge",
      text: "Are you experiencing any unusual discharge?",
      type: "yes_no_with_followup",
      followup: "Can you describe the discharge (color, consistency, odor)?",
      key: "unusual_discharge",
      phase: 2,
      category: "SEXUAL_HEALTH",
    },
    {
      id: "phase_2_pain_location",
      text: "Where are you experiencing pain or discomfort?",
      type: "multiple_choice",
      options: [
        "During urination",
        "In genital area",
        "Lower abdomen",
        "During intercourse",
        "No pain",
      ],
      allowMultiple: true,
      key: "pain_location",
      phase: 2,
      category: "SEXUAL_HEALTH",
    },
    {
      id: "phase_2_new_partners",
      text: "Have you had any new sexual partners in the past 3 months?",
      type: "yes_no",
      key: "new_sexual_partners",
      phase: 2,
      category: "SEXUAL_HEALTH",
    },
    {
      id: "phase_2_protection",
      text: "Were you using protection during recent sexual activity?",
      type: "yes_no",
      key: "protection_used",
      phase: 2,
      category: "SEXUAL_HEALTH",
    },
    {
      id: "phase_2_partner_symptoms",
      text: "Is your partner experiencing any similar symptoms?",
      type: "yes_no",
      key: "partner_symptoms",
      phase: 2,
      category: "SEXUAL_HEALTH",
    },
  ],
  MEDICATION_REFILL: [],
  ASTHMA_ALLERGIES: [],
  UTIS_YEAST_INFECTION: [],
  WEIGHT_LOSS: [],
};

// Phase 3: Medical History Review (Conditional)
export const PHASE_3_QUESTIONS: DoctorChatQuestion[] = [
  {
    id: "phase_3_allergy",
    text: "I see in your medical profile that you have an allergy to {allergyName}. Are you currently avoiding this, and is it relevant to your current symptoms?",
    type: "yes_no",
    key: "allergy_confirmation",
    phase: 3,
    conditional: {
      requiresAllergy: true,
    },
  },
  {
    id: "phase_3_chronic",
    text: "You mentioned {chronicCondition} in your medical profile. Is this condition well-managed, and could it be related to your current symptoms?",
    type: "yes_no",
    key: "chronic_condition_relevance",
    phase: 3,
    conditional: {
      requiresChronicCondition: true,
    },
  },
  {
    id: "phase_3_medication",
    text: "Are you currently taking any prescription medications? If yes, have you noticed any interactions with your current symptoms?",
    type: "yes_no_with_followup",
    followup: "Which medications are you taking?",
    key: "medication_review",
    phase: 3,
    conditional: {
      requiresMedication: true,
    },
  },
];

// Phase 4: Final Assessment
export const PHASE_4_QUESTIONS: DoctorChatQuestion[] = [
  {
    id: "phase_4_additional",
    text: "Is there anything else you'd like to share about your symptoms or concerns that we haven't discussed?",
    type: "yes_no_with_followup",
    followup: "Please share any additional information.",
    key: "additional_concerns",
    phase: 4,
  },
  {
    id: "phase_4_treatment_preferences",
    text: "Based on our discussion, I'm considering treatment options. Do you have any preferences or concerns about medications?",
    type: "multiple_choice",
    options: [
      "No preferences",
      "Prefer to avoid antibiotics if possible",
      "Prefer natural/home remedies first",
      "Open to any recommended treatment",
    ],
    key: "treatment_preferences",
    phase: 4,
  },
  {
    id: "phase_4_prescription_ready",
    text: "I have enough information to prepare your treatment plan. Would you like me to proceed with creating your prescription?",
    type: "yes_no",
    key: "prescription_ready",
    phase: 4,
  },
];

// Helper Functions

/**
 * Get primary symptom from selected symptoms
 * Maps symptom ID to actual symptom name
 */
export function getPrimarySymptom(selectedSymptoms: string[]): string {
  if (selectedSymptoms.length === 0) return "your symptoms";

  // Map first symptom ID to name
  const firstSymptomId = selectedSymptoms[0];
  if (firstSymptomId) {
    const symptomName = getSymptomName(firstSymptomId);
    // If mapping found, return name; otherwise return generic
    return symptomName !== `Symptom ${firstSymptomId}`
      ? symptomName
      : "your symptoms";
  }

  return "your symptoms";
}

/**
 * Format question text with context
 */
export function formatQuestionText(
  question: DoctorChatQuestion,
  context: QuestionContext,
): string {
  let text = question.text;

  // Replace placeholders
  if (text.includes("{primarySymptom}")) {
    const primarySymptom =
      context.primarySymptom ||
      getPrimarySymptom(context.selectedSymptoms || []);
    text = text.replace(/{primarySymptom}/g, primarySymptom);
  }

  if (
    text.includes("{allergyName}") &&
    context.allergies &&
    context.allergies.length > 0
  ) {
    text = text.replace(/{allergyName}/g, context.allergies[0]);
  }

  if (
    text.includes("{chronicCondition}") &&
    context.chronicConditions &&
    context.chronicConditions.length > 0
  ) {
    text = text.replace(/{chronicCondition}/g, context.chronicConditions[0]);
  }

  return text;
}

/**
 * Get Phase 3 questions based on medical data
 */
export function getPhase3Questions(
  medicalData: { allergies?: string[]; chronicConditions?: string[] } | null,
  consultationAnswers: Record<string, string | string[]>,
): DoctorChatQuestion[] {
  if (!medicalData) return [];

  const questions: DoctorChatQuestion[] = [];

  // Check for allergies
  if (medicalData.allergies && medicalData.allergies.length > 0) {
    const allergyQuestion = PHASE_3_QUESTIONS.find(
      (q) => q.id === "phase_3_allergy",
    );
    if (allergyQuestion) questions.push(allergyQuestion);
  }

  // Check for chronic conditions
  if (
    medicalData.chronicConditions &&
    medicalData.chronicConditions.length > 0
  ) {
    const chronicQuestion = PHASE_3_QUESTIONS.find(
      (q) => q.id === "phase_3_chronic",
    );
    if (chronicQuestion) questions.push(chronicQuestion);
  }

  // Check if medications were mentioned in Phase 1
  const triedMedications = consultationAnswers["tried_otc_medications"];
  if (
    triedMedications &&
    typeof triedMedications === "string" &&
    triedMedications.toLowerCase() !== "no"
  ) {
    const medicationQuestion = PHASE_3_QUESTIONS.find(
      (q) => q.id === "phase_3_medication",
    );
    if (medicationQuestion) questions.push(medicationQuestion);
  }

  return questions;
}

/**
 * Get Phase 2 questions for category
 */
export function getPhase2Questions(
  category: HealthCategory,
  selectedSymptoms: string[],
): DoctorChatQuestion[] {
  const questions = PHASE_2_QUESTIONS[category] || [];

  // Map symptom IDs to names for comparison
  const symptomNames = getSymptomNamesFromIds(selectedSymptoms);

  // Filter questions based on conditional requirements
  return questions.filter((question) => {
    if (!question.conditional) return true;

    // Check symptom requirement - compare with symptom names, not IDs
    if (question.conditional.requiresSymptom) {
      const requiredSymptom =
        question.conditional.requiresSymptom.toLowerCase();
      const hasSymptom = symptomNames.some(
        (symptomName) =>
          symptomName.toLowerCase().includes(requiredSymptom) ||
          requiredSymptom.includes(symptomName.toLowerCase()),
      );
      if (!hasSymptom) return false;
    }

    return true;
  });
}

/**
 * Check if question should be asked based on context
 */
export function shouldAskQuestion(
  question: DoctorChatQuestion,
  context: QuestionContext,
): boolean {
  if (!question.conditional) return true;

  // Check gender requirement
  if (question.conditional.requiresGender) {
    if (context.sex !== question.conditional.requiresGender) return false;
  }

  // Check symptom requirement - map symptom IDs to names for comparison
  if (question.conditional.requiresSymptom) {
    const symptomIds = context.selectedSymptoms || [];
    const symptomNames = getSymptomNamesFromIds(symptomIds);
    const requiredSymptom = question.conditional.requiresSymptom.toLowerCase();

    const hasSymptom = symptomNames.some(
      (symptomName) =>
        symptomName.toLowerCase().includes(requiredSymptom) ||
        requiredSymptom.includes(symptomName.toLowerCase()),
    );
    if (!hasSymptom) return false;
  }

  return true;
}
