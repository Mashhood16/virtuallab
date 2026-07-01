import { useState } from 'react';
import { Activity, HeartPulse } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS7MakeStethoscope({ onExit }: LabProps) {
 const [listening, setListening] = useState(false);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Unit 11: Make a Stethoscope" />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-w-2xl w-full text-center mb-8">
   <h2 className="text-2xl font-bold text-blue-800 mb-4 dark:text-[#ffffff]">Amplifying Sound</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">A homemade stethoscope is built using two funnels and a plastic tube. A balloon is stretched over the large funnel to act as a diaphragm, picking up vibrations from the heartbeat and channeling them up the tube to the ear.</p>
   
   <div className="flex justify-center gap-4">
   <button 
    onMouseDown={() => setListening(true)}
    onMouseUp={() => setListening(false)}
    onMouseLeave={() => setListening(false)}
    className="flex items-center px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-bold active:scale-95 transition-transform shadow-md dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-rose-500/40"
   >
    <HeartPulse className="w-5 h-5 mr-2" />
    Hold Against Chest
   </button>
   </div>
  </div>

  <div className="flex gap-16 items-center mt-12 w-full max-w-5xl">
   
   {/* Human Chest */}
   <div className="relative w-64 h-80 bg-orange-200 rounded-[40px] shadow-inner border-8 border-orange-300 flex justify-center overflow-hidden">
    <div className="absolute top-24 w-16 h-16">
     {/* Internal Heart (Always beating, but sound is muffled) */}
     <HeartPulse className="w-full h-full text-rose-500 opacity-50 animate-pulse" />
    </div>

    {/* The Stethoscope funnel placed on chest */}
    <div className={`absolute top-20 transition-all duration-300 ${listening ? 'scale-100 opacity-100' : 'scale-150 opacity-0 pointer-events-none'}`}>
     <div className="w-24 h-12 bg-blue-500 rounded-t-full border-4 border-blue-600 relative z-10 flex justify-center dark:bg-teal-950/20 dark:border-teal-900">
     <div className="absolute -top-1 w-8 h-4 bg-slate-300 dark:bg-[#121212]"></div>
     </div>
     <div className="w-24 h-2 bg-yellow-400 border border-yellow-500 shadow-sm relative z-20"></div> {/* Balloon diaphragm */}
     
     {/* Sound waves entering */}
     {listening && (
     <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-32 h-32 border-4 border-rose-400 rounded-full animate-ping opacity-50"></div>
     </div>
     )}
    </div>
   </div>

   {/* The Tube (Connecting them visually) */}
   <div className="flex-1 h-32 relative">
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M 0 50 Q 50 -20, 100 50" fill="none" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
    </svg>
    {listening && (
    <div className="absolute inset-0 flex items-center justify-center">
     <Activity className="w-12 h-12 text-rose-500 animate-pulse" />
    </div>
    )}
   </div>

   {/* The Ear */}
   <div className="relative w-48 h-64 bg-orange-200 rounded-l-[100px] border-8 border-r-0 border-orange-300 flex items-center overflow-hidden">
    {/* Earpiece funnel */}
    <div className={`absolute -left-4 transition-all duration-300 ${listening ? 'scale-100 opacity-100' : 'translate-x-12 opacity-0'}`}>
    <div className="w-8 h-8 bg-slate-300 dark:bg-[#121212]"></div>
    <div className="w-16 h-24 bg-blue-500 rounded-l-full border-4 border-blue-600 -mt-8 dark:bg-teal-950/20 dark:border-teal-900"></div>
    </div>
    
    {/* Sound visualizer inside ear */}
    <div className="ml-16 w-24 h-24 bg-[#000000] dark:bg-[#121212] rounded-full flex items-center justify-center overflow-hidden shadow-inner">
     {listening ? (
     <div className="flex gap-1 items-end h-16 w-16">
      <div className="w-full bg-rose-500 animate-[pulse_0.8s_ease-in-out_infinite] dark:bg-[#121212] dark:border-[#1c1b1b]" style={{ height: '40%' }}></div>
      <div className="w-full bg-rose-500 animate-[pulse_0.8s_ease-in-out_infinite] dark:bg-[#121212] dark:border-[#1c1b1b]" style={{ height: '100%' }}></div>
      <div className="w-full bg-rose-500 animate-[pulse_0.8s_ease-in-out_infinite] dark:bg-[#121212] dark:border-[#1c1b1b]" style={{ height: '60%' }}></div>
      <div className="w-full bg-rose-500 animate-[pulse_0.8s_ease-in-out_infinite] dark:bg-[#121212] dark:border-[#1c1b1b]" style={{ height: '80%' }}></div>
     </div>
     ) : (
     <div className="text-slate-700 dark:text-[#ffffff] text-xs font-bold uppercase">No Signal</div>
     )}
    </div>
   </div>

  </div>
  </div>
 </div>
 );
}
