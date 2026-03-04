import type { Screen } from "../../types";

interface Props {
  screen?: Screen;
}

const NavBar = ({ screen = "upload" }: Props) => {

  const steps: { key: Screen; label: string }[] = [
    { key: "upload",    label: "UPLOAD" },
    { key: "analyzing", label: "ANALYZING" },
    { key: "results",   label: "RESULTS" },
  ];

  const getStepColor = (stepKey: Screen) => {
    const order = ["upload", "analyzing", "results"];
    const currentIdx = order.indexOf(screen);
    const stepIdx    = order.indexOf(stepKey);

    if (stepIdx < currentIdx)  return "bg-[#28a745]";  // done — green
    if (stepIdx === currentIdx) return "bg-[#c8882a]";  // active — gold
    return "bg-[#d0cbc2]";                              // waiting — gray
  };

  const getTextColor = (stepKey: Screen) => {
    const order = ["upload", "analyzing", "results"];
    const currentIdx = order.indexOf(screen);
    const stepIdx    = order.indexOf(stepKey);
    return stepIdx <= currentIdx ? "text-[#1a1820]" : "text-[#a8a4ac]";
  };

  return (
    <header className="w-full">

      {/* TOP ROW */}
      <div className="bg-white border-b border-[#e2ddd6]">
        <div className="max-w-7xl mx-auto px-8 h-[54px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-serif text-[22px] tracking-wide">
              <span className="text-[#1a1820]">Style</span>
              <span className="text-[#c8882a]">Check</span>
            </div>
            <div className="h-4 w-px bg-[#d0cbc2]" />
            <span className="text-[11px] text-[#a8a4ac] tracking-wide">
              AI Fashion Diagnostic
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-[18px] py-[7px] rounded-[7px] bg-[#1a1820] text-white text-xs font-medium">
              Diagnosis
            </button>
            <button className="px-[18px] py-[7px] rounded-[7px] border border-[#d0cbc2] text-[#7a7680] text-xs font-medium bg-transparent">
              History
            </button>
          </div>
        </div>
      </div>

      {/* BREADCRUMB ROW */}
      <div className="bg-[#f0ede6] border-b border-[#e2ddd6]">
        <div className="max-w-7xl mx-auto px-8 h-[30px] flex items-center gap-2 font-mono text-[9px] tracking-[2px]">
          {steps.map((step, i) => (
            <div key={step.key} className="flex items-center gap-2">
              <span className={`flex items-center gap-[5px] ${getTextColor(step.key)}`}>
                <span className={`w-[6px] h-[6px] rounded-full inline-block ${getStepColor(step.key)}`} />
                {step.label}
              </span>
              {i < steps.length - 1 && (
                <span className="text-[#d0cbc2] mx-1">›</span>
              )}
            </div>
          ))}
        </div>
      </div>

    </header>
  );
};

export default NavBar;