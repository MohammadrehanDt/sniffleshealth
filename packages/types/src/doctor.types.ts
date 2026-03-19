/**
 * Doctor-related types
 */

export interface Doctor {
  id: string;
  name: string;
  title: string; // e.g., "MD"
  specialty: string;
  experience: string; // e.g., "12 yrs experience"
  location: string;
  initials?: string; // For avatar display
  isConnected?: boolean;
}

