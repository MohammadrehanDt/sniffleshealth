import { useState, useEffect } from "react";
import { Loader2, Plus, Mic, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES, FONTS } from "@/constants";
import { PageHeader, AppFooter } from "@/components/layout";
import { ChatInput } from "@/components/chat/ChatInput";
import { useConsultationFlow } from "@/features/consultation/hooks";
import { useDoctorStore } from "@/stores/doctor.store";
import { getSymptomNamesFromIds } from "@/features/consultation/utils/symptomUtils";

export default function FindingDoctor() {
  const navigate = useNavigate();
  const { selectedSymptoms, aiAssessment, additionalInfo, setAdditionalInfo } =
    useConsultationFlow();
  const { selectedDoctor } = useDoctorStore(); // Preserve doctor selection
  const [localAdditionalInfo, setLocalAdditionalInfo] =
    useState(additionalInfo);
  const [activeTab, setActiveTab] = useState<"ai" | "medical">("ai");

  // Get symptoms from store using proper mapping
  const symptoms =
    selectedSymptoms.length > 0
      ? getSymptomNamesFromIds(selectedSymptoms)
      : ["Fever", "Persistent Cough", "Headache", "Fatigue"]; // Fallback for demo

  const currentAiAssessment =
    aiAssessment ||
    "The AI has identified a potential viral infection based on the symptoms provided. Common causes could include influenza or a common cold. This is not a final diagnosis.";

  // Simulate finding doctor after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(ROUTES.DOCTOR_CHAT);
    }, 3000); // Navigate after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSubmit = () => {
    // Save additional info to store
    setAdditionalInfo(localAdditionalInfo);
    setLocalAdditionalInfo("");
  };

  return (
    <div className="min-h-screen bg-neutral-off-white  flex flex-col">
      <PageHeader
        backTo={ROUTES.KYC}
        step="Step 3 of 4"
        title="Building your medical profile"
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-neutral-off-white min-h-[60vh]">
        <div className="max-w-[1464px] mx-auto p-6 h-full">
          <div className="flex gap-3 h-full">
            {/* Left Panel - Finding Doctor */}
            <div className="flex-1 align-center justify-center bg-white border border-neutral-gray rounded-xl overflow-hidden relative h-full min-h-[75vh]">
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-10">
                <div className="flex flex-col gap-5 items-center max-w-[620px]">
                  {/* Loading Spinner */}
                  <div className="bg-brand-cyan-pale flex items-center justify-center p-3 rounded-full">
                    <div className="flex items-center justify-center">
                      <div className="flex-none rotate-[270deg]">
                        <Loader2 className="w-6 h-6 text-brand-cyan animate-spin" />
                      </div>
                    </div>
                  </div>

                  {/* Heading */}
                  <h1 className="text-5xl font-inter-display font-medium leading-44 tracking-tight text-center text-neutral-charcoal">
                    Finding your doctor
                  </h1>

                  {/* Message */}
                  <p className="text-text-secondary text-base font-inter font-normal leading-6 text-center w-[428px]">
                    Connecting you to a doctor for you query. Please hang tight
                    it might take a few minutes
                  </p>

                  {/* Additional Info Input */}
                  <ChatInput
                    value={localAdditionalInfo}
                    onChange={setLocalAdditionalInfo}
                    onSend={handleSubmit}
                    placeholder="Add more information, questions while we find you a doctor"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Right Panel - AI Summary */}
            <div className="w-[393px] border border-neutral-gray rounded-xl overflow-hidden flex flex-col bg-gradient-to-b from-brand-cyan-lightest to-white h-full min-h-[75vh]">
              {/* Icon */}
              <div className="flex justify-center pt-6">
                <div className="w-[57px] h-[57px] flex items-center justify-center">
                  <svg
                    width="57"
                    height="57"
                    viewBox="0 0 57 57"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="28.5" cy="28.5" r="28.5" fill="#D9F2F7" />
                    <path
                      d="M28.5 18V28.5H18V38.5H28.5V49H38.5V38.5H49V28.5H38.5V18H28.5Z"
                      fill="#0891B2"
                    />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-11 flex-1 px-6 py-0">
                {/* AI Preliminary Assessment */}
                <div className="flex flex-col gap-3">
                  <h2 className="text-neutral-charcoal text-2xl font-inter font-semibold leading-8">
                    AI Preliminary Assessment
                  </h2>
                  <p className="text-text-primary text-base font-inter font-normal leading-6 tracking-body-tight">
                    {currentAiAssessment}
                  </p>
                </div>

                {/* Reported Symptoms */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-text-primary text-base font-inter font-normal leading-6 tracking-body-tight">
                    Reported Symptoms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((symptom, index) => (
                      <span
                        key={index}
                        className="bg-neutral-light-gray border border-transparent rounded-full px-[13px] py-[5px] text-text-slate text-xs font-inter font-medium leading-4"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white border-t border-neutral-gray p-3 flex items-center gap-6">
                <button
                  onClick={() => setActiveTab("ai")}
                  className={`px-3 py-1 rounded-lg font-inter font-medium text-base leading-6 transition-colors ${
                    activeTab === "ai"
                      ? "bg-warm-50 text-text-primary"
                      : "text-neutral-dark-gray hover:text-text-primary"
                  }`}
                >
                  AI Summary
                </button>
                <button
                  onClick={() => setActiveTab("medical")}
                  className={`px-3 py-1 rounded-lg font-inter font-medium text-base leading-6 transition-colors ${
                    activeTab === "medical"
                      ? "bg-warm-50 text-text-primary"
                      : "text-neutral-dark-gray hover:text-text-primary"
                  }`}
                >
                  Medical Summary
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
