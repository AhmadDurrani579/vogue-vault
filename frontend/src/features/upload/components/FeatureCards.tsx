export const FeatureCards = () => {
  const features = [
    { icon: "👁",  title: "Every item identified",  desc: "Jacket, tee, denim, shoes — all scanned" },
    { icon: "⚡", title: "Spot what's clashing",   desc: "Know exactly which piece is dragging your score" },
    { icon: "🎯", title: "One specific fix",        desc: "Not vague tips — a real swap that adds points" },
    { icon: "📊", title: "A real score",            desc: "72/100 with +18 if you make the fix" },
  ];

  return (
    <div className="grid grid-cols-4 gap-[10px] max-w-[700px]">
      {features.map((f, i) => (
        <div
          key={i}
          className="bg-white border border-[#e2ddd6] rounded-[12px] p-[14px] flex flex-col gap-2 hover:border-[#e8a840] hover:shadow-[0_4px_16px_rgba(200,136,42,0.08)] transition-all cursor-default"
        >
          <span className="text-xl">{f.icon}</span>
          <p className="text-xs font-medium text-[#1a1820] leading-[1.4]">{f.title}</p>
          <p className="text-[10px] text-[#a8a4ac] leading-[1.4]">{f.desc}</p>
        </div>
      ))}
    </div>
  );
};


export default FeatureCards;