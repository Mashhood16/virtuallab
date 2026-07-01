import { useState, useEffect } from 'react';
import { CheckCircle, Calculator, HelpCircle, Trash2, TrendingUp, MapPin } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit?: () => void;
}

export default function LabM9LinearGraphs({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [rate, setRate] = useState<number>(2);
 const [base, setBase] = useState<number>(10);
 const [distance, setDistance] = useState<number>(15);

 const [logs, setLogs] = useState<{ d: number; c: number }[]>([]);
 const [targetDist, setTargetDist] = useState<number>(0);
 const [userAns, setUserAns] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 useEffect(() => {
 setTargetDist(Math.floor(Math.random() * 15) + 30);
 }, []);

 const currentCost = rate * distance + base;

 const logData = () => {
 if (!logs.find((l) => l.d === distance)) {
  setLogs([...logs, { d: distance, c: currentCost }].sort((a, b) => a.d - b.d));
 }
 };

 const clearLogs = () => setLogs([]);

 const checkAns = () => {
 const expected = rate * targetDist + base;
 if (parseFloat(userAns) === expected) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 const SVG_SIZE = 400;
 const MAX_X = 50;
 const MAX_Y = 250;
 const scaleX = SVG_SIZE / MAX_X;
 const scaleY = SVG_SIZE / MAX_Y;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Lab M9.1: Linear Graphs in Real Contexts" subtitle="Modeling Taxi Fares using y = mx + c" />
  

  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 max-w-7xl mx-auto w-full overflow-y-auto lg:overflow-visible">
  {/* Column 1: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-4  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <HelpCircle className="text-indigo-600" size={20} />
   Linear Equations Theory
   </h2>
   <div className="prose prose-slate text-sm">
   <p>
    Linear graphs represent relationships with a constant rate of change.
    The standard form is <strong>y = mx + c</strong>.
   </p>
   <ul className="list-disc pl-5 space-y-2 mt-2">
    <li><strong>y (Dependent Variable):</strong> Total Cost.</li>
    <li><strong>x (Independent Variable):</strong> Distance Traveled.</li>
    <li><strong>m (Slope / Gradient):</strong> Rate per km.</li>
    <li><strong>c (y-intercept):</strong> Base fare (cost at 0 km).</li>
   </ul>
   <div className={`mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    <p className="font-mono text-indigo-900 text-center text-lg dark:text-[#ffffff]">
    Cost = ({rate} × Distance) + {base}
    </p>
   </div>
   <p className="mt-4">
    Use the simulator to visualize how changing the base fare (y-intercept) and
    the rate per km (slope) alters the steepness and starting point of the graph.
   </p>
   </div>
  </div>

  {/* Column 2: Simulator */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col gap-4  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <TrendingUp className="text-indigo-600" size={20} />
   Interactive Graph Plotter
   </h2>
   
   <div className="flex-1 min-w-0 flex flex-col items-center justify-center relative">
   <svg width={SVG_SIZE} height={SVG_SIZE} className={`bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded-lg overflow- flex-col `}>
    {/* Grid Lines */}
    {Array.from({ length: 11 }).map((_, i) => (
    <g key={`grid-${i}`}>
     {/* Vertical lines every 5 units */}
     <line x1={i * 5 * scaleX} y1={0} x2={i * 5 * scaleX} y2={SVG_SIZE} stroke="#e2e8f0" strokeWidth="1" />
     {/* Horizontal lines every 25 units */}
     <line x1={0} y1={SVG_SIZE - (i * 25 * scaleY)} x2={SVG_SIZE} y2={SVG_SIZE - (i * 25 * scaleY)} stroke="#e2e8f0" strokeWidth="1" />
    </g>
    ))}
    
    {/* Axes */}
    <line x1={0} y1={SVG_SIZE} x2={SVG_SIZE} y2={SVG_SIZE} stroke="#64748b" strokeWidth="4" />
    <line x1={0} y1={0} x2={0} y2={SVG_SIZE} stroke="#64748b" strokeWidth="4" />
    
    {/* Plotting the main line */}
    <line 
    x1={0} 
    y1={SVG_SIZE - (base * scaleY)} 
    x2={MAX_X * scaleX} 
    y2={SVG_SIZE - ((rate * MAX_X + base) * scaleY)} 
    stroke="#4f46e5" 
    strokeWidth="3" 
    />

    {/* Current Point */}
    <circle 
    cx={distance * scaleX} 
    cy={SVG_SIZE - (currentCost * scaleY)} 
    r={6} 
    fill="#ef4444" 
    />
    <text 
    x={distance * scaleX + 10} 
    y={SVG_SIZE - (currentCost * scaleY) - 10} 
    className="text-xs font-bold fill-slate-700"
    >
    ({distance}, {currentCost})
    </text>
   </svg>
   
   <div className="absolute bottom-2 right-2 text-xs text-slate-400 font-mono">
    X: Distance (km) | Y: Cost ($)
   </div>
   </div>

   <div className="grid grid-cols-2 gap-4 mt-2">
   <div>
    <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] mb-1 block">Base Fare (c): ${base}</label>
    <input type="range" min="0" max="50" step="5" value={base} onChange={(e) => setBase(Number(e.target.value))} className="w-full accent-indigo-600" />
   </div>
   <div>
    <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] mb-1 block">Rate/km (m): ${rate}</label>
    <input type="range" min="0.5" max="5" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-indigo-600" />
   </div>
   <div className="col-span-2">
    <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] mb-1 block">Test Distance (x): {distance} km</label>
    <input type="range" min="0" max="40" step="1" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full accent-red-500" />
   </div>
   </div>
   
   <button onClick={logData} className={`w-full py-2 bg-[#121212] dark:bg-[#121212] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 dark:bg-[#121212] transition-colors `}>
   <MapPin size={18} /> Record Point ({distance}, {currentCost})
   </button>
  </div>

  {/* Column 3: Analysis */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col gap-4  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <Calculator className="text-indigo-600" size={20} />
   Data Log & Assessment
   </h2>
   
   <div className="flex-1 min-w-0 border border-slate-200 dark:border-[#1c1b1b] rounded-lg lg:overflow-y-auto">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#a1a1aa] sticky top-0">
    <tr>
     <th className="p-3">Distance (x)</th>
     <th className="p-3">Cost (y)</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 ? (
     <tr>
     <td colSpan={2} className="p-4 text-center text-slate-400 italic">No data recorded.</td>
     </tr>
    ) : (
     logs.map((log, idx) => (
     <tr key={idx} className="border-b border-slate-100 last:border-0">
      <td className="p-3 font-mono">{log.d} km</td>
      <td className="p-3 font-mono">${log.c.toFixed(2)}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>
   {logs.length > 0 && (
   <button onClick={clearLogs} className="text-xs text-red-500 flex items-center gap-1 self-start hover:underline">
    <Trash2 size={14} /> Clear Logs
   </button>
   )}

   <div className="mt-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
   <h3 className="font-bold text-indigo-900 mb-2 dark:text-[#ffffff]">Knowledge Check</h3>
   <p className="text-sm text-indigo-800 mb-3 dark:text-[#ffffff]">
    Given the current rate of <strong>${rate}/km</strong> and a base fare of <strong>${base}</strong>, calculate the total cost for a <strong>{targetDist} km</strong> trip.
   </p>
   <div className="flex flex-wrap gap-2">
    <input 
    type="number" 
    placeholder="Total Cost ($)" 
    value={userAns}
    onChange={(e) => setUserAns(e.target.value)}
    className="flex-1 min-w-0 px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <button 
    onClick={checkAns}
    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    Check
    </button>
   </div>
   
   {isCorrect === true && (
    <div className="mt-3 p-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 text-sm">
    <CheckCircle size={16} /> Correct! Excellent calculation.
    </div>
   )}
   {isCorrect === false && (
    <div className="mt-3 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
    Incorrect. Remember: Cost = (Rate × Distance) + Base.
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
