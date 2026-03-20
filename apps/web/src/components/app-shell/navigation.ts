import type { UserRole } from "@sniffles/types";
import {
  CalendarDays,
  ClipboardList,
  Home,
  MessageSquareText,
  Pill,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { ROUTES } from "@/constants";

export type NavigationItem = {
  label: string;
  to: string;
  icon: typeof Home;
};

export const navigationByRole: Record<UserRole, NavigationItem[]> = {
  patient: [
    { label: "Dashboard", to: ROUTES.DASHBOARD, icon: Home },
    { label: "Consultations", to: ROUTES.DOCTOR_CHAT, icon: MessageSquareText },
    { label: "Appointments", to: ROUTES.FINDING_DOCTOR, icon: CalendarDays },
    { label: "Prescriptions", to: ROUTES.PRESCRIPTION, icon: Pill },
    { label: "Medical Profile", to: ROUTES.MEDICAL_PROFILE, icon: Stethoscope },
  ],
  doctor: [
    { label: "Dashboard", to: ROUTES.DOCTOR_DASHBOARD, icon: Home },
    { label: "Reviews", to: ROUTES.DOCTOR_CHAT, icon: ClipboardList },
    { label: "Patients", to: ROUTES.FINDING_DOCTOR, icon: Users },
    { label: "Compliance", to: ROUTES.HIPAA_COMPLIANCE, icon: ShieldCheck },
  ],
};
