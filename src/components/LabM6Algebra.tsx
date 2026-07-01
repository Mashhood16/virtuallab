import { useState } from 'react';
import { ArrowLeft, Plus, Minus, Scale, Wallet } from 'lucide-react';

export default function LabM6Algebra({ onExit }: { onExit?: () => void }) {
 // Savings Sequence State
 const [startAmount, setStartAmount] = useState(10);
 const [dailySaving, setDailySaving] = useState(5);
 const [predictDay, setPredictDay] = useState(7);
 
 // Balance Scale State
 // Equation: x + leftFruits = rightFruits
 const [leftFruits, setLeftFruits] = useState(2);
 const [rightFruits, setRightFruits] = useState(7);
 const [userX, setUserX] = useState(0);

 const isBalanced = userX + leftFruits === rightFruits;
 const balanceAngle = Math.max(-20, Math.min(20, (userX + leftFruits - rightFruits) * -5));

 return (
 <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#000000] text-slate-800 dark:text-[#ffffff] font-sans transition-colors duration-300">
  <header className="flex items-center p-4 shadow-sm z-10">
  <button onClick={onExit} className="p-2 mr-4 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
   <ArrowLeft className="w-6 h-6" />
  </button>
  <h1 className="text-lg md:text-xl font-bold">Class 6 Algebra: Sequences & Equations</h1>
  </header>

  <div className="flex-1 min-w-0 flex flex-col lg:flex-row lg:overflow-hidden">
  {/* Left Column: Interactive Controls/Workspace */}
  <div className="w-full lg:w-1/3 flex flex-col p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b]">
   
   <section className="mb-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
   <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-300">
    <Wallet className="w-5 h-5" /> Savings Predictor (Sequences)
   </h2>
   <div className="space-y-4">
    <div>
    <label className="block text-sm mb-1 font-medium">Starting Amount: ${startAmount}</label>
    <input type="range" min="0" max="50" value={startAmount} onChange={(e) => setStartAmount(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    <div>
    <label className="block text-sm mb-1 font-medium">Daily Saving: ${dailySaving}</label>
    <input type="range" min="1" max="20" value={dailySaving} onChange={(e) => setDailySaving(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    <div>
    <label className="block text-sm mb-1 font-medium">Predict Day: {predictDay}</label>
    <input type="range" min="1" max="30" value={predictDay} onChange={(e) => setPredictDay(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    <div className="p-3 bg-white dark:!bg-[#121212] rounded-lg shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <p className="text-sm text-slate-500 dark:text-[#71717a]">Formula: Amount = {startAmount} + ({dailySaving} × Day)</p>
    <p className="text-lg font-bold mt-1 text-blue-800 dark:text-blue-300">Total on Day {predictDay}: ${startAmount + dailySaving * predictDay}</p>
    </div>
   </div>
   </section>

   <section className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
   <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
    <Scale className="w-5 h-5" /> Fruit Equation Solver
   </h2>
   <p className="text-sm mb-4 text-slate-600 dark:text-[#a1a1aa]">Find the unknown number of fruits in the bag (x) to balance the scale!</p>
   <div className="space-y-4">
    <div className="flex justify-between items-center bg-white dark:!bg-[#121212] p-3 rounded-lg shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <span className="font-medium text-sm">Set Target Right Side:</span>
    <div className="flex items-center gap-2">
     <button onClick={() => setRightFruits(Math.max(leftFruits + 1, rightFruits - 1))} className="p-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded"><Minus className="w-4 h-4"/></button>
     <span className="w-6 text-center font-bold">{rightFruits}</span>
     <button onClick={() => setRightFruits(Math.min(15, rightFruits + 1))} className="p-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded"><Plus className="w-4 h-4"/></button>
    </div>
    </div>
    <div className="flex justify-between items-center bg-white dark:!bg-[#121212] p-3 rounded-lg shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <span className="font-medium text-sm">Fruits Outside Bag:</span>
    <div className="flex items-center gap-2">
     <button onClick={() => setLeftFruits(Math.max(0, leftFruits - 1))} className="p-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded"><Minus className="w-4 h-4"/></button>
     <span className="w-6 text-center font-bold">{leftFruits}</span>
     <button onClick={() => setLeftFruits(Math.min(rightFruits - 1, leftFruits + 1))} className="p-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded"><Plus className="w-4 h-4"/></button>
    </div>
    </div>
    <div className="mt-4 p-4 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10">
    <p className="text-center font-medium mb-2 text-emerald-800 dark:text-emerald-300">Your Guess for 'x':</p>
    <div className="flex justify-center items-center gap-4">
     <button onClick={() => setUserX(Math.max(0, userX - 1))} className="p-2 bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-full hover:bg-emerald-300 dark:hover:bg-emerald-700 transition-colors"><Minus className="w-5 h-5"/></button>
     <span className="text-3xl font-bold w-12 text-center text-emerald-700 dark:text-emerald-400">{userX}</span>
     <button onClick={() => setUserX(Math.min(15, userX + 1))} className="p-2 bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-full hover:bg-emerald-300 dark:hover:bg-emerald-700 transition-colors"><Plus className="w-5 h-5"/></button>
    </div>
    </div>
    {isBalanced && (
    <div className="p-3 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded-lg text-center font-bold animate-pulse border border-green-200 dark:border-green-800">
     Perfect! The scale is balanced!
     <p className="text-sm font-normal mt-1 opacity-80">Equation: {userX} + {leftFruits} = {rightFruits}</p>
    </div>
    )}
   </div>
   </section>

  </div>

  {/* Right Column: Simulation Stage */}
  <div className="w-full lg:w-2/3 p-6 flex flex-col gap-6 lg:overflow-y-auto bg-slate-100/50 dark:bg-[#121212]/50 relative">
   
   <div className="flex-1 min-w-0 bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col min-h-[300px]">
   <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-[#ffffff]">Savings Timeline</h3>
   <div className="flex-1 min-w-0 relative w-full border-l-2 border-b-2 border-slate-300 dark:border-[#1c1b1b] pt-4 pb-2 pr-2">
    {/* Plotting points */}
    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
     {Array.from({ length: Math.min(predictDay + 1, 15) }).map((_, i) => {
     const maxDays = Math.max(10, predictDay);
     const maxY = startAmount + dailySaving * maxDays;
     const xPercent = (i / maxDays) * 100;
     const val = startAmount + dailySaving * i;
     const yPercent = 100 - (val / maxY) * 100;
     return (
      <g key={i}>
      <circle cx={`${xPercent}%`} cy={`${yPercent}%`} r="5" className="fill-blue-500 hover:r-6 transition-all" />
      <text x={`${xPercent}%`} y={`${yPercent}%`} dy="-12" dx="0" textAnchor="middle" className="text-xs fill-slate-600 dark:fill-slate-400 font-medium">
       ${val}
      </text>
      {i % Math.ceil(maxDays/10) === 0 && (
       <text x={`${xPercent}%`} y="100%" dy="20" textAnchor="middle" className="text-xs fill-slate-500 dark:fill-slate-400">
       D{i}
       </text>
      )}
      </g>
     );
     })}
     <path d={`M 0 ${100 - (startAmount / (startAmount + dailySaving * Math.max(10, predictDay))) * 100}% L ${Math.min(100, (predictDay / Math.max(10, predictDay)) * 100)}% ${100 - ((startAmount + dailySaving * predictDay) / (startAmount + dailySaving * Math.max(10, predictDay))) * 100}%`} 
      fill="none" stroke="currentColor" className="text-blue-400/50 dark:text-blue-600/50" strokeWidth="2" strokeDasharray="5,5" />
    </svg>
   </div>
   </div>

   <div className="flex-1 min-w-0 bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center min-h-[350px]">
   <h3 className="text-lg font-bold mb-4 w-full text-left text-slate-800 dark:text-[#ffffff]">
    Equation Balance: <span className="font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">x + {leftFruits} = {rightFruits}</span>
   </h3>
   
   <svg width="100%" height="250" viewBox="-200 -50 400 200" className="overflow-visible mt-4">
    <g transform={`rotate(${balanceAngle}, 0, 80)`} style={{ transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
    {/* Beam */}
    <rect x="-150" y="75" width="300" height="10" rx="5" className="fill-slate-400 dark:fill-slate-500" />
    
    {/* Left Pan */}
    <g transform="translate(-140, 85)">
     <path d="M -40 0 L 0 60 L 40 0 Z" className="fill-transparent stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />
     <path d="M -40 60 Q 0 80 40 60 Z" className="fill-slate-300 dark:fill-slate-600" />
     {/* Unknown Bag (x) */}
     <rect x="-15" y="20" width="30" height="40" rx="5" className="fill-emerald-500 dark:fill-emerald-600 shadow-lg" />
     <text x="0" y="45" textAnchor="middle" className="fill-white font-bold text-sm">x=?</text>
     <text x="0" y="15" textAnchor="middle" className="fill-emerald-800 dark:fill-emerald-200 text-[10px] font-bold">({userX})</text>
     
     {/* Left Fruits */}
     {Array.from({ length: leftFruits }).map((_, i) => (
     <circle key={`l-${i}`} cx={(i % 3) * 12 - 12} cy={55 - Math.floor(i / 3) * 12} r="5" className="fill-amber-400 dark:fill-amber-500 stroke-amber-600 dark:stroke-amber-700 stroke-[1]" />
     ))}
    </g>

    {/* Right Pan */}
    <g transform="translate(140, 85)">
     <path d="M -40 0 L 0 60 L 40 0 Z" className="fill-transparent stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />
     <path d="M -40 60 Q 0 80 40 60 Z" className="fill-slate-300 dark:fill-slate-600" />
     {/* Right Fruits */}
     {Array.from({ length: rightFruits }).map((_, i) => (
     <circle key={`r-${i}`} cx={(i % 4) * 12 - 18} cy={55 - Math.floor(i / 4) * 12} r="5" className="fill-amber-400 dark:fill-amber-500 stroke-amber-600 dark:stroke-amber-700 stroke-[1]" />
     ))}
    </g>
    </g>
    
    {/* Stand */}
    <path d="M -15 150 L 0 80 L 15 150 Z" className="fill-slate-600 dark:fill-slate-400" />
    <rect x="-30" y="150" width="60" height="10" rx="4" className="fill-slate-700 dark:fill-slate-300" />
    <circle cx="0" cy="80" r="6" className="fill-slate-800 dark:fill-slate-200" />
   </svg>
   </div>

  </div>
  </div>
 </div>
 );
}
