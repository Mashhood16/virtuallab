import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Activity, Brain , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

const questions = [
 {
 sentence: "The classroom was a zoo.",
 type: "Metaphor",
 literal: "The classroom was very noisy and chaotic.",
 options: [
  "The classroom had animals in it.",
  "The classroom was very noisy and chaotic.",
  "The classroom was located in a zoo.",
  "The students were learning about animals."
 ]
 },
 {
 sentence: "The wind whispered through the trees.",
 type: "Personification",
 literal: "The wind made a soft blowing sound.",
 options: [
  "The wind was actually speaking.",
  "Someone was hiding in the trees.",
  "The wind made a soft blowing sound.",
  "The trees were listening to secrets."
 ]
 },
 {
 sentence: "I'm so hungry I could eat a horse.",
 type: "Hyperbole",
 literal: "I am extremely hungry.",
 options: [
  "I want to eat horse meat.",
  "I am extremely hungry.",
  "I am visiting a farm.",
  "I have a very large mouth."
 ]
 },
 {
 sentence: "He runs as fast as a cheetah.",
 type: "Simile",
 literal: "He runs very quickly.",
 options: [
  "He runs on four legs.",
  "He runs very quickly.",
  "He is racing a cheetah.",
  "He lives in the savannah."
 ]
 },
 {
 sentence: "The stars danced playfully in the moonlit sky.",
 type: "Personification",
 literal: "The stars seemed to twinkle and move slightly.",
 options: [
  "The stars were having a party.",
  "The stars seemed to twinkle and move slightly.",
  "The moon was playing music.",
  "The sky was spinning around."
 ]
 }
];

export default function LabE6FiguresOfSpeech({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [currentIndex, setCurrentIndex] = useState(0);
 const [selectedType, setSelectedType] = useState<string | null>(null);
 const [selectedLiteral, setSelectedLiteral] = useState<string | null>(null);
 const [feedback, setFeedback] = useState<{type: 'success' | 'error' | null, message: string}>({type: null, message: ''});
 const [score, setScore] = useState(0);
 const [analyzerState, setAnalyzerState] = useState<'idle' | 'analyzing' | 'success' | 'error'>('idle');

 const currentQ = questions[currentIndex];

 const handleCheck = () => {
 if (!selectedType || !selectedLiteral) {
  setFeedback({ type: 'error', message: 'Please select both a figure of speech and a literal meaning.' });
  return;
 }

 setAnalyzerState('analyzing');
 setFeedback({ type: null, message: '' });
 
 setTimeout(() => {
  const isTypeCorrect = selectedType === currentQ.type;
  const isLiteralCorrect = selectedLiteral === currentQ.literal;

  if (isTypeCorrect && isLiteralCorrect) {
  setAnalyzerState('success');
  setFeedback({ type: 'success', message: 'Correct! The Rhetorical Analyzer has successfully decoded the sentence.' });
  setScore(s => s + 1);
  setTimeout(() => {
   if (currentIndex < questions.length - 1) {
   setCurrentIndex(i => i + 1);
   setSelectedType(null);
   setSelectedLiteral(null);
   setFeedback({ type: null, message: '' });
   setAnalyzerState('idle');
   } else {
   setFeedback({ type: 'success', message: `Lab Complete! Final Score: ${score + 1}/${questions.length}` });
   }
  }, 3000);
  } else {
  setAnalyzerState('error');
  setFeedback({ type: 'error', message: 'Analysis failed. Check your selections and try again.' });
  }
 }, 2000);
 };

 return (
 <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] transition-colors duration-300">
  <style dangerouslySetInnerHTML={{__html: `
  @keyframes scan {
   0% { top: 0; }
   50% { top: 100%; }
   100% { top: 0; }
  }
  .animate-scan {
   animation: scan 2s linear infinite;
  }
  `}} />
  
  {/* Header */}
  <header className="flex items-center justify-between p-4 shadow-sm z-10">
  <div className="flex items-center gap-4">
   {onExit && (
   <button
    onClick={onExit}
    className="px-4 py-2 flex items-center gap-2 text-slate-600 dark:text-[#a1a1aa] hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
   >
    <ArrowLeft className="w-5 h-5" />
    Go Back
   </button>
   )}
   <h1 className="text-lg md:text-xl font-bold">Class 6: Figures of Speech</h1>
  </div>
  <div className="flex items-center gap-4">
   <div className="text-sm font-medium bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full">
   Score: {score}/{questions.length}
   </div>
  </div>
  
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:bg-white/20 transition-colors shrink-0 ml-4 dark:bg-[#121212]"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  </header>
  
  {/* Main content */}
  <div className="lg:flex-1 lg: flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 overflow-y-auto lg:overflow-visible">
  {/* Left Column: Interactive Controls */}
  <div className="flex flex-col p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] space-y-6">
   <div>
   <h2 className="text-2xl font-bold mb-2">Rhetorical Analyzer</h2>
   <p className="text-slate-600 dark:text-[#71717a]">Decode the non-literal language to find its true meaning.</p>
   </div>

   <div className={`bg-white dark:!bg-[#121212] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3 flex items-center justify-between">
    <span>1. Identify the Figure of Speech</span>
    <span className="text-sm font-normal text-slate-500">Question {currentIndex + 1} of {questions.length}</span>
    </h3>
    <div className="grid grid-cols-2 gap-3">
    {['Simile', 'Metaphor', 'Personification', 'Hyperbole'].map(type => (
     <button
     key={type}
     onClick={() => setSelectedType(type)}
     disabled={analyzerState === 'analyzing' || analyzerState === 'success'}
     className={`p-3 rounded-lg text-sm font-medium transition-colors border whitespace-nowrap flex-shrink-0 ${ selectedType === type ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] hover:border-indigo-300 dark:hover:border-indigo-600 disabled:opacity-50' } flex-col ${activeMobileTab 'lab' 'flex' 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}
     >
     {type}
     </button>
    ))}
    </div>
   </div>

   <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3">2. Match the Literal Meaning</h3>
    <div className="space-y-3">
    {currentQ.options.map(opt => (
     <button
     key={opt}
     onClick={() => setSelectedLiteral(opt)}
     disabled={analyzerState === 'analyzing' || analyzerState === 'success'}
     className={`w-full text-left p-3 rounded-lg text-sm font-medium transition-colors border ${ selectedLiteral === opt ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500 text-emerald-800 dark:text-emerald-200' : 'bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] hover:border-emerald-300 dark:hover:border-emerald-600 disabled:opacity-50' } ${activeMobileTab 'lab' 'block' 'hidden'} lg:block order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}
     >
     {opt}
     </button>
    ))}
    </div>
   </div>

   <div className="flex items-center gap-4">
    <button
    onClick={handleCheck}
    disabled={analyzerState === 'analyzing' || analyzerState === 'success'}
    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    <Activity className={`w-5 h-5 ${analyzerState === 'analyzing' ? 'animate-spin' : ''}`} />
    {analyzerState === 'analyzing' ? 'Analyzing...' : 'Analyze Input'}
    </button>
   </div>
   
   {feedback.message && (
    <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${ feedback.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' }`}>
    {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" /> : <XCircle className="w-5 h-5 mt-0.5 shrink-0" />}
    <p>{feedback.message}</p>
    </div>
   )}
   </div>
  </div>
  
  {/* Right Column: Simulation Canvas */}
  <div className="flex flex-col p-6 overflow-hidden bg-slate-200 dark:bg-slate-950 items-center justify-center relative">
   <div className="relative w-full max-w-lg aspect-square bg-[#121212] rounded-3xl shadow-2xl border-4 border-[#1c1b1b] flex flex-col items-center justify-center p-6 overflow-hidden">
   {/* Screen */}
   <div className="w-full flex-1 bg-cyan-950 border-2 border-cyan-800 rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
    {/* Scanning line animation */}
    {analyzerState === 'analyzing' && (
    <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none">
     <div className="w-full h-1 bg-cyan-400 absolute top-0 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-scan" />
    </div>
    )}
    
    <div className="mb-6 relative z-10">
    {analyzerState === 'idle' && <Brain className="w-20 h-20 text-cyan-600 opacity-80" />}
    {analyzerState === 'analyzing' && <Activity className="w-20 h-20 text-cyan-400 animate-pulse" />}
    {analyzerState === 'success' && <CheckCircle className="w-20 h-20 text-green-400 animate-bounce" />}
    {analyzerState === 'error' && <XCircle className="w-20 h-20 text-red-400 animate-pulse" />}
    </div>

    <div className="z-10 relative">
    <p className="text-cyan-600 font-mono text-xs uppercase tracking-widest mb-3">Input Signal</p>
    <p className={`text-xl font-medium ${analyzerState === 'analyzing' ? 'text-cyan-200 animate-pulse' : 'text-white'}`}>
     "{currentQ.sentence}"
    </p>
    </div>
   </div>
   
   {/* Control Panel */}
   <div className="w-full h-20 mt-4 bg-slate-700 rounded-xl border border-slate-600 flex items-center justify-around px-8">
    <div className="flex flex-col items-center gap-2">
     <div className={`w-4 h-4 rounded-full ${analyzerState === 'analyzing' ? 'bg-yellow-400 animate-ping' : 'bg-slate-500'}`} />
     <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Process</span>
    </div>
    <div className="flex flex-col items-center gap-2">
     <div className={`w-4 h-4 rounded-full ${analyzerState === 'success' ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,1)]' : 'bg-slate-500'}`} />
     <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Valid</span>
    </div>
    <div className="flex flex-col items-center gap-2">
     <div className={`w-4 h-4 rounded-full ${analyzerState === 'error' ? 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,1)]' : 'bg-slate-500'}`} />
     <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Error</span>
    </div>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
