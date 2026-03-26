/**
 * Application route constants
 * Single source of truth for all route paths
 */

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DOCTOR_PENDING_VERIFICATION: "/doctor/pending-verification",
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
  DOCTOR_DASHBOARD: "/doctor/dashboard",
  DOCTOR_CONSULTATIONS: "/doctor-chat",
  DOCTOR_APPOINTMENTS: "/appointments",
  DOCTOR_MEDICAL_PROFILE: "/medical-profile",
  DOCTOR_DIAGNOSTICS: "/prescription",
  DOCTOR_PHARMACY: "/pharmacy-selection",
  DOCTOR_MEDICATION_REFILL: "/medication-refill",
  DOCTOR_BILLINGS: "/payment-confirmation",
  DOCTOR_LICENSES: "/doctor/licenses",
  ADMIN_DASHBOARD: "/admin/dashboard",
  PROFILE: "/profile",
  INTAKE: "/consultations",
  PATIENT_MEDICAL_PROFILE: "/medical-profile",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
