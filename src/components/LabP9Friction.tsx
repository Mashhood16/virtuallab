import { useState, useEffect, useRef } from 'react';
import { Info, Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP9Friction({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [mass, setMass] = useState<number>(2);
 const [mode, setMode] = useState<'sliding' | 'rolling' | 'unknown'>('sliding');
 const [pulling, setPulling] = useState<boolean>(false);
 const [time, setTime] = useState<number>(0);
 const [unknownMuS, setUnknownMuS] = useState<number>(0.5);
 const [logs, setLogs] = useState<{ mode: string, mass: number, peak: string, kinetic: string }[]>([]);

 const [userMu, setUserMu] = useState<string>('');
 const [assessmentResult, setAssessmentResult] = useState<'none' | 'correct' | 'incorrect'>('none');

 const noise = useRef<number>(1);

 useEffect(() => {
  setUnknownMuS(0.3 + Math.random() * 0.5); // 0.3 to 0.8
  noise.current = 1 + (Math.random() * 0.04 - 0.02);
 }, []);

 const mu_s = mode === 'sliding' ? 0.4 : mode === 'rolling' ? 0.08 : unknownMuS;
 const mu_k = mode === 'sliding' ? 0.3 : mode === 'rolling' ? 0.05 : unknownMuS * 0.75;

 const F_max = mu_s * mass * 9.8 * noise.current;
 const F_k = mu_k * mass * 9.8 * noise.current;

 const pullRate = 5; // N/s
 const t_break = F_max / pullRate;

 useEffect(() => {
  let timer: number;
  if (pulling) {
   timer = window.setInterval(() => {
    setTime(t => {
     if (t > t_break + 4) {
      setPulling(false);
      return t;
     }
     return t + 0.05;
    });
   }, 50);
  }
  return () => clearInterval(timer);
 }, [pulling, t_break]);

 const handleReset = () => {
  setPulling(false);
  setTime(0);
  noise.current = 1 + (Math.random() * 0.04 - 0.02);
 };

 const handleRecord = () => {
  setLogs(prev => [...prev, {
   mode,
   mass,
   peak: F_max.toFixed(2),
   kinetic: F_k.toFixed(2)
  }]);
 };

 const checkMu = () => {
  const mu = parseFloat(userMu);
  if (!isNaN(mu) && Math.abs(mu - unknownMuS) < 0.05) {
   setAssessmentResult('correct');
  } else {
   setAssessmentResult('incorrect');
  }
 };

 const currentForce = time === 0 ? 0 : (time < t_break ? time * pullRate : F_k);
 const blockX = time < t_break ? 0 : 50 * (time - t_break);

 const drawPath = () => {
  let path = `M 0,0 `;
  if (time < t_break) {
   path += `L ${time * 30},${-(time * pullRate) * 7}`;
  } else {
   path += `L ${t_break * 30},${-F_max * 7} `;
   path += `L ${(t_break + 0.1) * 30},${-F_k * 7} `;
   path += `L ${Math.min(time, t_break + 4) * 30},${-F_k * 7}`;
  }
  return path;
 };

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="Friction Lab" subtitle="Investigate Static, Kinetic, and Rolling Friction" />

   
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:min-h-0 overflow-y-auto lg:overflow-visible">
    {/* Column 1: Setup */}
    <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-5 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b]  ? 'block' : 'hidden'} lg:block`}>
     <div className="flex items-center gap-2 mb-4">
      <Info className="w-5 h-5 text-blue-600" />
      <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">1. Setup & Theory</h2>
     </div>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
      Friction is the force resisting the relative motion of solid surfaces. 
      <strong> Static friction</strong> must be overcome to start moving. Once moving, a lower <strong>kinetic friction</strong> applies. 
      <strong> Rolling friction</strong> is generally much less than sliding friction.
     </p>

     <div className="space-y-6">
      <div>
       <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Block Mass: {mass} kg</label>
       <input
        type="range"
        min="1" max="5" step="0.5"
        value={mass}
        onChange={(e) => { setMass(parseFloat(e.target.value)); handleReset(); }}
        className="w-full"
        disabled={pulling}
       />
      </div>

      <div>
       <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Surface Mode</label>
       <select
        value={mode}
        onChange={(e) => { setMode(e.target.value as any); handleReset(); }}
        className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-blue-500"
        disabled={pulling}
       >
        <option value="sliding">Wood on Wood (Sliding)</option>
        <option value="rolling">Wood on Pencils (Rolling)</option>
        <option value="unknown">Unknown Material (Sliding)</option>
       </select>
      </div>

      <div className="flex gap-2">
       <button
        onClick={() => setPulling(true)}
        disabled={pulling || time > 0}
        className={`flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 `}
       >
        <Play className="w-4 h-4" /> Start Pulling
       </button>
       <button
        onClick={handleReset}
        className={`px-4 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-md hover:bg-slate-300 dark:bg-[#121212] flex items-center justify-center flex-col `}
       >
        <RotateCcw className="w-4 h-4" />
       </button>
      </div>
      <button
       onClick={handleRecord}
       disabled={time < t_break + 1}
       className={`w-full border-2 border-emerald-500 text-emerald-600 py-2 rounded-md hover:bg-emerald-50 disabled:opacity-50 font-medium flex-col `}
      >
       Record Max & Kinetic Forces
      </button>
     </div>
    </div>

    {/* Column 2: Simulation */}
    <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-5 lg: border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4">2. Interactive Simulation</h2>
     <div className={`flex-1 border rounded-lg bg-slate-50 dark:bg-[#121212] relative flex flex-col justify-between lg:overflow- `}>
      <svg viewBox="0 0 400 450" className="w-full h-full">
       {/* Table */}
       <rect x="0" y="150" width="400" height="50" fill="#d97706" />
       
       {/* Block */}
       <rect x={50 + blockX} y="110" width="80" height="40" fill="#3b82f6" rx="4" />
       
       {/* Rollers */}
       {mode === 'rolling' && (
        <>
         <circle cx={70 + blockX} cy="145" r="5" fill="#64748b" />
         <circle cx={110 + blockX} cy="145" r="5" fill="#64748b" />
        </>
       )}
       
       {/* Spring Balance */}
       <line x1={130 + blockX} y1="130" x2={200 + blockX} y2="130" stroke="#475569" strokeWidth="3" />
       <rect x={200 + blockX} y="120" width="60" height="20" fill="#e2e8f0" stroke="#64748b" rx="2" />
       <text x={230 + blockX} y="134" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#0f172a">
        {currentForce.toFixed(1)} N
       </text>

       {/* Graph Area */}
       <g transform="translate(40, 400)">
        {/* Axes */}
        <line x1="0" y1="0" x2="340" y2="0" stroke="black" strokeWidth="2" />
        <text x="310" y="-10" fontSize="12" fill="#475569">Time (s)</text>
        <line x1="0" y1="0" x2="0" y2="-180" stroke="black" strokeWidth="2" />
        <text x="10" y="-170" fontSize="12" fill="#475569">Force (N)</text>

        {/* Y-axis ticks */}
        <line x1="-3" y1="-70" x2="0" y2="-70" stroke="black" />
        <text x="-20" y="-66" fontSize="10">10</text>
        <line x1="-3" y1="-140" x2="0" y2="-140" stroke="black" />
        <text x="-20" y="-136" fontSize="10">20</text>

        {/* X-axis ticks */}
        <line x1="150" y1="0" x2="150" y2="3" stroke="black" />
        <text x="148" y="15" fontSize="10">5.0</text>
        <line x1="300" y1="0" x2="300" y2="3" stroke="black" />
        <text x="295" y="15" fontSize="10">10.0</text>

        {/* Dynamic Force Path */}
        <path d={drawPath()} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinejoin="round" />
        
        {/* Current Indicator */}
        {time > 0 && (
         <circle cx={Math.min(time, t_break + 4) * 30} cy={-currentForce * 7} r="4" fill="#ef4444" />
        )}
       </g>
      </svg>
     </div>
    </div>

    {/* Column 3: Analysis */}
    <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-5 lg: border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4">3. Data & Analysis</h2>
     
     <div className="overflow-x-auto mb-6">
      <table className="w-full text-sm text-left border-collapse">
       <thead className="bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff]">
        <tr>
         <th className="p-2 border">Mode</th>
         <th className="p-2 border">Mass (kg)</th>
         <th className="p-2 border">Peak (N)</th>
         <th className="p-2 border">Kinetic (N)</th>
        </tr>
       </thead>
       <tbody>
        {logs.length === 0 ? (
         <tr><td colSpan={4} className="p-4 text-center text-slate-500 dark:text-[#71717a]">No data recorded yet.</td></tr>
        ) : (
         logs.map((log, i) => (
          <tr key={i} className="hover:bg-slate-50 dark:bg-[#121212]">
           <td className="p-2 border capitalize">{log.mode}</td>
           <td className="p-2 border">{log.mass}</td>
           <td className="p-2 border">{log.peak}</td>
           <td className="p-2 border">{log.kinetic}</td>
          </tr>
         ))
        )}
       </tbody>
      </table>
     </div>

     <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900">
      <h3 className="font-semibold text-blue-900 mb-2 dark:text-[#ffffff]">Assessment</h3>
      <p className="text-sm text-blue-800 mb-4 dark:text-[#ffffff]">
       Select the "Unknown Material" mode, run the simulation, and record the Peak Force. 
       Calculate its coefficient of static friction (<span className="italic">μ<sub>s</sub></span>). 
       <br/><span className="text-xs">(Assume g = 9.8 m/s²)</span>
      </p>
      
      <div className="flex gap-2 mb-2">
       <input 
        type="number" 
        placeholder="Enter μs..."
        value={userMu}
        onChange={(e) => setUserMu(e.target.value)}
        className="flex-1 p-2 border rounded-md"
       />
       <button 
        onClick={checkMu}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
       >
        Check
       </button>
      </div>
      
      {assessmentResult === 'correct' && (
       <div className="flex items-center gap-2 text-emerald-600 text-sm mt-2">
        <CheckCircle className="w-4 h-4" /> Correct! Excellent calculation.
       </div>
      )}
      {assessmentResult === 'incorrect' && (
       <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
        <XCircle className="w-4 h-4" /> Incorrect. Use formula: μs = Peak Force / (Mass × 9.8)
       </div>
      )}
     </div>
    </div>
   </div>
  </div>
 );
}
