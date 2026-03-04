import React from 'react';
import type { SimilarOutfit } from '../../../types';

interface Props {
  similarMatches?: SimilarOutfit[];
}

const VisualMemoryPanel: React.FC<Props> = ({ similarMatches = [] }) => {
  const items = similarMatches.slice(0, 6);
  const hasData = items.length > 0;

  return (
    <div className="bg-white border border-border1 rounded-xl p-4 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-dark">Matching from style memory</h3>
        <span className="font-mono text-[9px] text-gray2 tracking-widest uppercase">5,000 Looks Indexed</span>
      </div>

      <div className="flex gap-1.5">
        {hasData ? items.map((m, i) => (
          <div key={i} className={`relative w-11 h-14 rounded-lg border overflow-hidden
            ${m.similarity > 0.5 ? 'border-gold shadow-[0_0_0_2px_rgba(200,136,42,0.12)]' : 'border-border1'}`}>
            <img src={m.image_url} alt="match" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-dark/70 text-white text-[8px] font-bold text-center py-0.5">
              {Math.round(m.similarity * 100)}%
            </div>
          </div>
        )) : [1,2,3,4,5,6].map(i => (
          <div key={i} className="relative w-11 h-14 rounded-lg border border-border1 overflow-hidden animate-pulse">
            <div className="w-full h-full bg-gradient-to-br from-[#f0ece8] to-[#e8e4dc]" />
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-dark/10" />
          </div>
        ))}
      </div>

      <p className="text-[10px] text-gray2 mt-1">
        {hasData
          ? "These are the closest matching looks — similarity scores shown"
          : <span className="animate-pulse">Scanning style memory...</span>
        }
      </p>
    </div>
  );
};

export default VisualMemoryPanel;