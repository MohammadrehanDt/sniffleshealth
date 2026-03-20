import { Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { PageHeader, AppFooter } from "@/components/layout";
import { SymptomSelector } from "../components";
import { useConsultationFlow, useFormNavigation } from "../hooks";
import { useLocalStorage } from "@/hooks";
import { useConsultationStore } from "@/stores/consultation.store";
import { CATEGORY_SYMPTOMS } from "../constants/symptoms";

export default function Symptoms() {
  const navigate = useNavigate();
  const { selectedCategory } = useConsultationStore();
  const {
    selectedSymptoms,
    toggleSymptom,
    goToMedicalProfile,
    canProceedToMedicalProfile,
  } = useConsultationFlow();
  const { getStepInfo } = useFormNavigation();
  const stepInfo = getStepInfo();

  // Persist custom symptom input across page refreshes
  const { value: customSymptom, setValue: setCustomSymptom } =
    useLocalStorage<string>("custom-symptom-input", { defaultValue: "" });

  // Redirect to home if no category selected
  if (!selectedCategory) {
    navigate(ROUTES.HOME);
    return null;
  }

  const symptoms = CATEGORY_SYMPTOMS[selectedCategory];

  const handleContinue = () => {
    if (canProceedToMedicalProfile) {
      goToMedicalProfile();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-off-white flex flex-col">
      <PageHeader
        backTo={ROUTES.HOME}
        step={stepInfo?.step}
        title={stepInfo?.title}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 max-w-[1464px] mx-auto w-full h-full p-5">
          <div className="flex-1 bg-white rounded-xl border border-neutral-gray flex flex-col overflow-hidden w-full min-h-0">
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pt-10 pb-10 px-6 md:px-12 flex flex-col overflow-hidden w-full min-h-[65vh]">
              <div className="max-w-[963px] mx-auto flex flex-col gap-15">
                {/* Header */}
                <div className="flex flex-col items-center gap-2 pt-5">
                  <h1 className="text-neutral-charcoal text-3xl md:text-2xl font-inter font-semibold text-center leading-36">
                    What are your symptoms
                  </h1>
                  <p className="text-text-secondary text-base font-inter">
                    Select from the list below or type your own
                  </p>
                </div>

                {/* Symptoms Sections */}
                <div className="flex flex-col gap-[19px]">
                  <SymptomSelector
                    symptoms={symptoms}
                    selectedSymptomIds={selectedSymptoms}
                    onToggleSymptom={toggleSymptom}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Input Section */}
            <div className="border-t border-border-dark p-6">
              <div className="max-w-[963px] mx-auto flex flex-col md:flex-row items-stretch gap-3">
                <div className="flex-1 flex items-center gap-2 bg-white border border-border-medium rounded-2xl px-5 py-4">
                  <input
                    type="text"
                    placeholder="You can also add any other symptoms directly here"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-text-primary text-sm font-inter"
                  />
                  <button className="p-2 bg-warm-50 rounded-xl">
                    <Mic className="w-4 h-4 text-brand-cyan-dark" />
                  </button>
                </div>
                <button
                  onClick={handleContinue}
                  className="w-full md:w-auto px-12 py-4 bg-brand-cyan-dark text-white font-inter font-semibold text-base rounded-2xl hover:bg-brand-cyan-dark/90 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
