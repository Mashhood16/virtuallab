import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, ShieldAlert, Bug } from 'lucide-react';
import LabHeader from './LabHeader';

type AgScenario = 'Pesticide' | 'AcidRain' | 'GMCrops';

export default function LabC12Agriculture({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [scenario] = useState<AgScenario>('Pesticide');
 const [parameter, setParameter] = useState<number>(5);
 const [time, setTime] = useState<number>(0);
 const [isPlaying, setIsPlaying] = useState<boolean>(false);
 const timerRef = useRef<number | null>(null);

 const [answer, setAnswer] = useState<string>('');
 const [feedback, setFeedback] = useState<string | null>(null);

 useEffect(() => {
 if (isPlaying) {
  timerRef.current = window.setInterval(() => {
  setTime(t => {
   if (t >= 10) {
   setIsPlaying(false);
   return 10;
   }
   return t + 0.1;
  });
  }, 50);
 } else if (timerRef.current !== null) {
  clearInterval(timerRef.current);
 }
 return () => {
  if (timerRef.current !== null) clearInterval(timerRef.current);
 };
 }, [isPlaying]);

 const reset = () => {
 setIsPlaying(false);
 setTime(0);
 setFeedback(null);
 setAnswer('');
 };

 const checkAnswer = () => {
 let correct = false;
 const val = parseFloat(answer);
 if (isNaN(val)) {
  setFeedback('Please enter a valid number.');
  return;
 }

 if (scenario === 'Pesticide') {
  // 100 - 5*5*2 = 50
  if (Math.abs(val - 50) < 0.5) correct = true;
 } else if (scenario === 'AcidRain') {
  // 5 * 10^(6-4.0) = 500
  if (Math.abs(val - 500) < 5) correct = true;
 } else if (scenario === 'GMCrops') {
  // 100 - 8*t*2 = 0 => t = 6.25
  if (Math.abs(val - 6.25) < 0.1) correct = true;
 }
 
 if (correct) {
  setFeedback('Correct! Excellent agrochemical analysis.');
 } else {
  setFeedback('Incorrect. Please review the kinetics equations and try again.');
 }
 };

 const renderSimulation = () => {
 if (scenario === 'Pesticide') {
  const activity = Math.max(0, 100 - parameter * time * 2);
  const achAccumulated = time * 10 * ((100 - activity) / 100);
  
  return (
  <svg viewBox="0 0 400 300" className="w-full h-64 bg-[#000000] dark:bg-[#121212] rounded-lg shadow-inner">
   <text x="20" y="30" fill="white" className="text-sm">AChE Enzyme Activity: {activity.toFixed(1)}%</text>
   
   {/* Synapse */}
   <path d="M 50 100 C 150 100, 250 100, 350 100" fill="none" stroke="#64748b" strokeWidth="8" />
   <path d="M 50 250 C 150 250, 250 250, 350 250" fill="none" stroke="#64748b" strokeWidth="8" />
   
   {/* AChE Enzymes (Blue Pacmans) */}
   <path d="M 150 230 A 15 15 0 1 1 150 250 L 160 240 Z" fill={activity > 50 ? "#3b82f6" : "#ef4444"} />
   <path d="M 250 230 A 15 15 0 1 1 250 250 L 260 240 Z" fill={activity > 10 ? "#3b82f6" : "#ef4444"} />

   {/* Acetylcholine (Green dots) accumulating */}
   {Array.from({ length: Math.min(50, Math.floor(achAccumulated)) }).map((_, i) => (
   <circle key={i} cx={100 + (i * 25) % 200 + Math.random() * 20} cy={150 + (i * 10) % 70} r="4" fill="#4ade80" />
   ))}

   {activity === 0 && <text x="120" y="180" fill="#ef4444" className="text-lg font-bold">Synaptic Overload!</text>}
  </svg>
  );
 } else if (scenario === 'AcidRain') {
  const leached = time * (10 ** (6 - parameter));
  return (
  <svg viewBox="0 0 400 300" className="w-full h-64 bg-[#000000] dark:bg-[#121212] rounded-lg shadow-inner">
   <text x="20" y="30" fill="white" className="text-sm">Ca²⁺ Leached: {leached.toFixed(0)} units</text>
   
   {/* Soil Particle */}
   <ellipse cx="200" cy="200" rx="100" ry="60" fill="#78350f" />
   
   {/* H+ Rain */}
   {Array.from({ length: isPlaying ? 20 : 0 }).map((_, i) => (
   <circle key={`h-${i}`} cx={120 + Math.random() * 160} cy={50 + (time * 50 + i * 20) % 120} r="3" fill="#ef4444" />
   ))}
   <text x="320" y="100" fill="#ef4444" className="text-xs">H⁺ Rain</text>

   {/* Leaching Ca2+ */}
   {Array.from({ length: Math.min(30, Math.floor(leached / 20)) }).map((_, i) => (
   <circle key={`ca-${i}`} cx={200 + (i * 15) % 80} cy={220 + (time * 10 + i * 5) % 80} r="5" fill="#3b82f6" />
   ))}
   {leached > 0 && <text x="250" y="270" fill="#3b82f6" className="text-xs">Ca²⁺ Leached</text>}
  </svg>
  );
 } else {
  const survival = Math.max(0, 100 - parameter * time * 2);
  return (
  <svg viewBox="0 0 400 300" className="w-full h-64 bg-[#000000] dark:bg-[#121212] rounded-lg shadow-inner">
   <text x="20" y="30" fill="white" className="text-sm">Pest Survival: {survival.toFixed(1)}%</text>
   
   {/* Leaf */}
   <path d="M 100 200 C 150 50, 300 50, 300 200 C 250 250, 150 250, 100 200 Z" fill="#22c55e" opacity="0.9" />
   {/* Veins */}
   <path d="M 120 180 Q 200 130, 280 150" fill="none" stroke="#16a34a" strokeWidth="3" />
   
   {/* Toxin Aura */}
   {parameter > 4 && (
   <ellipse cx="200" cy="150" rx="120" ry="80" fill="none" stroke="#4ade80" strokeWidth={parameter} opacity={0.3} />
   )}

   {/* Bugs */}
   {Array.from({ length: 5 }).map((_, i) => {
   const isDead = survival < (100 - i * 20);
   return (
    <circle key={i} cx={150 + i * 30} cy={120 + (i % 2) * 40} r="6" fill={isDead ? "#ef4444" : "#000000"} />
   );
   })}
   {survival === 0 && <text x="130" y="250" fill="#ef4444" className="text-lg font-bold">Pests Eliminated</text>}
  </svg>
  );
 }
 };

 const getSliderConfig = () => {
 if (scenario === 'Pesticide') return { min: 1, max: 10, step: 0.5, label: 'Pesticide Concentration (μM)' };
 if (scenario === 'AcidRain') return { min: 3.0, max: 6.0, step: 0.1, label: 'Rain pH' };
 return { min: 1, max: 10, step: 1, label: 'Bt Toxin Expression (units)' };
 };
 const config = getSliderConfig();

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  {/* Header */}
  <LabHeader onExit={onExit} title="Interactive Agrochemicals Lab" />

  {/* Main Content */}
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >Lab</button>
  </div>
  <main className="lg:flex-1 p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 max-w-7xl mx-auto w-full overflow-y-auto lg:overflow-visible">
  
  {/* Left Column: Theory & Setup */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-2 border-b pb-2 flex items-center gap-2">
    <ShieldAlert className="text-slate-500 dark:text-[#71717a]" size={20} />
    Process Dynamics
   </h2>
   {scenario === 'Pesticide' && (
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mt-2 leading-relaxed">
    <strong>Organophosphate Pesticides</strong> irreversibly inhibit Acetylcholinesterase (AChE) in insects. Without AChE, acetylcholine builds up in the synapse, causing continuous nerve impulses, paralysis, and death.
    </p>
   )}
   {scenario === 'AcidRain' && (
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mt-2 leading-relaxed">
    <strong>Acid Rain</strong> contains elevated H⁺ ions. These ions displace essential nutrient cations like Ca²⁺ and Mg²⁺ bound to negatively charged soil clay particles. The nutrients are then leached away, depleting soil fertility.
    </p>
   )}
   {scenario === 'GMCrops' && (
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mt-2 leading-relaxed">
    <strong>GM Crops</strong> are engineered to express Bt toxin from *Bacillus thuringiensis*. The toxin binds to receptors in the insect gut, forming pores that lead to pest mortality while remaining harmless to humans.
    </p>
   )}
   </div>

   <div className="flex-1">
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-4">Experimental Setup</h3>
   <label className="block text-sm font-medium text-slate-600 dark:text-[#a1a1aa] mb-1">
    {config.label}: {parameter}
   </label>
   <input
    type="range"
    min={config.min}
    max={config.max}
    step={config.step}
    value={parameter}
    onChange={(e) => { setParameter(Number(e.target.value)); reset(); }}
    className={`w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-green-600 mb-6 flex-col `}
   />
   
   <div className={`bg-slate-100 dark:bg-[#121212] p-4 rounded-lg flex items-center justify-between border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    <div className="flex flex-col">
    <span className="text-xs text-slate-500 dark:text-[#71717a] uppercase font-bold tracking-wider">Elapsed Time</span>
    <span className="text-2xl font-mono text-slate-800 dark:text-[#ffffff]">{time.toFixed(1)} s</span>
    </div>
   </div>
   </div>
  </div>

  {/* Middle Column: Interactive Simulation */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="absolute top-6 left-6 text-xl font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <Bug className="text-slate-500 dark:text-[#71717a]" size={20} />
   Agro-Visualizer
   </h2>
   
   <div className="w-full mt-10">
   {renderSimulation()}
   </div>

   <div className="mt-8 flex gap-4">
   <button
    onClick={() => setIsPlaying(!isPlaying)}
    className={`flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40 flex-col `}
   >
    <Play size={18} />
    {isPlaying ? 'Pause' : 'Start Process'}
   </button>
   <button
    onClick={reset}
    className="flex items-center gap-2 px-6 py-3 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg font-medium hover:bg-slate-300 dark:bg-[#121212] transition-colors"
   >
    <RotateCcw size={18} />
    Reset
   </button>
   </div>
  </div>

  {/* Right Column: Assessment */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-2 border-b pb-2">
   Data Analysis
   </h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-6">
   Calculate the agrochemical impacts based on the simulation data. Pay close attention to the specific rate equations derived from the visualized phenomena.
   </p>

   <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6 dark:bg-[#121212] dark:border-[#1c1b1b]">
   <h3 className="font-semibold text-green-900 mb-2 dark:text-[#ffffff]">Assignment Question</h3>
   {scenario === 'Pesticide' && (
    <p className="text-sm text-green-800 dark:text-[#ffffff]">
    If the pesticide concentration is configured to <strong>5.0 μM</strong>, what will be the exact AChE enzyme activity (%) at exactly <strong>t = 5.0 s</strong>? <br/><br/><em>(Rate: Activity loss = conc × time × 2)</em>
    </p>
   )}
   {scenario === 'AcidRain' && (
    <p className="text-sm text-green-800 dark:text-[#ffffff]">
    At a rain <strong>pH of 4.0</strong>, calculate the total amount of Ca²⁺ ions leached at exactly <strong>t = 5.0 s</strong>. <br/><br/><em>(Rate: Leached = time × 10^(6 - pH))</em>
    </p>
   )}
   {scenario === 'GMCrops' && (
    <p className="text-sm text-green-800 dark:text-[#ffffff]">
    At a Bt toxin expression level of <strong>8 units</strong>, at what exact time (in seconds) will the pest survival rate drop to precisely <strong>0%</strong>? <br/><br/><em>(Rate: Survival loss = expression × time × 2)</em>
    </p>
   )}
   </div>

   <div className="flex flex-col gap-4">
   <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Your Answer</label>
    <input
    type="number"
    value={answer}
    onChange={(e) => setAnswer(e.target.value)}
    placeholder="Enter numerical value"
    className="w-full px-4 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
    />
   </div>
   <button
    onClick={checkAnswer}
    className="w-full py-2 bg-[#121212] dark:bg-[#121212] text-white rounded-lg font-medium hover:bg-[#000000] dark:bg-[#121212] transition-colors"
   >
    Check Answer
   </button>
   
   {feedback && (
    <div className={`p-4 rounded-lg flex items-start gap-3 ${feedback.includes('Correct') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
    {feedback.includes('Correct') ? <CheckCircle size={20} className="text-green-600 shrink-0" /> : <XCircle size={20} className="text-red-600 shrink-0" />}
    <span className="text-sm font-medium">{feedback}</span>
    </div>
   )}
   </div>
  </div>
  </main>
 </div>
 );
}
