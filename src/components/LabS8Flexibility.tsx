import { useState, useRef } from 'react';
import {Hand } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

const MATERIALS = [
 { id: 'al', name: 'Aluminum Wire', type: 'metal', color: 'bg-slate-300 dark:bg-[#121212]', flexible: true },
 { id: 'c', name: 'Carbon Rod (Graphite)', type: 'non-metal', color: 'bg-zinc-800', flexible: false },
 { id: 'cu', name: 'Copper Wire', type: 'metal', color: 'bg-orange-400', flexible: true },
 { id: 's', name: 'Sulphur Stick', type: 'non-metal', color: 'bg-yellow-400', flexible: false },
];

export default function LabS8Flexibility({ onExit }: LabProps) {
 const [selected, setSelected] = useState(MATERIALS[0]);
 const [bendAmount, setBendAmount] = useState(0); // 0 to 100
 const [broken, setBroken] = useState(false);
 const isDragging = useRef(false);

 const handlePointerDown = () => {
 if (!broken) isDragging.current = true;
 };

 const handlePointerMove = () => {
 if (!isDragging.current || broken) return;
 
 // Simulate bending
 setBendAmount(prev => {
  const next = Math.min(100, prev + 2);
  if (!selected.flexible && next > 20) {
  setBroken(true);
  isDragging.current = false;
  return 20; // Stop at breaking point
  }
  return next;
 });
 };

 const handlePointerUp = () => {
 isDragging.current = false;
 };

 const reset = () => {
 setBendAmount(0);
 setBroken(false);
 isDragging.current = false;
 };

 return (
 <div 
  className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none"
  onPointerUp={handlePointerUp}
  onPointerLeave={handlePointerUp}
 >
  <LabHeader onExit={onExit} title="Act 5.4: Flexibility" subtitle="Test if materials bend or break under force" />

  <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
  {/* Selection */}
  <div className="w-full md:w-64 flex flex-col gap-2">
   <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-2">Select Material</h3>
   {MATERIALS.map(m => (
   <button 
    key={m.id}
    onClick={() => { setSelected(m); reset(); }}
    className={`p-3 text-left rounded-lg font-bold transition-all border-2 ${selected.id === m.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] hover:border-slate-300 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff]'}`}
   >
    {m.name}
   </button>
   ))}
  </div>

  {/* Action Area */}
  <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
   
   <p className="text-slate-500 dark:text-[#71717a] mb-8 text-center flex items-center gap-2">
   <Hand className="w-5 h-5 text-indigo-500" />
   Press and drag down on the right side to bend
   </p>

   <div 
   className="relative w-80 h-40 flex items-center justify-center"
   onPointerDown={handlePointerDown}
   onPointerMove={handlePointerMove}
   >
   {/* Left Clamp (Fixed) */}
   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-16 bg-slate-700 dark:!bg-[#121212] rounded-r-md z-20 shadow-md" />
   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-20 bg-[#121212] dark:bg-[#121212] z-20" />

   {/* The Material Wire/Rod */}
   <div className="absolute left-6 right-8 top-1/2 -translate-y-1/2 flex items-center h-4 perspective-[500px]">
    
    {!broken ? (
    // Intact Material
    <div 
     className={`w-full h-full ${selected.color} shadow-inner origin-left rounded-r-full`}
     style={{
     transform: `rotate(${bendAmount * 0.6}deg)`,
     transition: isDragging.current ? 'none' : 'transform 0.3s ease-out'
     }}
    />
    ) : (
    // Broken Material
    <div className="w-full h-full relative">
     {/* Left broken piece */}
     <div className={`absolute left-0 w-1/3 h-full ${selected.color} origin-left rounded-r-sm`} style={{ transform: 'rotate(5deg)' }} />
     {/* Right broken piece falling */}
     <div className={`absolute left-1/3 w-2/3 h-full ${selected.color} rounded-l-sm animate-[fall_1s_ease-in_forwards]`} />
    </div>
    )}

   </div>

   {/* Drag Handle Indicator */}
   {!broken && (
    <div 
    className={`absolute right-0 w-16 h-16 rounded-full bg-indigo-500/20 border-2 border-indigo-500/50 flex items-center justify-center animate-pulse ${isDragging.current ? 'bg-indigo-500/40 scale-90' : ''}`}
    style={{
     top: `calc(50% + ${Math.sin(bendAmount * 0.6 * Math.PI / 180) * 120}px - 32px)`,
    }}
    />
   )}
   </div>

   <div className="mt-12 h-24">
   {(bendAmount > 60 || broken) && (
    <div className={`px-6 py-4 rounded-xl border-2 animate-fade-in ${selected.flexible ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
    <h3 className="font-bold text-lg mb-1">{selected.name} is {selected.type === 'metal' ? 'a METAL' : 'a NON-METAL'}</h3>
    <p className="text-sm">
     {selected.flexible 
     ? "It bends easily without breaking. This property is called FLEXIBILITY (or Ductility)." 
     : "It snaps and breaks when bent. Non-metals are BRITTLE."}
    </p>
    </div>
   )}
   </div>

  </div>
  </div>
  <style dangerouslySetInnerHTML={{__html: `
  @keyframes fall {
   0% { transform: translate(0, 0) rotate(10deg); opacity: 1; }
   100% { transform: translate(20px, 200px) rotate(45deg); opacity: 0; }
  }
  `}} />
 </div>
 );
}
