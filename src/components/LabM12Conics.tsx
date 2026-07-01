import { useState, useMemo, useEffect } from 'react';
import { CheckCircle2, XCircle, Settings2, BookOpen, Calculator, RotateCcw } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabM12Conics({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [conicType, setConicType] = useState<'parabola' | 'ellipse' | 'hyperbola'>('parabola');
 
 // Parameters
 const [p, setP] = useState(5);
 const [a, setA] = useState(10);
 const [b, setB] = useState(8);

 const [userAnswer, setUserAnswer] = useState("");
 const [feedback, setFeedback] = useState<"none" | "correct" | "incorrect">("none");
 const [problemData, setProblemData] = useState<{ w: number, d: number, a: number, b: number } | null>(null);

 const generateProblem = () => {
 setUserAnswer("");
 setFeedback("none");
 setProblemData({
  w: Math.floor(Math.random() * 20 + 10) * 2,
  d: Math.floor(Math.random() * 10 + 5),
  a: Math.floor(Math.random() * 10 + 15),
  b: Math.floor(Math.random() * 5 + 5)
 });
 };

 useEffect(() => {
 generateProblem();
 }, [conicType]);

 const problemText = useMemo(() => {
 if (!problemData) return "";
 if (conicType === 'parabola') {
  return `A parabolic satellite dish is ${problemData.w}m wide at its opening and ${problemData.d}m deep. Find the required focal length (distance from vertex to receiver). Round to 2 decimal places.`;
 } else if (conicType === 'ellipse') {
  return `Kepler's laws model a planetary orbit as an ellipse. If the semi-major axis is ${problemData.a} AU and semi-minor axis is ${problemData.b} AU, find the focal distance c. Round to 2 decimal places.`;
 } else {
  return `A hyperbolic cooling tower has a shape governed by x²/a² - y²/b² = 1. Given a = ${problemData.a}m and b = ${problemData.b}m, calculate the eccentricity e of the hyperbola. Round to 2 decimal places.`;
 }
 }, [problemData, conicType]);

 const checkAnswer = () => {
 if (!problemData) return;
 const val = parseFloat(userAnswer);
 let correctAns = 0;
 if (conicType === 'parabola') {
  correctAns = ((problemData.w / 2) ** 2) / (4 * problemData.d);
 } else if (conicType === 'ellipse') {
  correctAns = Math.sqrt(problemData.a ** 2 - problemData.b ** 2);
 } else {
  correctAns = Math.sqrt(1 + (problemData.b ** 2) / (problemData.a ** 2));
 }
 if (Math.abs(val - correctAns) < 0.05) setFeedback("correct");
 else setFeedback("incorrect");
 };

 const parabolaPath = useMemo(() => {
 let d = "";
 for (let x = -60; x <= 60; x += 1) {
  const y = (x * x) / (4 * p);
  if (y > 60) continue;
  d += `${d ? 'L' : 'M'} ${x} ${y} `;
 }
 return d;
 }, [p]);

 const hyperbolaPath = useMemo(() => {
 let d1 = "", d2 = "";
 for (let y = -60; y <= 60; y += 1) {
  const val = 1 + (y * y) / (b * b);
  if (val < 0) continue;
  const x = a * Math.sqrt(val);
  if (x > 60) continue;
  d1 += `${d1 ? 'L' : 'M'} ${x} ${y} `;
  d2 += `${d2 ? 'L' : 'M'} ${-x} ${y} `;
 }
 return { d1, d2 };
 }, [a, b]);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Lab M12.1: Advanced Conic Sections" />
  <div className="bg-blue-900 text-white p-2 flex justify-end shrink-0">
  <div className="flex bg-blue-800 rounded-lg p-1">
   {(['parabola', 'ellipse', 'hyperbola'] as const).map(type => (
   <button
    key={type}
    onClick={() => setConicType(type)}
    className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${conicType === type ? 'bg-slate-50 dark:bg-[#121212] text-blue-900 shadow' : 'text-blue-100 hover:bg-blue-700'}`}
   >
    {type}
   </button>
   ))}
  </div>
  </div>

  
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
  <main className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:min-h-0 overflow-y-auto lg:overflow-visible">
  {/* Theory Column */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 text-blue-700 mb-2">
   <BookOpen className="w-5 h-5" />
   <h2 className="text-lg font-bold">Theoretical Context</h2>
   </div>
   
   {conicType === 'parabola' && (
   <div className="text-sm text-slate-700 dark:text-[#ffffff] space-y-3">
    <p>A <strong>Parabola</strong> is the locus of a point equidistant from a focus and a directrix.</p>
    <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded text-center font-mono flex-col `}>
    {"$$x^2 = 4py$$"}
    </div>
    <p><strong>Applications:</strong> Parabolic antennas focus incoming parallel signals perfectly onto the focus point (0, p).</p>
    <ul className="list-disc pl-5 space-y-1">
    <li>Focus: (0, p)</li>
    <li>Directrix: y = -p</li>
    <li>Vertex: (0, 0)</li>
    </ul>
   </div>
   )}

   {conicType === 'ellipse' && (
   <div className="text-sm text-slate-700 dark:text-[#ffffff] space-y-3">
    <p>An <strong>Ellipse</strong> is the locus of a point where the sum of distances to two foci is constant.</p>
    <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded text-center font-mono flex-col `}>
    {"$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$$"}
    </div>
    <p><strong>Applications:</strong> Kepler's First Law states planetary orbits are ellipses with the Sun at one focus.</p>
    <ul className="list-disc pl-5 space-y-1">
    <li>Foci: (±c, 0) where c = √|a² - b²|</li>
    <li>Eccentricity: e = c / a</li>
    <li>Major Axis Length: 2a</li>
    </ul>
   </div>
   )}

   {conicType === 'hyperbola' && (
   <div className="text-sm text-slate-700 dark:text-[#ffffff] space-y-3">
    <p>A <strong>Hyperbola</strong> is the locus of a point where the difference of distances to two foci is constant.</p>
    <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded text-center font-mono flex-col `}>
    {"$$\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$$"}
    </div>
    <p><strong>Applications:</strong> Nuclear cooling towers use hyperboloid geometries for structural strength and natural updraft cooling efficiency.</p>
    <ul className="list-disc pl-5 space-y-1">
    <li>Foci: (±c, 0) where c = √(a² + b²)</li>
    <li>Vertices: (±a, 0)</li>
    <li>Asymptotes: y = ±(b/a)x</li>
    </ul>
   </div>
   )}
  </div>

  {/* Visualizer Column */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col gap-4 items-center justify-center relative overflow- ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] self-start absolute top-5 left-5 z-10">Live Simulation</h2>
   
   <svg viewBox="-60 -60 120 120" className="w-full max-w-md aspect-square bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg shadow-inner mt-8">
   <g transform="scale(1, -1)">
    {/* Axes */}
    <line x1="-60" y1="0" x2="60" y2="0" stroke="#cbd5e1" strokeWidth="0.5" />
    <line x1="0" y1="-60" x2="0" y2="60" stroke="#cbd5e1" strokeWidth="0.5" />
    
    {conicType === 'parabola' && (
    <>
     <path d={parabolaPath} fill="none" stroke="#2563eb" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
     <circle cx="0" cy={p} r="1.5" fill="#ef4444" />
     <line x1="-60" y1={-p} x2="60" y2={-p} stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" />
     
     {/* Signal beams hitting parabola and reflecting to focus */}
     <line x1="-20" y1="60" x2="-20" y2={400/(4*p)} stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="1,1" />
     <line x1="-20" y1={400/(4*p)} x2="0" y2={p} stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="1,1" />
     
     <line x1="20" y1="60" x2="20" y2={400/(4*p)} stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="1,1" />
     <line x1="20" y1={400/(4*p)} x2="0" y2={p} stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="1,1" />
    </>
    )}

    {conicType === 'ellipse' && (
    <>
     <ellipse cx="0" cy="0" rx={a} ry={b} fill="none" stroke="#2563eb" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
     {/* Foci */}
     {a >= b ? (
     <>
      <circle cx={Math.sqrt(a*a - b*b)} cy="0" r="1.5" fill="#ef4444" />
      <circle cx={-Math.sqrt(a*a - b*b)} cy="0" r="1.5" fill="#ef4444" />
     </>
     ) : (
     <>
      <circle cx="0" cy={Math.sqrt(b*b - a*a)} r="1.5" fill="#ef4444" />
      <circle cx="0" cy={-Math.sqrt(b*b - a*a)} r="1.5" fill="#ef4444" />
     </>
     )}
     {/* Planet */}
     <circle r="3" fill="#3b82f6">
     <animateMotion dur="5s" repeatCount="indefinite" path={`M ${a} 0 A ${a} ${b} 0 1 0 ${-a} 0 A ${a} ${b} 0 1 0 ${a} 0`} />
     </circle>
    </>
    )}

    {conicType === 'hyperbola' && (
    <>
     <path d={hyperbolaPath.d1} fill="none" stroke="#2563eb" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
     <path d={hyperbolaPath.d2} fill="none" stroke="#2563eb" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
     {/* Foci */}
     <circle cx={Math.sqrt(a*a + b*b)} cy="0" r="1.5" fill="#ef4444" />
     <circle cx={-Math.sqrt(a*a + b*b)} cy="0" r="1.5" fill="#ef4444" />
     {/* Asymptotes */}
     <line x1="-60" y1={-60 * (b/a)} x2="60" y2={60 * (b/a)} stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,2" />
     <line x1="-60" y1={60 * (b/a)} x2="60" y2={-60 * (b/a)} stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,2" />
    </>
    )}
   </g>
   </svg>
  </div>

  {/* Assessment Column */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col gap-4 lg: ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center gap-2 text-blue-700 mb-2 shrink-0">
   <Settings2 className="w-5 h-5" />
   <h2 className="text-lg font-bold">Parameters & Assessment</h2>
   </div>

   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] space-y-4 shrink-0">
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff]">Interactive Variables</h3>
   {conicType === 'parabola' && (
    <div>
    <label className="block text-sm text-slate-600 dark:text-[#a1a1aa] mb-1">Focus distance (p): {p}</label>
    <input type="range" min="1" max="20" step="0.5" value={p} onChange={e => setP(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
   )}
   {conicType !== 'parabola' && (
    <>
    <div>
     <label className="block text-sm text-slate-600 dark:text-[#a1a1aa] mb-1">Parameter a: {a}</label>
     <input type="range" min="2" max="30" step="1" value={a} onChange={e => setA(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    <div>
     <label className="block text-sm text-slate-600 dark:text-[#a1a1aa] mb-1">Parameter b: {b}</label>
     <input type="range" min="2" max="30" step="1" value={b} onChange={e => setB(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    </>
   )}
   </div>

   <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex-1 flex flex-col dark:bg-teal-950/20 dark:border-teal-900">
   <div className="flex items-center gap-2 text-blue-800 mb-3 shrink-0 dark:text-[#ffffff]">
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
     className="flex-1 min-w-0 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button 
     onClick={checkAnswer}
     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
     Verify
    </button>
    </div>

    {feedback === "correct" && (
    <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded border border-green-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
     <CheckCircle2 className="w-5 h-5 shrink-0" />
     <span className="font-medium text-sm">Excellent! Your calculation is correct.</span>
    </div>
    )}

    {feedback === "incorrect" && (
    <div className="flex items-center gap-2 text-red-700 bg-red-50 p-2 rounded border border-red-200">
     <XCircle className="w-5 h-5 shrink-0" />
     <span className="font-medium text-sm">Incorrect. Double-check your formula.</span>
    </div>
    )}

    <button 
    onClick={generateProblem}
    className="flex items-center justify-center gap-2 w-full text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors text-sm font-medium border border-transparent mt-2"
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
