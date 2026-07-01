import { useState } from 'react';
import {Calculator, Activity, BookOpen, Play } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabP10FaradayLaw({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [N, setN] = useState<number>(500); // Turns
 const [B, setB] = useState<number>(0.5); // Tesla
 const [v, setV] = useState<number>(2.0); // m/s
 const [A, setA] = useState<number>(0.05); // m^2
 
 const [isMystery, setIsMystery] = useState<boolean>(false);
 const [mysteryA, setMysteryA] = useState<number>(0.08);

 const [animStatus, setAnimStatus] = useState<'idle'|'in'|'pause'|'out'>('idle');
 const [displayEmf, setDisplayEmf] = useState<number>(0);

 const [data, setData] = useState<{ N: number, B: number, v: number, emf: number }[]>([]);
 const [answer, setAnswer] = useState<string>('');
 const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

 const startMystery = () => {
 setIsMystery(true);
 setMysteryA(Number((0.02 + Math.random() * 0.08).toFixed(3)));
 setData([]);
 setAnswer('');
 setFeedback(null);
 };

 const actualA = isMystery ? mysteryA : A;
 
 // Peak EMF = N * B * A * v * 0.1 (0.1 is a coupling constant for our lab)
 const exactEmf = N * B * actualA * v * 0.1;
 const noise = (Math.random() - 0.5) * 0.04 * exactEmf;
 const measuredEmf = exactEmf + noise;

 const runAndRecord = () => {
 if (animStatus !== 'idle') return;
 
 setAnimStatus('in');
 setDisplayEmf(measuredEmf);

 setData(prev => [...prev, {
  N, B, v, emf: Number(measuredEmf.toFixed(2))
 }]);

 setTimeout(() => {
  setAnimStatus('pause');
  setDisplayEmf(0);
  
  setTimeout(() => {
  setAnimStatus('out');
  setDisplayEmf(-measuredEmf);
  
  setTimeout(() => {
   setAnimStatus('idle');
   setDisplayEmf(0);
  }, 800);
  }, 400);
 }, 800);
 };

 const handleCheck = () => {
 const val = parseFloat(answer);
 if (!isNaN(val) && Math.abs(val - mysteryA) <= 0.005) {
  setFeedback('correct');
 } else {
  setFeedback('incorrect');
 }
 };

 // Graph Scaling (v vs emf)
 const maxV = 5.0;
 const maxEmf = Math.max(10, ...data.map(d => Math.abs(d.emf)));
 
 const mapX = (val: number) => 40 + (val / maxV) * 240;
 const mapY = (val: number) => 160 - (val / maxEmf) * 140;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Unit 17: Faraday's Law of Induction" subtitle="Investigate the induced EMF when a magnet moves through a coil." />

  
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
   <div className={`bg-red-600 p-4 text-white flex items-center gap-2 flex-col `}>
   <BookOpen className="w-5 h-5" />
   <h2 className="font-bold text-lg">Theory & Setup</h2>
   </div>
   <div className="p-6 flex-1 flex flex-col gap-6 lg:overflow-y-auto">
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa]">
    <p>According to Faraday's Law, the induced EMF <strong>ε</strong> is proportional to the rate of change of magnetic flux:</p>
    <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-center font-mono text-sm border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    ε = -N · (ΔΦ / Δt)
    </div>
    <p>For our mechanical setup, peak EMF is proportional to Turns (<strong>N</strong>), Field (<strong>B</strong>), Area (<strong>A</strong>), and Velocity (<strong>v</strong>):</p>
    <div className="bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-center font-mono text-sm border border-slate-200 dark:border-[#1c1b1b]">
    ε<sub>peak</sub> = c · N · B · A · v
    </div>
    <p className="text-xs text-slate-400">Where <em>c = 0.1</em> is our apparatus coupling constant.</p>
   </div>

   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] space-y-4">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <Activity className="w-4 h-4 text-red-600" /> Controls
    </h3>
    
    <div className="space-y-2">
    <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     <label>Coil Turns (N)</label>
     <span>{N}</span>
    </div>
    <input 
     type="range" min="100" max="1000" step="100" 
     value={N} onChange={(e) => setN(parseFloat(e.target.value))}
     className="w-full accent-orange-500"
    />
    </div>

    <div className="space-y-2">
    <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     <label>Magnet Strength (B)</label>
     <span>{B.toFixed(2)} T</span>
    </div>
    <input 
     type="range" min="0.1" max="1.0" step="0.1" 
     value={B} onChange={(e) => setB(parseFloat(e.target.value))}
     className="w-full accent-blue-500"
    />
    </div>

    <div className="space-y-2">
    <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     <label>Insertion Speed (v)</label>
     <span>{v.toFixed(1)} m/s</span>
    </div>
    <input 
     type="range" min="0.1" max="5.0" step="0.1" 
     value={v} onChange={(e) => setV(parseFloat(e.target.value))}
     className="w-full accent-green-500"
    />
    </div>

    {!isMystery && (
    <div className="space-y-2">
     <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     <label>Coil Area (A)</label>
     <span>{A.toFixed(3)} m²</span>
     </div>
     <input 
     type="range" min="0.01" max="0.10" step="0.01" 
     value={A} onChange={(e) => setA(parseFloat(e.target.value))}
     className="w-full accent-indigo-500"
     />
    </div>
    )}

    {!isMystery && (
    <button 
     onClick={startMystery}
     className="w-full mt-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 transition-colors border border-indigo-300"
    >
     Find Unknown Area Challenge
    </button>
    )}
    {isMystery && (
    <div className="mt-4 p-3 bg-indigo-600 text-white rounded-lg text-sm font-medium text-center shadow-inner dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
     Mystery Mode! Find Coil Area 'A'.
    </div>
    )}
   </div>
   </div>
  </div>

  {/* Column 2: Simulation */}
  <div className="bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] rounded-2xl shadow-inner border border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
   
   <div className="flex-1 relative w-full flex flex-col items-center mt-6">
   
   {/* Voltmeter */}
   <div className="w-48 h-32 bg-white lg:bg-slate-50 dark:!bg-[#121212] border-4 border-slate-400 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] rounded-t-full relative flex justify-center items-end pb-4 shadow-md z-10 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    {/* Scale */}
    <div className="absolute top-4 w-32 h-16 border-t-2 border-dashed border-slate-400 dark:border-[#1c1b1b] rounded-t-full" />
    <div className="absolute top-2 font-bold text-slate-500 dark:text-[#71717a] text-xs">0</div>
    <div className="absolute top-10 left-4 font-bold text-red-500 text-xs">-</div>
    <div className="absolute top-10 right-4 font-bold text-green-500 text-xs">+</div>
    <div className="absolute bottom-2 font-bold text-slate-800 dark:text-[#ffffff] tracking-widest text-[10px]">VOLTMETER</div>
    
    {/* Digital Readout */}
    <div className="absolute bottom-6 bg-[#121212] dark:bg-[#121212] text-green-400 font-mono text-xs px-2 py-0.5 rounded">
     {displayEmf.toFixed(2)} V
    </div>

    {/* Needle */}
    <div 
     className="absolute bottom-4 w-1 h-24 bg-red-600 origin-bottom rounded-full transition-transform duration-100 shadow-sm" 
     style={{ transform: `rotate(${Math.min(Math.max(displayEmf * 5, -60), 60)}deg)` }} 
    />
   </div>

   {/* Wires */}
   <svg className="absolute top-28 w-full h-40 pointer-events-none z-0">
    <path d="M calc(50% - 50px) 0 C calc(50% - 100px) 50, calc(50% - 100px) 80, calc(50% - 80px) 150" fill="none" stroke="#334155" strokeWidth="3" />
    <path d="M calc(50% + 50px) 0 C calc(50% + 100px) 50, calc(50% + 100px) 80, calc(50% + 80px) 150" fill="none" stroke="#334155" strokeWidth="3" />
   </svg>

   {/* Coil Assembly */}
   <div className="relative mt-20 w-64 h-32 flex items-center justify-center z-20">
    {/* Core tube */}
    <div className="absolute w-full h-20 bg-slate-200 dark:bg-[#121212] border border-slate-400 dark:border-[#1c1b1b] rounded shadow-inner overflow-hidden flex items-center justify-center">
     <div className="w-[95%] h-16 bg-[#121212] dark:bg-[#121212] shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)]" />
    </div>
    
    {/* Wraps */}
    <div className="absolute inset-0 flex justify-evenly items-center">
     {[...Array(15)].map((_, i) => (
     <div key={i} className="w-2 h-24 bg-orange-400 border border-orange-600 rounded-sm shadow-md" />
     ))}
    </div>
   </div>

   {/* Magnet on Rail */}
   <div className="absolute bottom-10 w-full h-4 bg-slate-300 dark:bg-[#121212] border-y border-slate-400 dark:border-[#1c1b1b] flex items-center shadow-inner">
    <div className="w-full h-px bg-slate-400 dark:bg-[#121212]" />
   </div>

   <div 
    className="absolute bottom-4 w-32 h-12 shadow-xl rounded hover:scale-105 transition-all duration-75 flex z-30"
    style={{
    left: animStatus === 'idle' ? '10%' : 
      animStatus === 'in' ? 'calc(50% - 64px)' : 
      animStatus === 'pause' ? 'calc(50% - 64px)' : 
      '10%',
    transitionDuration: animStatus === 'in' || animStatus === 'out' ? `${800 / v}ms` : '300ms',
    transitionTimingFunction: 'linear'
    }}
   >
    <div className="w-1/2 h-full bg-blue-600 flex items-center justify-start pl-2 text-white font-bold text-lg rounded-l border border-blue-800 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">S</div>
    <div className="w-1/2 h-full bg-red-600 flex items-center justify-end pr-2 text-white font-bold text-lg rounded-r border border-red-800">N</div>
    
    {/* Field Lines representation */}
    <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold opacity-50">)))</div>
    <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-blue-500 font-bold opacity-50">(((</div>
   </div>

   </div>
   
   {/* Action Area */}
   <div className="bg-slate-200 dark:bg-[#121212] p-4 border-t border-slate-300 dark:border-[#1c1b1b] flex justify-center z-40">
   <button 
    onClick={runAndRecord}
    disabled={animStatus !== 'idle'}
    className={`px-6 py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40 `}
   >
    <Play className="w-5 h-5" fill="currentColor" /> Run & Record Data
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
     <th className="px-2 py-2">N</th>
     <th className="px-2 py-2">B (T)</th>
     <th className="px-2 py-2">v (m/s)</th>
     <th className="px-2 py-2">ε (V)</th>
     </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
     {data.length === 0 ? (
     <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-400 italic">No data recorded.</td></tr>
     ) : (
     data.map((row, i) => (
      <tr key={i} className="hover:bg-slate-50 dark:bg-[#121212]">
      <td className="px-2 py-2">{row.N}</td>
      <td className="px-2 py-2">{row.B}</td>
      <td className="px-2 py-2">{row.v}</td>
      <td className="px-2 py-2 font-mono text-red-600 font-bold">{row.emf}</td>
      </tr>
     ))
     )}
    </tbody>
    </table>
   </div>

   {/* SVG Graph */}
   <div className={`bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-4 flex flex-col items-center shrink-0 `}>
    <h4 className="text-xs font-bold text-slate-500 dark:text-[#71717a] mb-2 uppercase tracking-wider">v vs ε (Peak EMF)</h4>
    <div className="relative w-full aspect-[3/2] max-w-[300px]">
    <svg viewBox="0 0 300 200" className="w-full h-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded shadow-inner">
     {/* Axes */}
     <line x1="40" y1="160" x2="280" y2="160" stroke="#94a3b8" strokeWidth="2" />
     <line x1="40" y1="20" x2="40" y2="160" stroke="#94a3b8" strokeWidth="2" />
     
     {/* Labels */}
     <text x="150" y="190" textAnchor="middle" fontSize="10" fill="#64748b">v (m/s)</text>
     <text x="15" y="90" textAnchor="middle" transform="rotate(-90, 15, 90)" fontSize="10" fill="#64748b">ε (V)</text>

     {/* Data Points */}
     {data.map((d, i) => (
     <circle key={i} cx={mapX(d.v)} cy={mapY(d.emf)} r="3" fill="#ef4444" />
     ))}

     {/* Best fit line if v varies but N and B are constant - simplified for visual */}
     {data.length > 1 && (
     <line 
      x1={mapX(0)} y1={mapY(0)} 
      x2={mapX(5)} 
      y2={mapY(N * B * actualA * 5 * 0.1)} 
      stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" 
     />
     )}
    </svg>
    </div>
   </div>

   {/* Assessment */}
   {isMystery && (
    <div className="mt-auto bg-indigo-50 p-4 rounded-xl border border-indigo-200 shrink-0 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h4 className="font-bold text-indigo-800 mb-2 text-sm dark:text-[#ffffff]">Analysis: Find Area 'A'</h4>
    <p className="text-xs text-indigo-700 mb-3">
     Calculate the unknown coil area <strong>A</strong> using your data. <br/> ε = 0.1 · N · B · A · v.
    </p>
    <div className="flex gap-2">
     <input 
     type="number" step="0.001" placeholder="Area in m²" 
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
    {feedback === 'correct' && <div className="mt-2 text-sm text-green-600 font-bold flex items-center gap-1">Correct! You found A = {mysteryA} m²</div>}
    {feedback === 'incorrect' && <div className="mt-2 text-sm text-red-600 font-bold flex items-center gap-1">Incorrect. A = ε / (0.1 · N · B · v).</div>}
    </div>
   )}
   </div>
  </div>

  </div>
 </div>
 );
}
