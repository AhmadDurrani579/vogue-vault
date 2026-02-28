import React from 'react';

interface MemoryItem {
  emoji: string;
  score: string;
  active: boolean;
}

const memories: MemoryItem[] = [
  { emoji: '🧥', score: '94%', active: true },
  { emoji: '🥾', score: '91%', active: true },
  { emoji: '👟', score: '44%', active: false },
  { emoji: '👖', score: '88%', active: true },
  { emoji: '🎽', score: '62%', active: false },
  { emoji: '🧣', score: '79%', active: true },
];

const VisualMemoryPanel: React.FC = () => {
  return (
    <div className="bg-white border border-border1 rounded-xl p-4 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-dark">Matching from style memory</h3>
        <span className="font-mono text-[9px] text-gray2 tracking-widest uppercase">5,284 Looks Indexed</span>
      </div>
      
      <div className="flex gap-1.5">
        {memories.map((m, i) => (
          <div key={i} className={`relative w-11 h-14 rounded-lg border flex items-center justify-center overflow-hidden
            ${m.active ? 'border-gold shadow-[0_0_0_2px_rgba(200,136,42,0.12)]' : 'border-border1 bg-bg2'}`}>
            <span className="text-xl">{m.emoji}</span>
            {m.active && <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent animate-scan z-20" />}
            <div className="absolute bottom-0 left-0 right-0 bg-dark/70 text-white text-[8px] font-bold text-center py-0.5">
              {m.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualMemoryPanel;