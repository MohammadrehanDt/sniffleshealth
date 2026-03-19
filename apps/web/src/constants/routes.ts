/**
 * Application route constants
 * Single source of truth for all route paths
 */

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  SYMPTOMS: "/symptoms",
  MEDICAL_PROFILE: "/medical-profile",
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
  DOCTOR_DASHBOARD: "/doctor/dashboard",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
