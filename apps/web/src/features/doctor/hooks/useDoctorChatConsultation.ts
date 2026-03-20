/**
 * useDoctorChatConsultation - Hook for managing doctor chat consultation flow
 * Handles Phase 1 (initial), Phase 2 (category-specific), Phase 3 (medical review), Phase 4 (final)
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { Message } from "@sniffles/types";
import { ROUTES } from "@/constants";
import { useChat } from "@/features/consultation/hooks/useChat";
import { useConsultationStore } from "@/stores/consultation.store";
import { useDoctorStore } from "@/stores/doctor.store";
import { useDoctorConsultationStore } from "@/stores/doctor-consultation.store";
import {
  PHASE_1_QUESTIONS,
  PHASE_2_QUESTIONS,
  PHASE_3_QUESTIONS,
  PHASE_4_QUESTIONS,
  getPhase2Questions,
  getPhase3Questions,
  formatQuestionText,
  shouldAskQuestion,
  getPrimarySymptom,
  type DoctorChatQuestion,
  type QuestionContext,
} from "../constants/doctorChatQuestions";
import { checkSafetyStops } from "../constants/doctorChatSafetyStops";
import type { HealthCategory } from "@sniffles/types";

export interface UseDoctorChatConsultationReturn {
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  sendMessage: (text: string) => void;
  currentQuestion: DoctorChatQuestion | null;
  isWaitingForAnswer: boolean;
  phase1Completed: boolean;
  phase2Completed: boolean;
  phase3Completed: boolean;
  phase4Completed: boolean;
  consultationComplete: boolean;
  prescriptionReady: boolean;
  safetyStopTriggered: boolean;
  safetyStopMessage: string | null;
}

export function useDoctorChatConsultation(): UseDoctorChatConsultationReturn {
  const { selectedCategory, selectedSymptoms, medicalData, aiAssessment } =
    useConsultationStore();
  const { selectedDoctor } = useDoctorStore();
  const {
    consultationAnswers,
    currentPhase,
    currentQuestionIndex,
    phase1Completed,
    phase2Completed,
    phase3Completed,
    phase4Completed,
    consultationComplete,
    prescriptionReady,
    safetyStopTriggered,
    safetyStopMessage,
    setConsultationAnswer,
    setCurrentPhase,
    setCurrentQuestionIndex,
    setPhaseCompleted,
    setConsultationComplete,
    setPrescriptionReady,
    setSafetyStop,
    resetConsultation,
  } = useDoctorConsultationStore();

  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const waitingForFollowupRef = useRef<string | null>(null);
  const lastQuestionKeyRef = useRef<string | null>(null);
  const initializationRef = useRef(false);

  const {
    messages,
    inputValue,
    setInputValue,
    sendUserMessage,
    sendAIMessage,
    initializeMessages,
    clearMessages,
  } = useChat({ autoInitialize: false });

  // Get question context for formatting (defined before use in initialization effect)
  const getQuestionContext = useCallback((): QuestionContext => {
    const primarySymptom = getPrimarySymptom(selectedSymptoms);
    return {
      primarySymptom,
      allergies: medicalData?.allergies,
      chronicConditions: medicalData?.chronicConditions,
      medications: [], // Could be extracted from consultation answers
      sex: medicalData?.sex,
      selectedSymptoms,
    };
  }, [selectedSymptoms, medicalData]);

  // Initialize consultation on mount - only once per component mount
  useEffect(() => {
    // Use ref to ensure we only initialize once, even if effect re-runs
    if (!initializationRef.current && selectedCategory) {
      initializationRef.current = true;

      // Clear any existing messages from previous chat (Medical Profile)
      // Use a small delay to ensure this happens before initialization
      clearMessages();
      resetConsultation();
      setIsInitialized(true);

      // Format welcome message
      const doctorName = selectedDoctor
        ? `Dr. ${selectedDoctor.name}`
        : "Dr. [Name]";
      const hasMedicalProfile = !!medicalData;
      const welcomeText = hasMedicalProfile
        ? `Hello, I'm ${doctorName}. I've reviewed your medical profile and the symptoms you've reported. I'd like to ask you a few questions to better understand your condition and provide the best treatment plan for you. Let's start.`
        : `Hello, I'm ${doctorName}. I've reviewed the symptoms you've reported. I'd like to ask you a few questions to better understand your condition and provide the best treatment plan for you. Let's start.`;

      // Initialize messages after a brief delay to ensure clearMessages has completed
      setTimeout(() => {
        const welcomeMessage: Message = {
          type: "ai",
          text: welcomeText,
          sender: doctorName,
          timestamp: new Date(),
        };
        initializeMessages([welcomeMessage]);

        // Ask first question after delay
        setTimeout(() => {
          setCurrentPhase("initial");
          const context = getQuestionContext();
          const firstQuestion = PHASE_1_QUESTIONS[0];
          const formattedText = formatQuestionText(firstQuestion, context);

          // Determine options
          let options: string[] | undefined;
          if (firstQuestion.type === "yes_no") {
            options = ["Yes", "No"];
          } else if (
            firstQuestion.type === "multiple_choice" &&
            firstQuestion.options
          ) {
            options = firstQuestion.options;
          }

          sendAIMessage(formattedText, doctorName, options);
          setIsWaitingForAnswer(true);
          lastQuestionKeyRef.current = firstQuestion.key;
        }, 1000);
      }, 50); // Small delay to ensure clearMessages completes
    }

    // Cleanup: reset initialization ref when component unmounts
    return () => {
      initializationRef.current = false;
    };
  }, [selectedCategory]); // Only depend on selectedCategory to prevent re-runs

  // Ask a question
  const askQuestion = useCallback(
    (question: DoctorChatQuestion) => {
      const context = getQuestionContext();
      const formattedText = formatQuestionText(question, context);

      // Determine options based on question type
      let options: string[] | undefined;

      if (question.type === "yes_no") {
        options = ["Yes", "No"];
      } else if (question.type === "multiple_choice" && question.options) {
        options = question.options;
      }

      sendAIMessage(
        formattedText,
        selectedDoctor?.name || "Dr. [Name]",
        options,
      );
      setIsWaitingForAnswer(true);
      lastQuestionKeyRef.current = question.key;
    },
    [getQuestionContext, sendAIMessage, selectedDoctor],
  );

  // Process answer
  const processAnswer = useCallback(
    (answer: string, question: DoctorChatQuestion) => {
      // Store answer first (will be updated if follow-up)
      let answerToStore = answer;

      // Handle follow-up questions
      if (waitingForFollowupRef.current) {
        // This is a follow-up answer
        const parentKey = waitingForFollowupRef.current;
        const followupKey = `${parentKey}_details`;
        setConsultationAnswer(followupKey, answer);
        waitingForFollowupRef.current = null;
        // Check safety stops after storing answer
        const updatedAnswers = {
          ...consultationAnswers,
          [followupKey]: answer,
        };
        const safetyStop = checkSafetyStops(answer, updatedAnswers);
        if (safetyStop) {
          setSafetyStop(true, safetyStop.message);
          sendAIMessage(
            safetyStop.message,
            selectedDoctor?.name || "Dr. [Name]",
          );
        }
        return; // Will advance to next question below
      }

      // Process based on question type
      let storedValue: string | string[] = answer;

      if (question.type === "yes_no") {
        const isYes =
          /^(yes|y|true|1)$/i.test(answer.trim()) ||
          answer.toLowerCase().includes("yes");
        storedValue = isYes ? "Yes" : "No";
        setConsultationAnswer(question.key, storedValue);
      } else if (question.type === "yes_no_with_followup") {
        const isYes =
          /^(yes|y|true|1)$/i.test(answer.trim()) ||
          answer.toLowerCase().includes("yes");

        if (isYes && question.followup) {
          // Store the yes answer first
          setConsultationAnswer(question.key, "Yes");
          // Ask follow-up
          waitingForFollowupRef.current = question.key;
          const context = getQuestionContext();
          const formattedFollowup = formatQuestionText(
            { ...question, text: question.followup },
            context,
          );
          sendAIMessage(
            formattedFollowup,
            selectedDoctor?.name || "Dr. [Name]",
          );
          setIsWaitingForAnswer(true);
          // Check safety stops
          const updatedAnswers = {
            ...consultationAnswers,
            [question.key]: "Yes",
          };
          const safetyStop = checkSafetyStops(answer, updatedAnswers);
          if (safetyStop) {
            setSafetyStop(true, safetyStop.message);
            sendAIMessage(
              safetyStop.message,
              selectedDoctor?.name || "Dr. [Name]",
            );
          }
          return; // Don't advance yet
        } else {
          // No follow-up needed
          storedValue = isYes ? "Yes" : "No";
          setConsultationAnswer(question.key, storedValue);
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

          storedValue = finalOptions;
          setConsultationAnswer(question.key, storedValue);
        } else {
          // Single selection
          const lowerAnswer = answer.toLowerCase();
          const matchedOption = question.options?.find((opt) =>
            lowerAnswer.includes(opt.toLowerCase()),
          );
          storedValue = matchedOption || answer;
          setConsultationAnswer(question.key, storedValue);
        }
      } else {
        // Text input
        setConsultationAnswer(question.key, answer);
        storedValue = answer;
      }

      // Check safety stops after storing answer
      const updatedAnswers = {
        ...consultationAnswers,
        [question.key]: storedValue,
      };
      const safetyStop = checkSafetyStops(answer, updatedAnswers);
      if (safetyStop) {
        setSafetyStop(true, safetyStop.message);
        sendAIMessage(safetyStop.message, selectedDoctor?.name || "Dr. [Name]");
      }
    },
    [
      consultationAnswers,
      setConsultationAnswer,
      setSafetyStop,
      sendAIMessage,
      selectedDoctor,
      getQuestionContext,
    ],
  );

  // Advance to next question
  const advanceToNextQuestion = useCallback(() => {
    if (currentPhase === "initial") {
      // Phase 1
      if (currentQuestionIndex < PHASE_1_QUESTIONS.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setTimeout(() => {
          askQuestion(PHASE_1_QUESTIONS[nextIndex]);
        }, 500);
      } else {
        // Phase 1 complete
        setPhaseCompleted(1, true);
        setCurrentPhase("category_specific");
        setCurrentQuestionIndex(0);
        setTimeout(() => {
          sendAIMessage(
            "Thank you for that information. Now let me ask you some questions specific to your condition.",
            selectedDoctor?.name || "Dr. [Name]",
          );
          setTimeout(() => {
            if (selectedCategory) {
              const phase2Questions = getPhase2Questions(
                selectedCategory,
                selectedSymptoms,
              );
              if (phase2Questions.length > 0) {
                askQuestion(phase2Questions[0]);
              }
            }
          }, 1000);
        }, 1000);
      }
    } else if (currentPhase === "category_specific" && selectedCategory) {
      // Phase 2
      const phase2Questions = getPhase2Questions(
        selectedCategory,
        selectedSymptoms,
      );
      if (currentQuestionIndex < phase2Questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setTimeout(() => {
          askQuestion(phase2Questions[nextIndex]);
        }, 500);
      } else {
        // Phase 2 complete
        setPhaseCompleted(2, true);

        // Check if Phase 3 is needed
        const phase3Questions = getPhase3Questions(
          medicalData,
          consultationAnswers,
        );
        if (phase3Questions.length > 0) {
          setCurrentPhase("medical_review");
          setCurrentQuestionIndex(0);
          setTimeout(() => {
            sendAIMessage(
              "I have a good understanding of your symptoms. Let me review a few things from your medical history.",
              selectedDoctor?.name || "Dr. [Name]",
            );
            setTimeout(() => {
              askQuestion(phase3Questions[0]);
            }, 1000);
          }, 1000);
        } else {
          // Skip Phase 3, go to Phase 4
          setCurrentPhase("final");
          setCurrentQuestionIndex(0);
          setTimeout(() => {
            sendAIMessage(
              "I have all the information I need. Let me ask a couple final questions.",
              selectedDoctor?.name || "Dr. [Name]",
            );
            setTimeout(() => {
              askQuestion(PHASE_4_QUESTIONS[0]);
            }, 1000);
          }, 1000);
        }
      }
    } else if (currentPhase === "medical_review") {
      // Phase 3
      const phase3Questions = getPhase3Questions(
        medicalData,
        consultationAnswers,
      );
      if (currentQuestionIndex < phase3Questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setTimeout(() => {
          askQuestion(phase3Questions[nextIndex]);
        }, 500);
      } else {
        // Phase 3 complete
        setPhaseCompleted(3, true);
        setCurrentPhase("final");
        setCurrentQuestionIndex(0);
        setTimeout(() => {
          sendAIMessage(
            "Perfect. I have all the information I need. Let me ask a couple final questions.",
            selectedDoctor?.name || "Dr. [Name]",
          );
          setTimeout(() => {
            askQuestion(PHASE_4_QUESTIONS[0]);
          }, 1000);
        }, 1000);
      }
    } else if (currentPhase === "final") {
      // Phase 4
      if (currentQuestionIndex < PHASE_4_QUESTIONS.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setTimeout(() => {
          askQuestion(PHASE_4_QUESTIONS[nextIndex]);
        }, 500);
      } else {
        // Phase 4 complete
        setPhaseCompleted(4, true);
        setCurrentPhase("complete");
        setIsWaitingForAnswer(false);
        setConsultationComplete(true);

        // Check if prescription is ready (if Q4.3 was answered Yes)
        const prescriptionReadyAnswer =
          consultationAnswers["prescription_ready"];
        if (prescriptionReadyAnswer === "Yes") {
          setPrescriptionReady(true);
        }

        sendAIMessage(
          "Thank you for providing all this information. Based on our consultation, I have a clear understanding of your condition and I'm ready to prepare your treatment plan. You can review the consultation summary on the right, and when you're ready, I'll prepare your prescription.",
          selectedDoctor?.name || "Dr. [Name]",
          undefined,
          undefined,
          "View Your Prescription",
          ROUTES.PRESCRIPTION,
        );
      }
    }
  }, [
    currentPhase,
    currentQuestionIndex,
    selectedCategory,
    selectedSymptoms,
    medicalData,
    consultationAnswers,
    askQuestion,
    sendAIMessage,
    selectedDoctor,
    setCurrentPhase,
    setCurrentQuestionIndex,
    setPhaseCompleted,
    setConsultationComplete,
    setPrescriptionReady,
  ]);

  // Handle sending message
  const handleSendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !isWaitingForAnswer) return;

      sendUserMessage(text);

      // Determine which question we're answering
      let currentQuestion: DoctorChatQuestion | null = null;

      if (waitingForFollowupRef.current) {
        // Answering a follow-up
        const phase =
          currentPhase === "initial"
            ? PHASE_1_QUESTIONS
            : currentPhase === "category_specific" && selectedCategory
              ? getPhase2Questions(selectedCategory, selectedSymptoms)
              : currentPhase === "medical_review"
                ? getPhase3Questions(medicalData, consultationAnswers)
                : currentPhase === "final"
                  ? PHASE_4_QUESTIONS
                  : [];
        currentQuestion =
          phase.find((q) => q.key === waitingForFollowupRef.current) || null;
      } else {
        // Answering current question
        if (currentPhase === "initial") {
          currentQuestion = PHASE_1_QUESTIONS[currentQuestionIndex];
        } else if (currentPhase === "category_specific" && selectedCategory) {
          const phase2Questions = getPhase2Questions(
            selectedCategory,
            selectedSymptoms,
          );
          currentQuestion = phase2Questions[currentQuestionIndex];
        } else if (currentPhase === "medical_review") {
          const phase3Questions = getPhase3Questions(
            medicalData,
            consultationAnswers,
          );
          currentQuestion = phase3Questions[currentQuestionIndex];
        } else if (currentPhase === "final") {
          currentQuestion = PHASE_4_QUESTIONS[currentQuestionIndex];
        }
      }

      if (currentQuestion) {
        const wasWaitingForFollowup = !!waitingForFollowupRef.current;
        processAnswer(text, currentQuestion);

        // If we were waiting for follow-up and now it's processed, advance
        // Otherwise, if not waiting for follow-up, advance normally
        if (wasWaitingForFollowup && !waitingForFollowupRef.current) {
          // Follow-up was just processed, advance to next question
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
        // If still waiting for follow-up, don't advance yet
      }

      setInputValue("");
    },
    [
      isWaitingForAnswer,
      currentPhase,
      currentQuestionIndex,
      selectedCategory,
      selectedSymptoms,
      medicalData,
      consultationAnswers,
      sendUserMessage,
      processAnswer,
      advanceToNextQuestion,
      setInputValue,
    ],
  );

  // Get current question
  const getCurrentQuestion = (): DoctorChatQuestion | null => {
    if (waitingForFollowupRef.current) {
      const phase =
        currentPhase === "initial"
          ? PHASE_1_QUESTIONS
          : currentPhase === "category_specific" && selectedCategory
            ? getPhase2Questions(selectedCategory, selectedSymptoms)
            : currentPhase === "medical_review"
              ? getPhase3Questions(medicalData, consultationAnswers)
              : currentPhase === "final"
                ? PHASE_4_QUESTIONS
                : [];
      return phase.find((q) => q.key === waitingForFollowupRef.current) || null;
    }

    if (currentPhase === "initial") {
      return PHASE_1_QUESTIONS[currentQuestionIndex] || null;
    } else if (currentPhase === "category_specific" && selectedCategory) {
      const phase2Questions = getPhase2Questions(
        selectedCategory,
        selectedSymptoms,
      );
      return phase2Questions[currentQuestionIndex] || null;
    } else if (currentPhase === "medical_review") {
      const phase3Questions = getPhase3Questions(
        medicalData,
        consultationAnswers,
      );
      return phase3Questions[currentQuestionIndex] || null;
    } else if (currentPhase === "final") {
      return PHASE_4_QUESTIONS[currentQuestionIndex] || null;
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
    phase1Completed,
    phase2Completed,
    phase3Completed,
    phase4Completed,
    consultationComplete,
    prescriptionReady,
    safetyStopTriggered,
    safetyStopMessage,
  };
}
