import { useState, useEffect, useRef } from 'react';
import {Beaker, Play, Square, Info, Activity, Database, CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LoggedData {
 time: number;
 temp: number;
}

export default function LabC11EnergeticsKinetics({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [reactionType, setReactionType] = useState<'exo' | 'endo'>('exo');
 const [waterMass, setWaterMass] = useState<number>(100);
 const [reactantMass, setReactantMass] = useState<number>(5);
 
 const [time, setTime] = useState<number>(0);
 const [temperature, setTemperature] = useState<number>(25.0);
 const [isRunning, setIsRunning] = useState<boolean>(false);
 const [logs, setLogs] = useState<LoggedData[]>([]);
 
 const [userDeltaH, setUserDeltaH] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const timerRef = useRef<number | null>(null);

 const T_initial = 25.0;

 const startExperiment = () => {
 if (isRunning) return;
 setLogs([]);
 setTime(0);
 setTemperature(T_initial);
 setIsCorrect(null);
 setIsRunning(true);
 };

 const stopExperiment = () => {
 setIsRunning(false);
 };

 const resetExperiment = () => {
 setIsRunning(false);
 setTime(0);
 setTemperature(T_initial);
 setLogs([]);
 setIsCorrect(null);
 setUserDeltaH('');
 };

 useEffect(() => {
 if (isRunning) {
  timerRef.current = window.setInterval(() => {
  setTime(t => {
   const newT = t + 1;
   if (newT > 60) {
   setIsRunning(false);
   return 60;
   }
   return newT;
  });
  }, 200);
 } else if (timerRef.current !== null) {
  clearInterval(timerRef.current);
 }
 return () => {
  if (timerRef.current !== null) clearInterval(timerRef.current);
 };
 }, [isRunning]);

 useEffect(() => {
 if (time === 0) {
  setTemperature(T_initial);
  return;
 }
 
 const molarMass = reactionType === 'exo' ? 40 : 80;
 const deltaH_kJ_mol = reactionType === 'exo' ? -50 : 30; 
 const moles = reactantMass / molarMass;
 const q_J = moles * Math.abs(deltaH_kJ_mol) * 1000;
 const totalMass = waterMass + reactantMass;
 const c = 4.18; 
 const deltaT_max = q_J / (totalMass * c);
 
 const k = 0.1;
 const progress = 1 - Math.exp(-k * time);
 const cooling_k = 0.01;
 const cooling = Math.exp(-cooling_k * time);
 
 let currentT = T_initial;
 if (reactionType === 'exo') {
  currentT = T_initial + deltaT_max * progress * cooling;
 } else {
  currentT = T_initial - deltaT_max * progress; 
  currentT += (T_initial - currentT) * (1 - cooling);
 }
 
 setTemperature(currentT);
 
 }, [time, reactionType, waterMass, reactantMass, T_initial]);

 useEffect(() => {
 if (time > 0 && (time % 5 === 0 || time === 60)) {
  setLogs(prev => {
  if (prev.find(p => p.time === time)) return prev;
  return [...prev, { time, temp: Number(temperature.toFixed(1)) }];
  });
 }
 }, [time, temperature]);

 const checkAnswer = () => {
 const deltaH_kJ_mol = reactionType === 'exo' ? -50 : 30;
 const expected = deltaH_kJ_mol;
 const userAns = parseFloat(userDeltaH);
 if (!isNaN(userAns) && Math.abs(userAns - expected) <= 3) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 const renderGraph = () => {
 if (logs.length === 0) return null;
 const maxTime = 60;
 const maxTemp = reactionType === 'exo' ? 80 : 30;
 const minTemp = reactionType === 'exo' ? 20 : 10;
 const width = 300;
 const height = 150;
 
 const points = logs.map(log => {
  const x = (log.time / maxTime) * width;
  const y = height - ((log.temp - minTemp) / (maxTemp - minTemp)) * height;
  return `${x},${y}`;
 }).join(' ');

 return (
  <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40 bg-slate-50 dark:bg-[#121212] border rounded mt-4">
   <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="2" />
   {logs.map((log, i) => {
   const x = (log.time / maxTime) * width;
   const y = height - ((log.temp - minTemp) / (maxTemp - minTemp)) * height;
   return <circle key={i} cx={x} cy={y} r="3" fill="#2563eb" />;
   })}
  </svg>
 );
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Energetics & Kinetics" />

  
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
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border p-5 flex flex-col gap-4  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
   <Info size={20} className="text-blue-500" /> Theory & Setup
   </h2>
   <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-2">
   <p><strong>Calorimetry</strong> measures the heat transferred during a chemical reaction. The heat <em>q</em> is calculated using <code>q = mcΔT</code>.</p>
   <p>If the temperature rises, the reaction is <strong>Exothermic</strong> (ΔH is negative). If it falls, it is <strong>Endothermic</strong> (ΔH is positive).</p>
   </div>
   
   <div className="mt-4 space-y-4">
   <div>
    <label className="block text-sm font-semibold mb-1">Reaction Type</label>
    <select 
    disabled={isRunning || time > 0}
    className={`w-full p-2 border rounded bg-slate-50 dark:bg-[#121212] flex-col `}
    value={reactionType} 
    onChange={(e) => setReactionType(e.target.value as 'exo' | 'endo')}
    >
    <option value="exo">NaOH + HCl (Exothermic)</option>
    <option value="endo">NH4NO3 + H2O (Endothermic)</option>
    </select>
   </div>
   
   <div>
    <label className="block text-sm font-semibold mb-1">Water Mass (g): {waterMass}</label>
    <input 
    type="range" min="50" max="200" step="10" 
    value={waterMass} onChange={e => setWaterMass(Number(e.target.value))}
    disabled={isRunning || time > 0}
    className="w-full cursor-pointer"
    />
   </div>

   <div>
    <label className="block text-sm font-semibold mb-1">Reactant Mass (g): {reactantMass}</label>
    <input 
    type="range" min="1" max="20" step="1" 
    value={reactantMass} onChange={e => setReactantMass(Number(e.target.value))}
    disabled={isRunning || time > 0}
    className="w-full cursor-pointer"
    />
   </div>
   </div>
  </div>

  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border p-5 flex flex-col gap-4  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
   <Activity size={20} className="text-blue-500" /> Coffee-cup Calorimeter
   </h2>
   
   <div className={`w-full lg:flex-1 flex flex-col items-center justify-center bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] rounded-lg border p-4 relative  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className={`absolute top-2 left-2 text-xs font-mono bg-slate-50 dark:bg-[#121212] px-2 py-1 border rounded shadow-sm flex-col `}>
    Time: {time}s
   </div>
   
   <svg viewBox="0 0 200 300" className="w-full h-64 drop-shadow-md">
    <path d="M 50 100 L 60 250 Q 100 260 140 250 L 150 100 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="4"/>
    <path d="M 55 150 L 60 250 Q 100 260 140 250 L 145 150 Z" fill={reactionType === 'exo' ? "#bae6fd" : "#93c5fd"} opacity="0.8"/>
    {isRunning && (
     <circle cx="100" cy="200" r="4" fill="#3b82f6" className="animate-ping" />
    )}
    <rect x="95" y="20" width="10" height="220" rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2"/>
    <circle cx="100" cy="240" r="12" fill="#ef4444" />
    <rect x="98" y={230 - (temperature * 2)} width="4" height={10 + (temperature * 2)} fill="#ef4444" className="transition-all duration-300" />
    <text x="120" y="245" fontSize="16" fill="#334155" fontWeight="bold">{temperature.toFixed(1)} °C</text>
   </svg>
   </div>

   <div className="flex justify-center gap-3 mt-2">
   {!isRunning && time === 0 && (
    <button onClick={startExperiment} className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40 flex-col `}>
    <Play size={18} /> Start
    </button>
   )}
   {isRunning && (
    <button onClick={stopExperiment} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40">
    <Square size={18} /> Stop
    </button>
   )}
   {(time > 0 && !isRunning) && (
    <button onClick={resetExperiment} className="flex items-center gap-2 bg-slate-600 dark:bg-[#121212] hover:bg-slate-700 dark:bg-[#121212] text-white px-4 py-2 rounded-lg font-semibold transition-colors dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">
    <RefreshCw size={18} /> Reset
    </button>
   )}
   </div>
  </div>

  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border p-5 flex flex-col gap-4">
   <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
   <Database size={20} className="text-blue-500" /> Data & Analysis
   </h2>
   
   <div className="h-32 lg:overflow-y-auto border rounded bg-slate-50 dark:bg-[#121212] p-2 text-sm font-mono flex-shrink-0">
   <table className="w-full text-center">
    <thead>
    <tr className="border-b text-slate-500 dark:text-[#71717a]">
     <th className="pb-1">Time (s)</th>
     <th className="pb-1">Temp (°C)</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 && <tr><td colSpan={2} className="py-2 text-slate-400">No data logged yet</td></tr>}
    {logs.map((log, i) => (
     <tr key={i} className="border-b border-slate-200 dark:border-[#1c1b1b] last:border-0">
     <td className="py-1">{log.time}</td>
     <td>{log.temp.toFixed(1)}</td>
     </tr>
    ))}
    </tbody>
   </table>
   </div>

   {renderGraph()}

   <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-auto dark:bg-teal-950/20 dark:border-teal-900">
   <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 dark:text-[#ffffff]"><Beaker size={16}/> Calculate ΔH</h3>
   <p className="text-xs text-blue-800 mb-3 dark:text-[#ffffff]">
    Using the maximum temperature change and your inputs, calculate the enthalpy change (ΔH) in <strong>kJ/mol</strong>. Assume c = 4.18 J/(g·°C). Provide your answer as a number.
   </p>
   <div className="flex gap-2">
    <input 
    type="text" 
    placeholder="ΔH (kJ/mol)"
    className="flex-1 p-2 border rounded"
    value={userDeltaH}
    onChange={e => setUserDeltaH(e.target.value)}
    />
    <button 
    onClick={checkAnswer}
    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-semibold transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
    Check
    </button>
   </div>
   {isCorrect === true && (
    <p className="text-green-600 font-semibold flex items-center gap-1 mt-2 text-sm"><CheckCircle size={16}/> Correct! Excellent work.</p>
   )}
   {isCorrect === false && (
    <p className="text-red-600 font-semibold flex items-center gap-1 mt-2 text-sm"><XCircle size={16}/> Incorrect, check your calculations.</p>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
