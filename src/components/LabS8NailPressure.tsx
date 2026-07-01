import { useState } from 'react';
import {Hammer } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8NailPressure({ onExit }: LabProps) {
 const [orientation, setOrientation] = useState<'pointed' | 'flat'>('pointed');
 const [hits, setHits] = useState(0);

 const reset = () => setHits(0);

 const handleHit = () => {
 if (hits < 3) setHits(h => h + 1);
 };

 return (
 <div className="lg:overflow-y-auto flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Act 8.1: Force & Pressure" subtitle="Pushing a nail into wood" />

  <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 max-w-5xl mx-auto w-full">
  
  {/* Selection */}
  <div className="w-full md:w-64 flex flex-col gap-2">
   <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-2">Nail Orientation</h3>
   <button 
   onClick={() => { setOrientation('pointed'); reset(); }}
   className={`p-3 text-left rounded-lg font-bold border-2 transition-colors ${orientation === 'pointed' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] hover:bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'}`}
   >
   Pointed End Down
   </button>
   <button 
   onClick={() => { setOrientation('flat'); reset(); }}
   className={`p-3 text-left rounded-lg font-bold border-2 transition-colors ${orientation === 'flat' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] hover:bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'}`}
   >
   Flat Head Down
   </button>
  </div>

  <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border p-6 flex flex-col items-center justify-center relative min-h-[400px]">
   
   <div className="relative w-64 h-64 flex flex-col items-center justify-end mb-12">
   
   {/* Hammer Animation Layer */}
   {hits > 0 && hits < 4 && (
    <div 
    key={hits} 
    className="absolute right-8 z-30 animate-[strike_0.3s_ease-out]"
    style={{ bottom: `${orientation === 'pointed' ? 210 - (hits-1) * 20 : 210}px` }}
    >
    <div className="w-20 h-4 bg-amber-800 rounded-l-full rotate-45 origin-bottom-left flex items-center justify-end">
     <div className="w-12 h-8 bg-slate-600 dark:bg-[#121212] rounded-sm translate-x-4 -rotate-45" />
    </div>
    </div>
   )}

   {/* The Nail */}
   <div className={`absolute z-20 flex flex-col items-center transition-all duration-500 ${orientation === 'flat' ? 'rotate-180' : ''}`}
     style={{ bottom: `${orientation === 'pointed' ? 96 - hits * 20 : 96}px` }}
   >
    {/* Head */}
    <div className="w-12 h-2 bg-slate-400 dark:bg-[#121212] rounded-sm" />
    {/* Body */}
    <div className="w-4 h-24 bg-slate-300 dark:bg-[#121212]" />
    {/* Point */}
    <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[16px] border-l-transparent border-r-transparent border-t-slate-300" />
   </div>

   {/* The Wood */}
   <div className="w-64 h-24 bg-amber-700 border-t-4 border-amber-800 rounded-sm shadow-xl z-10 flex flex-col overflow-hidden relative" style={{marginTop: '100px'}}>
    <div className="w-full h-px bg-amber-900/30 mt-4" />
    <div className="w-full h-px bg-amber-900/30 mt-4" />
    <div className="w-full h-px bg-amber-900/30 mt-4" />
    <div className="w-full h-px bg-amber-900/30 mt-4" />
   </div>

   </div>

   <div className="text-center w-full max-w-sm">
   <button 
    onClick={handleHit}
    disabled={hits >= 3}
    className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 text-xl shadow-lg flex justify-center items-center gap-3 transition-transform active:scale-95 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
    <Hammer className="w-6 h-6" /> Hit with Hammer
   </button>

   {hits >= 3 && (
    <div className={`mt-6 px-6 py-4 rounded-xl border-2 animate-fade-in ${orientation === 'pointed' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
    <h3 className="font-bold text-lg mb-1">{orientation === 'pointed' ? 'Success!' : 'Failed!'}</h3>
    <p className="text-sm">
     {orientation === 'pointed' 
     ? "The pointed end has a SMALL area. Force over a small area creates HIGH PRESSURE, driving it into the wood." 
     : "The flat head has a LARGE area. Force over a large area creates LOW PRESSURE, so it doesn't penetrate."}
    </p>
    </div>
   )}
   </div>

  </div>
  </div>
  <style dangerouslySetInnerHTML={{__html: `
  @keyframes strike {
   0% { transform: rotate(-45deg); }
   50% { transform: rotate(10deg); }
   100% { transform: rotate(-45deg); }
  }
  `}} />
 </div>
 );
}
