import { useState } from 'react';
import { ArrowLeft, Check, RefreshCw, Activity, Clock, MapPin, Zap, Play , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

export default function LabE6VerbsAdverbs({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [modalLevel, setModalLevel] = useState(3);
 const [advManner, setAdvManner] = useState('carefully');
 const [advPlace, setAdvPlace] = useState('inside');
 const [advTime, setAdvTime] = useState('now');

 const [questionIndex, setQuestionIndex] = useState(0);
 const [userAnswer, setUserAnswer] = useState('');
 const [feedback, setFeedback] = useState<string | null>(null);

 const questions = [
 {
  q: "Which modal verb shows strong obligation?",
  options: ["might", "can", "must", "will"],
  ans: "must"
 },
 {
  q: "Identify the adverb of manner in: 'The robot works carefully.'",
  options: ["robot", "works", "carefully", "The"],
  ans: "carefully"
 },
 {
  q: "Which sentence uses an adverb of place?",
  options: ["He arrives tomorrow.", "They play outside.", "She sings beautifully.", "I must go."],
  ans: "They play outside."
 }
 ];

 const handleCheck = () => {
 if (userAnswer === questions[questionIndex].ans) {
  setFeedback("Correct! Well done.");
 } else {
  setFeedback("Try again.");
 }
 };

 const nextQuestion = () => {
 setQuestionIndex((prev) => (prev + 1) % questions.length);
 setUserAnswer('');
 setFeedback(null);
 };

 const modalWords = ["Might/May", "Can/Could", "Should/Ought to", "Will/Shall", "Must/Have to"];
 const displayModal = ["might", "can", "should", "will", "must"];

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] font-sans select-none overflow-hidden">
  <header className="flex items-center justify-between p-4 shadow-sm z-10">
  <div className="flex items-center gap-4">
   <button onClick={onExit} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors whitespace-nowrap flex-shrink-0">
   <ArrowLeft className="w-5 h-5" />
   </button>
   <h1 className="text-lg md:text-xl font-bold">Verbs & Adverbs Lab</h1>
  </div>
  
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:bg-white/20 transition-colors shrink-0 ml-4 dark:bg-[#121212]"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  </header>

  <main className="lg:flex-1 flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 lg: overflow-y-auto lg:overflow-visible">
  {/* Left Column: Controls & Workspace */}
  <div className="flex flex-col p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] space-y-8">
   
   <section className={`bg-white dark:!bg-[#121212] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
    <Zap className="w-5 h-5 text-yellow-500" />
    Modal Verbs Strength Meter
   </h2>
   <div className="space-y-4">
    <input 
    type="range" 
    min="1" 
    max="5" 
    value={modalLevel} 
    onChange={(e) => setModalLevel(Number(e.target.value))}
    className="w-full accent-yellow-500 cursor-pointer"
    />
    <div className="flex justify-between text-sm font-medium">
    <span className={modalLevel === 1 ? 'text-yellow-500 font-bold' : 'text-slate-400'}>Possibility</span>
    <span className={modalLevel === 5 ? 'text-yellow-500 font-bold' : 'text-slate-400'}>Obligation</span>
    </div>
    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-center">
    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
     {modalWords[modalLevel - 1]}
    </span>
    <p className="text-sm mt-2 text-slate-600 dark:text-[#a1a1aa]">
     {modalLevel === 1 && "It is possible but not certain."}
     {modalLevel === 2 && "Subject has the ability to do it."}
     {modalLevel === 3 && "It is a good idea or recommendation."}
     {modalLevel === 4 && "It is certain to happen."}
     {modalLevel === 5 && "It is absolutely required."}
    </p>
    </div>
   </div>
   </section>

   <section className={`bg-white dark:!bg-[#121212] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
    <Play className="w-5 h-5 text-blue-500" />
    Adverbs Controller
   </h2>
   <div className="grid gap-4">
    <div>
    <label className="text-sm font-semibold text-slate-500 dark:text-[#71717a] mb-2 flex items-center gap-2">
     <Activity className="w-4 h-4" /> Manner (How?)
    </label>
    <div className="flex gap-2">
     {['carefully', 'quickly', 'clumsily'].map(adv => (
     <button 
      key={adv}
      onClick={() => setAdvManner(adv)}
      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${advManner === adv ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-[#ffffff] hover:bg-slate-200 dark:hover:bg-slate-600'}`}
     >
      {adv}
     </button>
     ))}
    </div>
    </div>
    <div>
    <label className="text-sm font-semibold text-slate-500 dark:text-[#71717a] mb-2 flex items-center gap-2">
     <MapPin className="w-4 h-4" /> Place (Where?)
    </label>
    <div className="flex gap-2">
     {['inside', 'outside', 'upstairs'].map(adv => (
     <button 
      key={adv}
      onClick={() => setAdvPlace(adv)}
      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${advPlace === adv ? 'bg-green-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-[#ffffff] hover:bg-slate-200 dark:hover:bg-slate-600'}`}
     >
      {adv}
     </button>
     ))}
    </div>
    </div>
    <div>
    <label className="text-sm font-semibold text-slate-500 dark:text-[#71717a] mb-2 flex items-center gap-2">
     <Clock className="w-4 h-4" /> Time (When?)
    </label>
    <div className="flex gap-2">
     {['now', 'tomorrow', 'later'].map(adv => (
     <button 
      key={adv}
      onClick={() => setAdvTime(adv)}
      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${advTime === adv ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-[#ffffff] hover:bg-slate-200 dark:hover:bg-slate-600'}`}
     >
      {adv}
     </button>
     ))}
    </div>
    </div>
   </div>
   </section>

   <section className={`bg-blue-50 dark:bg-[#121212] lg:dark:bg-[#121212] lg:dark:bg-[#121212]/80 rounded-2xl p-6 border border-blue-100 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] lg:flex-1 flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold mb-4 text-blue-900 dark:text-blue-300">Knowledge Check</h2>
   <div className="flex-1 flex flex-col justify-center space-y-4">
    <p className="font-medium text-lg">{questions[questionIndex].q}</p>
    <div className="grid grid-cols-2 gap-3">
    {questions[questionIndex].options.map(opt => (
     <button
     key={opt}
     onClick={() => { setUserAnswer(opt); setFeedback(null); }}
     className={`py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${userAnswer === opt ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-[#ffffff] hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'}`}
     >
     {opt}
     </button>
    ))}
    </div>
    <div className="flex items-center justify-between mt-4">
    <button
     onClick={handleCheck}
     disabled={!userAnswer}
     className="px-6 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 disabled: disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
    >
     <Check className="w-5 h-5" /> Check Answer
    </button>
    {feedback && (
     <div className="flex items-center gap-4">
     <span className={`font-bold ${feedback.includes('Correct') ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
      {feedback}
     </span>
     {feedback.includes('Correct') && (
      <button onClick={nextQuestion} className="p-2 bg-blue-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-slate-600 whitespace-nowrap flex-shrink-0">
      <RefreshCw className="w-5 h-5" />
      </button>
     )}
     </div>
    )}
    </div>
   </div>
   </section>

  </div>

  {/* Right Column: Simulation Canvas */}
  <div className="bg-slate-200 dark:bg-[#121212]/50 p-6 flex flex-col items-center justify-center relative overflow-hidden">
   
   {/* Sentence Builder Display */}
   <div className="absolute top-8 left-8 right-8 bg-white dark:!bg-[#121212] p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-[#1c1b1b] text-center z-10">
   <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Live Sentence</h3>
   <p className="text-xl lg:text-2xl font-serif text-slate-800 dark:text-[#ffffff]">
    The robot <span className="text-yellow-500 font-bold">{displayModal[modalLevel - 1]}</span> work{' '}
    <span className="text-blue-500 font-bold">{advManner}</span>{' '}
    <span className="text-green-500 font-bold">{advPlace}</span>{' '}
    <span className="text-indigo-500 font-bold">{advTime}</span>.
   </p>
   </div>

   {/* Visualization Scene */}
   <div className="relative w-full max-w-md aspect-square rounded-full shadow-2xl border-8 border-slate-50 dark:border-[#1c1b1b] overflow-hidden flex items-center justify-center mt-12">
   
   {/* Background (Place/Time) */}
   <div className={`absolute inset-0 transition-all duration-1000 ${advTime === 'now' ? 'opacity-100' : advTime === 'later' ? 'opacity-80 brightness-75' : 'opacity-90 blur-[1px] saturate-50'}`}>
    {advPlace === 'inside' && (
    <div className="absolute inset-0 bg-orange-50 dark:bg-orange-950/30">
     <div className="absolute bottom-0 w-full h-1/3 bg-orange-200 dark:bg-orange-900/50" />
     <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-4 border-orange-200 dark:border-orange-800/50 rounded-lg" />
    </div>
    )}
    {advPlace === 'outside' && (
    <div className="absolute inset-0 bg-sky-100 dark:bg-sky-900/40">
     <div className="absolute bottom-0 w-full h-1/3 bg-green-200 dark:bg-green-900/50" />
     <div className="absolute top-10 right-10 w-16 h-16 bg-yellow-300 rounded-full shadow-lg" />
    </div>
    )}
    {advPlace === 'upstairs' && (
    <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-950/30">
     <div className="absolute bottom-0 w-full h-1/3 bg-indigo-200 dark:bg-indigo-900/50" />
     <div className="absolute top-1/4 left-10 w-20 h-40 border-l-4 border-b-4 border-indigo-200 dark:border-indigo-800/50" />
     <div className="absolute top-1/3 left-20 w-20 h-40 border-l-4 border-b-4 border-indigo-200 dark:border-indigo-800/50" />
    </div>
    )}
   </div>

   {/* Robot (Manner) */}
   <div className={`relative z-10 transition-all duration-500 ease-in-out ${advManner === 'quickly' ? 'animate-bounce' : ''} ${advManner === 'carefully' ? 'animate-pulse' : ''} ${advManner === 'clumsily' ? 'rotate-12 translate-x-4' : ''}`}>
    <svg width="120" height="150" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Robot Body */}
    <rect x="30" y="50" width="60" height="70" rx="10" className="fill-slate-300 dark:fill-slate-600" />
    <rect x="40" y="60" width="40" height="20" rx="5" className="fill-slate-400 dark:fill-slate-500" />
    <rect x="40" y="85" width="40" height="20" rx="5" className="fill-slate-400 dark:fill-slate-500" />
    {/* Robot Head */}
    <rect x="40" y="10" width="40" height="35" rx="8" className="fill-slate-300 dark:fill-slate-600" />
    <circle cx="50" cy="25" r="5" className="fill-blue-500" />
    <circle cx="70" cy="25" r="5" className="fill-blue-500" />
    <path d="M50 35 Q 60 40 70 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-500 dark:text-[#71717a]" />
    {/* Antenna */}
    <line x1="60" y1="10" x2="60" y2="0" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
    <circle cx="60" cy="0" r="3" className="fill-red-500" />
    {/* Arms */}
    <line x1="30" y1="60" x2="10" y2="80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-slate-400 dark:text-[#71717a]" />
    <line x1="90" y1="60" x2="110" y2="80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-slate-400 dark:text-[#71717a]" />
    {/* Legs */}
    <line x1="45" y1="120" x2="45" y2="140" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-slate-400 dark:text-[#71717a]" />
    <line x1="75" y1="120" x2="75" y2="140" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-slate-400 dark:text-[#71717a]" />
    </svg>

    {/* Obligation / Modal Strength Visual */}
    {modalLevel >= 4 && (
    <div className="absolute -inset-4 border-4 border-yellow-400 rounded-full animate-ping opacity-30" />
    )}
    {modalLevel === 5 && (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-4xl font-black text-red-500 drop-shadow-md">
     !
    </div>
    )}
    {modalLevel <= 2 && (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-4xl font-black text-slate-400 drop-shadow-md opacity-70">
     ?
    </div>
    )}
   </div>

   {/* Time / Mode Overlay Text */}
   <div className="absolute bottom-8 text-center w-full z-10">
    <span className="bg-white/80 dark:bg-[#121212]/80 px-4 py-2 rounded-full text-sm font-bold text-slate-700 dark:text-[#ffffff] backdrop-blur-sm shadow-sm">
    Status: {advManner} {advTime}
    </span>
   </div>
   </div>
  </div>
  </main>
 </div>
 );
}
