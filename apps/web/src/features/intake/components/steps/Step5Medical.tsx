import { useFormContext } from "react-hook-form";
import { Mic } from "lucide-react";
import { SearchInput } from "@/components/common";
import { SearchableChipGroups } from "../SearchableChipGroups";

const CONDITION_GROUPS = [
  {
    title: "Endocrine",
    items: ["Hypertension", "Diabetes", "Hypothyroidism", "Hyperthyroidism"],
  },
  {
    title: "Respiratory",
    items: [
      "Asthma",
      "COPD",
      "Seasonal Allergies",
      "Pulmonary Fibrosis",
      "Recurrent Pneumonias",
    ],
  },
  {
    title: "Cardiovascular",
    items: [
      "Coronary Artery Disease",
      "Congestive Heart Failure",
      "Atrial Fibrillation",
      "Valvular Heart Disease",
      "Congenital Heart Disease",
    ],
  },
  {
    title: "Vascular",
    items: [
      "DVT Deep Vein Thrombosis",
      "PE Pulmonary Embolism",
      "PAD Peripheral Artery Disease",
    ],
  },
  {
    title: "Gastrointestinal",
    items: [
      "Gastritis",
      "Peptic Ulcer Disease",
      "Colitis",
      "Ulcerative Colitis",
      "Crohn's Disease",
      "Celiac's Disease",
      "Chronic Constipation",
      "Hemorrhoids",
    ],
  },
  {
    title: "Renal",
    items: ["Frequent UTIs", "Kidney Stones", "STDs"],
  },
  {
    title: "Neurological",
    items: ["Stroke", "TIAs", "Seizures"],
  },
  {
    title: "Mental Health",
    items: [
      "Anxiety",
      "Panic Disorder",
      "Depression",
      "ADD",
      "ADHD",
      "Schizophrenia",
    ],
  },
  {
    title: "Oncology",
    items: ["Cancer"],
  },
];

export const Step5Medical = () => {
  const { setValue, watch } = useFormContext();
  const selectedConditions: string[] = watch("medicalHistory") || [];

  const toggleCondition = (condition: string) => {
    const next = selectedConditions.includes(condition)
      ? selectedConditions.filter((item) => (item === condition ? false : true))
      : [...selectedConditions, condition];
    setValue("medicalHistory", next, { shouldValidate: true });
  };

  return (
    <SearchableChipGroups
      title="Past Medical History"
      description="Select any conditions you have been diagnosed with."
      searchPlaceholder="Search conditions"
      selectedItems={selectedConditions}
      groups={CONDITION_GROUPS}
      onToggle={toggleCondition}
      manualEntry={
        <>
          <label className="text-sm text-neutral-800">Others</label>
          <SearchInput
            placeholder="Example: Nails"
            icon={<Mic className="h-5 w-5" />}
            containerClassName="p-3"
            onValueChange={(value) => setValue("medicalHistoryOther", value)}
          />
        </>
      }
    />
  );
};
