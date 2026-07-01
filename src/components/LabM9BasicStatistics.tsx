import { useState, useEffect, useRef } from 'react';
import { CheckCircle, Calculator, RefreshCcw, Factory, HelpCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabM9BasicStatistics({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [totalGood, setTotalGood] = useState<number>(0);
 const [totalFaulty, setTotalFaulty] = useState<number>(0);
 
 const [targetProd, setTargetProd] = useState<number>(1000);
 const [userAns, setUserAns] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const trueDefectRate = useRef<number>(0);
 
 useEffect(() => {
 trueDefectRate.current = 0.05 + Math.random() * 0.15; // 5% to 20%
 setTargetProd(Math.floor(Math.random() * 5 + 5) * 1000); // 5000 to 9000
 }, []);

 const inspectBatch = () => {
 let newGood = 0;
 let newFaulty = 0;
 for (let i = 0; i < 50; i++) {
  if (Math.random() < trueDefectRate.current) newFaulty++;
  else newGood++;
 }
 setTotalGood(prev => prev + newGood);
 setTotalFaulty(prev => prev + newFaulty);
 setIsCorrect(null);
 };
 
 const totalItems = totalGood + totalFaulty;
 
 const checkAns = () => {
 if (totalItems === 0) return;
 const empiricalProb = totalFaulty / totalItems;
 const expected = Math.round(empiricalProb * targetProd);
 
 if (parseInt(userAns) === expected) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 const resetSim = () => {
 setTotalGood(0);
 setTotalFaulty(0);
 setUserAns('');
 setIsCorrect(null);
 trueDefectRate.current = 0.05 + Math.random() * 0.15;
 };

 const maxVal = Math.max(totalGood, totalFaulty, 10);
 
 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Lab M9.3: Basic Statistics" subtitle="Quality Control & Probability Simulator" />
  

  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 max-w-7xl mx-auto w-full overflow-y-auto lg:overflow-visible">
  {/* Column 1: Theory */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <HelpCircle className="text-amber-600" size={20} />
   Empirical Probability
   </h2>
   <div className="prose prose-slate text-sm">
   <p>
    In a factory, it's impossible to inspect every single item produced. 
    Instead, we sample batches to determine the <strong>empirical probability</strong> of a defect.
   </p>
   <div className={`mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 text-center dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    <p className="font-mono text-amber-900 font-bold mb-1 dark:text-[#ffffff]">P(Defect) =</p>
    <div className="inline-block border-b border-amber-900 pb-1 px-2 font-mono text-amber-900 dark:text-[#ffffff]">Total Faulty Items</div>
    <div className="pt-1 font-mono text-amber-900 dark:text-[#ffffff]">Total Inspected Items</div>
   </div>
   <ul className="list-disc pl-5 space-y-2 mt-4">
    <li><strong>Law of Large Numbers:</strong> The more items you inspect, the closer your empirical probability gets to the true theoretical defect rate.</li>
    <li><strong>Expected Value:</strong> To predict future defects, multiply P(Defect) by the target production volume.</li>
   </ul>
   </div>
  </div>

  {/* Column 2: Simulator */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col gap-4 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <Factory className="text-amber-600" size={20} />
   Factory Inspector
   </h2>
   
   <div className={`flex-1 min-w-0 flex flex-col items-center justify-end relative bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-6 `}>
   <div className="w-full h-48 flex items-end justify-center gap-12">
    {/* Bar 1: Good */}
    <div className="flex flex-col items-center gap-2 w-24 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
    <span className="font-bold text-slate-600 dark:text-[#a1a1aa]">{totalGood}</span>
    <div 
     className={`w-full bg-blue-500 rounded-t-md transition-all duration-500 /20 dark:border-teal-900 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 flex-col `}
     style={{ height: `${(totalGood / maxVal) * 100}%`, minHeight: '4px' }}
    ></div>
    <span className="text-xs font-bold text-slate-500 dark:text-[#71717a]">GOOD</span>
    </div>
    
    {/* Bar 2: Faulty */}
    <div className="flex flex-col items-center gap-2 w-24">
    <span className="font-bold text-slate-600 dark:text-[#a1a1aa]">{totalFaulty}</span>
    <div 
     className={`w-full bg-red-500 rounded-t-md transition-all duration-500 dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40 flex-col `}
     style={{ height: `${(totalFaulty / maxVal) * 100}%`, minHeight: '4px' }}
    ></div>
    <span className="text-xs font-bold text-slate-500 dark:text-[#71717a]">FAULTY</span>
    </div>
   </div>
   </div>

   <div className="flex flex-wrap gap-2">
   <button 
    onClick={inspectBatch} 
    className="flex-1 min-w-0 py-3 bg-amber-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors shadow-sm dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"
   >
    <Factory size={18} /> Inspect 50 Items
   </button>
   <button 
    onClick={resetSim} 
    className="px-4 py-3 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] font-bold rounded-lg flex items-center justify-center hover:bg-slate-300 dark:bg-[#121212] transition-colors"
   >
    <RefreshCcw size={18} />
   </button>
   </div>
  </div>

  {/* Column 3: Analysis */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-4">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <Calculator className="text-amber-600" size={20} />
   Data Analysis
   </h2>
   
   <div className="flex-1 min-w-0 space-y-4">
   <div className="grid grid-cols-2 gap-4">
    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center dark:bg-teal-950/20 dark:border-teal-900">
    <span className="block text-blue-800 text-sm font-bold mb-1 dark:text-[#ffffff]">Total Inspected</span>
    <span className="text-2xl font-black text-blue-600">{totalItems}</span>
    </div>
    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
    <span className="block text-red-800 text-sm font-bold mb-1">Empirical P(F)</span>
    <span className="text-2xl font-black text-red-600">
     {totalItems > 0 ? (totalFaulty / totalItems).toFixed(3) : '0.000'}
    </span>
    </div>
   </div>

   <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mt-4 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h3 className="font-bold text-amber-900 mb-2 dark:text-[#ffffff]">Predictive Analysis</h3>
    <p className="text-sm text-amber-800 mb-4 dark:text-[#ffffff]">
    Based on your current empirical probability, if the factory produces <strong>{targetProd.toLocaleString()}</strong> items this week, exactly how many do you expect to be faulty? (Round to nearest integer).
    </p>
    <div className="flex flex-wrap gap-2">
    <input 
     type="number" 
     placeholder="Expected Faulty" 
     value={userAns}
     onChange={(e) => setUserAns(e.target.value)}
     disabled={totalItems === 0}
     className="flex-1 min-w-0 px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
    />
    <button 
     onClick={checkAns}
     disabled={totalItems === 0}
     className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center disabled:opacity-50 dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"
    >
     Check
    </button>
    </div>
    
    {isCorrect === true && (
    <div className="mt-3 p-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 text-sm">
     <CheckCircle size={16} /> Spot on! Great analysis.
    </div>
    )}
    {isCorrect === false && (
    <div className="mt-3 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
     Incorrect. Calculate: Empirical P(F) × {targetProd}. (Use exact P(F) = {totalFaulty}/{totalItems})
    </div>
    )}
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
