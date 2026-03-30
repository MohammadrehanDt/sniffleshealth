import { useFormContext } from "react-hook-form";
import { Mic } from "lucide-react";
import { SearchInput } from "@/components/common";
import { SearchableChipGroups } from "../SearchableChipGroups";

const SURGERY_GROUPS = [
  {
    title: "General",
    items: [
      "Appendectomy",
      "Cholecystectomy",
      "Kidney Stone Removal",
      "Abscess Drainage",
    ],
  },
  {
    title: "Women's Health",
    items: ["C Section", "Hysterectomy", "Breast Surgery"],
  },
  {
    title: "Cardiac",
    items: [
      "Coronary Stents",
      "Coronary Angioplasty",
      "CABG",
      "Cardiac Ablation",
    ],
  },
  {
    title: "Orthopedic",
    items: ["Joint Replacement", "Broken Bone ORIF"],
  },
  {
    title: "Other",
    items: ["Cataracts", "Tonsillectomy"],
  },
];

export const Step6Surgical = () => {
  const { setValue, watch } = useFormContext();
  const selectedSurgeries: string[] = watch("surgicalHistory") || [];

  const toggleSurgery = (surgery: string) => {
    const next = selectedSurgeries.includes(surgery)
      ? selectedSurgeries.filter((item) => (item === surgery ? false : true))
      : [...selectedSurgeries, surgery];
    setValue("surgicalHistory", next, { shouldValidate: true });
  };

  return (
    <SearchableChipGroups
      title="Past Surgical History"
      description="List any surgeries you've had."
      searchPlaceholder="Search conditions"
      selectedItems={selectedSurgeries}
      groups={SURGERY_GROUPS}
      onToggle={toggleSurgery}
      manualEntry={
        <>
          <label className="text-sm text-neutral-800">Others</label>
          <SearchInput
            placeholder="Example: Knee"
            icon={<Mic className="h-5 w-5" />}
            containerClassName="p-3"
            onValueChange={(value) => setValue("surgicalHistoryOther", value)}
          />
        </>
      }
    />
  );
};
