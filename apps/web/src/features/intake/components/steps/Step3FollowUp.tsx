import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { StepChipGroup, StepContainer, StepField } from "../StepContainer";

const COUGH_OPTIONS = ["Non Productive", "Productive", "No"];
const SPUTUM_OPTIONS = ["Clear", "Yellow", "Green"];

export const Step3FollowUp = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const symptoms: string[] = watch("symptoms") || [];
  const severity = watch("severity") || 5;
  const fever = watch("fever") || 98.6;
  const coughType = watch("coughType") || "";
  const sputumColor = watch("sputumColor") || "";
  const hasFeverSymptom = symptoms.includes("Fever");

  return (
    <StepContainer
      title="AI Follow-Up Questions"
      description="Help us understand your symptoms better."
      className="space-y-8"
    >
      <StepField
        label="When did symptoms start?"
        error={errors.duration?.message as string | undefined}
      >
        <Input placeholder="Example: 3 Days ago" {...register("duration")} />
      </StepField>

      <StepField label={"Pain/discomfort severity: " + severity + "/10"}>
        <Slider
          value={[severity]}
          max={10}
          step={1}
          onValueChange={(value) => setValue("severity", value[0])}
          className="[&_[role=slider]]:bg-brand-600 [&_[role=track]]:bg-muted"
        />
      </StepField>

      {hasFeverSymptom ? (
        <StepField
          label={"How high was the fever: " + fever.toFixed(1) + "° F"}
        >
          <Slider
            value={[fever]}
            min={95}
            max={106}
            step={0.1}
            onValueChange={(value) => setValue("fever", value[0])}
          />
        </StepField>
      ) : null}

      <StepField
        label="Cough"
        error={errors.coughType?.message as string | undefined}
      >
        <StepChipGroup
          options={COUGH_OPTIONS}
          selectedValue={coughType}
          onSelect={(value) =>
            setValue("coughType", value, { shouldValidate: true })
          }
        />
      </StepField>

      {coughType && coughType === "No" ? null : coughType ? (
        <StepField label="Sputum">
          <StepChipGroup
            options={SPUTUM_OPTIONS}
            selectedValue={sputumColor}
            onSelect={(value) =>
              setValue("sputumColor", value, { shouldValidate: true })
            }
          />
        </StepField>
      ) : null}
    </StepContainer>
  );
};
