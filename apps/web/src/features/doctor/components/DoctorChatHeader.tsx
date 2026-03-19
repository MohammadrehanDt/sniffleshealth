/**
 * DoctorChatHeader - Header section showing doctor connection status and info
 */

import type { Doctor } from "@sniffles/types";

interface DoctorChatHeaderProps {
  doctor: Doctor | null;
}

export function DoctorChatHeader({ doctor }: DoctorChatHeaderProps) {
  // Format doctor name consistently: "Dr. [Name], [Title]"
  const doctorName = doctor
    ? `Dr. ${doctor.name}, ${doctor.title}`
    : "Dr. [Name], MD";
  const doctorInitials = doctor?.initials || "DR";
  const doctorSpecialty = doctor?.specialty || "General Practice";
  const doctorExperience = doctor?.experience || "12 yrs experience";
  const doctorLocation = doctor?.location || "New York";

  return (
    <div className="border-b border-neutral-gray p-6 flex-shrink-0">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-semantic-success rounded-full w-2 h-2"></div>
          <span className="text-text-secondary text-sm font-inter leading-5 tracking-tight">
            Connected with
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-cyan-lighter flex items-center justify-center flex-shrink-0">
            <span className="text-text-secondary text-base font-inter font-normal leading-6 tracking-body-tight">
              {doctorInitials}
            </span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-text-primary text-base font-inter font-medium leading-6">
              {doctorName}
            </h3>
            <p className="text-neutral-dark-gray text-sm font-inter leading-5 tracking-tight">
              {doctorSpecialty} | {doctorExperience} | {doctorLocation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
