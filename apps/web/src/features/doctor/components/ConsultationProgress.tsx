/**
 * ConsultationProgress - Displays consultation phase progress
 */

interface ConsultationProgressProps {
  phase1Completed: boolean;
  phase2Completed: boolean;
  phase3Completed: boolean;
  phase4Completed: boolean;
}

export function ConsultationProgress({
  phase1Completed,
  phase2Completed,
  phase3Completed,
  phase4Completed,
}: ConsultationProgressProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-text-primary text-base font-inter font-medium">
        Consultation Progress
      </h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              phase1Completed ? "bg-semantic-success" : "bg-neutral-gray"
            }`}
          />
          <span className="text-text-slate text-sm font-inter">
            Phase 1: Initial Assessment
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              phase2Completed ? "bg-semantic-success" : "bg-neutral-gray"
            }`}
          />
          <span className="text-text-slate text-sm font-inter">
            Phase 2: Category-Specific
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              phase3Completed ? "bg-semantic-success" : "bg-neutral-gray"
            }`}
          />
          <span className="text-text-slate text-sm font-inter">
            Phase 3: Medical Review
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              phase4Completed ? "bg-semantic-success" : "bg-neutral-gray"
            }`}
          />
          <span className="text-text-slate text-sm font-inter">
            Phase 4: Final Assessment
          </span>
        </div>
      </div>
    </div>
  );
}
