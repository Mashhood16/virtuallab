import { useState, useEffect } from 'react';
import { Droplets, Droplet } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS7DripIrrigation({ onExit }: LabProps) {
 const [running, setRunning] = useState(false);
 const [waterTank, setWaterTank] = useState(100);
 const [soilMoisture, setSoilMoisture] = useState(0);

 useEffect(() => {
 let interval: number;
 if (running && waterTank > 0) {
  interval = window.setInterval(() => {
  setWaterTank(w => Math.max(0, w - 2)); // Tank depletes
  setSoilMoisture(s => Math.min(100, s + 1)); // Soil absorbs slowly
  }, 200);
 } else if (waterTank === 0) {
  setRunning(false);
 }
 return () => clearInterval(interval);
 }, [running, waterTank]);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-green-50 font-sans dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Unit 11: Drip Irrigation Model" />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-green-100 max-w-2xl w-full text-center mb-8">
   <h2 className="text-2xl font-bold text-green-800 mb-4 dark:text-[#ffffff]">Water Conservation</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">Drip irrigation delivers water directly to the roots of plants drop by drop. This minimizes evaporation waste and ensures highly efficient water usage compared to flood or sprinkler irrigation.</p>
   
   <div className="flex justify-center gap-4">
   <button 
    onClick={() => setRunning(!running)}
    disabled={waterTank === 0}
    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
    <Droplets className="w-5 h-5 mr-2" />
    {running ? 'Close Valve' : waterTank === 0 ? 'Tank Empty' : 'Open Valve'}
   </button>
   <button 
    onClick={() => { setWaterTank(100); setSoilMoisture(0); setRunning(false); }}
    className="flex items-center px-6 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg hover:bg-slate-300 dark:bg-[#121212] font-medium"
   >
    Refill Tank
   </button>
   </div>
  </div>

  {/* Simulation Area */}
  <div className="relative w-full max-w-4xl h-[400px] bg-slate-50 dark:!bg-[#121212] rounded-3xl border border-slate-200 dark:border-[#1c1b1b] shadow-sm flex items-end justify-center p-8 mt-4 overflow-hidden">
   
   {/* Water Tank */}
   <div className="absolute left-8 bottom-16 w-32 h-48 border-4 border-slate-300 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] rounded-xl shadow-inner flex flex-col justify-end z-20 overflow-hidden">
    {/* Water Level */}
    <div 
    className="w-full bg-blue-500/80 transition-all duration-200 border-t-2 border-blue-400 dark:bg-teal-950/20 dark:border-teal-900"
    style={{ height: `${waterTank}%` }}
    ></div>
    <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-600 dark:text-[#a1a1aa] mix-blend-overlay text-xl">TANK</div>
   </div>

   {/* The Main Pipe */}
   <div className="absolute left-40 bottom-24 w-[600px] h-4 bg-[#121212] dark:!bg-[#121212] z-10 border-b-2 border-slate-900 dark:border-[#1c1b1b] rounded-r shadow-md">
    {/* Pipe Valve */}
    <div className="absolute -left-2 -top-2 w-4 h-8 bg-red-500 rounded flex justify-center items-center dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40">
     <div className={`w-8 h-2 bg-red-600 rounded transition-transform ${running ? 'rotate-0' : 'rotate-90'}`}></div>
    </div>
   </div>

   {/* Soil Layer */}
   <div className="absolute bottom-0 w-full h-16 bg-stone-800 z-0">
    {/* Moisture spread overlay */}
    <div 
    className="absolute inset-0 bg-blue-900/40 transition-all duration-[2000ms]"
    style={{ opacity: soilMoisture / 100 }}
    ></div>
   </div>

   {/* Plants & Drip Lines */}
   {[0, 1, 2, 3].map((i) => (
    <div key={i} className="absolute bottom-16 flex flex-col items-center" style={{ left: `${250 + i * 140}px` }}>
    {/* Drip line connecting main pipe to soil */}
    <div className="w-1 h-8 bg-slate-700 dark:bg-[#121212] relative z-20">
     {/* Water Drops */}
     {running && (
      <Droplet className={`w-3 h-3 text-blue-400 absolute left-[-4px] animate-[fall_1s_linear_infinite]`} style={{ animationDelay: `${i * 0.2}s` }} />
     )}
    </div>

    {/* Plant */}
    <div className="absolute bottom-[-16px] w-2 h-16 bg-green-700 z-30">
     <div className="absolute top-2 -left-4 w-6 h-3 bg-green-500 rounded-full rotate-[-30deg] dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"></div>
     <div className="absolute top-6 -right-4 w-6 h-3 bg-green-500 rounded-full rotate-[30deg] dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"></div>
     <div className="absolute top-10 -left-3 w-4 h-2 bg-green-400 rounded-full rotate-[-20deg] dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"></div>
    </div>

    {/* Root Zone Moisture Ring */}
    <div 
     className="absolute bottom-[-32px] rounded-full bg-blue-800/60 blur-md transition-all duration-1000 z-10"
     style={{ width: `${40 + soilMoisture}px`, height: `${20 + soilMoisture / 2}px` }}
    ></div>
    </div>
   ))}
   <style>{`
    @keyframes fall {
    0% { top: 0px; opacity: 1; }
    80% { top: 30px; opacity: 1; }
    100% { top: 32px; opacity: 0; }
    }
   `}</style>
  </div>

  {waterTank === 0 && (
   <div className="mt-8 p-4 bg-green-100 text-green-800 rounded-xl border border-green-200 text-center font-medium max-w-xl animate-fade-in dark:text-[#ffffff]">
   Notice how the soil around the roots is perfectly moistened without wasting water on the empty spaces between the plants. This is the power of drip irrigation!
   </div>
  )}
  </div>
 </div>
 );
}
