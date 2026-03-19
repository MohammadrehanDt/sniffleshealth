import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";

export interface FormStep {
  route: string;
  step: string;
  title: string;
}

/**
 * Consultation flow steps configuration
 */
export const CONSULTATION_STEPS: FormStep[] = [
  { route: ROUTES.HOME, step: "Step 1 of 7", title: "Home" },
  { route: ROUTES.SYMPTOMS, step: "Step 2 of 7", title: "Select symptoms" },
  {
    route: ROUTES.MEDICAL_PROFILE,
    step: "Step 3 of 7",
    title: "Building your medical profile",
  },
  {
    route: ROUTES.SUMMARY,
    step: "Step 4 of 7",
    title: "Building your medical profile",
  },
  {
    route: ROUTES.CONSULTATION,
    step: "Step 5 of 6",
    title: "Choose your consultation",
  },
  {
    route: ROUTES.PAYMENT_CONFIRMATION,
    step: "Step 6 of 6",
    title: "Payment confirmation",
  },
];

export interface UseFormNavigationReturn {
  currentStep: number;
  totalSteps: number;
  goToNext: () => void;
  goToPrevious: () => void;
  goToStep: (stepIndex: number) => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  getStepInfo: (route?: string) => FormStep | undefined;
}

/**
 * useFormNavigation - Hook for managing multi-step form navigation
 * Provides utilities for navigating between form steps
 */
export function useFormNavigation(
  steps: FormStep[] = CONSULTATION_STEPS,
): UseFormNavigationReturn {
  const navigate = useNavigate();

  const getCurrentStepIndex = (): number => {
    const currentPath = window.location.pathname;
    const index = steps.findIndex((step) => step.route === currentPath);
    return index >= 0 ? index : 0;
  };

  const currentStep = getCurrentStepIndex();
  const totalSteps = steps.length;
  const canGoNext = currentStep < totalSteps - 1;
  const canGoPrevious = currentStep > 0;

  const goToNext = () => {
    if (canGoNext) {
      const nextStep = steps[currentStep + 1];
      navigate(nextStep.route);
    }
  };

  const goToPrevious = () => {
    if (canGoPrevious) {
      const previousStep = steps[currentStep - 1];
      navigate(previousStep.route);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      navigate(steps[stepIndex].route);
    }
  };

  const getStepInfo = (route?: string): FormStep | undefined => {
    const targetRoute = route || window.location.pathname;
    return steps.find((step) => step.route === targetRoute);
  };

  return {
    currentStep: currentStep + 1, // 1-indexed for display
    totalSteps,
    goToNext,
    goToPrevious,
    goToStep,
    canGoNext,
    canGoPrevious,
    getStepInfo,
  };
}
