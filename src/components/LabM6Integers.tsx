import { useState } from 'react';
import { ArrowLeft, Check, X, Info } from 'lucide-react';

export default function LabM6Integers({ onExit }: { onExit?: () => void }) {
 const [activeTab, setActiveTab] = useState<'TEMP' | 'DEPTH'>('TEMP');

 // Temp State
 const [tempValue, setTempValue] = useState<number>(0);
 const [tempAns, setTempAns] = useState<string>('');
 const [tempFeedback, setTempFeedback] = useState<{status: 'correct' | 'incorrect' | null, msg: string}>({status: null, msg: ''});

 const handleTempCheck = () => {
 if (parseInt(tempAns) === 250) {
  setTempFeedback({status: 'correct', msg: 'Awesome! 120 - (-130) = 250. You calculated the difference correctly.'});
 } else {
  setTempFeedback({status: 'incorrect', msg: 'Not quite. Subtract the smaller number from the larger number: 120 - (-130).'});
 }
 };

 // Depth State
 const [depthValue, setDepthValue] = useState<number>(0);
 const [depthAns, setDepthAns] = useState<string>('');
 const [depthFeedback, setDepthFeedback] = useState<{status: 'correct' | 'incorrect' | null, msg: string}>({status: null, msg: ''});

 const handleDepthCheck = () => {
 if (parseInt(depthAns) === -25) {
  setDepthFeedback({status: 'correct', msg: 'Spot on! -40 + 15 = -25. The submarine is at -25 meters.'});
 } else {
  setDepthFeedback({status: 'incorrect', msg: 'Try again. If you are at -40 and move up (+15), where do you land on the number line?'});
 }
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] font-sans transition-colors duration-300">
  {/* Header */}
  <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#1c1b1b] shadow-sm z-10">
  <div className="flex items-center gap-4">
   <button onClick={onExit} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors" title="Go Back">
   <ArrowLeft className="w-6 h-6" />
   </button>
   <h1 className="text-lg md:text-xl font-bold">Class 6 Math: Integers</h1>
  </div>
  <div className="flex bg-slate-100 dark:bg-[#121212] rounded-lg p-1">
   <button
   onClick={() => setActiveTab('TEMP')}
   className={`px-4 py-2 rounded-md font-medium transition-colors ${ activeTab === 'TEMP' ? ' shadow-sm text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-[#a1a1aa] hover:text-slate-900 dark:hover:text-slate-200' }`}
   >
   Temperature
   </button>
   <button
   onClick={() => setActiveTab('DEPTH')}
   className={`px-4 py-2 rounded-md font-medium transition-colors ${ activeTab === 'DEPTH' ? ' shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-[#a1a1aa] hover:text-slate-900 dark:hover:text-slate-200' }`}
   >
   Depth Gauge
   </button>
  </div>
  </header>

  {/* Main 2-Column Layout */}
  <div className="flex flex-1 overflow-hidden">
  
  {/* Left Column: Controls & Workspace */}
  <div className="w-1/2 p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6">
   {activeTab === 'TEMP' ? (
   <>
    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800/50">
    <h2 className="text-lg font-bold text-orange-800 dark:text-orange-300 flex items-center gap-2 mb-2">
     <Info className="w-5 h-5" /> Mission: Lunar Extremes
    </h2>
    <p className="text-sm text-orange-700 dark:text-orange-400">
     Temperatures on the Moon can be extremely hot or cold since there is no atmosphere. Use the thermometer to explore positive and negative integers!
    </p>
    </div>

    <div className="space-y-4">
    <h3 className="font-semibold text-lg">Interactive Thermometer</h3>
    <div className="flex flex-col gap-2">
     <label className="text-sm font-medium">Temperature: {tempValue}°C</label>
     <input 
     type="range" min="-150" max="150" value={tempValue} 
     onChange={(e) => setTempValue(parseInt(e.target.value))}
     className="w-full accent-red-500"
     />
     <div className="flex justify-between text-xs text-slate-500 dark:text-[#71717a]">
     <span>-150°C</span>
     <span>0°C</span>
     <span>150°C</span>
     </div>
    </div>
    <div className="flex gap-2 mt-4">
     <button onClick={() => setTempValue(120)} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm hover:bg-slate-200 dark:hover:bg-slate-600 font-medium">Moon Day (120°C)</button>
     <button onClick={() => setTempValue(0)} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm hover:bg-slate-200 dark:hover:bg-slate-600 font-medium">Freezing (0°C)</button>
     <button onClick={() => setTempValue(-130)} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm hover:bg-slate-200 dark:hover:bg-slate-600 font-medium">Moon Night (-130°C)</button>
    </div>
    </div>

    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] mt-auto">
    <h3 className="font-semibold text-lg mb-3">Solve</h3>
    <p className="text-sm mb-4">What is the difference in temperature between a Moon Day (120°C) and a Moon Night (-130°C)?</p>
    <div className="flex gap-3">
     <input 
     type="number"
     value={tempAns}
     onChange={(e) => setTempAns(e.target.value)}
     placeholder="Difference in °C"
     className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-slate-300 dark:border-[#1c1b1b] focus:ring-2 focus:ring-red-500 outline-none"
     />
     <button 
     onClick={handleTempCheck}
     className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"
     >
     Check
     </button>
    </div>

    {tempFeedback.status && (
     <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${ tempFeedback.status === 'correct' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }`}>
     {tempFeedback.status === 'correct' ? <Check className="w-5 h-5 shrink-0 mt-0.5" /> : <X className="w-5 h-5 shrink-0 mt-0.5" />}
     <p className="text-sm">{tempFeedback.msg}</p>
     </div>
    )}
    </div>
   </>
   ) : (
   <>
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
    <h2 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-2">
     <Info className="w-5 h-5" /> Mission: Deep Sea Exploration
    </h2>
    <p className="text-sm text-blue-700 dark:text-blue-400">
     Sea level is represented by <strong>0</strong>. Anything above sea level is positive (e.g., a flying drone), and anything below is negative (e.g., a submarine).
    </p>
    </div>

    <div className="space-y-4">
    <h3 className="font-semibold text-lg">Altitude / Depth Gauge</h3>
    <div className="flex flex-col gap-2">
     <label className="text-sm font-medium">Position: {depthValue} m</label>
     <input 
     type="range" min="-100" max="100" value={depthValue} 
     onChange={(e) => setDepthValue(parseInt(e.target.value))}
     className="w-full accent-blue-600"
     />
     <div className="flex justify-between text-xs text-slate-500 dark:text-[#71717a]">
     <span>-100m</span>
     <span>0m</span>
     <span>+100m</span>
     </div>
    </div>
    <div className="flex gap-2 mt-4">
     <button onClick={() => setDepthValue(50)} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm hover:bg-slate-200 dark:hover:bg-slate-600 font-medium">Drone (+50m)</button>
     <button onClick={() => setDepthValue(0)} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm hover:bg-slate-200 dark:hover:bg-slate-600 font-medium">Sea Level (0m)</button>
     <button onClick={() => setDepthValue(-40)} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm hover:bg-slate-200 dark:hover:bg-slate-600 font-medium">Submarine (-40m)</button>
    </div>
    </div>

    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] mt-auto">
    <h3 className="font-semibold text-lg mb-3">Solve</h3>
    <p className="text-sm mb-4">A submarine is initially at <strong>-40m</strong>. It ascends (moves up) by <strong>15m</strong>. What is its new position?</p>
    <div className="flex gap-3">
     <input 
     type="number"
     value={depthAns}
     onChange={(e) => setDepthAns(e.target.value)}
     placeholder="New depth in m"
     className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-slate-300 dark:border-[#1c1b1b] focus:ring-2 focus:ring-blue-500 outline-none"
     />
     <button 
     onClick={handleDepthCheck}
     className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
     >
     Check
     </button>
    </div>

    {depthFeedback.status && (
     <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${ depthFeedback.status === 'correct' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }`}>
     {depthFeedback.status === 'correct' ? <Check className="w-5 h-5 shrink-0 mt-0.5" /> : <X className="w-5 h-5 shrink-0 mt-0.5" />}
     <p className="text-sm">{depthFeedback.msg}</p>
     </div>
    )}
    </div>
   </>
   )}
  </div>

  {/* Right Column: Simulation Stage */}
  <div className="w-1/2 relative overflow-hidden flex flex-col bg-[#000000]">
   {activeTab === 'TEMP' ? (
   <div className={`w-full h-full flex items-center justify-center transition-colors duration-700 ${ tempValue > 50 ? 'bg-gradient-to-b from-orange-400 to-red-700' : tempValue > 0 ? 'bg-gradient-to-b from-yellow-300 to-orange-500' : tempValue > -50 ? 'bg-gradient-to-b from-sky-400 to-blue-600' : 'bg-gradient-to-b from-indigo-900 to-slate-900' }`}>
    
    {/* Thermometer Display */}
    <div className="relative flex flex-col items-center">
    
    {/* Number line ticks */}
    <div className="absolute left-[-60px] top-[10%] bottom-[10%] flex flex-col justify-between py-8 text-white font-bold drop-shadow-md">
     <span>150</span>
     <span>100</span>
     <span>50</span>
     <span>0</span>
     <span>-50</span>
     <span>-100</span>
     <span>-150</span>
    </div>
    
    {/* Thermometer Body */}
    <div className="w-12 h-96 bg-white/20 backdrop-blur-md rounded-t-full rounded-b-full border-4 border-white/50 p-1 relative flex flex-col justify-end shadow-2xl z-10 overflow-hidden dark:!bg-[#121212]">
     {/* Liquid */}
     <div 
     className="w-full bg-red-500 rounded-t-full rounded-b-full transition-all duration-500 ease-out origin-bottom dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"
     style={{ height: `${((tempValue + 150) / 300) * 100}%` }}
     ></div>
    </div>

    {/* Bulb */}
    <div className="w-24 h-24 bg-red-500 rounded-full border-4 border-white/50 -mt-10 shadow-2xl z-20 flex items-center justify-center">
     <span className="text-white font-bold text-lg drop-shadow-md">{tempValue}°</span>
    </div>

    </div>
    
    {/* Environment effects */}
    {tempValue <= -100 && (
    <div className="absolute bottom-0 w-full h-48 bg-[#121212] rounded-t-[100px] opacity-80 backdrop-blur-sm shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center">
     <span className="text-slate-400 font-bold tracking-widest uppercase">Moon Surface (Night)</span>
    </div>
    )}
    {tempValue >= 100 && (
    <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-200 rounded-full blur-2xl opacity-70"></div>
    )}
   </div>
   ) : (
   <div className="w-full h-full relative">
    {/* Sky */}
    <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-sky-300 to-sky-100 dark:from-sky-900 dark:to-sky-700"></div>
    {/* Sea */}
    <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-b from-blue-500 to-blue-900 dark:from-blue-800 dark:to-slate-950"></div>
    
    {/* Sea Level Line */}
    <div className="absolute top-1/2 w-full border-t-2 border-dashed border-white/50 flex items-center justify-start px-4 z-10">
    <span className="text-white font-bold bg-blue-600/80 px-2 py-1 rounded shadow-md text-xs -mt-8 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">Sea Level (0m)</span>
    </div>
    
    {/* Ruler Ticks */}
    <div className="absolute left-6 top-10 bottom-10 flex flex-col justify-between py-[10%] text-white font-bold text-sm drop-shadow-md z-10">
    <span>+100</span>
    <span>+50</span>
    <span>0</span>
    <span>-50</span>
    <span>-100</span>
    </div>

    {/* Dynamic Object Container */}
    <div 
    className="absolute w-full flex justify-center transition-all duration-700 ease-out z-20"
    style={{ top: `calc(${50 - (depthValue / 100) * 50}% - 2rem)` }}
    >
    {depthValue > 0 ? (
     // Drone SVG
     <div className="flex flex-col items-center">
     <div className="w-16 h-4 bg-[#121212] dark:bg-slate-200 rounded-full flex justify-between px-1 items-center">
      <div className="w-4 h-1 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse"></div>
      <div className="w-4 h-1 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse"></div>
     </div>
     <div className="w-8 h-6 bg-slate-700 dark:bg-slate-300 rounded-b-xl flex items-center justify-center">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
     </div>
     <span className="mt-2 text-white font-bold bg-[#000000]/80 px-2 py-0.5 rounded shadow-lg">{depthValue}m</span>
     </div>
    ) : (
     // Submarine SVG
     <div className="flex flex-col items-center">
     <div className="w-24 h-10 bg-yellow-400 dark:bg-yellow-500 rounded-full relative shadow-lg">
      {/* Periscope */}
      <div className="absolute top-[-12px] left-6 w-4 h-6 bg-yellow-500 rounded-t-sm dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-yellow-500/40">
      <div className="w-6 h-2 bg-yellow-600 rounded-full absolute top-0 -left-1 dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-yellow-500/40"></div>
      </div>
      {/* Window */}
      <div className="absolute top-2 right-4 w-5 h-5 bg-cyan-300 rounded-full border-2 border-yellow-600 dark:border-yellow-700 shadow-inner"></div>
      {/* Propeller */}
      <div className="absolute top-3 -left-2 w-2 h-4 bg-slate-400 rounded-sm"></div>
     </div>
     <span className="mt-2 text-white font-bold bg-blue-900/80 px-2 py-0.5 rounded shadow-lg">{depthValue}m</span>
     </div>
    )}
    </div>
   </div>
   )}
  </div>

  </div>
 </div>
 );
}
