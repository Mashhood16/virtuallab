import { useState, useRef, useMemo } from 'react';
import { ArrowLeft, Database, CheckCircle, Activity, Ruler } from 'lucide-react';

export default function LabM8Mensuration({ onExit }: { onExit?: () => void }) {
 // --- STATE ---
 const [shape, setShape] = useState<'Sphere' | 'Cone' | 'Pyramid'>('Cone');
 const [radius, setRadius] = useState<number>(5); // Acts as base width/2 for pyramid
 const [height, setHeight] = useState<number>(10);
 const [density, setDensity] = useState<number>(7800); // kg/m^3 (Iron)
 const [measurements, setMeasurements] = useState<{ id: number; shape: string; r: number; h: number; vol: number; mass: number }[]>([]);
 const [assessmentAnswer, setAssessmentAnswer] = useState<string>('');
 const [assessmentFeedback, setAssessmentFeedback] = useState<string>('');

 const nextId = useRef(1);

 // --- DERIVED CALCULATIONS ---
 const { volume, surfaceArea, mass } = useMemo(() => {
 let v = 0;
 let sa = 0;
 if (shape === 'Sphere') {
  v = (4 / 3) * Math.PI * Math.pow(radius, 3);
  sa = 4 * Math.PI * Math.pow(radius, 2);
 } else if (shape === 'Cone') {
  v = (1 / 3) * Math.PI * Math.pow(radius, 2) * height;
  const slant = Math.sqrt(radius * radius + height * height);
  sa = Math.PI * radius * (radius + slant);
 } else if (shape === 'Pyramid') {
  const baseWidth = radius * 2;
  v = (1 / 3) * Math.pow(baseWidth, 2) * height;
  const slant = Math.sqrt(height * height + radius * radius);
  sa = Math.pow(baseWidth, 2) + 2 * baseWidth * slant;
 }
 
 // Add 1.5% measurement noise to simulate real-world imperfection
 const noise = 1 + (Math.random() * 0.03 - 0.015);
 const m = (v / 1000) * density * noise; // v is in liters/dm^3, approx
 
 return { volume: v, surfaceArea: sa, mass: m };
 }, [shape, radius, height, density]);

 // --- HANDLERS ---
 const logData = () => {
 setMeasurements(prev => [
  ...prev,
  { id: nextId.current++, shape, r: radius, h: height, vol: volume, mass }
 ]);
 };

 const checkAssessment = () => {
 const correctVolume = (4/3) * Math.PI * Math.pow(10, 3);
 const correctMassKg = (correctVolume / 1e6) * 19300; // 1e6 cm^3 in 1 m^3
 const userAns = parseFloat(assessmentAnswer);
 
 if (isNaN(userAns)) {
  setAssessmentFeedback("Please enter a valid number.");
 } else if (Math.abs(userAns - correctMassKg) < 0.5) {
  setAssessmentFeedback("Correct! You accurately computed the volume and applied the density.");
 } else {
  setAssessmentFeedback(`Incorrect. Try again. (Hint: Vol = 4/3 * π * r³, mass = Vol * density). Expected ~${correctMassKg.toFixed(2)} kg`);
 }
 };

 // --- GRAPHING ---
 const maxMass = Math.max(10, ...measurements.map(m => m.mass));

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none dark:!bg-[#000000] dark:text-[#ffffff]">
  {/* HEADER */}
  <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#1c1b1b] flex-shrink-0">
  <div className="flex items-center gap-3">
   {onExit && (
   <button
    onClick={onExit}
    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors whitespace-nowrap flex-shrink-0"
   >
    <ArrowLeft className="w-5 h-5" />
   </button>
   )}
   <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
   <Ruler className="w-6 h-6 text-indigo-500" />
   Advanced Mensuration & Solid Properties
   </h1>
  </div>
  </header>

  {/* 3-COLUMN LAYOUT */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 flex-1 items-start">
  
  {/* COLUMN 1: THEORY & SETUP */}
  <div className="bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6">
   <div>
   <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-slate-800 dark:text-white">
    <Activity className="w-5 h-5 text-blue-500" />
    Object Parameters
   </h2>
   <p className="text-sm text-slate-600 dark:text-[#71717a] mb-4">
    Select a solid shape to compute its theoretical surface area and volume. Set material density to determine physical mass.
   </p>

   <div className="space-y-4">
    <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">Shape</label>
    <select
     value={shape}
     onChange={(e) => setShape(e.target.value as any)}
     className="p-2 border rounded-md dark:bg-slate-700 dark:border-[#1c1b1b] dark:text-white"
    >
     <option value="Cone">Solid Cone</option>
     <option value="Sphere">Solid Sphere</option>
     <option value="Pyramid">Square Pyramid</option>
    </select>
    </div>

    <div className="flex flex-col gap-1">
    <label className="text-sm font-medium flex justify-between">
     <span>Radius / Half-Base (cm)</span>
     <span>{radius} cm</span>
    </label>
    <input
     type="range"
     min="1"
     max="20"
     step="0.5"
     value={radius}
     onChange={(e) => setRadius(parseFloat(e.target.value))}
     className="w-full"
    />
    </div>

    <div className="flex flex-col gap-1">
    <label className="text-sm font-medium flex justify-between">
     <span className={shape === 'Sphere' ? 'opacity-50' : ''}>Height (cm)</span>
     <span className={shape === 'Sphere' ? 'opacity-50' : ''}>{shape === 'Sphere' ? 'N/A' : `${height} cm`}</span>
    </label>
    <input
     type="range"
     min="5"
     max="30"
     step="0.5"
     value={height}
     disabled={shape === 'Sphere'}
     onChange={(e) => setHeight(parseFloat(e.target.value))}
     className={`w-full ${shape === 'Sphere' ? 'opacity-50 cursor-not-allowed' : ''}`}
    />
    </div>

    <div className="flex flex-col gap-1">
    <label className="text-sm font-medium flex justify-between">
     <span>Material Density (kg/m³)</span>
     <span>{density}</span>
    </label>
    <select
     value={density}
     onChange={(e) => setDensity(parseInt(e.target.value))}
     className="p-2 border rounded-md dark:bg-slate-700 dark:border-[#1c1b1b] dark:text-white"
    >
     <option value={7800}>Iron (7800 kg/m³)</option>
     <option value={2700}>Aluminum (2700 kg/m³)</option>
     <option value={19300}>Gold (19300 kg/m³)</option>
     <option value={1000}>Water / Ice (1000 kg/m³)</option>
    </select>
    </div>
   </div>
   </div>
   
   <button
   onClick={logData}
   className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
   <Database className="w-4 h-4" />
   Log Measurement
   </button>
  </div>

  {/* COLUMN 2: SIMULATION STAGE */}
  <div className="bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col items-center justify-center min-h-[400px] relative">
   <h2 className="absolute top-4 left-4 text-lg font-semibold text-slate-800 dark:text-white">
   Cross-Section Visualizer
   </h2>
   
   <div className="w-full h-64 flex items-center justify-center mt-8">
   <svg viewBox="-100 -100 200 200" className="w-full h-full max-w-[250px] drop-shadow-xl overflow-visible">
    <defs>
    <radialGradient id="sphereGrad" cx="30%" cy="30%" r="70%">
     <stop offset="0%" stopColor="#94a3b8" />
     <stop offset="100%" stopColor="#334155" />
    </radialGradient>
    <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
     <stop offset="0%" stopColor="#64748b" />
     <stop offset="50%" stopColor="#94a3b8" />
     <stop offset="100%" stopColor="#475569" />
    </linearGradient>
    </defs>

    {/* Dynamic rendering based on shape */}
    {shape === 'Sphere' && (
    <g>
     <circle cx="0" cy="0" r={radius * 5} fill="url(#sphereGrad)" stroke="#1e293b" strokeWidth="2" />
     {/* Equator line for 3D feel */}
     <ellipse cx="0" cy="0" rx={radius * 5} ry={radius * 1.5} fill="none" stroke="#cbd5e1" strokeDasharray="4 4" opacity="0.6"/>
     <line x1="0" y1="0" x2={radius * 5} y2="0" stroke="#f87171" strokeWidth="2" />
     <text x={radius * 2.5} y="-5" fill="#f87171" fontSize="12" fontWeight="bold">r={radius}</text>
    </g>
    )}

    {shape === 'Cone' && (
    <g transform={`translate(0, ${height * 2.5})`}>
     <path d={`M -${radius * 5} 0 L 0 -${height * 5} L ${radius * 5} 0 Z`} fill="url(#coneGrad)" stroke="#1e293b" strokeWidth="2" />
     <ellipse cx="0" cy="0" rx={radius * 5} ry={radius * 1.5} fill="#475569" stroke="#1e293b" strokeWidth="2" />
     <line x1="0" y1="0" x2={radius * 5} y2="0" stroke="#f87171" strokeWidth="2" />
     <line x1="0" y1="0" x2="0" y2={-height * 5} stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 2" />
     <text x={radius * 2.5} y="15" fill="#f87171" fontSize="12" fontWeight="bold">r={radius}</text>
     <text x="5" y={-height * 2.5} fill="#60a5fa" fontSize="12" fontWeight="bold">h={height}</text>
    </g>
    )}

    {shape === 'Pyramid' && (
    <g transform={`translate(0, ${height * 2.5})`}>
     {/* Back faces */}
     <path d={`M 0 -${height * 5} L -${radius * 3} -${radius * 1.5} L ${radius * 2} -${radius * 2} Z`} fill="#64748b" opacity="0.5" />
     {/* Front left face */}
     <path d={`M 0 -${height * 5} L -${radius * 5} 0 L 0 ${radius * 2} Z`} fill="#94a3b8" stroke="#1e293b" strokeWidth="1.5" />
     {/* Front right face */}
     <path d={`M 0 -${height * 5} L 0 ${radius * 2} L ${radius * 5} 0 Z`} fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
     <line x1="0" y1="0" x2="0" y2={-height * 5} stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 2" />
     <text x="5" y={-height * 2.5} fill="#60a5fa" fontSize="12" fontWeight="bold">h={height}</text>
     <text x={radius * 2.5} y={radius + 10} fill="#f87171" fontSize="12" fontWeight="bold">b={radius * 2}</text>
    </g>
    )}
   </svg>
   </div>

   <div className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg mt-4 grid grid-cols-2 gap-2 text-sm">
   <div className="flex justify-between border-b border-slate-300 dark:border-[#1c1b1b] pb-1">
    <span className="text-slate-600 dark:text-[#71717a]">Exact Volume:</span>
    <span className="font-mono font-medium">{volume.toFixed(1)} cm³</span>
   </div>
   <div className="flex justify-between border-b border-slate-300 dark:border-[#1c1b1b] pb-1">
    <span className="text-slate-600 dark:text-[#71717a]">Surface Area:</span>
    <span className="font-mono font-medium">{surfaceArea.toFixed(1)} cm²</span>
   </div>
   <div className="flex justify-between col-span-2 pt-1">
    <span className="text-slate-600 dark:text-[#71717a] flex items-center gap-1">
    Measured Mass <span className="text-xs text-indigo-500">(w/ ±1.5% tool error)</span>:
    </span>
    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{mass.toFixed(3)} kg</span>
   </div>
   </div>
  </div>

  {/* COLUMN 3: DATA & ASSESSMENT */}
  <div className="flex flex-col gap-4">
   
   {/* Data Table */}
   <div className="bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-h-[300px] flex flex-col">
   <h2 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">Logged Data</h2>
   <div className="lg:overflow-y-auto flex-1">
    <table className="w-full text-sm text-left">
    <thead className="sticky top-0 text-slate-500 dark:text-[#71717a]">
     <tr>
     <th className="py-2">Shape</th>
     <th className="py-2">r/b</th>
     <th className="py-2">h</th>
     <th className="py-2">Mass (kg)</th>
     </tr>
    </thead>
    <tbody>
     {measurements.map(m => (
     <tr key={m.id} className="border-t border-slate-100 dark:border-[#1c1b1b]">
      <td className="py-2">{m.shape}</td>
      <td className="py-2">{m.r}</td>
      <td className="py-2">{m.h}</td>
      <td className="py-2 font-mono text-indigo-600 dark:text-indigo-400">{m.mass.toFixed(2)}</td>
     </tr>
     ))}
     {measurements.length === 0 && (
     <tr>
      <td colSpan={4} className="py-4 text-center text-slate-400 italic">No data logged yet.</td>
     </tr>
     )}
    </tbody>
    </table>
   </div>
   </div>

   {/* Simple Graph */}
   <div className="bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
   <h2 className="text-sm font-semibold mb-2 text-slate-800 dark:text-white">Mass Trend</h2>
   <div className="h-32 w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded relative">
    {measurements.length > 1 ? (
    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
     <polyline
     points={measurements.map((m, i) => {
      const x = (i / (measurements.length - 1)) * 100;
      const y = 100 - (m.mass / maxMass) * 90; // scale 0-90
      return `${x},${y}`;
     }).join(' ')}
     fill="none"
     stroke="#4f46e5"
     strokeWidth="2"
     vectorEffect="non-scaling-stroke"
     />
     {measurements.map((m, i) => {
     const x = (i / (measurements.length - 1)) * 100;
     const y = 100 - (m.mass / maxMass) * 90;
     return <circle key={m.id} cx={x} cy={y} r="3" fill="#4f46e5" vectorEffect="non-scaling-stroke" />;
     })}
    </svg>
    ) : (
    <div className="flex items-center justify-center h-full text-xs text-slate-400">Log at least 2 points to graph.</div>
    )}
   </div>
   </div>

   {/* Assessment */}
   <div className="bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
   <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-slate-800 dark:text-white">
    <CheckCircle className="w-5 h-5 text-green-500" />
    Assessment
   </h2>
   <p className="text-sm text-slate-600 dark:text-[#71717a] mb-3">
    A solid gold sphere has a radius of 10 cm. The density of gold is 19300 kg/m³. Calculate its theoretical mass in kg.
   </p>
   <div className="flex flex-wrap gap-2">
    <input
    type="number"
    value={assessmentAnswer}
    onChange={(e) => setAssessmentAnswer(e.target.value)}
    placeholder="e.g. 50.5"
    className="flex-1 min-w-0 p-2 border rounded-md text-sm dark:bg-slate-700 dark:border-[#1c1b1b] dark:text-white"
    />
    <button
    onClick={checkAssessment}
    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
    >
    Check Answer
    </button>
   </div>
   {assessmentFeedback && (
    <div className={`mt-3 text-sm p-2 rounded-md ${assessmentFeedback.includes('Correct') ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
    {assessmentFeedback}
    </div>
   )}
   </div>

  </div>
  </div>
 </div>
 );
}
