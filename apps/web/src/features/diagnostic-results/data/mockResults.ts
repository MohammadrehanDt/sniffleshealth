export interface Marker {
  label: string;
  value: string;
}

export interface DiagnosticResult {
  id: string;
  testName: string;
  date: string;
  lab: string;
  status: "Normal" | "Abnormal" | "Pending";
  markers: Marker[];
  pdfUrl?: string;
  aiInsights?: string;
}

export const diagnosticResults: DiagnosticResult[] = [
  {
    id: "DR-001",
    testName: "Complete Blood Count",
    date: "Feb 28, 2026",
    lab: "Apex Labs",
    status: "Normal",
    markers: [
      { label: "WBC", value: "7.2" },
      { label: "RBC", value: "4.8" },
      { label: "Hemoglobin", value: "14.2" },
      { label: "Platelets", value: "250" },
    ],
    pdfUrl: "CBC_Report.pdf",
    aiInsights: "Your results are within normal range. No immediate concerns detected. Continue maintaining a healthy lifestyle.",
  },
  {
    id: "DR-002",
    testName: "Basic Metabolic Panel",
    date: "Feb 20, 2026",
    lab: "Apex Labs",
    status: "Normal",
    markers: [
      { label: "WBC", value: "7.2" },
      { label: "RBC", value: "4.8" },
      { label: "Hemoglobin", value: "14.2" },
      { label: "Platelets", value: "250" },
    ],
    pdfUrl: "BMP_Report.pdf",
    aiInsights: "Your metabolic panel shows balanced electrolytes and stable kidney function.",
  },
];
