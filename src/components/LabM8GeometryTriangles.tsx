import { useState } from 'react';
import { ArrowLeft, Triangle, Compass, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import type { ChangeEvent } from 'react';

type GeometryMode = 'similar-triangles' | 'compass-constructions';

interface Ring {
 id: number;
 center: 'A' | 'B';
 r: number;
}

export default function LabM8GeometryTriangles({ onExit }: { onExit?: () => void }) {
 const [mode, setMode] = useState<GeometryMode>('similar-triangles');

 // Similar Triangles State
 const personHeight = 1.5; // fixed 1.5m
 const [personShadow, setPersonShadow] = useState(2);
 const [towerShadow, setTowerShadow] = useState(12);
 const [studentAnswer, setStudentAnswer] = useState('');
 const [simFeedback, setSimFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 // Compass Constructions State
 const [compassRadius, setCompassRadius] = useState(40);
 const [rings, setRings] = useState<Ring[]>([]);
 const [ringId, setRingId] = useState(0);

 const handleCheckHeight = () => {
 const actualHeight = (personHeight / personShadow) * towerShadow;
 const studentValue = parseFloat(studentAnswer);
 
 if (!isNaN(studentValue) && Math.abs(studentValue - actualHeight) < 0.1) {
  setSimFeedback('correct');
 } else {
  setSimFeedback('incorrect');
 }
 setTimeout(() => setSimFeedback('idle'), 3000);
 };

 const handleAddRing = (center: 'A' | 'B') => {
 setRings([...rings, { id: ringId, center, r: compassRadius }]);
 setRingId(ringId + 1);
 };

 const renderControls = () => {
 switch (mode) {
  case 'similar-triangles':
  return (
   <div className="space-y-4">
   <h3 className="text-xl font-semibold dark:text-[#ffffff]">Navigational Distance</h3>
   <p className="text-slate-700 dark:text-[#a1a1aa] text-sm">
    Use properties of similar triangles to find the true height of the tower. 
    The sun casts shadows at the same angle for both the person and the tower.
   </p>
   
   <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300">
    <ul className="list-disc list-inside">
    <li>Person Height ($h_1$): <strong>{personHeight} m</strong></li>
    </ul>
   </div>

   <div className="flex flex-col gap-2">
    <label className="text-sm font-medium dark:text-[#ffffff]">Person's Shadow ($s_1$): {personShadow} m</label>
    <input 
    type="range" min="1" max="5" step="0.5" 
    value={personShadow} onChange={(e) => setPersonShadow(Number(e.target.value))}
    className="w-full accent-blue-600"
    />
   </div>
   
   <div className="flex flex-col gap-2">
    <label className="text-sm font-medium dark:text-[#ffffff]">Tower's Shadow ($s_2$): {towerShadow} m</label>
    <input 
    type="range" min="5" max="30" step="1" 
    value={towerShadow} onChange={(e) => setTowerShadow(Number(e.target.value))}
    className="w-full accent-indigo-600"
    />
   </div>

   <div className="pt-4 border-t border-slate-200 dark:border-[#1c1b1b] space-y-3">
    <label className="text-sm font-medium dark:text-[#ffffff]">Calculate Tower Height ($h_2$):</label>
    <div className="flex flex-wrap gap-2">
    <input
     type="number"
     step="0.1"
     value={studentAnswer}
     onChange={(e: ChangeEvent<HTMLInputElement>) => setStudentAnswer(e.target.value)}
     placeholder="e.g. 9.0"
     className="flex-1 min-w-0 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg text-slate-900 dark:text-[#ffffff]"
    />
    <span className="self-center font-medium text-slate-600 dark:text-[#71717a]">meters</span>
    </div>
   </div>
   </div>
  );
  case 'compass-constructions':
  return (
   <div className="space-y-4">
   <h3 className="text-xl font-semibold dark:text-[#ffffff]">Compass Constructions</h3>
   <p className="text-slate-700 dark:text-[#a1a1aa] text-sm">
    Construct intersecting concentric rings from Points A and B. 
    Use intersections of circles with equal radii to form a rhombus or other quadrilaterals.
   </p>

   <div className="flex flex-col gap-2 mt-4">
    <label className="text-sm font-medium dark:text-[#ffffff]">Compass Radius: {compassRadius} units</label>
    <input 
    type="range" min="20" max="100" step="5" 
    value={compassRadius} onChange={(e) => setCompassRadius(Number(e.target.value))}
    className="w-full accent-emerald-600"
    />
   </div>

   <div className="flex flex-col gap-3 pt-4">
    <button
    onClick={() => handleAddRing('A')}
    className="w-full py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-[#ffffff] font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
    >
    Draw Arc from Center A
    </button>
    <button
    onClick={() => handleAddRing('B')}
    className="w-full py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-[#ffffff] font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
    >
    Draw Arc from Center B
    </button>
    <button
    onClick={() => setRings([])}
    className="w-full py-2 mt-2 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-800/40 text-rose-700 dark:text-rose-300 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0"
    >
    <RotateCcw size={16} /> Clear Canvas
    </button>
   </div>
   </div>
  );
 }
 };

 const renderSimulation = () => {
 switch (mode) {
  case 'similar-triangles':
  // Calculate true tower height for rendering
  const actualTowerHeight = (personHeight / personShadow) * towerShadow;
  
  // Scale for drawing: 
  // We have a viewBox of 0 0 200 100
  // Ground is at y=80
  const groundY = 80;
  
  // Scale factors to fit within the box. Max tower height is roughly (1.5/1)*30 = 45m.
  // Let 1m = 1.5 units vertically and horizontally.
  const scale = 1.5; 
  
  const px = 20; // person x position
  const p_height_px = personHeight * scale;
  const p_shadow_px = personShadow * scale;

  const tx = 90; // tower x position
  const t_height_px = actualTowerHeight * scale;
  const t_shadow_px = towerShadow * scale;

  return (
   <svg viewBox="0 0 200 100" className="w-full h-full max-h-[60vh] bg-sky-50 dark:bg-[#121212] rounded-xl">
   {/* Ground */}
   <line x1="0" y1={groundY} x2="200" y2={groundY} stroke="#94a3b8" strokeWidth="2" />
   <rect x="0" y={groundY} width="200" height="20" fill="#4ade80" opacity="0.3" />

   {/* Sun indicator */}
   <circle cx="180" cy="15" r="8" fill="#fbbf24" />
   <path d="M 180 5 L 180 0 M 180 25 L 180 30 M 170 15 L 165 15 M 190 15 L 195 15" stroke="#fbbf24" strokeWidth="1.5" />

   {/* Person & Shadow */}
   <line x1={px} y1={groundY} x2={px} y2={groundY - p_height_px} stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
   <line x1={px} y1={groundY} x2={px - p_shadow_px} y2={groundY} stroke="#1e293b" strokeWidth="3" opacity="0.4" />
   {/* Ray for person */}
   <line x1={px} y1={groundY - p_height_px} x2={px - p_shadow_px} y2={groundY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2" />

   {/* Tower & Shadow */}
   <rect x={tx - 3} y={groundY - t_height_px} width="6" height={t_height_px} fill="#64748b" />
   <line x1={tx} y1={groundY} x2={tx - t_shadow_px} y2={groundY} stroke="#1e293b" strokeWidth="4" opacity="0.5" />
   {/* Ray for tower */}
   <line x1={tx} y1={groundY - t_height_px} x2={tx - t_shadow_px} y2={groundY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2" />

   {/* Labels */}
   <text x={px - 5} y={groundY - p_height_px - 5} fontSize="6" fill="currentColor" className="dark:text-[#a1a1aa]">h1={personHeight}m</text>
   <text x={px - p_shadow_px/2 - 5} y={groundY + 8} fontSize="6" fill="currentColor" className="dark:text-[#a1a1aa]">s1={personShadow}m</text>
   
   <text x={tx - 8} y={groundY - t_height_px - 5} fontSize="6" fill="currentColor" className="dark:text-[#a1a1aa]">h2=?</text>
   <text x={tx - t_shadow_px/2 - 5} y={groundY + 8} fontSize="6" fill="currentColor" className="dark:text-[#a1a1aa]">s2={towerShadow}m</text>

   {/* Similar Triangles Highlight */}
   <path d={`M ${px} ${groundY} L ${px} ${groundY - p_height_px} L ${px - p_shadow_px} ${groundY} Z`} fill="#ef4444" opacity="0.1" />
   <path d={`M ${tx} ${groundY} L ${tx} ${groundY - t_height_px} L ${tx - t_shadow_px} ${groundY} Z`} fill="#3b82f6" opacity="0.1" />
   </svg>
  );
  case 'compass-constructions':
  const ptA = { x: -30, y: 0 };
  const ptB = { x: 30, y: 0 };

  return (
   <svg viewBox="-100 -100 200 200" className="w-full h-full max-h-[60vh] rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
   <defs>
    <pattern id="gridC" width="10" height="10" patternUnits="userSpaceOnUse">
    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-slate-200 dark:text-slate-700" />
    </pattern>
   </defs>
   <rect x="-100" y="-100" width="200" height="200" fill="url(#gridC)" />

   {/* Render Drawn Rings */}
   {rings.map((ring) => {
    const cx = ring.center === 'A' ? ptA.x : ptB.x;
    const cy = ring.center === 'A' ? ptA.y : ptB.y;
    return (
    <circle 
     key={ring.id}
     cx={cx} cy={cy} r={ring.r}
     fill="none" 
     stroke={ring.center === 'A' ? '#3b82f6' : '#ec4899'} 
     strokeWidth="1.5" 
     opacity="0.6" 
    />
    );
   })}

   {/* Center Points */}
   <circle cx={ptA.x} cy={ptA.y} r="2" fill="#1e293b" className="dark:fill-slate-100" />
   <text x={ptA.x - 10} y={ptA.y - 5} fontSize="8" fill="currentColor" className="dark:text-[#ffffff] font-bold">A</text>
   
   <circle cx={ptB.x} cy={ptB.y} r="2" fill="#1e293b" className="dark:fill-slate-100" />
   <text x={ptB.x + 5} y={ptB.y - 5} fontSize="8" fill="currentColor" className="dark:text-[#ffffff] font-bold">B</text>

   <line x1={ptA.x} y1={ptA.y} x2={ptB.x} y2={ptB.y} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
   <text x="0" y="8" fontSize="6" fill="#64748b" textAnchor="middle">Distance = 60 units</text>

   {/* Current Compass Preview */}
   <circle 
    cx={0} cy={0} r={compassRadius} 
    fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2" opacity="0.3" 
   />
   <text x={0} y={compassRadius + 8} fontSize="6" fill="#10b981" textAnchor="middle">Current r={compassRadius}</text>
   </svg>
  );
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-900 dark:text-[#ffffff]">
  <header className="flex items-center p-4 shadow-sm z-10 border-b border-slate-200 dark:border-[#1c1b1b]">
  <button
   onClick={onExit}
   className="mr-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap flex-shrink-0"
  >
   <ArrowLeft size={24} />
  </button>
  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
   Unit 9 & 10: Geometry & Similar Triangles
  </h1>
  </header>

  <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
  {/* Left Column: Controls */}
  <div className="w-full lg:w-1/3 p-6 shadow-lg lg:overflow-y-auto flex flex-col gap-6 border-r border-slate-200 dark:border-[#1c1b1b]">
   <div className="space-y-4">
   <h2 className="text-lg font-semibold dark:text-[#ffffff]">Select Lab</h2>
   <div className="flex flex-wrap gap-2">
    <button
    onClick={() => setMode('similar-triangles')}
    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium whitespace-nowrap flex-shrink-0 transition-colors ${ mode === 'similar-triangles' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-[#ffffff] hover:bg-slate-200 dark:hover:bg-slate-600' }`}
    >
    <Triangle size={18} /> Triangles
    </button>
    <button
    onClick={() => setMode('compass-constructions')}
    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium whitespace-nowrap flex-shrink-0 transition-colors ${ mode === 'compass-constructions' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-[#ffffff] hover:bg-slate-200 dark:hover:bg-slate-600' }`}
    >
    <Compass size={18} /> Compass
    </button>
   </div>
   </div>

   <div className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-700/50 p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
   {renderControls()}
   </div>

   {mode === 'similar-triangles' && (
   <div className="space-y-4">
    <button
    onClick={handleCheckHeight}
    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors whitespace-nowrap flex-shrink-0 flex justify-center items-center gap-2 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    <CheckCircle size={20} />
    Check Height
    </button>
    
    {simFeedback === 'correct' && (
    <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-2">
     <CheckCircle size={20} /> Correct! The tower height matches.
    </div>
    )}
    {simFeedback === 'incorrect' && (
    <div className="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 rounded-lg flex items-center gap-2">
     <XCircle size={20} /> Incorrect. Use $h_1 / s_1 = h_2 / s_2$ to find the correct height.
    </div>
    )}
   </div>
   )}
  </div>

  {/* Right Column: Stage */}
  <div className="w-full lg:w-2/3 p-6 bg-slate-100 dark:bg-[#121212] flex flex-col items-center justify-center relative overflow-hidden">
   <div className="absolute top-4 left-4 text-slate-500 dark:text-[#71717a] font-mono text-sm bg-white/80 dark:bg-[#121212]/80 px-3 py-1 rounded shadow-sm backdrop-blur">
   Simulation Stage: {mode === 'similar-triangles' ? 'Navigational Simulator' : 'Construction Canvas'}
   </div>
   <div className="w-full max-w-3xl aspect-video bg-white dark:!bg-[#121212] rounded-2xl shadow-xl border border-slate-200 dark:border-[#1c1b1b] p-2 flex items-center justify-center overflow-hidden">
   {renderSimulation()}
   </div>
  </div>
  </div>
 </div>
 );
}
