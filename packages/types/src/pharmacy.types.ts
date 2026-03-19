/**
 * Pharmacy-related types
 */

export interface Pharmacy {
  id: string;
  name: string;
  type: string; // e.g., "Pharma", "Retail", "Health"
  address: string;
  distance: string; // e.g., "~ 0.4 miles"
  price: string; // e.g., "$30.5"
  isDefault?: boolean;
}

export interface PrescriptionItem {
  id: string;
  name: string;
  type: "tablets" | "capsules" | "other";
  quantity: string; // e.g., "10 Caps"
}

export interface PharmacyOrder {
  pharmacy: Pharmacy;
  prescriptionItems: PrescriptionItem[];
  totalPrice: string;
  pickupTime?: string; // e.g., "12:00 PM today"
}

