import { useState, useEffect, Fragment } from 'react';
import {Plus, CheckCircle, Info, Lock } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabP10ThermalExpansionSolid({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // Setup State
 const [material, setMaterial] = useState<string>('Copper');
 const [length, setLength] = useState<number>(5); // meters
 const [targetTemp, setTargetTemp] = useState<number>(20); // Celsius
 const [isLocked, setIsLocked] = useState<boolean>(false);
 
 // Simulation State
 const [currentTemp, setCurrentTemp] = useState<number>(20);
 const [noise, setNoise] = useState<number>(0);
 const [boltSnapped, setBoltSnapped] = useState<boolean>(false);
 
 // Data State
 const [dataLog, setDataLog] = useState<{id: number, mat: string, L0: number, dT: number, dL: number}[]>([]);
 const [studentAnswer, setStudentAnswer] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 // Constants
 const materials: Record<string, { alpha: number, color: string, name: string }> = {
 'Aluminum': { alpha: 23, color: '#cbd5e1', name: 'Aluminum' },
 'Copper': { alpha: 17, color: '#b45309', name: 'Copper' },
 'Steel': { alpha: 12, color: '#64748b', name: 'Steel' },
 'Mystery': { alpha: 15, color: '#d8b4fe', name: 'Mystery Metal' }
 };

 // Temperature animation
 useEffect(() => {
 if (currentTemp === targetTemp) return;
 const step = currentTemp < targetTemp ? 1 : -1;
 const timer = setInterval(() => {
  setCurrentTemp(t => {
  if (Math.abs(t - targetTemp) <= 1) return targetTemp;
  return t + step * (Math.max(0.5, Math.abs(t - targetTemp) / 15));
  });
 }, 50);
 return () => clearInterval(timer);
 }, [currentTemp, targetTemp]);

 // Noise generator for realistic micrometer reading
 useEffect(() => {
 const timer = setInterval(() => {
  if (currentTemp > 20 && !boltSnapped) {
  setNoise((Math.random() - 0.5) * 0.08);
  } else {
  setNoise(0);
  }
 }, 250);
 return () => clearInterval(timer);
 }, [currentTemp, boltSnapped]);

 // Bolt snapping logic
 useEffect(() => {
 if (isLocked && currentTemp - 20 > 80 && !boltSnapped) {
  setBoltSnapped(true);
 }
 }, [currentTemp, isLocked, boltSnapped]);

 // Physics calculation
 const dT = currentTemp - 20;
 const exactDL_mm = materials[material].alpha * length * dT * 0.001; // alpha is in 10^-6, so *10^-6 * 10^3 = 0.001
 const isConstrained = isLocked && !boltSnapped;
 const measuredDL = isConstrained ? 0 : Math.max(0, exactDL_mm + noise);

 const handleRecord = () => {
 setDataLog(prev => [...prev, { id: Date.now(), mat: material, L0: length, dT: Math.round(dT), dL: Number(measuredDL.toFixed(2)) }]);
 };

 const checkAnswer = () => {
 const expected = 15; // Mystery metal alpha
 const ans = parseFloat(studentAnswer);
 if (!isNaN(ans) && Math.abs(ans - expected) < 0.5) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 // Max values for graph
 const maxDT = 180;
 const dynamicMaxDL = Math.max(25, ...dataLog.map(d => d.dL));

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Thermal Expansion of Solids" subtitle="Measure how much metal rods expand when heated, and observe the massive forces generated." />

  
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
  <div className="lg:flex-1 p-4 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 max-w-7xl mx-auto w-full overflow-y-auto lg:overflow-visible">
  
  {/* Left Column: Theory & Setup */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col gap-6 lg:overflow-y-auto  ? 'flex' : 'hidden'} lg:flex`}>
   <div>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2">Theory & Setup</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed mb-4">
    When a solid is heated, its atoms vibrate more vigorously, causing the material to expand. 
    The change in length (ΔL) is proportional to the initial length (L₀) and the change in temperature (ΔT).
   </p>
   <div className={`bg-orange-50 p-3 rounded-lg flex items-start gap-2 border border-orange-100 `}>
    <Info className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
    <p className="text-xs text-orange-800">
    Formula: <br />
    <code className="bg-orange-100 px-1 rounded font-mono text-sm">ΔL = α · L₀ · ΔT</code><br />
    <span className="mt-1 block">where <strong>α</strong> is the coefficient of linear expansion.</span>
    </p>
   </div>
   </div>

   <div className="space-y-5">
   <div>
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">Metal Type</label>
    <select 
    value={material} 
    onChange={(e) => { setMaterial(e.target.value); setTargetTemp(20); setBoltSnapped(false); }}
    className={`w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg bg-slate-50 dark:bg-[#121212] focus:ring-2 focus:ring-orange-500 flex-col `}
    >
    {Object.entries(materials).map(([key, m]) => (
     <option key={key} value={key}>{m.name}</option>
    ))}
    </select>
   </div>

   <div>
    <label className="flex justify-between text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">
    <span>Initial Length (L₀)</span>
    <span className="text-orange-700">{length} m</span>
    </label>
    <input 
    type="range" min="1" max="10" step="1" 
    value={length} 
    onChange={(e) => { setLength(Number(e.target.value)); setTargetTemp(20); setBoltSnapped(false); }}
    className="w-full accent-orange-600"
    />
   </div>

   <div>
    <label className="flex justify-between text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">
    <span>Target Temperature (T)</span>
    <span className="text-red-600">{targetTemp} °C</span>
    </label>
    <input 
    type="range" min="20" max="200" step="10" 
    value={targetTemp} 
    onChange={(e) => setTargetTemp(Number(e.target.value))}
    className="w-full accent-red-600"
    />
   </div>

   <label className={`flex items-center gap-3 p-3 border border-slate-200 dark:border-[#1c1b1b] rounded-lg bg-slate-50 dark:bg-[#121212] cursor-pointer hover:bg-slate-100 dark:bg-[#121212] transition-colors flex-col `}>
    <input 
    type="checkbox" 
    checked={isLocked} 
    onChange={(e) => { setIsLocked(e.target.checked); setBoltSnapped(false); setTargetTemp(20); }}
    className="w-5 h-5 accent-slate-800"
    />
    <div className="flex-1">
    <div className="font-semibold text-sm text-slate-800 dark:text-[#ffffff] flex items-center gap-1"><Lock className="w-4 h-4"/> Restrain Expansion</div>
    <div className="text-xs text-slate-500 dark:text-[#71717a]">Lock the free end with a cast-iron bolt.</div>
    </div>
   </label>
   </div>
   
   <div className="mt-auto">
   <h3 className="text-sm font-bold text-slate-800 dark:text-[#ffffff] mb-2">Analysis Task</h3>
   <p className="text-xs text-slate-600 dark:text-[#a1a1aa] mb-3">
    Heat the <strong>Mystery Metal</strong> to various temperatures and record the expansion. 
    Use your data to calculate its coefficient of linear expansion, <strong>α</strong>.
   </p>
   <div className="flex gap-2">
    <input 
    type="number" step="0.1"
    placeholder="e.g. 15.0"
    value={studentAnswer}
    onChange={(e) => setStudentAnswer(e.target.value)}
    className="flex-1 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg text-sm"
    />
    <span className="text-xs text-slate-500 dark:text-[#71717a] flex items-center">× 10⁻⁶ /°C</span>
    <button 
    onClick={checkAnswer}
    className={`px-4 py-2 bg-[#121212] dark:bg-[#121212] text-white rounded-lg text-sm font-medium hover:bg-slate-700 dark:bg-[#121212] flex-col `}
    >
    Check
    </button>
   </div>
   {isCorrect === true && <p className="text-green-600 text-xs mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Correct! It matches the Mystery Metal.</p>}
   {isCorrect === false && <p className="text-red-500 text-xs mt-2">Incorrect. Check your formula: α = ΔL / (L₀ × ΔT).</p>}
   </div>
  </div>

  {/* Middle Column: Simulation */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col items-center justify-between  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="w-full flex justify-between gap-4 mb-4">
    <div className="flex-1 text-center bg-slate-100 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <p className="text-xs text-slate-500 dark:text-[#71717a] uppercase font-bold tracking-wider">Current Temp</p>
    <p className={`text-2xl font-mono ${currentTemp > 50 ? 'text-red-600' : 'text-slate-800 dark:text-slate-100'}`}>
     {currentTemp.toFixed(1)} <span className="text-sm">°C</span>
    </p>
    </div>
    <div className="flex-1 text-center bg-blue-50 p-3 rounded-lg border border-blue-200 dark:bg-teal-950/20 dark:border-teal-900">
    <p className="text-xs text-blue-600 uppercase font-bold tracking-wider">Measured ΔL</p>
    <p className="text-2xl font-mono text-blue-700">{measuredDL.toFixed(2)} <span className="text-sm">mm</span></p>
    </div>
   </div>

   <div className="relative flex-1 w-full bg-[#000000] dark:bg-[#121212] rounded-xl overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[300px]">
    <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-xl overflow-visible">
    <defs>
     <linearGradient id="glow" x1="0" x2="0" y1="0" y2="1">
     <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
     <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
     </linearGradient>
    </defs>

    {/* Fixed Wall Left */}
    <rect x="20" y="50" width="30" height="100" fill="#334155" rx="2" />
    <rect x="10" y="40" width="10" height="120" fill="#1e293b" rx="2" />
    {/* Wall bolts */}
    <circle cx="35" cy="70" r="4" fill="#64748b" />
    <circle cx="35" cy="130" r="4" fill="#64748b" />

    {/* The Rod */}
    <g transform={`translate(50, 85)`}>
     {/* Base Rod */}
     <rect 
     x="0" y="0" 
     width={200 + (isConstrained ? 0 : measuredDL * 2)} 
     height="30" 
     fill={materials[material].color} 
     rx="2"
     />
     {/* Heat Glow Overlay */}
     <rect 
     x="0" y="0" 
     width={200 + (isConstrained ? 0 : measuredDL * 2)} 
     height="30" 
     fill="#ef4444" 
     opacity={(currentTemp - 20) / 200}
     style={{ mixBlendMode: 'color-dodge' }}
     rx="2"
     />
     {/* Stress Color (if locked) */}
     {isConstrained && currentTemp > 40 && (
     <rect 
      x="0" y="0" width="200" height="30" 
      fill="#818cf8" opacity={(currentTemp - 20) / 100} 
      style={{ mixBlendMode: 'overlay' }} rx="2"
     />
     )}
    </g>

    {/* Right End: Dial Gauge or Bolt */}
    <g transform={`translate(${250 + (isConstrained ? 0 : measuredDL * 2)}, 0)`}>
     {isLocked ? (
     boltSnapped ? (
      // Snapped Bolt
      <g>
      <rect x="0" y="60" width="20" height="40" fill="#1e293b" transform="rotate(25 10 80)" />
      <rect x="0" y="100" width="20" height="40" fill="#1e293b" transform="rotate(-15 10 100)" />
      <text x="-10" y="50" fill="#fca5a5" fontSize="24" fontWeight="bold" className="animate-ping shadow-red-500">💥 SNAP!</text>
      </g>
     ) : (
      // Intact Bolt
      <g>
      <rect x="0" y="70" width="20" height="60" fill="#1e293b" rx="2" />
      <rect x="-5" y="60" width="30" height="10" fill="#0f172a" rx="2" />
      <rect x="-5" y="130" width="30" height="10" fill="#0f172a" rx="2" />
      {currentTemp > 80 && <text x="-5" y="55" fill="#fca5a5" fontSize="12" className="animate-pulse">Stress Critical!</text>}
      </g>
     )
     ) : (
     // Dial Gauge (Micrometer)
     <g>
      <rect x="0" y="95" width="20" height="10" fill="#94a3b8" />
      <circle cx="40" cy="100" r="25" fill="#f8fafc" stroke="#94a3b8" strokeWidth="4" />
      <circle cx="40" cy="100" r="2" fill="#334155" />
      {/* Gauge Needle (rotates based on dL) */}
      <line 
      x1="40" y1="100" x2="40" y2="82" 
      stroke="#ef4444" strokeWidth="2" strokeLinecap="round"
      transform={`rotate(${(measuredDL * 36) % 360} 40 100)`} 
      />
      {/* Ticks */}
      {[...Array(10)].map((_, i) => (
      <line key={i} x1="40" y1="75" x2="40" y2="80" stroke="#cbd5e1" strokeWidth="1" transform={`rotate(${i * 36} 40 100)`} />
      ))}
      <text x="40" y="115" fontSize="8" textAnchor="middle" fill="#64748b">mm</text>
     </g>
     )}
    </g>

    {/* Bunsen Burner */}
    <g transform="translate(130, 140)">
     <rect x="15" y="20" width="10" height="30" fill="#94a3b8" />
     <rect x="5" y="50" width="30" height="10" fill="#475569" rx="2" />
     {/* Flame */}
     {currentTemp > 25 && (
     <path 
      d="M20 20 Q10 10 20 -10 Q30 10 20 20" 
      fill="#3b82f6" opacity="0.8"
      transform={`scale(1, ${(targetTemp - 20) / 100})`}
      className="animate-pulse origin-bottom"
     />
     )}
    </g>
    </svg>

    {boltSnapped && (
    <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center pointer-events-none flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
     <div className="bg-[#000000] dark:!bg-[#121212] border-2 border-red-500 p-4 rounded-xl text-center shadow-2xl">
     <p className="font-bold text-red-400 text-lg mb-1">Catastrophic Failure</p>
     <p className="text-sm text-slate-300 max-w-xs">The thermal expansion generated thousands of Newtons of force, exceeding the shear strength of the cast iron bolt!</p>
     </div>
    </div>
    )}
   </div>

   <div className="flex w-full mt-4 justify-center">
   <button 
    onClick={handleRecord}
    disabled={isConstrained}
    className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 transition-all disabled:opacity-50"
   >
    <Plus className="w-5 h-5"/> Record Data Point
   </button>
   </div>
  </div>

  {/* Right Column: Data & Graph */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col gap-4">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Results & Graph</h2>
   
   <div className="h-48 border border-slate-200 dark:border-[#1c1b1b] rounded-lg lg:overflow-y-auto bg-slate-50 dark:bg-[#121212]">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-100 dark:bg-[#121212] sticky top-0 shadow-sm z-10">
    <tr>
     <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">Material</th>
     <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">L₀ (m)</th>
     <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">ΔT (°C)</th>
     <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">ΔL (mm)</th>
    </tr>
    </thead>
    <tbody>
    {dataLog.length === 0 ? (
     <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">No data recorded. Adjust temp and record points.</td></tr>
    ) : (
     dataLog.map((row) => (
     <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-100 dark:bg-[#121212] transition-colors">
      <td className="px-3 py-1.5">{row.mat}</td>
      <td className="px-3 py-1.5">{row.L0}</td>
      <td className="px-3 py-1.5 font-mono text-red-600">{row.dT}</td>
      <td className="px-3 py-1.5 font-mono text-blue-600 font-bold">{row.dL.toFixed(2)}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

   <div className="flex-1 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-4 relative min-h-[200px]">
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
    {/* Grid */}
    {[0, 25, 50, 75, 100].map(pct => (
     <Fragment key={pct}>
     <line x1="0" y1={pct} x2="100" y2={pct} stroke="#e2e8f0" strokeWidth="0.5" />
     <line x1={pct} y1="0" x2={pct} y2="100" stroke="#e2e8f0" strokeWidth="0.5" />
     </Fragment>
    ))}

    {/* Axes */}
    <line x1="0" y1="100" x2="100" y2="100" stroke="#64748b" strokeWidth="1" />
    <line x1="0" y1="0" x2="0" y2="100" stroke="#64748b" strokeWidth="1" />

    {/* Labels */}
    <text x="50" y="115" fontSize="4" textAnchor="middle" fill="#64748b">Temperature Change ΔT (°C)</text>
    <text x="-5" y="50" fontSize="4" textAnchor="middle" fill="#64748b" transform="rotate(-90 -5 50)">Expansion ΔL (mm)</text>
    
    <text x="95" y="105" fontSize="4" fill="#94a3b8">{maxDT}</text>
    <text x="-10" y="5" fontSize="4" fill="#94a3b8">{dynamicMaxDL.toFixed(0)}</text>

    {/* Data Points */}
    {dataLog.map((pt) => {
     const cx = (pt.dT / maxDT) * 100;
     const cy = 100 - (pt.dL / dynamicMaxDL) * 100;
     return (
     <circle key={pt.id} cx={cx} cy={cy} r="1.5" fill={materials[pt.mat].color} stroke="#334155" strokeWidth="0.5" className="animate-pulse" />
     );
    })}

    {/* Trend Line (connect origin to last point if same material) */}
    {dataLog.length > 0 && (
     <line 
     x1="0" y1="100" 
     x2={(dataLog[dataLog.length-1].dT / maxDT) * 100} 
     y2={100 - (dataLog[dataLog.length-1].dL / dynamicMaxDL) * 100} 
     stroke={materials[dataLog[dataLog.length-1].mat].color} 
     strokeWidth="0.5" strokeDasharray="2,2" 
     />
    )}
    </svg>
   </div>
  </div>
  </div>
 </div>
 );
}
