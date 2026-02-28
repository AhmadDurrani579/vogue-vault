import React, { useState, useEffect } from 'react';
// Corrected the relative path based on your folder structure
import PipelineStep from './PipelineStep';

// Define the interface for our data array
interface StepData {
  id: string;
  icon: string;
  title: string;
  body: string;
  status: 'done' | 'active' | 'wait';
  tags?: { type: 'green' | 'red' | 'amber'; dotColor: string; label: string; }[];
}

const stepsData: StepData[] = [
  {
    id: 'step-1',
    icon: '👁',
    title: "Looking at what you're wearing",
    body: "Our vision AI scanned your photo and identified every garment.",
    status: 'done',
    tags: [{ type: 'green', dotColor: '#2a9868', label: '4 items detected' }]
  },
  {
    id: 'step-2',
    icon: '🔍',
    title: "Checking each piece individually",
    body: "Each garment scored on its own — fabric, fit, and colour.",
    status: 'done',
    tags: [{ type: 'red', dotColor: '#d03848', label: 'Sneakers ✗' }]
  },
  {
    id: 'step-3',
    icon: '🗂',
    title: "Searching 5,284 similar outfits",
    body: "Found matches for your leather jacket combo.",
    status: 'done'
  },
  {
    id: 'step-4',
    icon: '🤔',
    title: "Double-checking the findings",
    body: "AI re-confirmed the primary style clash.",
    status: 'done'
  },
  {
    id: 'step-5',
    icon: '✍',
    title: "Writing your verdict",
    body: "Putting together your full diagnosis...",
    status: 'active'
  }
];

const AnalysisPipeline: React.FC = () => {
  // Tell useState that this is an array of strings
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);

  useEffect(() => {
    stepsData.forEach((step, i) => {
      setTimeout(() => {
        setVisibleSteps((prev) => [...prev, step.id]);
      }, 300 + i * 500);
    });
  }, []);

  return (
    <div className="pipeline">
      {stepsData.map((step) => (
        <PipelineStep 
          key={step.id}
          {...step}
          isVisible={visibleSteps.includes(step.id)}
        />
      ))}
    </div>
  );
};

export default AnalysisPipeline;