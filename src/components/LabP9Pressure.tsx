import { useState, useRef } from 'react';
import { Info, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP9Pressure({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [plugs, setPlugs] = useState<boolean[]>([true, true, true]);
 const svgRef = useRef<SVGSVGElement>(null);
 const [rulerX, setRulerX] = useState<number>(200);
 const [isDragging, setIsDragging] = useState<boolean>(false);

 const [inputDepth, setInputDepth] = useState<string>('');
 const [inputRange, setInputRange] = useState<string>('');
 const [logs, setLogs] = useState<{ depth: number, range: number }[]>([]);

 const [userPressure, setUserPressure] = useState<string>('');
 const [assessmentResult, setAssessmentResult] = useState<'none' | 'correct' | 'incorrect'>('none');

 const handlePointerDown = () => setIsDragging(true);
 const handlePointerMove = (e: React.PointerEvent) => {
  if (isDragging && svgRef.current) {
   const pt = svgRef.current.createSVGPoint();
   pt.x = e.clientX;
   pt.y = e.clientY;
   const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
   setRulerX(Math.max(130, Math.min(380, svgP.x)));
  }
 };
 const handlePointerUp = () => setIsDragging(false);

 const togglePlug = (idx: number) => {
  const newPlugs = [...plugs];
  newPlugs[idx] = !newPlugs[idx];
  setPlugs(newPlugs);
 };

 const handleAddLog = () => {
  if (inputDepth && inputRange) {
   setLogs([...logs, { depth: parseFloat(inputDepth), range: parseFloat(inputRange) }]);
   setInputDepth('');
   setInputRange('');
  }
 };

 const checkPressure = () => {
  const p = parseFloat(userPressure);
  // P = rho * g * h = 1000 * 9.8 * 0.8 = 7840 Pa
  if (!isNaN(p) && Math.abs(p - 7840) < 100) {
   setAssessmentResult('correct');
  } else {
   setAssessmentResult('incorrect');
  }
 };

 const renderStream = (holeIdx: number, depth: number) => {
  if (plugs[holeIdx]) return null;
  const y_hole = 150 + depth;
  const h_depth = depth;
  const H_fall = 350 - y_hole;
  const v = Math.sqrt(2 * 980 * h_depth);
  const R = v * Math.sqrt(2 * H_fall / 980);
  const pts = [];
  for (let i = 0; i <= 10; i++) {
   const t = i / 10;
   const x = 130 + R * t;
   const y = y_hole + H_fall * (t * t);
   pts.push(`${x},${y}`);
  }
  return <polyline key={`stream-${holeIdx}`} points={pts.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="4" opacity="0.6" />;
 };

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="Liquid Pressure Lab" subtitle="Investigate the relationship between liquid depth and pressure." />

   
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:min-h-0 overflow-y-auto lg:overflow-visible">
    {/* Column 1: Setup */}
    <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-5 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
     <div className="flex items-center gap-2 mb-4">
      <Info className="w-5 h-5 text-blue-600" />
      <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff]">1. Setup & Theory</h2>
     </div>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
      Fluid pressure increases with depth due to the weight of the fluid above. 
      The pressure <strong>P</strong> at depth <strong>h</strong> in a liquid of density <strong>ρ</strong> is: 
      <br/><br/>
      <span className={`font-mono bg-slate-100 dark:bg-[#121212] p-1 rounded flex-col `}>P = ρ × g × h</span>
      <br/><br/>
      Higher pressure results in a higher ejection velocity (v) from a hole, causing the water to spurt further.
     </p>

     <div className={`p-4 bg-amber-50 rounded-lg border border-amber-200 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
      <h3 className="font-semibold text-amber-900 mb-2 dark:text-[#ffffff]">Instructions</h3>
      <ol className="list-decimal pl-5 text-sm text-amber-800 space-y-2 dark:text-[#ffffff]">
       <li>Click on the black plugs on the side of the can to let water spurt out.</li>
       <li>Notice how far the stream travels from the base.</li>
       <li><strong>Drag the red measuring tool</strong> on the ground to precisely measure the distance of the splash point.</li>
       <li>Record your readings in the Data table.</li>
      </ol>
     </div>
    </div>

    {/* Column 2: Simulation */}
    <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-5 lg: border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-4 w-full">2. Interactive Simulation</h2>
     <svg 
      ref={svgRef} 
      viewBox="0 0 400 400" 
      className="w-full max-w-md h-auto bg-[#f8fafc] rounded border border-slate-200 dark:border-[#1c1b1b]"
      onPointerMove={handlePointerMove} 
      onPointerUp={handlePointerUp} 
      onPointerLeave={handlePointerUp}
     >
      {/* Floor */}
      <rect x="0" y="350" width="400" height="50" fill="#cbd5e1" />
      
      {/* Table */}
      <rect x="50" y="250" width="100" height="100" fill="#94a3b8" />
      <rect x="40" y="250" width="120" height="10" fill="#64748b" />
      
      {/* Can Body */}
      <rect x="70" y="150" width="60" height="100" fill="none" stroke="#475569" strokeWidth="2" />
      
      {/* Water inside Can */}
      <rect x="71" y="152" width="58" height="97" fill="#60a5fa" opacity="0.8" />
      <line x1="71" y1="152" x2="129" y2="152" stroke="#2563eb" strokeWidth="2" />

      {/* Top Tap */}
      <path d="M 90 100 L 90 130 M 85 100 L 110 100 L 110 120" fill="none" stroke="#64748b" strokeWidth="4" />
      <line x1="100" y1="120" x2="100" y2="150" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 2" />
      
      {/* Streams */}
      {renderStream(0, 20)}
      {renderStream(1, 50)}
      {renderStream(2, 80)}

      {/* Holes & Plugs */}
      {[20, 50, 80].map((depth, idx) => (
       <g key={idx} transform={`translate(130, ${150 + depth})`} onClick={() => togglePlug(idx)} className="cursor-pointer hover:opacity-80">
        <circle cx="0" cy="0" r="4" fill="#0f172a" />
        {plugs[idx] && <rect x="0" y="-4" width="12" height="8" fill="#ef4444" rx="2" />}
        <text x="-15" y="3" fontSize="10" fill="white" textAnchor="end">{depth}cm</text>
       </g>
      ))}

      {/* Ruler Base line */}
      <line x1="130" y1="345" x2="380" y2="345" stroke="#334155" strokeWidth="2" />
      <text x="130" y="340" fontSize="10" fill="#334155">0 cm</text>
      <text x="380" y="340" fontSize="10" fill="#334155" textAnchor="end">250 cm</text>
      
      {/* Ruler Marker */}
      <g transform={`translate(${rulerX}, 350)`} onPointerDown={handlePointerDown} className="cursor-ew-resize">
       <line x1="0" y1="0" x2="0" y2="-60" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
       <polygon points="-6,-60 6,-60 0,-50" fill="#ef4444" />
       <rect x="-30" y="-80" width="60" height="20" fill="white" stroke="#ef4444" rx="4" />
       <text x="0" y="-66" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#ef4444">{(rulerX - 130).toFixed(1)} cm</text>
      </g>
     </svg>
    </div>

    {/* Column 3: Analysis */}
    <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-5 lg: border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
     <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-4">3. Data Logging & Assessment</h2>
     
     <div className="mb-6">
      <div className="flex gap-2 mb-3">
       <input 
        type="number" placeholder="Depth (cm)" 
        value={inputDepth} onChange={(e) => setInputDepth(e.target.value)}
        className="flex-1 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded text-sm"
       />
       <input 
        type="number" placeholder="Range (cm)" 
        value={inputRange} onChange={(e) => setInputRange(e.target.value)}
        className="flex-1 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded text-sm"
       />
       <button onClick={handleAddLog} className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">Add</button>
      </div>
      <table className="w-full text-sm text-left border-collapse">
       <thead className="bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff]">
        <tr>
         <th className="p-2 border">Hole Depth (cm)</th>
         <th className="p-2 border">Splash Range (cm)</th>
        </tr>
       </thead>
       <tbody>
        {logs.length === 0 ? (
         <tr><td colSpan={2} className="p-4 text-center text-slate-500 dark:text-[#71717a]">No measurements recorded.</td></tr>
        ) : (
         logs.map((log, i) => (
          <tr key={i}>
           <td className="p-2 border">{log.depth}</td>
           <td className="p-2 border">{log.range}</td>
          </tr>
         ))
        )}
       </tbody>
      </table>
     </div>

     <div className={`bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-auto dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
      <h3 className="font-semibold text-indigo-900 mb-2 dark:text-[#ffffff]">Assessment</h3>
      <p className="text-sm text-indigo-800 mb-4 dark:text-[#ffffff]">
       Assuming the density of water is 1000 kg/m³ and g = 9.8 m/s², calculate the theoretical <strong>fluid pressure</strong> (in Pascals) at the lowest hole (depth = 80 cm).
      </p>
      
      <div className="flex gap-2 mb-2">
       <input 
        type="number" 
        placeholder="Pressure in Pa..."
        value={userPressure}
        onChange={(e) => setUserPressure(e.target.value)}
        className="flex-1 p-2 border rounded-md"
       />
       <button 
        onClick={checkPressure}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
       >
        Check
       </button>
      </div>
      
      {assessmentResult === 'correct' && (
       <div className="flex items-center gap-2 text-emerald-600 text-sm mt-2">
        <CheckCircle className="w-4 h-4" /> Correct! (7840 Pa)
       </div>
      )}
      {assessmentResult === 'incorrect' && (
       <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
        <XCircle className="w-4 h-4" /> Incorrect. Try again.
       </div>
      )}
     </div>
    </div>
   </div>
  </div>
 );
}
