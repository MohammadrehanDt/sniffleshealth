import { useFormContext } from "react-hook-form";
import { StepContainer, StepReviewList } from "../StepContainer";

export const Step10ReviewInterface = () => {
  const { watch } = useFormContext();

  const state = watch("state") || "---";
  const symptoms = watch("symptoms") || [];
  const duration = watch("duration") || "---";
  const severity = watch("severity");
  const medicalHistory = watch("medicalHistory") || [];
  const allergies = watch("allergies") || [];
  const medications = watch("medications") || "Nothing";

  const reviewData = [
    { label: "State", value: state },
    {
      label: "Symptoms",
      value: symptoms.length > 0 ? symptoms.join(", ") : "---",
    },
    { label: "Duration", value: duration },
    { label: "Severity", value: severity ? severity + "/10" : "---" },
    {
      label: "Conditions",
      value: medicalHistory.length > 0 ? medicalHistory.join(", ") : "Nothing",
    },
    {
      label: "Allergies",
      value: allergies.length > 0 ? allergies.join(", ") : "Nothing",
    },
    { label: "Medications", value: medications },
  ];

  return (
    <StepContainer
      title="Review Your Information"
      description="Please confirm everything looks correct."
    >
      <StepReviewList items={reviewData} />
    </StepContainer>
  );
};
