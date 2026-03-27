/**
 * Application route constants
 * Single source of truth for all route paths
 */

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  SYMPTOMS: "/symptoms",
  MEDICAL_PROFILE_OLD: "/medical-profile",
  SUMMARY: "/summary",
  CONSULTATION: "/consultation",
  SELECT_CONSULTATION_TYPE: "/select-consultation-type",
  PAYMENT_CONFIRMATION: "/payment-confirmation",
  HIPAA_COMPLIANCE: "/hipaa-compliance",
  KYC: "/kyc",
  ADDRESS_DETAILS: "/address-details",
  FINDING_DOCTOR: "/finding-doctor",
  DOCTOR_CHAT: "/doctor-chat",
  PRESCRIPTION: "/prescription",
  PHARMACY_SELECTION: "/pharmacy-selection",
  PHARMACY_CONFIRMATION: "/pharmacy-confirmation",
  DASHBOARD: "/dashboard",
  APPOINTMENTS: "/appointments",
  MEDICATION_REFILL: "/medication-refill",
  DIAGNOSTIC_RESULTS: "/diagnostic-results",
  DIAGNOSTIC_RESULT_DETAILS: "/diagnostic-results/:id",
  DOCTOR_DASHBOARD: "/doctor/dashboard",
  PROFILE: "/profile",
  INTAKE: "/consultations",
  PATIENT_MEDICAL_PROFILE: "/medical-profile",
  DOCTOR_CONSULTATIONS: "/doctor/consultations",
  DOCTOR_APPOINTMENTS: "/doctor/appointments",
  DOCTOR_MEDICAL_PROFILE: "/doctor/medical-profile",
  DOCTOR_DIAGNOSTICS: "/doctor/diagnostics",
  DOCTOR_PHARMACY: "/doctor/pharmacy",
  DOCTOR_MEDICATION_REFILL: "/doctor/medication-refill",
  DOCTOR_BILLINGS: "/doctor/billings",
  ADMIN_DASHBOARD: "/admin/dashboard",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
