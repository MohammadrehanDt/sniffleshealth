import { useFormContext } from "react-hook-form";
import { Mic } from "lucide-react";
import { SearchInput } from "@/components/common";
import { SearchableChipGroups } from "../SearchableChipGroups";

const ALLERGY_GROUPS = [
  {
    title: "Antibiotics",
    items: ["Penicillin", "Sulfa Drugs", "Tetracyclines"],
  },
  {
    title: "Blood Pressure",
    items: ["Lisinopril", "Amlodipine", "Beta Blockers"],
  },
  {
    title: "Pain/NSAIDs",
    items: ["NSAIDs", "Tylenol", "Asprin", "Ibuprofen"],
  },
  {
    title: "Opioids",
    items: ["Hydrocodone", "Oxycodone", "Morphine"],
  },
];

export const Step7Allergies = () => {
  const { setValue, watch } = useFormContext();
  const selectedAllergies: string[] = watch("allergies") || [];

  const toggleAllergy = (allergy: string) => {
    const next = selectedAllergies.includes(allergy)
      ? selectedAllergies.filter((item) => (item === allergy ? false : true))
      : [...selectedAllergies, allergy];
    setValue("allergies", next, { shouldValidate: true });
  };

  return (
    <SearchableChipGroups
      title="Allergies"
      description="List any medication or other allergies."
      searchPlaceholder="Search allergies"
      selectedItems={selectedAllergies}
      groups={ALLERGY_GROUPS}
      onToggle={toggleAllergy}
      manualEntry={
        <>
          <label className="text-sm text-neutral-800">Others</label>
          <SearchInput
            placeholder="Example: medicine or others"
            icon={<Mic className="h-5 w-5" />}
            containerClassName="p-3"
            onValueChange={(value) => setValue("allergiesOther", value)}
          />
        </>
      }
    />
  );
};
