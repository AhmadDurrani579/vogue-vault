const NavBar = () => {
  return (
    <header className="w-full">

      {/* ── TOP ROW: pure white background ── */}
      <div className="bg-white border-b border-[#e2ddd6]">
        <div className="max-w-7xl mx-auto px-8 h-[54px] flex items-center justify-between">

          {/* LEFT: Logo + divider + tagline */}
          <div className="flex items-center gap-3">
            <div className="font-serif text-[22px] tracking-wide">
              <span className="text-[#1a1820]">VogueVault </span>
              <span className="text-[#c8882a]">AI</span>
            </div>
            <div className="h-4 w-px bg-[#d0cbc2]" />
            <span className="text-[11px] text-[#a8a4ac] tracking-wide">
              AI Fashion Diagnostic
            </span>
          </div>

          {/* RIGHT: Nav buttons */}
          <div className="flex items-center gap-2">
            <button className="px-[18px] py-[7px] rounded-[7px] bg-[#1a1820] text-white text-xs font-medium">
              Diagnosis
            </button>
            <button className="px-[18px] py-[7px] rounded-[7px] border border-[#d0cbc2] text-[#7a7680] text-xs font-medium bg-transparent">
              History
            </button>
          </div>

        </div>
      </div>

      {/* ── BREADCRUMB ROW: subtle warm beige ── */}
      <div className="bg-[#f0ede6] border-b border-[#e2ddd6]">
        <div className="max-w-7xl mx-auto px-8 h-[30px] flex items-center gap-2 font-mono text-[9px] tracking-[2px] text-[#a8a4ac]">

          {/* Active step */}
          <span className="flex items-center gap-[5px] text-[#1a1820]">
            <span className="w-[6px] h-[6px] rounded-full bg-[#c8882a] inline-block" />
            UPLOAD
          </span>

          <span className="text-[#d0cbc2] mx-1">›</span>

          {/* Idle step */}
          <span className="flex items-center gap-[5px]">
            <span className="w-[6px] h-[6px] rounded-full bg-[#d0cbc2] inline-block" />
            ANALYZING
          </span>

          <span className="text-[#d0cbc2] mx-1">›</span>

          {/* Idle step */}
          <span className="flex items-center gap-[5px]">
            <span className="w-[6px] h-[6px] rounded-full bg-[#d0cbc2] inline-block" />
            RESULTS
          </span>

        </div>
      </div>

    </header>
  );
};

export default NavBar;
