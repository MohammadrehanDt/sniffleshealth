import { useFormContext } from "react-hook-form";
import { SearchInput } from "@/components/common";
import { SearchableChipGroups } from "../SearchableChipGroups";
import { SYMPTOM_CATEGORIES } from "../../constants/intake-data";

const SYMPTOM_GROUPS = [
  { items: SYMPTOM_CATEGORIES.COMMON },
  { title: "General", items: SYMPTOM_CATEGORIES.GENERAL, showTitle: true },
  {
    title: "Choose One",
    items: SYMPTOM_CATEGORIES.GENITOURINARY,
    showTitle: true,
  },
  { title: "Others", items: SYMPTOM_CATEGORIES.OTHERS, showTitle: true },
];

export const Step2Symptoms = () => {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext();
  const selectedSymptoms: string[] = watch("symptoms") || [];

  const toggleSymptom = (symptom: string) => {
    const next = selectedSymptoms.includes(symptom)
      ? selectedSymptoms.filter((item) => (item === symptom ? false : true))
      : [...selectedSymptoms, symptom];
    setValue("symptoms", next, { shouldValidate: true });
  };

  return (
    <SearchableChipGroups
      title="What symptoms are you experiencing?"
      description="Select all that apply or type your own."
      searchPlaceholder="Search symptoms"
      selectedItems={selectedSymptoms}
      groups={SYMPTOM_GROUPS}
      onToggle={toggleSymptom}
      error={errors.symptoms?.message as string | undefined}
      manualEntry={
        <>
          <label className="text-sm  text-neutral-800">Enter Manually</label>
          <SearchInput
            placeholder="Example: Nails"
            icon=""
            {...register("manualSymptom")}
          />
        </>
      }
    />
  );
};
