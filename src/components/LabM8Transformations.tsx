import { useState } from 'react';
import { ArrowLeft, RotateCw, FlipHorizontal, Maximize, CheckCircle, XCircle } from 'lucide-react';

type TransformationMode = 'rotation' | 'reflection' | 'dilation';

export default function LabM8Transformations({ onExit }: { onExit?: () => void }) {
 const [mode, setMode] = useState<TransformationMode>('rotation');

 // Rotation State
 const [angle, setAngle] = useState(0);
 const targetAngle = 90;
 
 // Reflection State
 const [mirrorX, setMirrorX] = useState(0);
 const targetMirrorX = 40;

 // Dilation State
 const [scale, setScale] = useState(1);
 const targetScale = 2.5;

 const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 const handleCheck = () => {
 let isCorrect = false;
 if (mode === 'rotation' && angle === targetAngle) isCorrect = true;
 if (mode === 'reflection' && mirrorX === targetMirrorX) isCorrect = true;
 if (mode === 'dilation' && scale === targetScale) isCorrect = true;

 setFeedback(isCorrect ? 'correct' : 'incorrect');
 setTimeout(() => setFeedback('idle'), 3000);
 };

 const renderControls = () => {
 switch (mode) {
  case 'rotation':
  return (
   <div className="space-y-4">
   <h3 className="text-xl font-semibold dark:text-[#ffffff]">Gear Rotation</h3>
   <p className="text-slate-700 dark:text-[#a1a1aa]">
    Rotate the turbine gear by {targetAngle}° clockwise to align with the generator shaft.
   </p>
   <div className="flex flex-col gap-2">
    <label className="text-sm font-medium dark:text-[#ffffff]">Angle: {angle}°</label>
    <input 
    type="range" 
    min="0" 
    max="360" 
    step="15" 
    value={angle}
    onChange={(e) => setAngle(Number(e.target.value))}
    className="w-full accent-blue-600"
    />
   </div>
   </div>
  );
  case 'reflection':
  return (
   <div className="space-y-4">
   <h3 className="text-xl font-semibold dark:text-[#ffffff]">Mirror Reflection</h3>
   <p className="text-slate-700 dark:text-[#a1a1aa]">
    Move the mirror line to x = {targetMirrorX} to reflect the laser beam perfectly onto the target sensor.
   </p>
   <div className="flex flex-col gap-2">
    <label className="text-sm font-medium dark:text-[#ffffff]">Mirror Position (x): {mirrorX}</label>
    <input 
    type="range" 
    min="-100" 
    max="100" 
    step="10" 
    value={mirrorX}
    onChange={(e) => setMirrorX(Number(e.target.value))}
    className="w-full accent-emerald-600"
    />
   </div>
   </div>
  );
  case 'dilation':
  return (
   <div className="space-y-4">
   <h3 className="text-xl font-semibold dark:text-[#ffffff]">Photography Dilation</h3>
   <p className="text-slate-700 dark:text-[#a1a1aa]">
    Set the scale factor to {targetScale} to enlarge the digital photograph to fit the print frame perfectly.
   </p>
   <div className="flex flex-col gap-2">
    <label className="text-sm font-medium dark:text-[#ffffff]">Scale Factor: {scale.toFixed(1)}x</label>
    <input 
    type="range" 
    min="0.5" 
    max="3" 
    step="0.5" 
    value={scale}
    onChange={(e) => setScale(Number(e.target.value))}
    className="w-full accent-amber-600"
    />
   </div>
   </div>
  );
 }
 };

 const renderSimulation = () => {
 switch (mode) {
  case 'rotation':
  return (
   <svg viewBox="-100 -100 200 200" className="w-full h-full max-h-[60vh]">
   <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-700" />
    </pattern>
   </defs>
   <rect x="-100" y="-100" width="200" height="200" fill="url(#grid)" />
   {/* Target outline */}
   <g transform={`rotate(${targetAngle})`} opacity="0.3">
    <path d="M 0 -50 L 20 -20 L 50 0 L 20 20 L 0 50 L -20 20 L -50 0 L -20 -20 Z" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
   </g>
   {/* Rotating object */}
   <g transform={`rotate(${angle})`} className="transition-transform duration-300 ease-out">
    <path d="M 0 -50 L 20 -20 L 50 0 L 20 20 L 0 50 L -20 20 L -50 0 L -20 -20 Z" fill="#3b82f6" fillOpacity="0.8" stroke="#1d4ed8" strokeWidth="2" />
    <circle cx="0" cy="0" r="5" fill="#1e293b" />
   </g>
   </svg>
  );
  case 'reflection':
  return (
   <svg viewBox="-100 -100 200 200" className="w-full h-full max-h-[60vh]">
   <defs>
    <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-700" />
    </pattern>
   </defs>
   <rect x="-100" y="-100" width="200" height="200" fill="url(#grid2)" />
   <line x1="0" y1="-100" x2="0" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.5" className="text-slate-400" />
   <line x1="-100" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="1" opacity="0.5" className="text-slate-400" />
   
   {/* Original Shape */}
   <path d="M -80 -20 L -40 -20 L -40 -60 Z" fill="#10b981" fillOpacity="0.8" stroke="#047857" strokeWidth="2" />
   <text x="-65" y="-10" fontSize="10" fill="currentColor" className="dark:text-[#a1a1aa]">Original</text>

   {/* Mirror Line */}
   <line x1={mirrorX} y1="-100" x2={mirrorX} y2="100" stroke="#ef4444" strokeWidth="3" strokeDasharray="6" className="transition-all duration-300" />
   
   {/* Reflected Shape */}
   <g transform={`translate(${mirrorX * 2}, 0) scale(-1, 1)`} className="transition-all duration-300 ease-out">
    <path d="M -80 -20 L -40 -20 L -40 -60 Z" fill="#34d399" fillOpacity="0.5" stroke="#047857" strokeWidth="2" strokeDasharray="4" />
   </g>
   <text x={mirrorX + (mirrorX - (-60))} y="-10" fontSize="10" fill="currentColor" className="dark:text-[#a1a1aa] transition-all duration-300">Reflected</text>
   </svg>
  );
  case 'dilation':
  return (
   <svg viewBox="-100 -100 200 200" className="w-full h-full max-h-[60vh]">
   <defs>
    <pattern id="grid3" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-700" />
    </pattern>
   </defs>
   <rect x="-100" y="-100" width="200" height="200" fill="url(#grid3)" />
   
   {/* Center of Dilation */}
   <circle cx="0" cy="0" r="3" fill="#ef4444" />
   <text x="5" y="-5" fontSize="10" fill="#ef4444">Center (0,0)</text>

   {/* Target Frame */}
   <rect x={-20 * targetScale} y={-15 * targetScale} width={40 * targetScale} height={30 * targetScale} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
   
   {/* Original / Dilated Image */}
   <g transform={`scale(${scale})`} className="transition-transform duration-300 ease-out">
    <rect x="-20" y="-15" width="40" height="30" fill="#f59e0b" fillOpacity="0.8" stroke="#b45309" strokeWidth={2 / scale} />
    <circle cx="0" cy="0" r={8 / scale} fill="#fef3c7" opacity="0.5" />
    <path d={`M -10 5 L 0 -5 L 10 5`} fill="none" stroke="#b45309" strokeWidth={2 / scale} />
   </g>
   </svg>
  );
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-900 dark:text-[#ffffff]">
  <header className="flex items-center p-4 shadow-sm z-10 border-b border-slate-200 dark:border-[#1c1b1b]">
  <button
   onClick={onExit}
   className="mr-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap flex-shrink-0"
  >
   <ArrowLeft size={24} />
  </button>
  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
   Unit 8: Transformations Lab
  </h1>
  </header>

  <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
  {/* Left Column: Interactive Controls */}
  <div className="w-full lg:w-1/3 p-6 shadow-lg lg:overflow-y-auto flex flex-col gap-8 border-r border-slate-200 dark:border-[#1c1b1b]">
   <div className="space-y-4">
   <h2 className="text-lg font-semibold dark:text-[#ffffff]">Select Mode</h2>
   <div className="flex flex-wrap gap-2">
    <button
    onClick={() => setMode('rotation')}
    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium whitespace-nowrap flex-shrink-0 transition-colors ${ mode === 'rotation' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-[#ffffff] hover:bg-slate-200 dark:hover:bg-slate-600' }`}
    >
    <RotateCw size={18} /> Rotation
    </button>
    <button
    onClick={() => setMode('reflection')}
    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium whitespace-nowrap flex-shrink-0 transition-colors ${ mode === 'reflection' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-[#ffffff] hover:bg-slate-200 dark:hover:bg-slate-600' }`}
    >
    <FlipHorizontal size={18} /> Reflection
    </button>
    <button
    onClick={() => setMode('dilation')}
    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium whitespace-nowrap flex-shrink-0 transition-colors ${ mode === 'dilation' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-[#ffffff] hover:bg-slate-200 dark:hover:bg-slate-600' }`}
    >
    <Maximize size={18} /> Dilation
    </button>
   </div>
   </div>

   <div className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-700/50 p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
   {renderControls()}
   </div>

   <div className="space-y-4">
   <button
    onClick={handleCheck}
    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors whitespace-nowrap flex-shrink-0 flex justify-center items-center gap-2 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    <CheckCircle size={20} />
    Check Answer
   </button>
   
   {feedback === 'correct' && (
    <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-2">
    <CheckCircle size={20} /> Great job! Transformation is perfectly aligned.
    </div>
   )}
   {feedback === 'incorrect' && (
    <div className="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 rounded-lg flex items-center gap-2">
    <XCircle size={20} /> Not quite right. Adjust and try again!
    </div>
   )}
   </div>
  </div>

  {/* Right Column: Simulation Stage */}
  <div className="w-full lg:w-2/3 p-6 bg-slate-100 dark:bg-[#121212] flex flex-col items-center justify-center relative overflow-hidden">
   <div className="absolute top-4 left-4 text-slate-500 dark:text-[#71717a] font-mono text-sm bg-white/80 dark:bg-[#121212]/80 px-3 py-1 rounded shadow-sm backdrop-blur">
   Simulation Stage: {mode.charAt(0).toUpperCase() + mode.slice(1)}
   </div>
   <div className="w-full max-w-2xl aspect-square bg-white dark:!bg-[#121212] rounded-2xl shadow-xl border border-slate-200 dark:border-[#1c1b1b] p-4 flex items-center justify-center overflow-hidden">
   {renderSimulation()}
   </div>
  </div>
  </div>
 </div>
 );
}
