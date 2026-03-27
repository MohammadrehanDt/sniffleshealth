import type { UserRole } from "@sniffles/types";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Home,
  MessageSquareText,
  Pill,
  ShieldCheck,
  Stethoscope,
  User,
  Users,
} from "lucide-react";
import { ROUTES } from "@/constants";

export type NavigationItem = {
  label: string;
  to: string;
  icon: typeof Home;
};

export const navigationByRole: Record<UserRole, NavigationItem[]> = {
  PATIENT: [
    { label: "Dashboard", to: ROUTES.DASHBOARD, icon: Home },
    { label: "Consultations", to: ROUTES.DOCTOR_CHAT, icon: MessageSquareText },
    { label: "Appointments", to: ROUTES.FINDING_DOCTOR, icon: CalendarDays },
    { label: "Medical Profile", to: ROUTES.MEDICAL_PROFILE, icon: Stethoscope },
    { label: "Diagnostic Results", to: ROUTES.PRESCRIPTION, icon: FileText },
    { label: "My Pharmacy", to: ROUTES.PHARMACY_SELECTION, icon: Pill },
    { label: "Medication Refill", to: ROUTES.MEDICATION_REFILL, icon: Pill },
    { label: "My Profile", to: ROUTES.PROFILE, icon: User },
    { label: "Billings", to: ROUTES.PAYMENT_CONFIRMATION, icon: FileText },
  ],
  DOCTOR: [
    { label: "Dashboard", to: ROUTES.DOCTOR_DASHBOARD, icon: Home },
    { label: "Reviews", to: ROUTES.DOCTOR_CHAT, icon: ClipboardList },
    { label: "Patients", to: ROUTES.FINDING_DOCTOR, icon: Users },
    { label: "Compliance", to: ROUTES.HIPAA_COMPLIANCE, icon: ShieldCheck },
    { label: "Profile", to: ROUTES.PROFILE, icon: User },
  ],
};
