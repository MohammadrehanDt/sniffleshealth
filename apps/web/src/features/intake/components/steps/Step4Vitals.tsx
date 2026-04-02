import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/common";
import { Slider } from "@/components/ui/slider";
import { StepChipGroup, StepContainer, StepField } from "../StepContainer";

const READING_LOCATIONS = ["Doctor", "Home", "Pharmacy"];

export const Step4Vitals = () => {
  const { register, setValue, watch } = useFormContext();
  const symptoms: string[] = watch("symptoms") || [];
  const readingLocation = watch("readingLocation") || "";
  const severity = watch("severity") || 5;
  const fever = watch("fever") || 98.6;
  const hasFeverSymptom = symptoms.includes("Fever");

  return (
    <StepContainer
      title="Vital Signs"
      description="Help us understand your symptoms better."
      className="space-y-8"
    >
      <div className="grid grid-cols-3 gap-4">
        <StepField label="Blood Pressure (Systolic)">
          <Input {...register("bpSystolic")} placeholder="Example: 110" />
        </StepField>
        <StepField label="Blood Pressure (Diastolic)">
          <Input {...register("bpDiastolic")} placeholder="Example: 90" />
        </StepField>
        <StepField label="Heart Rate">
          <Input {...register("heartRate")} placeholder="Example: 90 bpm" />
        </StepField>
      </div>

      <StepField label="Reading at" className="space-y-3">
        <StepChipGroup
          options={READING_LOCATIONS}
          selectedValue={readingLocation}
          onSelect={(value) => setValue("readingLocation", value)}
        />
      </StepField>

      <StepField
        label={"Pain/discomfort severity: " + severity + "/10"}
        className="space-y-4"
      >
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
          className="space-y-4"
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

      <div className="grid grid-cols-3 gap-4">
        <StepField label="Weight (in Pounds)">
          <Input {...register("weight")} placeholder="Example: 90" />
        </StepField>
        <StepField label="Height (Inched)">
          <Input {...register("height")} placeholder="Example: 6" />
        </StepField>
        <StepField label="Height (Feet)">
          <Input {...register("height")} placeholder="Example: 6" />
        </StepField>
      </div>

      <StepField
        label="Upload Image/Picture of Your Rash, Wound, Lesion, Skin that you would like your Doctor to See"
        className="space-y-3"
        labelClassName="text-sm text-neutral-800 "
      >
        <FileUpload
          accept=".jpg,.jpeg,.png,.pdf"
          maxSizeMB={10}
          hint="jpeg, png, pdf format, upto 10MB"
        />
      </StepField>
    </StepContainer>
  );
};
