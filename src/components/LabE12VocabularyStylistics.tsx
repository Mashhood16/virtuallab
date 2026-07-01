import { useState } from 'react';
import { Scale, MessageCircle, Feather, Eye, Lightbulb, TrendingDown, TrendingUp, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabE12VocabularyStylistics({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeMode, setActiveMode] = useState<'connotation' | 'rhetoric'>('connotation');

 // Connotation Scale State
 const words = [
  { word: "Cheap", weight: -30, type: "negative" },
  { word: "Inexpensive", weight: 30, type: "positive" },
  { word: "Bossy", weight: -40, type: "negative" },
  { word: "Assertive", weight: 40, type: "positive" },
  { word: "Stubborn", weight: -25, type: "negative" },
  { word: "Determined", weight: 25, type: "positive" }
 ];

 const [leftPan, setLeftPan] = useState<number | null>(null);
 const [rightPan, setRightPan] = useState<number | null>(null);

 const getRotation = () => {
  let rotation = 0;
  if (leftPan !== null) rotation += words[leftPan].weight;
  if (rightPan !== null) rotation -= words[rightPan].weight;
  // Cap rotation between -45 and 45 degrees
  return Math.max(-45, Math.min(45, rotation));
 };

 const rotation = getRotation();

 const handleWordSelect = (index: number) => {
  if (leftPan === index || rightPan === index) return;
  
  if (leftPan === null) {
   setLeftPan(index);
  } else if (rightPan === null) {
   setRightPan(index);
  } else {
   // reset and start over
   setLeftPan(index);
   setRightPan(null);
  }
 };

 // Rhetoric State
 const rhetoricScenarios = [
  { text: "The camera loves her.", device: "Personification" },
  { text: "The pen is mightier than the sword.", device: "Metonymy" },
  { text: "I've told you a million times.", device: "Hyperbole" }
 ];
 const [rhetoricIndex, setRhetoricIndex] = useState(0);
 const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="Rhetoric Synthesizer Lab" />

   
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
       <strong>Stylistics</strong> explores how writers use vocabulary and rhetorical devices to evoke specific emotions and craft meaning beyond literal definitions.
      </p>
      
      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">Denotation vs. Connotation</h4>
      <p className="mt-2">Words often have a literal meaning and an emotional meaning.</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>Denotation:</strong> The literal, dictionary definition of a word.</li>
       <li><strong>Connotation:</strong> The emotional or cultural weight a word carries (positive, negative, or neutral). For example, "Cheap" and "Inexpensive" have the same denotation, but "Cheap" has a negative connotation.</li>
      </ul>

      <hr className="my-6 border-slate-200 dark:border-gray-800" />

      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">Rhetorical Devices</h4>
      <p className="mt-2">
       Figurative language used to make writing more persuasive or impactful.
      </p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>Personification:</strong> Giving human qualities to non-human things. (e.g., <em>The wind whispered.</em>)</li>
       <li><strong>Metonymy:</strong> Using a related object to represent a larger concept. (e.g., <em>The Crown</em> referring to the monarchy).</li>
       <li><strong>Hyperbole:</strong> Extreme exaggeration for effect. (e.g., <em>I am starving to death.</em>)</li>
      </ul>
     </div>
    </section>

    {/* Window 2: Controls */}
    <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
      <Feather className="text-[#4158D1]" /> Stylistic Synthesizer
     </h2>

     <div className="flex gap-2 mb-6">
      <button 
       onClick={() => setActiveMode('connotation')}
       className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === 'connotation' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#2a2a2a] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
      >
       Connotation Scale
      </button>
      <button 
       onClick={() => setActiveMode('rhetoric')}
       className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === 'rhetoric' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#2a2a2a] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
      >
       Rhetoric Decoder
      </button>
     </div>

     <div className="flex-1 overflow-y-auto">
      {activeMode === 'connotation' && (
       <div className="space-y-6">
        <div className={`p-4 rounded-xl border border-blue-200 dark:border-[#2a2a2a] flex-col `}>
         <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <Scale className="w-5 h-5 text-blue-500" /> Vocabulary Weights
         </h3>
         
         <p className="text-sm text-slate-600 dark:text-gray-400 mb-4 italic">
          Select two words to place them on the scale. Observe how their emotional connotation tips the balance.
         </p>

         <div className="grid grid-cols-2 gap-3">
          {words.map((w, index) => (
           <button 
            key={index}
            onClick={() => handleWordSelect(index)}
            className={`p-3 rounded-lg font-bold border-2 transition-all text-sm ${leftPan === index || rightPan === index ? 'bg-blue-500 text-white border-blue-600 shadow-inner' : 'bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-700 hover:border-blue-400'}`}
           >
            {w.word}
           </button>
          ))}
         </div>

         <div className="mt-6 flex justify-between gap-4">
          <div className={`flex-1 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center border border-red-200 dark:border-red-800 flex-col `}>
           <TrendingDown className="w-5 h-5 text-red-500 mx-auto mb-1" />
           <span className="text-xs font-bold text-red-700 dark:text-red-400">Negative Bias</span>
          </div>
          <button 
           onClick={() => { setLeftPan(null); setRightPan(null); }}
           className={`px-4 bg-slate-200 dark:bg-[#2a2a2a] hover:bg-slate-300 dark:hover:bg-[#333] text-slate-700 dark:text-gray-300 rounded-lg font-bold text-sm flex-col `}
          >
           Reset
          </button>
          <div className="flex-1 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-center border border-emerald-200 dark:border-emerald-800">
           <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
           <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Positive Bias</span>
          </div>
         </div>
        </div>
       </div>
      )}

      {activeMode === 'rhetoric' && (
        <div className="space-y-6">
        <div className="p-4 rounded-xl border border-purple-200 dark:border-[#2a2a2a]">
         <h3 className="font-bold text-purple-800 dark:text-white flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-purple-500" /> Device Recognition
         </h3>
         
         <div className="relative p-6 bg-slate-900 rounded-xl border-l-4 border-purple-500 mb-6 shadow-xl">
          <MessageCircle className="absolute -left-3 -top-3 w-8 h-8 text-purple-400 bg-slate-900 rounded-full border-4 border-white dark:border-[#121212]" />
          <p className="text-xl font-serif italic text-white text-center">
           "{rhetoricScenarios[rhetoricIndex].text}"
          </p>
         </div>

         <div className="flex flex-col gap-2">
          {['Personification', 'Metonymy', 'Hyperbole'].map(device => (
           <button 
            key={device}
            onClick={() => setSelectedDevice(device)}
            className={`p-3 text-sm font-bold border-2 rounded-xl transition-all ${selectedDevice === device ? (rhetoricScenarios[rhetoricIndex].device === device ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-red-500 bg-red-500 text-white') : 'border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-gray-300 hover:border-purple-500'}`}
           >
            {device}
           </button>
          ))}
         </div>
         {selectedDevice === rhetoricScenarios[rhetoricIndex].device && (
          <button 
           onClick={() => { setRhetoricIndex(p => (p + 1) % rhetoricScenarios.length); setSelectedDevice(null); }}
           className="mt-6 w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700"
          >
           Next Phrase
          </button>
         )}
        </div>
       </div>
      )}
     </div>
    </section>

    {/* Window 3: Simulation */}
    <section className={`w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative flex items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <div className="absolute inset-0 opacity-10 dark:opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#4158D1 1px, transparent 1px), linear-gradient(90deg, #4158D1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

     {activeMode === 'connotation' && (
      <div className="relative w-full max-w-sm flex flex-col items-center z-10">
       
       {/* Scale Frame */}
       <div className="w-4 h-64 bg-slate-800 dark:bg-slate-400 rounded-t-full relative z-0">
        {/* Base */}
        <div className="absolute -bottom-4 -left-16 w-36 h-4 bg-slate-800 dark:bg-slate-400 rounded-full"></div>
        
        {/* Pivot Point */}
        <div className="absolute top-4 left-1/2 -ml-3 w-6 h-6 bg-amber-500 rounded-full border-4 border-slate-800 dark:border-slate-400 z-20"></div>

        {/* The Beam (Rotates) */}
        <div 
         className="absolute top-6 left-1/2 -ml-40 w-80 h-2 bg-slate-700 dark:bg-slate-300 rounded-full transition-transform duration-700 ease-in-out origin-center z-10"
         style={{ transform: `rotate(${rotation}deg)` }}
        >
         {/* Left Pan Line & Pan */}
         <div className="absolute top-0 left-4 w-1 h-32 bg-slate-400 origin-top" style={{ transform: `rotate(${-rotation}deg)` }}>
          <div className="absolute bottom-0 -left-12 w-24 h-4 bg-slate-600 rounded-b-xl border-t border-slate-400 flex justify-center shadow-lg">
           {leftPan !== null && (
            <div className={`absolute bottom-4 px-4 py-2 text-white font-bold rounded shadow-xl text-sm whitespace-nowrap ${words[leftPan].weight > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}>
             {words[leftPan].word}
            </div>
           )}
          </div>
         </div>

         {/* Right Pan Line & Pan */}
         <div className="absolute top-0 right-4 w-1 h-32 bg-slate-400 origin-top" style={{ transform: `rotate(${-rotation}deg)` }}>
          <div className="absolute bottom-0 -left-12 w-24 h-4 bg-slate-600 rounded-b-xl border-t border-slate-400 flex justify-center shadow-lg">
           {rightPan !== null && (
            <div className={`absolute bottom-4 px-4 py-2 text-white font-bold rounded shadow-xl text-sm whitespace-nowrap ${words[rightPan].weight > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}>
             {words[rightPan].word}
            </div>
           )}
          </div>
         </div>
        </div>
       </div>
       
       <div className="mt-16 text-center font-bold tracking-widest uppercase text-slate-500 dark:text-gray-400">
        Connotation Weight Scale
       </div>
      </div>
     )}

     {activeMode === 'rhetoric' && (
      <div className="text-center opacity-30 z-10">
       <Lightbulb className="w-32 h-32 text-purple-600 dark:text-purple-400 mx-auto mb-8" />
       <h2 className="text-3xl font-black tracking-widest text-purple-900 dark:text-purple-300 uppercase">Analysis Awaiting</h2>
      </div>
     )}
    </section>
   </main>
  </div>
 );
}
