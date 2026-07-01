import { useState, useEffect } from 'react';
import { Flame, RotateCcw, Check } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC10SaltTitration({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [naohAdded, setNaohAdded] = useState(false);
 const [hclAdded, setHclAdded] = useState(false);
 const [heating, setHeating] = useState(false);
 const [waterLevel, setWaterLevel] = useState(100);
 const [equation, setEquation] = useState("Empty Evaporating Dish");
 const [assessmentAns, setAssessmentAns] = useState("");
 const [assessmentStatus, setAssessmentStatus] = useState<boolean | null>(null);

 useEffect(() => {
  if (heating && waterLevel > 0) {
   const timer = setTimeout(() => { setWaterLevel(w => Math.max(0, w - 5)); }, 100);
   return () => clearTimeout(timer);
  }
  if (heating && waterLevel === 0) setHeating(false);
 }, [heating, waterLevel]);

 useEffect(() => {
  if (naohAdded && !hclAdded) setEquation("NaOH(aq)");
  else if (naohAdded && hclAdded && !heating && waterLevel === 100) setEquation("NaOH(aq) + HCl(aq) ➔ NaCl(aq) + H₂O(l)");
  else if (heating) setEquation("NaCl(aq) + Heat ➔ NaCl(s) + H₂O(g)↑");
  else if (waterLevel === 0) setEquation("Solid NaCl Crystals Formed!");
  else if (!naohAdded && !hclAdded) setEquation("Empty Evaporating Dish");
 }, [naohAdded, hclAdded, heating, waterLevel]);

 const reset = () => { setNaohAdded(false); setHclAdded(false); setHeating(false); setWaterLevel(100); setAssessmentStatus(null); setAssessmentAns(""); };

 const checkAns = () => {
 setAssessmentStatus(assessmentAns.trim().toLowerCase() === "evaporation" || assessmentAns.trim().toLowerCase() === "crystallization");
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Preparation of a Soluble Salt" />
  
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
   <p className="text-slate-600 dark:text-[#a1a1aa]">A soluble salt like NaCl can be prepared by titrating an acid and an alkali, followed by evaporating the water to crystallize the salt.</p>
   <div className={`bg-orange-50 p-4 rounded-lg border border-orange-100 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    <h3 className="font-semibold text-orange-800 mb-2">Overall Reaction</h3>
    <p className="text-sm font-mono text-center text-orange-900">HCl(aq) + NaOH(aq) ➔ NaCl(aq) + H₂O(l)</p>
   </div>
   <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mt-4">Procedure</h3>
   <ol className="list-decimal list-inside text-slate-600 dark:text-[#a1a1aa] space-y-2 text-sm">
    <li>Add exactly 25mL of <strong>0.1M NaOH</strong>.</li>
    <li>Add exactly 25mL of <strong>0.1M HCl</strong> (from prior titration knowledge, no indicator).</li>
    <li>Turn on the <strong>Bunsen Burner</strong> to evaporate the water.</li>
    <li>Observe the salt crystals remaining.</li>
   </ol>
  </div>
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-6 w-full text-left">Interactive Simulation</h2>
   <div className={`w-full bg-[#000000] dark:bg-[#121212] text-green-400 font-mono p-4 rounded-lg shadow-inner mb-6 min-h-[80px] flex items-center justify-center text-center text-lg flex-col `}>{equation}</div>
   
   <div className="flex gap-4 mb-8">
    <button onClick={() => setNaohAdded(true)} disabled={naohAdded} className="px-3 py-2 bg-slate-100 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded hover:bg-slate-200 dark:bg-[#121212] disabled:opacity-50 text-sm font-medium">Add 25mL NaOH</button>
    <button onClick={() => setHclAdded(true)} disabled={!naohAdded || hclAdded} className="px-3 py-2 bg-slate-100 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded hover:bg-slate-200 dark:bg-[#121212] disabled:opacity-50 text-sm font-medium">Add 25mL HCl</button>
   </div>

   <div className="relative w-64 h-64 flex flex-col items-center justify-end">
    {heating && waterLevel > 0 && (
     <div className="absolute top-10 flex gap-4 animate-bounce text-slate-400">
      <Flame size={20} className="opacity-50" />
      <Flame size={20} className="opacity-50" />
      <Flame size={20} className="opacity-50" />
     </div>
    )}
    <svg viewBox="0 0 100 50" className="w-48 h-24 drop-shadow-md z-10">
     <path d="M10,20 C10,50 90,50 90,20 L85,20 C85,45 15,45 15,20 Z" fill="rgba(255,255,255,0.9)" stroke="#94a3b8" strokeWidth="2" />
     {(naohAdded || hclAdded) && waterLevel > 0 && (
      <path d={`M20,${40 - waterLevel*0.15} C40,${45 - waterLevel*0.15} 60,${45 - waterLevel*0.15} 80,${40 - waterLevel*0.15} C80,45 20,45 20,${40 - waterLevel*0.15} Z`} fill="rgba(200, 230, 255, 0.6)" />
     )}
     {waterLevel === 0 && (
      <g fill="#fff" stroke="#cbd5e1" strokeWidth="0.5">
       <rect x="40" y="38" width="4" height="4" transform="rotate(15 40 38)" />
       <rect x="48" y="39" width="5" height="5" transform="rotate(45 48 39)" />
       <rect x="55" y="37" width="3" height="3" transform="rotate(10 55 37)" />
       <rect x="35" y="40" width="4" height="4" transform="rotate(60 35 40)" />
       <rect x="62" y="39" width="4" height="4" transform="rotate(30 62 39)" />
      </g>
     )}
    </svg>
    {/* Burner */}
    <div className={`w-16 h-12 border-x-4 border-t-4 border-[#1c1b1b] dark:border-[#1c1b1b] bg-slate-600 dark:bg-[#121212] rounded-t relative flex justify-center mt-2 flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
     {heating && <div className="absolute -top-6 text-orange-500 animate-pulse"><Flame size={32} /></div>}
    </div>
   </div>

   <div className="mt-8 flex gap-4">
    <button onClick={() => setHeating(true)} disabled={!hclAdded || waterLevel === 0 || heating} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"><Flame size={18} /> Turn On Heat</button>
    <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg transition-colors"><RotateCcw size={18} /> Reset</button>
   </div>
  </div>
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-6 `}>
   <div className="bg-orange-50 p-5 rounded-xl border border-orange-200 mt-auto">
    <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2"><Check size={20} /> Analysis Check</h3>
    <p className="text-sm text-orange-800 mb-4">What is the name of the process used to separate the dissolved salt from the water?</p>
    <div className="flex gap-2">
     <input type="text" value={assessmentAns} onChange={(e) => setAssessmentAns(e.target.value)} placeholder="Process name..." className="flex-1 px-3 py-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 dark:bg-[#121212]" />
     <button onClick={checkAns} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors font-medium dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40">Check</button>
    </div>
    {assessmentStatus === true && <p className="mt-2 text-sm text-green-700 font-semibold">Correct! Evaporation (or Crystallization) isolates the salt.</p>}
    {assessmentStatus === false && <p className="mt-2 text-sm text-red-600 font-semibold">Incorrect. Try "Evaporation" or "Crystallization".</p>}
   </div>
  </div>
  </div>
 </div>
 );
}
