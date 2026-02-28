import React from 'react';

interface ResultCardProps {
  number: string;
  title: string;
  category: string;
  status: 'great' | 'fix' | 'minor';
  statusText: string;
  description: string;
  fixTitle?: string;
  fixDescription?: string;
  points?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  number, title, category, status, statusText, description, fixTitle, fixDescription, points 
}) => {
  const statusColors = {
    great: "border-green1 text-green1 bg-greenbg",
    fix: "border-crimson text-crimson bg-redbg",
    minor: "border-amber1 text-amber1 bg-amberbg"
  };

  return (
    <div className="relative border border-border1 rounded-xl bg-white p-8 mb-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-6">
          <span className="text-gray3 font-serif text-3xl leading-none pt-1">{number}</span>
          <div>
            <h4 className="font-bold text-dark text-xl mb-1">{title}</h4>
            <span className="text-[10px] uppercase tracking-[2px] text-gray2 font-medium">{category}</span>
          </div>
        </div>
        <span className={`text-[9px] font-bold px-4 py-1.5 rounded-full border tracking-wider ${statusColors[status]}`}>
          {statusText.toUpperCase()}
        </span>
      </div>
      
      <p className="text-gray1 text-base leading-relaxed mb-6 pl-12">{description}</p>

      {fixTitle && (
        <div className="ml-12 bg-bg p-5 rounded-lg border border-border1 border-dashed">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">✨</span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-dark">{fixTitle}</span>
          </div>
          <p className="text-sm text-gray1 leading-relaxed">{fixDescription}</p>
          {points && <div className="text-[11px] font-bold text-green1 mt-3 tracking-tight">{points}</div>}
        </div>
      )}
    </div>
  );
};

export default ResultCard;