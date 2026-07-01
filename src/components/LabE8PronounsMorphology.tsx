import { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Puzzle, Target, Beaker, Link2, Sparkles , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

const MORPHOLOGY_TARGETS = [
 { prefix: "un", root: "happy", suffix: "ness", result: "unhappiness", meaning: "The state of not being happy" },
 { prefix: "re", root: "build", suffix: "", result: "rebuild", meaning: "To build again" },
 { prefix: "dis", root: "connect", suffix: "ion", result: "disconnection", meaning: "The state of being separated" },
 { prefix: "mis", root: "understand", suffix: "ing", result: "misunderstanding", meaning: "A failure to understand correctly" },
 { prefix: "pre", root: "view", suffix: "", result: "preview", meaning: "To view beforehand" },
 { prefix: "", root: "act", suffix: "ion", result: "action", meaning: "The process of doing something" }
];

const PRONOUN_TASKS = [
 {
 sentence: "Sarah lost her book at school.",
 words: ["Sarah", "lost", "her", "book", "at", "school."],
 pronounIdx: 2,
 antecedentIdx: 0,
 type: "Possessive"
 },
 {
 sentence: "The robot fixed itself quickly.",
 words: ["The", "robot", "fixed", "itself", "quickly."],
 pronounIdx: 3,
 antecedentIdx: 1,
 type: "Reflexive"
 },
 {
 sentence: "This is the laptop that I bought.",
 words: ["This", "is", "the", "laptop", "that", "I", "bought."],
 pronounIdx: 4,
 antecedentIdx: 3,
 type: "Relative"
 }
];

const PRONOUN_TYPES = ["Personal", "Possessive", "Reflexive", "Demonstrative", "Relative"];

export default function LabE8PronounsMorphology({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [mode, setMode] = useState<'morphology' | 'pronoun'>('morphology');

 // Morphology State
 const [selectedPrefix, setSelectedPrefix] = useState("");
 const [selectedRoot, setSelectedRoot] = useState("happy");
 const [selectedSuffix, setSelectedSuffix] = useState("");
 const [morphResult, setMorphResult] = useState<{valid: boolean, message: string} | null>(null);
 const [isSynthesizing, setIsSynthesizing] = useState(false);

 // Pronoun State
 const [taskIdx, setTaskIdx] = useState(0);
 const [selectedPronounIdx, setSelectedPronounIdx] = useState<number | null>(null);
 const [selectedAntecedentIdx, setSelectedAntecedentIdx] = useState<number | null>(null);
 const [selectedType, setSelectedType] = useState("");
 const [pronounCheck, setPronounCheck] = useState<{valid: boolean, message: string} | null>(null);
 const [clickMode, setClickMode] = useState<'none' | 'pronoun' | 'antecedent'>('none');

 const handleSynthesize = () => {
 setIsSynthesizing(true);
 setMorphResult(null);
 
 setTimeout(() => {
  const match = MORPHOLOGY_TARGETS.find(t => t.prefix === selectedPrefix && t.root === selectedRoot && t.suffix === selectedSuffix);
  if (match) {
  setMorphResult({ valid: true, message: `Success! ${match.result} - ${match.meaning}` });
  } else {
  setMorphResult({ valid: false, message: `Unstable compound. Try a different combination.` });
  }
  setIsSynthesizing(false);
 }, 800);
 };

 const handlePronounCheck = () => {
 const task = PRONOUN_TASKS[taskIdx];
 if (selectedPronounIdx === task.pronounIdx && selectedAntecedentIdx === task.antecedentIdx && selectedType === task.type) {
  setPronounCheck({ valid: true, message: "Perfect! Pronoun, antecedent, and type correctly identified." });
 } else {
  let msg = "Analysis failed. ";
  if (selectedPronounIdx !== task.pronounIdx) msg += "Incorrect pronoun. ";
  if (selectedAntecedentIdx !== task.antecedentIdx) msg += "Incorrect antecedent. ";
  if (selectedType !== task.type) msg += "Incorrect type. ";
  setPronounCheck({ valid: false, message: msg });
 }
 };

 const nextPronounTask = () => {
 setTaskIdx((prev) => (prev + 1) % PRONOUN_TASKS.length);
 setSelectedPronounIdx(null);
 setSelectedAntecedentIdx(null);
 setSelectedType("");
 setPronounCheck(null);
 setClickMode('none');
 };

 const handleWordClick = (idx: number) => {
 if (clickMode === 'pronoun') {
  setSelectedPronounIdx(idx);
  setClickMode('none');
 } else if (clickMode === 'antecedent') {
  setSelectedAntecedentIdx(idx);
  setClickMode('none');
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-[#000000]/50 dark:!bg-[#000000] dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">
  {/* Header */}
  <div className="flex items-center p-4 border-b border-slate-200 dark:border-[#1c1b1b] dark:bg-[#121212] shrink-0">
  <button
   onClick={onExit}
   className="mr-4 p-2 rounded-full hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:hover:bg-slate-700 transition-colors whitespace-nowrap flex-shrink-0"
  >
   <ArrowLeft className="w-6 h-6" />
  </button>
  <h1 className="text-lg md:text-xl font-bold flex-1 min-w-0 truncate">Grammar & Morphology Lab</h1>
  <div className="flex gap-2 p-1 bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-slate-700 rounded-lg">
   <button 
    onClick={() => setMode('morphology')} 
    className={`px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${mode === 'morphology' ? ' dark:bg-[#121212] shadow-sm text-blue-600 dark:text-blue-400 dark:text-blue-400' : 'text-slate-600 dark:text-[#a1a1aa] dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]/50 dark:hover:bg-slate-600'}`}
   >
    <Puzzle className="w-4 h-4" /> Morphology
   </button>
   <button 
    onClick={() => setMode('pronoun')} 
    className={`px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${mode === 'pronoun' ? ' dark:bg-[#121212] shadow-sm text-indigo-600 dark:text-indigo-400 dark:text-indigo-400' : 'text-slate-600 dark:text-[#a1a1aa] dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]/50 dark:hover:bg-slate-600'}`}
   >
    <Target className="w-4 h-4" /> Pronouns
   </button>
  </div>
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:bg-black/5 dark:hover:/10 transition-colors shrink-0 ml-4"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  </div>

  <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
  
  {/* Left Column: Controls */}
  <div className="w-full lg:w-1/3 p-6 flex flex-col gap-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] dark:bg-[#121212]/50">
   
   {mode === 'morphology' ? (
   <>
    <div className="bg-white dark:!bg-[#121212] dark:!bg-[#121212] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h2 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400 dark:text-blue-400 flex items-center gap-2">
     <Beaker className="w-5 h-5" /> Chemical Roots
    </h2>
    <div className="space-y-4">
     <div>
     <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa]">Prefix</label>
     <div className="flex flex-wrap gap-2">
      {["un", "re", "dis", "mis", "pre", ""].map(p => (
      <button key={p} onClick={() => setSelectedPrefix(p)} className={`px-3 py-1.5 rounded-md border text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${selectedPrefix === p ? 'bg-amber-100 dark:bg-amber-900/50 dark:bg-amber-900/60 border-amber-500 text-amber-700 dark:text-amber-300 dark:bg-amber-900/40 dark:border-amber-500 dark:text-amber-300' : 'bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa] dark:bg-slate-700 dark:border-slate-600 dark:text-[#ffffff]'}`}>
       {p === "" ? "None" : p + "-"}
      </button>
      ))}
     </div>
     </div>

     <div>
     <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa]">Root Word</label>
     <div className="flex flex-wrap gap-2">
      {["happy", "build", "connect", "understand", "view", "act"].map(r => (
      <button key={r} onClick={() => setSelectedRoot(r)} className={`px-3 py-1.5 rounded-md border text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${selectedRoot === r ? 'bg-blue-100 dark:bg-blue-900/50 dark:bg-blue-900/60 border-blue-500 text-blue-700 dark:text-blue-300 dark:bg-blue-900/40 dark:border-blue-500 dark:text-blue-300' : 'bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa] dark:bg-slate-700 dark:border-slate-600 dark:text-[#ffffff]'}`}>
       {r}
      </button>
      ))}
     </div>
     </div>

     <div>
     <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa]">Suffix</label>
     <div className="flex flex-wrap gap-2">
      {["ness", "er", "ion", "ing", "able", ""].map(s => (
      <button key={s} onClick={() => setSelectedSuffix(s)} className={`px-3 py-1.5 rounded-md border text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${selectedSuffix === s ? 'bg-emerald-100 dark:bg-emerald-900/50 dark:bg-emerald-900/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-900/40 dark:border-emerald-500 dark:text-emerald-300' : 'bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa] dark:bg-slate-700 dark:border-slate-600 dark:text-[#ffffff]'}`}>
       {s === "" ? "None" : "-" + s}
      </button>
      ))}
     </div>
     </div>
    </div>
    </div>

    <button 
    onClick={handleSynthesize}
    disabled={isSynthesizing}
    className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold transition-colors whitespace-nowrap flex-shrink-0 flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
    {isSynthesizing ? <Sparkles className="w-5 h-5 animate-spin" /> : <Beaker className="w-5 h-5" />}
    Synthesize Compound
    </button>
   </>
   ) : (
   <>
    <div className="bg-white dark:!bg-[#121212] dark:!bg-[#121212] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <div className="flex justify-between items-center mb-4">
     <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 dark:text-indigo-400 flex items-center gap-2">
     <Link2 className="w-5 h-5" /> Pronoun Scanner
     </h2>
     <button onClick={nextPronounTask} className="text-xs px-2 py-1 bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-slate-700 rounded hover:bg-slate-200 dark:bg-[#121212]/50 dark:hover:bg-slate-600 whitespace-nowrap flex-shrink-0">Next Sentence</button>
    </div>
    
    <div className="space-y-4">
     <div className="bg-blue-50 dark:bg-blue-900/50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50 text-sm mb-4">
     First, select a tool below. Then click on a word in the right panel to assign it.
     </div>

     <div className="flex flex-col gap-2">
     <button 
      onClick={() => setClickMode(clickMode === 'pronoun' ? 'none' : 'pronoun')}
      className={`py-2 px-4 rounded-lg border flex items-center justify-between whitespace-nowrap flex-shrink-0 ${clickMode === 'pronoun' ? 'bg-indigo-100 dark:bg-indigo-900/50 dark:bg-indigo-900/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] dark:bg-slate-700 dark:border-slate-600'}`}
     >
      <span>1. Select Pronoun</span>
      {selectedPronounIdx !== null && <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />}
     </button>
     
     <button 
      onClick={() => setClickMode(clickMode === 'antecedent' ? 'none' : 'antecedent')}
      className={`py-2 px-4 rounded-lg border flex items-center justify-between whitespace-nowrap flex-shrink-0 ${clickMode === 'antecedent' ? 'bg-orange-100 dark:bg-orange-900/50 dark:bg-orange-900/60 border-orange-500 text-orange-700 dark:text-orange-300 dark:bg-orange-900/40 dark:text-orange-300' : 'bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] dark:bg-slate-700 dark:border-slate-600'}`}
     >
      <span>2. Select Antecedent</span>
      {selectedAntecedentIdx !== null && <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />}
     </button>
     </div>

     <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#1c1b1b]">
     <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa]">3. Pronoun Type</label>
     <select 
      value={selectedType}
      onChange={(e) => setSelectedType(e.target.value)}
      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-[#1c1b1b] dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-0"
     >
      <option value="">Select Type...</option>
      {PRONOUN_TYPES.map(pt => (
      <option key={pt} value={pt}>{pt}</option>
      ))}
     </select>
     </div>
    </div>
    </div>

    <button 
    onClick={handlePronounCheck}
    className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors whitespace-nowrap flex-shrink-0 flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    <Target className="w-5 h-5" />
    Analyze Resolution
    </button>
   </>
   )}

  </div>

  {/* Right Column: Simulation Canvas */}
  <div className="w-full lg:w-2/3 p-6 bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
   {/* Grid Background */}
   <div className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-10" style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
   
   {mode === 'morphology' ? (
    <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-12">
    
    {/* Synthesis Area */}
    <div className="flex items-center justify-center gap-4 min-h-[120px]">
     {/* Prefix Block */}
     <div className={`transition-all duration-500 flex items-center justify-center h-20 px-6 rounded-l-2xl border-2 border-r-0 border-amber-400 bg-amber-100 dark:bg-amber-900/50 dark:bg-amber-900/60 dark:bg-amber-900/60 dark:border-amber-500 shadow-lg ${isSynthesizing ? 'translate-x-4 opacity-50' : 'translate-x-0'}`}>
      <span className="text-2xl font-bold text-amber-700 dark:text-amber-300 dark:text-amber-300">{selectedPrefix || "..."}-</span>
     </div>
     
     {/* Root Block */}
     <div className={`transition-all duration-500 flex items-center justify-center h-24 px-8 rounded-xl border-2 border-blue-400 bg-blue-100 dark:bg-blue-900/50 dark:bg-blue-900/60 dark:bg-blue-900/60 dark:border-blue-500 shadow-xl z-10 ${isSynthesizing ? 'scale-110' : 'scale-100'}`}>
      <span className="text-3xl font-black text-blue-700 dark:text-blue-300 dark:text-blue-300">{selectedRoot}</span>
     </div>

     {/* Suffix Block */}
     <div className={`transition-all duration-500 flex items-center justify-center h-20 px-6 rounded-r-2xl border-2 border-l-0 border-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 dark:bg-emerald-900/60 dark:bg-emerald-900/60 dark:border-emerald-500 shadow-lg ${isSynthesizing ? '-translate-x-4 opacity-50' : 'translate-x-0'}`}>
      <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 dark:text-emerald-300">-{selectedSuffix || "..."}</span>
     </div>
    </div>

    {/* Result Display */}
    <div className="h-24 flex items-center justify-center w-full">
     {morphResult && (
     <div className={`w-full p-6 rounded-2xl shadow-lg border text-center animate-in fade-in slide-in-from-bottom-4 ${morphResult.valid ? 'bg-green-100 dark:bg-green-900/50 dark:bg-green-900/60 border-green-400 text-green-800 dark:text-green-200 dark:bg-green-900/30 dark:border-green-500/50 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 dark:bg-red-900/60 border-red-400 text-red-800 dark:text-red-200 dark:bg-red-900/30 dark:border-red-500/50 dark:text-red-300'}`}>
      <p className="text-lg font-bold flex items-center justify-center gap-2">
       {morphResult.valid ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
       {morphResult.message}
      </p>
     </div>
     )}
    </div>

    </div>
   ) : (
    <div className="relative z-10 w-full max-w-3xl flex flex-col items-center gap-12">
    
    <div className="bg-white dark:!bg-[#121212] dark:!bg-[#121212] p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-[#1c1b1b] w-full">
     <h3 className="text-sm font-bold text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-widest mb-6 text-center">Sentence Analysis Viewer</h3>
     
     <div className="flex flex-wrap gap-3 justify-center text-2xl font-medium leading-relaxed">
     {PRONOUN_TASKS[taskIdx].words.map((word, idx) => {
      const isPronoun = selectedPronounIdx === idx;
      const isAntecedent = selectedAntecedentIdx === idx;
      let baseClass = "px-2 py-1 rounded-lg cursor-pointer transition-colors border-b-2 border-transparent ";
      
      if (isPronoun) {
      baseClass += "bg-indigo-100 dark:bg-indigo-900/50 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 dark:bg-indigo-900/50 dark:text-indigo-300 border-indigo-500";
      } else if (isAntecedent) {
      baseClass += "bg-orange-100 dark:bg-orange-900/50 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 dark:bg-orange-900/50 dark:text-orange-300 border-orange-500";
      } else if (clickMode !== 'none') {
      baseClass += "hover:bg-slate-200 dark:bg-[#121212]/50 dark:hover:bg-slate-700";
      }

      return (
      <span 
       key={idx} 
       onClick={() => handleWordClick(idx)}
       className={baseClass}
      >
       {word}
      </span>
      )
     })}
     </div>

     {clickMode !== 'none' && (
     <div className="mt-8 text-center animate-pulse text-blue-500 dark:text-blue-400 dark:text-blue-400 font-medium">
      Click a word in the sentence to assign it as the {clickMode}.
     </div>
     )}
    </div>

    <div className="h-24 w-full">
     {pronounCheck && (
     <div className={`w-full p-6 rounded-2xl shadow-lg border text-center animate-in fade-in slide-in-from-bottom-4 ${pronounCheck.valid ? 'bg-green-100 dark:bg-green-900/50 dark:bg-green-900/60 border-green-400 text-green-800 dark:text-green-200 dark:bg-green-900/30 dark:border-green-500/50 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 dark:bg-red-900/60 border-red-400 text-red-800 dark:text-red-200 dark:bg-red-900/30 dark:border-red-500/50 dark:text-red-300'}`}>
      <p className="text-lg font-bold flex items-center justify-center gap-2">
       {pronounCheck.valid ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
       {pronounCheck.message}
      </p>
     </div>
     )}
    </div>
    </div>
   )}
  </div>
  </div>
 </div>
 );
}
