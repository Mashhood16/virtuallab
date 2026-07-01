import { useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowLeft, FastForward, Car, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabE12AdjectivesAdverbs({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [speedSlider, setSpeedSlider] = useState(50);
 const [frequencySlider, setFrequencySlider] = useState(50);
 
 const [adjectiveMode, setAdjectiveMode] = useState<'descriptive' | 'quantitative'>('descriptive');
 const [selectedAdj, setSelectedAdj] = useState<string | null>(null);
 const adjTarget = adjectiveMode === 'descriptive' ? 'red' : 'three';
 const adjSentence = adjectiveMode === 'descriptive' 
  ? "The [red] car raced down the track." 
  : "I saw [three] cars on the track.";

 // Derived values for the simulation
 const speedText = speedSlider < 30 ? 'slowly' : speedSlider > 70 ? 'rapidly' : 'steadily';
 const freqText = frequencySlider < 30 ? 'rarely' : frequencySlider > 70 ? 'frequently' : 'sometimes';
 
 const baseDuration = 5; // seconds to cross screen
 const speedMultiplier = speedSlider / 50; // 0.1 to 2.0
 const currentDuration = Math.max(0.5, baseDuration / (speedMultiplier || 0.1));

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="Modifier Engine Lab" />

   
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
       <strong>Modifiers</strong> are words, phrases, or clauses that provide description in sentences. The two primary types of single-word modifiers are Adjectives and Adverbs.
      </p>
      
      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">Adjective Taxonomy</h4>
      <p className="mt-2">Adjectives modify nouns and pronouns. They answer questions like <em>"Which one?"</em>, <em>"What kind?"</em>, or <em>"How many?"</em></p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>Descriptive:</strong> Provides detail about physical or abstract qualities (e.g., The <em>red</em> car).</li>
       <li><strong>Quantitative:</strong> Indicates exact or approximate amounts (e.g., <em>Three</em> cars, <em>Many</em> people).</li>
       <li><strong>Demonstrative:</strong> Points to specific nouns (e.g., <em>This</em> car, <em>Those</em> buildings).</li>
       <li><strong>Possessive:</strong> Shows ownership (e.g., <em>My</em> car, <em>Her</em> book).</li>
      </ul>

      <hr className="my-6 border-slate-200 dark:border-gray-800" />

      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">Adverbial Vectors</h4>
      <p className="mt-2">
       Adverbs modify verbs, adjectives, or other adverbs. They dictate the "physics" of a sentence's action.
      </p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>Manner:</strong> How an action happens (e.g., The car drives <em>slowly</em> or <em>rapidly</em>).</li>
       <li><strong>Frequency:</strong> How often an action happens (e.g., The car <em>rarely</em> or <em>frequently</em> drives by).</li>
       <li><strong>Degree:</strong> The intensity of the modifier (e.g., <em>Very</em> fast, <em>Somewhat</em> tired).</li>
      </ul>
     </div>
    </section>

    {/* Window 2: Controls */}
    <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
      <SlidersHorizontal className="text-[#4158D1]" /> Syntactic Equalizer
     </h2>

     <div className="flex-1 overflow-y-auto space-y-8">
      {/* Adverb Sliders */}
      <div className={`w-full p-5 rounded-2xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
       <h3 className="font-bold text-slate-800 dark:text-white mb-4">Adverbial Injection</h3>
       
       <div className="space-y-6">
        <div>
         <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-gray-400 mb-2 uppercase">
          <span>Adverb of Manner</span>
          <span className="text-[#4158D1]">{speedText}</span>
         </div>
         <input 
          type="range" min="10" max="100" value={speedSlider} 
          onChange={e => setSpeedSlider(Number(e.target.value))}
          className="w-full accent-[#4158D1]"
         />
         <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Slowly</span>
          <span>Rapidly</span>
         </div>
        </div>

        <div>
         <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-gray-400 mb-2 uppercase">
          <span>Adverb of Frequency</span>
          <span className="text-purple-500">{freqText}</span>
         </div>
         <input 
          type="range" min="10" max="100" value={frequencySlider} 
          onChange={e => setFrequencySlider(Number(e.target.value))}
          className="w-full accent-purple-500"
         />
         <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Rarely</span>
          <span>Frequently</span>
         </div>
        </div>
       </div>

       <div className={`mt-6 p-4 rounded-lg bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-gray-800 flex-col `}>
        <p className="text-sm font-medium dark:text-gray-300">
         The car <span className="font-bold text-purple-500">{freqText}</span> drives <span className="font-bold text-[#4158D1]">{speedText}</span> across the track.
        </p>
       </div>
      </div>

      {/* Adjective Classifier */}
      <div className={`p-5 rounded-2xl border border-slate-200 dark:border-[#2a2a2a] flex-col `}>
       <h3 className="font-bold text-slate-800 dark:text-white mb-4">Adjective Taxonomy</h3>
       <div className="flex gap-2 mb-4">
        <button onClick={() => { setAdjectiveMode('descriptive'); setSelectedAdj(null); }} className={`flex-1 py-1.5 text-xs font-bold rounded ${adjectiveMode === 'descriptive' ? 'bg-[#4158D1] text-white' : 'bg-slate-100 text-slate-600 dark:bg-[#2a2a2a] dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Descriptive</button>
        <button onClick={() => { setAdjectiveMode('quantitative'); setSelectedAdj(null); }} className={`flex-1 py-1.5 text-xs font-bold rounded ${adjectiveMode === 'quantitative' ? 'bg-[#4158D1] text-white' : 'bg-slate-100 text-slate-600 dark:bg-[#2a2a2a] dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Quantitative</button>
       </div>
       
       <p className="text-lg font-medium text-center py-3 bg-slate-50 dark:bg-[#1a1a1a] rounded-lg border border-slate-200 dark:border-gray-800 mb-4 dark:text-white">
        {adjSentence}
       </p>

       <div className="grid grid-cols-2 gap-2">
        {['Descriptive', 'Quantitative', 'Demonstrative', 'Possessive'].map(type => (
         <button 
          key={type}
          onClick={() => setSelectedAdj(type)}
          className={`p-2 text-sm font-bold rounded-lg border ${selectedAdj === type ? (adjectiveMode.toLowerCase() === type.toLowerCase() ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-red-500 text-white border-red-500') : 'bg-slate-50 dark:bg-[#1a1a1a] border-slate-300 dark:border-gray-700 dark:text-gray-300'}`}
         >
          {type}
         </button>
        ))}
       </div>
      </div>
     </div>
    </section>

    {/* Window 3: Simulation */}
    <section className={`bg-slate-100 dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative flex items-center justify-center p-8 overflow-hidden min-h-[500px] `}>
     <div className="absolute inset-0 opacity-10 dark:opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#4158D1 1px, transparent 1px), linear-gradient(90deg, #4158D1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
     
     {/* The Track */}
     <div className="absolute top-1/2 left-0 right-0 h-32 -mt-16 bg-slate-800 dark:bg-[#111] border-y-4 border-slate-400 dark:border-[#333] flex items-center shadow-2xl">
      {/* Dashed line */}
      <div className="w-full h-2 border-t-4 border-dashed border-yellow-500" />

      {/* The Cars */}
      {Array.from({ length: adjectiveMode === 'quantitative' ? 3 : 1 }).map((_, i) => (
       <div 
        key={i}
        className="absolute left-[-100px]"
        style={{
         animation: `drive ${currentDuration}s linear infinite`,
         animationDelay: `${i * 0.5}s`,
         opacity: (Math.random() * 100) < frequencySlider ? 1 : 0.1
        }}
       >
        <Car className={`w-24 h-24 ${adjectiveMode === 'descriptive' ? 'text-red-500' : 'text-blue-500'}`} />
       </div>
      ))}
     </div>

     <style>{`
      @keyframes drive {
       from { transform: translateX(-100px); }
       to { transform: translateX(1200px); }
      }
     `}</style>
    </section>
   </main>
  </div>
 );
}
