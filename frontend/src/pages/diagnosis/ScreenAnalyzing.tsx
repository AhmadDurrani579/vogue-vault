import React, { useState, useEffect } from 'react';
import NavBar from "../../shared/components/NavBar";
import LeftCameraPanel from '../../features/camera/components/LeftCameraPanel';
import AnalysisPipeline from '../../features/reasoning/components/AnalysisPipeline';
import VisualMemoryPanel from '../../features/memory/components/VisualMemoryPanel';

const ScreenAnalyzing: React.FC = () => {
  const [showProgress, setShowProgress] = useState(false);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowProgress(true), 3200);
    
    let interval: ReturnType<typeof setInterval>;
    if (showProgress) {
      interval = setInterval(() => {
        setPercentage((prev) => (prev < 85 ? prev + 1 : prev));
      }, 40);
    }

    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [showProgress]);

  return (
    <div className="flex flex-col h-screen w-full bg-bg font-sans overflow-hidden">
      {/* 1. TOP NAVIGATION */}
      {/* <NavBar /> */}

      {/* 2. BREADCRUMBS BAR */}
       <NavBar />
      {}

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed circles applied here */}
        <LeftCameraPanel />

        {/* Analyzing Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <main className="flex-1 overflow-y-auto px-10 py-8 flex flex-col gap-7">
            <header className="flex flex-col gap-1.5">
              <h1 className="font-serif text-[30px] leading-tight text-dark">
                Reading your <em className="text-gold italic not-underline">outfit</em>…
              </h1>
              <p className="text-[13px] text-gray1">
                Here's exactly what our AI is doing — step by step
              </p>
            </header>

            <AnalysisPipeline />
            <VisualMemoryPanel />

            {/* Progress Bar Section */}
            <div className={`pt-2 border-t border-border1 flex flex-col gap-2.5 transition-opacity duration-500 ${showProgress ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-3.5">
                <div className="flex-1 h-1 bg-border1 rounded-sm overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-gold to-gold2 transition-all duration-300 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-gray2 min-w-[30px]">
                  {percentage}%
                </span>
              </div>
              
              <div className="text-center">
                <div className="font-serif text-xl italic text-dark2">
                  Putting it all together…
                </div>
                <div className="text-xs text-gray2 mt-0.5">
                  Your full diagnosis is almost ready · Usually under 10 seconds
                </div>
              </div>
            </div>
          </main>

          {/* Action Bar */}
          <footer className="h-[50px] bg-white border-t border-border1 flex items-center px-10 gap-1.5 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-gray2">
              <span className="w-1 h-1 rounded-full bg-green1" />
              Usually takes less than 10 seconds
            </div>
            <span className="text-border2 mx-1.5">·</span>
            <div className="flex items-center gap-1.5 text-xs text-gray2">
              <span className="w-1 h-1 rounded-full bg-green1" />
              No signup needed
            </div>
            <span className="text-border2 mx-1.5">·</span>
            <div className="flex items-center gap-1.5 text-xs text-gray2">
              <span className="w-1 h-1 rounded-full bg-green1" />
              Free to use
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ScreenAnalyzing;