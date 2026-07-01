import { useState, useRef } from 'react';
import {Hand } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8HydraulicElevator({ onExit }: LabProps) {
 const [pushed, setPushed] = useState(0); // 0 to 100
 const isDragging = useRef(false);

 const handlePointerDown = () => { isDragging.current = true; };
 const handlePointerUp = () => { isDragging.current = false; };
 
 const handlePointerMove = (e: React.PointerEvent) => {
 if (!isDragging.current) return;
 setPushed(p => Math.min(100, Math.max(0, p + e.movementY)));
 };

 // Big syringe area = 20ml, Small syringe = 10ml
 // So small moving down 1 unit moves big up 0.5 units
 const elevatorLift = pushed * 0.5;

 return (
 <div 
  className="lg:overflow-y-auto flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans select-none"
  onPointerUp={handlePointerUp}
  onPointerLeave={handlePointerUp}
  onPointerMove={handlePointerMove}
 >
  <LabHeader onExit={onExit} title="Act 8.2: Hydraulic Elevator" subtitle="Fluid pressure multiplies force" />

  <div className="flex-1 flex flex-col p-6 gap-6 max-w-4xl mx-auto w-full">
  
  <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border p-6 flex flex-col items-center justify-center relative min-h-[500px] lg:overflow-hidden">
   
   <p className="absolute top-6 text-slate-500 dark:text-[#71717a] flex items-center gap-2 font-bold animate-pulse">
   <Hand className="w-5 h-5 text-blue-500" />
   Drag the small syringe plunger DOWN
   </p>

   <div className="relative w-[500px] h-80 flex items-end">
   
   {/* Small Syringe (Left, 10ml) */}
   <div className="absolute left-10 bottom-0 flex flex-col items-center">
    
    {/* Plunger Handle */}
    <div 
    className="w-12 h-4 bg-[#121212] dark:bg-[#121212] rounded-sm cursor-ns-resize z-30"
    style={{ transform: `translateY(${pushed}px)` }}
    onPointerDown={handlePointerDown}
    >
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-32 bg-slate-700 dark:bg-[#121212] -z-10" />
    {/* Rubber stopper */}
    <div className="absolute top-32 left-1/2 -translate-x-1/2 w-10 h-4 bg-[#000000] dark:bg-[#121212] rounded-b-sm" />
    </div>

    {/* Syringe Body */}
    <div className="w-12 h-40 border-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-md border-t-0 bg-slate-50 dark:bg-[#121212]/50 backdrop-blur-sm z-20 flex flex-col justify-end overflow-hidden mt-32">
    {/* Fluid */}
    <div className="w-full bg-cyan-500/80 transition-all duration-75" style={{ height: `${100 - pushed}%` }} />
    </div>
    <div className="w-4 h-8 bg-cyan-500/80 border-x-4 border-slate-300 dark:border-[#1c1b1b] z-10" />
   </div>

   {/* Connecting Tube */}
   <div className="absolute left-16 bottom-0 w-80 h-4 bg-cyan-500/80 border-y-4 border-slate-300 dark:border-[#1c1b1b] z-0" />

   {/* Large Syringe (Right, 20ml) */}
   <div className="absolute right-10 bottom-0 flex flex-col items-center">
    
    {/* Car on Platform */}
    <div 
    className="absolute z-30 flex flex-col items-center transition-all duration-75"
    style={{ bottom: `${160 + elevatorLift}px` }}
    >
    <div className="w-24 h-12 bg-red-500 rounded-t-2xl rounded-b-md flex justify-center items-end pb-1 border-b-4 border-[#1c1b1b] dark:border-[#1c1b1b] shadow-xl relative">
     <div className="absolute -bottom-3 left-2 w-6 h-6 bg-[#000000] dark:bg-[#121212] rounded-full border-2 border-slate-400 dark:border-[#1c1b1b]" />
     <div className="absolute -bottom-3 right-2 w-6 h-6 bg-[#000000] dark:bg-[#121212] rounded-full border-2 border-slate-400 dark:border-[#1c1b1b]" />
    </div>
    {/* Platform */}
    <div className="w-32 h-2 bg-slate-700 dark:bg-[#121212] mt-2 rounded-sm" />
    </div>

    {/* Plunger / Elevator shaft */}
    <div className="w-16 h-40 bg-slate-700 dark:bg-[#121212] z-10 transition-all duration-75 absolute" style={{ bottom: `${10 + elevatorLift}px` }}>
     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-[#000000] dark:bg-[#121212] rounded-b-sm" />
    </div>

    {/* Syringe Body */}
    <div className="w-24 h-40 border-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-md border-t-0 bg-slate-50 dark:bg-[#121212]/50 backdrop-blur-sm z-20 flex flex-col justify-end overflow-hidden">
    {/* Fluid */}
    <div className="w-full bg-cyan-500/80 transition-all duration-75" style={{ height: `${20 + elevatorLift}%` }} />
    </div>
    <div className="w-6 h-8 bg-cyan-500/80 border-x-4 border-slate-300 dark:border-[#1c1b1b] z-10" />

   </div>

   </div>

   <div className="mt-12 bg-blue-50 border border-blue-200 px-6 py-4 rounded-xl text-blue-900 text-center max-w-md dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff]">
   <h3 className="font-bold mb-1">Pascal's Principle</h3>
   <p className="text-sm">
    Pressing the small syringe transfers fluid pressure equally to the large syringe. Because the large syringe has a bigger area, it exerts a <strong>larger force</strong>, lifting the heavy car!
   </p>
   </div>

  </div>
  </div>
 </div>
 );
}
