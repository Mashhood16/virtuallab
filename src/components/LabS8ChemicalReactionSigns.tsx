import { useState } from 'react';
import { } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

const EXPERIMENTS = [
 { id: 'iodine', name: 'Iodine + Starch', resultType: 'Color Change', initialColor: 'bg-amber-100', finalColor: 'bg-blue-900', dropsColor: 'bg-amber-800' },
 { id: 'precipitate', name: 'CuSO4 + NaOH', resultType: 'Precipitate', initialColor: 'bg-blue-200', finalColor: 'bg-blue-200', dropsColor: 'bg-slate-100 dark:bg-[#121212]', hasPrecipitate: true },
 { id: 'gas', name: 'Vinegar + Baking Soda', resultType: 'Gas Evolution', initialColor: 'bg-slate-100 dark:bg-[#121212]', finalColor: 'bg-slate-100 dark:bg-[#121212]', dropsColor: 'bg-slate-50 dark:bg-[#121212]', hasBubbles: true },
];

export default function LabS8ChemicalReactionSigns({ onExit }: LabProps) {
 const [selectedExp, setSelectedExp] = useState(EXPERIMENTS[0]);
 const [stage, setStage] = useState<'initial' | 'adding' | 'final'>('initial');

 const handleMix = () => {
 setStage('adding');
 setTimeout(() => setStage('final'), 1000);
 };

 const reset = () => setStage('initial');

 return (
 <div className="lg:overflow-y-auto flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans">
  <LabHeader onExit={onExit} title="Act 6.1: Signs of Chemical Reaction" subtitle="Observe color changes, precipitates, and gas" />

  <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
  <div className="w-full md:w-64 flex flex-col gap-2">
   <h3 className="font-bold mb-2" style={{color: 'rgb(var(--slate-700))'}}>Select Experiment</h3>
   {EXPERIMENTS.map(e => (
   <button 
    key={e.id}
    onClick={() => { setSelectedExp(e); reset(); }}
    className={`p-3 text-left rounded-lg font-bold border-2 ${selectedExp.id === e.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] hover:border-slate-300 dark:border-[#1c1b1b]'}`}
   >
    {e.name}
   </button>
   ))}
  </div>

  <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center relative min-h-[400px]">
   
   <div className="relative w-64 h-80 flex flex-col justify-end items-center">
   {/* Pipette / Dropper */}
   <div className={`absolute top-0 right-10 flex flex-col items-center transition-transform duration-500 ${stage === 'adding' ? 'translate-y-4' : '-translate-y-10 opacity-0'}`}>
    <div className="w-6 h-16 bg-slate-200 dark:bg-[#121212] rounded-full rounded-b-none border-x-2 border-t-2 border-slate-300 dark:border-[#1c1b1b]" />
    <div className="w-2 h-10 bg-slate-300 dark:bg-[#121212] border-x border-slate-400 dark:border-[#1c1b1b]" />
    {stage === 'adding' && (
    <div className="absolute top-28 flex flex-col gap-2">
     <div className={`w-3 h-3 rounded-full ${selectedExp.dropsColor} animate-[fall_0.3s_ease-in_infinite]`} />
     <div className={`w-2 h-2 rounded-full ${selectedExp.dropsColor} animate-[fall_0.3s_ease-in_infinite_0.1s]`} />
    </div>
    )}
   </div>

   {/* */}
   <div className="w-48 h-48 border-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-3xl border-t-0 relative overflow-hidden bg-slate-50 dark:bg-[#121212]/50 backdrop-blur-sm z-10 shadow-inner flex flex-col justify-end">
    <div 
    className={`w-full transition-colors duration-1000 ${stage === 'final' ? selectedExp.finalColor : selectedExp.initialColor} h-3/4 relative overflow-hidden`}
    >
    {/* Precipitate */}
    {selectedExp.hasPrecipitate && stage === 'final' && (
     <div className="absolute bottom-0 w-full h-8 bg-blue-500 animate-[rise_2s_ease-out_reverse] opacity-80 mix-blend-multiply flex items-center justify-center text-xs text-white dark:bg-teal-950/20 dark:border-teal-900">
     Solid Precipitate
     </div>
    )}
    
    {/* Bubbles */}
    {selectedExp.hasBubbles && stage === 'final' && (
     <div className="absolute inset-0">
     {Array.from({length: 15}).map((_, i) => (
      <div key={i} className="absolute w-2 h-2 rounded-full border border-white/80 bg-slate-50 dark:bg-[#121212]/20 animate-[rise_1s_infinite]" style={{ left: `${Math.random() * 90}%`, animationDelay: `${Math.random() * 2}s` }} />
     ))}
     </div>
    )}
    </div>
   </div>
   </div>

   <div className="mt-8 text-center flex gap-4">
   <button onClick={handleMix} disabled={stage !== 'initial'} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
    Mix Reactants
   </button>
   <button onClick={reset} className="bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] px-6 py-2 rounded-lg font-bold hover:bg-slate-300 dark:bg-[#121212]">
    Reset
   </button>
   </div>

   {stage === 'final' && (
   <div className="mt-6 px-6 py-4 rounded-xl bg-indigo-50 border-indigo-200 border text-indigo-800 text-center animate-fade-in max-w-sm dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff]">
    <h3 className="font-bold mb-1">Sign Observed: {selectedExp.resultType}</h3>
    <p className="text-sm">
    This physical change indicates that a chemical reaction has taken place, forming new substances!
    </p>
   </div>
   )}
  </div>
  </div>
  <style dangerouslySetInnerHTML={{__html: `
  @keyframes fall { from { transform: translateY(0); opacity: 1; } to { transform: translateY(50px); opacity: 0; } }
  @keyframes rise { from { transform: translateY(100%); } to { transform: translateY(0); } }
  `}} />
 </div>
 );
}
