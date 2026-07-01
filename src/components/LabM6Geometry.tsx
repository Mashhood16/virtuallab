import { useState, useEffect } from 'react';
import { ArrowLeft, Navigation, Disc, PencilRuler } from 'lucide-react';

export default function LabM6Geometry({ onExit }: { onExit?: () => void }) {
 // Symmetry State
 const [symmetryLines, setSymmetryLines] = useState(6);
 const [rotation, setRotation] = useState(0);

 // Compass Construction State
 const [targetAngle, setTargetAngle] = useState(60);
 const [compassStep, setCompassStep] = useState(0); 

 // Plumb Bob State
 const [bobAngle, setBobAngle] = useState(0);
 const [swing, setSwing] = useState(true);

 useEffect(() => {
 let animationFrameId: number;
 let time = 0;
 const animate = () => {
  if (swing) {
  time += 0.05;
  // Damped oscillation simulation
  setBobAngle(Math.sin(time) * 30);
  } else {
  setBobAngle(0);
  }
  animationFrameId = requestAnimationFrame(animate);
 };
 animate();
 return () => cancelAnimationFrame(animationFrameId);
 }, [swing]);

 return (
 <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#000000] text-slate-800 dark:text-[#ffffff] font-sans transition-colors duration-300">
  <header className="flex items-center p-4 shadow-sm z-10">
  <button onClick={onExit} className="p-2 mr-4 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
   <ArrowLeft className="w-6 h-6" />
  </button>
  <h1 className="text-lg md:text-xl font-bold">Class 6 Geometry: Symmetry & Construction</h1>
  </header>

  <div className="flex-1 min-w-0 flex flex-col lg:flex-row lg:overflow-hidden">
  {/* Left Column */}
  <div className="w-full lg:w-1/3 flex flex-col p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] gap-6">
   
   <section className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
   <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
    <Disc className="w-5 h-5" /> Ferris Wheel Symmetry
   </h2>
   <div className="space-y-4">
    <div>
    <label className="block text-sm mb-1 font-medium">Number of Cabins (Symmetry Lines): {symmetryLines}</label>
    <input type="range" min="3" max="12" value={symmetryLines} onChange={(e) => setSymmetryLines(Number(e.target.value))} className="w-full accent-indigo-600" />
    </div>
    <div>
    <label className="block text-sm mb-1 font-medium">Rotation Angle: {rotation}°</label>
    <input type="range" min="0" max="360" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full accent-indigo-600" />
    </div>
    <p className="text-sm p-2 rounded border border-indigo-100 dark:border-indigo-800/50">
    Angle between cabins: {(360 / symmetryLines).toFixed(1)}°
    </p>
   </div>
   </section>

   <section className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800">
   <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-rose-700 dark:text-rose-300">
    <Navigation className="w-5 h-5" /> Plumb Bob
   </h2>
   <p className="text-sm mb-3 text-slate-600 dark:text-[#71717a]">A plumb bob points perfectly vertical down due to gravity, establishing a reference line.</p>
   <div className="flex items-center gap-4">
    <button 
    onClick={() => setSwing(!swing)}
    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-rose-500/40"
    >
    {swing ? "Stop Swinging" : "Start Swinging"}
    </button>
    <div className="text-sm font-mono px-3 py-1 rounded border border-rose-200 dark:border-rose-800">
    Angle: {bobAngle.toFixed(1)}°
    </div>
   </div>
   </section>

   <section className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
   <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
    <PencilRuler className="w-5 h-5" /> Compass Construction
   </h2>
   <div className="space-y-4">
    <select 
    value={targetAngle}
    onChange={(e) => { setTargetAngle(Number(e.target.value)); setCompassStep(0); }}
    className="w-full p-2 rounded-lg border border-indigo-200 dark:border-indigo-700 focus:ring-2 focus:ring-indigo-500 outline-none"
    >
    <option value={60}>Construct 60° Angle</option>
    <option value={120}>Construct 120° Angle</option>
    <option value={90}>Construct 90° Angle</option>
    </select>
    
    <div className="flex flex-col gap-2">
    <button onClick={() => setCompassStep(0)} className={`p-2 text-left text-sm rounded transition-colors ${compassStep >= 0 ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100 font-medium' : ' hover:bg-slate-100 dark:hover:bg-slate-700'}`}>1. Draw base line & set origin A</button>
    <button onClick={() => setCompassStep(1)} disabled={compassStep < 0} className={`p-2 text-left text-sm rounded transition-colors ${compassStep >= 1 ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100 font-medium' : ' hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50'}`}>2. Draw arc from A cutting line at B</button>
    <button onClick={() => setCompassStep(2)} disabled={compassStep < 1} className={`p-2 text-left text-sm rounded transition-colors ${compassStep >= 2 ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100 font-medium' : ' hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50'}`}>3. Keep radius same, draw arc from B to intersect at C (60°)</button>
    
    {targetAngle !== 60 && (
     <button onClick={() => setCompassStep(2.5)} disabled={compassStep < 2} className={`p-2 text-left text-sm rounded transition-colors ${compassStep >= 2.5 ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100 font-medium' : ' hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50'}`}>
      {targetAngle === 120 ? "3b. Draw arc from C to intersect at D (120°)" : "3b. Find 120°, then bisect 60° and 120° for 90°"}
     </button>
    )}
    
    <button onClick={() => setCompassStep(3)} disabled={compassStep < (targetAngle === 60 ? 2 : 2.5)} className={`p-2 text-left text-sm rounded transition-colors ${compassStep >= 3 ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100 font-medium' : ' hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50'}`}>4. Draw line from A through intersection</button>
    </div>
   </div>
   </section>

  </div>

  {/* Right Column */}
  <div className="w-full lg:w-2/3 p-6 flex flex-col gap-6 lg:overflow-y-auto bg-slate-100/50 dark:bg-[#121212]/50">
   
   <div className="flex flex-col lg:flex-row gap-6 min-h-[300px]">
   {/* Ferris Wheel */}
   <div className="flex-1 min-w-0 bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[250px]">
    <h3 className="absolute top-4 left-4 text-sm font-bold text-slate-800 dark:text-[#ffffff]">Rotational Symmetry</h3>
    <svg width="200" height="200" viewBox="-100 -100 200 200" className="overflow-visible mt-4">
    <g transform={`rotate(${rotation})`} className="transition-transform duration-300">
     <circle cx="0" cy="0" r="80" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 dark:text-slate-600" />
     {Array.from({ length: symmetryLines }).map((_, i) => {
     const angle = (i * 360) / symmetryLines;
     const rad = (angle * Math.PI) / 180;
     const x = Math.cos(rad) * 80;
     const y = Math.sin(rad) * 80;
     return (
      <g key={i}>
      <line x1="0" y1="0" x2={x} y2={y} stroke="currentColor" strokeWidth="2" className="text-indigo-300 dark:text-indigo-700" />
      {/* Lines of symmetry overlay */}
      <line x1={-x*1.2} y1={-y*1.2} x2={x*1.2} y2={y*1.2} stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-indigo-400/40 dark:text-indigo-500/30" />
      {/* Cabin */}
      <circle cx={x} cy={y} r="8" className="fill-indigo-500 hover:fill-indigo-400 transition-colors cursor-pointer" />
      </g>
     );
     })}
     <circle cx="0" cy="0" r="10" className="fill-slate-800 dark:fill-slate-200" />
    </g>
    </svg>
   </div>

   {/* Plumb Bob */}
   <div className="lg:w-1/3 w-full bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col items-center min-h-[250px] relative">
    <h3 className="absolute top-4 left-4 text-sm font-bold text-slate-800 dark:text-[#ffffff]">Vertical Axis</h3>
    <svg width="100" height="200" viewBox="-50 0 100 200" className="overflow-visible mt-6">
    <line x1="-40" y1="10" x2="40" y2="10" stroke="currentColor" strokeWidth="4" className="text-slate-700 dark:text-[#a1a1aa]" />
    <g transform={`translate(0, 10) rotate(${bobAngle})`}>
     <line x1="0" y1="0" x2="0" y2="120" stroke="currentColor" strokeWidth="1.5" className="text-slate-500" />
     <path d="M -10 120 L 10 120 L 0 150 Z" className="fill-rose-500" />
     <circle cx="0" cy="120" r="10" className="fill-rose-600" />
    </g>
    <line x1="0" y1="10" x2="0" y2="160" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-emerald-500/50 dark:text-emerald-400/50" />
    </svg>
   </div>
   </div>

   {/* Compass Construction Canvas */}
   <div className="flex-1 min-w-0 bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 relative flex flex-col min-h-[300px]">
    <h3 className="text-sm font-bold absolute top-4 left-4 text-slate-800 dark:text-[#ffffff]">Construction Board ({targetAngle}°)</h3>
    <div className="flex-1 min-w-0 flex items-center justify-center mt-6">
    <svg width="100%" height="250" viewBox="-50 -200 400 250" className="overflow-visible">
     {/* Step 0: Base line */}
     <line x1="0" y1="0" x2="250" y2="0" stroke="currentColor" strokeWidth="2" className="text-slate-800 dark:text-[#ffffff]" />
     <circle cx="0" cy="0" r="3" className="fill-indigo-600" />
     <text x="-15" y="5" className="text-xs fill-slate-700 dark:fill-slate-300 font-bold">A</text>

     {/* Step 1: Arc from A to B */}
     {compassStep >= 1 && (
     <>
      <path d="M 120 0 A 120 120 0 0 0 20 -118" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400 dark:text-[#71717a]" strokeDasharray="4 4" />
      <circle cx="120" cy="0" r="3" className="fill-indigo-600" />
      <text x="125" y="15" className="text-xs fill-slate-700 dark:fill-slate-300 font-bold">B</text>
     </>
     )}

     {/* Step 2: Arc from B (60 degrees) */}
     {compassStep >= 2 && (
     <>
      <path d="M 10 -20 A 120 120 0 0 1 80 -120" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-400 dark:text-rose-500" strokeDasharray="4 4" />
      <circle cx="60" cy="-103.9" r="4" className="fill-rose-600" />
      <text x="65" y="-115" className="text-xs fill-rose-700 dark:fill-rose-300 font-bold">C (60°)</text>
     </>
     )}

     {/* Step 2.5: Further arcs for 120 or 90 */}
     {compassStep >= 2.5 && (targetAngle === 120 || targetAngle === 90) && (
     <>
      <path d="M 60 -103.9 A 120 120 0 0 1 -70 -103.9" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400 dark:text-indigo-500" strokeDasharray="4 4" />
      <circle cx="-60" cy="-103.9" r="4" className="fill-indigo-600" />
      <text x="-95" y="-115" className="text-xs fill-indigo-700 dark:fill-indigo-300 font-bold">D (120°)</text>
     </>
     )}

     {compassStep >= 2.5 && targetAngle === 90 && (
     <>
      {/* Bisections from C and D */}
      <path d="M -30 -190 A 120 120 0 0 1 40 -190" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-400 dark:text-teal-500" strokeDasharray="2 2" />
      <path d="M 30 -190 A 120 120 0 0 0 -40 -190" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-400 dark:text-teal-500" strokeDasharray="2 2" />
      <circle cx="0" cy="-207.8" r="4" className="fill-teal-600" />
      <text x="10" y="-215" className="text-xs fill-teal-700 dark:fill-teal-300 font-bold">E (90°)</text>
     </>
     )}

     {/* Step 3: Final Line */}
     {compassStep >= 3 && (
     <>
      {targetAngle === 60 && <line x1="0" y1="0" x2="110" y2="-190.5" stroke="currentColor" strokeWidth="3" className="text-indigo-500" />}
      {targetAngle === 120 && <line x1="0" y1="0" x2="-110" y2="-190.5" stroke="currentColor" strokeWidth="3" className="text-indigo-500" />}
      {targetAngle === 90 && <line x1="0" y1="0" x2="0" y2="-220" stroke="currentColor" strokeWidth="3" className="text-indigo-500" />}
      
      {/* Angle arc for final line */}
      <path d={`M 40 0 A 40 40 0 0 ${targetAngle > 0 ? 0 : 1} ${Math.cos(targetAngle * Math.PI / 180) * 40} ${-Math.sin(targetAngle * Math.PI / 180) * 40}`} fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
      <text x={Math.cos(targetAngle/2 * Math.PI / 180) * 55} y={-Math.sin(targetAngle/2 * Math.PI / 180) * 55} className="text-sm fill-amber-600 dark:fill-amber-400 font-bold text-center" textAnchor="middle" alignmentBaseline="middle">{targetAngle}°</text>
     </>
     )}

     {/* Compass visual overlay animation hint */}
     {compassStep === 1 && (
     <g transform="translate(0, 0)">
      <line x1="0" y1="-60" x2="0" y2="0" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
      <line x1="0" y1="-60" x2="120" y2="0" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
      <circle cx="0" cy="-60" r="4" className="fill-slate-600 dark:fill-slate-300" />
     </g>
     )}
    </svg>
    </div>
   </div>

  </div>
  </div>
 </div>
 );
}
