/**
 * DoctorChatFooter - Footer section for doctor chat
 * Handles safety stops, options, input, and completion states
 */

import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { ChatInput } from "@/components/chat/ChatInput";
import { SafetyStopBanner } from "./SafetyStopBanner";
import { DoctorChatOptions } from "./DoctorChatOptions";
import type { DoctorChatQuestion } from "../constants/doctorChatQuestions";

interface DoctorChatFooterProps {
  safetyStopTriggered: boolean;
  safetyStopMessage: string | null;
  isWaitingForAnswer: boolean;
  currentQuestion: DoctorChatQuestion | null;
  selectedOptions: string[];
  onOptionToggle: (option: string) => void;
  onContinue: () => void;
  consultationComplete: boolean;
  prescriptionReady: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  chatInputRef: React.RefObject<HTMLInputElement>;
}

// Helper to determine if question is multiple select
function isMultipleSelectQuestion(
  question: DoctorChatQuestion | null,
): boolean {
  return (
    question?.type === "multiple_choice" && question.allowMultiple === true
  );
}

export function DoctorChatFooter({
  safetyStopTriggered,
  safetyStopMessage,
  isWaitingForAnswer,
  currentQuestion,
  selectedOptions,
  onOptionToggle,
  onContinue,
  consultationComplete,
  prescriptionReady,
  inputValue,
  onInputChange,
  onSend,
  chatInputRef,
}: DoctorChatFooterProps) {
  const navigate = useNavigate();

  return (
    <div className="flex-shrink-0 bg-white border-t border-border-dark">
      {/* Safety Stop Banner */}
      {safetyStopTriggered && safetyStopMessage && (
        <SafetyStopBanner message={safetyStopMessage} />
      )}

      {/* Options Section */}
      {isWaitingForAnswer && currentQuestion && (
        <DoctorChatOptions
          question={currentQuestion}
          selectedOptions={selectedOptions}
          onOptionToggle={onOptionToggle}
          onContinue={
            isMultipleSelectQuestion(currentQuestion) ? onContinue : () => {}
          }
        />
      )}

      {/* Input Area - Always shown (except when consultation is complete or prescription is ready) */}
      {!consultationComplete && !prescriptionReady && (
        <div className="p-6">
          <div className="max-w-[672px] mx-auto">
            <ChatInput
              ref={chatInputRef}
              value={inputValue}
              onChange={onInputChange}
              onSend={onSend}
            />
          </div>
        </div>
      )}

      {/* Completion State - View Prescription Button */}
      {prescriptionReady && (
        <div className="bg-white flex flex-col gap-5 items-center justify-center px-0 py-10 shadow-[0px_-100px_111px_0px_rgba(255,255,255,0.4)] animate-fade-in-slide-up">
          <button
            onClick={() => navigate(ROUTES.PRESCRIPTION)}
            className="bg-brand-cyan-dark text-white font-inter px-6 py-3 rounded-2xl font-semibold text-base leading-6 hover:bg-brand-cyan-dark/90 active:bg-brand-cyan-dark/85 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan-dark focus:ring-offset-2"
            aria-label="View prescription"
          >
            View Prescription
          </button>
        </div>
      )}
    </div>
  );
}
