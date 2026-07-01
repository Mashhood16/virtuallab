import { useState } from 'react';
import {Layers, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
 onExit?: () => void;
}

export default function LabM10InequalityApplications({ onExit }: Props) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // Budget Constraint: a*x + b*y <= C
 const [priceA, setPriceA] = useState<number>(20); // Price of Car A
 const [priceB, setPriceB] = useState<number>(30); // Price of Car B
 const [budget, setBudget] = useState<number>(600); // Total budget

 // Assessment State
 const [ansMaxB, setAnsMaxB] = useState<string>('');
 const [feedback, setFeedback] = useState<string | null>(null);

 // SVG dimensions
 const SVG_SIZE = 300;
 const MAX_CARS = 40; // max scale on graph

 // Coordinates mapping
 const mapCoord = (val: number) => (val / MAX_CARS) * SVG_SIZE;
 const invMapY = (yVal: number) => SVG_SIZE - yVal;

 // X intercept (when y=0) = budget / priceA
 const xIntercept = budget / priceA;
 // Y intercept (when x=0) = budget / priceB
 const yIntercept = budget / priceB;

 const pX = mapCoord(xIntercept);
 const pY = invMapY(mapCoord(yIntercept));

 const checkAnswer = () => {
 // Assessment: If we rent 10 of Car A, what is the maximum number of Car B we can rent?
 // 10 * priceA + y * priceB <= budget
 // y <= (budget - 10 * priceA) / priceB
 const remainingBudget = budget - (10 * priceA);
 const maxB = Math.floor(remainingBudget / priceB);
 
 if (parseInt(ansMaxB) === maxB) {
  setFeedback(`Correct! 10 Car A's cost $${10*priceA}. The remaining $${remainingBudget} allows for exactly ${maxB} Car B's.`);
 } else {
  setFeedback(`Incorrect. Calculate the remaining budget after renting 10 Car A's, then divide by the price of Car B.`);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Inequality Applications: Feasible Budgets" />

  
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
   <h2 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2 dark:text-[#ffffff]">
   <Layers /> Theory & Context
   </h2>
   <div className="prose text-slate-700 dark:text-[#ffffff]">
   <p>
    Linear inequalities are used in business to model constraints, such as budgets. 
    The area containing all possible solutions is called the <strong>Feasible Region</strong>.
   </p>
   <p className="mt-2">
    Suppose a company needs to rent vehicles. 
   </p>
   <ul className="list-disc pl-5 space-y-2 mt-2">
    <li><strong>x:</strong> Number of Compact Cars (Car A)</li>
    <li><strong>y:</strong> Number of SUVs (Car B)</li>
   </ul>
   <div className={`bg-amber-50 p-4 rounded-lg mt-4 border border-amber-200 font-mono text-center dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    P_A(x) + P_B(y) ≤ Budget
   </div>
   <p className="mt-4 text-sm text-slate-600 dark:text-[#a1a1aa]">
    The shaded region under the line represents all combinations of cars the company can afford. Note that x ≥ 0 and y ≥ 0 because you cannot rent negative cars!
   </p>
   </div>
  </div>

  {/* MIDDLE: Simulation */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-amber-800 mb-4 dark:text-[#ffffff]">Feasible Region Explorer</h2>
   
   <div className={`w-full max-w-md space-y-4 mb-6 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] text-sm font-semibold flex-col `}>
   <div>
    <label className="block mb-1">Car A Price ($): {priceA}</label>
    <input type="range" min="10" max="50" step="5" value={priceA} onChange={e => setPriceA(Number(e.target.value))} className="w-full accent-amber-600" />
   </div>
   <div>
    <label className="block mb-1">Car B Price ($): {priceB}</label>
    <input type="range" min="20" max="80" step="5" value={priceB} onChange={e => setPriceB(Number(e.target.value))} className="w-full accent-amber-600" />
   </div>
   <div>
    <label className="block mb-1">Total Budget ($): {budget}</label>
    <input type="range" min="200" max="1200" step="50" value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full accent-amber-600" />
   </div>
   </div>

   <div className={`relative w-full max-w-sm aspect-square bg-slate-50 dark:bg-[#121212] rounded-lg overflow- border-2 border-slate-300 dark:border-[#1c1b1b] shadow-inner flex-col `}>
   <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className="w-full h-full">
    {/* Axes Labels */}
    <text x="280" y="295" fontSize="10" fill="#64748b">x</text>
    <text x="5" y="15" fontSize="10" fill="#64748b">y</text>

    {/* Grid */}
    {[...Array(9)].map((_, i) => (
    <line key={`v${i}`} x1={mapCoord(i*5)} y1={0} x2={mapCoord(i*5)} y2={SVG_SIZE} stroke="#f1f5f9" strokeWidth="1" />
    ))}
    {[...Array(9)].map((_, i) => (
    <line key={`h${i}`} x1={0} y1={invMapY(mapCoord(i*5))} x2={SVG_SIZE} y2={invMapY(mapCoord(i*5))} stroke="#f1f5f9" strokeWidth="1" />
    ))}

    {/* Feasible Region Polygon */}
    <polygon 
    points={`0,${SVG_SIZE} ${pX},${SVG_SIZE} 0,${pY}`}
    fill="#fcd34d" fillOpacity="0.4"
    stroke="#d97706" strokeWidth="2"
    />
    
    {/* Plotting points to verify integer solutions */}
    <circle cx={mapCoord(10)} cy={invMapY(mapCoord(10))} r="3" fill="#64748b" />
    <text x={mapCoord(10) + 5} y={invMapY(mapCoord(10)) - 5} fontSize="10" fill="#64748b">(10,10)</text>
   </svg>
   <div className="absolute top-2 right-2 text-xs bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212]/90 p-1 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] rounded text-slate-600 dark:text-[#a1a1aa] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    Graph domain/range: 0 to {MAX_CARS} cars
   </div>
   </div>
  </div>

  {/* RIGHT: Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#1c1b1b] `}>
   <h2 className="text-xl font-bold text-amber-800 mb-4 dark:text-[#ffffff]">Laboratory Assessment</h2>
   
   <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-6 dark:bg-[#121212] dark:border-[#1c1b1b]">
   <h3 className="font-semibold text-amber-900 mb-2 dark:text-[#ffffff]">Resource Allocation Check</h3>
   <p className="text-slate-700 dark:text-[#ffffff] mb-4 text-sm">
    The company has decided they absolutely must rent exactly <strong>10 units of Car A</strong>. 
   </p>
   <p className="text-slate-700 dark:text-[#ffffff] mb-4 text-sm font-semibold">
    Based on the current budget of ${budget} and prices (Car A: ${priceA}, Car B: ${priceB}), what is the maximum whole number of Car B's they can afford?
   </p>
   
   <div className="mb-4">
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-1">Max Car B units:</label>
    <input 
    type="number" 
    value={ansMaxB} 
    onChange={e => setAnsMaxB(e.target.value)}
    className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-amber-500 outline-none"
    placeholder="Integer value"
    />
   </div>

   <button 
    onClick={checkAnswer}
    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"
   >
    Check Feasibility
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
