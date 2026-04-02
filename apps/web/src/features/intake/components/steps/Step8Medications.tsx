import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { StepContainer } from "../StepContainer";

export const Step8Medications = () => {
  const { register } = useFormContext();

  return (
    <StepContainer
      title="Current Medications"
      description="List medications with dosage and frequency."
    >
      <Input
        placeholder="Example: Metformin 500mg twice daily"
        {...register("medications")}
      />
    </StepContainer>
  );
};
