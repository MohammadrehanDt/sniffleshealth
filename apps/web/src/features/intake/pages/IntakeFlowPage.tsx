import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/button";
import { hasSession } from "@/features/auth/hooks/useAuth";
import { ApiError } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { SOAPPreview } from "../components/SOAPPreview";
import {
  DEFAULT_VALUES,
  MAX_STEP,
  STEP_COMPONENTS,
  TOTAL_DISPLAY_STEPS,
} from "../constants/flow";
import {
  intakeSchema,
  stepFields,
  stepSchemas,
  type IntakeFormData,
} from "../schemas/intake.schema";
// import {
//   buildConsultationPayload,
//   consultationApi,
// } from "../services/consultation.api";
import {
  clearLocalDraft,
  loadLocalDraft,
  saveLocalDraft,
} from "../utils/draft-storage";
import { ArrowLeft } from "lucide-react";

function createStepPayload(
  values: IntakeFormData,
  fields: string[],
): Record<string, unknown> {
  return fields.reduce<Record<string, unknown>>((payload, field) => {
    payload[field] = values[field as keyof IntakeFormData];
    return payload;
  }, {});
}

export default function IntakePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);
  const isAuthenticated = Boolean(user);
  const localDraft = loadLocalDraft();

  const [step, setStep] = useState(localDraft?.step ?? 1);

  const methods = useForm<IntakeFormData>({
    resolver: zodResolver(intakeSchema),
    mode: "onTouched",
    defaultValues: { ...DEFAULT_VALUES, ...localDraft?.data },
  });

  useEffect(() => {
    const subscription = methods.watch((data) => {
      const formData = data as Partial<IntakeFormData>;
      saveLocalDraft(step, formData);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [methods, step]);

  useEffect(() => {
    const data = methods.getValues();
    saveLocalDraft(step, data);
  }, [methods, step]);

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const schema = stepSchemas[step];
    const fields = stepFields[step] ?? [];

    if (schema === undefined || fields.length === 0) {
      return true;
    }

    const isValid = await methods.trigger(
      fields as Array<keyof IntakeFormData>,
    );
    if (isValid) {
      return true;
    }

    const values = methods.getValues();
    const parsed = schema.safeParse(createStepPayload(values, fields));
    if (parsed.success === false) {
      const firstError = parsed.error.issues[0]?.message;
      if (firstError) {
        toast.error(firstError);
      }
    }

    return false;
  }, [methods, step]);

  const handleNext = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (isValid === false) {
      return;
    }

    if (step === MAX_STEP) {
      if (
        !isBootstrapped ||
        isAuthenticated === false ||
        hasSession() === false
      ) {
        toast.info("Please log in to submit your consultation.");
        navigate(ROUTES.LOGIN, { state: { from: ROUTES.INTAKE } });
        return;
      }

      methods.handleSubmit(
        async (values) => {
          try {
            // const result = await consultationApi.submit(
            //   buildConsultationPayload(values),
            // );
            clearLocalDraft();
            toast.success("Payment request created.");
            navigate(ROUTES.PAYMENT_CONFIRMATION, {
              // state: {
              //   consultation: result.consultation,
              //   payment: result.payment,
              // },
            });
          } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
              toast.info("Please log in to continue with payment.");
              navigate(ROUTES.LOGIN, { state: { from: ROUTES.INTAKE } });
              return;
            }

            const message =
              error instanceof Error
                ? error.message
                : "Unable to submit consultation right now.";
            toast.error(message);
          }
        },
        () => {
          toast.error("Please review and fix the highlighted fields.");
        },
      )();
      return;
    }

    setStep((currentStep) => Math.min(currentStep + 1, MAX_STEP));
  }, [
    isAuthenticated,
    isBootstrapped,
    methods,
    navigate,
    step,
    validateCurrentStep,
  ]);

  const handleBack = useCallback(() => {
    setStep((currentStep) => Math.max(currentStep - 1, 1));
  }, []);

  const StepComponent = STEP_COMPONENTS[step] ?? STEP_COMPONENTS[1];
  const displayStep = Math.min(step, TOTAL_DISPLAY_STEPS);
  const progressPercent = Math.min(displayStep * 10, 100);
  const isFirstStep = step === 1;
  const isLastStep = step === MAX_STEP;

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-card font-sans text-foreground">
        <main className="mx-auto max-w-[1200px] px-6 py-10">
          <div className="mb-12">
            <div className="mb-2 flex justify-between text-[10px] font-bold uppercase text-brand-600">
              <span>
                Step {displayStep} of {TOTAL_DISPLAY_STEPS}
              </span>
              <span>{progressPercent}% complete</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-brand-600 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-12">
            <div className="flex min-h-[600px] flex-col justify-between rounded border border-border bg-card p-10 lg:col-span-7">
              <div>
                <StepComponent />
              </div>

              <div className="mt-12 flex items-center justify-between pt-8">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={isFirstStep}
                  className="gap-2 px-0 text-brand-600 hover:bg-transparent hover:text-brand-700 disabled:opacity-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  variant="brand"
                  size="lg"
                  onClick={handleNext}
                  className="rounded px-10 active:scale-95"
                >
                  {isLastStep ? "Continue to Payment" : "Next"}
                </Button>
              </div>
            </div>

            <aside className="sticky top-10 lg:col-span-5">
              <SOAPPreview />
            </aside>
          </div>
        </main>
      </div>
    </FormProvider>
  );
}
