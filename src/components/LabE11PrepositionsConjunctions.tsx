import { useState } from 'react';
import { ArrowLeft, Check, BookOpen, Puzzle, AlertCircle, List } from 'lucide-react';

const PUZZLES = [
 {
 id: 1,
 topic: "Coordinating Conjunctions",
 text: "I was very tired, {gap} I went to bed early.",
 options: ["for", "and", "so", "but"],
 answer: "so",
 feedback: "'so' indicates a result or consequence."
 },
 {
 id: 2,
 topic: "Subordinating Conjunctions",
 text: "{gap} it was raining, we decided to stay indoors.",
 options: ["Although", "Because", "Unless", "Until"],
 answer: "Because",
 feedback: "'Because' introduces a cause or reason."
 },
 {
 id: 3,
 topic: "Prepositions of Place",
 text: "The keys are hidden {gap} the mat.",
 options: ["over", "under", "through", "into"],
 answer: "under",
 feedback: "'under' indicates position beneath something."
 },
 {
 id: 4,
 topic: "Correlative Conjunctions",
 text: "She is {gap} intelligent but also very kind.",
 options: ["neither", "either", "not only", "both"],
 answer: "not only",
 feedback: "'not only... but also' are used together to link two qualities."
 },
 {
 id: 5,
 topic: "Interjections",
 text: "{gap} ! I didn't see you there.",
 options: ["Alas", "Oh", "Well", "Bravo"],
 answer: "Oh",
 feedback: "'Oh' expresses surprise."
 },
 {
 id: 6,
 topic: "Phrasal Prepositions",
 text: "We stayed home {gap} the bad weather.",
 options: ["instead of", "because of", "in spite of", "according to"],
 answer: "because of",
 feedback: "'because of' shows the reason for staying home."
 }
];

export default function LabE11PrepositionsConjunctions({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
 const [selectedOption, setSelectedOption] = useState<string | null>(null);
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const puzzle = PUZZLES[currentPuzzleIndex];

 const handleCheck = () => {
 if (selectedOption === puzzle.answer) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 const handleNext = () => {
 setSelectedOption(null);
 setIsCorrect(null);
 setCurrentPuzzleIndex((prev) => (prev + 1) % PUZZLES.length);
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans text-slate-900 dark:text-[#ffffff]">
  {/* Header */}
  <header className="flex items-center p-4 shadow-sm z-10 border-b border-slate-200 dark:border-[#1c1b1b] shrink-0">
  <button 
   onClick={onExit} 
   className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-[#2a2a2a] transition-colors whitespace-nowrap flex-shrink-0"
   aria-label="Go Back"
  >
   <ArrowLeft size={24} className="text-slate-700 dark:text-slate-300" />
  </button>
  <h1 className="text-2xl font-bold flex-1 flex items-center gap-2 text-slate-900 dark:text-white">
   <BookOpen className="text-[#4158D1]" />
   Prepositions & Conjunctions
  </h1>
  </header>

  {/* Mobile Tab Navigation */}
  <div className="lg:hidden px-4 pt-4 md:px-6 flex gap-2 shrink-0">
   <button 
   onClick={() => setActiveMobileTab('theory')}
   className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
  >
   Theory
  </button>
   <button 
   onClick={() => setActiveMobileTab('lab')}
   className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
  >Lab</button>
  </div>

  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg: overflow-y-auto lg:overflow-visible">
  {/* Window 1: Theory */}
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow-hidden  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2 shrink-0">
   <BookOpen className="w-5 h-5 text-[#4158D1]" />
   Grammar Theory
   </h2>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <h3 className="text-slate-800 dark:text-slate-200 font-bold text-lg mb-2">Prepositions</h3>
   <p className="mb-4">
    A preposition is a word or group of words used before a noun, pronoun, or noun phrase to show direction, time, place, location, spatial relationships, or to introduce an object.
   </p>
   <ul className="list-disc pl-5 mb-4 space-y-2">
    <li><strong>Time:</strong> Indicates when an event happens. Example: <em>at</em> 5 PM, <em>on</em> Monday, <em>in</em> May, <em>during</em> the test.</li>
    <li><strong>Place:</strong> Indicates where something is located. Example: <em>in</em> the box, <em>on</em> the table, <em>at</em> the door, <em>under</em> the bed.</li>
    <li><strong>Direction:</strong> Shows movement towards a destination. Example: travel <em>to</em> school, walk <em>into</em> the room, look <em>towards</em> the sky.</li>
    <li><strong>Phrasal Prepositions:</strong> Two or more words acting as a preposition. Example: <em>because of</em> the rain, <em>in spite of</em> the delay, <em>according to</em> the rules.</li>
   </ul>

   <h3 className="text-slate-800 dark:text-slate-200 font-bold text-lg mb-2 mt-6">Conjunctions</h3>
   <p className="mb-4">
    A conjunction connects clauses, sentences, or coordinates words in the same clause. They are essential for demonstrating the relationship between different ideas.
   </p>
   <ul className="list-disc pl-5 mb-4 space-y-2">
    <li><strong>Coordinating Conjunctions:</strong> Join parts of a sentence that are grammatically equal. Remember the acronym FANBOYS (For, And, Nor, But, Or, Yet, So).<br/>Example: I wanted to go, <strong>but</strong> it was raining.</li>
    <li><strong>Subordinating Conjunctions:</strong> Join a dependent clause to an independent clause, establishing a relationship of time, reason, or condition.<br/>Example: We stayed inside <strong>because</strong> it was cold.</li>
    <li><strong>Correlative Conjunctions:</strong> Work in pairs to join words or phrases that carry equal importance.<br/>Example: She is <strong>not only</strong> intelligent <strong>but also</strong> very kind.</li>
   </ul>

   <h3 className="text-slate-800 dark:text-slate-200 font-bold text-lg mb-2 mt-6">Interjections</h3>
   <p className="mb-4">
    An interjection is a word or phrase that expresses a strong emotion or sudden feeling. They can stand alone or be placed before a sentence, often followed by an exclamation point.
   </p>
   <ul className="list-disc pl-5 mb-4 space-y-2">
    <li><strong>Joy/Surprise:</strong> Wow!, Oh!, Aha!</li>
    <li><strong>Pain:</strong> Ouch!, Ow!</li>
    <li><strong>Sorrow:</strong> Alas!</li>
    <li><strong>Hesitation:</strong> Uh, well, hmm...</li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2 shrink-0">
   <List className="w-5 h-5 text-[#4158D1]" />
   Options
   </h2>
   <div className="flex-grow overflow-y-auto flex flex-col gap-4">
   <div className="flex justify-between items-center mb-2">
    <div className="flex items-center gap-2 text-[#4158D1] font-bold uppercase tracking-wider text-sm">
    <Puzzle size={18} />
    {puzzle.topic}
    </div>
    <span className="text-xs font-medium px-2 py-1 bg-white dark:bg-[#2a2a2a] text-slate-600 dark:text-[#a1a1aa] rounded border border-slate-200 dark:border-[#333]">
    {currentPuzzleIndex + 1} / {PUZZLES.length}
    </span>
   </div>

   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-2">Select the correct word to complete the sentence:</p>

   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
    {puzzle.options.map(opt => (
    <button
     key={opt}
     disabled={isCorrect === true}
     onClick={() => {
     if (isCorrect !== true) {
      setSelectedOption(opt);
      setIsCorrect(null);
     }
     }}
     className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all shadow-sm ${ selectedOption === opt ? 'bg-[#4158D1] text-white shadow-md ring-2 ring-[#4158D1]/30 dark:ring-indigo-900' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-[#121212] dark:text-white dark:border-[#333] dark:hover:bg-[#2a2a2a]' } ${isCorrect === true ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
    >
     {opt}
    </button>
    ))}
   </div>

   <div className="mt-auto flex flex-col gap-4">
    {!isCorrect && isCorrect !== false && (
    <button 
     onClick={handleCheck}
     disabled={!selectedOption}
     className={`w-full py-3 rounded-lg font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${ selectedOption ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-[#2a2a2a] dark:text-[#71717a]' }`}
    >
     <Check size={18} /> Check Answer
    </button>
    )}
    
    {isCorrect === true && (
    <div className={`flex flex-col items-center bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800/50 `}>
     <div className="text-emerald-600 dark:text-emerald-400 font-bold text-lg flex items-center gap-2 mb-2">
     <Check size={20} /> Correct!
     </div>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa] text-center mb-4">{puzzle.feedback}</p>
     <button 
     onClick={handleNext}
     className={`w-full py-3 bg-[#4158D1] hover:bg-indigo-600 text-white rounded-lg font-bold shadow-md transition-all flex-col `}
     >
     Next Puzzle
     </button>
    </div>
    )}
    
    {isCorrect === false && (
    <div className={`flex flex-col items-center bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg border border-rose-200 dark:border-rose-800/50 `}>
     <div className="text-rose-600 dark:text-rose-400 font-bold text-sm flex items-center gap-2">
     <AlertCircle size={18} /> Incorrect, try another option!
     </div>
    </div>
    )}
   </div>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative flex items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="absolute top-6 left-6 text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
   <Puzzle className="w-5 h-5 text-[#4158D1]" />
   Sentence Construction
   </h2>
   <div className="w-full max-w-2xl px-6">
   <div className="text-2xl md:text-3xl font-medium leading-relaxed text-slate-800 dark:text-[#ffffff] py-12 px-8 rounded-2xl shadow-sm border border-slate-200 dark:border-[#333] text-center">
    {puzzle.text.split('{gap}').map((part, idx) => (
    <span key={idx}>
     {part}
     {idx === 0 && (
     <span 
      className={`inline-flex items-center justify-center min-w-[120px] mx-3 px-4 py-2 border-b-4 rounded-t-sm transition-all duration-300 ${ selectedOption ? isCorrect === true ? 'bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/40 dark:border-emerald-500 dark:text-emerald-300' : isCorrect === false ? 'bg-rose-100 border-rose-500 text-rose-800 dark:bg-rose-900/40 dark:border-rose-500 dark:text-rose-300' : 'bg-indigo-50 border-[#4158D1] text-[#4158D1] dark:bg-[#4158D1]/20 dark:border-[#4158D1] dark:text-indigo-300' : 'bg-slate-50 border-slate-300 text-slate-400 dark:bg-[#1c1b1b] dark:border-[#444]' }`}
     >
      {selectedOption || "___"}
     </span>
     )}
    </span>
    ))}
   </div>
   </div>
  </section>
  </main>
 </div>
 );
}
