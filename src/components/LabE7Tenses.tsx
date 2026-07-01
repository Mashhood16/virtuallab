import { useState } from 'react';
import { ArrowLeft, Clock, RefreshCw, CheckCircle2, XCircle , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

interface Question {
 id: number;
 sentence: string;
 baseVerb: string;
 tense: string;
 voice: string;
 answer: string;
 timelinePos: 'past' | 'present' | 'future';
 hint: string;
}

const QUESTIONS: Question[] = [
 {
 id: 1,
 sentence: "Look! The mechanic ___ the car.",
 baseVerb: "repair",
 tense: "Present Continuous",
 voice: "Active",
 answer: "is repairing",
 timelinePos: "present",
 hint: "Use 'is/am/are' + verb-ing for actions happening right now."
 },
 {
 id: 2,
 sentence: "While we slept, the bridge ___ by the workers.",
 baseVerb: "build",
 tense: "Past Continuous",
 voice: "Passive",
 answer: "was being built",
 timelinePos: "past",
 hint: "Use 'was/were being' + past participle for ongoing past actions in passive voice."
 },
 {
 id: 3,
 sentence: "I promise they ___ to Mars next decade.",
 baseVerb: "travel",
 tense: "Simple Future",
 voice: "Active",
 answer: "will travel",
 timelinePos: "future",
 hint: "Use 'will' + base verb for future predictions or promises."
 },
 {
 id: 4,
 sentence: "At 8 PM tonight, I ___ my favorite movie.",
 baseVerb: "watch",
 tense: "Future Continuous",
 voice: "Active",
 answer: "will be watching",
 timelinePos: "future",
 hint: "Use 'will be' + verb-ing for actions that will be in progress at a specific time in the future."
 },
 {
 id: 5,
 sentence: "The letters ___ when the power went out.",
 baseVerb: "type",
 tense: "Past Continuous",
 voice: "Passive",
 answer: "were being typed",
 timelinePos: "past",
 hint: "Use 'was/were being' + past participle for plural subjects in passive past continuous."
 }
];

export default function LabE7Tenses({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
 const [userInput, setUserInput] = useState("");
 const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
 const [score, setScore] = useState(0);

 const currentQ = QUESTIONS[currentQuestionIdx];

 const handleCheck = () => {
 if (!userInput.trim()) return;
 
 if (userInput.trim().toLowerCase() === currentQ.answer.toLowerCase()) {
  setFeedback('correct');
  setScore(s => s + 1);
 } else {
  setFeedback('incorrect');
 }
 };

 const handleNext = () => {
 setUserInput("");
 setFeedback('idle');
 setCurrentQuestionIdx((prev) => (prev + 1) % QUESTIONS.length);
 };

 const renderTimeline = () => {
 return (
  <div className="relative w-full h-48 flex items-center justify-center mt-12 bg-slate-100 dark:bg-[#121212] rounded-xl p-4">
  {/* Timeline Axis */}
  <div className="absolute w-[80%] h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
  
  {/* Markers */}
  <div className="absolute left-[10%] flex flex-col items-center">
   <div className={`w-4 h-4 rounded-full ${currentQ.timelinePos === 'past' ? 'bg-indigo-500 scale-150 shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 'bg-slate-400 dark:bg-slate-500'} transition-all duration-300`} />
   <span className="mt-2 text-sm font-semibold text-slate-500 dark:text-[#71717a]">Past</span>
  </div>
  
  <div className="absolute left-[50%] flex flex-col items-center">
   <div className={`w-4 h-4 rounded-full ${currentQ.timelinePos === 'present' ? 'bg-emerald-500 scale-150 shadow-[0_0_15px_rgba(16,185,129,0.6)]' : 'bg-slate-400 dark:bg-slate-500'} transition-all duration-300`} />
   <span className="mt-2 text-sm font-semibold text-slate-500 dark:text-[#71717a]">Present</span>
  </div>
  
  <div className="absolute right-[10%] flex flex-col items-center">
   <div className={`w-4 h-4 rounded-full ${currentQ.timelinePos === 'future' ? 'bg-amber-500 scale-150 shadow-[0_0_15px_rgba(245,158,11,0.6)]' : 'bg-slate-400 dark:bg-slate-500'} transition-all duration-300`} />
   <span className="mt-2 text-sm font-semibold text-slate-500 dark:text-[#71717a]">Future</span>
  </div>

  {/* Current action indicator */}
  <div className={`absolute top-4 px-4 py-2 bg-white dark:bg-slate-700 rounded-lg shadow-lg border-2 ${feedback === 'correct' ? 'border-emerald-400' : 'border-indigo-400'} text-slate-800 dark:text-slate-100 font-medium transition-all duration-500 ${ currentQ.timelinePos === 'past' ? 'left-[10%] -translate-x-1/2' : currentQ.timelinePos === 'present' ? 'left-[50%] -translate-x-1/2' : 'right-[10%] translate-x-1/2' }`}>
   {feedback === 'correct' ? currentQ.answer : `(${currentQ.baseVerb})`}
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
    Timeline Conjugator
   </h1>
   <p className="text-sm text-slate-500 dark:text-[#71717a]">
    Class 7 English: Tenses & Voice
   </p>
   </div>
  </div>
  <div className="flex items-center gap-2">
   <span className="font-semibold text-indigo-600 dark:text-indigo-400">
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
  <main className="flex-1 flex flex-col md:flex-row lg:overflow-hidden">
  {/* Left Column: Interactive Controls */}
  <section className="w-full md:w-1/2 p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] flex flex-col">
   <div className="mb-6">
   <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
    <Clock className="w-5 h-5" />
    Conjugation Station
   </h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm">
    Read the sentence and fill in the blank with the correct tense and voice of the verb.
   </p>
   </div>

   <div className="flex-1 flex flex-col justify-center space-y-6">
   {/* Target Info */}
   <div className="grid grid-cols-2 gap-4">
    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider block mb-1">Target Tense</span>
    <span className="font-medium">{currentQ.tense}</span>
    </div>
    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider block mb-1">Target Voice</span>
    <span className="font-medium">{currentQ.voice}</span>
    </div>
   </div>

   {/* Sentence Builder */}
   <div className="p-6 bg-slate-50 dark:!bg-[#121212] rounded-xl border-2 border-slate-200 dark:border-[#1c1b1b] shadow-sm">
    <p className="text-lg font-medium leading-relaxed mb-6 text-slate-700 dark:text-[#ffffff]">
    {currentQ.sentence.split('___').map((part, i, arr) => (
     <span key={i}>
     {part}
     {i < arr.length - 1 && (
      <span className="mx-2 inline-block">
      <input
       type="text"
       value={userInput}
       onChange={(e) => {
       setUserInput(e.target.value);
       setFeedback('idle');
       }}
       disabled={feedback === 'correct'}
       placeholder={`(${currentQ.baseVerb})`}
       className={`w-32 sm:w-40 px-3 py-1 border-b-2 bg-transparent text-center focus:outline-none transition-colors ${ feedback === 'correct' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold' : feedback === 'incorrect' ? 'border-red-500 text-red-600 dark:text-red-400' : 'border-indigo-400 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300 focus:border-indigo-600 dark:focus:border-indigo-400' }`}
      />
      </span>
     )}
     </span>
    ))}
    </p>

    {/* Feedback Area */}
    <div className="min-h-[60px] flex items-center">
    {feedback === 'correct' && (
     <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
     <CheckCircle2 className="w-5 h-5" />
     <span>Excellent! You got it right.</span>
     </div>
    )}
    {feedback === 'incorrect' && (
     <div className="flex flex-col text-red-500 dark:text-red-400 text-sm">
     <div className="flex items-center gap-2 font-medium mb-1">
      <XCircle className="w-5 h-5" />
      <span>Not quite. Check your conjugation.</span>
     </div>
     <span className="text-slate-600 dark:text-[#71717a] text-xs pl-7">
      Hint: {currentQ.hint}
     </span>
     </div>
    )}
    </div>
   </div>

   {/* Actions */}
   <div className="flex gap-4 mt-auto">
    <button
    onClick={handleCheck}
    disabled={!userInput.trim() || feedback === 'correct'}
    className="flex-1 whitespace-nowrap flex-shrink-0 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 text-white font-semibold rounded-lg shadow-sm transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    Check Answer
    </button>
    {feedback === 'correct' && (
    <button
     onClick={handleNext}
     className="whitespace-nowrap flex-shrink-0 py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
    >
     Next
     <RefreshCw className="w-4 h-4" />
    </button>
    )}
   </div>
   </div>
  </section>

  {/* Right Column: Simulation Canvas */}
  <section className="w-full md:w-1/2 p-6 bg-slate-100 dark:bg-[#121212] lg:overflow-y-auto flex flex-col">
   <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-[#ffffff]">Timeline Visualization</h2>
   
   <div className="flex-1 flex flex-col justify-center items-center">
   {renderTimeline()}

   <div className="mt-12 max-w-sm w-full bg-white dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-3 border-b border-slate-100 dark:border-[#1c1b1b] pb-2">Rule Reminder</h3>
    <ul className="space-y-3 text-sm text-slate-600 dark:text-[#a1a1aa]">
    <li className="flex gap-2">
     <span className="font-bold text-indigo-500">•</span>
     <span><strong>Active Voice:</strong> The subject performs the action.</span>
    </li>
    <li className="flex gap-2">
     <span className="font-bold text-indigo-500">•</span>
     <span><strong>Passive Voice:</strong> The subject receives the action (often using 'by'). Needs a 'be' verb + past participle.</span>
    </li>
    <li className="flex gap-2">
     <span className="font-bold text-emerald-500">•</span>
     <span><strong>Continuous Tense:</strong> Shows ongoing action (needs an '-ing' form or 'being').</span>
    </li>
    </ul>
   </div>
   </div>
  </section>
  </main>
 </div>
 );
}
