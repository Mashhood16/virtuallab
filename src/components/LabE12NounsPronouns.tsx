import { useState, useEffect } from 'react';
import { Layers, ArrowLeft, ShieldAlert, CheckCircle, Target, Shield, AlertTriangle, Zap, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface NounWord {
 id: number;
 word: string;
 type: 'Abstract' | 'Collective' | 'Proper' | 'Concrete' | 'Compound';
}

export default function LabE12NounsPronouns({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeMode, setActiveMode] = useState<'sorter' | 'resolver'>('sorter');

 // CONVEYOR BELT SORTER STATE
 const [score, setScore] = useState(0);
 const [combo, setCombo] = useState(0);
 const [fallingWords, setFallingWords] = useState<(NounWord & { position: number })[]>([]);
 const [gameOver, setGameOver] = useState(false);
 
 const wordPool: NounWord[] = [
  { id: 1, word: 'Justice', type: 'Abstract' },
  { id: 2, word: 'Flock', type: 'Collective' },
  { id: 3, word: 'London', type: 'Proper' },
  { id: 4, word: 'Toothbrush', type: 'Compound' },
  { id: 5, word: 'Apple', type: 'Concrete' },
  { id: 6, word: 'Wisdom', type: 'Abstract' },
  { id: 7, word: 'Jury', type: 'Collective' },
  { id: 8, word: 'Einstein', type: 'Proper' },
  { id: 9, word: 'Keyboard', type: 'Compound' },
  { id: 10, word: 'Brick', type: 'Concrete' },
 ];

 const bins = ['Abstract', 'Collective', 'Proper', 'Concrete', 'Compound'];

 useEffect(() => {
  if (activeMode !== 'sorter' || gameOver) return;
  
  const spawnInterval = setInterval(() => {
   setFallingWords(prev => {
    if (prev.length > 5) return prev; // max 5 words at a time
    const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
    return [...prev, { ...randomWord, position: 0, id: Date.now() + Math.random() }];
   });
  }, 2000);

  const dropInterval = setInterval(() => {
   setFallingWords(prev => {
    const newWords = prev.map(w => ({ ...w, position: w.position + 5 }));
    const dropped = newWords.find(w => w.position >= 100);
    if (dropped) {
     setCombo(0); // Reset combo if missed
    }
    return newWords.filter(w => w.position < 100);
   });
  }, 200);

  return () => {
   clearInterval(spawnInterval);
   clearInterval(dropInterval);
  };
 }, [activeMode, gameOver]);

 const handleSort = (binType: string) => {
  if (fallingWords.length === 0) return;
  
  const targetWord = fallingWords[0]; // sort the lowest word
  if (targetWord.type === binType) {
   setScore(s => s + 10 + (combo * 2));
   setCombo(c => c + 1);
  } else {
   setCombo(0);
  }
  setFallingWords(prev => prev.slice(1));
 };

 // ANTECEDENT RESOLVER STATE
 const resolverScenarios = [
  { sentence: "The committee reached ______ decision.", target: "its", incorrect: "their", reason: "Collective noun acting as a single unit takes singular pronoun." },
  { sentence: "Each of the students must bring ______ own lunch.", target: "his or her", incorrect: "their", reason: "'Each' is singular and requires a singular pronoun." },
  { sentence: "The director ______ approved the budget.", target: "himself", incorrect: "itself", reason: "Intensive pronoun used to emphasize the person." }
 ];
 const [resIndex, setResIndex] = useState(0);
 const [systemState, setSystemState] = useState<'stable' | 'shorted' | 'fixed'>('stable');

 const handleResolve = (choice: string) => {
  if (choice === resolverScenarios[resIndex].target) {
   setSystemState('fixed');
  } else {
   setSystemState('shorted');
  }
 };

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="Identity Matrix Lab" />

   
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
       <strong>Nouns</strong> are the structural anchors of language, identifying people, places, concepts, and objects. They are broken down into specific taxonomies.
      </p>
      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">Noun Taxonomies</h4>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>Abstract:</strong> Concepts or ideas you cannot physically touch (e.g., Justice, Wisdom).</li>
       <li><strong>Collective:</strong> A word referring to a group as a single entity (e.g., Flock, Jury, Team).</li>
       <li><strong>Proper:</strong> Specific names of entities, always capitalized (e.g., London, Einstein).</li>
       <li><strong>Concrete:</strong> Physical objects you can perceive with your senses (e.g., Apple, Brick).</li>
       <li><strong>Compound:</strong> Two words joined to create a new noun (e.g., Toothbrush, Keyboard).</li>
      </ul>

      <hr className="my-6 border-slate-200 dark:border-gray-800" />

      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">Pronoun Antecedents</h4>
      <p className="mt-2">
       Pronouns must agree with their antecedents (the noun they replace) in number, person, and gender.
      </p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>Collective Agreement:</strong> When a collective noun acts as a single unit, it requires a singular pronoun: <em>"The jury reached <strong>its</strong> verdict."</em></li>
       <li><strong>Indefinite Pronouns:</strong> Words like 'Each', 'Everyone', and 'Someone' are singular and require singular pronouns (e.g., his or her).</li>
       <li><strong>Intensive vs. Reflexive:</strong> Intensive pronouns (himself, itself) emphasize the subject (<em>"I did it myself"</em>), while reflexive pronouns receive the action (<em>"She hurt herself"</em>).</li>
      </ul>
     </div>
    </section>

    {/* Window 2: Controls */}
    <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
      <Layers className="text-[#4158D1]" /> System Controls
     </h2>
     
     <div className="flex gap-2 mb-6">
      <button 
       onClick={() => setActiveMode('sorter')}
       className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === 'sorter' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#2a2a2a] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
      >
       Noun Sorter
      </button>
      <button 
       onClick={() => setActiveMode('resolver')}
       className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === 'resolver' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#2a2a2a] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
      >
       Resolver
      </button>
     </div>

     <div className="flex-1 overflow-y-auto">
      {activeMode === 'sorter' && (
       <div className="space-y-4">
        <div className={`p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 flex-col `}>
         <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
          <Target className="w-4 h-4" /> Telemetry
         </h3>
         <div className="grid grid-cols-2 gap-4">
          <div>
           <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider font-bold">Score</p>
           <p className="text-2xl font-black text-blue-900 dark:text-blue-200">{score}</p>
          </div>
          <div>
           <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider font-bold">Combo</p>
           <p className="text-2xl font-black text-orange-500">x{combo}</p>
          </div>
         </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-gray-400 italic">
         "Watch the conveyor belt in the Simulation Space. When a word drops, click the correct bin below to sort it."
        </p>
        <div className="grid grid-cols-2 gap-3 mt-4">
         {bins.map(bin => (
          <button 
           key={bin}
           onClick={() => handleSort(bin)}
           className={`p-3 border-2 border-slate-300 dark:border-gray-700 hover:border-[#4158D1] dark:hover:border-[#4158D1] rounded-xl font-bold text-slate-700 dark:text-gray-300 transition-colors flex-col `}
          >
           {bin}
          </button>
         ))}
        </div>
       </div>
      )}

      {activeMode === 'resolver' && (
       <div className="space-y-6">
        <div className={`p-4 rounded-xl border ${systemState === 'shorted' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : systemState === 'fixed' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : ' border-slate-200 dark:border-[#2a2a2a]'}`}>
         <h3 className={`font-bold flex items-center gap-2 mb-4 ${systemState === 'shorted' ? 'text-red-700 dark:text-red-400' : systemState === 'fixed' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
          {systemState === 'stable' && <Shield className="w-5 h-5 text-blue-500" />}
          {systemState === 'shorted' && <Zap className="w-5 h-5 text-red-500 animate-pulse" />}
          {systemState === 'fixed' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
          System Status: {systemState.toUpperCase()}
         </h3>
         
         <div className="text-lg font-medium leading-relaxed mb-6 dark:text-white">
          {resolverScenarios[resIndex].sentence.split('______').map((part, i, arr) => (
           <span key={i}>
            {part}
            {i < arr.length - 1 && (
             <span className={`inline-block border-b-4 px-4 font-bold mx-1 ${systemState === 'fixed' ? 'border-emerald-500 text-emerald-500' : systemState === 'shorted' ? 'border-red-500 text-red-500' : 'border-[#4158D1] text-[#4158D1] animate-pulse'}`}>
              {systemState === 'fixed' ? resolverScenarios[resIndex].target : systemState === 'shorted' ? resolverScenarios[resIndex].incorrect : '???'}
             </span>
            )}
           </span>
          ))}
         </div>

         {systemState === 'stable' && (
          <div className="flex gap-3">
           <button onClick={() => handleResolve(resolverScenarios[resIndex].incorrect)} className={`flex-1 p-3 bg-slate-50 dark:bg-[#2a2a2a] border border-slate-300 dark:border-gray-600 rounded-xl hover:bg-slate-200 dark:hover:bg-[#333] font-bold dark:text-white flex-col `}>
            {resolverScenarios[resIndex].incorrect}
           </button>
           <button onClick={() => handleResolve(resolverScenarios[resIndex].target)} className="flex-1 p-3 bg-slate-50 dark:bg-[#2a2a2a] border border-slate-300 dark:border-gray-600 rounded-xl hover:bg-slate-200 dark:hover:bg-[#333] font-bold dark:text-white">
            {resolverScenarios[resIndex].target}
           </button>
          </div>
         )}

         {systemState !== 'stable' && (
          <div className="mt-4">
           <p className={`text-sm mb-4 ${systemState === 'fixed' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
            {resolverScenarios[resIndex].reason}
           </p>
           <button 
            onClick={() => { setResIndex(p => (p + 1) % resolverScenarios.length); setSystemState('stable'); }}
            className="w-full py-3 bg-[#4158D1] text-white font-bold rounded-xl hover:bg-[#5560F1]"
           >
            Next Sequence
           </button>
          </div>
         )}
        </div>
       </div>
      )}
     </div>
    </section>

    {/* Window 3: Simulation */}
    <section className={`w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative flex items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     {/* Background Grid */}
     <div className="absolute inset-0 opacity-10 dark:opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#4158D1 1px, transparent 1px), linear-gradient(90deg, #4158D1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
     
     {activeMode === 'sorter' && (
      <div className="relative w-full max-w-sm h-full max-h-[600px] border-4 border-slate-300 dark:border-[#1c1b1b] rounded-2xl overflow-hidden shadow-2xl">
       {/* Belt visual */}
       <div className="absolute inset-y-0 left-1/2 w-32 -ml-16 bg-slate-100 dark:bg-[#1a1a1a] border-l border-r border-slate-200 dark:border-[#222]" />
       
       {/* Falling Words */}
       {fallingWords.map(fw => (
        <div 
         key={fw.id}
         className="absolute left-1/2 -ml-14 w-28 text-center bg-[#4158D1] text-white py-2 rounded-lg font-bold text-sm shadow-md transition-all duration-200 ease-linear"
         style={{ top: `${fw.position}%` }}
        >
         {fw.word}
        </div>
       ))}

       {/* Scanner Zone */}
       <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#4158D1]/20 to-transparent pointer-events-none border-t border-[#4158D1]/30">
        <p className="text-center absolute bottom-2 w-full text-xs font-bold text-[#4158D1] uppercase tracking-widest">Scanner Active</p>
       </div>
      </div>
     )}

     {activeMode === 'resolver' && (
      <div className="relative text-center">
       {systemState === 'stable' && (
        <div className="w-48 h-48 mx-auto rounded-full border-4 border-blue-500/30 flex items-center justify-center relative animate-pulse">
         <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping" />
         <Layers className="w-20 h-20 text-blue-500" />
        </div>
       )}
       {systemState === 'shorted' && (
        <div className="w-48 h-48 mx-auto rounded-full border-4 border-red-500/30 flex items-center justify-center relative">
         <Zap className="w-20 h-20 text-red-500 animate-bounce" />
        </div>
       )}
       {systemState === 'fixed' && (
        <div className="w-48 h-48 mx-auto rounded-full border-4 border-emerald-500/30 flex items-center justify-center relative">
         <CheckCircle className="w-20 h-20 text-emerald-500" />
        </div>
       )}
       <h2 className={`mt-8 text-3xl font-black tracking-widest uppercase ${systemState === 'stable' ? 'text-slate-800 dark:text-white' : systemState === 'shorted' ? 'text-red-500' : 'text-emerald-500'}`}>
        {systemState === 'stable' ? 'Awaiting Input' : systemState === 'shorted' ? 'Syntax Error' : 'Structure Intact'}
       </h2>
      </div>
     )}
    </section>
   </main>
  </div>
 );
}
