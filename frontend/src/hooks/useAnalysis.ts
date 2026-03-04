import { useState, useRef, useCallback } from "react";
import type { Screen, PipelineStep, AnalysisResult, WSIncomingMessage, DetectedGarment, SimilarOutfit } from "../types";
import { saveDiagnosis } from "../utils/storage";

const WS_URL     = "wss://ahmaddurrani-vogue-vault-api.hf.space/ws";
const HEALTH_URL = "https://ahmaddurrani-vogue-vault-api.hf.space/health";

const INITIAL_STEPS: PipelineStep[] = [
  { step: 1, status: "waiting", label: "Looking at what you're wearing" },
  { step: 2, status: "waiting", label: "Searching 5,000 similar outfits" },
  { step: 3, status: "waiting", label: "Analysing your outfit" },
  { step: 4, status: "waiting", label: "Double-checking the findings" },
  { step: 5, status: "waiting", label: "Writing your verdict" },
];

export function useAnalysis() {
  const [screen, setScreen]             = useState<Screen>("upload");
  const [steps, setSteps]               = useState<PipelineStep[]>(INITIAL_STEPS);
  const [result, setResult]             = useState<AnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detectedGarments, setDetectedGarments] = useState<DetectedGarment[]>([]);
  const [similarMatches, setSimilarMatches]     = useState<SimilarOutfit[]>([]);
  const [diagnosisTime, setDiagnosisTime]       = useState<number | null>(null);

  const wsRef             = useRef<WebSocket | null>(null);
  const garmentsRef       = useRef<DetectedGarment[]>([]);
  const similarMatchesRef = useRef<SimilarOutfit[]>([]);
  const startTimeRef      = useRef<number>(0);
  const previewRef        = useRef<string>("");
  const occasionRef       = useRef<string>("casual");
  const screenRef         = useRef<Screen>("upload"); // ← fixes stale closure
  const savedRef = useRef<boolean>(false);

  // Always update both state and ref together
  const updateScreen = (s: Screen) => {
    screenRef.current = s;
    setScreen(s);
  };

  const updateStep = (stepNum: number, status: PipelineStep["status"], detail?: string) => {
    setSteps(prev => prev.map(s => s.step === stepNum ? { ...s, status, detail } : s));
  };

  const connectWebSocket = (imageBase64: string, occasion: string) => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    const timeout = setTimeout(() => {
      console.log("[WS] Timeout — reconnecting...");
      ws.close();
      connectWebSocket(imageBase64, occasion);
    }, 12000);

    ws.onopen = () => {
      clearTimeout(timeout);
      console.log("[WS] Connected!");
      ws.send(JSON.stringify({
        type:     "analyze",
        image:    imageBase64,
        occasion: occasion.toLowerCase()
      }));
    };

    ws.onmessage = (event) => {
      clearTimeout(timeout);
      const data: WSIncomingMessage = JSON.parse(event.data);

      if (data.type === "error") { console.error("WS error:", data.message); return; }
      if (data.step)             { updateStep(data.step, data.status!, data.detail); }

      if (data.step === 1 && data.status === "done" && data.garments) {
        garmentsRef.current = data.garments;
        setDetectedGarments(data.garments);
      }

      if (data.step === 2 && data.status === "done" && data.matches) {
        similarMatchesRef.current = data.matches;
        setSimilarMatches(data.matches);
      }

      if (data.type === "complete" && data.verdict) {
        // ← Only save once
        if (!savedRef.current) {
          savedRef.current = true;
          
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          setDiagnosisTime(elapsed);

          saveDiagnosis({
            imagePreview: previewRef.current,
            score:        data.verdict.score,
            fix:          data.verdict.fix,
            occasion:     occasionRef.current,
            timestamp:    Date.now()
          });
        }

        setResult({
          garments: garmentsRef.current,
          similar:  similarMatchesRef.current,
          verdict:  data.verdict!
        });

        setTimeout(() => updateScreen("results"), 2000);
        ws.close();
      }
    };

    ws.onerror = (e) => {
      clearTimeout(timeout);
      console.error("[WS] Error:", e);
    };

    ws.onclose = (event) => {
      clearTimeout(timeout);
      if (event.code !== 1000 && screenRef.current !== "results") {
        // Only reconnect if we have valid image data
        if (!imageBase64 || imageBase64.length < 100) {
          console.log("[WS] No valid image — skipping reconnect");
          return;
        }
        console.log(`[WS] Reconnecting in 2s...`);
        setTimeout(() => connectWebSocket(imageBase64, occasion), 2000);
      }
    };
  };

  const analyze = useCallback(async (imageBase64: string, occasion: string, preview: string) => {
    setImagePreview(preview);
    updateScreen("analyzing");
    setSteps(INITIAL_STEPS);
    setResult(null);
    setDetectedGarments([]);
    setSimilarMatches([]);
    setDiagnosisTime(null);
    garmentsRef.current       = [];
    similarMatchesRef.current = [];
    previewRef.current        = preview;
    occasionRef.current       = occasion;
    startTimeRef.current      = Date.now();
    savedRef.current          = false; 
    try {
      console.log("[WS] Waking up server...");
      await fetch(HEALTH_URL);
      console.log("[WS] Server awake!");
    } catch (e) {
      console.log("[WS] Health check failed — continuing anyway");
    }

    await new Promise(r => setTimeout(r, 800));
    connectWebSocket(imageBase64, occasion);
  }, []);

  const reset = useCallback(() => {
    wsRef.current?.close();
    savedRef.current = false
    updateScreen("upload");
    setSteps(INITIAL_STEPS);
    setResult(null);
    setImagePreview(null);
    setDetectedGarments([]);
    setSimilarMatches([]);
    garmentsRef.current       = [];
    similarMatchesRef.current = [];
  }, []);

  return { screen, steps, result, imagePreview, detectedGarments, similarMatches, diagnosisTime, analyze, reset };
}