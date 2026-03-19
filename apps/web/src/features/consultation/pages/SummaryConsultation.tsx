import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, FONTS } from "@/constants";
import { PageHeader, AppFooter } from "@/components/layout";
import { useFormNavigation } from "../hooks";
import { useConsultationStore } from "@/stores/consultation.store";
import { useConsultationFlow } from "../hooks";
import { CATEGORY_SYMPTOMS } from "../constants/symptoms";

export default function SummaryConsultation() {
  const navigate = useNavigate();
  const { getStepInfo, goToNext } = useFormNavigation();
  const stepInfo = getStepInfo();
  const { selectedCategory, selectedSymptoms } = useConsultationStore();
  const { medicalData } = useConsultationFlow();

  // Generate AI assessment
  const generateAIAssessment = () => {
    if (!selectedCategory) return "";
    
    return "Based on the information you provided, your symptoms may be consistent with a common medical condition within this category. This summary is for informational purposes only and does not constitute a medical diagnosis. A licensed healthcare professional will review your information during the consultation.";
  };

  // Get symptom names from IDs
  const getSymptomNames = () => {
    if (!selectedCategory) return [];
    const symptoms = CATEGORY_SYMPTOMS[selectedCategory];
    return symptoms
      .filter(s => selectedSymptoms.includes(s.id))
      .map(s => s.name);
  };

  // Auto-transition to consultation page after a brief moment
  useEffect(() => {
    const timer = setTimeout(() => {
      goToNext(); // Use hook's navigation helper
    }, 3000); // 3 second delay to allow user to read summary

    return () => clearTimeout(timer);
  }, [goToNext]);

  const symptomNames = getSymptomNames();
  const currentMedicalData = medicalData || {
    age: "",
    sex: "",
    weight: "",
    height: "",
    allergies: [],
    chronicConditions: [],
    surgicalHistory: [],
    socialHistory: [],
    familyHistory: [],
    phaseBAnswers: {},
  };

  return (
    <div className="min-h-screen bg-neutral-off-white flex flex-col">
      <PageHeader
        backTo={ROUTES.MEDICAL_PROFILE}
        step={stepInfo?.step}
        title={stepInfo?.title}
      />

      {/* Main Content - AI Summary */}
      <div className="flex-1 max-w-[1464px] mx-auto w-full p-5">
        <div className="bg-white rounded-xl border border-neutral-gray p-8 md:p-12">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            {/* Title */}
            <h1 className="text-neutral-charcoal text-3xl md:text-2xl font-inter font-semibold leading-36">
              AI Summary
            </h1>

            {/* Reported Symptoms */}
            <div className="flex flex-col gap-4">
              <h2 className="text-text-dark text-xl font-inter font-semibold">
                Reported Symptoms
              </h2>
              <div className="flex flex-wrap gap-3">
                {symptomNames.length > 0 ? (
                  symptomNames.map((name, idx) => (
                    <span
                      key={idx}
                      className="bg-neutral-light-gray text-text-slate text-sm font-inter px-3 py-1 rounded-lg"
                    >
                      {name}
                    </span>
                  ))
                ) : (
                  <p className="text-text-secondary text-sm font-inter">
                    No symptoms reported
                  </p>
                )}
              </div>
            </div>

            <div className="h-px bg-border-medium" />

            {/* Medical History Summary */}
            <div className="flex flex-col gap-6">
              <h2 className="text-text-dark text-xl font-inter font-semibold">
                Medical History Summary
              </h2>

              {/* Allergies */}
              <div className="flex flex-col gap-2">
                <h3 className="text-text-primary text-base font-inter font-medium">
                  Allergies
                </h3>
                <p className="text-text-slate text-sm font-inter">
                  {currentMedicalData.allergies.length > 0
                    ? currentMedicalData.allergies.join(", ")
                    : "None reported"}
                </p>
              </div>

              {/* Chronic Conditions */}
              <div className="flex flex-col gap-2">
                <h3 className="text-text-primary text-base font-inter font-medium">
                  Chronic Conditions
                </h3>
                <p className="text-text-slate text-sm font-inter">
                  {currentMedicalData.chronicConditions.length > 0
                    ? currentMedicalData.chronicConditions.join(", ")
                    : "None reported"}
                </p>
              </div>

              {/* Past Surgeries */}
              <div className="flex flex-col gap-2">
                <h3 className="text-text-primary text-base font-inter font-medium">
                  Past Surgeries
                </h3>
                <p className="text-text-slate text-sm font-inter">
                  {currentMedicalData.surgicalHistory.length > 0
                    ? currentMedicalData.surgicalHistory.join(", ")
                    : "None reported"}
                </p>
              </div>

              {/* Social History */}
              <div className="flex flex-col gap-2">
                <h3 className="text-text-primary text-base font-inter font-medium">
                  Social History
                </h3>
                <div className="flex flex-col gap-2">
                  {currentMedicalData.socialHistory.length > 0 ? (
                    currentMedicalData.socialHistory.map((item, idx) => (
                      <p key={idx} className="text-text-slate text-sm font-inter">
                        {item.type}: {item.level}
                      </p>
                    ))
                  ) : (
                    <p className="text-text-slate text-sm font-inter">
                      None reported
                    </p>
                  )}
                </div>
              </div>

              {/* Family History */}
              <div className="flex flex-col gap-2">
                <h3 className="text-text-primary text-base font-inter font-medium">
                  Family History
                </h3>
                <p className="text-text-slate text-sm font-inter">
                  {currentMedicalData.familyHistory.length > 0
                    ? currentMedicalData.familyHistory.join(", ")
                    : "None reported"}
                </p>
              </div>
            </div>

            <div className="h-px bg-border-medium" />

            {/* AI Preliminary Assessment */}
            <div className="flex flex-col gap-4">
              <h2 className="text-text-dark text-xl font-inter font-semibold">
                AI Preliminary Assessment
              </h2>
              <div className="bg-brand-cyan-lighter rounded-xl p-4">
                <p className="text-text-slate text-sm font-inter leading-relaxed">
                  {generateAIAssessment()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
