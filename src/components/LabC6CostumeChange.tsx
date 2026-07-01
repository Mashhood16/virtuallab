import { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabC6CostumeChange({ onExit }: LabProps) {
 const [costume, setCostume] = useState<'flying' | 'standing'>('flying');
 const [pressedKey, setPressedKey] = useState<string | null>(null);

 useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
  setPressedKey(e.key.toLowerCase());
  if (e.key.toLowerCase() === 'c') {
  setCostume(prev => prev === 'flying' ? 'standing' : 'flying');
  }
 };

 const handleKeyUp = () => {
  setPressedKey(null);
 };

 window.addEventListener('keydown', handleKeyDown);
 window.addEventListener('keyup', handleKeyUp);
 return () => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
 };
 }, []);

 return (
 <div className="flex flex-col h-screen font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Costume Change Event" />
  <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">
  

  <p className="text-slate-600 dark:text-[#a1a1aa] mb-8">Press the 'c' key on your keyboard to trigger the event and change the Rocket's costume.</p>

  <div className="flex gap-8 flex-1">
   {/* Blocks Editor (Mock) */}
   <div className="w-80 bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow-hidden">
   <div className="bg-amber-500 text-white font-bold p-3 text-sm dark:bg-[#121212] dark:border-[#1c1b1b]">Events & Looks</div>
   <div className="flex-1 p-6 flex flex-col gap-2 bg-slate-50 dark:bg-[#121212]/50">
    
    <div className="bg-amber-400 rounded-lg shadow-sm border border-amber-500 dark:border-amber-400 p-4 w-full text-amber-900 dark:text-slate-900 font-bold text-sm rounded-b-none pb-6 relative z-10 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40">
    <div className="absolute top-0 left-4 w-12 h-3 bg-amber-500 rounded-b-full dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"></div>
    when [ c ] key pressed
    </div>
    <div className="bg-indigo-500 rounded-lg shadow-sm border border-indigo-600 dark:border-indigo-500 p-4 w-full text-white font-bold text-sm -mt-4 relative z-20 ml-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
    next costume
    </div>

    <div className={`mt-12 p-4 rounded-xl border-2 text-center transition-colors font-bold ${pressedKey === 'c' ? 'bg-amber-100 dark:bg-amber-900 border-amber-400 dark:border-amber-500 text-amber-900 dark:text-amber-100' : 'bg-amber-50 dark:bg-amber-900/50 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'}`}>
    {pressedKey === 'c' ? 'Event Triggered!' : "Waiting for 'c' key..."}
    </div>

   </div>
   </div>

   {/* Stage Area */}
   <div className="flex-1 flex flex-col">
   <div className="bg-slate-50 dark:!bg-[#121212] rounded-t-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] border-b-0 p-3 flex justify-between items-center bg-slate-100 dark:!bg-[#121212]">
    <span className="font-bold text-sm text-slate-600 dark:text-[#a1a1aa]">Scratch Stage</span>
    <span className="font-bold text-xs text-slate-500 dark:text-[#71717a]">Current Costume: {costume}</span>
   </div>
   
   <div className="bg-slate-50 dark:!bg-[#121212] flex-1 rounded-b-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative overflow-hidden flex items-center justify-center">
    
    <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-indigo-900">
    {/* Stars */}
    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(1.5px 1.5px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 140px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0))', backgroundSize: '200px 200px' }} />
    </div>

    {/* Sprite (Rocket) */}
    <div className="relative transform scale-150 transition-all duration-300">
    {costume === 'flying' ? (
     <div className="flex flex-col items-center animate-bounce">
     <Rocket className="w-24 h-24 text-white" fill="#ef4444" strokeWidth={1} />
     {/* Engine Fire */}
     <div className="w-4 h-12 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full blur-sm mt-1 animate-pulse" />
     </div>
    ) : (
     <div className="flex flex-col items-center">
     <Rocket className="w-24 h-24 text-white" fill="#ef4444" strokeWidth={1} />
     {/* Landing Legs */}
     <div className="flex gap-8 -mt-4">
      <div className="w-2 h-16 bg-slate-400 dark:bg-[#121212] transform -rotate-45 rounded-full" />
      <div className="w-2 h-16 bg-slate-400 dark:bg-[#121212] transform rotate-45 rounded-full" />
     </div>
     </div>
    )}
    </div>

   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
