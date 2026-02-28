export const ExampleResultCard = () => {
  const items = [
    {
      emoji: "🧥",
      name: "Leather Jacket",
      status: "✓ Great",
      statusClass: "bg-[#f0faf5] text-[#2a9868]",
    },
    {
      emoji: "👟",
      name: "White Sneakers",
      status: "Fix this",
      statusClass: "bg-[#fef2f3] text-[#d03848]",
    },
    {
      emoji: "👖",
      name: "Dark Denim",
      status: "Minor",
      statusClass: "bg-[#fef8f0] text-[#c87820]",
    },
  ];

  return (
    <div className="absolute bottom-8 right-8 w-[280px]">

      {/* Floating "EXAMPLE RESULT" chip on top border */}
      <div className="relative">
        <span className="absolute -top-[11px] left-1/2 -translate-x-1/2 z-10 bg-[#f7f4ef] border border-[#c8882a] rounded-md px-3 py-[3px] font-mono text-[9px] tracking-[2px] text-[#c8882a] whitespace-nowrap">
          EXAMPLE RESULT
        </span>

        {/* Card */}
        <div className="bg-white border border-[#c8882a] rounded-[16px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">

          {/* Label */}
          <p className="font-mono text-[9px] tracking-[2.5px] text-[#a8a4ac] uppercase mb-4">
            What you'll get
          </p>

          {/* Garment rows */}
          <div className="flex flex-col divide-y divide-[#f0ede6]">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-[10px]">
                <span className="text-[22px] w-7 text-center">{item.emoji}</span>
                <span className="flex-1 text-sm font-medium text-[#1a1820]">{item.name}</span>
                <span className={`text-[11px] font-semibold px-3 py-[3px] rounded-lg ${item.statusClass}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-[#f0ede6] mt-2 mb-3" />

          {/* Score row */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[12px] text-[#a8a4ac]">Style Score</p>
              <p className="text-[12px] font-semibold text-[#2a9868] mt-[2px]">
                ↑ +18 with fix
              </p>
            </div>
            {/* Big serif score number */}
            <div className="font-serif text-[#c8882a] leading-none" style={{ fontSize: 52 }}>
              7<sup className="text-[28px]">2</sup>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExampleResultCard;
