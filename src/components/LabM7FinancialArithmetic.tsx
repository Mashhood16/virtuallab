import { useState } from 'react';
import { ArrowLeft, Calculator, Coins, Landmark, FileText } from 'lucide-react';

export default function LabM7FinancialArithmetic({ onExit }: { onExit?: () => void }) {
 // Tabs: Profit/Loss, Zakat, Ushr
 const [activeTab, setActiveTab] = useState<'business' | 'zakat' | 'ushr'>('business');

 // Business State
 const [costPrice, setCostPrice] = useState(1000);
 const [sellingPrice, setSellingPrice] = useState(1200);
 const [taxRate, setTaxRate] = useState(5); // %

 // Zakat State
 const [wealthAmount, setWealthAmount] = useState(100000);
 
 // Ushr State
 const [produceValue, setProduceValue] = useState(50000);
 const [irrigationType, setIrrigationType] = useState<'natural' | 'artificial'>('natural');

 // Quiz states
 const [userAnswer, setUserAnswer] = useState('');
 const [feedback, setFeedback] = useState('');

 const calculateBusiness = () => {
 const profitOrLoss = sellingPrice - costPrice;
 const taxAmount = (sellingPrice * taxRate) / 100;
 const netAmount = sellingPrice - taxAmount;
 return { profitOrLoss, taxAmount, netAmount };
 };

 const calculateZakat = () => {
 return wealthAmount * 0.025;
 };

 const calculateUshr = () => {
 return irrigationType === 'natural' ? produceValue * 0.1 : produceValue * 0.05;
 };

 const checkAnswer = () => {
 let correct = 0;
 if (activeTab === 'business') correct = calculateBusiness().netAmount;
 if (activeTab === 'zakat') correct = calculateZakat();
 if (activeTab === 'ushr') correct = calculateUshr();

 if (parseFloat(userAnswer) === correct) {
  setFeedback('Correct! Well done.');
 } else {
  setFeedback(`Incorrect. Try again!`);
 }
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] select-none">
  {/* Header */}
  <header className="flex items-center p-4 shadow-sm z-10">
  <button
   onClick={onExit}
   className="mr-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
  >
   <ArrowLeft className="w-6 h-6" />
  </button>
  <h1 className="text-lg md:text-xl font-bold flex-1">Unit 4: Financial Arithmetic Lab</h1>
  <div className="flex space-x-2">
   <button onClick={() => {setActiveTab('business'); setUserAnswer(''); setFeedback('');}} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'business' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>Business</button>
   <button onClick={() => {setActiveTab('zakat'); setUserAnswer(''); setFeedback('');}} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'zakat' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>Zakat</button>
   <button onClick={() => {setActiveTab('ushr'); setUserAnswer(''); setFeedback('');}} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'ushr' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>Ushr</button>
  </div>
  </header>

  {/* 2-column Layout */}
  <div className="lg:flex-1 min-w-0 flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4 p-4 lg: overflow-y-auto lg:overflow-visible">
  {/* Left Column: Controls & Questions */}
  <div className={`w-full bg-white dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col lg:overflow-y-auto  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-semibold mb-4 flex items-center">
   <Calculator className="w-5 h-5 mr-2 text-indigo-500" />
   Interactive Workspace
   </h2>

   {activeTab === 'business' && (
   <div className="space-y-4 flex-1">
    <p className="text-sm text-slate-600 dark:text-[#71717a]">Calculate profit/loss and taxes for factory goods.</p>
    <div>
    <label className="block text-sm font-medium mb-1">Cost Price (Rs): {costPrice}</label>
    <input type="range" min="100" max="5000" step="100" value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} className="w-full accent-indigo-600" />
    </div>
    <div>
    <label className="block text-sm font-medium mb-1">Selling Price (Rs): {sellingPrice}</label>
    <input type="range" min="100" max="5000" step="100" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} className="w-full accent-indigo-600" />
    </div>
    <div>
    <label className="block text-sm font-medium mb-1">Tax Rate (%): {taxRate}</label>
    <input type="range" min="0" max="25" step="1" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="w-full accent-indigo-600" />
    </div>
    <div className={`w-full mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800  'block' : 'hidden'} lg:block order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
    <h3 className="font-semibold mb-2 text-indigo-900 dark:text-indigo-100">Solve it!</h3>
    <p className="text-sm mb-4">What is the net amount received after tax?</p>
    <div className="flex space-x-2">
     <input type="number" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} className="flex-1 min-w-0 px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-[#1c1b1b] focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter amount..." />
     <button onClick={checkAnswer} className="whitespace-nowrap flex-shrink-0 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">Check</button>
    </div>
    {feedback && <p className={`mt-2 text-sm font-medium ${feedback.includes('Correct') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{feedback}</p>}
    </div>
   </div>
   )}

   {activeTab === 'zakat' && (
   <div className="space-y-4 flex-1">
    <p className="text-sm text-slate-600 dark:text-[#71717a]">Zakat is calculated at 2.5% on wealth/gold held for a year.</p>
    <div>
    <label className="block text-sm font-medium mb-1">Wealth Amount (Rs): {wealthAmount.toLocaleString()}</label>
    <input type="range" min="10000" max="1000000" step="10000" value={wealthAmount} onChange={(e) => setWealthAmount(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <div className={`w-full mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-100 dark:border-emerald-800  'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    <h3 className="font-semibold mb-2 text-emerald-900 dark:text-emerald-100">Solve it!</h3>
    <p className="text-sm mb-4">Calculate the Zakat payable on this wealth.</p>
    <div className="flex space-x-2">
     <input type="number" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} className="flex-1 min-w-0 px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-[#1c1b1b] focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter Zakat..." />
     <button onClick={checkAnswer} className="whitespace-nowrap flex-shrink-0 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">Check</button>
    </div>
    {feedback && <p className={`mt-2 text-sm font-medium ${feedback.includes('Correct') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{feedback}</p>}
    </div>
   </div>
   )}

   {activeTab === 'ushr' && (
   <div className="space-y-4 flex-1">
    <p className="text-sm text-slate-600 dark:text-[#71717a]">Ushr is 10% for natural irrigation and 5% for artificial irrigation.</p>
    <div>
    <label className="block text-sm font-medium mb-1">Produce Value (Rs): {produceValue.toLocaleString()}</label>
    <input type="range" min="5000" max="500000" step="5000" value={produceValue} onChange={(e) => setProduceValue(Number(e.target.value))} className="w-full accent-amber-600" />
    </div>
    <div>
    <label className="block text-sm font-medium mb-2">Irrigation Type:</label>
    <div className="flex space-x-4">
     <label className="flex items-center space-x-2 cursor-pointer">
     <input type="radio" checked={irrigationType === 'natural'} onChange={() => setIrrigationType('natural')} className="text-amber-600 w-4 h-4" />
     <span>Natural (Rain)</span>
     </label>
     <label className="flex items-center space-x-2 cursor-pointer">
     <input type="radio" checked={irrigationType === 'artificial'} onChange={() => setIrrigationType('artificial')} className="text-amber-600 w-4 h-4" />
     <span>Artificial (Tube-well)</span>
     </label>
    </div>
    </div>
    <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-100 dark:border-amber-800">
    <h3 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">Solve it!</h3>
    <p className="text-sm mb-4">Calculate the Ushr payable on this produce.</p>
    <div className="flex space-x-2">
     <input type="number" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} className="flex-1 min-w-0 px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-[#1c1b1b] focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter Ushr..." />
     <button onClick={checkAnswer} className="whitespace-nowrap flex-shrink-0 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40">Check</button>
    </div>
    {feedback && <p className={`mt-2 text-sm font-medium ${feedback.includes('Correct') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{feedback}</p>}
    </div>
   </div>
   )}
  </div>

  {/* Right Column: Simulation Stage */}
  <div className="bg-white dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col relative overflow-hidden items-center justify-center">
   
   {activeTab === 'business' && (
   <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in duration-300">
    <div className="text-center mb-8">
    <Landmark className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
    <h3 className="text-xl font-bold">Transaction Breakdown</h3>
    </div>
    
    <div className="flex justify-between items-center p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
    <span>Selling Price:</span>
    <span className="font-mono font-bold text-lg">Rs {sellingPrice}</span>
    </div>
    <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
    <span>- Tax ({taxRate}%):</span>
    <span className="font-mono font-bold text-lg">Rs {calculateBusiness().taxAmount.toFixed(2)}</span>
    </div>
    <div className="h-px w-full bg-slate-300 dark:bg-slate-600 my-2"></div>
    <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
    <span>= Net Amount:</span>
    <span className="font-mono font-bold text-xl">Rs {calculateBusiness().netAmount.toFixed(2)}</span>
    </div>

    <div className="mt-6 flex justify-between text-sm text-slate-500 dark:text-[#71717a] px-4">
    <span>Cost: Rs {costPrice}</span>
    <span className={calculateBusiness().profitOrLoss >= 0 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
     {calculateBusiness().profitOrLoss >= 0 ? 'Gross Profit: ' : 'Gross Loss: '}
     Rs {Math.abs(calculateBusiness().profitOrLoss)}
    </span>
    </div>
   </div>
   )}

   {activeTab === 'zakat' && (
   <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in duration-300">
    <div className="text-center mb-8">
    <Coins className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
    <h3 className="text-xl font-bold">Zakat Calculation</h3>
    </div>
    
    <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden flex items-end">
    <div 
     className="w-full bg-emerald-200 dark:bg-emerald-800/50 absolute bottom-0 transition-all duration-500 ease-out" 
     style={{ height: '100%' }}
    ></div>
    <div 
     className="w-full bg-emerald-500 dark:bg-emerald-600 absolute bottom-0 transition-all duration-500 ease-out flex items-center justify-center text-white font-bold" 
     style={{ height: '2.5%' }}
    >
     2.5%
    </div>
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
     <span className="text-3xl font-bold bg-white/80 dark:bg-[#121212]/80 px-4 py-2 rounded-lg backdrop-blur-sm shadow-sm">
     Rs {wealthAmount.toLocaleString()}
     </span>
    </div>
    </div>

    <div className="flex justify-between items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-sm">
    <span>Zakat Amount (2.5%):</span>
    <span className="font-mono font-bold text-xl">Rs {calculateZakat().toLocaleString()}</span>
    </div>
   </div>
   )}

   {activeTab === 'ushr' && (
   <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in duration-300">
    <div className="text-center mb-8">
    <FileText className="w-16 h-16 mx-auto text-amber-500 mb-4" />
    <h3 className="text-xl font-bold">Ushr Calculation</h3>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
    <div className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${irrigationType === 'natural' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-sm scale-105' : 'border-slate-200 dark:border-[#1c1b1b] opacity-60'}`}>
     <div className="text-4xl mb-2">🌧️</div>
     <div className="font-semibold text-slate-800 dark:text-[#ffffff]">Natural</div>
     <div className="text-amber-600 dark:text-amber-400 font-bold mt-1">10%</div>
    </div>
    <div className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${irrigationType === 'artificial' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-sm scale-105' : 'border-slate-200 dark:border-[#1c1b1b] opacity-60'}`}>
     <div className="text-4xl mb-2">🚰</div>
     <div className="font-semibold text-slate-800 dark:text-[#ffffff]">Artificial</div>
     <div className="text-amber-600 dark:text-amber-400 font-bold mt-1">5%</div>
    </div>
    </div>

    <div className="flex justify-between items-center p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800 shadow-sm">
    <span>Ushr Amount:</span>
    <span className="font-mono font-bold text-xl">Rs {calculateUshr().toLocaleString()}</span>
    </div>
   </div>
   )}

  </div>
  </div>
 </div>
 );
}
