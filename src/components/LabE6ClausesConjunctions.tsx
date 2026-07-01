import { useState } from 'react';
import { ArrowLeft, Check, RefreshCw, Settings, Sparkles, BookOpen , Sun, Moon} from 'lucide-react';
import type { MouseEvent } from 'react';
import { useTheme } from '../store';

type Part = { id: string; text: string; type: 'c1' | 'conj' | 'c2' };

const CLAUSES_1: Part[] = [
 { id: 'c1_1', text: "The robot completed the task", type: 'c1' },
 { id: 'c1_2', text: "I spoke to the engineer", type: 'c1' },
 { id: 'c1_3', text: "They built a spaceship", type: 'c1' },
 { id: 'c1_4', text: "The system crashed", type: 'c1' },
];

const CONJUNCTIONS: Part[] = [
 { id: 'conj_1', text: "because", type: 'conj' },
 { id: 'conj_2', text: "who", type: 'conj' },
 { id: 'conj_3', text: "which", type: 'conj' },
 { id: 'conj_4', text: "although", type: 'conj' },
];

const CLAUSES_2: Part[] = [
 { id: 'c2_1', text: "it was programmed flawlessly.", type: 'c2' },
 { id: 'c2_2', text: "designed the new core.", type: 'c2' },
 { id: 'c2_3', text: "can travel faster than light.", type: 'c2' },
 { id: 'c2_4', text: "we had tested it extensively.", type: 'c2' },
];

const VALID_WELDS = [
 "c1_1-conj_1-c2_1", // The robot completed the task because it was programmed flawlessly.
 "c1_2-conj_2-c2_2", // I spoke to the engineer who designed the new core.
 "c1_3-conj_3-c2_3", // They built a spaceship which can travel faster than light.
 "c1_4-conj_4-c2_4", // The system crashed although we had tested it extensively.
];

export default function LabE6ClausesConjunctions({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [selectedC1, setSelectedC1] = useState<string>("");
 const [selectedConj, setSelectedConj] = useState<string>("");
 const [selectedC2, setSelectedC2] = useState<string>("");
 
 const [weldedSentence, setWeldedSentence] = useState<string | null>(null);
 const [isWelding, setIsWelding] = useState(false);
 const [weldResult, setWeldResult] = useState<'success' | 'fail' | null>(null);

 const handleWeld = (e: MouseEvent<HTMLButtonElement>) => {
 e.preventDefault();
 if (!selectedC1 || !selectedConj || !selectedC2) return;
 setIsWelding(true);
 setWeldedSentence(null);
 setWeldResult(null);

 setTimeout(() => {
  setIsWelding(false);
  const comboId = `${selectedC1}-${selectedConj}-${selectedC2}`;
  const c1Text = CLAUSES_1.find(c => c.id === selectedC1)?.text;
  const conjText = CONJUNCTIONS.find(c => c.id === selectedConj)?.text;
  const c2Text = CLAUSES_2.find(c => c.id === selectedC2)?.text;
  setWeldedSentence(`${c1Text} ${conjText} ${c2Text}`);
  
  if (VALID_WELDS.includes(comboId)) {
  setWeldResult('success');
  } else {
  setWeldResult('fail');
  }
 }, 1500);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-900 dark:text-[#ffffff] selection:bg-indigo-200 dark:selection:bg-indigo-900">
  <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 dark:border-[#1c1b1b] shrink-0">
  <div className="flex items-center gap-4">
   <button 
   onClick={onExit}
   className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap flex-shrink-0"
   aria-label="Go back"
   >
   <ArrowLeft className="w-5 h-5" />
   </button>
   <h1 className="text-lg md:text-xl font-bold flex items-center gap-2">
   <Settings className="w-6 h-6 text-indigo-500" />
   Sentence Welder (Clauses & Conjunctions)
   </h1>
  </div>
  
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:bg-white/20 transition-colors shrink-0 ml-4 dark:bg-[#121212]"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  </header>

  <main className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden lg:overflow-y-auto">
  {/* Left Column */}
  <section className="w-full lg:w-1/3 flex flex-col border-r border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto">
   <div className="p-6 space-y-8">
   <div>
    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
    <BookOpen className="w-5 h-5 text-blue-500" />
    Theory & Setup
    </h2>
    <p className="text-sm text-slate-600 dark:text-[#71717a]">
    A <strong>clause</strong> contains a subject and a verb. 
    We use <strong>conjunctions</strong> and <strong>relative pronouns</strong> (who, which, that) to connect clauses. Choose pieces below to form a logical complex sentence!
    </p>
   </div>

   <div className="space-y-4">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff]">1. Independent Clause</h3>
    <div className="grid gap-2">
    {CLAUSES_1.map(c => (
     <button
     key={c.id}
     onClick={() => setSelectedC1(c.id)}
     className={`p-3 text-left rounded-lg border transition-colors whitespace-normal ${ selectedC1 === c.id ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/30 dark:border-blue-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-[#121212] dark:border-[#1c1b1b] dark:hover:bg-slate-700' }`}
     >
     {c.text}
     </button>
    ))}
    </div>
   </div>

   <div className="space-y-4">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff]">2. Conjunction / Pronoun</h3>
    <div className="flex flex-wrap gap-2">
    {CONJUNCTIONS.map(c => (
     <button
     key={c.id}
     onClick={() => setSelectedConj(c.id)}
     className={`px-4 py-2 rounded-full border font-medium transition-colors whitespace-nowrap flex-shrink-0 ${ selectedConj === c.id ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-[#121212] dark:border-[#1c1b1b] dark:hover:bg-slate-700' }`}
     >
     {c.text}
     </button>
    ))}
    </div>
   </div>

   <div className="space-y-4">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff]">3. Dependent Clause</h3>
    <div className="grid gap-2">
    {CLAUSES_2.map(c => (
     <button
     key={c.id}
     onClick={() => setSelectedC2(c.id)}
     className={`p-3 text-left rounded-lg border transition-colors whitespace-normal ${ selectedC2 === c.id ? 'bg-emerald-50 border-emerald-500 dark:bg-emerald-900/30 dark:border-emerald-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-[#121212] dark:border-[#1c1b1b] dark:hover:bg-slate-700' }`}
     >
     {c.text}
     </button>
    ))}
    </div>
   </div>

   <button
    onClick={handleWeld}
    disabled={!selectedC1 || !selectedConj || !selectedC2 || isWelding}
    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    {isWelding ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Settings className="w-5 h-5" />}
    {isWelding ? 'WELDING...' : 'WELD SENTENCE'}
   </button>
   </div>
  </section>

  {/* Right Column */}
  <section className="w-full lg:w-2/3 bg-slate-100 dark:bg-[#121212] p-6 flex flex-col relative lg:overflow-y-auto">
   <div className="flex-1 flex flex-col items-center justify-center min-h-[500px]">
   
   <div className="relative w-full max-w-2xl aspect-video bg-[#121212] rounded-xl overflow-hidden shadow-2xl border-4 border-[#1c1b1b] flex items-center justify-center mb-8">
    
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
     <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
    </pattern>
    <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    {!isWelding && !weldedSentence && (
    <div className="text-slate-500 flex flex-col items-center gap-4 z-10">
     <Settings className="w-16 h-16 opacity-50" />
     <p>Select your parts on the left and click WELD.</p>
    </div>
    )}
    
    {isWelding && (
    <div className="absolute inset-0 flex items-center justify-center bg-[#000000]/90 z-20">
     <div className="relative">
     <Settings className="w-24 h-24 text-yellow-400 animate-spin" />
     <Sparkles className="w-12 h-12 text-yellow-200 absolute -top-4 -right-4 animate-ping" />
     <Sparkles className="w-8 h-8 text-blue-300 absolute -bottom-2 -left-4 animate-pulse" />
     </div>
    </div>
    )}

    {weldedSentence && !isWelding && (
    <div className={`p-8 text-center transition-all transform scale-100 z-10 w-full ${weldResult === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
     <h3 className="text-2xl font-bold mb-4">
     {weldResult === 'success' ? 'Weld Successful!' : 'Structural Failure!'}
     </h3>
     <div className="bg-[#000000] p-6 rounded-lg shadow-inner border border-[#1c1b1b] text-xl font-mono leading-relaxed mx-4">
     <span className="text-blue-300">{CLAUSES_1.find(c => c.id === selectedC1)?.text}</span>
     <span className="text-indigo-400 mx-2 font-bold bg-indigo-900/30 px-2 rounded">{CONJUNCTIONS.find(c => c.id === selectedConj)?.text}</span>
     <span className="text-emerald-300">{CLAUSES_2.find(c => c.id === selectedC2)?.text}</span>
     </div>
     {weldResult === 'fail' && (
     <p className="mt-6 text-slate-300 max-w-md mx-auto">
      Warning: The independent clause does not logically or grammatically connect with this dependent clause using the chosen conjunction.
     </p>
     )}
     {weldResult === 'success' && (
     <p className="mt-6 text-slate-300 flex items-center justify-center gap-2">
      <Check className="w-5 h-5 text-emerald-400" /> Perfect complex sentence!
     </p>
     )}
    </div>
    )}
   </div>

   <div className="w-full max-w-2xl bg-white dark:!bg-[#121212] rounded-xl p-4 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h4 className="text-xs font-semibold text-slate-500 dark:text-[#71717a] mb-3 uppercase tracking-wider">Live Preview</h4>
    <div className="flex flex-col md:flex-row gap-3">
    <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800/50 min-h-[60px] flex items-center justify-center text-center text-sm font-medium dark:text-blue-200">
     {CLAUSES_1.find(c => c.id === selectedC1)?.text || "..."}
    </div>
    <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 rounded border border-indigo-200 dark:border-indigo-800/50 min-h-[60px] flex items-center justify-center text-center text-sm font-bold dark:text-indigo-200">
     {CONJUNCTIONS.find(c => c.id === selectedConj)?.text || "+"}
    </div>
    <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded border border-emerald-200 dark:border-emerald-800/50 min-h-[60px] flex items-center justify-center text-center text-sm font-medium dark:text-emerald-200">
     {CLAUSES_2.find(c => c.id === selectedC2)?.text || "..."}
    </div>
    </div>
   </div>

   </div>
  </section>
  </main>
 </div>
 );
}
