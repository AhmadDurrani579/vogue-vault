import React from 'react';

interface ResultFindingProps {
  number?: number;
  title: string;
  category: string;
  description: string;
  status: 'critical' | 'minor' | 'great';
  statusText: string;
  fixTitle?: string;
  fixDescription?: string;
  points?: string;
}

const ResultFinding: React.FC<ResultFindingProps> = ({ 
  number, title, category, description, status, statusText, fixTitle, fixDescription, points 
}) => {
  const statusColors = {
    critical: "border-crimson text-crimson bg-redbg",
    minor: "border-amber1 text-amber1 bg-amberbg",
    great: "border-green1 text-green1 bg-greenbg"
  };

  return (
    <div className={`border-l-4 p-6 bg-white rounded-r-xl border-y border-r border-border1 mb-4`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-4">
          {number && <span className="text-gray3 font-serif text-2xl leading-none">{number}</span>}
          <div>
            <h4 className="font-bold text-dark text-lg">{title}</h4>
            <span className="text-[10px] uppercase tracking-widest text-gray2">{category}</span>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${statusColors[status]}`}>
          {statusText.toUpperCase()}
        </span>
      </div>
      
      <p className="text-gray1 text-sm leading-relaxed mb-4">{description}</p>

      {fixTitle && (
        <div className="bg-bg font-sans p-4 rounded-lg border border-border1 border-dashed">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">✨</span>
            <span className="text-xs font-bold uppercase tracking-tight text-dark">{fixTitle}</span>
          </div>
          <p className="text-xs text-gray1">{fixDescription}</p>
          {points && <div className="text-[10px] font-bold text-green1 mt-2">{points}</div>}
        </div>
      )}
    </div>
  );
};

export default ResultFinding;