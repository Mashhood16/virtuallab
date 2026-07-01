import { useState } from 'react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8RefractionPencil({ onExit }: LabProps) {
 const [liquid, setLiquid] = useState<'none' | 'water' | 'oil'>('water');

 const liquids = {
 none: { name: 'Empty (Air)', index: 1.0, color: 'bg-transparent', bend: 0 },
 water: { name: 'Water', index: 1.33, color: 'bg-blue-400/40', bend: 12 },
 oil: { name: 'Cooking Oil', index: 1.47, color: 'bg-amber-400/40', bend: 20 }
 };

 const current = liquids[liquid];

 return (
 <div className="lg:overflow-y-auto flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Act 9.4: The Bending Pencil" subtitle="Observe refraction in different liquids" />

  <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 max-w-5xl mx-auto w-full">
  
  {/* Liquid Selection */}
  <div className="w-full md:w-64 flex flex-col gap-2">
   <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-2">Select Fluid</h3>
   {(Object.keys(liquids) as Array<keyof typeof liquids>).map(k => (
   <button 
    key={k}
    onClick={() => setLiquid(k)}
    className={`p-3 text-left rounded-lg font-bold border-2 transition-colors ${liquid === k ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] hover:bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'}`}
   >
    {liquids[k].name}
    <div className="text-xs font-normal opacity-70">Refractive Index: {liquids[k].index}</div>
   </button>
   ))}
  </div>

  <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border p-6 flex flex-col items-center justify-center relative min-h-[500px] lg:overflow-hidden">
   
   <div className="relative w-64 h-80 flex flex-col items-center justify-end mb-8">
   
   {/* The Pencil (Top Half in Air) */}
   <div className="absolute w-4 h-48 bg-yellow-400 border-x border-t border-yellow-600 rounded-t-sm origin-bottom shadow-sm z-20 transition-all duration-500"
     style={{ left: '128px', bottom: '192px', transform: 'rotate(15deg)' }}>
    {/* Eraser */}
    <div className="absolute top-0 w-full h-4 bg-pink-400 border-b border-pink-600 rounded-t-sm dark:bg-pink-500 dark:hover:bg-pink-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-pink-500/40" />
   </div>

   {/* The Glass Beaker */}
   <div className="w-48 h-48 border-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-3xl border-t-0 flex flex-col justify-end bg-slate-50 dark:bg-[#121212]/30 backdrop-blur-[2px] shadow-inner relative z-30 overflow-hidden">
    
    {/* The Pencil (Bottom Half in Liquid) */}
    {/* We clip the pencil so it only shows inside the glass, and shift it based on the refraction bend */}
    <div 
     className="absolute top-0 w-4 h-64 bg-yellow-400 border-x border-b border-yellow-600 origin-top transition-transform duration-500 z-10"
     style={{ 
     left: '96px',
     transform: `rotate(${15 - current.bend * 0.3}deg) translateX(-${current.bend}px)`
     }}
    >
     {/* Tip */}
     <div className="absolute bottom-[-16px] w-0 h-0 border-l-[8px] border-r-[8px] border-t-[16px] border-l-transparent border-r-transparent border-t-yellow-200" />
     <div className="absolute bottom-[-16px] left-[2px] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[12px] border-l-transparent border-r-transparent border-t-slate-800" />
    </div>

    {/* The Liquid Surface Line */}
    <div className={`w-full h-2 ${current.color} border-t border-white/50 backdrop-blur-sm z-20`} />
    
    {/* The Liquid Volume */}
    <div className={`w-full h-[85%] ${current.color} backdrop-blur-md z-20 transition-colors duration-500`} />
   </div>
   
   {/* Dashed line showing true position */}
   {liquid !== 'none' && (
    <div className="absolute top-[50%] left-32 w-4 h-32 border-x-2 border-dashed border-slate-300 dark:border-[#1c1b1b] rotate-[15deg] origin-top z-40 opacity-50 pointer-events-none" />
   )}

   </div>

   <div className="text-center w-full max-w-md">
   <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-[#ffffff]">Refraction</h3>
   <p className="text-slate-600 dark:text-[#a1a1aa]">
    {liquid === 'none' 
    ? "In air, light travels in a straight line, so the pencil looks straight." 
    : `Because light travels slower in ${current.name} than in air, the light rays bend at the surface. This makes the pencil appear broken or shifted.`}
   </p>
   {liquid !== 'none' && (
    <p className="text-sm text-sky-600 font-bold mt-2 animate-pulse">
    Higher Refractive Index = More Bending!
    </p>
   )}
   </div>

  </div>
  </div>
 </div>
 );
}
