import { useState } from 'react';
import { ArrowLeft, Check, TrendingUp, LocateFixed } from 'lucide-react';

export default function LabM8EquationsInequalities({ onExit }: { onExit?: () => void }) {
 const [mode, setMode] = useState<'equations' | 'inequalities'>('equations');

 // ISP Pricing (Equations)
 const [m1, setM1] = useState(0.15); // cost per min ISP A
 const [c1, setC1] = useState(20); // base cost ISP A
 const [m2, setM2] = useState(0.25); // cost per min ISP B
 const [c2, setC2] = useState(10); // base cost ISP B
 
 const [eqAns, setEqAns] = useState('');
 const [eqFeedback, setEqFeedback] = useState('');

 // Inequalities Constraints
 const [ineqM, setIneqM] = useState(-1);
 const [ineqC, setIneqC] = useState(15);
 const [operator, setOperator] = useState<'<' | '>' | '<=' | '>='>('<=');
 
 const [ineqPointX, setIneqPointX] = useState(5);
 const [ineqPointY, setIneqPointY] = useState(5);
 const [ineqFeedback, setIneqFeedback] = useState('');

 // Checks
 const checkEquations = () => {
 if (m1 === m2) {
  setEqFeedback(c1 === c2 ? 'Infinite solutions.' : 'No solution (parallel).');
  return;
 }
 const intersectX = (c2 - c1) / (m1 - m2);
 if (Math.abs(parseFloat(eqAns) - intersectX) < 0.1) {
  setEqFeedback('Correct! This is the break-even amount of minutes.');
 } else {
  setEqFeedback(`Incorrect. Try equating both equations to solve for x. Expected: ~${intersectX.toFixed(1)}`);
 }
 };

 const checkInequality = () => {
 const rhs = ineqM * ineqPointX + ineqC;
 let satisfied = false;
 if (operator === '<') satisfied = ineqPointY < rhs;
 if (operator === '<=') satisfied = ineqPointY <= rhs;
 if (operator === '>') satisfied = ineqPointY > rhs;
 if (operator === '>=') satisfied = ineqPointY >= rhs;
 
 setIneqFeedback(satisfied ? 'Correct! The point satisfies the constraint (it is in the shaded region).' : 'Incorrect! The point violates the business constraint.');
 };

 // Plotting helpers
 const maxEqX = 200;
 const maxEqY = 100;
 
 const maxIneqX = 20;
 const maxIneqY = 20;
 const minIneqXY = -5;

 return (
 <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] select-none">
  {/* Header */}
  <div className="flex items-center p-4 shadow-sm border-b border-slate-200 dark:border-[#1c1b1b]">
  <button onClick={onExit} className="p-2 mr-4 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full flex-shrink-0 whitespace-nowrap transition-colors">
   <ArrowLeft size={20} />
  </button>
  <h1 className="text-lg md:text-xl font-bold flex-1 truncate">Unit 7: Equations & Inequalities</h1>
  <div className="flex space-x-2">
   <button onClick={() => setMode('equations')} className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${mode === 'equations' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-[#ffffff] dark:hover:bg-slate-600'}`}>
   <TrendingUp size={18} className="mr-2" /> Systems of Equations
   </button>
   <button onClick={() => setMode('inequalities')} className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${mode === 'inequalities' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-[#ffffff] dark:hover:bg-slate-600'}`}>
   <LocateFixed size={18} className="mr-2" /> Business Constraints
   </button>
  </div>
  </div>

  {/* Main content: 2-column layout */}
  <div className="flex flex-1 overflow-hidden">
  {/* Left Col: Controls */}
  <div className="w-full lg:w-1/3 min-w-[320px] p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] shadow-lg z-10 flex flex-col">
   {mode === 'equations' ? (
   <div className="space-y-6 flex-1 flex flex-col">
    <div>
    <h2 className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2">ISP Pricing Model</h2>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">Compare two Internet Service Providers. Find the intersection point to determine the break-even minutes.</p>
    </div>
    
    <div className="space-y-5 bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
    <h3 className="font-bold text-indigo-900 dark:text-indigo-300">ISP A (Blue Line)</h3>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold">Cost per Minute ($)</label>
     <span className="text-sm font-bold">{m1.toFixed(2)}</span>
     </div>
     <input type="range" min="0.05" max="0.5" step="0.05" value={m1} onChange={e => setM1(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold">Base Cost ($)</label>
     <span className="text-sm font-bold">{c1}</span>
     </div>
     <input type="range" min="0" max="50" step="5" value={c1} onChange={e => setC1(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    </div>

    <div className="space-y-5 bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
    <h3 className="font-bold text-emerald-900 dark:text-emerald-300">ISP B (Green Line)</h3>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold">Cost per Minute ($)</label>
     <span className="text-sm font-bold">{m2.toFixed(2)}</span>
     </div>
     <input type="range" min="0.05" max="0.5" step="0.05" value={m2} onChange={e => setM2(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold">Base Cost ($)</label>
     <span className="text-sm font-bold">{c2}</span>
     </div>
     <input type="range" min="0" max="50" step="5" value={c2} onChange={e => setC2(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    </div>

    <div className="mt-auto p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800/50 shadow-sm">
    <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-300 mb-2">Optimize</h3>
    <p className="text-sm mb-4">At how many minutes is the cost exactly the same for both ISPs?</p>
    <div className="flex space-x-2">
     <input 
     type="number" 
     value={eqAns} 
     onChange={e => setEqAns(e.target.value)}
     className="flex-1 min-w-0 p-2.5 border rounded-lg dark:border-[#1c1b1b] focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
     placeholder="Break-even minutes..."
     />
     <button 
     onClick={checkEquations}
     className="flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg whitespace-nowrap flex-shrink-0 transition-colors font-medium shadow-sm dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
     >
     <Check size={18} className="mr-1.5" /> Check
     </button>
    </div>
    {eqFeedback && (
     <div className={`mt-3 p-3 rounded-lg text-sm font-medium border ${eqFeedback.includes('Correct') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50'}`}>
     {eqFeedback}
     </div>
    )}
    </div>
   </div>
   ) : (
   <div className="space-y-6 flex-1 flex flex-col">
    <div>
    <h2 className="text-2xl font-extrabold text-rose-700 dark:text-rose-400 mb-2">Visual Constraints</h2>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">Model business limits (e.g. max budget) as a linear inequality. Shade the feasible region.</p>
    </div>

    <div className="space-y-5 bg-slate-50 dark:bg-[#121212]/50 p-4 rounded-xl border border-slate-100 dark:border-[#1c1b1b]">
    <div className="flex space-x-4 items-end">
     <div className="flex-1">
     <label className="block text-sm font-semibold mb-2">Constraint Form</label>
     <div className="flex items-center space-x-2 font-mono p-2.5 border border-slate-300 dark:border-[#1c1b1b] rounded-lg">
      <span>y</span>
      <select 
      value={operator} 
      onChange={e => setOperator(e.target.value as any)} 
      className="p-1 border rounded bg-slate-100 dark:bg-slate-700 dark:border-[#1c1b1b] outline-none focus:ring-2 focus:ring-rose-500 font-bold"
      >
      <option value="<">&lt;</option>
      <option value="<=">&le;</option>
      <option value=">">&gt;</option>
      <option value=">=">&ge;</option>
      </select>
      <span>{ineqM}x + {ineqC}</span>
     </div>
     </div>
    </div>
    
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold">Slope (Rate of change)</label>
     <span className="text-sm font-bold bg-slate-200 dark:bg-slate-700 px-2 rounded">{ineqM}</span>
     </div>
     <input type="range" min="-3" max="3" step="0.5" value={ineqM} onChange={e => setIneqM(Number(e.target.value))} className="w-full accent-rose-600" />
    </div>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold">Y-Intercept (Fixed limit)</label>
     <span className="text-sm font-bold bg-slate-200 dark:bg-slate-700 px-2 rounded">{ineqC}</span>
     </div>
     <input type="range" min="-5" max="20" step="1" value={ineqC} onChange={e => setIneqC(Number(e.target.value))} className="w-full accent-rose-600" />
    </div>
    </div>

    <div className="space-y-5 bg-slate-50 dark:bg-[#121212]/50 p-4 rounded-xl border border-slate-100 dark:border-[#1c1b1b]">
    <h3 className="font-bold">Test a Point</h3>
    <div className="flex space-x-4">
     <div className="flex-1">
     <label className="text-sm font-semibold mb-1 block">X Coord: {ineqPointX}</label>
     <input type="range" min="-5" max="20" step="1" value={ineqPointX} onChange={e => setIneqPointX(Number(e.target.value))} className="w-full accent-slate-500" />
     </div>
     <div className="flex-1">
     <label className="text-sm font-semibold mb-1 block">Y Coord: {ineqPointY}</label>
     <input type="range" min="-5" max="20" step="1" value={ineqPointY} onChange={e => setIneqPointY(Number(e.target.value))} className="w-full accent-slate-500" />
     </div>
    </div>
    </div>

    <div className="mt-auto p-5 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-200 dark:border-rose-800/50 shadow-sm">
    <h3 className="font-bold text-lg text-rose-900 dark:text-rose-300 mb-2">Verify Constraint</h3>
    <p className="text-sm mb-4">Does your selected point ({ineqPointX}, {ineqPointY}) satisfy the business rule?</p>
    <button 
     onClick={checkInequality}
     className="w-full flex items-center justify-center px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg whitespace-nowrap transition-colors font-medium shadow-sm dark:text-white dark:text-white dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-rose-500/40"
    >
     <Check size={18} className="mr-1.5" /> Check Point
    </button>
    {ineqFeedback && (
     <div className={`mt-3 p-3 rounded-lg text-sm font-medium border ${ineqFeedback.includes('Correct') ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50'}`}>
     {ineqFeedback}
     </div>
    )}
    </div>
   </div>
   )}
  </div>

  {/* Right Col: Simulation Stage */}
  <div className="w-full lg:w-2/3 p-4 md:p-8 flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-950/50 relative overflow-hidden">
   {mode === 'equations' ? (
   <div className="w-full h-full max-w-4xl max-h-[600px] bg-white dark:!bg-[#121212] rounded-3xl shadow-xl border border-slate-200 dark:border-[#1c1b1b] flex flex-col p-6 overflow-hidden relative">
    <h3 className="text-xl font-bold text-center mb-6 text-slate-700 dark:text-[#ffffff]">Cost Comparison Graph</h3>
    
    <div className="flex-1 min-w-0 w-full relative">
    <svg viewBox="0 0 600 400" className="w-full h-full bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
     {/* Grid */}
     {[1, 2, 3, 4].map(i => (
     <line key={`x-${i}`} x1={i*150} y1="0" x2={i*150} y2="400" stroke="currentColor" strokeWidth="1" opacity="0.1" className="text-slate-900 dark:text-[#ffffff]" />
     ))}
     {[1, 2, 3, 4, 5, 6, 7].map(i => (
     <line key={`y-${i}`} x1="0" y1={i*50} x2="600" y2={i*50} stroke="currentColor" strokeWidth="1" opacity="0.1" className="text-slate-900 dark:text-[#ffffff]" />
     ))}
     
     {/* Axes */}
     <line x1="50" y1="350" x2="580" y2="350" stroke="currentColor" strokeWidth="3" className="text-slate-400" />
     <line x1="50" y1="20" x2="50" y2="350" stroke="currentColor" strokeWidth="3" className="text-slate-400" />
     <text x="315" y="380" fontSize="14" fill="currentColor" textAnchor="middle" className="font-bold text-slate-500">Minutes Used</text>
     <text x="20" y="185" fontSize="14" fill="currentColor" textAnchor="middle" transform="rotate(-90 20 185)" className="font-bold text-slate-500">Cost ($)</text>

     {/* Mapping fns */}
     {(() => {
     const mapX = (x: number) => 50 + (x / maxEqX) * 500;
     const mapY = (y: number) => 350 - (y / maxEqY) * 300;

     // Line 1: ISP A (Blue)
     const x1A = 0, y1A = c1;
     const x2A = maxEqX, y2A = m1 * maxEqX + c1;

     // Line 2: ISP B (Green)
     const x1B = 0, y1B = c2;
     const x2B = maxEqX, y2B = m2 * maxEqX + c2;

     // Intersection
     let intersectX = -1, intersectY = -1;
     if (m1 !== m2) {
      intersectX = (c2 - c1) / (m1 - m2);
      intersectY = m1 * intersectX + c1;
     }

     return (
      <>
      {/* ISP A */}
      <line x1={mapX(x1A)} y1={mapY(y1A)} x2={mapX(x2A)} y2={mapY(y2A)} stroke="#2563eb" strokeWidth="4" />
      <text x={mapX(x2A)-10} y={mapY(y2A)-10} fill="#2563eb" fontSize="14" fontWeight="bold">ISP A</text>
      
      {/* ISP B */}
      <line x1={mapX(x1B)} y1={mapY(y1B)} x2={mapX(x2B)} y2={mapY(y2B)} stroke="#10b981" strokeWidth="4" />
      <text x={mapX(x2B)-10} y={mapY(y2B)+20} fill="#10b981" fontSize="14" fontWeight="bold">ISP B</text>

      {/* Intersection Marker */}
      {intersectX >= 0 && intersectX <= maxEqX && intersectY >= 0 && intersectY <= maxEqY && (
       <g>
       <circle cx={mapX(intersectX)} cy={mapY(intersectY)} r="6" fill="#ef4444" />
       <text x={mapX(intersectX)} y={mapY(intersectY) - 15} fill="#ef4444" fontSize="12" fontWeight="bold" textAnchor="middle">
        ({intersectX.toFixed(1)} min, ${intersectY.toFixed(1)})
       </text>
       {/* Guidelines */}
       <line x1={mapX(intersectX)} y1={mapY(intersectY)} x2={mapX(intersectX)} y2="350" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
       <line x1="50" y1={mapY(intersectY)} x2={mapX(intersectX)} y2={mapY(intersectY)} stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
       </g>
      )}
      </>
     )
     })()}
    </svg>
    </div>
   </div>
   ) : (
   <div className="w-full h-full max-w-4xl max-h-[600px] bg-white dark:!bg-[#121212] rounded-3xl shadow-xl border border-slate-200 dark:border-[#1c1b1b] flex flex-col p-6 overflow-hidden relative">
    <h3 className="text-xl font-bold text-center mb-6 text-slate-700 dark:text-[#ffffff]">Feasible Region</h3>
    
    <div className="flex-1 min-w-0 w-full relative">
    <svg viewBox="0 0 600 400" className="w-full h-full bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] overflow-hidden">
     <defs>
     <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="10" stroke="#fb7185" strokeWidth="2" opacity="0.5" />
     </pattern>
     </defs>
     
     {/* Cartesian Axes */}
     <line x1="120" y1="0" x2="120" y2="400" stroke="currentColor" strokeWidth="2" opacity="0.3" className="text-slate-900 dark:text-[#ffffff]" />
     <line x1="0" y1="320" x2="600" y2="320" stroke="currentColor" strokeWidth="2" opacity="0.3" className="text-slate-900 dark:text-[#ffffff]" />
     <text x="130" y="20" fontSize="12" fill="currentColor" opacity="0.6">Y axis</text>
     <text x="560" y="310" fontSize="12" fill="currentColor" opacity="0.6">X axis</text>

     {(() => {
     // Map functions
     const xRange = maxIneqX - minIneqXY; // 25
     const yRange = maxIneqY - minIneqXY; // 25
     const mapX = (x: number) => ((x - minIneqXY) / xRange) * 600;
     const mapY = (y: number) => 400 - ((y - minIneqXY) / yRange) * 400;

     // Line equation points for drawing region
     const getLineY = (x: number) => ineqM * x + ineqC;
     
     const p1x = minIneqXY; const p1y = getLineY(p1x);
     const p2x = maxIneqX; const p2y = getLineY(p2x);
     
     // Polygon for shading
     let polyPoints = "";
     if (operator === '<' || operator === '<=') {
      // Shade below the line
      polyPoints = `${mapX(minIneqXY)},${mapY(minIneqXY)} ${mapX(maxIneqX)},${mapY(minIneqXY)} ${mapX(p2x)},${mapY(p2y)} ${mapX(p1x)},${mapY(p1y)}`;
     } else {
      // Shade above the line
      polyPoints = `${mapX(minIneqXY)},${mapY(maxIneqY)} ${mapX(maxIneqX)},${mapY(maxIneqY)} ${mapX(p2x)},${mapY(p2y)} ${mapX(p1x)},${mapY(p1y)}`;
     }

     const isDashed = operator === '<' || operator === '>';

     return (
      <>
      {/* Shaded Region */}
      <polygon points={polyPoints} fill="url(#diagonalHatch)" />
      
      {/* The Line */}
      <line 
       x1={mapX(p1x)} y1={mapY(p1y)} 
       x2={mapX(p2x)} y2={mapY(p2y)} 
       stroke="#e11d48" 
       strokeWidth="3" 
       strokeDasharray={isDashed ? "8 8" : "none"} 
      />
      
      {/* The Point */}
      <circle cx={mapX(ineqPointX)} cy={mapY(ineqPointY)} r="7" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
      <text x={mapX(ineqPointX) + 12} y={mapY(ineqPointY) + 5} fill="#4f46e5" fontSize="14" fontWeight="bold">
       ({ineqPointX}, {ineqPointY})
      </text>
      </>
     )
     })()}
    </svg>
    </div>
   </div>
   )}
  </div>
  </div>
 </div>
 );
}
