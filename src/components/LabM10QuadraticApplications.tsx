import { useState, useEffect, useRef } from 'react';
import { Target, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
 onExit?: () => void;
}

export default function LabM10QuadraticApplications({ onExit }: Props) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // Simulator State
 const [velocity, setVelocity] = useState<number>(20);
 const [angle, setAngle] = useState<number>(45);
 const [height, setHeight] = useState<number>(10);
 
 // Animation state
 const [time, setTime] = useState<number>(0);
 const [isFiring, setIsFiring] = useState<boolean>(false);
 const animationRef = useRef<number>(0);

 // Assessment State
 const [ansMaxHeight, setAnsMaxHeight] = useState<string>('');
 const [feedback, setFeedback] = useState<string | null>(null);

 const g = 9.81;

 // Derived physics values
 const angleRad = (angle * Math.PI) / 180;
 const v0y = velocity * Math.sin(angleRad);
 const v0x = velocity * Math.cos(angleRad);
 
 // y(t) = h0 + v0y*t - 0.5*g*t^2
 // Maximum height occurs at t = v0y / g
 // max_y = h0 + v0y*(v0y/g) - 0.5*g*(v0y/g)^2 = h0 + v0y^2 / (2g)
 const actualMaxHeight = height + (v0y * v0y) / (2 * g);
 
 // Time of flight (when y = 0)
 // -0.5*g*t^2 + v0y*t + h0 = 0
 const timeOfFlight = (v0y + Math.sqrt(v0y*v0y - 4*(-0.5*g)*height)) / g;

 useEffect(() => {
 if (isFiring) {
  const startTime = performance.now();
  const animate = (currentTime: number) => {
  const elapsed = (currentTime - startTime) / 1000; // in seconds
  const simTime = elapsed * 2; // speed up simulation
  
  if (simTime >= timeOfFlight) {
   setTime(timeOfFlight);
   setIsFiring(false);
  } else {
   setTime(simTime);
   animationRef.current = requestAnimationFrame(animate);
  }
  };
  animationRef.current = requestAnimationFrame(animate);
 }
 
 return () => cancelAnimationFrame(animationRef.current);
 }, [isFiring, timeOfFlight]);

 const fireCannon = () => {
 if (isFiring) return;
 setTime(0);
 setIsFiring(true);
 };

 const resetCannon = () => {
 setIsFiring(false);
 setTime(0);
 cancelAnimationFrame(animationRef.current);
 };

 const checkAnswer = () => {
 const userAns = parseFloat(ansMaxHeight);
 if (Math.abs(userAns - actualMaxHeight) < 0.5) {
  setFeedback('Correct! You found the vertex of the parabola correctly.');
 } else {
  setFeedback(`Incorrect. Hint: Vertex t = -b/(2a). Max height is ~${actualMaxHeight.toFixed(1)}m`);
 }
 };

 // Generate trajectory path for background
 const generateTrajectory = () => {
 let path = `M 0,${300 - height*5}`;
 for (let t = 0; t <= timeOfFlight; t += 0.1) {
  const x = v0x * t * 5;
  const y = 300 - (height + v0y * t - 0.5 * g * t * t) * 5;
  path += ` L ${x},${y}`;
 }
 return path;
 };

 const currentX = v0x * time * 5;
 const currentY = 300 - (height + v0y * time - 0.5 * g * time * time) * 5;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Quadratic Applications: Projectile Motion" />

  
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
  {/* LEFT: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#1c1b1b]  ? 'block' : 'hidden'} lg:block`}>
   <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
   <Target /> Theory & Context
   </h2>
   <div className="prose text-slate-700 dark:text-[#ffffff]">
   <p>
    Projectile motion traces a <strong>parabola</strong>, which is the graph of a quadratic function.
    The height of a projectile over time is modeled by the equation:
   </p>
   <div className={`bg-emerald-50 p-3 rounded-lg text-center font-mono my-4 border border-emerald-100 flex-col `}>
    h(t) = -½gt² + v₀_yt + h₀
   </div>
   <ul className="list-disc pl-5 space-y-2">
    <li><strong>h(t):</strong> Height at time t</li>
    <li><strong>g:</strong> Gravity (9.81 m/s²)</li>
    <li><strong>v₀_y:</strong> Initial vertical velocity (v₀·sin(θ))</li>
    <li><strong>h₀:</strong> Initial height</li>
   </ul>
   <h3 className="font-semibold text-emerald-800 mt-4">Finding Maximum Height</h3>
   <p>
    The maximum height occurs at the vertex of the parabola. The time it takes to reach the peak is <code>t = -b / (2a)</code>, where <code>a = -½g</code> and <code>b = v₀_y</code>.
   </p>
   </div>
  </div>

  {/* MIDDLE: Simulation */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-emerald-800 mb-4">Physics Cannon Simulator</h2>
   
   <div className={`w-full max-w-md grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
   <div>
    <label className="block text-xs font-semibold mb-1">Velocity: {velocity} m/s</label>
    <input type="range" min="10" max="40" value={velocity} onChange={e => {setVelocity(Number(e.target.value)); resetCannon();}} className="w-full accent-emerald-600" disabled={isFiring} />
   </div>
   <div>
    <label className="block text-xs font-semibold mb-1">Angle: {angle}°</label>
    <input type="range" min="10" max="85" value={angle} onChange={e => {setAngle(Number(e.target.value)); resetCannon();}} className="w-full accent-emerald-600" disabled={isFiring} />
   </div>
   <div>
    <label className="block text-xs font-semibold mb-1">Height: {height} m</label>
    <input type="range" min="0" max="30" value={height} onChange={e => {setHeight(Number(e.target.value)); resetCannon();}} className="w-full accent-emerald-600" disabled={isFiring} />
   </div>
   </div>

   <div className={`relative w-full h-80 bg-sky-100 rounded-lg overflow- border-2 border-slate-300 dark:border-[#1c1b1b] shadow-inner flex-col `}>
   <svg viewBox="0 0 600 300" className="w-full h-full" preserveAspectRatio="xMinYMax meet">
    {/* Ground */}
    <rect x="0" y="300" width="600" height="20" fill="#22c55e" />
    
    {/* Trajectory Guide */}
    <path d={generateTrajectory()} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
    
    {/* Cannon Tower */}
    <rect x="0" y={300 - height*5} width="20" height={height*5} fill="#64748b" />
    
    {/* Projectile */}
    <circle cx={currentX} cy={currentY} r="6" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
   </svg>

   {/* Telemetry overlay */}
   <div className="absolute top-2 left-2 bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212]/80 p-2 rounded text-xs font-mono border border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    <div>Time: {time.toFixed(2)} s</div>
    <div>Height: {Math.max(0, height + v0y * time - 0.5 * g * time * time).toFixed(1)} m</div>
    <div>Distance: {(v0x * time).toFixed(1)} m</div>
   </div>
   </div>
   
   <div className="flex gap-4 mt-4 w-full max-w-md">
    <button onClick={fireCannon} disabled={isFiring} className="flex-1 min-w-0 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
    Fire Cannon
    </button>
    <button onClick={resetCannon} className="flex-1 min-w-0 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] font-bold py-2 px-4 rounded transition-colors">
    Reset
    </button>
   </div>
  </div>

  {/* RIGHT: Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#1c1b1b] `}>
   <h2 className="text-xl font-bold text-emerald-800 mb-4">Laboratory Assessment</h2>
   
   <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 mb-6">
   <h3 className="font-semibold text-emerald-900 mb-2">Calculate Maximum Height</h3>
   <p className="text-slate-700 dark:text-[#ffffff] mb-4 text-sm">
    Using the current simulator parameters, write the quadratic equation and determine the peak altitude of the projectile.
   </p>
   <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b] mb-4 font-mono text-xs">
    <p>v₀ = {velocity} m/s, θ = {angle}°</p>
    <p>v₀_y = {velocity} × sin({angle}°) ≈ {v0y.toFixed(2)} m/s</p>
    <p>h₀ = {height} m</p>
    <p className="mt-2 text-emerald-700">h(t) = -4.905t² + {v0y.toFixed(2)}t + {height}</p>
   </div>
   
   <div className="mb-4">
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-1">Max Height (m):</label>
    <input 
    type="number" 
    value={ansMaxHeight} 
    onChange={e => setAnsMaxHeight(e.target.value)}
    className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-emerald-500 outline-none"
    placeholder="e.g. 25.5"
    />
   </div>

   <button 
    onClick={checkAnswer}
    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
   >
    Verify Calculation
   </button>

   {feedback && (
    <div className={`mt-4 p-3 rounded text-sm flex items-start gap-2 ${feedback.includes('Correct') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
    {feedback.includes('Correct') ? <CheckCircle2 className="shrink-0 mt-0.5" size={16} /> : <XCircle className="shrink-0 mt-0.5" size={16} />}
    <span>{feedback}</span>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
