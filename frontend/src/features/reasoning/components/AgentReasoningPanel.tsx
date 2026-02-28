// import { useEffect, useRef, useState } from "react";

// const aiLines = [
//   "🔍 Analyzing image... Please wait...",
//   '🧠 Detected: "Red Leather Jacket", "Urban Rebel Chic" (85%)',
//   '📡 Querying Supabase RAG for trend context... "High Contrast Harmony"',
//   '🔥 Critique: "This jacket screams rebel energy — bold, confident, and trend-aligned."'
// ];

// export default function AgentReasoningPanel() {
//   const [visibleLines, setVisibleLines] = useState<string[]>([]);
//   const containerRef = useRef<HTMLDivElement>(null);

//   /* Simulate AI typing */
//   useEffect(() => {
//     let index = 0;

//     const interval = setInterval(() => {
//       if (index < aiLines.length) {
//         setVisibleLines((prev) => [...prev, aiLines[index]]);
//         index++;
//       } else {
//         clearInterval(interval);
//       }
//     }, 900);

//     return () => clearInterval(interval);
//   }, []);

//   /* Auto scroll to bottom */
//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.scrollTop =
//         containerRef.current.scrollHeight;
//     }
//   }, [visibleLines]);

//   return (
//     <div
//       className="
//         relative rounded-3xl px-6 py-6
//         bg-white/[0.03] backdrop-blur-2xl
//         border border-white/15
//         shadow-[0_40px_120px_rgba(0,0,0,0.85)]
//         overflow-hidden
//       "
//     >
//       {/* Top Accent */}
//       <div
//         className="
//           absolute -top-[1px] left-1/4 w-1/2 h-[2px]
//           bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent blur-sm
//         "
//       />

//       {/* Title */}
//       <div className="text-white/80 font-semibold tracking-[0.2em] text-[12px] mb-6">
//         AGENT'S REASONING
//       </div>

//       {/* TREND MATCH (Top Right) */}
//       <div className="absolute top-6 right-6">
//         <div className="relative w-20 h-20">
//           <div className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 blur-md opacity-40" />

//           <div className="relative w-full h-full rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 p-[3px]">
//             <div className="w-full h-full rounded-full bg-[#0a1228] flex flex-col items-center justify-center text-white">
//               <div className="text-base font-bold">92%</div>
//               <div className="text-[8px] tracking-widest text-white/60">
//                 TREND MATCH
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* SCROLLABLE AI TEXT AREA */}
//       <div
//         ref={containerRef}
//         className="
//           pr-28
//           h-[180px]
//           overflow-y-auto
//           space-y-4
//           text-[14px]
//           text-white/75
//           leading-relaxed
//           scrollbar-thin scrollbar-thumb-white/10
//         "
//       >
//         {visibleLines.map((line, index) => (
//           <div
//             key={index}
//             className="animate-fadeIn"
//           >
//             {line}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }