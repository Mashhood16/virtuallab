import { useState } from 'react';
import { Box, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
 onExit?: () => void;
}

export default function LabM10MatrixApplications({ onExit }: Props) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // System: 
 // a*x + b*y = e
 // c*x + d*y = f
 const [a, setA] = useState<number>(2);
 const [b, setB] = useState<number>(3);
 const [eVal, setE] = useState<number>(12);
 
 const [c, setC] = useState<number>(1);
 const [d, setD] = useState<number>(-1);
 const [fVal, setF] = useState<number>(1);

 // Assessment State
 const [ansX, setAnsX] = useState<string>('');
 const [ansY, setAnsY] = useState<string>('');
 const [feedback, setFeedback] = useState<string | null>(null);

 // Determinant calculations
 const delta = a * d - b * c;
 const deltaX = eVal * d - b * fVal;
 const deltaY = a * fVal - eVal * c;
 
 const actualX = delta !== 0 ? deltaX / delta : NaN;
 const actualY = delta !== 0 ? deltaY / delta : NaN;

 const checkAnswer = () => {
 if (delta === 0) {
  setFeedback('System has no unique solution (Delta = 0).');
  return;
 }
 
 if (Math.abs(parseFloat(ansX) - actualX) < 0.01 && Math.abs(parseFloat(ansY) - actualY) < 0.01) {
  setFeedback("Correct! You've successfully applied Cramer's Rule.");
 } else {
  setFeedback(`Incorrect. Remember x = Δx/Δ, y = Δy/Δ.`);
 }
 };

 // Graph rendering helpers
 const getLine1Y = (xVal: number) => b !== 0 ? (eVal - a * xVal) / b : 0;
 const getLine2Y = (xVal: number) => d !== 0 ? (fVal - c * xVal) / d : 0;
 
 // Coordinate transform: map domain [-10, 10] and range [-10, 10] to 300x300 SVG
 const mapX = (xVal: number) => (xVal + 10) * (300 / 20);
 const mapY = (yVal: number) => 300 - (yVal + 10) * (300 / 20);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Matrix Applications: Chemical Mixing & Cramer's Rule" />

  
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
  {/* LEFT: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#1c1b1b]  ? 'block' : 'hidden'} lg:block`}>
   <h2 className="text-xl font-bold text-fuchsia-800 mb-4 flex items-center gap-2">
   <Box /> Theory & Context
   </h2>
   <div className="prose text-slate-700 dark:text-[#ffffff]">
   <p>
    Linear systems often model real-world scenarios, such as mixing two chemical solutions (Solution X and Solution Y) to achieve a target concentration and volume.
   </p>
   <p>
    We can represent a system of equations using a <strong>Matrix</strong> and solve it using <strong>Cramer's Rule</strong>.
   </p>
   <div className={`bg-fuchsia-50 p-4 rounded-lg my-4 font-mono text-sm border border-fuchsia-200 flex-col `}>
    <p>ax + by = e</p>
    <p>cx + dy = f</p>
    <hr className="my-2 border-fuchsia-200" />
    <p>Δ = ad - bc</p>
    <p>Δx = ed - bf</p>
    <p>Δy = af - ec</p>
    <p>x = Δx / Δ, y = Δy / Δ</p>
   </div>
   <p className="text-sm">
    If the determinant (Δ) is 0, the lines are parallel or coincident, meaning there is no unique solution.
   </p>
   </div>
  </div>

  {/* MIDDLE: Simulation */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-fuchsia-800 mb-4">System Visualizer</h2>
   
   <div className={`w-full max-w-md bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] mb-4 font-mono flex-col `}>
   <div className="flex gap-2 items-center mb-2">
    <input type="number" value={a} onChange={e=>setA(Number(e.target.value))} className="w-16 p-1 border rounded" />
    <span>x +</span>
    <input type="number" value={b} onChange={e=>setB(Number(e.target.value))} className="w-16 p-1 border rounded" />
    <span>y =</span>
    <input type="number" value={eVal} onChange={e=>setE(Number(e.target.value))} className="w-16 p-1 border rounded" />
   </div>
   <div className="flex gap-2 items-center">
    <input type="number" value={c} onChange={e=>setC(Number(e.target.value))} className="w-16 p-1 border rounded" />
    <span>x +</span>
    <input type="number" value={d} onChange={e=>setD(Number(e.target.value))} className="w-16 p-1 border rounded" />
    <span>y =</span>
    <input type="number" value={fVal} onChange={e=>setF(Number(e.target.value))} className="w-16 p-1 border rounded" />
   </div>
   </div>

   {/* Graphing Area */}
   <div className={`relative w-full max-w-sm aspect-square bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] rounded-lg overflow- border-2 border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <svg viewBox="0 0 300 300" className="w-full h-full">
    {/* Grid */}
    {[...Array(21)].map((_, i) => (
    <line key={`v${i}`} x1={i*15} y1={0} x2={i*15} y2={300} stroke="#e2e8f0" strokeWidth="1" />
    ))}
    {[...Array(21)].map((_, i) => (
    <line key={`h${i}`} x1={0} y1={i*15} x2={300} y2={i*15} stroke="#e2e8f0" strokeWidth="1" />
    ))}
    
    {/* Axes */}
    <line x1="150" y1="0" x2="150" y2="300" stroke="#94a3b8" strokeWidth="2" />
    <line x1="0" y1="150" x2="300" y2="150" stroke="#94a3b8" strokeWidth="2" />

    {/* Line 1 (Red) */}
    {b !== 0 && (
    <line 
     x1={mapX(-10)} y1={mapY(getLine1Y(-10))} 
     x2={mapX(10)} y2={mapY(getLine1Y(10))} 
     stroke="#ef4444" strokeWidth="2" 
    />
    )}
    
    {/* Line 2 (Blue) */}
    {d !== 0 && (
    <line 
     x1={mapX(-10)} y1={mapY(getLine2Y(-10))} 
     x2={mapX(10)} y2={mapY(getLine2Y(10))} 
     stroke="#3b82f6" strokeWidth="2" 
    />
    )}

    {/* Intersection Point */}
    {delta !== 0 && (
     <circle cx={mapX(actualX)} cy={mapY(actualY)} r="4" fill="#5560F1" />
    )}
   </svg>
   
   {delta !== 0 && (
    <div className="absolute top-2 left-2 bg-slate-50 dark:bg-[#121212]/90 p-1 rounded border border-slate-300 dark:border-[#1c1b1b] text-xs font-mono shadow">
    Solution: ({actualX.toFixed(2)}, {actualY.toFixed(2)})
    </div>
   )}
   </div>
  </div>

  {/* RIGHT: Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#1c1b1b] `}>
   <h2 className="text-xl font-bold text-fuchsia-800 mb-4">Laboratory Assessment</h2>
   
   <div className="bg-fuchsia-50 p-4 rounded-lg border border-fuchsia-100 mb-6">
   <h3 className="font-semibold text-fuchsia-900 mb-2">Calculate the Solution</h3>
   <p className="text-slate-700 dark:text-[#ffffff] mb-4 text-sm">
    Use Cramer's rule to find the precise values of x and y for the system currently displayed in the simulator.
   </p>
   
   <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b] mb-4 flex justify-between text-sm">
    <div>Δ = {delta}</div>
    <div>Δx = {deltaX}</div>
    <div>Δy = {deltaY}</div>
   </div>
   
   <div className="flex items-center gap-4 mb-4">
    <div className="flex-1">
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-1">x value:</label>
    <input 
     type="number" 
     value={ansX} 
     onChange={e => setAnsX(e.target.value)}
     className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-fuchsia-500 outline-none"
     placeholder="e.g. 2.5"
    />
    </div>
    <div className="flex-1">
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-1">y value:</label>
    <input 
     type="number" 
     value={ansY} 
     onChange={e => setAnsY(e.target.value)}
     className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-fuchsia-500 outline-none"
     placeholder="e.g. -1"
    />
    </div>
   </div>

   <button 
    onClick={checkAnswer}
    className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-fuchsia-500 dark:hover:bg-fuchsia-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-fuchsia-500/40"
   >
    Verify Calculations
   </button>

   {feedback && (
    <div className={`mt-4 p-3 rounded text-sm flex items-start gap-2 ${feedback.includes('Correct') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
    {feedback.includes('Correct') ? <CheckCircle2 className="shrink-0 mt-0.5" size={16} /> : <XCircle className="shrink-0 mt-0.5" size={16} />}
    <span>{feedback}</span>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
