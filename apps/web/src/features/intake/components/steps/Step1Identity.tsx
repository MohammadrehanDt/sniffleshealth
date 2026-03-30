import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { MapPin, Mic } from "lucide-react";
import { UnsupportedStateAlert } from "@/components/common/UnsupportedStateAlert";
import { DatePickerInput } from "@/components/common/DatePickerInput";
import { SelectDropdown } from "@/components/common/SelectDropdown";
import { Input } from "@/components/ui/input";
import { US_STATES } from "@/constants";
import { useGeoState } from "@/hooks/useGeoState";
import { cn } from "@/lib/utils";
import { StepChipGroup, StepContainer, StepField } from "../StepContainer";

const GENDERS = [
  "Male",
  "Female",
  "Non-Binary",
  "Transgender",
  "Cisgender",
  "Genderfluid",
  "Gender Neutral",
  "A gender",
  "Pangender",
  "Other",
];

export const Step1Identity = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const selectedGender = watch("gender") || "";
  const selectedState = watch("state") || "";
  const selectedDob = watch("dob") || "";
  const [searchParams] = useSearchParams();
  const stateFromQuery = searchParams.get("state");
  const {
    stateCode: detectedState,
    isLoading: geoLoading,
    stateName,
  } = useGeoState();
  const [showUnsupportedModal, setShowUnsupportedModal] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  // Block form only when no US state is selected (empty = geo failed / non-US)
  const isBlocked = selectedState === "" && autoFilled;

  useEffect(() => {
    if (autoFilled) return;

    // Already has a state (e.g. navigated back from a later step) — skip
    if (selectedState) {
      setAutoFilled(true);
      return;
    }

    // Query param from landing page — use immediately
    if (stateFromQuery) {
      setAutoFilled(true);
      setValue("state", stateFromQuery, { shouldDirty: true });
      return;
    }

    // Otherwise wait for geo-detection
    if (geoLoading) return;
    setAutoFilled(true);
    if (detectedState) {
      setValue("state", detectedState, { shouldDirty: true });
    } else {
      setShowUnsupportedModal(true);
    }
  }, [
    geoLoading,
    autoFilled,
    detectedState,
    stateFromQuery,
    selectedState,
    setValue,
  ]);

  const handleStateChange = (value: string) => {
    setValue("state", value, { shouldDirty: true });
  };

  const stateOptions = useMemo(
    () =>
      US_STATES.map((state) => ({
        value: state.code,
        label: state.name,
        icon: (
          <img
            src={state.flag}
            alt={state.name}
            className="h-3 w-5 shrink-0 rounded-sm object-contain"
          />
        ),
      })),
    [],
  );

  return (
    <StepContainer
      title="Select Your State"
      description="We'll match you with a licensed physician in your state."
      className="max-w-2xl space-y-6 duration-500"
      titleClassName="text-[22px] font-bold tracking-tight text-neutral-800"
      descriptionClassName="text-[15px] text-neutral-600"
    >
      <UnsupportedStateAlert
        open={showUnsupportedModal}
        onOpenChange={setShowUnsupportedModal}
        stateName={stateName || null}
      />

      <StepField
        error={errors.state?.message as string | undefined}
        className="pt-2"
      >
        <SelectDropdown
          value={selectedState}
          options={stateOptions}
          onChange={handleStateChange}
          className="h-12 border-border"
          label=""
        />
        {geoLoading && selectedState === "" ? (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500">
            <MapPin className="h-3 w-3 animate-pulse" />
            Detecting your location...
          </div>
        ) : null}
        {detectedState && selectedState === detectedState && !geoLoading ? (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500">
            <MapPin className="h-3 w-3" />
            Auto-detected from your location
          </div>
        ) : null}
      </StepField>

      <div
        className={cn(
          "space-y-6 transition-opacity duration-300",
          isBlocked && "pointer-events-none opacity-40",
        )}
      >
        <div className="grid grid-cols-2 gap-4">
          <StepField
            label="First Name"
            htmlFor="firstName"
            error={errors.firstName?.message as string | undefined}
          >
            <Input
              id="firstName"
              placeholder="Example: John"
              {...register("firstName")}
            />
          </StepField>
          <StepField
            label="Last Name"
            htmlFor="lastName"
            error={errors.lastName?.message as string | undefined}
          >
            <Input
              id="lastName"
              placeholder="Example: Doe"
              {...register("lastName")}
            />
          </StepField>
        </div>

        <StepField
          label="Date Of Birth"
          htmlFor="dob"
          error={errors.dob?.message as string | undefined}
        >
          <DatePickerInput
            value={selectedDob}
            onChange={(value) =>
              setValue("dob", value, { shouldValidate: true })
            }
            placeholder="MM/DD/YYYY"
            maxDate={new Date()}
            className="rounded border-border bg-card text-base placeholder:text-muted-foreground/60"
          />
        </StepField>

        <StepField
          label="Gender"
          error={errors.gender?.message as string | undefined}
          className="space-y-3"
        >
          <StepChipGroup
            options={GENDERS}
            selectedValue={selectedGender}
            onSelect={(value) =>
              setValue("gender", value, { shouldValidate: true })
            }
            className="gap-3"
            chipClassName="h-10 px-4 py-2 text-[14px]"
          />
        </StepField>

        {selectedGender === "Other" ? (
          <StepField
            label="Other (specify)"
            className="animate-in slide-in-from-top-2 duration-300"
          >
            <div className="relative">
              <Input className="pr-10" {...register("otherGender")} />
              <Mic className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer text-brand-400" />
            </div>
          </StepField>
        ) : null}
      </div>
    </StepContainer>
  );
};
