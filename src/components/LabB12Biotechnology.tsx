import { useState } from 'react';
import { Play, CheckCircle, Search, Scissors, Link } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabB12Biotechnology({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [plasmidState, setPlasmidState] = useState<'intact' | 'cut' | 'inserted' | 'ligated'>('intact');
 const [pcrCycles, setPcrCycles] = useState(0);
 const [pcrTemp, setPcrTemp] = useState(25);
 const [isCycling, setIsCycling] = useState(false);
 const [ans1, setAns1] = useState('');
 const [ans2, setAns2] = useState('');
 const [feedback, setFeedback] = useState('');

 const runPcrCycle = () => {
 if (plasmidState !== 'ligated') return;
 if (isCycling) return;
 setIsCycling(true);
 
 // Simulate temp changes
 setTimeout(() => setPcrTemp(95), 500);
 setTimeout(() => setPcrTemp(55), 1500);
 setTimeout(() => setPcrTemp(72), 2500);
 setTimeout(() => {
  setPcrTemp(25);
  setPcrCycles(c => c + 1);
  setIsCycling(false);
 }, 3500);
 };

 const checkAnswers = () => {
 let score = 0;
 if (ans1.trim() === '1024') score++;
 if (ans2.trim().toLowerCase() === 'sticky') score++;
 
 if (score === 2) setFeedback('Excellent! Both answers are correct.');
 else setFeedback(`You got ${score}/2 correct. Keep trying!`);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Genetic Engineering & PCR" subtitle="Recombinant DNA & Thermocycling" />

  
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
  <main className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:min-h-0 overflow-y-auto lg:overflow-visible">
  {/* Theory */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">Theory & Context</h2>
   <div className="space-y-4 text-sm text-slate-600 dark:text-[#a1a1aa]">
   <p>
    <strong>Recombinant DNA Technology:</strong> This process involves isolating a gene of interest (e.g., human insulin) and inserting it into a bacterial plasmid vector.
   </p>
   <p>
    <strong>Restriction Endonucleases:</strong> Enzymes like <em>EcoRI</em> cut DNA at specific recognition sequences (e.g., <code>5'-GAATTC-3'</code>), often leaving overhanging "sticky ends" that facilitate complementary base pairing.
   </p>
   <p>
    <strong>DNA Ligase:</strong> Forms phosphodiester bonds between adjacent nucleotides to covalently seal the recombinant plasmid.
   </p>
   <p>
    <strong>Polymerase Chain Reaction (PCR):</strong> Amplifies DNA exponentially.
    <ul className="list-disc pl-5 mt-2 space-y-1">
    <li><strong>Denaturation (94-96°C):</strong> Hydrogen bonds break, separating DNA strands.</li>
    <li><strong>Annealing (50-65°C):</strong> Primers bind to complementary target sequences.</li>
    <li><strong>Extension (72°C):</strong> <em>Taq</em> polymerase synthesizes the new strand.</li>
    </ul>
   </p>
   </div>
  </div>

  {/* Interactive */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">Simulation Workspace</h2>
   
   <div className="flex-1 flex flex-col items-center justify-center space-y-8">
   <div className={`relative w-64 h-64 bg-slate-100 dark:bg-[#121212] rounded-full flex items-center justify-center shadow-inner border border-slate-300 dark:border-[#1c1b1b] flex-col `}>
    {/* Plasmid SVG */}
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
    <circle cx="100" cy="100" r="70" fill="none" stroke="#cbd5e1" strokeWidth="16" />
    
    {/* Bacterial DNA */}
    <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" strokeWidth="16" 
     strokeDasharray={plasmidState === 'intact' ? "440" : "340 100"}
     strokeDashoffset="110"
     className="transition-all duration-700" />
    
    {plasmidState === 'inserted' && (
     <path d="M 125 35 A 70 70 0 0 1 170 100" fill="none" stroke="#ef4444" strokeWidth="16" className="animate-pulse" />
    )}
    {plasmidState === 'ligated' && (
     <path d="M 125 35 A 70 70 0 0 1 170 100" fill="none" stroke="#ef4444" strokeWidth="16" />
    )}
    </svg>
    
    <div className="absolute inset-0 flex items-center justify-center flex-col">
    <span className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-wider">Plasmid Vector</span>
    </div>
   </div>

   <div className="flex gap-2">
    <button 
    onClick={() => setPlasmidState('cut')}
    disabled={plasmidState !== 'intact'}
    className={`flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 disabled:opacity-50 text-sm font-medium flex-col `}>
    <Scissors className="w-4 h-4" /> EcoRI
    </button>
    <button 
    onClick={() => setPlasmidState('inserted')}
    disabled={plasmidState !== 'cut'}
    className={`flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 text-sm font-medium flex-col `}>
    <Search className="w-4 h-4" /> Insulin Gene
    </button>
    <button 
    onClick={() => setPlasmidState('ligated')}
    disabled={plasmidState !== 'inserted'}
    className="flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 disabled:opacity-50 text-sm font-medium">
    <Link className="w-4 h-4" /> Ligase
    </button>
   </div>

   {/* PCR Section */}
   <div className={`w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] rounded-lg p-4 border border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] transition-opacity ${plasmidState === 'ligated' ? 'opacity-100' : 'opacity-40 pointer-events-none'} ${activeMobileTab 'lab' 'block' 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    <div className="flex justify-between items-center mb-2">
    <h3 className="font-bold text-slate-700 dark:text-[#ffffff]">PCR Thermocycler</h3>
    <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded dark:text-[#ffffff]">Temp: {pcrTemp}°C</span>
    </div>
    <div className="flex items-center gap-4">
    <button 
     onClick={runPcrCycle}
     disabled={isCycling}
     className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
     <Play className="w-4 h-4" /> Run Cycle
    </button>
    <div className="flex-1 bg-slate-200 dark:bg-[#121212] h-2 rounded-full lg:overflow-hidden">
     <div className="bg-blue-500 h-full transition-all duration-300 dark:bg-teal-950/20 dark:border-teal-900" style={{ width: `${(pcrTemp / 100) * 100}%` }}></div>
    </div>
    <div className="text-right">
     <div className="text-xs text-slate-500 dark:text-[#71717a]">Cycles</div>
     <div className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{pcrCycles}</div>
    </div>
    </div>
    <div className="mt-3 text-center text-xs font-medium text-slate-500 dark:text-[#71717a]">
    Copies: {Math.pow(2, pcrCycles)}
    </div>
   </div>
   </div>
  </div>

  {/* Assessment */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col lg:overflow-y-auto">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">Data Log & Assessment</h2>
   
   <div className="space-y-6">
   <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    1. If you run 10 full PCR cycles starting with 1 recombinant plasmid, how many total copies of the target DNA sequence will you have?
    </label>
    <input 
    type="number" 
    className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono"
    value={ans1}
    onChange={e => setAns1(e.target.value)}
    placeholder="e.g. 1024"
    />
   </div>

   <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    2. EcoRI recognizes the sequence GAATTC and cuts between G and A. What type of ends does this enzyme produce? (Enter "sticky" or "blunt")
    </label>
    <input 
    type="text" 
    className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-blue-500 outline-none"
    value={ans2}
    onChange={e => setAns2(e.target.value)}
    placeholder="Type here..."
    />
   </div>

   <button 
    onClick={checkAnswers}
    className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
    <CheckCircle className="w-5 h-5" /> Check Answers
   </button>

   {feedback && (
    <div className={`p-3 rounded text-sm font-medium ${feedback.includes('Excellent') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
    {feedback}
    </div>
   )}
   </div>
  </div>
  </main>
 </div>
 );
}
