import { useState, useEffect, useRef } from 'react';
import { Play, Pause, CheckCircle2, XCircle, Save, Zap, Magnet } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP11Electrostatics({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [mode, setMode] = useState<'faraday' | 'mri'>('faraday');
 const [isPlaying, setIsPlaying] = useState(false);
 const [time, setTime] = useState(0);
 const reqRef = useRef<number>(0);
 
 // Faraday State
 const [extField, setExtField] = useState(50); // %
 const [faradayLogs, setFaradayLogs] = useState<{id: number, eExt: number, eIn: number}[]>([]);
 const [faradayAns, setFaradayAns] = useState('');
 const [faradayStatus, setFaradayStatus] = useState<'idle'|'correct'|'incorrect'>('idle');
 
 // MRI State
 const [turns, setTurns] = useState(2000); // turns/m
 const [current, setCurrent] = useState(20); // A
 const [mriLogs, setMriLogs] = useState<{id: number, n: number, i: number, b: string}[]>([]);
 const [mriAns, setMriAns] = useState('');
 const [mriStatus, setMriStatus] = useState<'idle'|'correct'|'incorrect'>('idle');

 useEffect(() => {
 if (isPlaying) {
  let lastTime = performance.now();
  const loop = (t: number) => {
  const dt = (t - lastTime) / 1000;
  lastTime = t;
  setTime(prev => prev + dt);
  reqRef.current = requestAnimationFrame(loop);
  };
  reqRef.current = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(reqRef.current);
 }
 return () => cancelAnimationFrame(reqRef.current);
 }, [isPlaying]);

 const checkFaraday = () => {
 if (Math.abs(parseFloat(faradayAns) - 0) < 0.1) setFaradayStatus('correct');
 else setFaradayStatus('incorrect');
 };

 const checkMri = () => {
 if (Math.abs(parseFloat(mriAns) - 0.1257) < 0.001) setMriStatus('correct');
 else setMriStatus('incorrect');
 };

 const logFaraday = () => {
 setFaradayLogs(prev => [...prev, { id: Date.now(), eExt: extField, eIn: 0 }]);
 };

 const logMri = () => {
 const B = 1.257e-6 * turns * current;
 setMriLogs(prev => [...prev, { id: Date.now(), n: turns, i: current, b: B.toFixed(4) }]);
 };

 const renderSimulation = () => {
 if (mode === 'faraday') {
  const eFieldLines = [];
  const eIntensity = extField / 100; 
  for (let i = 20; i <= 380; i += 20) {
  if (i > 130 && i < 270) {
   const push = i < 200 ? -40 : 40;
   eFieldLines.push(
    <path key={i} d={`M ${i} 0 Q ${i+push} 125 ${i} 250`} stroke={`rgba(234, 179, 8, ${eIntensity})`} strokeWidth={2} fill="none" />
   );
  } else {
   eFieldLines.push(
    <line key={i} x1={i} y1={0} x2={i} y2={250} stroke={`rgba(234, 179, 8, ${eIntensity})`} strokeWidth={2} />
   );
  }
  }
  
  return (
  <svg viewBox="0 0 400 250" className="w-full h-full bg-[#000000] dark:bg-[#121212] rounded-lg">
   {eFieldLines}
   {/* Lightning cloud symbol at top */}
   <ellipse cx="200" cy="0" rx="80" ry="30" fill="#475569" />
   <text x="200" y="15" fill="white" textAnchor="middle" fontSize="14" fontWeight="bold">Charged Cloud (+)</text>
   
   {/* Faraday Cage */}
   <rect x="150" y="80" width="100" height="90" fill="rgba(148, 163, 184, 0.2)" stroke="#94a3b8" strokeWidth={4} rx={4} />
   <circle cx="200" cy="125" r="5" fill="red" />
   <text x="200" y="145" fill="white" fontSize="12" textAnchor="middle">E = 0 V/m</text>
  </svg>
  );
 } else {
  const B = 1.257e-6 * turns * current;
  const spikeHeight = Math.min(100, B * 1.5e4); 
  let pathData = `M 50 170 `;
  for (let x = 50; x <= 350; x += 10) {
  const h = x % 20 === 0 ? spikeHeight * (0.6 + 0.4 * Math.sin(x + (isPlaying ? time*5 : 0))) : 0;
  pathData += `L ${x} ${170 - h} `;
  }
  pathData += `L 350 170 Z`;

  const coils = [];
  for (let x = 60; x <= 340; x += 20) {
   coils.push(<circle key={`t${x}`} cx={x} cy={50} r={6} fill="#f97316" />);
   coils.push(<circle key={`b${x}`} cx={x} cy={190} r={6} fill="#f97316" />);
  }

  return (
  <svg viewBox="0 0 400 250" className="w-full h-full bg-[#000000] dark:bg-[#121212] rounded-lg">
   {/* Solenoid tube */}
   <rect x="50" y="50" width="300" height="140" fill="rgba(255,255,255,0.05)" stroke="#475569" strokeWidth={2} />
   {coils}
   
   {/* Ferrofluid pool */}
   <rect x="50" y="170" width="300" height="20" fill="#1e293b" />
   <path d={pathData} fill="#1e293b" />
   
   {/* B field lines inside tube */}
   {B > 0.01 && Array.from({length: 5}).map((_, i) => (
    <line key={`B${i}`} x1="50" y1={70 + i*25} x2="350" y2={70 + i*25} stroke="rgba(56, 189, 248, 0.4)" strokeWidth={2} strokeDasharray="5,5" />
   ))}
   <text x="200" y="30" fill="white" fontSize="14" textAnchor="middle">MRI Solenoid Tube</text>
  </svg>
  );
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Grade 11 Physics: Electrostatics & Magnetism" />

  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 flex-grow overflow-y-auto lg:overflow-visible">
  {/* Theory & Controls */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200 dark:border-[#1c1b1b]  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <Zap className="text-yellow-500" /> Theory & Setup
   </h2>
   
   <div className={`flex gap-2 p-1 bg-slate-100 dark:bg-[#121212] rounded-lg flex-col `}>
   <button 
    className={`flex-1 py-2 rounded-md font-medium transition-colors ${mode === 'faraday' ? 'bg-slate-50 dark:bg-[#121212] shadow text-blue-600' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
    onClick={() => { setMode('faraday'); setIsPlaying(false); }}
   >
    Faraday Cage
   </button>
   <button 
    className={`flex-1 py-2 rounded-md font-medium transition-colors ${mode === 'mri' ? 'bg-slate-50 dark:bg-[#121212] shadow text-blue-600' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
    onClick={() => { setMode('mri'); setIsPlaying(false); }}
   >
    MRI Ferrofluid
   </button>
   </div>

   <div className="flex-grow space-y-4">
   {mode === 'faraday' ? (
    <>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] leading-relaxed">
     A Faraday cage is an enclosure used to block electromagnetic fields. The charges in the conductive material redistribute themselves to cancel the external field inside the cage, ensuring $E = 0$.
    </p>
    <div className="space-y-2">
     <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">External E-Field Strength: {extField}%</label>
     <input type="range" min="0" max="100" value={extField} onChange={(e) => setExtField(Number(e.target.value))} className="w-full accent-yellow-500" />
    </div>
    </>
   ) : (
    <>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] leading-relaxed">
     An MRI machine uses a massive solenoid to create a strong, uniform magnetic field. Ferrofluid (magnetic fluid) forms spikes along the magnetic field lines. 
     $$B = \mu_0 n I$$
    </p>
    <div className="space-y-2">
     <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">Turns Density ($n$): {turns} turns/m</label>
     <input type="range" min="500" max="4000" step="100" value={turns} onChange={(e) => setTurns(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    <div className="space-y-2">
     <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">Current ($I$): {current} A</label>
     <input type="range" min="0" max="100" value={current} onChange={(e) => setCurrent(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    </>
   )}
   </div>
  </div>

  {/* Simulation */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col gap-4 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] lg:col-span-1  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="flex justify-between items-center">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <Magnet className="text-blue-500" /> Visualizer
   </h2>
   {mode === 'mri' && (
    <button 
    onClick={() => setIsPlaying(!isPlaying)} 
    className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 flex-col `}
    >
    {isPlaying ? <><Pause size={18}/> Freeze</> : <><Play size={18}/> Animate</>}
    </button>
   )}
   </div>
   <div className="flex-grow flex items-center justify-center">
   {renderSimulation()}
   </div>
  </div>

  {/* Assessment & Data */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b]  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">Analysis & Assessment</h2>
   
   <div className="space-y-4">
   <button 
    onClick={mode === 'faraday' ? logFaraday : logMri}
    className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#121212] dark:bg-[#121212] hover:bg-[#000000] dark:bg-[#121212] text-white rounded-lg font-medium transition-colors flex-col `}
   >
    <Save size={18} /> Record Measurement
   </button>
   
   <div className="max-h-40 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
    <table className="w-full text-sm text-left text-slate-600 dark:text-[#a1a1aa]">
    <thead className="bg-slate-50 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] sticky top-0">
     {mode === 'faraday' ? (
     <tr><th className="p-2">E_ext (%)</th><th className="p-2">E_in (V/m)</th></tr>
     ) : (
     <tr><th className="p-2">n (turns/m)</th><th className="p-2">I (A)</th><th className="p-2">B (T)</th></tr>
     )}
    </thead>
    <tbody>
     {mode === 'faraday' ? faradayLogs.map(l => (
     <tr key={l.id} className="border-t border-slate-100"><td className="p-2">{l.eExt}</td><td className="p-2 font-mono text-green-600 font-bold">{l.eIn}</td></tr>
     )) : mriLogs.map(l => (
     <tr key={l.id} className="border-t border-slate-100"><td className="p-2">{l.n}</td><td className="p-2">{l.i}</td><td className="p-2 font-mono">{l.b}</td></tr>
     ))}
    </tbody>
    </table>
   </div>
   </div>

   <div className="mt-auto pt-4 border-t border-slate-200 dark:border-[#1c1b1b]">
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Knowledge Check</h3>
   {mode === 'faraday' ? (
    <div className="space-y-3">
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">A hollow metal sphere has a radius of 10cm. A point charge of +5µC is placed outside. What is the electric field at the center of the sphere? (V/m)</p>
    <div className="flex gap-2">
     <input type="number" value={faradayAns} onChange={e => {setFaradayAns(e.target.value); setFaradayStatus('idle');}} className="flex-grow px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 100" />
     <button onClick={checkFaraday} className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors">Check</button>
    </div>
    {faradayStatus === 'correct' && <p className="text-green-600 text-sm flex items-center gap-1"><CheckCircle2 size={16}/> Correct! E-field inside a conductor is zero.</p>}
    {faradayStatus === 'incorrect' && <p className="text-red-600 text-sm flex items-center gap-1"><XCircle size={16}/> Incorrect. Think about the properties of conductors.</p>}
    </div>
   ) : (
    <div className="space-y-3">
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">An MRI solenoid has 2000 turns/m and a current of 50 A. Calculate the magnetic field in Tesla. (Use {"$\\mu_0 = 1.257 \\times 10^{-6}$"})</p>
    <div className="flex gap-2">
     <input type="number" step="0.0001" value={mriAns} onChange={e => {setMriAns(e.target.value); setMriStatus('idle');}} className="flex-grow px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 0.1257" />
     <button onClick={checkMri} className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors">Check</button>
    </div>
    {mriStatus === 'correct' && <p className="text-green-600 text-sm flex items-center gap-1"><CheckCircle2 size={16}/> Correct!</p>}
    {mriStatus === 'incorrect' && <p className="text-red-600 text-sm flex items-center gap-1"><XCircle size={16}/> Incorrect. Try again.</p>}
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
