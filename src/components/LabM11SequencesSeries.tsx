import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabM11SequencesSeries({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 // Pendulum state
 const [initialAngle, setInitialAngle] = useState<number>(45); // degrees
 const [decayRatio, setDecayRatio] = useState<number>(0.8);
 const [isPlaying, setIsPlaying] = useState<boolean>(false);
 const [swingCount, setSwingCount] = useState<number>(0);
 const [currentAngle, setCurrentAngle] = useState<number>(45);
 
 // Assessment
 const [studentAnswer, setStudentAnswer] = useState<string>('');
 const [feedback, setFeedback] = useState<string>('');
 
 // Animation ref
 const requestRef = useRef<number>(0);
 const timeRef = useRef<number>(0);

 // Math variables
 // S = a / (1 - r) for pendulum total angular distance
 const expectedTotalDistance = initialAngle / (1 - decayRatio);

 const checkAnswer = () => {
 const ans = parseFloat(studentAnswer);
 if (isNaN(ans)) {
  setFeedback('Please enter a valid number.');
  return;
 }
 if (Math.abs(ans - expectedTotalDistance) < 0.5) {
  setFeedback('Correct! You found the sum of the infinite geometric series.');
 } else {
  setFeedback('Incorrect. Remember the formula for infinite sum: S = a / (1 - r).');
 }
 };

 const animate = (time: number) => {
 if (!timeRef.current) timeRef.current = time;
 const deltaTime = time - timeRef.current;
 
 const totalTime = deltaTime / 1000; 
 const currentSwingIndex = Math.floor(totalTime);
 const phase = totalTime - currentSwingIndex; // 0 to 1
 
 const direction = currentSwingIndex % 2 === 0 ? 1 : -1;
 const amplitude = initialAngle * Math.pow(decayRatio, currentSwingIndex);
 
 const currentAng = direction * amplitude * Math.cos(Math.PI * phase);
 
 setCurrentAngle(currentAng);
 setSwingCount(currentSwingIndex);
 
 if (isPlaying) {
  requestRef.current = requestAnimationFrame(animate);
 }
 };

 useEffect(() => {
 if (isPlaying) {
  requestRef.current = requestAnimationFrame(animate);
 } else {
  cancelAnimationFrame(requestRef.current);
 }
 return () => cancelAnimationFrame(requestRef.current);
 }, [isPlaying, initialAngle, decayRatio]);

 const reset = () => {
 setIsPlaying(false);
 cancelAnimationFrame(requestRef.current);
 timeRef.current = 0;
 setCurrentAngle(initialAngle);
 setSwingCount(0);
 setStudentAnswer('');
 setFeedback('');
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Sequences & Series: Geometric Decay" />

  
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
  {/* Theory */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-indigo-700 mb-4">Theory & Context</h2>
   <div className="prose prose-slate">
   <p>
    A <strong>Geometric Sequence</strong> is a sequence of numbers where each term after the first is found by multiplying the previous one by a fixed, non-zero number called the <em>common ratio</em> (r).
   </p>
   <p>
    In our pendulum example, due to air resistance and friction, each successive swing is a fraction of the previous swing's amplitude. If the first swing has an angle of {"$$a$$"} and the decay ratio is {"$$r$$"}, the sequence of swing amplitudes is:
   </p>
   <p className={`text-center font-mono bg-slate-100 dark:bg-[#121212] p-2 rounded flex-col `}>
    a, a·r, a·r², a·r³, ...
   </p>
   <p>
    The <strong>Sum of an Infinite Geometric Series</strong> (when |r| &lt; 1) tells us the total distance the pendulum will travel before coming to a complete stop:
   </p>
   <p className={`text-center font-mono bg-slate-100 dark:bg-[#121212] p-2 rounded flex-col `}>
    {"$$S_{\\infty} = \\frac{a}{1 - r}$$"}
   </p>
   <div className={`mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
    <h3 className="font-bold text-blue-800 dark:text-[#ffffff]">Lab Objectives:</h3>
    <ul className="list-disc ml-5 text-blue-900 text-sm mt-2 dark:text-[#ffffff]">
    <li>Observe the geometric decay of a pendulum's swing.</li>
    <li>Identify the initial term (a) and common ratio (r).</li>
    <li>Calculate the total angular distance traversed.</li>
    </ul>
   </div>
   </div>
  </div>

  {/* Visualizer */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-indigo-700 mb-4">Interactive Pendulum</h2>
   
   <div className={`w-full flex justify-center items-center bg-slate-100 dark:bg-[#121212] rounded-lg p-4 mb-6 relative h-64 overflow- `}>
   <svg width="200" height="200" viewBox="-100 -20 200 220" className="overflow-visible">
    <circle cx="0" cy="0" r="4" fill="#334155" />
    <line x1="0" y1="0" x2="0" y2="180" stroke="#cbd5e1" strokeDasharray="4 4" />
    
    <g transform={`rotate(${currentAngle})`}>
    <line x1="0" y1="0" x2="0" y2="150" stroke="#475569" strokeWidth="3" />
    <circle cx="0" cy="150" r="15" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
    </g>

    <path 
    d={`M 0 50 A 50 50 0 0 ${currentAngle > 0 ? 1 : 0} ${50 * Math.sin(currentAngle * Math.PI / 180)} ${50 * Math.cos(currentAngle * Math.PI / 180)}`}
    fill="none" 
    stroke="#3b82f6" 
    strokeWidth="2"
    strokeDasharray="2 2"
    />
   </svg>
   <div className="absolute top-2 right-2 bg-slate-50 dark:bg-[#121212]/80 px-3 py-1 rounded shadow text-sm font-mono">
    Angle: {Math.abs(currentAngle).toFixed(1)}°
   </div>
   <div className="absolute top-10 right-2 bg-slate-50 dark:bg-[#121212]/80 px-3 py-1 rounded shadow text-sm font-mono">
    Swing: {swingCount}
   </div>
   </div>

   <div className="w-full space-y-4">
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    Initial Angle (a): {initialAngle}°
    </label>
    <input 
    type="range" min="10" max="90" step="5" 
    value={initialAngle} 
    onChange={(e) => {setInitialAngle(Number(e.target.value)); reset();}}
    className="w-full"
    disabled={isPlaying}
    />
   </div>
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    Decay Ratio (r): {decayRatio}
    </label>
    <input 
    type="range" min="0.1" max="0.95" step="0.05" 
    value={decayRatio} 
    onChange={(e) => {setDecayRatio(Number(e.target.value)); reset();}}
    className="w-full"
    disabled={isPlaying}
    />
   </div>
   
   <div className="flex gap-2 justify-center pt-4">
    <button 
    onClick={() => {
     if(!isPlaying) { timeRef.current = 0; }
     setIsPlaying(!isPlaying);
    }}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
    >
    {isPlaying ? <><Pause size={18}/> Pause</> : <><Play size={18}/> Start</>}
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

  {/* Assessment */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <h2 className="text-xl font-bold text-indigo-700 mb-4">Data Logging & Assessment</h2>
   
   <div className="mb-6">
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Measured Values</h3>
   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] space-y-2 font-mono text-sm">
    <div className="flex justify-between">
    <span>First Swing Amplitude (a):</span>
    <span className="font-bold text-indigo-600">{initialAngle}°</span>
    </div>
    <div className="flex justify-between">
    <span>Second Swing Amplitude (a·r):</span>
    <span className="font-bold text-indigo-600">{(initialAngle * decayRatio).toFixed(1)}°</span>
    </div>
    <div className="flex justify-between">
    <span>Common Ratio (r):</span>
    <span className="font-bold text-indigo-600">{decayRatio.toFixed(2)}</span>
    </div>
   </div>
   </div>

   <div className="space-y-4 flex-1">
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff]">Task: Calculate Total Distance</h3>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    Using the formula for the sum of an infinite geometric series, calculate the total angular distance the pendulum will travel before coming to a complete stop.
   </p>
   
   <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">Total Angular Distance (°)</label>
    <input 
    type="number" 
    value={studentAnswer}
    onChange={(e) => setStudentAnswer(e.target.value)}
    placeholder="e.g. 150"
    className="px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
   </div>

   <button 
    onClick={checkAnswer}
    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-2 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    <CheckCircle size={18} /> Check Answer
   </button>

   {feedback && (
    <div className={`p-4 rounded-lg mt-4 flex items-start gap-3 ${feedback.includes('Correct') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
    {feedback.includes('Correct') ? <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" /> : <XCircle size={20} className="text-rose-500 shrink-0 mt-0.5" />}
    <p className="text-sm">{feedback}</p>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
