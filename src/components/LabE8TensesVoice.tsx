import { useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle, ArrowLeftRight, Clock, RefreshCw, Undo , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

const voiceQuestions = [
 {
 originalContext: "Active (Past Simple)",
 originalType: "active",
 origSubj: "The dog",
 origVerb: "chased",
 origObj: "the cat",
 targetContext: "Passive",
 targetSubj: "The cat",
 targetVerbBlank: "was chased",
 targetObj: "by the dog"
 },
 {
 originalContext: "Active (Present Continuous)",
 originalType: "active",
 origSubj: "The chef",
 origVerb: "is cooking",
 origObj: "the meal",
 targetContext: "Passive",
 targetSubj: "The meal",
 targetVerbBlank: "is being cooked",
 targetObj: "by the chef"
 },
 {
 originalContext: "Passive (Present Simple)",
 originalType: "passive",
 origSubj: "The song",
 origVerb: "is sung",
 origObj: "by the choir",
 targetContext: "Active",
 targetSubj: "The choir",
 targetVerbBlank: "sings",
 targetObj: "the song"
 },
 {
 originalContext: "Active (Past Perfect)",
 originalType: "active",
 origSubj: "The mechanic",
 origVerb: "had repaired",
 origObj: "the car",
 targetContext: "Passive",
 targetSubj: "The car",
 targetVerbBlank: "had been repaired",
 targetObj: "by the mechanic"
 },
 {
 originalContext: "Active (Future Simple)",
 originalType: "active",
 origSubj: "The team",
 origVerb: "will win",
 origObj: "the match",
 targetContext: "Passive",
 targetSubj: "The match",
 targetVerbBlank: "will be won",
 targetObj: "by the team"
 }
];

const tensesInfo: Record<string, any> = {
 "Simple Past": {
 desc: "An action that started and finished in the past.",
 example: "I walked to the store.",
 visual: <circle cx="35%" cy="50%" r="8" className="fill-blue-500" />
 },
 "Past Continuous": {
 desc: "An ongoing action in the past.",
 example: "I was walking to the store.",
 visual: <rect x="25%" y="46%" width="20%" height="8" rx="4" className="fill-blue-500 opacity-60" />
 },
 "Past Perfect": {
 desc: "An action completed before another action in the past.",
 example: "I had walked to the store before it rained.",
 visual: (
  <>
  <circle cx="25%" cy="50%" r="8" className="fill-blue-500" />
  <circle cx="35%" cy="50%" r="6" className="fill-slate-400" />
  </>
 )
 },
 "Simple Present": {
 desc: "A fact, habit, or regular action.",
 example: "I walk to the store.",
 visual: <circle cx="50%" cy="50%" r="8" className="fill-green-500" />
 },
 "Present Continuous": {
 desc: "An action happening right now.",
 example: "I am walking to the store.",
 visual: <rect x="45%" y="46%" width="10%" height="8" rx="4" className="fill-green-500 opacity-60" />
 },
 "Present Perfect": {
 desc: "An action that started in the past and relates to the present.",
 example: "I have walked to the store many times.",
 visual: (
  <>
  <line x1="35%" y1="50%" x2="50%" y2="50%" className="stroke-green-500" strokeWidth="4" />
  <circle cx="50%" cy="50%" r="8" className="fill-green-500" />
  </>
 )
 },
 "Simple Future": {
 desc: "An action that will happen in the future.",
 example: "I will walk to the store.",
 visual: <circle cx="75%" cy="50%" r="8" className="fill-indigo-500" />
 },
 "Future Continuous": {
 desc: "An ongoing action that will occur in the future.",
 example: "I will be walking to the store at 5 PM.",
 visual: <rect x="70%" y="46%" width="20%" height="8" rx="4" className="fill-indigo-500 opacity-60" />
 }
};

export default function LabE8TensesVoice({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [activeTab, setActiveTab] = useState<'voice'|'timeline'>('voice');
 
 const [vQIdx, setVQIdx] = useState(0);
 const [vInput, setVInput] = useState('');
 const [vFeedback, setVFeedback] = useState<null|'correct'|'incorrect'>(null);

 const [selTense, setSelTense] = useState('Simple Past');

 const currentQ = voiceQuestions[vQIdx];

 const handleCheck = () => {
 const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
 if (normalize(vInput) === normalize(currentQ.targetVerbBlank)) {
  setVFeedback('correct');
 } else {
  setVFeedback('incorrect');
 }
 };

 const handleNext = () => {
 setVQIdx((prev) => (prev + 1) % voiceQuestions.length);
 setVInput('');
 setVFeedback(null);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-[#000000]/50 dark:!bg-[#000000] dark:!bg-[#000000] font-sans select-none text-slate-900 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">
  <header className="flex items-center justify-between p-4 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] shrink-0">
  <h1 className="text-lg md:text-xl font-bold">Class 8 English: Tenses & Voice</h1>
  {onExit && (
   <button onClick={onExit} className="whitespace-nowrap flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-slate-700 hover:bg-slate-200 dark:bg-[#121212]/50 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors">
   <Undo className="w-4 h-4" /> Go Back
   </button>
  )}
  
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:/20 transition-colors shrink-0 ml-4"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  </header>
  
  <main className="flex-1 p-6">
  <div className="max-w-7xl mx-auto lg:h-full flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
   {/* Left Panel */}
   <div className="flex flex-col gap-4">
   {/* Tabs */}
   <div className="flex gap-2 p-1 bg-slate-200 dark:bg-[#121212]/50 dark:bg-[#121212] rounded-xl">
    <button 
    onClick={() => setActiveTab('voice')}
    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'voice' ? ' dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400 dark:text-blue-400' : 'text-slate-600 dark:text-[#a1a1aa] dark:text-[#ffffff] hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:hover:bg-slate-700/50'}`}
    >
    Voice Transformer
    </button>
    <button 
    onClick={() => setActiveTab('timeline')}
    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'timeline' ? ' dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400 dark:text-blue-400' : 'text-slate-600 dark:text-[#a1a1aa] dark:text-[#ffffff] hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:hover:bg-slate-700/50'}`}
    >
    Tenses Timeline
    </button>
   </div>

   {activeTab === 'voice' ? (
    <div className={`w-full bg-white dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:flex-1 flex-col  ? 'flex' : 'hidden'} lg:flex`}>
     <div className="flex items-center gap-2 mb-4">
     <ArrowLeftRight className="w-6 h-6 text-blue-500 dark:text-blue-400" />
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">Voice Transformer</h2>
     </div>
     <p className="text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] mb-6 text-sm">
     Convert the given sentence into the target voice. Type the correct verb phrase.
     </p>

     <div className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] lg:dark:bg-[#121212]/50 dark:bg-white lg:bg-slate-700 p-4 rounded-xl mb-6  'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] mb-2 block">
      {currentQ.originalContext}
      </span>
      <p className="text-lg font-medium text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">
      "{currentQ.origSubj} <span className="text-indigo-600 dark:text-indigo-400 dark:text-indigo-400 font-bold">{currentQ.origVerb}</span> {currentQ.origObj}."
      </p>
     </div>

     <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] mb-2">
      Convert to: <span className="text-blue-600 dark:text-blue-400 dark:text-blue-400">{currentQ.targetContext}</span>
      </label>
      <div className="flex items-center gap-2 flex-wrap">
       <span className="bg-slate-200 dark:bg-[#121212]/50 dark:bg-slate-600 px-3 py-2 rounded-lg font-medium text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">{currentQ.targetSubj}</span>
       <input 
       type="text"
       value={vInput}
       onChange={(e) => { setVInput(e.target.value); setVFeedback(null); }}
       placeholder="verb phrase..."
       className="flex-1 min-w-0 px-4 py-2 border-2 border-slate-300 dark:border-[#1c1b1b] rounded-lg dark:bg-[#121212] text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] focus:outline-none focus:border-blue-500 font-bold text-indigo-600 dark:text-indigo-400 dark:text-indigo-300 placeholder:font-normal placeholder:text-slate-400"
       />
       <span className="bg-slate-200 dark:bg-[#121212]/50 dark:bg-slate-600 px-3 py-2 rounded-lg font-medium text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">{currentQ.targetObj}.</span>
      </div>
     </div>

     <div className="flex gap-4 mt-6">
      <button onClick={handleCheck} className="flex-1 whitespace-nowrap flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
      Check Answer
      </button>
      <button onClick={handleNext} className="whitespace-nowrap flex-shrink-0 bg-slate-200 dark:bg-[#121212]/50 hover:bg-slate-300 dark:bg-[#121212]/50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2">
      Next <ArrowRight className="w-5 h-5"/>
      </button>
     </div>
     
     {vFeedback === 'correct' && (
     <div className={`w-full mt-4 p-4 bg-green-100 dark:bg-green-900/50 dark:bg-green-900/60 dark:bg-green-900/30 text-green-700 dark:text-green-300 dark:text-green-400 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
      <CheckCircle2 className="w-5 h-5" />
      <span className="font-semibold">Correct! Awesome job.</span>
     </div>
     )}
     {vFeedback === 'incorrect' && (
     <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/50 dark:bg-red-900/60 dark:bg-red-900/30 text-red-700 dark:text-red-300 dark:text-red-400 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
      <XCircle className="w-5 h-5" />
      <span className="font-semibold">Not quite. Try again!</span>
     </div>
     )}
    </div>
   ) : (
    <div className="bg-white dark:!bg-[#121212] dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-1 flex flex-col">
     <div className="flex items-center gap-2 mb-4">
     <Clock className="w-6 h-6 text-green-500 dark:text-green-400" />
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">Tenses Timeline</h2>
     </div>
     <p className="text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] mb-6 text-sm">
     Select a tense to visualize it on the timeline.
     </p>

     <div className="grid grid-cols-2 gap-2 lg:overflow-y-auto">
      {Object.keys(tensesInfo).map((tense) => (
       <button 
       key={tense}
       onClick={() => setSelTense(tense)}
       className={`w-full text-left px-3 py-3 rounded-xl font-semibold transition-colors text-sm ${ selTense === tense ? 'bg-green-100 dark:bg-green-900/50 dark:bg-green-900/60 text-green-700 dark:text-green-300 dark:bg-green-900/40 dark:text-green-300 border-2 border-green-500' : 'bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] dark:text-[#ffffff] dark:bg-slate-700 dark:text-[#ffffff] border-2 border-transparent hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:hover:bg-slate-600' }`}
       >
       {tense}
       </button>
      ))}
     </div>
    </div>
   )}
   </div>

   {/* Right Panel */}
   <div className="bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-[#121212] rounded-2xl border border-slate-200 dark:border-[#1c1b1b] overflow-hidden flex flex-col p-6 min-h-[400px]">
   {activeTab === 'voice' ? (
    <div className="flex flex-col items-center justify-center h-full space-y-8 relative">
     {/* Top Sentence */}
     <div className="flex flex-wrap justify-center gap-3 w-full relative z-10">
     <div className="p-3 bg-blue-100 dark:bg-blue-900/50 dark:bg-blue-900/60 dark:bg-blue-900 rounded-lg text-center border-2 border-blue-300 dark:border-blue-700 min-w-[100px]">
      <span className="text-[10px] text-blue-600 dark:text-blue-400 dark:text-blue-300 font-bold uppercase tracking-wider block mb-1">Subject</span>
      <span className="font-semibold text-sm md:text-base">{currentQ.origSubj}</span>
     </div>
     <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 dark:bg-indigo-900/60 dark:bg-indigo-900 rounded-lg text-center border-2 border-indigo-300 dark:border-indigo-700 min-w-[100px]">
      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 dark:text-indigo-300 font-bold uppercase tracking-wider block mb-1">Verb</span>
      <span className="font-semibold text-sm md:text-base">{currentQ.origVerb}</span>
     </div>
     <div className="p-3 bg-green-100 dark:bg-green-900/50 dark:bg-green-900/60 dark:bg-green-900 rounded-lg text-center border-2 border-green-300 dark:border-green-700 min-w-[100px]">
      <span className="text-[10px] text-green-600 dark:text-green-400 dark:text-green-300 font-bold uppercase tracking-wider block mb-1">Object</span>
      <span className="font-semibold text-sm md:text-base">{currentQ.origObj}</span>
     </div>
     </div>
     
     {/* Arrows / Transform icon */}
     <div className="flex justify-center items-center h-20 w-full relative">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
       <path 
       d="M 65% 0 L 35% 100%" 
       stroke="currentColor" 
       className={`transition-colors duration-500 ${vFeedback === 'correct' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-300 dark:text-[#ffffff]'}`}
       strokeWidth="2" strokeDasharray="4 4" fill="none" markerEnd="url(#arrow)" 
       />
       <path 
       d="M 35% 0 L 65% 100%" 
       stroke="currentColor" 
       className={`transition-colors duration-500 ${vFeedback === 'correct' ? 'text-green-500 dark:text-green-400' : 'text-slate-300 dark:text-[#ffffff]'}`}
       strokeWidth="2" strokeDasharray="4 4" fill="none" markerEnd="url(#arrow)" 
       />
       <defs>
       <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
       </marker>
       </defs>
      </svg>
      <RefreshCw className={`w-8 h-8 text-slate-400 dark:text-[#ffffff] ${vFeedback === 'correct' ? 'animate-spin text-green-500 dark:text-green-400' : ''}`} />
     </div>

     {/* Bottom Sentence */}
     <div className="flex flex-wrap justify-center gap-3 w-full relative z-10">
     <div className="p-3 bg-green-100 dark:bg-green-900/50 dark:bg-green-900/60 dark:bg-green-900 rounded-lg text-center border-2 border-green-300 dark:border-green-700 min-w-[100px] transition-all">
      <span className="text-[10px] text-green-600 dark:text-green-400 dark:text-green-300 font-bold uppercase tracking-wider block mb-1">New Subject</span>
      <span className="font-semibold text-sm md:text-base">{currentQ.targetSubj}</span>
     </div>
     <div className={`p-3 rounded-lg text-center border-2 transition-colors min-w-[100px] flex-1 ${vFeedback === 'correct' ? 'bg-indigo-100 dark:bg-indigo-900/50 dark:bg-indigo-900/60 dark:bg-indigo-900 border-indigo-400' : 'bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-slate-700 border-dashed border-slate-300 dark:border-slate-600 dark:border-slate-500'}`}>
      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 dark:text-indigo-300 font-bold uppercase tracking-wider block mb-1">Transformed Verb</span>
      <span className={`font-semibold text-sm md:text-base ${vFeedback === 'correct' ? 'text-indigo-700 dark:text-indigo-300 dark:text-indigo-200' : 'text-slate-500 dark:text-[#a1a1aa] dark:text-[#ffffff]'}`}>
       {vFeedback === 'correct' ? currentQ.targetVerbBlank : (vInput || '???')}
      </span>
     </div>
     <div className="p-3 bg-blue-100 dark:bg-blue-900/50 dark:bg-blue-900/60 dark:bg-blue-900 rounded-lg text-center border-2 border-blue-300 dark:border-blue-700 min-w-[100px] transition-all">
      <span className="text-[10px] text-blue-600 dark:text-blue-400 dark:text-blue-300 font-bold uppercase tracking-wider block mb-1">New Object</span>
      <span className="font-semibold text-sm md:text-base">{currentQ.targetObj}</span>
     </div>
     </div>
    </div>
   ) : (
    <div className="flex flex-col h-full">
    <div className="flex-1 flex flex-col justify-center items-center relative">
     <div className="w-full h-40 dark:bg-slate-700 rounded-xl border-2 border-slate-200 dark:border-[#1c1b1b] relative flex items-center px-4 overflow-hidden shadow-inner">
      {/* Timeline Base */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
       <line x1="10%" y1="50%" x2="90%" y2="50%" className="stroke-slate-300 dark:stroke-slate-500" strokeWidth="2" strokeDasharray="4 4" />
       {/* Axis markers */}
       <line x1="25%" y1="45%" x2="25%" y2="55%" className="stroke-slate-400 dark:stroke-slate-400" strokeWidth="2" />
       <line x1="50%" y1="45%" x2="50%" y2="55%" className="stroke-slate-400 dark:stroke-slate-400" strokeWidth="2" />
       <line x1="75%" y1="45%" x2="75%" y2="55%" className="stroke-slate-400 dark:stroke-slate-400" strokeWidth="2" />
       
       <text x="25%" y="70%" textAnchor="middle" className="text-xs fill-slate-500 dark:fill-slate-400 font-bold uppercase">Past</text>
       <text x="50%" y="70%" textAnchor="middle" className="text-xs fill-slate-500 dark:fill-slate-400 font-bold uppercase">Present</text>
       <text x="75%" y="70%" textAnchor="middle" className="text-xs fill-slate-500 dark:fill-slate-400 font-bold uppercase">Future</text>
       
       {/* Selected Tense Visual */}
       {tensesInfo[selTense].visual}
      </svg>
     </div>
    </div>
    <div className="mt-6 bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] dark:bg-slate-700/50 p-6 rounded-xl">
     <h3 className="text-lg font-bold text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] mb-2">{selTense}</h3>
     <p className="text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] text-sm mb-4">{tensesInfo[selTense].desc}</p>
     <div className="bg-white dark:!bg-[#121212] dark:!bg-[#121212] p-4 rounded-lg border-l-4 border-green-500 shadow-sm">
      <p className="font-serif italic text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">"{tensesInfo[selTense].example}"</p>
     </div>
    </div>
    </div>
   )}
   </div>
  </div>
  </main>
 </div>
 );
}
