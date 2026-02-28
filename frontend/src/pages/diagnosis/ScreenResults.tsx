import React from 'react';
import NavBar from "../../shared/components/NavBar";
import LeftCameraPanel from '../../features/camera/components/LeftCameraPanel';
import ResultCard from '../../features/memory/components/ResultCard';

// 1. Define the data for the horizontal comparison grid
const comparisonMatches = [
  { id: '1', emoji: '🥾', label: 'Chelsea boot', score: 90, status: 'great' },
  { id: '2', emoji: '🧥', label: 'Ankle boot', score: 88, status: 'great' },
  { id: '3', emoji: '👟', label: 'White trainer', score: 71, status: 'fix' },
  { id: '4', emoji: '🖤', label: 'Dark stack', score: 92, status: 'great' },
  { id: '5', emoji: '👖', label: 'Lighter denim', score: 76, status: 'minor' },
  { id: '6', emoji: '🎽', label: 'Stripe + boot', score: 86, status: 'great' },
  { id: '7', emoji: '👟', label: 'Chunky sole', score: 68, status: 'fix' },
];

const ScreenResults: React.FC = () => {
  return (
    // 2. Use flex-col to stack Nav and Content vertically
    <div className="flex flex-col h-screen w-full bg-[#fcfaf7] font-sans overflow-hidden">
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR: Now stretches correctly under the Nav */}
        <LeftCameraPanel />

        {/* MAIN AREA: Scrollable results */}
        <main className="flex-1 overflow-y-auto px-16 py-12 flex flex-col gap-10">
          
          <section className="max-w-4xl shrink-0">
            <div className="font-mono text-[10px] tracking-[4px] text-gold uppercase mb-4">— AI Diagnosis</div>
            <h1 className="font-serif text-5xl text-dark leading-tight mb-6">
              Almost <em className="text-gold italic">perfect</em> — <br />
              one thing's holding this back
            </h1>
            <p className="text-gray1 text-lg leading-relaxed max-w-2xl">
              Your jacket and tee combination is <strong>genuinely strong right now</strong> — the 90s grunge revival is peaking and you're riding it well.
            </p>
          </section>

          {/* STYLE SCORE BAR */}
          <div className="bg-white border border-border1 rounded-2xl p-8 flex items-center gap-10 shadow-sm shrink-0">
            <span className="font-bold text-sm text-dark shrink-0 tracking-[2px] uppercase">Style Score</span>
            <div className="flex-1 h-2.5 bg-border1 rounded-full overflow-hidden">
              <div className="h-full bg-gold w-[72%] rounded-full shadow-[0_0_10px_rgba(200,136,42,0.3)]" />
            </div>
            <div className="flex items-center gap-4">
              <span className="font-serif text-3xl text-dark">72 <span className="text-gray3 text-xl">/ 100</span></span>
              <span className="bg-greenbg text-green1 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-green1/20 shrink-0 uppercase tracking-tighter">
                ↑ +18 with fix
              </span>
            </div>
          </div>

          {/* FINDINGS SECTION */}
          <section className="flex flex-col gap-2">
            <h3 className="font-mono text-[10px] tracking-[3px] text-gray2 uppercase mb-6 font-semibold">What we found</h3>
            <ResultCard 
              number="1"
              title="Sneakers clash with the rest"
              category="Footwear · Style mismatch · Found in 19/23 similar outfits"
              status="fix"
              statusText="Needs fixing"
              description="White chunky sneakers create a visual disconnect with your dark leather jacket. The big white sole 'floats' under a dark outfit and breaks the silhouette you've built."
              fixTitle="Quick Fix"
              fixDescription="Swap for black Chelsea boots or pointed ankle boots — they maintain the slim silhouette and complete the dark aesthetic."
              points="↑ +18 points · Fixes the main issue"
            />

            <ResultCard 
              number="2"
              title="Denim shade is slightly off"
              category="Bottoms · Colour harmony · Optional improvement"
              status="minor"
              statusText="Minor issue"
              description="The lighter wash competes subtly with your matte black jacket. Not a dealbreaker — but a darker shade would make everything feel intentional."
              fixTitle="Optional Upgrade"
              fixDescription="Try jet black or dark indigo denim to create a cleaner tonal look."
              points="↑ +6 points · Nice but not urgent"
            />
          </section>

          {/* 3. SIMILAR STYLES SECTION (Dynamic & Scrollable) */}
          <section className="border border-border1 rounded-2xl bg-white p-8 shadow-sm shrink-0">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-sm font-bold text-dark mb-1">Similar styles in memory</h3>
                <p className="text-[11px] text-gray2 font-medium">Your outfit was compared against these — the ones with boots score significantly higher</p>
              </div>
              <div className="text-[9px] font-mono tracking-widest text-gray3 uppercase">RAG · 5,284 LOOKS INDEXED</div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {comparisonMatches.map((item) => (
                <div key={item.id} className="min-w-[140px] flex flex-col items-center">
                  <div className={`w-full aspect-[3/4] rounded-xl bg-bg border-2 flex items-center justify-center text-4xl mb-3 
                    ${item.status === 'great' ? 'border-green1/40' : item.status === 'fix' ? 'border-crimson/40' : 'border-amber1/40'}`}>
                    {item.emoji}
                  </div>
                  <div className={`w-full py-1 rounded-md text-[10px] font-bold text-center text-white mb-2
                    ${item.status === 'great' ? 'bg-green1' : item.status === 'fix' ? 'bg-crimson' : 'bg-amber1'}`}>
                    {item.score}pts
                  </div>
                  <span className="text-[10px] text-gray2 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-between pt-10 border-t border-border1 mt-10 pb-12 shrink-0">
            <div className="flex gap-4">
              <button className="bg-gold text-white px-8 py-4 rounded-xl font-bold text-[13px] shadow-lg shadow-gold/25 hover:bg-gold2 transition-all">
                ✨ Fix My Outfit
              </button>
              <button className="bg-white border border-border1 text-dark px-8 py-4 rounded-xl font-bold text-[13px] hover:bg-bg transition-all">
                📸 Upload New Photo
              </button>
            </div>
            <button className="text-gray1 text-[13px] font-semibold hover:text-dark transition-colors flex items-center gap-2">
              🔗 Share Result
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScreenResults;