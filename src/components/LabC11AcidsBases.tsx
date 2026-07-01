import { useState, useEffect, useRef } from 'react';
import {Info, Activity, Database, CheckCircle, RefreshCw, FlaskConical, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface TitrationLog {
 v: number;
 pH: number;
}

export default function LabC11AcidsBases({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [analyteVol] = useState<number>(25.0);
 const [analyteConc, setAnalyteConc] = useState<number>(0.1);
 const [titrantConc] = useState<number>(0.1);
 const [isWeakAcid, setIsWeakAcid] = useState<boolean>(false);
 
 const [volAdded, setVolAdded] = useState<number>(0);
 const [pH, setPH] = useState<number>(7.0);
 const [logs, setLogs] = useState<TitrationLog[]>([]);
 const [isAdding, setIsAdding] = useState<boolean>(false);

 const [userConc, setUserConc] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const timerRef = useRef<number | null>(null);

 const resetExperiment = () => {
 const r = 0.05 + Math.floor(Math.random() * 15) * 0.01;
 setAnalyteConc(r);
 setVolAdded(0);
 setLogs([]);
 setIsAdding(false);
 setIsCorrect(null);
 setUserConc('');
 };

 // Run on mount and when acid type changes
 useEffect(() => {
 resetExperiment();
 }, [isWeakAcid]);

 useEffect(() => {
 const calculatePH = (v: number, conc: number) => {
  const molesAcid = analyteVol * conc;
  const molesBase = v * titrantConc;
  const totalVol = analyteVol + v;
  
  if (isWeakAcid) {
  const Ka = 1.8e-5; 
  const pKa = 4.74;
  if (v === 0) {
   return 0.5 * (pKa - Math.log10(conc));
  } else if (molesBase < molesAcid) {
   return pKa + Math.log10(molesBase / (molesAcid - molesBase));
  } else if (Math.abs(molesBase - molesAcid) < 1e-4) {
   const concBase = molesAcid / totalVol;
   const Kb = 1e-14 / Ka;
   const pOH = 0.5 * (-Math.log10(Kb) - Math.log10(concBase));
   return 14 - pOH;
  } else {
   const excessBase = molesBase - molesAcid;
   return 14 + Math.log10(excessBase / totalVol);
  }
  } else {
  if (v === 0) {
   return -Math.log10(conc);
  } else if (molesBase < molesAcid) {
   const excessAcid = molesAcid - molesBase;
   return -Math.log10(excessAcid / totalVol);
  } else if (Math.abs(molesBase - molesAcid) < 1e-4) {
   return 7.0;
  } else {
   const excessBase = molesBase - molesAcid;
   return 14 + Math.log10(excessBase / totalVol);
  }
  }
 };
 
 let p = calculatePH(volAdded, analyteConc);
 if (isNaN(p) || p < 0) p = 0;
 if (p > 14) p = 14;
 setPH(p);
 }, [volAdded, analyteConc, isWeakAcid, analyteVol, titrantConc]);

 useEffect(() => {
 if (isAdding) {
  timerRef.current = window.setInterval(() => {
  setVolAdded(v => {
   const newV = v + 0.5;
   if (newV > 50) {
   setIsAdding(false);
   return 50;
   }
   return newV;
  });
  }, 100);
 } else if (timerRef.current !== null) {
  clearInterval(timerRef.current);
 }
 return () => {
  if (timerRef.current !== null) clearInterval(timerRef.current);
 };
 }, [isAdding]);

 useEffect(() => {
 setLogs(prev => {
  const last = prev[prev.length - 1];
  if (!last || Math.abs(last.v - volAdded) >= 1.0 || volAdded === 0 || volAdded >= 50) {
  return [...prev, { v: Number(volAdded.toFixed(1)), pH: Number(pH.toFixed(2)) }];
  }
  return prev;
 });
 }, [volAdded, pH]);

 const checkAnswer = () => {
 const userAns = parseFloat(userConc);
 if (!isNaN(userAns) && Math.abs(userAns - analyteConc) <= 0.02) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 const renderGraph = () => {
 if (logs.length === 0) return null;
 const maxV = 50;
 const maxPH = 14;
 const width = 300;
 const height = 150;
 
 const points = logs.map(log => {
  const x = (log.v / maxV) * width;
  const y = height - (log.pH / maxPH) * height;
  return `${x},${y}`;
 }).join(' ');

 return (
  <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40 bg-slate-50 dark:bg-[#121212] border rounded mt-4">
   {/* Grid lines */}
   <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4"/>
   
   <polyline points={points} fill="none" stroke="#ef4444" strokeWidth="2" />
   {logs.map((log, i) => {
   const x = (log.v / maxV) * width;
   const y = height - (log.pH / maxPH) * height;
   return <circle key={i} cx={x} cy={y} r="2" fill="#b91c1c" />;
   })}
  </svg>
 );
 };

 const flaskColor = pH > 8.2 ? '#fbcfe8' : '#e0f2fe';

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Acids & Bases Titration" />

  
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
  <div className="lg:flex-1 p-4 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg: overflow-y-auto lg:overflow-visible">
  {/* Column 1 */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border p-5 flex flex-col gap-4  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
   <Info size={20} className="text-pink-500" /> Theory & Setup
   </h2>
   <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-2">
   <p><strong>Titration</strong> is used to determine the concentration of an unknown acid or base.</p>
   <p>We are adding a Strong Base (NaOH) to an acid. The <strong>Equivalence Point</strong> occurs when moles of base added equals moles of acid initially present: <code>M₁V₁ = M₂V₂</code>.</p>
   </div>
   
   <div className="mt-4 space-y-4">
   <div>
    <label className="block text-sm font-semibold mb-1">Acid Type (Analyte)</label>
    <select 
    disabled={volAdded > 0}
    className={`w-full p-2 border rounded bg-slate-50 dark:bg-[#121212] flex-col `}
    value={isWeakAcid ? 'weak' : 'strong'} 
    onChange={(e) => setIsWeakAcid(e.target.value === 'weak')}
    >
    <option value="strong">HCl (Strong Acid)</option>
    <option value="weak">CH₃COOH (Weak Acid)</option>
    </select>
   </div>
   
   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border flex-col `}>
    <ul className="text-sm space-y-2">
    <li><strong>Analyte Volume:</strong> 25.0 mL</li>
    <li><strong>Titrant (NaOH):</strong> 0.1 M</li>
    <li><strong>Indicator:</strong> Phenolphthalein</li>
    </ul>
   </div>
   
   <button 
    onClick={resetExperiment} 
    className={`w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] px-4 py-2 rounded-lg font-semibold transition-colors flex-col `}
   >
    <RefreshCw size={18} /> New Unknown Sample
   </button>
   </div>
  </div>

  {/* Column 2 */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border p-5 flex flex-col gap-4  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
   <Activity size={20} className="text-pink-500" /> Burette Simulator
   </h2>
   
   <div className={`flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#121212] rounded-lg border p-4 relative `}>
   <svg viewBox="0 0 200 400" className="w-full h-80 drop-shadow-md">
    <rect x="90" y="20" width="20" height="200" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
    <rect x="92" y={20 + (volAdded * 3.6)} width="16" height={200 - (volAdded * 3.6)} fill="#bae6fd" />
    <rect x="80" y="220" width="40" height="10" fill="#64748b" />
    {isAdding && <circle cx="100" cy="240" r="3" fill="#bae6fd" className="animate-bounce" />}
    <path d="M 90 260 L 110 260 L 110 300 L 140 360 Q 150 380 100 380 Q 50 380 60 360 L 90 300 Z" fill={flaskColor} stroke="#94a3b8" strokeWidth="3" opacity="0.8" className="transition-colors duration-700" />
    <path d="M 70 340 L 130 340 L 140 360 Q 150 380 100 380 Q 50 380 60 360 Z" fill={flaskColor} opacity="0.9" className="transition-colors duration-700" />
    <text x="100" y="370" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#334155">pH: {pH.toFixed(2)}</text>
   </svg>
   </div>

   <div className="flex justify-center gap-3 mt-2">
    <button 
    onMouseDown={() => setIsAdding(true)} 
    onMouseUp={() => setIsAdding(false)} 
    onMouseLeave={() => setIsAdding(false)}
    onTouchStart={() => setIsAdding(true)}
    onTouchEnd={() => setIsAdding(false)}
    className="w-full flex justify-center items-center gap-2 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white px-4 py-3 rounded-lg font-semibold transition-colors cursor-pointer select-none dark:bg-pink-500 dark:hover:bg-pink-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-pink-500/40"
    >
    <FlaskConical size={18} /> Hold to Open Valve
    </button>
   </div>
  </div>

  {/* Column 3 */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border p-5 flex flex-col gap-4 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
   <Database size={20} className="text-pink-500" /> Data & Analysis
   </h2>
   
   <div className="h-32 lg:overflow-y-auto border rounded bg-slate-50 dark:bg-[#121212] p-2 text-sm font-mono flex-shrink-0">
   <table className="w-full text-center">
    <thead>
    <tr className="border-b text-slate-500 dark:text-[#71717a]">
     <th className="pb-1">Vol Added (mL)</th>
     <th className="pb-1">pH</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 && <tr><td colSpan={2} className="py-2 text-slate-400">No data logged</td></tr>}
    {logs.map((log, i) => (
     <tr key={i} className="border-b border-slate-200 dark:border-[#1c1b1b] last:border-0">
     <td className="py-1">{log.v}</td>
     <td>{log.pH.toFixed(2)}</td>
     </tr>
    ))}
    </tbody>
   </table>
   </div>

   {renderGraph()}

   <div className="bg-pink-50 p-4 rounded-lg border border-pink-100 mt-auto">
   <h3 className="font-semibold text-pink-900 mb-2 flex items-center gap-2"><FlaskConical size={16}/> Calculate Concentration</h3>
   <p className="text-xs text-pink-800 mb-3">
    Observe the equivalence point (steep vertical jump on graph). Calculate the unknown analyte concentration in <strong>Molar (M)</strong>.
   </p>
   <div className="flex gap-2">
    <input 
    type="text" 
    placeholder="Conc (M)"
    className="flex-1 p-2 border rounded"
    value={userConc}
    onChange={e => setUserConc(e.target.value)}
    />
    <button 
    onClick={checkAnswer}
    className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded font-semibold transition-colors dark:text-white dark:text-white dark:bg-pink-500 dark:hover:bg-pink-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-pink-500/40"
    >
    Check
    </button>
   </div>
   {isCorrect === true && (
    <p className="text-green-600 font-semibold flex items-center gap-1 mt-2 text-sm"><CheckCircle size={16}/> Correct!</p>
   )}
   {isCorrect === false && (
    <p className="text-red-600 font-semibold flex items-center gap-1 mt-2 text-sm"><XCircle size={16}/> Incorrect. Recheck M₁V₁ = M₂V₂.</p>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
