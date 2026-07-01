import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS7AtomModel({ onExit }: LabProps) {
 // Let's build a Carbon atom (Atomic No 6, Mass 12)
 const [protons, setProtons] = useState(0);
 const [neutrons, setNeutrons] = useState(0);
 const [electrons, setElectrons] = useState(0);

 const targetProtons = 6;
 const targetNeutrons = 6;
 const targetElectrons = 6;

 const isComplete = protons === targetProtons && neutrons === targetNeutrons && electrons === targetElectrons;

 return (
 <div className="flex flex-col h-screen overflow-y-auto font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Unit 5: 3D Atom Model Builder" />

  <div className="flex-1 p-8 flex flex-col xl:flex-row gap-8 items-center justify-center">
  
  {/* Controls */}
  <div className="p-6 rounded-2xl shadow-xl max-w-sm w-full bg-white dark:!bg-[#121212] border border-slate-200 dark:border-[#1c1b1b]">
   <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Build a Carbon Atom</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-6 text-sm">Carbon has an atomic number of 6 and a mass number of 12. Add the correct number of subatomic particles to build the atom.</p>
   
   <div className="space-y-4">
   <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-[#1c1b1b]">
    <div className="flex items-center">
    <div className="w-4 h-4 rounded-full bg-red-500 mr-3"></div>
    <span className="text-slate-800 dark:text-white font-bold">Protons (Nucleus)</span>
    </div>
    <div className="flex items-center gap-3">
    <button onClick={() => setProtons(Math.max(0, protons - 1))} className="w-8 h-8 rounded-full text-slate-800 font-bold bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">-</button>
    <span className="w-6 text-center text-slate-800 dark:text-white font-mono">{protons}</span>
    <button onClick={() => setProtons(Math.min(10, protons + 1))} className="w-8 h-8 rounded-full text-slate-800 font-bold bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">+</button>
    </div>
   </div>

   <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-[#1c1b1b]">
    <div className="flex items-center">
    <div className="w-4 h-4 rounded-full bg-slate-400 dark:bg-[#121212] mr-3"></div>
    <span className="text-slate-800 dark:text-white font-bold">Neutrons (Nucleus)</span>
    </div>
    <div className="flex items-center gap-3">
    <button onClick={() => setNeutrons(Math.max(0, neutrons - 1))} className="w-8 h-8 rounded-full text-slate-800 font-bold bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">-</button>
    <span className="w-6 text-center text-slate-800 dark:text-white font-mono">{neutrons}</span>
    <button onClick={() => setNeutrons(Math.min(10, neutrons + 1))} className="w-8 h-8 rounded-full text-slate-800 font-bold bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">+</button>
    </div>
   </div>

   <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-[#1c1b1b]">
    <div className="flex items-center">
    <div className="w-4 h-4 rounded-full bg-blue-400 mr-3"></div>
    <span className="text-slate-800 dark:text-white font-bold">Electrons (Orbit)</span>
    </div>
    <div className="flex items-center gap-3">
    <button onClick={() => setElectrons(Math.max(0, electrons - 1))} className="w-8 h-8 rounded-full text-slate-800 font-bold bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">-</button>
    <span className="w-6 text-center text-slate-800 dark:text-white font-mono">{electrons}</span>
    <button onClick={() => setElectrons(Math.min(10, electrons + 1))} className="w-8 h-8 rounded-full text-slate-800 font-bold bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">+</button>
    </div>
   </div>
   </div>

   {isComplete && (
    <div className="mt-6 p-4 bg-green-500/20 text-green-800 dark:text-green-300 rounded-xl border border-green-500/50 flex items-start dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
    <CheckCircle className="w-6 h-6 mr-3 shrink-0" />
    <p className="text-sm">Perfect! Carbon consists of 6 protons and 6 neutrons tightly packed in the nucleus, surrounded by 6 electrons orbiting in 2 shells.</p>
    </div>
   )}
  </div>

  {/* Atom Visualizer */}
  <div className="relative w-[500px] h-[500px] flex justify-center items-center">
   {/* Shells */}
   <div className={`absolute border border-slate-500 dark:border-slate-500/30 rounded-full flex justify-center items-center ${electrons > 0 ? 'w-48 h-48' : 'hidden'}`}>
    {/* Shell 1 Electrons (Max 2) */}
    {Array.from({ length: Math.min(2, electrons) }).map((_, i) => (
    <div 
     key={`e1-${i}`} 
     className="absolute w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] animate-[spin_4s_linear_infinite]"
     style={{ 
     transformOrigin: '128px 128px', // Center of the 48x48 (w-48 is 192px/2 = 96px, plus orbit offset? No, simpler to just position absolute and rotate)
     top: '-8px', left: 'calc(50% - 8px)',
     animationDelay: `${i * -2}s`
     }}
    ></div>
    ))}
   </div>

   <div className={`absolute border border-slate-500 dark:border-slate-500/30 rounded-full flex justify-center items-center ${electrons > 2 ? 'w-80 h-80' : 'hidden'}`}>
    {/* Shell 2 Electrons (Remaining) */}
    {Array.from({ length: Math.max(0, electrons - 2) }).map((_, i) => (
    <div 
     key={`e2-${i}`} 
     className="absolute w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] animate-[spin_8s_linear_infinite_reverse]"
     style={{ 
     transformOrigin: '50% 160px',
     top: '-8px', left: 'calc(50% - 8px)',
     animationDelay: `${i * -(8 / (electrons - 2))}s`
     }}
    ></div>
    ))}
   </div>

   {/* Nucleus */}
   <div className="relative z-10 flex flex-wrap justify-center items-center w-16 h-16 rounded-full drop-shadow-2xl">
    {/* Protons */}
    {Array.from({ length: protons }).map((_, i) => (
    <div key={`p-${i}`} className="w-4 h-4 bg-red-500 rounded-full shadow-inner absolute" style={{ transform: `translate(${(Math.random()-0.5)*20}px, ${(Math.random()-0.5)*20}px)` }}></div>
    ))}
    {/* Neutrons */}
    {Array.from({ length: neutrons }).map((_, i) => (
    <div key={`n-${i}`} className="w-4 h-4 bg-slate-400 dark:bg-[#121212] rounded-full shadow-inner absolute" style={{ transform: `translate(${(Math.random()-0.5)*20}px, ${(Math.random()-0.5)*20}px)` }}></div>
    ))}
   </div>
  </div>

  </div>
 </div>
 );
}
