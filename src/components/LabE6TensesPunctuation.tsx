import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Search, Check, AlertCircle, FastForward , Sun, Moon} from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useTheme } from '../store';

// Data
const TENSES = [
 { id: 'past_perfect', name: 'Past Perfect', key: 'pastPerf', desc: 'Completed before another past action.', color: 'text-indigo-500', bg: 'bg-indigo-500', border: 'border-indigo-500' },
 { id: 'simple_past', name: 'Simple Past', key: 'past', desc: 'Completed in the past.', color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500' },
 { id: 'past_continuous', name: 'Past Continuous', key: 'pastCont', desc: 'Ongoing in the past.', color: 'text-cyan-500', bg: 'bg-cyan-500', border: 'border-cyan-500' },
 { id: 'present_perfect', name: 'Present Perfect', key: 'presPerf', desc: 'Started in past, relevant now.', color: 'text-teal-500', bg: 'bg-teal-500', border: 'border-teal-500' }
] as const;

const VERBS = [
 { base: 'eat', past: 'ate', pastCont: ['was eating', 'were eating'], presPerf: ['has eaten', 'have eaten'], pastPerf: 'had eaten' },
 { base: 'travel', past: 'travelled', pastCont: ['was travelling', 'were travelling'], presPerf: ['has travelled', 'have travelled'], pastPerf: 'had travelled' },
 { base: 'write', past: 'wrote', pastCont: ['was writing', 'were writing'], presPerf: ['has written', 'have written'], pastPerf: 'had written' },
 { base: 'begin', past: 'began', pastCont: ['was beginning', 'were beginning'], presPerf: ['has begun', 'have begun'], pastPerf: 'had begun' }
];

const GERUND_TASKS = [
 {
 id: 1,
 sentence: "Reading books improves your vocabulary.",
 words: [
  { text: "Reading", isGerund: true },
  { text: "books", isGerund: false },
  { text: "improves", isGerund: false },
  { text: "your", isGerund: false },
  { text: "vocabulary.", isGerund: false },
 ]
 },
 {
 id: 2,
 sentence: "She was swimming in the pool.",
 words: [
  { text: "She", isGerund: false },
  { text: "was", isGerund: false },
  { text: "swimming", isGerund: false }, // Participle
  { text: "in", isGerund: false },
  { text: "the", isGerund: false },
  { text: "pool.", isGerund: false },
 ]
 },
 {
 id: 3,
 sentence: "His favorite hobby is painting.",
 words: [
  { text: "His", isGerund: false },
  { text: "favorite", isGerund: false },
  { text: "hobby", isGerund: false },
  { text: "is", isGerund: false },
  { text: "painting.", isGerund: true },
 ]
 }
];

export default function LabE6TensesPunctuation({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [activeTab, setActiveTab] = useState<'tenses' | 'gerunds'>('tenses');

 // Tenses State
 const [timelineIndex, setTimelineIndex] = useState(1);
 const [selectedVerbIdx, setSelectedVerbIdx] = useState(0);
 const [userConjugation, setUserConjugation] = useState("");
 const [conjFeedback, setConjFeedback] = useState<'success' | 'error' | null>(null);

 // Gerunds State
 const [activeSentenceIdx, setActiveSentenceIdx] = useState(0);
 const [selectedWords, setSelectedWords] = useState<number[]>([]);
 const [gerundFeedback, setGerundFeedback] = useState<'success' | 'error' | null>(null);

 // Reset feedback on changes
 useEffect(() => {
 setConjFeedback(null);
 setUserConjugation("");
 }, [timelineIndex, selectedVerbIdx]);

 useEffect(() => {
 setGerundFeedback(null);
 setSelectedWords([]);
 }, [activeSentenceIdx]);

 const handleCheckConjugation = () => {
 const targetTenseKey = TENSES[timelineIndex].key;
 const correctForms = VERBS[selectedVerbIdx][targetTenseKey];
 
 let isCorrect = false;
 const answer = userConjugation.trim().toLowerCase();
 
 if (Array.isArray(correctForms)) {
  isCorrect = correctForms.includes(answer);
 } else {
  isCorrect = correctForms === answer;
 }
 
 setConjFeedback(isCorrect ? 'success' : 'error');
 };

 const toggleWord = (idx: number) => {
 if (gerundFeedback === 'success') return;
 setSelectedWords(prev => 
  prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
 );
 };

 const handleCheckGerunds = () => {
 const task = GERUND_TASKS[activeSentenceIdx];
 const correctIndices = task.words.map((w, i) => w.isGerund ? i : -1).filter(i => i !== -1);
 
 // Check if arrays have same elements
 const isCorrect = selectedWords.length === correctIndices.length && 
      selectedWords.every(w => correctIndices.includes(w));
      
 setGerundFeedback(isCorrect ? 'success' : 'error');
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-900 dark:text-[#ffffff]">
  <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 dark:border-[#1c1b1b] shrink-0">
  <div className="flex items-center gap-4">
   <button 
   onClick={onExit}
   className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap flex-shrink-0"
   >
   <ArrowLeft className="w-5 h-5" />
   </button>
   <h1 className="text-lg md:text-xl font-bold flex items-center gap-2">
   <Clock className="w-6 h-6 text-blue-500" />
   Tenses & Punctuation Lab
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
  {/* Left Column: Interactive Controls */}
  <section className="w-full lg:w-1/3 flex flex-col border-r border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto p-6">
   
   <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg mb-8 shrink-0">
   <button 
    onClick={() => setActiveTab('tenses')}
    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap flex-shrink-0 ${activeTab === 'tenses' ? ' shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-300 dark:hover:bg-slate-600'}`}
   >
    Time Machine (Tenses)
   </button>
   <button 
    onClick={() => setActiveTab('gerunds')}
    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap flex-shrink-0 ${activeTab === 'gerunds' ? ' shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-300 dark:hover:bg-slate-600'}`}
   >
    Gerund Scanner
   </button>
   </div>

   {activeTab === 'tenses' && (
   <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
    <div>
    <h2 className="text-lg font-semibold mb-2">Configure Time Machine</h2>
    <p className="text-sm text-slate-600 dark:text-[#71717a]">
     Select a base verb and a destination time period. Then conjugate the verb correctly to power the machine.
    </p>
    </div>

    <div className="space-y-4">
    <label className="block text-sm font-bold text-slate-700 dark:text-[#a1a1aa]">1. Base Verb</label>
    <div className="grid grid-cols-2 gap-2">
     {VERBS.map((v, i) => (
     <button
      key={v.base}
      onClick={() => setSelectedVerbIdx(i)}
      className={`py-2 px-3 rounded-lg border font-mono text-center transition-colors whitespace-nowrap flex-shrink-0 ${ selectedVerbIdx === i ? 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-[#121212] dark:border-[#1c1b1b] dark:hover:bg-slate-700' }`}
     >
      to {v.base}
     </button>
     ))}
    </div>
    </div>

    <div className="space-y-4">
    <label className="block text-sm font-bold text-slate-700 dark:text-[#a1a1aa] flex items-center justify-between">
     <span>2. Target Timeline (Tense)</span>
     <span className={`text-xs px-2 py-1 rounded-full text-white ${TENSES[timelineIndex].bg}`}>
     {TENSES[timelineIndex].name}
     </span>
    </label>
    <input 
     type="range" 
     min="0" 
     max="3" 
     value={timelineIndex} 
     onChange={(e) => setTimelineIndex(parseInt(e.target.value))}
     className="w-full accent-blue-600"
    />
    <div className="flex justify-between text-xs text-slate-400">
     <span>Distant Past</span>
     <span>Recent</span>
    </div>
    </div>

    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-[#1c1b1b]">
    <label className="block text-sm font-bold text-slate-700 dark:text-[#a1a1aa]">
     3. Input Conjugation
    </label>
    <div className="flex gap-2">
     <input
     type="text"
     value={userConjugation}
     onChange={(e: ChangeEvent<HTMLInputElement>) => setUserConjugation(e.target.value)}
     placeholder={`e.g. ${VERBS[selectedVerbIdx].past}`}
     className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
     />
     <button
     onClick={handleCheckConjugation}
     className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
     >
     <Check className="w-4 h-4" />
     Verify
     </button>
    </div>
    
    {conjFeedback === 'success' && (
     <div className="p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-lg flex items-start gap-2">
     <Check className="w-5 h-5 shrink-0 mt-0.5" />
     <p className="text-sm">Time Machine charged! The conjugation is correct.</p>
     </div>
    )}
    {conjFeedback === 'error' && (
     <div className="p-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg flex items-start gap-2">
     <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
     <p className="text-sm">Incorrect conjugation. Check your auxiliary verbs and spelling!</p>
     </div>
    )}
    </div>
   </div>
   )}

   {activeTab === 'gerunds' && (
   <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
    <div>
    <h2 className="text-lg font-semibold mb-2">Gerund Scanner</h2>
    <p className="text-sm text-slate-600 dark:text-[#71717a]">
     A <strong>gerund</strong> is a verb ending in <em>-ing</em> that acts as a <strong>noun</strong>. Don't confuse it with a present participle used in continuous tenses!
    </p>
    </div>

    <div className="space-y-4">
    <div className="flex items-center justify-between">
     <h3 className="font-bold text-slate-800 dark:text-[#ffffff]">Task {activeSentenceIdx + 1} of {GERUND_TASKS.length}</h3>
     <button 
     onClick={() => setActiveSentenceIdx((prev) => (prev + 1) % GERUND_TASKS.length)}
     className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline whitespace-nowrap flex-shrink-0"
     >
     Next Sentence <FastForward className="w-4 h-4" />
     </button>
    </div>
    
    <div className="p-4 bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-xl">
     <p className="text-sm text-slate-500 mb-3">Click on the gerund(s) in the sentence below:</p>
     <div className="flex flex-wrap gap-2 text-lg">
     {GERUND_TASKS[activeSentenceIdx].words.map((w, idx) => (
      <button
      key={idx}
      onClick={() => toggleWord(idx)}
      className={`px-2 py-1 rounded transition-all whitespace-nowrap flex-shrink-0 ${ selectedWords.includes(idx) ? 'bg-emerald-500 text-white shadow-md' : ' hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-[#ffffff] border border-slate-300 dark:border-slate-600' }`}
      >
      {w.text}
      </button>
     ))}
     </div>
    </div>

    <button
     onClick={handleCheckGerunds}
     className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
    >
     <Search className="w-5 h-5" />
     Scan Selection
    </button>

    {gerundFeedback === 'success' && (
     <div className="p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-lg flex items-start gap-2">
     <Check className="w-5 h-5 shrink-0 mt-0.5" />
     <p className="text-sm">Correct! You identified the gerund(s) perfectly.</p>
     </div>
    )}
    {gerundFeedback === 'error' && (
     <div className="p-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg flex items-start gap-2">
     <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
     <p className="text-sm">Scan failed. Remember, a gerund acts as a noun (subject or object), NOT as part of a continuous verb tense like "was running".</p>
     </div>
    )}
    </div>
   </div>
   )}
  </section>

  {/* Right Column: Simulation Canvas */}
  <section className="w-full lg:w-2/3 bg-slate-100 dark:bg-[#121212] p-6 flex flex-col items-center justify-center relative lg:overflow-y-auto">
   
   {activeTab === 'tenses' ? (
   <div className="relative w-full max-w-2xl aspect-square sm:aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center border-4 border-[#1c1b1b]">
    
    {/* Dynamic Background based on Tense */}
    <div className={`absolute inset-0 opacity-30 transition-colors duration-1000 bg-gradient-to-br from-slate-900 ${TENSES[timelineIndex].bg}`}></div>
    
    {/* Grid lines */}
    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff22 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

    {/* Time Portal */}
    <div className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full border-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-1000 ${TENSES[timelineIndex].border} ${conjFeedback === 'success' ? 'scale-110' : 'scale-100'}`}>
    
    {/* Spinning rings */}
    <div className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin ${TENSES[timelineIndex].border}`} style={{ animationDuration: '3s' }}></div>
    <div className={`absolute inset-2 rounded-full border-4 border-b-transparent animate-spin ${TENSES[timelineIndex].border}`} style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
    
    <Clock className={`w-16 h-16 md:w-24 md:h-24 ${TENSES[timelineIndex].color} ${conjFeedback === 'success' ? 'animate-bounce' : 'animate-pulse'}`} />
    
    <div className="absolute -bottom-8 bg-[#000000] text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap border border-[#1c1b1b] z-10">
     {TENSES[timelineIndex].name}
    </div>
    </div>

    {/* Readout Display */}
    <div className="mt-16 bg-black/60 border border-white/10 rounded-xl p-4 w-3/4 max-w-md backdrop-blur-md text-center z-10">
    <div className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-mono">System Status</div>
    {conjFeedback === 'success' ? (
     <div className="text-xl md:text-2xl font-mono text-emerald-400">
     <span className="opacity-50 mr-2">{"=>"}</span>
     {userConjugation}
     </div>
    ) : (
     <div className="text-xl md:text-2xl font-mono text-slate-500">
     <span className="opacity-50 mr-2">{"=>"}</span>
     AWAITING CONJUGATION
     </div>
    )}
    </div>
   </div>
   ) : (
   <div className="relative w-full max-w-2xl min-h-[400px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center border-4 border-[#1c1b1b] p-8">
    
    <div className="absolute top-4 left-4 flex items-center gap-2">
     <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
     <span className="text-emerald-500 font-mono text-xs uppercase tracking-widest">Scanner UI Online</span>
    </div>

    <div className="w-full bg-[#000000]/80 border border-emerald-500/30 rounded-xl p-8 relative font-mono shadow-[0_0_30px_rgba(16,185,129,0.05)] backdrop-blur-sm">
     {/* Decorative corner markers */}
     <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500 rounded-tl-sm"></div>
     <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500 rounded-tr-sm"></div>
     <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500 rounded-bl-sm"></div>
     <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500 rounded-br-sm"></div>

     <div className="flex flex-wrap gap-x-3 gap-y-6 text-xl md:text-2xl justify-center leading-loose text-center mt-4">
     {GERUND_TASKS[activeSentenceIdx].words.map((w, idx) => {
      const isSelected = selectedWords.includes(idx);
      const isCorrectlyGuessed = gerundFeedback === 'success' && w.isGerund;
      
      return (
      <span 
       key={idx} 
       className={`relative px-2 py-1 rounded transition-all duration-300 ${ isCorrectlyGuessed ? 'text-emerald-300 font-bold' : isSelected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'text-emerald-500/60' }`}
      >
       {w.text}
       {isCorrectlyGuessed && (
       <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-emerald-400 font-bold tracking-widest uppercase">
        Gerund
       </span>
       )}
      </span>
      );
     })}
     </div>
     
     {gerundFeedback === 'success' && (
      <div className="mt-12 text-center text-emerald-400 animate-pulse flex flex-col items-center gap-2">
      <Check className="w-8 h-8" />
      <span className="uppercase tracking-widest text-sm">Target Identified</span>
      </div>
     )}
    </div>

   </div>
   )}
   
  </section>
  </main>
 </div>
 );
}
