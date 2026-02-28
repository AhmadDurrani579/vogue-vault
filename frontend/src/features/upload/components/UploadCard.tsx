// ─────────────────────────────────────────
// UploadCard.jsx — rings around icon only
// ─────────────────────────────────────────
export const UploadCard = () => {
  return (
    <>
      <style>{`
        @keyframes pulseRing {
          0%   { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0;   }
        }
        .ring-1 { animation: pulseRing 2.5s ease-out infinite 0s;   }
        .ring-2 { animation: pulseRing 2.5s ease-out infinite 0.8s; }
        .ring-3 { animation: pulseRing 2.5s ease-out infinite 1.6s; }
      `}</style>

      <div className="space-y-2">
        <p className="font-mono text-[9px] tracking-[2.5px] text-[#a8a4ac] uppercase">
          Your Outfit
        </p>

        {/* Upload zone — no overflow-hidden so rings don't get clipped at zone level */}
        <div className="
          relative flex flex-col items-center justify-center gap-[10px]
          h-[230px] rounded-[14px]
          bg-white border-2 border-dashed border-[#d0cbc2]
          cursor-pointer
          transition-all duration-300 group
          hover:border-[#c8882a] hover:bg-[#fdf6ec]
        ">

          {/* Faint silhouette */}
          <svg className="absolute opacity-[0.04] pointer-events-none" width="80" height="140" viewBox="0 0 80 140" fill="none">
            <ellipse cx="40" cy="12" rx="12" ry="12" fill="#1a1820"/>
            <path d="M16 30 L10 90 L70 90 L64 30 L52 26 L40 32 L28 26Z" fill="#1a1820"/>
            <path d="M10 90 L14 136 L36 136 L40 110 L44 136 L66 136 L70 90Z" fill="#1a1820"/>
          </svg>

          {/* ✅ Small wrapper — rings are scoped HERE, not the full card */}
          <div className="relative flex items-center justify-center w-[52px] h-[52px]">

            {/* Rings radiate outward from icon center */}
            <span
              className="ring-1 absolute w-[52px] h-[52px] rounded-full pointer-events-none"
              style={{ border: "1.5px solid #c8882a" }}
            />
            <span
              className="ring-2 absolute w-[52px] h-[52px] rounded-full pointer-events-none"
              style={{ border: "1.5px solid #c8882a" }}
            />
            <span
              className="ring-3 absolute w-[52px] h-[52px] rounded-full pointer-events-none"
              style={{ border: "1.5px solid #c8882a" }}
            />

            {/* Camera icon sits above rings */}
            <div className="
              relative z-10
              w-[52px] h-[52px] rounded-full bg-white
              border-2 border-[#e2ddd6]
              flex items-center justify-center text-[22px]
              shadow-sm transition-all duration-300
              group-hover:border-[#c8882a]
              group-hover:shadow-[0_4px_16px_rgba(200,136,42,0.2)]
            ">
              📸
            </div>
          </div>

          {/* Text below icon — rings do NOT affect these */}
          <p className="relative z-10 text-sm font-semibold text-[#1a1820]">
            Drop your outfit photo
          </p>
          <p className="relative z-10 text-[11px] text-[#a8a4ac]">
            or tap to browse your camera roll
          </p>
          <p className="relative z-10 font-mono text-[9px] text-[#d0ccd4] tracking-[2px]">
            JPG · PNG · WEBP · HEIC
          </p>

          <button className="
            relative z-10 px-5 py-[7px] rounded-[7px]
            bg-white border border-[#e2ddd6]
            text-xs font-medium text-[#7a7680]
            cursor-pointer transition-all duration-200
            group-hover:border-[#c8882a] group-hover:text-[#c8882a]
          ">
            Browse Files
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadCard;