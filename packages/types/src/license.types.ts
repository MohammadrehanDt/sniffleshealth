export type LicenseStatus =
  | "PENDING_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "EXPIRED";

export type LicenseAuditAction =
  | "SUBMITTED"
  | "VERIFIED"
  | "REJECTED"
  | "RENEWAL_SUBMITTED"
  | "EXPIRED_AUTO"
  | "REMINDER_60_DAYS"
  | "REMINDER_30_DAYS";

export interface StateLicenseResponse {
  id: string;
  stateCode: string;
  licenseNumber: string;
  expiryDate: string;
  obtainedDate: string | null;
  certificateUrl: string | null;
  status: LicenseStatus;
  rejectionReason: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitLicensePayload {
  stateCode: string;
  licenseNumber: string;
  expiryDate: string;
  obtainedDate?: string;
}

export interface RenewLicensePayload {
  expiryDate: string;
}

export interface LicenseAuditLogResponse {
  id: string;
  action: LicenseAuditAction;
  note: string | null;
  performedByName: string | null;
  createdAt: string;
}

export interface AdminDoctorListItem {
  id: string;
  fullName: string | null;
  email: string;
  npiNumber: string | null;
  phone: string | null;
  verificationStatus: "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";
  createdAt: string;
  licenseCounts: { verified: number; pending: number; expired: number };
}

export interface AdminVerifyDoctorPayload {
  action: "VERIFY" | "REJECT";
  note?: string;
}

export interface AdminVerifyLicensePayload {
  action: "VERIFY" | "REJECT";
  rejectionReason?: string;
}
