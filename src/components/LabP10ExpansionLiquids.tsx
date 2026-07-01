import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ClipboardList } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit?: () => void;
}

export default function LabP10ExpansionLiquids({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // --- Constants and Types ---
 const V0 = 250; // Initial volume in cm^3 (250 ml)
 const D_capillary = 0.4; // cm
 const A = Math.PI * Math.pow(D_capillary / 2, 2); // Cross-sectional area in cm^2 (0.1257)

 const LIQUIDS = {
 Water: { gamma: 2.1e-4, color: 'bg-blue-400' },
 Ethanol: { gamma: 10.9e-4, color: 'bg-indigo-300' },
 Mercury: { gamma: 1.81e-4, color: 'bg-slate-400 dark:bg-[#121212]' },
 Unknown: { gamma: 5.5e-4, color: 'bg-green-400' }, // Correct real gamma
 };

 const FLASKS = {
 Pyrex: { gamma: 1.0e-5, name: 'Pyrex Glass' },
 StandardGlass: { gamma: 2.7e-5, name: 'Standard Glass' },
 Quartz: { gamma: 0.15e-5, name: 'Fused Quartz' },
 };

 type LiquidKey = keyof typeof LIQUIDS;
 type FlaskKey = keyof typeof FLASKS;

 // --- State ---
 const [liquid, setLiquid] = useState<LiquidKey>('Ethanol');
 const [flask, setFlask] = useState<FlaskKey>('StandardGlass');
 const [targetTemp, setTargetTemp] = useState<number>(60);
 const T0 = 20;

 const [isRunning, setIsRunning] = useState(false);
 const [time, setTime] = useState(0);

 // Transient temperatures
 const [tFlask, setTFlask] = useState(T0);
 const [tLiquid, setTLiquid] = useState(T0);

 // Data logging
 const [logs, setLogs] = useState<{ t: number; h: number }[]>([]);

 // Assessment
 const [answer, setAnswer] = useState('');
 const [feedback, setFeedback] = useState<string | null>(null);

 // --- Simulation Logic ---
 const tauFlask = 5; // seconds
 const tauLiquid = 25; // seconds

 const animationRef = useRef<number | undefined>(undefined);
 const lastTimeRef = useRef<number>(Date.now());

 useEffect(() => {
 if (!isRunning) {
  lastTimeRef.current = Date.now();
  return;
 }

 const update = () => {
  const now = Date.now();
  const dt = (now - lastTimeRef.current) / 1000;
  lastTimeRef.current = now;

  setTime((prev) => {
  const newTime = prev + dt * 2; // Speed up time 2x
  
  // Calculate new temperatures based on simple exponential approach
  const tempFlask = T0 + (targetTemp - T0) * (1 - Math.exp(-newTime / tauFlask));
  const tempLiquid = T0 + (targetTemp - T0) * (1 - Math.exp(-newTime / tauLiquid));
  
  setTFlask(tempFlask);
  setTLiquid(tempLiquid);
  
  return newTime;
  });

  animationRef.current = requestAnimationFrame(update);
 };

 animationRef.current = requestAnimationFrame(update);
 return () => {
  if (animationRef.current) cancelAnimationFrame(animationRef.current);
 };
 }, [isRunning, targetTemp, T0, tauFlask, tauLiquid]);

 const reset = () => {
 setIsRunning(false);
 setTime(0);
 setTFlask(T0);
 setTLiquid(T0);
 setLogs([]);
 setFeedback(null);
 };

 const handleLiquidChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
 setLiquid(e.target.value as LiquidKey);
 reset();
 };

 const handleFlaskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
 setFlask(e.target.value as FlaskKey);
 reset();
 };

 // --- Calculations ---
 // V_liquid(t) = V0 * (1 + gamma_L * (T_liquid - T0))
 // V_flask(t) = V0 * (1 + gamma_F * (T_flask - T0))
 // V_apparent = V_liquid - V_flask + V0
 // delta_V_app = V0 * gamma_L * (T_liquid - T0) - V0 * gamma_F * (T_flask - T0)
 // But wait, the volume of the capillary tube is also affected by flask expansion? We ignore that.
 
 // Real expansivity is what we want.
 const gammaL = LIQUIDS[liquid].gamma;
 const gammaF = FLASKS[flask].gamma;
 
 const dV_app = V0 * gammaL * (tLiquid - T0) - V0 * gammaF * (tFlask - T0);
 // Add some slight noise
 const noise = (Math.sin(time * 12.3) + Math.cos(time * 7.7)) * 0.05;
 let h_apparent = (dV_app / A) + (time > 0 ? noise : 0);

 // Clamp visual height (e.g., tube is 30cm long)
 const MAX_H = 30;
 const MIN_H = -5;
 
 const hDisplay = Math.max(MIN_H, Math.min(MAX_H, h_apparent));
 const heightPercentage = ((hDisplay - MIN_H) / (MAX_H - MIN_H)) * 100;

 const recordData = () => {
 setLogs([...logs, { t: targetTemp, h: parseFloat(h_apparent.toFixed(2)) }]);
 };

 const checkAnswer = () => {
 const val = parseFloat(answer);
 if (isNaN(val)) {
  setFeedback("Please enter a valid number.");
  return;
 }
 const actual = LIQUIDS.Unknown.gamma;
 const err = Math.abs(val - actual) / actual;
 if (err < 0.05) {
  setFeedback("Correct! You have accurately determined the real expansivity.");
 } else {
  setFeedback(`Incorrect. Check your calculations. Use γ_real = γ_app + γ_flask.`);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  {/* Header */}
  <LabHeader onExit={onExit} title="Unit 11: Real and Apparent Expansion of Liquids" subtitle="Determine the real thermal expansivity of an unknown liquid." />

  {/* Main Grid */}
  <div className="flex-1 lg:overflow-y-auto p-4 md:p-6">
  
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
  <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:h-full lg:min-h-[600px] overflow-y-auto lg:overflow-visible">
   
   {/* Column 1: Theory & Setup */}
   <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col gap-6  ? 'flex' : 'hidden'} lg:flex`}>
   <div>
    <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-3">Theory</h2>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-2">
    When a liquid in a vessel is heated, the vessel expands first, causing the liquid level to momentarily drop. Then, the liquid heats up and expands.
    </p>
    <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-sm font-mono text-slate-700 dark:text-[#ffffff] space-y-1 flex-col `}>
    <p>γ_real = γ_apparent + γ_flask</p>
    <p>ΔV_app = A × h</p>
    <p>γ_app = ΔV_app / (V₀ × ΔT)</p>
    </div>
    <ul className="text-sm text-slate-600 dark:text-[#a1a1aa] mt-2 list-disc pl-5">
    <li>V₀ = {V0} cm³</li>
    <li>Capillary Diameter = {D_capillary} cm</li>
    <li>Area A = {A.toFixed(4)} cm²</li>
    <li>Initial Temp T₀ = {T0} °C</li>
    </ul>
   </div>

   <div className="flex-1">
    <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-3">Setup Parameters</h2>
    <div className="space-y-4">
    <div>
     <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Liquid Type</label>
     <select 
     className={`w-full border border-slate-300 dark:border-[#1c1b1b] rounded-md p-2 bg-slate-50 dark:bg-[#121212] `}
     value={liquid}
     onChange={handleLiquidChange}
     disabled={isRunning && time > 0}
     >
     {Object.keys(LIQUIDS).map(k => <option key={k} value={k}>{k}</option>)}
     </select>
    </div>
    <div>
     <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Flask Material</label>
     <select 
     className={`w-full border border-slate-300 dark:border-[#1c1b1b] rounded-md p-2 bg-slate-50 dark:bg-[#121212] `}
     value={flask}
     onChange={handleFlaskChange}
     disabled={isRunning && time > 0}
     >
     {Object.entries(FLASKS).map(([k, v]) => <option key={k} value={k}>{v.name} (γ={v.gamma})</option>)}
     </select>
    </div>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">Water Bath Temp: {targetTemp}°C</label>
     </div>
     <input 
     type="range" min="20" max="100" step="1" 
     value={targetTemp} 
     onChange={(e) => setTargetTemp(parseInt(e.target.value))}
     className="w-full"
     />
    </div>
    </div>
   </div>

   <div className={`bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
    <div className="text-sm font-bold text-blue-900 dark:text-[#ffffff]">Simulation Time</div>
    <div className="font-mono text-blue-800 text-lg dark:text-[#ffffff]">{time.toFixed(1)}s</div>
   </div>
   </div>

   {/* Column 2: Simulation */}
   <div className={`w-full bg-[#000000] dark:bg-[#121212] lg:dark:bg-[#121212] rounded-2xl shadow-inner border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-4 flex flex-col relative overflow- lg:h-full lg:min-h-[35vh] lg:min-h-[400px]  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="absolute top-4 left-4 z-10 flex gap-2">
    <button 
    onClick={() => setIsRunning(!isRunning)}
    className={`p-3 rounded-full flex items-center justify-center transition-colors ${isRunning ? 'bg-amber-500 hover:bg-amber-400' : 'bg-emerald-500 hover:bg-emerald-400'}`}
    >
    {isRunning ? <Pause fill="white" className="w-5 h-5 text-white" /> : <Play fill="white" className="w-5 h-5 text-white" />}
    </button>
   </div>
   
   <div className="absolute top-4 right-4 text-white text-xs font-mono text-right bg-black/50 p-2 rounded">
    <div>T_flask: {tFlask.toFixed(1)}°C</div>
    <div>T_liquid: {tLiquid.toFixed(1)}°C</div>
    <div>h_app: {h_apparent.toFixed(2)} cm</div>
   </div>

   <div className="flex-1 w-full flex items-end justify-center pb-12 relative">
    {/* Bath */}
    <div className="absolute bottom-8 w-64 h-48 bg-blue-500/20 border-x-4 border-b-4 border-white/20 rounded-b-3xl dark:bg-teal-950/20 dark:border-teal-900 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
     <div className="absolute top-2 right-2 text-blue-200/50 font-bold text-sm">Water Bath</div>
     {/* Heat waves */}
     {targetTemp > T0 && (
     <div className="absolute inset-0 overflow-hidden rounded-b-2xl opacity-30">
      <div className="w-full h-full animate-pulse bg-gradient-to-t from-red-500/40 to-transparent" />
     </div>
     )}
     {/* Bath Thermometer */}
     <div className="absolute -left-6 bottom-4 w-4 h-32 bg-slate-50 dark:bg-[#121212]/10 border border-white/30 rounded-full flex items-end p-0.5">
     <div className="w-full bg-red-500 rounded-full transition-all duration-500 dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40" style={{ height: `${(targetTemp / 100) * 100}%` }} />
     </div>
    </div>

    {/* Heater */}
    <div className="absolute bottom-4 w-32 h-4 bg-zinc-800 rounded-md">
    {targetTemp > T0 && (
     <div className="absolute inset-0 bg-red-600 rounded-md animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
    )}
    </div>

    {/* Flask System */}
    <div className="relative flex flex-col items-center z-10" style={{ transform: `scale(${1 + (tFlask - T0)*gammaF*100})` }}>
    {/* Capillary Tube */}
    <div className="relative w-4 h-64 bg-slate-50 dark:bg-[#121212]/10 border-x-2 border-white/40 flex items-end justify-center mb-[-2px] z-0 overflow-hidden">
     <div className={`w-full ${LIQUIDS[liquid].color} transition-all duration-75`} style={{ height: `${heightPercentage}%` }} />
     {/* Scale marks */}
     <div className="absolute inset-y-0 left-0 w-full pointer-events-none">
     {[...Array(36)].map((_, i) => (
      <div key={i} className={`border-b border-white/50 w-${i % 5 === 0 ? 'full' : '1/2'} h-[calc(100%/35)]`} />
     ))}
     </div>
    </div>
    
    {/* Bulb */}
    <div className="w-32 h-32 bg-slate-50 dark:bg-[#121212]/20 border-4 border-white/40 rounded-full relative flex items-end justify-center p-1 z-10 overflow-hidden shadow-inner backdrop-blur-sm">
     {/* Liquid inside bulb */}
     <div className={`w-full h-full rounded-full ${LIQUIDS[liquid].color} opacity-90 transition-all`} />
    </div>
    </div>
   </div>
   <div className="text-center text-slate-400 text-xs mt-2">Expansion scale is highly exaggerated for visualization</div>
   </div>

   {/* Column 3: Data & Analysis */}
   <div className="bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col gap-4 lg:overflow-y-auto">
   <div className="flex items-center justify-between border-b pb-2">
    <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Data Recording</h2>
    <button 
    onClick={recordData}
    disabled={time < 10}
    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
    <ClipboardList className="w-4 h-4" /> Record (Eq)
    </button>
   </div>

   <div className="max-h-40 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
    <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0">
     <tr>
     <th className="px-4 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">T_bath (°C)</th>
     <th className="px-4 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">Apparent Height (cm)</th>
     </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
     {logs.length === 0 ? (
     <tr><td colSpan={2} className="px-4 py-4 text-center text-slate-400">No data recorded. Wait for equilibrium.</td></tr>
     ) : (
     logs.map((log, i) => (
      <tr key={i} className="hover:bg-slate-50 dark:bg-[#121212]">
      <td className="px-4 py-2">{log.t}</td>
      <td className="px-4 py-2">{log.h.toFixed(2)}</td>
      </tr>
     ))
     )}
    </tbody>
    </table>
   </div>

   {/* Graph area */}
   <div className="flex-1 bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b] p-4 relative min-h-[150px]">
    <div className="absolute -left-8 top-1/2 -rotate-90 text-xs font-bold text-slate-500 dark:text-[#71717a]">Height (cm)</div>
    <div className="absolute bottom-1 w-full text-center text-xs font-bold text-slate-500 dark:text-[#71717a]">Temperature (°C)</div>
    
    <svg className="w-full h-[calc(100%-20px)] overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
     {/* Grid */}
     {[0, 25, 50, 75, 100].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e2e8f0" strokeWidth="0.5" />)}
     {[0, 25, 50, 75, 100].map(x => <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="#e2e8f0" strokeWidth="0.5" />)}
     
     {/* Points */}
     {logs.map((log, i) => {
     const cx = ((log.t - 20) / 80) * 100;
     const cy = 100 - (log.h / MAX_H) * 100;
     return <circle key={i} cx={cx} cy={cy} r="2" fill="#2563eb" />;
     })}
     
     {/* Line of best fit if >1 point */}
     {logs.length > 1 && (() => {
     const n = logs.length;
     const sumX = logs.reduce((sum, l) => sum + l.t, 0);
     const sumY = logs.reduce((sum, l) => sum + l.h, 0);
     const sumXY = logs.reduce((sum, l) => sum + l.t * l.h, 0);
     const sumX2 = logs.reduce((sum, l) => sum + l.t * l.t, 0);
     const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
     const b = (sumY - m * sumX) / n;
     
     const x1 = 20, y1 = m * x1 + b;
     const x2 = 100, y2 = m * x2 + b;
     
     const svgX1 = 0, svgY1 = 100 - (y1 / MAX_H) * 100;
     const svgX2 = 100, svgY2 = 100 - (y2 / MAX_H) * 100;
     
     return <line x1={svgX1} y1={svgY1} x2={svgX2} y2={svgY2} stroke="#ef4444" strokeWidth="1" strokeDasharray="4" />;
     })()}
    </svg>
   </div>

   {/* Assessment */}
   <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h3 className="font-bold text-indigo-900 text-sm mb-2 dark:text-[#ffffff]">Analysis</h3>
    <p className="text-xs text-indigo-800 mb-3 dark:text-[#ffffff]">
    Select "Unknown" liquid. Use the graph gradient or a data point to find γ_app, then calculate the real expansivity γ_real. Enter your answer below (e.g., 0.00055).
    </p>
    <div className="flex gap-2">
    <input 
     type="text" 
     value={answer}
     onChange={(e) => setAnswer(e.target.value)}
     placeholder="e.g., 5.5e-4"
     className="flex-1 px-3 py-1.5 text-sm border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <button 
     onClick={checkAnswer}
     className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
     Check
    </button>
    </div>
    {feedback && (
    <div className={`mt-2 text-xs font-medium ${feedback.includes('Correct') ? 'text-emerald-600' : 'text-red-600'}`}>
     {feedback}
    </div>
    )}
   </div>
   </div>

  </div>
  </div>
 </div>
 );
}
