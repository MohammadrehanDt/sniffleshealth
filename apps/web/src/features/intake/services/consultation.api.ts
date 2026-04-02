import { api } from "@/lib/api";
import type { IntakeFormData } from "../schemas/intake.schema";

export interface SubmitConsultationPayload {
  firstName: string;
  lastName: string;
  state: string;
  dob: string;
  gender: string;
  severity: number;
  consultationType: string;
  offeringId: string;
  symptoms: string[];
  followUp: {
    duration: string;
    fever: number;
    coughType: string;
    sputumColor?: string;
  };
  vitals: {
    bpSystolic?: string;
    bpDiastolic?: string;
    heartRate?: string;
    readingLocation?: string;
    weight?: string;
    height?: string;
  };
  medicalHistory: string[];
  surgicalHistory: string[];
  allergies: string[];
  medications: {
    summary?: string;
  };
  socialHistory: {
    smoking?: string;
    smokingIntensity?: string;
    alcohol?: string;
    familyHistory: string[];
    familyHistoryOther?: string;
    drugs: string[];
    drugUse?: string;
  };
}

export interface SubmitConsultationResponse {
  consultation: {
    id: string;
    consultationType: string;
  };
  payment: {
    requestedPaymentId: string;
    invoiceId: string | null;
    amount: string | null;
    status: string | null;
    currency: string | null;
    createdAt: string | null;
  };
}

export interface ConsultationPricingOption {
  id: string;
  title: string;
  price: string;
  currency: string;
  billingFrequency: string | null;
  initialPaymentAmount: string | null;
  initialPriceWithTaxes: string | null;
  wait: string;
}

export function buildConsultationPayload(
  values: IntakeFormData,
): SubmitConsultationPayload {
  if (!values.consultationType.trim() || !values.offeringId.trim()) {
    throw new Error("Please select a consultation type.");
  }

  return {
    firstName: values.firstName,
    lastName: values.lastName,
    state: values.state,
    dob: values.dob,
    gender: values.otherGender?.trim() || values.gender,
    severity: values.severity,
    consultationType: values.consultationType,
    offeringId: values.offeringId,
    symptoms: values.manualSymptom?.trim()
      ? [...values.symptoms, values.manualSymptom.trim()]
      : values.symptoms,
    followUp: {
      duration: values.duration,
      fever: values.fever,
      coughType: values.coughType,
      sputumColor: values.sputumColor,
    },
    vitals: {
      bpSystolic: values.bpSystolic,
      bpDiastolic: values.bpDiastolic,
      heartRate: values.heartRate,
      readingLocation: values.readingLocation,
      weight: values.weight,
      height: values.height,
    },
    medicalHistory: values.medicalHistoryOther?.trim()
      ? [...values.medicalHistory, values.medicalHistoryOther.trim()]
      : values.medicalHistory,
    surgicalHistory: values.surgicalHistoryOther?.trim()
      ? [...values.surgicalHistory, values.surgicalHistoryOther.trim()]
      : values.surgicalHistory,
    allergies: values.allergiesOther?.trim()
      ? [...values.allergies, values.allergiesOther.trim()]
      : values.allergies,
    medications: {
      summary: values.medications?.trim(),
    },
    socialHistory: {
      smoking: values.smoking,
      smokingIntensity: values.smokingIntensity,
      alcohol: values.alcohol,
      familyHistory: values.familyHistory,
      familyHistoryOther: values.familyHistoryOther,
      drugs: values.drugs,
      drugUse: values.drugUse,
    },
  };
}

export const consultationApi = {
  getPricing: () =>
    api
      .get<{ pricing: ConsultationPricingOption[] }>("/consultation/pricing")
      .then((response) => response.data.pricing),
  submit: (payload: SubmitConsultationPayload) =>
    api
      .post<SubmitConsultationResponse>("/consultation/submit", payload)
      .then((response) => response.data),
};
