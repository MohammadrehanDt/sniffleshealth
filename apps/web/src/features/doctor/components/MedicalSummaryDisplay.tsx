/**
 * MedicalSummaryDisplay - Displays medical data in sidebar
 */

import type { MedicalData } from "@sniffles/types";
import { DataField, Tag } from "@/components/common";

interface MedicalSummaryDisplayProps {
  medicalData: MedicalData | null;
}

export function MedicalSummaryDisplay({
  medicalData,
}: MedicalSummaryDisplayProps) {
  if (!medicalData) return null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-neutral-charcoal text-2xl font-inter font-semibold leading-8">
        Medical Summary
      </h2>

      {/* Personal Details */}
      <div className="flex flex-col gap-2">
        <h3 className="text-text-primary text-base font-inter font-medium">
          Personal Details
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <DataField label="Age" value={medicalData.age || "—"} />
          <DataField label="Weight" value={medicalData.weight || "—"} />
          <DataField label="Sex" value={medicalData.sex || "—"} />
          <DataField label="Height" value={medicalData.height || "—"} />
        </div>
      </div>

      {/* Allergies */}
      {medicalData.allergies && medicalData.allergies.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-text-primary text-base font-inter font-medium">
            Allergies
          </h3>
          <div className="flex flex-col gap-2">
            {medicalData.allergies.map((allergy, idx) => (
              <Tag key={idx} text={allergy} />
            ))}
          </div>
        </div>
      )}

      {/* Chronic Conditions */}
      {medicalData.chronicConditions &&
        medicalData.chronicConditions.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-text-primary text-base font-inter font-medium">
              Chronic Conditions
            </h3>
            <div className="flex flex-col gap-2">
              {medicalData.chronicConditions.map((condition, idx) => (
                <Tag key={idx} text={condition} />
              ))}
            </div>
          </div>
        )}

      {/* Past Surgical History */}
      {medicalData.surgicalHistory &&
        medicalData.surgicalHistory.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-text-primary text-base font-inter font-medium">
              Past Surgical History
            </h3>
            <div className="flex flex-col gap-2">
              {medicalData.surgicalHistory.map((surgery, idx) => (
                <Tag key={idx} text={surgery} />
              ))}
            </div>
          </div>
        )}

      {/* Social History */}
      {medicalData.socialHistory &&
        medicalData.socialHistory.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-text-primary text-base font-inter font-medium">
              Social History
            </h3>
            <p className="text-neutral-dark-gray text-sm font-inter">
              Including smoking, alcohol and illicit drug use
            </p>
            <div className="flex flex-col gap-2">
              {medicalData.socialHistory.map((item, idx) => (
                <Tag
                  key={idx}
                  text={`${item.type}: ${item.level}`}
                />
              ))}
            </div>
          </div>
        )}

      {/* Family History */}
      {medicalData.familyHistory &&
        medicalData.familyHistory.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-text-primary text-base font-inter font-medium">
              Family History
            </h3>
            <p className="text-neutral-dark-gray text-sm font-inter">
              Problems that run in a family like heart disease or other genetic
              issues
            </p>
            <div className="flex flex-col gap-2">
              {medicalData.familyHistory.map((item, idx) => (
                <Tag key={idx} text={item} />
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
