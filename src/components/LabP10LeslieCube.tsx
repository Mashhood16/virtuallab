import { useState, useEffect } from 'react';
import {Box, BookOpen, LineChart, Info } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

const SURFACES = ['Matt Black', 'Shiny Black', 'Matt White', 'Shiny Silver'];

export default function LabP10LeslieCube({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [surface, setSurface] = useState('Matt Black');
 const [distance, setDistance] = useState(10);
 const [intensity, setIntensity] = useState(0);

 const [data, setData] = useState<{ surface: string; distance: number; intensity: number }[]>([]);
 const [assessmentAnswer, setAssessmentAnswer] = useState('');
 const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 useEffect(() => {
 const e = { 'Matt Black': 1.0, 'Shiny Black': 0.8, 'Matt White': 0.5, 'Shiny Silver': 0.1 }[surface] || 1.0;
 const baseI = (10000 * e) / (distance * distance);
 const noise = baseI * (Math.random() * 0.04 - 0.02); // ±2% noise
 setIntensity(baseI + noise);
 }, [surface, distance]);

 const recordData = () => {
 setData(prev => [...prev, { surface, distance, intensity }]);
 };

 const checkAssessment = () => {
 const ans = parseInt(assessmentAnswer, 10);
 // Expected k ~ 10000 for Matt Black
 if (!isNaN(ans) && ans >= 9500 && ans <= 10500) {
  setAssessmentStatus('correct');
 } else {
  setAssessmentStatus('incorrect');
 }
 };

 const getSurfaceColor = (s: string) => {
 switch (s) {
  case 'Matt Black': return { bg: '#18181b', border: '#000000', text: '#ffffff' };
  case 'Shiny Black': return { bg: '#3f3f46', border: '#27272a', text: '#ffffff' };
  case 'Matt White': return { bg: '#f8fafc', border: '#cbd5e1', text: '#0f172a' };
  case 'Shiny Silver': return { bg: '#e2e8f0', border: '#94a3b8', text: '#0f172a' };
  default: return { bg: '#ffffff', border: '#000', text: '#000' };
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Unit 10: Leslie Cube Experiment" subtitle="Measure infrared radiation emitted from 4 different surfaces." />

  
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 max-w-7xl mx-auto w-full overflow-y-auto lg:overflow-visible">
  {/* Column 1: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-6  ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 border-b pb-2">
   <BookOpen className="w-5 h-5 text-rose-600" />
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Theory & Setup</h2>
   </div>
   <div className="space-y-4 text-slate-600 dark:text-[#a1a1aa] text-sm">
   <p>
    A <strong>Leslie Cube</strong> is a hollow metal cube with 4 different outer surfaces, filled with boiling water (100°C). It is used to demonstrate how the nature of a surface affects the emission of thermal (infrared) radiation.
   </p>
   <ul className="list-disc pl-5 space-y-1">
    <li><strong>Matt Black:</strong> Best emitter</li>
    <li><strong>Shiny Silver:</strong> Worst emitter (best reflector)</li>
   </ul>
   <div className={`bg-rose-50 p-4 rounded-lg border border-rose-100 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    <h3 className="font-bold text-rose-800 mb-2">Inverse Square Law</h3>
    <p className="font-mono text-xs">Intensity (I) ∝ 1 / d²</p>
    <p className="text-xs mt-2 text-rose-700">As the sensor moves away, the measured intensity drops rapidly.</p>
   </div>
   <div className={`flex items-start gap-2 bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] p-3 rounded-md flex-col `}>
    <Info className="w-5 h-5 shrink-0 mt-0.5" />
    <p className="text-xs">
    Select a surface and vary the distance of the IR sensor. Record the intensity to build your dataset.
    </p>
   </div>
   </div>
  </div>

  {/* Column 2: Simulation */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col gap-6  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="flex items-center gap-2 border-b pb-2">
   <Box className="w-5 h-5 text-indigo-600" />
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Simulation</h2>
   </div>

   <div className={`flex-1 relative bg-slate-50 dark:bg-[#121212] border-2 border-slate-200 dark:border-[#1c1b1b] rounded-xl flex items-center justify-center p-4 h-80 lg:overflow- `}>
   
   {/* Sensor */}
   <div 
    className="absolute flex items-center justify-end transition-all duration-300 z-10"
    style={{ right: `calc(4rem + 6rem + ${distance * 5}px)` }} // 4rem = right-16, 6rem = cube width
   >
    <div className={`w-20 h-10 bg-zinc-800 rounded-l-md flex items-center justify-center text-emerald-400 font-mono text-xs font-bold border-y-2 border-l-2 border-zinc-600 shadow-lg flex-col `}>
     {intensity.toFixed(1)}
    </div>
    <div className="w-3 h-3 bg-red-500 rounded-full blur-[2px] -mr-1.5 z-20" />
   </div>

   {/* Leslie Cube */}
   <div className="absolute right-16 w-24 h-24 shadow-2xl flex items-center justify-center border-4 transition-colors duration-500 z-10" style={{
    backgroundColor: getSurfaceColor(surface).bg,
    borderColor: getSurfaceColor(surface).border
   }}>
    <div className="text-xs font-bold text-center opacity-70" style={{ color: getSurfaceColor(surface).text }}>
     100°C<br/>Water
    </div>
    {surface === 'Shiny Silver' && (
     <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-60" />
    )}
   </div>

   {/* Distance Track */}
   <div className="absolute bottom-10 left-8 right-8 h-0.5 bg-white lg:bg-slate-300 dark:bg-[#121212] lg:dark:bg-[#121212] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    <div className="absolute right-[10rem] top-2 text-xs text-slate-500 dark:text-[#71717a] font-mono">0 cm</div>
    <div className="absolute left-0 top-2 text-xs text-slate-500 dark:text-[#71717a] font-mono">40 cm</div>
   </div>
   
   {/* Heat Waves visualization */}
   {intensity > 10 && (
    <div className="absolute right-40 flex items-center justify-center text-red-500 opacity-30 animate-pulse text-2xl tracking-widest z-0" style={{ transform: 'translateX(20px)' }}>
    ❮❮❮
    </div>
   )}
   </div>

   <div className="space-y-4">
   <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2">Target Surface</label>
    <div className="grid grid-cols-2 gap-2">
    {SURFACES.map(s => (
     <button 
     key={s} 
     onClick={() => setSurface(s)}
     className={`px-3 py-2 text-sm font-medium rounded border transition-colors ${surface === s ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-50 dark:bg-[#121212] border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:bg-slate-50 dark:bg-[#121212]'}`}
     >
     {s}
     </button>
    ))}
    </div>
   </div>

   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
    <span>Sensor Distance (cm)</span>
    <span className="text-indigo-600">{distance} cm</span>
    </label>
    <input 
    type="range" min="5" max="40" step="1" 
    value={distance} onChange={(e) => setDistance(Number(e.target.value))}
    className="w-full accent-indigo-600"
    />
   </div>
   </div>
  </div>

  {/* Column 3: Data & Analysis */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-6">
   <div className="flex items-center gap-2 border-b pb-2">
   <LineChart className="w-5 h-5 text-indigo-600" />
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Data & Analysis</h2>
   </div>

   <div className="flex justify-between items-center">
   <span className="text-sm text-slate-600 dark:text-[#a1a1aa]">Current Reading: {intensity.toFixed(1)} W/m²</span>
   <button 
    onClick={recordData}
    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
   >
    Record Data
   </button>
   </div>

   <div className="max-h-32 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] rounded-md">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0 shadow-sm z-10">
    <tr>
     <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">Surface</th>
     <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">Dist (cm)</th>
     <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">Int. (W/m²)</th>
    </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
    {data.length === 0 && (
     <tr><td colSpan={3} className="px-3 py-4 text-center text-slate-400">No data recorded yet.</td></tr>
    )}
    {data.map((d, i) => (
     <tr key={i} className="hover:bg-slate-50 dark:bg-[#121212]">
     <td className="px-3 py-1.5">{d.surface.replace('Matt', 'M.').replace('Shiny', 'S.')}</td>
     <td className="px-3 py-1.5">{d.distance}</td>
     <td className="px-3 py-1.5 text-indigo-600 font-medium">{d.intensity.toFixed(1)}</td>
     </tr>
    ))}
    </tbody>
   </table>
   </div>

   {/* Graph */}
   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex flex-col items-center">
   <span className="text-xs font-bold text-slate-600 dark:text-[#a1a1aa] mb-2">Intensity vs Distance</span>
   <svg width="250" height="150" className="bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded shadow-sm">
    <line x1="30" y1="130" x2="240" y2="130" stroke="#cbd5e1" strokeWidth="2" />
    <line x1="30" y1="10" x2="30" y2="130" stroke="#cbd5e1" strokeWidth="2" />
    <text x="110" y="145" fontSize="10" fill="#64748b">Distance (cm)</text>
    <text x="10" y="80" fontSize="10" fill="#64748b" transform="rotate(-90 10 80)">W/m²</text>
    
    {data.map((d, i) => {
     const x = 30 + (d.distance / 40) * 200;
     // Max expected intensity is around 400
     const y = 130 - Math.min((d.intensity / 400) * 120, 120);
     const fill = d.surface.includes('Black') ? (d.surface.includes('Matt') ? '#000' : '#444') : (d.surface.includes('White') ? '#999' : '#ccc');
     return <circle key={i} cx={x} cy={y} r="3" fill={fill} stroke="#333" strokeWidth="0.5" />;
    })}
   </svg>
   </div>

   {/* Assessment */}
   <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 mt-auto dark:bg-[#121212] dark:border-[#1c1b1b]">
   <h3 className="font-bold text-indigo-800 mb-2 text-sm dark:text-[#ffffff]">Assessment</h3>
   <p className="text-xs text-indigo-700 mb-3">
    Using a data point for the Matt Black surface, calculate the constant $k$ in the equation $I = k/d^2$. (Enter to nearest 100).
   </p>
   <div className="flex gap-2">
    <input 
    type="text" 
    value={assessmentAnswer}
    onChange={(e) => setAssessmentAnswer(e.target.value)}
    placeholder="e.g. 5000"
    className="flex-1 px-3 py-1.5 rounded-md border border-indigo-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <button onClick={checkAssessment} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-bold transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
    Check
    </button>
   </div>
   {assessmentStatus === 'correct' && <p className="text-xs text-green-600 mt-2 font-bold">✓ Correct! k ≈ 10000</p>}
   {assessmentStatus === 'incorrect' && <p className="text-xs text-red-600 mt-2 font-bold">✗ Incorrect. Multiply I by d² to find k.</p>}
   </div>
  </div>
  </div>
 </div>
 );
}
