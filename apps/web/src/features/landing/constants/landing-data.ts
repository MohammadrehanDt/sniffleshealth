import type { HealthCategory } from "@sniffles/types";

export const HEALTH_CATEGORIES: {
  id: HealthCategory;
  title: string;
  image: string;
}[] = [
  { id: "FEVER_FLU", title: "Fever & Flu", image: "/images/fever.png" },
  { id: "SKIN_ISSUES", title: "Skin Issues", image: "/images/skinnissue.png" },
  { id: "SEXUAL_HEALTH", title: "Sexual Health", image: "/images/sexual.png" },
  { id: "INFECTIONS", title: "Infections", image: "/images/infection.png" },
  {
    id: "MEDICATION_REFILL",
    title: "Medication Refill",
    image: "/images/medication.png",
  },
  {
    id: "ASTHMA_ALLERGIES",
    title: "Asthma & Allergies",
    image: "/images/asthma.png",
  },
  {
    id: "UTIS_YEAST_INFECTION",
    title: "UTIs & Yeast Infection",
    image: "/images/uti.png",
  },
  { id: "WEIGHT_LOSS", title: "Weight Loss", image: "/images/weight.png" },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "STEP 1",
    title: "Tell us your symptoms",
    description:
      "Describe what you're experiencing through our AI-guided intake.",
    image: "/images/step1.png",
  },
  {
    step: "STEP 2",
    title: "AI builds your intake",
    description:
      "Our AI generates a complete medical note from your responses.",
    image: "/images/step2.png",
  },
  {
    step: "STEP 3",
    title: "Doctor reviews",
    description:
      "A licensed physician reviews your case and creates a treatment plan.",
    image: "/images/step3.png",
  },
  {
    step: "STEP 4",
    title: "Treatment delivered",
    description: "Get prescriptions, referrals, or follow-up care sent to you.",
    image: "/images/step4.png",
  },
];

export const PRICING_DATA = [
  { label: "Visit Fee", chat: "$39.99", video: "$55.99" },
  { label: "Rating", chat: "4.5", video: "4.9" },
];

export const CONDITIONS = [
  "Cold & Flu",
  "UTI",
  "Sinus Infection",
  "Skin Rash",
  "Allergies",
  "Medication Refill",
  "Headache",
  "Stomach Issues",
];

export const NOT_COVERED = [
  "Spinal Injuries",
  "Chest pains",
  "Coughing up blood",
  "Severe burns",
  "Pregnancy Complications",
  "Lacerations",
  "Broken bones",
  "Vomiting blood",
  "Blood in stools",
  "Stroke Symptoms",
];

export const FEATURES = [
  { image: "/images/toplicence.png", title: "Top licensed doctors" },
  { image: "/images/noinsurence.png", title: "No Insurance Required" },
  {
    image: "/images/instantchat.png",
    title: "Instant, 15 minutes chat consults",
  },
  { image: "/images/lock.png", title: "No hidden fees" },
  { image: "/images/noinsurence.png", title: "Video consults within same day" },
];

export const FOOTER_LINKS = [
  { label: "Conditions", href: "#" },
  { label: "How it works", href: "#" },
  { label: "Doctors", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Support", href: "#" },
];
