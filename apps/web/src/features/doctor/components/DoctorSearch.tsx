import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { DoctorList } from "./DoctorList";
import type { Doctor } from "@sniffles/types";
import { FONTS } from "@/constants";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks";

export interface DoctorSearchProps {
  doctors: Doctor[];
  onSearch?: (query: string) => void;
  onDoctorClick?: (doctor: Doctor) => void;
  waitTime?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  className?: string;
  debounceDelay?: number;
}

/**
 * DoctorSearch - Reusable component for searching and displaying doctors
 */
export function DoctorSearch({
  doctors,
  onSearch,
  onDoctorClick,
  waitTime,
  icon,
  placeholder = "Search for a doctor...",
  className,
  debounceDelay = 300,
}: DoctorSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, {
    delay: debounceDelay,
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Call onSearch callback with debounced value
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, onSearch]);

  // Filter doctors based on debounced search query
  const filteredDoctors = debouncedSearchQuery
    ? doctors.filter(
        (doctor) =>
          doctor.name
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          doctor.specialty
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()),
      )
    : doctors;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-white border border-border-medium font-inter rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
        />
      </div>

      {/* Doctor List */}
      <DoctorList
        doctors={filteredDoctors}
        waitTime={waitTime}
        icon={icon}
        onDoctorClick={onDoctorClick}
      />
    </div>
  );
}
