import { useState, useEffect } from 'react';
import { BookOpen, Activity, CheckCircle, Calculator} from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabM12Integration({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [tab] = useState<'solid' | 'dam' | 'spring'>('solid');
 
 // Solid States
 const [kSolid, setKSolid] = useState(1);
 const [nDisks, setNDisks] = useState(10);
 
 // Dam States
 const [damH, setDamH] = useState(30);
 
 // Spring States
 const [springK, setSpringK] = useState(50);
 const [springX, setSpringX] = useState(2);

 // Assessment States
 const [userAns, setUserAns] = useState<string>('');
 const [feedback, setFeedback] = useState<string | null>(null);

 useEffect(() => {
  setUserAns('');
  setFeedback(null);
 }, [tab, kSolid, damH, springK, springX]);

 const checkAnswer = () => {
  const parsed = parseFloat(userAns);
  if (isNaN(parsed)) {
   setFeedback('Please enter a valid number.');
   return;
  }
  
  if (tab === 'solid') {
   const exactVolume = Math.PI * kSolid * kSolid * (512 / 15);
   if (Math.abs(parsed - exactVolume) < 1.0) setFeedback('Correct! You accurately computed the volume of revolution.');
   else setFeedback(`Incorrect. Try evaluating pi * integral of (f(x))^2.`);
  } else if (tab === 'dam') {
   const exactF = 490 * damH * damH; // in kN
   if (Math.abs(parsed - exactF) < 1000) setFeedback('Correct! The hydrostatic force is accurately integrated.');
   else setFeedback(`Incorrect. Integrate rho * g * (h-y) * W dy.`);
  } else if (tab === 'spring') {
   const exactW = 0.5 * springK * springX * springX;
   if (Math.abs(parsed - exactW) < 0.5) setFeedback('Correct! The work done equals the integral of k*x dx.');
   else setFeedback('Incorrect. Integrate Hooke\'s Law force F=kx.');
  }
 };

 // --- SOLID RENDER HELPERS ---
 const mapX2D = (x: number) => 40 + (x / 4) * 320;
 const dx = 4 / nDisks;
 const rects2D = []; const disks3D = [];
 let approxV = 0;
 for (let i = 0; i < nDisks; i++) {
  const x_i = i * dx + dx / 2;
  const y_i = kSolid * (-x_i * x_i + 4 * x_i);
  approxV += Math.PI * y_i * y_i * dx;
  
  // 2D Rects
  const cx2d = mapX2D(i * dx);
  const W2d = (dx / 4) * 320;
  const H2d = (y_i / 8) * 140;
  rects2D.push(<rect key={`r${i}`} x={cx2d} y={180 - H2d} width={W2d} height={H2d} fill="rgba(239, 68, 68, 0.3)" stroke="#EF4444" strokeWidth="1" />);
  
  // 3D Disks
  const cx3d = mapX2D(i * dx);
  const R3d = (y_i / 8) * 70;
  const rx = Math.max(0.01, R3d * 0.3);
  const ry = Math.max(0.01, R3d);
  disks3D.push(
   <g key={`d${i}`}>
    {i === 0 && <ellipse cx={cx3d} cy={100} rx={rx} ry={ry} fill="#60A5FA" stroke="#2563EB" strokeWidth="0.5" />}
    <path d={`M ${cx3d} ${100-ry} L ${cx3d+W2d} ${100-ry} A ${rx} ${ry} 0 0 1 ${cx3d+W2d} ${100+ry} L ${cx3d} ${100+ry} A ${rx} ${ry} 0 0 0 ${cx3d} ${100-ry}`} fill="#93C5FD" stroke="#2563EB" strokeWidth="0.5" />
    <ellipse cx={cx3d+W2d} cy={100} rx={rx} ry={ry} fill="#60A5FA" stroke="#2563EB" strokeWidth="0.5" />
   </g>
  );
 }
 const curvePts = [];
 for (let x = 0; x <= 4; x += 0.1) {
  curvePts.push(`${mapX2D(x)},${180 - (kSolid * (-x * x + 4 * x) / 8) * 140}`);
 }

 // --- DAM RENDER HELPERS ---
 const arrows = [];
 for(let i=1; i<=5; i++) {
  const y_i = (250 - damH * 4) + i * (damH * 4) / 6;
  const d_i = y_i - (250 - damH * 4);
  arrows.push(<line key={`a${i}`} x1={300 - d_i} y1={y_i} x2={300} y2={y_i} stroke="#1e3a8a" strokeWidth="2" markerEnd="url(#arrow)" />);
 }

 // --- SPRING RENDER HELPERS ---
 const spStart = 50;
 const spEnd = 100 + springX * 50;
 const spL = spEnd - spStart;
 const spN = 10;
 const spDx = spL / (spN * 2);
 let spPath = `M ${spStart} 150 `;
 for(let i=0; i<spN; i++) {
  spPath += `L ${spStart + (i*2 + 0.5)*spDx} 130 `;
  spPath += `L ${spStart + (i*2 + 1.5)*spDx} 170 `;
 }
 spPath += `L ${spEnd} 150`;

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="M12 Integration Lab" />

   
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
  <div className="p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 flex-grow overflow-y-auto lg:overflow-visible">
    {/* Theory Column */}
    <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-blue-600" />Theory & Context</h2>
     <div className="prose prose-slate prose-sm text-slate-600 dark:text-[#a1a1aa]">
      {tab === 'solid' && (
       <>
        <p><strong>Solids of Revolution (Disc Method):</strong></p>
        <p>Revolving the region under $f(x) = k(-x^2 + 4x)$ around the x-axis from $x=0$ to $4$ generates a solid object.</p>
        <p>The volume of an infinitesimally thin disk is $dV = \pi [f(x)]^2 dx$. The total volume is:</p>
        <p className="font-semibold text-blue-700">{"$$ V = \\int_{0}^{4} \\pi [k(-x^2 + 4x)]^2 dx $$"}</p>
        <p>We can approximate this visually using a Riemann sum of $N$ disks.</p>
       </>
      )}
      {tab === 'dam' && (
       <>
        <p><strong>Hydrostatic Force on a Vertical Dam:</strong></p>
        <p>The pressure exerted by a fluid increases with depth. For a rectangular dam of width $W = 100$ m and water depth $h$:</p>
        <p>The force on a thin horizontal strip at depth $y$ is $dF = \\rho g y W dy$, where $y$ is measured downwards from the surface.</p>
        <p>Total force $F$ is the integral:</p>
        <p className="font-semibold text-blue-700">{"$$ F = \\int_{0}^{h} \\rho g (h - y) W dy $$"}</p>
        <p>Where $\\rho = 1000$ kg/m³ and $g = 9.8$ m/s².</p>
       </>
      )}
      {tab === 'spring' && (
       <>
        <p><strong>Work Done Stretching a Spring:</strong></p>
        <p>According to Hooke's Law, the force required to hold a spring stretched $x$ meters beyond its natural length is $F(x) = kx$.</p>
        <p>The work $W$ done in stretching the spring from $0$ to $x$ is the integral of Force over distance:</p>
        <p className="font-semibold text-blue-700">{"$$ W = \\int_{0}^{x} k s ds = \\frac{1}{2} k x^2 $$"}</p>
       </>
      )}
     </div>
    </div>

    {/* Interactive Simulator Column */}
    <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center"><Activity className="w-5 h-5 mr-2 text-blue-600" />Interactive Visualizer</h2>
     
     {tab === 'solid' && (
      <div className="flex-grow flex flex-col">
       <svg viewBox="0 0 400 200" className={`w-full bg-slate-50 dark:bg-[#121212] rounded-lg shadow-inner border mb-2 flex-col `}>
        <line x1="40" y1="180" x2="360" y2="180" stroke="#94a3b8" />
        <line x1="40" y1="20" x2="40" y2="180" stroke="#94a3b8" />
        {rects2D}
        <path d={`M 40,180 L ${curvePts.join(' L ')}`} fill="none" stroke="#2563eb" strokeWidth="2" />
       </svg>
       <svg viewBox="0 0 400 200" className="w-full bg-[#000000] dark:bg-[#121212] rounded-lg shadow-inner border mb-4">
        {disks3D}
       </svg>
       <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Scale Factor ($k$): {kSolid.toFixed(1)}</label>
       <input type="range" min="0.5" max="2" step="0.1" value={kSolid} onChange={(e) => setKSolid(Number(e.target.value))} className="mb-2" />
       <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Number of Disks ($N$): {nDisks}</label>
       <input type="range" min="2" max="50" step="1" value={nDisks} onChange={(e) => setNDisks(Number(e.target.value))} />
      </div>
     )}

     {tab === 'dam' && (
      <div className="flex-grow flex flex-col">
       <svg viewBox="0 0 400 300" className="w-full bg-slate-50 dark:bg-[#121212] rounded-lg shadow-inner border mb-4">
        <defs>
         <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e3a8a" />
         </marker>
        </defs>
        <rect x="300" y="50" width="20" height="200" fill="#64748b" /> {/* Dam Wall */}
        <rect x="100" y={250 - damH * 4} width="200" height={damH * 4} fill="rgba(59, 130, 246, 0.4)" stroke="#2563eb" /> {/* Water */}
        <line x1="100" y1="250" x2="320" y2="250" stroke="#475569" strokeWidth="2" /> {/* Bottom */}
        {arrows}
       </svg>
       <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Water Depth ($h$): {damH} m</label>
       <input type="range" min="10" max="50" step="1" value={damH} onChange={(e) => setDamH(Number(e.target.value))} />
      </div>
     )}

     {tab === 'spring' && (
      <div className="flex-grow flex flex-col">
       <svg viewBox="0 0 400 300" className="w-full bg-slate-50 dark:bg-[#121212] rounded-lg shadow-inner border mb-4">
        <rect x="30" y="100" width="20" height="100" fill="#64748b" /> {/* Wall */}
        <line x1="50" y1="180" x2="380" y2="180" stroke="#94a3b8" /> {/* Floor */}
        <path d={spPath} fill="none" stroke="#64748b" strokeWidth="4" strokeLinejoin="round" />
        <rect x={spEnd} y="130" width="40" height="50" fill="#ef4444" rx="4" /> {/* Block */}
        <text x={spEnd + 20} y="160" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">{springK} N/m</text>
       </svg>
       <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Spring Constant ($k$): {springK} N/m</label>
       <input type="range" min="10" max="100" step="10" value={springK} onChange={(e) => setSpringK(Number(e.target.value))} className="mb-2" />
       <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Stretch Distance ($x$): {springX.toFixed(1)} m</label>
       <input type="range" min="0" max="5" step="0.1" value={springX} onChange={(e) => setSpringX(Number(e.target.value))} />
      </div>
     )}
    </div>

    {/* Assessment Column */}
    <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center"><Calculator className="w-5 h-5 mr-2 text-blue-600" />Assessment</h2>
     <div className={`bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-sm text-blue-900 dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff] `}>
      {tab === 'solid' && <p>Calculate the exact volume of the solid of revolution for $k = {kSolid}$. (Use $\pi \approx 3.14159$).</p>}
      {tab === 'dam' && <p>Calculate the total hydrostatic force in kiloNewtons (kN) for water depth $h = {damH}$ m. Width $W = 100$ m.</p>}
      {tab === 'spring' && <p>Calculate the exact work done (in Joules) to stretch the spring to $x = {springX.toFixed(1)}$ m with $k = {springK}$ N/m.</p>}
     </div>
     
     <div className="space-y-4">
      <div>
       <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Your Answer</label>
       <input 
        type="text" 
        value={userAns} 
        onChange={(e) => setUserAns(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter numerical value..."
       />
      </div>
      <button 
       onClick={checkAnswer}
       className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
      >
       Check Answer
      </button>
      
      {feedback && (
       <div className={`p-4 rounded-md text-sm flex items-start ${feedback.includes('Correct') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
        {feedback.includes('Correct') ? <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" /> : <Activity className="w-5 h-5 mr-2 flex-shrink-0" />}
        <span>{feedback}</span>
       </div>
      )}
     </div>
    </div>
   </div>
  </div>
 );
}
