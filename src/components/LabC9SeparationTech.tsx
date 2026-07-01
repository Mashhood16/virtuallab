import { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
 onExit?: () => void;
}

export default function LabC9SeparationTech({ onExit }: Props) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [activeTab, setActiveTab] = useState<'distillation' | 'chromatography'>('distillation');
 
 // Distillation state
 const [distillationRunning, setDistillationRunning] = useState(false);
 const [temperature, setTemperature] = useState(20);
 const [volumeCollected, setVolumeCollected] = useState(0);
 
 // Chromatography state
 const [chromaRunning, setChromaRunning] = useState(false);
 const [solventHeight, setSolventHeight] = useState(0);
 const [spot1Height, setSpot1Height] = useState(0);
 const [spot2Height, setSpot2Height] = useState(0);

 // Distillation effect
 useEffect(() => {
 let interval: number;
 if (distillationRunning) {
  interval = window.setInterval(() => {
  setTemperature(prev => {
   if (prev < 100) return prev + 2;
   return prev;
  });
  }, 100);
 }
 return () => clearInterval(interval);
 }, [distillationRunning]);

 useEffect(() => {
 let interval: number;
 if (distillationRunning && temperature >= 100) {
  interval = window.setInterval(() => {
  setVolumeCollected(prev => {
   if (prev < 50) return prev + 0.5;
   return prev;
  });
  }, 100);
 }
 return () => clearInterval(interval);
 }, [distillationRunning, temperature]);

 // Chromatography effect
 useEffect(() => {
 let interval: number;
 if (chromaRunning) {
  interval = window.setInterval(() => {
  setSolventHeight(prev => {
   if (prev < 200) return prev + 1;
   return prev;
  });
  setSpot1Height(prev => {
   if (prev < 200 * 0.4) return prev + 1 * 0.4;
   return prev;
  });
  setSpot2Height(prev => {
   if (prev < 200 * 0.8) return prev + 1 * 0.8;
   return prev;
  });
  }, 50);
 }
 return () => clearInterval(interval);
 }, [chromaRunning]);

 const resetDistillation = () => {
 setDistillationRunning(false);
 setTemperature(20);
 setVolumeCollected(0);
 };

 const resetChroma = () => {
 setChromaRunning(false);
 setSolventHeight(0);
 setSpot1Height(0);
 setSpot2Height(0);
 };

 // Assessment
 const [answer1, setAnswer1] = useState('');
 const [feedback1, setFeedback1] = useState('');

 const checkAnswer = () => {
 const val = parseFloat(answer1);
 if (!isNaN(val) && Math.abs(val - 0.8) < 0.05) {
  setFeedback1('Correct! Rf = Distance moved by spot / Distance moved by solvent = 160 / 200 = 0.8');
 } else {
  setFeedback1('Incorrect. Remember: Rf = (Distance moved by spot) / (Distance moved by solvent). For the Blue dye, it moved 160mm when the solvent moved 200mm.');
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Grade 9 Chemistry: Separation Techniques" />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >Lab</button>
  </div>
  <main className="lg:flex-1 p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
  {/* Column 1: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 mb-4 text-blue-800 dark:text-[#ffffff]">
   <BookOpen size={24} />
   <h2 className="text-xl font-semibold">Theory & Context</h2>
   </div>
   
   <div className="space-y-4 text-slate-700 dark:text-[#ffffff]">
   <p>
    Mixtures contain different substances that are not chemically bonded. We use various physical processes to separate them based on their properties.
   </p>
   
   <div className={`bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
    <h3 className="font-bold text-blue-900 mb-2 dark:text-[#ffffff]">1. Simple Distillation</h3>
    <p className="text-sm">
    Used to separate a liquid from a solution (e.g., pure water from salty water). The solution is heated until the liquid boils into a vapor. The vapor is then cooled in a condenser, turning back into a pure liquid (distillate).
    </p>
   </div>

   <div className={`bg-indigo-50 p-4 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    <h3 className="font-bold text-indigo-900 mb-2 dark:text-[#ffffff]">2. Paper Chromatography</h3>
    <p className="text-sm">
    Used to separate mixtures of soluble substances, such as colored dyes. As a solvent moves up the paper, it carries the dyes at different speeds depending on their solubility.
    </p>
    <div className="mt-3 bg-slate-50 dark:bg-[#121212] p-3 rounded border border-indigo-200">
    <div className="text-sm font-semibold mb-1 text-indigo-800 dark:text-[#ffffff]">
     Retention Factor (Rf):
    </div>
    <p className="text-sm italic text-slate-600 dark:text-[#a1a1aa] font-mono">
     Rf = Distance moved by substance ÷ Distance moved by solvent
    </p>
    </div>
   </div>
   </div>
  </div>

  {/* Column 2: Simulator */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col lg:h-[600px] lg:h-auto ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
   <div className="flex gap-4 mb-4 shrink-0">
   <button 
    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'distillation' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
    onClick={() => setActiveTab('distillation')}
   >
    Distillation
   </button>
   <button 
    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'chromatography' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
    onClick={() => setActiveTab('chromatography')}
   >
    Chromatography
   </button>
   </div>

   <div className="flex-1 relative flex items-center justify-center bg-slate-50 dark:bg-[#121212] rounded-xl overflow-hidden border border-slate-200 dark:border-[#1c1b1b]">
   {activeTab === 'distillation' && (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
    <svg viewBox="0 0 400 300" className="w-full max-w-md h-auto">
     {/* Heat source */}
     <rect x="70" y="240" width="60" height="20" fill="#cbd5e1" rx="5" />
     {distillationRunning && (
     <path d="M85,240 Q90,220 95,240 T105,240 T115,240" fill="none" stroke="#ef4444" strokeWidth="4" className="animate-pulse" />
     )}
     {/* Flask Outline */}
     <path d="M85,165 L85,100 L115,100 L115,165" fill="none" stroke="#475569" strokeWidth="3" />
     <circle cx="100" cy="200" r="40" fill="rgba(191, 219, 254, 0.2)" stroke="#475569" strokeWidth="3" />
     
     {/* Solution inside flask */}
     <path d="M63,215 Q100,215 137,215 A40,40 0 0,1 63,215 Z" fill="#3b82f6" opacity="0.6" />
     
     {/* Condenser Tube */}
     <path d="M115,120 L280,180" fill="none" stroke="#475569" strokeWidth="12" opacity="0.2" />
     <path d="M115,120 L280,180" fill="none" stroke="#e2e8f0" strokeWidth="8" />
     
     {/* Condenser outer cooling jacket */}
     <polygon points="140,110 260,150 240,195 130,155" fill="rgba(56, 189, 248, 0.2)" stroke="#0ea5e9" strokeWidth="2" />

     {/* Vapors */}
     {temperature >= 100 && (
     <g>
      <circle cx="100" cy="150" r="5" fill="#93c5fd" className="animate-ping" />
      <circle cx="150" cy="130" r="4" fill="#93c5fd" className="animate-ping" style={{animationDelay: '0.2s'}} />
      <circle cx="200" cy="150" r="4" fill="#93c5fd" className="animate-ping" style={{animationDelay: '0.4s'}} />
     </g>
     )}

     {/* Drips */}
     {volumeCollected > 0 && (
     <circle cx="280" cy="185" r="3" fill="#3b82f6" className="animate-bounce" />
     )}

     {/* Receiving Flask */}
     <path d="M265,220 L265,260 A30,30 0 0,0 325,260 L325,220 Z" fill="rgba(191, 219, 254, 0.3)" stroke="#475569" strokeWidth="3" />
     
     {/* Distillate */}
     {volumeCollected > 0 && (
      <rect x="268" y={260 - volumeCollected * 0.8} width="54" height={volumeCollected * 0.8} fill="#3b82f6" opacity="0.6" />
     )}

     {/* Labels */}
     <text x="20" y="40" className="text-sm font-semibold fill-slate-700">Thermometer:</text>
     <text x="20" y="60" className="text-xl font-bold fill-red-600">{temperature.toFixed(0)}°C</text>
     
     <text x="250" y="40" className="text-sm font-semibold fill-slate-700">Volume Collected:</text>
     <text x="250" y="60" className="text-xl font-bold fill-blue-600">{volumeCollected.toFixed(1)} mL</text>
    </svg>
    
    <div className="flex gap-4 mt-6 shrink-0 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
     <button 
     className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
     onClick={() => setDistillationRunning(true)}
     disabled={distillationRunning || volumeCollected >= 50}
     >
     <Play size={18} /> Heat Flask
     </button>
     <button 
     className="flex items-center gap-2 px-6 py-2 bg-slate-600 dark:bg-[#121212] text-white rounded-lg hover:bg-slate-700 dark:bg-[#121212] transition-colors dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent"
     onClick={resetDistillation}
     >
     <RotateCcw size={18} /> Reset
     </button>
    </div>
    </div>
   )}

   {activeTab === 'chromatography' && (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
    <svg viewBox="0 0 300 400" className="w-full max-w-sm h-auto">
     {/* Beaker */}
     <path d="M50,100 L50,350 A20,20 0 0,0 70,370 L230,370 A20,20 0 0,0 250,350 L250,100" fill="none" stroke="#94a3b8" strokeWidth="4" />
     
     {/* Solvent pool */}
     <rect x="52" y="320" width="196" height="48" fill="#bae6fd" opacity="0.5" />
     
     {/* Paper */}
     <rect x="100" y="50" width="100" height="300" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
     
     {/* Solvent Front on Paper */}
     {solventHeight > 0 && (
     <rect x="100" y={320 - solventHeight} width="100" height={solventHeight} fill="#bae6fd" opacity="0.4" />
     )}

     {/* Baseline */}
     <line x1="105" y1="300" x2="195" y2="300" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
     <text x="205" y="304" className="text-xs fill-slate-500 font-medium">Baseline</text>
     
     {/* Spots */}
     <circle cx="150" cy={300 - spot1Height} r="6" fill="#ef4444" opacity={chromaRunning ? 0.7 : 1} />
     <circle cx="150" cy={300 - spot2Height} r="6" fill="#3b82f6" opacity={chromaRunning ? 0.7 : 1} />

     {/* Scale line */}
     <line x1="80" y1="300" x2="80" y2={300 - solventHeight} stroke="#64748b" strokeWidth="2" />
     {solventHeight > 0 && (
     <text x="35" y={300 - solventHeight/2} className="text-xs font-bold fill-slate-700">{solventHeight.toFixed(0)} mm</text>
     )}
    </svg>

    <div className="flex gap-4 mt-6 shrink-0">
     <button 
     className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
     onClick={() => setChromaRunning(true)}
     disabled={chromaRunning || solventHeight >= 200}
     >
     <Play size={18} /> Run Solvent
     </button>
     <button 
     className="flex items-center gap-2 px-6 py-2 bg-slate-600 dark:bg-[#121212] text-white rounded-lg hover:bg-slate-700 dark:bg-[#121212] transition-colors dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent"
     onClick={resetChroma}
     >
     <RotateCcw size={18} /> Reset
     </button>
    </div>
    </div>
   )}
   </div>
  </div>

  {/* Column 3: Assessment */}
  <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto">
   <div className="flex items-center gap-2 mb-4 text-green-800 dark:text-[#ffffff]">
   <CheckCircle size={24} />
   <h2 className="text-xl font-semibold">Assessment</h2>
   </div>

   <div className="space-y-6">
   <div className="p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-3">Live Data Collection</h3>
    {activeTab === 'distillation' ? (
    <div className="text-sm text-slate-700 dark:text-[#ffffff] space-y-2 bg-slate-50 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b]">
     <div className="flex justify-between border-b pb-1">
     <span>Target Boiling Point:</span>
     <span className="font-mono font-bold">100.0°C</span>
     </div>
     <div className="flex justify-between border-b pb-1">
     <span>Current Temperature:</span>
     <span className="font-mono font-bold text-red-600">{temperature.toFixed(1)}°C</span>
     </div>
     <div className="flex justify-between">
     <span>Volume Collected:</span>
     <span className="font-mono font-bold text-blue-600">{volumeCollected.toFixed(1)} mL</span>
     </div>
    </div>
    ) : (
    <div className="text-sm text-slate-700 dark:text-[#ffffff] space-y-2 bg-slate-50 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b]">
     <div className="flex justify-between border-b pb-1">
     <span>Solvent Front Moved:</span>
     <span className="font-mono font-bold">{solventHeight.toFixed(0)} mm</span>
     </div>
     <div className="flex justify-between border-b pb-1">
     <span>Red Dye Moved:</span>
     <span className="font-mono font-bold text-red-600">{spot1Height.toFixed(0)} mm</span>
     </div>
     <div className="flex justify-between">
     <span>Blue Dye Moved:</span>
     <span className="font-mono font-bold text-blue-600">{spot2Height.toFixed(0)} mm</span>
     </div>
    </div>
    )}
   </div>

   <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900">
    <label className="block text-sm font-semibold text-blue-900 dark:text-[#ffffff]">
    Calculate the Rf value for the Blue dye when the solvent front is at 200 mm.
    </label>
    <input 
    type="number"
    step="0.01"
    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
    placeholder="Enter Rf value (e.g. 0.50)"
    value={answer1}
    onChange={e => setAnswer1(e.target.value)}
    />
    <button 
    onClick={checkAnswer}
    className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
    Check Answer
    </button>
    
    {feedback1 && (
    <div className={`p-3 rounded-md text-sm font-medium ${feedback1.startsWith('Correct') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
     {feedback1}
    </div>
    )}
   </div>
   
   <div className="mt-8 pt-6">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-3">Critical Thinking</h3>
    <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-[#a1a1aa] space-y-3">
    <li>Why is the condenser in a distillation setup angled slightly downwards rather than upwards?</li>
    <li>In chromatography, why must the baseline be drawn in pencil rather than ink?</li>
    <li>What does an Rf value of 1.0 indicate about a substance's interaction with the paper vs the solvent?</li>
    </ul>
   </div>
   </div>
  </div>
  </main>
 </div>
 );
}
