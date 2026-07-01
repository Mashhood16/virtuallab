import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Check, X, Info } from 'lucide-react';

export default function LabM6Factors({ onExit }: { onExit?: () => void }) {
 const [activeTab, setActiveTab] = useState<'LCM' | 'HCF'>('LCM');

 // LCM State
 const [lh1, setLh1] = useState<number>(3);
 const [lh2, setLh2] = useState<number>(4);
 const [lcmInput, setLcmInput] = useState<string>('');
 const [lcmFeedback, setLcmFeedback] = useState<{status: 'correct' | 'incorrect' | null, msg: string}>({status: null, msg: ''});
 const [time, setTime] = useState<number>(0);
 const [isPlaying, setIsPlaying] = useState<boolean>(false);

 useEffect(() => {
 let timer: ReturnType<typeof setTimeout>;
 if (isPlaying) {
  timer = setInterval(() => {
  setTime(prev => (prev + 1) % 61); // Loops at 60
  }, 500); // Half second ticks
 }
 return () => clearInterval(timer);
 }, [isPlaying]);

 const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
 const calcLcm = (a: number, b: number) => (a * b) / gcd(a, b);

 const handleLcmCheck = () => {
 const ans = parseInt(lcmInput);
 if (isNaN(ans)) return;
 if (ans === calcLcm(lh1, lh2)) {
  setLcmFeedback({status: 'correct', msg: 'Great job! You found the Least Common Multiple.'});
 } else {
  setLcmFeedback({status: 'incorrect', msg: 'Not quite. Find the smallest number that is a multiple of both.'});
 }
 };

 // HCF State
 const [pipe1, setPipe1] = useState<number>(12);
 const [pipe2, setPipe2] = useState<number>(18);
 const [hcfInput, setHcfInput] = useState<string>('');
 const [hcfFeedback, setHcfFeedback] = useState<{status: 'correct' | 'incorrect' | null, msg: string}>({status: null, msg: ''});

 const handleHcfCheck = () => {
 const ans = parseInt(hcfInput);
 if (isNaN(ans)) return;
 if (ans === gcd(pipe1, pipe2)) {
  setHcfFeedback({status: 'correct', msg: 'Excellent! You found the Highest Common Factor.'});
 } else {
  setHcfFeedback({status: 'incorrect', msg: 'Not quite. Find the largest number that divides both equally.'});
 }
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] font-sans transition-colors duration-300">
  {/* Header */}
  <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#1c1b1b] shadow-sm z-10">
  <div className="flex items-center gap-4">
   <button
   onClick={onExit}
   className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
   title="Go Back"
   >
   <ArrowLeft className="w-6 h-6" />
   </button>
   <h1 className="text-lg md:text-xl font-bold">Class 6 Math: Factors & Multiples</h1>
  </div>
  <div className="flex bg-slate-100 dark:bg-[#121212] rounded-lg p-1">
   <button
   onClick={() => setActiveTab('LCM')}
   className={`px-4 py-2 rounded-md font-medium transition-colors ${ activeTab === 'LCM' ? ' shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-[#a1a1aa] hover:text-slate-900 dark:hover:text-slate-200' }`}
   >
   LCM (Lighthouses)
   </button>
   <button
   onClick={() => setActiveTab('HCF')}
   className={`px-4 py-2 rounded-md font-medium transition-colors ${ activeTab === 'HCF' ? ' shadow-sm text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-[#a1a1aa] hover:text-slate-900 dark:hover:text-slate-200' }`}
   >
   HCF (Pipe Cutting)
   </button>
  </div>
  </header>

  {/* Main 2-Column Layout */}
  <div className="flex flex-1 overflow-hidden">
  
  {/* Left Column: Controls & Workspace */}
  <div className="w-1/2 p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6">
   {activeTab === 'LCM' ? (
   <>
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
    <h2 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-2">
     <Info className="w-5 h-5" /> Mission: Synchronize Lighthouses
    </h2>
    <p className="text-sm text-blue-700 dark:text-blue-400">
     Two lighthouses flash at different intervals. Find the time when they will flash together! This is the <strong>Least Common Multiple (LCM)</strong> of their intervals.
    </p>
    </div>

    <div className="space-y-4">
    <h3 className="font-semibold text-lg">Settings</h3>
    
    <div className="flex flex-col gap-2">
     <label className="text-sm font-medium">Lighthouse A flashes every: {lh1} seconds</label>
     <input 
     type="range" min="2" max="10" value={lh1} 
     onChange={(e) => {setLh1(parseInt(e.target.value)); setTime(0); setIsPlaying(false); setLcmFeedback({status:null,msg:''});}}
     className="w-full accent-blue-600"
     />
    </div>

    <div className="flex flex-col gap-2">
     <label className="text-sm font-medium">Lighthouse B flashes every: {lh2} seconds</label>
     <input 
     type="range" min="2" max="10" value={lh2} 
     onChange={(e) => {setLh2(parseInt(e.target.value)); setTime(0); setIsPlaying(false); setLcmFeedback({status:null,msg:''});}}
     className="w-full accent-red-600"
     />
    </div>
    </div>

    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] mt-auto">
    <h3 className="font-semibold text-lg mb-3">Solve</h3>
    <p className="text-sm mb-4">When will both lighthouses flash at the exactly same time next?</p>
    
    <div className="flex gap-3">
     <input 
     type="number"
     value={lcmInput}
     onChange={(e) => setLcmInput(e.target.value)}
     placeholder="Enter time in sec"
     className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-slate-300 dark:border-[#1c1b1b] focus:ring-2 focus:ring-blue-500 outline-none"
     />
     <button 
     onClick={handleLcmCheck}
     className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
     >
     Check
     </button>
    </div>

    {lcmFeedback.status && (
     <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${ lcmFeedback.status === 'correct' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }`}>
     {lcmFeedback.status === 'correct' ? <Check className="w-5 h-5 shrink-0 mt-0.5" /> : <X className="w-5 h-5 shrink-0 mt-0.5" />}
     <p className="text-sm">{lcmFeedback.msg}</p>
     </div>
    )}
    </div>
   </>
   ) : (
   <>
    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/50">
    <h2 className="text-lg font-bold text-green-800 dark:text-green-300 flex items-center gap-2 mb-2">
     <Info className="w-5 h-5" /> Mission: Cut the Pipes
    </h2>
    <p className="text-sm text-green-700 dark:text-green-400">
     You have two pipes of different lengths. You need to cut them into smaller pieces of <strong>equal maximum length</strong> with no leftovers. This is the <strong>Highest Common Factor (HCF)</strong>.
    </p>
    </div>

    <div className="space-y-4">
    <h3 className="font-semibold text-lg">Settings</h3>
    
    <div className="flex flex-col gap-2">
     <label className="text-sm font-medium">Pipe A Length: {pipe1} m</label>
     <input 
     type="range" min="4" max="36" step="2" value={pipe1} 
     onChange={(e) => {setPipe1(parseInt(e.target.value)); setHcfFeedback({status:null,msg:''});}}
     className="w-full accent-green-600"
     />
    </div>

    <div className="flex flex-col gap-2">
     <label className="text-sm font-medium">Pipe B Length: {pipe2} m</label>
     <input 
     type="range" min="4" max="36" step="2" value={pipe2} 
     onChange={(e) => {setPipe2(parseInt(e.target.value)); setHcfFeedback({status:null,msg:''});}}
     className="w-full accent-emerald-600"
     />
    </div>
    </div>

    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] mt-auto">
    <h3 className="font-semibold text-lg mb-3">Solve</h3>
    <p className="text-sm mb-4">What is the maximum equal length you can cut both pipes into?</p>
    
    <div className="flex gap-3">
     <input 
     type="number"
     value={hcfInput}
     onChange={(e) => setHcfInput(e.target.value)}
     placeholder="Enter length in m"
     className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-slate-300 dark:border-[#1c1b1b] focus:ring-2 focus:ring-green-500 outline-none"
     />
     <button 
     onClick={handleHcfCheck}
     className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
     >
     Check
     </button>
    </div>

    {hcfFeedback.status && (
     <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${ hcfFeedback.status === 'correct' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }`}>
     {hcfFeedback.status === 'correct' ? <Check className="w-5 h-5 shrink-0 mt-0.5" /> : <X className="w-5 h-5 shrink-0 mt-0.5" />}
     <p className="text-sm">{hcfFeedback.msg}</p>
     </div>
    )}
    </div>
   </>
   )}
  </div>

  {/* Right Column: Simulation Stage */}
  <div className="w-1/2 bg-slate-100 dark:bg-[#121212] p-6 flex flex-col relative overflow-hidden">
   {activeTab === 'LCM' ? (
   <div className="flex flex-col h-full">
    {/* Controls */}
    <div className="flex justify-center gap-4 mb-8">
    <button 
     onClick={() => setIsPlaying(!isPlaying)}
     className="flex items-center gap-2 px-4 py-2 bg-[#121212] dark:bg-slate-200 text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors shadow-sm"
    >
     {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
     {isPlaying ? 'Pause' : 'Start Timeline'}
    </button>
    <button 
     onClick={() => {setTime(0); setIsPlaying(false);}}
     className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-[#ffffff] rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-[#1c1b1b] shadow-sm"
    >
     <RotateCcw className="w-5 h-5" /> Reset
    </button>
    </div>

    {/* Timer */}
    <div className="text-center mb-12">
    <div className="inline-block bg-[#121212] dark:bg-[#121212] text-white font-mono text-3xl px-6 py-3 rounded-xl border-4 border-[#1c1b1b] shadow-inner">
     T = {time}s
    </div>
    </div>

    {/* Lighthouses SVG */}
    <div className="flex-1 min-w-0 relative flex justify-center items-end pb-12">
    {/* Ground */}
    <div className="absolute bottom-0 w-full h-12 bg-[#121212] dark:bg-slate-950 rounded-t-full opacity-50 blur-sm"></div>
    <div className="absolute bottom-0 w-full h-8 bg-slate-700 dark:bg-[#121212] border-t border-slate-600"></div>

    <div className="flex justify-around w-full max-w-lg relative z-10">
     {/* Lighthouse A */}
     <div className="flex flex-col items-center">
     <div className="relative w-16 h-48 bg-gradient-to-t from-slate-300 to-white dark:from-slate-600 dark:to-slate-400 rounded-t-full shadow-lg overflow-hidden border-2 border-slate-400 dark:border-[#1c1b1b]">
      {/* Stripes */}
      <div className="w-full h-8 bg-blue-500 dark:bg-blue-700 mt-8 shadow-sm"></div>
      <div className="w-full h-8 bg-blue-500 dark:bg-blue-700 mt-8 shadow-sm"></div>
      <div className="w-full h-8 bg-blue-500 dark:bg-blue-700 mt-8 shadow-sm"></div>
     </div>
     {/* Light Bulb */}
     <div className={`absolute top-[-24px] w-24 h-24 rounded-full blur-xl transition-opacity duration-300 ${ time > 0 && time % lh1 === 0 ? 'bg-yellow-300 opacity-100' : 'bg-transparent opacity-0' }`}></div>
     <div className={`absolute top-[-16px] w-12 h-12 rounded-full z-10 border-2 border-slate-300 transition-colors duration-100 flex items-center justify-center ${ time > 0 && time % lh1 === 0 ? 'bg-yellow-100 shadow-[0_0_50px_rgba(253,224,71,1)]' : 'bg-slate-200 dark:bg-slate-700' }`}>
      <div className={`w-4 h-4 rounded-full ${time > 0 && time % lh1 === 0 ? 'bg-yellow-400' : 'bg-slate-400'}`}></div>
     </div>
     <span className="mt-4 font-bold text-blue-700 dark:text-blue-400 bg-blue-100/50 dark:bg-[#121212] px-3 py-1 rounded-full shadow-sm">Every {lh1}s</span>
     </div>

     {/* Lighthouse B */}
     <div className="flex flex-col items-center">
     <div className="relative w-16 h-48 bg-gradient-to-t from-slate-300 to-white dark:from-slate-600 dark:to-slate-400 rounded-t-full shadow-lg overflow-hidden border-2 border-slate-400 dark:border-[#1c1b1b]">
      {/* Stripes */}
      <div className="w-full h-8 bg-red-500 dark:bg-red-700 mt-8 shadow-sm"></div>
      <div className="w-full h-8 bg-red-500 dark:bg-red-700 mt-8 shadow-sm"></div>
      <div className="w-full h-8 bg-red-500 dark:bg-red-700 mt-8 shadow-sm"></div>
     </div>
     {/* Light Bulb */}
     <div className={`absolute top-[-24px] w-24 h-24 rounded-full blur-xl transition-opacity duration-300 ${ time > 0 && time % lh2 === 0 ? 'bg-yellow-300 opacity-100' : 'bg-transparent opacity-0' }`}></div>
     <div className={`absolute top-[-16px] w-12 h-12 rounded-full z-10 border-2 border-slate-300 transition-colors duration-100 flex items-center justify-center ${ time > 0 && time % lh2 === 0 ? 'bg-yellow-100 shadow-[0_0_50px_rgba(253,224,71,1)]' : 'bg-slate-200 dark:bg-slate-700' }`}>
      <div className={`w-4 h-4 rounded-full ${time > 0 && time % lh2 === 0 ? 'bg-yellow-400' : 'bg-slate-400'}`}></div>
     </div>
     <span className="mt-4 font-bold text-red-700 dark:text-red-400 bg-red-100/50 dark:bg-[#121212] px-3 py-1 rounded-full shadow-sm">Every {lh2}s</span>
     </div>
    </div>
    </div>

    {/* Timeline Ticks */}
    <div className="h-16 w-full flex items-end">
    <div className="w-full flex justify-between px-8 border-t-2 border-slate-300 dark:border-[#1c1b1b] pt-2 relative">
     {[...Array(11)].map((_, i) => (
     <div key={i} className="flex flex-col items-center">
      <div className="w-0.5 h-3 bg-slate-400 dark:bg-slate-500 mb-1"></div>
      <span className="text-xs font-medium text-slate-500 dark:text-[#71717a]">{i * 6}</span>
     </div>
     ))}
     {/* Progress marker */}
     <div 
     className="absolute top-0 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full -translate-y-2 shadow-md transition-all duration-300 ease-linear dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
     style={{ left: `calc(2rem + ((100% - 4rem) * ${Math.min(time, 60) / 60}))` }}
     />
    </div>
    </div>
   </div>
   ) : (
   <div className="flex flex-col h-full justify-center">
    <div className="flex-1 min-w-0 flex flex-col justify-center items-center gap-12 w-full max-w-2xl mx-auto">
    
    {/* Pipe 1 */}
    <div className="w-full">
     <div className="flex justify-between text-sm mb-2 font-bold text-green-700 dark:text-green-400">
     <span>Pipe A</span>
     <span>{pipe1} m</span>
     </div>
     <div className="relative h-14 bg-green-500/10 dark:bg-green-500/5 rounded-r-xl border-2 border-l-0 border-green-500 rounded-l-md overflow-hidden shadow-inner">
     <div 
      className="absolute top-0 left-0 h-full bg-gradient-to-b from-green-400 to-green-600 transition-all duration-500 shadow-md border-y border-green-300"
      style={{ width: `${(pipe1 / 36) * 100}%` }}
     >
      {/* Sub-divisions if hcf is solved correctly */}
      {hcfFeedback.status === 'correct' && hcfInput && (
      <div className="w-full h-full flex">
       {[...Array(pipe1 / parseInt(hcfInput))].map((_, i) => (
       <div key={i} className="h-full border-r-2 border-green-800/40 dark:border-green-900/60 flex-1 flex items-center justify-center bg-white/10 dark:bg-[#121212]">
        <span className="text-sm font-bold text-white drop-shadow-md">{hcfInput}</span>
       </div>
       ))}
      </div>
      )}
     </div>
     </div>
    </div>

    {/* Pipe 2 */}
    <div className="w-full">
     <div className="flex justify-between text-sm mb-2 font-bold text-emerald-700 dark:text-emerald-400">
     <span>Pipe B</span>
     <span>{pipe2} m</span>
     </div>
     <div className="relative h-14 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-r-xl border-2 border-l-0 border-emerald-500 rounded-l-md overflow-hidden shadow-inner">
     <div 
      className="absolute top-0 left-0 h-full bg-gradient-to-b from-emerald-400 to-emerald-600 transition-all duration-500 shadow-md border-y border-emerald-300"
      style={{ width: `${(pipe2 / 36) * 100}%` }}
     >
      {/* Sub-divisions if hcf is solved correctly */}
      {hcfFeedback.status === 'correct' && hcfInput && (
      <div className="w-full h-full flex">
       {[...Array(pipe2 / parseInt(hcfInput))].map((_, i) => (
       <div key={i} className="h-full border-r-2 border-emerald-800/40 dark:border-emerald-900/60 flex-1 flex items-center justify-center bg-white/10 dark:bg-[#121212]">
        <span className="text-sm font-bold text-white drop-shadow-md">{hcfInput}</span>
       </div>
       ))}
      </div>
      )}
     </div>
     </div>
    </div>

    {/* Ruler for reference */}
    <div className="w-full mt-8 bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
     <div className="flex justify-between w-full relative pt-2">
     <div className="absolute top-0 w-full border-t-2 border-slate-300 dark:border-[#1c1b1b]"></div>
     {[...Array(10)].map((_, i) => (
      <div key={i} className="flex flex-col items-center -mt-2">
      <div className="w-0.5 h-3 bg-slate-400 dark:bg-slate-500 mb-2"></div>
      <span className="text-xs font-bold text-slate-500 dark:text-[#71717a]">{i * 4}</span>
      </div>
     ))}
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
