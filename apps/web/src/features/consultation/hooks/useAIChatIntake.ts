/**
 * useAIChatIntake - Hook for managing deterministic AI chat intake flow
 * Handles Phase A (universal) and Phase B (category-specific) questions
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { Message } from "@sniffles/types";
import { useChat } from "./useChat";
import { useConsultationStore } from "@/stores/consultation.store";
import {
  PHASE_A_QUESTIONS,
  PHASE_B_QUESTIONS,
  SAFETY_STOPS,
} from "../constants/chatQuestions";
import type { ChatQuestion } from "../constants/chatQuestions";
import type { HealthCategory } from "@sniffles/types";

export interface UseAIChatIntakeReturn {
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  sendMessage: (text: string) => void;
  currentQuestion: ChatQuestion | null;
  isWaitingForAnswer: boolean;
  phaseACompleted: boolean;
  phaseBCompleted: boolean;
  safetyStopTriggered: boolean;
  safetyStopMessage: string | null;
}

export function useAIChatIntake(): UseAIChatIntakeReturn {
  const {
    selectedCategory,
    medicalData,
    updateMedicalData,
    setPhaseACompleted,
    setPhaseBCompleted,
    setSafetyStop,
    phaseACompleted: storePhaseACompleted,
    phaseBCompleted: storePhaseBCompleted,
    safetyStopTriggered: storeSafetyStopTriggered,
    safetyStopMessage: storeSafetyStopMessage,
  } = useConsultationStore();

  const [currentPhase, setCurrentPhase] = useState<"A" | "B" | "complete">("A");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const waitingForFollowupRef = useRef<string | null>(null);
  const lastQuestionKeyRef = useRef<string | null>(null);

  const {
    messages,
    inputValue,
    setInputValue,
    sendUserMessage,
    sendAIMessage,
    initializeMessages,
  } = useChat({ autoInitialize: false });

  // Initialize chat
  useEffect(() => {
    if (!isInitialized && selectedCategory && messages.length === 0) {
      const welcomeMessage: Message = {
        type: "ai",
        text: "Hello! I'm your AI assistant. I'll help gather your medical information. This will help us provide you with the best care. Let's start with some basic personal details.",
        timestamp: new Date(),
      };
      initializeMessages([welcomeMessage]);
      setIsInitialized(true);

      // Ask first question after a brief delay
      setTimeout(() => {
        askQuestion(PHASE_A_QUESTIONS[0]);
      }, 1000);
    }
  }, [isInitialized, selectedCategory, messages.length, initializeMessages]);

  // Check for safety stops
  const checkSafetyStops = useCallback(
    (answer: string, category: HealthCategory | null): string | null => {
      if (!category) return null;

      for (const stop of SAFETY_STOPS) {
        if (stop.trigger(answer, category)) {
          setSafetyStop(true, stop.message);
          return stop.message;
        }
      }
      return null;
    },
    [setSafetyStop],
  );

  // Ask a question
  const askQuestion = useCallback(
    (question: ChatQuestion) => {
      // Determine options based on question type
      let options: string[] | undefined;

      if (question.type === "yes_no") {
        options = ["Yes", "No"];
      } else if (question.type === "multiple_choice" && question.options) {
        options = question.options;
      } else if (question.key === "sex") {
        options = ["Male", "Female"];
      }

      // Send message with options - we'll set the handler when handleSendMessage is defined
      sendAIMessage(question.text, undefined, options);
      setIsWaitingForAnswer(true);
      lastQuestionKeyRef.current = question.key;
    },
    [sendAIMessage],
  );

  // Process answer
  const processAnswer = useCallback(
    (answer: string, question: ChatQuestion) => {
      // Check safety stops first
      const safetyMessage = checkSafetyStops(answer, selectedCategory);
      if (safetyMessage) {
        sendAIMessage(safetyMessage);
        setIsWaitingForAnswer(false);
        return;
      }

      const currentData = medicalData || {
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

      // Handle followup questions
      if (waitingForFollowupRef.current) {
        // This is a followup answer
        if (question.key === "allergies") {
          updateMedicalData({ allergies: [answer] });
        } else if (question.key === "surgicalHistory") {
          updateMedicalData({ surgicalHistory: [answer] });
        } else {
          const phaseBAnswers = { ...(currentData.phaseBAnswers || {}) };
          phaseBAnswers[question.key] = answer;
          updateMedicalData({ phaseBAnswers });
        }
        waitingForFollowupRef.current = null;
        return; // Will advance to next question below
      }

      // Process based on question type
      if (question.type === "yes_no") {
        const isYes =
          /^(yes|y|true|1)$/i.test(answer.trim()) ||
          answer.toLowerCase().includes("yes");

        if (question.key === "smoking") {
          const existing = currentData.socialHistory.filter(
            (s) => s.type !== "Smoking",
          );
          updateMedicalData({
            socialHistory: [
              ...existing,
              { type: "Smoking", level: isYes ? "Yes" : "No" },
            ],
          });
        } else if (question.key === "alcohol") {
          const existing = currentData.socialHistory.filter(
            (s) => s.type !== "Alcohol",
          );
          updateMedicalData({
            socialHistory: [
              ...existing,
              { type: "Alcohol", level: isYes ? "Yes" : "No" },
            ],
          });
        } else if (question.key === "drugs") {
          const existing = currentData.socialHistory.filter(
            (s) => s.type !== "Recreational Drugs",
          );
          updateMedicalData({
            socialHistory: [
              ...existing,
              { type: "Recreational Drugs", level: isYes ? "Yes" : "No" },
            ],
          });
        } else {
          const phaseBAnswers = { ...(currentData.phaseBAnswers || {}) };
          phaseBAnswers[question.key] = isYes ? "Yes" : "No";
          updateMedicalData({ phaseBAnswers });
        }
      } else if (question.type === "yes_no_with_followup") {
        const isYes =
          /^(yes|y|true|1)$/i.test(answer.trim()) ||
          answer.toLowerCase().includes("yes");

        if (isYes && question.followup) {
          // Ask followup
          waitingForFollowupRef.current = question.key;
          sendAIMessage(question.followup);
          setIsWaitingForAnswer(true);
          return; // Don't advance yet
        } else {
          // No followup needed
          if (question.key === "allergies") {
            updateMedicalData({ allergies: ["None"] });
          } else if (question.key === "surgicalHistory") {
            updateMedicalData({ surgicalHistory: [] });
          } else {
            const phaseBAnswers = { ...(currentData.phaseBAnswers || {}) };
            phaseBAnswers[question.key] = isYes ? "Yes" : "No";
            updateMedicalData({ phaseBAnswers });
          }
        }
      } else if (question.type === "multiple_choice") {
        // Handle multiple selection
        if (question.allowMultiple) {
          // Answer may be comma-separated string or single value
          const answerParts = answer
            .split(",")
            .map((part) => part.trim())
            .filter((part) => part.length > 0);

          // Match each part to available options
          const selectedOptions: string[] = [];
          for (const part of answerParts) {
            const lowerPart = part.toLowerCase();
            const matchedOption = question.options?.find(
              (opt) =>
                lowerPart.includes(opt.toLowerCase()) ||
                opt.toLowerCase().includes(lowerPart),
            );
            if (matchedOption) {
              selectedOptions.push(matchedOption);
            }
          }

          // Handle "None" option
          const hasNone = selectedOptions.includes("None");
          const finalOptions = hasNone
            ? []
            : selectedOptions.filter((opt) => opt !== "None");

          if (question.key === "chronicConditions") {
            updateMedicalData({ chronicConditions: finalOptions });
          } else if (question.key === "familyHistory") {
            updateMedicalData({ familyHistory: finalOptions });
          } else {
            // For Phase B questions with multiple selection, store as comma-separated string
            const phaseBAnswers = { ...(currentData.phaseBAnswers || {}) };
            phaseBAnswers[question.key] = finalOptions.join(", ");
            updateMedicalData({ phaseBAnswers });
          }
        } else {
          // Single selection (original behavior)
          const lowerAnswer = answer.toLowerCase();
          const matchedOption = question.options?.find((opt) =>
            lowerAnswer.includes(opt.toLowerCase()),
          );

          if (question.key === "chronicConditions") {
            const conditions =
              matchedOption && matchedOption !== "None"
                ? [matchedOption]
                : matchedOption === "None"
                  ? []
                  : [answer];
            updateMedicalData({ chronicConditions: conditions });
          } else if (question.key === "familyHistory") {
            const history =
              matchedOption && matchedOption !== "None"
                ? [matchedOption]
                : matchedOption === "None"
                  ? []
                  : [answer];
            updateMedicalData({ familyHistory: history });
          } else {
            const phaseBAnswers = { ...(currentData.phaseBAnswers || {}) };
            phaseBAnswers[question.key] = matchedOption || answer;
            updateMedicalData({ phaseBAnswers });
          }
        }
      } else {
        // Text input
        // Handle personal details questions
        if (question.key === "age") {
          // Extract age from answer
          const ageMatch = answer.match(/\d+/);
          const age = ageMatch ? ageMatch[0] : answer.trim();
          updateMedicalData({ age });
        } else if (question.key === "sex") {
          // Parse sex from answer
          // Examples: "male", "M", "female", "F", "Male"
          const lowerAnswer = answer.toLowerCase().trim();
          let sex = "";
          if (lowerAnswer.includes("male") || lowerAnswer === "m") {
            sex = "M";
          } else if (lowerAnswer.includes("female") || lowerAnswer === "f") {
            sex = "F";
          } else {
            sex = answer.trim(); // Store as-is if not recognized
          }
          updateMedicalData({ sex });
        } else if (question.key === "height") {
          // Store height as provided
          updateMedicalData({ height: answer.trim() });
        } else if (question.key === "weight") {
          // Store weight as provided
          updateMedicalData({ weight: answer.trim() });
        } else {
          // Other text inputs go to phaseBAnswers
          const phaseBAnswers = { ...(currentData.phaseBAnswers || {}) };
          phaseBAnswers[question.key] = answer;
          updateMedicalData({ phaseBAnswers });
        }
      }
    },
    [
      medicalData,
      updateMedicalData,
      checkSafetyStops,
      selectedCategory,
      sendAIMessage,
    ],
  );

  // Advance to next question
  const advanceToNextQuestion = useCallback(() => {
    if (currentPhase === "A") {
      if (currentQuestionIndex < PHASE_A_QUESTIONS.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setTimeout(() => {
          askQuestion(PHASE_A_QUESTIONS[nextIndex]);
        }, 500);
      } else {
        // Phase A complete
        setPhaseACompleted(true);
        setCurrentPhase("B");
        setCurrentQuestionIndex(0);
        setTimeout(() => {
          if (selectedCategory) {
            sendAIMessage(
              "Now, let me ask you some questions specific to your condition.",
            );
            setTimeout(() => {
              const phaseBQuestions = PHASE_B_QUESTIONS[selectedCategory];
              if (phaseBQuestions.length > 0) {
                askQuestion(phaseBQuestions[0]);
              }
            }, 1000);
          }
        }, 1000);
      }
    } else if (currentPhase === "B" && selectedCategory) {
      const phaseBQuestions = PHASE_B_QUESTIONS[selectedCategory];
      if (currentQuestionIndex < phaseBQuestions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setTimeout(() => {
          askQuestion(phaseBQuestions[nextIndex]);
        }, 500);
      } else {
        // Phase B complete
        setPhaseBCompleted(true);
        setCurrentPhase("complete");
        setIsWaitingForAnswer(false);
        sendAIMessage(
          "Thank you for providing this information. Your medical profile has been updated. You can review it in the panel on the right.",
        );
      }
    }
  }, [
    currentPhase,
    currentQuestionIndex,
    selectedCategory,
    askQuestion,
    sendAIMessage,
    setPhaseACompleted,
    setPhaseBCompleted,
  ]);

  // Handle sending message
  const handleSendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !isWaitingForAnswer) return;

      sendUserMessage(text);

      // Determine which question we're answering
      let currentQuestion: ChatQuestion | null = null;

      if (waitingForFollowupRef.current) {
        // Answering a followup
        const phase =
          currentPhase === "A"
            ? PHASE_A_QUESTIONS
            : selectedCategory
              ? PHASE_B_QUESTIONS[selectedCategory]
              : [];
        currentQuestion =
          phase.find((q) => q.key === waitingForFollowupRef.current) || null;
      } else {
        // Answering current question
        if (currentPhase === "A") {
          currentQuestion = PHASE_A_QUESTIONS[currentQuestionIndex];
        } else if (currentPhase === "B" && selectedCategory) {
          currentQuestion =
            PHASE_B_QUESTIONS[selectedCategory][currentQuestionIndex];
        }
      }

      if (currentQuestion) {
        const wasWaitingForFollowup = !!waitingForFollowupRef.current;
        processAnswer(text, currentQuestion);

        // If we were waiting for followup and now it's processed, advance
        // Otherwise, if not waiting for followup, advance normally
        if (wasWaitingForFollowup && !waitingForFollowupRef.current) {
          // Followup was just processed, advance to next question
          setIsWaitingForAnswer(false);
          setTimeout(() => {
            advanceToNextQuestion();
          }, 500);
        } else if (!waitingForFollowupRef.current) {
          // Normal question answered, advance
          setIsWaitingForAnswer(false);
          setTimeout(() => {
            advanceToNextQuestion();
          }, 500);
        }
        // If still waiting for followup, don't advance yet
      }

      setInputValue("");
    },
    [
      isWaitingForAnswer,
      currentPhase,
      currentQuestionIndex,
      selectedCategory,
      sendUserMessage,
      processAnswer,
      advanceToNextQuestion,
      setInputValue,
    ],
  );

  // Update messages with option handlers after handleSendMessage is defined
  useEffect(() => {
    if (messages.length > 0 && handleSendMessage) {
      const updatedMessages = messages.map((msg) => {
        if (msg.type === "ai" && msg.options && !msg.onOptionSelect) {
          return {
            ...msg,
            onOptionSelect: (option: string) => handleSendMessage(option),
          };
        }
        return msg;
      });
      // Only update if there's a change
      const hasChanges = updatedMessages.some(
        (msg, idx) => msg.onOptionSelect !== messages[idx]?.onOptionSelect,
      );
      if (hasChanges) {
        // Use addMessage to update - we need to check if we can update existing messages
        // For now, we'll handle this in the component by passing handleSendMessage
      }
    }
  }, [messages, handleSendMessage]);

  // Get current question
  const getCurrentQuestion = (): ChatQuestion | null => {
    if (waitingForFollowupRef.current) {
      const phase =
        currentPhase === "A"
          ? PHASE_A_QUESTIONS
          : selectedCategory
            ? PHASE_B_QUESTIONS[selectedCategory]
            : [];
      return phase.find((q) => q.key === waitingForFollowupRef.current) || null;
    }

    if (currentPhase === "A") {
      return PHASE_A_QUESTIONS[currentQuestionIndex] || null;
    } else if (currentPhase === "B" && selectedCategory) {
      return PHASE_B_QUESTIONS[selectedCategory][currentQuestionIndex] || null;
    }
    return null;
  };

  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage: handleSendMessage,
    currentQuestion: getCurrentQuestion(),
    isWaitingForAnswer,
    phaseACompleted: storePhaseACompleted,
    phaseBCompleted: storePhaseBCompleted,
    safetyStopTriggered: storeSafetyStopTriggered,
    safetyStopMessage: storeSafetyStopMessage,
  };
}
