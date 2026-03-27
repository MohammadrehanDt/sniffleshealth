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
  ClipboardPlus,
  FileBadge2,
  ClipboardCheck,
  Activity,
  BriefcaseMedical,
  CreditCard,
  UserCheck,
  Calendar,
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
    { label: "Appointments", to: ROUTES.APPOINTMENTS, icon: CalendarDays },
    { label: "Medical Profile", to: ROUTES.PATIENT_MEDICAL_PROFILE, icon: Stethoscope },
    { label: "Diagnostic Results", to: ROUTES.DIAGNOSTIC_RESULTS, icon: ClipboardPlus },
    { label: "Prescriptions", to: ROUTES.PRESCRIPTION, icon: Pill },
    { label: "My Pharmacy", to: ROUTES.PHARMACY_SELECTION, icon: Pill },
    { label: "Medication Refill", to: ROUTES.MEDICATION_REFILL, icon: Pill },
    { label: "My Profile", to: ROUTES.PROFILE, icon: User },
    { label: "Billings", to: ROUTES.PAYMENT_CONFIRMATION, icon: FileText },
  ],
  DOCTOR: [
    { label: "Dashboard", to: ROUTES.DOCTOR_DASHBOARD, icon: Home },
    {
      label: "My Consultations",
      to: ROUTES.DOCTOR_CONSULTATIONS,
      icon: MessageSquareText,
    },
    { label: "Appointments", to: ROUTES.DOCTOR_APPOINTMENTS, icon: Calendar },
    {
      label: "Medical Profile",
      to: ROUTES.DOCTOR_MEDICAL_PROFILE,
      icon: UserCheck,
    },
    {
      label: "Diagnostic Results",
      to: ROUTES.DOCTOR_DIAGNOSTICS,
      icon: Activity,
    },
    {
      label: "My Pharmacy",
      to: ROUTES.DOCTOR_PHARMACY,
      icon: BriefcaseMedical,
    },
    {
      label: "Medication Refill",
      to: ROUTES.DOCTOR_MEDICATION_REFILL,
      icon: Pill,
    },
    { label: "My Profile", to: ROUTES.PROFILE, icon: User },
    { label: "Billings", to: ROUTES.DOCTOR_BILLINGS, icon: CreditCard },
  ],
  ADMIN: [
    { label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD, icon: Home },
    {
      label: "Doctor Reviews",
      to: ROUTES.ADMIN_DASHBOARD,
      icon: ClipboardCheck,
    },
    { label: "License Reviews", to: ROUTES.ADMIN_DASHBOARD, icon: FileBadge2 },
  ],
};
