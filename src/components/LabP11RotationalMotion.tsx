import { useState, useEffect, useRef } from 'react';
import {Calculator, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP11RotationalMotion({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [armRadius, setArmRadius] = useState(1.0); // 0.2 to 1.0 m
 const [initialOmega, setInitialOmega] = useState(2.0); // rad/s
 const [angularMomentum, setAngularMomentum] = useState(0);
 const [spinning, setSpinning] = useState(false);
 const [currentAngle, setCurrentAngle] = useState(0);

 const [omegaGuess, setOmegaGuess] = useState('');
 const [feedback, setFeedback] = useState<string | null>(null);

 const I_body = 1.0; // kg*m^2
 const m_arms = 10.0; // kg
 
 const currentI = I_body + m_arms * armRadius * armRadius;
 const currentOmega = spinning ? angularMomentum / currentI : initialOmega;

 useEffect(() => {
 if (!spinning) {
  setAngularMomentum(currentI * initialOmega);
 }
 }, [spinning, initialOmega, currentI]);

 // Animation loop
 const requestRef = useRef<number>(0);
 const previousTimeRef = useRef<number>(0);

 const animate = (time: number) => {
 if (previousTimeRef.current !== 0 && spinning) {
  const deltaTime = (time - previousTimeRef.current) / 1000;
  setCurrentAngle(prev => (prev + currentOmega * deltaTime * (180 / Math.PI)) % 360);
 }
 previousTimeRef.current = time;
 requestRef.current = requestAnimationFrame(animate);
 };

 useEffect(() => {
 requestRef.current = requestAnimationFrame(animate);
 return () => cancelAnimationFrame(requestRef.current);
 });

 const checkAnswer = () => {
 const guess = parseFloat(omegaGuess);
 if (Math.abs(currentOmega - guess) < 0.1) {
  setFeedback('Correct! Angular momentum is conserved.');
 } else {
  setFeedback(`Incorrect. Try L = I_initial * ω_initial = I_final * ω_final. Actual ω = ${currentOmega.toFixed(2)} rad/s.`);
 }
 };

 const armPixels = 40 + armRadius * 60; // visual scale

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Rotational Motion" />

  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 lg:flex-1 gap-0 lg:gap-4 p-4 lg:min-h-0 overflow-y-auto lg:overflow-visible">
  {/* Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 lg:overflow-y-auto  ? 'block' : 'hidden'} lg:block`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4">Conservation of Angular Momentum</h2>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa]">
   <p>When no external torque acts on a system, its angular momentum <strong>L</strong> remains constant.</p>
   <p className={`text-center font-mono bg-slate-100 dark:bg-[#121212] p-2 rounded text-slate-800 dark:text-[#ffffff] flex-col `}>L = I × ω = constant</p>
   <p>where <strong>I</strong> is the moment of inertia and <strong>ω</strong> is angular velocity.</p>
   <ul className="list-disc pl-4 mt-2 space-y-1">
    <li>A skater pulls their arms in to reduce <em>r</em>.</li>
    <li>This reduces their moment of inertia (I = I_body + m_arms × r²).</li>
    <li>To keep L constant, angular velocity (ω) must increase.</li>
   </ul>
   </div>
   
   <div className="mt-6 space-y-4">
   <div>
    <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] flex justify-between">
    <span>Arm Radius (m)</span> <span>{armRadius.toFixed(2)} m</span>
    </label>
    <input type="range" min="0.2" max="1.0" step="0.05" value={armRadius} onChange={e => setArmRadius(Number(e.target.value))} className="w-full accent-indigo-500" />
   </div>
   {!spinning && (
    <div>
    <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] flex justify-between">
     <span>Initial ω (rad/s)</span> <span>{initialOmega.toFixed(1)}</span>
    </label>
    <input type="range" min="1" max="5" step="0.1" value={initialOmega} onChange={e => setInitialOmega(Number(e.target.value))} className="w-full accent-indigo-500" />
    </div>
   )}
   
   <button 
    onClick={() => setSpinning(!spinning)}
    className={`w-full py-2 rounded-lg font-bold text-white transition-colors ${spinning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
   >
    {spinning ? 'Stop Spinning' : 'Start Spinning'}
   </button>
   </div>
  </div>

  {/* Simulator */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col items-center justify-center  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4">Skater Visualizer</h2>
   
   <div className={`relative w-64 h-64 bg-slate-100 dark:bg-[#121212] rounded-full border-4 border-slate-200 dark:border-[#1c1b1b] shadow-inner flex items-center justify-center overflow- flex-col `}>
   {/* Spinning Container */}
   <div 
    className="absolute"
    style={{ transform: `rotate(${currentAngle}deg)` }}
   >
    <svg width="200" height="200" className="overflow-visible">
    {/* Arms */}
    <line x1={100 - armPixels} y1="100" x2={100 + armPixels} y2="100" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
    {/* Weights on hands */}
    <circle cx={100 - armPixels} cy="100" r="12" fill="#64748b" />
    <circle cx={100 + armPixels} cy="100" r="12" fill="#64748b" />
    
    {/* Body/Head */}
    <circle cx="100" cy="100" r="25" fill="#5560F1" />
    {/* Orientation marker */}
    <circle cx="100" cy="85" r="4" fill="#ffffff" />
    </svg>
   </div>
   </div>
   
   <div className={`w-full mt-6 flex gap-6 text-sm font-mono bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex flex-col items-center">
    <span className="text-slate-500 dark:text-[#71717a]">I (Inertia)</span>
    <span className="font-bold text-indigo-700">{currentI.toFixed(2)}</span>
   </div>
   <div className="flex flex-col items-center">
    <span className="text-slate-500 dark:text-[#71717a]">ω (Velocity)</span>
    <span className="font-bold text-blue-700">{currentOmega.toFixed(2)}</span>
   </div>
   <div className="flex flex-col items-center">
    <span className="text-slate-500 dark:text-[#71717a]">L (Momentum)</span>
    <span className="font-bold text-emerald-700">{angularMomentum.toFixed(2)}</span>
   </div>
   </div>
  </div>

  {/* Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 lg:overflow-y-auto `}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <Calculator className="w-5 h-5 text-emerald-500" />
   Calculate Final Velocity
   </h2>
   
   <div className="mb-6 p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg space-y-2 text-sm text-slate-700 dark:text-[#ffffff]">
   <p><strong>I_body</strong> = {I_body} kg·m²</p>
   <p><strong>m_arms</strong> = {m_arms} kg</p>
   <p><strong>r</strong> = {armRadius.toFixed(2)} m</p>
   <p className="mt-2 pt-2 border-t border-slate-200 dark:border-[#1c1b1b]">
    <strong>L</strong> = {angularMomentum.toFixed(2)} kg·m²/s
   </p>
   </div>

   <div className="space-y-4">
   <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
    Final Angular Velocity ω (rad/s):
    </label>
    <input
    type="number"
    value={omegaGuess}
    onChange={(e) => setOmegaGuess(e.target.value)}
    placeholder="e.g. 3.5"
    className="w-full px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
   </div>
   
   <button 
    onClick={checkAnswer}
    disabled={!spinning}
    className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    <CheckCircle className="w-4 h-4" /> Check Answer
   </button>
   {!spinning && <p className="text-xs text-center text-slate-500 dark:text-[#71717a]">Start spinning first!</p>}

   {feedback && (
    <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${feedback.includes('Correct') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
    {feedback.includes('Correct') ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 mt-0.5 shrink-0" />}
    <span>{feedback}</span>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
