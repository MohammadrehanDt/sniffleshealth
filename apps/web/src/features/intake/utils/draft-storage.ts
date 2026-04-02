import type { IntakeFormData } from "../schemas/intake.schema";

const STORAGE_KEY = "sniffles_intake";

export type LocalDraft = {
  step: number;
  data: Partial<IntakeFormData>;
};

export function loadLocalDraft(): LocalDraft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return null;
    }

    return JSON.parse(raw) as LocalDraft;
  } catch {
    return null;
  }
}

export function saveLocalDraft(step: number, data: Partial<IntakeFormData>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
  } catch {
    // Ignore unavailable or full storage.
  }
}

export function clearLocalDraft() {
  sessionStorage.removeItem(STORAGE_KEY);
}
