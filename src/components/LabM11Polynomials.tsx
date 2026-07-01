import { useState, useEffect, useRef } from 'react';
import { Target, Rocket, RotateCcw, CheckCircle, Calculator } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabM11Polynomials({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [v0, setV0] = useState<number>(20);
 const [h0, setH0] = useState<number>(10);
 const [targetTime, setTargetTime] = useState<number>(2);
 
 const [currentTime, setCurrentTime] = useState<number>(0);
 const [isAnimating, setIsAnimating] = useState<boolean>(false);
 const requestRef = useRef<number>(0);
 const lastTimeRef = useRef<number>(0);
 
 const [studentAnswer, setStudentAnswer] = useState<string>('');
 const [feedback, setFeedback] = useState<string>('');

 const polynomial = (t: number) => -5 * t * t + v0 * t + h0;
 const expectedHeight = polynomial(targetTime);

 const checkAnswer = () => {
 const ans = parseFloat(studentAnswer);
 if (isNaN(ans)) {
  setFeedback('Please enter a valid number.');
  return;
 }
 if (Math.abs(ans - expectedHeight) < 0.1) {
  setFeedback(`Correct! P(${targetTime}) = ${expectedHeight}. The remainder theorem confirms the height is ${expectedHeight}m.`);
 } else {
  setFeedback(`Incorrect. Try dividing -5t² + ${v0}t + ${h0} by (t - ${targetTime}) using synthetic division.`);
 }
 };

 const animate = (time: number) => {
 if (!lastTimeRef.current) lastTimeRef.current = time;
 const dt = (time - lastTimeRef.current) / 1000;
 lastTimeRef.current = time;

 setCurrentTime(prev => {
  const nextTime = prev + dt;
  const h = polynomial(nextTime);
  if (h < 0 || nextTime > 6) { 
  setIsAnimating(false);
  return prev;
  }
  return nextTime;
 });

 if (isAnimating) {
  requestRef.current = requestAnimationFrame(animate);
 }
 };

 useEffect(() => {
 if (isAnimating) {
  requestRef.current = requestAnimationFrame(animate);
 } else {
  cancelAnimationFrame(requestRef.current);
 }
 return () => cancelAnimationFrame(requestRef.current);
 }, [isAnimating, v0, h0]); 

 const fire = () => {
 setCurrentTime(0);
 lastTimeRef.current = 0;
 setFeedback('');
 setStudentAnswer('');
 setIsAnimating(true);
 };

 const reset = () => {
 setIsAnimating(false);
 setCurrentTime(0);
 lastTimeRef.current = 0;
 setFeedback('');
 setStudentAnswer('');
 };
 
 const pathPoints = [];
 for(let t = 0; t <= 6; t += 0.1) {
 const h = polynomial(t);
 if (h >= 0) {
  pathPoints.push(`${t * 40},${200 - h * 5}`);
 }
 }

 const currentH = polynomial(currentTime);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Polynomials: Remainder Theorem Ballistics" />

  
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
  <div className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-red-700 mb-4">Theory & Context</h2>
   <div className="prose prose-slate">
   <p>
    The <strong>Remainder Theorem</strong> states that if a polynomial {"$$P(x)$$"} is divided by a linear binomial {"$$(x - c)$$"}, the remainder is exactly {"$$P(c)$$"}.
   </p>
   <p>
    In kinematics, the height {"$$h$$"} of a projectile over time {"$$t$$"} (in seconds) can be modeled by a quadratic polynomial function:
   </p>
   <p className={`text-center font-mono bg-slate-100 dark:bg-[#121212] p-2 rounded flex-col `}>
    P(t) = -5t² + v₀t + h₀
   </p>
   <ul className="text-sm mt-2 space-y-1">
    <li><strong>-5t²</strong>: Gravity effect (approx -½gt²)</li>
    <li><strong>v₀</strong>: Initial vertical velocity (m/s)</li>
    <li><strong>h₀</strong>: Initial height (m)</li>
   </ul>
   <p>
    To find the projectile's height at a specific time {"$$t = c$$"}, you can compute the remainder of {"$$P(t) \\div (t - c)$$"}.
   </p>
   <div className={`mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded flex-col `}>
    <h3 className="font-bold text-red-800">Synthetic Division Tip</h3>
    <p className="text-sm text-red-900 mt-1">
    To evaluate P({targetTime}), set up synthetic division with {targetTime} on the outside, and coefficients [-5, {v0}, {h0}] inside. The final number is your remainder!
    </p>
   </div>
   </div>
  </div>

  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-red-700 mb-4">Ballistics Simulator</h2>
   
   <div className={`w-full flex justify-center items-center bg-sky-50 rounded-lg p-4 mb-6 relative h-64 overflow- border border-sky-100 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <svg width="280" height="220" viewBox="-20 -10 280 220" className="overflow-visible">
    <line x1="0" y1="200" x2="250" y2="200" stroke="#94a3b8" strokeWidth="2" />
    <line x1="0" y1="0" x2="0" y2="200" stroke="#94a3b8" strokeWidth="2" />
    
    <line x1={targetTime * 40} y1="0" x2={targetTime * 40} y2="200" stroke="#fca5a5" strokeWidth="2" strokeDasharray="4 4" />
    <text x={targetTime * 40} y="215" fontSize="12" fill="#ef4444" textAnchor="middle">t = {targetTime}s</text>
    
    <polyline points={pathPoints.join(' ')} fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
    
    <circle cx={currentTime * 40} cy={200 - currentH * 5} r="6" fill="#ef4444" />
    
    {currentTime >= targetTime && (
    <circle cx={targetTime * 40} cy={200 - expectedHeight * 5} r="8" fill="none" stroke="#22c55e" strokeWidth="3" />
    )}
   </svg>
   
   <div className={`absolute top-2 right-2 bg-slate-50 dark:bg-[#121212]/90 px-3 py-1 rounded shadow text-sm font-mono flex flex-col `}>
    <span>Time: {currentTime.toFixed(2)}s</span>
    <span>Height: {currentH.toFixed(2)}m</span>
   </div>
   </div>

   <div className="w-full space-y-4">
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    Initial Velocity (v₀): {v0} m/s
    </label>
    <input 
    type="range" min="10" max="40" step="5" 
    value={v0} 
    onChange={(e) => {setV0(Number(e.target.value)); reset();}}
    className="w-full"
    disabled={isAnimating}
    />
   </div>
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    Initial Height (h₀): {h0} m
    </label>
    <input 
    type="range" min="0" max="30" step="5" 
    value={h0} 
    onChange={(e) => {setH0(Number(e.target.value)); reset();}}
    className="w-full"
    disabled={isAnimating}
    />
   </div>
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    Target Time (c): {targetTime} s
    </label>
    <input 
    type="range" min="1" max="5" step="0.5" 
    value={targetTime} 
    onChange={(e) => {setTargetTime(Number(e.target.value)); reset();}}
    className="w-full"
    disabled={isAnimating}
    />
   </div>
   
   <div className="flex gap-2 justify-center pt-2">
    <button 
    onClick={fire}
    disabled={isAnimating}
    className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"
    >
    <Rocket size={18} /> Fire
    </button>
    <button 
    onClick={reset}
    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] hover:bg-slate-300 dark:bg-[#121212]"
    >
    <RotateCcw size={18} /> Reset
    </button>
   </div>
   </div>
  </div>

  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex flex-col">
   <h2 className="text-xl font-bold text-red-700 mb-4">Calculations</h2>
   
   <div className="mb-6">
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Polynomial Function</h3>
   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] text-center font-mono text-lg text-red-700">
    P(t) = -5t² + {v0}t + {h0}
   </div>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mt-2">
    We want to find the height when <code className="bg-slate-100 dark:bg-[#121212] px-1 rounded">t = {targetTime}</code>. 
    According to the Remainder Theorem, we divide <code className="bg-slate-100 dark:bg-[#121212] px-1 rounded">P(t)</code> by <code className="bg-slate-100 dark:bg-[#121212] px-1 rounded">(t - {targetTime})</code>.
   </p>
   </div>

   <div className="space-y-4 flex-1">
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <Calculator size={18} className="text-red-600"/> Compute Remainder
   </h3>
   
   <div className="bg-amber-50 p-3 rounded text-sm text-amber-900 border border-amber-200 dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff]">
    Set up your synthetic division or compute directly: <br/>
    <strong>P({targetTime}) = -5({targetTime})² + {v0}({targetTime}) + {h0}</strong>
   </div>
   
   <div className="flex flex-col gap-2 mt-4">
    <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">What is the Remainder / Height (m)?</label>
    <input 
    type="number" 
    value={studentAnswer}
    onChange={(e) => setStudentAnswer(e.target.value)}
    placeholder="e.g. 25"
    className="px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
    />
   </div>

   <button 
    onClick={checkAnswer}
    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors mt-2 dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"
   >
    <CheckCircle size={18} /> Verify Remainder
   </button>

   {feedback && (
    <div className={`p-4 rounded-lg mt-4 flex items-start gap-3 ${feedback.includes('Correct') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
    {feedback.includes('Correct') ? <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" /> : <Target size={20} className="text-rose-500 shrink-0 mt-0.5" />}
    <p className="text-sm">{feedback}</p>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
