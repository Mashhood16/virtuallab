import { useState, useEffect } from 'react';
import { Clock, Droplet } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS7XylemTransport({ onExit }: LabProps) {
 const [time, setTime] = useState(0);
 const [running, setRunning] = useState(false);

 useEffect(() => {
 let interval: number;
 if (running && time < 100) {
  interval = window.setInterval(() => {
  setTime(t => Math.min(100, t + 5));
  }, 500);
 }
 return () => clearInterval(interval);
 }, [running, time]);

 const flowerColor = `rgb(${255 - time * 1.5}, ${255 - time * 2}, 255)`; // Turns increasingly blue

 return (
 <div className="lg:overflow-y-auto flex flex-col h-screen bg-blue-50 font-sans dark:bg-teal-950/20 dark:border-teal-900">
  <LabHeader onExit={onExit} title="Unit 1: Xylem Transport Demonstration" />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-blue-100 max-w-2xl w-full text-center mb-8">
   <h2 className="text-2xl font-bold text-blue-800 mb-4 dark:text-[#ffffff]">Capillary Action in Xylem</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">Observe how a white flower changes color over time when its stem is placed in colored water. This demonstrates how xylem vessels transport water upwards from the roots to the leaves.</p>
   
   <div className="flex justify-center gap-4">
   <button 
    onClick={() => setRunning(!running)}
    disabled={time === 100}
    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
    <Clock className="w-5 h-5 mr-2" />
    {running ? 'Pause Time' : time === 100 ? 'Experiment Complete' : 'Accelerate Time'}
   </button>
   <button 
    onClick={() => { setTime(0); setRunning(false); }}
    className="flex items-center px-6 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg hover:bg-slate-300 dark:bg-[#121212] font-medium"
   >
    Reset
   </button>
   </div>
  </div>

  {/* Experiment Setup */}
  <div className="w-96 h-96 relative flex justify-center items-end p-8 bg-slate-50 dark:!bg-[#121212] rounded-3xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
   {/* Beaker */}
   <div className="w-32 h-40 border-b-4 border-l-4 border-r-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-xl relative flex justify-center overflow-hidden">
   {/* Colored Water */}
   <div className="absolute bottom-0 w-full h-24 bg-blue-500/80 border-t-2 border-blue-400 dark:bg-teal-950/20 dark:border-teal-900">
    {/* Particles flowing up */}
    {running && (
     <div className="absolute inset-0 flex flex-col items-center justify-end overflow-hidden">
     <Droplet className="w-3 h-3 text-blue-200 absolute bottom-0 animate-[ping_2s_linear_infinite]" />
     <Droplet className="w-2 h-2 text-blue-300 absolute bottom-4 left-4 animate-[ping_1.5s_linear_infinite_0.5s]" />
     </div>
    )}
   </div>
   
   {/* Stem */}
   <div className="w-4 h-64 bg-green-500 absolute bottom-0 border-l border-r border-green-600 relative overflow-hidden z-10 dark:bg-[#121212] dark:border-[#1c1b1b]">
    {/* Water moving up stem */}
    <div 
     className="absolute bottom-0 w-full bg-blue-500/60 transition-all duration-500 dark:bg-teal-950/20 dark:border-teal-900"
     style={{ height: `${time}%` }}
    ></div>
   </div>
   </div>

   {/* Flower */}
   <div className="absolute top-16 transition-colors duration-500 z-20" style={{ color: flowerColor }}>
    <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor" stroke="#333" strokeWidth="2">
    {/* Petals */}
    <path d="M50 50 Q20 20 50 10 Q80 20 50 50" />
    <path d="M50 50 Q80 20 90 50 Q80 80 50 50" />
    <path d="M50 50 Q80 80 50 90 Q20 80 50 50" />
    <path d="M50 50 Q20 80 10 50 Q20 20 50 50" />
    {/* Center */}
    <circle cx="50" cy="50" r="10" fill="#FFD700" stroke="#B8860B" />
    </svg>
   </div>
  </div>

  {time === 100 && (
   <div className="mt-8 p-4 bg-blue-100 text-blue-800 rounded-xl border border-blue-200 text-center font-medium max-w-xl animate-pulse dark:text-[#ffffff]">
   Success! The flower's petals have turned blue. This proves that the xylem tissues transport water and dissolved minerals from the base of the stem all the way up to the leaves and flowers.
   </div>
  )}
  </div>
 </div>
 );
}
