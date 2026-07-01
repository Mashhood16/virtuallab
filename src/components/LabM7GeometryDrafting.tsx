import { useState, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { ArrowLeft, Circle, Ruler, MapPin, Trash2, CheckCircle } from 'lucide-react';

type Point = { id: string; x: number; y: number };
type Line = { id: string; p1: string; p2: string };
type CircleType = { id: string; center: string; radius: number };

const SCALE = 40; // 1cm = 40px

const getIntersections = (circles: CircleType[], points: Point[]) => {
 const inters: { x: number; y: number }[] = [];
 for (let i = 0; i < circles.length; i++) {
 for (let j = i + 1; j < circles.length; j++) {
  const c1 = circles[i];
  const c2 = circles[j];
  const p1 = points.find((p) => p.id === c1.center);
  const p2 = points.find((p) => p.id === c2.center);
  if (!p1 || !p2) continue;
  
  const d = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  if (d > c1.radius + c2.radius || d < Math.abs(c1.radius - c2.radius) || d === 0) continue;
  
  const a = (c1.radius ** 2 - c2.radius ** 2 + d ** 2) / (2 * d);
  const hSq = c1.radius ** 2 - a ** 2;
  const h = Math.sqrt(Math.max(0, hSq));
  
  const x3 = p1.x + (a * (p2.x - p1.x)) / d;
  const y3 = p1.y + (a * (p2.y - p1.y)) / d;
  
  inters.push({
  x: x3 + (h * (p2.y - p1.y)) / d,
  y: y3 - (h * (p2.x - p1.x)) / d,
  });
  inters.push({
  x: x3 - (h * (p2.y - p1.y)) / d,
  y: y3 + (h * (p2.x - p1.x)) / d,
  });
 }
 }
 return inters;
};

export default function LabM7GeometryDrafting({ onExit }: { onExit?: () => void }) {
 const [points, setPoints] = useState<Point[]>([]);
 const [lines, setLines] = useState<Line[]>([]);
 const [circles, setCircles] = useState<CircleType[]>([]);
 const [tool, setTool] = useState<'point' | 'line' | 'compass'>('point');
 const [compassRadius, setCompassRadius] = useState<number>(4);
 const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
 
 const [ghostPoint, setGhostPoint] = useState<{ x: number; y: number } | null>(null);
 const [previewLineTarget, setPreviewLineTarget] = useState<{ x: number; y: number } | null>(null);

 const [questionStatus, setQuestionStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
 const [selectedAnswer, setSelectedAnswer] = useState<string>('');

 const svgRef = useRef<SVGSVGElement>(null);

 const handleMouseMove = (e: ReactMouseEvent<SVGSVGElement>) => {
 if (!svgRef.current) return;
 const rect = svgRef.current.getBoundingClientRect();
 const rawX = e.clientX - rect.left;
 const rawY = e.clientY - rect.top;

 const inters = getIntersections(circles, points);
 let bestDist = 15;
 let bestPoint = null;

 for (const pt of inters) {
  const d = Math.hypot(pt.x - rawX, pt.y - rawY);
  if (d < bestDist) {
  bestDist = d;
  bestPoint = pt;
  }
 }

 const snap = 10;
 const target = bestPoint || {
  x: Math.round(rawX / snap) * snap,
  y: Math.round(rawY / snap) * snap,
 };

 if (tool === 'point') {
  setGhostPoint(target);
  setPreviewLineTarget(null);
 } else if (tool === 'line' && selectedPoints.length === 1) {
  setGhostPoint(null);
  setPreviewLineTarget(target);
 } else {
  setGhostPoint(null);
  setPreviewLineTarget(null);
 }
 };

 const handleCanvasClick = () => {
 if (tool === 'point' && ghostPoint) {
  const letter = String.fromCharCode(65 + (points.length % 26));
  const suffix = points.length >= 26 ? Math.floor(points.length / 26) : '';
  const newId = `${letter}${suffix}`;
  setPoints([...points, { id: newId, x: ghostPoint.x, y: ghostPoint.y }]);
 } else if (tool === 'line') {
  setSelectedPoints([]);
 }
 };

 const handlePointClick = (e: ReactMouseEvent<SVGGElement>, id: string) => {
 e.stopPropagation();
 if (tool === 'line') {
  const newSelected = [...selectedPoints, id];
  if (newSelected.length === 2) {
  // Prevent duplicate lines
  const exists = lines.some(
   (l) => (l.p1 === newSelected[0] && l.p2 === newSelected[1]) || (l.p1 === newSelected[1] && l.p2 === newSelected[0])
  );
  if (!exists) {
   setLines([...lines, { id: `L${lines.length}`, p1: newSelected[0], p2: newSelected[1] }]);
  }
  setSelectedPoints([]);
  setPreviewLineTarget(null);
  } else {
  setSelectedPoints(newSelected);
  }
 } else if (tool === 'compass') {
  setCircles([...circles, { id: `C${circles.length}`, center: id, radius: compassRadius * SCALE }]);
 }
 };

 const clearCanvas = () => {
 setPoints([]);
 setLines([]);
 setCircles([]);
 setSelectedPoints([]);
 setQuestionStatus('idle');
 setSelectedAnswer('');
 };

 const checkAnswer = () => {
 if (selectedAnswer === 'Right-angled Scalene') {
  setQuestionStatus('correct');
 } else {
  setQuestionStatus('incorrect');
 }
 };

 const getDistance = (p1: Point, p2: Point) => (Math.hypot(p2.x - p1.x, p2.y - p1.y) / SCALE).toFixed(1);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <div className="flex items-center p-4 bg-rose-600 text-white shadow-md z-10">
  <button onClick={onExit} className="mr-4 hover:bg-rose-700 p-2 rounded-full transition-colors dark:text-white dark:text-white dark:bg-rose-600 dark:hover:bg-rose-500 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-rose-500/40">
   <ArrowLeft className="w-5 h-5" />
  </button>
  <h1 className="text-lg md:text-xl font-bold">Class 7 Maths: Practical Geometry</h1>
  </div>

  <div className="flex flex-1 overflow-hidden">
  {/* Left Column Controls */}
  <div className="w-1/3 p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b]">
   <div className="mb-6">
   <label className="block text-sm font-bold text-slate-700 dark:text-[#a1a1aa] mb-3">Select Drafting Tool</label>
   <div className="grid grid-cols-3 gap-2">
    <button
    onClick={() => {
     setTool('point');
     setSelectedPoints([]);
    }}
    className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${ tool === 'point' ? 'bg-rose-100 border-rose-500 text-rose-700 dark:bg-rose-900/50 dark:border-rose-400 dark:text-rose-300' : ' border-slate-200 dark:border-[#1c1b1b] hover:bg-slate-50 dark:hover:bg-slate-700' }`}
    >
    <MapPin className="w-6 h-6 mb-1" />
    <span className="text-xs font-medium">Point</span>
    </button>
    <button
    onClick={() => {
     setTool('line');
     setSelectedPoints([]);
    }}
    className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${ tool === 'line' ? 'bg-rose-100 border-rose-500 text-rose-700 dark:bg-rose-900/50 dark:border-rose-400 dark:text-rose-300' : ' border-slate-200 dark:border-[#1c1b1b] hover:bg-slate-50 dark:hover:bg-slate-700' }`}
    >
    <Ruler className="w-6 h-6 mb-1" />
    <span className="text-xs font-medium">Ruler</span>
    </button>
    <button
    onClick={() => {
     setTool('compass');
     setSelectedPoints([]);
    }}
    className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${ tool === 'compass' ? 'bg-rose-100 border-rose-500 text-rose-700 dark:bg-rose-900/50 dark:border-rose-400 dark:text-rose-300' : ' border-slate-200 dark:border-[#1c1b1b] hover:bg-slate-50 dark:hover:bg-slate-700' }`}
    >
    <Circle className="w-6 h-6 mb-1" />
    <span className="text-xs font-medium">Compass</span>
    </button>
   </div>
   </div>

   <div className="h-28 mb-6">
   {tool === 'compass' && (
    <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <label className="flex justify-between text-sm font-bold text-slate-700 dark:text-[#a1a1aa] mb-2">
     <span>Compass Radius</span>
     <span className="text-rose-600 dark:text-rose-400">{compassRadius.toFixed(1)} cm</span>
    </label>
    <input
     type="range"
     min="1"
     max="10"
     step="0.5"
     value={compassRadius}
     onChange={(e) => setCompassRadius(parseFloat(e.target.value))}
     className="w-full accent-rose-600"
    />
    <p className="text-xs text-slate-500 dark:text-[#71717a] mt-2">Click an existing point on the canvas to draw an arc.</p>
    </div>
   )}
   {tool === 'line' && (
    <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-[#1c1b1b] h-full flex items-center">
    <p className="text-sm text-slate-600 dark:text-[#71717a] font-medium">Click two points to connect them with a line segment.</p>
    </div>
   )}
   {tool === 'point' && (
    <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-[#1c1b1b] h-full flex items-center">
    <p className="text-sm text-slate-600 dark:text-[#71717a] font-medium">Click anywhere on the canvas or an intersection to place a point.</p>
    </div>
   )}
   </div>

   <div className="mb-6">
   <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-2">Measured Segments</h3>
   {lines.length === 0 ? (
    <p className="text-sm text-slate-500 italic">No lines drawn yet.</p>
   ) : (
    <ul className="text-sm space-y-1 bg-slate-50 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    {lines.map((l) => {
     const p1 = points.find((p) => p.id === l.p1);
     const p2 = points.find((p) => p.id === l.p2);
     if (!p1 || !p2) return null;
     return (
     <li key={l.id} className="flex justify-between font-mono">
      <span>{l.p1}{l.p2}</span>
      <span className="text-rose-600 dark:text-rose-400">{getDistance(p1, p2)} cm</span>
     </li>
     );
    })}
    </ul>
   )}
   </div>

   <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
   <h3 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2">Assessment Task</h3>
   <p className="text-sm text-slate-700 dark:text-[#a1a1aa] mb-4 leading-relaxed">
    Construct a triangle ABC with sides <b>5cm, 4cm, and 3cm</b>.<br />
    <span className="text-xs opacity-80">(Hint: Draw a 5cm line AB. Draw a 4cm circle from A, and a 3cm circle from B. Mark intersection C.)</span>
   </p>
   <div className="mb-4">
    <p className="font-medium text-sm text-slate-800 dark:text-[#ffffff] mb-2">Based on your construction, what type of triangle is it?</p>
    <div className="flex flex-col space-y-2 text-sm">
    {['Equilateral', 'Isosceles', 'Right-angled Scalene'].map((opt) => (
     <label key={opt} className="flex items-center space-x-2 cursor-pointer">
     <input
      type="radio"
      name="triangleType"
      value={opt}
      checked={selectedAnswer === opt}
      onChange={() => setSelectedAnswer(opt)}
      className="text-indigo-600 accent-indigo-600"
     />
     <span>{opt}</span>
     </label>
    ))}
    </div>
   </div>
   <button
    onClick={checkAnswer}
    disabled={!selectedAnswer}
    className="whitespace-nowrap flex-shrink-0 w-full bg-indigo-600 disabled:bg-slate-400 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    Check Answer
   </button>
   {questionStatus === 'correct' && (
    <p className="mt-3 text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center">
    <CheckCircle className="w-4 h-4 mr-1" /> Correct! 3² + 4² = 5²
    </p>
   )}
   {questionStatus === 'incorrect' && (
    <p className="mt-3 text-rose-600 dark:text-rose-400 text-sm font-bold">
    Incorrect. Try completing the construction!
    </p>
   )}
   </div>

   <button
   onClick={clearCanvas}
   className="w-full mt-6 flex justify-center items-center py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 rounded-lg transition-colors border border-rose-200 dark:border-rose-800"
   >
   <Trash2 className="w-4 h-4 mr-2" /> Clear Canvas
   </button>
  </div>

  {/* Right Column Stage */}
  <div className="w-2/3 p-6 flex flex-col items-center justify-center bg-slate-100 dark:bg-[#121212]">
   <svg
   ref={svgRef}
   className={`w-full h-full rounded-xl shadow-inner border border-slate-300 dark:border-slate-600 ${ tool === 'point' ? 'cursor-crosshair' : 'cursor-default' }`}
   onMouseMove={handleMouseMove}
   onMouseLeave={() => {
    setGhostPoint(null);
    setPreviewLineTarget(null);
   }}
   onClick={handleCanvasClick}
   >
   <defs>
    <pattern id="grid" width={SCALE} height={SCALE} patternUnits="userSpaceOnUse">
    <path d={`M ${SCALE} 0 L 0 0 0 ${SCALE}`} fill="none" stroke="currentColor" className="text-slate-900 dark:text-[#ffffff]" strokeOpacity={0.1} strokeWidth="1" />
    </pattern>
    <pattern id="subgrid" width={SCALE / 4} height={SCALE / 4} patternUnits="userSpaceOnUse">
    <path d={`M ${SCALE / 4} 0 L 0 0 0 ${SCALE / 4}`} fill="none" stroke="currentColor" className="text-slate-900 dark:text-[#ffffff]" strokeOpacity={0.04} strokeWidth="0.5" />
    </pattern>
   </defs>
   <rect width="100%" height="100%" fill="url(#subgrid)" />
   <rect width="100%" height="100%" fill="url(#grid)" />

   {/* Circles */}
   {circles.map((c) => {
    const p = points.find((pt) => pt.id === c.center);
    if (!p) return null;
    return (
    <circle
     key={c.id}
     cx={p.x}
     cy={p.y}
     r={c.radius}
     fill="none"
     stroke="currentColor"
     className="text-indigo-500 dark:text-indigo-400 opacity-60 pointer-events-none"
     strokeWidth="1.5"
    />
    );
   })}

   {/* Lines */}
   {lines.map((l) => {
    const p1 = points.find((p) => p.id === l.p1);
    const p2 = points.find((p) => p.id === l.p2);
    if (!p1 || !p2) return null;
    return (
    <g key={l.id} className="pointer-events-none">
     <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="currentColor" className="text-slate-800 dark:text-[#ffffff]" strokeWidth="2.5" />
     <rect x={(p1.x + p2.x) / 2 - 15} y={(p1.y + p2.y) / 2 - 18} width="30" height="16" fill="white" className="dark:fill-slate-800 opacity-80" rx="4" />
     <text x={(p1.x + p2.x) / 2} y={(p1.y + p2.y) / 2 - 6} textAnchor="middle" fill="currentColor" className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
     {getDistance(p1, p2)}
     </text>
    </g>
    );
   })}

   {/* Preview Line */}
   {tool === 'line' && selectedPoints.length === 1 && previewLineTarget && (
    <g className="pointer-events-none opacity-50">
    {(() => {
     const p1 = points.find((p) => p.id === selectedPoints[0]);
     if (!p1) return null;
     const dist = (Math.hypot(previewLineTarget.x - p1.x, previewLineTarget.y - p1.y) / SCALE).toFixed(1);
     return (
     <>
      <line x1={p1.x} y1={p1.y} x2={previewLineTarget.x} y2={previewLineTarget.y} stroke="currentColor" className="text-slate-800 dark:text-[#ffffff]" strokeWidth="2" strokeDasharray="4 4" />
      <text x={(p1.x + previewLineTarget.x) / 2} y={(p1.y + previewLineTarget.y) / 2 - 10} textAnchor="middle" fill="currentColor" className="text-xs text-slate-500">
      {dist} cm
      </text>
     </>
     );
    })()}
    </g>
   )}

   {/* Points */}
   {points.map((p) => {
    const isSelected = selectedPoints.includes(p.id);
    return (
    <g key={p.id} onClick={(e) => handlePointClick(e, p.id)} className="cursor-pointer group">
     <circle
     cx={p.x}
     cy={p.y}
     r={isSelected ? 8 : 6}
     fill="currentColor"
     className={`transition-all ${isSelected ? 'text-amber-500' : 'text-rose-600 dark:text-rose-500 group-hover:text-rose-500'}`}
     />
     <circle cx={p.x} cy={p.y} r={16} fill="transparent" /> {/* Hitbox */}
     <text
     x={p.x + 12}
     y={p.y - 12}
     fill="currentColor"
     className="text-sm font-bold text-slate-800 dark:text-[#ffffff] select-none pointer-events-none"
     >
     {p.id}
     </text>
    </g>
    );
   })}

   {/* Ghost Point */}
   {tool === 'point' && ghostPoint && (
    <circle
    cx={ghostPoint.x}
    cy={ghostPoint.y}
    r={5}
    fill="none"
    stroke="currentColor"
    className="text-rose-500 opacity-60 pointer-events-none"
    strokeWidth="2"
    strokeDasharray="2 2"
    />
   )}
   </svg>
  </div>
  </div>
 </div>
 );
}
