import { useState } from 'react';
import {Calculator, Activity, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabP10ElectromagnetDC({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [I, setI] = useState<number>(5); // Current in A (-10 to 10)
 const [B, setB] = useState<number>(0.5); // Magnetic Field in T (0.1 to 1.0)
 const [L, setL] = useState<number>(0.1); // Length in m (0.05 to 0.20)
 const [m, setM] = useState<number>(0.1); // Mass in kg (0.05 to 0.20)
 
 const [isMystery, setIsMystery] = useState<boolean>(false);
 const [mysteryM, setMysteryM] = useState<number>(0.08);
 
 const [data, setData] = useState<{ I: number, B: number, theta: number, tanTheta: number }[]>([]);
 const [answer, setAnswer] = useState<string>('');
 const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

 const startMystery = () => {
 setIsMystery(true);
 // Random mass between 0.05 and 0.15
 setMysteryM(Number((0.05 + Math.random() * 0.1).toFixed(3)));
 setData([]);
 setAnswer('');
 setFeedback(null);
 };

 // Calculations
 const actualM = isMystery ? mysteryM : m;
 const g = 9.81;
 const exactTanTheta = (B * I * L) / (actualM * g);
 const exactTheta = Math.atan(exactTanTheta) * (180 / Math.PI);
 
 // Add 0.5 degrees noise, but keep 0 when I=0
 const noise = I !== 0 ? (Math.random() - 0.5) * 1.0 : 0;
 const measuredTheta = exactTheta + noise;
 const measuredTanTheta = Math.tan(measuredTheta * (Math.PI / 180));

 const handleRecord = () => {
 setData([...data, {
  I,
  B,
  theta: Number(measuredTheta.toFixed(1)),
  tanTheta: Number(measuredTanTheta.toFixed(3))
 }]);
 };

 const handleCheck = () => {
 const val = parseFloat(answer);
 if (!isNaN(val) && Math.abs(val - mysteryM) <= 0.01) {
  setFeedback('correct');
 } else {
  setFeedback('incorrect');
 }
 };

 // Graph Scaling (I vs tanTheta)
 const maxTan = Math.max(2, ...data.map(d => Math.abs(d.tanTheta)));
 
 // map X for current (-10 to +10) -> (40 to 280)
 const mapX = (val: number) => 160 + (val / 10) * 120;
 // map Y for tanTheta (-maxTan to +maxTan) -> (160 to 20)
 const mapY = (val: number) => 90 - (val / Math.max(2, maxTan)) * 70;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Unit 17: Lorentz Force & DC Motor Principle" subtitle="Measure the magnetic force on a current-carrying wire in a uniform magnetic field." />

  
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
  <div className="lg:flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
  
  {/* Column 1: Theory & Setup */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow-  ? 'flex' : 'hidden'} lg:flex`}>
   <div className={`bg-amber-500 p-4 text-slate-900 dark:text-[#ffffff] flex items-center gap-2 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
   <BookOpen className="w-5 h-5" />
   <h2 className="font-bold text-lg">Theory & Setup</h2>
   </div>
   <div className="p-6 flex-1 flex flex-col gap-6 lg:overflow-y-auto">
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa]">
    <p>A wire of length <strong>L</strong> carrying current <strong>I</strong> in a magnetic field <strong>B</strong> experiences a magnetic force <strong>F<sub>m</sub></strong>:</p>
    <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-center font-mono text-sm border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    F<sub>m</sub> = B · I · L
    </div>
    <p>When the wire hangs like a pendulum of mass <strong>m</strong>, gravity pulls it down. At equilibrium, the angle <strong>θ</strong> is given by:</p>
    <div className="bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-center font-mono text-sm border border-slate-200 dark:border-[#1c1b1b]">
    tan(θ) = (B · I · L) / (m · g)
    </div>
   </div>

   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] space-y-4">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <Activity className="w-4 h-4 text-amber-600" /> Controls
    </h3>
    
    <div className="space-y-2">
    <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     <label>Current (I)</label>
     <span>{I.toFixed(1)} A</span>
    </div>
    <input 
     type="range" min="-10" max="10" step="0.5" 
     value={I} onChange={(e) => setI(parseFloat(e.target.value))}
     className="w-full accent-amber-500"
    />
    </div>

    <div className="space-y-2">
    <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     <label>Magnetic Field (B)</label>
     <span>{B.toFixed(2)} T</span>
    </div>
    <input 
     type="range" min="0.1" max="1.0" step="0.05" 
     value={B} onChange={(e) => setB(parseFloat(e.target.value))}
     className="w-full accent-blue-500"
    />
    </div>

    <div className="space-y-2">
    <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     <label>Wire Length (L)</label>
     <span>{L.toFixed(2)} m</span>
    </div>
    <input 
     type="range" min="0.05" max="0.20" step="0.01" 
     value={L} onChange={(e) => setL(parseFloat(e.target.value))}
     className="w-full accent-green-500"
    />
    </div>

    {!isMystery && (
    <div className="space-y-2">
     <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     <label>Wire Mass (m)</label>
     <span>{m.toFixed(3)} kg</span>
     </div>
     <input 
     type="range" min="0.05" max="0.20" step="0.01" 
     value={m} onChange={(e) => setM(parseFloat(e.target.value))}
     className="w-full accent-indigo-500"
     />
    </div>
    )}

    {!isMystery && (
    <button 
     onClick={startMystery}
     className="w-full mt-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 transition-colors border border-indigo-300"
    >
     Find Unknown Mass Challenge
    </button>
    )}
    {isMystery && (
    <div className="mt-4 p-3 bg-indigo-600 text-white rounded-lg text-sm font-medium text-center shadow-inner dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
     Mystery Mode! Find mass 'm'.
    </div>
    )}
   </div>
   </div>
  </div>

  {/* Column 2: Simulation */}
  <div className="bg-[#000000] dark:bg-[#121212] lg:dark:bg-[#121212] rounded-2xl shadow-inner border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
   <div className="absolute top-4 left-4 text-slate-300 font-medium text-sm flex items-center gap-2 z-10">
   <Activity className="w-4 h-4 text-amber-400" /> Front View
   </div>
   
   <div className="flex-1 relative w-full flex items-center justify-center min-h-[400px]">
   {/* Background field indicator */}
   <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
    <div className="grid grid-cols-5 gap-8">
     {[...Array(15)].map((_, i) => (
     <div key={i} className="text-white font-bold text-xl">✕</div> // Into the page (B field)
     ))}
    </div>
   </div>
   
   {/* Pivot support */}
   <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-4 bg-white lg:bg-slate-600 dark:bg-[#121212] lg:dark:bg-[#121212] rounded-full border-2 border-slate-500 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] shadow-xl z-20 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t" />

   {/* Pendulum Wire */}
   <div 
    className="absolute top-12 left-1/2 w-0 h-64 origin-top transition-transform duration-500 ease-out z-10"
    style={{ transform: `rotate(${exactTheta}deg)` }}
   >
    {/* Vertical arms */}
    <div className="absolute left-[-40px] w-2 h-full bg-amber-400 border border-amber-600" />
    <div className="absolute right-[-40px] w-2 h-full bg-amber-400 border border-amber-600" />
    {/* Horizontal current-carrying bar */}
    <div className="absolute bottom-0 left-[-45px] h-4 bg-amber-500 border border-amber-700 rounded-full flex items-center justify-center overflow-hidden dark:bg-[#121212] dark:border-[#1c1b1b]" style={{ width: '90px' }}>
    {I !== 0 && (
     <div className={`w-2 h-2 bg-slate-50 dark:bg-[#121212] rounded-full shadow-[0_0_8px_white] ${I > 0 ? 'animate-[flowRight_0.5s_linear_infinite]' : 'animate-[flowLeft_0.5s_linear_infinite]'}`} />
    )}
    </div>
   </div>

   <style>{`
    @keyframes flowRight { 0% { transform: translateX(-40px); } 100% { transform: translateX(40px); } }
    @keyframes flowLeft { 0% { transform: translateX(40px); } 100% { transform: translateX(-40px); } }
   `}</style>

   {/* Protractor / Angle Measure */}
   <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 border-b-2 border-dashed border-slate-500 dark:border-[#1c1b1b] rounded-full pointer-events-none opacity-50 flex items-end justify-center pb-2">
    <div className="w-px h-full bg-slate-500 dark:bg-[#121212]" />
   </div>

   {/* Measurement HUD */}
   <div className="absolute top-16 right-4 bg-[#121212] dark:bg-[#121212]/80 backdrop-blur p-3 rounded-lg border border-[#1c1b1b] dark:border-[#1c1b1b] text-slate-300 font-mono text-sm z-20 shadow-lg">
    <div>θ: {measuredTheta.toFixed(1)}°</div>
   </div>

   </div>
   
   {/* Action Area */}
   <div className="bg-[#121212] dark:bg-[#121212] p-4 border-t border-[#1c1b1b] dark:border-[#1c1b1b] flex justify-center">
   <button 
    onClick={handleRecord}
    className={`px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40 `}
   >
    <Activity className="w-5 h-5" /> Record Deflection
   </button>
   </div>
  </div>

  {/* Column 3: Data & Analysis */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow-hidden">
   <div className="bg-blue-600 p-4 text-white flex items-center gap-2 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">
   <Calculator className="w-5 h-5" />
   <h2 className="font-bold text-lg">Data & Analysis</h2>
   </div>
   
   <div className="p-4 flex-1 flex flex-col gap-4 lg:overflow-y-auto">
   {/* Table */}
   <div className="border border-slate-200 dark:border-[#1c1b1b] rounded-lg overflow-hidden shrink-0">
    <table className="w-full text-xs text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] font-semibold border-b border-slate-200 dark:border-[#1c1b1b]">
     <tr>
     <th className="px-2 py-2">I (A)</th>
     <th className="px-2 py-2">B (T)</th>
     <th className="px-2 py-2">θ (°)</th>
     <th className="px-2 py-2">tan(θ)</th>
     </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
     {data.length === 0 ? (
     <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-400 italic">No data recorded.</td></tr>
     ) : (
     data.map((row, i) => (
      <tr key={i} className="hover:bg-slate-50 dark:bg-[#121212]">
      <td className="px-2 py-2">{row.I}</td>
      <td className="px-2 py-2">{row.B}</td>
      <td className="px-2 py-2">{row.theta}</td>
      <td className="px-2 py-2 font-mono text-blue-600">{row.tanTheta}</td>
      </tr>
     ))
     )}
    </tbody>
    </table>
   </div>

   {/* SVG Graph */}
   <div className={`bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-4 flex flex-col items-center shrink-0 `}>
    <h4 className="text-xs font-bold text-slate-500 dark:text-[#71717a] mb-2 uppercase tracking-wider">I vs tan(θ)</h4>
    <div className="relative w-full aspect-[3/2] max-w-[300px]">
    <svg viewBox="0 0 320 180" className="w-full h-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded shadow-inner">
     {/* Axes */}
     <line x1="40" y1="90" x2="300" y2="90" stroke="#94a3b8" strokeWidth="1" /> {/* X Axis center */}
     <line x1="160" y1="20" x2="160" y2="160" stroke="#94a3b8" strokeWidth="1" /> {/* Y Axis center */}
     
     {/* Labels */}
     <text x="290" y="105" textAnchor="end" fontSize="10" fill="#64748b">I (A)</text>
     <text x="165" y="15" textAnchor="start" fontSize="10" fill="#64748b">tan(θ)</text>

     {/* Data Points */}
     {data.map((d, i) => (
     <circle key={i} cx={mapX(d.I)} cy={mapY(d.tanTheta)} r="3" fill="#3b82f6" />
     ))}
    </svg>
    </div>
   </div>

   {/* Assessment */}
   {isMystery && (
    <div className="mt-auto bg-indigo-50 p-4 rounded-xl border border-indigo-200 shrink-0 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h4 className="font-bold text-indigo-800 mb-2 text-sm dark:text-[#ffffff]">Analysis: Find 'm'</h4>
    <p className="text-xs text-indigo-700 mb-3">
     Calculate the unknown mass <strong>m</strong>. Slope of I vs tan(θ) = (B·L)/(m·g). Use g = 9.81 m/s².
    </p>
    <div className="flex gap-2">
     <input 
     type="number" step="0.001" placeholder="Mass in kg" 
     value={answer} onChange={(e) => setAnswer(e.target.value)}
     className="flex-1 px-3 py-2 rounded border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
     />
     <button 
     onClick={handleCheck}
     className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-sm transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
     >
     Check
     </button>
    </div>
    {feedback === 'correct' && <div className="mt-2 text-sm text-green-600 font-bold flex items-center gap-1">Correct! You found m = {mysteryM} kg</div>}
    {feedback === 'incorrect' && <div className="mt-2 text-sm text-red-600 font-bold flex items-center gap-1">Incorrect. Try recalculating.</div>}
    </div>
   )}
   </div>
  </div>

  </div>
 </div>
 );
}
