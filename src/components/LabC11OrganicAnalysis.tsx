import { useState } from 'react';
import {Info, FlaskConical, Beaker, CheckCircle, RefreshCw } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
 onExit?: () => void;
}

type Reagent = 'Bromine Water' | 'Tollens' | '2,4-DNPH' | 'Iodoform' | 'Lucas' | 'None';

interface Compound {
 id: number;
 name: string;
 type: string;
 bromine: string;
 tollens: string;
 dnph: string;
 iodoform: string;
 lucas: string;
}

const compounds: Compound[] = [
 { id: 1, name: 'Hex-1-ene', type: 'Alkene', bromine: 'Decolorizes rapidly', tollens: 'No reaction', dnph: 'No reaction', iodoform: 'No reaction', lucas: 'No reaction' },
 { id: 2, name: 'Ethanal', type: 'Aldehyde', bromine: 'No reaction', tollens: 'Silver mirror forms', dnph: 'Orange precipitate', iodoform: 'Yellow precipitate', lucas: 'No reaction' },
 { id: 3, name: 'Propanone', type: 'Methyl Ketone', bromine: 'No reaction', tollens: 'No reaction', dnph: 'Orange precipitate', iodoform: 'Yellow precipitate', lucas: 'No reaction' },
 { id: 4, name: '2-Methylpropan-2-ol', type: 'Tertiary Alcohol', bromine: 'No reaction', tollens: 'No reaction', dnph: 'No reaction', iodoform: 'No reaction', lucas: 'Cloudiness immediately' },
 { id: 5, name: 'Ethanol', type: 'Primary Alcohol', bromine: 'No reaction', tollens: 'No reaction', dnph: 'No reaction', iodoform: 'Yellow precipitate', lucas: 'No reaction (heating required)' }
];

interface LogEntry {
 reagent: string;
 observation: string;
}

export default function LabC11OrganicAnalysis({ onExit }: Props) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [unknownIndex, setUnknownIndex] = useState<number>(0);
 const [activeReagent, setActiveReagent] = useState<Reagent>('None');
 const [logs, setLogs] = useState<LogEntry[]>([]);
 const [selectedType, setSelectedType] = useState<string>('');
 const [feedback, setFeedback] = useState<string | null>(null);

 const currentCompound = compounds[unknownIndex];

 const handleTest = (reagent: Reagent) => {
 setActiveReagent(reagent);
 
 let observation = 'No reaction';
 if (reagent === 'Bromine Water') observation = currentCompound.bromine;
 if (reagent === 'Tollens') observation = currentCompound.tollens;
 if (reagent === '2,4-DNPH') observation = currentCompound.dnph;
 if (reagent === 'Iodoform') observation = currentCompound.iodoform;
 if (reagent === 'Lucas') observation = currentCompound.lucas;

 // Check if already logged
 if (!logs.find(l => l.reagent === reagent)) {
  setLogs([...logs, { reagent, observation }]);
 }
 };

 const getTubeColor = () => {
 if (activeReagent === 'None') return 'bg-sky-100';
 
 let obs = '';
 if (activeReagent === 'Bromine Water') obs = currentCompound.bromine;
 if (activeReagent === 'Tollens') obs = currentCompound.tollens;
 if (activeReagent === '2,4-DNPH') obs = currentCompound.dnph;
 if (activeReagent === 'Iodoform') obs = currentCompound.iodoform;
 if (activeReagent === 'Lucas') obs = currentCompound.lucas;

 if (obs.includes('Decolorizes')) return 'bg-sky-50'; // colorless
 if (activeReagent === 'Bromine Water' && obs.includes('No reaction')) return 'bg-orange-300';
 if (obs.includes('Silver mirror')) return 'bg-slate-300 dark:bg-[#121212] border-4 border-slate-400 dark:border-slate-500';
 if (obs.includes('Orange precipitate')) return 'bg-orange-500';
 if (obs.includes('Yellow precipitate')) return 'bg-yellow-300';
 if (obs.includes('Cloudiness')) return 'bg-slate-200 dark:bg-[#121212] opacity-80';
 
 return 'bg-sky-100';
 };

 const checkAnswer = () => {
 if (selectedType === currentCompound.type) {
  setFeedback("Correct! You have successfully identified the functional group.");
 } else {
  setFeedback("Incorrect. Review your test results carefully.");
 }
 };

 const newUnknown = () => {
 let next = Math.floor(Math.random() * compounds.length);
 if (next === unknownIndex) next = (next + 1) % compounds.length;
 setUnknownIndex(next);
 setLogs([]);
 setActiveReagent('None');
 setFeedback(null);
 setSelectedType('');
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  {/* Header */}
  <LabHeader onExit={onExit} title="Organic Qualitative Analysis" />

  {/* Main Grid */}
  
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:min-h-0 overflow-y-auto lg:overflow-visible">
  
  {/* Column 1: Theory */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <Info className="w-5 h-5 text-indigo-600" /> Test Reagents
   </h2>
   
   <div className="space-y-3 text-sm text-slate-700 dark:text-[#ffffff]">
   <div className={`p-3 border-l-4 border-orange-500 bg-orange-50 flex-col `}>
    <span className="font-bold">Bromine Water:</span> Tests for unsaturation (C=C). Brown/orange color decolorizes.
   </div>
   <div className={`p-3 border-l-4 border-slate-400 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] flex-col `}>
    <span className="font-bold">Tollens' Reagent:</span> Ammoniacal silver nitrate. Aldehydes reduce Ag+ to Ag(s), forming a silver mirror.
   </div>
   <div className={`p-3 border-l-4 border-orange-600 bg-orange-50 flex-col `}>
    <span className="font-bold">2,4-DNPH:</span> Brady's reagent. Tests for carbonyls (aldehydes/ketones). Forms orange precipitate.
   </div>
   <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
    <span className="font-bold">Iodoform Test:</span> I2 in NaOH. Tests for methyl ketones (CH3CO-) or alcohols that oxidize to them. Forms yellow precipitate (CHI3).
   </div>
   <div className="p-3 border-l-4 border-zinc-400 bg-zinc-50">
    <span className="font-bold">Lucas Test:</span> ZnCl2 in HCl. Differentiates alcohols. 3° react immediately (cloudy), 2° in 5 mins, 1° no reaction at room temp.
   </div>
   </div>
  </div>

  {/* Column 2: Simulator */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col items-center lg: ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2 w-full text-center">Interactive Test Rack</h2>
   <p className="text-sm text-slate-500 dark:text-[#71717a] mb-6 text-center">Select a reagent to add to Unknown {currentCompound.id}</p>

   {/* Test Tube Graphic */}
   <div className="relative w-32 h-64 mb-8 shrink-0">
   <div className="absolute inset-0 border-4 border-t-0 border-slate-300 dark:border-[#1c1b1b] rounded-b-full bg-slate-50 dark:bg-[#121212] overflow-hidden flex items-end">
    <div className={`w-full h-2/3 ${getTubeColor()} transition-colors duration-1000 relative`}>
    {/* Bubble animations if reacting */}
    {activeReagent !== 'None' && getTubeColor() !== 'bg-sky-100' && (
     <div className="absolute inset-0 flex justify-center items-end opacity-50">
     <div className="w-2 h-2 bg-slate-50 dark:bg-[#121212] rounded-full animate-ping mb-2 mx-1"></div>
     <div className="w-1.5 h-1.5 bg-slate-50 dark:bg-[#121212] rounded-full animate-bounce mb-4 mx-1 delay-75"></div>
     <div className="w-2.5 h-2.5 bg-slate-50 dark:bg-[#121212] rounded-full animate-pulse mb-1 mx-1 delay-150"></div>
     </div>
    )}
    </div>
   </div>
   <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-36 h-4 bg-slate-200 dark:bg-[#121212] rounded-full opacity-50 blur-sm"></div>
   </div>

   {/* Reagent Buttons */}
   <div className="grid grid-cols-2 gap-2 w-full max-w-sm ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   {(['Bromine Water', 'Tollens', '2,4-DNPH', 'Iodoform', 'Lucas'] as Reagent[]).map((reagent) => (
    <button
    key={reagent}
    onClick={() => handleTest(reagent)}
    className={`flex flex-col items-center justify-center p-2 rounded border text-xs font-medium transition-colors ${activeReagent === reagent ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-slate-50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:bg-slate-100 dark:bg-[#121212]'}`}
    >
    <FlaskConical className="w-5 h-5 mb-1" />
    {reagent}
    </button>
   ))}
   </div>
   
   <button onClick={() => setActiveReagent('None')} className="mt-4 text-xs text-slate-500 dark:text-[#71717a] hover:text-slate-700 dark:text-[#ffffff] flex items-center gap-1 shrink-0">
   <RefreshCw className="w-3 h-3" /> Wash Tube
   </button>
  </div>

  {/* Column 3: Analysis */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col lg:overflow-y-auto `}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <Beaker className="w-5 h-5 text-indigo-600" /> Data Logging
   </h2>

   <div className="bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b] p-3 mb-4 min-h-[150px] lg:overflow-y-auto">
   <table className="w-full text-sm text-left">
    <thead>
    <tr className="border-b border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa]">
     <th className="py-1">Reagent Added</th>
     <th className="py-1">Observation</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 ? (
     <tr><td colSpan={2} className="py-4 text-center text-slate-400 italic">No tests performed yet.</td></tr>
    ) : (
     logs.map((log, i) => (
     <tr key={i} className="border-b border-slate-100">
      <td className="py-2 font-medium text-indigo-700">{log.reagent}</td>
      <td className="py-2">{log.observation}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

   <div className="mt-auto pt-4 border-t border-slate-200 dark:border-[#1c1b1b] shrink-0">
   <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-2">Identify the Unknown</h3>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">Based on your observations, what functional group class is present?</p>
   
   <select 
    value={selectedType}
    onChange={(e) => setSelectedType(e.target.value)}
    className="w-full p-2 mb-3 border border-slate-300 dark:border-[#1c1b1b] rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
   >
    <option value="">Select class...</option>
    {Array.from(new Set(compounds.map(c => c.type))).map(t => (
    <option key={t} value={t}>{t}</option>
    ))}
   </select>

   <button 
    onClick={checkAnswer}
    disabled={!selectedType || logs.length === 0}
    className="w-full bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    <CheckCircle className="w-4 h-4" /> Submit Identification
   </button>

   {feedback && (
    <div className={`mt-3 p-3 rounded text-sm font-medium ${feedback.includes('Correct') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
    {feedback}
    </div>
   )}

   <button onClick={newUnknown} className="mt-4 w-full text-sm text-indigo-600 font-medium hover:underline flex justify-center items-center gap-1">
    <RefreshCw className="w-4 h-4" /> Load New Unknown
   </button>
   </div>
  </div>

  </div>
 </div>
 );
}
