export const HowItWorks = () => {
  const steps = [
    { icon: "📸", title: "Upload a photo",  desc: "Any photo of you or your outfit, full body or just the fit" },
    { icon: "🔍", title: "AI reads it",     desc: "Checks every piece against 5,284 current trend looks" },
    { icon: "✨", title: "Get your fix",    desc: "See your score, what's clashing, and exactly what to swap" },
  ];

  return (
    <div className="space-y-4 max-w-[540px]">
      <p className="font-mono text-[9px] tracking-[2.5px] text-[#a8a4ac] uppercase">
        How it works
      </p>

      <div className="flex gap-0">
        {steps.map((step, i) => (
          <div key={i} className="relative flex flex-col flex-1">
            {/* Connector line to next step */}
            {i < steps.length - 1 && (
              <div
                className="absolute bg-[#d0cbc2]"
                style={{ top: 17, left: "calc(50% + 20px)", right: "calc(-50% + 20px)", height: 1 }}
              />
            )}

            {/* Icon */}
            <div className="relative z-10 w-9 h-9 rounded-full bg-white border border-[#e2ddd6] flex items-center justify-center text-base shadow-sm mb-[10px]">
              {step.icon}
            </div>

            <p className="text-[13px] font-semibold text-[#1a1820] mb-1">{step.title}</p>
            <p className="text-[11px] text-[#a8a4ac] leading-[1.5] pr-4">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


export default HowItWorks;