import { useState, useRef, useEffect } from 'react';
import { Info, CheckCircle, RefreshCw } from 'lucide-react';
import LabHeader from './LabHeader';

interface LogEntry {
 id: number;
 item: string;
 event: string;
}

export default function LabP9EverydayPhysics({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const svgRef = useRef<SVGSVGElement>(null);
 const [logs, setLogs] = useState<LogEntry[]>([]);

 // Ball Drop State
 const [ballShelfY, setBallShelfY] = useState(150);
 const [ballY, setBallY] = useState(140); // ballShelfY - 10
 const [isBallFalling, setIsBallFalling] = useState(false);
 const [isDraggingShelf, setIsDraggingShelf] = useState(false);
 const ballAnimRef = useRef<number>(0);

 // Box Sliding State
 const [boxState, setBoxState] = useState({ x: 50, v: 0, isSliding: false });
 const boxAnimRef = useRef<number>(0);

 // Pendulum State
 const [pendulumState, setPendulumState] = useState({ angle: 0, isSwinging: false, length: 150, isDragging: false });
 const pendulumAnimRef = useRef<number>(0);

 // Assessment State
 const [ansGravity, setAnsGravity] = useState('');
 const [ansFriction, setAnsFriction] = useState('');
 const [resGravity, setResGravity] = useState<string | null>(null);
 const [resFriction, setResFriction] = useState<string | null>(null);

 // --- Handlers for Ball Drop ---
 const handleShelfPointerDown = (e: React.PointerEvent) => {
 if (isBallFalling) return;
 (e.target as Element).setPointerCapture(e.pointerId);
 setIsDraggingShelf(true);
 };

 const handleShelfPointerMove = (e: React.PointerEvent) => {
 if (!isDraggingShelf || !svgRef.current) return;
 const rect = svgRef.current.getBoundingClientRect();
 const scaleY = 400 / rect.height;
 let newY = (e.clientY - rect.top) * scaleY;
 if (newY < 50) newY = 50;
 if (newY > 300) newY = 300;
 
 setBallShelfY(newY);
 setBallY(newY - 10);
 };

 const handleShelfPointerUp = (e: React.PointerEvent) => {
 (e.target as Element).releasePointerCapture(e.pointerId);
 setIsDraggingShelf(false);
 };

 const dropBall = () => {
 if (isBallFalling) return;
 setIsBallFalling(true);
 };

 useEffect(() => {
 if (!isBallFalling) return;
 let startTime = performance.now();
 const startY = ballShelfY - 10;
 
 const animate = (time: number) => {
  const t = (time - startTime) / 1000;
  const newY = startY + 0.5 * 9.8 * t * t * 100;
  
  if (newY >= 340) {
   setBallY(340);
   setIsBallFalling(false);
   setLogs(prev => [...prev, { id: Date.now(), item: 'Falling Ball', event: `Dropped from ${((350 - ballShelfY)/100).toFixed(2)}m. Time: ${t.toFixed(2)}s` }]);
  } else {
   setBallY(newY);
   ballAnimRef.current = requestAnimationFrame(animate);
  }
 };
 ballAnimRef.current = requestAnimationFrame(animate);
 return () => cancelAnimationFrame(ballAnimRef.current!);
 }, [isBallFalling, ballShelfY]);

 // --- Handlers for Sliding Box ---
 const pushBox = () => {
 if (boxState.isSliding) return;
 const v0 = 3 + Math.random() * 2; // 3 to 5 m/s
 setBoxState({ x: 50, v: v0, isSliding: true });
 setLogs(prev => [...prev, { id: Date.now(), item: 'Sliding Box', event: `Pushed with v₀ = ${v0.toFixed(2)} m/s` }]);
 };

 useEffect(() => {
 if (!boxState.isSliding) return;
 let startTime = performance.now();
 let startX = boxState.x;
 let v0 = boxState.v;
 let a = -4.9; // friction accel
 
 const animate = (time: number) => {
  const t = (time - startTime) / 1000;
  const currentV = v0 + a * t;
  const currentX = startX + (v0 * t + 0.5 * a * t * t) * 100;
  
  if (currentV <= 0) {
   setBoxState(prev => ({ ...prev, x: currentX, v: 0, isSliding: false }));
   const dist = (currentX - startX) / 100;
   setLogs(prev => [...prev, { id: Date.now(), item: 'Sliding Box', event: `Stopped. Slid distance = ${dist.toFixed(2)}m` }]);
  } else {
   setBoxState(prev => ({ ...prev, x: currentX }));
   boxAnimRef.current = requestAnimationFrame(animate);
  }
 };
 boxAnimRef.current = requestAnimationFrame(animate);
 return () => cancelAnimationFrame(boxAnimRef.current!);
 }, [boxState.isSliding, boxState.v, boxState.x]);

 // --- Handlers for Pendulum ---
 const handlePendulumPointerDown = (e: React.PointerEvent) => {
 if (pendulumState.isSwinging) return;
 (e.target as Element).setPointerCapture(e.pointerId);
 setPendulumState(prev => ({ ...prev, isDragging: true }));
 };

 const handlePendulumPointerMove = (e: React.PointerEvent) => {
 if (!pendulumState.isDragging || !svgRef.current) return;
 const rect = svgRef.current.getBoundingClientRect();
 const scaleY = 400 / rect.height;
 let newY = (e.clientY - rect.top) * scaleY;
 if (newY < 50) newY = 50;
 if (newY > 250) newY = 250;
 setPendulumState(prev => ({ ...prev, length: newY - 50 }));
 };

 const handlePendulumPointerUp = (e: React.PointerEvent) => {
 (e.target as Element).releasePointerCapture(e.pointerId);
 setPendulumState(prev => ({ ...prev, isDragging: false }));
 };

 const startPendulum = () => {
 if (pendulumState.isSwinging) return;
 setPendulumState(prev => ({ ...prev, isSwinging: true }));
 };

 useEffect(() => {
 if (!pendulumState.isSwinging) return;
 let startTime = performance.now();
 const L = pendulumState.length / 100; 
 const g = 9.8;
 const omega = Math.sqrt(g / L);
 const maxAngle = Math.PI / 4; 
 const period = 2 * Math.PI * Math.sqrt(L / g);
 
 const animate = (time: number) => {
  const t = (time - startTime) / 1000;
  if (t > period * 3) {
   setPendulumState(prev => ({ ...prev, angle: 0, isSwinging: false }));
   setLogs(prev => [...prev, { id: Date.now(), item: 'Pendulum', event: `L=${L.toFixed(2)}m. Period: ${period.toFixed(2)}s` }]);
   return;
  }
  const currentAngle = maxAngle * Math.cos(omega * t);
  setPendulumState(prev => ({ ...prev, angle: currentAngle * 180 / Math.PI }));
  pendulumAnimRef.current = requestAnimationFrame(animate);
 };
 pendulumAnimRef.current = requestAnimationFrame(animate);
 return () => cancelAnimationFrame(pendulumAnimRef.current!);
 }, [pendulumState.isSwinging, pendulumState.length]);

 // --- Assessments ---
 const checkGravity = () => {
 const v = parseFloat(ansGravity);
 if (!isNaN(v) && Math.abs(v - 9.8) < 0.5) {
  setResGravity("Correct! The acceleration due to gravity is approximately 9.8 m/s².");
 } else {
  setResGravity("Incorrect. Remember to use g = 2h / t² with the measured values.");
 }
 };

 const checkFriction = () => {
 const v = parseFloat(ansFriction);
 if (!isNaN(v) && Math.abs(v - 0.5) < 0.05) {
  setResFriction("Correct! The coefficient of kinetic friction is 0.5.");
 } else {
  setResFriction("Incorrect. Use μ = v₀² / (2 * 9.8 * d) using logs.");
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Lab: Everyday Physics Classroom" />

  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 overflow-y-auto lg:overflow-visible">
  {/* Theory Column */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold mb-4 flex items-center text-emerald-800">
   <Info className="mr-2" /> Concepts at Work
   </h2>
   <div className="space-y-4 text-slate-700 dark:text-[#ffffff] leading-relaxed text-sm">
   <p>
    Physics isn't just in the lab—it governs everything in our daily environment!
   </p>
   
   <div className="border-l-4 border-red-500 pl-3">
    <h3 className="font-bold text-slate-800 dark:text-[#ffffff]">1. Free Fall (Kinematics)</h3>
    <p>When an object is dropped, gravity accelerates it downwards at roughly 9.8 m/s². The height and time are related by: <code className="bg-slate-100 dark:bg-[#121212] px-1 rounded">h = ½gt²</code>.</p>
   </div>

   <div className="border-l-4 border-amber-500 pl-3">
    <h3 className="font-bold text-slate-800 dark:text-[#ffffff]">2. Periodic Motion</h3>
    <p>A pendulum swings back and forth. The time it takes for one full swing (Period, T) depends entirely on its length and gravity: <code className="bg-slate-100 dark:bg-[#121212] px-1 rounded">T = 2π√(L/g)</code>.</p>
   </div>

   <div className="border-l-4 border-emerald-500 pl-3">
    <h3 className="font-bold text-slate-800 dark:text-[#ffffff]">3. Kinetic Friction</h3>
    <p>A sliding box slows down because the floor exerts a frictional force. The distance it slides before stopping depends on initial velocity and the coefficient of friction (μ): <code className="bg-slate-100 dark:bg-[#121212] px-1 rounded">d = v₀² / (2μg)</code>.</p>
   </div>

   <div className={`bg-emerald-50 p-4 rounded-lg border border-emerald-100 mt-6 flex-col `}>
    <h3 className="font-semibold text-emerald-800 mb-2">Instructions:</h3>
    <ul className="list-disc pl-5 space-y-1">
    <li>Adjust the shelf height, then click the ball to drop it.</li>
    <li>Adjust the pendulum length, then click the bob to swing it.</li>
    <li>Click 'Push' to slide the box across the floor.</li>
    </ul>
   </div>
   </div>
  </div>

  {/* Simulator Column */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold mb-4 text-emerald-800 text-center">Interactive Classroom</h2>
   
   <div className="flex-1 relative flex items-center justify-center bg-sky-50 rounded-xl overflow-hidden border-2 border-slate-300 dark:border-[#1c1b1b] shadow-inner">
   <svg
    ref={svgRef}
    viewBox="0 0 400 400"
    className="w-full h-full"
   >
    {/* Floor */}
    <rect x="0" y="350" width="400" height="50" fill="#94a3b8" />
    <line x1="0" y1="350" x2="400" y2="350" stroke="#475569" strokeWidth="4" />

    {/* 3m Ruler on Wall */}
    <g transform="translate(10, 50)">
    <rect x="0" y="0" width="20" height="300" fill="#fef08a" stroke="#ca8a04" />
    {Array.from({length: 31}).map((_, i) => (
     <line key={i} x1={i % 10 === 0 ? 0 : 10} y1={i * 10} x2="20" y2={i * 10} stroke="#ca8a04" strokeWidth={i % 10 === 0 ? 2 : 1} />
    ))}
    <text x="25" y="0" fontSize="12" fill="#854d0e" fontWeight="bold" alignmentBaseline="middle">3m</text>
    <text x="25" y="100" fontSize="12" fill="#854d0e" fontWeight="bold" alignmentBaseline="middle">2m</text>
    <text x="25" y="200" fontSize="12" fill="#854d0e" fontWeight="bold" alignmentBaseline="middle">1m</text>
    <text x="25" y="300" fontSize="12" fill="#854d0e" fontWeight="bold" alignmentBaseline="middle">0m</text>
    </g>

    {/* Draggable Shelf */}
    <g transform={`translate(70, ${ballShelfY})`} 
     style={{ cursor: isDraggingShelf ? 'grabbing' : 'ns-resize' }}
     onPointerDown={handleShelfPointerDown}
     onPointerMove={handleShelfPointerMove}
     onPointerUp={handleShelfPointerUp}
     onPointerCancel={handleShelfPointerUp}>
    <rect x="0" y="0" width="60" height="10" fill="#5560F1" rx="2" />
    <circle cx="30" cy="5" r="4" fill="#cbd5e1" pointerEvents="none" />
    </g>

    {/* Falling Ball */}
    <g transform={`translate(100, ${ballY})`}>
    <circle cx="0" cy="0" r="10" fill="#ef4444" 
      style={{ cursor: 'pointer' }}
      onClick={dropBall} />
    {!isBallFalling && <text x="0" y="-15" fontSize="10" fill="#ef4444" textAnchor="middle" pointerEvents="none" fontWeight="bold">Drop</text>}
    </g>

    {/* Pendulum */}
    <g transform="translate(250, 50)">
    <rect x="-15" y="-10" width="30" height="10" fill="#333" />
    <g transform={`rotate(${pendulumState.angle})`}>
     <line x1="0" y1="0" x2="0" y2={pendulumState.length} stroke="#64748b" strokeWidth="2" />
     <circle cx="0" cy={pendulumState.length} r="15" fill="#f59e0b" style={{cursor: 'pointer'}} onClick={startPendulum} />
     {!pendulumState.isSwinging && <text x="0" y={pendulumState.length + 25} fontSize="10" fill="#d97706" textAnchor="middle" pointerEvents="none" fontWeight="bold">Swing</text>}
     
     {/* Draggable length handle */}
     <circle cx="0" cy={pendulumState.length} r="20" fill="transparent"
      style={{ cursor: pendulumState.isDragging ? 'grabbing' : 'ns-resize' }}
      onPointerDown={handlePendulumPointerDown}
      onPointerMove={handlePendulumPointerMove}
      onPointerUp={handlePendulumPointerUp}
      onPointerCancel={handlePendulumPointerUp} />
    </g>
    </g>

    {/* Sliding Box */}
    <g transform={`translate(${boxState.x}, 320)`}>
    <rect x="0" y="0" width="30" height="30" fill="#10b981" rx="2" />
    <text x="15" y="20" fontSize="10" fill="white" textAnchor="middle" pointerEvents="none" fontWeight="bold">Box</text>
    </g>
    {!boxState.isSliding && (
    <g transform={`translate(${boxState.x - 35}, 325)`} style={{cursor: 'pointer'}} onClick={pushBox}>
     <rect x="0" y="0" width="30" height="20" fill="#3b82f6" rx="4" />
     <text x="15" y="14" fontSize="10" fill="white" textAnchor="middle" pointerEvents="none" fontWeight="bold">Push</text>
    </g>
    )}
   </svg>
   </div>
   
   <div className="mt-4 flex justify-center">
   <button
    onClick={() => {
     setBoxState({ x: 50, v: 0, isSliding: false });
     setBallY(ballShelfY - 10);
     setIsBallFalling(false);
     setPendulumState(prev => ({ ...prev, angle: 0, isSwinging: false }));
     setLogs([]);
    }}
    className="flex items-center px-4 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg font-medium hover:bg-slate-300 dark:bg-[#121212] transition-colors"
   >
    <RefreshCw className="w-4 h-4 mr-2" />
    Reset Objects
   </button>
   </div>
  </div>

  {/* Data & Analysis Column */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <h2 className="text-xl font-bold mb-4 text-emerald-800">Experiment Data</h2>
   
   <div className="flex-1 lg:overflow-y-auto mb-4 border border-slate-200 dark:border-[#1c1b1b] rounded-lg max-h-48">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-100 dark:bg-[#121212] sticky top-0">
    <tr>
     <th className="px-3 py-2 border-b font-semibold text-slate-700 dark:text-[#ffffff]">Object</th>
     <th className="px-3 py-2 border-b font-semibold text-slate-700 dark:text-[#ffffff]">Measurement</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 ? (
     <tr>
     <td colSpan={2} className="px-4 py-6 text-center text-slate-500 dark:text-[#71717a] italic">
      Interact with objects to log data.
     </td>
     </tr>
    ) : (
     logs.map((log) => (
     <tr key={log.id} className="border-b hover:bg-slate-50 dark:bg-[#121212]">
      <td className="px-3 py-2 font-medium text-slate-700 dark:text-[#ffffff]">{log.item}</td>
      <td className="px-3 py-2 font-mono text-emerald-700 text-xs">{log.event}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

   <div className="space-y-4">
   <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
    <h3 className="font-bold text-red-800 mb-2 flex items-center text-sm">
    <CheckCircle className="w-4 h-4 mr-2" /> Calc Gravity
    </h3>
    <p className="text-xs text-slate-700 dark:text-[#ffffff] mb-2">Drop the ball. Calculate <strong>g</strong> (m/s²) using <code className="bg-slate-50 dark:bg-[#121212] px-1">g = 2h / t²</code></p>
    <div className="flex gap-2">
    <input type="number" value={ansGravity} onChange={e => setAnsGravity(e.target.value)} className="w-20 px-2 py-1 text-sm border rounded" />
    <button onClick={checkGravity} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40">Check</button>
    </div>
    {resGravity && <p className={`mt-2 text-xs font-medium ${resGravity.includes('Correct') ? 'text-green-700' : 'text-red-600'}`}>{resGravity}</p>}
   </div>

   <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
    <h3 className="font-bold text-emerald-800 mb-2 flex items-center text-sm">
    <CheckCircle className="w-4 h-4 mr-2" /> Calc Friction
    </h3>
    <p className="text-xs text-slate-700 dark:text-[#ffffff] mb-2">Push the box. Calculate <strong>μ</strong> using <code className="bg-slate-50 dark:bg-[#121212] px-1">μ = v₀² / (2gd)</code> (use g=9.8)</p>
    <div className="flex gap-2">
    <input type="number" value={ansFriction} onChange={e => setAnsFriction(e.target.value)} step="0.1" className="w-20 px-2 py-1 text-sm border rounded" />
    <button onClick={checkFriction} className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">Check</button>
    </div>
    {resFriction && <p className={`mt-2 text-xs font-medium ${resFriction.includes('Correct') ? 'text-green-700' : 'text-red-600'}`}>{resFriction}</p>}
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
