import { useEffect, useState } from "react";

interface Props {
  diagnosisTime?: number | null; // in seconds
}

export const StatsRow = ({ diagnosisTime }: Props) => {
  const [avgTime, setAvgTime] = useState<string>("9.2s");

  useEffect(() => {
    if (!diagnosisTime) return;
    try {
      const stored: number[] = JSON.parse(localStorage.getItem("stylecheck_times") ?? "[]");
      const updated = [...stored, diagnosisTime].slice(-10);
      localStorage.setItem("stylecheck_times", JSON.stringify(updated));
      const avg = updated.reduce((a, b) => a + b, 0) / updated.length;
      setAvgTime(`${avg.toFixed(1)}s`);
    } catch (e) {}
  }, [diagnosisTime]);

  useEffect(() => {
    try {
      const stored: number[] = JSON.parse(localStorage.getItem("stylecheck_times") ?? "[]");
      if (stored.length > 0) {
        const avg = stored.reduce((a, b) => a + b, 0) / stored.length;
        setAvgTime(`${avg.toFixed(1)}s`);
      }
    } catch (e) {}
  }, []);

  const stats = [
    { value: "14,284", label: "Outfits analyzed this week" },
    { value: "5,000",  label: "Trend looks in memory"      },
    { value: avgTime,  label: "Average diagnosis time"     },
  ];

  return (
    <div className="flex items-center gap-5 px-[18px] py-[14px] bg-white border border-[#e2ddd6] rounded-[12px] max-w-[540px]">
      {stats.map((s, i) => (
        <div key={i} className="flex items-center gap-5">
          {i > 0 && <div className="w-px h-8 bg-[#e2ddd6]" />}
          <div className="flex flex-col gap-[2px]">
            <span className="font-serif text-[22px] text-[#1a1820] leading-none">{s.value}</span>
            <span className="text-[10px] text-[#a8a4ac]">{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;