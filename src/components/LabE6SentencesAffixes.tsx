import { useState } from 'react';
import { ArrowLeft, RefreshCw, Layers, Check, Search, Quote, MoveRight, HelpCircle, Lightbulb , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

interface BaseWord {
 word: string;
 meaning: string;
 validPrefixes: string[];
 validSuffixes: string[];
}

const BASE_WORDS: BaseWord[] = [
 { word: "happy", meaning: "feeling or showing pleasure", validPrefixes: ["un-"], validSuffixes: ["-ness", "-ly"] },
 { word: "care", meaning: "serious attention applied to doing correctly", validPrefixes: [], validSuffixes: ["-ful", "-less", "-s"] },
 { word: "friend", meaning: "a person you know well and like", validPrefixes: ["un-"], validSuffixes: ["-ship", "-ly", "-less"] },
 { word: "understand", meaning: "perceive the intended meaning of", validPrefixes: ["mis-"], validSuffixes: ["-ing", "-able"] },
 { word: "act", meaning: "take action; do something", validPrefixes: ["re-", "over-"], validSuffixes: ["-ion", "-ive", "-or"] },
];

const PREFIXES = ["un-", "mis-", "re-", "over-"];
const SUFFIXES = ["-ness", "-ful", "-less", "-ship", "-able", "-ing", "-ion", "-ive", "-or", "-ly", "-s"];

/* interface PunctuationSentence {
 id: string;
 words: string[];
 declarativePunc: string;
 targetType: 'Exclamatory' | 'Interrogative';
 targetWordsOrder: string[]; // Expected word order for target
 targetPunc: string; // Expected punctuation
} */

/* const PUNCTUATION_TASKS: PunctuationSentence[] = [
 {
 id: 'p1',
 words: ["You", "are", "going", "home"],
 declarativePunc: ".",
 targetType: 'Interrogative',
 targetWordsOrder: ["Are", "you", "going", "home"],
 targetPunc: "?"
 },
 {
 id: 'p2',
 words: ["That", "is", "a", "huge", "dog"],
 declarativePunc: ".",
 targetType: 'Exclamatory',
 targetWordsOrder: ["What", "a", "huge", "dog"], // Notice we introduced "What" - a bit tricky, let's keep it simple reordering
 targetPunc: "!"
 },
]; */

// Let's refine the punctuation tasks to be simple word re-arrangements + punctuation swaps
const SIMPLE_PUNCTUATION_TASKS = [
 {
 id: 't1',
 base: "The dog is barking loudly.",
 targetType: 'Interrogative',
 words: ["The", "dog", "is", "barking", "loudly"],
 correctOrder: ["Is", "the", "dog", "barking", "loudly"],
 correctPunc: "?"
 },
 {
 id: 't2',
 base: "We have won the match.",
 targetType: 'Exclamatory',
 words: ["We", "have", "won", "the", "match"],
 correctOrder: ["We", "have", "won", "the", "match"], // Or add "Hurrah!" - let's stick to simple
 correctPunc: "!"
 },
 {
 id: 't3',
 base: "You can solve this puzzle.",
 targetType: 'Interrogative',
 words: ["You", "can", "solve", "this", "puzzle"],
 correctOrder: ["Can", "you", "solve", "this", "puzzle"],
 correctPunc: "?"
 }
];

export default function LabE6SentencesAffixes({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [activeTab, setActiveTab] = useState<'affixes' | 'punctuation'>('affixes');

 // Affix State
 const [selectedBaseWord, setSelectedBaseWord] = useState<BaseWord>(BASE_WORDS[0]);
 const [activePrefix, setActivePrefix] = useState<string | null>(null);
 const [activeSuffix, setActiveSuffix] = useState<string | null>(null);
 const [affixFeedback, setAffixFeedback] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

 // Punctuation State
 const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
 const currentTask = SIMPLE_PUNCTUATION_TASKS[currentTaskIndex];
 const [userWords, setUserWords] = useState<string[]>([...currentTask.words]);
 const [userPunc, setUserPunc] = useState<string>(".");
 const [puncFeedback, setPuncFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

 // --- Affix Logic ---
 const handlePrefixToggle = (pref: string) => {
 setActivePrefix(prev => prev === pref ? null : pref);
 setAffixFeedback(null);
 };

 const handleSuffixToggle = (suff: string) => {
 setActiveSuffix(prev => prev === suff ? null : suff);
 setAffixFeedback(null);
 };

 const checkAffixCombo = () => {
 if (!activePrefix && !activeSuffix) {
  setAffixFeedback({ msg: "Add a prefix or suffix first!", type: 'info' });
  return;
 }

 const isPrefixValid = !activePrefix || selectedBaseWord.validPrefixes.includes(activePrefix);
 const isSuffixValid = !activeSuffix || selectedBaseWord.validSuffixes.includes(activeSuffix);

 // Some combos might not work together (e.g. un- + happy + -ly -> unhappily, spelling changes)
 // For Class 6, we keep it simple. If both are individually valid, or valid combo.
 if (isPrefixValid && isSuffixValid) {
  let formedWord = selectedBaseWord.word;
  if (activePrefix) formedWord = activePrefix.replace('-', '') + formedWord;
  if (activeSuffix) {
  // Simple spelling rules (e.g., happy + ness -> happiness)
  if (formedWord.endsWith('y') && activeSuffix.startsWith('-') && activeSuffix !== '-ing') {
   formedWord = formedWord.slice(0, -1) + 'i' + activeSuffix.replace('-', '');
  } else if (formedWord.endsWith('e') && activeSuffix.startsWith('-') && ['-ing', '-ion', '-ive', '-or', '-able'].includes(activeSuffix)) {
   formedWord = formedWord.slice(0, -1) + activeSuffix.replace('-', '');
  } else {
   formedWord = formedWord + activeSuffix.replace('-', '');
  }
  }
  setAffixFeedback({ msg: `Great! "${formedWord}" is a valid word.`, type: 'success' });
 } else {
  setAffixFeedback({ msg: "That combination doesn't make a standard word. Try another!", type: 'error' });
 }
 };

 const resetAffixes = () => {
 setActivePrefix(null);
 setActiveSuffix(null);
 setAffixFeedback(null);
 };

 // --- Punctuation Logic ---
 const moveWordLeft = (index: number) => {
 if (index === 0) return;
 const newWords = [...userWords];
 const temp = newWords[index - 1];
 newWords[index - 1] = newWords[index];
 newWords[index] = temp;
 
 // Auto-capitalize first word, lowercase others for visual polish
 newWords.forEach((w, i) => {
  if (i === 0) {
   newWords[i] = w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  } else {
   newWords[i] = w.toLowerCase();
  }
 });

 setUserWords(newWords);
 setPuncFeedback(null);
 };

 const moveWordRight = (index: number) => {
 if (index === userWords.length - 1) return;
 const newWords = [...userWords];
 const temp = newWords[index + 1];
 newWords[index + 1] = newWords[index];
 newWords[index] = temp;

 newWords.forEach((w, i) => {
  if (i === 0) {
   newWords[i] = w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  } else {
   newWords[i] = w.toLowerCase();
  }
 });

 setUserWords(newWords);
 setPuncFeedback(null);
 };

 const checkPunctuation = () => {
 const isOrderCorrect = userWords.join(' ').toLowerCase() === currentTask.correctOrder.join(' ').toLowerCase();
 const isPuncCorrect = userPunc === currentTask.correctPunc;

 if (isOrderCorrect && isPuncCorrect) {
  setPuncFeedback({ msg: "Perfect! You formed the correct sentence.", type: 'success' });
 } else if (!isOrderCorrect && isPuncCorrect) {
  setPuncFeedback({ msg: "Punctuation is right, but check your word order.", type: 'error' });
 } else if (isOrderCorrect && !isPuncCorrect) {
  setPuncFeedback({ msg: "Word order is right, but check your punctuation at the end.", type: 'error' });
 } else {
  setPuncFeedback({ msg: "Keep trying! Adjust the word order and punctuation.", type: 'error' });
 }
 };

 const nextTask = () => {
 const nextIdx = (currentTaskIndex + 1) % SIMPLE_PUNCTUATION_TASKS.length;
 setCurrentTaskIndex(nextIdx);
 setUserWords([...SIMPLE_PUNCTUATION_TASKS[nextIdx].words]);
 setUserPunc(".");
 setPuncFeedback(null);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950 font-sans select-none text-slate-900 dark:text-[#ffffff]">
  {/* Header */}
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 shadow-sm border-b border-slate-200 dark:border-neutral-900 z-10">
  <div className="flex items-center space-x-3">
   <button
   onClick={onExit}
   className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
   >
   <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-[#71717a]" />
   </button>
   <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400 truncate">
   Sentences & Word Parts
   </h1>
  </div>
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0 ml-4 dark:bg-[#121212]"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  <div className="flex overflow-x-auto hide-scrollbar bg-slate-100 dark:bg-[#121212] rounded-lg p-1 flex-shrink-0">
   <button
   onClick={() => setActiveTab('affixes')}
   className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${ activeTab === 'affixes' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300' }`}
   >
   Affix Engine
   </button>
   <button
   onClick={() => setActiveTab('punctuation')}
   className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${ activeTab === 'punctuation' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300' }`}
   >
   Sentence Transformer
   </button>
  </div>
  </div>

  {/* Main Content */}
  <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden lg:overflow-y-auto">
  
  {/* Left Column - Controls & Instructions */}
  <div className="w-full lg:w-1/3 p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-neutral-900 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.1)] z-0">
   <div className="space-y-6">
   <div>
    <h2 className="text-2xl font-bold mb-2 flex items-center">
    {activeTab === 'affixes' ? (
     <><Layers className="w-6 h-6 mr-2 text-indigo-500" /> Affix Factory</>
    ) : (
     <><Quote className="w-6 h-6 mr-2 text-pink-500" /> Transformer</>
    )}
    </h2>
    <p className="text-slate-600 dark:text-[#71717a]">
    {activeTab === 'affixes' 
     ? "Attach prefixes (front) and suffixes (back) to the base word to create new words and alter their meanings."
     : "Convert the declarative sentence into the requested format by rearranging words and changing punctuation."}
    </p>
   </div>

   {activeTab === 'affixes' ? (
    <div className="space-y-4">
    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
     <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2 flex items-center">
     <Search className="w-4 h-4 mr-2" /> Select Base Word
     </h3>
     <div className="flex flex-wrap gap-2">
     {BASE_WORDS.map(bw => (
      <button
      key={bw.word}
      onClick={() => { setSelectedBaseWord(bw); resetAffixes(); }}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${ selectedBaseWord.word === bw.word ? 'bg-indigo-600 text-white' : ' border border-slate-200 dark:border-[#1c1b1b] hover:border-indigo-300 dark:hover:border-indigo-600' }`}
      >
      {bw.word}
      </button>
     ))}
     </div>
    </div>

    <div className="space-y-2">
     <button
     onClick={checkAffixCombo}
     className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
     >
     <Check className="w-5 h-5 mr-2" /> Check Word
     </button>
     <button
     onClick={resetAffixes}
     className="w-full py-3 px-4 bg-slate-200 hover:bg-slate-300 dark:bg-[#121212] dark:hover:bg-slate-700 text-slate-800 dark:text-[#ffffff] rounded-xl font-semibold transition-colors flex items-center justify-center whitespace-nowrap flex-shrink-0"
     >
     <RefreshCw className="w-5 h-5 mr-2" /> Clear Affixes
     </button>
    </div>
    </div>
   ) : (
    <div className="space-y-4">
    <div className="bg-pink-50 dark:bg-pink-900/30 p-4 rounded-xl border border-pink-100 dark:border-pink-800/50">
     <h3 className="font-semibold text-pink-800 dark:text-pink-300 mb-2 flex items-center">
     <Target className="w-4 h-4 mr-2" /> Current Mission
     </h3>
     <p className="text-sm text-slate-700 dark:text-[#a1a1aa] mb-2">
     Original: <span className="italic text-slate-500">"{currentTask.base}"</span>
     </p>
     <p className="text-md font-bold text-pink-700 dark:text-pink-400">
     Transform to: {currentTask.targetType}
     </p>
    </div>

    <div className="space-y-2">
     <button
     onClick={checkPunctuation}
     className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-pink-500 dark:hover:bg-pink-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-pink-500/40"
     >
     <Check className="w-5 h-5 mr-2" /> Verify Sentence
     </button>
     <button
     onClick={nextTask}
     className="w-full py-3 px-4 bg-slate-200 hover:bg-slate-300 dark:bg-[#121212] dark:hover:bg-slate-700 text-slate-800 dark:text-[#ffffff] rounded-xl font-semibold transition-colors flex items-center justify-center whitespace-nowrap flex-shrink-0"
     >
     <MoveRight className="w-5 h-5 mr-2" /> Next Challenge
     </button>
    </div>
    </div>
   )}
   </div>
  </div>

  {/* Right Column - Interactive Canvas */}
  <div className="w-full lg:w-2/3 p-4 sm:p-8 lg:overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col relative items-center justify-center">
   
   {activeTab === 'affixes' ? (
   <div className="w-full max-w-2xl bg-white dark:!bg-[#121212] rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-neutral-900 text-center flex flex-col items-center">
    
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 w-full">
    {/* Prefix Slot */}
    <div className="flex flex-col items-center w-full md:w-1/3">
     <div className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Prefix</div>
     <div className={`h-20 w-full flex items-center justify-center rounded-2xl border-4 border-dashed transition-all ${ activePrefix ? 'bg-blue-100 border-blue-400 text-blue-700 dark:bg-blue-900/50 dark:border-blue-500 dark:text-blue-200 text-3xl font-bold' : 'border-slate-200 dark:border-[#1c1b1b]' }`}>
     {activePrefix || <span className="text-slate-300 dark:text-slate-600 font-mono text-xl">____</span>}
     </div>
     <div className="mt-4 flex flex-wrap justify-center gap-2">
     {PREFIXES.map(p => (
      <button
      key={p}
      onClick={() => handlePrefixToggle(p)}
      className={`px-3 py-1 rounded-full text-sm font-medium border ${ activePrefix === p ? 'bg-blue-500 text-white border-blue-500' : ' border-slate-300 dark:border-slate-600 text-slate-600 dark:text-[#ffffff]' }`}
      >
      {p}
      </button>
     ))}
     </div>
    </div>

    {/* Base Word */}
    <div className="flex flex-col items-center w-full md:w-1/3 z-10 scale-110">
     <div className="text-sm font-semibold text-indigo-400 mb-2 uppercase tracking-wider">Base</div>
     <div className="h-20 px-6 flex items-center justify-center rounded-2xl bg-indigo-600 text-white text-3xl font-bold shadow-lg dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
     {selectedBaseWord.word}
     </div>
     <div className="mt-4 text-xs text-slate-500 dark:text-[#71717a] italic text-center px-4">
     {selectedBaseWord.meaning}
     </div>
    </div>

    {/* Suffix Slot */}
    <div className="flex flex-col items-center w-full md:w-1/3">
     <div className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Suffix</div>
     <div className={`h-20 w-full flex items-center justify-center rounded-2xl border-4 border-dashed transition-all ${ activeSuffix ? 'bg-green-100 border-green-400 text-green-700 dark:bg-green-900/50 dark:border-green-500 dark:text-green-200 text-3xl font-bold' : 'border-slate-200 dark:border-[#1c1b1b]' }`}>
     {activeSuffix || <span className="text-slate-300 dark:text-slate-600 font-mono text-xl">____</span>}
     </div>
     <div className="mt-4 flex flex-wrap justify-center gap-2 max-h-32 lg:overflow-y-auto p-1">
     {SUFFIXES.map(s => (
      <button
      key={s}
      onClick={() => handleSuffixToggle(s)}
      className={`px-3 py-1 rounded-full text-sm font-medium border ${ activeSuffix === s ? 'bg-green-500 text-white border-green-500' : ' border-slate-300 dark:border-slate-600 text-slate-600 dark:text-[#ffffff]' }`}
      >
      {s}
      </button>
     ))}
     </div>
    </div>
    </div>

    {/* Feedback Area */}
    {affixFeedback && (
    <div className={`w-full p-4 rounded-xl flex items-center justify-center space-x-3 text-lg font-medium animate-in fade-in slide-in-from-bottom-4 ${ affixFeedback.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : affixFeedback.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' }`}>
     {affixFeedback.type === 'success' && <Lightbulb className="w-6 h-6" />}
     {affixFeedback.type === 'error' && <HelpCircle className="w-6 h-6" />}
     <span>{affixFeedback.msg}</span>
    </div>
    )}

   </div>
   ) : (
   <div className="w-full max-w-3xl bg-white dark:!bg-[#121212] rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-neutral-900 flex flex-col items-center">
    
    <div className="text-lg text-slate-500 dark:text-[#71717a] mb-8 text-center">
    Use the arrows to reorder the words. Click the punctuation mark to change it.
    </div>

    <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
    {userWords.map((word, idx) => (
     <div key={`${word}-${idx}`} className="flex flex-col items-center">
     <div className="flex space-x-1 mb-2 opacity-50 hover:opacity-100 transition-opacity">
      <button onClick={() => moveWordLeft(idx)} disabled={idx === 0} className="p-1 bg-slate-100 dark:bg-[#121212] rounded disabled:opacity-30">
      <ArrowLeft className="w-4 h-4" />
      </button>
      <button onClick={() => moveWordRight(idx)} disabled={idx === userWords.length - 1} className="p-1 bg-slate-100 dark:bg-[#121212] rounded disabled:opacity-30">
      <MoveRight className="w-4 h-4" />
      </button>
     </div>
     <div className="px-5 py-3 bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200 border-2 border-pink-300 dark:border-pink-700 rounded-xl text-2xl font-bold shadow-sm">
      {word}
     </div>
     </div>
    ))}

    {/* Punctuation Selector */}
    <div className="flex flex-col items-center ml-4 mt-8">
     <select
     value={userPunc}
     onChange={(e) => setUserPunc(e.target.value)}
     className="appearance-none px-4 py-3 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 border-2 border-indigo-300 dark:border-indigo-700 rounded-xl text-3xl font-bold shadow-sm cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900 text-center text-center-last"
     style={{ textAlignLast: 'center' }}
     >
     <option value=".">.</option>
     <option value="?">?</option>
     <option value="!">!</option>
     </select>
    </div>
    </div>

    {/* Feedback Area */}
    {puncFeedback && (
    <div className={`w-full p-4 rounded-xl flex items-center justify-center space-x-3 text-lg font-medium animate-in fade-in slide-in-from-bottom-4 ${ puncFeedback.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' }`}>
     {puncFeedback.type === 'success' ? <Check className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
     <span>{puncFeedback.msg}</span>
    </div>
    )}

   </div>
   )}
  </div>
  </div>
 </div>
 );
}

// Quick component shim for Target since it wasn't imported from lucide-react in the second file originally
function Target(props: any) {
 return (
 <svg
  {...props}
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
 >
  <circle cx="12" cy="12" r="10" />
  <circle cx="12" cy="12" r="6" />
  <circle cx="12" cy="12" r="2" />
 </svg>
 );
}
