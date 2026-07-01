import { useState } from 'react';
import { Network, Route, GitMerge, AlertTriangle, ArrowRight, Zap, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabE12PrepositionsConjunctions({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeMode, setActiveMode] = useState<'prepositions' | 'conjunctions'>('prepositions');

 // Bridge Builder State
 const prepScenarios = [
  { islandA: "The cat jumped", islandB: "the wall", correctBridge: "over", type: "Movement", options: ["over", "in", "by", "until"] },
  { islandA: "She stayed here", islandB: "Monday", correctBridge: "until", type: "Time", options: ["until", "from", "at", "through"] },
  { islandA: "The book was written", islandB: "a famous author", correctBridge: "by", type: "Agent", options: ["by", "with", "for", "to"] }
 ];
 const [prepIndex, setPrepIndex] = useState(0);
 const [prepBridge, setPrepBridge] = useState<string | null>(null);

 const conjScenarios = [
  { islandA: "I wanted to go", islandB: "it started raining", correctBridge: "but", type: "Coordinating", options: ["but", "and", "or", "so"] },
  { islandA: "You will succeed", islandB: "you study hard", correctBridge: "if", type: "Subordinating", options: ["if", "although", "unless", "because"] },
  { islandA: "Not only is he smart", islandB: "he is also hardworking", correctBridge: "but", type: "Correlative", options: ["but", "and", "or", "yet"] }
 ];
 const [conjIndex, setConjIndex] = useState(0);
 const [conjBridge, setConjBridge] = useState<string | null>(null);

 const isPrepCorrect = prepBridge === prepScenarios[prepIndex].correctBridge;
 const isConjCorrect = conjBridge === conjScenarios[conjIndex].correctBridge;

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="Bridge Builder Lab" />

   
   {/* Mobile Tab Navigation */}
   <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
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
   
   <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
    {/* Window 1: Theory */}
    <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b]  ? 'block' : 'hidden'} lg:block`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
      <BookOpen className="mr-2 text-indigo-500" /> Grammar Theory
     </h2>
     <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
      <p>
       <strong>Connectives</strong> are the structural bridges of the English language. Without them, thoughts remain isolated on independent islands.
      </p>
      
      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">Prepositions (Spatial & Temporal Links)</h4>
      <p className="mt-2">Prepositions show relationships between a noun (or pronoun) and other words in a sentence.</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>Time:</strong> Indicates when something happened (e.g., <em>until, from, at, during</em>).</li>
       <li><strong>Movement:</strong> Indicates direction (e.g., <em>over, through, into, across</em>).</li>
       <li><strong>Agent:</strong> Indicates who or what caused an action (e.g., written <em>by</em> him).</li>
      </ul>

      <hr className="my-6 border-slate-200 dark:border-gray-800" />

      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">Conjunctions (Clause Mergers)</h4>
      <p className="mt-2">
       Conjunctions connect words, phrases, or clauses together. 
      </p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>Coordinating:</strong> Connects two equal clauses. Think FANBOYS (<em>For, And, Nor, But, Or, Yet, So</em>).</li>
       <li><strong>Subordinating:</strong> Connects a dependent clause to an independent clause, establishing a relationship of time, reason, or condition (e.g., <em>because, if, although</em>).</li>
       <li><strong>Correlative:</strong> Pairs of conjunctions that work together (e.g., <em>Not only... but also</em>, <em>Either... or</em>).</li>
      </ul>
     </div>
    </section>

    {/* Window 2: Controls */}
    <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
      <Network className="text-[#4158D1]" /> Structural Connectivity
     </h2>

     <div className="flex gap-2 mb-6">
      <button 
       onClick={() => setActiveMode('prepositions')}
       className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === 'prepositions' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#2a2a2a] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
      >
       Preposition Maps
      </button>
      <button 
       onClick={() => setActiveMode('conjunctions')}
       className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === 'conjunctions' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#2a2a2a] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
      >
       Conjunction Mergers
      </button>
     </div>

     <div className="flex-1 overflow-y-auto">
      {activeMode === 'prepositions' && (
       <div className="space-y-6">
        <div className={`p-4 rounded-xl border border-blue-200 dark:border-[#2a2a2a] flex-col `}>
         <h3 className="font-bold text-blue-800 dark:text-white flex items-center gap-2 mb-4">
          <Route className="w-5 h-5 text-[#4158D1]" /> Available Materials
         </h3>
         <div className="grid grid-cols-2 gap-3">
          {prepScenarios[prepIndex].options.map(opt => (
           <button 
            key={opt}
            onClick={() => setPrepBridge(opt)}
            className={`p-3 border-2 rounded-xl font-bold transition-all ${prepBridge === opt ? 'border-[#4158D1] bg-[#4158D1] text-white' : 'border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-gray-300 hover:border-[#4158D1]'}`}
           >
            {opt}
           </button>
          ))}
         </div>
         
         {prepBridge && (
          <div className={`mt-6 p-4 rounded-lg font-bold text-center border-2 ${isPrepCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-500' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-500'}`}>
           {isPrepCorrect ? `Bridge Stable! (${prepScenarios[prepIndex].type})` : "Bridge Collapsing!"}
           {isPrepCorrect && (
            <button 
             onClick={() => { setPrepIndex(p => (p + 1) % prepScenarios.length); setPrepBridge(null); }}
             className={`mt-3 w-full py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex-col `}
            >
             Next Chasm
            </button>
           )}
          </div>
         )}
        </div>
       </div>
      )}

      {activeMode === 'conjunctions' && (
       <div className="space-y-6">
        <div className={`p-4 rounded-xl border border-purple-200 dark:border-[#2a2a2a] flex-col `}>
         <h3 className="font-bold text-purple-800 dark:text-white flex items-center gap-2 mb-4">
          <GitMerge className="w-5 h-5 text-purple-500" /> Clause Binders
         </h3>
         <div className="grid grid-cols-2 gap-3">
          {conjScenarios[conjIndex].options.map(opt => (
           <button 
            key={opt}
            onClick={() => setConjBridge(opt)}
            className={`p-3 border-2 rounded-xl font-bold transition-all ${conjBridge === opt ? 'border-purple-500 bg-purple-500 text-white' : 'border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-gray-300 hover:border-purple-500'}`}
           >
            {opt}
           </button>
          ))}
         </div>
         
         {conjBridge && (
          <div className={`mt-6 p-4 rounded-lg font-bold text-center border-2 ${isConjCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-500' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-500'}`}>
           {isConjCorrect ? `Merger Successful! (${conjScenarios[conjIndex].type})` : "Syntax Clash!"}
           {isConjCorrect && (
            <button 
             onClick={() => { setConjIndex(p => (p + 1) % conjScenarios.length); setConjBridge(null); }}
             className="mt-3 w-full py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
             Next Connection
            </button>
           )}
          </div>
         )}
        </div>
       </div>
      )}
     </div>
    </section>

    {/* Window 3: Simulation */}
    <section className={`w-full bg-blue-900 dark:bg-[#121212] lg:dark:bg-[#0a1128] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative flex items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     {/* Ocean Background */}
     <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #1e3a8a 0%, transparent 100%)' }} />

     {/* Islands */}
     <div className="relative flex items-center justify-between w-full max-w-2xl flex-col md:flex-row gap-8 md:gap-0">
      
      {/* Island A */}
      <div className="relative z-10 w-48 h-48 bg-emerald-600 dark:bg-emerald-800 rounded-[40%] shadow-2xl flex items-center justify-center border-8 border-emerald-500/50">
       <div className="text-center p-4 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-xl">
        <p className="font-bold text-slate-800 dark:text-white">
         {activeMode === 'prepositions' ? prepScenarios[prepIndex].islandA : conjScenarios[conjIndex].islandA}
        </p>
       </div>
      </div>

      {/* Bridge Space */}
      <div className="flex-1 flex justify-center relative z-0 md:h-16 h-32 md:w-auto w-full">
       {/* The Chasm */}
       <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full md:h-4 h-full md:w-full w-4 bg-blue-800/50 dark:bg-blue-950/50 rounded-full" />
       </div>

       {/* The Bridge */}
       <div className="absolute inset-0 flex items-center justify-center">
        {((activeMode === 'prepositions' && prepBridge) || (activeMode === 'conjunctions' && conjBridge)) ? (
         <div className={`px-6 py-2 rounded-xl font-bold text-lg shadow-lg border-b-4 border-r-4 transition-all duration-300 transform scale-110 z-20
          ${(activeMode === 'prepositions' ? isPrepCorrect : isConjCorrect) 
           ? 'bg-yellow-400 border-yellow-600 text-yellow-900' 
           : 'bg-red-500 border-red-700 text-white animate-shake'}`
         }>
          {activeMode === 'prepositions' ? prepBridge : conjBridge}
         </div>
        ) : (
         <div className="md:w-32 md:h-12 w-12 h-32 border-4 border-dashed border-white/30 rounded-xl flex items-center justify-center bg-blue-900/50 backdrop-blur-sm z-20">
          <ArrowRight className="w-6 h-6 text-white/30 animate-pulse md:rotate-0 rotate-90" />
         </div>
        )}
       </div>
      </div>

      {/* Island B */}
      <div className="relative z-10 w-48 h-48 bg-emerald-600 dark:bg-emerald-800 rounded-[40%] shadow-2xl flex items-center justify-center border-8 border-emerald-500/50">
       <div className="text-center p-4 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-xl">
        <p className="font-bold text-slate-800 dark:text-white">
         {activeMode === 'prepositions' ? prepScenarios[prepIndex].islandB : conjScenarios[conjIndex].islandB}
        </p>
       </div>
      </div>

     </div>

     <style>{`
      @keyframes shake {
       0%, 100% { transform: translateX(0) scale(1.1); }
       25% { transform: translateX(-10px) scale(1.1) rotate(-5deg); }
       75% { transform: translateX(10px) scale(1.1) rotate(5deg); }
      }
      .animate-shake {
       animation: shake 0.4s ease-in-out;
      }
     `}</style>
    </section>
   </main>
  </div>
 );
}
