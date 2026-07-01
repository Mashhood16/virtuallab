import { useState } from 'react';
import { useState, useEffect } from 'react';
import {Activity, BookOpen, LineChart, Info, Play, Square } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabP10ConvectionCurrents({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [power, setPower] = useState(200);
 const [isRunning, setIsRunning] = useState(false);
 const [finished, setFinished] = useState(false);
 const [timeElapsed, setTimeElapsed] = useState(0);
 const [dyePosition, setDyePosition] = useState(0);
 const [currentV, setCurrentV] = useState(0);

 const [data, setData] = useState<{ power: number; time: number; velocity: number }[]>([]);
 const [assessmentAnswer, setAssessmentAnswer] = useState('');
 const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 const startHeating = () => {
 const baseV = 2 + 0.03 * power;
 const noisyV = baseV * (1 + (Math.random() * 0.04 - 0.02));
 setCurrentV(noisyV);
 setIsRunning(true);
 setFinished(false);
 setTimeElapsed(0);
 setDyePosition(0);
 };

 const stopHeating = () => {
 setIsRunning(false);
 };

 const recordData = () => {
 if (finished) {
  setData(prev => [...prev, { power, time: timeElapsed, velocity: currentV }]);
 }
 };

 useEffect(() => {
 let timer: number;
 let lastTime = Date.now();

 if (isRunning && !finished) {
  timer = window.setInterval(() => {
  const now = Date.now();
  const dtReal = (now - lastTime) / 1000;
  lastTime = now;
  const dtSim = dtReal * 5; // 5x simulation speed

  setTimeElapsed(prevT => {
   const nextT = prevT + dtSim;
   const pos = currentV * nextT;
   if (pos >= 150) {
   setFinished(true);
   setIsRunning(false);
   setDyePosition(150);
   return 150 / currentV;
   }
   setDyePosition(pos);
   return nextT;
  });
  }, 50);
 }
 return () => clearInterval(timer);
 }, [isRunning, finished, currentV]);

 const checkAssessment = () => {
 const ans = parseFloat(assessmentAnswer);
 if (!isNaN(ans) && ans >= 0.025 && ans <= 0.035) {
  setAssessmentStatus('correct');
 } else {
  setAssessmentStatus('incorrect');
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Unit 10: Convection Currents" subtitle="Determine the relationship between heater power and convection velocity." />

  
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 max-w-7xl mx-auto w-full overflow-y-auto lg:overflow-visible">
  {/* Column 1: Theory */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 border-b pb-2">
   <BookOpen className="w-5 h-5 text-indigo-600" />
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Theory & Setup</h2>
   </div>
   <div className="space-y-4 text-slate-600 dark:text-[#a1a1aa] text-sm">
   <p>
    <strong>Convection</strong> is the transfer of thermal energy through a fluid (liquid or gas) by the upward movement of warmer, less dense regions of fluid.
   </p>
   <p>
    When the water at the bottom of the beaker is heated, it expands, its density decreases, and it rises. Cooler, denser water sinks to replace it, forming a continuous convection cell.
   </p>
   <div className={`bg-indigo-50 p-4 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    <h3 className="font-bold text-indigo-800 mb-2 dark:text-[#ffffff]">Formulas</h3>
    <p className="font-mono text-xs mb-1">Velocity (v) = Distance (d) / Time (t)</p>
    <p className="font-mono text-xs">d = 150 mm (Height of beaker)</p>
   </div>
   <div className={`flex items-start gap-2 bg-blue-50 text-blue-800 p-3 rounded-md dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff] flex-col `}>
    <Info className="w-5 h-5 shrink-0 mt-0.5" />
    <p className="text-xs">
    Set the heater power and start the experiment. The purple dye traces the convection current. Measure the time it takes to reach the top.
    </p>
   </div>
   </div>
  </div>

  {/* Column 2: Simulation */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col gap-6 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center gap-2 border-b pb-2">
   <Activity className="w-5 h-5 text-blue-600" />
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Simulation</h2>
   </div>

   <div className={`flex-1 relative bg-slate-50 dark:bg-[#121212] border-2 border-slate-200 dark:border-[#1c1b1b] rounded-xl flex justify-center items-end p-4 h-80 lg:overflow- `}>
   {/* Beaker */}
   <div className={`w-32 h-64 border-4 border-white/80 bg-blue-100/50 relative overflow- rounded-b-xl shadow-inner z-10 backdrop-blur-[1px] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
    <div className="absolute bottom-0 w-full h-[95%] bg-blue-300/30" />
    
    {/* Dye */}
    <div 
    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 bg-indigo-600/70 blur-[3px] transition-all duration-75"
    style={{ height: `${(dyePosition / 150) * 100}%` }}
    />

    {/* Convection arrows */}
    {(isRunning || finished) && (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
     <path d="M 50 90 L 50 20" stroke="#4158D1" strokeWidth="4" strokeDasharray="5,5" className="animate-[dash_1s_linear_infinite]" />
     <path d="M 50 20 C 50 10, 80 10, 85 40 C 90 70, 70 90, 70 90" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_2s_linear_infinite]" />
     <path d="M 50 20 C 50 10, 20 10, 15 40 C 10 70, 30 90, 30 90" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_2s_linear_infinite]" />
    </svg>
    )}
   </div>

   {/* Heater */}
   <div className="absolute bottom-4 w-28 h-8 bg-zinc-800 rounded-t-lg flex items-center justify-center border-b-4 border-orange-500 z-0">
    {isRunning && <div className="absolute -top-4 w-16 h-8 bg-orange-500 rounded-full blur-md animate-pulse opacity-50 dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40" />}
    <div className="text-orange-400 text-xs font-bold z-10">{power}W</div>
   </div>

   {/* Timer overlay */}
   <div className="absolute top-4 right-4 bg-zinc-900 text-emerald-400 font-mono px-3 py-1 rounded shadow-md border border-zinc-700">
    {timeElapsed.toFixed(1)} s
   </div>
   </div>

   <div className="space-y-4">
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
    <span>Heater Power (W)</span>
    <span className="text-blue-600">{power} W</span>
    </label>
    <input 
    type="range" min="50" max="500" step="10" 
    value={power} onChange={(e) => setPower(Number(e.target.value))}
    disabled={isRunning}
    className="w-full accent-blue-600 disabled:opacity-50"
    />
   </div>
   <div className="flex gap-2">
    {!isRunning ? (
    <button onClick={startHeating} disabled={finished} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors disabled:opacity-50 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
     <Play className="w-4 h-4" /> Start Heating
    </button>
    ) : (
    <button onClick={stopHeating} className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-medium transition-colors dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40">
     <Square className="w-4 h-4" /> Stop
    </button>
    )}
   </div>
   </div>
  </div>

  {/* Column 3: Data & Analysis */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-6">
   <div className="flex items-center gap-2 border-b pb-2">
   <LineChart className="w-5 h-5 text-emerald-600" />
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Data & Analysis</h2>
   </div>

   <div className="flex justify-between items-center">
   <span className="text-sm text-slate-600 dark:text-[#a1a1aa]">Measure velocity when finished.</span>
   <button 
    onClick={recordData}
    disabled={!finished}
    className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
   >
    Record Data
   </button>
   </div>

   <div className="max-h-32 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] rounded-md">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0 shadow-sm">
    <tr>
     <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">Power (W)</th>
     <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">Time (s)</th>
     <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">Vel (mm/s)</th>
    </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
    {data.length === 0 && (
     <tr><td colSpan={3} className="px-3 py-4 text-center text-slate-400">No data recorded yet.</td></tr>
    )}
    {data.map((d, i) => (
     <tr key={i} className="hover:bg-slate-50 dark:bg-[#121212]">
     <td className="px-3 py-1.5">{d.power}</td>
     <td className="px-3 py-1.5">{d.time.toFixed(1)}</td>
     <td className="px-3 py-1.5 text-emerald-600 font-medium">{d.velocity.toFixed(1)}</td>
     </tr>
    ))}
    </tbody>
   </table>
   </div>

   {/* Graph */}
   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex flex-col items-center">
   <span className="text-xs font-bold text-slate-600 dark:text-[#a1a1aa] mb-2">Velocity vs Heater Power</span>
   <svg width="250" height="150" className="bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded shadow-sm">
    {/* Grid & Axes */}
    <line x1="20" y1="130" x2="240" y2="130" stroke="#cbd5e1" strokeWidth="2" />
    <line x1="20" y1="10" x2="20" y2="130" stroke="#cbd5e1" strokeWidth="2" />
    <text x="120" y="145" fontSize="10" fill="#64748b">Power (W)</text>
    <text x="5" y="75" fontSize="10" fill="#64748b" transform="rotate(-90 5 75)">Vel (mm/s)</text>
    
    {/* Points */}
    {data.map((d, i) => {
     const x = 20 + (d.power / 600) * 220;
     const y = 130 - (d.velocity / 25) * 120;
     return <circle key={i} cx={x} cy={y} r="3" fill="#10b981" />;
    })}
   </svg>
   </div>

   {/* Assessment */}
   <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 mt-auto">
   <h3 className="font-bold text-emerald-800 mb-2 text-sm">Assessment</h3>
   <p className="text-xs text-emerald-700 mb-3">
    Given $v = kP + c$, use your plotted data to calculate the proportionality constant $k$ (the slope). Enter to 3 decimal places.
   </p>
   <div className="flex gap-2">
    <input 
    type="text" 
    value={assessmentAnswer}
    onChange={(e) => setAssessmentAnswer(e.target.value)}
    placeholder="e.g. 0.050"
    className="flex-1 px-3 py-1.5 rounded-md border border-emerald-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
    <button onClick={checkAssessment} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-sm font-bold transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
    Check
    </button>
   </div>
   {assessmentStatus === 'correct' && <p className="text-xs text-green-600 mt-2 font-bold">✓ Correct! k ≈ 0.030</p>}
   {assessmentStatus === 'incorrect' && <p className="text-xs text-red-600 mt-2 font-bold">✗ Incorrect. Hint: Pick two points and calculate (v2-v1)/(P2-P1).</p>}
   </div>
  </div>
  </div>
  <style>{`
  @keyframes dash {
   to { stroke-dashoffset: -30; }
  }
  `}</style>
 </div>
 );
}
