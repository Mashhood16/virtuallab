import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8ConservationMass({ onExit }: LabProps) {
 const [stage, setStage] = useState<'initial' | 'mixed'>('initial');

 return (
 <div className="lg:overflow-y-auto flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans">
  <LabHeader onExit={onExit} title="Act 6.2: Conservation of Mass" subtitle="Mass remains constant before and after reaction" rightContent={<button onClick={() => setStage('initial')} className="flex items-center gap-2 bg-slate-200 dark:bg-[#121212] px-4 py-2 rounded-md font-medium hover:bg-slate-300 dark:bg-slate-700"><RefreshCw className="w-4 h-4" /> Reset</button>} />

  <div className="flex-1 flex flex-col items-center justify-center p-6">
  <div className="bg-slate-50 dark:!bg-[#121212] p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-[#1c1b1b] max-w-2xl w-full flex flex-col items-center relative min-h-[500px]">
   
   <h2 className="text-lg font-bold text-slate-700 dark:text-[#ffffff] mb-8 text-center">
   {stage === 'initial' ? 'Before Reaction (Unmixed)' : 'After Reaction (Mixed)'}
   </h2>

   <div className="relative flex flex-col items-center">
   {/* Top Platform */}
   <div className="w-64 h-4 bg-slate-300 dark:bg-[#121212] rounded-t-lg z-0" />
   
   {/* Left Flask Setup */}
   <div className="absolute bottom-4 left-6 z-10">
    <div className="w-24 h-24 border-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-[30px] rounded-t-sm relative bg-slate-50 dark:bg-[#121212]/50 overflow-hidden flex flex-col justify-end">
    <div className={`w-full transition-all duration-1000 ${stage === 'mixed' ? 'h-3/4 bg-slate-200 dark:bg-[#121212]' : 'h-1/2 bg-blue-100/80'}`}>
     {stage === 'mixed' && (
     <div className="absolute bottom-0 w-full h-1/3 bg-slate-100 dark:bg-[#121212] border-t border-slate-300 dark:border-[#1c1b1b] flex items-center justify-center text-[10px] font-bold text-slate-500 animate-fade-in">CaSO4</div>
     )}
    </div>
    </div>
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-4 border-x-4 border-slate-300 dark:border-[#1c1b1b]" />
    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-3 bg-amber-700 rounded-sm dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40" />
   </div>

   {/* Right Flask Setup */}
   <div className={`absolute bottom-4 right-6 z-20 transition-all duration-1000 origin-bottom-left ${stage === 'mixed' ? '-translate-x-14 -translate-y-16 -rotate-[120deg]' : ''}`}>
    <div className="w-24 h-24 border-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-[30px] rounded-t-sm relative bg-slate-50 dark:bg-[#121212]/50 overflow-hidden flex flex-col justify-end">
    <div className={`w-full transition-all duration-1000 bg-slate-200/80 ${stage === 'mixed' ? 'h-0' : 'h-1/2'}`} />
    </div>
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-4 border-x-4 border-slate-300 dark:border-[#1c1b1b]" />
    <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-3 bg-amber-700 rounded-sm transition-opacity duration-300 ${stage === 'mixed' ? 'opacity-0' : 'opacity-100'}`} />
   </div>

   {/* Base */}
   <div className="w-72 h-16 bg-[#121212] dark:!bg-[#121212] rounded-b-xl flex items-center justify-center shadow-xl z-20">
    {/* Digital Display */}
    <div className="bg-emerald-900 px-6 py-2 rounded border-2 border-emerald-950 font-mono text-3xl text-emerald-400 shadow-inner min-w-[150px] text-center">
    <span className={`transition-opacity duration-300 ${stage === 'mixed' ? 'animate-pulse' : ''}`}>
     145.2 g
    </span>
    </div>
   </div>
   </div>

   <div className="mt-8 text-center w-full">
   {stage === 'initial' ? (
    <>
    <div className="mb-4 p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-xl text-left max-w-md mx-auto">
     <h4 className="font-bold text-sm mb-2">Setup:</h4>
     <p className="text-xs text-slate-600 dark:text-[#a1a1aa] mb-1">• Left Flask: Sodium Sulphate (Na<sub>2</sub>SO<sub>4</sub>) solution</p>
     <p className="text-xs text-slate-600 dark:text-[#a1a1aa] mb-1">• Right Flask: Calcium Chloride (CaCl<sub>2</sub>) solution</p>
     <p className="text-xs text-slate-600 dark:text-[#a1a1aa]">• Both are sealed within the system</p>
    </div>
    <button 
     onClick={() => setStage('mixed')}
     className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 text-xl shadow-lg transition-transform active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
     Mix Flasks
    </button>
    </>
   ) : (
    <>
    <div className="bg-blue-50 border-2 border-blue-200 px-6 py-4 rounded-xl text-blue-900 animate-fade-in max-w-md mx-auto dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff]">
     <h3 className="font-bold text-lg mb-2">Mass is Conserved!</h3>
     <p className="text-sm">Even though a solid precipitate (CaSO<sub>4</sub>) formed — a chemical change — the total mass of the sealed system remains exactly <strong>145.2 g</strong>.</p>
     <div className="mt-3 text-xs text-blue-700 border-t border-blue-200 pt-2">
     <strong>Reaction:</strong> Na<sub>2</sub>SO<sub>4</sub> + CaCl<sub>2</sub> → CaSO<sub>4</sub>↓ + 2NaCl
     </div>
    </div>
    </>
   )}
   </div>

  </div>
  </div>
 </div>
 );
}
