import React from 'react';

interface Garment {
  code: string;
  name: string;
  status: 'Great' | 'Fix this' | 'Minor';
  type: 'green' | 'red' | 'amber';
}

const garments: Garment[] = [
  { code: 'JKT', name: 'Leather Jacket', status: 'Great', type: 'green' },
  { code: 'SHO', name: 'White Sneakers', status: 'Fix this', type: 'red' },
  { code: 'DNM', name: 'Dark Denim', status: 'Minor', type: 'amber' },
];

const LeftCameraPanel: React.FC = () => {
  return (
    <aside className="w-[300px] bg-white border-r border-border1 flex flex-col p-5 gap-3.5 overflow-hidden h-full">
      <div className="font-mono text-[9px] tracking-[2.5px] text-gray2 uppercase">
        Your Outfit
      </div>

      {/* Outfit Card */}
      <div className="rounded-xl border border-border1 overflow-hidden bg-bg2">
        {/* Figure Area */}
        <div className="h-[210px] bg-gradient-to-br from-[#f0ece8] to-[#e8e4dc] flex items-center justify-center relative">
          {/* SVG Character from your HTML */}
          <svg width="110" height="185" viewBox="0 0 110 190" fill="none">
            <ellipse cx="55" cy="18" rx="16" ry="17" fill="#d8d4ce" stroke="#c8c4be" strokeWidth="1"/>
            <path d="M22 44 L16 132 L94 132 L88 44 L70 38 L55 48 L40 38Z" fill="#2a2838" stroke="#38364a" strokeWidth="1.5"/>
            <path d="M16 132 L19 188 L50 188 L55 158 L60 188 L91 188 L94 132Z" fill="#242840" stroke="#2c3050" strokeWidth="1.5"/>
            {/* ... other paths from your SVG ... */}
          </svg>

          {/* Status Dots - Using your Tailwind colors */}
          <div className="absolute top-[28%] left-[8%] w-6 h-6 aspect-square flex-none rounded-full bg-green1 border-2 border-white flex items-center justify-center text-[12px] font-bold text-white shadow-md">
          ✓
        </div>

        <div className="absolute top-[58%] right-[10%] w-6 h-6 aspect-square flex-none rounded-full bg-amber1 border-2 border-white flex items-center justify-center text-[12px] font-bold text-white shadow-md">
          !
        </div>

        <div className="absolute bottom-[14%] left-[8%] w-6 h-6 aspect-square flex-none rounded-full bg-crimson border-2 border-white flex items-center justify-center text-[12px] font-bold text-white shadow-md">
          ✕
        </div>

          {/* Score Badge */}
          <div className="absolute top-2.5 right-2.5 w-12 h-12 rounded-full bg-dark flex flex-col items-center justify-center border border-border2/20 shadow-lg">
            <div className="font-serif text-[18px] text-gold2 leading-none">72</div>
            <div className="text-[8px] text-gray2 tracking-wider uppercase font-medium">pts</div>
          </div>
        </div>

        {/* Garment List */}
        <div className="p-3 flex flex-col gap-1 border-t border-border1">
          {garments.map((g, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5">
              <div className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-dark text-white tracking-tighter">
                {g.code}
              </div>
              <div className="text-xs font-medium text-dark flex-1">{g.name}</div>
              <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border
                ${g.type === 'green' ? 'bg-greenbg text-green1 border-[#b8e8d0]' : 
                  g.type === 'red' ? 'bg-redbg text-crimson border-[#f4c0c8]' : 
                  'bg-amberbg text-amber1 border-[#f0d0a0]'}`}>
                {g.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Occasion Section */}
      <div className="mt-2">
        <div className="font-mono text-[9px] tracking-[2.5px] text-gray2 uppercase mb-2">Occasion</div>
        <div className="flex gap-1.5">
          {['Casual', 'Date', 'Work', 'Party'].map((occ) => (
            <div key={occ} className={`flex-1 py-1.5 rounded-lg border text-[11px] text-center font-medium transition-colors
              ${occ === 'Casual' ? 'bg-dark text-white border-dark' : 'bg-bg2 text-gray1 border-border1'}`}>
              {occ}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default LeftCameraPanel;