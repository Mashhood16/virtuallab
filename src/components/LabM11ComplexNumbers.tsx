import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabM11ComplexNumbers({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [amplitude, setAmplitude] = useState<number>(5);
 const [omega, setOmega] = useState<number>(1);
 const [phase, setPhase] = useState<number>(0);
 
 const [time, setTime] = useState<number>(0);
 const [isPlaying, setIsPlaying] = useState<boolean>(true);
 
 const [q1Answer, setQ1Answer] = useState<string>("");
 const [q1Status, setQ1Status] = useState<"idle" | "correct" | "incorrect">("idle");

 const [q2Answer, setQ2Answer] = useState<string>("");
 const [q2Status, setQ2Status] = useState<"idle" | "correct" | "incorrect">("idle");

 const requestRef = useRef<number>(0);
 const lastTimeRef = useRef<number>(0);
 
 useEffect(() => {
 const animate = (t: number) => {
  if (isPlaying) {
  if (lastTimeRef.current !== 0) {
   const dt = (t - lastTimeRef.current) / 1000;
   setTime(prev => prev + dt);
  }
  lastTimeRef.current = t;
  requestRef.current = requestAnimationFrame(animate);
  }
 };
 
 if (isPlaying) {
  lastTimeRef.current = performance.now();
  requestRef.current = requestAnimationFrame(animate);
 } else {
  lastTimeRef.current = 0;
 }
 
 return () => cancelAnimationFrame(requestRef.current);
 }, [isPlaying]);

 const resetSimulation = () => {
 setTime(0);
 setIsPlaying(false);
 };

 const checkQ1 = () => {
 const expected = amplitude * Math.cos(phase);
 if (Math.abs(parseFloat(q1Answer) - expected) < 0.1) {
  setQ1Status("correct");
 } else {
  setQ1Status("incorrect");
 }
 };

 const checkQ2 = () => {
 const expected = (2 * Math.PI) / omega;
 if (Math.abs(parseFloat(q2Answer) - expected) < 0.1) {
  setQ2Status("correct");
 } else {
  setQ2Status("incorrect");
 }
 };

 // derived values
 const currentAngle = omega * time + phase;
 const realPart = amplitude * Math.cos(currentAngle);
 const imagPart = amplitude * Math.sin(currentAngle);

 // history for plot
 const [history, setHistory] = useState<{t: number, r: number, i: number}[]>([]);
 useEffect(() => {
 if (isPlaying) {
  setHistory(prev => {
  const newHist = [...prev, { t: time, r: realPart, i: imagPart }];
  if (newHist.length > 200) return newHist.slice(newHist.length - 200);
  return newHist;
  });
 }
 }, [time, isPlaying, realPart, imagPart]);

 useEffect(() => {
 setHistory([]);
 }, [amplitude, omega, phase]);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  {/* Header */}
  <LabHeader onExit={onExit} title="Complex Numbers & Phasors Lab" />

  
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
  <main className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 overflow-y-auto lg:overflow-visible">
  {/* LEFT: Theory & Setup */}
  <div className={`bg-slate-50 dark:bg-[#121212] p-6 rounded-lg shadow flex flex-col gap-4 lg:overflow-y-auto border-t-4 border-blue-500 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-gray-800 dark:text-[#ffffff]">Theory: Euler's Formula</h2>
   <p className="text-gray-600 text-sm">
   A complex number can be written in polar form using Euler's formula:
   <br />
   <span className="font-mono text-blue-600 font-semibold text-center block my-2">
    {"$$ z(t) = A e^{i(\\omega t + \\phi)} = A(\\cos(\\omega t + \\phi) + i\\sin(\\omega t + \\phi)) $$"}
   </span>
   </p>
   <ul className="list-disc list-inside text-sm text-gray-700 dark:text-[#ffffff] space-y-1">
   <li><b>A</b>: Amplitude (radius of the circle)</li>
   <li><b>{"$$\\omega$$"}</b>: Angular frequency (rad/s)</li>
   <li><b>{"$$\\phi$$"}</b>: Initial phase angle (rad)</li>
   <li><b>Real Part</b>: Models AC Voltage or Position in SHM</li>
   </ul>

   <div className="mt-4 space-y-4">
   <h3 className="font-bold text-gray-800 dark:text-[#ffffff] border-b pb-1">Control Panel</h3>
   <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-[#ffffff] mb-1">Amplitude (A): {amplitude.toFixed(1)}</label>
    <input type="range" min="1" max="10" step="0.5" value={amplitude} onChange={(e) => setAmplitude(parseFloat(e.target.value))} className="w-full" />
   </div>
   <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-[#ffffff] mb-1">Angular Freq ({"$$\\omega$$"}): {omega.toFixed(1)} rad/s</label>
    <input type="range" min="0.5" max="5" step="0.1" value={omega} onChange={(e) => setOmega(parseFloat(e.target.value))} className="w-full" />
   </div>
   <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-[#ffffff] mb-1">Phase ({"$$\\phi$$"}): {phase.toFixed(2)} rad</label>
    <input type="range" min="0" max="6.28" step="0.1" value={phase} onChange={(e) => setPhase(parseFloat(e.target.value))} className="w-full" />
   </div>

   <div className="flex gap-2 pt-2">
    <button
    onClick={() => setIsPlaying(!isPlaying)}
    className={`flex-1 min-w-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 flex-col `}
    >
    {isPlaying ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Play</>}
    </button>
    <button
    onClick={resetSimulation}
    className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:text-[#ffffff] font-bold py-2 px-4 rounded flex items-center justify-center"
    >
    <RefreshCw size={18} />
    </button>
   </div>
   </div>
  </div>

  {/* MIDDLE: Simulation */}
  <div className={`bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-6 rounded-lg shadow flex flex-col items-center justify-center border-t-4 border-indigo-500 overflow- relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-gray-800 dark:text-[#ffffff] absolute top-4 left-6">Phasor Simulation</h2>
   <div className="text-sm text-gray-500 absolute top-10 left-6">t = {time.toFixed(2)} s</div>
   
   <svg viewBox="-15 -15 30 30" className={`w-full h-64 max-w-sm mt-8 border border-gray-100 rounded-lg shadow-inner bg-slate-50 dark:bg-[#121212] flex-col `}>
   {/* Axes */}
   <line x1="-15" y1="0" x2="15" y2="0" stroke="#ccc" strokeWidth="0.2" />
   <line x1="0" y1="-15" x2="0" y2="15" stroke="#ccc" strokeWidth="0.2" />
   <circle cx="0" cy="0" r={amplitude} stroke="#e2e8f0" fill="none" strokeWidth="0.3" strokeDasharray="0.5,0.5" />
   
   {/* Phasor */}
   <line x1="0" y1="0" x2={realPart} y2={-imagPart} stroke="#4f46e5" strokeWidth="0.5" />
   <circle cx={realPart} cy={-imagPart} r="0.6" fill="#4f46e5" />
   
   {/* Projections */}
   <line x1={realPart} y1="0" x2={realPart} y2={-imagPart} stroke="#ef4444" strokeWidth="0.2" strokeDasharray="0.5" />
   <line x1="0" y1={-imagPart} x2={realPart} y2={-imagPart} stroke="#3b82f6" strokeWidth="0.2" strokeDasharray="0.5" />
   
   <text x="10" y="1" fontSize="1.5" fill="#999">Re</text>
   <text x="0.5" y="-13" fontSize="1.5" fill="#999">Im</text>
   </svg>

   {/* Time Domain Graph */}
   <div className="w-full h-32 mt-6 relative">
    <svg viewBox="0 -12 100 24" className="w-full h-full border border-gray-100 bg-slate-50 dark:bg-[#121212] rounded-lg" preserveAspectRatio="none">
    <line x1="0" y1="0" x2="100" y2="0" stroke="#ccc" strokeWidth="0.5" />
    {history.length > 1 && (
     <>
     {/* Real part path (red) */}
     <path 
      d={`M ${history.map((h, i) => `${(i / history.length) * 100},${-h.r}`).join(' L ')}`} 
      stroke="#ef4444" strokeWidth="0.8" fill="none" 
     />
     {/* Imag part path (blue) */}
     <path 
      d={`M ${history.map((h, i) => `${(i / history.length) * 100},${-h.i}`).join(' L ')}`} 
      stroke="#3b82f6" strokeWidth="0.8" fill="none" 
     />
     </>
    )}
    </svg>
    <div className="flex justify-center gap-4 mt-2 text-xs flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    <span className="text-red-500 font-bold">Real (Cos)</span>
    <span className="text-blue-500 font-bold">Imaginary (Sin)</span>
    </div>
   </div>
  </div>

  {/* RIGHT: Assessment */}
  <div className={`bg-slate-50 dark:bg-[#121212] p-6 rounded-lg shadow flex flex-col gap-4 border-t-4 border-emerald-500 `}>
   <h2 className="text-xl font-bold text-gray-800 dark:text-[#ffffff]">Analysis & Assessment</h2>
   <p className="text-sm text-gray-600 mb-2">Use the simulation parameters to solve the following problems.</p>

   {/* Question 1 */}
   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
   <p className="text-sm font-semibold text-gray-800 dark:text-[#ffffff] mb-2">1. Initial Real Value</p>
   <p className="text-sm text-gray-600 mb-3">
    Given A = {amplitude.toFixed(1)}, {"$$\\phi$$"} = {phase.toFixed(2)} rad, calculate the <b>Real Part</b> at t = 0.
   </p>
   <div className="flex items-center gap-2">
    <input 
    type="number" 
    className="flex-1 min-w-0 p-2 border rounded text-sm" 
    placeholder="Enter value..."
    value={q1Answer}
    onChange={(e) => { setQ1Answer(e.target.value); setQ1Status("idle"); }}
    />
    <button onClick={checkQ1} className="bg-emerald-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-emerald-700 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">Check</button>
   </div>
   {q1Status === "correct" && <p className="text-emerald-600 text-xs mt-2 flex items-center gap-1"><CheckCircle size={14} /> Correct! {"$$ A \\cos(\\phi) $$"} matches.</p>}
   {q1Status === "incorrect" && <p className="text-red-600 text-xs mt-2 flex items-center gap-1"><XCircle size={14} /> Incorrect. Try again.</p>}
   </div>

   {/* Question 2 */}
   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
   <p className="text-sm font-semibold text-gray-800 dark:text-[#ffffff] mb-2">2. Wave Period</p>
   <p className="text-sm text-gray-600 mb-3">
    Given angular frequency {"$$\\omega$$"} = {omega.toFixed(1)} rad/s, calculate the <b>Period T</b> in seconds.
   </p>
   <div className="flex items-center gap-2">
    <input 
    type="number" 
    className="flex-1 min-w-0 p-2 border rounded text-sm" 
    placeholder="Enter period T..."
    value={q2Answer}
    onChange={(e) => { setQ2Answer(e.target.value); setQ2Status("idle"); }}
    />
    <button onClick={checkQ2} className="bg-emerald-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-emerald-700 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">Check</button>
   </div>
   {q2Status === "correct" && <p className="text-emerald-600 text-xs mt-2 flex items-center gap-1"><CheckCircle size={14} /> Correct! {"$$ T = 2\\pi / \\omega $$"}.</p>}
   {q2Status === "incorrect" && <p className="text-red-600 text-xs mt-2 flex items-center gap-1"><XCircle size={14} /> Incorrect. Remember {"$$ T = \\frac{2\\pi}{\\omega} $$"}.</p>}
   </div>
   
   <div className="mt-auto bg-blue-50 p-4 rounded-lg dark:bg-teal-950/20 dark:border-teal-900">
    <h3 className="text-sm font-bold text-blue-800 mb-1 dark:text-[#ffffff]">Did you know?</h3>
    <p className="text-xs text-blue-700">
    In Electrical Engineering, alternating currents (AC) and voltages are represented as complex numbers called <b>phasors</b>. This turns differential equations into simple algebra!
    </p>
   </div>
  </div>
  </main>
 </div>
 );
}
