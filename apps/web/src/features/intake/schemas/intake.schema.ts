import * as z from "zod";

const stateSchema = z.string().min(1, "Please select your state");

// ── Per-step validation schemas ──────────────────────────────────────

export const step1Schema = z.object({
  state: stateSchema,
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Please select a gender"),
});

export const step2Schema = z.object({
  symptoms: z.array(z.string()).min(1, "Select at least one symptom"),
});

export const step3Schema = z.object({
  duration: z.string().min(1, "Please enter when symptoms started"),
  severity: z.number().min(1).max(10),
  coughType: z.string().min(1, "Please select cough type"),
});

export const step4Schema = z.object({
  bpSystolic: z.string().optional(),
  bpDiastolic: z.string().optional(),
  heartRate: z.string().optional(),
});

// Steps 5-9 are optional selections — no hard requirements
export const step5Schema = z.object({});
export const step6Schema = z.object({});
export const step7Schema = z.object({});
export const step8Schema = z.object({});
export const step9Schema = z.object({});
export const step10Schema = z.object({});

export const step11Schema = z.object({
  consultationType: z.string().min(1, "Please select a consultation type"),
  offeringId: z.string().min(1, "Please select a consultation type"),
});

// Map step number → its validation schema
export const stepSchemas: Record<number, z.ZodObject<any>> = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
  5: step5Schema,
  6: step6Schema,
  7: step7Schema,
  8: step8Schema,
  9: step9Schema,
  10: step10Schema,
  11: step11Schema,
};

// Fields that belong to each step (for targeted trigger)
export const stepFields: Record<number, string[]> = {
  1: ["state", "firstName", "lastName", "dob", "gender"],
  2: ["symptoms"],
  3: ["duration", "severity", "coughType"],
  4: ["bpSystolic", "bpDiastolic", "heartRate", "readingLocation"],
  5: ["medicalHistory"],
  6: ["surgicalHistory"],
  7: ["allergies"],
  8: ["medications"],
  9: ["smoking", "alcohol", "familyHistory", "drugs"],
  10: [],
  11: ["consultationType", "offeringId"],
};

// ── Full schema (all fields, used by react-hook-form as base) ────────

export const intakeSchema = z.object({
  // Step 1: Identity
  state: stateSchema.default(""),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .default(""),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .default(""),
  dob: z.string().min(1, "Date of birth is required").default(""),
  gender: z.string().min(1, "Please select a gender").default(""),
  otherGender: z.string().optional(),

  // Step 2: Symptoms
  symptoms: z
    .array(z.string())
    .min(1, "Select at least one symptom")
    .default([]),
  manualSymptom: z.string().optional(),

  // Step 3: Follow-Up
  duration: z.string().min(1, "Please enter when symptoms started").default(""),
  severity: z.number().min(1).max(10).default(5),
  fever: z.number().default(98.6),
  coughType: z.string().min(1, "Please select cough type").default(""),
  sputumColor: z.string().optional(),

  // Step 4: Vitals
  bpSystolic: z.string().optional(),
  bpDiastolic: z.string().optional(),
  heartRate: z.string().optional(),
  readingLocation: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),

  // Step 5: Past Medical History
  medicalHistory: z.array(z.string()).default([]),
  medicalHistoryOther: z.string().optional(),

  // Step 6: Past Surgical History
  surgicalHistory: z.array(z.string()).default([]),
  surgicalHistoryOther: z.string().optional(),

  // Step 7: Allergies
  allergies: z.array(z.string()).default([]),
  allergiesOther: z.string().optional(),

  // Step 8: Medications
  medications: z.string().optional(),

  // Step 9: Social & Family History
  smoking: z.string().optional(),
  smokingIntensity: z.string().optional(),
  alcohol: z.string().optional(),
  familyHistory: z.array(z.string()).default([]),
  familyHistoryOther: z.string().optional(),
  drugs: z.array(z.string()).default([]),
  drugUse: z.string().optional(),

  // Step 11: Consultation
  consultationType: z.string().default(""),
  offeringId: z.string().default(""),
});

export type IntakeFormData = z.infer<typeof intakeSchema>;
