import { useState, useEffect } from 'react';
import {Play, Pause } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

// Specific heats (J/kg°C)
const MATERIALS = [
 { id: 'A', name: 'Unknown A', c: 385, actual: 'Copper' },
 { id: 'B', name: 'Unknown B', c: 900, actual: 'Aluminum' },
 { id: 'C', name: 'Unknown C', c: 130, actual: 'Lead' },
];

export default function LabP10SpecificHeatMixture({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [material, setMaterial] = useState(MATERIALS[0]);
 const [massSolid, setMassSolid] = useState(50); // g
 const [massWater, setMassWater] = useState(100); // g
 const [isRunning, setIsRunning] = useState(false);
 const [time, setTime] = useState(0); // seconds
 const [tempWater, setTempWater] = useState(20.0);
 const [dataPoints, setDataPoints] = useState<{t: number, Tw: number}[]>([]);
 
 const [answerC, setAnswerC] = useState('');
 const [feedback, setFeedback] = useState('');

 // Constants
 const C_WATER = 4186; // J/kg°C
 const MASS_CALORIMETER = 20; // g (Copper equivalent mass)
 const C_CALORIMETER = 385; // J/kg°C
 
 // Calculate equilibrium temp
 const m_s = massSolid / 1000;
 const m_w = massWater / 1000;
 const m_c = MASS_CALORIMETER / 1000;
 
 const T_eq = (m_s * material.c * 100 + m_w * C_WATER * 20 + m_c * C_CALORIMETER * 20) / 
    (m_s * material.c + m_w * C_WATER + m_c * C_CALORIMETER);

 const reset = () => {
 setIsRunning(false);
 setTime(0);
 setTempWater(20.0);
 setDataPoints([]);
 setFeedback('');
 setAnswerC('');
 };

 useEffect(() => {
 let interval: ReturnType<typeof setInterval>;
 if (isRunning) {
  interval = setInterval(() => {
  setTime(t => {
   const newT = t + 1;
   const k = 0.05; 
   const currentTw = T_eq - (T_eq - 20) * Math.exp(-k * newT);
   const currentTs = T_eq + (100 - T_eq) * Math.exp(-k * newT);
   
   setTempWater(currentTw);
   
   if (newT % 5 === 0) {
    setDataPoints(prev => [...prev, {t: newT, Tw: currentTw}]);
   }
   
   if (Math.abs(currentTw - T_eq) < 0.1 && Math.abs(currentTs - T_eq) < 0.1) {
   setIsRunning(false);
   }
   return newT;
  });
  }, 100);
 }
 return () => clearInterval(interval);
 }, [isRunning, T_eq]);

 const checkAnswer = () => {
 const userC = parseFloat(answerC);
 if (isNaN(userC)) {
  setFeedback('Please enter a valid number.');
  return;
 }
 const error = Math.abs((userC - material.c) / material.c) * 100;
 if (error < 5) {
  setFeedback(`Correct! The specific heat is approx ${material.c} J/kg°C (${material.actual}).`);
 } else {
  setFeedback(`Incorrect. Check your calculations. (Error: ${error.toFixed(1)}%)`);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Unit 10: Specific Heat (Method of Mixtures)" subtitle="Determine specific heat capacity by analyzing thermal equilibrium." />

  
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
  <div className="lg:flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
  
  {/* Left Panel: Controls & Theory */}
  <div className="lg:col-span-1 flex flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex">
   <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 `}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 border-b pb-2">Theory</h2>
   <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-3">
    <p>When a hot solid is placed in cold water, heat is transferred until thermal equilibrium is reached.</p>
    <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded font-mono text-center text-xs text-slate-800 dark:text-[#ffffff] flex-col `}>
    Heat Lost = Heat Gained<br/>
    m_s c_s (T_i - T_eq) = (m_w c_w + m_c c_c)(T_eq - T_w)
    </div>
    <ul className="list-disc pl-5">
    <li>c_w (water) = 4186 J/kg°C</li>
    <li>m_c (calorimeter) = 0.020 kg</li>
    <li>c_c (calorimeter) = 385 J/kg°C</li>
    </ul>
   </div>
   </div>

   <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 `}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 border-b pb-2">Setup</h2>
   
   <div className="space-y-4">
    <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Select Solid</label>
    <div className="flex gap-2">
     {MATERIALS.map(m => (
     <button 
      key={m.id}
      onClick={() => { setMaterial(m); reset(); }}
      className={`flex-1 py-1.5 rounded text-sm font-medium border ${material.id === m.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] border-slate-300 dark:border-[#1c1b1b] hover:bg-slate-50 dark:bg-[#121212]'}`}
      disabled={time > 0}
     >
      {m.id}
     </button>
     ))}
    </div>
    </div>

    <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Mass of Solid (g): {massSolid}</label>
    <input type="range" min="20" max="100" step="10" value={massSolid} onChange={e => setMassSolid(Number(e.target.value))} disabled={time > 0} className="w-full" />
    </div>

    <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Mass of Water (g): {massWater}</label>
    <input type="range" min="50" max="200" step="10" value={massWater} onChange={e => setMassWater(Number(e.target.value))} disabled={time > 0} className="w-full" />
    </div>

    <div className="pt-2 flex gap-3">
    <button 
     onClick={() => setIsRunning(!isRunning)}
     className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-white ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
    >
     {isRunning ? <><Pause className="w-4 h-4"/> Pause</> : <><Play className="w-4 h-4"/> Drop Solid</>}
    </button>
    </div>
   </div>
   </div>

   <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 `}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 border-b pb-2">Analysis</h2>
   <div className="space-y-3">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff]">Calculated c_s (J/kg°C):</label>
    <div className="flex gap-2">
    <input 
     type="number" 
     value={answerC}
     onChange={e => setAnswerC(e.target.value)}
     className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:outline-none focus:border-blue-500 font-mono"
     placeholder="e.g. 400"
    />
    <button onClick={checkAnswer} className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">Check</button>
    </div>
    {feedback && (
    <div className={`p-3 rounded text-sm ${feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
     {feedback}
    </div>
    )}
   </div>
   </div>
  </div>

  {/* Center Panel: Simulation & Graph */}
  <div className="lg:col-span-2 flex flex-col gap-6 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center relative min-h-[300px] `}>
   <h3 className="absolute top-4 left-4 font-bold text-slate-700 dark:text-[#ffffff]">Calorimeter Simulation</h3>
   <div className={`absolute top-4 right-4 bg-slate-100 dark:bg-[#121212] px-3 py-1 rounded text-sm font-mono border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    Time: {time}s
   </div>
   
   <div className="flex gap-16 mt-8">
    {/* Hot Water Bath */}
    <div className={`transition-opacity duration-500 ${time > 0 ? 'opacity-30' : 'opacity-100'} flex flex-col items-center`}>
     <div className="text-sm font-bold text-red-600 mb-2">Boiling Water</div>
     <div className="w-24 h-32 border-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-xl border-t-0 bg-blue-50/50 flex items-end justify-center pb-2 relative dark:bg-teal-950/20 dark:border-teal-900">
     <div className="w-full h-24 bg-red-200/50 absolute bottom-0"></div>
     <div className="w-10 h-10 bg-[#121212] dark:bg-[#121212] rounded shadow-md z-10 flex items-center justify-center text-white text-xs">
      {massSolid}g
     </div>
     <div className="absolute -right-16 top-0 w-2 h-24 bg-slate-50 dark:bg-[#121212] border border-slate-400 dark:border-[#1c1b1b] rounded-full flex items-end">
      <div className="w-full h-[90%] bg-red-500 rounded-full dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"></div>
      <span className="absolute -right-10 top-0 text-xs font-mono">100°C</span>
     </div>
     </div>
    </div>

    {/* Calorimeter */}
    <div className="flex flex-col items-center">
     <div className="text-sm font-bold text-blue-600 mb-2">Calorimeter</div>
     <div className="w-32 h-40 bg-slate-300 dark:bg-[#121212] rounded-xl border-4 border-slate-400 dark:border-[#1c1b1b] relative flex items-end justify-center pb-2 overflow-hidden shadow-inner">
     <div className="w-full absolute bottom-0 bg-blue-300/80 transition-all duration-300" style={{ height: `${(massWater / 200) * 80}%` }}></div>
     
     <div className="absolute top-2 right-4 w-2 h-32 bg-slate-50 dark:bg-[#121212]/80 border border-slate-400 dark:border-[#1c1b1b] rounded-full flex items-end z-20">
      <div className="w-full bg-red-500 rounded-full transition-all duration-300 dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40" style={{ height: `${(tempWater / 100) * 100}%` }} />
     </div>

     {time > 0 && (
      <div className={`w-10 h-10 bg-[#121212] dark:bg-[#121212] rounded shadow-md z-10 transition-all duration-1000 flex items-center justify-center text-white text-xs ${time < 5 ? 'absolute top-0 opacity-50' : 'absolute bottom-2 opacity-100'}`}>
      {massSolid}g
      </div>
     )}
     </div>
     <div className="mt-4 font-mono font-bold text-2xl text-slate-800 dark:text-[#ffffff] bg-slate-100 dark:bg-[#121212] px-4 py-2 rounded-lg border border-slate-300 dark:border-[#1c1b1b]">
     {tempWater.toFixed(1)} °C
     </div>
    </div>
   </div>
   </div>

   <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col flex-1 min-h-[250px]">
   <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-2">Cooling Curve / Data Log</h3>
   <div className="flex flex-col md:flex-row gap-4 h-full">
    {/* Data Table */}
    <div className="w-full md:w-1/3 border border-slate-200 dark:border-[#1c1b1b] rounded lg:overflow-y-auto max-h-[200px]">
    <table className="w-full text-sm text-left">
     <thead className="bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#a1a1aa] sticky top-0">
     <tr>
      <th className="py-2 px-3 font-medium">Time (s)</th>
      <th className="py-2 px-3 font-medium">Temp (°C)</th>
     </tr>
     </thead>
     <tbody>
     {[{t: 0, Tw: 20}, ...dataPoints].map((pt, i) => (
      <tr key={i} className="border-t border-slate-100">
      <td className="py-1 px-3 font-mono">{pt.t}</td>
      <td className="py-1 px-3 font-mono">{pt.Tw.toFixed(1)}</td>
      </tr>
     ))}
     {dataPoints.length === 0 && (
      <tr><td colSpan={2} className="py-4 text-center text-slate-400">Run experiment to log data</td></tr>
     )}
     </tbody>
    </table>
    </div>

    {/* Graph */}
    <div className="w-full md:w-2/3 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] rounded relative bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
    <div className="absolute top-2 left-2 text-xs font-bold text-slate-500 dark:text-[#71717a] rotate-0">Temp (°C)</div>
    <div className="absolute bottom-2 right-2 text-xs font-bold text-slate-500 dark:text-[#71717a]">Time (s)</div>
    
    <div className="absolute left-2 top-10 text-[10px] text-slate-400">100</div>
    <div className="absolute left-2 bottom-8 text-[10px] text-slate-400">20</div>

    <svg className="absolute inset-0 w-full h-full pt-10 pb-8 px-8" preserveAspectRatio="none">
     <line x1="0" y1="0" x2="100%" y2="0" stroke="#e2e8f0" />
     <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#e2e8f0" />
     <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#e2e8f0" />
     
     {dataPoints.length > 0 && (
     <polyline
      points={[{t: 0, Tw: 20}, ...dataPoints].map(pt => 
      `${(pt.t / Math.max(100, time)) * 100}%,${100 - ((pt.Tw - 20) / 80) * 100}%`
      ).join(' ')}
      fill="none"
      stroke="#3b82f6"
      strokeWidth="2"
     />
     )}
     {dataPoints.length > 5 && (
     <line 
      x1="0" 
      y1={`${100 - ((T_eq - 20) / 80) * 100}%`} 
      x2="100%" 
      y2={`${100 - ((T_eq - 20) / 80) * 100}%`} 
      stroke="#ef4444" 
      strokeWidth="1" 
      strokeDasharray="4" 
     />
     )}
    </svg>
    </div>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
