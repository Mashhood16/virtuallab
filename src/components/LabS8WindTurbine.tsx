import { useState } from 'react';
import {Wind } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8WindTurbine({ onExit }: LabProps) {
 const [windSpeed, setWindSpeed] = useState(0); // 0 to 100

 // Calculate voltage based on wind speed (non-linear for realism)
 const voltage = windSpeed < 10 ? 0 : (windSpeed / 100) * 5.0; // Max 5V

 return (
 <div className="lg:overflow-y-auto flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Act 11.7: DIY Wind Turbine" subtitle="Convert kinetic energy into electrical energy" />

  <div className="flex-1 flex flex-col p-6 gap-6 max-w-4xl mx-auto w-full items-center justify-center">
  
  {/* Controls */}
  <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] w-full mb-2 flex items-center gap-4">
   <Wind className={`w-8 h-8 transition-colors ${windSpeed > 0 ? 'text-sky-500 animate-pulse' : 'text-slate-300'}`} />
   <div className="flex-1">
   <div className="flex justify-between text-sm font-bold text-slate-500 dark:text-[#71717a] mb-2">
    <span>No Wind (Pedestal Fan Off)</span>
    <span>High Speed (Max Fan)</span>
   </div>
   <input 
    type="range" min="0" max="100" value={windSpeed} 
    onChange={(e) => setWindSpeed(Number(e.target.value))}
    className="w-full accent-sky-500"
   />
   </div>
  </div>

  <div className="flex-1 w-full bg-slate-100 dark:bg-[#121212] rounded-3xl shadow-inner border border-slate-300 dark:border-[#1c1b1b] p-8 flex relative overflow-hidden items-center justify-center">
   
   {/* Voltmeter */}
   <div className="absolute top-8 right-8 w-48 h-32 bg-zinc-800 rounded-xl shadow-xl border-4 border-zinc-900 flex flex-col items-center justify-center z-20">
    <div className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">Voltmeter</div>
    <div className="bg-green-100 text-green-800 font-mono text-3xl font-bold px-4 py-2 rounded border-2 border-green-300 shadow-inner w-36 text-right dark:text-[#ffffff]">
    {voltage.toFixed(2)} V
    </div>
    {/* Wires to Voltmeter */}
    <div className="absolute -bottom-4 left-4 w-2 h-4 bg-red-500" />
    <div className="absolute -bottom-4 right-4 w-2 h-4 bg-black" />
   </div>

   <div className="relative w-full h-full flex flex-col items-center justify-center">
   
   {/* Wind visual effect */}
   {windSpeed > 0 && (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50 z-0">
    {Array.from({length: 10}).map((_, i) => (
     <div 
     key={i}
     className="absolute h-1 bg-sky-300 rounded-full shadow-[0_0_10px_skyblue]"
     style={{
      width: `${Math.random() * 100 + 50}px`,
      top: `${Math.random() * 100}%`,
      left: `-20%`,
      animation: `wind_dash ${3 - (windSpeed/50)}s linear infinite`,
      animationDelay: `${Math.random() * 2}s`
     }}
     />
    ))}
    </div>
   )}

   {/* Turbine */}
   <div className="relative z-10 flex flex-col items-center">
    
    {/* Blades (Cardboard/Styrofoam cups) */}
    <div 
     className="relative w-48 h-48 flex items-center justify-center"
     style={{ 
     animation: windSpeed > 0 ? `spin ${200 / Math.max(1, windSpeed)}ms linear infinite` : 'none'
     }}
    >
     {/* Center cork */}
     <div className="w-8 h-8 bg-amber-800 rounded-full z-20 shadow-md" />
     
     {/* 4 Blades */}
     <div className="absolute top-0 w-8 h-20 bg-amber-200 border border-amber-300 rounded-t-full shadow-sm" />
     <div className="absolute bottom-0 w-8 h-20 bg-amber-200 border border-amber-300 rounded-b-full shadow-sm" />
     <div className="absolute left-0 w-20 h-8 bg-amber-200 border border-amber-300 rounded-l-full shadow-sm" />
     <div className="absolute right-0 w-20 h-8 bg-amber-200 border border-amber-300 rounded-r-full shadow-sm" />
    </div>

    {/* Motor */}
    <div className="w-16 h-20 bg-zinc-400 rounded-b-md shadow-md border border-zinc-500 z-0 -mt-4 relative">
     <div className="absolute -left-2 top-4 w-2 h-2 bg-red-500 rounded-full dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40" />
     <div className="absolute -right-2 top-4 w-2 h-2 bg-black rounded-full" />
    </div>

    {/* Stand */}
    <div className="w-4 h-48 bg-slate-400 dark:bg-[#121212] z-[-1]" />
    <div className="w-32 h-4 bg-slate-500 dark:bg-[#121212] rounded-t-xl" />
   </div>

   {/* Wires connecting motor to voltmeter */}
   <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
    {/* Red Wire */}
    <path d="M 370 250 Q 200 400 650 150" fill="none" stroke="#ef4444" strokeWidth="4" />
    {/* Black Wire */}
    <path d="M 430 250 Q 500 400 730 150" fill="none" stroke="#1f2937" strokeWidth="4" />
   </svg>

   </div>
  </div>
  </div>
  <style dangerouslySetInnerHTML={{__html: `
  @keyframes wind_dash {
   0% { transform: translateX(0); opacity: 0; }
   10% { opacity: 1; }
   90% { opacity: 1; }
   100% { transform: translateX(1000px); opacity: 0; }
  }
  `}} />
 </div>
 );
}
