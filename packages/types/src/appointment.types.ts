/**
 * Appointment-related types
 */

export type AppointmentStatus =
  | "CONFIRMED"
  | "WAITING_FOR_CONFIRMATION"
  | "AWAITING"
  | "COMPLETED"
  | "CANCELLED";

export type AppointmentConsultationType = "CHAT" | "VIDEO";

export interface Appointment {
  id: string;
  status: AppointmentStatus;
  date: string;
  time: string;
  physician: {
    name: string;
    specialty: string;
    avatar?: string;
  };
  type: AppointmentConsultationType;
  reason?: string;
  symptoms?: string[];
}
