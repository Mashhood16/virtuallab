import { useState, useEffect } from 'react';
import { Play, Activity, Target, Calculator, Database } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC11AtomicStructure({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [bField, setBField] = useState<number>(1.0);
 const [voltage, setVoltage] = useState<number>(1000);
 const [massData, setMassData] = useState<{mass: number, radius: number, yPos: number}[]>([]);
 const [logs, setLogs] = useState<{bField: number, voltage: number, r20: string, r21: string, r22: string}[]>([]);

 const handleRunMassSpec = () => {
 const k = 5; 
 const r20 = (k * Math.sqrt(20 * voltage)) / (bField * 100);
 const r21 = (k * Math.sqrt(21 * voltage)) / (bField * 100);
 const r22 = (k * Math.sqrt(22 * voltage)) / (bField * 100);
 setMassData([
  { mass: 20, radius: r20, yPos: 150 + r20 },
  { mass: 21, radius: r21, yPos: 150 + r21 },
  { mass: 22, radius: r22, yPos: 150 + r22 },
 ]);
 };

 const handleLog = () => {
 if (massData.length === 0) return;
 setLogs([...logs, {
  bField, voltage,
  r20: massData[0].radius.toFixed(2),
  r21: massData[1].radius.toFixed(2),
  r22: massData[2].radius.toFixed(2)
 }]);
 };

 // Assessment
 const [unknownIsotopeMass, setUnknownIsotopeMass] = useState<number>(0);
 const [answerRadius, setAnswerRadius] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 useEffect(() => {
 setUnknownIsotopeMass(Math.floor(Math.random() * 10) + 30);
 }, []);

 const checkAnswer = () => {
 const k = 5;
 const expected = (k * Math.sqrt(unknownIsotopeMass * voltage)) / (bField * 100);
 const parsed = parseFloat(answerRadius);
 if (!isNaN(parsed) && Math.abs(parsed - expected) < 0.5) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  {/* Header */}
  <LabHeader onExit={onExit} title="Atomic Structure & Mass Spectrometry" />

  {/* Main Content Grid */}
  
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
  
  {/* Column 1: Theory & Setup */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6  ? 'flex' : 'hidden'} lg:flex`}>
   <div>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
    <Activity className="w-5 h-5 text-indigo-500" />
    Theory
   </h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed mb-4">
    A mass spectrometer separates isotopes based on their mass-to-charge ratio. Ions are accelerated by an electric field and then deflected by a magnetic field. 
    The radius of curvature \( r \) of their path is proportional to the square root of their mass \( m \):
   </p>
   <div className={`bg-indigo-50 p-4 rounded-lg text-center font-mono text-indigo-800 text-sm mb-4 dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff] flex-col `}>
    r ∝ √(m · V) / B
   </div>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed">
    Adjust the <strong>Accelerating Voltage (V)</strong> and <strong>Magnetic Field (B)</strong> to see how Neon isotopes (Ne-20, Ne-21, Ne-22) separate!
   </p>
   </div>

   <div className="flex-1">
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-4">Instrument Controls</h3>
   
   <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Magnetic Field: {bField.toFixed(2)} T</label>
   <input 
    type="range" min="0.5" max="2.0" step="0.1" 
    value={bField} onChange={(e) => setBField(parseFloat(e.target.value))}
    className="w-full mb-4 accent-indigo-600"
   />

   <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Accelerating Voltage: {voltage} V</label>
   <input 
    type="range" min="500" max="2000" step="100" 
    value={voltage} onChange={(e) => setVoltage(parseFloat(e.target.value))}
    className="w-full mb-6 accent-indigo-600"
   />

   <button 
    onClick={handleRunMassSpec}
    className={`w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40 `}
   >
    <Play className="w-4 h-4" /> Fire Ion Gun
   </button>
   </div>
  </div>

  {/* Column 2: Simulation Visualizer */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center justify-center  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] w-full mb-4">Mass Spectrometer Tube</h2>
   
   <svg viewBox="0 0 400 300" className={`w-full h-80 bg-slate-100 dark:bg-[#121212] rounded-lg shadow-inner overflow- flex-col `}>
   <rect x="100" y="0" width="250" height="300" fill="#e2e8f0" opacity="0.5" />
   <text x="225" y="20" className="text-xs fill-slate-500 text-center font-semibold" textAnchor="middle">Magnetic Field (B) Region</text>

   {massData.map((d, i) => (
    <g key={i}>
    <path
     d={`M 0 150 L 100 150 A ${d.radius} ${d.radius} 0 0 0 ${100 + d.radius} ${d.yPos}`}
     fill="none"
     stroke={i === 0 ? "#ef4444" : i === 1 ? "#3b82f6" : "#10b981"}
     strokeWidth="2"
     strokeDasharray="4"
     className="animate-[dash_2s_linear_forwards]"
    />
    <circle cx={100 + d.radius} cy={d.yPos} r="4" fill={i === 0 ? "#ef4444" : i === 1 ? "#3b82f6" : "#10b981"} />
    <text x={100 + d.radius} y={d.yPos + 15} className="text-[10px] font-bold" textAnchor="middle">Ne-{d.mass}</text>
    </g>
   ))}
   
   <rect x="100" y="290" width="250" height="10" fill="#334155" />
   <text x="225" y="285" className="text-xs fill-slate-600 font-bold" textAnchor="middle">Detector Array</text>
   
   <rect x="0" y="130" width="30" height="40" fill="#94a3b8" />
   <text x="15" y="145" className="text-[10px] font-bold fill-white" textAnchor="middle">Ion</text>
   <text x="15" y="155" className="text-[10px] font-bold fill-white" textAnchor="middle">Gun</text>
   </svg>

   {massData.length > 0 && (
   <button onClick={handleLog} className={`mt-6 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-semibold flex items-center gap-2 transition-colors `}>
    <Database className="w-4 h-4" /> Record Data
   </button>
   )}
  </div>

  {/* Column 3: Data Logging & Assessment */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col gap-6 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <div className="flex-1">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
    <Database className="w-5 h-5 text-emerald-500" />
    Data Log
   </h2>
   <div className="overflow-x-auto border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
    <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff]">
     <tr>
     <th className="px-3 py-2">B (T)</th>
     <th className="px-3 py-2">V (V)</th>
     <th className="px-3 py-2">r(20)</th>
     <th className="px-3 py-2">r(22)</th>
     </tr>
    </thead>
    <tbody>
     {logs.length === 0 ? (
     <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-500 dark:text-[#71717a] italic">No data recorded.</td></tr>
     ) : (
     logs.map((l, i) => (
      <tr key={i} className="border-b border-slate-100">
      <td className="px-3 py-2">{l.bField}</td>
      <td className="px-3 py-2">{l.voltage}</td>
      <td className="px-3 py-2">{l.r20}</td>
      <td className="px-3 py-2">{l.r22}</td>
      </tr>
     ))
     )}
    </tbody>
    </table>
   </div>
   </div>

   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
    <Calculator className="w-5 h-5 text-amber-500" />
    Analysis
   </h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    An unknown isotope of element X has a mass of <strong>{unknownIsotopeMass} amu</strong>. 
    Based on the instrument settings (V={voltage} V, B={bField} T), calculate its expected <strong>radius of curvature</strong> on the detector.
   </p>
   <div className="flex gap-2">
    <input 
    type="number" step="0.1" placeholder="Radius..." 
    value={answerRadius} onChange={(e) => setAnswerRadius(e.target.value)}
    className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
    />
    <button onClick={checkAnswer} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40">
    <Target className="w-4 h-4" /> Check
    </button>
   </div>
   {isCorrect === true && <p className="text-emerald-600 text-sm font-bold mt-2">Correct! Excellent job.</p>}
   {isCorrect === false && <p className="text-red-500 text-sm font-bold mt-2">Incorrect. Check your formula and try again.</p>}
   </div>
  </div>

  </div>
 </div>
 );
}
