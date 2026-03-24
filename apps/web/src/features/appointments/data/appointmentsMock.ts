import { Appointment } from "@sniffles/types";

export const upcomingAppointments: Appointment[] = [
  {
    id: "#ID81440-9633",
    status: "CONFIRMED",
    date: "Today",
    time: "4:30 PM",
    physician: {
      name: "Dr. Sarah Chen",
      specialty: "Cardiologist",
      avatar: "/images/Ellipse 1.png",
    },
    type: "VIDEO",
    reason: "General Discussion",
  },
  {
    id: "#ID81440-9633",
    status: "CONFIRMED",
    date: "Tomorrow",
    time: "4:30 PM",
    physician: {
      name: "Dr. Sarah Chen",
      specialty: "Cardiologist",
      avatar: "/images/Ellipse 1.png",
    },
    type: "VIDEO",
    reason: "General Discussion",
  },
  {
    id: "#ID81440-9633",
    status: "WAITING_FOR_CONFIRMATION",
    date: "25 March 2026",
    time: "4:30 PM",
    physician: {
      name: "Dr. Sarah Chen",
      specialty: "Cardiologist",
      avatar: "/images/Ellipse 1.png",
    },
    type: "CHAT",
    reason: "General Discussion",
  },
];

export const appointmentHistory: Appointment[] = [
  {
    id: "H001",
    status: "AWAITING",
    date: "Mar 12, 2026",
    time: "10:00 AM",
    physician: {
      name: "Dr. Sarah Chen",
      specialty: "Cardiologist",
    },
    type: "CHAT",
    symptoms: ["Fever", "Cough"],
  },
  {
    id: "H002",
    status: "COMPLETED",
    date: "Mar 2, 2026",
    time: "11:30 AM",
    physician: {
      name: "Dr. Sarah Chen",
      specialty: "Cardiologist",
    },
    type: "VIDEO",
    symptoms: ["Sore throat", "Fever"],
  },
  {
    id: "H003",
    status: "COMPLETED",
    date: "Feb 18, 2026",
    time: "03:00 PM",
    physician: {
      name: "Dr. James Miller",
      specialty: "General Physician",
    },
    type: "CHAT",
    symptoms: ["Back pain"],
  },
  {
    id: "H004",
    status: "COMPLETED",
    date: "Feb 5, 2026",
    time: "09:00 AM",
    physician: {
      name: "Dr. Sarah Chen",
      specialty: "Cardiologist",
    },
    type: "CHAT",
    symptoms: ["Headache", "Fatigue"],
  },
];
