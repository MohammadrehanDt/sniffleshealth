/**
 * Symptom utility functions
 * Maps symptom IDs to names and handles symptom lookups
 */

import { CATEGORY_SYMPTOMS } from "../constants/symptoms";
import type { Symptom } from "@sniffles/types";

/**
 * Get symptom name by ID
 * Searches across all categories to find matching symptom
 */
export function getSymptomName(id: string): string {
  // Search through all categories
  for (const symptoms of Object.values(CATEGORY_SYMPTOMS)) {
    const symptom = symptoms.find((s) => s.id === id);
    if (symptom) {
      return symptom.name;
    }
  }
  
  // Fallback if not found
  return `Symptom ${id}`;
}

/**
 * Get multiple symptoms from IDs
 * Returns array of Symptom objects
 */
export function getSymptomsFromIds(ids: string[]): Symptom[] {
  const symptoms: Symptom[] = [];
  
  for (const id of ids) {
    for (const categorySymptoms of Object.values(CATEGORY_SYMPTOMS)) {
      const symptom = categorySymptoms.find((s) => s.id === id);
      if (symptom) {
        symptoms.push(symptom);
        break;
      }
    }
  }
  
  return symptoms;
}

/**
 * Get symptom names from IDs
 * Returns array of symptom names (strings)
 */
export function getSymptomNamesFromIds(ids: string[]): string[] {
  return ids.map(getSymptomName);
}
