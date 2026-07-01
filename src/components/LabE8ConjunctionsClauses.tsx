import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Wrench, Zap , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

const WELD_QUESTIONS = [
 {
 id: 1,
 goal: "Use a coordinating conjunction (FANBOYS) to show contrast.",
 sentence: "The gears were rusted, ___ the machine still worked.",
 options: ["and", "but", "so", "or"],
 correct: "but",
 feedback: "'But' correctly coordinates two independent clauses while showing contrast."
 },
 {
 id: 2,
 goal: "Use a subordinating conjunction to show time relationship.",
 sentence: "___ the power was restored, the systems rebooted automatically.",
 options: ["After", "Because", "Unless", "Although"],
 correct: "After",
 feedback: "'After' creates a dependent clause indicating time."
 },
 {
 id: 3,
 goal: "Use a transition word (conjunctive adverb) to show result.",
 sentence: "The blueprints were lost. ___, the engineers had to redesign the engine.",
 options: ["However", "Consequently", "Furthermore", "Meanwhile"],
 correct: "Consequently",
 feedback: "'Consequently' links two independent clauses by showing effect."
 },
 {
 id: 4,
 goal: "Use a correlative conjunction pair to show negative alternatives.",
 sentence: "___ the supervisor ___ the manager knew about the safety violation.",
 options: ["Either / or", "Neither / nor", "Both / and", "Whether / or"],
 correct: "Neither / nor",
 feedback: "'Neither / nor' pairs up to negate both subjects."
 },
 {
 id: 5,
 goal: "Identify the dependent (subordinate) clause in this sentence.",
 sentence: "I will start the reactor when the temperature drops.",
 options: ["I will start the reactor", "when the temperature drops"],
 correct: "when the temperature drops",
 feedback: "The dependent clause starts with the subordinating conjunction 'when' and cannot stand alone."
 }
];

export default function LabE8ConjunctionsClauses({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [currentQIdx, setCurrentQIdx] = useState(0);
 const [selectedWord, setSelectedWord] = useState("");
 const [weldState, setWeldState] = useState<'idle' | 'welding' | 'success' | 'error'>('idle');

 const question = WELD_QUESTIONS[currentQIdx];

 const handleWeld = () => {
 if (!selectedWord) return;
 
 setWeldState('welding');
 
 setTimeout(() => {
  if (selectedWord === question.correct) {
  setWeldState('success');
  } else {
  setWeldState('error');
  }
 }, 1500);
 };

 const nextQuestion = () => {
 if (currentQIdx < WELD_QUESTIONS.length - 1) {
  setCurrentQIdx(q => q + 1);
  setSelectedWord("");
  setWeldState('idle');
 }
 };

 const formatSentence = (sentence: string, selected: string) => {
 if (!selected) return sentence;
 if (sentence.includes("___") && sentence.indexOf("___") !== sentence.lastIndexOf("___")) {
  const parts = selected.split(" / ");
  if (parts.length === 2) {
  let count = 0;
  return sentence.replace(/___/g, () => parts[count++] || "___");
  }
 }
 return sentence.replace("___", selected);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-[#000000]/50 dark:!bg-[#000000] dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">
  <header className="flex items-center p-4 bg-orange-600 dark:bg-orange-800 text-white shadow-md flex-shrink-0">
  <button 
   onClick={onExit} 
   className="flex items-center gap-2 hover:/20 px-3 py-1.5 rounded transition-colors whitespace-nowrap flex-shrink-0"
  >
   <ArrowLeft size={18} />
   Go Back
  </button>
  <h1 className="text-lg md:text-xl font-bold ml-6 flex-1 text-center">Syntax Welder: Conjunctions & Clauses</h1>
  
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:/20 transition-colors shrink-0 ml-4"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  </header>

  <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
  <div className="w-full lg:w-1/2 p-6 flex flex-col gap-6 lg:overflow-y-auto dark:bg-[#121212] border-r border-slate-200 dark:border-[#1c1b1b]">
   
   <div className="bg-orange-50 dark:bg-orange-900/50 dark:bg-orange-900/30 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
   <h2 className="text-sm font-bold text-orange-800 dark:text-orange-200 dark:text-orange-300 uppercase tracking-wider mb-2">Blueprint Goal</h2>
   <p className="text-lg font-medium">{question.goal}</p>
   </div>

   <div className="flex flex-col gap-4 flex-1">
   <div className="p-6 bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-slate-700 rounded-xl text-center text-xl font-mono text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] shadow-inner">
    {formatSentence(question.sentence, selectedWord)}
   </div>

   <div className="grid grid-cols-2 gap-3 mt-4">
    {question.options.map(opt => (
    <button
     key={opt}
     onClick={() => { setSelectedWord(opt); setWeldState('idle'); }}
     disabled={weldState === 'welding'}
     className={`px-4 py-3 rounded-lg border-2 text-md font-bold transition-all whitespace-nowrap flex-shrink-0 ${ selectedWord === opt ? 'border-orange-500 bg-orange-100 dark:bg-orange-900/50 dark:bg-orange-900/60 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 dark:text-orange-200' : 'border-slate-300 dark:border-slate-600 dark:border-slate-600 hover:border-orange-300 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] dark:text-[#ffffff] dark:text-[#ffffff]' } disabled:opacity-50`}
    >
     {opt}
    </button>
    ))}
   </div>

   <button
    onClick={handleWeld}
    disabled={!selectedWord || weldState === 'welding' || weldState === 'success'}
    className="mt-6 py-4 px-6 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-3 text-lg whitespace-nowrap flex-shrink-0 min-w-0 dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40"
   >
    {weldState === 'welding' ? (
    <span className="flex items-center gap-2 animate-pulse">
     <Zap size={24} className="text-yellow-300" /> Welding...
    </span>
    ) : (
    <span className="flex items-center gap-2">
     <Wrench size={24} /> Weld Clauses
    </span>
    )}
   </button>
   </div>

   {weldState === 'success' && (
   <div className="p-4 bg-green-50 dark:bg-green-900/50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl animate-[fadeIn_0.5s_ease-out]">
    <div className="flex items-start gap-3">
    <CheckCircle className="text-green-600 dark:text-green-400 dark:text-green-400 mt-0.5" size={20} />
    <div>
     <h3 className="font-bold text-green-800 dark:text-green-200 dark:text-green-300">Solid Weld!</h3>
     <p className="text-sm text-green-700 dark:text-green-300 dark:text-green-400 mt-1">{question.feedback}</p>
    </div>
    </div>
    {currentQIdx < WELD_QUESTIONS.length - 1 ? (
    <button
     onClick={nextQuestion}
     className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium w-full transition-colors whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
    >
     Next Blueprint
    </button>
    ) : (
    <div className="mt-4 text-center font-bold text-green-700 dark:text-green-300 dark:text-green-400">
     Master Welder! You've successfully completed all structural repairs.
    </div>
    )}
   </div>
   )}

   {weldState === 'error' && (
   <div className="p-4 bg-red-50 dark:bg-red-900/50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl animate-[fadeIn_0.5s_ease-out] flex items-center gap-3">
    <XCircle className="text-red-600 dark:text-red-400 dark:text-red-400 flex-shrink-0" size={20} />
    <p className="text-sm font-medium text-red-800 dark:text-red-200 dark:text-red-300">The weld broke! The logic doesn't hold. Try a different connection.</p>
   </div>
   )}

  </div>

  <div className="w-full lg:w-1/2 p-6 bg-[#000000] flex flex-col items-center justify-center relative overflow-hidden">
   <h2 className="absolute top-6 left-6 text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] font-bold tracking-widest uppercase text-sm flex items-center gap-2">
   <Zap size={16} className="text-yellow-400" /> Welder Bay
   </h2>
   
   <div className="relative w-full max-w-lg aspect-video flex items-center justify-center">
   
   <div 
    className={`absolute left-0 w-[48%] h-32 bg-gradient-to-r from-slate-600 to-slate-500 rounded-l-xl border-y-4 border-l-4 border-slate-400 shadow-[inset_0_4px_10px_rgba(255,255,255,0.2)] transition-transform duration-500 flex items-center justify-center ${ weldState === 'welding' ? 'translate-x-4' : weldState === 'success' ? 'translate-x-[4%]' : 'translate-x-0' }`}
   >
    <div className="absolute right-[-10px] w-6 h-full bg-slate-500 clip-jagged-right opacity-80 dark:bg-[#121212] dark:border-[#1c1b1b]"></div>
    <div className="w-4 h-4 rounded-full bg-[#121212] absolute left-4 top-4 shadow-inner"></div>
    <div className="w-4 h-4 rounded-full bg-[#121212] absolute left-4 bottom-4 shadow-inner"></div>
    <span className="text-slate-100 font-bold tracking-wider opacity-60 font-mono">CLAUSE A</span>
   </div>

   <div 
    className={`absolute right-0 w-[48%] h-32 bg-gradient-to-l from-slate-600 to-slate-500 rounded-r-xl border-y-4 border-r-4 border-slate-400 shadow-[inset_0_4px_10px_rgba(255,255,255,0.2)] transition-transform duration-500 flex items-center justify-center ${ weldState === 'welding' ? '-translate-x-4' : weldState === 'success' ? '-translate-x-[4%]' : 'translate-x-0' }`}
   >
    <div className="absolute left-[-10px] w-6 h-full bg-slate-500 clip-jagged-left opacity-80 dark:bg-[#121212] dark:border-[#1c1b1b]"></div>
    <div className="w-4 h-4 rounded-full bg-[#121212] absolute right-4 top-4 shadow-inner"></div>
    <div className="w-4 h-4 rounded-full bg-[#121212] absolute right-4 bottom-4 shadow-inner"></div>
    <span className="text-slate-100 font-bold tracking-wider opacity-60 font-mono">CLAUSE B</span>
   </div>

   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-40 flex items-center justify-center pointer-events-none">
    {weldState === 'welding' && (
    <>
     <div className="w-1 h-32 bg-yellow-100 dark:bg-yellow-900/50 dark:bg-yellow-900/60 animate-pulse shadow-[0_0_20px_10px_rgba(234,179,8,0.8)]"></div>
     {[...Array(10)].map((_, i) => (
     <div 
      key={i} 
      className={`absolute w-2 h-2 rounded-full bg-yellow-300 dark:bg-yellow-900/50 animate-ping`}
      style={{
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 0.5}s`,
      animationDuration: `${0.2 + Math.random() * 0.3}s`
      }}
     ></div>
     ))}
    </>
    )}

    {weldState === 'success' && (
    <div className="w-3 h-32 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-pulse border border-orange-300"></div>
    )}

    {weldState === 'error' && (
    <>
     <div className="w-1 h-32 bg-red-500 opacity-0 animate-flash"></div>
     {[...Array(5)].map((_, i) => (
     <div 
      key={i} 
      className="absolute w-3 h-3 bg-red-500 rotate-45 animate-ping"
      style={{
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`
      }}
     ></div>
     ))}
    </>
    )}
   </div>

   </div>

   <div className="mt-12 text-center text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] max-w-sm">
   <p className="text-sm font-medium">Select the correct logical connector to weld the clauses together successfully.</p>
   </div>

  </div>
  </div>
  
  <style>{`
  .clip-jagged-right {
   clip-path: polygon(0 0, 100% 10%, 80% 20%, 100% 30%, 80% 40%, 100% 50%, 80% 60%, 100% 70%, 80% 80%, 100% 90%, 0 100%);
  }
  .clip-jagged-left {
   clip-path: polygon(100% 0, 0 10%, 20% 20%, 0 30%, 20% 40%, 0 50%, 20% 60%, 0 70%, 20% 80%, 0 90%, 100% 100%);
  }
  @keyframes flash {
   0%, 100% { opacity: 0; }
   50% { opacity: 1; }
  }
  .animate-flash {
   animation: flash 0.5s ease-in-out;
  }
  @keyframes fadeIn {
   from { opacity: 0; transform: translateY(5px); }
   to { opacity: 1; transform: translateY(0); }
  }
  `}</style>
 </div>
 );
}
