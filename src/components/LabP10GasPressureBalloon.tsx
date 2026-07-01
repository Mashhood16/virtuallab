import { useState } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, ClipboardList } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit?: () => void;
}

export default function LabP10GasPressureBalloon({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // --- Constants and Types ---
 // V = k * T, where T is in Kelvin.
 // We can assume P is constant atmospheric pressure (1 atm).
 
 const [targetTemp, setTargetTemp] = useState<number>(20); // Celsius
 const [gasMoles, setGasMoles] = useState<number>(1); // Relative amount
 
 const [isRunning, setIsRunning] = useState(false);
 const [time, setTime] = useState(0);

 // Transient state
 const [bathTemp, setBathTemp] = useState(20);
 const [gasTemp, setGasTemp] = useState(20); // Celsius
 const [syringeVolume, setSyringeVolume] = useState(29.3); // ml (calculated for 20C, 1 mole equiv)

 // Data logging
 const [logs, setLogs] = useState<{ t: number; v: number }[]>([]);

 // Assessment
 const [answer, setAnswer] = useState('');
 const [feedback, setFeedback] = useState<string | null>(null);

 // --- Simulation Logic ---
 const tauBath = 3; // seconds
 const tauGas = 5; // seconds

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
  const newTime = prev + dt;
  
  // Temperature transitions
  setBathTemp(prevBath => {
   const diff = targetTemp - prevBath;
   return prevBath + diff * (1 - Math.exp(-dt / tauBath));
  });

  setGasTemp(prevGas => {
   const diff = bathTemp - prevGas;
   return prevGas + diff * (1 - Math.exp(-dt / tauGas));
  });
  
  return newTime;
  });

  animationRef.current = requestAnimationFrame(update);
 };

 animationRef.current = requestAnimationFrame(update);
 return () => {
  if (animationRef.current) cancelAnimationFrame(animationRef.current);
 };
 }, [isRunning, targetTemp, bathTemp]);

 // Update volume based on Charles's Law (V = k * T)
 // T in Kelvin = gasTemp + 273.15
 // V = moles * R * T / P => let's just say V0 = 10 * moles at 0C (273.15K)
 useEffect(() => {
 const T_kelvin = gasTemp + 273.15;
 const k = 10 * gasMoles / 273.15; // V at 0C is 10 * moles
 let theoreticalV = k * T_kelvin;
 
 // Add realistic stiction / friction to the syringe
 // It only moves if difference > 0.2 ml
 setSyringeVolume(prevV => {
  const diff = theoreticalV - prevV;
  if (Math.abs(diff) > 0.2) {
  return prevV + diff * 0.1; // Smooth movement
  }
  return prevV; // Stuck
 });
 }, [gasTemp, gasMoles]);

 const reset = () => {
 setIsRunning(false);
 setTime(0);
 setBathTemp(20);
 setGasTemp(20);
 setTargetTemp(20);
 setGasMoles(1);
 setSyringeVolume(29.3); // roughly at 20C for 1 mole
 setLogs([]);
 setFeedback(null);
 };

 const recordData = () => {
 setLogs([...logs, { t: parseFloat(gasTemp.toFixed(1)), v: parseFloat(syringeVolume.toFixed(1)) }]);
 };

 const checkAnswer = () => {
 const val = parseFloat(answer);
 if (isNaN(val)) {
  setFeedback("Please enter a valid number.");
  return;
 }
 // Expected intercept is absolute zero (-273.15 C)
 const expected = -273.15;
 const err = Math.abs(val - expected);
 if (err < 10) { // Accept within 10 degrees error
  setFeedback("Correct! The extrapolated graph points to Absolute Zero.");
 } else {
  setFeedback(`Incorrect. Try plotting Volume vs Temp and finding the x-intercept.`);
 }
 };

 // UI mapping for syringe
 const maxV = 60;
 const syringeWidthPercent = (syringeVolume / maxV) * 100;

 return (
 <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  {/* Header */}
  <LabHeader onExit={onExit} title="Unit 11: Charles's Law (Volume and Temperature)" subtitle="Investigate the relationship between gas volume and temperature at constant pressure." />

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
    <strong>Charles's Law</strong> states that the volume of an ideal gas is directly proportional to its absolute temperature, assuming constant pressure.
    </p>
    <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-sm font-mono text-slate-700 dark:text-[#ffffff] space-y-1 flex-col `}>
    <p>V ∝ T</p>
    <p>V / T = constant</p>
    <p>V = V₀(1 + αT_celsius)</p>
    </div>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mt-2">
    By extrapolating the Volume vs Temperature graph to V = 0, we can estimate absolute zero.
    </p>
   </div>

   <div className="flex-1">
    <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-3">Setup Parameters</h2>
    <div className="space-y-6">
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">Gas Amount (Moles)</label>
     <span className="text-sm font-mono text-slate-500 dark:text-[#71717a]">{gasMoles.toFixed(1)}</span>
     </div>
     <input 
     type="range" min="0.5" max="2.0" step="0.1" 
     value={gasMoles} 
     onChange={(e) => {
      setGasMoles(parseFloat(e.target.value));
      reset();
     }}
     disabled={isRunning && time > 0}
     className="w-full"
     />
     <p className="text-xs text-slate-400 mt-1">Changing amount resets experiment.</p>
    </div>

    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">Bath Temperature</label>
     <span className="text-sm font-mono text-slate-500 dark:text-[#71717a]">{targetTemp}°C</span>
     </div>
     <input 
     type="range" min="-20" max="100" step="5" 
     value={targetTemp} 
     onChange={(e) => setTargetTemp(parseInt(e.target.value))}
     className="w-full"
     />
     <div className="flex justify-between text-xs text-slate-400 mt-1">
     <span>-20°C (Ice/Salt)</span>
     <span>100°C (Boiling)</span>
     </div>
    </div>
    </div>
   </div>

   <div className={`bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
    <div className="text-sm font-bold text-blue-900 dark:text-[#ffffff]">Simulation Time</div>
    <div className="font-mono text-blue-800 text-lg dark:text-[#ffffff]">{time.toFixed(1)}s</div>
   </div>
   </div>

   {/* Column 2: Simulation */}
   <div className={`bg-[#000000] dark:bg-[#121212] lg:dark:bg-[#121212] rounded-2xl shadow-inner border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-4 flex flex-col relative overflow- lg:h-full lg:min-h-[35vh] lg:min-h-[400px] ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="absolute top-4 left-4 z-10 flex gap-2">
    <button 
    onClick={() => setIsRunning(!isRunning)}
    className={`p-3 rounded-full flex items-center justify-center transition-colors ${isRunning ? 'bg-amber-500 hover:bg-amber-400' : 'bg-emerald-500 hover:bg-emerald-400'}`}
    >
    {isRunning ? <Pause fill="white" className="w-5 h-5 text-white" /> : <Play fill="white" className="w-5 h-5 text-white" />}
    </button>
   </div>
   
   <div className={`absolute top-4 right-4 text-white text-xs font-mono text-right bg-black/50 p-2 rounded flex-col `}>
    <div>Bath Temp: {bathTemp.toFixed(1)}°C</div>
    <div>Gas Temp: {gasTemp.toFixed(1)}°C</div>
    <div>Gas Volume: {syringeVolume.toFixed(1)} mL</div>
   </div>

   <div className="flex-1 w-full flex flex-col items-center justify-center relative p-8">
    
    {/* Syringe Setup */}
    <div className="w-full max-w-sm relative z-20 h-24 mb-10 mt-10">
    {/* Syringe barrel */}
    <div className={`absolute top-0 left-0 w-full h-16 bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212]/10 border-2 border-white/30 rounded-l-md flex items-center p-1 overflow- backdrop-blur-sm flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
     {/* Gas inside */}
     <div 
     className="h-full bg-blue-300/30 transition-all duration-300 ease-out flex items-center justify-end border-r-2 border-[#1c1b1b] dark:border-[#1c1b1b]/50"
     style={{ width: `${Math.min(100, syringeWidthPercent)}%` }}
     >
     {/* Gas Particles (visual only) */}
     <div className="absolute inset-0 overflow-hidden opacity-50">
      {[...Array(Math.floor(20 * gasMoles))].map((_, i) => (
      <div key={i} className="absolute w-1 h-1 bg-slate-50 dark:bg-[#121212] rounded-full animate-ping"
        style={{ 
        top: `${10 + Math.random() * 80}%`, 
        left: `${5 + Math.random() * Math.min(90, syringeWidthPercent - 5)}%`,
        animationDuration: `${1 + Math.random()}s`
        }} 
      />
      ))}
     </div>
     </div>
     
     {/* Piston */}
     <div 
     className="absolute h-[80%] bg-zinc-800 border-2 border-zinc-900 rounded-sm shadow-md flex items-center justify-center transition-all duration-300 ease-out"
     style={{ width: '12px', left: `${Math.min(96, syringeWidthPercent)}%`, top: '10%' }}
     >
      <div className="w-full h-full bg-slate-600 dark:bg-[#121212] rounded-sm shadow-inner" />
     </div>
     {/* Piston Rod */}
     <div 
     className="absolute h-2 bg-zinc-400 border-y border-zinc-500 transition-all duration-300 ease-out"
     style={{ 
      width: `${100 - syringeWidthPercent}%`, 
      left: `${Math.min(96, syringeWidthPercent) + 2}%`, 
      top: 'calc(50% - 4px)' 
     }}
     />
    </div>
    
    {/* Markings */}
    <div className="absolute top-16 left-0 w-full h-6 flex pt-1">
     {[...Array(7)].map((_, i) => (
     <div key={i} className="flex-1 border-l border-white/30 pl-1 text-[10px] text-white/50">
      {(i * 10).toFixed(0)}
     </div>
     ))}
    </div>
    </div>

    {/* Water Bath */}
    <div className="absolute bottom-0 w-[120%] h-48 bg-blue-500/20 border-t-2 border-blue-400/30 backdrop-blur-md rounded-t-[50%] flex items-end justify-center pb-4 transition-colors duration-1000 /20 dark:border-teal-900 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40" style={{
    backgroundColor: bathTemp < 0 ? 'rgba(59, 130, 246, 0.4)' : bathTemp > 60 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.2)'
    }}>
    {/* Heat/Cold waves */}
    {bathTemp > 40 && <div className="absolute inset-0 bg-red-500/20 animate-pulse rounded-t-[50%]" />}
    {bathTemp < 10 && <div className="absolute inset-0 bg-slate-50 dark:bg-[#121212]/20 rounded-t-[50%] border-t-[4px] border-white/50" />}
    
    <div className="text-white/60 font-bold text-xl uppercase tracking-widest">
     Water Bath ({bathTemp.toFixed(1)}°C)
    </div>
    </div>

   </div>
   </div>

   {/* Column 3: Data & Analysis */}
   <div className="bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col gap-4 lg:overflow-y-auto">
   <div className="flex items-center justify-between border-b pb-2">
    <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Data Recording</h2>
    <button 
    onClick={recordData}
    disabled={Math.abs(gasTemp - bathTemp) > 0.5} // disable if not in thermal eq
    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    title={Math.abs(gasTemp - bathTemp) > 0.5 ? "Wait for thermal equilibrium" : ""}
    >
    <ClipboardList className="w-4 h-4" /> Record Data
    </button>
   </div>

   <div className="max-h-40 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
    <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0">
     <tr>
     <th className="px-4 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">Temperature (°C)</th>
     <th className="px-4 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">Volume (mL)</th>
     </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
     {logs.length === 0 ? (
     <tr><td colSpan={2} className="px-4 py-4 text-center text-slate-400">No data recorded. Adjust temp and record.</td></tr>
     ) : (
     logs.map((log, i) => (
      <tr key={i} className="hover:bg-slate-50 dark:bg-[#121212]">
      <td className="px-4 py-2">{log.t}</td>
      <td className="px-4 py-2">{log.v.toFixed(1)}</td>
      </tr>
     ))
     )}
    </tbody>
    </table>
   </div>

   {/* Graph area: V vs T */}
   <div className="flex-1 bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b] p-4 relative min-h-[150px]">
    <div className="absolute -left-8 top-1/2 -rotate-90 text-xs font-bold text-slate-500 dark:text-[#71717a]">Volume (mL)</div>
    <div className="absolute bottom-1 w-full text-center text-xs font-bold text-slate-500 dark:text-[#71717a]">Temperature (°C)</div>
    
    <svg className="w-full h-[calc(100%-20px)] overflow-visible" viewBox="-300 0 400 100" preserveAspectRatio="none">
     {/* X Axis Range: -300 to 100 -> total width 400 */}
     {/* Grid for Y */}
     {[0, 25, 50, 75, 100].map(y => <line key={`hy${y}`} x1="-300" y1={y} x2="100" y2={y} stroke="#e2e8f0" strokeWidth="1" />)}
     {/* Grid for X */}
     {[-300, -200, -100, 0, 100].map(x => (
     <g key={`hx${x}`}>
      <line x1={x} y1="0" x2={x} y2="100" stroke="#e2e8f0" strokeWidth="1" />
      <text x={x} y="110" fontSize="8" fill="#94a3b8" textAnchor="middle">{x}</text>
     </g>
     ))}
     
     {/* Y Axis line at x=0 */}
     <line x1="0" y1="0" x2="0" y2="100" stroke="#94a3b8" strokeWidth="2" />
     
     {/* Points */}
     {logs.map((log, i) => {
     const cx = log.t;
     const cy = 100 - (log.v / maxV) * 100;
     return <circle key={i} cx={cx} cy={cy} r="3" fill="#2563eb" />;
     })}
     
     {/* Line of best fit */}
     {logs.length > 1 && (() => {
     const n = logs.length;
     const sumX = logs.reduce((sum, l) => sum + l.t, 0);
     const sumY = logs.reduce((sum, l) => sum + l.v, 0);
     const sumXY = logs.reduce((sum, l) => sum + l.t * l.v, 0);
     const sumX2 = logs.reduce((sum, l) => sum + l.t * l.t, 0);
     const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
     const b = (sumY - m * sumX) / n;
     
     const x1 = -300, y1 = m * x1 + b;
     const x2 = 100, y2 = m * x2 + b;
     
     const svgY1 = 100 - (y1 / maxV) * 100;
     const svgY2 = 100 - (y2 / maxV) * 100;
     
     return <line x1={x1} y1={svgY1} x2={x2} y2={svgY2} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4" />;
     })()}
    </svg>
   </div>

   {/* Assessment */}
   <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h3 className="font-bold text-indigo-900 text-sm mb-2 dark:text-[#ffffff]">Analysis</h3>
    <p className="text-xs text-indigo-800 mb-3 dark:text-[#ffffff]">
    Extrapolate your Volume vs. Temperature (°C) graph backwards to where Volume is zero. Enter your estimate for absolute zero (°C).
    </p>
    <div className="flex gap-2">
    <input 
     type="text" 
     value={answer}
     onChange={(e) => setAnswer(e.target.value)}
     placeholder="e.g., -270"
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
