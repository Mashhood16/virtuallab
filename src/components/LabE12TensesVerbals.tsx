import { useState } from 'react';
import { Clock, Rocket, History, FastForward, CheckCircle, HelpCircle, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabE12TensesVerbals({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 // 0 = Past Perfect, 1 = Past, 2 = Present, 3 = Future, 4 = Future Perfect
 const [timeDial, setTimeDial] = useState<number>(2); 

 const tenseMap: Record<number, { name: string, visual: string, text: string }> = {
  0: { name: "Past Perfect", visual: "grayscale blur-sm opacity-50", text: "had decayed" },
  1: { name: "Simple Past", visual: "sepia opacity-80", text: "decayed" },
  2: { name: "Present Continuous", visual: "brightness-100", text: "is growing" },
  3: { name: "Simple Future", visual: "hue-rotate-90 brightness-110", text: "will grow" },
  4: { name: "Future Perfect", visual: "invert brightness-150 saturate-200", text: "will have grown" }
 };

 const targetTense = 4; // Quest: Set dial to Future Perfect

 const [activeMode, setActiveMode] = useState<'tenses' | 'verbals'>('tenses');

 // Verbals State
 const verbalScenarios = [
  { sentence: "[Swimming] is excellent cardiovascular exercise.", type: "Gerund" },
  { sentence: "She wants [to leave] early today.", type: "Infinitive" },
  { sentence: "The [broken] vase lay on the floor.", type: "Participle" }
 ];
 const [verbalIndex, setVerbalIndex] = useState(0);
 const [selectedVerbal, setSelectedVerbal] = useState<string | null>(null);

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="Chronology Engine Lab" />

   
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
       <strong>Tenses</strong> establish the chronological location of an action, while <strong>Verbals</strong> are verbs functioning as entirely different parts of speech.
      </p>
      
      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">The 12 Tense Framework</h4>
      <p className="mt-2">Time is categorized into Past, Present, and Future. Each time has four aspects:</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>Simple:</strong> Basic action (e.g., I walk, I walked, I will walk).</li>
       <li><strong>Continuous (Progressive):</strong> Ongoing action (e.g., I am walking).</li>
       <li><strong>Perfect:</strong> Completed action before a certain point (e.g., I have walked, I had walked, I will have walked).</li>
       <li><strong>Perfect Continuous:</strong> Ongoing action up to a certain point (e.g., I have been walking).</li>
      </ul>

      <hr className="my-6 border-slate-200 dark:border-gray-800" />

      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">Verbal Identification</h4>
      <p className="mt-2">
       Verbals look like verbs but do not act like them. They function as nouns, adjectives, or adverbs.
      </p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>Gerund:</strong> Ends in "-ing" and acts as a noun. (e.g., <em>Swimming</em> is fun).</li>
       <li><strong>Infinitive:</strong> "To" + base verb, acting as noun, adjective, or adverb. (e.g., I love <em>to swim</em>).</li>
       <li><strong>Participle:</strong> Ends in "-ing", "-ed", or "-en" and acts as an adjective. (e.g., The <em>broken</em> vase).</li>
      </ul>
     </div>
    </section>

    {/* Window 2: Controls */}
    <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
      <Clock className="text-[#4158D1]" /> Temporal Shift
     </h2>

     <div className="flex gap-2 mb-6">
      <button 
       onClick={() => setActiveMode('tenses')}
       className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === 'tenses' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#2a2a2a] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
      >
       Time Machine
      </button>
      <button 
       onClick={() => setActiveMode('verbals')}
       className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === 'verbals' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#2a2a2a] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
      >
       Verbal Parser
      </button>
     </div>

     <div className="flex-1 overflow-y-auto">
      {activeMode === 'tenses' && (
       <div className="space-y-6">
        <div className={`p-6 rounded-2xl border border-slate-200 dark:border-[#2a2a2a] text-center flex-col `}>
         <h3 className="font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-widest text-sm">Temporal Dial</h3>
         
         <div className="relative w-48 h-48 mx-auto mb-8">
          {/* The Dial */}
          <div className="absolute inset-0 rounded-full border-8 border-[#4158D1] shadow-[0_0_30px_rgba(65,88,209,0.3)] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
           <div 
            className={`absolute top-0 bottom-0 left-1/2 w-1 -ml-0.5 bg-red-500 transition-transform duration-500 ease-out origin-center flex-col `}
            style={{ transform: `rotate(${(timeDial - 2) * 45}deg)` }}
           >
            <div className={`w-4 h-4 bg-red-500 rounded-full -ml-1.5 -mt-2 flex-col `}></div>
           </div>
          </div>
         </div>

         <div className="flex justify-between items-center bg-slate-50 dark:bg-[#1a1a1a] p-2 rounded-xl shadow-inner border border-slate-200 dark:border-gray-800">
          <button onClick={() => setTimeDial(p => Math.max(0, p - 1))} className="p-3 bg-white dark:bg-[#2a2a2a] hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg text-slate-700 dark:text-gray-300">
           <History className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center font-black text-[#4158D1]">
           {tenseMap[timeDial].name}
          </div>
          <button onClick={() => setTimeDial(p => Math.min(4, p + 1))} className="p-3 bg-white dark:bg-[#2a2a2a] hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg text-slate-700 dark:text-gray-300">
           <FastForward className="w-5 h-5" />
          </button>
         </div>

         <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="font-bold text-yellow-800 dark:text-yellow-500 mb-1">Quest:</p>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
           Dial the timeline forward until the action implies it will be completed before a specified point in the future.
          </p>
         </div>

         {timeDial === targetTense && (
          <div className="mt-4 p-3 bg-emerald-500 text-white rounded-lg font-bold flex justify-center items-center gap-2 animate-pulse">
           <CheckCircle className="w-5 h-5" /> Timeline Synced
          </div>
         )}
        </div>
       </div>
      )}

      {activeMode === 'verbals' && (
        <div className="space-y-6">
        <div className="p-4 rounded-xl border border-purple-200 dark:border-[#2a2a2a]">
         <h3 className="font-bold text-purple-800 dark:text-white flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-purple-500" /> Verbal Identification
         </h3>
         <p className="text-lg font-medium mb-6 text-center py-4 bg-purple-50 dark:bg-[#1a1a1a] rounded-lg border border-purple-100 dark:border-gray-800 dark:text-white">
          {verbalScenarios[verbalIndex].sentence}
         </p>
         <div className="flex flex-col gap-2">
          {['Gerund', 'Infinitive', 'Participle'].map(type => (
           <button 
            key={type}
            onClick={() => setSelectedVerbal(type)}
            className={`p-3 text-sm font-bold border-2 rounded-xl transition-all ${selectedVerbal === type ? (verbalScenarios[verbalIndex].type === type ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-red-500 bg-red-500 text-white') : 'border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-gray-300 hover:border-purple-500'}`}
           >
            {type}
           </button>
          ))}
         </div>
         {selectedVerbal === verbalScenarios[verbalIndex].type && (
          <button 
           onClick={() => { setVerbalIndex(p => (p + 1) % verbalScenarios.length); setSelectedVerbal(null); }}
           className="mt-6 w-full py-3 bg-[#4158D1] text-white rounded-xl font-bold hover:bg-blue-700"
          >
           Next Verbal Parse
          </button>
         )}
        </div>
       </div>
      )}
     </div>
    </section>

    {/* Window 3: Simulation */}
    <section className={`bg-slate-900 rounded-xl shadow-sm border border-slate-800 relative flex items-center justify-center p-8 overflow-hidden min-h-[500px] `}>
     {activeMode === 'tenses' && (
      <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-800 bg-gradient-to-b from-sky-400 to-green-500 flex items-center justify-center z-10">
       
       {/* The City/Tree visual that changes based on tense */}
       <div className={`transition-all duration-1000 ease-in-out transform scale-150 ${tenseMap[timeDial].visual}`}>
        <svg width="200" height="200" viewBox="0 0 100 100">
         {/* Tree base */}
         <rect x="45" y="50" width="10" height="40" fill="#8B4513" />
         {/* Leaves */}
         <circle cx="50" cy="40" r="25" fill="#228B22" />
         <circle cx="35" cy="55" r="20" fill="#006400" />
         <circle cx="65" cy="55" r="20" fill="#32CD32" />
        </svg>
       </div>
       
       <div className="absolute bottom-6 bg-black/70 backdrop-blur px-6 py-3 rounded-xl border border-white/20 shadow-2xl">
        <p className="text-xl font-black text-white font-mono uppercase tracking-widest text-center">
         The Tree <span className="text-[#4158D1]">{tenseMap[timeDial].text}</span>
        </p>
       </div>
      </div>
     )}

     {activeMode === 'verbals' && (
      <div className="text-center z-10">
       <Rocket className="w-32 h-32 text-gray-700 mx-auto mb-8 opacity-20" />
       <h2 className="text-3xl font-black tracking-widest text-gray-700 uppercase opacity-20">Timeline Paused</h2>
      </div>
     )}
    </section>
   </main>
  </div>
 );
}
