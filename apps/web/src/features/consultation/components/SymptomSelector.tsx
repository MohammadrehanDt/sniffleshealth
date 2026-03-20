import { Check } from "lucide-react";
import type { Symptom } from "@sniffles/types";
import { cn } from "@/lib/utils";

export interface SymptomSelectorProps {
  symptoms: Symptom[];
  selectedSymptomIds: string[];
  onToggleSymptom: (symptomId: string) => void;
  title?: string;
  className?: string;
}

/**
 * SymptomSelector - Reusable component for selecting symptoms
 * Displays symptoms as selectable pills/badges
 */
export function SymptomSelector({
  symptoms,
  selectedSymptomIds,
  onToggleSymptom,
  title,
  className,
}: SymptomSelectorProps) {
  return (
    <div className={cn("flex flex-col gap-[19px]", className)}>
      {title && (
        <h2 className="text-text-dark text-xl font-inter font-semibold leading-7">
          {title}
        </h2>
      )}
      <div className="flex flex-wrap items-center gap-6">
        {symptoms.map((symptom) => (
          <SymptomPill
            key={symptom.id}
            name={symptom.name}
            selected={selectedSymptomIds.includes(symptom.id)}
            onClick={() => onToggleSymptom(symptom.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface SymptomPillProps {
  name: string;
  selected: boolean;
  onClick: () => void;
}

function SymptomPill({ name, selected, onClick }: SymptomPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-5 py-5 rounded-2xl border-2 font-inter transition-all",
        selected
          ? "border-brand-cyan bg-white"
          : "border-border-medium bg-white hover:border-brand-cyan/50",
      )}
    >
      {selected && <Check className="w-6 h-6 text-brand-cyan-dark" />}
      <span
        className={cn(
          "text-base",
          selected
            ? "font-semibold text-brand-cyan-dark"
            : "font-medium text-text-secondary",
        )}
      >
        {name}
      </span>
    </button>
  );
}
