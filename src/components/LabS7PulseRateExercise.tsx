import { useState, useEffect } from 'react';
import { Activity, Play } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS7PulseRateExercise({ onExit }: LabProps) {
 const [state, setState] = useState<'rest' | 'exercising' | 'recovery'>('rest');
 const [pulse, setPulse] = useState(72); // resting BPM
 const [timer, setTimer] = useState(0);

 useEffect(() => {
 let interval: number;
 if (state === 'exercising') {
  interval = window.setInterval(() => {
  setPulse(p => Math.min(160, p + 2)); // Pulse goes up during exercise
  setTimer(t => {
   if (t >= 60) {
   setState('recovery');
   return 0;
   }
   return t + 1;
  });
  }, 500); // Accelerated time
 } else if (state === 'recovery') {
  interval = window.setInterval(() => {
  setPulse(p => Math.max(72, p - 1)); // Pulse recovers slowly
  setTimer(t => {
   if (t >= 100) {
   setState('rest');
   return 0;
   }
   return t + 1;
  });
  }, 500);
 }
 return () => clearInterval(interval);
 }, [state]);

 const startExercise = () => {
 setState('exercising');
 setTimer(0);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-red-50 font-sans dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Unit 2: Pulse Rate and Exercise" />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-red-100 max-w-2xl w-full text-center mb-8">
   <h2 className="text-2xl font-bold text-red-800 mb-4">Circulation and Physical Demand</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">Observe how your pulse rate (heartbeats per minute) changes from a resting state, to active exercise, and finally during the recovery period.</p>
   
   <div className="flex justify-center gap-4">
   <button 
    onClick={startExercise}
    disabled={state !== 'rest'}
    className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"
   >
    <Play className="w-5 h-5 mr-2" />
    Start 2-Minute Jumping Jacks
   </button>
   </div>
  </div>

  <div className="flex gap-12 w-full max-w-4xl">
   
   {/* Animated Heart */}
   <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:!bg-[#121212] p-8 rounded-3xl border border-slate-200 dark:border-[#1c1b1b] shadow-sm">
   <h3 className="font-bold text-slate-500 dark:text-[#71717a] mb-8 uppercase tracking-wider text-sm">Heart Simulation</h3>
   <div className="relative flex justify-center items-center h-48 w-48">
    {/* The heart pulses faster based on BPM. CSS animation duration = 60 / pulse */}
    <div 
    className="text-red-500 transition-all"
    style={{
     transform: `scale(${1 + (pulse - 72) / 200})`,
     animation: `pulse ${60 / pulse}s infinite alternate`
    }}
    >
    <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
    </div>
    <style>{`
    @keyframes pulse {
     0% { transform: scale(1); }
     100% { transform: scale(1.1); }
    }
    `}</style>
   </div>
   
   <div className="mt-8 text-center flex flex-col items-center">
    <span className="text-5xl font-black text-slate-800 dark:text-[#ffffff] flex items-center">
    {pulse} <span className="text-xl text-slate-500 dark:text-[#71717a] ml-2">BPM</span>
    </span>
    <span className={`mt-2 px-3 py-1 rounded-full text-sm font-bold ${ state === 'rest' ? 'bg-green-100 text-green-700' : state === 'exercising' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-amber-100 text-amber-700' }`}>
    {state === 'rest' ? 'Resting State' : state === 'exercising' ? 'High Intensity Exercise' : 'Recovery Period'}
    </span>
   </div>
   </div>

   {/* Graph/Monitor */}
   <div className="flex-[2] bg-[#000000] dark:bg-[#121212] rounded-3xl p-6 border-4 border-[#1c1b1b] dark:border-[#1c1b1b] relative overflow-hidden flex flex-col">
    <div className="flex items-center text-green-400 mb-4">
    <Activity className="w-6 h-6 mr-2" />
    <h3 className="font-mono font-bold tracking-widest">ECG MONITOR</h3>
    </div>
    
    <div className="flex-1 relative border-b border-l border-green-900 flex items-end lg:overflow-hidden">
    {/* Continuous Scrolling Graph Line */}
    <div 
     className="absolute inset-0 w-[200%] flex items-center"
     style={{
     animation: `scrollECG ${10 * (60 / pulse)}s linear infinite`
     }}
    >
     <svg width="100%" height="100%" preserveAspectRatio="none" className="text-green-500" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 1000 100">
      <path 
      d={`M 0 50 ${Array.from({length: 20}).map((_, i) => {
       const o = i * 50;
       return `L ${o + 10} 50 L ${o + 15} ${50 - pulse/8} L ${o + 20} 50 L ${o + 25} ${50 + pulse/5} L ${o + 30} ${50 - pulse/3.5} L ${o + 35} 50 L ${o + 40} ${50 - pulse/8} L ${o + 45} 50 L ${o + 50} 50`;
      }).join(' ')}`} 
      />
     </svg>
    </div>
    {/* Scanning line */}
    <div className="absolute top-0 bottom-0 w-1 bg-green-400/50 shadow-[0_0_10px_#4ade80] animate-[scan_2s_linear_infinite]"></div>
    </div>
    <style>{`
    @keyframes scan {
     0% { left: 0%; opacity: 0; }
     10% { opacity: 1; }
     90% { opacity: 1; }
     100% { left: 100%; opacity: 0; }
    }
    @keyframes scrollECG {
     0% { transform: translateX(0); }
     100% { transform: translateX(-50%); }
    }
    `}</style>
   </div>

  </div>

  {state === 'recovery' && timer > 50 && (
   <div className="mt-8 p-4 bg-red-100 text-red-800 rounded-xl border border-red-200 text-center font-medium max-w-xl animate-fade-in">
   Notice how your breathing and pulse rate spiked during exercise? Your muscles needed more oxygen and energy, so your heart had to pump blood faster to deliver it. During recovery, the rate slowly returns to normal as oxygen debt is repaid.
   </div>
  )}
  </div>
 </div>
 );
}
