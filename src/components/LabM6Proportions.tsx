import { useState, useEffect } from 'react';
import { ArrowLeft, Car, Briefcase, PieChart, CheckCircle2, XCircle, RefreshCw, Info } from 'lucide-react';

export default function LabM6Proportions({ onExit }: { onExit?: () => void }) {
 const [activeTab, setActiveTab] = useState<'rate' | 'ratio' | 'percentage'>('rate');

 // --- Rate State ---
 const [distance, setDistance] = useState(250);
 const [fuel, setFuel] = useState(25);
 const [rateAnswer, setRateAnswer] = useState('');
 const [rateFeedback, setRateFeedback] = useState<boolean | null>(null);

 // --- Ratio State ---
 const [profit, setProfit] = useState(1000);
 const [ratioA, setRatioA] = useState(3);
 const [ratioB, setRatioB] = useState(2);
 const [shareA, setShareA] = useState('');
 const [shareB, setShareB] = useState('');
 const [ratioFeedback, setRatioFeedback] = useState<boolean | null>(null);

 // --- Percentage State ---
 const [budget, setBudget] = useState(2000);
 const [needsPct, setNeedsPct] = useState(50);
 const [wantsPct, setWantsPct] = useState(30);
 const [savingsPct, setSavingsPct] = useState(20);
 const [percQuestion, setPercQuestion] = useState(0);
 const [percAnswer, setPercAnswer] = useState('');
 const [percFeedback, setPercFeedback] = useState<boolean | null>(null);

 const generateRateProblem = () => {
 const f = Math.floor(Math.random() * 30 + 10);
 const r = Math.floor(Math.random() * 10 + 5); 
 setFuel(f);
 setDistance(f * r);
 setRateAnswer('');
 setRateFeedback(null);
 };

 const generateRatioProblem = () => {
 const p = Math.floor(Math.random() * 50 + 10) * 100;
 const ra = Math.floor(Math.random() * 5 + 1);
 const rb = Math.floor(Math.random() * 5 + 1);
 setProfit(p);
 setRatioA(ra);
 setRatioB(rb);
 setShareA('');
 setShareB('');
 setRatioFeedback(null);
 };

 const generatePercentageProblem = () => {
 const b = Math.floor(Math.random() * 40 + 10) * 100;
 setBudget(b);
 setNeedsPct(50);
 setWantsPct(30);
 setSavingsPct(20);
 setPercQuestion(Math.floor(Math.random() * 3)); 
 setPercAnswer('');
 setPercFeedback(null);
 };

 const checkRate = () => {
 const correct = distance / fuel;
 setRateFeedback(Math.abs(parseFloat(rateAnswer) - correct) < 0.1);
 };

 const checkRatio = () => {
 const totalParts = ratioA + ratioB;
 const partValue = profit / totalParts;
 const correctA = partValue * ratioA;
 const correctB = partValue * ratioB;
 setRatioFeedback(Math.abs(parseFloat(shareA) - correctA) < 0.1 && Math.abs(parseFloat(shareB) - correctB) < 0.1);
 };

 const checkPercentage = () => {
 let targetPct = needsPct;
 if (percQuestion === 1) targetPct = wantsPct;
 if (percQuestion === 2) targetPct = savingsPct;
 const correct = (targetPct / 100) * budget;
 setPercFeedback(Math.abs(parseFloat(percAnswer) - correct) < 0.1);
 };

 useEffect(() => {
 if (needsPct + wantsPct + savingsPct !== 100) {
  const diff = 100 - (needsPct + wantsPct);
  setSavingsPct(Math.max(0, diff));
 }
 }, [needsPct, wantsPct, savingsPct]);

 return (
 <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] font-sans select-none">
  {/* Header */}
  <div className="flex items-center justify-between p-4 shadow-sm z-10 shrink-0 border-b border-slate-200 dark:border-[#1c1b1b]">
  <div className="flex items-center gap-4">
   <button onClick={onExit} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors" title="Go Back">
   <ArrowLeft className="w-6 h-6" />
   </button>
   <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Unit 3: Proportions Engine</h1>
  </div>
  <div className="flex gap-2 bg-slate-100 dark:bg-[#121212] p-1 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
   <button onClick={() => setActiveTab('rate')} className={`px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-all ${activeTab === 'rate' ? ' shadow text-indigo-600 dark:text-indigo-400' : 'hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
   <Car className="w-4 h-4" /> Rate
   </button>
   <button onClick={() => setActiveTab('ratio')} className={`px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-all ${activeTab === 'ratio' ? ' shadow text-indigo-600 dark:text-indigo-400' : 'hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
   <Briefcase className="w-4 h-4" /> Ratio
   </button>
   <button onClick={() => setActiveTab('percentage')} className={`px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-all ${activeTab === 'percentage' ? ' shadow text-emerald-600 dark:text-emerald-400' : 'hover:text-emerald-600 dark:hover:text-emerald-400'}`}>
   <PieChart className="w-4 h-4" /> Percent
   </button>
  </div>
  </div>

  <div className="flex flex-1 overflow-hidden">
  {/* Left Column: Controls & Questions */}
  <div className="w-full max-w-md p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6 shrink-0 shadow-lg z-0 relative">
   
   {activeTab === 'rate' && (
   <div className="animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col gap-6">
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 text-blue-900 dark:text-blue-100">
    <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-400">
     <Info className="w-5 h-5" /> Fuel Efficiency
    </h2>
    <p className="text-sm">Rate is a ratio that compares two different quantities. Fuel efficiency is the distance a vehicle can travel per unit of fuel.</p>
    </div>

    <div className="flex flex-col gap-4 bg-slate-50 dark:bg-[#121212]/50 p-5 rounded-2xl border border-slate-100 dark:border-[#1c1b1b]/50">
    <h3 className="font-bold text-slate-700 dark:text-[#a1a1aa]">Mission Setup</h3>
    <div className="flex justify-between items-center text-sm p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
     <span className="text-slate-500 dark:text-[#71717a]">Distance Traveled:</span>
     <span className="font-bold text-lg text-slate-700 dark:text-[#ffffff]">{distance} km</span>
    </div>
    <div className="flex justify-between items-center text-sm p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
     <span className="text-slate-500 dark:text-[#71717a]">Fuel Consumed:</span>
     <span className="font-bold text-lg text-slate-700 dark:text-[#ffffff]">{fuel} L</span>
    </div>
    <button onClick={generateRateProblem} className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-[#ffffff] rounded-xl transition-colors font-semibold">
     <RefreshCw className="w-4 h-4" /> Generate New Trip
    </button>
    </div>

    <div className="flex flex-col gap-4 bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
    <h3 className="font-bold text-indigo-900 dark:text-indigo-100">Calculate Rate</h3>
    <p className="text-sm text-indigo-700 dark:text-indigo-300">What is the fuel efficiency of the car in kilometers per liter (km/L)?</p>
    <div className="flex gap-3 items-center mt-2">
     <input
     type="number"
     value={rateAnswer}
     onChange={(e) => setRateAnswer(e.target.value)}
     placeholder="e.g. 15"
     className="flex-1 min-w-0 px-4 py-3 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:!bg-[#121212] focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 font-bold text-lg shadow-sm transition-colors text-slate-800 dark:text-[#ffffff]"
     />
     <span className="font-bold text-indigo-600 dark:text-indigo-400">km/L</span>
    </div>
    <button onClick={checkRate} className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98] dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
     Check Answer
    </button>
    {rateFeedback !== null && (
     <div className={`mt-2 flex items-center gap-3 p-4 rounded-xl font-medium animate-in slide-in-from-bottom-2 ${rateFeedback ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
     {rateFeedback ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
     <span>{rateFeedback ? 'Correct! Excellent calculation.' : 'Incorrect. Hint: Distance ÷ Fuel'}</span>
     </div>
    )}
    </div>
   </div>
   )}

   {activeTab === 'ratio' && (
    <div className="animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col gap-6">
    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 text-indigo-900 dark:text-indigo-100">
    <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
     <Info className="w-5 h-5" /> Profit Distribution
    </h2>
    <p className="text-sm">A ratio shows the relative sizes of two or more values. In business, profits are often distributed according to the ratio of investments.</p>
    </div>

    <div className="flex flex-col gap-4 bg-slate-50 dark:bg-[#121212]/50 p-5 rounded-2xl border border-slate-100 dark:border-[#1c1b1b]/50">
    <h3 className="font-bold text-slate-700 dark:text-[#a1a1aa]">Business Scenario</h3>
    <div className="flex justify-between items-center text-sm p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
     <span className="text-slate-500 dark:text-[#71717a]">Total Profit:</span>
     <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">${profit}</span>
    </div>
    <div className="flex justify-between items-center text-sm p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
     <span className="text-slate-500 dark:text-[#71717a]">Investment Ratio (A : B):</span>
     <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{ratioA} : {ratioB}</span>
    </div>
    <button onClick={generateRatioProblem} className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-[#ffffff] rounded-xl transition-colors font-semibold">
     <RefreshCw className="w-4 h-4" /> Generate New Scenario
    </button>
    </div>

    <div className="flex flex-col gap-4 bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
    <h3 className="font-bold text-indigo-900 dark:text-indigo-100">Distribute Profit</h3>
    <p className="text-sm text-indigo-700 dark:text-indigo-300">How much profit does each partner get?</p>
    
    <div className="flex flex-col gap-3 mt-2">
     <div className="flex gap-3 items-center">
     <span className="font-bold text-sm w-20 text-slate-700 dark:text-[#a1a1aa]">Partner A:</span>
     <div className="relative flex-1">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
      <input type="number" value={shareA} onChange={(e) => setShareA(e.target.value)} className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:!bg-[#121212] focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 font-bold text-lg shadow-sm transition-colors text-slate-800 dark:text-[#ffffff]" />
     </div>
     </div>
     <div className="flex gap-3 items-center">
     <span className="font-bold text-sm w-20 text-slate-700 dark:text-[#a1a1aa]">Partner B:</span>
     <div className="relative flex-1">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
      <input type="number" value={shareB} onChange={(e) => setShareB(e.target.value)} className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:!bg-[#121212] focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 font-bold text-lg shadow-sm transition-colors text-slate-800 dark:text-[#ffffff]" />
     </div>
     </div>
    </div>

    <button onClick={checkRatio} className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98] dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
     Check Distribution
    </button>
    
    {ratioFeedback !== null && (
     <div className={`mt-2 flex items-center gap-3 p-4 rounded-xl font-medium animate-in slide-in-from-bottom-2 ${ratioFeedback ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
     {ratioFeedback ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
     <span>{ratioFeedback ? 'Correct! Fairly distributed.' : 'Incorrect. Check total parts!'}</span>
     </div>
    )}
    </div>
   </div>
   )}

   {activeTab === 'percentage' && (
   <div className="animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col gap-6">
    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-100">
    <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
     <Info className="w-5 h-5" /> Percentage Budgeting
    </h2>
    <p className="text-sm">A percentage is a ratio expressed as a fraction of 100. Let's allocate a monthly budget.</p>
    </div>

    <div className="flex flex-col gap-5 bg-slate-50 dark:bg-[#121212]/50 p-5 rounded-2xl border border-slate-100 dark:border-[#1c1b1b]/50">
    <div className="flex justify-between items-center bg-white dark:!bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] shadow-sm">
     <h3 className="font-bold text-slate-700 dark:text-[#a1a1aa]">Total Budget:</h3>
     <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${budget}</span>
    </div>
    
    <div className="flex flex-col gap-4 mt-2">
     <div className="flex flex-col gap-2">
     <label className="text-sm font-bold flex justify-between text-slate-700 dark:text-[#a1a1aa]">
      <span>Needs ({needsPct}%)</span>
     </label>
     <input type="range" min="0" max="100" value={needsPct} onChange={(e) => setNeedsPct(parseInt(e.target.value))} className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
     </div>
     
     <div className="flex flex-col gap-2">
     <label className="text-sm font-bold flex justify-between text-slate-700 dark:text-[#a1a1aa]">
      <span>Wants ({wantsPct}%)</span>
     </label>
     <input type="range" min="0" max={100 - needsPct} value={wantsPct} onChange={(e) => setWantsPct(parseInt(e.target.value))} className="w-full accent-emerald-400 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
     </div>

     <div className="flex flex-col gap-2">
     <label className="text-sm font-bold flex justify-between text-slate-700 dark:text-[#a1a1aa]">
      <span>Savings ({savingsPct}%)</span>
     </label>
     <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${savingsPct}%` }}></div>
     </div>
     </div>
    </div>

    <button onClick={generatePercentageProblem} className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-[#ffffff] rounded-xl transition-colors font-semibold">
     <RefreshCw className="w-4 h-4" /> Generate New Budget
    </button>
    </div>

    <div className="flex flex-col gap-4 bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
    <h3 className="font-bold text-emerald-900 dark:text-emerald-100">Calculate Amount</h3>
    <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
     Based on the slider percentages above, exactly how much money is allocated to 
     <strong className="text-emerald-900 dark:text-emerald-100 bg-emerald-200 dark:bg-emerald-800 px-2 py-0.5 rounded mx-1">
     {percQuestion === 0 ? 'Needs' : percQuestion === 1 ? 'Wants' : 'Savings'}
     </strong>?
    </p>
    <div className="relative flex-1 mt-2">
     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
     <input type="number" value={percAnswer} onChange={(e) => setPercAnswer(e.target.value)} className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-emerald-200 dark:border-emerald-700 bg-white dark:!bg-[#121212] focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 font-bold text-lg shadow-sm transition-colors text-slate-800 dark:text-[#ffffff]" />
    </div>
    
    <button onClick={checkPercentage} className="w-full py-3 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98] dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
     Check Amount
    </button>
    
    {percFeedback !== null && (
     <div className={`mt-2 flex items-center gap-3 p-4 rounded-xl font-medium animate-in slide-in-from-bottom-2 ${percFeedback ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
     {percFeedback ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
     <span>{percFeedback ? 'Correct! Accurate budgeting.' : 'Incorrect. Calculate: (Percent ÷ 100) × Budget'}</span>
     </div>
    )}
    </div>
   </div>
   )}

  </div>

  {/* Right Column: Simulation Stage */}
  <div className="flex-1 min-w-0 p-8 bg-slate-100/50 dark:bg-slate-950 flex flex-col items-center justify-center relative lg:overflow-y-auto">
   
   {activeTab === 'rate' && (
   <div className="animate-in zoom-in-95 duration-500 w-full max-w-2xl bg-white dark:!bg-[#121212] rounded-3xl p-10 shadow-2xl border border-slate-200 dark:border-neutral-900 flex flex-col items-center relative overflow-hidden">
    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
    <h3 className="text-2xl font-black mb-12 text-slate-800 dark:text-[#ffffff]">Trip Visualizer</h3>
    
    <div className="relative w-full h-32 bg-slate-50 dark:bg-[#121212]/50 rounded-2xl mb-16 flex items-center p-4 border-2 border-slate-100 dark:border-[#1c1b1b]/50">
     <div className="absolute left-6 right-6 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
     <div className="h-full bg-slate-300 dark:bg-slate-600 border-b border-dashed border-slate-400 dark:border-[#1c1b1b]" style={{backgroundSize: '20px 20px'}} />
     </div>
     
     <div className="absolute transition-all duration-1000 ease-out z-10" style={{ left: `${Math.min(90, Math.max(10, (distance / 400) * 100))}%`, transform: 'translateX(-50%)' }}>
     <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl relative border border-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
      <Car className="w-8 h-8" />
      <div className="absolute -bottom-3 left-1/2 w-6 h-6 bg-indigo-600 transform -translate-x-1/2 rotate-45 border-r border-b border-indigo-500" />
     </div>
     <div className="mt-6 text-center font-black text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50 px-3 py-1.5 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-800 whitespace-nowrap">
      {distance} km
     </div>
     </div>
    </div>

    <div className="flex justify-between w-full max-w-md items-center bg-slate-50 dark:bg-[#121212]/50 p-6 rounded-2xl border border-slate-100 dark:border-[#1c1b1b]/50">
    <div className="flex flex-col items-center gap-3">
     <div className="w-16 h-32 rounded-xl relative overflow-hidden border-4 border-slate-200 dark:border-[#1c1b1b] shadow-inner">
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-1000 ease-in-out" style={{ height: `${(fuel / 40) * 100}%` }} />
      {/* Measurement lines */}
      {[25, 50, 75].map(pct => (
      <div key={pct} className="absolute w-4 h-[2px] bg-slate-300 dark:bg-slate-600 left-0" style={{ bottom: `${pct}%` }} />
      ))}
     </div>
     <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold px-3 py-1 rounded-lg">
     {fuel} L
     </div>
    </div>
    
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
     <div className="text-sm font-bold text-slate-500 dark:text-[#71717a] mb-1 tracking-wider uppercase">Efficiency</div>
     <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 flex items-baseline gap-1">
      {rateFeedback ? (distance / fuel).toFixed(1) : '?'}
      <span className="text-lg font-bold text-slate-400 dark:text-[#71717a]">km/L</span>
     </div>
    </div>
    </div>
   </div>
   )}

   {activeTab === 'ratio' && (
   <div className="animate-in zoom-in-95 duration-500 w-full max-w-2xl bg-white dark:!bg-[#121212] rounded-3xl p-10 shadow-2xl border border-slate-200 dark:border-neutral-900 flex flex-col items-center relative overflow-hidden">
    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 to-pink-500" />
    <h3 className="text-2xl font-black mb-12 text-slate-800 dark:text-[#ffffff]">Profit Split</h3>
    
    <div className="flex items-end justify-between gap-8 w-full max-w-lg h-72 border-b-4 border-slate-200 dark:border-[#1c1b1b] pb-6 relative">
    
    {/* Total Profit Float */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 px-6 py-3 rounded-2xl shadow-sm">
     <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Total Pool</div>
     <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">${profit}</div>
    </div>

    <div className="flex flex-col items-center gap-4 w-1/3">
     <span className="font-black text-xl text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 rounded-lg whitespace-nowrap">Partner A</span>
     <div className="flex flex-wrap gap-1.5 justify-center content-end h-40">
     {Array.from({ length: ratioA }).map((_, i) => (
      <div key={`a-${i}`} className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-neutral-900 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}>
      <Briefcase className="w-4 h-4 text-white opacity-80" />
      </div>
     ))}
     </div>
     <div className="bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] px-5 py-3 rounded-xl font-black text-xl text-slate-800 dark:text-[#ffffff] shadow-inner min-w-[120px] text-center">
     {ratioFeedback ? `$${(profit / (ratioA + ratioB) * ratioA).toFixed(0)}` : `${ratioA} parts`}
     </div>
    </div>

    <div className="flex flex-col items-center justify-end h-full pb-8">
     <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-[#121212] border-2 border-slate-200 dark:border-[#1c1b1b] flex items-center justify-center text-3xl font-black text-slate-400 dark:text-[#71717a] shadow-sm">
     :
     </div>
    </div>

    <div className="flex flex-col items-center gap-4 w-1/3">
     <span className="font-black text-xl text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-4 py-1.5 rounded-lg whitespace-nowrap">Partner B</span>
     <div className="flex flex-wrap gap-1.5 justify-center content-end h-40">
     {Array.from({ length: ratioB }).map((_, i) => (
      <div key={`b-${i}`} className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-neutral-900 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}>
      <Briefcase className="w-4 h-4 text-white opacity-80" />
      </div>
     ))}
     </div>
     <div className="bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] px-5 py-3 rounded-xl font-black text-xl text-slate-800 dark:text-[#ffffff] shadow-inner min-w-[120px] text-center">
     {ratioFeedback ? `$${(profit / (ratioA + ratioB) * ratioB).toFixed(0)}` : `${ratioB} parts`}
     </div>
    </div>

    </div>
   </div>
   )}

   {activeTab === 'percentage' && (
   <div className="animate-in zoom-in-95 duration-500 w-full max-w-2xl bg-white dark:!bg-[#121212] rounded-3xl p-10 shadow-2xl border border-slate-200 dark:border-neutral-900 flex flex-col items-center relative overflow-hidden">
    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
    <h3 className="text-2xl font-black mb-12 text-slate-800 dark:text-[#ffffff]">Budget Chart</h3>
    
    <div className="relative w-72 h-72 rounded-full flex items-center justify-center shadow-2xl overflow-hidden border-[8px] border-white dark:border-neutral-900 ring-4 ring-slate-100 dark:ring-slate-700 transition-all duration-700"
     style={{
      background: `conic-gradient(
      #10b981 0% ${needsPct}%, 
      #34d399 ${needsPct}% ${needsPct + wantsPct}%, 
      #6ee7b7 ${needsPct + wantsPct}% 100%
      )`
     }}
    >
     <div className="w-56 h-56 rounded-full flex flex-col items-center justify-center shadow-inner z-10 border-4 border-slate-50 dark:border-neutral-900/50">
     <span className="text-sm font-bold text-slate-400 dark:text-[#71717a] uppercase tracking-widest mb-1">Total</span>
     <span className="text-4xl font-black text-slate-800 dark:text-[#ffffff]">${budget}</span>
     </div>
     
     {/* Decorative overlay for 3D effect */}
     <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
    </div>

    <div className="flex gap-6 mt-12 w-full justify-center bg-slate-50 dark:bg-[#121212]/50 py-4 px-6 rounded-2xl border border-slate-100 dark:border-[#1c1b1b]/50">
     <div className="flex flex-col items-center gap-2">
     <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-emerald-500 rounded-md shadow-sm border border-emerald-600" />
      <span className="font-bold text-slate-700 dark:text-[#a1a1aa]">Needs</span>
     </div>
     <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{needsPct}%</span>
     <span className="text-xs font-bold text-slate-400">${(budget * needsPct / 100).toFixed(0)}</span>
     </div>
     
     <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
     
     <div className="flex flex-col items-center gap-2">
     <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-emerald-400 rounded-md shadow-sm border border-emerald-500" />
      <span className="font-bold text-slate-700 dark:text-[#a1a1aa]">Wants</span>
     </div>
     <span className="text-sm font-black text-emerald-500 dark:text-emerald-300">{wantsPct}%</span>
     <span className="text-xs font-bold text-slate-400">${(budget * wantsPct / 100).toFixed(0)}</span>
     </div>
     
     <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
     
     <div className="flex flex-col items-center gap-2">
     <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-emerald-300 rounded-md shadow-sm border border-emerald-400" />
      <span className="font-bold text-slate-700 dark:text-[#a1a1aa]">Savings</span>
     </div>
     <span className="text-sm font-black text-emerald-400 dark:text-emerald-200">{savingsPct}%</span>
     <span className="text-xs font-bold text-slate-400">${(budget * savingsPct / 100).toFixed(0)}</span>
     </div>
    </div>

   </div>
   )}

  </div>
  </div>
 </div>
 );
}
