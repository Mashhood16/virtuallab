import { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS7EarthSeasons({ onExit }: LabProps) {
 const [running, setRunning] = useState(false);
 const [angle, setAngle] = useState(0); // 0 to 360 degrees

 useEffect(() => {
 let interval: number;
 if (running) {
  interval = window.setInterval(() => {
  setAngle(a => (a + 1) % 360);
  }, 50);
 }
 return () => clearInterval(interval);
 }, [running]);

 // Determine season in Northern Hemisphere based on angle
 // 0 = Spring, 90 = Summer, 180 = Autumn, 270 = Winter
 let season = 'Spring';
 let seasonColor = 'text-green-400';
 if (angle >= 45 && angle < 135) {
 season = 'Summer';
 seasonColor = 'text-yellow-400';
 } else if (angle >= 135 && angle < 225) {
 season = 'Autumn';
 seasonColor = 'text-orange-400';
 } else if (angle >= 225 && angle < 315) {
 season = 'Winter';
 seasonColor = 'text-blue-400';
 }

 // Calculate position in orbit
 const orbitRadiusX = 300;
 const orbitRadiusY = 100;
 const radian = (angle * Math.PI) / 180;
 const earthX = Math.cos(radian) * orbitRadiusX;
 const earthY = Math.sin(radian) * orbitRadiusY;
 
 // Z-index calculation (Earth goes behind sun when Y is negative)
 const earthZ = earthY > 0 ? 30 : 10;
 
 // Scale for 3D effect
 const earthScale = 1 + (earthY / orbitRadiusY) * 0.2;

 return (
 <div className="flex flex-col h-screen overflow-y-auto font-sans bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Unit 12: Earth's Seasons" />

  <div className="flex-1 relative flex flex-col items-center p-8">
  <div className="backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-2xl w-full text-center mb-12 bg-white/80 dark:bg-[#121212]/80 border border-slate-200 dark:border-neutral-900 relative z-10">
   <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Axial Tilt and Revolution</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">The Earth's axis is tilted at 23.5 degrees. As it revolves around the Sun, this constant tilt causes the Northern and Southern Hemispheres to receive varying amounts of direct sunlight, creating the seasons.</p>
   
   <div className="flex justify-center gap-4 items-center">
   <button 
    onClick={() => setRunning(!running)}
    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
    {running ? <><Pause className="w-5 h-5 mr-2" /> Pause Orbit</> : <><Play className="w-5 h-5 mr-2" /> Start Orbit</>}
   </button>
   <div className="ml-8 text-left">
    <div className="text-sm text-slate-500 dark:text-[#71717a] uppercase tracking-widest font-bold">Northern Hemisphere</div>
    <div className={`text-3xl font-black ${seasonColor}`}>{season}</div>
   </div>
   </div>
  </div>

  {/* 3D Space Canvas */}
  <div className="relative flex justify-center items-center w-full h-[600px] perspective-1000">
   
   {/* Orbit Path (Ellipse) */}
   <div className="absolute w-[600px] h-[200px] rounded-[100%] shadow-[0_0_50px_rgba(0,0,0,0.05)_inset] dark:shadow-[0_0_50px_rgba(255,255,255,0.05)_inset] z-0 border border-slate-300 dark:border-[#1c1b1b]/50"></div>

   {/* The Sun */}
   <div className="absolute w-32 h-32 bg-yellow-500 rounded-full shadow-[0_0_100px_#facc15] z-20 flex justify-center items-center">
    <div className="w-24 h-24 rounded-full blur-[2px]" style={{backgroundColor: '#fde047'}}></div>
   </div>

   {/* The Earth */}
   <div 
    className="absolute transition-transform duration-75 ease-linear"
    style={{ 
    transform: `translate(${earthX}px, ${earthY}px) scale(${earthScale})`,
    zIndex: earthZ
    }}
   >
    {/* Axial Tilt Wrapper */}
    <div className="relative rotate-[23.5deg]">
     {/* The Axis Line */}
     <div className="absolute -top-6 left-1/2 w-0.5 h-20 bg-red-500/50 -ml-[1px]"></div>
     
     {/* Earth Sphere */}
     <div className="w-10 h-10 bg-blue-500 rounded-full shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.5)] overflow-hidden relative dark:bg-teal-950/20 dark:border-teal-900">
     {/* Continents (Simplified) */}
     <div className="absolute top-1 left-1 w-6 h-4 rounded-full blur-[1px]" style={{backgroundColor: '#22c55e'}}></div>
     <div className="absolute bottom-1 right-1 w-4 h-3 rounded-full blur-[1px]" style={{backgroundColor: '#16a34a'}}></div>
     </div>

     {/* Northern Hemisphere Indicator */}
     <div className="absolute -top-8 -left-4 text-xs font-bold text-white bg-[#000000] dark:bg-[#121212]/50 px-1 rounded shadow drop-shadow-md">North</div>
    </div>
   </div>

   {/* Star background (CSS trick) */}
   <div className="absolute inset-0 z-[-1] overflow-hidden opacity-50">
    <div className="w-full h-full bg-[radial-gradient(white_1px,_transparent_1px)] bg-[length:50px_50px] animate-[pulse_4s_linear_infinite]"></div>
    <div className="w-full h-full bg-[radial-gradient(white_1px,_transparent_1px)] bg-[length:30px_30px] animate-[pulse_3s_linear_infinite_1s] ml-4 mt-4"></div>
   </div>

  </div>
  </div>
 </div>
 );
}
