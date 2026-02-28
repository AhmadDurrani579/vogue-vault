import React from 'react';

// Define the shape of a tag
interface Tag {
  type: 'green' | 'red' | 'amber';
  dotColor: string;
  label: string;
}

interface PipelineStepProps {
  icon: string;
  title: string;
  body: string;
  status: 'done' | 'active' | 'wait';
  isVisible: boolean;
  tags?: Tag[];
}

const PipelineStep: React.FC<PipelineStepProps> = ({ icon, title, body, status, tags, isVisible }) => {
    return (
    <div className={`flex gap-0 relative transition-all duration-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="w-[34px] flex flex-col items-center flex-shrink-0 pt-1.5 relative">
        {/* Icon Circle */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 z-10 
          ${status === 'done' ? 'bg-greenbg border-green1' : status === 'active' ? 'bg-goldbg border-gold' : 'bg-white border-border1'}`}>
          {icon}
        </div>
      </div>

      <div className="pb-5.5 pl-4 flex-1">
        <div className="flex items-center gap-2.5 mb-1">
          <div className={`text-sm font-semibold ${status === 'wait' ? 'text-gray2' : 'text-dark'}`}>
            {title}
          </div>
          {status === 'active' && <div className="w-3.5 h-3.5 border-2 border-border1 border-t-gold rounded-full animate-spin-slow" />}
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full 
            ${status === 'active' ? 'bg-goldbg text-amber1' : status === 'done' ? 'bg-greenbg text-green1' : 'bg-bg2 text-gray2'}`}>
            {status === 'active' ? 'In progress…' : status === 'done' ? 'Done' : 'Waiting'}
          </span>
        </div>
        <p className={`text-xs leading-relaxed ${status === 'active' ? 'text-gray2' : 'text-gray1'}`}>
          {body}
        </p>
        
        {tags && (
          <div className="flex gap-1.5 flex-wrap mt-2">
            {tags.map((tag, i) => (
              <span key={i} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-opacity-30
                ${tag.type === 'green' ? 'bg-greenbg text-green1 border-green1' : tag.type === 'red' ? 'bg-redbg text-crimson border-crimson' : 'bg-amberbg text-amber1 border-amber1'}`}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: tag.dotColor }}></span>
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineStep;