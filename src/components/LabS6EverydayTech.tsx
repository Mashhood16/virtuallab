import { useState } from 'react';
import { Rocket, Map, Radio } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS6EverydayTech({ onExit }: LabProps) {
 const [activeTech, setActiveTech] = useState<'satellites' | 'gps' | 'communication'>('satellites');

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans">
  <LabHeader onExit={onExit} title="Unit 12: Technology in Everyday Life" />

  <div className="flex-1 flex flex-col p-8 items-center lg:overflow-y-auto">
  
  <div className="flex gap-4 mb-8">
   <button 
   onClick={() => setActiveTech('satellites')}
   className={`px-6 py-3 rounded-xl border-2 font-bold flex items-center gap-2 ${activeTech === 'satellites' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-indigo-300'}`}
   >
   <Rocket className="w-5 h-5" /> Satellites
   </button>
   <button 
   onClick={() => setActiveTech('gps')}
   className={`px-6 py-3 rounded-xl border-2 font-bold flex items-center gap-2 ${activeTech === 'gps' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-emerald-300'}`}
   >
   <Map className="w-5 h-5" /> GPS Systems
   </button>
   <button 
   onClick={() => setActiveTech('communication')}
   className={`px-6 py-3 rounded-xl border-2 font-bold flex items-center gap-2 ${activeTech === 'communication' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-blue-300'}`}
   >
   <Radio className="w-5 h-5" /> Communication
   </button>
  </div>

  <div className="w-full max-w-4xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8 min-h-[400px]">
   
   {activeTech === 'satellites' && (
   <div className="animate-fade-in">
    <h2 className="text-2xl font-bold text-indigo-800 mb-6 dark:text-[#ffffff]">Artificial Satellites</h2>
    <div className="flex gap-8">
    <div className="flex-1 space-y-4 text-slate-600 dark:text-[#a1a1aa]">
     <p>Satellites are objects placed into orbit around the Earth or other planets to collect information or for communication.</p>
     <p><strong>Weather Satellites:</strong> Help meteorologists track storms, cloud patterns, and predict the weather.</p>
     <p><strong>Observation Satellites:</strong> Used for map making, tracking environmental changes, and agriculture.</p>
    </div>
    <div className="w-64 h-64 bg-[#000000] dark:bg-[#121212] rounded-xl relative overflow-hidden border-4 border-[#1c1b1b] dark:border-[#1c1b1b] shadow-inner flex items-center justify-center">
     <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent"></div>
     {/* Earth */}
     <div className="w-32 h-32 bg-blue-500 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5)] z-10 flex items-center justify-center overflow-hidden dark:bg-teal-950/20 dark:border-teal-900">
      <div className="w-16 h-24 bg-emerald-500 absolute -left-2 top-2 rounded-full opacity-80 blur-[2px] dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"></div>
      <div className="w-20 h-16 bg-emerald-500 absolute right-0 bottom-4 rounded-full opacity-80 blur-[2px]"></div>
     </div>
     {/* Satellite */}
     <div className="absolute w-48 h-48 border border-white/20 rounded-full animate-[spin_10s_linear_infinite]">
     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-slate-300 dark:bg-[#121212] flex items-center justify-between px-1">
      <div className="w-2 h-full bg-blue-400"></div>
      <div className="w-2 h-full bg-blue-400"></div>
     </div>
     </div>
    </div>
    </div>
   </div>
   )}

   {activeTech === 'gps' && (
   <div className="animate-fade-in">
    <h2 className="text-2xl font-bold text-emerald-800 mb-6">Global Positioning System (GPS)</h2>
    <div className="flex gap-8">
    <div className="flex-1 space-y-4 text-slate-600 dark:text-[#a1a1aa]">
     <p>GPS is a network of satellites orbiting the Earth that transmit precise details of their position in space back to Earth.</p>
     <p>The signals are obtained by GPS receivers, such as navigation devices and smartphones, and are used to calculate the exact position, speed, and time at the vehicle's location.</p>
     <p>It requires at least <strong>4 satellites</strong> to accurately determine a 3D position (latitude, longitude, and altitude).</p>
    </div>
    <div className="w-64 h-64 bg-slate-100 dark:bg-[#121212] rounded-xl border border-slate-300 dark:border-[#1c1b1b] shadow-inner relative flex items-center justify-center">
     {/* Phone screen */}
     <div className="w-24 h-48 bg-[#121212] dark:bg-[#121212] rounded-xl border-4 border-[#1c1b1b] dark:border-[#1c1b1b] relative overflow-hidden flex flex-col">
     <div className="flex-1 bg-[#e5e3df] relative">
      {/* Map lines */}
      <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-50 dark:bg-[#121212] -translate-y-1/2"></div>
      <div className="absolute top-0 left-1/2 w-2 h-full bg-slate-50 dark:bg-[#121212] -translate-x-1/2"></div>
      {/* Location dot */}
      <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg /20 dark:border-teal-900 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"></div>
     </div>
     </div>
     {/* Signals */}
     <div className="absolute top-4 left-4 text-emerald-500 animate-pulse"><Radio /></div>
     <div className="absolute top-4 right-4 text-emerald-500 animate-pulse delay-75"><Radio /></div>
     <div className="absolute bottom-4 right-4 text-emerald-500 animate-pulse delay-150"><Radio /></div>
    </div>
    </div>
   </div>
   )}

   {activeTech === 'communication' && (
   <div className="animate-fade-in">
    <h2 className="text-2xl font-bold text-blue-800 mb-6 dark:text-[#ffffff]">Modern Communication Systems</h2>
    <div className="flex gap-8">
    <div className="flex-1 space-y-4 text-slate-600 dark:text-[#a1a1aa]">
     <p>Information and Communication Technology (ICT) has revolutionized how we connect. It encompasses radio, television, cellular phones, computer and network hardware and software, satellite systems and so on.</p>
     <p><strong>The Internet:</strong> A global network connecting millions of computers, allowing for email, web browsing, and instant messaging.</p>
     <p><strong>Mobile Networks:</strong> Enable wireless communication via cell towers, letting us make calls and access the internet from anywhere.</p>
    </div>
    <div className="w-64 h-64 bg-blue-50 rounded-xl border border-blue-200 shadow-inner p-4 grid grid-cols-2 grid-rows-2 gap-4 dark:bg-teal-950/20 dark:border-teal-900">
     <div className="bg-slate-50 dark:bg-[#121212] rounded-lg shadow flex items-center justify-center text-blue-500 flex-col gap-2">
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      <span className="text-xs font-bold">Email</span>
     </div>
     <div className="bg-slate-50 dark:bg-[#121212] rounded-lg shadow flex items-center justify-center text-emerald-500 flex-col gap-2">
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
      <span className="text-xs font-bold">Messaging</span>
     </div>
     <div className="bg-slate-50 dark:bg-[#121212] rounded-lg shadow flex items-center justify-center text-indigo-500 flex-col gap-2">
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
      <span className="text-xs font-bold">Video Call</span>
     </div>
     <div className="bg-slate-50 dark:bg-[#121212] rounded-lg shadow flex items-center justify-center text-rose-500 flex-col gap-2">
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
      <span className="text-xs font-bold">Voice</span>
     </div>
    </div>
    </div>
   </div>
   )}

  </div>
  </div>
 </div>
 );
}
