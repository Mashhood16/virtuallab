import { useState, useEffect } from 'react';
import { Play, RotateCcw, Activity } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
 onExit?: () => void;
}

const metals = [
 { id: 'mg', name: 'Magnesium', symbol: 'Mg', rate: 0.2, color: '#94a3b8', mm: 24.31, stroke: '#ef4444' },
 { id: 'zn', name: 'Zinc', symbol: 'Zn', rate: 0.05, color: '#cbd5e1', mm: 65.38, stroke: '#22c55e' },
 { id: 'fe', name: 'Iron', symbol: 'Fe', rate: 0.01, color: '#64748b', mm: 55.85, stroke: '#3b82f6' },
 { id: 'cu', name: 'Copper', symbol: 'Cu', rate: 0, color: '#b45309', mm: 63.55, stroke: '#f59e0b' }
];

export default function LabC10MetalReactivity({ onExit }: Props) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [running, setRunning] = useState(false);
 const [time, setTime] = useState(0);
 const [history, setHistory] = useState<{time: number, mg: number, zn: number, fe: number, cu: number}[]>([]);
 const [volumes, setVolumes] = useState({ mg: 0, zn: 0, fe: 0, cu: 0 });
 
 const [hclConc, setHclConc] = useState(1.0);
 const [metalMass, setMetalMass] = useState(0.1);
 const [hoveredMetal, setHoveredMetal] = useState<string | null>(null);

 const [assessmentAnswer, setAssessmentAnswer] = useState("");
 const [assessmentResult, setAssessmentResult] = useState<string | null>(null);

 useEffect(() => {
 let interval: any;
 if (running) {
  interval = setInterval(() => {
  setTime(t => t + 1);
  }, 500); // 0.5s intervals for smooth animation
 }
 return () => clearInterval(interval);
 }, [running]);

 useEffect(() => {
 if (running) {
  const molesHCl = (10 / 1000) * hclConc; // 10mL per tube
  
  const newVols = { ...volumes };
  let allDone = true;

  metals.forEach(m => {
   const molesMetal = metalMass / m.mm;
   const maxMolesH2 = Math.min(molesHCl / 2, molesMetal);
   let maxVol = maxMolesH2 * 24000;
   if (m.rate === 0) maxVol = 0; 
   
   const k = m.rate * hclConc;
   const v = maxVol * (1 - Math.exp(-k * (time/2))); 
   const vNoise = v > 0 ? v + (Math.random() * 0.5 - 0.25) : 0;
   const finalV = Math.max(0, Math.min(maxVol, vNoise));
   
   (newVols as any)[m.id] = finalV;
   
   if (maxVol > 0 && finalV < maxVol * 0.99) {
   allDone = false;
   }
  });

  setVolumes(newVols);
  setHistory(prev => {
   if (prev.length > 0 && prev[prev.length - 1].time === time / 2) return prev;
   return [...prev, { time: time / 2, ...newVols }];
  });

  if (allDone || time / 2 >= 60) {
  setRunning(false);
  }
 }
 }, [time, running, hclConc, metalMass]);

 const startExperiment = () => {
 setRunning(true);
 setTime(0);
 setVolumes({ mg: 0, zn: 0, fe: 0, cu: 0 });
 setHistory([{ time: 0, mg: 0, zn: 0, fe: 0, cu: 0 }]);
 };

 const resetExperiment = () => {
 setRunning(false);
 setTime(0);
 setVolumes({ mg: 0, zn: 0, fe: 0, cu: 0 });
 setHistory([]);
 setAssessmentResult(null);
 };

 const getEquation = () => {
 if (hoveredMetal) {
  if (hoveredMetal === 'cu') return "Cu(s) + HCl(aq) → No Reaction";
  const symbol = hoveredMetal.charAt(0).toUpperCase() + hoveredMetal.slice(1);
  return `${symbol}(s) + 2HCl(aq) → ${symbol}Cl₂(aq) + H₂(g)↑`;
 }
 return "Hover over a test tube to see its equation.";
 };

 const checkAssessment = () => {
 const ans = assessmentAnswer.trim().toLowerCase();
 if (ans === 'mg' || ans === 'magnesium') {
  setAssessmentResult("Correct! Magnesium has the steepest initial slope on the graph.");
 } else {
  setAssessmentResult("Incorrect. Look for the curve with the steepest initial gradient.");
 }
 };

 const renderGraph = () => {
 if (history.length === 0) return null;
 const maxT = 60;
 const maxY = 100;
 return (
  <svg viewBox="-30 -10 250 160" className="w-full h-64 bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
   {/* Axes */}
   <line x1="0" y1="120" x2="200" y2="120" stroke="#94a3b8" strokeWidth="2" />
   <line x1="0" y1="0" x2="0" y2="120" stroke="#94a3b8" strokeWidth="2" />
   <text x="100" y="140" fontSize="10" textAnchor="middle" fill="#64748b">Time (s)</text>
   <text x="-25" y="60" fontSize="10" textAnchor="middle" transform="rotate(-90 -25 60)" fill="#64748b">Vol H₂ (mL)</text>
   
   {/* Grid */}
   {[25, 50, 75, 100].map(v => (
   <g key={`y${v}`}>
    <line x1="0" y1={120 - (v/maxY)*120} x2="200" y2={120 - (v/maxY)*120} stroke="#f1f5f9" strokeWidth="1" />
    <text x="-5" y={120 - (v/maxY)*120 + 3} fontSize="8" textAnchor="end" fill="#94a3b8">{v}</text>
   </g>
   ))}
   {[15, 30, 45, 60].map(t => (
   <g key={`x${t}`}>
    <line x1={(t/maxT)*200} y1="120" x2={(t/maxT)*200} y2="125" stroke="#94a3b8" strokeWidth="2" />
    <text x={(t/maxT)*200} y="135" fontSize="8" textAnchor="middle" fill="#94a3b8">{t}</text>
   </g>
   ))}

   {/* Lines */}
   {metals.map(m => {
   const pts = history.map(h => {
    const x = (h.time / maxT) * 200;
    const y = 120 - ((h as any)[m.id] / maxY) * 120;
    return `${x},${y}`;
   }).join(" ");
   return <polyline key={m.id} points={pts} fill="none" stroke={m.stroke} strokeWidth="2" strokeLinejoin="round" />
   })}
  </svg>
 );
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Metal Reactivity Series: Rate of Reaction" />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >Lab</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg: overflow-y-auto lg:overflow-visible">
  
  {/* Left Column: Theory & Setup */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow-  ? 'flex' : 'hidden'} lg:flex`}>
   <div className={`bg-slate-100 dark:bg-[#121212] p-4 border-b border-slate-200 dark:border-[#1c1b1b] flex-col `}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <Activity className="text-teal-600" /> Theory & Setup
   </h2>
   </div>
   <div className="p-6 flex-1 lg:overflow-y-auto space-y-6">
   <div>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Reaction Principle</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-2">
    Different metals react with dilute acids at different rates, producing hydrogen gas. The reactivity series orders metals by their reactivity.
    </p>
    <div className={`bg-[#121212] dark:bg-[#121212] text-green-400 p-3 rounded-lg font-mono text-sm shadow-inner text-center flex-col `}>
    Metal + Acid → Salt + Hydrogen
    </div>
   </div>

   <div>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-4">Set Variables</h3>
    <div className="space-y-4">
    <div>
     <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     Concentration of HCl: {hclConc.toFixed(1)} M
     </label>
     <input 
     type="range" min="0.5" max="2.0" step="0.5" value={hclConc}
     onChange={(e) => setHclConc(parseFloat(e.target.value))}
     disabled={running || time > 0} className="w-full accent-teal-600"
     />
    </div>
    <div>
     <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     Mass of each metal added: {metalMass.toFixed(2)} g
     </label>
     <input 
     type="range" min="0.05" max="0.20" step="0.05" value={metalMass}
     onChange={(e) => setMetalMass(parseFloat(e.target.value))}
     disabled={running || time > 0} className="w-full accent-teal-600"
     />
    </div>
    </div>
   </div>

   <div className="flex gap-4">
    <button 
    onClick={startExperiment} 
    disabled={running || time > 0} 
    className={`flex-1 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40 `}
    >
    <Play size={20} /> Add Metals & Start
    </button>
    <button 
    onClick={resetExperiment} 
    className="py-3 px-4 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] font-semibold rounded-xl hover:bg-slate-300 dark:bg-[#121212] flex items-center justify-center"
    >
    <RotateCcw size={20} />
    </button>
   </div>
   </div>
  </div>

  {/* Middle Column: Simulation */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <div className="bg-slate-100 dark:bg-[#121212] p-4 border-b border-slate-200 dark:border-[#1c1b1b]">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Virtual Workbench</h2>
   </div>
   <div className="p-6 flex-1 flex flex-col items-center justify-between">
   
   <div className="w-full h-64 flex justify-center mt-8">
    <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md">
    {metals.map((m, i) => {
     const vol = (volumes as any)[m.id];
     const plungerY = Math.max(20, 120 - vol);
     return (
     <g 
      key={m.id} 
      transform={`translate(${i * 90 + 20}, 0)`}
      onMouseEnter={() => setHoveredMetal(m.id)}
      onMouseLeave={() => setHoveredMetal(null)}
      className="cursor-pointer"
     >
      {/* Gas Syringe Barrel */}
      <rect x="10" y="20" width="20" height="100" fill="#f8fafc" stroke="#94a3b8" />
      {/* Plunger */}
      <rect x="12" y={plungerY} width="16" height="10" fill="#cbd5e1" stroke="#64748b" />
      <line x1="20" y1={plungerY} x2="20" y2={plungerY - 20} stroke="#64748b" strokeWidth="2" />
      {/* Volume Scale */}
      <line x1="30" y1="20" x2="35" y2="20" stroke="#94a3b8" />
      <line x1="30" y1="70" x2="35" y2="70" stroke="#94a3b8" />
      <line x1="30" y1="120" x2="35" y2="120" stroke="#94a3b8" />

      {/* Connecting tube */}
      <path d="M 20 120 L 20 160" stroke="#94a3b8" strokeWidth="4" />
      
      {/* Test Tube */}
      <path d="M 10 160 L 10 280 Q 10 290 20 290 Q 30 290 30 280 L 30 160" fill="none" stroke="#cbd5e1" strokeWidth="3" />
      <rect x="11.5" y="200" width="17" height="85" rx="8" fill="#e2e8f0" opacity="0.8" />
      
      {/* Label */}
      <text x="20" y="15" fontSize="12" textAnchor="middle" fill="#475569" fontWeight="bold">{m.symbol}</text>

      {/* Metal Piece */}
      {time > 0 && (
      <circle cx="20" cy="280" r="6" fill={m.color} stroke="#475569" strokeWidth="1" />
      )}
      
      {/* Bubbles */}
      {running && vol < 100 && (time/2 < 60) && m.rate > 0 && Array.from({length: Math.floor(m.rate * 50)}).map((_, j) => (
       <circle key={j} cx={15 + Math.random()*10} cy={200 + Math.random()*80} r="1.5" fill="#ffffff" />
      ))}

      {/* Highlight Box if hovered */}
      {hoveredMetal === m.id && (
      <rect x="0" y="0" width="40" height="300" fill="transparent" stroke={m.stroke} strokeWidth="2" rx="4" strokeDasharray="4 4" />
      )}
     </g>
     );
    })}
    </svg>
   </div>

   {/* Dynamic Equation */}
   <div className="w-full bg-[#121212] dark:bg-[#121212] lg:dark:bg-[#121212] text-green-400 p-4 rounded-xl font-mono text-center shadow-inner min-h-[4rem] flex flex-col justify-center items-center mt-8 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
    <span className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Reaction Viewer</span>
    <span className="text-sm md:text-base">{getEquation()}</span>
   </div>
   </div>
  </div>

  {/* Right Column: Data & Analysis */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col">
   <div className="bg-slate-100 dark:bg-[#121212] p-4 border-b border-slate-200 dark:border-[#1c1b1b]">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Results & Analysis</h2>
   </div>
   <div className="p-6 flex-1 flex flex-col">
   
   <div className="mb-6">
    <div className="flex justify-between items-end mb-2">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff]">H₂ Volume vs Time</h3>
    <span className="text-xs font-mono bg-slate-100 dark:bg-[#121212] px-2 py-1 rounded text-slate-600 dark:text-[#a1a1aa]">t = {(time/2).toFixed(1)} s</span>
    </div>
    {renderGraph() || (
    <div className="w-full h-64 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg flex items-center justify-center text-slate-400 text-sm">
     Start the experiment to record data.
    </div>
    )}
    
    <div className="flex justify-center gap-4 mt-3">
    {metals.map(m => (
     <div key={m.id} className="flex items-center gap-1 text-xs font-semibold" style={{ color: m.stroke }}>
     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.stroke }}></div>
     {m.symbol}
     </div>
    ))}
    </div>
   </div>

   <div className="bg-slate-50 dark:bg-[#121212] p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b] mt-auto">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Assessment</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    Based on your graph, which metal has the highest initial rate of reaction?
    </p>
    <div className="flex gap-2 mb-2">
    <input 
     type="text" 
     value={assessmentAnswer}
     onChange={e => setAssessmentAnswer(e.target.value)}
     placeholder="Enter element symbol or name..."
     className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg text-sm outline-none focus:border-teal-500"
    />
    <button onClick={checkAssessment} className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 text-sm dark:text-white dark:text-white dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40">
     Check
    </button>
    </div>
    {assessmentResult && (
    <div className={`text-sm p-3 rounded-lg ${assessmentResult.startsWith('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
     {assessmentResult}
    </div>
    )}
   </div>

   </div>
  </div>

  </div>
 </div>
 );
}
