import { useState, useRef } from 'react';
import type { PointerEvent } from 'react';
import {BookOpen, CheckCircle, RefreshCw } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit?: () => void;
}

const questions = [
 { q: "Chords PQ and RS are equal in length. PQ is 12 cm from the center. How far is RS from the center?", a: "12", hint: "Equal chords are equidistant from the center." },
 { q: "Chords AB and CD are equidistant from the center. If AB = 15 cm, what is the length of CD?", a: "15", hint: "Chords equidistant from the center are equal in length." },
 { q: "Chord EF subtends an angle of 60° at the center. Chord GH is equal in length to EF. What angle does GH subtend at the center?", a: "60", hint: "Equal chords subtend equal angles at the center." }
];

export default function LabM10EqualChords({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const svgRef = useRef<SVGSVGElement>(null);
 const [dragged, setDragged] = useState<'A'|'B'|'C'|'D'|null>(null);
 const [angles, setAngles] = useState({ A: 0.5, B: 2.0, C: 3.5, D: 5.0 });

 const R = 150;
 const origin = { x: 250, y: 250 };

 const toSvg = (angle: number) => ({
 x: origin.x + R * Math.cos(angle),
 y: origin.y - R * Math.sin(angle)
 });

 const handlePointerDown = (pt: 'A'|'B'|'C'|'D') => setDragged(pt);
 const handlePointerMove = (e: PointerEvent<SVGSVGElement>) => {
 if (!dragged || !svgRef.current) return;
 const rect = svgRef.current.getBoundingClientRect();
 const mathX = e.clientX - rect.left - origin.x;
 const mathY = -(e.clientY - rect.top - origin.y);
 let ang = Math.atan2(mathY, mathX);
 if (ang < 0) ang += 2 * Math.PI;
 
 setAngles(prev => ({ ...prev, [dragged]: ang }));
 };
 const handlePointerUp = () => setDragged(null);

 const ptA = toSvg(angles.A);
 const ptB = toSvg(angles.B);
 const ptC = toSvg(angles.C);
 const ptD = toSvg(angles.D);

 const lenAB = 2 * R * Math.abs(Math.sin((angles.A - angles.B) / 2));
 const distAB = R * Math.abs(Math.cos((angles.A - angles.B) / 2));
 let angAB = Math.abs(angles.A - angles.B) * 180 / Math.PI;
 if (angAB > 180) angAB = 360 - angAB;

 const lenCD = 2 * R * Math.abs(Math.sin((angles.C - angles.D) / 2));
 const distCD = R * Math.abs(Math.cos((angles.C - angles.D) / 2));
 let angCD = Math.abs(angles.C - angles.D) * 180 / Math.PI;
 if (angCD > 180) angCD = 360 - angCD;

 const drawSector = (a1: number, a2: number, color: string) => {
 let start = a1;
 let end = a2;
 let diff = end - start;
 
 while (diff <= -Math.PI) diff += 2 * Math.PI;
 while (diff > Math.PI) diff -= 2 * Math.PI;
 
 if (diff < 0) {
  start = a2;
  end = a1;
  diff = -diff;
 }
 
 const p1 = toSvg(start);
 const p2 = toSvg(start + diff);
 return (
  <path d={`M ${origin.x} ${origin.y} L ${p1.x} ${p1.y} A ${R} ${R} 0 0 0 ${p2.x} ${p2.y} Z`} fill={color} opacity="0.15" />
 );
 };

 // Quiz State
 const [quizIdx, setQuizIdx] = useState(0);
 const [ans, setAns] = useState('');
 const [feedback, setFeedback] = useState('');

 const nextQuestion = () => {
 setQuizIdx((prev) => (prev + 1) % questions.length);
 setAns('');
 setFeedback('');
 };

 const handleCheckQuiz = () => {
 const numericAns = parseFloat(ans);
 if (isNaN(numericAns)) {
  setFeedback('Please enter a valid number.');
  return;
 }
 if (Math.abs(numericAns - parseFloat(questions[quizIdx].a)) < 0.1) {
  setFeedback('Correct! Well done.');
 } else {
  setFeedback(`Incorrect. Hint: ${questions[quizIdx].hint}`);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Lab M10: Equal Chords" />

  
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
  <div className="lg:flex-1 min-w-0 p-4 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 max-w-7xl mx-auto w-full overflow-y-auto lg:overflow-visible">
  {/* Left Column: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <BookOpen className="w-5 h-5 text-blue-600" />
   Theory & Concepts
   </h2>
   <div className="space-y-4 text-slate-600 dark:text-[#a1a1aa] text-sm">
   <p>
    In geometry, chords of a circle have fascinating properties relating their length, their distance from the center, and the angle they subtend at the center.
   </p>
   <div className={`bg-amber-50 p-4 rounded-lg border border-amber-100 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    <h3 className="font-semibold text-amber-800 mb-2 dark:text-[#ffffff]">Key Properties of Equal Chords</h3>
    <ul className="list-disc pl-5 space-y-2 text-amber-700">
    <li>
     <strong>Equidistant:</strong> Equal chords of a circle are equidistant from the center. (And conversely, chords that are equidistant from the center are equal in length).
    </li>
    <li>
     <strong>Equal Angles:</strong> Equal chords subtend equal angles at the center of the circle.
    </li>
    </ul>
   </div>
   <p>
    Use the interactive canvas to verify these properties experimentally. Try dragging the points until the lengths of the two chords match exactly, and observe their distance to the center and their central angles!
   </p>
   </div>
  </div>

  {/* Middle Column: Interactive Lab */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] overflow- relative flex flex-col lg:h-[500px]  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="p-4 bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b]">
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] text-center">Interactive Canvas</h3>
   <p className="text-xs text-slate-500 dark:text-[#71717a] text-center">Drag points A, B, C, D to change the chords.</p>
   </div>
   <div className="flex-1 min-w-0 relative">
   <svg 
    ref={svgRef} 
    className="w-full h-full touch-none" 
    viewBox="0 0 500 500"
    onPointerMove={handlePointerMove} 
    onPointerUp={handlePointerUp} 
    onPointerLeave={handlePointerUp}
   >
    <circle cx={origin.x} cy={origin.y} r={R} fill="none" stroke="#94a3b8" strokeWidth="2" />
    <circle cx={origin.x} cy={origin.y} r={4} fill="#475569" />

    {/* Sectors */}
    {drawSector(angles.A, angles.B, "#3b82f6")}
    {drawSector(angles.C, angles.D, "#ef4444")}

    {/* Distances to center */}
    <line x1={origin.x} y1={origin.y} x2={(ptA.x+ptB.x)/2} y2={(ptA.y+ptB.y)/2} stroke="#3b82f6" strokeDasharray="4,4" strokeWidth="2" />
    <line x1={origin.x} y1={origin.y} x2={(ptC.x+ptD.x)/2} y2={(ptC.y+ptD.y)/2} stroke="#ef4444" strokeDasharray="4,4" strokeWidth="2" />

    {/* Chords */}
    <line x1={ptA.x} y1={ptA.y} x2={ptB.x} y2={ptB.y} stroke="#3b82f6" strokeWidth="3" />
    <line x1={ptC.x} y1={ptC.y} x2={ptD.x} y2={ptD.y} stroke="#ef4444" strokeWidth="3" />

    {/* Draggable Points */}
    <g className="cursor-pointer" onPointerDown={() => handlePointerDown('A')}>
    <circle cx={ptA.x} cy={ptA.y} r={10} fill="#3b82f6" />
    <text x={ptA.x + 12} y={ptA.y - 12} fontSize="14" fill="#3b82f6" fontWeight="bold">A</text>
    </g>
    <g className="cursor-pointer" onPointerDown={() => handlePointerDown('B')}>
    <circle cx={ptB.x} cy={ptB.y} r={10} fill="#3b82f6" />
    <text x={ptB.x + 12} y={ptB.y - 12} fontSize="14" fill="#3b82f6" fontWeight="bold">B</text>
    </g>
    <g className="cursor-pointer" onPointerDown={() => handlePointerDown('C')}>
    <circle cx={ptC.x} cy={ptC.y} r={10} fill="#ef4444" />
    <text x={ptC.x + 12} y={ptC.y - 12} fontSize="14" fill="#ef4444" fontWeight="bold">C</text>
    </g>
    <g className="cursor-pointer" onPointerDown={() => handlePointerDown('D')}>
    <circle cx={ptD.x} cy={ptD.y} r={10} fill="#ef4444" />
    <text x={ptD.x + 12} y={ptD.y - 12} fontSize="14" fill="#ef4444" fontWeight="bold">D</text>
    </g>
   </svg>

   {/* Floating Info Panels */}
   <div className="absolute top-4 left-4 bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212]/90 p-3 rounded-lg border border-blue-200 shadow-sm pointer-events-none text-xs w-48 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    <div className="font-bold text-blue-700 mb-1 border-b border-blue-100 pb-1">Chord AB</div>
    <div className="flex justify-between text-slate-600 dark:text-[#a1a1aa]"><span>Length:</span> <span className="font-semibold">{lenAB.toFixed(0)} px</span></div>
    <div className="flex justify-between text-slate-600 dark:text-[#a1a1aa]"><span>Distance to Center:</span> <span className="font-semibold">{distAB.toFixed(0)} px</span></div>
    <div className="flex justify-between text-slate-600 dark:text-[#a1a1aa]"><span>Central Angle:</span> <span className="font-semibold">{angAB.toFixed(0)}°</span></div>
   </div>

   <div className="absolute top-4 right-4 bg-slate-50 dark:bg-[#121212]/90 p-3 rounded-lg border border-red-200 shadow-sm pointer-events-none text-xs w-48">
    <div className="font-bold text-red-700 mb-1 border-b border-red-100 pb-1">Chord CD</div>
    <div className="flex justify-between text-slate-600 dark:text-[#a1a1aa]"><span>Length:</span> <span className="font-semibold">{lenCD.toFixed(0)} px</span></div>
    <div className="flex justify-between text-slate-600 dark:text-[#a1a1aa]"><span>Distance to Center:</span> <span className="font-semibold">{distCD.toFixed(0)} px</span></div>
    <div className="flex justify-between text-slate-600 dark:text-[#a1a1aa]"><span>Central Angle:</span> <span className="font-semibold">{angCD.toFixed(0)}°</span></div>
   </div>
   
   {Math.abs(lenAB - lenCD) < 2 && (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold text-sm shadow-md border border-green-300 whitespace-nowrap dark:text-[#ffffff]">
    🎉 Chords are Equal! Notice the distances and angles.
    </div>
   )}
   </div>
  </div>

  {/* Right Column: Assessment */}
  <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
   <div className="flex items-center justify-between mb-4">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <CheckCircle className="w-5 h-5 text-green-600" />
    Assessment
   </h2>
   <button onClick={nextQuestion} className="p-2 hover:bg-slate-100 dark:bg-[#121212] rounded-full transition-colors" title="Next Question">
    <RefreshCw className="w-4 h-4 text-slate-600 dark:text-[#a1a1aa]" />
   </button>
   </div>
   
   <div className="space-y-4">
   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-100">
    <p className="text-sm font-semibold text-slate-800 dark:text-[#ffffff] mb-4 leading-relaxed">
    {questions[quizIdx].q}
    </p>
    <div className="flex items-center gap-2">
    <input 
     type="number" 
     value={ans}
     onChange={(e) => setAns(e.target.value)}
     className="border border-slate-300 dark:border-[#1c1b1b] rounded px-3 py-2 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
     placeholder="Value..."
    />
    </div>
    <button 
    onClick={handleCheckQuiz}
    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors text-sm dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
    Check Answer
    </button>
   </div>
   
   {feedback && (
    <div className={`p-3 rounded-lg text-sm font-medium ${feedback.includes('Correct') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
    {feedback}
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
