import { useState, useEffect, useRef } from 'react';
import {Play, Pause, Activity, Table2, Info, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

interface Atom {
 id: number;
 decayed: boolean;
 x: number;
 y: number;
}

interface DataPoint {
 time: number;
 active: number;
}

export default function LabP10HalfLife({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const TICK_RATE_MS = 100;
 
 const [halfLife, setHalfLife] = useState(5);
 const [initialAtoms, setInitialAtoms] = useState(400);
 
 const [atoms, setAtoms] = useState<Atom[]>([]);
 const [running, setRunning] = useState(false);
 const [time, setTime] = useState(0); // in seconds
 const [loggedData, setLoggedData] = useState<DataPoint[]>([]);
 
 const [assessmentAns, setAssessmentAns] = useState('');
 const [assessmentStatus, setAssessmentStatus] = useState<null | 'correct' | 'incorrect'>(null);

 const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
 const lastLoggedTimeRef = useRef(-1);

 const initAtoms = () => {
 const newAtoms: Atom[] = [];
 for (let i = 0; i < initialAtoms; i++) {
  newAtoms.push({
  id: i,
  decayed: false,
  x: Math.random() * 96 + 2, // 2% to 98%
  y: Math.random() * 96 + 2
  });
 }
 setAtoms(newAtoms);
 setTime(0);
 setRunning(false);
 setLoggedData([{ time: 0, active: initialAtoms }]);
 lastLoggedTimeRef.current = 0;
 };

 // Initialize on mount or when sliders change (only if not running and time=0)
 useEffect(() => {
 if (!running && time === 0) {
  initAtoms();
 }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [initialAtoms, halfLife]);

 const decayProbPerTick = 1 - Math.exp(-(0.693147 / halfLife) * (TICK_RATE_MS / 1000));

 useEffect(() => {
 if (running) {
  timerRef.current = setInterval(() => {
  setTime(prev => {
   const nextTime = prev + TICK_RATE_MS / 1000;
   return Number(nextTime.toFixed(1));
  });
  setAtoms(currentAtoms => {
   let stateChanged = false;
   const nextAtoms = currentAtoms.map(atom => {
   if (!atom.decayed && Math.random() < decayProbPerTick) {
    stateChanged = true;
    return { ...atom, decayed: true };
   }
   return atom;
   });
   return stateChanged ? nextAtoms : currentAtoms;
  });
  }, TICK_RATE_MS);
 } else if (timerRef.current) {
  clearInterval(timerRef.current);
 }
 return () => {
  if (timerRef.current) clearInterval(timerRef.current);
 };
 }, [running, decayProbPerTick]);

 const activeCount = atoms.filter(a => !a.decayed).length;

 useEffect(() => {
 if (time > 0 && Math.floor(time) > lastLoggedTimeRef.current) {
  setLoggedData(prev => [...prev, { time: Math.floor(time), active: activeCount }]);
  lastLoggedTimeRef.current = Math.floor(time);
 }
 }, [time, activeCount]);

 const checkAssessment = () => {
 const val = parseFloat(assessmentAns);
 // Question: start=800, remaining=100 after 12 seconds. N = N0 * (1/2)^n => 100 = 800/8 => 3 half lives. 12/3 = 4s
 if (!isNaN(val) && val === 4) {
  setAssessmentStatus('correct');
 } else {
  setAssessmentStatus('incorrect');
 }
 };

 const points = loggedData.map(d => {
 const x = (d.time / Math.max(30, time)) * 300; // auto-scale x axis up to current time
 const y = 200 - (d.active / initialAtoms) * 200;
 return `${x},${y}`;
 });

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Unit 20: Half-Life Simulation" subtitle="Quantitative analysis of radioactive decay curves." />

  
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
  <div className="lg:flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
  
  {/* LEFT: Theory & Setup */}
  <div className="flex flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex">
   <div className={`bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 `}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-rose-600"/> Theory</h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    Radioactive decay is a random process. The rate of decay is proportional to the number of active nuclei <strong>N</strong> remaining:
   </p>
   <div className={`bg-rose-50 p-3 rounded-lg text-center font-mono text-rose-900 mb-4 font-bold border border-rose-100 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    N(t) = N₀ · (½)^(t / T_½)
   </div>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    The <strong>half-life (T_½)</strong> is the time required for exactly half of the radioactive nuclei in a sample to decay.
   </p>
   </div>

   <div className={`bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 `}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-rose-600"/> Setup</h2>
   
   <div className="space-y-5">
    <div>
    <div className="flex justify-between text-sm font-medium mb-1">
     <span className="text-slate-700 dark:text-[#ffffff]">Half-Life (s)</span>
     <span className="text-rose-600 font-mono">{halfLife} s</span>
    </div>
    <input 
     type="range" min="2" max="20" step="1" 
     value={halfLife} onChange={(e) => setHalfLife(Number(e.target.value))} 
     disabled={running || time > 0}
     className="w-full accent-rose-600 disabled:opacity-50" 
    />
    </div>

    <div>
    <div className="flex justify-between text-sm font-medium mb-1">
     <span className="text-slate-700 dark:text-[#ffffff]">Initial Atoms (N₀)</span>
     <span className="text-rose-600 font-mono">{initialAtoms}</span>
    </div>
    <input 
     type="range" min="100" max="1000" step="100" 
     value={initialAtoms} onChange={(e) => setInitialAtoms(Number(e.target.value))} 
     disabled={running || time > 0}
     className="w-full accent-rose-600 disabled:opacity-50" 
    />
    </div>
   </div>

   <button 
    onClick={() => setRunning(!running)}
    className={`mt-6 w-full py-3 rounded-xl font-bold text-white transition-colors flex justify-center items-center gap-2 ${running ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'} `}
   >
    {running ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5"/>}
    {running ? 'PAUSE DECAY' : 'START DECAY'}
   </button>
   </div>
  </div>

  {/* MIDDLE: Simulation */}
  <div className={`bg-[#000000] dark:!bg-[#121212] rounded-2xl shadow-sm border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col relative overflow- lg:h-full lg:min-h-[35vh] lg:min-h-[500px] ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="absolute top-4 left-4 text-white font-medium text-sm flex items-center gap-2 z-10">
   <Info className="w-4 h-4 text-rose-400" /> Isotope Sample Box
   </div>
   <div className={`absolute top-4 right-4 text-white font-mono text-xl font-bold bg-black/50 px-3 py-1 rounded z-10 flex-col `}>
   {time.toFixed(1)}s
   </div>
   
   <div className="flex-1 relative w-full flex items-center justify-center p-8">
   <div className="w-full h-full bg-[#121212] dark:bg-[#121212] rounded-xl border-4 border-[#1c1b1b] dark:border-[#1c1b1b] relative overflow-hidden shadow-inner">
    {atoms.map(atom => (
    <div 
     key={atom.id}
     className={`absolute w-2 h-2 rounded-full transition-colors duration-300 ${atom.decayed ? 'bg-slate-700 dark:bg-[#121212]' : 'bg-rose-500 shadow-[0_0_6px_#f43f5e]'}`}
     style={{ left: `${atom.x}%`, top: `${atom.y}%` }}
    />
    ))}
   </div>
   </div>

   <div className="bg-[#121212] dark:bg-[#121212] p-4 border-t border-[#1c1b1b] dark:border-[#1c1b1b] flex flex-col gap-2">
   <div>
    <div className="flex justify-between text-sm font-bold mb-1">
    <span className="text-rose-400">Active Nuclei (N)</span>
    <span className="text-white font-mono">{activeCount}</span>
    </div>
    <div className="w-full bg-slate-700 dark:bg-[#121212] h-2 rounded-full overflow-hidden">
    <div className="bg-rose-500 h-full transition-all duration-300 dark:bg-[#121212] dark:border-[#1c1b1b]" style={{ width: `${(activeCount / initialAtoms) * 100}%` }} />
    </div>
   </div>
   <div>
    <div className="flex justify-between text-sm font-bold mb-1">
    <span className="text-slate-400">Decayed Nuclei</span>
    <span className="text-white font-mono">{initialAtoms - activeCount}</span>
    </div>
    <div className="w-full bg-slate-700 dark:bg-[#121212] h-2 rounded-full overflow-hidden">
    <div className="bg-slate-500 dark:bg-[#121212] h-full transition-all duration-300" style={{ width: `${((initialAtoms - activeCount) / initialAtoms) * 100}%` }} />
    </div>
   </div>
   </div>
  </div>

  {/* RIGHT: Data & Assessment */}
  <div className="flex flex-col gap-6 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <div className="bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col h-[400px]">
   <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2"><Table2 className="w-5 h-5 text-rose-600"/> Data Log</h2>
    <span className="bg-slate-100 dark:bg-[#121212] text-slate-500 dark:text-[#71717a] px-2 py-1 rounded text-xs font-bold">Auto-records every 1s</span>
   </div>
   
   <div className="flex-1 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] rounded-lg mb-4">
    <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0">
     <tr>
     <th className="p-3 font-semibold text-slate-700 dark:text-[#ffffff]">Time (s)</th>
     <th className="p-3 font-semibold text-slate-700 dark:text-[#ffffff]">Active Atoms</th>
     </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
     {loggedData.map((d, i) => (
     <tr key={i} className="hover:bg-slate-50 dark:bg-[#121212]">
      <td className="p-3 font-mono text-slate-600 dark:text-[#a1a1aa]">{d.time}</td>
      <td className="p-3 font-mono font-bold text-rose-600">{d.active}</td>
     </tr>
     ))}
    </tbody>
    </table>
   </div>

   <div className="h-32 border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-2 relative bg-slate-50 dark:bg-[#121212]">
    <div className="absolute top-2 right-2 text-[10px] text-slate-400 font-bold">N vs Time</div>
    <svg className="w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none">
    <line x1="0" y1="200" x2="300" y2="200" stroke="#cbd5e1" strokeWidth="2" />
    <line x1="0" y1="0" x2="0" y2="200" stroke="#cbd5e1" strokeWidth="2" />
    {points.length > 1 && (
     <polyline points={points.join(' ')} fill="none" stroke="#f43f5e" strokeWidth="2" />
    )}
    {points.map((p, i) => {
     const [x, y] = p.split(',');
     return <circle key={i} cx={x} cy={y} r="3" fill="#e11d48" />;
    })}
    </svg>
   </div>
   </div>

   <div className="bg-[#121212] dark:!bg-[#121212] rounded-2xl shadow-sm border border-[#1c1b1b] dark:border-[#1c1b1b] p-6 text-white flex-1">
   <h2 className="text-lg font-bold mb-3 text-amber-400">Analysis Assessment</h2>
   <p className="text-sm text-slate-300 mb-4 leading-relaxed">
    A radioactive sample starts with <strong>800</strong> atoms. After exactly <strong>12 seconds</strong>, a detector counts <strong>100</strong> active atoms remaining. What is the half-life of this isotope in seconds?
   </p>
   <div className="flex gap-2">
    <input 
    type="text" 
    placeholder="e.g. 5"
    value={assessmentAns}
    onChange={e => setAssessmentAns(e.target.value)}
    className="flex-1 bg-slate-700 dark:bg-[#121212] border border-slate-600 dark:border-[#1c1b1b] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
    />
    <button onClick={checkAssessment} className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg font-bold text-sm dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40">
    Check
    </button>
   </div>
   {assessmentStatus === 'correct' && <div className="mt-3 text-emerald-400 text-sm font-bold">✓ Correct! 800 → 400 → 200 → 100 (3 half-lives). 12/3 = 4s.</div>}
   {assessmentStatus === 'incorrect' && <div className="mt-3 text-rose-400 text-sm font-bold">✗ Incorrect. Hint: How many half-lives to go from 800 to 100?</div>}
   </div>
  </div>

  </div>
 </div>
 );
}
