import { useState } from 'react';
import { ArrowLeft, Scale, Calculator, RefreshCcw, CheckCircle2 } from 'lucide-react';

export default function LabM7Equations({ onExit }: { onExit?: () => void }) {
 const [activeTab, setActiveTab] = useState<'balance' | 'formula'>('balance');

 // Balance Scale State
 const [eq, setEq] = useState({ lx: 2, lc: 4, rx: 0, rc: 10 });
 const [divError, setDivError] = useState('');

 const applyOp = (type: string) => {
 setDivError('');
 if (type === 'addC') setEq(prev => ({ ...prev, lc: prev.lc + 1, rc: prev.rc + 1 }));
 if (type === 'subC') setEq(prev => ({ ...prev, lc: prev.lc - 1, rc: prev.rc - 1 }));
 if (type === 'addX') setEq(prev => ({ ...prev, lx: prev.lx + 1, rx: prev.rx + 1 }));
 if (type === 'subX') setEq(prev => ({ ...prev, lx: prev.lx - 1, rx: prev.rx - 1 }));
 };

 const handleDivide = (divisor: number) => {
 if (eq.lx % divisor === 0 && eq.lc % divisor === 0 && eq.rx % divisor === 0 && eq.rc % divisor === 0) {
  setEq({
  lx: eq.lx / divisor,
  lc: eq.lc / divisor,
  rx: eq.rx / divisor,
  rc: eq.rc / divisor
  });
  setDivError('');
 } else {
  setDivError(`Cannot divide evenly by ${divisor} using these blocks.`);
 }
 };

 const resetBalance = () => {
 setEq({ lx: 2, lc: 4, rx: 0, rc: 10 });
 setDivError('');
 };

 const isSolved = (eq.lx === 1 && eq.lc === 0 && eq.rx === 0) || (eq.rx === 1 && eq.rc === 0 && eq.lx === 0);

 // Helper to stringify equations
 const formatEq = (x: number, c: number) => {
 if (x === 0 && c === 0) return '0';
 let s = '';
 if (x !== 0) s += x === 1 ? 'x' : x === -1 ? '-x' : `${x}x`;
 if (c !== 0) {
  if (c > 0 && x !== 0) s += ` + ${c}`;
  else if (c < 0 && x !== 0) s += ` - ${Math.abs(c)}`;
  else s += `${c}`;
 }
 return s;
 };

 const drawItems = (xCount: number, cCount: number, startX: number, startY: number) => {
 const items = [];
 let curX = startX - 30; // Center offset
 let curY = startY;

 // Draw X boxes
 for (let i = 0; i < Math.abs(xCount); i++) {
  const isNeg = xCount < 0;
  items.push(
  <g key={`x-${i}`} transform={`translate(${curX}, ${curY})`}>
   <rect x="-15" y="-30" width="30" height="30" rx="4" className={`stroke-2 ${isNeg ? 'fill-red-200 stroke-red-600' : 'fill-green-200 stroke-green-600'}`} />
   <text x="0" y="-10" textAnchor="middle" className="text-sm font-bold fill-slate-800">{isNeg ? '-x' : 'x'}</text>
  </g>
  );
  curX += 35;
  if (curX > startX + 30) { curX = startX - 30; curY -= 35; }
 }

 // Draw C balls
 for (let i = 0; i < Math.abs(cCount); i++) {
  const isNeg = cCount < 0;
  items.push(
  <g key={`c-${i}`} transform={`translate(${curX}, ${curY - 5})`}>
   <circle cx="0" cy="-10" r="12" className={`stroke-2 ${isNeg ? 'fill-orange-200 stroke-orange-600' : 'fill-blue-200 stroke-blue-600'}`} />
   <text x="0" y="-6" textAnchor="middle" className="text-[10px] font-bold fill-slate-800">{isNeg ? '-1' : '+1'}</text>
  </g>
  );
  curX += 28;
  if (curX > startX + 40) { curX = startX - 30; curY -= 28; }
 }
 return items;
 };

 // Formula State
 const [fStep, setFStep] = useState(0);
 const formulaSteps = [
 { text: "C = (F - 32) × 5/9", hint: "What's the best first step to isolate F?" },
 { text: "9C = (F - 32) × 5", hint: "Good! We multiplied by 9. Now what?" },
 { text: "9C / 5 = F - 32", hint: "Great, we divided by 5. Just one step left!" },
 { text: "9C / 5 + 32 = F", hint: "Solved! F is now the subject of the formula." }
 ];

 const handleFormulaAction = (action: string) => {
 if (fStep === 0 && action === 'mult9') setFStep(1);
 else if (fStep === 1 && action === 'div5') setFStep(2);
 else if (fStep === 2 && action === 'add32') setFStep(3);
 else alert("That operation doesn't help right now, or might make it more complex! Try something else.");
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] font-sans select-none overflow-hidden">
  {/* Header */}
  <div className="flex items-center p-4 border-b border-slate-200 dark:border-[#1c1b1b] shadow-sm z-10">
  <button onClick={onExit} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4">
   <ArrowLeft className="w-6 h-6" />
  </button>
  <h1 className="text-2xl font-bold">Unit 8: Linear Equations & Formulas</h1>
  </div>

  {/* Main Content */}
  <div className="flex flex-1 overflow-hidden">
  {/* Left Column: Controls */}
  <div className="w-1/3 p-6 border-r border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex flex-col gap-6">
   <div className="flex space-x-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
   <button 
    className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'balance' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-600/50'}`}
    onClick={() => setActiveTab('balance')}
   >
    <Scale className="w-4 h-4" /> Balance Scale
   </button>
   <button 
    className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'formula' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-600/50'}`}
    onClick={() => setActiveTab('formula')}
   >
    <Calculator className="w-4 h-4" /> Formulas
   </button>
   </div>

   {activeTab === 'balance' && (
   <div className="space-y-6">
    <div>
    <h2 className="text-xl font-bold">Solve for x</h2>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mt-1">
     Keep the equation balanced! Do the same operation to both sides until you isolate <span className="font-bold">x</span>.
    </p>
    </div>

    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 text-center">
    <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
     {formatEq(eq.lx, eq.lc)} = {formatEq(eq.rx, eq.rc)}
    </div>
    </div>

    {isSolved ? (
    <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-4 rounded-lg flex items-center gap-3 font-bold text-lg border border-green-200 dark:border-green-800">
     <CheckCircle2 className="w-6 h-6" />
     Equation Solved!
    </div>
    ) : (
    <div className="space-y-4">
     <div className="grid grid-cols-2 gap-3">
     <button onClick={() => applyOp('addC')} className="py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded font-medium border border-slate-300 dark:border-[#1c1b1b] transition-colors">+ Add 1</button>
     <button onClick={() => applyOp('subC')} className="py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded font-medium border border-slate-300 dark:border-[#1c1b1b] transition-colors">- Subtract 1</button>
     <button onClick={() => applyOp('addX')} className="py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded font-medium border border-slate-300 dark:border-[#1c1b1b] transition-colors">+ Add x</button>
     <button onClick={() => applyOp('subX')} className="py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded font-medium border border-slate-300 dark:border-[#1c1b1b] transition-colors">- Subtract x</button>
     </div>
     
     <div className="grid grid-cols-2 gap-3">
     <button onClick={() => handleDivide(2)} className="py-2 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded font-medium border border-blue-300 dark:border-blue-700 transition-colors">÷ Divide by 2</button>
     <button onClick={() => handleDivide(3)} className="py-2 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded font-medium border border-blue-300 dark:border-blue-700 transition-colors">÷ Divide by 3</button>
     </div>

     {divError && <div className="text-red-500 dark:text-red-400 text-sm font-medium">{divError}</div>}
    </div>
    )}

    <button 
    onClick={resetBalance}
    className="flex items-center justify-center gap-2 w-full py-2 mt-4 text-slate-600 dark:text-[#71717a] hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
    >
    <RefreshCcw className="w-4 h-4" /> Reset Equation
    </button>
   </div>
   )}

   {activeTab === 'formula' && (
   <div className="space-y-6">
    <div>
    <h2 className="text-xl font-bold">Literal Formulas</h2>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mt-1">
     Rearrange the temperature conversion formula to make <b>F</b> the subject.
    </p>
    </div>

    <div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-lg text-center shadow-inner border border-slate-200 dark:border-[#1c1b1b]">
    <div className="text-xl font-mono font-bold text-indigo-700 dark:text-indigo-300">
     {formulaSteps[fStep].text}
    </div>
    </div>
    
    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50">
    💡 Hint: {formulaSteps[fStep].hint}
    </div>

    {fStep < 3 ? (
    <div className="space-y-3">
     <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Choose an operation:</h3>
     <button onClick={() => handleFormulaAction('mult9')} className="w-full py-2 px-4 border border-slate-300 dark:border-[#1c1b1b] rounded-lg hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-left font-medium transition-colors">
     Multiply both sides by 9
     </button>
     <button onClick={() => handleFormulaAction('div5')} className="w-full py-2 px-4 border border-slate-300 dark:border-[#1c1b1b] rounded-lg hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-left font-medium transition-colors">
     Divide both sides by 5
     </button>
     <button onClick={() => handleFormulaAction('add32')} className="w-full py-2 px-4 border border-slate-300 dark:border-[#1c1b1b] rounded-lg hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-left font-medium transition-colors">
     Add 32 to both sides
     </button>
     <button onClick={() => handleFormulaAction('mult5')} className="w-full py-2 px-4 border border-slate-300 dark:border-[#1c1b1b] rounded-lg hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-left font-medium transition-colors">
     Multiply both sides by 5
     </button>
    </div>
    ) : (
    <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-4 rounded-lg flex items-center gap-3 font-bold text-lg mt-4 border border-green-200 dark:border-green-800">
     <CheckCircle2 className="w-6 h-6" />
     Formula Rearranged!
    </div>
    )}
    
    <button 
    onClick={() => setFStep(0)}
    className="flex items-center justify-center gap-2 w-full py-2 mt-4 text-slate-600 dark:text-[#71717a] hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
    >
    <RefreshCcw className="w-4 h-4" /> Start Over
    </button>
   </div>
   )}
  </div>

  {/* Right Column: Stage */}
  <div className="w-2/3 p-6 bg-slate-200 dark:bg-slate-950 flex items-center justify-center">
   {activeTab === 'balance' && (
   <svg width="400" height="400" className="overflow-visible bg-white dark:!bg-[#121212] rounded-xl shadow-lg">
    <g transform="translate(0, 20)">
    {/* Fulcrum Base */}
    <polygon points="200,300 160,360 240,360" className="fill-slate-700 dark:fill-slate-400" />
    <path d="M 160 360 Q 200 370 240 360" className="fill-slate-800 dark:fill-slate-300" />
    
    {/* Balance Beam (Always level in this ideal visualization) */}
    <rect x="50" y="230" width="300" height="8" rx="4" className="fill-slate-600 dark:fill-slate-500" />
    <circle cx="200" cy="234" r="6" className="fill-slate-300 dark:fill-slate-700 stroke-2 stroke-slate-500" />

    {/* Left Pan */}
    <line x1="80" y1="230" x2="80" y2="310" className="stroke-slate-400 dark:stroke-slate-600 stroke-2" />
    <rect x="30" y="310" width="100" height="6" rx="2" className="fill-slate-500 dark:fill-slate-400" />
    {drawItems(eq.lx, eq.lc, 80, 300)}

    {/* Right Pan */}
    <line x1="320" y1="230" x2="320" y2="310" className="stroke-slate-400 dark:stroke-slate-600 stroke-2" />
    <rect x="270" y="310" width="100" height="6" rx="2" className="fill-slate-500 dark:fill-slate-400" />
    {drawItems(eq.rx, eq.rc, 320, 300)}
    </g>
   </svg>
   )}

   {activeTab === 'formula' && (
   <div className="text-center w-full max-w-lg bg-white dark:!bg-[#121212] p-12 rounded-xl shadow-lg border border-slate-200 dark:border-[#1c1b1b]">
    <div className="text-[100px] mb-6">🌡️</div>
    <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-[#ffffff]">Celsius to Fahrenheit</h3>
    <p className="text-slate-600 dark:text-[#71717a] leading-relaxed">
    Rearranging formulas is just like solving equations! We do the same operations on both sides of the equal sign to isolate the variable we want.
    </p>
   </div>
   )}
  </div>
  </div>
 </div>
 );
}
