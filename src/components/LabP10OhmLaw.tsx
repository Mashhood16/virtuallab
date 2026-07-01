import { useState } from 'react';
import {Activity } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

const RESISTORS = [
 { id: 'R1', value: 12, color: 'bg-emerald-500' },
 { id: 'R2', value: 25, color: 'bg-indigo-500' },
 { id: 'R3', value: 47, color: 'bg-rose-500' },
];

export default function LabP10OhmLaw({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [resistor, setResistor] = useState(RESISTORS[0]);
 const [voltage, setVoltage] = useState(0); // 0 to 12V
 const [dataPoints, setDataPoints] = useState<{V: number, I: number}[]>([]);
 
 const [answerR, setAnswerR] = useState('');
 const [feedback, setFeedback] = useState('');

 // Add random ~2% measurement noise for realism
 const [noiseSeed, setNoiseSeed] = useState(Math.random());

 const getMeasurementNoise = (v: number) => {
 // Deterministic noise based on voltage so it doesn't jump constantly
 const pseudoRandom = Math.sin(v * 10 + noiseSeed) * 0.02;
 return pseudoRandom;
 };

 const trueCurrent = voltage / resistor.value;
 const measuredCurrent = voltage === 0 ? 0 : Math.max(0, trueCurrent * (1 + getMeasurementNoise(voltage)));

 const recordData = () => {
 // Avoid duplicates
 if (dataPoints.find(p => p.V === voltage)) return;
 setDataPoints(prev => [...prev, {V: voltage, I: measuredCurrent}].sort((a,b) => a.V - b.V));
 };

 const reset = () => {
 setVoltage(0);
 setDataPoints([]);
 setAnswerR('');
 setFeedback('');
 setNoiseSeed(Math.random());
 };

 const checkAnswer = () => {
 const userR = parseFloat(answerR);
 if (isNaN(userR)) {
  setFeedback('Please enter a valid number.');
  return;
 }
 const error = Math.abs((userR - resistor.value) / resistor.value) * 100;
 if (error < 5) {
  setFeedback(`Correct! The true resistance is ${resistor.value} Ω.`);
 } else {
  setFeedback(`Incorrect. Check your calculations. (Error: ${error.toFixed(1)}%)`);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Unit 16: Ohm's Law (Quantitative)" subtitle="Determine unknown resistance by plotting a V-I graph." />

  
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
  
  {/* Left Panel: Theory & Setup */}
  <div className="lg:col-span-1 flex flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex">
   <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 `}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 border-b pb-2">Theory</h2>
   <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-3">
    <p>Ohm's Law states that current (I) is directly proportional to voltage (V) in an ohmic conductor.</p>
    <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded font-mono text-center text-lg text-slate-800 dark:text-[#ffffff] font-bold flex-col `}>
    V = I × R
    </div>
    <p>By plotting a graph of Voltage (V) vs Current (I), the gradient (slope) of the line of best fit represents the Resistance (R).</p>
   </div>
   </div>

   <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 `}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 border-b pb-2">Controls</h2>
   
   <div className="space-y-6">
    <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2">Select Unknown Resistor</label>
    <div className="flex gap-2">
     {RESISTORS.map(r => (
     <button 
      key={r.id}
      onClick={() => { setResistor(r); reset(); }}
      className={`flex-1 py-2 rounded text-sm font-bold border transition-colors ${resistor.id === r.id ? 'bg-[#121212] dark:bg-[#121212] text-white border-[#1c1b1b] dark:border-slate-500' : 'bg-slate-50 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] border-slate-300 dark:border-[#1c1b1b] hover:bg-slate-50 dark:bg-[#121212]'}`}
     >
      {r.id}
     </button>
     ))}
    </div>
    </div>

    <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2 flex justify-between">
     <span>Power Supply (V)</span>
     <span className="text-amber-600 font-bold">{voltage.toFixed(1)} V</span>
    </label>
    <input 
     type="range" 
     min="0" max="12" step="0.5" 
     value={voltage} 
     onChange={e => setVoltage(Number(e.target.value))} 
     className={`w-full accent-amber-500 h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer flex-col `} 
    />
    </div>

    <button 
    onClick={recordData}
    disabled={dataPoints.some(p => p.V === voltage)}
    className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-lg font-bold transition-colors dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 flex-col `}
    >
    <Activity className="w-5 h-5" /> Record V-I Reading
    </button>
   </div>
   </div>

   <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 `}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 border-b pb-2">Analysis</h2>
   <div className="space-y-3">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff]">Calculate Resistance (Ω):</label>
    <div className="flex gap-2">
    <input 
     type="number" 
     value={answerR}
     onChange={e => setAnswerR(e.target.value)}
     className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:outline-none focus:border-blue-500 font-mono"
     placeholder="e.g. 15.5"
    />
    <button onClick={checkAnswer} className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">Check</button>
    </div>
    {feedback && (
    <div className={`p-3 rounded text-sm ${feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
     {feedback}
    </div>
    )}
   </div>
   </div>
  </div>

  {/* Center Panel: Circuit & Graph */}
  <div className="lg:col-span-2 flex flex-col gap-6 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center relative min-h-[300px]">
   <h3 className="absolute top-4 left-4 font-bold text-slate-700 dark:text-[#ffffff]">Circuit Diagram</h3>
   
   <div className="w-full max-w-lg relative h-[250px] border-2 border-slate-200 dark:border-[#1c1b1b] rounded-xl bg-slate-50 dark:bg-[#121212] mt-8">
    {/* Power Supply */}
    <div className="absolute left-[15%] top-[40%] flex flex-col items-center bg-white lg:bg-slate-50 dark:!bg-[#121212] p-3 border-2 border-amber-400 rounded-lg z-10 shadow-sm ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
     <div className="text-xs font-bold text-slate-500 dark:text-[#71717a] mb-1">DC Supply</div>
     <div className="text-2xl font-mono text-amber-600 font-bold">{voltage.toFixed(1)}V</div>
    </div>

    {/* Resistor */}
    <div className="absolute right-[15%] top-[40%] flex flex-col items-center bg-slate-50 dark:!bg-[#121212] p-3 border-2 border-slate-300 dark:border-[#1c1b1b] rounded-lg z-10 shadow-sm">
     <div className="text-xs font-bold text-slate-500 dark:text-[#71717a] mb-1">Resistor {resistor.id}</div>
     <div className={`w-12 h-6 ${resistor.color} rounded my-1`} />
    </div>

    {/* Ammeter */}
    <div className="absolute left-[40%] top-[10%] flex flex-col items-center bg-slate-50 dark:bg-[#121212] p-2 border-2 border-blue-400 rounded-full w-20 h-20 justify-center z-10 shadow-sm">
     <div className="text-sm font-bold text-slate-500 dark:text-[#71717a]">Ammeter</div>
     <div className="text-lg font-mono text-blue-600 font-bold">{measuredCurrent.toFixed(2)}A</div>
    </div>

    {/* Wires */}
    <div className={`absolute top-[25%] left-[25%] right-[25%] h-1 ${measuredCurrent > 0 ? 'bg-amber-400' : 'bg-slate-300 dark:bg-[#121212]'}`}>
     {measuredCurrent > 0 && <div className="absolute w-2 h-2 bg-red-500 rounded-full top-1/2 -translate-y-1/2 animate-[electronFlow_1s_linear_infinite] dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40" style={{ animationDuration: `${Math.max(0.1, 1 / measuredCurrent)}s` }} />}
    </div>
    <div className={`absolute bottom-[25%] left-[25%] right-[25%] h-1 ${measuredCurrent > 0 ? 'bg-amber-400' : 'bg-slate-300 dark:bg-[#121212]'}`} />
    <div className={`absolute left-[25%] top-[25%] bottom-[25%] w-1 ${measuredCurrent > 0 ? 'bg-amber-400' : 'bg-slate-300 dark:bg-[#121212]'}`} />
    <div className={`absolute right-[25%] top-[25%] bottom-[25%] w-1 ${measuredCurrent > 0 ? 'bg-amber-400' : 'bg-slate-300 dark:bg-[#121212]'}`} />

    <style>{`
     @keyframes electronFlow {
     0% { left: 0%; }
     100% { left: 100%; }
     }
    `}</style>
   </div>
   </div>

   <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col flex-1 min-h-[300px]">
   <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-4">V-I Data & Graph</h3>
   <div className="flex flex-col md:flex-row gap-6 h-full">
    
    {/* Data Table */}
    <div className="w-full md:w-1/3 border border-slate-200 dark:border-[#1c1b1b] rounded-lg lg:overflow-y-auto max-h-[250px]">
    <table className="w-full text-sm text-center">
     <thead className="bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#a1a1aa] sticky top-0">
     <tr>
      <th className="py-2 px-3 font-medium">Voltage (V)</th>
      <th className="py-2 px-3 font-medium">Current (A)</th>
     </tr>
     </thead>
     <tbody>
     {dataPoints.map((pt, i) => (
      <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 dark:bg-[#121212]">
      <td className="py-2 px-3 font-mono">{pt.V.toFixed(1)}</td>
      <td className="py-2 px-3 font-mono text-blue-600">{pt.I.toFixed(2)}</td>
      </tr>
     ))}
     {dataPoints.length === 0 && (
      <tr><td colSpan={2} className="py-6 text-slate-400">No data recorded</td></tr>
     )}
     </tbody>
    </table>
    </div>

    {/* Graph */}
    <div className="w-full md:w-2/3 border-2 border-slate-200 dark:border-[#1c1b1b] rounded-lg relative bg-slate-50 dark:bg-[#121212] overflow-hidden">
    <div className="absolute top-4 left-4 text-xs font-bold text-amber-600">Voltage (V)</div>
    <div className="absolute bottom-4 right-4 text-xs font-bold text-blue-600">Current (A)</div>
    
    {/* Max Voltage = 12, Max Current = 1.0 (for R1=12) */}
    <svg className="absolute inset-0 w-full h-full pt-10 pb-8 px-12" preserveAspectRatio="none">
     {/* Grid */}
     {[...Array(6)].map((_, i) => (
     <line key={`h-${i}`} x1="0" y1={`${i * 20}%`} x2="100%" y2={`${i * 20}%`} stroke="#e2e8f0" />
     ))}
     {[...Array(6)].map((_, i) => (
     <line key={`v-${i}`} x1={`${i * 20}%`} y1="0" x2={`${i * 20}%`} y2="100%" stroke="#e2e8f0" />
     ))}

     {/* Scatter points */}
     {dataPoints.map((pt, i) => {
     const xPercent = (pt.I / 1.0) * 100; // Normalizing current up to 1.0A for graph
     const yPercent = 100 - (pt.V / 12) * 100;
     return (
      <circle 
      key={i} 
      cx={`${Math.min(100, xPercent)}%`} 
      cy={`${yPercent}%`} 
      r="5" 
      fill="#ef4444" 
      className="transition-all duration-300"
      />
     );
     })}
     
     {/* Line of best fit if at least 2 points (approximate visual line) */}
     {dataPoints.length > 1 && (
      <line 
      x1="0" 
      y1="100%" 
      x2={`${(12 / resistor.value / 1.0) * 100}%`} 
      y2="0" 
      stroke="#ef4444" 
      strokeWidth="2" 
      strokeDasharray="4"
      className="opacity-50"
      />
     )}
    </svg>
    </div>

   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
