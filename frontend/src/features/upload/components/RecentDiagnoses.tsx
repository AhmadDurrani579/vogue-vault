export const RecentDiagnoses = () => {
  const items = [
    { emoji: "🧥", score: 88, label: "Strong",  bg: "rgba(42,152,104,0.85)" },
    { emoji: "👗", score: 72, label: "1 fix",   bg: "rgba(200,120,32,0.85)" },
    { emoji: "🥻", score: 64, label: "2 fixes", bg: "rgba(208,56,72,0.85)"  },
  ];

  return (
    <div className="space-y-2">
      <p className="font-mono text-[9px] tracking-[2.5px] text-[#a8a4ac] uppercase">
        Recent Diagnoses
      </p>

      <div className="grid grid-cols-3 gap-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="
              group
              relative flex flex-col items-center justify-center gap-1
              aspect-[2/3] rounded-[10px]
              border border-[#e2ddd6] bg-white
              overflow-hidden cursor-pointer
              hover:border-gold
              transition-colors duration-200
            "
          >
            {/* Pulse rings — hidden by default, visible on hover */}
            <span className="
              absolute w-[40px] h-[40px] rounded-full
              border-[1.5px] border-gold
              opacity-0
              group-hover:animate-pulse-ring
              pointer-events-none
            " />
            <span className="
              absolute w-[40px] h-[40px] rounded-full
              border-[1.5px] border-gold
              opacity-0
              group-hover:animate-pulse-ring-2
              pointer-events-none
            " />
            <span className="
              absolute w-[40px] h-[40px] rounded-full
              border-[1.5px] border-gold
              opacity-0
              group-hover:animate-pulse-ring-3
              pointer-events-none
            " />

            {/* Emoji — above rings */}
            <span className="relative z-10 text-2xl">{item.emoji}</span>

            {/* Score badge */}
            <span className="
              absolute top-[6px] right-[6px]
              bg-[#1a1820] text-white
              font-serif text-[11px]
              px-[6px] py-px rounded-[6px]
              z-10
            ">
              {item.score}
            </span>

            {/* Status bar */}
            <span
              className="absolute bottom-0 left-0 right-0 py-1 text-center text-[9px] font-semibold text-white z-10"
              style={{ background: item.bg }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RecentDiagnoses;
