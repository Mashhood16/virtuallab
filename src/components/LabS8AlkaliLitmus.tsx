import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8AlkaliLitmus({ onExit }: LabProps) {
 const [testedBlue, setTestedBlue] = useState<'idle'|'dipping'|'tested'>('idle');
 const [testedRed, setTestedRed] = useState<'idle'|'dipping'|'tested'>('idle');

 const reset = () => {
 setTestedBlue('idle');
 setTestedRed('idle');
 };

 const dipBlue = () => {
 setTestedBlue('dipping');
 setTimeout(() => setTestedBlue('tested'), 1000);
 };
 const dipRed = () => {
 setTestedRed('dipping');
 setTimeout(() => setTestedRed('tested'), 1000);
 };

 return (
 <div className="lg:overflow-y-auto flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Act 7.2: Effects of Alkalies on Litmus" subtitle="Test Sodium Hydroxide with litmus paper" rightContent={<button onClick={reset} className="flex items-center gap-2 bg-slate-200 dark:bg-[#121212] px-4 py-2 rounded-md font-medium hover:bg-slate-300 dark:bg-slate-700"><RefreshCw className="w-4 h-4" /> Reset</button>} />

  <div className="flex-1 flex flex-col p-6 gap-6 max-w-4xl mx-auto w-full items-center justify-center">
  
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border p-8 flex flex-col items-center justify-center relative min-h-[450px] w-full">
   
   <h2 className="text-xl font-bold mb-8 text-slate-700 dark:text-[#ffffff]">Aqueous Sodium Hydroxide (NaOH)</h2>

   <div className="relative w-64 h-64 flex flex-col items-center justify-center mb-8">
   {/* The Beaker */}
   <div className="absolute bottom-0 w-48 h-32 border-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-3xl border-t-0 bg-slate-50 dark:bg-[#121212]/50 shadow-inner z-10 flex flex-col justify-end overflow-hidden">
    <div className="w-full h-3/4 bg-blue-50/50 relative dark:bg-teal-950/20 dark:border-teal-900">
     <div className="absolute bottom-2 left-10 w-2 h-2 bg-slate-50 dark:bg-[#121212] rounded-sm" />
     <div className="absolute bottom-3 right-12 w-2 h-2 bg-slate-50 dark:bg-[#121212] rounded-sm" />
    </div>
   </div>

   {/* Litmus Papers */}
   <div className="absolute top-0 flex gap-12 w-full justify-center">
    {/* Blue Litmus */}
    <div className={`w-8 h-32 bg-blue-300 border border-blue-400 rounded-sm shadow-md transition-all duration-700 ease-out ${testedBlue === 'dipping' ? 'translate-y-20' : ''} relative overflow-hidden`}>
    <div className={`absolute bottom-0 w-full h-1/2 transition-colors duration-1000 ${testedBlue !== 'idle' ? 'bg-blue-300' : 'bg-blue-300'}`} />
    {testedBlue === 'tested' && <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[6px] font-bold text-blue-800 dark:text-[#ffffff]">STAYS BLUE</div>}
    </div>

    {/* Red Litmus */}
    <div className={`w-8 h-32 bg-red-400 border border-red-500 rounded-sm shadow-md transition-all duration-700 ease-out ${testedRed === 'dipping' ? 'translate-y-20' : ''} relative overflow-hidden`}>
    <div className={`absolute bottom-0 w-full h-1/2 transition-colors duration-1000 ${testedRed !== 'idle' ? 'bg-blue-300' : 'bg-red-400'}`} />
    {testedRed === 'tested' && <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[6px] font-bold text-blue-800 dark:text-[#ffffff]">TURNED BLUE</div>}
    </div>
   </div>
   </div>

   <div className="flex gap-6 w-full max-w-sm">
   <button 
    onClick={dipBlue}
    disabled={testedBlue !== 'idle'}
    className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
    Dip Blue Litmus
   </button>
   <button 
    onClick={dipRed}
    disabled={testedRed !== 'idle'}
    className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 disabled:opacity-50 dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"
   >
    Dip Red Litmus
   </button>
   </div>

   {(testedBlue === 'tested' || testedRed === 'tested') && (
   <div className="mt-8 px-6 py-4 bg-slate-100 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded-xl max-w-md text-center animate-fade-in">
    <h3 className="font-bold text-lg mb-2">Observation</h3>
    {testedBlue === 'tested' && <p className="mb-1 text-blue-600 font-medium">Blue Litmus stayed BLUE.</p>}
    {testedRed === 'tested' && <p className="mb-1 text-blue-600 font-medium">Red Litmus turned BLUE.</p>}
    <p className="text-sm mt-2 text-slate-600 dark:text-[#a1a1aa]">This indicates that <strong>Sodium Hydroxide</strong> is an ALKALI (Base).</p>
   </div>
   )}

  </div>
  </div>
 </div>
 );
}
