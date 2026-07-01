import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Activity, Play, Gauge, Settings , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

const verbData = [
 { id: 1, sentence: "The dog (barked) loudly.", verb: "barked", options: ["Transitive", "Intransitive", "Linking", "Helping", "Infinitive"], answer: "Intransitive" },
 { id: 2, sentence: "She (painted) a beautiful landscape.", verb: "painted", options: ["Transitive", "Intransitive", "Linking", "Helping", "Infinitive"], answer: "Transitive" },
 { id: 3, sentence: "He (is) very tired today.", verb: "is", options: ["Transitive", "Intransitive", "Linking", "Helping", "Infinitive"], answer: "Linking" },
 { id: 4, sentence: "They (are) watching a movie.", verb: "are", options: ["Transitive", "Intransitive", "Linking", "Helping", "Infinitive"], answer: "Helping" },
 { id: 5, sentence: "I want (to swim) in the ocean.", verb: "to swim", options: ["Transitive", "Intransitive", "Linking", "Helping", "Infinitive"], answer: "Infinitive" }
];

const modalData = [
 { id: 1, scenario: "It is absolutely mandatory that you wear a helmet.", type: "obligation", strength: 100, options: ["might", "should", "must", "can"], answer: "must" },
 { id: 2, scenario: "There's a small chance it will rain tomorrow.", type: "probability", strength: 30, options: ["might", "must", "will", "ought to"], answer: "might" },
 { id: 3, scenario: "It is highly recommended to eat vegetables.", type: "advice", strength: 70, options: ["can", "should", "might", "would"], answer: "should" },
 { id: 4, scenario: "I am 100% certain that the sun will rise.", type: "probability", strength: 100, options: ["might", "could", "will", "should"], answer: "will" }
];

export default function LabE8VerbsModals({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [activeTab, setActiveTab] = useState<'verbs' | 'modals'>('verbs');
 const [verbIndex, setVerbIndex] = useState(0);
 const [modalIndex, setModalIndex] = useState(0);
 
 const [verbAnswers, setVerbAnswers] = useState<Record<number, string>>({});
 const [modalAnswers, setModalAnswers] = useState<Record<number, string>>({});
 
 const currentV = verbData[verbIndex];
 const currentM = modalData[modalIndex];

 // Visuals for Verb Stage
 const currentVAnswer = verbAnswers[currentV.id];
 let displayMode = 'idle';
 if (currentVAnswer === currentV.answer) displayMode = currentV.answer;

 // Visuals for Modal Gauge
 const currentMAnswer = modalAnswers[currentM.id];
 let needleStrength = 0;
 if (currentMAnswer) {
  if (currentMAnswer === currentM.answer) needleStrength = currentM.strength;
  else needleStrength = 50; // default middle if wrong
 }
 const rotation = (needleStrength / 100) * 180 - 90;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-[#000000]/50 dark:!bg-[#000000] dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">
  <header className="flex items-center p-4 dark:bg-[#121212] shadow-sm z-10 border-b border-slate-200 dark:border-[#1c1b1b]">
   <button onClick={onExit} className="mr-4 whitespace-nowrap flex-shrink-0 p-2 rounded-full hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:hover:bg-slate-700 transition-colors">
    <ArrowLeft size={24} />
   </button>
   <h1 className="text-lg md:text-xl font-bold flex items-center gap-2">
   <Activity className="text-indigo-500 dark:text-indigo-400" />
   Verb Action Stage & Modal Machine
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
     onClick={() => setActiveTab('verbs')}
     className={`flex-1 whitespace-nowrap flex-shrink-0 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'verbs' ? 'bg-indigo-100 dark:bg-indigo-900/50 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300' : 'hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 text-slate-600 dark:text-[#a1a1aa] dark:text-[#ffffff] dark:hover:bg-slate-700'}`}
    >
     <Play size={18} /> Verb Types
    </button>
    <button
     onClick={() => setActiveTab('modals')}
     className={`flex-1 whitespace-nowrap flex-shrink-0 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'modals' ? 'bg-emerald-100 dark:bg-emerald-900/50 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300' : 'hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 text-slate-600 dark:text-[#a1a1aa] dark:text-[#ffffff] dark:hover:bg-slate-700'}`}
    >
     <Gauge size={18} /> Modal Machine
    </button>
    </div>

    <div className="p-4">
    {activeTab === 'verbs' ? (
     <div className="space-y-6">
     <div className="flex justify-between items-center bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-[#121212]/50 p-2 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
      <button onClick={() => setVerbIndex(Math.max(0, verbIndex - 1))} disabled={verbIndex === 0} className="whitespace-nowrap flex-shrink-0 px-3 py-1 rounded dark:bg-slate-700 shadow disabled:opacity-50 text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] transition-opacity">Prev</button>
      <span className="font-semibold text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">Verb {verbIndex + 1} of {verbData.length}</span>
      <button onClick={() => setVerbIndex(Math.min(verbData.length - 1, verbIndex + 1))} disabled={verbIndex === verbData.length - 1} className="whitespace-nowrap flex-shrink-0 px-3 py-1 rounded dark:bg-slate-700 shadow disabled:opacity-50 text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] transition-opacity">Next</button>
     </div>

     <div className="bg-white dark:!bg-[#121212] dark:bg-slate-700/50 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
      <h3 className="font-bold text-lg text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] mb-4">Identify the Verb Type</h3>
      
      <p className="text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] text-lg mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/50 text-center">
       {currentV.sentence.split(new RegExp(`\\(.*?\\)`, 'gi')).map((part, i, arr) => (
        <span key={i}>
         {part}
         {i < arr.length - 1 && <span className="font-bold text-indigo-600 dark:text-indigo-400 dark:text-indigo-400 underline decoration-2 mx-1">{currentV.verb}</span>}
        </span>
       ))}
      </p>

      <div className="grid grid-cols-2 gap-3">
       {currentV.options.map(opt => {
        const isSelected = verbAnswers[currentV.id] === opt;
        const correct = opt === currentV.answer;
        const showResult = verbAnswers[currentV.id] !== undefined;
        let btnClass = "bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff] dark:text-[#ffffff] hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-[#121212] dark:border-slate-600 dark:text-[#ffffff] dark:hover:bg-slate-700";
        
        if (showResult) {
         if (correct && isSelected) btnClass = "bg-green-100 dark:bg-green-900/50 dark:bg-green-900/60 border-green-500 text-green-700 dark:text-green-300 dark:bg-green-900/30 dark:border-green-500 dark:text-green-400";
         else if (!correct && isSelected) btnClass = "bg-red-100 dark:bg-red-900/50 dark:bg-red-900/60 border-red-500 text-red-700 dark:text-red-300 dark:bg-red-900/30 dark:border-red-500 dark:text-red-400";
         else if (correct) btnClass = "bg-green-50 dark:bg-green-900/50 border-green-300 text-green-600 dark:text-green-400 dark:bg-green-900/10 dark:border-green-700 dark:text-green-500";
        }

        return (
         <button
          key={opt}
          onClick={() => !showResult && setVerbAnswers(prev => ({...prev, [currentV.id]: opt}))}
          disabled={showResult}
          className={`whitespace-nowrap flex-shrink-0 py-2 px-3 rounded-md border text-sm font-medium transition-colors ${btnClass}`}
         >
          {opt}
         </button>
        )
       })}
      </div>
     </div>
    </div>
    ) : (
    <div className="space-y-6">
     <div className="flex justify-between items-center bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-[#121212]/50 p-2 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
      <button onClick={() => setModalIndex(Math.max(0, modalIndex - 1))} disabled={modalIndex === 0} className="whitespace-nowrap flex-shrink-0 px-3 py-1 rounded dark:bg-slate-700 shadow disabled:opacity-50 text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] transition-opacity">Prev</button>
      <span className="font-semibold text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa]">Scenario {modalIndex + 1} of {modalData.length}</span>
      <button onClick={() => setModalIndex(Math.min(modalData.length - 1, modalIndex + 1))} disabled={modalIndex === modalData.length - 1} className="whitespace-nowrap flex-shrink-0 px-3 py-1 rounded dark:bg-slate-700 shadow disabled:opacity-50 text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] transition-opacity">Next</button>
     </div>

     <div className="bg-white dark:!bg-[#121212] dark:bg-slate-700/50 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
      <h3 className="font-bold text-lg text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] mb-2">Choose the Right Modal</h3>
      <div className="inline-block px-2 py-1 mb-4 text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/50 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 rounded">
       Type: {currentM.type}
      </div>
      
      <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/50 dark:bg-amber-900/20 border-l-4 border-amber-400 rounded-r shadow-sm">
       <p className="text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] italic text-lg">"{currentM.scenario}"</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
       {currentM.options.map(opt => {
        const isSelected = modalAnswers[currentM.id] === opt;
        const correct = opt === currentM.answer;
        const showResult = modalAnswers[currentM.id] !== undefined;
        let btnClass = "bg-slate-50 dark:bg-[#121212]/50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff] dark:text-[#ffffff] hover:bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-[#121212] dark:border-slate-600 dark:text-[#ffffff] dark:hover:bg-slate-700";
        
        if (showResult) {
         if (correct && isSelected) btnClass = "bg-green-100 dark:bg-green-900/50 dark:bg-green-900/60 border-green-500 text-green-700 dark:text-green-300 dark:bg-green-900/30 dark:border-green-500 dark:text-green-400";
         else if (!correct && isSelected) btnClass = "bg-red-100 dark:bg-red-900/50 dark:bg-red-900/60 border-red-500 text-red-700 dark:text-red-300 dark:bg-red-900/30 dark:border-red-500 dark:text-red-400";
         else if (correct) btnClass = "bg-green-50 dark:bg-green-900/50 border-green-300 text-green-600 dark:text-green-400 dark:bg-green-900/10 dark:border-green-700 dark:text-green-500";
        }

        return (
         <button
          key={opt}
          onClick={() => !showResult && setModalAnswers(prev => ({...prev, [currentM.id]: opt}))}
          disabled={showResult}
          className={`whitespace-nowrap flex-shrink-0 py-3 px-3 rounded-md border text-sm font-bold uppercase tracking-wider transition-colors ${btnClass}`}
         >
          {opt}
         </button>
        )
       })}
      </div>
     </div>
    </div>
    )}
    </div>
   </div>

   {/* Right Column - Canvas */}
   <div className="w-full lg:w-2/3 flex flex-col bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-[#121212] p-8 lg:overflow-y-auto items-center justify-center relative">
   {activeTab === 'verbs' ? (
    <div className="w-full max-w-lg bg-white dark:!bg-[#121212] dark:!bg-[#121212] rounded-2xl shadow-xl border-4 border-indigo-200 dark:border-indigo-900/50 overflow-hidden">
     <div className="bg-indigo-100 dark:bg-indigo-900/50 dark:bg-indigo-900/60 dark:bg-indigo-900/50 p-4 text-center font-bold text-indigo-800 dark:text-indigo-200 dark:text-indigo-300 uppercase tracking-widest border-b-4 border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center gap-2">
      <Settings className="animate-spin-slow" size={20} />
      Verb Action Stage
     </div>
     
     <div className="h-72 flex flex-col items-center justify-center relative bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-6 overflow-hidden">
      {displayMode === 'idle' && (
       <div className="text-slate-400 dark:text-[#a1a1aa] font-medium text-xl animate-pulse flex flex-col items-center gap-4">
        <Play size={48} className="opacity-50" />
        Waiting for categorization...
       </div>
      )}
      
      {displayMode === 'Transitive' && (
       <div className="flex items-center space-x-6 animate-[bounce_1s_ease-in-out_infinite]">
        <div className="bg-blue-500 text-white p-4 rounded-xl font-bold shadow-lg text-lg /20 dark:border-teal-900 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">Subject</div>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 dark:text-blue-400">→</div>
        <div className="bg-indigo-500 text-white p-4 rounded-xl font-bold shadow-lg text-lg flex flex-col items-center dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
         <span className="text-xs opacity-75 uppercase tracking-wider mb-1">Verb</span>
         {currentV.verb}
        </div>
        <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 dark:text-indigo-400">→</div>
        <div className="bg-green-500 text-white p-4 rounded-xl font-bold shadow-lg text-lg dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">Object</div>
       </div>
      )}
      
      {displayMode === 'Intransitive' && (
       <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-6 animate-pulse">
         <div className="bg-blue-500 text-white p-4 rounded-xl font-bold shadow-lg text-lg /20 dark:border-teal-900 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">Subject</div>
         <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 dark:text-blue-400">→</div>
         <div className="bg-indigo-500 text-white p-4 rounded-xl font-bold shadow-lg text-lg flex flex-col items-center dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
          <span className="text-xs opacity-75 uppercase tracking-wider mb-1">Verb</span>
          {currentV.verb}
         </div>
        </div>
        <div className="text-xl text-rose-500 dark:text-rose-400 dark:text-rose-400 font-bold bg-rose-100 dark:bg-rose-900/50 dark:bg-rose-900/60 dark:bg-rose-900/30 px-4 py-2 rounded-lg border border-rose-200 dark:border-rose-800">
         No Object Needed!
        </div>
       </div>
      )}
      
      {displayMode === 'Linking' && (
       <div className="flex items-center space-x-6">
        <div className="bg-blue-500 text-white p-4 rounded-xl font-bold shadow-lg text-lg /20 dark:border-teal-900 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">Subject</div>
        <div className="text-5xl font-bold text-pink-500 dark:text-pink-400 animate-pulse">=</div>
        <div className="bg-orange-500 text-white p-4 rounded-xl font-bold shadow-lg text-lg dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40">Subject Complement</div>
       </div>
      )}
      
      {displayMode === 'Helping' && (
       <div className="flex items-center space-x-4">
        <div className="bg-teal-500 text-white p-5 rounded-full font-bold shadow-lg flex flex-col items-center animate-[spin_4s_linear_infinite] dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40">
         <Settings size={24} />
         <span className="text-xs mt-1">AUX</span>
        </div>
        <div className="text-3xl font-bold text-teal-500 dark:text-teal-400">+</div>
        <div className="bg-indigo-500 text-white p-5 rounded-xl font-bold shadow-lg text-lg dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
         Main Verb
        </div>
       </div>
      )}
      
      {displayMode === 'Infinitive' && (
       <div className="flex items-center bg-yellow-400 text-slate-900 dark:text-[#a1a1aa] dark:text-[#a1a1aa] p-6 rounded-2xl font-bold shadow-xl border-4 border-yellow-500 text-2xl transform hover:scale-105 transition-transform dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-yellow-500/40">
        <span className="mr-3 opacity-70">to +</span> 
        <span>Base Verb</span>
       </div>
      )}
     </div>
    </div>
   ) : (
    <div className="w-full max-w-md flex flex-col items-center bg-white dark:!bg-[#121212] dark:!bg-[#121212] p-10 rounded-2xl shadow-xl border border-slate-200 dark:border-[#1c1b1b]">
     <h2 className="text-2xl font-bold text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] dark:text-[#a1a1aa] mb-10 flex items-center gap-2">
      <Gauge className="text-emerald-500 dark:text-emerald-400" />
      Modal Strength Gauge
     </h2>
     
     <div className="relative w-72 h-36 overflow-hidden bg-slate-100 dark:bg-[#121212]/50 dark:bg-[#121212]/60 dark:bg-[#121212] rounded-t-full border-t-8 border-l-8 border-r-8 border-slate-300 dark:border-[#1c1b1b] shadow-inner">
      {/* gradient arc */}
      <div className="absolute bottom-0 left-0 w-full h-full">
       <div className="w-full h-full rounded-t-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 opacity-90 dark:opacity-70"></div>
      </div>
      
      {/* Needle */}
      <div 
       className="absolute bottom-0 left-1/2 w-1.5 h-28 bg-[#121212] dark:bg-slate-200 origin-bottom transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) rounded-t-full shadow-lg"
       style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
      >
       {/* pivot */}
       <div className="absolute -bottom-3 -left-2.5 w-6 h-6 bg-[#121212] dark:bg-slate-200 rounded-full border-4 border-white dark:border-neutral-900 shadow-md"></div>
      </div>
     </div>
     
     <div className="flex justify-between w-72 mt-4 text-sm font-bold text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-wider">
      <span>0% (Might)</span>
      <span>100% (Must)</span>
     </div>

     {currentMAnswer === currentM.answer && (
      <div className="mt-10 text-lg font-bold text-emerald-600 dark:text-emerald-400 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 dark:bg-emerald-900/60 dark:bg-emerald-900/30 px-6 py-3 rounded-xl border border-emerald-300 dark:border-emerald-700 animate-fade-in-up flex items-center gap-2 shadow-sm">
       <CheckCircle2 size={24} />
       Perfect Match! Strength: {currentM.strength}%
      </div>
     )}
    </div>
   )}
   </div>
  </div>
 </div>
 );
}
