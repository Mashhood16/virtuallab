import { useState, useEffect } from 'react';
import { Flame, Filter, RotateCcw, Check} from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC10SaltExcessMetal({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [acidAdded, setAcidAdded] = useState(false);
 const [znScoops, setZnScoops] = useState(0);
 const [reactedZn, setReactedZn] = useState(0);
 const [isFiltered, setIsFiltered] = useState(false);
 const [isEvaporated, setIsEvaporated] = useState(false);
 const [waterLevel, setWaterLevel] = useState(100);
 const [equation, setEquation] = useState("Empty");
 const [assessmentAns, setAssessmentAns] = useState("");
 const [assessmentStatus, setAssessmentStatus] = useState<boolean | null>(null);

 useEffect(() => {
  if (acidAdded && znScoops > reactedZn && reactedZn < 1) {
   const timer = setTimeout(() => { setReactedZn(1); }, 3000);
   return () => clearTimeout(timer);
  }
 }, [acidAdded, znScoops, reactedZn]);

 useEffect(() => {
  if (isEvaporated && waterLevel > 0) {
   const timer = setTimeout(() => { setWaterLevel(w => Math.max(0, w - 10)); }, 200);
   return () => clearTimeout(timer);
  }
 }, [isEvaporated, waterLevel]);

 const isReacting = acidAdded && znScoops > reactedZn && reactedZn < 1;
 const hasExcessZn = znScoops > reactedZn && reactedZn === 1;

 useEffect(() => {
  if (!acidAdded) setEquation("Empty");
  else if (acidAdded && znScoops === 0) setEquation("H₂SO₄(aq)");
  else if (isReacting) setEquation("Zn(s) + H₂SO₄(aq) ➔ ZnSO₄(aq) + H₂(g)↑");
  else if (hasExcessZn && !isFiltered) setEquation("ZnSO₄(aq) + Excess Zn(s) [Reaction Complete]");
  else if (isFiltered && !isEvaporated) setEquation("Pure ZnSO₄(aq) Filtrate");
  else if (isEvaporated && waterLevel > 0) setEquation("ZnSO₄(aq) + Heat ➔ ZnSO₄(s) + H₂O(g)↑");
  else if (isEvaporated && waterLevel === 0) setEquation("Solid ZnSO₄ Crystals Formed!");
 }, [acidAdded, znScoops, isReacting, hasExcessZn, isFiltered, isEvaporated, waterLevel]);

 const reset = () => { setAcidAdded(false); setZnScoops(0); setReactedZn(0); setIsFiltered(false); setIsEvaporated(false); setWaterLevel(100); setAssessmentStatus(null); setAssessmentAns(""); };

 const checkAns = () => {
 setAssessmentStatus(assessmentAns.trim().toLowerCase() === "hydrogen" || assessmentAns.trim().toLowerCase() === "h2");
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Salt from Excess Metal" />
  
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
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">Theory & Setup</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa]">A soluble salt can be prepared by reacting an acid with an insoluble metal. Adding excess metal ensures all acid reacts.</p>
   <div className={`bg-teal-50 p-4 rounded-lg border border-teal-100 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    <h3 className="font-semibold text-teal-800 mb-2">Reaction Equation</h3>
    <p className="text-sm font-mono text-center text-teal-900">Zn(s) + H₂SO₄(aq) ➔ ZnSO₄(aq) + H₂(g)</p>
   </div>
   <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mt-4">Procedure</h3>
   <ol className="list-decimal list-inside text-slate-600 dark:text-[#a1a1aa] space-y-2 text-sm">
    <li>Add <strong>H₂SO₄</strong> to the beaker.</li>
    <li>Add <strong>Zinc Powder</strong> until bubbling stops (excess metal remains).</li>
    <li>Click <strong>Filter</strong> to remove excess Zinc.</li>
    <li>Click <strong>Evaporate</strong> to obtain ZnSO₄ crystals.</li>
   </ol>
  </div>
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-6 w-full text-left">Interactive Simulation</h2>
   <div className={`w-full bg-[#000000] dark:bg-[#121212] text-green-400 font-mono p-4 rounded-lg shadow-inner mb-6 min-h-[80px] flex items-center justify-center text-center text-lg flex-col `}>{equation}</div>
   
   <div className="flex gap-4 mb-8">
    <button onClick={() => setAcidAdded(true)} disabled={acidAdded} className="px-3 py-2 bg-slate-100 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded hover:bg-slate-200 dark:bg-[#121212] disabled:opacity-50 text-sm font-medium">Add H₂SO₄</button>
    <button onClick={() => setZnScoops(s => s + 1)} disabled={!acidAdded || isFiltered || znScoops >= 2} className="px-3 py-2 bg-slate-100 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded hover:bg-slate-200 dark:bg-[#121212] disabled:opacity-50 text-sm font-medium">Add Zinc Scoop</button>
    <button onClick={() => setIsFiltered(true)} disabled={!hasExcessZn || isFiltered} className={`flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-800 border border-blue-300 rounded hover:bg-blue-200 disabled:opacity-50 text-sm font-medium dark:text-[#ffffff] flex-col `}><Filter size={16}/> Filter</button>
    <button onClick={() => setIsEvaporated(true)} disabled={!isFiltered || isEvaporated} className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-800 border border-red-300 rounded hover:bg-red-200 disabled:opacity-50 text-sm font-medium"><Flame size={16}/> Evaporate</button>
   </div>

   <div className="relative w-64 h-64 flex flex-col items-center justify-end">
    {isReacting && (
     <div className="absolute top-20 flex gap-4 animate-bounce text-blue-300 text-xs font-bold">
      <span>O</span><span className="mt-4">O</span><span>O</span>
     </div>
    )}
    {isEvaporated && waterLevel > 0 && (
     <div className="absolute top-10 flex gap-4 animate-pulse text-orange-500">
      <Flame size={24} /><Flame size={24} />
     </div>
    )}
    {!isFiltered ? (
     <svg viewBox="0 0 100 100" className="w-32 h-32 drop-shadow-md z-10">
      <path d="M20,10 L20,80 C20,95 30,100 50,100 C70,100 80,95 80,80 L80,10" fill="none" stroke="#94a3b8" strokeWidth="4" />
      {acidAdded && <rect x="22" y="40" width="56" height="58" fill="rgba(200, 230, 255, 0.5)" rx="5" />}
      {znScoops > 0 && !isReacting && <path d={`M30,95 Q50,${95 - (znScoops - reactedZn)*10} 70,95 Z`} fill="#64748b" />}
     </svg>
    ) : (
     <svg viewBox="0 0 100 50" className="w-48 h-24 drop-shadow-md z-10">
      <path d="M10,20 C10,50 90,50 90,20 L85,20 C85,45 15,45 15,20 Z" fill="rgba(255,255,255,0.9)" stroke="#94a3b8" strokeWidth="2" />
      {waterLevel > 0 && (
       <path d={`M20,${40 - waterLevel*0.15} C40,${45 - waterLevel*0.15} 60,${45 - waterLevel*0.15} 80,${40 - waterLevel*0.15} C80,45 20,45 20,${40 - waterLevel*0.15} Z`} fill="rgba(200, 230, 255, 0.6)" />
      )}
      {waterLevel === 0 && (
       <g fill="#fff" stroke="#94a3b8" strokeWidth="0.5">
        <rect x="40" y="38" width="5" height="5" />
        <rect x="48" y="39" width="6" height="6" />
        <rect x="55" y="37" width="4" height="4" />
        <rect x="35" y="40" width="5" height="5" />
        <rect x="62" y="39" width="5" height="5" />
       </g>
      )}
     </svg>
    )}
   </div>

   <div className="mt-8 flex gap-4">
    <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg transition-colors"><RotateCcw size={18} /> Reset</button>
   </div>
  </div>
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-6 `}>
   <div className="bg-teal-50 p-5 rounded-xl border border-teal-200 mt-auto">
    <h3 className="font-bold text-teal-900 mb-2 flex items-center gap-2"><Check size={20} /> Analysis Check</h3>
    <p className="text-sm text-teal-800 mb-4">What gas is produced during the reaction between Zinc and Sulfuric Acid (which creates a 'pop' sound with a lit splint)?</p>
    <div className="flex gap-2">
     <input type="text" value={assessmentAns} onChange={(e) => setAssessmentAns(e.target.value)} placeholder="Name of gas..." className="flex-1 px-3 py-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 dark:bg-[#121212]" />
     <button onClick={checkAns} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors font-medium dark:text-white dark:text-white dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40">Check</button>
    </div>
    {assessmentStatus === true && <p className="mt-2 text-sm text-green-700 font-semibold">Correct! Hydrogen gas is produced.</p>}
    {assessmentStatus === false && <p className="mt-2 text-sm text-red-600 font-semibold">Incorrect. Remember the reaction: Zn + H₂SO₄ ➔ ZnSO₄ + H₂.</p>}
   </div>
  </div>
  </div>
 </div>
 );
}
