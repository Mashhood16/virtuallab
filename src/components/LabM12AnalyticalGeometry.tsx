import { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, XCircle, Settings2, BookOpen, Calculator, RotateCcw } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabM12AnalyticalGeometry({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [mode, setMode] = useState<'concurrency' | 'landscaping'>('concurrency');

 // Concurrency state: L1, L2 are fixed, L3: y = m*x + c
 const [m3, setM3] = useState(0.5);
 const [c3, setC3] = useState(-2);
 
 // Landscaping state: Polygon vertices
 const [vertices, setVertices] = useState([
 {x: -10, y: -10},
 {x: 10, y: -10},
 {x: 5, y: 15},
 {x: -5, y: 10}
 ]);
 const [selectedVertex, setSelectedVertex] = useState(0);

 const [userAnswer, setUserAnswer] = useState("");
 const [feedback, setFeedback] = useState<"none" | "correct" | "incorrect">("none");
 const [problemData, setProblemData] = useState<{ m1: number, c1: number, m2: number, c2: number, rate: number } | null>(null);

 const generateProblem = () => {
 setUserAnswer("");
 setFeedback("none");
 setProblemData({
  m1: Math.floor(Math.random() * 5 + 1),
  c1: Math.floor(Math.random() * 10 - 5),
  m2: -Math.floor(Math.random() * 5 + 1),
  c2: Math.floor(Math.random() * 10 + 5),
  rate: Math.floor(Math.random() * 50 + 50)
 });
 };

 useEffect(() => {
 generateProblem();
 }, [mode]);

 const problemText = useMemo(() => {
  if (!problemData) return "";
  if (mode === 'concurrency') {
  return `Urban Traffic: Two main roads follow y = ${problemData.m1}x + ${problemData.c1} and y = ${problemData.m2}x + ${problemData.c2}. A third planned road is y = 0.5x + C. Find the value of C such that all three roads intersect at a single concurrent roundabout. (Round to 2 decimal places)`;
  } else {
  return `Landscaping Cost: At $${problemData.rate} per sq unit, what is the total cost of landscaping the polygonal plot currently shown on the map? (Update your calculation if you move the vertices).`;
  }
 }, [problemData, mode]);

 const currentArea = useMemo(() => {
  let area = 0;
  for (let i = 0; i < vertices.length; i++) {
  const j = (i + 1) % vertices.length;
  area += vertices[i].x * vertices[j].y - vertices[j].x * vertices[i].y;
  }
  return Math.abs(area) / 2;
 }, [vertices]);

 const checkAnswer = () => {
  if (!problemData) return;
  const val = parseFloat(userAnswer);
  let correctAns = 0;
  if (mode === 'concurrency') {
  const xInt = (problemData.c2 - problemData.c1) / (problemData.m1 - problemData.m2);
  const yInt = problemData.m1 * xInt + problemData.c1;
  correctAns = yInt - 0.5 * xInt;
  } else {
  correctAns = currentArea * problemData.rate;
  }
  if (Math.abs(val - correctAns) < 0.1) setFeedback("correct");
  else setFeedback("incorrect");
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Lab M12.2: Analytical Geometry" />
  <div className="bg-emerald-900 text-white p-2 flex justify-end shrink-0">
  <div className="flex bg-emerald-800 rounded-lg p-1">
   <button
   onClick={() => setMode('concurrency')}
   className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'concurrency' ? 'bg-slate-50 dark:bg-[#121212] text-emerald-900 shadow' : 'text-emerald-100 hover:bg-emerald-700'}`}
   >
   Line Concurrency
   </button>
   <button
   onClick={() => setMode('landscaping')}
   className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'landscaping' ? 'bg-slate-50 dark:bg-[#121212] text-emerald-900 shadow' : 'text-emerald-100 hover:bg-emerald-700'}`}
   >
   Polygonal Landscaping
   </button>
  </div>
  </div>

  
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
  <main className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:min-h-0 overflow-y-auto lg:overflow-visible">
  {/* Theory Column */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col gap-4 lg:overflow-y-auto  ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 text-emerald-700 mb-2">
   <BookOpen className="w-5 h-5" />
   <h2 className="text-lg font-bold">Theoretical Context</h2>
   </div>
   
   {mode === 'concurrency' && (
   <div className="text-sm text-slate-700 dark:text-[#ffffff] space-y-3">
    <p><strong>Concurrent Lines</strong> are three or more lines that intersect at a single common point.</p>
    <p>In urban planning, multi-way intersections (like roundabouts) require the centerlines of incoming roads to be concurrent to avoid staggered junctions.</p>
    <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded text-center font-mono flex-col `}>
    {"$$L_1: a_1 x + b_1 y + c_1 = 0$$"} <br/>
    {"$$L_2: a_2 x + b_2 y + c_2 = 0$$"} <br/>
    {"$$L_3: a_3 x + b_3 y + c_3 = 0$$"}
    </div>
    <p>Condition for concurrency is that the lines share a common intersection coordinate (x, y).</p>
   </div>
   )}

   {mode === 'landscaping' && (
   <div className="text-sm text-slate-700 dark:text-[#ffffff] space-y-3">
    <p>The <strong>Shoelace Formula</strong> (Surveyor's formula) is used to find the area of a polygon whose vertices are described by Cartesian coordinates in the plane.</p>
    <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded text-center overflow-x-auto font-mono text-xs flex-col `}>
    {"$$A = \\frac{1}{2} |(x_1 y_2 + x_2 y_3 + ... + x_n y_1) - (y_1 x_2 + y_2 x_3 + ... + y_n x_1)|$$"}
    </div>
    <p><strong>Applications:</strong> Calculating area for irregular land plots to estimate the cost of materials (soil, grass, paving).</p>
   </div>
   )}
  </div>

  {/* Visualizer Column */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col gap-4 items-center justify-center relative overflow-  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] self-start absolute top-5 left-5 z-10">Live Visualization</h2>
   
   <svg viewBox="-30 -30 60 60" className={`w-full max-w-md aspect-square bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg shadow-inner mt-8 flex-col `}>
   <g transform="scale(1, -1)">
    {/* Axes and Grid */}
    {[...Array(13)].map((_, i) => (
    <g key={i}>
     <line x1="-30" y1={(i-6)*5} x2="30" y2={(i-6)*5} stroke="#e2e8f0" strokeWidth="0.2" />
     <line x1={(i-6)*5} y1="-30" x2={(i-6)*5} y2="30" stroke="#e2e8f0" strokeWidth="0.2" />
    </g>
    ))}
    <line x1="-30" y1="0" x2="30" y2="0" stroke="#94a3b8" strokeWidth="0.5" />
    <line x1="0" y1="-30" x2="0" y2="30" stroke="#94a3b8" strokeWidth="0.5" />

    {mode === 'concurrency' && problemData && (
    <>
     {/* L1 */}
     <line x1="-30" y1={problemData.m1*(-30)+problemData.c1} x2="30" y2={problemData.m1*(30)+problemData.c1} stroke="#ef4444" strokeWidth="1" vectorEffect="non-scaling-stroke" />
     {/* L2 */}
     <line x1="-30" y1={problemData.m2*(-30)+problemData.c2} x2="30" y2={problemData.m2*(30)+problemData.c2} stroke="#3b82f6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
     {/* L3 */}
     <line x1="-30" y1={m3*(-30)+c3} x2="30" y2={m3*(30)+c3} stroke="#10b981" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
     
     {/* Intersection of L1 and L2 */}
     <circle cx={(problemData.c2 - problemData.c1) / (problemData.m1 - problemData.m2)} 
       cy={problemData.m1 * ((problemData.c2 - problemData.c1) / (problemData.m1 - problemData.m2)) + problemData.c1} 
       r="1" fill="#f59e0b" />
    </>
    )}

    {mode === 'landscaping' && (
    <>
     <polygon 
     points={vertices.map(v => `${v.x},${v.y}`).join(' ')} 
     fill="rgba(16, 185, 129, 0.2)" 
     stroke="#10b981" 
     strokeWidth="1" 
     vectorEffect="non-scaling-stroke" 
     />
     {vertices.map((v, i) => (
     <circle 
      key={i} 
      cx={v.x} 
      cy={v.y} 
      r={selectedVertex === i ? "1.5" : "1"} 
      fill={selectedVertex === i ? "#ef4444" : "#3b82f6"} 
      onClick={() => setSelectedVertex(i)}
      className="cursor-pointer hover:opacity-80"
     />
     ))}
    </>
    )}
   </g>
   </svg>
  </div>

  {/* Assessment Column */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col gap-4 lg:  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center gap-2 text-emerald-700 mb-2 shrink-0">
   <Settings2 className="w-5 h-5" />
   <h2 className="text-lg font-bold">Parameters & Assessment</h2>
   </div>

   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] space-y-4 shrink-0">
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff]">Interactive Variables</h3>
   {mode === 'concurrency' && (
    <>
    <div>
     <label className="block text-sm text-slate-600 dark:text-[#a1a1aa] mb-1">Line 3 Slope (m3): {m3.toFixed(1)}</label>
     <input type="range" min="-3" max="3" step="0.1" value={m3} onChange={e => setM3(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <div>
     <label className="block text-sm text-slate-600 dark:text-[#a1a1aa] mb-1">Line 3 Intercept (c3): {c3.toFixed(1)}</label>
     <input type="range" min="-15" max="15" step="0.5" value={c3} onChange={e => setC3(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    </>
   )}
   {mode === 'landscaping' && (
    <>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">Select a vertex on the map to edit.</p>
    <div className="grid grid-cols-2 gap-4">
     <div>
     <label className="block text-sm text-slate-600 dark:text-[#a1a1aa] mb-1">Vertex {selectedVertex+1} X: {vertices[selectedVertex].x}</label>
     <input type="range" min="-25" max="25" step="1" value={vertices[selectedVertex].x} onChange={e => {
      const newV = [...vertices];
      newV[selectedVertex].x = Number(e.target.value);
      setVertices(newV);
     }} className="w-full accent-emerald-600" />
     </div>
     <div>
     <label className="block text-sm text-slate-600 dark:text-[#a1a1aa] mb-1">Vertex {selectedVertex+1} Y: {vertices[selectedVertex].y}</label>
     <input type="range" min="-25" max="25" step="1" value={vertices[selectedVertex].y} onChange={e => {
      const newV = [...vertices];
      newV[selectedVertex].y = Number(e.target.value);
      setVertices(newV);
     }} className="w-full accent-emerald-600" />
     </div>
    </div>
    </>
   )}
   </div>

   <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex-1 flex flex-col">
   <div className="flex items-center gap-2 text-emerald-800 mb-3 shrink-0">
    <Calculator className="w-5 h-5" />
    <h3 className="font-semibold">Lab Computation Task</h3>
   </div>
   
   <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-4 flex-1">
    {problemText}
   </p>

   <div className="space-y-3 shrink-0">
    <div className="flex flex-wrap gap-2">
    <input 
     type="number" 
     value={userAnswer}
     onChange={e => setUserAnswer(e.target.value)}
     placeholder="Enter answer" 
     className="flex-1 min-w-0 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
    <button 
     onClick={checkAnswer}
     className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
    >
     Verify
    </button>
    </div>

    {feedback === "correct" && (
    <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded border border-green-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
     <CheckCircle2 className="w-5 h-5 shrink-0" />
     <span className="font-medium text-sm">Excellent! Computation is accurate.</span>
    </div>
    )}

    {feedback === "incorrect" && (
    <div className="flex items-center gap-2 text-red-700 bg-red-50 p-2 rounded border border-red-200">
     <XCircle className="w-5 h-5 shrink-0" />
     <span className="font-medium text-sm">Incorrect. Double-check your calculations.</span>
    </div>
    )}

    <button 
    onClick={generateProblem}
    className="flex items-center justify-center gap-2 w-full text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-md transition-colors text-sm font-medium border border-transparent mt-2"
    >
    <RotateCcw className="w-4 h-4" />
    Generate New Scenario
    </button>
   </div>
   </div>
  </div>
  </main>
 </div>
 );
}
