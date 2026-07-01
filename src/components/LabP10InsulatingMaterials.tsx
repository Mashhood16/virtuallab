import { useState } from 'react';
import { useState, useEffect } from 'react';
import {Play, Pause, Plus, CheckCircle, Info } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabP10InsulatingMaterials({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // Simulation Controls
 const [material, setMaterial] = useState<string>('Newspaper');
 const [thickness, setThickness] = useState<number>(2);
 const [initialTemp, setInitialTemp] = useState<number>(80);
 
 // Simulation State
 const [isRunning, setIsRunning] = useState<boolean>(false);
 const [time, setTime] = useState<number>(0);
 const [temperature, setTemperature] = useState<number>(80);
 
 // Data Logging
 const [dataLog, setDataLog] = useState<{t: number, T: number}[]>([]);
 
 // Assessment
 const [studentAnswer, setStudentAnswer] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 // Material Properties
 const materials: Record<string, { k: number, color: string, name: string }> = {
 'None': { k: 0.1, color: '#e2e8f0', name: 'No Insulation' },
 'Newspaper': { k: 0.06, color: '#fcd34d', name: 'Newspaper' },
 'BubbleWrap': { k: 0.04, color: '#bae6fd', name: 'Bubble Wrap' },
 'Foam': { k: 0.02, color: '#fbcfe8', name: 'Polystyrene Foam' },
 'Mystery': { k: 0.03, color: '#d8b4fe', name: 'Mystery Material X' }
 };

 const envTemp = 20;

 // Sync temperature at t=0
 useEffect(() => {
 if (time === 0) {
  setTemperature(initialTemp);
 }
 }, [initialTemp, time]);

 // Timer loop
 useEffect(() => {
 let timer: ReturnType<typeof setTimeout>;
 if (isRunning) {
  timer = setInterval(() => {
  setTime(t => {
   if (t >= 60) {
   setIsRunning(false);
   return 60;
   }
   return t + 1;
  });
  }, 200); // 1 virtual minute = 200ms
 }
 return () => clearInterval(timer);
 }, [isRunning]);

 // Physics calculation
 useEffect(() => {
 if (time > 0) {
  const baseK = materials[material].k;
  // Thickness reduces cooling rate. If thickness = 0, k = baseK.
  const kEff = baseK / (1 + thickness * 0.15);
  
  const exactTemp = envTemp + (initialTemp - envTemp) * Math.exp(-kEff * time);
  // Realistic thermal noise ±0.4°C
  const noise = (Math.random() - 0.5) * 0.8;
  setTemperature(Math.max(envTemp, exactTemp + noise));
 }
 }, [time, initialTemp, material, thickness]);

 const handleRecord = () => {
 if (!dataLog.find(d => d.t === time)) {
  setDataLog(prev => [...prev, { t: time, T: Number(temperature.toFixed(1)) }].sort((a, b) => a.t - b.t));
 }
 };

 const reset = () => {
 setIsRunning(false);
 setTime(0);
 setTemperature(initialTemp);
 setDataLog([]);
 setStudentAnswer('');
 setIsCorrect(null);
 };

 const checkAnswer = () => {
 // Expected answer: average rate of cooling in first 10 mins = (T_0 - T_10) / 10
 // We calculate based on the exact physics rather than noise to be fair, or allow a margin
 const baseK = materials[material].k;
 const kEff = baseK / (1 + thickness * 0.15);
 const exactTemp10 = envTemp + (initialTemp - envTemp) * Math.exp(-kEff * 10);
 const expectedRate = (initialTemp - exactTemp10) / 10;
 
 const ans = parseFloat(studentAnswer);
 if (!isNaN(ans) && Math.abs(ans - expectedRate) < 0.5) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  {/* Header */}
  <LabHeader onExit={onExit} title="Insulating Materials & Cooling Curves" subtitle="Investigate how different materials and thicknesses affect the rate of heat transfer." />

  {/* 3-Column Grid */}
  
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
  <div className="lg:flex-1 p-4 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 max-w-7xl mx-auto w-full overflow-y-auto lg:overflow-visible">
  
  {/* Column 1: Theory & Setup */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col gap-6 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2">Theory & Setup</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed mb-4">
    Heat transfers from hotter objects to colder environments until thermal equilibrium is reached. 
    According to Newton's Law of Cooling, the rate of heat loss is proportional to the temperature difference. 
    Good insulators reduce the rate of thermal energy transfer.
   </p>
   <div className={`bg-blue-50 p-3 rounded-lg flex items-start gap-2 border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 `}>
    <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
    <p className="text-xs text-blue-800 dark:text-[#ffffff]">
    <strong>Experiment:</strong> Select an insulating material and thickness. Measure the temperature of the water over 60 minutes. Compare cooling curves.
    </p>
   </div>
   </div>

   <div className="space-y-5">
   <div>
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">Insulating Material</label>
    <select 
    value={material} 
    onChange={(e) => { setMaterial(e.target.value); reset(); }}
    disabled={isRunning || time > 0}
    className={`w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg bg-slate-50 dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 flex-col `}
    >
    {Object.entries(materials).map(([key, mat]) => (
     <option key={key} value={key}>{mat.name}</option>
    ))}
    </select>
   </div>

   <div>
    <label className="flex justify-between text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">
    <span>Insulation Thickness</span>
    <span className="text-blue-600">{thickness} cm</span>
    </label>
    <input 
    type="range" min="0" max="10" step="1" 
    value={thickness} 
    onChange={(e) => { setThickness(Number(e.target.value)); reset(); }}
    disabled={isRunning || time > 0 || material === 'None'}
    className="w-full accent-blue-600"
    />
   </div>

   <div>
    <label className="flex justify-between text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">
    <span>Initial Water Temperature</span>
    <span className="text-blue-600">{initialTemp} °C</span>
    </label>
    <input 
    type="range" min="40" max="100" step="5" 
    value={initialTemp} 
    onChange={(e) => { setInitialTemp(Number(e.target.value)); reset(); }}
    disabled={isRunning || time > 0}
    className="w-full accent-blue-600"
    />
   </div>
   </div>
   
   <div className="mt-auto">
   <h3 className="text-sm font-bold text-slate-800 dark:text-[#ffffff] mb-2">Analysis Task</h3>
   <p className="text-xs text-slate-600 dark:text-[#a1a1aa] mb-3">
    Run the experiment and record data. Calculate the <strong>average rate of cooling</strong> (°C/min) during the first 10 minutes.
   </p>
   <div className="flex gap-2">
    <input 
    type="number" step="0.1"
    placeholder="e.g. 1.5"
    value={studentAnswer}
    onChange={(e) => setStudentAnswer(e.target.value)}
    className="flex-1 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg text-sm"
    />
    <button 
    onClick={checkAnswer}
    className={`px-4 py-2 bg-[#121212] dark:bg-[#121212] text-white rounded-lg text-sm font-medium hover:bg-slate-700 dark:bg-[#121212] flex-col `}
    >
    Check
    </button>
   </div>
   {isCorrect === true && <p className="text-green-600 text-xs mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Correct! Excellent calculation.</p>}
   {isCorrect === false && <p className="text-red-500 text-xs mt-2">Incorrect. Hint: Rate = (Change in Temp) / Time.</p>}
   </div>
  </div>

  {/* Column 2: Simulation */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col items-center justify-between ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="w-full flex justify-between items-center mb-4">
    <div className={`text-center bg-slate-100 dark:bg-[#121212] px-4 py-2 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    <p className="text-xs text-slate-500 dark:text-[#71717a] uppercase font-bold tracking-wider">Clock Time</p>
    <p className="text-2xl font-mono text-slate-800 dark:text-[#ffffff]">{time.toString().padStart(2, '0')}:00</p>
    </div>
    <div className="text-center bg-slate-100 dark:bg-[#121212] px-4 py-2 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <p className="text-xs text-slate-500 dark:text-[#71717a] uppercase font-bold tracking-wider">Thermometer</p>
    <p className="text-2xl font-mono text-blue-600">{temperature.toFixed(1)} °C</p>
    </div>
   </div>

   <div className="relative flex-1 w-full flex items-center justify-center">
   <svg viewBox="0 0 200 300" className="w-full max-h-full max-w-[250px] drop-shadow-xl">
    <defs>
    <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
     {/* Color transitions from red (hot) to blue (cold) based on temp */}
     <stop offset="0%" stopColor={`hsl(${240 - ((temperature - 20) / 80) * 240}, 80%, 60%)`} />
     <stop offset="100%" stopColor={`hsl(${240 - ((temperature - 20) / 80) * 240}, 80%, 40%)`} />
    </linearGradient>
    <pattern id="bubblePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
     <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
     <circle cx="6" cy="6" r="2" fill="rgba(255,255,255,0.6)" />
    </pattern>
    <pattern id="newsPattern" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
     <text x="2" y="10" fontSize="8" fill="rgba(0,0,0,0.2)" fontFamily="serif">NEWS</text>
     <text x="18" y="18" fontSize="6" fill="rgba(0,0,0,0.2)" fontFamily="serif">Text</text>
    </pattern>
    <pattern id="foamPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
     <circle cx="5" cy="5" r="3" fill="rgba(0,0,0,0.05)" />
    </pattern>
    </defs>

    {/* Base Table */}
    <rect x="10" y="270" width="180" height="10" fill="#94a3b8" rx="2" />

    {/* Insulation Layer */}
    {material !== 'None' && (
    <rect 
     x={50 - thickness * 2} 
     y={100 - thickness} 
     width={100 + thickness * 4} 
     height={170 + thickness} 
     rx="10" 
     fill={materials[material].color} 
    />
    )}
    {material === 'BubbleWrap' && (
    <rect x={50 - thickness * 2} y={100 - thickness} width={100 + thickness * 4} height={170 + thickness} rx="10" fill="url(#bubblePattern)" />
    )}
    {material === 'Newspaper' && (
    <rect x={50 - thickness * 2} y={100 - thickness} width={100 + thickness * 4} height={170 + thickness} rx="10" fill="url(#newsPattern)" />
    )}
    {material === 'Foam' && (
    <rect x={50 - thickness * 2} y={100 - thickness} width={100 + thickness * 4} height={170 + thickness} rx="10" fill="url(#foamPattern)" />
    )}

    {/* Beaker Glass */}
    <path d="M50 80 L50 260 A 10 10 0 0 0 60 270 L140 270 A 10 10 0 0 0 150 260 L150 80" fill="none" stroke="#cbd5e1" strokeWidth="4" />
    
    {/* Water Content */}
    <path d="M52 120 L52 260 A 8 8 0 0 0 60 268 L140 268 A 8 8 0 0 0 148 260 L148 120 Z" fill="url(#waterGrad)" opacity="0.9" />

    {/* Thermometer Probe */}
    <rect x="95" y="30" width="10" height="200" fill="#e2e8f0" rx="5" />
    <circle cx="100" cy="230" r="12" fill="#ef4444" />
    <rect x="98" y={230 - (temperature / 100) * 180} width="4" height={(temperature / 100) * 180} fill="#ef4444" />
    
    {/* Beaker Markings */}
    <line x1="135" y1="140" x2="145" y2="140" stroke="#cbd5e1" strokeWidth="2" />
    <line x1="135" y1="180" x2="145" y2="180" stroke="#cbd5e1" strokeWidth="2" />
    <line x1="135" y1="220" x2="145" y2="220" stroke="#cbd5e1" strokeWidth="2" />

    {/* Heat waves emitting if hot & poor insulation */}
    {temperature > 40 && material === 'None' && time % 2 === 0 && (
    <g stroke="#ef4444" strokeWidth="2" fill="none" opacity="0.5">
     <path d="M30 180 Q 20 160 30 140 T 30 100" />
     <path d="M170 180 Q 180 160 170 140 T 170 100" />
    </g>
    )}
   </svg>
   </div>

   <div className="flex gap-4 mt-4 w-full justify-center flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <button 
    onClick={() => setIsRunning(!isRunning)}
    disabled={time >= 60}
    className={`flex flex-1 items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all ${ isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700' } disabled:opacity-50`}
   >
    {isRunning ? <><Pause className="w-5 h-5"/> Pause</> : <><Play className="w-5 h-5"/> {time === 0 ? 'Start' : 'Resume'}</>}
   </button>
   <button 
    onClick={handleRecord}
    className="flex flex-1 items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 transition-all"
   >
    <Plus className="w-5 h-5"/> Record
   </button>
   </div>
  </div>

  {/* Column 3: Data & Graph */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col gap-4">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Results & Graph</h2>
   
   <div className="h-48 border border-slate-200 dark:border-[#1c1b1b] rounded-lg lg:overflow-y-auto bg-slate-50 dark:bg-[#121212]">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-100 dark:bg-[#121212] sticky top-0 shadow-sm">
    <tr>
     <th className="px-4 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">Time (min)</th>
     <th className="px-4 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">Temperature (°C)</th>
    </tr>
    </thead>
    <tbody>
    {dataLog.length === 0 ? (
     <tr><td colSpan={2} className="px-4 py-8 text-center text-slate-400 italic">No data recorded yet. Record points to plot graph.</td></tr>
    ) : (
     dataLog.map((row, i) => (
     <tr key={i} className="border-b border-slate-100 hover:bg-slate-100 dark:bg-[#121212] transition-colors">
      <td className="px-4 py-1.5 font-mono text-slate-600 dark:text-[#a1a1aa]">{row.t}</td>
      <td className="px-4 py-1.5 font-mono text-blue-600">{row.T.toFixed(1)}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

   <div className="flex-1 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-4 relative min-h-[250px]">
    {/* Graph SVG */}
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
    {/* Grid */}
    {[0, 20, 40, 60, 80, 100].map(y => (
     <line key={`hy-${y}`} x1="0" y1={100 - y} x2="100" y2={100 - y} stroke="#e2e8f0" strokeWidth="0.5" />
    ))}
    {[0, 10, 20, 30, 40, 50, 60].map(x => (
     <line key={`vx-${x}`} x1={(x/60)*100} y1="0" x2={(x/60)*100} y2="100" stroke="#e2e8f0" strokeWidth="0.5" />
    ))}

    {/* Axes */}
    <line x1="0" y1="100" x2="100" y2="100" stroke="#64748b" strokeWidth="1" />
    <line x1="0" y1="0" x2="0" y2="100" stroke="#64748b" strokeWidth="1" />

    {/* Labels */}
    <text x="50" y="115" fontSize="4" textAnchor="middle" fill="#64748b">Time (min)</text>
    <text x="-5" y="50" fontSize="4" textAnchor="middle" fill="#64748b" transform="rotate(-90 -5 50)">Temp (°C)</text>

    {/* Data Points */}
    {dataLog.map((pt, i) => {
     const cx = (pt.t / 60) * 100;
     const cy = 100 - (pt.T / 100) * 100;
     return (
     <circle key={i} cx={cx} cy={cy} r="1.5" fill="#2563eb" className="animate-pulse" />
     );
    })}

    {/* Connecting Line */}
    {dataLog.length > 1 && (
     <polyline 
     points={dataLog.map(pt => `${(pt.t / 60) * 100},${100 - (pt.T / 100) * 100}`).join(' ')} 
     fill="none" 
     stroke="#3b82f6" 
     strokeWidth="1" 
     opacity="0.6"
     />
    )}
    </svg>
   </div>

  </div>
  </div>
 </div>
 );
}
