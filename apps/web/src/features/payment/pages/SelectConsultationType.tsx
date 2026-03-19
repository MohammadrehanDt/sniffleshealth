import { useState } from "react";
import { MessageSquare, Video, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ConsultationType } from "@sniffles/types";
import { ROUTES, FONTS } from "@/constants";
import { PageHeader, AppFooter } from "@/components/layout";
import { useFormNavigation } from "@/features/consultation/hooks";

export default function SelectConsultationType() {
  const navigate = useNavigate();
  const { getStepInfo, goToNext } = useFormNavigation();
  const stepInfo = getStepInfo();
  const [selectedType, setSelectedType] = useState<ConsultationType>("video");

  const handleContinue = () => {
    // Navigate to payment confirmation page
    // In a real app, this would process payment first
    goToNext(); // Use hook's navigation helper
  };

  return (
    <div className="min-h-screen bg-neutral-light-gray flex flex-col">
      <PageHeader
        backTo={ROUTES.CONSULTATION}
        step={stepInfo?.step}
        title={stepInfo?.title}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-neutral-light-gray">
        <div className="max-w-[1464px] mx-auto p-6">
          <div className="bg-white border border-neutral-gray rounded-xl overflow-hidden relative min-h-[750px]">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <svg
                className="absolute left-[210px] -top-[886px] w-[1057px] h-[1074px] opacity-10"
                viewBox="0 0 1057 1074"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0L1057 0L1057 1074L0 1074L0 0Z"
                  fill="url(#pattern0)"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full py-10 px-6">
              <div className="flex flex-col gap-6 items-center max-w-[650px]">
                {/* Header */}
                <div className="flex flex-col gap-6 items-center">
                  <h1 className="text-5xl font-inter-display font-medium leading-44 tracking-tight text-center text-neutral-charcoal">
                    Select your consultation type
                  </h1>

                  {/* Consultation Type Cards */}
                  <div className="flex gap-6 items-start">
                    {/* Text Based Consultation Card */}
                    <button
                      onClick={() => setSelectedType("text")}
                      className={`w-[302px] bg-white border rounded-2xl p-5 flex flex-col gap-2 items-start transition-all ${
                        selectedType === "text"
                          ? "border-2 border-brand-cyan"
                          : "border border-border-medium"
                      }`}
                    >
                      <p
                        className={`text-base font-inter leading-6 w-[194px] ${
                          selectedType === "text"
                            ? "font-semibold text-text-primary tracking-body-tight"
                            : "font-medium text-text-secondary"
                        }`}
                      >
                        Single Text Based Consultation
                      </p>
                      <div className="flex items-center justify-between w-full">
                        <p
                          className={`text-2xl font-inter-display font-medium leading-8 tracking-tight ${
                            selectedType === "text"
                              ? "text-cyan-500"
                              : "text-neutral-charcoal"
                          }`}
                        >
                          $25
                        </p>
                        <div
                          className={`flex items-center p-1 rounded-full ${
                            selectedType === "text"
                              ? "bg-brand-cyan-pale"
                              : "bg-neutral-light-gray"
                          }`}
                        >
                          <MessageSquare
                            className={`w-6 h-6 ${
                              selectedType === "text"
                                ? "text-brand-cyan"
                                : "text-text-light"
                            }`}
                          />
                        </div>
                      </div>
                    </button>

                    {/* Voice or Video call consultation Card */}
                    <button
                      onClick={() => setSelectedType("video")}
                      className={`w-[302px] bg-white border rounded-2xl p-5 flex flex-col gap-2 items-start transition-all ${
                        selectedType === "video"
                          ? "border-2 border-brand-cyan"
                          : "border border-border-medium"
                      }`}
                    >
                      <p
                        className={`text-base font-inter leading-6 w-[194px] ${
                          selectedType === "video"
                            ? "font-semibold text-text-primary tracking-body-tight"
                            : "font-medium text-text-secondary"
                        }`}
                      >
                        Voice or Video call consultation
                      </p>
                      <div className="flex items-center justify-between w-full">
                        <p
                          className={`text-2xl font-inter-display font-medium leading-8 tracking-tight ${
                            selectedType === "video"
                              ? "text-cyan-500"
                              : "text-neutral-charcoal"
                          }`}
                        >
                          $40
                        </p>
                        <div className="flex gap-[7px] items-center">
                          <div
                            className={`flex items-center justify-center p-1 rounded-full ${
                              selectedType === "video"
                                ? "bg-brand-cyan-pale"
                                : "bg-neutral-light-gray"
                            }`}
                          >
                            <Video
                              className={`w-6 h-6 ${
                                selectedType === "video"
                                  ? "text-brand-cyan"
                                  : "text-text-light"
                              }`}
                            />
                          </div>
                          <div
                            className={`flex items-center justify-center p-1 rounded-full ${
                              selectedType === "video"
                                ? "bg-brand-cyan-pale"
                                : "bg-neutral-light-gray"
                            }`}
                          >
                            <Mic
                              className={`w-6 h-6 ${
                                selectedType === "video"
                                  ? "text-brand-cyan"
                                  : "text-text-light"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={handleContinue}
                    className="bg-brand-cyan-dark text-white font-inter px-6 py-3 rounded-2xl font-semibold text-base leading-6 hover:bg-brand-cyan-dark/90 transition-colors h-[57px] flex items-center justify-center"
                  >
                    Continue with payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
