/**
 * Doctor Chat Safety Stops
 * Define safety stop conditions for urgent medical situations
 */

export interface DoctorChatSafetyStop {
  trigger: (
    answer: string,
    consultationAnswers: Record<string, string | string[]>,
  ) => boolean;
  message: string;
  severity: "warning" | "urgent";
}

export const DOCTOR_CHAT_SAFETY_STOPS: DoctorChatSafetyStop[] = [
  {
    trigger: (answer, consultationAnswers) => {
      const severity = consultationAnswers["symptom_severity"];
      if (typeof severity === "string") {
        return (
          severity.includes("9-10") ||
          severity.includes("Very Severe") ||
          severity.includes("Severe")
        );
      }
      return false;
    },
    message:
      "I'm concerned about the severity of your symptoms. While I can still provide a consultation, I strongly recommend seeking immediate medical attention if your symptoms worsen or if you experience any emergency symptoms like difficulty breathing or chest pain.",
    severity: "warning",
  },
  {
    trigger: (answer, consultationAnswers) => {
      // Check for high fever mentions
      const lowerAnswer = answer.toLowerCase();
      const hasFeverMention =
        lowerAnswer.includes("fever") || lowerAnswer.includes("temperature");
      const feverPattern = consultationAnswers["fever_pattern"];

      if (hasFeverMention || feverPattern) {
        // Check for high temperature mentions (>103)
        if (
          lowerAnswer.includes("103") ||
          lowerAnswer.includes("104") ||
          lowerAnswer.includes("105") ||
          lowerAnswer.includes("high fever")
        ) {
          return true;
        }
        // Check if continuous fever is mentioned
        if (
          typeof feverPattern === "string" &&
          feverPattern.toLowerCase().includes("continuous")
        ) {
          return true;
        }
      }
      return false;
    },
    message:
      "A fever above 103°F can be serious. Please monitor your temperature closely and seek immediate medical care if it continues to rise or if you develop other concerning symptoms.",
    severity: "urgent",
  },
  {
    trigger: (answer) => {
      const lowerAnswer = answer.toLowerCase();
      return (
        lowerAnswer.includes("chest pain") ||
        lowerAnswer.includes("chest discomfort") ||
        lowerAnswer.includes("difficulty breathing") ||
        lowerAnswer.includes("shortness of breath") ||
        lowerAnswer.includes("can't breathe") ||
        lowerAnswer.includes("trouble breathing")
      );
    },
    message:
      "Chest pain or difficulty breathing requires immediate medical attention. Please go to your nearest emergency room or call 911.",
    severity: "urgent",
  },
  {
    trigger: (answer, consultationAnswers) => {
      // Check for severe infection signs
      const severity = consultationAnswers["symptom_severity"];
      const skinSpreading = consultationAnswers["skin_spreading"];
      const urinationDiscomfort = consultationAnswers["urination_discomfort"];

      const hasSevereSymptoms =
        (typeof severity === "string" &&
          (severity.includes("Severe") || severity.includes("9-10"))) ||
        (typeof skinSpreading === "string" && skinSpreading === "Yes") ||
        (typeof urinationDiscomfort === "string" &&
          urinationDiscomfort.includes("Severe"));

      if (hasSevereSymptoms) {
        const lowerAnswer = answer.toLowerCase();
        const hasInfectionIndicators =
          lowerAnswer.includes("spreading") ||
          lowerAnswer.includes("worsening") ||
          lowerAnswer.includes("getting worse") ||
          lowerAnswer.includes("infection");

        return hasInfectionIndicators;
      }

      return false;
    },
    message:
      "Your symptoms suggest a potentially serious infection. I recommend seeking in-person medical evaluation today, especially if symptoms are worsening.",
    severity: "urgent",
  },
];

/**
 * Check all safety stops and return the first match
 */
export function checkSafetyStops(
  answer: string,
  consultationAnswers: Record<string, string | string[]>,
): DoctorChatSafetyStop | null {
  for (const stop of DOCTOR_CHAT_SAFETY_STOPS) {
    if (stop.trigger(answer, consultationAnswers)) {
      return stop;
    }
  }
  return null;
}

