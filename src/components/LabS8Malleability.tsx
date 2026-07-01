import { useState } from 'react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

interface Material {
 id: string;
 name: string;
 type: 'metal' | 'non-metal';
 color: string;
}

const MATERIALS: Material[] = [
 { id: 'fe', name: 'Iron', type: 'metal', color: 'bg-slate-400 dark:bg-[#121212]' },
 { id: 'cu', name: 'Copper', type: 'metal', color: 'bg-orange-400' },
 { id: 'al', name: 'Aluminum', type: 'metal', color: 'bg-gray-300' },
 { id: 'c', name: 'Carbon (Coke)', type: 'non-metal', color: 'bg-zinc-800' },
 { id: 's', name: 'Sulphur', type: 'non-metal', color: 'bg-yellow-400' },
];

export default function LabS8Malleability({ onExit }: LabProps) {
 const [selected, setSelected] = useState<Material>(MATERIALS[0]);
 const [hits, setHits] = useState(0);

 const handleHit = () => {
 if (hits < 3) setHits(h => h + 1);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans">
  <LabHeader onExit={onExit} title="Act 5.3: Malleability" subtitle="Hit materials with a hammer to test malleability" />

  <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
  {/* Selection */}
  <div className="w-full md:w-64 flex flex-col gap-2">
   <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-2">Select Material</h3>
   {MATERIALS.map(m => (
   <button 
    key={m.id}
    onClick={() => { setSelected(m); setHits(0); }}
    className={`p-3 text-left rounded-lg font-bold transition-all border-2 ${selected.id === m.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] hover:border-slate-300 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff]'}`}
   >
    {m.name}
   </button>
   ))}
  </div>

  {/* Action Area */}
  <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
   
   <div className="relative w-64 h-64 flex justify-center items-end border-b-8 border-amber-900 pb-1">
   
   {/* The Material */}
   {selected.type === 'metal' ? (
    // Metal flattens out
    <div 
    className={`${selected.color} border-2 border-black/20 rounded-sm transition-all duration-300 shadow-inner flex items-center justify-center`}
    style={{
     width: `${60 + hits * 30}px`,
     height: `${60 - hits * 15}px`,
    }}
    >
    {hits === 0 && <span className="text-xs text-white mix-blend-difference font-bold">Thick</span>}
    </div>
   ) : (
    // Non-metal breaks apart
    <div className="relative w-32 h-16">
    {hits === 0 ? (
     <div className={`absolute bottom-0 left-8 w-16 h-16 ${selected.color} border-2 border-black/20 rounded-sm shadow-inner`} />
    ) : (
     // Shattered pieces
     Array.from({ length: hits * 3 + 2 }).map((_, i) => (
     <div 
      key={i}
      className={`absolute bottom-0 ${selected.color} border border-black/20`}
      style={{
      width: `${10 + Math.random() * 10}px`,
      height: `${10 + Math.random() * 10}px`,
      left: `${20 + Math.random() * 80}px`,
      bottom: `${Math.random() * 20}px`,
      transform: `rotate(${Math.random() * 360}deg)`
      }}
     />
     ))
    )}
    </div>
   )}

   {/* Animation Overlay for Hit */}
   {hits > 0 && hits < 4 && (
    <div key={hits} className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 animate-[ping_0.3s_ease-out]">
    <div className="w-32 h-32 border-4 border-slate-400 dark:border-[#1c1b1b] rounded-full" />
    </div>
   )}

   </div>

   <div className="mt-8 text-center">
   <button 
    onClick={handleHit}
    disabled={hits >= 3}
    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 text-xl shadow-lg flex items-center gap-2 mx-auto transition-transform active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
    🔨 Hit with Hammer
   </button>
   <p className="mt-4 text-slate-500 dark:text-[#71717a] font-medium">Hits: {hits}/3</p>
   </div>

   {hits >= 3 && (
   <div className={`mt-6 px-6 py-4 rounded-xl border-2 animate-fade-in ${selected.type === 'metal' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
    <h3 className="font-bold text-lg mb-1">{selected.name} is a {selected.type.toUpperCase()}</h3>
    <p className="text-sm">
    {selected.type === 'metal' 
     ? "It flattened into a thin sheet. This property is called MALLEABILITY." 
     : "It shattered into smaller pieces. Non-metals are BRITTLE, not malleable."}
    </p>
   </div>
   )}

  </div>
  </div>
 </div>
 );
}
