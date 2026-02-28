import React from 'react';

interface StyleMatch {
  id: string;
  emoji: string;
  label: string;
  score: number;
  status: 'great' | 'fix' | 'minor';
}

const StyleComparisonGrid: React.FC = () => {
  const matches: StyleMatch[] = [
    { id: '1', emoji: '🥾', label: 'Chelsea boot', score: 90, status: 'great' },
    { id: '2', emoji: '🧥', label: 'Ankle boot', score: 88, status: 'great' },
    { id: '3', emoji: '👟', label: 'White trainer', score: 71, status: 'fix' },
    { id: '4', emoji: '🖤', label: 'Dark stack', score: 92, status: 'great' },
    { id: '5', emoji: '👖', label: 'Lighter denim', score: 76, status: 'minor' },
    { id: '6', emoji: '🎽', label: 'Stripe + boot', score: 86, status: 'great' },
    { id: '7', emoji: '👟', label: 'Chunky sole', score: 68, status: 'fix' },
  ];

  return (
    <div className="border border-border1 rounded-2xl bg-white p-8 mt-10 shadow-sm">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-sm font-bold text-dark mb-1">Similar styles in memory</h3>
          <p className="text-[11px] text-gray2 font-medium">Your outfit was compared against these — the ones with boots score significantly higher</p>
        </div>
        <div className="text-[9px] font-mono tracking-widest text-gray3 uppercase">RAG · 5,284 LOOKS INDEXED</div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {matches.map((item) => (
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
    </div>
  );
};

export default StyleComparisonGrid;