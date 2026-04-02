import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { consultationApi } from "../../services/consultation.api";

export const FinalStep = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const selectedPlan = watch("consultationType") || "";
  const { data: plans = [] } = useQuery({
    queryKey: ["consultation-pricing"],
    queryFn: consultationApi.getPricing,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="space-y-1">
        <h2 className="text-[22px] font-bold text-neutral-800 tracking-tight">
          Review Your Information
        </h2>
        <p className="text-[15px] text-neutral-600">
          Please confirm everything looks correct.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => {
              setValue("consultationType", plan.title, {
                shouldValidate: true,
              });
              setValue("offeringId", plan.id, {
                shouldValidate: true,
              });
            }}
            className={`cursor-pointer p-5 rounded-lg border-[1.5px] transition-all flex flex-col justify-between min-h-[140px] ${
              selectedPlan === plan.title
                ? "border-brand-400 bg-card shadow-sm"
                : "border-border bg-card hover:border-neutral-500"
            }`}
          >
            <div className="space-y-4">
              <h3
                className={`text-[16px] font-medium ${
                  selectedPlan === plan.title
                    ? "text-neutral-800"
                    : "text-neutral-600"
                }`}
              >
                {plan.title}
              </h3>

              {plan.billingFrequency ? (
                <p className="text-sm text-neutral-500">
                  {plan.billingFrequency}
                </p>
              ) : null}

              <div
                className={`text-[24px] font-semibold ${
                  selectedPlan === plan.title
                    ? "text-brand-400"
                    : "text-neutral-800"
                }`}
              >
                {`${plan.currency} ${plan.initialPaymentAmount ?? plan.initialPriceWithTaxes ?? plan.price}`}
              </div>
            </div>

            <div className="text-sm text-neutral-600 mt-2">{plan.wait}</div>
          </div>
        ))}
      </div>

      {errors.consultationType && (
        <p className="text-xs text-destructive mt-2">
          {errors.consultationType.message as string}
        </p>
      )}
    </div>
  );
};
