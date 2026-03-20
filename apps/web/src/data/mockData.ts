// ── Dashboard Summary (matches future GET /api/dashboard response) ──

export interface DashboardStat {
  key: string;
  title: string;
  value: string | number;
  icon: string; // image path or lucide icon name
  iconBg: string; // tailwind class for icon circle bg
  linkLabel: string;
  linkUrl: string;
}

export interface HealthSummaryItem {
  id: string;
  content: string;
}

export interface DashboardAlert {
  type: "info" | "warning" | "error" | "success";
  message: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  healthSummary: HealthSummaryItem[];
  alerts: DashboardAlert[];
}

export const dashboardData: DashboardData = {
  stats: [
    {
      key: "consultations",
      title: "Total Consultations",
      value: 8,
      icon: "/images/bell.png",
      iconBg: "bg-semantic-info",
      linkLabel: "View All",
      linkUrl: "/consultations",
    },
    {
      key: "appointments",
      title: "Upcoming Appointments",
      value: 3,
      icon: "/images/calendar-clock.png",
      iconBg: "bg-semantic-error",
      linkLabel: "Join Now",
      linkUrl: "/appointments",
    },
    {
      key: "medications",
      title: "Active Medications",
      value: 3,
      icon: "/images/pill.png",
      iconBg: "bg-semantic-warning",
      linkLabel: "Request Refill",
      linkUrl: "/medication-refill",
    },
    {
      key: "balance",
      title: "Outstanding Balance",
      value: "$505",
      icon: "/images/bell.png",
      iconBg: "bg-semantic-success",
      linkLabel: "Add Balance",
      linkUrl: "/billings",
    },
  ],
  healthSummary: [
    { id: "cons", content: "Last Consultation: Mar 12, 2026" },
    { id: "symp", content: "Common Symptoms: Fever, Headache" },
    { id: "cond", content: "Active Conditions: None" },
  ],
  alerts: [
    {
      type: "warning",
      message:
        "You've reported fever multiple times this month. Consider a doctor consultation.",
    },
  ],
};

export interface Consultation {
  id: string;
  type: string;
  doctor: string;
  specialty: string;
  date: string;
  status: "Awaiting" | "In Progress" | "Completed" | "Cancelled";
  symptoms?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled";
}

export interface LabResult {
  id: string;
  test: string;
  date: string;
  result: string;
  normalRange: string;
  status: "Normal" | "Abnormal" | "Pending";
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "Paused";
}

export interface BillingRecord {
  id: string;
  service: string;
  date: string;
  amount: number;
  insuranceCovered: number;
  outOfPocket: number;
  status: "Paid" | "Pending" | "Overdue";
}

export const consultations: Consultation[] = [
  {
    id: "C001",
    type: "General Checkup",
    doctor: "Dr. Sarah Chen",
    specialty: "Internal Medicine",
    date: "2026-03-15",
    status: "Completed",
    symptoms: "Fatigue, mild headache",
    notes: "Routine annual checkup",
  },
  {
    id: "C002",
    type: "Follow-up",
    doctor: "Dr. James Wilson",
    specialty: "Cardiology",
    date: "2026-03-12",
    status: "In Progress",
    symptoms: "Chest tightness, shortness of breath",
    notes: "Heart monitoring follow-up",
  },
  {
    id: "C003",
    type: "New Consultation",
    doctor: "Dr. Emily Park",
    specialty: "Dermatology",
    date: "2026-03-18",
    status: "Awaiting",
    symptoms: "Skin rash, itching",
  },
  {
    id: "C004",
    type: "Urgent Care",
    doctor: "Dr. Michael Brown",
    specialty: "Emergency Medicine",
    date: "2026-03-10",
    status: "Completed",
    symptoms: "Ankle pain, swelling",
    notes: "Sprained ankle treatment",
  },
  {
    id: "C005",
    type: "Specialist Referral",
    doctor: "Dr. Lisa Adams",
    specialty: "Orthopedics",
    date: "2026-03-20",
    status: "Awaiting",
    symptoms: "Knee pain, limited mobility",
  },
  {
    id: "C006",
    type: "Telemedicine",
    doctor: "Dr. Sarah Chen",
    specialty: "Internal Medicine",
    date: "2026-03-08",
    status: "Completed",
    symptoms: "Fever, sore throat",
  },
  {
    id: "C007",
    type: "Lab Review",
    doctor: "Dr. James Wilson",
    specialty: "Cardiology",
    date: "2026-03-05",
    status: "Completed",
    symptoms: "Routine follow-up",
  },
  {
    id: "C008",
    type: "Prescription Renewal",
    doctor: "Dr. Emily Park",
    specialty: "Dermatology",
    date: "2026-03-22",
    status: "Awaiting",
    symptoms: "Acne, dryness",
  },
];

export const appointments: Appointment[] = [
  {
    id: "A001",
    doctor: "Dr. Sarah Chen",
    specialty: "Internal Medicine",
    date: "2026-03-25",
    time: "09:00 AM",
    location: "Main Clinic, Room 204",
    status: "Confirmed",
  },
  {
    id: "A002",
    doctor: "Dr. James Wilson",
    specialty: "Cardiology",
    date: "2026-03-28",
    time: "02:30 PM",
    location: "Heart Center, Suite 5B",
    status: "Scheduled",
  },
  {
    id: "A003",
    doctor: "Dr. Lisa Adams",
    specialty: "Orthopedics",
    date: "2026-04-02",
    time: "11:00 AM",
    location: "Sports Medicine Wing",
    status: "Scheduled",
  },
  {
    id: "A004",
    doctor: "Dr. Emily Park",
    specialty: "Dermatology",
    date: "2026-04-05",
    time: "03:00 PM",
    location: "Derma Clinic, Room 102",
    status: "Confirmed",
  },
  {
    id: "A005",
    doctor: "Dr. Michael Brown",
    specialty: "Emergency Medicine",
    date: "2026-03-10",
    time: "08:00 AM",
    location: "ER Bay 3",
    status: "Completed",
  },
];

export const labResults: LabResult[] = [
  {
    id: "L001",
    test: "Complete Blood Count (CBC)",
    date: "2026-03-14",
    result: "Within Range",
    normalRange: "4.5-11.0 x10^9/L",
    status: "Normal",
  },
  {
    id: "L002",
    test: "Lipid Panel",
    date: "2026-03-14",
    result: "LDL: 142 mg/dL",
    normalRange: "<100 mg/dL",
    status: "Abnormal",
  },
  {
    id: "L003",
    test: "Hemoglobin A1C",
    date: "2026-03-14",
    result: "5.4%",
    normalRange: "< 5.7%",
    status: "Normal",
  },
  {
    id: "L004",
    test: "Thyroid Panel (TSH)",
    date: "2026-03-14",
    result: "2.1 mIU/L",
    normalRange: "0.4-4.0 mIU/L",
    status: "Normal",
  },
  {
    id: "L005",
    test: "Vitamin D",
    date: "2026-03-14",
    result: "Pending",
    normalRange: "30-100 ng/mL",
    status: "Pending",
  },
  {
    id: "L006",
    test: "Liver Function (ALT)",
    date: "2026-03-07",
    result: "28 U/L",
    normalRange: "7-56 U/L",
    status: "Normal",
  },
];

export const medications: Medication[] = [
  {
    id: "M001",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    prescribedBy: "Dr. James Wilson",
    startDate: "2026-01-15",
    endDate: "2026-07-15",
    status: "Active",
  },
  {
    id: "M002",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily at bedtime",
    prescribedBy: "Dr. James Wilson",
    startDate: "2026-02-01",
    endDate: "2026-08-01",
    status: "Active",
  },
  {
    id: "M003",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily with meals",
    prescribedBy: "Dr. Sarah Chen",
    startDate: "2025-11-01",
    endDate: "2026-05-01",
    status: "Active",
  },
  {
    id: "M004",
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    prescribedBy: "Dr. Michael Brown",
    startDate: "2026-03-10",
    endDate: "2026-03-20",
    status: "Completed",
  },
  {
    id: "M005",
    name: "Ibuprofen",
    dosage: "400mg",
    frequency: "As needed",
    prescribedBy: "Dr. Lisa Adams",
    startDate: "2026-03-10",
    endDate: "2026-04-10",
    status: "Paused",
  },
];

export const billingRecords: BillingRecord[] = [
  {
    id: "B001",
    service: "Annual Physical Exam",
    date: "2026-03-15",
    amount: 350,
    insuranceCovered: 280,
    outOfPocket: 70,
    status: "Paid",
  },
  {
    id: "B002",
    service: "Cardiology Consultation",
    date: "2026-03-12",
    amount: 500,
    insuranceCovered: 400,
    outOfPocket: 100,
    status: "Pending",
  },
  {
    id: "B003",
    service: "Blood Work Panel",
    date: "2026-03-14",
    amount: 220,
    insuranceCovered: 176,
    outOfPocket: 44,
    status: "Paid",
  },
  {
    id: "B004",
    service: "ER Visit – Sprained Ankle",
    date: "2026-03-10",
    amount: 1200,
    insuranceCovered: 840,
    outOfPocket: 360,
    status: "Overdue",
  },
  {
    id: "B005",
    service: "Dermatology Consultation",
    date: "2026-03-18",
    amount: 275,
    insuranceCovered: 220,
    outOfPocket: 55,
    status: "Pending",
  },
  {
    id: "B006",
    service: "X-Ray (Ankle)",
    date: "2026-03-10",
    amount: 180,
    insuranceCovered: 144,
    outOfPocket: 36,
    status: "Paid",
  },
];

export const patientProfile = {
  name: "Alex Johnson",
  age: 34,
  gender: "Male",
  dob: "1991-08-22",
  bloodType: "O+",
  height: "5'11\"",
  weight: "178 lbs",
  phone: "+1 (555) 234-5678",
  email: "alex.johnson@email.com",
  address: "1234 Maple Street, Springfield, IL 62704",
  emergencyContact: "Maria Johnson (Wife) – (555) 345-6789",
  insurance: "BlueCross BlueShield – Plan ID: BCBS-2026-AJ",
  allergies: ["Penicillin", "Shellfish"],
  conditions: ["Hypertension (managed)", "High Cholesterol"],
};
