import NavBar from "../../shared/components/NavBar";

import UploadCard from "../../features/upload/components/UploadCard";
import OccasionSelector from "../../features/upload/components/OccasionSelector";
import RecentDiagnoses from "../../features/upload/components/RecentDiagnoses";
import AnalyzeButton from "../../features/upload/components/AnalyzeButton";

import HeroSection from "../../features/upload/components/HeroSection";
import HowItWorks from "../../features/upload/components/HowItWorks";
import FeatureCards from "../../features/upload/components/FeatureCards";
import StatsRow from "../../features/upload/components/StatsRow";
import ExampleResultCard from "../../features/upload/components/ExampleResultCard";

const ScreenUpload = () => {
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-[#f7f4ef]">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">

          {/* ── LEFT PANEL: full white ── */}
          <aside className="bg-white border-r border-[#e2ddd6] min-h-screen flex flex-col gap-5 px-5 pt-6 pb-5">
            <UploadCard />
            <OccasionSelector />
            <RecentDiagnoses />
            <div className="flex-1" />
            <AnalyzeButton />
            <div className="flex items-center justify-center gap-4">
              {["Free to use", "No signup needed", "Results in ~10s"].map((t) => (
                <span key={t} className="flex items-center gap-[5px] text-[11px] text-[#a8a4ac]">
                  <span className="w-1 h-1 rounded-full bg-[#2a9868] inline-block" />
                  {t}
                </span>
              ))}
            </div>
          </aside>

          {/* ── RIGHT PANEL ── */}
          <main className="bg-[#f7f4ef] px-14 pt-10 pb-8 flex flex-col gap-10 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(200,136,42,0.05) 0%, transparent 65%)" }} />
            <HeroSection />
            <HowItWorks />
            <FeatureCards />
            <StatsRow />
            <ExampleResultCard />
          </main>

        </div>
      </div>
    </>
  );
};


export default ScreenUpload;