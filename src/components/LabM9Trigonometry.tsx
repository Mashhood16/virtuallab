import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Table as TableIcon, BookOpen, Activity } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabM9Trigonometry({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [mode, setMode] = useState<'ladder' | 'ship'>('ladder');

 // Ladder state
 const [lAng, setLAng] = useState<number>(60);
 const [lLen, setLLen] = useState<number>(10);

 // Ship state
 const [brg, setBrg] = useState<number>(45);
 const [dist, setDist] = useState<number>(50);

 const [logs, setLogs] = useState<any[]>([]);

 const handleRecord = () => {
 if (mode === 'ladder') {
  const h = lLen * Math.sin(lAng * Math.PI / 180);
  const b = lLen * Math.cos(lAng * Math.PI / 180);
  setLogs([{ mode: 'ladder', input: `L=${lLen}, θ=${lAng}°`, res: `H=${h.toFixed(1)}, B=${b.toFixed(1)}` }, ...logs]);
 } else {
  const n = dist * Math.cos(brg * Math.PI / 180);
  const e = dist * Math.sin(brg * Math.PI / 180);
  setLogs([{ mode: 'ship', input: `D=${dist}, Brg=${brg}°`, res: `N=${n.toFixed(1)}, E=${e.toFixed(1)}` }, ...logs]);
 }
 };

 // Assessment
 const [qLadderL, setQLadderL] = useState<number>(12);
 const [qLadderA, setQLadderA] = useState<number>(45);
 const [ansLadderH, setAnsLadderH] = useState<string>('');
 const [statusLadder, setStatusLadder] = useState<boolean | null>(null);

 const [qShipE, setQShipE] = useState<number>(30);
 const [qShipN, setQShipN] = useState<number>(40);
 const [ansShipD, setAnsShipD] = useState<string>('');
 const [ansShipB, setAnsShipB] = useState<string>('');
 const [statusShip, setStatusShip] = useState<boolean | null>(null);

 useEffect(() => {
 setQLadderL(Math.floor(Math.random() * 10) + 10);
 setQLadderA(Math.floor(Math.random() * 40) + 30);
 setQShipE(Math.floor(Math.random() * 50) + 20);
 setQShipN(Math.floor(Math.random() * 50) + 20);
 }, []);

 const checkLadder = () => {
 const correctH = qLadderL * Math.sin(qLadderA * Math.PI / 180);
 if (Math.abs(parseFloat(ansLadderH) - correctH) < 0.2) setStatusLadder(true);
 else setStatusLadder(false);
 };

 const checkShip = () => {
 const correctD = Math.sqrt(qShipE*qShipE + qShipN*qShipN);
 let correctB = Math.atan2(qShipE, qShipN) * 180 / Math.PI;
 if (correctB < 0) correctB += 360;
 
 if (Math.abs(parseFloat(ansShipD) - correctD) < 0.5 && Math.abs(parseFloat(ansShipB) - correctB) < 1.0) {
  setStatusShip(true);
 } else setStatusShip(false);
 };

 const ladderH = lLen * Math.sin(lAng * Math.PI / 180);
 const ladderB = lLen * Math.cos(lAng * Math.PI / 180);

 const shipN = dist * Math.cos(brg * Math.PI / 180);
 const shipE = dist * Math.sin(brg * Math.PI / 180);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Virtual Lab: Trigonometry & Bearings" />
  

  
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
   <h2 className="text-xl font-bold mb-4 flex items-center text-blue-700">
   <BookOpen className="mr-2" /> Theory & Context
   </h2>
   
   <div className={`flex bg-slate-100 dark:bg-[#121212] p-1 rounded-lg mb-6 shrink-0 flex-col `}>
   <button
    className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'ladder' ? 'bg-slate-50 dark:bg-[#121212] shadow text-blue-700' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
    onClick={() => setMode('ladder')}
   >
    Right Triangles
   </button>
   <button
    className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'ship' ? 'bg-slate-50 dark:bg-[#121212] shadow text-blue-700' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
    onClick={() => setMode('ship')}
   >
    Ship Navigation
   </button>
   </div>

   <div className="flex-1 min-w-0 lg:overflow-y-auto pr-2 prose prose-sm text-slate-700 dark:text-[#ffffff]">
   {mode === 'ladder' ? (
    <>
    <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff]">SOH CAH TOA</h3>
    <p>Trigonometric ratios relate angles to the lengths of sides in a right-angled triangle.</p>
    <ul className="list-disc pl-5 space-y-1">
     <li><strong>sin(θ) = Opposite / Hypotenuse</strong></li>
     <li><strong>cos(θ) = Adjacent / Hypotenuse</strong></li>
     <li><strong>tan(θ) = Opposite / Adjacent</strong></li>
    </ul>
    <p>In our ladder model, the ladder is the hypotenuse (L), the wall is the opposite side (H), and the floor is the adjacent side (B).</p>
    </>
   ) : (
    <>
    <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff]">Bearings in Navigation</h3>
    <p>Bearings are angles measured clockwise from North, usually given as three digits (e.g., 045°, 120°).</p>
    <p>To convert a bearing and distance into North (N) and East (E) coordinates:</p>
    <ul className="list-disc pl-5 space-y-1">
     <li><strong>N = Distance × cos(Bearing)</strong></li>
     <li><strong>E = Distance × sin(Bearing)</strong></li>
    </ul>
    <p>Conversely, use Pythagoras and inverse tangent to find distance and bearing from coordinates.</p>
    </>
   )}
   </div>
  </div>

  {/* Column 2: Simulator */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b]  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold mb-4 flex items-center text-blue-700">
   <Activity className="mr-2" /> Interactive Simulator
   </h2>

   <div className={`bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-4 flex-1 flex flex-col mb-4 min-h-[300px] justify-center items-center `}>
   <svg width="100%" height="250" viewBox="0 0 300 250" className="bg-sky-50/50 rounded border border-sky-100">
    {mode === 'ladder' ? (
    <g>
     {/* Wall & Floor */}
     <rect x="150" y="50" width="30" height="170" fill="#cbd5e1" />
     <line x1="20" y1="220" x2="280" y2="220" stroke="#94a3b8" strokeWidth="4" />
     {/* Ladder */}
     <line x1={150 - ladderB*8} y1="220" x2="150" y2={220 - ladderH*8} stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
     {/* Angle Arc */}
     <path d={`M ${150 - ladderB*8 + 15} 220 A 15 15 0 0 0 ${150 - ladderB*8 + 8} ${220 - 12}`} fill="none" stroke="#ef4444" />
     <text x={150 - ladderB*8 + 25} y="215" fontSize="12" fill="#ef4444" fontWeight="bold">{lAng}°</text>
     
     {/* Height and Base labels */}
     <text x="160" y={220 - ladderH*4} fontSize="12" fill="#334155" fontWeight="bold">H={ladderH.toFixed(1)}m</text>
     <text x={150 - ladderB*4 - 20} y="235" fontSize="12" fill="#334155" fontWeight="bold">B={ladderB.toFixed(1)}m</text>
    </g>
    ) : (
    <g>
     {/* Radar grid */}
     <circle cx="150" cy="125" r="100" fill="none" stroke="#bae6fd" strokeWidth="2" />
     <circle cx="150" cy="125" r="50" fill="none" stroke="#bae6fd" strokeWidth="1" />
     <line x1="150" y1="15" x2="150" y2="235" stroke="#bae6fd" />
     <line x1="40" y1="125" x2="260" y2="125" stroke="#bae6fd" />
     <text x="145" y="12" fontSize="14" fill="#0ea5e9" fontWeight="bold">N</text>
     <text x="255" y="120" fontSize="14" fill="#0ea5e9" fontWeight="bold">E</text>

     {/* Ship Path */}
     <line x1="150" y1="125" x2={150 + shipE} y2={125 - shipN} stroke="#3b82f6" strokeWidth="3" strokeDasharray="4" />
     <circle cx={150 + shipE} cy={125 - shipN} r="6" fill="#ef4444" />
     <text x={150 + shipE + 10} y={125 - shipN + 5} fontSize="12" fill="#ef4444" fontWeight="bold">Ship</text>
     
     {/* Arc */}
     <path d={`M 150 100 A 25 25 0 ${brg > 180 ? 1 : 0} 1 ${150 + 25*Math.sin(brg*Math.PI/180)} ${125 - 25*Math.cos(brg*Math.PI/180)}`} fill="none" stroke="#eab308" strokeWidth="2" />
     <text x="160" y="115" fontSize="12" fill="#ca8a04" fontWeight="bold">{brg}°</text>
    </g>
    )}
   </svg>
   </div>

   <div className="space-y-3">
   {mode === 'ladder' ? (
    <>
    <div className="flex items-center gap-4">
     <label className="w-24 text-sm font-medium text-slate-700 dark:text-[#ffffff]">Angle (°):</label>
     <input type="range" min="30" max="80" value={lAng} onChange={(e) => setLAng(Number(e.target.value))} className="flex-1 min-w-0 accent-blue-600" />
     <span className="w-8 text-right font-mono">{lAng}</span>
    </div>
    <div className="flex items-center gap-4">
     <label className="w-24 text-sm font-medium text-slate-700 dark:text-[#ffffff]">Length (m):</label>
     <input type="range" min="5" max="15" value={lLen} onChange={(e) => setLLen(Number(e.target.value))} className="flex-1 min-w-0 accent-blue-600" />
     <span className="w-8 text-right font-mono">{lLen}</span>
    </div>
    </>
   ) : (
    <>
    <div className="flex items-center gap-4">
     <label className="w-24 text-sm font-medium text-slate-700 dark:text-[#ffffff]">Bearing (°):</label>
     <input type="range" min="0" max="360" value={brg} onChange={(e) => setBrg(Number(e.target.value))} className="flex-1 min-w-0 accent-blue-600" />
     <span className="w-8 text-right font-mono">{brg}</span>
    </div>
    <div className="flex items-center gap-4">
     <label className="w-24 text-sm font-medium text-slate-700 dark:text-[#ffffff]">Dist (km):</label>
     <input type="range" min="10" max="100" value={dist} onChange={(e) => setDist(Number(e.target.value))} className="flex-1 min-w-0 accent-blue-600" />
     <span className="w-8 text-right font-mono">{dist}</span>
    </div>
    </>
   )}
   <button 
    onClick={handleRecord}
    className={`w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition active:scale-95 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 flex-col `}
   >
    Record Data
   </button>
   </div>
  </div>

  {/* Column 3: Analysis */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b]  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold mb-4 flex items-center text-blue-700">
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
      <td className="py-2 font-semibold text-blue-600">{log.res}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

   <div className="flex-1 min-w-0 border-t border-slate-200 dark:border-[#1c1b1b] pt-4">
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-3">Knowledge Check</h3>
   
   {mode === 'ladder' ? (
    <div className="space-y-4">
    <p className="text-sm text-slate-700 dark:text-[#ffffff]">
     A ladder of length <strong>{qLadderL}m</strong> leans against a wall at an angle of <strong>{qLadderA}°</strong> to the horizontal. <br/>Calculate the height of the wall (to 1 decimal place).
    </p>
    <div className="flex items-center gap-2">
     <span>H = </span>
     <input 
     type="number" 
     value={ansLadderH} 
     onChange={(e) => setAnsLadderH(e.target.value)}
     className="w-20 border border-slate-300 dark:border-[#1c1b1b] rounded p-1 focus:ring-2 focus:ring-blue-500 outline-none"
     placeholder="0.0"
     />
     <span>m</span>
    </div>
    <div className="flex items-center gap-4 mt-4">
     <button onClick={checkLadder} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition active:scale-95 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
     Verify
     </button>
     {statusLadder === true && <CheckCircle2 className="text-emerald-500" />}
     {statusLadder === false && <XCircle className="text-red-500" />}
    </div>
    </div>
   ) : (
    <div className="space-y-4">
    <p className="text-sm text-slate-700 dark:text-[#ffffff]">
     A ship travels until it is exactly <strong>{qShipE}km East</strong> and <strong>{qShipN}km North</strong> of its starting point. Calculate its Distance and Bearing.
    </p>
    <div className="flex items-center gap-2 text-sm">
     <span>Dist = </span>
     <input 
     type="number" 
     value={ansShipD} 
     onChange={(e) => setAnsShipD(e.target.value)}
     className="w-16 border border-slate-300 dark:border-[#1c1b1b] rounded p-1 focus:ring-2 focus:ring-blue-500 outline-none"
     />
     <span>km</span>
     <span className="ml-2">Brg = </span>
     <input 
     type="number" 
     value={ansShipB} 
     onChange={(e) => setAnsShipB(e.target.value)}
     className="w-16 border border-slate-300 dark:border-[#1c1b1b] rounded p-1 focus:ring-2 focus:ring-blue-500 outline-none"
     />
     <span>°</span>
    </div>
    <div className="flex items-center gap-4 mt-4">
     <button onClick={checkShip} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition active:scale-95 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
     Verify
     </button>
     {statusShip === true && <CheckCircle2 className="text-emerald-500" />}
     {statusShip === false && <XCircle className="text-red-500" />}
    </div>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
