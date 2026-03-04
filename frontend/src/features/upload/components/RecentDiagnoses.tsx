import { useEffect, useState } from "react";
import { loadDiagnoses } from "../../../utils/storage";
import type { DiagnosisRecord } from "../../../utils/storage";

export const RecentDiagnoses = () => {
  const [items, setItems] = useState<DiagnosisRecord[]>([]);

  useEffect(() => {
    setItems(loadDiagnoses());
  }, []);

  const getLabel = (score: number) =>
    score >= 80 ? "Strong" : score >= 65 ? "1 fix" : "2 fixes";

  const getBg = (score: number) =>
    score >= 80 ? "rgba(42,152,104,0.85)" :
    score >= 65 ? "rgba(200,120,32,0.85)" : "rgba(208,56,72,0.85)";

  return (
    <div className="space-y-2">
      <p className="font-mono text-[9px] tracking-[2.5px] text-[#a8a4ac] uppercase">
        Recent Diagnoses
      </p>

      <div className="grid grid-cols-3 gap-2">
        {items.length > 0 ? items.map((item, i) => (
          <div key={i} className="group relative flex flex-col items-center justify-center aspect-[2/3] rounded-[10px] border border-[#e2ddd6] bg-white overflow-hidden cursor-pointer hover:border-[#c8882a] transition-colors duration-200">
            <img src={item.imagePreview} alt="diagnosis" className="absolute inset-0 w-full h-full object-cover" />
            <span className="absolute top-[6px] right-[6px] bg-[#1a1820] text-white font-serif text-[11px] px-[6px] py-px rounded-[6px] z-10">
              {item.score}
            </span>
            <span className="absolute bottom-0 left-0 right-0 py-1 text-center text-[9px] font-semibold text-white z-10" style={{ background: getBg(item.score) }}>
              {getLabel(item.score)}
            </span>
          </div>
        )) : [1, 2, 3].map(i => (
          <div key={i} className="relative flex flex-col items-center justify-center aspect-[2/3] rounded-[10px] border border-dashed border-[#e2ddd6] bg-[#fafaf9]">
            <span className="text-2xl opacity-20">👗</span>
            <span className="text-[8px] text-[#a8a4ac] mt-1">No data</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentDiagnoses;