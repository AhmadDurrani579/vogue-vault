import React from 'react';
import type { SimilarOutfit } from '../../../types';

interface Props {
  similarMatches?: SimilarOutfit[];
}

const VisualMemoryPanel: React.FC<Props> = ({ similarMatches = [] }) => {
    console.log("ScreenAnalyzing similarMatches:", similarMatches.length);
    console.log("First match:", similarMatches[0]);
  // Use real data if available, otherwise show placeholders
  const items = similarMatches.length > 0
    ? similarMatches.slice(0, 6).map(m => ({
        image_url:  m.image_url,
        score:      `${Math.round(m.similarity * 100)}%`,
        active:     m.similarity > 0.5,
        label:      m.garments.slice(0, 1).join(", ")
      }))
    : Array(6).fill({ image_url: null, score: "—", active: false, label: "" });

  return (
    <div className="bg-white border border-border1 rounded-xl p-4 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-dark">Matching from style memory</h3>
        <span className="font-mono text-[9px] text-gray2 tracking-widest uppercase">5,000 Looks Indexed</span>
      </div>
      <div className="flex gap-1.5">
        {items.map((m, i) => (
          <div key={i} className={`relative w-11 h-14 rounded-lg border overflow-hidden flex items-center justify-center
            ${m.active ? 'border-gold shadow-[0_0_0_2px_rgba(200,136,42,0.12)]' : 'border-border1 bg-bg2'}`}>

            {m.image_url ? (
              <img
                src={m.image_url}
                alt="similar outfit"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl">👔</span>
            )}

            {m.active && (
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent z-20" />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-dark/70 text-white text-[8px] font-bold text-center py-0.5">
              {m.score}
            </div>
          </div>
        ))}
      </div>

      {similarMatches.length > 0 && (
        <p className="text-[10px] text-gray2 mt-1">
          These are the closest matching looks — similarity scores shown
        </p>
      )}
    </div>
  );
};

export default VisualMemoryPanel;