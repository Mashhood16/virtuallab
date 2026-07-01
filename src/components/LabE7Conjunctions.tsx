import { useState } from 'react';
import { ArrowLeft, Anchor, CheckCircle2, XCircle, RefreshCw , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

interface Question {
 id: number;
 islandA: string;
 islandB: string;
 conjunctionType: 'Coordinating' | 'Subordinating' | 'Connective';
 options: string[];
 answer: string;
 explanation: string;
}

const QUESTIONS: Question[] = [
 {
 id: 1,
 islandA: "I wanted to go to the park,",
 islandB: "it started raining heavily.",
 conjunctionType: "Coordinating",
 options: ["and", "but", "so", "or"],
 answer: "but",
 explanation: "'But' shows contrast between wanting to go to the park and the rain."
 },
 {
 id: 2,
 islandA: "We will stay indoors",
 islandB: "the storm passes completely.",
 conjunctionType: "Subordinating",
 options: ["although", "because", "until", "unless"],
 answer: "until",
 explanation: "'Until' indicates time, showing the action continues up to a certain point."
 },
 {
 id: 3,
 islandA: "", // Connective often starts the sentence or joins independent thoughts in specific ways
 islandB: "she was tired, she finished her homework.",
 conjunctionType: "Subordinating",
 options: ["Because", "Although", "Since", "If"],
 answer: "Although",
 explanation: "'Although' introduces a surprising contrast or concession."
 },
 {
 id: 4,
 islandA: "You can have hot tea,",
 islandB: "you can have iced coffee.",
 conjunctionType: "Coordinating",
 options: ["yet", "nor", "for", "or"],
 answer: "or",
 explanation: "'Or' presents a choice between two alternatives."
 },
 {
 id: 5,
 islandA: "He studied hard for the test;",
 islandB: "he got an A+ grade.",
 conjunctionType: "Connective",
 options: ["however,", "therefore,", "meanwhile,", "instead,"],
 answer: "therefore,",
 explanation: "'Therefore' is a connective (conjunctive adverb) showing cause and effect."
 }
];

export default function LabE7Conjunctions({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
 const [selectedConjunction, setSelectedConjunction] = useState<string | null>(null);
 const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
 const [score, setScore] = useState(0);
 const [bridgeStatus, setBridgeStatus] = useState<'broken' | 'building' | 'complete'>('broken');

 const currentQ = QUESTIONS[currentQuestionIdx];

 const handleSelect = (option: string) => {
 if (feedback === 'correct') return;
 setSelectedConjunction(option);
 setFeedback('idle');
 setBridgeStatus('broken');
 };

 const handleBuild = () => {
 if (!selectedConjunction) return;
 
 setBridgeStatus('building');
 
 setTimeout(() => {
  if (selectedConjunction === currentQ.answer) {
  setFeedback('correct');
  setBridgeStatus('complete');
  setScore(s => s + 1);
  } else {
  setFeedback('incorrect');
  setBridgeStatus('broken');
  }
 }, 1000);
 };

 const handleNext = () => {
 setSelectedConjunction(null);
 setFeedback('idle');
 setBridgeStatus('broken');
 setCurrentQuestionIdx((prev) => (prev + 1) % QUESTIONS.length);
 };

 const renderSimulation = () => {
 return (
  <div className="relative w-full h-80 bg-cyan-50 dark:bg-cyan-950/30 rounded-2xl border-2 border-cyan-100 dark:border-cyan-900 overflow-hidden shadow-inner flex flex-col justify-center">
  {/* Background elements */}
  <div className="absolute inset-0 opacity-20 pointer-events-none">
   <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <pattern id="waves" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M0 20 Q 10 10, 20 20 T 40 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-500 dark:text-cyan-600"/>
    </pattern>
    <rect width="100%" height="100%" fill="url(#waves)" />
   </svg>
  </div>

  <div className="relative z-10 flex items-center justify-between px-4 sm:px-12 w-full h-full">
   {/* Island A */}
   <div className="w-1/3 flex flex-col items-center">
   <div className="w-24 h-24 sm:w-32 sm:h-32 bg-emerald-500 rounded-full border-b-8 border-emerald-700 shadow-lg flex items-center justify-center p-4 text-center transform transition-transform hover:scale-105 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
    <span className="text-white font-bold text-sm sm:text-base drop-shadow-md">Clause A</span>
   </div>
   </div>

   {/* Bridge Area */}
   <div className="w-1/3 flex flex-col items-center justify-center relative h-full">
   {bridgeStatus === 'broken' && selectedConjunction && feedback !== 'incorrect' && (
    <div className="text-slate-400 dark:text-[#71717a] font-medium mb-2 animate-pulse text-sm">
    Ready to build...
    </div>
   )}
   
   {/* The Bridge */}
   <div className="relative w-full h-16 flex items-center justify-center">
    {/* Bridge structure */}
    <div className={`absolute h-4 bg-amber-700 dark:bg-amber-900 transition-all duration-1000 ease-in-out ${ bridgeStatus === 'complete' ? 'w-full opacity-100' : bridgeStatus === 'building' ? 'w-1/2 opacity-80' : 'w-0 opacity-0' }`} style={{ top: '50%', transform: 'translateY(-50%)' }}>
     {/* Bridge planks pattern */}
     <div className="w-full h-full flex justify-between px-1 opacity-50">
     {[...Array(10)].map((_, i) => (
      <div key={i} className="w-1 h-full bg-amber-900 dark:bg-amber-950" />
     ))}
     </div>
    </div>

    {/* Conjunction Block */}
    {selectedConjunction && (
    <div className={`z-10 px-4 py-2 rounded shadow-md border-2 text-sm sm:text-base font-bold whitespace-nowrap transition-all duration-500 ${ feedback === 'correct' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 scale-110' : feedback === 'incorrect' ? 'border-red-500 text-red-600 dark:text-red-400 translate-y-8 opacity-0' : 'border-amber-500 text-amber-700 dark:text-amber-400' }`}>
     {selectedConjunction}
    </div>
    )}
   </div>

   {bridgeStatus === 'building' && (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-12 text-amber-600 dark:text-amber-500 font-bold animate-bounce text-sm">
    Building...
    </div>
   )}
   </div>

   {/* Island B */}
   <div className="w-1/3 flex flex-col items-center">
    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-emerald-500 rounded-full border-b-8 border-emerald-700 shadow-lg flex items-center justify-center p-4 text-center transform transition-transform hover:scale-105 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
    <span className="text-white font-bold text-sm sm:text-base drop-shadow-md">Clause B</span>
   </div>
   </div>
  </div>
  </div>
 );
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] overflow-hidden">
  {/* Header */}
  <header className="flex items-center justify-between px-6 py-4 shadow-sm border-b border-slate-200 dark:border-[#1c1b1b] z-10">
  <div className="flex items-center gap-4">
   <button
   onClick={onExit}
   className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap flex-shrink-0"
   aria-label="Go back"
   >
   <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-[#a1a1aa]" />
   </button>
   <div>
   <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-[#ffffff]">
    Clause Bridge Builder
   </h1>
   <p className="text-sm text-slate-500 dark:text-[#71717a]">
    Class 7 English: Conjunctions & Connectives
   </p>
   </div>
  </div>
  <div className="flex items-center gap-2">
   <span className="font-semibold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
   Score: {score}
   </span>
  </div>
  
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:bg-white/20 transition-colors shrink-0 ml-4 dark:bg-[#121212]"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  </header>

  {/* Main 2-column layout */}
  <main className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden lg:overflow-y-auto">
  {/* Left Column: Interactive Controls */}
  <section className="w-full lg:w-1/2 p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] flex flex-col">
   <div className="mb-6">
   <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-500">
    <Anchor className="w-5 h-5" />
    Engineering Bay
   </h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm">
    Connect the two sentence clauses by selecting the correct conjunction block to build a sturdy bridge.
   </p>
   </div>

   <div className="flex-1 flex flex-col justify-between">
   <div>
    {/* Type Badge */}
    <div className="inline-block mb-4 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#1c1b1b]">
    Type: {currentQ.conjunctionType}
    </div>

    {/* The Sentence */}
    <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl border-2 border-slate-200 dark:border-[#1c1b1b] shadow-sm mb-8">
    <p className="text-lg font-medium leading-loose text-center text-slate-700 dark:text-[#ffffff]">
     {currentQ.islandA && <span className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800/50 mr-2">{currentQ.islandA}</span>}
     
     <span className={`inline-flex min-w-[80px] justify-center mx-2 px-3 py-1 border-b-2 font-bold ${ selectedConjunction ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30' : 'border-slate-300 dark:border-slate-600 text-slate-400 border-dashed' }`}>
     {selectedConjunction || "?"}
     </span>
     
     {currentQ.islandB && <span className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800/50 ml-2">{currentQ.islandB}</span>}
    </p>
    </div>

    {/* Options */}
    <div className="grid grid-cols-2 gap-4 mb-6">
    {currentQ.options.map((opt) => (
     <button
     key={opt}
     onClick={() => handleSelect(opt)}
     disabled={bridgeStatus === 'building' || feedback === 'correct'}
     className={`p-3 sm:p-4 rounded-xl border-2 font-semibold transition-all whitespace-nowrap flex-shrink-0 ${ selectedConjunction === opt ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-500 text-amber-800 dark:text-amber-300 shadow-md' : ' border-slate-200 dark:border-[#1c1b1b] hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-slate-700 text-slate-700 dark:text-[#ffffff]' } disabled:opacity-50 disabled:cursor-not-allowed`}
     >
     {opt}
     </button>
    ))}
    </div>
   </div>

   {/* Feedback and Actions */}
   <div className="space-y-4">
    {feedback === 'correct' && (
    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-lg">
     <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold mb-1">
     <CheckCircle2 className="w-5 h-5" />
     Bridge built successfully!
     </div>
     <p className="text-sm text-emerald-600 dark:text-emerald-500">{currentQ.explanation}</p>
    </div>
    )}

    {feedback === 'incorrect' && (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg flex items-center gap-2">
     <XCircle className="w-5 h-5 text-red-500" />
     <span className="text-red-700 dark:text-red-400 font-medium">The bridge collapsed! Wrong conjunction structure.</span>
    </div>
    )}

    <div className="flex gap-4">
    <button
     onClick={handleBuild}
     disabled={!selectedConjunction || bridgeStatus !== 'broken' || feedback === 'correct'}
     className="flex-1 whitespace-nowrap flex-shrink-0 py-3 sm:py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"
    >
     Build Bridge
    </button>
    
    {feedback === 'correct' && (
     <button
     onClick={handleNext}
     className="flex-1 whitespace-nowrap flex-shrink-0 py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
     >
     Next Challenge
     <RefreshCw className="w-5 h-5" />
     </button>
    )}
    </div>
   </div>
   </div>
  </section>

  {/* Right Column: Simulation Canvas */}
  <section className="w-full lg:w-1/2 p-6 bg-slate-100 dark:bg-[#121212]/50 lg:overflow-y-auto flex flex-col">
   <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-[#ffffff]">Live Simulation</h2>
   
   <div className="flex-1 flex flex-col justify-center">
   {renderSimulation()}

   <div className="mt-8 bg-white dark:!bg-[#121212] p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b] shadow-sm">
    <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-2">Bridge Types (Conjunctions)</h3>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
    <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded">
     <strong className="block text-indigo-600 dark:text-indigo-400 mb-1">Coordinating</strong>
     <span className="text-slate-600 dark:text-[#71717a]">Connects equal parts (FANBOYS: for, and, nor, but, or, yet, so)</span>
    </div>
    <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded">
     <strong className="block text-indigo-600 dark:text-indigo-400 mb-1">Subordinating</strong>
     <span className="text-slate-600 dark:text-[#71717a]">Connects a dependent clause to an independent one (because, although, if)</span>
    </div>
    <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded">
     <strong className="block text-rose-600 dark:text-rose-400 mb-1">Connective</strong>
     <span className="text-slate-600 dark:text-[#71717a]">Transitions between ideas in separate sentences (however, therefore)</span>
    </div>
    </div>
   </div>
   </div>
  </section>
  </main>
 </div>
 );
}
