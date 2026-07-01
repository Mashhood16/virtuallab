import { useState, useMemo } from 'react';
import {Globe, Activity, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP12Gravitation({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [velocity, setVelocity] = useState<number>(7.67); // km/s
 const [height, setHeight] = useState<number>(400); // km

 const [leoAnswer, setLeoAnswer] = useState<string>('');
 const [geoAnswer, setGeoAnswer] = useState<string>('');
 const [leoStatus, setLeoStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
 const [geoStatus, setGeoStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 // Constants
 const Re = 6371; // Earth radius in km
 const mu = 3.986e5; // km^3/s^2 (G*M for Earth)

 const checkLeo = () => {
 const v = parseFloat(leoAnswer);
 if (!isNaN(v) && v >= 7.6 && v <= 7.7) setLeoStatus('correct');
 else setLeoStatus('incorrect');
 };

 const checkGeo = () => {
 const h = parseFloat(geoAnswer);
 if (!isNaN(h) && h >= 35700 && h <= 35850) setGeoStatus('correct');
 else setGeoStatus('incorrect');
 };

 // Trajectory calculation
 const trajectoryPoints = useMemo(() => {
 const pts = [];
 let x = 0;
 let y = Re + height;
 let vx = velocity;
 let vy = 0;
 let dt = 10; // seconds

 pts.push({ x, y });

 for (let i = 0; i < 15000; i++) {
  const r = Math.sqrt(x * x + y * y);
  if (r < Re) break; // Crash into Earth
  if (r > 100000) break; // Escaped far enough
  
  const ax = -mu * x / Math.pow(r, 3);
  const ay = -mu * y / Math.pow(r, 3);
  
  vx += ax * dt;
  vy += ay * dt;
  x += vx * dt;
  y += vy * dt;
  
  if (i % 50 === 0) {
  pts.push({ x, y });
  }
  
  // Check if complete orbit (crossed y axis)
  if (i > 100 && pts.length > 5 && Math.abs(x) < Math.abs(vx * dt) && y > 0) {
  pts.push({ x, y });
  break;
  }
 }
 return pts;
 }, [velocity, height]);

 // Determine scale
 const maxR = useMemo(() => {
 let max = Re + height;
 trajectoryPoints.forEach(p => {
  const r = Math.sqrt(p.x * p.x + p.y * p.y);
  if (r > max) max = r;
 });
 return Math.min(Math.max(max * 1.2, 10000), 50000); // cap to 50k km for view
 }, [trajectoryPoints, height]);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Orbital Mechanics & Gravitation" />

  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 lg:flex-1 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
  {/* Left Column: Theory */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">Newton's Cannonball</h2>
   <div className="text-slate-600 dark:text-[#a1a1aa] space-y-4">
   <p>
    Imagine a cannon on top of a very high mountain. If the cannonball is fired with low velocity, it falls back to Earth.
   </p>
   <p>
    As the firing velocity increases, the projectile travels further before hitting the ground. At a specific <strong>orbital velocity</strong>, the curve of the projectile's path matches the curvature of the Earth—it continuously falls but never hits the ground!
   </p>
   <div className={`bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
    <h3 className="font-semibold text-blue-900 mb-2 dark:text-[#ffffff]">Orbital Velocity Formula</h3>
    <p className="text-center font-mono text-lg text-blue-800 dark:text-[#ffffff]">
    v = √(GM / r)
    </p>
    <ul className="text-sm mt-2 space-y-1 text-blue-700">
    <li><strong>G</strong> = 6.67 × 10⁻¹¹ N·m²/kg²</li>
    <li><strong>M</strong> = 5.97 × 10²⁴ kg (Earth's mass)</li>
    <li><strong>r</strong> = Re + h (Distance from Earth's center)</li>
    <li><strong>Re</strong> = 6371 km</li>
    </ul>
   </div>
   <p>
    <strong>Geostationary Orbit (GEO):</strong> An orbit where the satellite's orbital period matches Earth's rotation (~24 hours). It appears stationary in the sky.
   </p>
   </div>
  </div>

  {/* Middle Column: Simulation */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2 w-full">
   <Globe className="text-indigo-500" />
   Interactive Orbit Visualizer
   </h2>
   
   <div className={`w-full aspect-square max-w-md bg-[#000000] dark:bg-[#121212] rounded-xl relative overflow- flex items-center justify-center border-4 border-[#1c1b1b] dark:border-[#1c1b1b] shadow-inner flex-col `}>
   <svg viewBox={`-${maxR} -${maxR} ${maxR * 2} ${maxR * 2}`} className="w-full h-full">
    {/* Grid */}
    <circle cx="0" cy="0" r={35786 + Re} fill="none" stroke="#334155" strokeWidth="100" strokeDasharray="1000 1000" />
    
    {/* Earth */}
    <circle cx="0" cy="0" r={Re} fill="#3b82f6" />
    <defs>
    <radialGradient id="earth-grad" cx="30%" cy="30%" r="70%">
     <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
     <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
    </radialGradient>
    </defs>
    <circle cx="0" cy="0" r={Re} fill="url(#earth-grad)" />
    
    {/* Trajectory */}
    {trajectoryPoints.length > 1 && (
    <path
     d={`M ${trajectoryPoints.map(p => `${p.x},${-p.y}`).join(' L ')}`}
     fill="none"
     stroke="#22d3ee"
     strokeWidth={maxR * 0.005}
     strokeLinecap="round"
     strokeLinejoin="round"
    />
    )}
    
    {/* Projectile Start */}
    <circle cx="0" cy={-(Re + height)} r={maxR * 0.015} fill="#f43f5e" />
    
    {/* Projectile End/Current */}
    {trajectoryPoints.length > 0 && (
    <circle 
     cx={trajectoryPoints[trajectoryPoints.length - 1].x} 
     cy={-trajectoryPoints[trajectoryPoints.length - 1].y} 
     r={maxR * 0.02} 
     fill="#facc15" 
    />
    )}
   </svg>
   
   {/* Status Overlay */}
   <div className={`absolute top-4 left-4 bg-[#121212] dark:bg-[#121212] lg:dark:bg-[#121212]/80 text-white text-xs p-2 rounded backdrop-blur border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    {trajectoryPoints[trajectoryPoints.length - 1] && Math.sqrt(Math.pow(trajectoryPoints[trajectoryPoints.length - 1].x, 2) + Math.pow(trajectoryPoints[trajectoryPoints.length - 1].y, 2)) <= Re * 1.01 ? (
    <span className="text-red-400 font-bold">CRASHED</span>
    ) : trajectoryPoints.length >= 15000 / 50 || (trajectoryPoints[trajectoryPoints.length - 1]?.x ?? 0) < 0 ? (
    <span className="text-green-400 font-bold">STABLE ORBIT</span>
    ) : (
    <span className="text-orange-400 font-bold">ESCAPING</span>
    )}
   </div>
   </div>

   <div className="w-full mt-6 space-y-4">
   <div>
    <div className="flex justify-between mb-1">
    <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">Launch Velocity (v)</label>
    <span className="text-sm font-mono text-indigo-600">{velocity.toFixed(2)} km/s</span>
    </div>
    <input 
    type="range" 
    min="0" max="12" step="0.01" 
    value={velocity} 
    onChange={(e) => setVelocity(parseFloat(e.target.value))}
    className="w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
   </div>
   <div>
    <div className="flex justify-between mb-1">
    <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">Launch Altitude (h)</label>
    <span className="text-sm font-mono text-indigo-600">{height} km</span>
    </div>
    <input 
    type="range" 
    min="0" max="40000" step="100" 
    value={height} 
    onChange={(e) => setHeight(parseFloat(e.target.value))}
    className="w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
   </div>
   </div>
  </div>

  {/* Right Column: Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-6 lg:overflow-y-auto `}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <Activity className="text-emerald-500" />
   Engineering Tasks
   </h2>

   <div className="space-y-6">
   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Task 1: LEO Velocity</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
    Calculate the required orbital velocity for a Low Earth Orbit (LEO) satellite at an altitude of <strong>400 km</strong>.
    Use Re = 6371 km, GM = 3.986×10¹⁴ m³/s². (Convert to km/s).
    </p>
    <div className="flex gap-2">
    <input 
     type="text" 
     value={leoAnswer}
     onChange={(e) => setLeoAnswer(e.target.value)}
     placeholder="e.g. 7.67"
     className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
    <button 
     onClick={checkLeo}
     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
     Check
    </button>
    </div>
    {leoStatus === 'correct' && <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1"><CheckCircle size={16}/> Correct! v ≈ 7.67 km/s.</p>}
    {leoStatus === 'incorrect' && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><XCircle size={16}/> Try again. Check units (km vs m).</p>}
   </div>

   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Task 2: Geostationary Altitude</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
    A Geostationary satellite completes one orbit in 24 hours (86400 seconds). Calculate the required <strong>altitude (h)</strong> in km above Earth's surface. 
    Hint: Use Kepler's Third Law: T² = (4π²/GM)r³.
    </p>
    <div className="flex gap-2">
    <input 
     type="text" 
     value={geoAnswer}
     onChange={(e) => setGeoAnswer(e.target.value)}
     placeholder="e.g. 35786"
     className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
    <button 
     onClick={checkGeo}
     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
     Check
    </button>
    </div>
    {geoStatus === 'correct' && <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1"><CheckCircle size={16}/> Correct! GEO altitude is ~35,786 km.</p>}
    {geoStatus === 'incorrect' && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><XCircle size={16}/> Try again. Remember to subtract Earth's radius!</p>}
   </div>
   
   <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
    <h3 className="text-orange-800 font-semibold mb-1">Challenge</h3>
    <p className="text-sm text-orange-700">
    Set altitude to 35800 km and velocity to ~3.07 km/s on the simulator to visually confirm your Geostationary calculations!
    </p>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
