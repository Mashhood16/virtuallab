import { useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle, Edit3, User, BookOpen, Snowflake, Thermometer, Award, Ticket, Home, Droplet, RefreshCw, Undo , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

const notepadQuestions = [
 {
 direct: "He said, \"I am reading a book.\"",
 hints: ["Change 'am reading' to past continuous.", "Change 'I' to 'he'."],
 answers: ["he said that he was reading a book", "he said he was reading a book", "he said that he was reading a book.", "he said he was reading a book."],
 speaker: "He",
 quote: "I am reading a book."
 },
 {
 direct: "She asked, \"Are you coming?\"",
 hints: ["Use 'if' or 'whether'.", "Change 'are coming' to past continuous."],
 answers: ["she asked if i was coming", "she asked whether i was coming", "she asked if i was coming.", "she asked whether i was coming."],
 speaker: "She",
 quote: "Are you coming?"
 },
 {
 direct: "The teacher said, \"Stand up!\"",
 hints: ["Use an infinitive 'to stand'.", "Use an appropriate reporting verb like 'ordered' or 'told'."],
 answers: ["the teacher told us to stand up", "the teacher ordered us to stand up", "the teacher told me to stand up", "the teacher ordered me to stand up", "the teacher told us to stand up.", "the teacher ordered us to stand up."],
 speaker: "Teacher",
 quote: "Stand up!"
 }
];

const conditionalQuestions = [
 {
 id: 1,
 scenario: "Water Freezing",
 type: "Zero Conditional",
 fact: "General Truth: Water freezes at 0°C.",
 promptPart1: "If you",
 verb1Hint: "(cool)",
 verb1Ans: ["cool"],
 promptPart2: "water to 0°C, it",
 verb2Hint: "(freeze)",
 verb2Ans: ["freezes"],
 endText: ".",
 iconSet: "water"
 },
 {
 id: 2,
 scenario: "Passing an Exam",
 type: "First Conditional",
 fact: "Real Future Possibility: Studying tonight leads to passing tomorrow.",
 promptPart1: "If she",
 verb1Hint: "(study)",
 verb1Ans: ["studies"],
 promptPart2: "tonight, she",
 verb2Hint: "(pass)",
 verb2Ans: ["will pass", "can pass"],
 endText: "the test tomorrow.",
 iconSet: "exam"
 },
 {
 id: 3,
 scenario: "Winning the Lottery",
 type: "Second Conditional",
 fact: "Unreal Present/Future: Imagining a different reality.",
 promptPart1: "If I",
 verb1Hint: "(win)",
 verb1Ans: ["won"],
 promptPart2: "the lottery, I",
 verb2Hint: "(buy)",
 verb2Ans: ["would buy", "could buy", "might buy"],
 endText: "a mansion.",
 iconSet: "lottery"
 }
];

export default function LabE8NarrationConditionals({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [activeTab, setActiveTab] = useState<'notepad'|'conditionals'>('notepad');

 const [nIdx, setNIdx] = useState(0);
 const [nInput, setNInput] = useState('');
 const [nFeedback, setNFeedback] = useState<null|'correct'|'incorrect'>(null);

 const [cIdx, setCIdx] = useState(0);
 const [cInput1, setCInput1] = useState('');
 const [cInput2, setCInput2] = useState('');
 const [cFeedback, setCFeedback] = useState<null|'correct'|'incorrect'>(null);

 const nQ = notepadQuestions[nIdx];
 const cQ = conditionalQuestions[cIdx];

 const handleNCheck = () => {
 const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
 const ans = normalize(nInput);
 if (nQ.answers.map(normalize).includes(ans)) {
  setNFeedback('correct');
 } else {
  setNFeedback('incorrect');
 }
 };

 const handleNNext = () => {
 setNIdx((prev) => (prev + 1) % notepadQuestions.length);
 setNInput('');
 setNFeedback(null);
 };

 const handleCCheck = () => {
 const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
 const ans1 = normalize(cInput1);
 const ans2 = normalize(cInput2);
 if (cQ.verb1Ans.includes(ans1) && cQ.verb2Ans.includes(ans2)) {
  setCFeedback('correct');
 } else {
  setCFeedback('incorrect');
 }
 };

 const handleCNext = () => {
 setCIdx((prev) => (prev + 1) % conditionalQuestions.length);
 setCInput1('');
 setCInput2('');
 setCFeedback(null);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-[#000000]/50 dark:!bg-[#000000] dark:!bg-[#000000] font-sans select-none text-slate-900 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">
  <header className="flex items-center justify-between p-4 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] shrink-0">
  <h1 className="text-lg md:text-xl font-bold">Class 8 English: Narration & Conditionals</h1>
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
    onClick={() => setActiveTab('notepad')}
    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'notepad' ? ' dark:bg-slate-700 shadow-sm text-yellow-600 dark:text-yellow-400 dark:text-yellow-500' : 'text-slate-600 dark:text-[#a1a1aa] dark:text-[#ffffff] hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:hover:bg-slate-700/50'}`}
    >
    Reporter's Notepad
    </button>
    <button 
    onClick={() => setActiveTab('conditionals')}
    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'conditionals' ? ' dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400 dark:text-indigo-400' : 'text-slate-600 dark:text-[#a1a1aa] dark:text-[#ffffff] hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:hover:bg-slate-700/50'}`}
    >
    Conditional Loops
    </button>
   </div>

   {activeTab === 'notepad' ? (
    <div className={`bg-white dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:flex-1 flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
     <div className="flex items-center gap-2 mb-4">
     <Edit3 className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">Reporter's Notepad</h2>
     </div>
     <p className="text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] mb-6 text-sm">
     Convert the direct quote into reported (indirect) speech.
     </p>

     <div className={`bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] lg:dark:bg-[#121212]/50 dark:bg-white lg:bg-slate-700 p-4 rounded-xl mb-6 flex flex-col items-start gap-3 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] block">
      Direct Speech
      </span>
      <div className="flex gap-3 items-center">
      <div className={`bg-blue-100 dark:bg-blue-900/50 dark:bg-blue-900/60 dark:bg-blue-900 p-3 rounded-full shrink-0 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
       <User className="w-6 h-6 text-blue-600 dark:text-blue-400 dark:text-blue-300" />
      </div>
      <p className="text-lg font-medium text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] italic">
       {nQ.direct}
      </p>
      </div>
     </div>

     <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] mb-2">
      Reported Speech:
      </label>
      <textarea 
      value={nInput}
      onChange={(e) => { setNInput(e.target.value); setNFeedback(null); }}
      placeholder="e.g. He said that..."
      className="w-full px-4 py-3 border-2 border-slate-300 dark:border-[#1c1b1b] rounded-lg dark:bg-[#121212] text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] focus:outline-none focus:border-yellow-500 resize-none h-24 font-medium"
      />
     </div>

     {/* hints */}
     <div className="mb-6 space-y-2 bg-yellow-50 dark:bg-yellow-900/50 dark:bg-yellow-900/20 p-4 rounded-lg">
     <span className="text-xs font-bold uppercase text-yellow-700 dark:text-yellow-300 dark:text-yellow-500 mb-1 block">Hints</span>
     {nQ.hints.map((h, i) => (
      <p key={i} className="text-sm text-yellow-800 dark:text-yellow-200 dark:text-yellow-400 flex items-center gap-2">
       <ArrowRight className="w-4 h-4 shrink-0" /> {h}
      </p>
     ))}
     </div>

     <div className="flex gap-4">
      <button onClick={handleNCheck} className="flex-1 whitespace-nowrap flex-shrink-0 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl transition-colors dark:text-white dark:text-white dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-yellow-500/40">
      Check Notes
      </button>
      <button onClick={handleNNext} className="whitespace-nowrap flex-shrink-0 bg-slate-200 dark:bg-[#121212]/50 hover:bg-slate-300 dark:bg-[#121212]/50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2">
      Next <ArrowRight className="w-5 h-5"/>
      </button>
     </div>
     
     {nFeedback === 'correct' && (
     <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/50 dark:bg-green-900/60 dark:bg-green-900/30 text-green-700 dark:text-green-300 dark:text-green-400 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
      <CheckCircle2 className="w-5 h-5" />
      <span className="font-semibold">Correct! Great reporting.</span>
     </div>
     )}
     {nFeedback === 'incorrect' && (
     <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/50 dark:bg-red-900/60 dark:bg-red-900/30 text-red-700 dark:text-red-300 dark:text-red-400 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
      <XCircle className="w-5 h-5" />
      <span className="font-semibold">Not quite. Check the pronouns and tense changes!</span>
     </div>
     )}
    </div>
   ) : (
    <div className="bg-white dark:!bg-[#121212] dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-1">
     <div className="flex items-center gap-2 mb-4">
     <RefreshCw className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">Conditional Loops</h2>
     </div>
     <p className="text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] mb-6 text-sm">
     Fill in the correct verb forms to complete the conditional logic loop.
     </p>

     <div className="bg-indigo-50 dark:bg-indigo-900/50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 p-4 rounded-xl mb-6">
      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 dark:text-indigo-400 mb-1 block">
      {cQ.type}
      </span>
      <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 dark:text-indigo-200">
      {cQ.fact}
      </p>
     </div>

     <div className="mb-8">
      <div className="flex items-center gap-2 flex-wrap text-lg">
       <span className="font-medium text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">{cQ.promptPart1}</span>
       <input 
       type="text"
       value={cInput1}
       onChange={(e) => { setCInput1(e.target.value); setCFeedback(null); }}
       placeholder={cQ.verb1Hint}
       className="w-28 flex-shrink-0 px-3 py-2 border-2 border-slate-300 dark:border-[#1c1b1b] rounded-lg dark:bg-[#121212] text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] focus:outline-none focus:border-indigo-500 text-center font-bold text-indigo-600 dark:text-indigo-400 dark:text-indigo-400"
       />
       <span className="font-medium text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">{cQ.promptPart2}</span>
       <input 
       type="text"
       value={cInput2}
       onChange={(e) => { setCInput2(e.target.value); setCFeedback(null); }}
       placeholder={cQ.verb2Hint}
       className="w-32 flex-shrink-0 px-3 py-2 border-2 border-slate-300 dark:border-[#1c1b1b] rounded-lg dark:bg-[#121212] text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] focus:outline-none focus:border-indigo-500 text-center font-bold text-indigo-600 dark:text-indigo-400 dark:text-indigo-400"
       />
       <span className="font-medium text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">{cQ.endText}</span>
      </div>
     </div>

     <div className="flex gap-4">
      <button onClick={handleCCheck} className="flex-1 whitespace-nowrap flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
      Run Logic Loop
      </button>
      <button onClick={handleCNext} className="whitespace-nowrap flex-shrink-0 bg-slate-200 dark:bg-[#121212]/50 hover:bg-slate-300 dark:bg-[#121212]/50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2">
      Next <ArrowRight className="w-5 h-5"/>
      </button>
     </div>
     
     {cFeedback === 'correct' && (
     <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/50 dark:bg-green-900/60 dark:bg-green-900/30 text-green-700 dark:text-green-300 dark:text-green-400 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
      <CheckCircle2 className="w-5 h-5" />
      <span className="font-semibold">Correct! The logic loop executes.</span>
     </div>
     )}
     {cFeedback === 'incorrect' && (
     <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/50 dark:bg-red-900/60 dark:bg-red-900/30 text-red-700 dark:text-red-300 dark:text-red-400 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
      <XCircle className="w-5 h-5" />
      <span className="font-semibold">Logic Error. Check your tenses!</span>
     </div>
     )}
    </div>
   )}
   </div>

   {/* Right Panel */}
   <div className="bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-[#121212] rounded-2xl border border-slate-200 dark:border-[#1c1b1b] overflow-hidden flex flex-col p-6 min-h-[400px]">
   {activeTab === 'notepad' ? (
    <div className="flex flex-col items-center justify-center h-full space-y-12 relative">
     {/* Direct Quote Bubble */}
     <div className="relative flex flex-col items-center">
     <div className="bg-white dark:!bg-[#121212] dark:bg-slate-700 p-6 rounded-2xl shadow-md border-2 border-slate-200 dark:border-[#1c1b1b] relative z-10 max-w-sm text-center">
      <p className="text-xl font-bold text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">"{nQ.quote}"</p>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 dark:bg-slate-700 border-b-2 border-r-2 border-slate-200 dark:border-[#1c1b1b] rotate-45 z-0"></div>
     </div>
     <div className="mt-6 flex flex-col items-center">
      <div className="bg-blue-100 dark:bg-blue-900/50 dark:bg-blue-900/60 dark:bg-blue-900 p-4 rounded-full border-4 border-white dark:border-neutral-900 shadow-sm z-10">
       <User className="w-10 h-10 text-blue-600 dark:text-blue-400 dark:text-blue-300" />
      </div>
      <span className="mt-2 font-bold text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-wider text-sm">{nQ.speaker}</span>
     </div>
     </div>

     {/* Transition arrow */}
     <ArrowRight className="w-8 h-8 text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] rotate-90 lg:rotate-0" />

     {/* Reported Notepad */}
     <div className={`transition-all duration-500 flex flex-col items-center ${nFeedback === 'correct' ? 'opacity-100 scale-100' : 'opacity-40 scale-95 grayscale'}`}>
     <div className="bg-yellow-100 dark:bg-yellow-900/50 dark:bg-yellow-900/60 dark:bg-yellow-900/40 p-6 rounded-xl shadow-md border-t-8 border-yellow-400 relative z-10 w-64 md:w-80">
      <div className="flex items-center gap-2 mb-3 border-b border-yellow-300 dark:border-yellow-700/50 pb-2">
       <Edit3 className="w-5 h-5 text-yellow-600 dark:text-yellow-400 dark:text-yellow-500" />
       <span className="font-bold text-yellow-800 dark:text-yellow-200 dark:text-yellow-500 text-sm uppercase tracking-wider">Reporter's Notes</span>
      </div>
      <p className="text-yellow-900 dark:text-yellow-100 dark:text-yellow-200 font-medium italic min-h-[60px]">
       {nFeedback === 'correct' ? nInput : "Waiting for correct notes..."}
      </p>
     </div>
     </div>
    </div>
   ) : (
    <div className="flex flex-col items-center justify-center h-full space-y-12 relative w-full">
     {/* Visual Representation */}
     <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center">
     {cQ.iconSet === 'water' && (
      <>
       <div className="flex flex-col items-center w-32">
        <Thermometer className={`w-20 h-20 ${cFeedback === 'correct' ? 'text-blue-500 dark:text-blue-400' : 'text-red-500 dark:text-red-400'} transition-colors duration-700`} />
        <span className="mt-4 font-bold text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] text-center">{cFeedback === 'correct' ? '0°C (Cooled)' : '20°C (Room Temp)'}</span>
       </div>
       <ArrowRight className={`w-10 h-10 transition-colors duration-700 ${cFeedback === 'correct' ? 'text-green-500 dark:text-green-400' : 'text-slate-300 dark:text-[#ffffff]'} rotate-90 md:rotate-0`} />
       <div className="flex flex-col items-center w-32">
        {cFeedback === 'correct' ? (
        <Snowflake className="w-20 h-20 text-blue-400 animate-pulse" />
        ) : (
        <Droplet className="w-20 h-20 text-blue-500 dark:text-blue-400" />
        )}
        <span className="mt-4 font-bold text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] text-center">{cFeedback === 'correct' ? 'Solid Ice' : 'Liquid Water'}</span>
       </div>
      </>
     )}

     {cQ.iconSet === 'exam' && (
      <>
       <div className="flex flex-col items-center w-32">
        <BookOpen className={`w-20 h-20 ${cFeedback === 'correct' ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-[#a1a1aa] dark:text-[#ffffff]'} transition-colors duration-700`} />
        <span className="mt-4 font-bold text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] text-center">Studying Hard</span>
       </div>
       <ArrowRight className={`w-10 h-10 transition-colors duration-700 ${cFeedback === 'correct' ? 'text-green-500 dark:text-green-400' : 'text-slate-300 dark:text-[#ffffff]'} rotate-90 md:rotate-0`} />
       <div className="flex flex-col items-center w-32">
        <Award className={`w-20 h-20 ${cFeedback === 'correct' ? 'text-yellow-500 dark:text-yellow-400 scale-110' : 'text-slate-500 dark:text-[#a1a1aa] dark:text-[#ffffff]'} transition-all duration-700`} />
        <span className="mt-4 font-bold text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] text-center">{cFeedback === 'correct' ? 'A+ Grade!' : 'Exam Result'}</span>
       </div>
      </>
     )}

     {cQ.iconSet === 'lottery' && (
      <>
       <div className="flex flex-col items-center w-32">
        <Ticket className={`w-20 h-20 ${cFeedback === 'correct' ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-[#a1a1aa] dark:text-[#ffffff]'} transition-colors duration-700`} />
        <span className="mt-4 font-bold text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] text-center">Winning Ticket</span>
       </div>
       <ArrowRight className={`w-10 h-10 transition-colors duration-700 ${cFeedback === 'correct' ? 'text-green-500 dark:text-green-400' : 'text-slate-300 dark:text-[#ffffff]'} rotate-90 md:rotate-0`} />
       <div className="flex flex-col items-center w-32">
        <Home className={`w-20 h-20 ${cFeedback === 'correct' ? 'text-indigo-500 dark:text-indigo-400 scale-110' : 'text-slate-500 dark:text-[#a1a1aa] dark:text-[#ffffff]'} transition-all duration-700`} />
        <span className="mt-4 font-bold text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] text-center">{cFeedback === 'correct' ? 'Mansion Acquired' : 'Dream House'}</span>
       </div>
      </>
     )}
     </div>
     
     {/* Logic Loop text overlay */}
     <div className="/80 dark:bg-[#121212]/80 backdrop-blur px-6 py-3 rounded-full border border-slate-200 dark:border-[#1c1b1b] shadow-sm transition-all w-full max-w-sm text-center">
     <p className="font-mono text-sm text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] flex items-center justify-center gap-2">
      <RefreshCw className={`w-4 h-4 shrink-0 ${cFeedback === 'correct' ? 'animate-spin text-green-500 dark:text-green-400' : ''}`} />
      <span className="truncate">IF ( {cInput1 || '...'} ) THEN ( {cInput2 || '...'} )</span>
     </p>
     </div>
    </div>
   )}
   </div>
  </div>
  </main>
 </div>
 );
}
