import { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, BookOpen, Volume2, Search, Type , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

const WORD_LIST = [
 {
 word: "Information",
 type1: "Abstract",
 type2: "Uncountable",
 plural: "",
 syllables: "in-for-ma-tion",
 synonym: "data",
 antonym: "ignorance"
 },
 {
 word: "Library",
 type1: "Concrete",
 type2: "Countable",
 plural: "libraries",
 syllables: "li-bra-ry",
 synonym: "archive",
 antonym: "none"
 },
 {
 word: "Bravery",
 type1: "Abstract",
 type2: "Uncountable",
 plural: "",
 syllables: "brave-ry",
 synonym: "courage",
 antonym: "cowardice"
 },
 {
 word: "Elephant",
 type1: "Concrete",
 type2: "Countable",
 plural: "elephants",
 syllables: "el-e-phant",
 synonym: "mammal",
 antonym: "none"
 }
];

export default function LabE8NounsPhonetics({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [currentWordIdx, setCurrentWordIdx] = useState(0);
 const [type1, setType1] = useState("");
 const [type2, setType2] = useState("");
 const [plural, setPlural] = useState("");
 const [syllables, setSyllables] = useState("");
 const [synonym, setSynonym] = useState("");
 const [antonym, setAntonym] = useState("");
 const [checked, setChecked] = useState(false);

 const wordData = WORD_LIST[currentWordIdx];

 const handleNext = () => {
 setCurrentWordIdx((prev) => (prev + 1) % WORD_LIST.length);
 reset();
 };

 const handlePrev = () => {
 setCurrentWordIdx((prev) => (prev - 1 + WORD_LIST.length) % WORD_LIST.length);
 reset();
 };

 const reset = () => {
 setType1("");
 setType2("");
 setPlural("");
 setSyllables("");
 setSynonym("");
 setAntonym("");
 setChecked(false);
 };

 const handleCheck = () => {
 setChecked(true);
 };

 const isType1Correct = type1 === wordData.type1;
 const isType2Correct = type2 === wordData.type2;
 const isPluralCorrect = plural.trim().toLowerCase() === wordData.plural.toLowerCase();
 const isSyllablesCorrect = syllables.trim().toLowerCase() === wordData.syllables.toLowerCase();
 const isSynonymCorrect = synonym.trim().toLowerCase() === wordData.synonym.toLowerCase();
 const isAntonymCorrect = antonym.trim().toLowerCase() === wordData.antonym.toLowerCase();

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
  <h1 className="text-lg md:text-xl font-bold flex-1 min-w-0 truncate">Nouns & Phonetics: Lexicon Lab</h1>
  <div className="flex gap-2">
   <button onClick={handlePrev} className="px-4 py-2 bg-slate-200 dark:bg-[#121212]/50 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:bg-[#121212]/50 dark:hover:bg-slate-600 transition-colors whitespace-nowrap flex-shrink-0">Prev</button>
   <button onClick={handleNext} className="px-4 py-2 bg-slate-200 dark:bg-[#121212]/50 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:bg-[#121212]/50 dark:hover:bg-slate-600 transition-colors whitespace-nowrap flex-shrink-0">Next</button>
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
  <div className="w-full lg:w-1/2 p-6 flex flex-col gap-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] dark:bg-[#121212]/50">
   
   <div className="bg-white dark:!bg-[#121212] dark:!bg-[#121212] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
   <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Type className="w-5 h-5 text-blue-500 dark:text-blue-400" /> Noun Classification</h2>
   <div className="space-y-4">
    <div>
    <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa]">Concrete or Abstract?</label>
    <div className="flex gap-2">
     <button onClick={() => setType1("Concrete")} className={`flex-1 min-w-0 py-2 rounded-lg border transition-colors whitespace-nowrap flex-shrink-0 ${type1 === "Concrete" ? 'bg-blue-100 dark:bg-blue-900/50 dark:bg-blue-900/60 border-blue-500 text-blue-700 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300' : 'bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] dark:bg-slate-700 dark:border-slate-600'}`}>Concrete</button>
     <button onClick={() => setType1("Abstract")} className={`flex-1 min-w-0 py-2 rounded-lg border transition-colors whitespace-nowrap flex-shrink-0 ${type1 === "Abstract" ? 'bg-blue-100 dark:bg-blue-900/50 dark:bg-blue-900/60 border-blue-500 text-blue-700 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300' : 'bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] dark:bg-slate-700 dark:border-slate-600'}`}>Abstract</button>
    </div>
    </div>
    
    <div>
    <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa]">Countable or Uncountable?</label>
    <div className="flex gap-2">
     <button onClick={() => setType2("Countable")} className={`flex-1 min-w-0 py-2 rounded-lg border transition-colors whitespace-nowrap flex-shrink-0 ${type2 === "Countable" ? 'bg-indigo-100 dark:bg-indigo-900/50 dark:bg-indigo-900/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300' : 'bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] dark:bg-slate-700 dark:border-slate-600'}`}>Countable</button>
     <button onClick={() => setType2("Uncountable")} className={`flex-1 min-w-0 py-2 rounded-lg border transition-colors whitespace-nowrap flex-shrink-0 ${type2 === "Uncountable" ? 'bg-indigo-100 dark:bg-indigo-900/50 dark:bg-indigo-900/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300' : 'bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] dark:bg-slate-700 dark:border-slate-600'}`}>Uncountable</button>
    </div>
    </div>

    <div>
    <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa]">Plural Form (if any, else leave blank)</label>
    <input 
     type="text" 
     value={plural}
     onChange={(e) => setPlural(e.target.value)}
     className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-[#1c1b1b] dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
     placeholder="e.g. apples"
    />
    </div>
   </div>
   </div>

   <div className="bg-white dark:!bg-[#121212] dark:!bg-[#121212] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Volume2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> Phonetics & Syllables</h2>
    <div>
    <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa]">Split into syllables using hyphens (-)</label>
    <input 
     type="text" 
     value={syllables}
     onChange={(e) => setSyllables(e.target.value)}
     className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-[#1c1b1b] dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
     placeholder="e.g. un-der-stand"
    />
    </div>
   </div>

   <div className="bg-white dark:!bg-[#121212] dark:!bg-[#121212] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-green-500 dark:text-green-400" /> Vocabulary</h2>
    <div className="flex gap-4">
    <div className="flex-1 min-w-0">
     <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa]">Synonym</label>
     <input 
     type="text" 
     value={synonym}
     onChange={(e) => setSynonym(e.target.value)}
     className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-[#1c1b1b] dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
     placeholder="Similar meaning..."
     />
    </div>
    <div className="flex-1 min-w-0">
     <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa]">Antonym</label>
     <input 
     type="text" 
     value={antonym}
     onChange={(e) => setAntonym(e.target.value)}
     className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-[#1c1b1b] dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
     placeholder="Opposite meaning..."
     />
    </div>
    </div>
   </div>

   <button 
   onClick={handleCheck}
   className="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
   Scan & Verify
   </button>

  </div>

  {/* Right Column: Simulation Canvas */}
  <div className="w-full lg:w-1/2 p-6 bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
   <div className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
   
   <div className="w-full max-w-lg bg-white dark:!bg-[#121212] dark:!bg-[#121212] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-[#1c1b1b] relative z-10 flex flex-col">
    
    {/* Lexicon Display Header */}
    <div className="bg-[#121212] dark:bg-[#121212] p-8 text-center text-white relative">
     <BookOpen className="w-12 h-12 text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] absolute top-4 left-4 opacity-50" />
     <h2 className="text-4xl font-black tracking-wider uppercase mb-2">{wordData.word}</h2>
     <div className="text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] font-mono tracking-widest text-sm">LEXICON ENTRY #{currentWordIdx + 1}</div>
    </div>

    {/* Analysis Display */}
    <div className="p-8 space-y-6 flex-1">
     
     {/* Classification Row */}
     <div className="flex flex-col gap-4">
     <h3 className="text-xs font-bold text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-widest">Classification</h3>
     
     <div className="grid grid-cols-2 gap-4">
      <div className="bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-[#1c1b1b] flex flex-col items-center justify-center relative">
       <span className="text-sm text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] mb-1">Type</span>
       <span className="font-semibold text-lg">{type1 || "-"}</span>
       {checked && type1 && (isType1Correct ? <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 absolute top-2 right-2" /> : <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 absolute top-2 right-2" />)}
      </div>
      
      <div className="bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-[#1c1b1b] flex flex-col items-center justify-center relative">
       <span className="text-sm text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] mb-1">Countability</span>
       <span className="font-semibold text-lg">{type2 || "-"}</span>
       {checked && type2 && (isType2Correct ? <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 absolute top-2 right-2" /> : <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 absolute top-2 right-2" />)}
      </div>
     </div>
     
     <div className="bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-[#1c1b1b] flex items-center justify-between relative">
      <span className="text-sm text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa]">Plural Form</span>
      <span className="font-semibold text-lg">{plural || "-"}</span>
      {checked && (isPluralCorrect ? <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 absolute top-4 right-4" /> : <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 absolute top-4 right-4" />)}
     </div>
     </div>

     {/* Phonetics Row */}
     <div className="flex flex-col gap-4">
     <h3 className="text-xs font-bold text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-widest">Phonetics</h3>
     <div className="bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-[#1c1b1b] flex items-center justify-between relative">
      <span className="text-sm text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa]">Syllables</span>
      <span className="font-semibold text-lg font-mono tracking-widest">{syllables || "-"}</span>
      {checked && syllables && (isSyllablesCorrect ? <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 absolute top-4 right-4" /> : <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 absolute top-4 right-4" />)}
     </div>
     </div>

     {/* Vocabulary Row */}
     <div className="flex flex-col gap-4">
     <h3 className="text-xs font-bold text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-widest">Relations</h3>
     <div className="grid grid-cols-2 gap-4">
      <div className="bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-[#1c1b1b] flex flex-col items-center justify-center relative">
       <span className="text-sm text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] mb-1">Synonym</span>
       <span className="font-semibold">{synonym || "-"}</span>
       {checked && synonym && (isSynonymCorrect ? <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 absolute top-2 right-2" /> : <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 absolute top-2 right-2" />)}
      </div>
      
      <div className="bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-[#1c1b1b] flex flex-col items-center justify-center relative">
       <span className="text-sm text-slate-500 dark:text-[#71717a] dark:text-[#a1a1aa] mb-1">Antonym</span>
       <span className="font-semibold">{antonym || "-"}</span>
       {checked && antonym && (isAntonymCorrect ? <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 absolute top-2 right-2" /> : <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 absolute top-2 right-2" />)}
      </div>
     </div>
     </div>

    </div>
   </div>

   {checked && (
    <div className="mt-8 text-center bg-[#121212] dark:bg-[#121212] text-white px-6 py-3 rounded-full shadow-lg border border-[#1c1b1b] z-10 flex items-center gap-3">
    {isType1Correct && isType2Correct && isPluralCorrect && isSyllablesCorrect && isSynonymCorrect && isAntonymCorrect ? (
     <><CheckCircle2 className="w-6 h-6 text-green-400" /> <span className="font-bold">Excellent! All lexical data verified.</span></>
    ) : (
     <><XCircle className="w-6 h-6 text-red-400" /> <span className="font-bold">Some anomalies detected. Please check your inputs.</span></>
    )}
    </div>
   )}
  </div>
  </div>
 </div>
 );
}
