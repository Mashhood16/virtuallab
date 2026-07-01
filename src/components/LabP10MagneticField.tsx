import { useState } from 'react';
import {Calculator, Activity, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabP10MagneticField({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [m, setM] = useState<number>(0.5);
 const [xCm, setXCm] = useState<number>(10);
 const [isMystery, setIsMystery] = useState<boolean>(false);
 const [mysteryM, setMysteryM] = useState<number>(0.45);
 
 const [data, setData] = useState<{ x: number, invX3: number, B: number }[]>([]);
 const [answer, setAnswer] = useState<string>('');
 const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

 const startMystery = () => {
 setIsMystery(true);
 setMysteryM(Number((0.2 + Math.random() * 0.6).toFixed(2)));
 setData([]);
 setAnswer('');
 setFeedback(null);
 };

 // Calculations
 const actualM = isMystery ? mysteryM : m;
 const xMeters = xCm / 100;
 // B = (mu_0 / 4pi) * (2m / x^3) = 10^-7 * 2m / x^3 [Tesla] = 0.2 * m / x^3 [uT]
 const exactB = (0.2 * actualM) / Math.pow(xMeters, 3);
 // Add 2% realistic noise
 const noise = (Math.random() - 0.5) * 0.04 * exactB;
 const measuredB = exactB + noise;

 const handleRecord = () => {
 setData([...data, {
  x: xCm,
  invX3: 1 / Math.pow(xMeters, 3),
  B: Number(measuredB.toFixed(1))
 }]);
 };

 const handleCheck = () => {
 const val = parseFloat(answer);
 if (!isNaN(val) && Math.abs(val - mysteryM) <= 0.05) {
  setFeedback('correct');
 } else {
  setFeedback('incorrect');
 }
 };

 // Graph Scaling
 const maxInvX3 = Math.max(8000, ...data.map(d => d.invX3));
 const maxB = Math.max(200, ...data.map(d => d.B));
 const mapX = (val: number) => 40 + (val / maxInvX3) * 240;
 const mapY = (val: number) => 160 - (val / maxB) * 140;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  {/* Header */}
  <LabHeader onExit={onExit} title="Unit 17: Magnetic Field of a Dipole" subtitle="Investigate the inverse-cube law of a magnetic dipole on its axial line." />

  {/* Main 3-Column Grid */}
  
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
  
  {/* Column 1: Theory & Setup */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow- ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div className={`bg-blue-600 p-4 text-white flex items-center gap-2 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent flex-col `}>
   <BookOpen className="w-5 h-5" />
   <h2 className="font-bold text-lg">Theory & Setup</h2>
   </div>
   <div className="p-6 flex-1 flex flex-col gap-6 lg:overflow-y-auto">
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa]">
    <p>The magnetic field <strong>B</strong> on the axial line of a short bar magnet (a magnetic dipole) at distance <strong>x</strong> from its center is:</p>
    <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-center font-mono text-sm border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    B = (μ₀ / 4π) · (2m / x³)
    </div>
    <p>Where <strong>m</strong> is the magnetic moment and <strong>μ₀/4π</strong> = 10⁻⁷ T·m/A. Our magnetometer measures the field in microteslas (μT).</p>
   </div>

   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] space-y-4">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <Activity className="w-4 h-4 text-blue-600" /> Controls
    </h3>
    
    {!isMystery && (
    <div className="space-y-2">
     <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     <label>Magnetic Moment (m)</label>
     <span>{m.toFixed(2)} A·m²</span>
     </div>
     <input 
     type="range" min="0.1" max="1.0" step="0.1" 
     value={m} onChange={(e) => setM(parseFloat(e.target.value))}
     className="w-full accent-blue-600"
     />
    </div>
    )}

    <div className="space-y-2">
    <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     <label>Sensor Position (x)</label>
     <span>{xCm} cm</span>
    </div>
    <input 
     type="range" min="5" max="20" step="1" 
     value={xCm} onChange={(e) => setXCm(parseFloat(e.target.value))}
     className="w-full accent-green-600"
    />
    </div>

    {!isMystery && (
    <button 
     onClick={startMystery}
     className="w-full mt-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 transition-colors border border-indigo-300"
    >
     Start Mystery Magnet Challenge
    </button>
    )}
    {isMystery && (
    <div className="mt-4 p-3 bg-indigo-600 text-white rounded-lg text-sm font-medium text-center shadow-inner dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
     Mystery Mode Active! Determine 'm'.
    </div>
    )}
   </div>
   </div>
  </div>

  {/* Column 2: Simulation */}
  <div className="bg-[#000000] dark:bg-[#121212] lg:dark:bg-[#121212] rounded-2xl shadow-inner border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
   <div className="absolute top-4 left-4 text-slate-300 font-medium text-sm flex items-center gap-2 z-10">
   <Activity className="w-4 h-4 text-green-400" /> Top-Down View
   </div>
   
   <div className="flex-1 relative w-full flex items-center justify-center min-h-[400px]">
   {/* Rulers and Grid */}
   <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t" />
   <div className="absolute top-1/2 w-full h-px bg-slate-600 dark:bg-[#121212]" />
   <div className="absolute left-1/2 h-full w-px bg-slate-600 dark:bg-[#121212]" />

   {/* Scale markings */}
   <div className="absolute top-1/2 left-1/2 w-[300px] h-4 flex translate-y-2">
    {[5, 10, 15, 20].map(mark => (
     <div key={mark} className="absolute text-xs text-slate-400 -translate-x-1/2" style={{ left: `${(mark/20)*100}%` }}>
     <div className="w-px h-2 bg-slate-500 dark:bg-[#121212] mx-auto mb-1"></div>
     {mark}
     </div>
    ))}
   </div>

   {/* Magnet */}
   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-8 flex shadow-[0_0_15px_rgba(255,0,0,0.3)] z-10">
    <div className="w-1/2 h-full bg-blue-600 border border-blue-800 flex items-center justify-center text-white text-xs font-bold rounded-l-sm dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">S</div>
    <div className="w-1/2 h-full bg-red-600 border border-red-800 flex items-center justify-center text-white text-xs font-bold rounded-r-sm">N</div>
   </div>

   {/* Sensor (Compass / Magnetometer) */}
   <div 
    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-green-400 bg-[#121212] dark:bg-[#121212]/80 backdrop-blur shadow-[0_0_10px_rgba(74,222,128,0.5)] flex items-center justify-center z-20 transition-all duration-300"
    style={{ left: `calc(50% + ${(xCm / 20) * 150}px)` }}
   >
    <div className="w-1 h-1 bg-green-400 rounded-full" />
    <div className="absolute -top-8 text-xs font-bold text-green-400 bg-[#000000] dark:bg-[#121212] px-2 py-1 rounded border border-green-900 whitespace-nowrap">
    {measuredB.toFixed(1)} μT
    </div>
   </div>

   {/* Field Lines Visualization (Stylized) */}
   <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
    <path d="M calc(50% + 10px) calc(50% - 10px) C calc(50% + 50px) calc(50% - 100px), calc(50% - 50px) calc(50% - 100px), calc(50% - 10px) calc(50% - 10px)" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
    <path d="M calc(50% + 10px) calc(50% + 10px) C calc(50% + 50px) calc(50% + 100px), calc(50% - 50px) calc(50% + 100px), calc(50% - 10px) calc(50% + 10px)" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
   </svg>

   </div>
   
   {/* Action Area */}
   <div className="bg-[#121212] dark:bg-[#121212] p-4 border-t border-[#1c1b1b] dark:border-[#1c1b1b] flex justify-center">
   <button 
    onClick={handleRecord}
    className={`px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40 `}
   >
    <Activity className="w-5 h-5" /> Record B-Field
   </button>
   </div>
  </div>

  {/* Column 3: Data & Analysis */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow-hidden">
   <div className="bg-emerald-600 p-4 text-white flex items-center gap-2 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">
   <Calculator className="w-5 h-5" />
   <h2 className="font-bold text-lg">Data & Analysis</h2>
   </div>
   
   <div className="p-4 flex-1 flex flex-col gap-4 lg:overflow-y-auto">
   {/* Table */}
   <div className="border border-slate-200 dark:border-[#1c1b1b] rounded-lg overflow-hidden shrink-0">
    <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] font-semibold border-b border-slate-200 dark:border-[#1c1b1b]">
     <tr>
     <th className="px-3 py-2">x (cm)</th>
     <th className="px-3 py-2">1/x³ (m⁻³)</th>
     <th className="px-3 py-2">B (μT)</th>
     </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
     {data.length === 0 ? (
     <tr><td colSpan={3} className="px-3 py-4 text-center text-slate-400 italic">No data recorded yet.</td></tr>
     ) : (
     data.map((row, i) => (
      <tr key={i} className="hover:bg-slate-50 dark:bg-[#121212]">
      <td className="px-3 py-2">{row.x}</td>
      <td className="px-3 py-2">{Math.round(row.invX3)}</td>
      <td className="px-3 py-2 font-mono text-emerald-600">{row.B}</td>
      </tr>
     ))
     )}
    </tbody>
    </table>
   </div>

   {/* SVG Graph */}
   <div className={`bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-4 flex flex-col items-center shrink-0 `}>
    <h4 className="text-xs font-bold text-slate-500 dark:text-[#71717a] mb-2 uppercase tracking-wider">B vs 1/x³</h4>
    <div className="relative w-full aspect-[3/2] max-w-[300px]">
    <svg viewBox="0 0 300 200" className="w-full h-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded shadow-inner">
     {/* Axes */}
     <line x1="40" y1="160" x2="280" y2="160" stroke="#94a3b8" strokeWidth="2" />
     <line x1="40" y1="20" x2="40" y2="160" stroke="#94a3b8" strokeWidth="2" />
     
     {/* Labels */}
     <text x="150" y="190" textAnchor="middle" fontSize="10" fill="#64748b">1/x³ (m⁻³)</text>
     <text x="15" y="90" textAnchor="middle" transform="rotate(-90, 15, 90)" fontSize="10" fill="#64748b">B (μT)</text>

     {/* Data Points */}
     {data.map((d, i) => (
     <circle key={i} cx={mapX(d.invX3)} cy={mapY(d.B)} r="3" fill="#10b981" />
     ))}

     {/* Best fit line (approximate from origin) */}
     {data.length > 1 && (
     <line 
      x1={mapX(0)} y1={mapY(0)} 
      x2={mapX(maxInvX3)} 
      y2={mapY((0.2 * actualM) * maxInvX3)} 
      stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" 
     />
     )}
    </svg>
    </div>
   </div>

   {/* Assessment */}
   {isMystery && (
    <div className="mt-auto bg-indigo-50 p-4 rounded-xl border border-indigo-200 shrink-0 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h4 className="font-bold text-indigo-800 mb-2 text-sm dark:text-[#ffffff]">Analysis: Find 'm'</h4>
    <p className="text-xs text-indigo-700 mb-3">
     Calculate the slope of your B vs 1/x³ graph to find the unknown magnetic moment. Slope = 0.2 × m.
    </p>
    <div className="flex gap-2">
     <input 
     type="number" step="0.01" placeholder="m in A·m²" 
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
    {feedback === 'correct' && <div className="mt-2 text-sm text-green-600 font-bold flex items-center gap-1">Correct! You found m = {mysteryM} A·m²</div>}
    {feedback === 'incorrect' && <div className="mt-2 text-sm text-red-600 font-bold flex items-center gap-1">Incorrect. Check your slope calculation.</div>}
    </div>
   )}
   </div>
  </div>

  </div>
 </div>
 );
}
