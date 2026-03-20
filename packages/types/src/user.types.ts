/**
 * User and patient-related types
 */

export interface AddressData {
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
}

export interface UserProfile {
  addressData: AddressData | null;
  kycCompleted: boolean;
  hipaaCompliant: boolean;
}

export type UserRole = "patient" | "doctor";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string | null;
  emailVerified: boolean;
}
