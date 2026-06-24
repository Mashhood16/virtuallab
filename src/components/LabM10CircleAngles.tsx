import { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw, CheckCircle2, XCircle, Calculator, Info, Settings2, Target } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
  onExit?: () => void;
}

export default function LabM10CircleAngles({ onExit }: Props) {
  const [mode, setMode] = useState<'cyclic' | 'segment' | 'alternate'>('cyclic');
  const [angles, setAngles] = useState([
    Math.PI * 0.2,
    Math.PI * 0.7,
    Math.PI * 1.3,
    Math.PI * 1.8
  ]);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const center = { x: 200, y: 200 };
  const radius = 120;
  
  const getPt = useCallback((ang: number) => ({ 
    x: center.x + radius * Math.cos(ang), 
    y: center.y + radius * Math.sin(ang) 
  }), [center.x, center.y, radius]);
  
  const getAngleDeg = useCallback((p1: {x:number, y:number}, p2: {x:number, y:number}, p3: {x:number, y:number}) => {
    const a1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const a2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    let diff = Math.abs(a1 - a2);
    if (diff > Math.PI) diff = 2 * Math.PI - diff;
    return (diff * 180 / Math.PI).toFixed(1);
  }, []);

  const handlePointerDown = (e: React.PointerEvent, idx: number) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setIsDragging(idx);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging === null) return;
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    const newAng = Math.atan2(cursor.y - center.y, cursor.x - center.x);
    const newAngles = [...angles];
    newAngles[isDragging] = newAng >= 0 ? newAng : newAng + 2 * Math.PI;
    setAngles(newAngles);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as Element).releasePointerCapture(e.pointerId);
    setIsDragging(null);
  };

  // Sort values for consistent non-intersecting polygons when drawing edges
  const sortedValues = [...angles].sort((a, b) => a - b);
  const pts = sortedValues.map(getPt);

  // Assessment
  const [questionParams, setQuestionParams] = useState({ type: 'cyclic', given: 70, ans: 110 });
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct'|'incorrect'|null>(null);

  const generateQuestion = useCallback(() => {
    setUserAnswer('');
    setFeedback(null);
    const types = ['cyclic', 'segment', 'alternate'];
    const qType = types[Math.floor(Math.random() * types.length)];
    if (qType === 'cyclic') {
      const given = Math.floor(Math.random() * 80) + 50;
      setQuestionParams({ type: qType, given, ans: 180 - given });
    } else {
      const given = Math.floor(Math.random() * 60) + 30;
      setQuestionParams({ type: qType, given, ans: given });
    }
  }, []);

  useEffect(() => { generateQuestion(); }, [generateQuestion]);

  const checkAnswer = () => {
    const num = parseFloat(userAnswer);
    if (!isNaN(num) && Math.abs(num - questionParams.ans) < 0.1) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Lab: Circle Angles Theorems" />

      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" /> Theorems
            </h2>
            <div className="prose prose-slate text-sm space-y-3">
              <p><strong>1. Cyclic Quadrilateral:</strong> A quadrilateral inscribed in a circle. The opposite interior angles are supplementary (sum to 180°).</p>
              <p><strong>2. Angles in Same Segment:</strong> Angles subtended by the same arc at the circumference are equal.</p>
              <p><strong>3. Alternate Segment Theorem:</strong> The angle between a tangent and a chord through the point of contact is equal to the angle in the alternate segment.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-blue-500" /> Interactive Modes
            </h2>
            
            <div className="flex flex-col gap-2 p-1 bg-slate-100 rounded-lg mb-4">
              <button onClick={() => setMode('cyclic')} className={`py-2 text-sm font-medium rounded-md transition-all ${mode === 'cyclic' ? 'bg-slate-50 shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}>
                Cyclic Quadrilateral
              </button>
              <button onClick={() => setMode('segment')} className={`py-2 text-sm font-medium rounded-md transition-all ${mode === 'segment' ? 'bg-slate-50 shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}>
                Angles in Same Segment
              </button>
              <button onClick={() => setMode('alternate')} className={`py-2 text-sm font-medium rounded-md transition-all ${mode === 'alternate' ? 'bg-slate-50 shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}>
                Alternate Segment
              </button>
            </div>
            
            <p className="text-sm text-slate-600 italic">Drag the red points on the circle circumference to explore the theorems dynamically.</p>
          </div>
        </div>

        {/* Middle Column */}
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          <h2 className="absolute top-6 left-6 text-lg font-semibold text-slate-800 flex items-center gap-2 z-10">
            <Target className="w-5 h-5 text-indigo-500" /> Interactive Simulation
          </h2>

          <svg 
            ref={svgRef}
            viewBox="0 0 400 400" 
            className="w-full max-w-[400px] aspect-square border border-slate-200 rounded-lg bg-slate-50 touch-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <circle cx={center.x} cy={center.y} r={radius} fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
            <circle cx={center.x} cy={center.y} r={3} fill="#1e40af" />
            
            {mode === 'cyclic' && (
              <>
                <polygon 
                  points={pts.map(p => `${p.x},${p.y}`).join(' ')} 
                  fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" strokeWidth="2" 
                />
                <text x={pts[0].x > center.x ? pts[0].x+10 : pts[0].x-30} y={pts[0].y > center.y ? pts[0].y+20 : pts[0].y-10} className="text-xs font-bold">{getAngleDeg(pts[3], pts[0], pts[1])}°</text>
                <text x={pts[1].x > center.x ? pts[1].x+10 : pts[1].x-30} y={pts[1].y > center.y ? pts[1].y+20 : pts[1].y-10} className="text-xs font-bold">{getAngleDeg(pts[0], pts[1], pts[2])}°</text>
                <text x={pts[2].x > center.x ? pts[2].x+10 : pts[2].x-30} y={pts[2].y > center.y ? pts[2].y+20 : pts[2].y-10} className="text-xs font-bold text-red-600">{getAngleDeg(pts[1], pts[2], pts[3])}°</text>
                <text x={pts[3].x > center.x ? pts[3].x+10 : pts[3].x-30} y={pts[3].y > center.y ? pts[3].y+20 : pts[3].y-10} className="text-xs font-bold text-red-600">{getAngleDeg(pts[2], pts[3], pts[0])}°</text>
                
                <text x={10} y={350} className="text-sm fill-slate-700 font-medium">Opposite Angles Sum = 180°</text>
              </>
            )}

            {mode === 'segment' && (
              <>
                <line x1={pts[0].x} y1={pts[0].y} x2={pts[1].x} y2={pts[1].y} stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
                <line x1={pts[0].x} y1={pts[0].y} x2={pts[2].x} y2={pts[2].y} stroke="#3b82f6" strokeWidth="2" />
                <line x1={pts[1].x} y1={pts[1].y} x2={pts[2].x} y2={pts[2].y} stroke="#3b82f6" strokeWidth="2" />
                
                <line x1={pts[0].x} y1={pts[0].y} x2={pts[3].x} y2={pts[3].y} stroke="#10b981" strokeWidth="2" />
                <line x1={pts[1].x} y1={pts[1].y} x2={pts[3].x} y2={pts[3].y} stroke="#10b981" strokeWidth="2" />
                
                <text x={pts[2].x > center.x ? pts[2].x+10 : pts[2].x-30} y={pts[2].y > center.y ? pts[2].y+20 : pts[2].y-10} className="text-xs font-bold text-blue-600">{getAngleDeg(pts[0], pts[2], pts[1])}°</text>
                <text x={pts[3].x > center.x ? pts[3].x+10 : pts[3].x-30} y={pts[3].y > center.y ? pts[3].y+20 : pts[3].y-10} className="text-xs font-bold text-green-600">{getAngleDeg(pts[0], pts[3], pts[1])}°</text>
                
                <text x={10} y={350} className="text-sm fill-slate-700 font-medium">Angles in the same segment are equal</text>
              </>
            )}

            {mode === 'alternate' && (() => {
              const tx = Math.cos(sortedValues[0] + Math.PI/2);
              const ty = Math.sin(sortedValues[0] + Math.PI/2);
              const altAng = getAngleDeg(pts[0], pts[2], pts[1]);
              
              return (
                <>
                  <polygon points={`${pts[0].x},${pts[0].y} ${pts[1].x},${pts[1].y} ${pts[2].x},${pts[2].y}`} fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="2" />
                  
                  {/* Tangent at pts[0] */}
                  <line 
                    x1={pts[0].x - 150*tx} y1={pts[0].y - 150*ty} 
                    x2={pts[0].x + 150*tx} y2={pts[0].y + 150*ty} 
                    stroke="#ef4444" strokeWidth="2" 
                  />
                  
                  <text x={pts[2].x > center.x ? pts[2].x+10 : pts[2].x-30} y={pts[2].y > center.y ? pts[2].y+20 : pts[2].y-10} className="text-xs font-bold text-green-600">{altAng}°</text>
                  <text x={pts[0].x + 30*tx} y={pts[0].y + 30*ty} className="text-xs font-bold text-red-600">{altAng}°</text>
                  
                  <text x={10} y={350} className="text-sm fill-slate-700 font-medium">Angle between tangent and chord</text>
                  <text x={10} y={370} className="text-sm fill-slate-700 font-medium">= Angle in alternate segment</text>
                </>
              );
            })()}

            {/* Render drag handles on original angles so dragging doesn't jump randomly */}
            {angles.map((ang, idx) => {
              if (mode === 'alternate' && idx === 3) return null; // Hide 4th point in alternate mode
              const p = getPt(ang);
              return (
                <circle 
                  key={idx} cx={p.x} cy={p.y} r={8} fill="#ef4444" 
                  className="cursor-pointer hover:r-[10px] transition-all"
                  onPointerDown={(e) => handlePointerDown(e, idx)}
                />
              );
            })}
          </svg>
        </div>

        {/* Right Column */}
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-500" /> Assessment
          </h2>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <p className="text-sm text-slate-800 font-medium mb-4">
              {questionParams.type === 'cyclic' && 
                `In a cyclic quadrilateral ABCD, an interior angle is ${questionParams.given}°. What is the measure of the opposite interior angle?`
              }
              {questionParams.type === 'segment' && 
                `Two angles subtended by the same arc at the circumference are x° and ${questionParams.given}°. What is the value of x?`
              }
              {questionParams.type === 'alternate' && 
                `The angle between a tangent and a chord is ${questionParams.given}°. What is the angle subtended by this chord in the alternate segment?`
              }
            </p>
            
            <div className="flex gap-2">
              <input 
                type="number" 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter angle (°)"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={checkAnswer}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Check
              </button>
            </div>
            
            {feedback === 'correct' && (
              <div className="mt-3 p-2 bg-green-50 text-green-700 rounded-md flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> Correct! Great job.
              </div>
            )}
            {feedback === 'incorrect' && (
              <div className="mt-3 p-2 bg-red-50 text-red-700 rounded-md flex items-center gap-2 text-sm font-medium">
                <XCircle className="w-4 h-4" /> Incorrect. Try again!
              </div>
            )}
          </div>

          <button 
            onClick={generateQuestion}
            className="flex items-center justify-center gap-2 py-2 text-blue-600 border border-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Next Question
          </button>
        </div>
      </div>
    </div>
  );
}
