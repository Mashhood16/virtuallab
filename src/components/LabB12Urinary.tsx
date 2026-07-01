import { useState, useEffect } from 'react';
import { Droplet, Target, Zap, Activity, CheckCircle2, RotateCcw, LineChart, Table2, Play } from 'lucide-react';
import LabHeader from './LabHeader';

type Particle = { id: number; x: number; y: number; vx: number; vy: number; type: 'urea' | 'rbc' };

export default function LabB12Urinary({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeTab, setActiveTab] = useState<'dialysis' | 'eswl'>('dialysis');
 
 // Dialysis State
 const [particles, setParticles] = useState<Particle[]>([]);
 const [isDialyzing, setIsDialyzing] = useState(false);
 const [poreSize, setPoreSize] = useState(5); // Scale 1-10
 const [timeElapsed, setTimeElapsed] = useState(0);
 const [equilibriumReached, setEquilibriumReached] = useState(false);

 // Data & Analysis
 const [dataPoints, setDataPoints] = useState<{ poreSize: number; clearanceTime: number }[]>([]);
 const [studentClearance, setStudentClearance] = useState('');
 const [clearanceStatus, setClearanceStatus] = useState<boolean | null>(null);

 // ESWL State
 const [intensity, setIntensity] = useState(50);
 const [stonePieces, setStonePieces] = useState(1);
 const [kidneyHealth, setKidneyHealth] = useState(100);
 const [shockFired, setShockFired] = useState(false);

 // Initialize Particles
 const initDialysis = () => {
 const pts: Particle[] = [];
 // 50 Urea particles on the left (blood side)
 for(let i=0; i<50; i++) {
  pts.push({
   id: i,
   x: Math.random() * 130 + 10,
   y: Math.random() * 180 + 10,
   vx: (Math.random() - 0.5) * 5,
   vy: (Math.random() - 0.5) * 5,
   type: 'urea'
  });
 }
 // 20 RBCs on the left
 for(let i=50; i<70; i++) {
  pts.push({
   id: i,
   x: Math.random() * 130 + 10,
   y: Math.random() * 180 + 10,
   vx: (Math.random() - 0.5) * 2,
   vy: (Math.random() - 0.5) * 2,
   type: 'rbc'
  });
 }
 setParticles(pts);
 setIsDialyzing(false);
 setTimeElapsed(0);
 setEquilibriumReached(false);
 };

 useEffect(() => { initDialysis(); }, []);

 // Dialysis Simulation Loop
 useEffect(() => {
 let timer: number;
 let timeTimer: number;

 if (isDialyzing) {
  timer = window.setInterval(() => {
  setParticles(prev => {
   let leftUreaCount = 0;
   
   const next = prev.map(p => {
    let nx = p.x + p.vx;
    let ny = p.y + p.vy;
    let nvx = p.vx;
    let nvy = p.vy;

    // Bounding box (width 300, height 200)
    if (ny <= 5 || ny >= 195) nvy = -nvy;
    if (nx <= 5 || nx >= 295) nvx = -nvx;

    // Membrane interaction at x=150
    const size = p.type === 'urea' ? 2 : 8;
    if ((p.x <= 150 && nx > 150) || (p.x >= 150 && nx < 150)) {
    if (size > poreSize) {
     // Bounce back if too large
     nvx = -nvx;
     nx = p.x + nvx;
    }
    }

    if (p.type === 'urea' && nx <= 150) leftUreaCount++;
    
    return { ...p, x: nx, y: ny, vx: nvx, vy: nvy };
   });

   if (leftUreaCount <= 26 && !equilibriumReached) {
   setEquilibriumReached(true);
   setIsDialyzing(false);
   }

   return next;
  });
  }, 50);

  timeTimer = window.setInterval(() => setTimeElapsed(t => t + 0.05), 50);
 }

 return () => { clearInterval(timer); clearInterval(timeTimer); };
 }, [isDialyzing, poreSize, equilibriumReached]);

 const leftUrea = particles.filter(p => p.type === 'urea' && p.x <= 150).length;

 const recordData = () => {
 if (equilibriumReached) {
  setDataPoints(prev => [...prev, { poreSize, clearanceTime: timeElapsed }]);
 }
 };

 const checkClearance = () => {
 // Expected answer is 90
 const val = parseFloat(studentClearance);
 if (!isNaN(val) && Math.abs(val - 90) < 1) {
  setClearanceStatus(true);
 } else {
  setClearanceStatus(false);
 }
 };

 const maxPore = 10;
 const maxTime = Math.max(20, ...dataPoints.map(d => d.clearanceTime)) || 20;

 // ESWL logic
 const fireShockwave = () => {
 setShockFired(true);
 setTimeout(() => setShockFired(false), 200);

 if (intensity < 40) {
  // Too weak
 } else if (intensity > 80) {
  setKidneyHealth(h => Math.max(0, h - 20));
  setStonePieces(p => Math.min(32, p * 2));
 } else {
  setStonePieces(p => Math.min(32, p * 2));
 }
 };

 const resetEswl = () => {
 setStonePieces(1);
 setKidneyHealth(100);
 setIntensity(50);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Lab B12.3: Excretory System & Surgical Tech" subtitle="Haemodialysis Membranes & Extracorporeal Shockwave Lithotripsy" />

  
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
  <main className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 overflow-y-auto lg:overflow-visible">
  {/* Left Column: Theory */}
  <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
   <Droplet className="w-5 h-5 text-teal-600"/> Theory & Context
   </h2>
   <div className="prose text-slate-700 dark:text-[#ffffff] text-sm flex flex-col gap-3">
   <p><strong>Haemodialysis:</strong> An artificial process of removing metabolic wastes (like urea) from the blood when the kidneys fail. It relies on diffusion across a semi-permeable membrane. The rate of clearance depends heavily on the membrane's pore size relative to the molecular weight of the solutes.</p>
   <p><strong>Membrane Selectivity:</strong> Ideal dialyzer membranes allow small toxic molecules (urea size ~60 Da) to pass freely into the dialysate, while retaining larger essential components like Red Blood Cells and proteins within the bloodstream.</p>
   <p><strong>Lithotripsy (ESWL):</strong> A non-invasive treatment for kidney stones. Acoustic shock waves are focused precisely on the stone to fragment it into passable grains. Incorrect intensity can lead to severe renal tissue trauma.</p>
   <div className={`bg-teal-50 p-3 rounded-lg border border-teal-100 mt-2 flex-col `}>
    <h3 className="font-semibold text-teal-800 text-sm mb-1">Key Objectives:</h3>
    <ul className="list-disc pl-4 text-teal-900 text-xs flex flex-col gap-1">
    <li>Observe size-exclusion diffusion in dialysis.</li>
    <li>Determine the relationship between pore size and clearance time.</li>
    <li>Balance shockwave intensity to shatter stones without organ damage.</li>
    </ul>
   </div>
   </div>
  </div>

  {/* Middle Column: Simulator */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold flex items-center gap-2 w-full text-left mb-4 text-slate-800 dark:text-[#ffffff]">
   <Activity className="w-5 h-5 text-teal-600"/> Interactive Simulator
   </h2>
   
   <div className="flex gap-2 w-full mb-6">
   <button onClick={() => { setActiveTab('dialysis'); setIsDialyzing(false); }} className={`flex-1 py-2 rounded-lg font-medium transition-colors ${activeTab === 'dialysis' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}>Haemodialysis</button>
   <button onClick={() => { setActiveTab('eswl'); }} className={`flex-1 py-2 rounded-lg font-medium transition-colors ${activeTab === 'eswl' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}>ESWL Procedure</button>
   </div>

   {activeTab === 'dialysis' ? (
   <div className="w-full flex flex-col items-center gap-4">
    <div className={`w-full bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-100 mb-2 flex-col `}>
    <label className="flex justify-between text-sm font-semibold mb-2 text-slate-700 dark:text-[#ffffff]">
     <span className="flex items-center gap-1"><Target className="w-4 h-4"/> Membrane Pore Size</span>
     <span className="text-teal-600 text-xs font-mono">{poreSize} µm</span>
    </label>
    <input type="range" min="1" max="10" value={poreSize} onChange={e => setPoreSize(Number(e.target.value))} disabled={isDialyzing || timeElapsed > 0} className="w-full accent-teal-600 cursor-pointer" />
    </div>

    {/* Dialysis Visualization */}
    <div className="relative w-full h-56 bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] border-2 border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] rounded-lg flex shadow-inner flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    {/* Blood Side Background */}
    <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-red-50 opacity-50 z-0 border-r-2 border-dashed border-teal-500"></div>
    <svg viewBox="0 0 300 200" className="w-full h-full relative z-10">
     {particles.map(p => (
     <circle key={p.id} cx={p.x} cy={p.y} r={p.type === 'urea' ? 3 : 8} fill={p.type === 'urea' ? '#eab308' : '#ef4444'} className="transition-all duration-75" />
     ))}
    </svg>
    {equilibriumReached && (
     <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-[#121212]/60 backdrop-blur-sm z-20">
      <span className="text-sm font-bold text-teal-700 bg-teal-100 px-3 py-1 rounded-full border border-teal-300">Equilibrium Reached</span>
     </div>
    )}
    </div>
    
    <div className="w-full grid grid-cols-2 gap-3 text-sm mt-2">
    <div className="flex flex-col bg-red-50 p-2 rounded border border-red-100">
     <span className="text-red-700 font-semibold text-xs uppercase">Blood Urea Level</span>
     <span className="font-mono font-bold text-lg text-red-900">{leftUrea}</span>
    </div>
    <div className="flex flex-col bg-slate-50 dark:bg-[#121212] p-2 rounded border border-slate-200 dark:border-[#1c1b1b]">
     <span className="text-slate-500 dark:text-[#71717a] font-semibold text-xs uppercase">Clearance Time</span>
     <span className="font-mono font-bold text-lg text-slate-800 dark:text-[#ffffff]">{timeElapsed.toFixed(1)} s</span>
    </div>
    </div>

    <div className="grid grid-cols-2 gap-3 w-full mt-2">
    <button onClick={() => setIsDialyzing(true)} disabled={isDialyzing || equilibriumReached} className="flex items-center justify-center gap-1 bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 disabled:opacity-50 font-medium transition-colors dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40"><Play className="w-4 h-4"/> Start Flow</button>
    <button onClick={initDialysis} className="flex items-center justify-center gap-1 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] p-3 rounded-lg hover:bg-slate-300 dark:bg-[#121212] font-medium transition-colors"><RotateCcw className="w-4 h-4"/> Reset Machine</button>
    </div>
   </div>
   ) : (
   <div className="w-full flex flex-col items-center gap-4">
    <div className="w-full bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-100 mb-2">
    <label className="flex justify-between text-sm font-semibold mb-2 text-slate-700 dark:text-[#ffffff]">
     <span className="flex items-center gap-1"><Zap className="w-4 h-4"/> Shockwave Intensity</span>
     <span className="text-indigo-600 text-xs font-mono">{intensity}%</span>
    </label>
    <input type="range" min="10" max="100" value={intensity} onChange={e => setIntensity(Number(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
    </div>

    {/* ESWL Visualization */}
    <div className="relative w-full h-56 bg-slate-100 dark:bg-[#121212] border-2 border-slate-300 dark:border-[#1c1b1b] rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
    <svg viewBox="0 0 200 200" className="w-3/4 h-3/4">
     {/* Kidney */}
     <path d="M 130 30 C 190 30 190 170 130 170 C 80 170 80 120 100 100 C 80 80 80 30 130 30 Z" fill={kidneyHealth > 50 ? "#fca5a5" : "#f87171"} stroke={kidneyHealth > 50 ? "#ef4444" : "#b91c1c"} strokeWidth="4" className="transition-colors duration-500" />
     
     {/* Stone */}
     {stonePieces === 1 && <polygon points="120,90 135,95 125,110 110,100" fill="#eab308" stroke="#a16207" strokeWidth="2" />}
     {stonePieces > 1 && Array.from({length: stonePieces}).map((_, i) => {
      const dx = Math.cos(i) * (stonePieces * 1.5);
      const dy = Math.sin(i) * (stonePieces * 1.5);
      return <circle key={i} cx={120 + dx} cy={100 + dy} r={Math.max(1, 6 - stonePieces/4)} fill="#eab308" />
     })}

     {/* Shockwave effect */}
     {shockFired && (
      <circle cx="120" cy="100" r={intensity * 0.8} fill="none" stroke="#6366f1" strokeWidth="6" className="animate-ping" opacity="0.6" />
     )}
    </svg>
    {kidneyHealth < 100 && <span className="absolute top-2 right-2 text-xs font-bold text-red-600 bg-red-100 px-2 rounded">Tissue Damage!</span>}
    {stonePieces > 15 && <span className="absolute top-2 left-2 text-xs font-bold text-green-600 bg-green-100 px-2 rounded">Stone Shattered!</span>}
    </div>

    <div className="w-full grid grid-cols-2 gap-3 text-sm mt-2">
    <div className="flex flex-col bg-indigo-50 p-2 rounded border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
     <span className="text-indigo-700 font-semibold text-xs uppercase">Stone Integrity</span>
     <span className="font-mono font-bold text-lg text-indigo-900 dark:text-[#ffffff]">{Math.max(0, 100 - stonePieces * 5)}%</span>
    </div>
    <div className="flex flex-col bg-red-50 p-2 rounded border border-red-100">
     <span className="text-red-700 font-semibold text-xs uppercase">Kidney Health</span>
     <span className="font-mono font-bold text-lg text-red-900">{kidneyHealth}%</span>
    </div>
    </div>

    <div className="grid grid-cols-2 gap-3 w-full mt-2">
    <button onClick={fireShockwave} className="flex items-center justify-center gap-1 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 font-bold active:scale-95 transition-all dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"><Zap className="w-4 h-4"/> FIRE SHOCKWAVE</button>
    <button onClick={resetEswl} className="flex items-center justify-center gap-1 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] p-3 rounded-lg hover:bg-slate-300 dark:bg-[#121212] font-medium transition-colors"><RotateCcw className="w-4 h-4"/> Reset Patient</button>
    </div>
   </div>
   )}
  </div>

  {/* Right Column: Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-4 lg:overflow-y-auto `}>
   <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
   <LineChart className="w-5 h-5 text-teal-600"/> Data & Analysis
   </h2>
   
   <div className="flex justify-between items-center bg-slate-50 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <span className="text-sm text-slate-600 dark:text-[#a1a1aa] font-medium flex items-center gap-2"><Table2 className="w-4 h-4"/> Dialysis Logs</span>
    <button onClick={recordData} disabled={activeTab !== 'dialysis' || !equilibriumReached} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
    Log Result
    </button>
   </div>

   <div className="overflow-x-auto border border-slate-200 dark:border-[#1c1b1b] rounded-lg max-h-40">
   <table className="w-full text-sm text-left text-slate-600 dark:text-[#a1a1aa]">
    <thead className="text-xs text-slate-700 dark:text-[#ffffff] uppercase bg-slate-100 dark:bg-[#121212] sticky top-0">
    <tr>
     <th className="px-4 py-2 border-b">Trial</th>
     <th className="px-4 py-2 border-b">Pore Size</th>
     <th className="px-4 py-2 border-b">Time (s)</th>
    </tr>
    </thead>
    <tbody>
    {dataPoints.map((dp, i) => (
     <tr key={i} className="border-b last:border-0 hover:bg-slate-50 dark:bg-[#121212]">
     <td className="px-4 py-2 font-medium">{i + 1}</td>
     <td className="px-4 py-2">{dp.poreSize} µm</td>
     <td className="px-4 py-2">{dp.clearanceTime.toFixed(1)}</td>
     </tr>
    ))}
    {dataPoints.length === 0 && (
     <tr>
     <td colSpan={3} className="px-4 py-4 text-center text-slate-400 italic">No dialysis data recorded yet.</td>
     </tr>
    )}
    </tbody>
   </table>
   </div>

   {/* SVG Graph */}
   <div className="w-full h-48 bg-slate-50 dark:bg-[#121212] rounded-lg relative border border-slate-200 dark:border-[#1c1b1b] mt-2">
   <h3 className="absolute top-2 left-2 text-xs font-semibold text-slate-500 dark:text-[#71717a]">Clearance Time vs Pore Size</h3>
   <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible p-6">
    <line x1="0" y1="100" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1"/>
    <line x1="0" y1="100" x2="0" y2="0" stroke="#94a3b8" strokeWidth="1"/>
    
    {dataPoints.length > 1 && (
    <polyline 
     fill="none" 
     stroke="#0d9488" 
     strokeWidth="1.5" 
     points={dataPoints.map(dp => `${(dp.poreSize / maxPore) * 100},${100 - (dp.clearanceTime / maxTime) * 100}`).join(' ')} 
    />
    )}
    
    {dataPoints.map((dp, i) => (
    <circle key={i} cx={(dp.poreSize / maxPore) * 100} cy={100 - (dp.clearanceTime / maxTime) * 100} r="2.5" fill="#f59e0b" />
    ))}
   </svg>
   <span className="absolute bottom-1 right-2 text-[10px] text-slate-400">Pore Size</span>
   <span className="absolute top-2 left-1 text-[10px] text-slate-400 -rotate-90 origin-left">Time (s)</span>
   </div>

   {/* Assessment Section */}
   <div className={`bg-teal-50 border border-teal-200 rounded-lg p-4 mt-2 `}>
   <h3 className="font-bold text-teal-900 text-sm mb-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Clinical Assessment</h3>
   <p className="text-xs text-teal-800 mb-3 leading-relaxed">
    Calculate the <strong>Urea Clearance (C)</strong>.
    <br/>
    Given: Urine Urea (<span className="italic">U</span>) = 120 mg/mL, Urine Volume Flow (<span className="italic">V</span>) = 1.5 mL/min, Plasma Urea (<span className="italic">P</span>) = 2.0 mg/mL.
    <br/>
    <span className="font-mono bg-teal-100 px-1 rounded block mt-1 text-center font-bold">C = (U × V) / P</span>
   </p>
   <div className="flex gap-2">
    <input 
    type="number" 
    placeholder="Enter C (mL/min)..." 
    value={studentClearance} 
    onChange={e => { setStudentClearance(e.target.value); setClearanceStatus(null); }}
    className="flex-1 px-3 py-2 text-sm border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
    />
    <button 
    onClick={checkClearance} 
    className="bg-teal-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-teal-700 transition-colors dark:text-white dark:text-white dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40"
    >
    Verify
    </button>
   </div>
   {clearanceStatus !== null && (
    <div className={`mt-3 text-sm font-medium p-2 rounded ${clearanceStatus ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
    {clearanceStatus ? 'Correct! C = 90 mL/min.' : 'Incorrect. Re-evaluate the formula.'}
    </div>
   )}
   </div>

  </div>
  </main>
 </div>
 );
}
