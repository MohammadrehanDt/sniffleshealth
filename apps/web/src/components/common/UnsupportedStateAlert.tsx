import { AlertTriangle } from "lucide-react";
import { AppModal } from "./AppModal";
import { Button } from "@/components/ui/button";

interface UnsupportedStateAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stateName: string | null;
}

export function UnsupportedStateAlert({
  open,
  onOpenChange,
  stateName,
}: UnsupportedStateAlertProps) {
  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="State Not Yet Available"
      showCloseButton={false}
    >
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
          <AlertTriangle className="h-7 w-7 text-amber-500" />
        </div>
        <p className="text-sm leading-relaxed text-neutral-800">
          {stateName ? (
            <>
              Unfortunately, <strong>{stateName}</strong> is not currently
              serviced by our team. We are actively working on expanding to your
              state. Please check back in a few weeks.
            </>
          ) : (
            <>
              Sniffles Health is currently only available in select US states.
              We could not detect a supported location.
            </>
          )}
        </p>
        <Button
          variant="brand"
          className="mt-2 h-11 w-full rounded-lg font-semibold"
          onClick={() => onOpenChange(false)}
        >
          Got It
        </Button>
      </div>
    </AppModal>
  );
}
