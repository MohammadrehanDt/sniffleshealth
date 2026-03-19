import { useEffect, useState, useRef } from "react";
import { X, Info, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { MedicalData } from "@sniffles/types";
import { ROUTES, FONTS } from "@/constants";
import { PageHeader, AppFooter } from "@/components/layout";
import { AIMessage, UserMessage } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat";
import {
  useConsultationFlow,
  useFormNavigation,
  useAIChatIntake,
} from "../hooks";
import { useScrollToBottom } from "@/hooks";
import { useConsultationStore } from "@/stores/consultation.store";
import type { ChatQuestion } from "../constants/chatQuestions";

export default function MedicalProfile() {
  const navigate = useNavigate();
  const { selectedCategory } = useConsultationStore();
  const { medicalData, setMedicalData, goToSummary } = useConsultationFlow();
  const { getStepInfo } = useFormNavigation();
  const stepInfo = getStepInfo();

  const {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    safetyStopTriggered,
    safetyStopMessage,
    phaseACompleted,
    phaseBCompleted,
    currentQuestion,
    isWaitingForAnswer,
  } = useAIChatIntake();

  const { messagesEndRef } = useScrollToBottom(messages);

  // Track selected options for multiple selection questions
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Ref for chat input field (better React pattern than document.querySelector)
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Track last message count to detect new messages
  const lastMessageCountRef = useRef(0);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Auto-scroll and focus on new messages (user or AI)
  useEffect(() => {
    const currentMessageCount = messages.length;

    // Check if a new message was added
    if (currentMessageCount > lastMessageCountRef.current) {
      // New message detected - scroll to it
      setTimeout(() => {
        if (lastMessageRef.current) {
          // Scroll to the last message with smooth behavior
          lastMessageRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        } else {
          // Fallback: scroll to bottom
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }
      }, 100); // Small delay to ensure DOM is updated
    }

    // Update the ref
    lastMessageCountRef.current = currentMessageCount;
  }, [messages, messagesEndRef]);

  // Initialize medical data structure if empty
  useEffect(() => {
    if (!medicalData) {
      setMedicalData({
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
      });
    }
  }, [medicalData, setMedicalData]);

  // Reset selected options when question changes
  useEffect(() => {
    if (currentQuestion) {
      setSelectedOptions([]);
    }
  }, [currentQuestion?.id]);

  const handleSend = () => {
    sendMessage(inputValue);
  };

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

  // Check if last message is from user (indicates transition state)
  const lastMessageIsFromUser =
    messages.length > 0 && messages[messages.length - 1]?.type === "user";

  return (
    <div className="h-screen bg-neutral-off-white flex flex-col overflow-hidden">
      <PageHeader
        backTo={ROUTES.SYMPTOMS}
        step={stepInfo?.step}
        title={stepInfo?.title}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden bg-neutral-off-white min-h-0">
        <div className="flex-1 max-w-[1464px] mx-auto w-full flex gap-3 p-4 h-full min-h-0">
          {/* Chat Section */}
          <div className="flex-1 bg-white rounded-xl border border-neutral-gray flex flex-col overflow-hidden max-w-[1110px] min-h-0">
            {/* Scrollable Messages Area */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-10">
                <div className="flex flex-col gap-[22px] max-w-[672px] mx-auto">
                  {messages.map((message, index) => {
                    // Check if this is the last message (any type)
                    const isLastMessage = index === messages.length - 1;

                    return (
                      <div
                        key={index}
                        ref={isLastMessage ? lastMessageRef : null}
                        tabIndex={isLastMessage ? -1 : undefined}
                        className={
                          message.type === "ai"
                            ? "w-full"
                            : "w-auto max-w-[80%] self-end"
                        }
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        {message.type === "ai" ? (
                          <AIMessage text={message.text} />
                        ) : (
                          <UserMessage text={message.text} />
                        )}
                      </div>
                    );
                  })}
                  {isWaitingForAnswer && messages.length > 0 && messages[messages.length - 1]?.type === "user" && (
                    <div className="w-full">
                      <TypingIndicator sender="AI Assistant" />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Fixed Footer Area */}
            <div className="flex-shrink-0 bg-white border-t border-border-dark">
              {/* Safety Stop Banner */}
              {safetyStopTriggered && safetyStopMessage && (
                <div className="p-6 bg-yellow-100 border-l-4 border-l-yellow-500">
                  <div className="flex items-start gap-3 max-w-[672px] mx-auto">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-yellow-800 font-inter font-semibold text-sm mb-1">
                        Important Notice
                      </h3>
                      <p className="text-yellow-900 text-sm font-inter">
                        {safetyStopMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Options Section */}
              {isWaitingForAnswer &&
                currentQuestion &&
                (() => {
                  // Determine options based on question type
                  let options: string[] | undefined;
                  const isMultipleSelect =
                    currentQuestion.type === "multiple_choice" &&
                    currentQuestion.allowMultiple === true;

                  if (currentQuestion.type === "yes_no") {
                    options = ["Yes", "No"];
                  } else if (
                    currentQuestion.type === "multiple_choice" &&
                    currentQuestion.options
                  ) {
                    options = currentQuestion.options;
                  } else if (currentQuestion.key === "sex") {
                    options = ["Male", "Female"];
                  }

                  // Only render section if options exist
                  if (!options || options.length === 0) return null;

                  return (
                    <div className="py-4 pb-0 px-6">
                      <div className="max-w-[672px] mx-auto">
                        {(() => {
                          // Handle multiple selection
                          if (isMultipleSelect) {
                            const handleOptionToggle = (option: string) => {
                              if (option === "None") {
                                // Selecting "None" clears all other selections
                                setSelectedOptions(["None"]);
                              } else {
                                // Selecting any option removes "None" if present
                                setSelectedOptions((prev) => {
                                  const withoutNone = prev.filter(
                                    (o) => o !== "None",
                                  );
                                  if (withoutNone.includes(option)) {
                                    // Deselect if already selected
                                    return withoutNone.filter(
                                      (o) => o !== option,
                                    );
                                  } else {
                                    // Add to selection
                                    return [...withoutNone, option];
                                  }
                                });
                              }
                            };

                            const handleSubmit = () => {
                              if (selectedOptions.length === 0) return;
                              // Send selected options as comma-separated string or handle in processing
                              const answer =
                                selectedOptions.length === 1 &&
                                selectedOptions[0] === "None"
                                  ? "None"
                                  : selectedOptions
                                      .filter((o) => o !== "None")
                                      .join(", ");
                              sendMessage(answer);
                            };

                            return (
                              <div className="flex flex-col gap-3">
                                <div className="flex gap-3 flex-wrap">
                                  {options.map((option, index) => {
                                    const isSelected =
                                      selectedOptions.includes(option);
                                    return (
                                      <button
                                        key={index}
                                        onClick={() =>
                                          handleOptionToggle(option)
                                        }
                                        className={`border rounded-xl px-4 py-2 font-inter text-base font-medium leading-6 transition-colors ${
                                          isSelected
                                            ? "bg-white border-brand-cyan-dark text-brand-cyan-dark border-2"
                                            : "bg-white border-border-medium text-text-secondary hover:bg-gray-50"
                                        }`}
                                      >
                                        {option}
                                      </button>
                                    );
                                  })}
                                </div>
                                {selectedOptions.length > 0 && (
                                  <div className="flex justify-end">
                                    <button
                                      onClick={handleSubmit}
                                      className="bg-brand-cyan-dark text-white font-inter rounded-xl px-4 py-2 font-semibold text-base leading-6 hover:bg-brand-cyan-dark/90 transition-colors"
                                    >
                                      Continue
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          // Single selection (original behavior)
                          return (
                            <div className="flex gap-3 flex-wrap">
                              {options.map((option, index) => (
                                <button
                                  key={index}
                                  onClick={() => sendMessage(option)}
                                  className="bg-white border border-border-medium text-text-secondary font-inter text-base font-medium leading-6 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors"
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })()}

              {/* Input Area - Only show when questions are in progress */}
              {!(phaseACompleted && phaseBCompleted) &&
                !safetyStopTriggered && (
                  <div className="p-6">
                    <div className="max-w-[672px] mx-auto">
                      <ChatInput
                        ref={chatInputRef}
                        value={inputValue}
                        onChange={setInputValue}
                        onSend={handleSend}
                      />
                    </div>
                  </div>
                )}

              {/* Continue Button Section - Only show when all questions are complete */}
              {((phaseACompleted && phaseBCompleted) ||
                safetyStopTriggered) && (
                <div className="bg-white flex flex-col gap-5 items-center justify-center px-0 py-10 shadow-[0px_-100px_111px_0px_rgba(255,255,255,0.4)] animate-fade-in-slide-up">
                  <button
                    onClick={goToSummary}
                    className="bg-brand-cyan-dark text-white font-inter px-6 py-3 rounded-2xl font-semibold text-base leading-6 hover:bg-brand-cyan-dark/90 active:bg-brand-cyan-dark/85 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan-dark focus:ring-offset-2"
                    aria-label="Continue with consultation"
                  >
                    Continue with consultation
                  </button>
                </div>
              )}

              {/* Secondary Link - Hidden during active Q&A, only show when questions incomplete and not waiting for answer */}
              {!(phaseACompleted && phaseBCompleted) &&
                !safetyStopTriggered &&
                !isWaitingForAnswer &&
                !lastMessageIsFromUser && (
                  <div className="bg-white flex flex-col gap-5 items-center justify-center px-0 py-10 shadow-[0px_-100px_111px_0px_rgba(255,255,255,0.4)]">
                    <button
                      onClick={() => {
                        // Focus on input to allow user to continue sharing information
                        chatInputRef.current?.focus();
                      }}
                      className="text-brand-cyan-dark text-lg font-inter font-medium leading-6 tracking-body-tight hover:text-brand-cyan-dark/80 active:text-brand-cyan-dark/70 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan-dark focus:ring-offset-2 rounded-sm"
                      aria-label="I have to share more information"
                    >
                      I have to share more information
                    </button>
                  </div>
                )}
            </div>
          </div>

          {/* Medical Profile Summary */}
          <div className="w-[342px] flex-shrink-0 bg-white rounded-xl border border-neutral-gray p-5 flex flex-col gap-6 overflow-y-auto h-full min-h-0">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/d70e756501509614b665deb946de13d9f2aab9da"
                alt="User avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-text-light text-xs font-inter font-medium">
                  Consultation For
                </span>
                <span className="text-text-primary text-base font-inter font-medium">
                  John Doe
                </span>
              </div>
            </div>

            {/* Info Block */}
            <div className="bg-brand-cyan-lighter rounded-xl p-3 flex flex-col items-center gap-1 text-center">
              <Info className="w-6 h-6 text-text-secondary" />
              <h3 className="text-text-primary text-base font-inter font-medium">
                Building your medical profile
              </h3>
              <p className="text-text-slate text-sm font-inter">
                This information will be saved and reviewed by a healthcare
                professional during consultation
              </p>
            </div>

            {/* Personal Details */}
            <div className="flex flex-col gap-3">
              <h3 className="text-text-primary text-base font-inter font-medium">
                Personal Details
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <DataField label="Age" value={currentMedicalData.age} />
                <DataField label="Weight" value={currentMedicalData.weight} />
                <DataField label="Sex" value={currentMedicalData.sex} />
                <DataField label="Height" value={currentMedicalData.height} />
              </div>
            </div>

            <div className="h-px bg-border-medium" />

            {/* Allergies */}
            <div className="flex flex-col gap-2">
              <h3 className="text-text-primary text-base font-inter font-medium">
                Allergies
              </h3>
              {currentMedicalData.allergies.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {currentMedicalData.allergies.map((allergy, idx) => (
                    <Tag key={idx} text={allergy} />
                  ))}
                </div>
              ) : (
                <p className="text-text-slate text-sm font-inter">None</p>
              )}
            </div>

            <div className="h-px bg-border-medium" />

            {/* Chronic Conditions */}
            <div className="flex flex-col gap-2">
              <h3 className="text-text-primary text-base font-inter font-medium">
                Chronic Conditions
              </h3>
              <div className="flex flex-col gap-2">
                {currentMedicalData.chronicConditions.map((condition, idx) => (
                  <Tag key={idx} text={condition} />
                ))}
              </div>
            </div>

            <div className="h-px bg-border-medium" />

            {/* Past Surgical History */}
            <div className="flex flex-col gap-2">
              <h3 className="text-text-primary text-base font-inter font-medium">
                Past Surgical History
              </h3>
              <div className="flex flex-col gap-2">
                {currentMedicalData.surgicalHistory.map((surgery, idx) => (
                  <Tag key={idx} text={surgery} />
                ))}
              </div>
            </div>

            <div className="h-px bg-border-medium" />

            {/* Social History */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-text-primary text-base font-inter font-medium">
                  Social History
                </h3>
                <p className="text-neutral-dark-gray text-sm font-inter">
                  Including smoking, alcohol and illicit drug use (like cocaine,
                  PCP, methamphetamine, marijuana)
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {currentMedicalData.socialHistory.map((item, idx) => (
                  <DoubleTag key={idx} label={item.type} value={item.level} />
                ))}
              </div>
            </div>

            <div className="h-px bg-border-medium" />

            {/* Family History */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-text-primary text-base font-inter font-medium">
                  Family History
                </h3>
                <p className="text-neutral-dark-gray text-sm font-inter">
                  Problems that run in a family like heart disease or other
                  genetic issues
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {currentMedicalData.familyHistory.map((item, idx) => (
                  <Tag key={idx} text={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div className="col-span-1">
      <span className="text-text-secondary text-sm font-inter block mb-1">
        {label}
      </span>
      <div className="bg-warm-50 rounded-lg px-2 py-1">
        <span className="text-text-primary text-base font-inter">{value}</span>
      </div>
    </div>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-between gap-1 bg-neutral-light-gray rounded-lg px-3 py-1">
      <span className="text-text-slate text-sm font-inter">{text}</span>
      <X className="w-4 h-4 text-text-secondary cursor-pointer hover:text-text-primary" />
    </div>
  );
}

function DoubleTag({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-1 bg-neutral-light-gray rounded-lg px-3 py-1">
      <div className="flex items-center gap-2">
        <span className="text-text-slate text-sm font-inter font-medium">
          {label}
        </span>
        <span className="text-text-slate text-sm font-inter">{value}</span>
      </div>
      <X className="w-4 h-4 text-text-secondary cursor-pointer hover:text-text-primary" />
    </div>
  );
}
