import { useState } from 'react';
import { Music } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS7VibratingLengthPitch({ onExit }: LabProps) {
 const [distance, setDistance] = useState(80); // 20 to 100
 const [playing, setPlaying] = useState(false);

 const pluck = () => {
 setPlaying(true);
 setTimeout(() => setPlaying(false), 500); // Pluck lasts 500ms
 };

 // Higher pitch = faster vibration (shorter distance)
 // Lower pitch = slower vibration (longer distance)
 const frequency = 1000 / distance; 
 const pitchLabel = distance < 40 ? 'High Pitch (Shrill)' : distance > 70 ? 'Low Pitch (Grave)' : 'Medium Pitch';

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-indigo-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Unit 9: Waves and Energy" />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-indigo-100 max-w-2xl w-full text-center mb-8">
   <h2 className="text-2xl font-bold text-indigo-800 mb-4 dark:text-[#ffffff]">Pitch and Vibrating Length</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">A rubber band is stretched over a hollow box, supported by two pens. Adjust the distance between the pens to change the length of the vibrating segment, then pluck the band.</p>
   
   <div className="flex items-center gap-4 px-12">
   <span className="font-bold text-slate-500 dark:text-[#71717a] whitespace-nowrap">Distance:</span>
   <input 
    type="range" min="20" max="100" value={distance} onChange={e => setDistance(parseInt(e.target.value))}
    className="flex-1 accent-indigo-600"
   />
   </div>
   
   <button 
   onClick={pluck}
   className="mt-8 flex mx-auto items-center px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold active:scale-95 transition-transform shadow-md dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
   <Music className="w-5 h-5 mr-2" /> Pluck Rubber Band
   </button>
  </div>

  {/* The Instrument */}
  <div className="relative w-[600px] h-64 mt-8 flex justify-center items-center">
   {/* The Box */}
   <div className="absolute inset-0 bg-amber-700 border-4 border-amber-800 rounded-lg shadow-2xl flex justify-center items-center">
    {/* Sound Hole */}
    <div className="w-32 h-32 bg-amber-900 rounded-full shadow-inner border-4 border-amber-800"></div>
   </div>

   {/* Pens */}
   {/* Pen 1 */}
   <div className="absolute w-4 h-48 bg-blue-500 rounded-full border border-blue-600 z-10 shadow-lg dark:bg-teal-950/20 dark:border-teal-900" style={{ left: `calc(50% - ${distance * 2.5}px)` }}>
    <div className="absolute top-2 w-full h-2 bg-blue-300"></div>
   </div>
   {/* Pen 2 */}
   <div className="absolute w-4 h-48 bg-blue-500 rounded-full border border-blue-600 z-10 shadow-lg dark:bg-teal-950/20 dark:border-teal-900" style={{ left: `calc(50% + ${distance * 2.5}px)` }}>
    <div className="absolute top-2 w-full h-2 bg-blue-300"></div>
   </div>

   {/* The Rubber Band */}
   {/* Left non-vibrating segment */}
   <div className="absolute h-2 bg-yellow-500 shadow-sm border-t border-b border-yellow-600 z-20" style={{ left: 0, width: `calc(50% - ${distance * 2.5}px)` }}></div>
   
   {/* Vibrating segment */}
   <div className="absolute h-2 z-20 flex items-center justify-center" style={{ left: `calc(50% - ${distance * 2.5}px)`, width: `${distance * 5}px` }}>
    <div 
    className={`w-full h-full bg-yellow-400 border-t border-b border-yellow-500 transition-transform ${playing ? 'animate-pluck' : ''}`}
    style={{
     // The animation uses CSS variables to control speed
     animationDuration: `${1 / frequency}s`
    }}
    ></div>
   </div>

   {/* Right non-vibrating segment */}
   <div className="absolute h-2 bg-yellow-500 shadow-sm border-t border-b border-yellow-600 z-20" style={{ left: `calc(50% + ${distance * 2.5}px + 16px)`, right: 0 }}></div>

   {/* CSS for plucking */}
   <style>{`
    @keyframes pluck {
    0% { transform: translateY(0); }
    25% { transform: translateY(-10px); }
    50% { transform: translateY(0); }
    75% { transform: translateY(10px); }
    100% { transform: translateY(0); }
    }
    .animate-pluck {
    animation-name: pluck;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    }
   `}</style>
  </div>

  {/* Audio Visualizer (Fake) */}
  <div className="mt-12 bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl border border-slate-200 dark:border-[#1c1b1b] shadow-sm w-full max-w-2xl">
   <div className="flex justify-between items-center mb-4">
    <h3 className="font-bold text-slate-700 dark:text-[#ffffff]">Audio Waveform</h3>
    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-bold text-sm uppercase tracking-wider dark:text-[#ffffff]">{pitchLabel}</span>
   </div>
   <div className="h-24 bg-[#000000] dark:bg-[#121212] rounded-lg overflow-hidden relative flex items-center justify-center">
    {playing ? (
    <svg width="100%" height="100%" preserveAspectRatio="none">
     <path 
     d={`M 0 50 ${Array.from({length: 20}).map((_, i) => `Q ${i*5 + 2.5} ${i%2===0 ? 0 : 100}, ${i*5 + 5} 50`).join(' ')}`} 
     stroke="#5560F1" strokeWidth="2" fill="none" 
     vectorEffect="non-scaling-stroke"
     transform={`scale(${distance / 20}, 1)`}
     />
    </svg>
    ) : (
    <div className="w-full h-0.5 bg-indigo-900"></div>
    )}
   </div>
   <p className="mt-4 text-slate-500 dark:text-[#71717a] text-sm text-center">
    Shorter lengths vibrate faster (higher frequency), producing a higher pitch. Longer lengths vibrate slower (lower frequency), producing a lower pitch.
   </p>
  </div>
  </div>
 </div>
 );
}
