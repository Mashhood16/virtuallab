import { useState, useEffect } from 'react';
import { ArrowLeft, Thermometer, Mountain, Users, Calculator, Check, RefreshCw } from 'lucide-react';

export default function LabM7RationalSquares({ onExit }: { onExit?: () => void }) {
 const [activeTab, setActiveTab] = useState<'rational' | 'squares'>('rational');

 // Rational Numbers State
 const [temperature, setTemperature] = useState(0);
 const [altitude, setAltitude] = useState(0);
 const [ratQ, setRatQ] = useState({ start: 10, change: -15, type: 'temp', answer: -5 });
 const [ratInput, setRatInput] = useState('');
 const [ratFeedback, setRatFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 // Squares State
 const [soldiers, setSoldiers] = useState(25);
 const [sqQ, setSqQ] = useState({ total: 30, answer: 5 });
 const [sqInput, setSqInput] = useState('');
 const [sqFeedback, setSqFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 const generateRatQ = () => {
 const isTemp = Math.random() > 0.5;
 if (isTemp) {
  const start = Math.floor(Math.random() * 60) - 30;
  const change = Math.floor(Math.random() * 40) - 20;
  setRatQ({ start, change: change === 0 ? 5 : change, type: 'temp', answer: start + (change === 0 ? 5 : change) });
 } else {
  const start = Math.floor(Math.random() * 2000) - 200;
  const change = Math.floor(Math.random() * 1000) - 500;
  setRatQ({ start, change: change === 0 ? 100 : change, type: 'alt', answer: start + (change === 0 ? 100 : change) });
 }
 setRatInput('');
 setRatFeedback('idle');
 };

 const generateSqQ = () => {
 const total = Math.floor(Math.random() * 80) + 10;
 const root = Math.floor(Math.sqrt(total));
 const leftOut = total - (root * root);
 setSqQ({ total, answer: leftOut });
 setSqInput('');
 setSqFeedback('idle');
 setSoldiers(total);
 };

 useEffect(() => {
 generateRatQ();
 generateSqQ();
 }, []);

 const checkRatAnswer = () => {
 if (parseInt(ratInput) === ratQ.answer) setRatFeedback('correct');
 else setRatFeedback('incorrect');
 };

 const checkSqAnswer = () => {
 if (parseInt(sqInput) === sqQ.answer) setSqFeedback('correct');
 else setSqFeedback('incorrect');
 };

 const renderSoldiers = () => {
 const root = Math.floor(Math.sqrt(soldiers));
 const remainder = soldiers - (root * root);
 const dots = [];
 let index = 0;
 
 const dotSize = soldiers > 50 ? 6 : 10;
 const spacing = soldiers > 50 ? 16 : 24;
 
 const squareWidth = root * spacing;
 const startX = 200 - squareWidth / 2;
 const startY = 150 - squareWidth / 2;
 
 // Perfect square formation
 for (let r = 0; r < root; r++) {
  for (let c = 0; c < root; c++) {
  dots.push(
   <circle 
   key={index++} 
   cx={startX + c * spacing} 
   cy={startY + r * spacing} 
   r={dotSize} 
   className="fill-blue-600 dark:fill-blue-400" 
   />
  );
  }
 }
 
 // Remaining soldiers
 let remR = root + 1;
 let remC = 0;
 for (let i = 0; i < remainder; i++) {
  dots.push(
  <circle 
   key={index++} 
   cx={startX + remC * spacing} 
   cy={startY + remR * spacing} 
   r={dotSize} 
   className="fill-orange-500 dark:fill-orange-400" 
  />
  );
  remC++;
  if (remC >= root) {
  remC = 0;
  remR++;
  }
 }
 
 return dots;
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] font-sans select-none">
  {/* Header */}
  <header className="flex items-center p-4 shadow-sm z-20 shrink-0">
  {onExit && (
   <button onClick={onExit} className="mr-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-600 dark:text-[#a1a1aa]">
   <ArrowLeft className="w-6 h-6" />
   </button>
  )}
  <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">Class 7 Labs: Rational Numbers & Perfect Squares</h1>
  </header>
  
  {/* Main Content */}
  <main className="flex-1 min-w-0 flex lg:overflow-hidden">
  {/* Left Column: Controls & Workspace */}
  <div className="w-[400px] lg:w-[450px] flex flex-col border-r border-slate-200 dark:border-[#1c1b1b] p-6 lg:overflow-y-auto z-10 shadow-[2px_0_10px_rgba(0,0,0,0.05)]">
   {/* Tabs */}
   <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1 mb-6 shrink-0">
   <button 
    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${activeTab === 'rational' ? ' text-blue-600 dark:text-blue-400 shadow' : 'text-slate-600 dark:text-[#ffffff] hover:text-slate-800 dark:hover:text-white'}`}
    onClick={() => setActiveTab('rational')}
   >
    Rational Numbers
   </button>
   <button 
    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${activeTab === 'squares' ? ' text-blue-600 dark:text-blue-400 shadow' : 'text-slate-600 dark:text-[#ffffff] hover:text-slate-800 dark:hover:text-white'}`}
    onClick={() => setActiveTab('squares')}
   >
    Perfect Squares
   </button>
   </div>

   {activeTab === 'rational' && (
   <div className="space-y-6 flex-1 pr-2">
    <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
     <Thermometer className="w-5 h-5 text-red-500" /> Temperature Control
    </h3>
    <input type="range" min="-50" max="50" value={temperature} onChange={(e) => setTemperature(parseInt(e.target.value))} className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer" />
    <div className="flex justify-between text-sm mt-2 font-medium text-slate-600 dark:text-[#71717a]">
     <span>-50°C</span>
     <span className="text-blue-600 dark:text-blue-400 font-bold">{temperature}°C</span>
     <span>50°C</span>
    </div>
    </div>

    <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
     <Mountain className="w-5 h-5 text-emerald-500" /> Altitude Control
    </h3>
    <input type="range" min="-500" max="5000" step="100" value={altitude} onChange={(e) => setAltitude(parseInt(e.target.value))} className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer" />
    <div className="flex justify-between text-sm mt-2 font-medium text-slate-600 dark:text-[#71717a]">
     <span>-500m</span>
     <span className="text-emerald-600 dark:text-emerald-400 font-bold">{altitude}m</span>
     <span>5000m</span>
    </div>
    </div>

    {/* Question Box */}
    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
    <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
     <Calculator className="w-5 h-5" /> Calculate
    </h3>
    <p className="text-slate-700 dark:text-[#a1a1aa] mb-4 font-medium leading-relaxed">
     {ratQ.type === 'temp' ? 
     `The temperature is ${ratQ.start}°C. It ${ratQ.change > 0 ? 'rises' : 'drops'} by ${Math.abs(ratQ.change)}°C. What is the new temperature?` : 
     `An object is at ${ratQ.start}m altitude. It moves ${ratQ.change > 0 ? 'up' : 'down'} by ${Math.abs(ratQ.change)}m. What is its new altitude?`
     }
    </p>
    <div className="flex flex-wrap gap-2">
     <input 
     type="number" 
     value={ratInput} 
     onChange={(e) => setRatInput(e.target.value)}
     className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg px-4 py-2 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
     placeholder="Your answer..."
     />
     <button onClick={checkRatAnswer} className="whitespace-nowrap flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
     <Check className="w-5 h-5" /> Check
     </button>
    </div>
    {ratFeedback !== 'idle' && (
     <div className={`mt-3 p-3 rounded-lg font-bold flex items-center justify-between ${ratFeedback === 'correct' ? 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-400'}`}>
     <span>{ratFeedback === 'correct' ? 'Correct! Well done.' : 'Incorrect. Try again using the sliders!'}</span>
     {ratFeedback === 'correct' && (
      <button onClick={generateRatQ} className="p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-md transition-colors" title="Next Question">
      <RefreshCw className="w-5 h-5" />
      </button>
     )}
     </div>
    )}
    </div>
   </div>
   )}

   {activeTab === 'squares' && (
   <div className="space-y-6 flex-1 pr-2">
    <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
     <Users className="w-5 h-5 text-blue-500" /> Soldier Formation
    </h3>
    <input type="range" min="1" max="100" value={soldiers} onChange={(e) => setSoldiers(parseInt(e.target.value))} className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer" />
    <div className="flex justify-between text-sm mt-2 font-medium text-slate-600 dark:text-[#71717a]">
     <span>1</span>
     <span className="text-blue-600 dark:text-blue-400 font-bold">{soldiers} soldiers</span>
     <span>100</span>
    </div>
    </div>

    {/* Question Box */}
    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
    <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
     <Calculator className="w-5 h-5" /> Calculate
    </h3>
    <p className="text-slate-700 dark:text-[#a1a1aa] mb-4 font-medium leading-relaxed">
     A general wants to form a perfect square with <strong className="text-slate-900 dark:text-white">{sqQ.total}</strong> soldiers. How many soldiers will be left out of the largest possible square?
    </p>
    <div className="flex flex-wrap gap-2">
     <input 
     type="number" 
     value={sqInput} 
     onChange={(e) => setSqInput(e.target.value)}
     className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg px-4 py-2 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
     placeholder="Your answer..."
     />
     <button onClick={checkSqAnswer} className="whitespace-nowrap flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
     <Check className="w-5 h-5" /> Check
     </button>
    </div>
    {sqFeedback !== 'idle' && (
     <div className={`mt-3 p-3 rounded-lg font-bold flex items-center justify-between ${sqFeedback === 'correct' ? 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-400'}`}>
     <span>{sqFeedback === 'correct' ? 'Correct! Excellent.' : 'Incorrect. Check the orange dots!'}</span>
     {sqFeedback === 'correct' && (
      <button onClick={generateSqQ} className="p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-md transition-colors" title="Next Question">
      <RefreshCw className="w-5 h-5" />
      </button>
     )}
     </div>
    )}
    </div>
   </div>
   )}
  </div>
  
  {/* Right Column: Simulation Stage */}
  <div className="flex-1 min-w-0 flex items-center justify-center bg-slate-100 dark:bg-[#121212]/50 p-6 lg:overflow-y-auto relative">
   
   {activeTab === 'rational' && (
   <div className="flex w-full max-w-4xl h-full justify-around items-center py-10 gap-8">
    
    {/* Thermometer Display */}
    <div className="flex flex-col items-center h-full max-h-[500px]">
    <h3 className="font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-widest mb-4">Thermometer</h3>
    <svg viewBox="0 0 100 400" className="h-full w-24 drop-shadow-lg bg-white/50 dark:bg-[#121212]/50 rounded-full border border-slate-200 dark:border-[#1c1b1b]">
     <rect x="35" y="20" width="30" height="340" rx="15" className="fill-slate-200 dark:fill-slate-700" />
     <rect 
     x="40" 
     y={180 - (temperature * 3.2)} 
     width="20" 
     height={360 - (180 - (temperature * 3.2))} 
     className={temperature > 0 ? "fill-red-500" : "fill-blue-500"} 
     rx="10" 
     style={{ transition: 'all 0.3s ease' }}
     />
     <circle cx="50" cy="360" r="25" className={temperature > 0 ? "fill-red-500" : "fill-blue-500"} style={{ transition: 'fill 0.3s ease' }} />
     {[50, 25, 0, -25, -50].map(tick => (
     <g key={tick}>
      <line x1="25" y1={180 - (tick * 3.2)} x2="35" y2={180 - (tick * 3.2)} stroke="currentColor" strokeWidth="2" className="text-slate-400 dark:text-[#71717a]" />
      <text x="20" y={180 - (tick * 3.2) + 4} fontSize="12" textAnchor="end" className="fill-slate-600 dark:fill-slate-400 font-bold">{tick}°</text>
     </g>
     ))}
    </svg>
    </div>

    {/* Altitude Display */}
    <div className="flex flex-col items-center h-full max-h-[500px] flex-1">
    <h3 className="font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-widest mb-4">Altitude</h3>
    <svg viewBox="0 0 300 400" className="h-full w-full drop-shadow-md rounded-2xl bg-sky-100 dark:bg-sky-900/40 overflow-hidden relative border border-slate-200 dark:border-[#1c1b1b]">
     <path d="M -50 300 L 150 50 L 350 300 Z" className="fill-slate-400 dark:fill-slate-600" />
     <rect x="0" y="300" width="300" height="100" className="fill-blue-500/80 dark:fill-blue-700/80" />
     <line x1="0" y1="300" x2="300" y2="300" stroke="white" strokeWidth="2" strokeDasharray="5,5" className="opacity-50" />
     
     <circle 
     cx="150" 
     cy={300 - altitude * 0.056} 
     r="10" 
     className={altitude >= 0 ? "fill-red-500 stroke-white stroke-2" : "fill-yellow-400 stroke-slate-800 stroke-2"} 
     style={{ transition: 'all 0.3s ease' }}
     />
     
     {[5000, 2500, 0, -250, -500].map(tick => (
     <text key={tick} x="10" y={300 - tick * 0.056 + 5} fontSize="12" className="fill-slate-800 dark:fill-slate-200 font-bold">
      {tick}m
     </text>
     ))}
     
     <text 
     x="170" 
     y={300 - altitude * 0.056 + 5} 
     fontSize="16" 
     className={`font-black drop-shadow-md ${altitude >= 0 ? "fill-slate-800 dark:fill-white" : "fill-white"}`}
     style={{ transition: 'all 0.3s ease' }}
     >
     {altitude} m
     </text>
    </svg>
    </div>
   </div>
   )}

   {activeTab === 'squares' && (
   <div className="flex flex-col items-center justify-center w-full h-full">
    <h2 className="text-2xl font-bold mb-8 text-slate-700 dark:text-[#a1a1aa]">
     Formation Preview
    </h2>
    <div className="bg-white dark:!bg-[#121212] p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-[#1c1b1b] inline-block">
     <svg width="400" height="400" className="overflow-visible">
     {renderSoldiers()}
     </svg>
    </div>
    <div className="mt-8 flex gap-8">
     <div className="flex items-center gap-3">
     <div className="w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-400 shadow"></div>
     <span className="font-bold text-slate-700 dark:text-[#a1a1aa]">In Perfect Square</span>
     </div>
     <div className="flex items-center gap-3">
     <div className="w-4 h-4 rounded-full bg-orange-500 dark:bg-orange-400 shadow"></div>
     <span className="font-bold text-slate-700 dark:text-[#a1a1aa]">Left Out</span>
     </div>
    </div>
   </div>
   )}
  </div>
  </main>
 </div>
 );
}
