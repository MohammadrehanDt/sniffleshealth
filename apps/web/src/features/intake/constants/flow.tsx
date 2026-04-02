import type { ComponentType } from "react";
import type { IntakeFormData } from "../schemas/intake.schema";
import {
  FinalStep,
  Step10ReviewInterface,
  Step1Identity,
  Step2Symptoms,
  Step3FollowUp,
  Step4Vitals,
  Step5Medical,
  Step6Surgical,
  Step7Allergies,
  Step8Medications,
  Step9SocialHistory,
} from "../components/steps";

export const TOTAL_DISPLAY_STEPS = 10;
export const MAX_STEP = 11;

export const DEFAULT_VALUES: IntakeFormData = {
  state: "",
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  symptoms: [],
  severity: 5,
  fever: 98.6,
  coughType: "",
  duration: "",
  medicalHistory: [],
  surgicalHistory: [],
  allergies: [],
  familyHistory: [],
  drugs: [],
  consultationType: "",
  offeringId: "",
};

export const STEP_COMPONENTS: Record<number, ComponentType> = {
  1: Step1Identity,
  2: Step2Symptoms,
  3: Step3FollowUp,
  4: Step4Vitals,
  5: Step5Medical,
  6: Step6Surgical,
  7: Step7Allergies,
  8: Step8Medications,
  9: Step9SocialHistory,
  10: Step10ReviewInterface,
  11: FinalStep,
};
