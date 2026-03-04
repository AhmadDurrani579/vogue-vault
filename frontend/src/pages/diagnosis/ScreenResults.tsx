import React, { useState } from 'react';
import NavBar from "../../shared/components/NavBar";
import LeftCameraPanel from '../../features/camera/components/LeftCameraPanel';
import { Sparkles, ArrowUpCircle, Camera, X, ShoppingBag } from 'lucide-react';
import type { AnalysisResult } from "../../types";

const BACKEND = "https://ahmaddurrani-vogue-vault-api.hf.space";

interface Product {
  name:         string;
  category:     string;
  brand:        string;
  description:  string;
  why:          string;
  price_range:  string;
  amazon_url:   string;
  asos_url:     string;
}

interface Props {
  result:       AnalysisResult;
  imagePreview: string | null;
  onReset:      () => void;
}

const ScreenResults: React.FC<Props> = ({ result, imagePreview, onReset }) => {
  const { verdict, similar, garments } = result;
  const pointsGain = verdict.score_with_fix - verdict.score;

  const [showFix, setShowFix]         = useState(false);
  const [loadingFix, setLoadingFix]   = useState(false);
  const [products, setProducts]       = useState<Product[]>([]);
  const [fixError, setFixError]       = useState<string | null>(null);

  const scoreColor = verdict.score >= 80 ? "#28A745" :
                     verdict.score >= 60 ? "#C5A267" : "#D0021B";

  const headerPrefix = verdict.score >= 80 ? "Looking great —" :
                       verdict.score >= 60 ? "Almost perfect —" : "Needs some work —";

  const handleMagicFix = async () => {
    setShowFix(true);
    if (products.length > 0) return; // already loaded
    setLoadingFix(true);
    setFixError(null);
    try {
      const res = await fetch(`${BACKEND}/magic-fix`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ verdict, garments, occasion: "casual" })
      });
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch (e) {
      setFixError("Failed to load suggestions. Try again.");
    }
    setLoadingFix(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#fcfaf7] font-sans overflow-hidden">
      <NavBar screen="results" />
      <div className="flex flex-1 overflow-hidden">
        <LeftCameraPanel imagePreview={imagePreview} detectedGarments={result.garments} result={result} />

        <main className="flex-1 overflow-y-auto px-12 py-8 flex flex-col gap-8">

          {/* HEADER */}
          <header className="max-w-3xl space-y-2 shrink-0">
            <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#C5A267]">— AI Diagnosis</div>
            <h1 className="font-serif text-[42px] text-[#1a1820] leading-[1.1] tracking-tight">
              {headerPrefix}<br />
              <span style={{ color: scoreColor }} className="italic font-light">
                {verdict.score >= 80 ? "you're nailing it" :
                 verdict.score >= 60 ? "one thing's holding this back" : "a few things to fix"}
              </span>
            </h1>
            <p className="text-[#1a1820]/60 text-base leading-relaxed max-w-xl">
              {verdict.summary} {verdict.rag_insight.replace(/\.+$/, '')}
            </p>
          </header>

          {/* SCORE CARD */}
          <div className="bg-white border border-[#EEEAE5] rounded-2xl p-5 flex items-center gap-8 shadow-sm shrink-0 max-w-4xl">
            <span className="font-bold text-[9px] text-[#1a1820]/40 tracking-[2px] uppercase whitespace-nowrap">Style Score</span>
            <div className="flex-1 h-2 bg-[#EEEAE5] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${verdict.score}%`, backgroundColor: scoreColor }} />
            </div>
            <div className="flex items-center gap-4">
              <span className="font-serif text-3xl font-bold italic text-[#1a1820]">
                {verdict.score} <span className="text-sm opacity-30 font-sans not-italic">/ 100</span>
              </span>
              <div className="bg-[#F1FAF4] text-[#28A745] text-[9px] font-black px-2.5 py-1 rounded-full border border-[#D4EDDA] flex items-center gap-1 uppercase tracking-tighter">
                <ArrowUpCircle size={10} /> +{pointsGain} with fix
              </div>
            </div>
          </div>

          {/* WHAT WE FOUND */}
          <section className="space-y-4 max-w-4xl">
            <h3 className="text-[9px] tracking-[3px] text-[#1a1820]/40 uppercase font-bold">What we found</h3>

            {/* Card 1 — Red */}
            <div className="bg-white rounded-2xl border-l-4 border-[#D0021B] p-6 border border-[#EEEAE5] shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#D0021B] text-white text-[10px] font-black flex items-center justify-center shrink-0">1</span>
                    <h3 className="text-base font-bold text-[#1a1820] tracking-tight">{verdict.primary_issue}</h3>
                  </div>
                  <p className="text-[9px] uppercase tracking-widest font-bold opacity-30 pl-9">
                    Style mismatch · Found in {similar.length} similar outfits
                  </p>
                </div>
                <span className="px-2.5 py-0.5 bg-[#FFF0F0] text-[#D0021B] text-[8px] font-black uppercase rounded-full border border-[#FAD7D7] shrink-0 ml-4">
                  Needs fixing
                </span>
              </div>
              <p className="text-[#1a1820]/60 leading-relaxed pl-9 text-sm">{verdict.rag_insight}</p>
              <div className="bg-[#fcfaf7] rounded-xl p-4 border border-[#EEEAE5] border-dashed ml-9">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-[#C8882A]" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#C8882A]">Quick Fix</span>
                </div>
                <p className="text-xs font-bold text-[#1a1820] mb-1">{verdict.fix}</p>
                <p className="text-[10px] text-[#28A745] font-bold">↑ +{pointsGain} points · Fixes the main issue</p>
              </div>
            </div>

            {/* Card 2 — Amber */}
            <div className="bg-white rounded-2xl border-l-4 border-[#C5A267] p-6 border border-[#EEEAE5] shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#C5A267] text-white text-[10px] font-black flex items-center justify-center shrink-0">2</span>
                    <h3 className="text-base font-bold text-[#1a1820] tracking-tight">Score could be higher</h3>
                  </div>
                  <p className="text-[9px] uppercase tracking-widest font-bold opacity-30 pl-9">
                    Colour harmony · Optional improvement
                  </p>
                </div>
                <span className="px-2.5 py-0.5 bg-[#FFF8E1] text-[#C5A267] text-[8px] font-black uppercase rounded-full border border-[#FFE082] shrink-0 ml-4">
                  Minor issue
                </span>
              </div>
              <p className="text-[#1a1820]/60 leading-relaxed pl-9 text-sm">
                Your current score is {verdict.score}/100. With the fix applied it reaches {verdict.score_with_fix}/100 —
                a difference of +{pointsGain} points. Small adjustments here can push the overall look significantly higher.
              </p>
              <div className="bg-[#fcfaf7] rounded-xl p-4 border border-[#EEEAE5] border-dashed ml-9">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-[#C5A267]" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#C5A267]">Optional Upgrade</span>
                </div>
                <p className="text-xs font-bold text-[#1a1820] mb-1">{verdict.fix}</p>
                <p className="text-[10px] text-[#C5A267] font-bold">↑ +{pointsGain} points · Nice but not urgent</p>
              </div>
            </div>

            {/* Card 3 — Green */}
            <div className="bg-white rounded-2xl border-l-4 border-[#28A745] p-6 border border-[#EEEAE5] shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#28A745] text-white text-[10px] font-black flex items-center justify-center shrink-0">✓</span>
                    <h3 className="text-base font-bold text-[#1a1820] tracking-tight">
                      {garments.slice(0, 2).map(g => g.garment).join(" + ")} combo is working
                    </h3>
                  </div>
                  <p className="text-[9px] uppercase tracking-widest font-bold opacity-30 pl-9">On trend · Keep this</p>
                </div>
                <span className="px-2.5 py-0.5 bg-[#F1FAF4] text-[#28A745] text-[8px] font-black uppercase rounded-full border border-[#D4EDDA] shrink-0 ml-4">
                  Looks great
                </span>
              </div>
              <p className="text-[#1a1820]/60 leading-relaxed pl-9 text-sm">
                {garments.slice(0, 2).map(g => g.garment).join(" and ")} are solid individual pieces.
                Focus the fix on {verdict.primary_issue.toLowerCase()} and this combination will land well.
              </p>
            </div>
          </section>

          {/* SIMILAR STYLES */}
          <section className="space-y-4 pb-28 max-w-4xl">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-xs font-bold text-[#1a1820]">Similar styles in memory</h3>
                <p className="text-[9px] text-[#1a1820]/40 mt-0.5">Your outfit compared against these — ones with the fix score higher</p>
              </div>
              <div className="text-[8px] font-bold tracking-widest text-[#1a1820]/20 uppercase">RAG · 5,000 LOOKS INDEXED</div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {similar.map((item, i) => (
                <div key={i} className="min-w-[130px] group shrink-0">
                  <div className="w-full aspect-[3/4] rounded-xl bg-white border border-[#EEEAE5] overflow-hidden mb-2 transition-transform group-hover:scale-[1.02]">
                    <img src={item.image_url} alt="similar outfit" className="w-full h-full object-cover" />
                  </div>
                  <div className={`w-full py-1 rounded-md text-[9px] font-black text-center text-white
                    ${item.similarity > 0.7 ? "bg-[#28A745]" : item.similarity > 0.5 ? "bg-[#C5A267]" : "bg-[#aaa]"}`}>
                    {Math.round(item.similarity * 100)}pts
                  </div>
                  <p className="text-[9px] text-center text-[#1a1820]/40 mt-1 truncate">
                    {item.garments.slice(0, 2).join(" + ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ACTION BAR */}
          <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EEEAE5] px-12 py-4 flex gap-3 justify-center">
            <button
              onClick={handleMagicFix}
              className="bg-[#C8882A] text-white px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-[#e8a840] transition-all">
              <Sparkles size={12} /> Fix My Outfit
            </button>
            <button onClick={onReset} className="bg-white border border-[#EEEAE5] text-[#1a1820] px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#fcfaf7] transition-all shadow-md">
              <Camera size={12} /> Upload New Photo
            </button>
            <button className="bg-white border border-[#EEEAE5] text-[#1a1820] px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#fcfaf7] transition-all shadow-md">
              🗂 Save to Wardrobe
            </button>
          </footer>
        </main>
      </div>

      {/* MAGIC FIX MODAL */}
      {showFix && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl">

            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-[#EEEAE5] px-8 py-5 flex justify-between items-center rounded-t-3xl">
              <div>
                <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#C5A267]">— AI Recommendations</div>
                <h2 className="font-serif text-2xl text-[#1a1820]">✨ Magic Fix</h2>
              </div>
              <button onClick={() => setShowFix(false)}
                className="w-8 h-8 rounded-full bg-[#f0ece8] flex items-center justify-center hover:bg-[#e2ddd6] transition-colors">
                <X size={14} className="text-[#1a1820]" />
              </button>
            </div>

            <div className="px-8 py-6 space-y-4">
              {loadingFix ? (
                <div className="flex flex-col items-center py-12 gap-4">
                  <div className="animate-spin w-10 h-10 border-2 border-[#c8882a] border-t-transparent rounded-full" />
                  <p className="text-sm text-[#1a1820]/40 font-medium">Finding the best products for you...</p>
                </div>
              ) : fixError ? (
                <div className="text-center py-8">
                  <p className="text-sm text-[#D0021B]">{fixError}</p>
                  <button onClick={handleMagicFix} className="mt-4 text-xs text-[#c8882a] underline">Try again</button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-[#1a1820]/50">
                    Based on your diagnosis — <span className="font-semibold text-[#1a1820]">{verdict.fix}</span>
                  </p>
                  {products.map((p, i) => (
                    <div key={i} className="border border-[#EEEAE5] rounded-2xl p-5 space-y-3 hover:border-[#c8882a]/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <h3 className="font-bold text-[#1a1820] text-sm">{p.name}</h3>
                          <p className="text-[10px] text-[#1a1820]/40">{p.brand} · {p.category}</p>
                        </div>
                        <span className="font-serif text-lg text-[#c8882a] shrink-0 ml-4">{p.price_range}</span>
                      </div>
                      <p className="text-xs text-[#1a1820]/60 leading-relaxed">{p.why}</p>
                      <div className="flex gap-2 pt-1">
                        <a href={p.amazon_url} target="_blank" rel="noreferrer"
                          className="flex-1 py-2.5 text-center text-[10px] font-bold bg-[#FF9900] text-white rounded-xl hover:bg-[#e88800] transition-colors flex items-center justify-center gap-1.5">
                          <ShoppingBag size={11} /> Shop Amazon
                        </a>
                        <a href={p.asos_url} target="_blank" rel="noreferrer"
                          className="flex-1 py-2.5 text-center text-[10px] font-bold bg-[#1a1820] text-white rounded-xl hover:bg-[#c8882a] transition-colors flex items-center justify-center gap-1.5">
                          <ShoppingBag size={11} /> Shop ASOS
                        </a>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenResults;