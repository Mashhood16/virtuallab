import { useState } from 'react';
import { ArrowLeft, Calculator, Ruler, CheckCircle2, XCircle, PieChart, Info } from 'lucide-react';

export default function LabM8RealEstimation({ onExit }: { onExit?: () => void }) {
 const [activeTab, setActiveTab] = useState<'finance' | 'bounds'>('finance');

 // Finance State
 const [paycheck, setPaycheck] = useState(6000);
 const [rentN, setRentN] = useState(1);
 const [rentD, setRentD] = useState(3);
 const [utilN, setUtilN] = useState(1);
 const [utilD, setUtilD] = useState(6);
 const [saveN, setSaveN] = useState(1);
 const [saveD, setSaveD] = useState(4);
 
 const [financeAns, setFinanceAns] = useState('');
 const [financeFeedback, setFinanceFeedback] = useState<{status: 'idle'|'correct'|'incorrect', msg: string}>({status: 'idle', msg: ''});

 // Bounds State
 const [length, setLength] = useState(10.5);
 const [width, setWidth] = useState(8.2);
 const [boundsAns, setBoundsAns] = useState('');
 const [boundsFeedback, setBoundsFeedback] = useState<{status: 'idle'|'correct'|'incorrect', msg: string}>({status: 'idle', msg: ''});

 const rentFrac = rentN / (rentD || 1);
 const utilFrac = utilN / (utilD || 1);
 const saveFrac = saveN / (saveD || 1);
 const totalFrac = rentFrac + utilFrac + saveFrac;
 const isOverBudget = totalFrac > 1.000001;
 const foodFrac = 1 - totalFrac;
 const foodAmount = isOverBudget ? 0 : paycheck * foodFrac;

 const checkFinance = () => {
 if (isOverBudget) {
  setFinanceFeedback({status: 'incorrect', msg: 'Fractions exceed 1! Adjust them so they total less than 1.'});
  return;
 }
 const ans = parseFloat(financeAns);
 if (Math.abs(ans - foodAmount) < 0.1) {
  setFinanceFeedback({status: 'correct', msg: 'Correct! You calculated the remaining budget for food.'});
 } else {
  setFinanceFeedback({status: 'incorrect', msg: `Incorrect. The remaining fraction is for food. Try again!`});
 }
 };

 const maxArea = (length + 0.05) * (width + 0.05);

 const checkBounds = () => {
 const ans = parseFloat(boundsAns);
 if (Math.abs(ans - maxArea) < 0.02) {
  setBoundsFeedback({status: 'correct', msg: 'Correct! You found the maximum possible area.'});
 } else {
  setBoundsFeedback({status: 'incorrect', msg: `Incorrect. Consider the upper bounds (+0.05) of both length and width.`});
 }
 };

 // Pie Chart SVG Math
 const radius = 0.5;
 const circ = 2 * Math.PI * radius;
 const rentDash = rentFrac * circ;
 const utilDash = utilFrac * circ;
 const utilOffset = -rentDash;
 const saveDash = saveFrac * circ;
 const saveOffset = utilOffset - utilDash;
 const foodDash = foodFrac > 0 ? foodFrac * circ : 0;
 const foodOffset = saveOffset - saveDash;

 // Error Bounds SVG scaling
 const maxPossibleL = 20;
 const scale = 80 / maxPossibleL;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-900 dark:text-[#ffffff]">
  {/* Header */}
  <header className="flex items-center p-4 border-b border-slate-200 dark:border-[#1c1b1b] shrink-0 overflow-x-auto">
  <button onClick={onExit} className="mr-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap flex-shrink-0">
   <ArrowLeft className="w-6 h-6" />
  </button>
  <h1 className="text-lg md:text-xl font-bold flex-1 whitespace-nowrap mr-4">Class 8: Real Numbers & Estimation Labs</h1>
  <div className="flex flex-wrap gap-2">
   <button 
   onClick={() => setActiveTab('finance')}
   className={`px-4 py-2 rounded-md font-medium whitespace-nowrap flex-shrink-0 transition-colors ${activeTab === 'finance' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-[#ffffff] hover:bg-slate-300 dark:hover:bg-slate-600'}`}
   >
   <PieChart className="w-4 h-4 inline-block mr-2" />
   Budgeting (Fractions)
   </button>
   <button 
   onClick={() => setActiveTab('bounds')}
   className={`px-4 py-2 rounded-md font-medium whitespace-nowrap flex-shrink-0 transition-colors ${activeTab === 'bounds' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-[#ffffff] hover:bg-slate-300 dark:hover:bg-slate-600'}`}
   >
   <Ruler className="w-4 h-4 inline-block mr-2" />
   Error Bounds
   </button>
  </div>
  </header>

  {/* Main 2-Column Layout */}
  <main className="flex flex-1 lg:overflow-hidden flex-col lg:flex-row">
  
  {/* Left Column: Controls & Assessment */}
  <div className="flex-1 min-w-0 lg:w-1/2 p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6">
   
   {activeTab === 'finance' && (
   <>
    <div className="bg-white dark:!bg-[#121212] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
     <Calculator className="w-5 h-5 text-blue-500" />
     Personal Finance Setup
    </h2>
    
    <div className="space-y-6">
     <div>
     <label className="block text-sm font-medium mb-1">Total Paycheck ($)</label>
     <input 
      type="range" min="1000" max="10000" step="100" 
      value={paycheck} onChange={(e) => setPaycheck(parseInt(e.target.value))}
      className="w-full accent-blue-600"
     />
     <div className="text-right font-mono text-sm">${paycheck}</div>
     </div>

     <div className="grid grid-cols-3 gap-4">
     <div>
      <label className="block text-sm font-medium mb-1 text-blue-600 dark:text-blue-400">Rent Fraction</label>
      <div className="flex items-center justify-center gap-1">
      <input type="number" min="0" max="10" value={rentN} onChange={e => setRentN(parseInt(e.target.value)||0)} className="w-10 p-1 border rounded dark:bg-[#121212] dark:border-[#1c1b1b] text-center" />
      <span>/</span>
      <input type="number" min="1" max="10" value={rentD} onChange={e => setRentD(parseInt(e.target.value)||1)} className="w-10 p-1 border rounded dark:bg-[#121212] dark:border-[#1c1b1b] text-center" />
      </div>
     </div>
     <div>
      <label className="block text-sm font-medium mb-1 text-orange-600 dark:text-orange-400">Utilities Frac</label>
      <div className="flex items-center justify-center gap-1">
      <input type="number" min="0" max="10" value={utilN} onChange={e => setUtilN(parseInt(e.target.value)||0)} className="w-10 p-1 border rounded dark:bg-[#121212] dark:border-[#1c1b1b] text-center" />
      <span>/</span>
      <input type="number" min="1" max="10" value={utilD} onChange={e => setUtilD(parseInt(e.target.value)||1)} className="w-10 p-1 border rounded dark:bg-[#121212] dark:border-[#1c1b1b] text-center" />
      </div>
     </div>
     <div>
      <label className="block text-sm font-medium mb-1 text-green-600 dark:text-green-400">Savings Frac</label>
      <div className="flex items-center justify-center gap-1">
      <input type="number" min="0" max="10" value={saveN} onChange={e => setSaveN(parseInt(e.target.value)||0)} className="w-10 p-1 border rounded dark:bg-[#121212] dark:border-[#1c1b1b] text-center" />
      <span>/</span>
      <input type="number" min="1" max="10" value={saveD} onChange={e => setSaveD(parseInt(e.target.value)||1)} className="w-10 p-1 border rounded dark:bg-[#121212] dark:border-[#1c1b1b] text-center" />
      </div>
     </div>
     </div>
     {isOverBudget && (
     <div className="text-red-500 text-sm flex items-center gap-1 p-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
      <Info className="w-4 h-4" /> Warning: Total fractions exceed 1 (100%)!
     </div>
     )}
    </div>
    </div>

    <div className="bg-white dark:!bg-[#121212] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h2 className="text-lg font-bold mb-4">Assessment</h2>
    <p className="mb-4 text-sm">
     The remaining fraction of the paycheck is allocated to <strong>Food</strong> (Purple). 
     Calculate the exact dollar amount allocated to Food.
    </p>
    <div className="flex items-center gap-3">
     <span className="font-bold text-lg">$</span>
     <input 
     type="number" 
     value={financeAns} 
     onChange={e => setFinanceAns(e.target.value)}
     placeholder="e.g. 1500"
     className="flex-1 min-w-0 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg dark:bg-[#121212]"
     />
     <button onClick={checkFinance} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap flex-shrink-0 transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
     Check Answer
     </button>
    </div>
    {financeFeedback.status !== 'idle' && (
     <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${financeFeedback.status === 'correct' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
     {financeFeedback.status === 'correct' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
     <span>{financeFeedback.msg}</span>
     </div>
    )}
    </div>
   </>
   )}

   {activeTab === 'bounds' && (
   <>
    <div className="bg-white dark:!bg-[#121212] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
     <Ruler className="w-5 h-5 text-indigo-500" />
     Construction Error Bounds
    </h2>
    <p className="text-sm mb-6 text-slate-600 dark:text-[#71717a]">
     A room is measured to 1 decimal place. This implies an absolute error of ±0.05m for each dimension due to rounding.
    </p>
    <div className="space-y-6">
     <div>
     <label className="block text-sm font-medium mb-1">Measured Length (m)</label>
     <input 
      type="range" min="5" max="15" step="0.1" 
      value={length} onChange={(e) => setLength(parseFloat(e.target.value))}
      className="w-full accent-indigo-600"
     />
     <div className="text-right font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">{length.toFixed(1)} m</div>
     </div>
     <div>
     <label className="block text-sm font-medium mb-1">Measured Width (m)</label>
     <input 
      type="range" min="5" max="15" step="0.1" 
      value={width} onChange={(e) => setWidth(parseFloat(e.target.value))}
      className="w-full accent-indigo-600"
     />
     <div className="text-right font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">{width.toFixed(1)} m</div>
     </div>
    </div>
    </div>

    <div className="bg-white dark:!bg-[#121212] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h2 className="text-lg font-bold mb-4">Assessment</h2>
    <p className="mb-4 text-sm">
     Based on the measurements (±0.05m bounds), calculate the <strong>maximum possible area</strong> of the room in square meters (m²).
    </p>
    <div className="flex items-center gap-3">
     <input 
     type="number" 
     value={boundsAns} 
     onChange={e => setBoundsAns(e.target.value)}
     placeholder="Max Area (m²)"
     className="flex-1 min-w-0 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg dark:bg-[#121212]"
     />
     <button onClick={checkBounds} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap flex-shrink-0 transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
     Check Answer
     </button>
    </div>
    {boundsFeedback.status !== 'idle' && (
     <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${boundsFeedback.status === 'correct' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
     {boundsFeedback.status === 'correct' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
     <span>{boundsFeedback.msg}</span>
     </div>
    )}
    </div>
   </>
   )}

  </div>

  {/* Right Column: Simulation Stage */}
  <div className="flex-1 min-w-0 lg:w-1/2 p-6 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 relative lg:overflow-y-auto">
   
   {activeTab === 'finance' && (
   <div className="flex flex-col items-center w-full max-w-sm">
    <h3 className="text-xl font-bold mb-8 text-center">Paycheck Distribution</h3>
    <div className="relative w-64 h-64 shrink-0">
    <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90 overflow-visible drop-shadow-xl">
     {/* Background base */}
     <circle cx="0" cy="0" r="0.5" fill="transparent" stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-slate-800" />
     
     {!isOverBudget && (
     <>
      <circle cx="0" cy="0" r="0.5" fill="transparent" stroke="#3b82f6" strokeWidth="1" strokeDasharray={`${rentDash} ${circ}`} className="transition-all duration-500" />
      <circle cx="0" cy="0" r="0.5" fill="transparent" stroke="#f97316" strokeWidth="1" strokeDasharray={`${utilDash} ${circ}`} strokeDashoffset={utilOffset} className="transition-all duration-500" />
      <circle cx="0" cy="0" r="0.5" fill="transparent" stroke="#22c55e" strokeWidth="1" strokeDasharray={`${saveDash} ${circ}`} strokeDashoffset={saveOffset} className="transition-all duration-500" />
      <circle cx="0" cy="0" r="0.5" fill="transparent" stroke="#5560F1" strokeWidth="1" strokeDasharray={`${foodDash} ${circ}`} strokeDashoffset={foodOffset} className="transition-all duration-500" />
     </>
     )}
    </svg>
    {isOverBudget && (
     <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold rotate-0 text-center">
     Exceeds<br/>100%
     </div>
    )}
    {!isOverBudget && (
     <div className="absolute inset-0 flex items-center justify-center flex-col rounded-full w-24 h-24 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg border-2 border-slate-100 dark:border-[#1c1b1b]">
     <span className="text-xs text-slate-500 dark:text-[#71717a]">Total</span>
     <span className="font-bold text-slate-800 dark:text-[#ffffff]">${paycheck}</span>
     </div>
    )}
    </div>
    
    <div className="mt-8 grid grid-cols-2 gap-4 text-sm w-full bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full shrink-0 dark:bg-teal-950/20 dark:border-teal-900"></div> <span className="truncate">Rent ({rentN}/{rentD})</span></div>
    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full shrink-0"></div> <span className="truncate">Utilities ({utilN}/{utilD})</span></div>
    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full shrink-0 dark:bg-[#121212] dark:border-[#1c1b1b]"></div> <span className="truncate">Savings ({saveN}/{saveD})</span></div>
    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500 rounded-full shrink-0 dark:bg-[#121212] dark:border-[#1c1b1b]"></div> <span className="truncate text-indigo-600 dark:text-indigo-400 font-bold">Food (Rem.)</span></div>
    </div>
   </div>
   )}

   {activeTab === 'bounds' && (
   <div className="flex flex-col items-center w-full max-w-lg">
    <h3 className="text-xl font-bold mb-4 text-center">Area Visualization (Max/Min Bounds)</h3>
    
    <div className="w-full aspect-square relative bg-white dark:!bg-[#121212] rounded-xl shadow-lg border border-slate-200 dark:border-[#1c1b1b] p-4 sm:p-8 flex items-center justify-center">
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
     {/* Max Bound Rectangle */}
     <rect 
     x={50 - ((length + 0.05) * scale)/2} 
     y={50 - ((width + 0.05) * scale)/2} 
     width={(length + 0.05) * scale} 
     height={(width + 0.05) * scale} 
     fill="#e0e7ff" stroke="#4f46e5" strokeWidth="0.5" strokeDasharray="2" className="dark:fill-indigo-900/30 dark:stroke-indigo-400 transition-all duration-300"
     />
     {/* Nominal Rectangle */}
     <rect 
     x={50 - (length * scale)/2} 
     y={50 - (width * scale)/2} 
     width={length * scale} 
     height={width * scale} 
     fill="#c7d2fe" stroke="#4338ca" strokeWidth="1" className="dark:fill-indigo-800/50 dark:stroke-indigo-300 transition-all duration-300"
     />
     {/* Min Bound Rectangle */}
     <rect 
     x={50 - ((length - 0.05) * scale)/2} 
     y={50 - ((width - 0.05) * scale)/2} 
     width={(length - 0.05) * scale} 
     height={(width - 0.05) * scale} 
     fill="#a5b4fc" stroke="#3730a3" strokeWidth="0.5" strokeDasharray="1" className="dark:fill-indigo-700/80 dark:stroke-indigo-200 transition-all duration-300"
     />
     
     {/* Labels */}
     <text x="50" y={50 - (width * scale)/2 - 3} fontSize="3.5" textAnchor="middle" fill="currentColor" className="text-slate-600 dark:text-[#a1a1aa] font-mono">
     L = {length.toFixed(1)} ± 0.05
     </text>
     <text x={50 + (length * scale)/2 + 3} y="50" fontSize="3.5" textAnchor="middle" fill="currentColor" transform={`rotate(90, ${50 + (length * scale)/2 + 3}, 50)`} className="text-slate-600 dark:text-[#a1a1aa] font-mono">
     W = {width.toFixed(1)} ± 0.05
     </text>
    </svg>
    </div>

    <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm bg-white dark:!bg-[#121212] p-3 rounded-lg shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-indigo-50 dark:bg-indigo-900 border border-indigo-500 border-dashed"></div> Max Bounds</div>
    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-indigo-200 dark:bg-indigo-800 border border-indigo-600"></div> Nominal Area</div>
    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-indigo-300 dark:bg-indigo-700 border border-indigo-700 border-dotted"></div> Min Bounds</div>
    </div>
   </div>
   )}

  </div>
  </main>
 </div>
 );
}
