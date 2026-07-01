import { useState, useEffect } from 'react';
import { Beaker, Calculator, Database, Flame, Filter } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC11Stoichiometry({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [salicylicMass, setSalicylicMass] = useState(2.0); // g
 const [anhydrideVol, setAnhydrideVol] = useState(5.0); // mL
 const [temperature, setTemperature] = useState(25); // C
 
 const [stage, setStage] = useState<'mixed' | 'heated' | 'filtered'>('mixed');
 const [actualYield, setActualYield] = useState<number | null>(null);
 const [yieldPercentageNoise, setYieldPercentageNoise] = useState(0.8);
 
 useEffect(() => {
 setYieldPercentageNoise(0.75 + Math.random() * 0.1);
 }, []);

 const heatMixture = () => {
 if (temperature >= 80) setStage('heated');
 };
 
 const filterMixture = () => {
 if (stage !== 'heated') return;
 const molesSA = salicylicMass / 138.12;
 const molesAA = (anhydrideVol * 1.08) / 102.09;
 const limitingMoles = Math.min(molesSA, molesAA);
 const theoreticalYield = limitingMoles * 180.16;
 
 setActualYield(theoreticalYield * yieldPercentageNoise);
 setStage('filtered');
 };

 const [logs, setLogs] = useState<{sa: number, aa: number, actual: number}[]>([]);
 const logData = () => {
 if (actualYield !== null) {
  setLogs([...logs, {sa: salicylicMass, aa: anhydrideVol, actual: actualYield}]);
 }
 };

 const resetExperiment = () => {
 setStage('mixed');
 setActualYield(null);
 setTemperature(25);
 setYieldPercentageNoise(0.75 + Math.random() * 0.1);
 };

 // Assessment
 const [answerYield, setAnswerYield] = useState('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
 
 const checkAnswer = () => {
 if (actualYield === null) return;
 const molesSA = salicylicMass / 138.12;
 const molesAA = (anhydrideVol * 1.08) / 102.09;
 const limitingMoles = Math.min(molesSA, molesAA);
 const expectedTheory = limitingMoles * 180.16;
 const expectedPercent = (actualYield / expectedTheory) * 100;
 
 const parsed = parseFloat(answerYield);
 if (!isNaN(parsed) && Math.abs(parsed - expectedPercent) < 2.0) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Stoichiometry: Aspirin Synthesis" />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >Lab</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
  
  {/* Column 1 */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6  ? 'flex' : 'hidden'} lg:flex`}>
   <div>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
    <Beaker className="w-5 h-5 text-sky-500" />
    Wet Lab Reagents
   </h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed mb-2">
    Reaction: Salicylic Acid + Acetic Anhydride → Aspirin + Acetic Acid.
   </p>
   <ul className="text-xs text-slate-500 dark:text-[#71717a] mb-4 list-disc pl-4">
    <li>Salicylic Acid (SA): 138.12 g/mol</li>
    <li>Acetic Anhydride (AA): 102.09 g/mol, d=1.08 g/mL</li>
    <li>Aspirin: 180.16 g/mol</li>
   </ul>
   </div>

   <div className={`flex-1 bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
   <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Salicylic Acid (g): {salicylicMass}</label>
   <input 
    type="range" min="1.0" max="10.0" step="0.5" disabled={stage !== 'mixed'}
    value={salicylicMass} onChange={(e) => setSalicylicMass(parseFloat(e.target.value))}
    className="w-full mb-4 accent-sky-600"
   />

   <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Acetic Anhydride (mL): {anhydrideVol}</label>
   <input 
    type="range" min="2.0" max="15.0" step="0.5" disabled={stage !== 'mixed'}
    value={anhydrideVol} onChange={(e) => setAnhydrideVol(parseFloat(e.target.value))}
    className="w-full mb-6 accent-sky-600"
   />

   <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Hot Plate Temp (°C): {temperature}</label>
   <input 
    type="range" min="25" max="100" step="5" disabled={stage === 'filtered'}
    value={temperature} onChange={(e) => setTemperature(parseInt(e.target.value))}
    className="w-full mb-6 accent-red-500"
   />

   <div className="flex gap-2">
    <button 
    onClick={heatMixture} disabled={temperature < 80 || stage !== 'mixed'}
    className={`flex-1 py-2 bg-red-500 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40 `}
    >
    <Flame className="w-4 h-4" /> Heat
    </button>
    <button 
    onClick={filterMixture} disabled={stage !== 'heated'}
    className={`flex-1 py-2 bg-slate-700 dark:bg-[#121212] disabled:opacity-50 text-white rounded-lg font-semibold flex items-center justify-center gap-2 `}
    >
    <Filter className="w-4 h-4" /> Filter
    </button>
   </div>
   
   <button onClick={resetExperiment} className={`w-full mt-3 py-2 text-slate-600 dark:text-[#a1a1aa] border border-slate-300 dark:border-[#1c1b1b] rounded-lg font-semibold hover:bg-slate-100 dark:bg-[#121212] flex-col `}>
    Reset Glassware
   </button>
   </div>
  </div>

  {/* Column 2 */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center justify-center  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] w-full mb-4 text-center">Reaction Beaker</h2>
   
   <svg viewBox="0 0 200 300" className="w-full h-80 bg-slate-100 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
   <path d="M 50 50 L 50 250 A 20 20 0 0 0 70 270 L 130 270 A 20 20 0 0 0 150 250 L 150 50" fill="none" stroke="#cbd5e1" strokeWidth="4" />
   
   {stage === 'mixed' && (
    <path d="M 52 150 L 148 150 L 148 250 A 18 18 0 0 1 130 268 L 70 268 A 18 18 0 0 1 52 250 Z" fill="#bae6fd" opacity="0.8" />
   )}
   {stage === 'heated' && (
    <path d="M 52 150 L 148 150 L 148 250 A 18 18 0 0 1 130 268 L 70 268 A 18 18 0 0 1 52 250 Z" fill="#fde047" opacity="0.8" />
   )}
   {stage === 'filtered' && (
    <path d="M 60 250 L 140 250 L 130 265 L 70 265 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
   )}

   {temperature > 50 && stage !== 'filtered' && (
    <g className="animate-pulse">
    <path d="M 80 280 Q 90 270 100 280 T 120 280" fill="none" stroke="#ef4444" strokeWidth="3" />
    <path d="M 90 290 Q 100 280 110 290" fill="none" stroke="#f97316" strokeWidth="3" />
    </g>
   )}
   
   {stage === 'filtered' && actualYield !== null && (
    <text x="100" y="220" textAnchor="middle" className="text-xs font-bold fill-slate-700 bg-slate-50 dark:bg-[#121212]">Yield: {actualYield.toFixed(2)} g</text>
   )}
   </svg>

   {stage === 'filtered' && (
   <button onClick={logData} className="mt-6 px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-lg font-semibold flex items-center gap-2">
    <Database className="w-4 h-4" /> Save Lab Result
   </button>
   )}
  </div>

  {/* Column 3 */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col gap-6 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <div className="flex-1">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
    <Database className="w-5 h-5 text-emerald-500" />
    Experiment Log
   </h2>
   <div className="lg:overflow-y-auto max-h-48 border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
    <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff] sticky top-0">
     <tr>
     <th className="px-3 py-2">SA (g)</th>
     <th className="px-3 py-2">AA (mL)</th>
     <th className="px-3 py-2">Actual (g)</th>
     </tr>
    </thead>
    <tbody>
     {logs.length === 0 ? (
     <tr><td colSpan={3} className="px-3 py-4 text-center text-slate-500 dark:text-[#71717a] italic">No yields recorded.</td></tr>
     ) : (
     logs.map((l, i) => (
      <tr key={i} className="border-b border-slate-100">
      <td className="px-3 py-2">{l.sa}</td>
      <td className="px-3 py-2">{l.aa}</td>
      <td className="px-3 py-2 font-bold text-sky-700">{l.actual.toFixed(2)}</td>
      </tr>
     ))
     )}
    </tbody>
    </table>
   </div>
   </div>

   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
    <Calculator className="w-5 h-5 text-indigo-500" />
    Yield Analysis
   </h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    Based on your most recent actual yield, calculate the <strong>Percent Yield (%)</strong> of Aspirin for this reaction. Determine the limiting reagent first!
   </p>
   <div className="flex gap-2">
    <input 
    type="number" step="0.1" placeholder="Percent Yield %" disabled={stage !== 'filtered'}
    value={answerYield} onChange={(e) => setAnswerYield(e.target.value)}
    className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
    />
    <button 
    onClick={checkAnswer} disabled={stage !== 'filtered'}
    className="px-4 py-2 bg-indigo-500 disabled:opacity-50 hover:bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
     Check
    </button>
   </div>
   {isCorrect === true && <p className="text-emerald-600 text-sm font-bold mt-2">Correct! Good analytical technique.</p>}
   {isCorrect === false && <p className="text-red-500 text-sm font-bold mt-2">Incorrect. Check your limiting reactant math.</p>}
   </div>
  </div>

  </div>
 </div>
 );
}
