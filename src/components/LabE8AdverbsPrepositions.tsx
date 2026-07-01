import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Play , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

const QUESTIONS = [
 {
 id: 1,
 goal: "Direct the actor to move with stealth, to the back of the stage, without delay.",
 mannerOpts: ["loudly", "stealthily", "clumsily"],
 placeOpts: ["in the spotlight", "behind the props", "at the front"],
 timeOpts: ["later", "gradually", "immediately"],
 correct: { manner: "stealthily", place: "behind the props", time: "immediately" },
 feedback: "Great! 'Stealthily' is an adverb of manner, 'behind the props' is a prepositional phrase showing place, and 'immediately' is an adverb of time."
 },
 {
 id: 2,
 goal: "Tell the actor to speak with great volume, every day, in front of the audience.",
 mannerOpts: ["loudly", "softly", "rapidly"],
 placeOpts: ["before the audience", "behind the stage", "under the bridge"],
 timeOpts: ["rarely", "daily", "once"],
 correct: { manner: "loudly", place: "before the audience", time: "daily" },
 feedback: "Excellent! 'Loudly' (manner), 'before the audience' (place prepositional phrase), and 'daily' (frequency/time)."
 },
 {
 id: 3,
 goal: "The actor should wait in a calm manner, beneath the tree prop, from time to time.",
 mannerOpts: ["anxiously", "peacefully", "frantically"],
 placeOpts: ["under the tree", "above the stage", "through the door"],
 timeOpts: ["occasionally", "never", "always"],
 correct: { manner: "peacefully", place: "under the tree", time: "occasionally" },
 feedback: "Perfect! 'Peacefully' (manner), 'under the tree' (place), and 'occasionally' (frequency)."
 },
 {
 id: 4,
 goal: "Instruct the actor to jump with sudden force, over the wall prop, in the morning.",
 mannerOpts: ["abruptly", "slowly", "carefully"],
 placeOpts: ["over the wall", "into the box", "against the wind"],
 timeOpts: ["at night", "in the morning", "eventually"],
 correct: { manner: "abruptly", place: "over the wall", time: "in the morning" },
 feedback: "Well done! 'Abruptly' (manner), 'over the wall' (place prep phrase), 'in the morning' (time prep phrase)."
 }
];

export default function LabE8AdverbsPrepositions({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [currentQIdx, setCurrentQIdx] = useState(0);
 const [manner, setManner] = useState("");
 const [place, setPlace] = useState("");
 const [time, setTime] = useState("");
 const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
 const [animating, setAnimating] = useState(false);

 const question = QUESTIONS[currentQIdx];

 const handleAction = () => {
 if (!manner || !place || !time) return;
 
 if (manner === question.correct.manner && 
  place === question.correct.place && 
  time === question.correct.time) {
  setStatus('success');
  setAnimating(true);
  setTimeout(() => setAnimating(false), 3000);
 } else {
  setStatus('error');
 }
 };

 const nextQuestion = () => {
 if (currentQIdx < QUESTIONS.length - 1) {
  setCurrentQIdx(q => q + 1);
  setManner("");
  setPlace("");
  setTime("");
  setStatus('idle');
 }
 };

 const getActorX = () => {
 if (place === "behind the props") return "20%";
 if (place === "before the audience") return "50%";
 if (place === "under the tree") return "80%";
 if (place === "over the wall") return "70%";
 return "50%";
 };

 const getActorY = () => {
 if (place === "behind the props") return "40%";
 if (place === "before the audience") return "80%";
 if (place === "under the tree") return "75%";
 if (place === "over the wall") return "30%";
 if (animating && manner === "abruptly") return "20%";
 return "60%";
 };

 const getActorOpacity = () => {
 if (manner === "stealthily" && animating) return 0.4;
 return 1;
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-[#000000]/50 dark:!bg-[#000000] dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">
  <header className="flex items-center p-4 bg-indigo-600 dark:bg-indigo-800 text-white shadow-md flex-shrink-0">
  <button 
   onClick={onExit} 
   className="flex items-center gap-2 hover:/20 px-3 py-1.5 rounded transition-colors whitespace-nowrap flex-shrink-0"
  >
   <ArrowLeft size={18} />
   Go Back
  </button>
  <h1 className="text-lg md:text-xl font-bold ml-6 flex-1 text-center">Scene Director: Adverbs & Prepositions</h1>
  
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
   
   <div className="bg-indigo-50 dark:bg-indigo-900/50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
   <h2 className="text-sm font-bold text-indigo-800 dark:text-indigo-200 dark:text-indigo-300 uppercase tracking-wider mb-2">Director's Goal</h2>
   <p className="text-lg font-medium">{question.goal}</p>
   </div>

   <div className="flex flex-col gap-4">
   <div>
    <label className="block text-sm font-semibold text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] mb-1">Adverb of Manner (How?)</label>
    <div className="grid grid-cols-3 gap-2">
    {question.mannerOpts.map(opt => (
     <button
     key={opt}
     onClick={() => { setManner(opt); setStatus('idle'); }}
     className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${ manner === opt ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 dark:text-indigo-200' : 'border-slate-200 dark:border-[#1c1b1b] dark:border-slate-600 hover:border-indigo-300 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] dark:text-[#ffffff] dark:text-[#ffffff]' }`}
     >
     {opt}
     </button>
    ))}
    </div>
   </div>

   <div>
    <label className="block text-sm font-semibold text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] mb-1">Prepositional Phrase (Where?)</label>
    <div className="grid grid-cols-1 gap-2">
    {question.placeOpts.map(opt => (
     <button
     key={opt}
     onClick={() => { setPlace(opt); setStatus('idle'); }}
     className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all text-left whitespace-nowrap flex-shrink-0 ${ place === opt ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 dark:text-emerald-200' : 'border-slate-200 dark:border-[#1c1b1b] dark:border-slate-600 hover:border-emerald-300 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] dark:text-[#ffffff] dark:text-[#ffffff]' }`}
     >
     {opt}
     </button>
    ))}
    </div>
   </div>

   <div>
    <label className="block text-sm font-semibold text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] mb-1">Adverb/Phrase of Time (When?)</label>
    <div className="grid grid-cols-3 gap-2">
    {question.timeOpts.map(opt => (
     <button
     key={opt}
     onClick={() => { setTime(opt); setStatus('idle'); }}
     className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${ time === opt ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 dark:text-amber-200' : 'border-slate-200 dark:border-[#1c1b1b] dark:border-slate-600 hover:border-amber-300 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] dark:text-[#ffffff] dark:text-[#ffffff]' }`}
     >
     {opt}
     </button>
    ))}
    </div>
   </div>
   </div>

   <div className="mt-4 flex gap-4">
   <button
    onClick={handleAction}
    disabled={!manner || !place || !time}
    className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 min-w-0 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    <Play size={20} />
    Action!
   </button>
   </div>

   {status === 'success' && (
   <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl animate-[fadeIn_0.5s_ease-out]">
    <div className="flex items-start gap-3">
    <CheckCircle className="text-green-600 dark:text-green-400 dark:text-green-400 mt-0.5" size={20} />
    <div>
     <h3 className="font-bold text-green-800 dark:text-green-200 dark:text-green-300">Perfect Direction!</h3>
     <p className="text-sm text-green-700 dark:text-green-300 dark:text-green-400 mt-1">{question.feedback}</p>
    </div>
    </div>
    {currentQIdx < QUESTIONS.length - 1 ? (
    <button
     onClick={nextQuestion}
     className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium w-full transition-colors whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
    >
     Next Scene
    </button>
    ) : (
    <div className="mt-4 text-center font-bold text-green-700 dark:text-green-300 dark:text-green-400">
     Bravo! You've successfully directed all scenes!
    </div>
    )}
   </div>
   )}

   {status === 'error' && (
   <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl animate-[fadeIn_0.5s_ease-out] flex items-center gap-3">
    <XCircle className="text-red-600 dark:text-red-400 dark:text-red-400 flex-shrink-0" size={20} />
    <p className="text-sm font-medium text-red-800 dark:text-red-200 dark:text-red-300">Cut! That wasn't quite right. Review the goal and try matching the correct manner, place, and time.</p>
   </div>
   )}

  </div>

  <div className="w-full lg:w-1/2 p-6 bg-[#000000] flex flex-col items-center justify-center relative overflow-hidden">
   <h2 className="absolute top-6 left-6 text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] font-bold tracking-widest uppercase text-sm">The Stage</h2>
   
   <div className="relative w-full max-w-md aspect-video bg-[#121212] rounded-xl overflow-hidden shadow-2xl border-4 border-[#1c1b1b]">
   <div className="absolute bottom-0 w-full h-1/3 bg-amber-900/40 rounded-t-[100%] shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)]"></div>
   
   <div className="absolute top-0 left-0 w-16 h-full bg-red-900 border-r-4 border-red-950 shadow-xl z-10 rounded-br-2xl"></div>
   <div className="absolute top-0 right-0 w-16 h-full bg-red-900 border-l-4 border-red-950 shadow-xl z-10 rounded-bl-2xl"></div>
   <div className="absolute top-0 w-full h-12 bg-red-800 z-10 rounded-b-xl shadow-lg border-b-4 border-red-950"></div>

   {question.id === 1 && (
    <div className="absolute bottom-16 left-1/4 w-24 h-32 bg-slate-600 rounded-lg shadow-lg border-2 border-slate-500 z-0">
    <div className="text-xs text-center mt-12 text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa]">STAGE PROPS</div>
    </div>
   )}
   {question.id === 3 && (
    <div className="absolute bottom-16 right-1/4 w-12 h-32 bg-amber-950 rounded-t-lg z-0">
    <div className="absolute -top-16 -left-12 w-32 h-24 bg-emerald-800 rounded-full shadow-lg"></div>
    </div>
   )}
   {question.id === 4 && (
    <div className="absolute bottom-16 left-1/3 w-32 h-16 bg-stone-600 rounded-t-sm z-0 shadow-lg border-t-2 border-stone-500">
    <div className="text-xs text-center mt-6 text-stone-400">BRICK WALL</div>
    </div>
   )}

   <div 
    className="absolute transition-all duration-1000 ease-in-out z-20 flex flex-col items-center"
    style={{
    left: status === 'success' ? getActorX() : '50%',
    top: status === 'success' ? getActorY() : '60%',
    transform: 'translate(-50%, -50%)',
    opacity: getActorOpacity()
    }}
   >
    <div className={`w-8 h-8 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.6)] ${animating && manner === 'abruptly' ? 'animate-bounce' : ''}`}></div>
    <div className={`w-6 h-12 bg-blue-500 rounded-sm mt-1 ${animating && manner === 'abruptly' ? 'animate-bounce' : ''}`}></div>
    {status === 'success' && animating && (
    <div className="absolute -top-10 dark:bg-[#121212] text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-white text-xs px-2 py-1 rounded-full whitespace-nowrap shadow-lg border border-slate-200 dark:border-[#1c1b1b] animate-pulse">
     {manner} {place} {time}!
    </div>
    )}
   </div>

   <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-[200%] bg-gradient-to-b from-yellow-200/40 to-transparent transform origin-top transition-opacity duration-500 pointer-events-none z-30 ${animating ? 'opacity-100' : 'opacity-0'}`}></div>

   </div>

   <div className="mt-8 text-center text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] max-w-sm">
   <p className="text-sm font-medium">Observe the stage to see your directions come to life when correctly assembled.</p>
   </div>

  </div>
  </div>
 </div>
 );
}
