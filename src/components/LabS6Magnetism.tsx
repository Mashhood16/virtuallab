import { useState } from 'react';
import { Compass } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS6Magnetism({ onExit }: LabProps) {
 const [view, setView] = useState<'field' | 'alignment'>('field');

 return (
 <div className="lg:overflow-y-auto flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans">
  <LabHeader onExit={onExit} title="Unit 10: Magnetism" />

  <div className="flex-1 flex flex-col p-6 items-center">
  
  <div className="flex gap-4 mb-6">
   <button 
   onClick={() => setView('field')}
   className={`px-6 py-2 rounded font-bold border-2 ${view === 'field' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-red-300'}`}
   >
   Activity 10.1: Magnetic Field Lines
   </button>
   <button 
   onClick={() => setView('alignment')}
   className={`px-6 py-2 rounded font-bold border-2 ${view === 'alignment' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-blue-300'}`}
   >
   Activity 10.3: Natural Pole Alignment
   </button>
  </div>

  {view === 'field' && (
   <div className="w-full max-w-4xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8 flex flex-col items-center relative overflow-hidden">
   <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-[#ffffff]">Plotting Magnetic Fields</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-12 max-w-xl text-center">Iron filings or plotting compasses align with the invisible magnetic field lines. Notice how lines always emerge from the North pole and curve towards the South pole.</p>
   
   <div className="relative w-[600px] h-[400px] flex items-center justify-center">
    
    {/* Field Lines Visualization using SVG */}
    <svg className="absolute w-full h-full opacity-30" viewBox="0 0 600 400">
    {/* Top curves */}
    <path d="M 200 200 C 200 50, 400 50, 400 200" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
    <path d="M 180 200 C 180 -50, 420 -50, 420 200" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
    {/* Bottom curves */}
    <path d="M 200 200 C 200 350, 400 350, 400 200" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
    <path d="M 180 200 C 180 450, 420 450, 420 200" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
    {/* Side radiating lines */}
    <path d="M 150 200 L 0 200" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
    <path d="M 150 180 L 50 100" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
    <path d="M 150 220 L 50 300" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
    
    <path d="M 450 200 L 600 200" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
    <path d="M 450 180 L 550 100" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
    <path d="M 450 220 L 550 300" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
    </svg>

    {/* The Bar Magnet */}
    <div className="flex w-64 h-16 shadow-lg relative z-10 rounded overflow-hidden border-2 border-[#1c1b1b] dark:border-[#1c1b1b]">
    <div className="flex-1 bg-red-600 flex items-center justify-center text-white font-bold text-2xl">N</div>
    <div className="flex-1 bg-blue-600 flex items-center justify-center text-white font-bold text-2xl">S</div>
    </div>

    {/* Compasses acting as indicators */}
    <div className="absolute top-[80px] left-[300px] -translate-x-1/2 -translate-y-1/2 bg-slate-50 dark:bg-[#121212] rounded-full p-1 shadow-md border border-slate-200 dark:border-[#1c1b1b]">
    <Compass className="w-8 h-8 text-slate-800 dark:text-[#ffffff] rotate-90" />
    </div>
    <div className="absolute bottom-[80px] left-[300px] -translate-x-1/2 translate-y-1/2 bg-slate-50 dark:bg-[#121212] rounded-full p-1 shadow-md border border-slate-200 dark:border-[#1c1b1b]">
    <Compass className="w-8 h-8 text-slate-800 dark:text-[#ffffff] -rotate-90" />
    </div>
    <div className="absolute top-[200px] left-[100px] -translate-x-1/2 -translate-y-1/2 bg-slate-50 dark:bg-[#121212] rounded-full p-1 shadow-md border border-slate-200 dark:border-[#1c1b1b]">
    <Compass className="w-8 h-8 text-slate-800 dark:text-[#ffffff] rotate-180" />
    </div>
    <div className="absolute top-[200px] right-[100px] translate-x-1/2 -translate-y-1/2 bg-slate-50 dark:bg-[#121212] rounded-full p-1 shadow-md border border-slate-200 dark:border-[#1c1b1b]">
    <Compass className="w-8 h-8 text-slate-800 dark:text-[#ffffff]" />
    </div>
   </div>
   </div>
  )}

  {view === 'alignment' && (
   <div className="w-full max-w-4xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8 flex flex-col items-center">
   <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-[#ffffff]">Earth's Magnetic Alignment</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-12 max-w-xl text-center">A freely suspended bar magnet will always come to rest aligning itself with the Earth's geographic North-South axis.</p>
   
   <div className="relative w-96 h-96 border-4 border-slate-200 dark:border-[#1c1b1b] rounded-full bg-slate-50 dark:bg-[#121212] flex items-center justify-center overflow-hidden">
    {/* Compass directions */}
    <div className="absolute top-4 font-bold text-red-600">Earth North</div>
    <div className="absolute bottom-4 font-bold text-blue-600">Earth South</div>
    <div className="absolute left-4 font-bold text-slate-400 rotate-[-90deg]">West</div>
    <div className="absolute right-4 font-bold text-slate-400 rotate-90">East</div>

    {/* Stand */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-800 z-20"></div>
    
    {/* Thread */}
    <div className="absolute top-1/2 left-1/2 w-1 h-32 bg-slate-300 dark:bg-[#121212] origin-top -rotate-[20deg] z-10 animate-[swing_4s_ease-in-out_infinite_alternate]">
    {/* Suspended Magnet */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-32 flex flex-col shadow-lg border-2 border-[#1c1b1b] dark:border-[#1c1b1b] rounded">
     <div className="flex-1 bg-red-600 flex items-center justify-center text-white font-bold text-sm">N</div>
     <div className="flex-1 bg-blue-600 flex items-center justify-center text-white font-bold text-sm">S</div>
    </div>
    </div>

   </div>
   </div>
  )}

  </div>
  
  <style dangerouslySetInnerHTML={{__html: `
  @keyframes swing {
   0% { transform: rotate(-30deg); }
   100% { transform: rotate(10deg); }
  }
  `}} />
 </div>
 );
}
