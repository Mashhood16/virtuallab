import { useState, useEffect } from 'react';
import { ArrowLeft, Play, LayoutGrid, Puzzle, CheckCircle2, XCircle, Circle, DoorClosed, Bell, Book, RotateCcw , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

const TRANSITIVE_VERBS = ["open", "kick", "ring", "read"];
const INTRANSITIVE_VERBS = ["sleep", "laugh", "cry", "jump"];
const OBJECTS = [
 { id: "Door", icon: DoorClosed, label: "The Door" },
 { id: "Ball", icon: Circle, label: "The Ball" },
 { id: "Bell", icon: Bell, label: "The Bell" },
 { id: "Book", icon: Book, label: "The Book" }
];

const PUZZLE_PAIRS = [
 { verb: "make", match: "a mistake", type: "predictable collocation" },
 { verb: "do", match: "homework", type: "predictable collocation" },
 { verb: "catch", match: "a cold", type: "predictable collocation" },
 { verb: "pay", match: "attention", type: "predictable collocation" },
 { verb: "give", match: "up", type: "phrasal verb" },
 { verb: "look", match: "after", type: "phrasal verb" },
 { verb: "take", match: "off", type: "phrasal verb" }
];

const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export default function LabE7VerbsCollocations({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [activeTab, setActiveTab] = useState<"stage" | "puzzle">("stage");

 // Stage State
 const [selectedVerb, setSelectedVerb] = useState<string | null>(null);
 const [selectedObject, setSelectedObject] = useState<string | null>(null);
 const [stageLog, setStageLog] = useState<{ message: string; isError: boolean } | null>(null);
 const [stageScore, setStageScore] = useState(0);

 // Puzzle State
 const [availableVerbs, setAvailableVerbs] = useState<string[]>([]);
 const [availableMatches, setAvailableMatches] = useState<string[]>([]);
 const [selectedPuzzleVerb, setSelectedPuzzleVerb] = useState<string | null>(null);
 const [selectedPuzzleMatch, setSelectedPuzzleMatch] = useState<string | null>(null);
 const [completedPairs, setCompletedPairs] = useState<{ verb: string; match: string; type: string }[]>([]);
 const [puzzleError, setPuzzleError] = useState<string | null>(null);
 const [puzzleScore, setPuzzleScore] = useState(0);

 useEffect(() => {
 resetPuzzle();
 }, []);

 const resetPuzzle = () => {
 setAvailableVerbs(shuffle(PUZZLE_PAIRS.map(p => p.verb)));
 setAvailableMatches(shuffle(PUZZLE_PAIRS.map(p => p.match)));
 setCompletedPairs([]);
 setSelectedPuzzleVerb(null);
 setSelectedPuzzleMatch(null);
 setPuzzleError(null);
 setPuzzleScore(0);
 };

 const handleAction = () => {
 if (!selectedVerb) {
  setStageLog({ message: "Please select a verb first!", isError: true });
  return;
 }
 const isTransitive = TRANSITIVE_VERBS.includes(selectedVerb);

 if (isTransitive) {
  if (!selectedObject) {
  setStageLog({ message: `"${selectedVerb}" is a TRANSITIVE verb! It requires an object to act upon.`, isError: true });
  } else {
  setStageLog({ message: `Success! The actor ${selectedVerb}s the ${selectedObject}.`, isError: false });
  setStageScore(s => s + 10);
  }
 } else {
  if (selectedObject) {
  setStageLog({ message: `"${selectedVerb}" is an INTRANSITIVE verb! It cannot take an object like "${selectedObject}".`, isError: true });
  } else {
  setStageLog({ message: `Success! The actor is ${selectedVerb}ing.`, isError: false });
  setStageScore(s => s + 10);
  }
 }
 };

 useEffect(() => {
 if (selectedPuzzleVerb && selectedPuzzleMatch) {
  const pair = PUZZLE_PAIRS.find(p => p.verb === selectedPuzzleVerb && p.match === selectedPuzzleMatch);
  if (pair) {
  setCompletedPairs(prev => [...prev, pair]);
  setAvailableVerbs(prev => prev.filter(v => v !== selectedPuzzleVerb));
  setAvailableMatches(prev => prev.filter(m => m !== selectedPuzzleMatch));
  setSelectedPuzzleVerb(null);
  setSelectedPuzzleMatch(null);
  setPuzzleError(null);
  setPuzzleScore(s => s + 10);
  } else {
  setPuzzleError(`"${selectedPuzzleVerb}" and "${selectedPuzzleMatch}" do not make a valid collocation or phrasal verb!`);
  setTimeout(() => {
   setSelectedPuzzleVerb(null);
   setSelectedPuzzleMatch(null);
   setPuzzleError(null);
  }, 2000);
  }
 }
 }, [selectedPuzzleVerb, selectedPuzzleMatch]);

 return (
 <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] select-none">
  {/* Header */}
  <header className="flex items-center justify-between px-6 py-4 shadow-sm border-b border-slate-200 dark:border-[#1c1b1b] shrink-0">
  <div className="flex items-center space-x-4">
   <button onClick={onExit} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap flex-shrink-0 transition-colors">
   <ArrowLeft className="w-5 h-5" />
   </button>
   <h1 className="text-lg md:text-xl font-bold hidden sm:block">Verb Types & Collocations</h1>
  </div>
  <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
   <button
   onClick={() => setActiveTab("stage")}
   className={`px-4 py-2 rounded-md font-semibold flex items-center transition-colors whitespace-nowrap flex-shrink-0 ${activeTab === "stage" ? " shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
   >
   <LayoutGrid className="w-4 h-4 mr-2" />
   Action Stage
   </button>
   <button
   onClick={() => setActiveTab("puzzle")}
   className={`px-4 py-2 rounded-md font-semibold flex items-center transition-colors whitespace-nowrap flex-shrink-0 ${activeTab === "puzzle" ? " shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
   >
   <Puzzle className="w-4 h-4 mr-2" />
   Collocation Puzzle
   </button>
  </div>
  <div className="font-semibold px-4 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full shadow-inner hidden lg:block">
   Score: {activeTab === "stage" ? stageScore : puzzleScore}
  </div>
  
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:bg-white/20 transition-colors shrink-0 ml-4 dark:bg-[#121212]"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  </header>

  <main className="flex flex-1 lg:overflow-hidden flex-col lg:flex-row">
  {/* Left Column: Controls */}
  <section className="w-full lg:w-1/2 flex flex-col p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b]">
   
   {activeTab === "stage" && (
   <div className="max-w-xl mx-auto w-full space-y-8">
    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
    <h2 className="text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-2">Director's Script</h2>
    <p className="text-sm text-indigo-600 dark:text-indigo-400">
     Select a verb and optionally an object. Remember: <strong>Transitive verbs</strong> need an object. <strong>Intransitive verbs</strong> do not!
    </p>
    </div>

    <div>
    <h3 className="font-bold text-slate-500 dark:text-[#71717a] uppercase text-sm tracking-wider mb-3">1. Select Verb</h3>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
     {[...TRANSITIVE_VERBS, ...INTRANSITIVE_VERBS].sort().map(verb => (
     <button
      key={verb}
      onClick={() => setSelectedVerb(verb)}
      className={`py-2 px-3 rounded-lg font-bold border-2 transition-all whitespace-nowrap flex-shrink-0 ${ selectedVerb === verb ? 'bg-indigo-600 border-indigo-600 text-white shadow-md transform scale-105' : ' border-slate-200 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff] hover:border-indigo-300' }`}
     >
      {verb}
     </button>
     ))}
    </div>
    </div>

    <div>
    <h3 className="font-bold text-slate-500 dark:text-[#71717a] uppercase text-sm tracking-wider mb-3">2. Select Object (Optional)</h3>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
     <button
     onClick={() => setSelectedObject(null)}
     className={`py-2 px-3 rounded-lg font-bold border-2 transition-all flex flex-col items-center justify-center whitespace-nowrap flex-shrink-0 ${ selectedObject === null ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-105' : ' border-slate-200 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff] hover:border-blue-300' }`}
     >
     <span className="text-xl mb-1">🎭</span>
     No Object
     </button>
     {OBJECTS.map(obj => (
     <button
      key={obj.id}
      onClick={() => setSelectedObject(obj.id)}
      className={`py-2 px-3 rounded-lg font-bold border-2 transition-all flex flex-col items-center justify-center whitespace-nowrap flex-shrink-0 ${ selectedObject === obj.id ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-105' : ' border-slate-200 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff] hover:border-blue-300' }`}
     >
      <obj.icon className="w-5 h-5 mb-1" />
      {obj.id}
     </button>
     ))}
    </div>
    </div>

    <div className="pt-4 border-t border-slate-200 dark:border-[#1c1b1b]">
    <button
     onClick={handleAction}
     className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-xl shadow-lg transition-colors flex items-center justify-center whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
    >
     <Play className="w-6 h-6 mr-2 fill-current" />
     ACTION!
    </button>
    </div>

    {stageLog && (
    <div className={`p-4 rounded-xl flex items-start border-l-4 ${ stageLog.isError ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-300' : 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-300' }`}>
     {stageLog.isError ? <XCircle className="w-6 h-6 mr-3 shrink-0" /> : <CheckCircle2 className="w-6 h-6 mr-3 shrink-0" />}
     <span className="font-semibold text-lg">{stageLog.message}</span>
    </div>
    )}
   </div>
   )}

   {activeTab === "puzzle" && (
   <div className="max-w-2xl mx-auto w-full space-y-6">
    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 flex justify-between items-center">
    <div>
     <h2 className="text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-1">Collocation & Phrasal Verbs Snap</h2>
     <p className="text-sm text-indigo-600 dark:text-indigo-400">
     Pair a verb from the left with a matching word on the right.
     </p>
    </div>
    <button onClick={resetPuzzle} className="p-2 bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-full hover:bg-indigo-300 transition-colors whitespace-nowrap flex-shrink-0">
     <RotateCcw className="w-5 h-5" />
    </button>
    </div>

    {puzzleError && (
    <div className="p-3 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-center font-bold animate-pulse">
     {puzzleError}
    </div>
    )}

    <div className="flex gap-4">
    <div className="flex-1 space-y-3">
     <h3 className="font-bold text-slate-500 dark:text-[#71717a] text-center uppercase text-sm tracking-wider">Verbs</h3>
     {availableVerbs.map(v => (
     <button
      key={v}
      onClick={() => setSelectedPuzzleVerb(v === selectedPuzzleVerb ? null : v)}
      className={`w-full py-3 px-4 rounded-lg font-bold border-2 transition-all text-left whitespace-nowrap flex-shrink-0 ${ selectedPuzzleVerb === v ? 'bg-indigo-600 border-indigo-600 text-white shadow-md scale-105 z-10 relative' : ' border-slate-200 dark:border-[#1c1b1b] hover:border-indigo-300 text-slate-700 dark:text-[#ffffff]' }`}
     >
      {v}
     </button>
     ))}
     {availableVerbs.length === 0 && (
     <div className="text-center p-4 text-slate-400 font-bold border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] rounded-lg">Empty</div>
     )}
    </div>

    <div className="flex items-center justify-center text-slate-300 dark:text-slate-600">
     <Puzzle className="w-8 h-8" />
    </div>

    <div className="flex-1 space-y-3">
     <h3 className="font-bold text-slate-500 dark:text-[#71717a] text-center uppercase text-sm tracking-wider">Matches</h3>
     {availableMatches.map(m => (
     <button
      key={m}
      onClick={() => setSelectedPuzzleMatch(m === selectedPuzzleMatch ? null : m)}
      className={`w-full py-3 px-4 rounded-lg font-bold border-2 transition-all text-right whitespace-nowrap flex-shrink-0 ${ selectedPuzzleMatch === m ? 'bg-pink-600 border-pink-600 text-white shadow-md scale-105 z-10 relative' : ' border-slate-200 dark:border-[#1c1b1b] hover:border-pink-300 text-slate-700 dark:text-[#ffffff]' }`}
     >
      {m}
     </button>
     ))}
     {availableMatches.length === 0 && (
     <div className="text-center p-4 text-slate-400 font-bold border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] rounded-lg">Empty</div>
     )}
    </div>
    </div>

   </div>
   )}
  </section>

  {/* Right Column: Visual Canvas */}
  <section className="hidden lg:flex w-1/2 bg-slate-200 dark:bg-slate-950 flex-col items-center justify-center p-8 relative overflow-hidden">
   
   {activeTab === "stage" && (
   <div className="w-full max-w-lg aspect-video bg-white dark:!bg-[#121212] rounded-2xl shadow-2xl relative overflow-hidden border-8 border-[#1c1b1b] dark:border-slate-950 flex items-end justify-center pb-8">
    {/* Curtains */}
    <div className="absolute inset-x-0 top-0 h-16 bg-red-600 shadow-md z-20 flex">
    <div className="flex-1 bg-red-700 rounded-b-full shadow-inner mx-1"></div>
    <div className="flex-1 bg-red-700 rounded-b-full shadow-inner mx-1"></div>
    <div className="flex-1 bg-red-700 rounded-b-full shadow-inner mx-1"></div>
    <div className="flex-1 bg-red-700 rounded-b-full shadow-inner mx-1"></div>
    <div className="flex-1 bg-red-700 rounded-b-full shadow-inner mx-1"></div>
    </div>

    {/* Stage Floor */}
    <div className="absolute inset-x-0 bottom-0 h-32 bg-amber-700 dark:bg-amber-900 border-t-4 border-amber-900 dark:border-black transform perspective-1000 rotateX-45 transform-origin-bottom"></div>

    {/* Actor & Action Visualization */}
    <div className="relative z-10 flex flex-col items-center">
    
    {stageLog && !stageLog.isError && (
     <div className="absolute -top-16 bg-white dark:bg-slate-700 text-black dark:text-white px-4 py-2 rounded-xl font-black text-xl shadow-xl animate-bounce whitespace-nowrap">
     {selectedVerb} {selectedObject ? selectedObject : ''}!
     <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-700 rotate-45"></div>
     </div>
    )}

    {stageLog && stageLog.isError && (
     <div className="absolute -top-16 bg-red-500 text-white px-4 py-2 rounded-xl font-black text-xl shadow-xl whitespace-nowrap dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40">
     ???
     <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rotate-45"></div>
     </div>
    )}

    <div className={`text-8xl transition-transform duration-300 ${stageLog && !stageLog.isError && selectedVerb && INTRANSITIVE_VERBS.includes(selectedVerb) ? 'animate-pulse scale-110' : ''}`}>
     🎭
    </div>
    </div>

    {/* Objects on Stage */}
    <div className="absolute bottom-8 right-16 z-10 flex space-x-4">
    {OBJECTS.map((obj) => {
     const isActive = selectedObject === obj.id;
     const isActionHappening = isActive && stageLog && !stageLog.isError;
     
     return (
     <div 
      key={obj.id} 
      className={`transition-all duration-300 p-3 rounded-xl ${ isActive ? 'bg-blue-100 dark:bg-blue-900/50 shadow-lg -translate-y-4' : 'bg-white dark:bg-slate-700 shadow opacity-50 grayscale hover:grayscale-0' } ${isActionHappening ? 'animate-bounce border-2 border-green-500' : ''}`}
     >
      <obj.icon className={`w-8 h-8 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
     </div>
     );
    })}
    </div>
   </div>
   )}

   {activeTab === "puzzle" && (
   <div className="w-full max-w-xl h-full flex flex-col">
    <h2 className="text-2xl font-black text-slate-800 dark:text-[#ffffff] mb-6 flex items-center">
    <CheckCircle2 className="w-8 h-8 mr-3 text-green-500" />
    Completed Pairs
    </h2>
    
    <div className="flex-1 lg:overflow-y-auto space-y-3 pr-2">
    {completedPairs.length === 0 ? (
     <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 border-4 border-dashed border-slate-300 dark:border-[#1c1b1b] rounded-2xl p-8 text-center">
     <Puzzle className="w-16 h-16 mb-4 opacity-50" />
     <p className="text-xl font-bold">No pairs completed yet.</p>
     <p className="mt-2">Match verbs and phrases on the left to build your collection!</p>
     </div>
    ) : (
     completedPairs.map((pair, i) => (
     <div key={i} className="flex bg-white dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-md animate-in fade-in slide-in-from-bottom-4">
      <div className="flex-1 bg-indigo-100 dark:bg-indigo-900/30 p-4 font-black text-xl text-indigo-800 dark:text-indigo-300 text-right border-r-2 border-dashed border-indigo-300 dark:border-indigo-700">
      {pair.verb}
      </div>
      <div className="flex-1 bg-pink-100 dark:bg-pink-900/30 p-4 font-black text-xl text-pink-800 dark:text-pink-300 text-left">
      {pair.match}
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-1 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
      <Puzzle className="w-4 h-4 text-slate-400" />
      </div>
      <div className="absolute right-2 top-2 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-[#121212] px-2 py-1 rounded">
      {pair.type}
      </div>
     </div>
     ))
    )}
    
    {completedPairs.length === PUZZLE_PAIRS.length && (
     <div className="p-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl shadow-xl text-center mt-6 animate-bounce">
     <h3 className="text-2xl font-black mb-2">Puzzle Complete!</h3>
     <p className="font-bold opacity-90">You matched all collocations and phrasal verbs perfectly.</p>
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
