import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Save, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC10FuelCell({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [isPlaying, setIsPlaying] = useState(false);
 const [time, setTime] = useState(0);
 const [resistance, setResistance] = useState(5);
 const [data, setData] = useState<Array<{t: number, p: number, v: number, i: number, r: number}>>([]);

 const E_ocv = 1.23;
 const R_int = 0.5;
 const current = isPlaying ? E_ocv / (resistance + R_int) : 0;
 const voltage = isPlaying ? current * resistance : 0;
 const power = voltage * current;

 useEffect(() => {
 let timer: number;
 if (isPlaying) {
  timer = window.setInterval(() => setTime(t => t + 1), 1000);
 }
 return () => window.clearInterval(timer);
 }, [isPlaying]);

 const handleReset = () => {
 setIsPlaying(false);
 setTime(0);
 setData([]);
 };

 const recordData = () => {
 setData(prev => [...prev, { 
  t: time, 
  p: parseFloat(power.toFixed(3)), 
  v: parseFloat(voltage.toFixed(2)), 
  i: parseFloat(current.toFixed(2)), 
  r: resistance 
 }]);
 };

 const [assQ] = useState({ r: Math.floor(Math.random() * 8) + 2 });
 const [answer, setAnswer] = useState('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const checkAnswer = () => {
 const expected = 1.23 / (assQ.r + R_int);
 if (Math.abs(parseFloat(answer) - expected) < 0.05) setIsCorrect(true);
 else setIsCorrect(false);
 };

 const renderGraph = () => {
 if (data.length === 0) return <div className="h-48 flex items-center justify-center text-slate-400">No data recorded</div>;
 const maxT = Math.max(10, ...data.map(d => d.t));
 const maxP = Math.max(0.5, ...data.map(d => d.p));
 const pts = data.map(d => `${(d.t / maxT) * 100},${100 - (d.p / maxP) * 100}`).join(' ');

 return (
  <svg viewBox="-15 -10 130 130" className="w-full h-48 bg-slate-50 dark:bg-[#121212] border rounded-lg p-2 overflow-visible">
  <line x1="0" y1="100" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1" />
  <line x1="0" y1="0" x2="0" y2="100" stroke="#94a3b8" strokeWidth="1" />
  <polyline points={pts} fill="none" stroke="#2563eb" strokeWidth="2" />
  {data.map((d, idx) => (
   <circle key={idx} cx={(d.t / maxT) * 100} cy={100 - (d.p / maxP) * 100} r="2" fill="#ef4444" />
  ))}
  <text x="50" y="115" fontSize="6" textAnchor="middle" fill="#64748b">Time (s)</text>
  <text x="-10" y="50" fontSize="6" textAnchor="middle" fill="#64748b" transform="rotate(-90 -10 50)">Power (W)</text>
  </svg>
 );
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none p-4">
<LabHeader onExit={onExit} title="Hydrogen-Oxygen Fuel Cell" />

  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:flex-1 overflow-y-auto lg:overflow-visible">
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-4">Theory & Setup</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm mb-4">
   A hydrogen fuel cell generates electricity by reacting hydrogen with oxygen across a proton exchange membrane (PEM). The only byproduct is water.
   </p>
   <div className={`bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-4 rounded-lg mb-6 text-sm font-mono overflow-x-auto space-y-1 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div>Anode: H₂ → 2H⁺ + 2e⁻</div>
   <div>Cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O</div>
   </div>
   
   <div className="space-y-6">
   <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2">Load Resistance: {resistance} Ω</label>
    <input 
    type="range" min="1" max="10" step="1" 
    value={resistance} onChange={(e) => setResistance(parseFloat(e.target.value))}
    className="w-full"
    />
   </div>
   <div className={`bg-slate-50 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b] text-sm flex-col `}>
    <div className="flex justify-between mb-1"><span>Cell Voltage (E_ocv):</span> <span>1.23 V</span></div>
    <div className="flex justify-between"><span>Internal Resistance:</span> <span>0.50 Ω</span></div>
   </div>
   </div>
  </div>

  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-4 self-start">Simulation Viewer</h2>
   
   <div className="w-full flex justify-center space-x-4 mb-6">
   <button onClick={() => setIsPlaying(!isPlaying)} className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 flex-col `}>
    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
    {isPlaying ? 'Turn Off' : 'Turn On'}
   </button>
   <button onClick={handleReset} className="flex items-center px-4 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg hover:bg-slate-300 dark:bg-[#121212]">
    <RotateCcw className="w-4 h-4 mr-2" /> Reset
   </button>
   </div>

   <div className="relative w-full max-w-sm aspect-square bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b] overflow-hidden">
   <svg viewBox="0 0 200 200" className="w-full h-full">
    {/* Main Body */}
    <rect x="50" y="50" width="100" height="100" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" rx="4" />
    {/* PEM Membrane */}
    <rect x="95" y="50" width="10" height="100" fill="#22c55e" opacity="0.8" />
    
    {/* Inlets / Outlets */}
    <path d="M 30 70 L 50 70" fill="none" stroke="#3b82f6" strokeWidth="6" />
    <text x="15" y="74" fontSize="10" fill="#3b82f6">H₂</text>
    <path d="M 170 70 L 150 70" fill="none" stroke="#ef4444" strokeWidth="6" />
    <text x="175" y="74" fontSize="10" fill="#ef4444">O₂</text>
    <path d="M 150 130 L 170 130" fill="none" stroke="#0ea5e9" strokeWidth="6" />
    <text x="175" y="134" fontSize="10" fill="#0ea5e9">H₂O</text>

    {/* Circuit */}
    <polyline points="75,50 75,20 125,20 125,50" fill="none" stroke="#1e293b" strokeWidth="2" />
    <circle cx="100" cy="20" r="12" fill={isPlaying ? "#fef08a" : "#cbd5e1"} stroke="#64748b" strokeWidth="2" />
    {isPlaying && <circle cx="100" cy="20" r="16" fill="#fef08a" opacity={power / 1.5} />}

    {/* Animations */}
    {isPlaying && (
    <>
     <circle cx={55 + (time % 5)*8} cy="85" r="2" fill="#3b82f6" />
     <circle cx={145 - (time % 5)*8} cy="85" r="2" fill="#ef4444" />
     <circle cx="100" cy="100" r="2" fill="#22c55e">
     <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
     </circle>
     <circle cx={130 + (time % 5)*8} cy="130" r="2" fill="#0ea5e9" />
    </>
    )}
   </svg>
   </div>

   <div className="mt-4 w-full grid grid-cols-3 gap-2 text-center ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block">
   <div className="bg-slate-100 dark:bg-[#121212] p-2 rounded-lg">
    <div className="text-[10px] text-slate-500 dark:text-[#71717a] uppercase font-bold">Voltage</div>
    <div className="text-lg font-mono text-slate-800 dark:text-[#ffffff]">{voltage.toFixed(2)}V</div>
   </div>
   <div className="bg-slate-100 dark:bg-[#121212] p-2 rounded-lg">
    <div className="text-[10px] text-slate-500 dark:text-[#71717a] uppercase font-bold">Current</div>
    <div className="text-lg font-mono text-slate-800 dark:text-[#ffffff]">{current.toFixed(2)}A</div>
   </div>
   <div className="bg-slate-100 dark:bg-[#121212] p-2 rounded-lg border border-blue-200">
    <div className="text-[10px] text-blue-500 uppercase font-bold">Power</div>
    <div className="text-lg font-mono text-blue-800 dark:text-[#ffffff]">{power.toFixed(2)}W</div>
   </div>
   </div>
  </div>

  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex flex-col `}>
   <div className="flex justify-between items-center mb-4">
   <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff]">Data & Analysis</h2>
   <button onClick={recordData} className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
    <Save className="w-4 h-4 mr-1" /> Record
   </button>
   </div>

   {renderGraph()}

   <div className="mt-4 flex-1 lg:overflow-y-auto min-h-[100px] border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0">
    <tr>
     <th className="px-3 py-2 border-b">Load (Ω)</th>
     <th className="px-3 py-2 border-b">Current (A)</th>
     <th className="px-3 py-2 border-b">Power (W)</th>
    </tr>
    </thead>
    <tbody>
    {data.map((d, i) => (
     <tr key={i} className="border-b last:border-0 hover:bg-slate-50 dark:bg-[#121212]">
     <td className="px-3 py-2">{d.r}</td>
     <td className="px-3 py-2">{d.i}</td>
     <td className="px-3 py-2 font-mono text-blue-600">{d.p}</td>
     </tr>
    ))}
    </tbody>
   </table>
   </div>

   <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900">
   <h3 className="text-sm font-bold text-blue-900 mb-2 dark:text-[#ffffff]">Assessment</h3>
   <p className="text-sm text-blue-800 mb-3 dark:text-[#ffffff]">
    Calculate the theoretical current (A) flowing through an {assQ.r} Ω external load if the cell OCV is 1.23V and internal resistance is {R_int} Ω. (Provide answer to 2 decimal places).
   </p>
   <div className="flex items-center space-x-2">
    <input 
    type="number" 
    value={answer}
    onChange={e => setAnswer(e.target.value)}
    placeholder="Current (A)" 
    className="flex-1 p-2 border border-blue-300 rounded-md text-sm"
    />
    <button onClick={checkAnswer} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
    Check
    </button>
   </div>
   {isCorrect === true && <div className="mt-2 text-green-600 text-sm font-bold flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> Correct!</div>}
   {isCorrect === false && <div className="mt-2 text-red-600 text-sm font-bold flex items-center"><XCircle className="w-4 h-4 mr-1" /> Incorrect, try again.</div>}
   </div>
  </div>
  </div>
 </div>
 );
}
