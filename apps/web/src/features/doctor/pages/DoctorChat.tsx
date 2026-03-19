import { useEffect, useState, useRef } from "react";
import { useConsultationStore } from "@/stores/consultation.store";
import { useDoctorStore } from "@/stores/doctor.store";
import { useDoctorChatConsultation } from "../hooks/useDoctorChatConsultation";
import { useScrollToBottom } from "@/hooks";
import { getSymptomNamesFromIds } from "@/features/consultation/utils/symptomUtils";
import {
  DoctorChatLayout,
  DoctorChatHeader,
  DoctorChatMessages,
  DoctorChatFooter,
  DoctorChatSidebar,
} from "../components";

export default function DoctorChat() {
  const { selectedSymptoms, aiAssessment, medicalData } =
    useConsultationStore();
  const { selectedDoctor, setSelectedDoctor } = useDoctorStore();

  const {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    currentQuestion,
    isWaitingForAnswer,
    phase1Completed,
    phase2Completed,
    phase3Completed,
    phase4Completed,
    consultationComplete,
    prescriptionReady,
    safetyStopTriggered,
    safetyStopMessage,
  } = useDoctorChatConsultation();

  const { messagesEndRef } = useScrollToBottom(messages);

  // Track selected options for multiple selection questions
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"ai" | "medical" | "consultation">(
    "ai",
  );

  // Ref for chat input field
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Track last message count to detect new messages
  const lastMessageCountRef = useRef(0);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Set default doctor if not set (fallback for demo)
  // Note: Doctor should be selected in Consultation page and persist
  useEffect(() => {
    if (!selectedDoctor) {
      // Set a default doctor for demo purposes if none selected
      setSelectedDoctor({
        id: "1",
        name: "Evelyn Reed",
        title: "MD",
        specialty: "General Practice",
        experience: "12 yrs experience",
        location: "New York",
        initials: "ER",
        isConnected: true,
      });
    }
  }, [selectedDoctor, setSelectedDoctor]);

  // Auto-scroll and focus on new messages
  useEffect(() => {
    const currentMessageCount = messages.length;

    if (currentMessageCount > lastMessageCountRef.current) {
      setTimeout(() => {
        if (lastMessageRef.current) {
          lastMessageRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        } else {
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }
      }, 100);
    }

    lastMessageCountRef.current = currentMessageCount;
  }, [messages, messagesEndRef]);

  // Reset selected options when question changes
  useEffect(() => {
    if (currentQuestion) {
      setSelectedOptions([]);
    }
  }, [currentQuestion?.id]);

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
    }
  };

  // Get symptoms from store using proper mapping
  const symptoms =
    selectedSymptoms.length > 0
      ? getSymptomNamesFromIds(selectedSymptoms)
      : ["Fever", "Persistent Cough", "Headache", "Fatigue"]; // Fallback for demo

  const currentAiAssessment =
    aiAssessment ||
    "The AI has identified a potential viral infection based on the symptoms provided. Common causes could include influenza or a common cold. This is not a final diagnosis.";

  // Handle option toggle - works for both single and multiple selection
  const handleOptionToggle = (option: string) => {
    const isMultipleSelect =
      currentQuestion?.type === "multiple_choice" &&
      currentQuestion.allowMultiple === true;

    if (isMultipleSelect) {
      // Multiple selection logic
      if (option === "None") {
        setSelectedOptions(["None"]);
      } else {
        setSelectedOptions((prev) => {
          const withoutNone = prev.filter((o) => o !== "None");
          if (withoutNone.includes(option)) {
            return withoutNone.filter((o) => o !== option);
          } else {
            return [...withoutNone, option];
          }
        });
      }
    } else {
      // Single selection - send immediately
      sendMessage(option);
    }
  };

  // Handle continue button for multiple selection
  const handleContinue = () => {
    const answer =
      selectedOptions.length === 1 && selectedOptions[0] === "None"
        ? "None"
        : selectedOptions.filter((o) => o !== "None").join(", ");
    sendMessage(answer);
  };

  return (
    <DoctorChatLayout>
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden bg-neutral-off-white min-h-0">
        <div className="flex-1 max-w-[1464px] mx-auto w-full flex gap-3 p-6 h-full min-h-0">
          {/* Left Panel - Chat */}
          <div className="flex-1 bg-white border border-neutral-gray rounded-xl overflow-hidden flex flex-col max-w-[1110px] min-h-0">
            <DoctorChatHeader doctor={selectedDoctor} />

            <DoctorChatMessages
              messages={messages}
              messagesEndRef={messagesEndRef}
              lastMessageRef={lastMessageRef}
              isWaitingForAnswer={isWaitingForAnswer}
            />

            <DoctorChatFooter
              safetyStopTriggered={safetyStopTriggered}
              safetyStopMessage={safetyStopMessage}
              isWaitingForAnswer={isWaitingForAnswer}
              currentQuestion={currentQuestion}
              selectedOptions={selectedOptions}
              onOptionToggle={handleOptionToggle}
              onContinue={handleContinue}
              consultationComplete={consultationComplete}
              prescriptionReady={prescriptionReady}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSend={handleSend}
              chatInputRef={chatInputRef}
            />
          </div>

          {/* Right Panel - Summary */}
          <DoctorChatSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            phase1Completed={phase1Completed}
            phase2Completed={phase2Completed}
            phase3Completed={phase3Completed}
            phase4Completed={phase4Completed}
            aiAssessment={currentAiAssessment}
            symptoms={symptoms}
            medicalData={medicalData}
          />
        </div>
      </div>
    </DoctorChatLayout>
  );
}
