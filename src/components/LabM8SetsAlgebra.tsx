import { useState, useMemo } from 'react';
import { ArrowLeft, Check, PieChart, TrendingUp } from 'lucide-react';

export default function LabM8SetsAlgebra({ onExit }: { onExit?: () => void }) {
 const [mode, setMode] = useState<'sets' | 'sequences'>('sets');

 // Sets state
 const [totalStudents, setTotalStudents] = useState(100);
 const [bio, setBio] = useState(45);
 const [cs, setCs] = useState(55);
 const [both, setBoth] = useState(20);
 
 const onlyBio = Math.max(0, bio - both);
 const onlyCs = Math.max(0, cs - both);
 const neither = Math.max(0, totalStudents - (onlyBio + onlyCs + both));
 
 const [setsAns, setSetsAns] = useState('');
 const [setsFeedback, setSetsFeedback] = useState('');

 // Sequence state
 const [seqType, setSeqType] = useState<'arithmetic' | 'geometric'>('arithmetic');
 const [firstTerm, setFirstTerm] = useState(1000);
 const [ratio, setRatio] = useState(200); // difference or multiplier
 const [targetN, setTargetN] = useState(5);
 const [seqAns, setSeqAns] = useState('');
 const [seqFeedback, setSeqFeedback] = useState('');

 // Handlers
 const checkSets = () => {
 if (parseInt(setsAns) === neither) {
  setSetsFeedback('Correct! You found the number of students taking neither.');
 } else {
  setSetsFeedback('Incorrect. Try Total - (Only Bio + Only CS + Both).');
 }
 };

 const checkSeq = () => {
 let expected = 0;
 if (seqType === 'arithmetic') {
  expected = firstTerm + (targetN - 1) * ratio;
 } else {
  expected = firstTerm * Math.pow(ratio, targetN - 1);
 }
 
 // allow a small margin for floating point on geometric
 if (Math.abs(Number(seqAns) - expected) < 0.1) {
  setSeqFeedback('Correct! Accurate prediction for the future value.');
 } else {
  setSeqFeedback(`Incorrect. Check the ${seqType} sequence formula.`);
 }
 };

 // Sequence data points
 const seqPoints = useMemo(() => {
 const pts = [];
 for(let i=1; i<=10; i++){
  if(seqType === 'arithmetic') pts.push(firstTerm + (i-1)*ratio);
  else pts.push(firstTerm * Math.pow(ratio, i-1));
 }
 return pts;
 }, [seqType, firstTerm, ratio]);

 return (
 <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] select-none">
  {/* Header */}
  <div className="flex items-center p-4 shadow-sm border-b border-slate-200 dark:border-[#1c1b1b]">
  <button onClick={onExit} className="p-2 mr-4 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full flex-shrink-0 whitespace-nowrap transition-colors">
   <ArrowLeft size={20} />
  </button>
  <h1 className="text-lg md:text-xl font-bold flex-1 truncate">Unit 5 & 6: Sets and Sequences</h1>
  <div className="flex space-x-2">
   <button onClick={() => setMode('sets')} className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${mode === 'sets' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-[#ffffff] dark:hover:bg-slate-600'}`}>
   <PieChart size={18} className="mr-2" /> Sets Analysis
   </button>
   <button onClick={() => setMode('sequences')} className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${mode === 'sequences' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-[#ffffff] dark:hover:bg-slate-600'}`}>
   <TrendingUp size={18} className="mr-2" /> Sequences
   </button>
  </div>
  </div>

  {/* Main content: 2-column layout */}
  <div className="flex flex-1 overflow-hidden">
  {/* Left Col: Controls */}
  <div className="w-full lg:w-1/3 min-w-[320px] p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] shadow-lg z-10 flex flex-col">
   {mode === 'sets' ? (
   <div className="space-y-6 flex-1 flex flex-col">
    <div>
    <h2 className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2">Demographic Survey</h2>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">Adjust the survey results to see the Venn diagram update. Analyze intersecting groups of biology and computer science students.</p>
    </div>
    
    <div className="space-y-5 bg-slate-50 dark:bg-[#121212]/50 p-4 rounded-xl border border-slate-100 dark:border-[#1c1b1b]">
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold">Total Students</label>
     <span className="text-sm font-bold bg-slate-200 dark:bg-slate-700 px-2 rounded">{totalStudents}</span>
     </div>
     <input type="range" min="50" max="250" value={totalStudents} onChange={e => setTotalStudents(Number(e.target.value))} className="w-full accent-indigo-600" />
    </div>
    <div>
     <div className="flex justify-between mb-1 text-emerald-600 dark:text-emerald-400">
     <label className="text-sm font-semibold">Biology Students</label>
     <span className="text-sm font-bold bg-emerald-100 dark:bg-emerald-900/50 px-2 rounded">{bio}</span>
     </div>
     <input type="range" min="0" max={totalStudents} value={bio} onChange={e => setBio(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <div>
     <div className="flex justify-between mb-1 text-blue-600 dark:text-blue-400">
     <label className="text-sm font-semibold">CS Students</label>
     <span className="text-sm font-bold bg-blue-100 dark:bg-blue-900/50 px-2 rounded">{cs}</span>
     </div>
     <input type="range" min="0" max={totalStudents} value={cs} onChange={e => setCs(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    <div>
     <div className="flex justify-between mb-1 text-indigo-600 dark:text-indigo-400">
     <label className="text-sm font-semibold">Students in Both</label>
     <span className="text-sm font-bold bg-indigo-100 dark:bg-indigo-900/50 px-2 rounded">{both}</span>
     </div>
     <input type="range" min="0" max={Math.min(bio, cs)} value={both} onChange={e => setBoth(Number(e.target.value))} className="w-full accent-indigo-600" />
    </div>
    </div>

    <div className="mt-auto p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800/50 shadow-sm">
    <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-300 mb-2">Knowledge Check</h3>
    <p className="text-sm mb-4">Given these survey results, how many students are taking <strong>NEITHER</strong> Biology nor CS?</p>
    <div className="flex space-x-2">
     <input 
     type="number" 
     value={setsAns} 
     onChange={e => setSetsAns(e.target.value)}
     className="flex-1 min-w-0 p-2.5 border rounded-lg dark:border-[#1c1b1b] focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
     placeholder="Enter value..."
     />
     <button 
     onClick={checkSets}
     className="flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg whitespace-nowrap flex-shrink-0 transition-colors font-medium shadow-sm dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
     >
     <Check size={18} className="mr-1.5" /> Check
     </button>
    </div>
    {setsFeedback && (
     <div className={`mt-3 p-3 rounded-lg text-sm font-medium border ${setsFeedback.includes('Correct') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50'}`}>
     {setsFeedback}
     </div>
    )}
    </div>
   </div>
   ) : (
   <div className="space-y-6 flex-1 flex flex-col">
    <div>
    <h2 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mb-2">Sequence Growth</h2>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">Model career progressions using arithmetic or geometric sequences to predict future values.</p>
    </div>

    <div className="space-y-5 bg-slate-50 dark:bg-[#121212]/50 p-4 rounded-xl border border-slate-100 dark:border-[#1c1b1b]">
    <div>
     <label className="block text-sm font-semibold mb-2">Sequence Type</label>
     <select 
     value={seqType} 
     onChange={e => setSeqType(e.target.value as any)} 
     className="w-full p-2.5 border rounded-lg dark:border-[#1c1b1b] outline-none focus:ring-2 focus:ring-emerald-500"
     >
     <option value="arithmetic">Arithmetic (Constant Addition)</option>
     <option value="geometric">Geometric (Constant Multiplication)</option>
     </select>
    </div>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold">First Term (Year 1)</label>
     <span className="text-sm font-bold bg-slate-200 dark:bg-slate-700 px-2 rounded">{firstTerm}</span>
     </div>
     <input type="range" min="100" max="5000" step="100" value={firstTerm} onChange={e => setFirstTerm(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold">
      {seqType === 'arithmetic' ? 'Common Difference (+)' : 'Common Ratio (×)'}
     </label>
     <span className="text-sm font-bold bg-slate-200 dark:bg-slate-700 px-2 rounded">{ratio}</span>
     </div>
     <input type="range" min="1" max={seqType === 'arithmetic' ? 1000 : 3} step={seqType === 'arithmetic' ? 50 : 0.1} value={ratio} onChange={e => setRatio(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <div>
     <div className="flex justify-between mb-1 text-amber-600 dark:text-amber-500">
     <label className="text-sm font-semibold">Target Year (N)</label>
     <span className="text-sm font-bold bg-amber-100 dark:bg-amber-900/50 px-2 rounded">{targetN}</span>
     </div>
     <input type="range" min="2" max="10" value={targetN} onChange={e => setTargetN(Number(e.target.value))} className="w-full accent-amber-500" />
    </div>
    </div>

    <div className="mt-auto p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
    <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-300 mb-2">Assessment</h3>
    <p className="text-sm mb-4">Calculate the exact predicted value at <strong>Year {targetN}</strong>.</p>
    <div className="flex space-x-2">
     <input 
     type="number" 
     value={seqAns} 
     onChange={e => setSeqAns(e.target.value)}
     className="flex-1 min-w-0 p-2.5 border rounded-lg dark:border-[#1c1b1b] focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
     placeholder="Enter predicted value..."
     />
     <button 
     onClick={checkSeq}
     className="flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg whitespace-nowrap flex-shrink-0 transition-colors font-medium shadow-sm dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
     >
     <Check size={18} className="mr-1.5" /> Check
     </button>
    </div>
    {seqFeedback && (
     <div className={`mt-3 p-3 rounded-lg text-sm font-medium border ${seqFeedback.includes('Correct') ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50'}`}>
     {seqFeedback}
     </div>
    )}
    </div>
   </div>
   )}
  </div>

  {/* Right Col: Simulation Stage */}
  <div className="w-full lg:w-2/3 p-4 md:p-8 flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-950/50 relative overflow-hidden">
   {mode === 'sets' ? (
   <div className="w-full h-full max-w-4xl max-h-[600px] bg-white dark:!bg-[#121212] rounded-3xl shadow-xl border border-slate-200 dark:border-[#1c1b1b] flex flex-col p-6 overflow-hidden">
    <h3 className="text-xl font-bold text-center mb-6 text-slate-700 dark:text-[#ffffff]">Venn Diagram Visualization</h3>
    <div className="flex-1 min-w-0 w-full relative">
    <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-sm">
     <defs>
     <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
      <feMergeNode in="coloredBlur"/>
      <feMergeNode in="SourceGraphic"/>
      </feMerge>
     </filter>
     </defs>
     
     {/* Universe Box */}
     <rect x="20" y="20" width="460" height="360" rx="16" fill="var(--color-bg, transparent)" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" className="text-slate-300 dark:text-slate-600" />
     <text x="35" y="45" fontSize="16" fontWeight="bold" fill="currentColor" className="text-slate-500 dark:text-[#71717a]">Total Surveyed (U) = {totalStudents}</text>
     
     {/* Neither Section Text */}
     <rect x="350" y="340" width="115" height="28" rx="6" fill="currentColor" className="text-slate-100 dark:text-slate-800" />
     <text x="407" y="359" fontSize="14" fontWeight="bold" textAnchor="middle" fill="currentColor" className="text-slate-600 dark:text-[#a1a1aa]">Neither = {neither}</text>
     
     {/* Sets grouped for centering */}
     <g transform="translate(25, 25)">
     {/* Bio Circle */}
     <circle cx="180" cy="180" r="120" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="4" />
     {/* CS Circle */}
     <circle cx="280" cy="180" r="120" fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" strokeWidth="4" />
     
     {/* Labels */}
     <rect x="80" y="30" width="80" height="30" rx="15" fill="#10b981" />
     <text x="120" y="50" fontSize="14" fontWeight="bold" fill="#fff" textAnchor="middle">Biology</text>
     
     <rect x="300" y="30" width="120" height="30" rx="15" fill="#3b82f6" />
     <text x="360" y="50" fontSize="14" fontWeight="bold" fill="#fff" textAnchor="middle">Computer Sci</text>

     {/* Values inside */}
     <text x="130" y="190" fontSize="32" fontWeight="900" fill="#059669" textAnchor="middle" style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}>{onlyBio}</text>
     <text x="230" y="190" fontSize="32" fontWeight="900" fill="#6366f1" textAnchor="middle" style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}>{both}</text>
     <text x="330" y="190" fontSize="32" fontWeight="900" fill="#2563eb" textAnchor="middle" style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}>{onlyCs}</text>
     </g>
    </svg>
    </div>
   </div>
   ) : (
   <div className="w-full h-full max-w-4xl max-h-[600px] bg-white dark:!bg-[#121212] rounded-3xl shadow-xl border border-slate-200 dark:border-[#1c1b1b] flex flex-col p-6 overflow-hidden">
    <h3 className="text-xl font-bold text-center mb-6 text-slate-700 dark:text-[#ffffff]">Value Progression Chart</h3>
    <div className="flex-1 min-w-0 w-full relative">
    <svg viewBox="0 0 800 400" className="w-full h-full drop-shadow-sm">
     {/* Grid Lines */}
     {[0, 1, 2, 3, 4].map(i => (
     <line key={`grid-${i}`} x1="60" y1={40 + i * 70} x2="760" y2={40 + i * 70} stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-200 dark:text-slate-700" />
     ))}
     
     {/* Axes */}
     <line x1="60" y1="320" x2="760" y2="320" stroke="currentColor" strokeWidth="3" className="text-slate-400 dark:text-[#71717a]" />
     <line x1="60" y1="20" x2="60" y2="320" stroke="currentColor" strokeWidth="3" className="text-slate-400 dark:text-[#71717a]" />
     
     <text x="30" y="180" transform="rotate(-90 30 180)" fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle" className="text-slate-500 dark:text-[#71717a]">Value</text>
     <text x="410" y="370" fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle" className="text-slate-500 dark:text-[#71717a]">Time (Years)</text>
     
     {/* Data visualization */}
     {(() => {
     const maxVal = Math.max(...seqPoints);
     // Ensure we don't divide by zero, scale to 280 height max
     const scaleY = 280 / (maxVal || 1);
     return seqPoints.map((val, i) => {
      const x = 110 + i * 65;
      const h = val * scaleY;
      const y = 320 - h;
      const isTarget = (i + 1) === targetN;
      
      return (
      <g key={i} className="transition-all duration-500 ease-in-out">
       <rect 
       x={x - 20} 
       y={y} 
       width="40" 
       height={h} 
       fill={isTarget ? "url(#targetGradient)" : "url(#barGradient)"} 
       rx="4"
       className="transition-all duration-500 ease-in-out"
       />
       <text x={x} y="340" fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle" className="text-slate-600 dark:text-[#71717a]">Y{i+1}</text>
       {/* Value label */}
       <text 
       x={x} 
       y={y - 10} 
       fontSize="12" 
       fontWeight="bold" 
       fill={isTarget ? "#d97706" : "currentColor"} 
       textAnchor="middle" 
       className={isTarget ? "" : "text-slate-500 dark:text-[#a1a1aa]"}
       >
       {val >= 1000 ? (val/1000).toFixed(1)+'k' : val.toFixed(0)}
       </text>
       
       {/* Target Highlight Indicator */}
       {isTarget && (
       <polygon points={`${x-6},${y-30} ${x+6},${y-30} ${x},${y-22}`} fill="#d97706" />
       )}
      </g>
      )
     });
     })()}

     <defs>
     <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#10b981" />
      <stop offset="100%" stopColor="#047857" />
     </linearGradient>
     <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#f59e0b" />
      <stop offset="100%" stopColor="#d97706" />
     </linearGradient>
     </defs>
    </svg>
    </div>
   </div>
   )}
  </div>
  </div>
 </div>
 );
}
