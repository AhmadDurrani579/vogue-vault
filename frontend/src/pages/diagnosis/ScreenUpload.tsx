import { useState, useRef, useEffect } from "react";

import NavBar from "../../shared/components/NavBar";
import OccasionSelector from "../../features/upload/components/OccasionSelector";
import RecentDiagnoses from "../../features/upload/components/RecentDiagnoses";
import HeroSection from "../../features/upload/components/HeroSection";
import HowItWorks from "../../features/upload/components/HowItWorks";
import FeatureCards from "../../features/upload/components/FeatureCards";
import StatsRow from "../../features/upload/components/StatsRow";
import ExampleResultCard from "../../features/upload/components/ExampleResultCard";
import type { Occasion, ScreenUploadProps } from "../../types";

const ScreenUpload = ({ onAnalyze, diagnosisTime }: ScreenUploadProps) => {
  const [image, setImage]       = useState<File | null>(null);
  const [preview, setPreview]   = useState<string | null>(null);
  const [occasion, setOccasion] = useState<Occasion>("Casual");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    fetch("https://ahmaddurrani-vogue-vault-api.hf.space/health").catch(() => {});
    const ws = new WebSocket("wss://ahmaddurrani-vogue-vault-api.hf.space/ws");
    ws.onopen = () => {
      console.log("[WS] Pre-warm connected!");
      ws.close();
    };
  }, []);

  <StatsRow diagnosisTime={diagnosisTime} />
  const handleFile = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!image || !preview) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      onAnalyze(base64, occasion, preview);
    };
    reader.readAsDataURL(image);
  };
  return (
    <>
      <NavBar screen="upload" />
      <div className="min-h-screen bg-[#f7f4ef]">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">

          {/* LEFT PANEL */}
          <aside className="bg-white border-r border-[#e2ddd6] min-h-screen flex flex-col gap-5 px-5 pt-6 pb-5">

            {/* Upload Zone */}
            <div className="space-y-2">
              <p className="font-mono text-[9px] tracking-[2.5px] text-[#a8a4ac] uppercase">Your Outfit</p>
              <div
                className={`relative flex flex-col items-center justify-center gap-[10px] h-[230px] rounded-[14px] border-2 border-dashed cursor-pointer transition-all duration-300 group
                  ${preview ? "border-[#c8882a]" : "border-[#d0cbc2] hover:border-[#c8882a] hover:bg-[#fdf6ec]"}`}
                onClick={() => inputRef.current?.click()}
                onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                {preview ? (
                  <img src={preview} alt="outfit preview" className="w-full h-full object-cover rounded-[12px]" />
                ) : (
                  <>
                    <style>{`
                      @keyframes pulseRing {
                        0%   { transform: scale(0.8); opacity: 0.5; }
                        100% { transform: scale(2.2); opacity: 0; }
                      }
                      .ring-1 { animation: pulseRing 2.5s ease-out infinite 0s; }
                      .ring-2 { animation: pulseRing 2.5s ease-out infinite 0.8s; }
                      .ring-3 { animation: pulseRing 2.5s ease-out infinite 1.6s; }
                    `}</style>
                    <div className="relative flex items-center justify-center w-[52px] h-[52px]">
                      <span className="ring-1 absolute w-[52px] h-[52px] rounded-full pointer-events-none" style={{ border: "1.5px solid #c8882a" }} />
                      <span className="ring-2 absolute w-[52px] h-[52px] rounded-full pointer-events-none" style={{ border: "1.5px solid #c8882a" }} />
                      <span className="ring-3 absolute w-[52px] h-[52px] rounded-full pointer-events-none" style={{ border: "1.5px solid #c8882a" }} />
                      <div className="relative z-10 w-[52px] h-[52px] rounded-full bg-white border-2 border-[#e2ddd6] flex items-center justify-center text-[22px] shadow-sm">📸</div>
                    </div>
                    <p className="relative z-10 text-sm font-semibold text-[#1a1820]">Drop your outfit photo</p>
                    <p className="relative z-10 text-[11px] text-[#a8a4ac]">or tap to browse your camera roll</p>
                    <p className="relative z-10 font-mono text-[9px] text-[#d0ccd4] tracking-[2px]">JPG · PNG · WEBP · HEIC</p>
                    <button className="relative z-10 px-5 py-[7px] rounded-[7px] bg-white border border-[#e2ddd6] text-xs font-medium text-[#7a7680]">Browse Files</button>
                  </>
                )}
              </div>
              {preview && (
                <button
                  onClick={() => { setImage(null); setPreview(null); }}
                  className="w-full text-center text-xs text-[#a8a4ac] hover:text-[#c8882a] transition-colors"
                >
                  × Remove photo
                </button>
              )}
            </div>

            <OccasionSelector value={occasion} onChange={setOccasion} />
            <RecentDiagnoses />
            <div className="flex-1" />

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!image}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200
                ${image
                  ? "bg-[#1a1820] text-white hover:bg-[#c8882a] shadow-lg cursor-pointer"
                  : "bg-[#e2ddd6] text-[#a8a4ac] cursor-not-allowed"}`}
            >
              {image ? "✨ Analyse My Outfit" : "Upload a photo first"}
            </button>

            <div className="flex items-center justify-center gap-4">
              {["Free to use", "No signup needed", "Results in ~10s"].map((t) => (
                <span key={t} className="flex items-center gap-[5px] text-[11px] text-[#a8a4ac]">
                  <span className="w-1 h-1 rounded-full bg-[#2a9868] inline-block" />
                  {t}
                </span>
              ))}
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <main className="bg-[#f7f4ef] px-14 pt-10 pb-8 flex flex-col gap-10 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(200,136,42,0.05) 0%, transparent 65%)" }} />
            <HeroSection />
            <HowItWorks />
            <FeatureCards />
            <StatsRow />
            <ExampleResultCard />
          </main>
        </div>
      </div>
    </>
  );
};
export default ScreenUpload;