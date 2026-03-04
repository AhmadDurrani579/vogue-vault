import React from 'react';
import type { DetectedGarment, AnalysisResult } from '../../../types';

interface Props {
  imagePreview?:     string | null;
  detectedGarments?: DetectedGarment[];
  result?:           AnalysisResult | null;
  occasion?:         string;
}

const LeftCameraPanel: React.FC<Props> = ({ 
  imagePreview, detectedGarments = [], result, occasion = "Casual" 
}) => {

  // Build garment rows from real data
  const garmentRows = detectedGarments.slice(0, 4).map(g => {
    const isIssue = result?.verdict?.primary_issue.toLowerCase().includes(g.garment.toLowerCase());
    const isGood  = g.confidence >= 0.15;
    const code    = g.garment.slice(0, 3).toUpperCase();

    return {
      code,
      name:   g.garment.charAt(0).toUpperCase() + g.garment.slice(1),
      status: isIssue ? "Fix this" : isGood ? "Great" : "Minor",
      type:   isIssue ? "red"      : isGood ? "green" : "amber",
    };
  });

  const score = result?.verdict?.score ?? null;

  const scoreColor = score === null ? "#c8882a" :
                     score >= 80   ? "#28a745" :
                     score >= 60   ? "#c8882a" : "#D0021B";

  const occasions = ["Casual", "Date", "Work", "Party"];
  const activeOccasion = occasion.charAt(0).toUpperCase() + occasion.slice(1);

  return (
    <aside className="w-[300px] bg-white border-r border-border1 flex flex-col p-5 gap-3.5 overflow-hidden h-full shrink-0">
      <div className="font-mono text-[9px] tracking-[2.5px] text-gray2 uppercase">
        Your Outfit
      </div>

      {/* Outfit Card */}
      <div className="rounded-xl border border-border1 overflow-hidden bg-bg2">

        {/* Figure Area */}
        <div className="h-[210px] bg-gradient-to-br from-[#f0ece8] to-[#e8e4dc] flex items-center justify-center relative">

          {imagePreview ? (
            <img src={imagePreview} alt="Your outfit" className="w-full h-full object-cover" />
          ) : (
            <svg width="110" height="185" viewBox="0 0 110 190" fill="none">
              <ellipse cx="55" cy="18" rx="16" ry="17" fill="#d8d4ce" stroke="#c8c4be" strokeWidth="1"/>
              <path d="M22 44 L16 132 L94 132 L88 44 L70 38 L55 48 L40 38Z" fill="#2a2838" stroke="#38364a" strokeWidth="1.5"/>
              <path d="M16 132 L19 188 L50 188 L55 158 L60 188 L91 188 L94 132Z" fill="#242840" stroke="#2c3050" strokeWidth="1.5"/>
            </svg>
          )}

          {/* Status dots — show real garment statuses */}
          {garmentRows[0] && (
            <div className={`absolute top-[28%] left-[8%] w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold text-white shadow-md
              ${garmentRows[0].type === "green" ? "bg-[#28a745]" : garmentRows[0].type === "red" ? "bg-[#D0021B]" : "bg-[#c8882a]"}`}>
              {garmentRows[0].type === "green" ? "✓" : garmentRows[0].type === "red" ? "✕" : "!"}
            </div>
          )}
          {garmentRows[1] && (
            <div className={`absolute top-[58%] right-[10%] w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold text-white shadow-md
              ${garmentRows[1].type === "green" ? "bg-[#28a745]" : garmentRows[1].type === "red" ? "bg-[#D0021B]" : "bg-[#c8882a]"}`}>
              {garmentRows[1].type === "green" ? "✓" : garmentRows[1].type === "red" ? "✕" : "!"}
            </div>
          )}
          {garmentRows[2] && (
            <div className={`absolute bottom-[14%] left-[8%] w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold text-white shadow-md
              ${garmentRows[2].type === "green" ? "bg-[#28a745]" : garmentRows[2].type === "red" ? "bg-[#D0021B]" : "bg-[#c8882a]"}`}>
              {garmentRows[2].type === "green" ? "✓" : garmentRows[2].type === "red" ? "✕" : "!"}
            </div>
          )}

          {/* Score Badge — only show when result is ready */}
          {score !== null && (
            <div className="absolute top-2.5 right-2.5 w-12 h-12 rounded-full bg-dark flex flex-col items-center justify-center border border-border2/20 shadow-lg">
              <div className="font-serif text-[18px] leading-none" style={{ color: scoreColor }}>{score}</div>
              <div className="text-[8px] text-gray2 tracking-wider uppercase font-medium">pts</div>
            </div>
          )}

          {/* Scanning animation while analyzing */}
          {!result && imagePreview && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c8882a]/60 to-transparent animate-pulse" />
            </div>
          )}
        </div>

        {/* Garment List */}
        <div className="p-3 flex flex-col gap-1 border-t border-border1">
          {garmentRows.length > 0 ? garmentRows.map((g, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5">
              <div className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-dark text-white tracking-tighter">
                {g.code}
              </div>
              <div className="text-xs font-medium text-dark flex-1">{g.name}</div>
              <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border
                ${g.type === "green" ? "bg-[#f1faf4] text-[#28a745] border-[#b8e8d0]" :
                  g.type === "red"   ? "bg-[#fff0f0] text-[#D0021B] border-[#f4c0c8]" :
                                       "bg-[#fff8e1] text-[#c8882a] border-[#f0d0a0]"}`}>
                {g.status}
              </div>
            </div>
          )) : (
            // Placeholder rows while waiting
            [1,2,3].map(i => (
              <div key={i} className="flex items-center gap-2 py-1.5 animate-pulse">
                <div className="w-8 h-4 rounded bg-gray-200" />
                <div className="flex-1 h-4 rounded bg-gray-100" />
                <div className="w-12 h-4 rounded bg-gray-100" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Occasion */}
      <div className="mt-2">
        <div className="font-mono text-[9px] tracking-[2.5px] text-gray2 uppercase mb-2">Occasion</div>
        <div className="flex gap-1.5">
          {occasions.map((occ) => (
            <div key={occ} className={`flex-1 py-1.5 rounded-lg border text-[11px] text-center font-medium
              ${occ === activeOccasion ? "bg-dark text-white border-dark" : "bg-bg2 text-gray1 border-border1"}`}>
              {occ}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default LeftCameraPanel;