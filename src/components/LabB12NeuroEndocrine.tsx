import { useState, useEffect, useRef } from 'react';
import { Activity, Brain, CheckCircle, XCircle, Beaker } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabB12NeuroEndocrine({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 // Reaction time state
 const [gameState, setGameState] = useState<'idle' | 'dropping' | 'caught'>('idle');
 const [reactionTime, setReactionTime] = useState<number | null>(null);
 const startTime = useRef<number>(0);
 const timerRef = useRef<number | null>(null);

 // NSAID state
 const [coxBlocked, setCoxBlocked] = useState(false);

 // Assessment state
 const [assessmentDistance, setAssessmentDistance] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const startDrop = () => {
 setGameState('dropping');
 startTime.current = Date.now();
 timerRef.current = window.setTimeout(() => {
  // if not caught in 1.5s, auto catch missed
  setGameState('idle');
  setReactionTime(1.5);
 }, 1500);
 };

 const catchRuler = () => {
 if (gameState === 'dropping') {
  const rt = (Date.now() - startTime.current) / 1000;
  setReactionTime(rt);
  setGameState('caught');
  if (timerRef.current) clearTimeout(timerRef.current);
 }
 };

 const resetRuler = () => {
 setGameState('idle');
 setReactionTime(null);
 setIsCorrect(null);
 setAssessmentDistance('');
 };

 const handleCheckAnswer = () => {
 if (reactionTime) {
  const distance = 0.5 * 9.8 * reactionTime * reactionTime;
  const parsed = parseFloat(assessmentDistance);
  if (!isNaN(parsed) && Math.abs(parsed - distance) < 0.1) {
  setIsCorrect(true);
  } else {
  setIsCorrect(false);
  }
 }
 };

 // Cleanup
 useEffect(() => {
 return () => {
  if (timerRef.current) clearTimeout(timerRef.current);
 };
 }, []);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  {/* Header */}
  <LabHeader onExit={onExit} title="Interactive Neurology & Pharmacology" />

  {/* Main Grid */}
  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 flex-grow overflow-y-auto lg:overflow-visible">
  
  {/* Theory Column */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
   <Brain className="mr-2 text-blue-500" /> Theory & Diagnostics
   </h2>
   <div className="space-y-4 text-slate-600 dark:text-[#a1a1aa] text-sm">
   <div className={`p-4 bg-blue-50 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
    <h3 className="font-semibold text-blue-800 mb-2 dark:text-[#ffffff]">The Nervous System & Reaction Time</h3>
    <p>
    Reaction time is the interval between the presentation of a stimulus and the initiation of the muscular response. 
    Using a ruler-drop test, we can calculate reaction time using the kinematic equation: 
    <br /><br />
    <code className="bg-slate-50 dark:bg-[#121212] px-2 py-1 rounded text-blue-900 font-mono dark:text-[#ffffff]">d = ½ g t²</code>
    <br /><br />
    Where <strong>d</strong> is the distance the ruler fell, <strong>g</strong> is acceleration due to gravity (9.8 m/s²), and <strong>t</strong> is time in seconds.
    </p>
   </div>
   
   <div className={`p-4 bg-rose-50 rounded-lg border border-rose-100 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    <h3 className="font-semibold text-rose-800 mb-2">Pharmacology: NSAIDs</h3>
    <p>
    Nonsteroidal anti-inflammatory drugs (NSAIDs) reduce pain and inflammation by blocking <strong>Cyclooxygenase (COX)</strong> enzymes. 
    COX enzymes catalyze the conversion of arachidonic acid to prostaglandins, which are lipid compounds that mediate inflammation and sensitize nerves to pain.
    </p>
   </div>
   </div>
  </div>

  {/* Simulation Column */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex w-full">
   <Activity className="mr-2 text-indigo-500" /> Visual Ruler-Drop Simulator
   </h2>
   
   <div className="flex-grow flex flex-col items-center justify-center w-full space-y-8">
   {/* Ruler area */}
   <div className="relative w-24 h-64 bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] border-2 border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] rounded-md flex justify-center flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    <div 
    className={`w-8 bg-yellow-400 absolute transition-all border-x border-b border-yellow-600 ${gameState === 'dropping' ? 'duration-1000 ease-in' : 'duration-0'} ${gameState === 'idle' ? 'top-0' : gameState === 'dropping' ? 'top-full' : ''}`}
    style={{
     height: '200px',
     top: gameState === 'caught' ? `${Math.min(100, (reactionTime || 0) * 100)}%` : undefined
    }}
    >
    {/* Ruler markings */}
    {[...Array(10)].map((_, i) => (
     <div key={i} className="border-t border-black w-1/2 mt-4 ml-0"></div>
    ))}
    </div>
    
    {/* Hand/Catch zone */}
    <div className="absolute bottom-4 w-20 h-10 border-4 border-dashed border-indigo-400 rounded-lg flex items-center justify-center bg-indigo-50/50 pointer-events-none dark:bg-[#121212] dark:border-[#1c1b1b]">
    <span className="text-xs font-bold text-indigo-600">Catch Zone</span>
    </div>
   </div>

   <div className="flex gap-4">
    <button 
    onClick={startDrop} 
    disabled={gameState !== 'idle'}
    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-blue-700 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
    Drop Ruler
    </button>
    <button 
    onClick={catchRuler} 
    disabled={gameState !== 'dropping'}
    className="px-6 py-2 bg-rose-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-rose-700 dark:text-white dark:text-white dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-rose-500/40"
    >
    Catch!
    </button>
    <button 
    onClick={resetRuler} 
    className="px-6 py-2 bg-slate-200 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] rounded-lg font-semibold hover:bg-slate-300 dark:bg-[#121212]"
    >
    Reset
    </button>
   </div>

   {/* NSAID toggle visual */}
   <div className="w-full mt-4 p-4 border rounded-xl bg-slate-50 dark:bg-[#121212] flex items-center justify-between">
    <div className="flex items-center space-x-2">
    <Beaker className="text-teal-500" />
    <span className="text-sm font-semibold">Administer NSAID?</span>
    </div>
    <button
    onClick={() => setCoxBlocked(!coxBlocked)}
    className={`px-4 py-1 rounded-full text-sm font-bold transition-colors ${coxBlocked ? 'bg-teal-500 text-white' : 'bg-slate-300 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'}`}
    >
    {coxBlocked ? 'COX Blocked' : 'Normal State'}
    </button>
   </div>
   {/* Visual feedback of pain signal */}
   <div className="w-full h-8 bg-slate-200 dark:bg-[#121212] rounded-full overflow-hidden relative">
    <div className={`absolute left-0 top-0 h-full w-full bg-rose-500 opacity-50 ${coxBlocked ? 'w-0 transition-all duration-1000' : 'animate-pulse'}`}></div>
    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold z-10 text-slate-800 dark:text-[#ffffff]">
     {coxBlocked ? 'Inflammation Reduced (Prostaglandins ↓)' : 'Active Pain Signal'}
    </span>
   </div>
   </div>
  </div>

  {/* Assessment Column */}
  <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4">Data Analysis</h2>
   
   <div className="flex-grow space-y-6">
   <div className="p-4 bg-slate-100 dark:bg-[#121212] rounded-lg">
    <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-2">Experimental Results</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-1">Measured Reaction Time:</p>
    <div className="text-3xl font-mono font-bold text-blue-600">
    {reactionTime !== null ? `${reactionTime.toFixed(3)} s` : '--- s'}
    </div>
   </div>

   <div className="space-y-4">
    <p className="text-sm text-slate-700 dark:text-[#ffffff]">
    Based on the reaction time measured above, calculate the distance the ruler fell before you caught it. 
    Assume <strong>g = 9.8 m/s²</strong>.
    </p>
    
    <div>
    <label className="block text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-wide mb-1">
     Distance Fallen (meters)
    </label>
    <div className="flex space-x-2">
     <input 
     type="number"
     step="0.01"
     className="flex-grow p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
     placeholder="e.g. 0.45"
     value={assessmentDistance}
     onChange={(e) => setAssessmentDistance(e.target.value)}
     />
     <button 
     onClick={handleCheckAnswer}
     disabled={reactionTime === null || !assessmentDistance}
     className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
     >
     Check
     </button>
    </div>
    </div>

    {isCorrect !== null && (
    <div className={`p-4 rounded-lg flex items-start space-x-3 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
     {isCorrect ? <CheckCircle className="mt-0.5" size={20} /> : <XCircle className="mt-0.5" size={20} />}
     <div>
     <h4 className="font-bold">{isCorrect ? 'Correct!' : 'Incorrect'}</h4>
     <p className="text-sm mt-1">
      {isCorrect 
      ? 'You successfully calculated the distance using d = ½gt².' 
      : 'Check your calculation. Remember to square the time and multiply by 0.5 * 9.8.'}
     </p>
     </div>
    </div>
    )}
   </div>
   </div>
  </div>

  </div>
 </div>
 );
}
