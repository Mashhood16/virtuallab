import { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Users, Target, CheckCircle2, BarChart2} from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit?: () => void;
}

export default function LabCS9Entrepreneurship({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [units, setUnits] = useState(100);
 const [rawMaterial, setRawMaterial] = useState(5);
 const [labor, setLabor] = useState(10);
 const [fixedOverhead, setFixedOverhead] = useState(500);

 const variableCostPerUnit = rawMaterial + labor;
 const totalVariableCost = variableCostPerUnit * units;
 const totalCost = fixedOverhead + totalVariableCost;
 const costPerUnit = totalCost / units;

 const platforms = [
  { id: 'insta', name: 'Instagram Ads', cost: 100, reach: 5000 },
  { id: 'tiktok', name: 'TikTok Influencer', cost: 150, reach: 8000 },
  { id: 'linkedin', name: 'LinkedIn B2B', cost: 200, reach: 2000 },
  { id: 'flyers', name: 'Local Flyers', cost: 50, reach: 500 },
 ];
 const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

 const totalMarketingCost = platforms.filter(p => selectedPlatforms.includes(p.id)).reduce((acc, curr) => acc + curr.cost, 0);
 const totalReach = platforms.filter(p => selectedPlatforms.includes(p.id)).reduce((acc, curr) => acc + curr.reach, 0);

 const [assessmentSellingPrice, setAssessmentSellingPrice] = useState(0);
 const [assessmentFixedCost, setAssessmentFixedCost] = useState(0);
 const [assessmentVariableCost, setAssessmentVariableCost] = useState(0);
 const [userBEP, setUserBEP] = useState('');
 const [assessmentFeedback, setAssessmentFeedback] = useState('');

 useEffect(() => {
  setAssessmentFixedCost(Math.floor(Math.random() * 500) + 500);
  setAssessmentVariableCost(Math.floor(Math.random() * 10) + 5);
  setAssessmentSellingPrice(Math.floor(Math.random() * 20) + 20);
 }, []);

 const correctBEP = Math.ceil(assessmentFixedCost / (assessmentSellingPrice - assessmentVariableCost));

 const checkBEP = () => {
  const parsed = parseInt(userBEP);
  if (isNaN(parsed)) {
   setAssessmentFeedback("Please enter a valid number.");
   return;
  }
  if (parsed === correctBEP) {
   setAssessmentFeedback("Correct! You calculated the Break-Even Point correctly.");
  } else {
   setAssessmentFeedback(`Incorrect. Hint: BEP = Fixed Costs / (Selling Price - Variable Cost). Try again!`);
  }
 };

 const togglePlatform = (id: string) => {
  if (selectedPlatforms.includes(id)) {
   setSelectedPlatforms(selectedPlatforms.filter(p => p !== id));
  } else {
   setSelectedPlatforms([...selectedPlatforms, id]);
  }
 };

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="Tech Entrepreneurship" />

   
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
    {/* Column 1: Theory */}
    <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm flex flex-col gap-4 border border-slate-100 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
      <TrendingUp className="w-6 h-6 text-emerald-600" />
      Business Economics
     </h2>
     <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-4">
      <p>Entrepreneurship in tech involves not just building a product, but understanding the economics of bringing it to market.</p>
      
      <div className="space-y-2">
       <h3 className="font-bold text-slate-700 dark:text-[#ffffff] flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-500"/> Cost Structure</h3>
       <ul className="list-disc pl-5 space-y-1">
        <li><strong>Fixed Costs:</strong> Expenses that don't change based on production volume (e.g., Rent, Software Licenses).</li>
        <li><strong>Variable Costs:</strong> Expenses that scale with production (e.g., Cloud hosting per user, Raw materials).</li>
       </ul>
      </div>
      
      <div className="space-y-2">
       <h3 className="font-bold text-slate-700 dark:text-[#ffffff] flex items-center gap-2"><Target className="w-4 h-4 text-emerald-500"/> Break-Even Point (BEP)</h3>
       <p className={`bg-slate-50 dark:bg-[#121212] p-2 rounded border font-mono text-xs text-center flex-col `}>BEP = Fixed Costs / (Price - Variable Cost)</p>
       <p>The number of units you must sell to exactly cover your total costs. Beyond this point, you make profit.</p>
      </div>
     </div>
    </div>

    {/* Column 2: Simulator */}
    <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm flex flex-col border border-slate-100 lg: ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
      <Calculator className="w-6 h-6 text-emerald-600" />
      Business Planner
     </h2>
     
     {/* Cost Calculator */}
     <div className={`mb-6 bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
      <h3 className="font-bold text-sm text-slate-700 dark:text-[#ffffff] mb-3 border-b pb-2">Production Costs</h3>
      <div className="space-y-4">
       <div>
        <label className="text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] flex justify-between">
         <span>Units to Produce:</span>
         <span>{units} units</span>
        </label>
        <input type="range" min="10" max="1000" step="10" value={units} onChange={e => setUnits(parseInt(e.target.value))} className="w-full accent-emerald-500" />
       </div>
       <div>
        <label className="text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] flex justify-between">
         <span>Raw Material Cost/Unit:</span>
         <span>${rawMaterial}</span>
        </label>
        <input type="range" min="1" max="50" step="1" value={rawMaterial} onChange={e => setRawMaterial(parseInt(e.target.value))} className="w-full accent-emerald-500" />
       </div>
       <div>
        <label className="text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] flex justify-between">
         <span>Labor Cost/Unit:</span>
         <span>${labor}</span>
        </label>
        <input type="range" min="1" max="50" step="1" value={labor} onChange={e => setLabor(parseInt(e.target.value))} className="w-full accent-emerald-500" />
       </div>
       <div>
        <label className="text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] flex justify-between">
         <span>Fixed Overhead:</span>
         <span>${fixedOverhead}</span>
        </label>
        <input type="range" min="100" max="5000" step="100" value={fixedOverhead} onChange={e => setFixedOverhead(parseInt(e.target.value))} className="w-full accent-emerald-500" />
       </div>
      </div>
     </div>

     {/* Marketing Board */}
     <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
      <h3 className="font-bold text-sm text-slate-700 dark:text-[#ffffff] mb-3 border-b pb-2 flex items-center gap-2"><Users className="w-4 h-4"/> Social Media Strategy</h3>
      <div className="space-y-2">
       {platforms.map(p => (
        <label key={p.id} className={`flex items-center gap-3 p-2 rounded border cursor-pointer transition-colors ${selectedPlatforms.includes(p.id) ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] hover:bg-slate-50 dark:bg-[#121212]'}`}>
         <input 
          type="checkbox" 
          checked={selectedPlatforms.includes(p.id)}
          onChange={() => togglePlatform(p.id)}
          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
         />
         <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-[#ffffff]">{p.name}</p>
          <p className="text-xs text-slate-500 dark:text-[#71717a]">Est. Reach: {p.reach.toLocaleString()}</p>
         </div>
         <span className="text-sm font-bold text-emerald-700">${p.cost}</span>
        </label>
       ))}
      </div>
     </div>
    </div>

    {/* Column 3: Analysis */}
    <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm flex flex-col h-full border border-slate-100">
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
      <BarChart2 className="w-6 h-6 text-emerald-600" />
      Financial Overview
     </h2>
     
     <div className="flex-1 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] mb-6 shadow-inner space-y-4">
      <div>
       <h3 className="font-semibold text-xs text-slate-500 dark:text-[#71717a] uppercase tracking-wider mb-2">Cost Breakdown</h3>
       <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="p-2 bg-slate-50 dark:bg-[#121212] rounded border flex flex-col items-center">
         <span className="text-slate-500 dark:text-[#71717a] text-xs">Total Var. Cost</span>
         <span className="font-bold text-slate-800 dark:text-[#ffffff]">${totalVariableCost.toLocaleString()}</span>
        </div>
        <div className="p-2 bg-slate-50 dark:bg-[#121212] rounded border flex flex-col items-center">
         <span className="text-slate-500 dark:text-[#71717a] text-xs">Fixed Costs</span>
         <span className="font-bold text-slate-800 dark:text-[#ffffff]">${fixedOverhead.toLocaleString()}</span>
        </div>
        <div className="p-2 bg-emerald-100 rounded border border-emerald-200 col-span-2 flex justify-between items-center px-4">
         <span className="font-semibold text-emerald-900">Total Production Cost</span>
         <span className="font-bold text-lg text-emerald-700">${totalCost.toLocaleString()}</span>
        </div>
        <div className="p-2 bg-slate-50 dark:bg-[#121212] rounded border col-span-2 flex justify-between items-center px-4 text-xs">
         <span className="text-slate-600 dark:text-[#a1a1aa]">Cost Per Unit Produced</span>
         <span className="font-bold text-slate-800 dark:text-[#ffffff]">${costPerUnit.toFixed(2)}/unit</span>
        </div>
       </div>
      </div>

      <div className="pt-2 border-t border-slate-200 dark:border-[#1c1b1b]">
       <h3 className="font-semibold text-xs text-slate-500 dark:text-[#71717a] uppercase tracking-wider mb-2">Marketing Totals</h3>
       <div className="flex justify-between items-center text-sm p-2 bg-slate-50 dark:bg-[#121212] rounded border mb-2">
        <span className="text-slate-600 dark:text-[#a1a1aa]">Budget Spent</span>
        <span className="font-bold text-red-600">${totalMarketingCost.toLocaleString()}</span>
       </div>
       <div className="flex justify-between items-center text-sm p-2 bg-slate-50 dark:bg-[#121212] rounded border">
        <span className="text-slate-600 dark:text-[#a1a1aa]">Expected Reach</span>
        <span className="font-bold text-blue-600">{totalReach.toLocaleString()} people</span>
       </div>
      </div>
     </div>

     <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-200 shadow-sm">
      <h3 className="font-bold text-emerald-900 mb-2 text-sm flex items-center gap-2">Assessment: Find the BEP</h3>
      <p className="text-xs text-emerald-800 mb-3">Calculate the Break-Even Point (in units) given these market conditions:</p>
      
      <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded border border-emerald-100 text-sm mb-4 space-y-1 shadow-sm">
       <div className="flex justify-between"><span className="text-slate-600 dark:text-[#a1a1aa]">Fixed Costs:</span> <span className="font-bold">${assessmentFixedCost}</span></div>
       <div className="flex justify-between"><span className="text-slate-600 dark:text-[#a1a1aa]">Variable Cost/Unit:</span> <span className="font-bold">${assessmentVariableCost}</span></div>
       <div className="flex justify-between"><span className="text-slate-600 dark:text-[#a1a1aa]">Selling Price/Unit:</span> <span className="font-bold">${assessmentSellingPrice}</span></div>
      </div>

      <div className="flex flex-col gap-3">
       <input 
        type="number" 
        value={userBEP}
        onChange={e => setUserBEP(e.target.value)}
        placeholder="Enter Break-Even units..."
        className="px-3 py-2 border border-emerald-300 rounded-md text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow"
       />
       <button 
        onClick={checkBEP}
        className={`bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-semibold shadow-sm flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40 `}
       >
        Submit Calculation <CheckCircle2 className="w-4 h-4"/>
       </button>
       {assessmentFeedback && (
        <div className={`mt-2 p-2 rounded text-xs font-semibold ${assessmentFeedback.includes('Correct') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
         {assessmentFeedback}
        </div>
       )}
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
