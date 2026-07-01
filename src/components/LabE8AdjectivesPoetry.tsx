import { useState } from 'react';
import { ArrowLeft, BookOpen, Feather, CheckCircle2, XCircle, Award, Sparkles, Type , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

const poetryData = [
 {
 id: 1,
 title: "Night's Jewels",
 text: "The wind is a howling wolf,\nIt cries in the dark of night.\nThe stars are sparkling diamonds,\nShining with all their might.",
 questions: [
  { q: "What literary device is 'The wind is a howling wolf'?", options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], answer: 'Metaphor' },
  { q: "What is the rhyme scheme of this stanza?", options: ['AABB', 'ABAB', 'ABCB', 'AAAA'], answer: 'ABCB' },
  { q: "What device is used in 'sparkling diamonds' to describe stars?", options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], answer: 'Metaphor' }
 ]
 },
 {
 id: 2,
 title: "Nature's Dance",
 text: "Peter Piper picked a peck of pickled peppers,\nThe trees danced in the gentle breeze.\nAs busy as a bee she worked all day,\nWhile the whispering wind softly sings.",
 questions: [
  { q: "What device is 'Peter Piper picked...'?", options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], answer: 'Alliteration' },
  { q: "What device is 'The trees danced...'?", options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], answer: 'Personification' },
  { q: "What device is 'As busy as a bee'?", options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], answer: 'Simile' }
 ]
 }
];

const adjectiveData = [
 { id: 1, type: 'fill', sentence: "Mount Everest is the (high) mountain in the world.", base: "high", answer: "highest" },
 { id: 2, type: 'fill', sentence: "A cheetah is (fast) than a lion.", base: "fast", answer: "faster" },
 { id: 3, type: 'mcq', sentence: "The girl with the red hair is my best friend.", question: "Identify the adjective phrase:", options: ["The girl", "with the red hair", "is my best friend", "red hair is"], answer: "with the red hair" },
 { id: 4, type: 'mcq', sentence: "A box made of wood was found in the attic.", question: "Identify the adjective phrase:", options: ["A box", "made of wood", "was found", "in the attic"], answer: "made of wood" }
];

export default function LabE8AdjectivesPoetry({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [activeTab, setActiveTab] = useState<'poetry' | 'adjectives'>('poetry');
 const [poemIndex, setPoemIndex] = useState(0);
 const [adjIndex, setAdjIndex] = useState(0);
 
 const [poetryAnswers, setPoetryAnswers] = useState<Record<number, Record<number, string>>>({});
 const [adjAnswers, setAdjAnswers] = useState<Record<number, string>>({});
 
 const currentPoem = poetryData[poemIndex];
 const currentAdj = adjectiveData[adjIndex];

 const handlePoetryAnswer = (qIndex: number, option: string) => {
 setPoetryAnswers(prev => ({
  ...prev,
  [poemIndex]: {
  ...(prev[poemIndex] || {}),
  [qIndex]: option
  }
 }));
 };

 const isPoetryCorrect = (qIndex: number) => {
 return poetryAnswers[poemIndex]?.[qIndex] === currentPoem.questions[qIndex].answer;
 };

 const handleAdjAnswer = (val: string) => {
 setAdjAnswers(prev => ({ ...prev, [adjIndex]: val }));
 };

 const isAdjCorrect = () => {
 if (!adjAnswers[adjIndex]) return false;
 if (currentAdj.type === 'fill') {
  return adjAnswers[adjIndex].toLowerCase().trim() === currentAdj.answer;
 }
 return adjAnswers[adjIndex] === currentAdj.answer;
 };

 const poetryScore = currentPoem.questions.filter((_, i) => isPoetryCorrect(i)).length;
 const totalPoetry = currentPoem.questions.length;

 const currentPower = Object.keys(adjAnswers).filter(k => {
 const id = parseInt(k);
 const ex = adjectiveData[id];
 if (ex.type === 'fill') return adjAnswers[id]?.toLowerCase().trim() === ex.answer;
 return adjAnswers[id] === ex.answer;
 }).length;
 const totalPower = adjectiveData.length;
 const fillPercentage = (currentPower / totalPower) * 100;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-[#000000]/50 dark:!bg-[#000000] dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">
  <header className="flex items-center p-4 dark:bg-[#121212] shadow-sm z-10 border-b border-slate-200 dark:border-[#1c1b1b]">
   <button onClick={onExit} className="mr-4 whitespace-nowrap flex-shrink-0 p-2 rounded-full hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:hover:bg-slate-700 transition-colors">
    <ArrowLeft size={24} />
   </button>
   <h1 className="text-lg md:text-xl font-bold flex items-center gap-2">
   <Feather className="text-blue-500 dark:text-blue-400" />
   Poet's Workshop & Adjective Studio
   </h1>
  
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:/20 transition-colors shrink-0 ml-4"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  </header>

  <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden lg:overflow-y-auto">
   {/* Left Column - Controls */}
   <div className="w-full lg:w-1/3 flex flex-col border-r border-slate-200 dark:border-[#1c1b1b] dark:bg-[#121212] lg:overflow-y-auto">
    <div className="flex border-b border-slate-200 dark:border-[#1c1b1b] p-2 gap-2">
    <button
     onClick={() => setActiveTab('poetry')}
     className={`flex-1 whitespace-nowrap flex-shrink-0 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'poetry' ? 'bg-blue-100 dark:bg-blue-900/50 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 dark:bg-blue-900/40 dark:text-blue-300' : 'hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 text-slate-600 dark:text-[#a1a1aa] dark:text-[#ffffff] dark:hover:bg-slate-700'}`}
    >
     <BookOpen size={18} /> Poetry Analysis
    </button>
    <button
     onClick={() => setActiveTab('adjectives')}
     className={`flex-1 whitespace-nowrap flex-shrink-0 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'adjectives' ? 'bg-indigo-100 dark:bg-indigo-900/50 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300' : 'hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 text-slate-600 dark:text-[#a1a1aa] dark:text-[#ffffff] dark:hover:bg-slate-700'}`}
    >
     <Type size={18} /> Adjective Upgrade
    </button>
    </div>

    <div className="p-4">
    {activeTab === 'poetry' ? (
     <div className="space-y-6">
     <div className="flex justify-between items-center bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-[#121212]/50 p-2 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
      <button onClick={() => setPoemIndex(Math.max(0, poemIndex - 1))} disabled={poemIndex === 0} className="whitespace-nowrap flex-shrink-0 px-3 py-1 rounded dark:bg-slate-700 shadow disabled:opacity-50 text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] transition-opacity">Prev Poem</button>
      <span className="font-semibold text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">Poem {poemIndex + 1} of {poetryData.length}</span>
      <button onClick={() => setPoemIndex(Math.min(poetryData.length - 1, poemIndex + 1))} disabled={poemIndex === poetryData.length - 1} className="whitespace-nowrap flex-shrink-0 px-3 py-1 rounded dark:bg-slate-700 shadow disabled:opacity-50 text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] transition-opacity">Next Poem</button>
     </div>

     <div className="space-y-4">
      <h3 className="font-bold text-lg text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] flex items-center gap-2">
       <Feather size={20} className="text-indigo-500 dark:text-indigo-400"/> Literary Analysis
      </h3>
      {currentPoem.questions.map((q, i) => {
       const isAnswered = poetryAnswers[poemIndex]?.[i] !== undefined;
       const isCorrect = isPoetryCorrect(i);
       return (
        <div key={i} className="bg-white dark:!bg-[#121212] dark:bg-slate-700/50 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
         <p className="font-medium text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] mb-3">{i+1}. {q.q}</p>
         <div className="grid grid-cols-2 gap-2">
          {q.options.map(opt => (
           <button
            key={opt}
            onClick={() => handlePoetryAnswer(i, opt)}
            disabled={isAnswered}
            className={`whitespace-nowrap flex-shrink-0 py-2 px-3 rounded-md border text-sm font-medium transition-colors ${ poetryAnswers[poemIndex]?.[i] === opt ? isCorrect ? 'bg-green-100 dark:bg-green-900/50 dark:bg-green-900/60 border-green-500 text-green-700 dark:text-green-300 dark:bg-green-900/30 dark:border-green-500 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/50 dark:bg-red-900/60 border-red-500 text-red-700 dark:text-red-300 dark:bg-red-900/30 dark:border-red-500 dark:text-red-400' : 'bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff] dark:text-[#ffffff] hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-[#121212] dark:border-slate-600 dark:text-[#ffffff] dark:hover:bg-slate-700' }`}
           >
            {opt}
           </button>
          ))}
         </div>
         {isAnswered && (
          <div className={`mt-3 text-sm flex items-center font-medium ${isCorrect ? 'text-green-600 dark:text-green-400 dark:text-green-400' : 'text-red-600 dark:text-red-400 dark:text-red-400'}`}>
           {isCorrect ? <><CheckCircle2 size={16} className="mr-1"/> Correct!</> : <><XCircle size={16} className="mr-1"/> Incorrect. The answer is {q.answer}.</>}
          </div>
         )}
        </div>
       )
      })}
     </div>
    </div>
    ) : (
    <div className="space-y-6">
     <div className="flex justify-between items-center bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-[#121212]/50 p-2 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
      <button onClick={() => setAdjIndex(Math.max(0, adjIndex - 1))} disabled={adjIndex === 0} className="whitespace-nowrap flex-shrink-0 px-3 py-1 rounded dark:bg-slate-700 shadow disabled:opacity-50 text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] transition-opacity">Prev</button>
      <span className="font-semibold text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">Exercise {adjIndex + 1} of {adjectiveData.length}</span>
      <button onClick={() => setAdjIndex(Math.min(adjectiveData.length - 1, adjIndex + 1))} disabled={adjIndex === adjectiveData.length - 1} className="whitespace-nowrap flex-shrink-0 px-3 py-1 rounded dark:bg-slate-700 shadow disabled:opacity-50 text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] transition-opacity">Next</button>
     </div>

     <div className="bg-white dark:!bg-[#121212] dark:bg-slate-700/50 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
      <h3 className="font-bold text-lg text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] mb-4 flex items-center gap-2">
       <Type size={20} className="text-indigo-500 dark:text-indigo-400" /> Adjectives & Phrases
      </h3>
      <p className="text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] text-lg mb-6 italic bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b]">"{currentAdj.sentence}"</p>
      
      {currentAdj.type === 'fill' ? (
       <div>
        <p className="mb-3 text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] font-medium">Upgrade the adjective <span className="font-bold text-blue-600 dark:text-blue-400 dark:text-blue-400">({currentAdj.base})</span> to the correct degree:</p>
        <div className="flex gap-2 items-center">
         <input
          type="text"
          value={adjAnswers[adjIndex] || ''}
          onChange={(e) => handleAdjAnswer(e.target.value)}
          className="flex-1 min-w-0 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded dark:bg-[#121212] text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          placeholder="Type comparative/superlative..."
          disabled={isAdjCorrect()}
         />
         {isAdjCorrect() && <CheckCircle2 className="text-green-500 dark:text-green-400 flex-shrink-0" size={24} />}
        </div>
       </div>
      ) : (
       <div>
        <p className="mb-4 text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] font-medium">{currentAdj.question}</p>
        <div className="space-y-2">
         {currentAdj.options?.map(opt => {
          const isSelected = adjAnswers[adjIndex] === opt;
          const correct = opt === currentAdj.answer;
          const showResult = adjAnswers[adjIndex] !== undefined;
          let btnClass = "bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff] dark:text-[#ffffff] hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-[#121212] dark:border-slate-600 dark:text-[#ffffff] dark:hover:bg-slate-700";
          if (showResult) {
           if (correct && isSelected) btnClass = "bg-green-100 dark:bg-green-900/50 dark:bg-green-900/60 border-green-500 text-green-700 dark:text-green-300 dark:bg-green-900/30 dark:border-green-500 dark:text-green-400";
           else if (!correct && isSelected) btnClass = "bg-red-100 dark:bg-red-900/50 dark:bg-red-900/60 border-red-500 text-red-700 dark:text-red-300 dark:bg-red-900/30 dark:border-red-500 dark:text-red-400";
           else if (correct) btnClass = "bg-green-50 dark:bg-green-900/50 border-green-300 text-green-600 dark:text-green-400 dark:bg-green-900/10 dark:border-green-700 dark:text-green-500";
          }
          
          return (
           <button
            key={opt}
            onClick={() => !showResult && handleAdjAnswer(opt)}
            disabled={showResult}
            className={`w-full text-left py-3 px-4 rounded-md border text-sm font-medium transition-colors ${btnClass}`}
           >
            {opt}
           </button>
          )
         })}
        </div>
       </div>
      )}
     </div>
    </div>
    )}
    </div>
   </div>

   {/* Right Column - Canvas */}
   <div className="w-full lg:w-2/3 flex flex-col bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-[#121212] p-8 lg:overflow-y-auto items-center justify-center relative">
   {activeTab === 'poetry' ? (
    <div className="relative w-full max-w-lg bg-amber-50 dark:bg-amber-900/50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-700/50 p-10 rounded-xl shadow-xl font-serif">
     <div className="absolute top-4 left-4 text-amber-400 animate-pulse"><Sparkles size={28} /></div>
     <div className="absolute bottom-4 right-4 text-amber-400"><Feather size={28} /></div>
     
     <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-amber-500 mb-8 border-b border-amber-200 dark:border-amber-700/50 pb-4">
      {currentPoem.title}
     </h2>
     
     <div className="whitespace-pre-wrap text-xl leading-loose text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] italic text-center">
      {currentPoem.text}
     </div>
     
     {poetryScore === totalPoetry && (
      <div className="mt-10 flex items-center justify-center text-green-600 dark:text-green-400 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/50 dark:bg-green-900/60 dark:bg-green-900/40 p-3 rounded-lg border border-green-200 dark:border-green-800 animate-fade-in-up">
       <Award className="mr-2" size={24} /> Master Poet Unlocked!
      </div>
     )}
    </div>
   ) : (
    <div className="flex flex-col items-center justify-center w-full max-w-md bg-white dark:!bg-[#121212] dark:!bg-[#121212] rounded-2xl shadow-lg p-10 border border-slate-200 dark:border-[#1c1b1b]">
     <h2 className="text-2xl font-bold text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] mb-10 flex items-center gap-3">
      <Sparkles className="text-indigo-500 dark:text-indigo-400" />
      Descriptive Power Meter
     </h2>
     
     <div className="relative w-32 h-64 bg-slate-200 dark:bg-[#121212]/50 dark:bg-slate-700/50 rounded-full overflow-hidden border-4 border-slate-300 dark:border-[#1c1b1b] shadow-inner">
      <div 
       className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-indigo-500 transition-all duration-1000 ease-in-out"
       style={{ height: `${fillPercentage}%` }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-between py-4 text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-sm font-bold z-10">
       <span>MAX</span>
       <span>MID</span>
       <span>MIN</span>
      </div>
     </div>
     
     <div className="mt-8 text-center">
      <p className="text-xl font-medium text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] mb-2">
       Vocabulary Strength: {currentPower} / {totalPower}
      </p>
      {currentPower === totalPower && (
       <p className="text-green-500 dark:text-green-400 font-bold animate-pulse text-lg">
        Maximum Eloquence Achieved!
       </p>
      )}
     </div>
    </div>
   )}
   </div>
  </div>
 </div>
 );
}
