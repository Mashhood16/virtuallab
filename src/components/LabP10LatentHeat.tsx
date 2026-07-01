import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause} from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit?: () => void;
}

export default function LabP10LatentHeat({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // --- Constants and Types ---
 const MATERIALS = {
 Water: {
  T_init: -20, T_melt: 0, T_boil: 100,
  c_solid: 2100, c_liquid: 4180, c_gas: 2000,
  L_f: 334000, L_v: 2260000,
  color: 'bg-blue-400', name: 'Water (Ice)'
 },
 Ethanol: {
  T_init: -130, T_melt: -114, T_boil: 78,
  c_solid: 1200, c_liquid: 2440, c_gas: 1420,
  L_f: 109000, L_v: 838000,
  color: 'bg-indigo-300', name: 'Ethanol'
 },
 Unknown: {
  T_init: 10, T_melt: 40, T_boil: 150,
  c_solid: 1500, c_liquid: 2500, c_gas: 1000,
  L_f: 150000, L_v: 800000,
  color: 'bg-green-400', name: 'Unknown X'
 }
 };

 type MaterialKey = keyof typeof MATERIALS;

 // --- State ---
 const [material, setMaterial] = useState<MaterialKey>('Water');
 const [mass, setMass] = useState<number>(0.2); // kg
 const [power, setPower] = useState<number>(1000); // Watts (J/s)
 
 const [isRunning, setIsRunning] = useState(false);
 const [time, setTime] = useState(0); // simulation time (seconds)
 const [energy, setEnergy] = useState(0); // Total energy added (J)

 // Derived state
 const [temperature, setTemperature] = useState(MATERIALS['Water'].T_init);
 const [phase, setPhase] = useState<string>('Solid');
 const [fractionLiquid, setFractionLiquid] = useState(0);
 const [fractionGas, setFractionGas] = useState(0);

 // Data logging
 const [logs, setLogs] = useState<{ t: number; temp: number }[]>([]);

 // Assessment
 const [answer, setAnswer] = useState('');
 const [feedback, setFeedback] = useState<string | null>(null);

 // --- Simulation Logic ---
 const animationRef = useRef<number | undefined>(undefined);
 const lastTimeRef = useRef<number>(Date.now());
 const nextLogTimeRef = useRef<number>(0);

 useEffect(() => {
 if (!isRunning) {
  lastTimeRef.current = Date.now();
  return;
 }

 const update = () => {
  const now = Date.now();
  const dt_real = (now - lastTimeRef.current) / 1000;
  lastTimeRef.current = now;

  // Speed up simulation so a 10-minute experiment takes ~1 minute
  const speedUp = 10;
  const dt_sim = dt_real * speedUp;

  setTime(prevTime => {
  const newTime = prevTime + dt_sim;
  setEnergy(prevE => prevE + power * dt_sim);
  return newTime;
  });

  animationRef.current = requestAnimationFrame(update);
 };

 animationRef.current = requestAnimationFrame(update);
 return () => {
  if (animationRef.current) cancelAnimationFrame(animationRef.current);
 };
 }, [isRunning, power]);

 // Compute temperature and phase from total energy
 useEffect(() => {
 const mat = MATERIALS[material];
 const E1 = mass * mat.c_solid * (mat.T_melt - mat.T_init);
 const E2 = E1 + mass * mat.L_f;
 const E3 = E2 + mass * mat.c_liquid * (mat.T_boil - mat.T_melt);
 const E4 = E3 + mass * mat.L_v;

 let T = mat.T_init;
 let ph = 'Solid';
 let fracL = 0;
 let fracG = 0;

 if (energy < E1) {
  T = mat.T_init + energy / (mass * mat.c_solid);
  ph = 'Solid';
 } else if (energy < E2) {
  T = mat.T_melt;
  ph = 'Melting';
  fracL = (energy - E1) / (mass * mat.L_f);
 } else if (energy < E3) {
  T = mat.T_melt + (energy - E2) / (mass * mat.c_liquid);
  ph = 'Liquid';
  fracL = 1;
 } else if (energy < E4) {
  T = mat.T_boil;
  ph = 'Boiling';
  fracL = 1;
  fracG = (energy - E3) / (mass * mat.L_v);
 } else {
  T = mat.T_boil + (energy - E4) / (mass * mat.c_gas);
  ph = 'Gas';
  fracL = 1;
  fracG = 1;
 }

 setTemperature(T);
 setPhase(ph);
 setFractionLiquid(Math.min(1, Math.max(0, fracL)));
 setFractionGas(Math.min(1, Math.max(0, fracG)));

 // Auto-log data every 30 sim seconds
 if (time >= nextLogTimeRef.current) {
  setLogs(prev => [...prev, { t: Math.floor(time), temp: parseFloat(T.toFixed(1)) }]);
  nextLogTimeRef.current += 30;
 }

 }, [energy, material, mass, time]);

 const reset = () => {
 setIsRunning(false);
 setTime(0);
 setEnergy(0);
 setLogs([]);
 setFeedback(null);
 nextLogTimeRef.current = 0;
 setTemperature(MATERIALS[material].T_init);
 setPhase('Solid');
 setFractionLiquid(0);
 setFractionGas(0);
 };

 const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
 setMaterial(e.target.value as MaterialKey);
 reset();
 };

 const checkAnswer = () => {
 const val = parseFloat(answer);
 if (isNaN(val)) {
  setFeedback("Please enter a valid number.");
  return;
 }
 const mat = MATERIALS.Unknown;
 const err = Math.abs(val - mat.L_f) / mat.L_f;
 if (err < 0.05) {
  setFeedback("Correct! You have found the specific latent heat of fusion (L_f).");
 } else {
  setFeedback(`Incorrect. Check your calculations. Use L = Q / m, where Q = Power × time during the plateau.`);
 }
 };

 // UI mapping for graph
 const maxTime = 1500; // 25 mins max for graph
 const minTemp = MATERIALS[material].T_init - 10;
 const maxTemp = MATERIALS[material].T_boil + 30;

 return (
 <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  {/* Header */}
  <LabHeader onExit={onExit} title="Unit 11: Specific Latent Heat" subtitle="Determine specific latent heat using continuous electrical heating." />

  {/* Main Grid */}
  <div className="flex-1 lg:overflow-y-auto p-4 md:p-6">
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >Lab</button>
  </div>
  <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:h-full lg:min-h-[600px] overflow-y-auto lg:overflow-visible">
   
   {/* Column 1: Theory & Setup */}
   <div className={`bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div>
    <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-3">Theory</h2>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-2">
    When heating a substance, its temperature rises until it reaches a phase change. During a phase change, the temperature remains constant as energy goes into breaking bonds.
    </p>
    <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-sm font-mono text-slate-700 dark:text-[#ffffff] space-y-1 flex-col `}>
    <p>Heating: Q = mcΔT</p>
    <p>Phase Change: Q = mL</p>
    <p>Energy Input: Q = P × t</p>
    </div>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mt-2">
    To find the specific latent heat of fusion (L_f), measure the time (Δt) it takes to completely melt the solid. Then: L_f = (P × Δt) / m.
    </p>
   </div>

   <div className="flex-1">
    <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-3">Setup Parameters</h2>
    <div className="space-y-4">
    <div>
     <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Substance</label>
     <select 
     className={`w-full border border-slate-300 dark:border-[#1c1b1b] rounded-md p-2 bg-slate-50 dark:bg-[#121212] `}
     value={material}
     onChange={handleMaterialChange}
     disabled={isRunning && time > 0}
     >
     {Object.entries(MATERIALS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
     </select>
    </div>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">Mass (kg): {mass.toFixed(2)} kg</label>
     </div>
     <input 
     type="range" min="0.1" max="0.5" step="0.05" 
     value={mass} 
     onChange={(e) => {
      setMass(parseFloat(e.target.value));
      reset();
     }}
     disabled={isRunning && time > 0}
     className="w-full"
     />
    </div>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">Heater Power (W): {power} W</label>
     </div>
     <input 
     type="range" min="100" max="2000" step="100" 
     value={power} 
     onChange={(e) => setPower(parseInt(e.target.value))}
     disabled={isRunning && time > 0}
     className="w-full"
     />
    </div>
    </div>
   </div>

   <div className={`bg-blue-50 p-4 rounded-xl border border-blue-100 grid grid-cols-2 gap-4 dark:bg-teal-950/20 dark:border-teal-900 `}>
    <div>
    <div className="text-xs font-bold text-blue-900 uppercase dark:text-[#ffffff]">Sim Time</div>
    <div className="font-mono text-blue-800 text-lg dark:text-[#ffffff]">{time.toFixed(0)}s</div>
    </div>
    <div>
    <div className="text-xs font-bold text-blue-900 uppercase dark:text-[#ffffff]">Phase</div>
    <div className="font-mono text-blue-800 text-lg font-bold dark:text-[#ffffff]">{phase}</div>
    </div>
   </div>
   </div>

   {/* Column 2: Simulation */}
   <div className={`bg-[#000000] dark:bg-[#121212] lg:dark:bg-[#121212] rounded-2xl shadow-inner border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-4 flex flex-col relative overflow- lg:h-full lg:min-h-[35vh] lg:min-h-[400px] ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="absolute top-4 left-4 z-20 flex gap-2">
    <button 
    onClick={() => setIsRunning(!isRunning)}
    className={`p-3 rounded-full flex items-center justify-center transition-colors shadow-lg ${isRunning ? 'bg-amber-500 hover:bg-amber-400' : 'bg-emerald-500 hover:bg-emerald-400'}`}
    >
    {isRunning ? <Pause fill="white" className="w-5 h-5 text-white" /> : <Play fill="white" className="w-5 h-5 text-white" />}
    </button>
   </div>
   
   <div className={`absolute top-4 right-4 text-white text-sm font-mono text-right bg-black/60 p-3 rounded-lg z-20 backdrop-blur-md border border-white/10 flex-col `}>
    <div className="text-2xl text-blue-300 font-bold">{temperature.toFixed(1)}°C</div>
    <div className="text-xs text-slate-400 mt-1">Energy: {(energy/1000).toFixed(1)} kJ</div>
   </div>

   <div className="flex-1 w-full flex items-center justify-center relative p-8">
    
    {/* Beaker System */}
    <div className="relative w-48 h-64 bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212]/5 border-x-4 border-b-4 border-white/20 rounded-b-xl flex items-end justify-center z-10 backdrop-blur-sm flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    
    {/* Liquid Phase */}
    {fractionLiquid > 0 && (
     <div 
     className={`absolute bottom-0 w-full ${MATERIALS[material].color} transition-all duration-300 ease-out`}
     style={{ height: `${(mass / 0.5) * 50}%`, opacity: fractionLiquid * (1 - fractionGas * 0.8) }}
     >
     {/* Boiling Bubbles */}
     {phase === 'Boiling' && (
      <div className="absolute inset-0 overflow-hidden">
       {[...Array(20)].map((_, i) => (
       <div key={i} className="absolute w-2 h-2 bg-slate-50 dark:bg-[#121212]/60 rounded-full animate-bounce"
        style={{
         left: `${Math.random() * 90}%`,
         bottom: `${Math.random() * 20}%`,
         animationDuration: `${0.5 + Math.random()}s`
        }}
       />
       ))}
      </div>
     )}
     </div>
    )}

    {/* Solid Phase (Ice Blocks) */}
    {fractionLiquid < 1 && (
     <div className="absolute bottom-2 w-32 h-32 flex flex-wrap gap-1 justify-center items-end opacity-90 transition-opacity" style={{ opacity: 1 - fractionLiquid }}>
     {[...Array(8)].map((_, i) => (
      <div key={i} className="w-12 h-12 bg-slate-50 dark:bg-[#121212]/80 border border-slate-300 dark:border-[#1c1b1b] rounded-sm transform" style={{ rotate: `${(i * 15) % 45}deg` }} />
     ))}
     </div>
    )}

    {/* Heater Element */}
    <div className="absolute bottom-0 w-8 h-40 bg-zinc-800 rounded-t-xl border-2 border-zinc-700 shadow-xl flex items-center justify-center">
     <div className={`w-4 h-36 rounded-t-lg transition-colors duration-1000 ${isRunning && power > 0 ? 'bg-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'bg-zinc-600'}`} />
    </div>

    {/* Thermometer */}
    <div className="absolute right-4 bottom-4 w-3 h-48 bg-slate-50 dark:bg-[#121212]/20 border border-white/40 rounded-full flex items-end p-0.5">
     <div className="w-full bg-red-500 rounded-full transition-all duration-300 dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40" 
      style={{ height: `${Math.max(5, ((temperature - minTemp) / (maxTemp - minTemp)) * 100)}%` }} />
    </div>
    </div>

    {/* Gas Phase (Steam) */}
    {fractionGas > 0 && (
    <div className="absolute top-10 w-64 h-40 flex items-end justify-center pointer-events-none">
     {[...Array(10)].map((_, i) => (
     <div key={i} className="absolute w-16 h-16 bg-slate-50 dark:bg-[#121212]/30 rounded-full blur-xl animate-ping"
       style={{
       left: `${20 + Math.random() * 60}%`,
       bottom: `${Math.random() * 100}%`,
       animationDuration: `${2 + Math.random() * 3}s`,
       opacity: fractionGas * 0.8
       }}
     />
     ))}
    </div>
    )}
   </div>
   </div>

   {/* Column 3: Data & Analysis */}
   <div className="bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col gap-4 overflow-hidden">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 shrink-0">Live Data Graph</h2>

   {/* Graph area: Temp vs Time */}
   <div className="flex-1 bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b] p-4 relative min-h-[200px] w-full lg:overflow-hidden">
    <div className="absolute -left-6 top-1/2 -rotate-90 text-xs font-bold text-slate-500 dark:text-[#71717a]">Temp (°C)</div>
    <div className="absolute bottom-1 w-full text-center text-xs font-bold text-slate-500 dark:text-[#71717a]">Time (s)</div>
    
    <svg className="w-full h-[calc(100%-20px)] overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
     {/* Grid */}
     {[0, 25, 50, 75, 100].map(y => <line key={`gy${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#e2e8f0" strokeWidth="0.5" />)}
     {[0, 25, 50, 75, 100].map(x => <line key={`gx${x}`} x1={x} y1="0" x2={x} y2="100" stroke="#e2e8f0" strokeWidth="0.5" />)}
     
     {/* Live Path */}
     {logs.length > 1 && (
     <path 
      d={`M ${logs.map(l => {
      const x = (l.t / maxTime) * 100;
      const y = 100 - ((l.temp - minTemp) / (maxTemp - minTemp)) * 100;
      return `${x},${y}`;
      }).join(' L ')}`}
      fill="none" 
      stroke="#ef4444" 
      strokeWidth="2" 
      strokeLinecap="round"
      strokeLinejoin="round"
     />
     )}
     
     {/* Latest point */}
     {logs.length > 0 && (
     <circle 
      cx={(logs[logs.length-1].t / maxTime) * 100} 
      cy={100 - ((logs[logs.length-1].temp - minTemp) / (maxTemp - minTemp)) * 100} 
      r="3" 
      fill="#2563eb" 
     />
     )}
    </svg>
   </div>

   {/* Logs preview */}
   <div className="h-24 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] rounded-lg shrink-0">
    <table className="w-full text-xs text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0">
     <tr>
     <th className="px-3 py-1.5 font-semibold text-slate-700 dark:text-[#ffffff]">Time (s)</th>
     <th className="px-3 py-1.5 font-semibold text-slate-700 dark:text-[#ffffff]">Temp (°C)</th>
     </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
     {logs.slice(-10).reverse().map((log, i) => (
     <tr key={i} className="hover:bg-slate-50 dark:bg-[#121212]">
      <td className="px-3 py-1 font-mono">{log.t}</td>
      <td className="px-3 py-1 font-mono">{log.temp.toFixed(1)}</td>
     </tr>
     ))}
     {logs.length === 0 && <tr><td colSpan={2} className="px-3 py-2 text-center text-slate-400">Run to record</td></tr>}
    </tbody>
    </table>
   </div>

   {/* Assessment */}
   <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shrink-0 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h3 className="font-bold text-indigo-900 text-sm mb-2 dark:text-[#ffffff]">Analysis</h3>
    <p className="text-xs text-indigo-800 mb-3 dark:text-[#ffffff]">
    Select "Unknown X". Run the simulation until melting finishes. Measure the time (Δt) of the melting plateau. Calculate L_f = (Power × Δt) / Mass.
    </p>
    <div className="flex gap-2">
    <input 
     type="text" 
     value={answer}
     onChange={(e) => setAnswer(e.target.value)}
     placeholder="e.g., 150000"
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
