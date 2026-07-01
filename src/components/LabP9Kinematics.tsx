import { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Play, RotateCcw} from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP9Kinematics({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const pitchLength = 20.12; // meters
 const [speedTrue, setSpeedTrue] = useState(30); // m/s
 const [ballX, setBallX] = useState(0); // 0 to 100%
 const [isBowling, setIsBowling] = useState(false);
 const [stopwatchTime, setStopwatchTime] = useState(0);
 const [isTiming, setIsTiming] = useState(false);
 
 const animationRef = useRef<number>(0);
 const startTimeRef = useRef<number>(0);
 const stopWatchStartRef = useRef<number>(0);
 const stopWatchIntervalRef = useRef<number>(0);

 const [inputSpeed, setInputSpeed] = useState('');
 const [feedback, setFeedback] = useState<string | null>(null);

 // Sig fig part
 const [sigFigInput, setSigFigInput] = useState('');
 const [sigFigFeedback, setSigFigFeedback] = useState<string | null>(null);

 useEffect(() => {
 resetBowl();
 return () => {
  if (animationRef.current) cancelAnimationFrame(animationRef.current);
  clearInterval(stopWatchIntervalRef.current);
 };
 }, []);

 const resetBowl = () => {
 setSpeedTrue(Math.floor(Math.random() * 15) + 25); // 25 to 39 m/s
 setBallX(0);
 setIsBowling(false);
 setStopwatchTime(0);
 setIsTiming(false);
 if (animationRef.current) cancelAnimationFrame(animationRef.current);
 clearInterval(stopWatchIntervalRef.current);
 };

 const startBowl = () => {
 if (isBowling) return;
 resetBowl();
 setIsBowling(true);
 startTimeRef.current = performance.now();
 animateBall(performance.now());
 };

 const animateBall = (currentTime: number) => {
 const elapsed = (currentTime - startTimeRef.current) / 1000; // seconds
 const distanceTraveled = elapsed * speedTrue;
 const progress = (distanceTraveled / pitchLength) * 100;

 if (progress >= 100) {
  setBallX(100);
  setIsBowling(false);
 } else {
  setBallX(progress);
  animationRef.current = requestAnimationFrame(animateBall);
 }
 };

 const toggleStopwatch = () => {
 if (isTiming) {
  setIsTiming(false);
  clearInterval(stopWatchIntervalRef.current);
 } else {
  setIsTiming(true);
  setStopwatchTime(0);
  stopWatchStartRef.current = Date.now();
  stopWatchIntervalRef.current = window.setInterval(() => {
  setStopwatchTime((Date.now() - stopWatchStartRef.current) / 1000);
  }, 10);
 }
 };

 const checkAnswer = () => {
 const userV = parseFloat(inputSpeed);
 if (isNaN(userV)) return;
 // We check against the time they measured!
 const expectedSpeed = pitchLength / stopwatchTime;
 
 if (Math.abs(userV - expectedSpeed) < 0.5) {
  setFeedback('correct');
 } else {
  setFeedback('incorrect');
 }
 };

 const checkSigFigs = () => {
 // We want 3 sig figs: e.g., 24.5
 if (sigFigInput.trim() === '24.5') {
  setSigFigFeedback('correct');
 } else {
  setSigFigFeedback('incorrect');
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Physics Grade 9: Kinematics & Precision" />

  
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
  {/* Column 1: Theory */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-2">Theory</h2>
   <div className="prose prose-sm space-y-4">
   <div>
    <h3 className="font-semibold text-blue-800 dark:text-[#ffffff]">1. Speed and Velocity</h3>
    <p>
    Average speed is the total distance traveled divided by the total time taken.
    </p>
    <div className={`bg-blue-50 p-2 rounded text-center font-mono my-2 border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
    Speed (v) = Distance (d) / Time (t)
    </div>
   </div>
   
   <div>
    <h3 className="font-semibold text-blue-800 dark:text-[#ffffff]">2. Significant Figures</h3>
    <p>
    When taking a measurement, record all certain digits plus one estimated digit. If a ruler has 1mm marks, you can estimate to 0.1mm (0.01cm).
    </p>
   </div>
   <div className={`bg-yellow-50 border border-yellow-200 p-3 rounded-lg mt-4 text-xs text-yellow-800 flex-col `}>
    <strong>Instructions:</strong><br/>
    Click <em>Bowl Delivery</em>. Manually Start and Stop the stopwatch to measure the flight time. Then calculate the ball's speed.
   </div>
   </div>
  </div>

  {/* Column 2: Simulator */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-2 w-full mb-4">Cricket Pitch Simulator</h2>
   
   <div className={`w-full relative h-32 bg-green-600 border-4 border-green-800 rounded-lg overflow- flex items-center mb-8 dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40 flex-col `}>
   {/* Pitch */}
   <div className="absolute left-[10%] right-[10%] h-16 bg-[#e8dbb0] border-2 border-[#c2b280] shadow-inner flex items-center justify-between px-2 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    <div className="w-1 h-12 bg-slate-50 dark:bg-[#121212]"></div> {/* Crease line left */}
    <div className="w-1 h-12 bg-slate-50 dark:bg-[#121212]"></div> {/* Crease line right */}
   </div>
   
   {/* Ball */}
   <div 
    className="absolute w-4 h-4 bg-red-600 rounded-full shadow-lg border border-red-800 transition-none z-10"
    style={{ left: `calc(10% + (80% * ${ballX / 100}))`, top: '50%', transform: 'translate(-50%, -50%)' }}
   ></div>
   </div>

   <div className="flex gap-4 mb-8">
   <button 
    onClick={startBowl}
    disabled={isBowling}
    className={`px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-md dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 `}
   >
    <Play size={18} /> Bowl Delivery
   </button>
   <button 
    onClick={resetBowl}
    className="px-4 py-3 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] font-bold rounded-lg hover:bg-slate-300 dark:bg-[#121212] transition-colors flex items-center gap-2"
   >
    <RotateCcw size={18} />
   </button>
   </div>

   <div className="w-full max-w-sm bg-[#121212] dark:!bg-[#121212] text-white rounded-xl p-6 shadow-xl flex flex-col items-center border-4 border-[#1c1b1b] dark:border-[#1c1b1b]">
   <div className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">Digital Stopwatch</div>
   <div className="text-5xl font-mono mb-6 text-green-400 font-light tracking-wider">
    {stopwatchTime.toFixed(2)}<span className="text-2xl text-slate-500 dark:text-[#71717a]">s</span>
   </div>
   <div className="flex gap-4 w-full">
    <button 
    onClick={toggleStopwatch}
    className={`flex-1 py-3 font-bold rounded-lg ${isTiming ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
    >
    {isTiming ? 'STOP' : 'START'}
    </button>
   </div>
   </div>
  </div>

  {/* Column 3: Analysis */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-6 lg:overflow-y-auto">
   <div>
   <h2 className="text-lg font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-2 mb-4">1. Speed Calculation</h2>
   <div className="space-y-3">
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    Distance: <strong>{pitchLength} m</strong><br/>
    Time (your measurement): <strong>{stopwatchTime > 0 ? stopwatchTime.toFixed(2) : '--'} s</strong>
    </p>
    <div>
    <label className="block text-xs font-medium text-slate-700 dark:text-[#ffffff] mb-1">Calculated Speed (m/s)</label>
    <input 
     type="number" 
     value={inputSpeed} 
     onChange={(e)=>setInputSpeed(e.target.value)} 
     className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
     placeholder="e.g. 32.5"
    />
    </div>
    <button 
    onClick={checkAnswer}
    disabled={stopwatchTime === 0}
    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
    Check Speed
    </button>
    
    {feedback === 'correct' && (
    <p className="text-sm text-green-700 flex items-center gap-1 mt-2">
     <CheckCircle size={16}/> Correct based on your time! (True speed was {speedTrue} m/s)
    </p>
    )}
    {feedback === 'incorrect' && (
    <p className="text-sm text-red-700 flex items-center gap-1 mt-2">
     <XCircle size={16}/> Incorrect. Divide distance by YOUR time.
    </p>
    )}
   </div>
   </div>

   <div>
   <h2 className="text-lg font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-2 mb-4">2. Significant Figures</h2>
   <div className="bg-slate-100 dark:bg-[#121212] p-4 rounded-lg relative mb-3">
    {/* Fake ruler measuring a textbook block */}
    <div className="w-full h-8 bg-blue-300 rounded mb-1 shadow-sm"></div>
    <div className="w-full h-6 bg-yellow-200 border-t border-slate-400 dark:border-[#1c1b1b] relative">
    {/* 24cm is here, 25cm is here */}
    <div className="absolute left-[10%] bottom-0 h-4 border-l border-slate-600 dark:border-[#1c1b1b]"><span className="text-[10px] ml-1">24</span></div>
    <div className="absolute left-[50%] bottom-0 h-3 border-l border-slate-500 dark:border-[#1c1b1b]"></div> {/* 24.5 */}
    <div className="absolute left-[90%] bottom-0 h-4 border-l border-slate-600 dark:border-[#1c1b1b]"><span className="text-[10px] ml-1">25</span></div>
    </div>
    {/* Measurement red line indicating exactly 24.5 */}
    <div className="absolute left-[50%] top-0 bottom-6 w-0.5 bg-red-500 shadow-[0_0_2px_rgba(255,0,0,0.5)]"></div>
   </div>
   <p className="text-xs text-slate-600 dark:text-[#a1a1aa] mb-2">
    The red line shows the edge of the textbook. The ruler marks are in centimeters (cm).
    Record the length to the correct number of significant figures.
   </p>
   <div className="flex gap-2">
    <input 
    type="text" 
    value={sigFigInput} 
    onChange={(e)=>setSigFigInput(e.target.value)} 
    className="flex-1 border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
    placeholder="e.g. 24.5"
    />
    <button 
    onClick={checkSigFigs}
    className="px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
    Submit
    </button>
   </div>
   {sigFigFeedback === 'correct' && (
    <p className="text-sm text-green-700 flex items-center gap-1 mt-2">
    <CheckCircle size={16}/> Correct! 3 sig figs.
    </p>
   )}
   {sigFigFeedback === 'incorrect' && (
    <p className="text-sm text-red-700 flex items-center gap-1 mt-2">
    <XCircle size={16}/> Incorrect. Look closely at the marks. Estimate one digit past the smallest mark.
    </p>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
