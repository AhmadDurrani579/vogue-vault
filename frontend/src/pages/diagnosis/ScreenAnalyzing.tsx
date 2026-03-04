import React, { useState, useEffect } from 'react';
import { CheckCircle2, Search, Eye, ShieldCheck, PenTool, Circle } from 'lucide-react';
import NavBar from "../../shared/components/NavBar";
import LeftCameraPanel from '../../features/camera/components/LeftCameraPanel';
import VisualMemoryPanel from '../../features/memory/components/VisualMemoryPanel';
import type { PipelineStep, DetectedGarment, AnalysisResult, SimilarOutfit } from "../../types";

interface Props {
  steps:             PipelineStep[];
  imagePreview:      string | null;
  detectedGarments?: DetectedGarment[];
  result?:           AnalysisResult | null;
  similarMatches?:   SimilarOutfit[];
}

const ScreenAnalyzing: React.FC<Props> = ({
  steps, imagePreview, detectedGarments = [], result, similarMatches = []
}) => {
  const [percentage, setPercentage] = useState(0);
  const doneCount = steps.filter(s => s.status === "done").length;

  useEffect(() => {
    const target = Math.round((doneCount / steps.length) * 85);
    const interval = setInterval(() => {
      setPercentage(prev => {
        if (prev >= target) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [doneCount, steps.length]);

  const getStepIcon = (step: number, status: string) => {
    if (status === "done") return <CheckCircle2 size={18} />;
    switch (step) {
      case 1: return <Eye size={18} />;
      case 2: return <Search size={18} />;
      case 3: return <Search size={18} />;
      case 4: return <ShieldCheck size={18} />;
      case 5: return <PenTool size={18} />;
      default: return <Circle size={18} />;
    }
  };

const getStepDescription = (stepNum: number, detail?: string) => {
  switch (stepNum) {
    case 1: return "Our vision AI scanned your photo and identified every garment.";
    case 2: return "Each garment scored on its own — fabric, fit, colour and trend relevance.";
    case 3: return result?.verdict?.summary 
      ?? detail 
      ?? "Generating your style diagnosis...";
    case 4: return result?.verdict?.verified
      ? "Verdict verified — findings confirmed accurate."
      : detail ?? "Double-checking the diagnosis...";
    case 5: return result?.verdict?.fix
      ?? detail
      ?? "Putting together your full diagnosis and personalised fix list...";
    default: return "Processing...";
  }
};

  return (
    <div className="flex flex-col h-screen w-full bg-[#F2F0EA] font-sans overflow-hidden">
      <NavBar screen="analyzing" />
      <div className="flex flex-1 overflow-hidden">
        <LeftCameraPanel imagePreview={imagePreview} detectedGarments={detectedGarments} result={result} occasion={steps[0]?.detail}/>

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <main className="flex-1 overflow-y-auto px-16 py-12 flex flex-col gap-10">
            <header className="flex flex-col gap-2">
              <h1 className="font-serif text-[42px] leading-tight text-[#1a1820]">
                Reading your <em className="text-[#c8882a] italic">outfit</em>…
              </h1>
              <p className="text-[14px] text-[#a8a4ac] font-medium tracking-tight">
                Here's what our AI is doing right now — step by step
              </p>
            </header>

            <div className="flex flex-col gap-8 relative">
              <div className="absolute left-[23px] top-6 bottom-6 w-px bg-black/5" />

              {steps.map((s) => (
                <div key={s.step} className="flex gap-8 items-start relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all duration-500
                    ${s.status === "done"   ? "bg-[#f1faf4] border-[#d4edda] text-[#28a745]" :
                      s.status === "active" ? "bg-white border-[#c8882a] text-[#c8882a] shadow-lg scale-110" :
                                              "bg-white border-black/5 text-black/10"}`}>
                    {getStepIcon(s.step, s.status)}
                  </div>

                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-3">
                      <p className={`text-[17px] font-bold ${s.status === "waiting" ? "text-black/10" : "text-[#1a1820]"}`}>
                        {s.label}
                      </p>
                      {s.status === "done"   && <span className="text-[10px] font-black text-[#28a745] uppercase tracking-widest">Done</span>}
                      {s.status === "active" && <span className="text-[10px] font-black text-[#c8882a] uppercase tracking-widest animate-pulse">In Progress</span>}
                    </div>

                    {s.status !== "waiting" && (
                      <div className="mt-2 space-y-3">
                        <p className="text-[13px] text-[#a8a4ac] leading-relaxed max-w-2xl">
                          {getStepDescription(s.step, s.detail)}
                        </p>

                        {/* Step 1 — item count */}
                        {s.step === 1 && s.status === "done" && (
                          <div className="flex gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-[#f1faf4] text-[#28a745] text-[10px] font-bold rounded-full border border-[#d4edda]">
                              ● {detectedGarments.length} items detected with {Math.round((detectedGarments[0]?.confidence ?? 0) * 100)}% top confidence
                            </span>
                          </div>
                        )}

                        {/* Step 2 — garment tags green/amber/red */}
                        {s.step === 2 && s.status === "done" && (
                          <div className="flex gap-2 flex-wrap">
                            {detectedGarments.map((g, idx) => {
                              const isIssue = result?.verdict?.primary_issue.toLowerCase().includes(g.garment.toLowerCase());
                              const isGood  = g.confidence >= 0.15;
                              return (
                                <span key={idx} className={`px-3 py-1 text-[10px] font-bold rounded-md border flex items-center gap-1
                                  ${isIssue ? "bg-[#FFF0F0] text-[#D0021B] border-[#FAD7D7]" :
                                    isGood  ? "bg-[#F1FAF4] text-[#28A745] border-[#D4EDDA]" :
                                              "bg-[#FFF8E1] text-[#F57C00] border-[#FFE082]"}`}>
                                  {g.garment} {isIssue ? "✗" : isGood ? "✓" : "!"}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Step 3 — similar count + rag insight */}
                        {s.step === 3 && s.status === "done" && (
                          <div className="flex gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-[#FFF8E1] text-[#F57C00] text-[10px] font-bold rounded-full border border-[#FFE082]">
                              ● {result?.verdict?.rag_insight ?? s.detail ?? `${similarMatches.length} similar outfits found`}
                            </span>
                          </div>
                        )}

                        {/* Step 4 — verified or corrected */}
                        {s.step === 4 && s.status === "done" && (
                          <div className="flex gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-[#f1faf4] text-[#28a745] text-[10px] font-bold rounded-full border border-[#d4edda]">
                              ● {result?.verdict?.verified ? "Verdict verified ✓" : s.detail ?? "Verdict corrected and improved ✓"}
                            </span>
                          </div>
                        )}

                        {/* Step 5 — the fix */}
                        {s.step === 5 && s.status === "done" && (
                          <div className="flex gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-[#FFF0F0] text-[#D0021B] text-[10px] font-bold rounded-full border border-[#FAD7D7]">
                              ● Fix: {result?.verdict?.fix ?? s.detail ?? "Finalising your diagnosis..."}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <VisualMemoryPanel similarMatches={similarMatches} />

            <div className="mt-auto pt-8 border-t border-black/5 flex flex-col items-center gap-4">
              <div className="w-full flex items-center gap-6">
                <div className="flex-1 h-1.5 bg-black/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c8882a] transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="font-mono text-[12px] font-bold text-[#c8882a]">{percentage}%</span>
              </div>
              <div className="text-center">
                <p className="font-serif text-[24px] italic text-[#1a1820]">Putting it all together…</p>
                <p className="text-[12px] text-[#a8a4ac] mt-1 font-medium tracking-tight">
                  Your full diagnosis is almost ready · Usually under 10 seconds
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ScreenAnalyzing;