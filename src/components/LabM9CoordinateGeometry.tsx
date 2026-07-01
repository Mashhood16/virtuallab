import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Table as TableIcon, BookOpen, Activity } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

interface Point {
 x: number;
 y: number;
}

export default function LabM9CoordinateGeometry({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [mode, setMode] = useState<'midpoint' | 'distance'>('midpoint');

 // Midpoint State
 const [p1, setP1] = useState<Point>({ x: -6, y: -4 });
 const [p2, setP2] = useState<Point>({ x: 4, y: 6 });
 const [userMid, setUserMid] = useState<Point | null>(null);

 // Distance State
 const [route, setRoute] = useState<Point[]>([]);

 const [logs, setLogs] = useState<any[]>([]);

 const handleRandomize = () => {
 setP1({ x: Math.floor(Math.random()*16)-8, y: Math.floor(Math.random()*16)-8 });
 setP2({ x: Math.floor(Math.random()*16)-8, y: Math.floor(Math.random()*16)-8 });
 setUserMid(null);
 };

 const handleSVGClick = (e: any) => {
 const rect = e.currentTarget.getBoundingClientRect();
 const clickX = e.clientX - rect.left;
 const clickY = e.clientY - rect.top;
 
 // SVG is 300x300, center is 150,150. scale is 15px per unit.
 const mathX = Math.round((clickX - 150) / 15);
 const mathY = Math.round((150 - clickY) / 15);

 if (mode === 'midpoint') {
  setUserMid({ x: mathX, y: mathY });
 } else {
  setRoute([...route, { x: mathX, y: mathY }]);
 }
 };

 const handleRecord = () => {
 if (mode === 'midpoint' && userMid) {
  const cx = (p1.x + p2.x) / 2;
  const cy = (p1.y + p2.y) / 2;
  const correct = userMid.x === cx && userMid.y === cy;
  setLogs([{ mode: 'midpoint', input: `A(${p1.x},${p1.y}), B(${p2.x},${p2.y})`, res: `Mid(${userMid.x},${userMid.y}) - ${correct?'✓':'✗'}` }, ...logs]);
 } else if (mode === 'distance' && route.length > 1) {
  let total = 0;
  for (let i=0; i<route.length-1; i++) {
  total += Math.sqrt(Math.pow(route[i+1].x - route[i].x, 2) + Math.pow(route[i+1].y - route[i].y, 2));
  }
  setLogs([{ mode: 'distance', input: `${route.length} points`, res: `Dist = ${total.toFixed(2)}` }, ...logs]);
 }
 };

 // Analysis variables
 const [qMidX1, setQMidX1] = useState<number>(-4);
 const [qMidY1, setQMidY1] = useState<number>(2);
 const [qMidX2, setQMidX2] = useState<number>(6);
 const [qMidY2, setQMidY2] = useState<number>(-8);
 const [ansMidX, setAnsMidX] = useState<string>('');
 const [ansMidY, setAnsMidY] = useState<string>('');
 const [statusMid, setStatusMid] = useState<boolean | null>(null);

 const [qDistX1, setQDistX1] = useState<number>(0);
 const [qDistY1, setQDistY1] = useState<number>(0);
 const [qDistX2, setQDistX2] = useState<number>(3);
 const [qDistY2, setQDistY2] = useState<number>(4);
 const [ansDist, setAnsDist] = useState<string>('');
 const [statusDist, setStatusDist] = useState<boolean | null>(null);

 useEffect(() => {
 setQMidX1(Math.floor(Math.random()*10)-5);
 setQMidY1(Math.floor(Math.random()*10)-5);
 setQMidX2(Math.floor(Math.random()*10)-5);
 setQMidY2(Math.floor(Math.random()*10)-5);
 
 setQDistX1(Math.floor(Math.random()*6)-3);
 setQDistY1(Math.floor(Math.random()*6)-3);
 setQDistX2(Math.floor(Math.random()*6)+3);
 setQDistY2(Math.floor(Math.random()*6)+3);
 }, []);

 const checkMid = () => {
 const cx = (qMidX1 + qMidX2) / 2;
 const cy = (qMidY1 + qMidY2) / 2;
 if (parseFloat(ansMidX) === cx && parseFloat(ansMidY) === cy) setStatusMid(true);
 else setStatusMid(false);
 };

 const checkDist = () => {
 const d = Math.sqrt(Math.pow(qDistX2 - qDistX1, 2) + Math.pow(qDistY2 - qDistY1, 2));
 if (Math.abs(parseFloat(ansDist) - d) < 0.1) setStatusDist(true);
 else setStatusDist(false);
 };

 // Helpers
 const sx = (x: number) => 150 + x * 15;
 const sy = (y: number) => 150 - y * 15;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Virtual Lab: Coordinate Geometry" />
  

  
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
  {/* Column 1: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col border border-slate-200 dark:border-[#1c1b1b]  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold mb-4 flex items-center text-emerald-700">
   <BookOpen className="mr-2" /> Theory & Context
   </h2>
   
   <div className={`flex bg-slate-100 dark:bg-[#121212] p-1 rounded-lg mb-6 shrink-0 flex-col `}>
   <button
    className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'midpoint' ? 'bg-slate-50 dark:bg-[#121212] shadow text-emerald-700' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
    onClick={() => setMode('midpoint')}
   >
    Lamp Post Midpoint
   </button>
   <button
    className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'distance' ? 'bg-slate-50 dark:bg-[#121212] shadow text-emerald-700' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
    onClick={() => setMode('distance')}
   >
    Running Distance
   </button>
   </div>

   <div className="flex-1 min-w-0 lg:overflow-y-auto pr-2 prose prose-sm text-slate-700 dark:text-[#ffffff]">
   {mode === 'midpoint' ? (
    <>
    <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff]">Midpoint Formula</h3>
    <p>The midpoint divides a line segment connecting two points into two equal halves. It is equidistant from both endpoints.</p>
    <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded text-center font-mono my-2 border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
     M = ( (x₁+x₂)/2 , (y₁+y₂)/2 )
    </div>
    <p><strong>Task:</strong> Click on the Cartesian plane to correctly place a lamp post exactly halfway between point A and point B.</p>
    </>
   ) : (
    <>
    <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff]">Distance Formula</h3>
    <p>The distance between two points on a Cartesian plane is derived from the Pythagorean theorem.</p>
    <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded text-center font-mono my-2 border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
     d = √[ (x₂-x₁)² + (y₂-y₁)² ]
    </div>
    <p><strong>Task:</strong> Click to plot an athlete's running route. Calculate the total distance covered across multiple straight segments.</p>
    </>
   )}
   </div>
  </div>

  {/* Column 2: Simulator */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b]  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold mb-4 flex items-center text-emerald-700">
   <Activity className="mr-2" /> Interactive Cartesian Map
   </h2>

   <div className="bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg flex-1 flex flex-col mb-4 items-center justify-center relative overflow-hidden">
   <svg width="300" height="300" viewBox="0 0 300 300" onClick={handleSVGClick} className="bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] cursor-crosshair">
    {/* Grid lines */}
    {Array.from({length: 21}).map((_, i) => (
    <line key={`v-${i}`} x1={i*15} y1="0" x2={i*15} y2="300" stroke="#f1f5f9" />
    ))}
    {Array.from({length: 21}).map((_, i) => (
    <line key={`h-${i}`} x1="0" y1={i*15} x2="300" y2={i*15} stroke="#f1f5f9" />
    ))}
    {/* Axes */}
    <line x1="150" y1="0" x2="150" y2="300" stroke="#cbd5e1" strokeWidth="2" />
    <line x1="0" y1="150" x2="300" y2="150" stroke="#cbd5e1" strokeWidth="2" />
    
    {mode === 'midpoint' ? (
    <>
     <line x1={sx(p1.x)} y1={sy(p1.y)} x2={sx(p2.x)} y2={sy(p2.y)} stroke="#94a3b8" strokeDasharray="4" />
     <circle cx={sx(p1.x)} cy={sy(p1.y)} r="5" fill="#3b82f6" />
     <text x={sx(p1.x)+8} y={sy(p1.y)-8} fontSize="12" fill="#3b82f6" fontWeight="bold">A</text>
     <circle cx={sx(p2.x)} cy={sy(p2.y)} r="5" fill="#3b82f6" />
     <text x={sx(p2.x)+8} y={sy(p2.y)-8} fontSize="12" fill="#3b82f6" fontWeight="bold">B</text>
     
     {userMid && (
     <g>
      <circle cx={sx(userMid.x)} cy={sy(userMid.y)} r="6" fill="#ef4444" />
      <text x={sx(userMid.x)+10} y={sy(userMid.y)+15} fontSize="12" fill="#ef4444" fontWeight="bold">Lamp</text>
     </g>
     )}
    </>
    ) : (
    <>
     {route.map((pt, i) => (
     <g key={`pt-${i}`}>
      {i > 0 && <line x1={sx(route[i-1].x)} y1={sy(route[i-1].y)} x2={sx(pt.x)} y2={sy(pt.y)} stroke="#10b981" strokeWidth="3" />}
      <circle cx={sx(pt.x)} cy={sy(pt.y)} r="5" fill="#047857" />
      <text x={sx(pt.x)+8} y={sy(pt.y)-8} fontSize="10" fill="#047857">P{i+1}</text>
     </g>
     ))}
    </>
    )}
   </svg>
   <div className="absolute top-2 right-2 bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212]/80 p-2 rounded shadow-sm text-xs font-mono border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    1 unit = 1 km
   </div>
   </div>

   <div className="space-y-3 flex gap-2">
   {mode === 'midpoint' ? (
    <button 
    onClick={handleRandomize}
    className="flex-1 min-w-0 py-2 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] rounded-md font-medium transition active:scale-95"
    >
    Randomize A & B
    </button>
   ) : (
    <button 
    onClick={() => setRoute([])}
    className="flex-1 min-w-0 py-2 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] rounded-md font-medium transition active:scale-95"
    >
    Clear Route
    </button>
   )}
   <button 
    onClick={handleRecord}
    className="flex-1 min-w-0 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition active:scale-95 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
   >
    Record Data
   </button>
   </div>
  </div>

  {/* Column 3: Analysis */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col border border-slate-200 dark:border-[#1c1b1b] `}>
   <h2 className="text-xl font-bold mb-4 flex items-center text-emerald-700">
   <TableIcon className="mr-2" /> Analysis & Data
   </h2>

   <div className="bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b] p-3 mb-6 h-48 lg:overflow-y-auto">
   <table className="w-full text-sm text-left">
    <thead className="sticky top-0 bg-slate-50 dark:bg-[#121212] text-slate-600 dark:text-[#a1a1aa] font-semibold border-b border-slate-200 dark:border-[#1c1b1b]">
    <tr>
     <th className="pb-2">Type</th>
     <th className="pb-2">Inputs</th>
     <th className="pb-2">Result</th>
    </tr>
    </thead>
    <tbody className="divide-y divide-slate-100 font-mono text-xs">
    {logs.length === 0 ? (
     <tr><td colSpan={3} className="py-4 text-center text-slate-400">No data recorded</td></tr>
    ) : (
     logs.map((log, i) => (
     <tr key={i} className="hover:bg-slate-100 dark:bg-[#121212] transition">
      <td className="py-2">{log.mode}</td>
      <td className="py-2">{log.input}</td>
      <td className="py-2 font-semibold text-emerald-600">{log.res}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

   <div className="flex-1 min-w-0 border-t border-slate-200 dark:border-[#1c1b1b] pt-4">
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-3">Knowledge Check</h3>
   
   {mode === 'midpoint' ? (
    <div className="space-y-4">
    <p className="text-sm text-slate-700 dark:text-[#ffffff]">
     Find exact midpoint between <br/><strong>({qMidX1}, {qMidY1})</strong> and <strong>({qMidX2}, {qMidY2})</strong>.
    </p>
    <div className="flex items-center gap-2">
     <span>M = (</span>
     <input 
     type="number" 
     value={ansMidX} 
     onChange={(e) => setAnsMidX(e.target.value)}
     className="w-16 border border-slate-300 dark:border-[#1c1b1b] rounded p-1 text-center focus:ring-2 focus:ring-emerald-500 outline-none"
     placeholder="X"
     />
     <span>, </span>
     <input 
     type="number" 
     value={ansMidY} 
     onChange={(e) => setAnsMidY(e.target.value)}
     className="w-16 border border-slate-300 dark:border-[#1c1b1b] rounded p-1 text-center focus:ring-2 focus:ring-emerald-500 outline-none"
     placeholder="Y"
     />
     <span>)</span>
    </div>
    <div className="flex items-center gap-4 mt-4">
     <button onClick={checkMid} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition active:scale-95 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
     Verify
     </button>
     {statusMid === true && <CheckCircle2 className="text-emerald-500" />}
     {statusMid === false && <XCircle className="text-red-500" />}
    </div>
    </div>
   ) : (
    <div className="space-y-4">
    <p className="text-sm text-slate-700 dark:text-[#ffffff]">
     Find distance between <br/><strong>({qDistX1}, {qDistY1})</strong> and <strong>({qDistX2}, {qDistY2})</strong>.
    </p>
    <div className="flex items-center gap-2">
     <span>d = </span>
     <input 
     type="number" 
     value={ansDist} 
     onChange={(e) => setAnsDist(e.target.value)}
     className="w-20 border border-slate-300 dark:border-[#1c1b1b] rounded p-1 focus:ring-2 focus:ring-emerald-500 outline-none"
     placeholder="0.0"
     />
     <span>units</span>
    </div>
    <div className="flex items-center gap-4 mt-4">
     <button onClick={checkDist} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition active:scale-95 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
     Verify
     </button>
     {statusDist === true && <CheckCircle2 className="text-emerald-500" />}
     {statusDist === false && <XCircle className="text-red-500" />}
    </div>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
