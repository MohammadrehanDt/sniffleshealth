import type { MedicalData } from "@sniffles/types";
import { cn } from "@/lib/utils";

export interface MedicalFormProps {
  data: MedicalData;
  className?: string;
  showLabels?: boolean;
}

/**
 * MedicalForm - Reusable component for displaying medical data
 * Shows medical information in a structured grid format
 */
export function MedicalForm({
  data,
  className,
  showLabels = true,
}: MedicalFormProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      <DataField label="Age" value={data.age} showLabel={showLabels} />
      <DataField label="Sex" value={data.sex} showLabel={showLabels} />
      <DataField label="Weight" value={data.weight} showLabel={showLabels} />
      <DataField label="Height" value={data.height} showLabel={showLabels} />
      {data.allergies.length > 0 && (
        <div className="col-span-2">
          <span className="text-text-secondary text-sm font-inter block mb-2">
            Allergies
          </span>
          <div className="flex flex-wrap gap-2">
            {data.allergies.map((allergy, index) => (
              <Tag key={index} text={allergy} />
            ))}
          </div>
        </div>
      )}
      {data.chronicConditions.length > 0 && (
        <div className="col-span-2">
          <span className="text-text-secondary text-sm font-inter block mb-2">
            Chronic Conditions
          </span>
          <div className="flex flex-wrap gap-2">
            {data.chronicConditions.map((condition, index) => (
              <Tag key={index} text={condition} />
            ))}
          </div>
        </div>
      )}
      {data.surgicalHistory.length > 0 && (
        <div className="col-span-2">
          <span className="text-text-secondary text-sm font-inter block mb-2">
            Surgical History
          </span>
          <div className="flex flex-wrap gap-2">
            {data.surgicalHistory.map((surgery, index) => (
              <Tag key={index} text={surgery} />
            ))}
          </div>
        </div>
      )}
      {data.socialHistory.length > 0 && (
        <div className="col-span-2">
          <span className="text-text-secondary text-sm font-inter block mb-2">
            Social History
          </span>
          <div className="flex flex-wrap gap-2">
            {data.socialHistory.map((item, index) => (
              <Tag key={index} text={`${item.type}: ${item.level}`} />
            ))}
          </div>
        </div>
      )}
      {data.familyHistory.length > 0 && (
        <div className="col-span-2">
          <span className="text-text-secondary text-sm font-inter block mb-2">
            Family History
          </span>
          <div className="flex flex-wrap gap-2">
            {data.familyHistory.map((history, index) => (
              <Tag key={index} text={history} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface DataFieldProps {
  label: string;
  value: string;
  showLabel?: boolean;
}

function DataField({ label, value, showLabel = true }: DataFieldProps) {
  return (
    <div className="col-span-1">
      {showLabel && (
        <span className="text-text-secondary text-sm font-inter block mb-1">
          {label}
        </span>
      )}
      <div className="bg-warm-50 rounded-lg px-2 py-1">
        <span className="text-text-primary text-base font-inter">{value}</span>
      </div>
    </div>
  );
}

interface TagProps {
  text: string;
}

function Tag({ text }: TagProps) {
  return (
    <span className="bg-neutral-light-gray border border-transparent rounded-full px-[13px] py-[5px] text-text-slate text-xs font-inter font-medium leading-4">
      {text}
    </span>
  );
}
