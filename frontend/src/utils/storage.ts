export interface DiagnosisRecord {
  imagePreview: string;
  score:        number;
  fix:          string;
  occasion:     string;
  timestamp:    number;
}

const STORAGE_KEY = "stylecheck_recent";

export const saveDiagnosis = (record: DiagnosisRecord) => {
  try {
    const existing: DiagnosisRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    const updated = [record, ...existing].slice(0, 3);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save diagnosis:", e);
  }
};

export const loadDiagnoses = (): DiagnosisRecord[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch (e) {
    return [];
  }
};