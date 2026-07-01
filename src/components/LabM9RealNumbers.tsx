import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Truck, Package } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
 onExit?: () => void;
}

export default function LabM9RealNumbers({ onExit }: Props) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [truckPos, setTruckPos] = useState<number>(0);
 const [targetPos, setTargetPos] = useState<number>(0);
 const [loadKg, setLoadKg] = useState<number>(500);
 const [logs, setLogs] = useState<{ id: number; start: number; end: number; dist: number; load: number }[]>([]);

 const [q1, setQ1] = useState("");
 const [q1Ans, setQ1Ans] = useState("");
 const [q1Status, setQ1Status] = useState<null | boolean>(null);
 const [q1Expected, setQ1Expected] = useState(0);

 const [q2, setQ2] = useState("");
 const [q2Ans, setQ2Ans] = useState("");
 const [q2Status, setQ2Status] = useState<null | boolean>(null);
 const [q2Expected, setQ2Expected] = useState(0);

 useEffect(() => {
 const p1 = Math.floor(Math.random() * 40) - 50; 
 const p2 = Math.floor(Math.random() * 40) + 10; 
 setQ1(`A truck moves from ${p1} km to ${p2} km. What is the absolute distance traveled in km?`);
 setQ1Expected(Math.abs(p2 - p1));

 const load = (Math.floor(Math.random() * 8) + 1) * 100; 
 setQ2(`If a truck is carrying ${load} kg, what percentage is this of its 1000 kg capacity?`);
 setQ2Expected((load / 1000) * 100);
 }, []);

 const driveTruck = () => {
 const dist = Math.abs(targetPos - truckPos);
 const percent = (loadKg / 1000) * 100;
 setLogs([...logs, {
  id: logs.length + 1,
  start: truckPos,
  end: targetPos,
  dist,
  load: percent
 }]);
 setTruckPos(targetPos);
 };

 const checkQ1 = () => setQ1Status(Number(q1Ans) === q1Expected);
 const checkQ2 = () => setQ2Status(Number(q2Ans) === q2Expected);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Grade 9 Math: Real Numbers & Distance" />
  

  
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
  <div className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
  {/* Theory Column */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col gap-4 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">Theory: Absolute Value & Percentages</h2>
   
   <div className="prose prose-slate">
   <h3 className="text-lg font-semibold text-blue-700">The Number Line</h3>
   <p className="text-slate-600 dark:text-[#a1a1aa]">
    The number line represents all real numbers. Moving right increases the value, moving left decreases it.
   </p>
   
   <h3 className="text-lg font-semibold text-blue-700 mt-4">Absolute Value</h3>
   <p className="text-slate-600 dark:text-[#a1a1aa]">
    The absolute value |x| is the distance of a number from zero, regardless of direction. 
    The distance between two points a and b is given by |a - b|. Distance is always positive!
   </p>

   <h3 className="text-lg font-semibold text-blue-700 mt-4">Fractions & Percentages</h3>
   <p className="text-slate-600 dark:text-[#a1a1aa]">
    A percentage is a fraction out of 100. If a truck carries 400 kg out of a maximum 1000 kg, 
    the fraction is 400 / 1000, which equals 40%.
   </p>
   </div>
  </div>

  {/* Interactive Simulator */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <Truck className="text-blue-600" /> Logistics Simulator
   </h2>
   
   {/* Visualizer */}
   <div className={`relative w-full h-40 bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] rounded-lg border border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] overflow- flex items-end pb-8 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   {/* Grid Lines */}
   <div className="absolute w-full h-px bg-slate-400 dark:bg-[#121212] bottom-8"></div>
   {Array.from({ length: 11 }).map((_, i) => {
    const val = (i - 5) * 20;
    return (
    <div key={i} className="absolute bottom-6 flex flex-col items-center" style={{ left: `${(i / 10) * 100}%`, transform: 'translateX(-50%)' }}>
     <div className="h-2 w-px bg-slate-600 dark:bg-[#121212]"></div>
     <span className="text-xs font-semibold text-slate-500 dark:text-[#71717a] mt-1">{val}</span>
    </div>
    );
   })}
   
   {/* Truck Icon */}
   <div 
    className="absolute bottom-8 transition-all duration-1000 ease-in-out"
    style={{ left: `${(truckPos + 100) / 2}%`, transform: 'translateX(-50%)' }}
   >
    <Truck size={36} className="text-blue-600" />
   </div>
   </div>

   {/* Controls */}
   <div className={`flex flex-col gap-4 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border `}>
   <div>
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-1">Target Position (km): {targetPos}</label>
    <input 
    type="range" min="-100" max="100" step="10" 
    value={targetPos} onChange={(e) => setTargetPos(Number(e.target.value))}
    className="w-full accent-blue-600"
    />
   </div>
   
   <div>
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-1 flex items-center gap-1">
    <Package size={16} /> Current Load (kg): {loadKg} / 1000
    </label>
    <input 
    type="range" min="0" max="1000" step="50" 
    value={loadKg} onChange={(e) => setLoadKg(Number(e.target.value))}
    className="w-full accent-green-600"
    />
   </div>

   <button 
    onClick={driveTruck}
    className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 `}
   >
    <Truck size={20} /> Drive & Record Data
   </button>
   </div>
  </div>

  {/* Data & Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200 dark:border-[#1c1b1b] `}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">Analysis & Assessment</h2>
   
   <div className="flex-1 min-w-0 lg:overflow-y-auto border rounded-lg bg-slate-50 dark:bg-[#121212] p-2 min-h-[150px]">
   {logs.length === 0 ? (
    <div className="text-center text-slate-400 mt-10">No data recorded yet.</div>
   ) : (
    <table className="w-full text-sm text-left">
    <thead className="text-xs text-slate-500 dark:text-[#71717a] uppercase border-b">
     <tr>
     <th className="px-2 py-1">Start</th>
     <th className="px-2 py-1">End</th>
     <th className="px-2 py-1">Dist (|x|)</th>
     <th className="px-2 py-1">Load %</th>
     </tr>
    </thead>
    <tbody>
     {logs.map(l => (
     <tr key={l.id} className="border-b">
      <td className="px-2 py-1">{l.start}</td>
      <td className="px-2 py-1">{l.end}</td>
      <td className="px-2 py-1 font-bold text-blue-600">{l.dist}</td>
      <td className="px-2 py-1 text-green-600">{l.load}%</td>
     </tr>
     ))}
    </tbody>
    </table>
   )}
   </div>

   <div className="flex flex-col gap-4">
   <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900">
    <p className="text-sm font-semibold mb-2">{q1}</p>
    <div className="flex flex-wrap gap-2">
    <input 
     type="number" value={q1Ans} onChange={(e) => setQ1Ans(e.target.value)}
     className="flex-1 min-w-0 border rounded px-2 py-1 outline-none focus:border-blue-400"
     placeholder="Distance..."
    />
    <button onClick={checkQ1} className="px-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">Check</button>
    </div>
    {q1Status !== null && (
    <div className={`mt-2 flex items-center gap-1 text-sm font-bold ${q1Status ? 'text-green-600' : 'text-red-500'}`}>
     {q1Status ? <CheckCircle size={16} /> : <XCircle size={16} />}
     {q1Status ? 'Correct!' : 'Try again. Remember: Distance = |End - Start|'}
    </div>
    )}
   </div>

   <div className="bg-green-50 p-4 rounded-lg border border-green-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <p className="text-sm font-semibold mb-2">{q2}</p>
    <div className="flex flex-wrap gap-2">
    <input 
     type="number" value={q2Ans} onChange={(e) => setQ2Ans(e.target.value)}
     className="flex-1 min-w-0 border rounded px-2 py-1 outline-none focus:border-green-400"
     placeholder="Percentage..."
    />
    <button onClick={checkQ2} className="px-3 bg-green-600 text-white rounded font-bold hover:bg-green-700 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">Check</button>
    </div>
    {q2Status !== null && (
    <div className={`mt-2 flex items-center gap-1 text-sm font-bold ${q2Status ? 'text-green-600' : 'text-red-500'}`}>
     {q2Status ? <CheckCircle size={16} /> : <XCircle size={16} />}
     {q2Status ? 'Correct!' : 'Try again. Formula: (Load / 1000) * 100'}
    </div>
    )}
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
