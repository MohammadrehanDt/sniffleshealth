import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  StepChipButton,
  StepChipGroup,
  StepContainer,
  StepField,
} from "../StepContainer";

const SMOKING_OPTIONS = ["Yes", "No", "Former"];
const SMOKING_INTENSITY_OPTIONS = ["Occasional", "Moderate", "Heavy"];
const ALCOHOL_OPTIONS = ["Occasionally", "Regularly", "Heavy", "No"];
const FAMILY_HISTORY_OPTIONS = [
  "Hypertension",
  "Diabetes",
  "Thyroid Disease",
  "Heart Disease",
  "Stroke",
  "None",
];
const DRUG_OPTIONS = [
  "Marijuana",
  "Cocaine",
  "Heroin",
  "PCP",
  "Methamphetamines",
  "Opioids",
  "None",
];

const DRUG_USE_OPTIONS = ["Current Use", "Past Use"];

export const Step9SocialHistory = () => {
  const { setValue, watch } = useFormContext();
  const smoking = watch("smoking") || "";
  const smokingIntensity = watch("smokingIntensity") || "";
  const alcohol = watch("alcohol") || "";
  const familyHistory: string[] = watch("familyHistory") || [];
  const drugs: string[] = watch("drugs") || [];
  const drugUse = watch("drugUse") || "";

  const toggleArray = (field: string, item: string, current: string[]) => {
    const next = current.includes(item)
      ? current.filter((value) => (value === item ? false : true))
      : [...current, item];
    setValue(field, next, { shouldValidate: true });
  };

  return (
    <StepContainer
      title="Social & Family History"
      description="This helps us assess risk factors."
      className="space-y-8"
    >
      <StepField label="Smoking" labelClassName="mb-3 block">
        <StepChipGroup
          options={SMOKING_OPTIONS}
          selectedValue={smoking}
          onSelect={(value) => setValue("smoking", value)}
          className="mb-3"
        />
        {smoking === "Yes" ? (
          <StepChipGroup
            options={SMOKING_INTENSITY_OPTIONS}
            selectedValue={smokingIntensity}
            onSelect={(value) => setValue("smokingIntensity", value)}
          />
        ) : null}
      </StepField>

      <StepField label="Alcohol" labelClassName="mb-3 block">
        <StepChipGroup
          options={ALCOHOL_OPTIONS}
          selectedValue={alcohol}
          onSelect={(value) => setValue("alcohol", value)}
        />
      </StepField>

      <StepField label="Family History" labelClassName="mb-3 block">
        <Input
          placeholder="Example: diabetes"
          className="mb-4 h-10"
          onChange={(event) =>
            setValue("familyHistoryOther", event.target.value)
          }
        />
        <StepChipGroup
          options={FAMILY_HISTORY_OPTIONS}
          selectedValues={familyHistory}
          onToggle={(item) => toggleArray("familyHistory", item, familyHistory)}
          className="mb-3"
        />
        <div className="flex gap-2">
          <StepChipButton
            label="Cancer"
            selected={familyHistory.includes("Cancer")}
            onClick={() =>
              toggleArray("familyHistory", "Cancer", familyHistory)
            }
          />
          <Input
            placeholder="Example: location and type"
            className="h-10 flex-1"
          />
        </div>
      </StepField>

      <StepField label="Recreational Drugs" labelClassName="mb-3 block">
        <StepChipGroup
          options={DRUG_OPTIONS}
          selectedValues={drugs}
          onToggle={(item) => toggleArray("drugs", item, drugs)}
          className="mb-3"
        />
        <StepChipGroup
          options={DRUG_USE_OPTIONS}
          selectedValue={drugUse}
          onSelect={(value) => setValue("drugUse", value)}
        />
      </StepField>
    </StepContainer>
  );
};
