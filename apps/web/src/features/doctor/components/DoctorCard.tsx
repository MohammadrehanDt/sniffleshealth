import { cn } from "@/lib/utils";
import type { Doctor } from "@sniffles/types";

export interface DoctorCardProps {
  doctor: Doctor;
  waitTime?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

/**
 * DoctorCard - Reusable component for displaying doctor information
 * Shows doctor avatar, name, specialty, and wait time
 */
export function DoctorCard({
  doctor,
  waitTime,
  icon,
  onClick,
  selected = false,
  className,
}: DoctorCardProps) {
  const initials = doctor.initials || getInitials(doctor.name);

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex-1 bg-white border rounded-xl p-[17px] flex flex-col gap-3 transition-colors",
        selected
          ? "border-brand-cyan border-2 bg-teal-50"
          : "border-border-dark",
        onClick && "cursor-pointer hover:border-brand-cyan",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-border-dark flex items-center justify-center flex-shrink-0">
          <span className="text-text-secondary text-base font-inter font-normal leading-6 tracking-body-tight">
            {initials}
          </span>
        </div>

        {/* Doctor Info */}
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <h3 className="text-text-primary text-base font-inter font-normal truncate leading-6 tracking-body-tight">
            {doctor.name}
          </h3>
          <p className="text-text-light text-sm font-inter font-normal leading-5 tracking-tight">
            {doctor.specialty}
          </p>
        </div>
      </div>

      {/* Wait Time */}
      {waitTime && (
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-text-secondary text-sm font-inter font-normal leading-5 tracking-tight">
            {waitTime}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Helper function to extract initials from a name
 */
function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
