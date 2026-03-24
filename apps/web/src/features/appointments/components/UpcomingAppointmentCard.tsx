import { Appointment } from "@sniffles/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpcomingAppointmentCardProps {
  appointment: Appointment;
  onReschedule?: () => void;
  onCancel?: () => void;
}

export function UpcomingAppointmentCard({
  appointment,
  onReschedule,
  onCancel,
}: UpcomingAppointmentCardProps) {
  const isConfirmed = appointment.status === "CONFIRMED";
  const statusColor = isConfirmed ? "text-emerald-500" : "text-amber-500";
  const statusDot = isConfirmed ? "bg-emerald-500" : "bg-amber-500";

  return (
    <div className="bg-white rounded-xl border border-neutral-100 p-5 min-w-[320px] flex-1 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-1">
        <span className="text-neutral-400 text-xs font-medium">
          {appointment.id}
        </span>
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", statusDot)} />
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-wide",
              statusColor,
            )}
          >
            {appointment.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="bg-brand-100 p-2 rounded-lg">
          {appointment.type === "VIDEO" ? (
            <Video className="w-5 h-5 text-brand-600" />
          ) : (
            <MessageSquare className="w-5 h-5 text-brand-600" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-neutral-900 font-bold text-sm">
            {appointment.date}, {appointment.time}
          </span>
          <span className="text-neutral-500 text-xs">
            {appointment.reason || "General Discussion"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 border border-neutral-100">
          {appointment.physician.avatar && (
            <AvatarImage
              src={appointment.physician.avatar}
              alt={appointment.physician.name}
            />
          )}
          <AvatarFallback className="bg-brand-100 text-brand-700 text-xs font-bold">
            {appointment.physician.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-neutral-900 font-bold text-sm">
            {appointment.physician.name}
          </span>
          <span className="text-neutral-500 text-xs">
            {appointment.physician.specialty}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2 mt-auto">
        {appointment.status === "CONFIRMED" && appointment.date === "Today" && (
          <Button
            disabled
            size="sm"
            variant="brand"
            className="font-medium px-4 rounded-lg flex-1"
          >
            Join Call
          </Button>
        )}
        <Button
          variant="brand-soft"
          size="sm"
          className="font-medium px-4 rounded-lg flex-1"
          onClick={onReschedule}
        >
          Reschedule
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-semantic-error hover:text-rose-600 hover:bg-rose-50 font-medium px-2 rounded-lg"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
