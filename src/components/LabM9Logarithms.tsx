import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Activity, Globe } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
 onExit?: () => void;
}

export default function LabM9Logarithms({ onExit }: Props) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [magnitude, setMagnitude] = useState<number>(5.0);
 const [isQuaking, setIsQuaking] = useState(false);
 const [logs, setLogs] = useState<{ id: number; mag: number; energyStr: string }[]>([]);

 // Assessment
 const [m1, setM1] = useState(0);
 const [m2, setM2] = useState(0);
 const [qAns, setQAns] = useState("");
 const [qStatus, setQStatus] = useState<null | boolean>(null);
 const [qExpected, setQExpected] = useState(0);

 useEffect(() => {
 const mag1 = Math.floor(Math.random() * 3) + 4; // 4, 5, 6
 const mag2 = mag1 + 2; // +2 difference means 1000x energy
 setM1(mag1);
 setM2(mag2);
 setQExpected(Math.pow(10, 1.5 * (mag2 - mag1)));
 }, []);

 const triggerEarthquake = () => {
 setIsQuaking(true);
 setTimeout(() => setIsQuaking(false), 2000);
 
 // E = 10^(1.5M + 4.8)
 const exp = 1.5 * magnitude + 4.8;
 const power = Math.floor(exp);
 const coeff = Math.pow(10, exp - power);
 const energyStr = `${coeff.toFixed(2)} × 10^${power} J`;
 
 setLogs([...logs, { id: logs.length + 1, mag: magnitude, energyStr }]);
 };

 const checkAnswer = () => {
 const numAns = Number(qAns.replace(/,/g, ''));
 setQStatus(Math.abs(numAns - qExpected) < 1);
 };

 const seismographPoints = Array.from({ length: 100 }).map((_, i) => {
 const x = i * 4;
 const noise = isQuaking ? (Math.random() - 0.5) * Math.pow(1.8, magnitude) : (Math.random() - 0.5) * 2;
 // Cap visual noise
 const y = 50 + Math.max(-45, Math.min(45, noise));
 return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
 }).join(' ');

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Grade 9 Math: Logarithms & Richter Scale" />
  

  
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
  <div className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
  {/* Theory Column */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col gap-4 border border-slate-200 dark:border-[#1c1b1b]  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">Theory: Logarithms & Scientific Notation</h2>
   
   <div className="prose prose-slate">
   <h3 className="text-lg font-semibold text-red-700">The Richter Scale</h3>
   <p className="text-slate-600 dark:text-[#a1a1aa]">
    The Richter scale is a base-10 logarithmic scale used to measure earthquakes. 
    Because earthquake energies vary drastically, a logarithmic scale helps represent them with simple numbers.
   </p>
   
   <h3 className="text-lg font-semibold text-red-700 mt-4">Energy Formula</h3>
   <p className="text-slate-600 dark:text-[#a1a1aa]">
    The energy E (in Joules) relates to magnitude M by the equation:<br />
    <strong>E = 10^(1.5M + 4.8)</strong><br/>
    An increase of 1.0 in magnitude means exactly 10^(1.5) ≈ 31.6 times more energy released!
   </p>

   <h3 className="text-lg font-semibold text-red-700 mt-4">Scientific Notation</h3>
   <p className="text-slate-600 dark:text-[#a1a1aa]">
    Very large numbers are written as a × 10^n. 
    For example, 1,500,000 becomes 1.5 × 10^6.
   </p>
   </div>
  </div>

  {/* Interactive Simulator */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b]  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <Activity className="text-red-600" /> Seismograph Simulator
   </h2>
   
   {/* Visualizer */}
   <div className={`relative w-full h-40 bg-[#000000] dark:bg-[#121212] lg:dark:bg-[#121212] rounded-lg border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] overflow- flex items-center justify-center flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <svg className="w-full h-full" viewBox="0 0 400 100">
    <path d={seismographPoints} stroke="#10b981" strokeWidth="2" fill="none" className="transition-all duration-75" />
   </svg>
   <div className="absolute top-2 left-2 text-green-400 font-mono text-xs">Seismic Data Feed // Live</div>
   </div>

   {/* Controls */}
   <div className={`flex flex-col gap-4 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border `}>
   <div>
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-1 flex justify-between">
    <span>Magnitude (M): {magnitude.toFixed(1)}</span>
    <span className="text-red-600 text-xs">{magnitude > 7 ? 'Severe' : magnitude > 5 ? 'Moderate' : 'Minor'}</span>
    </label>
    <input 
    type="range" min="1.0" max="9.0" step="0.1" 
    value={magnitude} onChange={(e) => setMagnitude(Number(e.target.value))}
    className="w-full accent-red-600"
    />
   </div>

   <button 
    onClick={triggerEarthquake}
    disabled={isQuaking}
    className={`w-full py-3 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${isQuaking ? 'bg-slate-400 dark:bg-[#121212]' : 'bg-red-600 hover:bg-red-700'} `}
   >
    <Globe size={20} /> {isQuaking ? 'Recording...' : 'Trigger Earthquake'}
   </button>
   </div>
  </div>

  {/* Data & Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200 dark:border-[#1c1b1b] `}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">Data Logs & Assessment</h2>
   
   <div className="flex-1 min-w-0 lg:overflow-y-auto border rounded-lg bg-slate-50 dark:bg-[#121212] p-2 min-h-[150px]">
   {logs.length === 0 ? (
    <div className="text-center text-slate-400 mt-10">Trigger an event to record data.</div>
   ) : (
    <table className="w-full text-sm text-left">
    <thead className="text-xs text-slate-500 dark:text-[#71717a] uppercase border-b">
     <tr>
     <th className="px-2 py-1">Event</th>
     <th className="px-2 py-1">Mag (M)</th>
     <th className="px-2 py-1">Est. Energy (Joules)</th>
     </tr>
    </thead>
    <tbody>
     {logs.map(l => (
     <tr key={l.id} className="border-b">
      <td className="px-2 py-1">#{l.id}</td>
      <td className="px-2 py-1 font-bold text-red-600">{l.mag.toFixed(1)}</td>
      <td className="px-2 py-1 font-mono text-slate-700 dark:text-[#ffffff]">{l.energyStr}</td>
     </tr>
     ))}
    </tbody>
    </table>
   )}
   </div>

   <div className="bg-red-50 p-4 rounded-lg border border-red-100">
   <p className="text-sm font-semibold mb-2">
    An earthquake of Magnitude {m2.toFixed(1)} releases how many times more energy than a Magnitude {m1.toFixed(1)} earthquake?
   </p>
   <div className="flex flex-wrap gap-2">
    <input 
    type="number" value={qAns} onChange={(e) => setQAns(e.target.value)}
    className="flex-1 min-w-0 border rounded px-2 py-1 outline-none focus:border-red-400"
    placeholder="Factor..."
    />
    <button onClick={checkAnswer} className="px-3 bg-red-600 text-white rounded font-bold hover:bg-red-700 dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40">Check</button>
   </div>
   {qStatus !== null && (
    <div className={`mt-2 flex items-center gap-1 text-sm font-bold ${qStatus ? 'text-green-600' : 'text-red-500'}`}>
    {qStatus ? <CheckCircle size={16} /> : <XCircle size={16} />}
    {qStatus ? 'Correct! It increases by 10^(1.5 * difference).' : 'Try again. Formula: 10^(1.5 * difference)'}
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
