import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Activity, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabM11Trigonometry({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [radius, setRadius] = useState<number>(20); // Amplitude A
 const [centerHeight, setCenterHeight] = useState<number>(50); // Vertical Shift D
 const [period, setPeriod] = useState<number>(10); // Period T
 
 const [time, setTime] = useState<number>(0);
 const [isPlaying, setIsPlaying] = useState<boolean>(false);
 const requestRef = useRef<number>(0);
 const lastTimeRef = useRef<number>(0);
 
 const [ansAmplitude, setAnsAmplitude] = useState<string>('');
 const [ansShift, setAnsShift] = useState<string>('');
 const [ansPeriod, setAnsPeriod] = useState<string>('');
 const [feedback, setFeedback] = useState<string>('');

 const checkAnswers = () => {
 const a = parseFloat(ansAmplitude);
 const d = parseFloat(ansShift);
 const t = parseFloat(ansPeriod);
 
 if (isNaN(a) || isNaN(d) || isNaN(t)) {
  setFeedback('Please fill in all fields with valid numbers.');
  return;
 }
 
 if (a === radius && d === centerHeight && t === period) {
  setFeedback('Excellent! You correctly identified the parameters of the sinusoidal function: h(t) = A sin(B t) + D.');
 } else {
  const errs = [];
  if (a !== radius) errs.push('Amplitude');
  if (d !== centerHeight) errs.push('Vertical Shift');
  if (t !== period) errs.push('Period');
  setFeedback(`Check your values for: ${errs.join(', ')}.`);
 }
 };

 const animate = (timestamp: number) => {
 if (!lastTimeRef.current) lastTimeRef.current = timestamp;
 const dt = (timestamp - lastTimeRef.current) / 1000; 
 lastTimeRef.current = timestamp;

 setTime(prev => prev + dt);

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
 }, [isPlaying]);

 const reset = () => {
 setIsPlaying(false);
 setTime(0);
 lastTimeRef.current = 0;
 setAnsAmplitude('');
 setAnsShift('');
 setAnsPeriod('');
 setFeedback('');
 };

 const angle = (2 * Math.PI / period) * time; 
 const carX = 50 + radius * Math.cos(angle);
 const carY = 150 - (centerHeight + radius * Math.sin(angle)); 

 const graphPoints = [];
 for (let t = Math.max(0, time - 20); t <= time; t += 0.2) {
 const ptAngle = (2 * Math.PI / period) * t;
 const h = centerHeight + radius * Math.sin(ptAngle);
 const screenX = 120 + (t - Math.max(0, time - 20)) * 10; 
 const screenY = 150 - h;
 graphPoints.push(`${screenX},${screenY}`);
 }

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Trigonometry: Sinusoidal Ferris Wheel" />

  
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
  <div className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-teal-700 mb-4">Theory & Context</h2>
   <div className="prose prose-slate">
   <p>
    Many periodic real-world phenomena, like the height of a rider on a Ferris wheel or the voltage in an AC circuit, can be modeled using <strong>Sinusoidal Functions</strong>.
   </p>
   <p>
    The general equation for a sinusoidal function is:
   </p>
   <p className={`text-center font-mono bg-slate-100 dark:bg-[#121212] p-2 rounded text-teal-800 flex-col `}>
    h(t) = A · sin(B(t - C)) + D
   </p>
   <ul className="text-sm mt-2 space-y-2">
    <li><strong>Amplitude (|A|):</strong> The radius of the wheel. It determines the peak deviation from the center.</li>
    <li><strong>Period (T):</strong> The time it takes to complete one full revolution. {"$$T = \\frac{2\\pi}{|B|}$$"}.</li>
    <li><strong>Phase Shift (C):</strong> Horizontal shift (we'll keep it 0 here).</li>
    <li><strong>Vertical Shift (D):</strong> The height of the center of the wheel above the ground.</li>
   </ul>
   <div className={`mt-4 bg-teal-50 border-l-4 border-teal-500 p-4 rounded flex-col `}>
    <h3 className="font-bold text-teal-800">Lab Challenge</h3>
    <p className="text-sm text-teal-900 mt-1">
    Observe the Ferris wheel parameters on the simulator. Can you identify its Amplitude, Vertical Shift, and Period from the physical setup?
    </p>
   </div>
   </div>
  </div>

  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-teal-700 mb-4">Ferris Wheel Simulator</h2>
   
   <div className={`w-full flex justify-center items-center bg-[#000000] dark:bg-[#121212] lg:dark:bg-[#121212] rounded-lg p-4 mb-6 relative h-64 overflow- shadow-inner flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <svg width="350" height="200" viewBox="0 -10 350 200" className="overflow-visible">
    <line x1="0" y1="150" x2="350" y2="150" stroke="#334155" strokeWidth="2" />
    
    <polyline points={`30,150 50,${150 - centerHeight} 70,150`} fill="none" stroke="#475569" strokeWidth="4" />
    
    <line x1="100" y1={150 - centerHeight} x2="350" y2={150 - centerHeight} stroke="#334155" strokeDasharray="4 4" />
    
    <line x1="120" y1="20" x2="120" y2="150" stroke="#475569" strokeWidth="2" />

    {graphPoints.length > 0 && (
    <polyline points={graphPoints.join(' ')} fill="none" stroke="#14b8a6" strokeWidth="2" />
    )}

    <line x1={carX} y1={carY} x2="120" y2={carY} stroke="#14b8a6" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
    <circle cx="120" cy={carY} r="3" fill="#14b8a6" />

    <circle cx="50" cy={150 - centerHeight} r={radius} fill="none" stroke="#64748b" strokeWidth="2" />
    <circle cx="50" cy={150 - centerHeight} r="3" fill="#cbd5e1" />
    
    <circle cx={carX} cy={carY} r="6" fill="#f43f5e" />
   </svg>
   
   <div className={`absolute top-2 right-2 bg-[#121212] dark:bg-[#121212]/80 px-3 py-1 rounded shadow text-xs font-mono text-teal-400 flex-col `}>
    t = {time.toFixed(1)}s
   </div>
   <div className="absolute top-8 right-2 bg-[#121212] dark:bg-[#121212]/80 px-3 py-1 rounded shadow text-xs font-mono text-rose-400">
    h = {(150 - carY).toFixed(1)}m
   </div>
   </div>

   <div className="w-full space-y-4">
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    Wheel Radius: {radius} m
    </label>
    <input 
    type="range" min="10" max="40" step="5" 
    value={radius} 
    onChange={(e) => {setRadius(Number(e.target.value)); reset();}}
    className="w-full accent-teal-600"
    disabled={isPlaying}
    />
   </div>
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    Center Height: {centerHeight} m
    </label>
    <input 
    type="range" min="45" max="80" step="5" 
    value={centerHeight} 
    onChange={(e) => {setCenterHeight(Number(e.target.value)); reset();}}
    className="w-full accent-teal-600"
    disabled={isPlaying}
    />
   </div>
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    Period (1 Rotation): {period} s
    </label>
    <input 
    type="range" min="4" max="20" step="2" 
    value={period} 
    onChange={(e) => {setPeriod(Number(e.target.value)); reset();}}
    className="w-full accent-teal-600"
    disabled={isPlaying}
    />
   </div>
   
   <div className="flex gap-2 justify-center pt-2">
    <button 
    onClick={() => {
     if(!isPlaying) { lastTimeRef.current = 0; }
     setIsPlaying(!isPlaying);
    }}
    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-white transition-colors ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-teal-600 hover:bg-teal-700'}`}
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

  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex flex-col">
   <h2 className="text-xl font-bold text-teal-700 mb-4 flex items-center gap-2">
   <Activity size={24} /> Equation Builder
   </h2>
   
   <div className="mb-6 text-sm text-slate-600 dark:text-[#a1a1aa]">
   Based on the settings in the simulator, build the sinusoidal equation that models the rider's height over time.
   <br/><br/>
   <strong>Equation format:</strong> <br/>
   <code className="bg-slate-100 dark:bg-[#121212] px-2 py-1 rounded text-teal-700 text-base">h(t) = A · sin(B(t)) + D</code>
   </div>

   <div className="space-y-4 flex-1">
   
   <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">Amplitude (A)</label>
    <input 
    type="number" 
    value={ansAmplitude}
    onChange={(e) => setAnsAmplitude(e.target.value)}
    placeholder="Radius of the wheel"
    className="px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
    />
   </div>

   <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">Vertical Shift (D)</label>
    <input 
    type="number" 
    value={ansShift}
    onChange={(e) => setAnsShift(e.target.value)}
    placeholder="Center height"
    className="px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
    />
   </div>

   <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">Period (T)</label>
    <input 
    type="number" 
    value={ansPeriod}
    onChange={(e) => setAnsPeriod(e.target.value)}
    placeholder="Time for one revolution"
    className="px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
    />
   </div>

   <button 
    onClick={checkAnswers}
    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors mt-4 dark:text-white dark:text-white dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40"
   >
    <CheckCircle size={18} /> Verify Equation
   </button>

   {feedback && (
    <div className={`p-4 rounded-lg mt-4 flex items-start gap-3 ${feedback.includes('Excellent') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
    {feedback.includes('Excellent') ? <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" /> : <XCircle size={20} className="text-rose-500 shrink-0 mt-0.5" />}
    <p className="text-sm">{feedback}</p>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
