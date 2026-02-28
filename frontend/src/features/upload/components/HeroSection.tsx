export const HeroSection = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Eyebrow */}
      <p className="font-mono text-[9px] tracking-[3px] text-[#c8882a] uppercase flex items-center gap-2">
        <span className="w-5 h-px bg-[#c8882a] inline-block" />
        AI Fashion Diagnostic
      </p>

      {/* Headline */}
      <h1 className="font-serif text-[52px] font-light leading-[1.1] text-[#1a1820] tracking-tight">
        Get a real<br />
        <em className="text-[#c8882a]" style={{ fontStyle: "italic" }}>honest</em> read<br />
        on your outfit
      </h1>

      {/* Body */}
      <p className="text-[15px] text-[#7a7680] leading-[1.7] max-w-[480px]">
        Upload any photo and our AI tells you{" "}
        <strong className="text-[#2e2c38] font-medium">exactly what's working,</strong>{" "}
        what needs a fix, and the one swap that makes the biggest difference.
      </p>
    </div>
  );
};


export default HeroSection;