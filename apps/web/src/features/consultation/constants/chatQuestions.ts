/**
 * AI Chat Intake Questions
 * Script-driven, deterministic questions for Phase A and Phase B
 */

import type { HealthCategory } from "@sniffles/types";

export interface ChatQuestion {
  id: string;
  text: string;
  type: "text" | "yes_no" | "yes_no_with_followup" | "multiple_choice";
  followup?: string;
  options?: string[];
  allowMultiple?: boolean; // Allow multiple selections for multiple_choice questions
  key: string; // Key for storing answer in medical data
}

// Phase A: Universal questions (asked to all users)
export const PHASE_A_QUESTIONS: ChatQuestion[] = [
  {
    id: "phase_a_personal_1",
    text: "What is your age?",
    type: "text",
    key: "age",
  },
  {
    id: "phase_a_personal_2",
    text: "What is your sex assigned at birth?",
    type: "text",
    key: "sex",
  },
  {
    id: "phase_a_personal_3",
    text: "What is your approximate height?",
    type: "text",
    key: "height",
  },
  {
    id: "phase_a_personal_4",
    text: "What is your approximate weight?",
    type: "text",
    key: "weight",
  },
  {
    id: "phase_a_1",
    text: "Do you have any allergies to medications?",
    type: "yes_no_with_followup",
    followup: "Please list them",
    key: "allergies",
  },
  {
    id: "phase_a_2",
    text: "Do you have any chronic medical conditions?",
    type: "multiple_choice",
    options: [
      "Diabetes",
      "High blood pressure",
      "Asthma",
      "Heart disease",
      "None",
    ],
    allowMultiple: true,
    key: "chronicConditions",
  },
  {
    id: "phase_a_3",
    text: "Have you had any surgeries in the past?",
    type: "yes_no_with_followup",
    followup: "Please describe them",
    key: "surgicalHistory",
  },
  {
    id: "phase_a_4",
    text: "Do you currently smoke or use tobacco?",
    type: "yes_no",
    key: "smoking",
  },
  {
    id: "phase_a_5",
    text: "Do you drink alcohol?",
    type: "yes_no",
    key: "alcohol",
  },
  {
    id: "phase_a_6",
    text: "Do you use any recreational or illicit drugs?",
    type: "yes_no",
    key: "drugs",
  },
  {
    id: "phase_a_7",
    text: "Do any medical conditions run in your family?",
    type: "multiple_choice",
    options: ["Heart disease", "Diabetes", "Cancer", "None"],
    allowMultiple: true,
    key: "familyHistory",
  },
];

// Phase B: Category-specific questions
export const PHASE_B_QUESTIONS: Record<HealthCategory, ChatQuestion[]> = {
  FEVER_FLU: [
    {
      id: "fever_flu_1",
      text: "When did your symptoms start?",
      type: "text",
      key: "symptom_start",
    },
    {
      id: "fever_flu_2",
      text: "Have you had a fever? If yes, what was the highest temperature?",
      type: "yes_no_with_followup",
      followup: "What was the highest temperature?",
      key: "fever",
    },
    {
      id: "fever_flu_3",
      text: "Is your cough dry or producing mucus?",
      type: "multiple_choice",
      options: ["Dry", "Producing mucus", "No cough"],
      key: "cough_type",
    },
    {
      id: "fever_flu_4",
      text: "If producing mucus, what color is it?",
      type: "text",
      key: "mucus_color",
    },
    {
      id: "fever_flu_5",
      text: "Are you experiencing sinus pressure or facial pain?",
      type: "yes_no",
      key: "sinus_pressure",
    },
    {
      id: "fever_flu_6",
      text: "Any ear pain or ear discharge?",
      type: "yes_no",
      key: "ear_pain",
    },
    {
      id: "fever_flu_7",
      text: "Have you taken any medications or treatments so far?",
      type: "text",
      key: "medications_taken",
    },
  ],
  SKIN_ISSUES: [
    {
      id: "skin_1",
      text: "Where on your body is the affected area?",
      type: "text",
      key: "affected_area",
    },
    {
      id: "skin_2",
      text: "Approximately how large is the area?",
      type: "text",
      key: "area_size",
    },
    {
      id: "skin_3",
      text: "Is there redness, swelling, or pain?",
      type: "yes_no",
      key: "redness_swelling_pain",
    },
    {
      id: "skin_4",
      text: "Is there any drainage? If yes, what does it look like?",
      type: "yes_no_with_followup",
      followup: "What does the drainage look like?",
      key: "drainage",
    },
    {
      id: "skin_5",
      text: "Do you have fever or chills?",
      type: "yes_no",
      key: "fever_chills",
    },
    {
      id: "skin_6",
      text: "Was there any cut, wound, or injury before this started?",
      type: "yes_no",
      key: "prior_injury",
    },
    {
      id: "skin_7",
      text: "You may upload a photo for review (optional demo)",
      type: "text",
      key: "photo_upload",
    },
  ],
  INFECTIONS: [
    {
      id: "infection_1",
      text: "When did your symptoms start?",
      type: "text",
      key: "symptom_start",
    },
    {
      id: "infection_2",
      text: "Do you feel burning or pain when urinating?",
      type: "yes_no",
      key: "burning_urination",
    },
    {
      id: "infection_3",
      text: "Have you noticed blood in your urine?",
      type: "yes_no",
      key: "blood_urine",
    },
    {
      id: "infection_4",
      text: "Do you have fever or chills?",
      type: "yes_no",
      key: "fever_chills",
    },
    {
      id: "infection_5",
      text: "Any vaginal discharge? (if female)",
      type: "yes_no",
      key: "vaginal_discharge",
    },
    {
      id: "infection_6",
      text: "Any penile discharge? (if male)",
      type: "yes_no",
      key: "penile_discharge",
    },
    {
      id: "infection_7",
      text: "Have you had similar infections in the past?",
      type: "yes_no",
      key: "past_infections",
    },
    {
      id: "infection_8",
      text: "Have you taken any treatment already?",
      type: "text",
      key: "treatment_taken",
    },
  ],
  SEXUAL_HEALTH: [
    {
      id: "sexual_1",
      text: "When did your symptoms start?",
      type: "text",
      key: "symptom_start",
    },
    {
      id: "sexual_2",
      text: "Do you have any discharge? If yes, please describe it.",
      type: "yes_no_with_followup",
      followup: "Please describe the discharge",
      key: "discharge",
    },
    {
      id: "sexual_3",
      text: "Do you have pain or burning with urination?",
      type: "yes_no",
      key: "burning_urination",
    },
    {
      id: "sexual_4",
      text: "Any fever or body aches?",
      type: "yes_no",
      key: "fever_body_aches",
    },
    {
      id: "sexual_5",
      text: "Any testicular pain or swelling? (if male)",
      type: "yes_no",
      key: "testicular_pain",
    },
    {
      id: "sexual_6",
      text: "Have you had new or multiple sexual partners recently?",
      type: "yes_no",
      key: "new_partners",
    },
    {
      id: "sexual_7",
      text: "Have you used protection?",
      type: "yes_no",
      key: "protection_used",
    },
    {
      id: "sexual_8",
      text: "Is there any chance you could be pregnant? (if female)",
      type: "yes_no",
      key: "pregnancy_risk",
    },
  ],
  MEDICATION_REFILL: [],
  ASTHMA_ALLERGIES: [],
  UTIS_YEAST_INFECTION: [],
  WEIGHT_LOSS: [],
};

// Safety stop conditions
export interface SafetyStopCondition {
  trigger: (answer: string, category: HealthCategory) => boolean;
  message: string;
}

export const SAFETY_STOPS: SafetyStopCondition[] = [
  {
    trigger: (answer, category) => {
      const lowerAnswer = answer.toLowerCase();
      return (
        lowerAnswer.includes("severe pain") || lowerAnswer.includes("severe")
      );
    },
    message:
      "Based on your description of severe pain, we recommend seeking urgent care evaluation. Please visit your nearest emergency department or urgent care center.",
  },
  {
    trigger: (answer, category) => {
      const lowerAnswer = answer.toLowerCase();
      return (
        lowerAnswer.includes("eye injury") ||
        (lowerAnswer.includes("eye") &&
          (lowerAnswer.includes("hurt") || lowerAnswer.includes("pain")))
      );
    },
    message:
      "Eye injuries require immediate evaluation by an ophthalmologist. Please seek urgent eye care or visit an emergency department.",
  },
  {
    trigger: (answer, category) => {
      if (category !== "SEXUAL_HEALTH") return false;
      const lowerAnswer = answer.toLowerCase();
      return (
        lowerAnswer.includes("testicular") &&
        lowerAnswer.includes("swelling") &&
        (lowerAnswer.includes("fever") || lowerAnswer.includes("chills"))
      );
    },
    message:
      "Testicular swelling with fever requires urgent evaluation. Please seek immediate medical attention.",
  },
];
