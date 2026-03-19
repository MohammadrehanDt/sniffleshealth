/**
 * DoctorChatSidebar - Right sidebar panel for doctor chat
 * Displays consultation progress, AI assessment, symptoms, and medical summary
 */

import { Tag } from "@/components/common";
import { ConsultationProgress } from "./ConsultationProgress";
import { MedicalSummaryDisplay } from "./MedicalSummaryDisplay";
import type { MedicalData } from "@sniffles/types";

interface DoctorChatSidebarProps {
  activeTab: "ai" | "medical" | "consultation";
  onTabChange: (tab: "ai" | "medical" | "consultation") => void;
  phase1Completed: boolean;
  phase2Completed: boolean;
  phase3Completed: boolean;
  phase4Completed: boolean;
  aiAssessment: string;
  symptoms: string[];
  medicalData: MedicalData | null;
}

export function DoctorChatSidebar({
  activeTab,
  onTabChange,
  phase1Completed,
  phase2Completed,
  phase3Completed,
  phase4Completed,
  aiAssessment,
  symptoms,
  medicalData,
}: DoctorChatSidebarProps) {
  return (
    <div className="w-[342px] flex-shrink-0 border border-neutral-gray rounded-xl overflow-hidden flex flex-col bg-white h-full min-h-0">
      {/* Icon */}
      <div className="flex justify-center p-6 flex-shrink-0">
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

      {/* Content - Scrollable */}
      <div className="flex flex-col gap-6 flex-1 px-6 py-0 overflow-y-auto min-h-0">
        {activeTab === "ai" && (
          <>
            {/* Consultation Progress */}
            <ConsultationProgress
              phase1Completed={phase1Completed}
              phase2Completed={phase2Completed}
              phase3Completed={phase3Completed}
              phase4Completed={phase4Completed}
            />

            {/* AI Preliminary Assessment */}
            <div className="flex flex-col gap-3">
              <h2 className="text-neutral-charcoal text-2xl font-inter font-semibold leading-8">
                AI Preliminary Assessment
              </h2>
              <p className="text-text-primary text-base font-inter font-normal leading-6 tracking-body-tight">
                {aiAssessment}
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
          </>
        )}

        {activeTab === "medical" && (
          <MedicalSummaryDisplay medicalData={medicalData} />
        )}

        {activeTab === "consultation" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-neutral-charcoal text-2xl font-inter font-semibold leading-8">
              Consultation Summary
            </h2>
            <p className="text-text-primary text-base font-inter">
              Consultation is in progress. Summary will be available upon
              completion.
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white border-t border-neutral-gray p-3 flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onTabChange("ai")}
          className={`px-3 py-1 rounded-lg font-inter font-medium text-sm leading-6 transition-colors ${
            activeTab === "ai"
              ? "bg-warm-50 text-text-primary"
              : "text-neutral-dark-gray hover:text-text-primary"
          }`}
        >
          AI Summary
        </button>
        <button
          onClick={() => onTabChange("medical")}
          className={`px-3 py-1 rounded-lg font-inter font-medium text-sm leading-6 transition-colors ${
            activeTab === "medical"
              ? "bg-warm-50 text-text-primary"
              : "text-neutral-dark-gray hover:text-text-primary"
          }`}
        >
          Medical Summary
        </button>
      </div>
    </div>
  );
}
