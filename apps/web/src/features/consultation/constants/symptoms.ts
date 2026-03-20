/**
 * Category-specific symptom definitions
 * Based on PRD v1 requirements
 */

import type { Symptom, HealthCategory } from "@sniffles/types";

export const CATEGORY_SYMPTOMS: Record<HealthCategory, Symptom[]> = {
  FEVER_FLU: [
    { id: "fever_flu_1", name: "Fever", category: "FEVER_FLU" },
    { id: "fever_flu_2", name: "Chills", category: "FEVER_FLU" },
    { id: "fever_flu_3", name: "Body aches", category: "FEVER_FLU" },
    { id: "fever_flu_4", name: "Fatigue", category: "FEVER_FLU" },
    { id: "fever_flu_5", name: "Headache", category: "FEVER_FLU" },
    { id: "fever_flu_6", name: "Cough", category: "FEVER_FLU" },
    { id: "fever_flu_7", name: "Sore throat", category: "FEVER_FLU" },
    { id: "fever_flu_8", name: "Nasal congestion", category: "FEVER_FLU" },
    { id: "fever_flu_9", name: "Sinus pressure", category: "FEVER_FLU" },
    { id: "fever_flu_10", name: "Ear pain", category: "FEVER_FLU" },
  ],
  SKIN_ISSUES: [
    { id: "skin_1", name: "Redness", category: "SKIN_ISSUES" },
    { id: "skin_2", name: "Swelling", category: "SKIN_ISSUES" },
    { id: "skin_3", name: "Pain or tenderness", category: "SKIN_ISSUES" },
    { id: "skin_4", name: "Rash", category: "SKIN_ISSUES" },
    { id: "skin_5", name: "Itching", category: "SKIN_ISSUES" },
    { id: "skin_6", name: "Drainage or pus", category: "SKIN_ISSUES" },
    { id: "skin_7", name: "Fever", category: "SKIN_ISSUES" },
    { id: "skin_8", name: "Skin wound or sore", category: "SKIN_ISSUES" },
  ],
  INFECTIONS: [
    {
      id: "infection_1",
      name: "Burning with urination",
      category: "INFECTIONS",
    },
    { id: "infection_2", name: "Frequent urination", category: "INFECTIONS" },
    { id: "infection_3", name: "Lower abdominal pain", category: "INFECTIONS" },
    { id: "infection_4", name: "Blood in urine", category: "INFECTIONS" },
    { id: "infection_5", name: "Fever", category: "INFECTIONS" },
    { id: "infection_6", name: "Chills", category: "INFECTIONS" },
    { id: "infection_7", name: "Flank or back pain", category: "INFECTIONS" },
  ],
  SEXUAL_HEALTH: [
    {
      id: "sexual_1",
      name: "Vaginal discharge (female)",
      category: "SEXUAL_HEALTH",
    },
    {
      id: "sexual_2",
      name: "Penile discharge (male)",
      category: "SEXUAL_HEALTH",
    },
    {
      id: "sexual_3",
      name: "Burning with urination",
      category: "SEXUAL_HEALTH",
    },
    {
      id: "sexual_4",
      name: "Genital sores or rash",
      category: "SEXUAL_HEALTH",
    },
    { id: "sexual_5", name: "Genital itching", category: "SEXUAL_HEALTH" },
    {
      id: "sexual_6",
      name: "Testicular pain or swelling",
      category: "SEXUAL_HEALTH",
    },
    { id: "sexual_7", name: "Fever", category: "SEXUAL_HEALTH" },
  ],
  MEDICATION_REFILL: [
    {
      id: "medication_refill_1",
      name: "Need prescription refill",
      category: "MEDICATION_REFILL",
    },
    {
      id: "medication_refill_2",
      name: "Medication running low",
      category: "MEDICATION_REFILL",
    },
    {
      id: "medication_refill_3",
      name: "Current medication not working",
      category: "MEDICATION_REFILL",
    },
    {
      id: "medication_refill_4",
      name: "Side effects from medication",
      category: "MEDICATION_REFILL",
    },
    {
      id: "medication_refill_5",
      name: "Questions about medication",
      category: "MEDICATION_REFILL",
    },
    {
      id: "medication_refill_6",
      name: "Dosage adjustment needed",
      category: "MEDICATION_REFILL",
    },
    {
      id: "medication_refill_7",
      name: "Medication interaction concerns",
      category: "MEDICATION_REFILL",
    },
  ],
  ASTHMA_ALLERGIES: [
    {
      id: "asthma_allergies_1",
      name: "Shortness of breath",
      category: "ASTHMA_ALLERGIES",
    },
    {
      id: "asthma_allergies_2",
      name: "Wheezing",
      category: "ASTHMA_ALLERGIES",
    },
    {
      id: "asthma_allergies_3",
      name: "Chest tightness",
      category: "ASTHMA_ALLERGIES",
    },
    {
      id: "asthma_allergies_4",
      name: "Allergic reactions",
      category: "ASTHMA_ALLERGIES",
    },
    {
      id: "asthma_allergies_5",
      name: "Runny nose",
      category: "ASTHMA_ALLERGIES",
    },
    {
      id: "asthma_allergies_6",
      name: "Sneezing",
      category: "ASTHMA_ALLERGIES",
    },
    {
      id: "asthma_allergies_7",
      name: "Itchy eyes",
      category: "ASTHMA_ALLERGIES",
    },
    {
      id: "asthma_allergies_8",
      name: "Nasal congestion",
      category: "ASTHMA_ALLERGIES",
    },
    {
      id: "asthma_allergies_9",
      name: "Coughing",
      category: "ASTHMA_ALLERGIES",
    },
  ],
  UTIS_YEAST_INFECTION: [
    {
      id: "utis_yeast_1",
      name: "Burning with urination",
      category: "UTIS_YEAST_INFECTION",
    },
    {
      id: "utis_yeast_2",
      name: "Frequent urination",
      category: "UTIS_YEAST_INFECTION",
    },
    {
      id: "utis_yeast_3",
      name: "Vaginal itching",
      category: "UTIS_YEAST_INFECTION",
    },
    {
      id: "utis_yeast_4",
      name: "Vaginal discharge",
      category: "UTIS_YEAST_INFECTION",
    },
    {
      id: "utis_yeast_5",
      name: "Lower abdominal pain",
      category: "UTIS_YEAST_INFECTION",
    },
    {
      id: "utis_yeast_6",
      name: "Pain during urination",
      category: "UTIS_YEAST_INFECTION",
    },
    {
      id: "utis_yeast_7",
      name: "Unusual discharge",
      category: "UTIS_YEAST_INFECTION",
    },
    {
      id: "utis_yeast_8",
      name: "Urgency to urinate",
      category: "UTIS_YEAST_INFECTION",
    },
    {
      id: "utis_yeast_9",
      name: "Blood in urine",
      category: "UTIS_YEAST_INFECTION",
    },
  ],
  WEIGHT_LOSS: [
    {
      id: "weight_loss_1",
      name: "Difficulty losing weight",
      category: "WEIGHT_LOSS",
    },
    {
      id: "weight_loss_2",
      name: "Weight gain concerns",
      category: "WEIGHT_LOSS",
    },
    {
      id: "weight_loss_3",
      name: "Metabolism questions",
      category: "WEIGHT_LOSS",
    },
    { id: "weight_loss_4", name: "Diet consultation", category: "WEIGHT_LOSS" },
    { id: "weight_loss_5", name: "Exercise guidance", category: "WEIGHT_LOSS" },
    {
      id: "weight_loss_6",
      name: "Hormonal weight issues",
      category: "WEIGHT_LOSS",
    },
    {
      id: "weight_loss_7",
      name: "Weight management plan",
      category: "WEIGHT_LOSS",
    },
    {
      id: "weight_loss_8",
      name: "Nutritional counseling",
      category: "WEIGHT_LOSS",
    },
  ],
};
