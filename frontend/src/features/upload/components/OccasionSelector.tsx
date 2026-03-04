import type { Occasion, OccasionSelectorProps } from "../../../types";

const occasions: Occasion[] = ["Casual", "Date", "Work", "Party"];

const OccasionSelector = ({ value, onChange }: OccasionSelectorProps) => {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[9px] tracking-[2.5px] text-[#a8a4ac] uppercase">
        Occasion
      </p>
      <div className="flex gap-[6px]">
        {occasions.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium border cursor-pointer transition-all duration-200
              ${value === o
                ? "bg-[#1a1820] text-white border-[#1a1820]"
                : "bg-white text-[#7a7680] border-[#e2ddd6] hover:border-[#c8882a] hover:text-[#c8882a]"
              }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
};
export default OccasionSelector;