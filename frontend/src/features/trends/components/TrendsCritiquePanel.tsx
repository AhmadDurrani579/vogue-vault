// import sampleImg from "../../../assets/sample-model.jpg";

// const trends = [
//   { name: "NEO", gradient: "from-fuchsia-500 to-cyan-400" },
//   { name: "ECO CHIC", gradient: "from-red-500 to-orange-400" },
//   { name: "DEC", gradient: "from-cyan-400 to-emerald-400" },
//   { name: "RETRO", gradient: "from-purple-500 to-pink-500" },
//   { name: "METAL", gradient: "from-purple-500 to-pink-500" }
// ];

// export default function TrendsCritiquePanel() {
//   return (
//     <div
//       className="
//         relative rounded-3xl
//         px-6 py-4
//         bg-white/[0.03] backdrop-blur-2xl
//         border border-white/15
//         shadow-[0_30px_80px_rgba(0,0,0,0.7)]
//       "
//     >
//       {/* Top Accent */}
//       <div className="absolute -top-[1px] left-1/4 w-1/2 h-[2px]
//         bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent blur-sm" />

//       {/* Title */}
//       <div className="text-white/75 font-medium tracking-[0.10em] text-[10px] mb-3">
//         AI FASHION TRENDS CRITIQUE
//       </div>

//       {/* Scroll Row */}
//       <div
//         className="
//           flex items-center gap-4
//           overflow-x-auto
//           scroll-smooth
//           scrollbar-hide
//         "
//       >
//         {trends.map((trend, index) => (
//           <div
//             key={index}
//             className="flex-shrink-0 flex flex-col items-center w-[70px]"
//           >
//             {/* Avatar */}
//             <div className={`relative rounded-full p-[2px] bg-gradient-to-br ${trend.gradient}`}>
//               <div className="relative rounded-full bg-black/30 p-[2px]">
//                 <img
//                   src={sampleImg}
//                   alt={trend.name}
//                   className="w-10 h-10 rounded-full object-cover"
//                 />

//                 {/* Status Dot */}
//                 <span
//                   className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-br ${trend.gradient} border border-black`}
//                 />
//               </div>
//             </div>

//             {/* Label */}
//             <div className="mt-1 text-[10px] text-white/70 tracking-[0.12em] text-center">
//               {trend.name}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }