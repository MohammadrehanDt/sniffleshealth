/**
 * DoctorChatOptions - Options display for doctor chat questions
 * Handles single and multiple selection question types
 */

import type { DoctorChatQuestion } from "../constants/doctorChatQuestions";

interface DoctorChatOptionsProps {
  question: DoctorChatQuestion;
  selectedOptions: string[];
  onOptionToggle: (option: string) => void;
  onContinue: () => void;
}

export function DoctorChatOptions({
  question,
  selectedOptions,
  onOptionToggle,
  onContinue,
}: DoctorChatOptionsProps) {
  const isMultipleSelect =
    question.type === "multiple_choice" && question.allowMultiple === true;

  let options: string[] | undefined;
  if (question.type === "yes_no") {
    options = ["Yes", "No"];
  } else if (
    question.type === "multiple_choice" &&
    question.options
  ) {
    options = question.options;
  }

  if (!options || options.length === 0) return null;

  if (isMultipleSelect) {
    return (
      <div className="p-6">
        <div className="max-w-[672px] mx-auto">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3 flex-wrap">
              {options.map((option, index) => {
                const isSelected = selectedOptions.includes(option);
                return (
                  <button
                    key={index}
                    onClick={() => onOptionToggle(option)}
                    className={`border rounded-2xl px-2 py-2 font-inter text-base font-medium leading-6 transition-colors ${
                      isSelected
                        ? "bg-brand-cyan-dark border-brand-cyan-dark text-white"
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
                  onClick={onContinue}
                  className="bg-brand-cyan-dark text-white font-inter rounded-2xl px-6 py-3 font-semibold text-base leading-6 hover:bg-brand-cyan-dark/90 transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Single selection
  return (
    <div className="p-6">
      <div className="max-w-[672px] mx-auto">
        <div className="flex gap-3 flex-wrap">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onOptionToggle(option)}
              className="bg-white border border-border-medium text-text-secondary font-inter text-base font-medium leading-6 rounded-2xl px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
