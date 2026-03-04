// ─────────────────────────────────────────
// types.ts — Shared TypeScript interfaces
// src/types/index.ts
// ─────────────────────────────────────────

// ── Screens ───────────────────────────────
export type Screen = "upload" | "analyzing" | "results";

// ── Occasion ──────────────────────────────
export type Occasion = "Casual" | "Date" | "Work" | "Party";

// ── WebSocket Message Types ───────────────
export type WSMessageType = "analyze";

export interface WSOutgoingMessage {
  type:     WSMessageType;
  image:    string;         // base64
  occasion: string;
}



export interface WSIncomingMessage {
  type?:    "complete" | "error";
  step?:    number;
  status?:  StepStatus;
  label?:   string;
  detail?:  string;
  garments?: DetectedGarment[];
  matches?:  SimilarOutfit[];
  verdict?:  Verdict;
  message?:  string;        // error message
}

// ── Pipeline Steps ────────────────────────
export type StepStatus = "waiting" | "active" | "done";

export interface PipelineStep {
  step:    number;
  status:  StepStatus;
  label:   string;
  detail?: string;
}

// ── Garment Detection ─────────────────────
export interface DetectedGarment {
  garment:    string;
  confidence: number;
}

// ── Similar Outfits (pgvector results) ────
export interface SimilarOutfit {
  garments:   string[];
  score:      number;
  tags:       string[];
  similarity: number;
  image_url?: string;
}

// ── OpenAI Verdict ────────────────────────
export interface Verdict {
  score:          number;
  score_with_fix: number;
  summary:        string;
  primary_issue:  string;
  fix:            string;
  rag_insight:    string;
  verified:       boolean;
  corrected?:     boolean;
}

// ── Full Analysis Result ──────────────────
export interface AnalysisResult {
  garments: DetectedGarment[];
  similar:  SimilarOutfit[];
  verdict:  Verdict;
}

// ── Component Props ───────────────────────
export interface ScreenUploadProps {
  onAnalyze: (imageBase64: string, occasion: string, preview: string) => void;
  diagnosisTime?: number | null;
}

export interface ScreenAnalyzingProps {
  steps:             PipelineStep[];
  imagePreview:      string | null;
  detectedGarments?: DetectedGarment[];
  result?:           AnalysisResult | null;
  similarMatches?:   SimilarOutfit[];
}

export interface ScreenResultsProps {
  result:       AnalysisResult;
  imagePreview: string | null;
  onReset:      () => void;
}

export interface OccasionSelectorProps {
  value:    Occasion;
  onChange: (occasion: Occasion) => void;
}