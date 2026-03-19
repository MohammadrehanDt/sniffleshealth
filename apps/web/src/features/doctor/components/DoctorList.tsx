import { DoctorCard } from "./DoctorCard";
import type { Doctor } from "@sniffles/types";
import { cn } from "@/lib/utils";

export interface DoctorListProps {
  doctors: Doctor[];
  waitTime?: string;
  icon?: React.ReactNode;
  onDoctorClick?: (doctor: Doctor) => void;
  className?: string;
  cardClassName?: string;
}

/**
 * DoctorList - Reusable component for displaying a list of doctors
 */
export function DoctorList({
  doctors,
  waitTime,
  icon,
  onDoctorClick,
  className,
  cardClassName,
}: DoctorListProps) {
  if (doctors.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-text-light text-sm font-inter">No doctors available</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          waitTime={waitTime}
          icon={icon}
          onClick={onDoctorClick ? () => onDoctorClick(doctor) : undefined}
          className={cardClassName}
        />
      ))}
    </div>
  );
}

