import { useState, useRef } from 'react';
import { Info, Compass, Sparkles, RefreshCw, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface Filing {
 id: number;
 x: number;
 y: number;
 angle: number;
}

interface CompassData {
 id: number;
 x: number;
 y: number;
 angle: number;
}

export default function LabP9MagnetismFields({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [filings, setFilings] = useState<Filing[]>([]);
 const [compasses, setCompasses] = useState<CompassData[]>([]);
 const [mode, setMode] = useState<'filings' | 'compass'>('compass');
 const [assessmentAnswer, setAssessmentAnswer] = useState('');
 const [assessmentResult, setAssessmentResult] = useState<string | null>(null);
 
 const svgRef = useRef<SVGSVGElement>(null);

 const N_X = 240;
 const N_Y = 200;
 const S_X = 160;
 const S_Y = 200;

 const getFieldAngle = (x: number, y: number) => {
 const dx_n = x - N_X;
 const dy_n = y - N_Y;
 const rn_sq = dx_n * dx_n + dy_n * dy_n;
 const rn = Math.sqrt(rn_sq);
 const bx_n = dx_n / (rn_sq * rn);
 const by_n = dy_n / (rn_sq * rn);

 const dx_s = x - S_X;
 const dy_s = y - S_Y;
 const rs_sq = dx_s * dx_s + dy_s * dy_s;
 const rs = Math.sqrt(rs_sq);
 const bx_s = -dx_s / (rs_sq * rs);
 const by_s = -dy_s / (rs_sq * rs);

 const bx = bx_n + bx_s;
 const by = by_n + by_s;

 return (Math.atan2(by, bx) * (180 / Math.PI) + 360) % 360;
 };

 const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
 if (mode !== 'compass' || !svgRef.current) return;
 const rect = svgRef.current.getBoundingClientRect();
 const x = e.clientX - rect.left;
 const y = e.clientY - rect.top;

 const scaleX = 400 / rect.width;
 const scaleY = 400 / rect.height;
 
 const svgX = x * scaleX;
 const svgY = y * scaleY;

 if (svgX > 120 && svgX < 280 && svgY > 180 && svgY < 220) return; // Inside magnet

 const angle = getFieldAngle(svgX, svgY);
 setCompasses([...compasses, { id: Date.now(), x: svgX, y: svgY, angle }]);
 };

 const sprinkleFilings = () => {
 const newFilings: Filing[] = [];
 for (let i = 0; i < 200; i++) {
  const x = Math.random() * 400;
  const y = Math.random() * 400;
  if (x > 120 && x < 280 && y > 180 && y < 220) continue; // Inside magnet
  newFilings.push({
  id: Math.random(),
  x,
  y,
  angle: getFieldAngle(x, y),
  });
 }
 setFilings([...filings, ...newFilings]);
 };

 const checkAssessment = () => {
 const val = parseFloat(assessmentAnswer);
 if (!isNaN(val) && (Math.abs(val - 180) < 15)) {
  setAssessmentResult('Correct! The field points from North to South, which is directly to the left (180°) in the region exactly above the magnet.');
 } else {
  setAssessmentResult('Incorrect. Try placing a compass directly above the center of the magnet. Which way does the arrow point? (0°=Right, 90°=Down, 180°=Left)');
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Lab: Magnetic Field Lines" subtitle="Investigate magnetic field lines using compasses and iron filings" />

  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 overflow-y-auto lg:overflow-visible">
  {/* Theory Column */}
  <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800 dark:text-[#ffffff]">
   <Info className="mr-2" /> Theory & Setup
   </h2>
   <div className="space-y-4 text-slate-700 dark:text-[#ffffff] leading-relaxed">
   <p>
    A <strong>magnetic field</strong> is the region around a magnet where magnetic forces act. We can visualize this invisible field using magnetic field lines.
   </p>
   <p>Key properties of magnetic field lines:</p>
   <ul className="list-disc pl-5 space-y-2">
    <li>They always point from the <strong>North</strong> pole to the <strong>South</strong> pole outside the magnet.</li>
    <li>They never cross each other.</li>
    <li>They are continuous loops, returning through the magnet's interior.</li>
    <li>The closer the lines are to each other, the stronger the magnetic field in that region.</li>
   </ul>
   <div className={`bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
    <h3 className="font-semibold text-blue-800 mb-2 dark:text-[#ffffff]">Instructions:</h3>
    <ol className="list-decimal pl-5 space-y-2 text-sm">
    <li>Select a tool below the interactive simulator.</li>
    <li><strong>Compass:</strong> Click anywhere around the magnet to see the exact direction of the field at that specific point.</li>
    <li><strong>Iron Filings:</strong> Sprinkle them to reveal the overall shape and pattern of the magnetic field.</li>
    </ol>
   </div>
   </div>
  </div>

  {/* Simulator Column */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-[#ffffff] text-center">Interactive Simulator</h2>
   <div className="flex-1 relative flex items-center justify-center bg-slate-100 dark:bg-[#121212] rounded-xl overflow-hidden border-2 border-slate-300 dark:border-[#1c1b1b] shadow-inner">
   <svg
    ref={svgRef}
    viewBox="0 0 400 400"
    className="w-full h-full cursor-crosshair"
    onClick={handleSvgClick}
   >
    {/* Filings */}
    {filings.map((f, i) => (
    <g key={i} transform={`translate(${f.x}, ${f.y}) rotate(${f.angle})`}>
     <line x1="-3" y1="0" x2="3" y2="0" stroke="#475569" strokeWidth="1" opacity="0.6" />
    </g>
    ))}

    {/* Magnet */}
    <g transform="translate(120, 180)">
    <rect x="0" y="0" width="80" height="40" fill="#3b82f6" /> {/* South */}
    <rect x="80" y="0" width="80" height="40" fill="#ef4444" /> {/* North */}
    <text x="40" y="25" fill="white" fontWeight="bold" textAnchor="middle" fontSize="16" pointerEvents="none">S</text>
    <text x="120" y="25" fill="white" fontWeight="bold" textAnchor="middle" fontSize="16" pointerEvents="none">N</text>
    </g>

    {/* Compasses */}
    {compasses.map((c) => (
    <g key={c.id} transform={`translate(${c.x}, ${c.y})`}>
     <circle cx="0" cy="0" r="10" fill="white" stroke="#94a3b8" strokeWidth="2" />
     <g transform={`rotate(${c.angle})`}>
     <polygon points="-6,-3 8,0 -6,3" fill="#ef4444" />
     <polygon points="-6,-3 -8,0 -6,3" fill="#3b82f6" />
     </g>
    </g>
    ))}
   </svg>
   </div>
   <div className="mt-6 flex flex-wrap gap-3 justify-center flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <button
    onClick={() => setMode('compass')}
    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'compass' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] hover:bg-slate-300 dark:bg-[#121212]'}`}
   >
    <Compass className="w-4 h-4 mr-2" />
    Place Compass
   </button>
   <button
    onClick={sprinkleFilings}
    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'filings' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] hover:bg-slate-300 dark:bg-[#121212]'}`}
   >
    <Sparkles className="w-4 h-4 mr-2" />
    Sprinkle Filings
   </button>
   <button
    onClick={() => { setFilings([]); setCompasses([]); }}
    className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
   >
    <RefreshCw className="w-4 h-4 mr-2" />
    Clear All
   </button>
   </div>
  </div>

  {/* Data & Analysis Column */}
  <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col">
   <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-[#ffffff]">Data Logging & Analysis</h2>
   
   <div className="flex-1 lg:overflow-y-auto mb-6 border border-slate-200 dark:border-[#1c1b1b] rounded-lg max-h-64">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-100 dark:bg-[#121212] sticky top-0">
    <tr>
     <th className="px-4 py-3 border-b font-semibold text-slate-700 dark:text-[#ffffff]">Reading #</th>
     <th className="px-4 py-3 border-b font-semibold text-slate-700 dark:text-[#ffffff]">Position (x,y)</th>
     <th className="px-4 py-3 border-b font-semibold text-slate-700 dark:text-[#ffffff]">Angle (°)</th>
    </tr>
    </thead>
    <tbody>
    {compasses.length === 0 ? (
     <tr>
     <td colSpan={3} className="px-4 py-8 text-center text-slate-500 dark:text-[#71717a] italic">
      Place compasses on the simulator to record field directions.
     </td>
     </tr>
    ) : (
     compasses.map((c, i) => (
     <tr key={c.id} className="border-b hover:bg-slate-50 dark:bg-[#121212] transition-colors">
      <td className="px-4 py-2 text-slate-600 dark:text-[#a1a1aa]">{i + 1}</td>
      <td className="px-4 py-2 font-mono text-slate-600 dark:text-[#a1a1aa]">({Math.round(c.x)}, {Math.round(c.y)})</td>
      <td className="px-4 py-2 font-mono text-blue-600 font-medium">{Math.round(c.angle)}°</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

   <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm dark:bg-teal-950/20 dark:border-teal-900">
   <h3 className="font-bold text-blue-800 mb-2 flex items-center dark:text-[#ffffff]">
    <CheckCircle className="w-5 h-5 mr-2" />
    Assessment
   </h3>
   <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-4 leading-relaxed">
    Based on your observations, what is the approximate direction (in degrees, from 0 to 360, where 0 is right, 90 is down) of the magnetic field <strong>directly above the center</strong> of the magnet?
   </p>
   <div className="flex gap-2">
    <input
    type="number"
    value={assessmentAnswer}
    onChange={(e) => setAssessmentAnswer(e.target.value)}
    placeholder="e.g. 180"
    className="flex-1 px-4 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
    />
    <button
    onClick={checkAssessment}
    className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
    >
    Check
    </button>
   </div>
   {assessmentResult && (
    <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${assessmentResult.includes('Correct') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
    {assessmentResult}
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
