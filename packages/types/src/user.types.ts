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

export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";

export type DoctorVerificationStatus =
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "REJECTED";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string | null;
  healthiePatientId?: string | null;
  healthieProviderId?: string | null;
  emailVerified: boolean;
  phone: string | null;
  dateOfBirth: string | null;
  weight: number | null;
  weightUnit: string | null;
  height: number | null;
  heightUnit: string | null;
  avatarUrl: string | null;
  verificationStatus?: DoctorVerificationStatus | null;
  npiNumber?: string | null;
}

/** Payload for PATCH /users/profile */
export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  weight?: number | null;
  weightUnit?: string;
  height?: number | null;
  heightUnit?: string;
}

/** Address returned from the API */
export interface ProfileAddress {
  id: string;
  label: string;
  addressLine1: string;
  addressLine2: string | null;
  state: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
}

/** Payload for creating/updating an address */
export interface UpsertAddressPayload {
  label: string;
  addressLine1: string;
  addressLine2?: string;
  state: string;
  city: string;
  zipCode: string;
  isDefault?: boolean;
}
