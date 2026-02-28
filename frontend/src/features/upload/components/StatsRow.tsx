export const StatsRow = () => {
  const stats = [
    { value: "14,284", label: "Outfits analyzed this week" },
    { value: "5,284",  label: "Trend looks in memory"      },
    { value: "9.2s",   label: "Average diagnosis time"     },
  ];

  return (
    <div className="flex items-center gap-5 px-[18px] py-[14px] bg-white border border-[#e2ddd6] rounded-[12px] max-w-[540px]">
      {stats.map((s, i) => (
        <>
          {i > 0 && <div key={`sep-${i}`} className="w-px h-8 bg-[#e2ddd6]" />}
          <div key={i} className="flex flex-col gap-[2px]">
            <span className="font-serif text-[22px] text-[#1a1820] leading-none">{s.value}</span>
            <span className="text-[10px] text-[#a8a4ac]">{s.label}</span>
          </div>
        </>
      ))}
    </div>
  );
};

export default StatsRow;