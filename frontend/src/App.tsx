import ScreenUpload    from "./pages/diagnosis/ScreenUpload";
import ScreenAnalyzing from "./pages/diagnosis/ScreenAnalyzing";
import ScreenResults   from "./pages/diagnosis/ScreenResults";
import { useAnalysis } from "./hooks/useAnalysis";

function App() {
  const { screen, steps, result, imagePreview, detectedGarments, similarMatches, diagnosisTime, analyze, reset } = useAnalysis();

  console.log("App state:", screen, "similarMatches:", similarMatches.length);

  if (screen === "analyzing") {
    return (
      <ScreenAnalyzing
        steps={steps}
        imagePreview={imagePreview}
        detectedGarments={detectedGarments}
        similarMatches={similarMatches}
        result={result}
      />
    );
  }

  if (screen === "results" && result) {
    return (
      <ScreenResults
        result={result}
        imagePreview={imagePreview}
        onReset={reset}
      />
    );
  }

  return <ScreenUpload onAnalyze={analyze} diagnosisTime={diagnosisTime} />;
}

export default App;