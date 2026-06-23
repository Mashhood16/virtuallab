import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle2, XCircle, Calculator, Crosshair, Info, Settings2 } from 'lucide-react';

interface Props {
  onExit?: () => void;
}

export default function LabM10TangentProperties({ onExit }: Props) {
  const [mode, setMode] = useState<'tangent' | 'touching'>('tangent');
  const [angleP, setAngleP] = useState<number>(Math.PI / 4);
  const [c2, setC2] = useState({ x: 320, y: 200 });
  const [r1, setR1] = useState(80);
  const [r2, setR2] = useState(50);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);

  const c1 = { x: 200, y: 200 };
  const distCenters = Math.hypot(c2.x - c1.x, c2.y - c1.y);

  // Assessment
  const [questionParams, setQuestionParams] = useState({ r: 5, d: 13, ans: 12, type: 'pythagoras' });
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct'|'incorrect'|null>(null);

  const generateQuestion = useCallback(() => {
    setUserAnswer('');
    setFeedback(null);
    const types = ['pythagoras', 'ext_touch', 'int_touch'];
    const type = types[Math.floor(Math.random() * types.length)];
    if (type === 'pythagoras') {
      const triples = [[3,4,5], [5,12,13], [8,15,17], [7,24,25]];
      const t = triples[Math.floor(Math.random() * triples.length)];
      setQuestionParams({ r: t[0], d: t[2], ans: t[1], type });
    } else if (type === 'ext_touch') {
      const R1 = Math.floor(Math.random() * 10) + 5;
      const R2 = Math.floor(Math.random() * 8) + 3;
      setQuestionParams({ r: R1, d: R2, ans: R1 + R2, type });
    } else {
      const R1 = Math.floor(Math.random() * 10) + 10;
      const R2 = Math.floor(Math.random() * 5) + 3;
      setQuestionParams({ r: R1, d: R2, ans: R1 - R2, type });
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

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setIsDragging(id);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    if (isDragging === 'P') {
      setAngleP(Math.atan2(cursor.y - c1.y, cursor.x - c1.x));
    } else if (isDragging === 'C2') {
      let nx = cursor.x;
      let ny = cursor.y;
      const d = Math.hypot(nx - c1.x, ny - c1.y);
      if (Math.abs(d - (r1 + r2)) < 15) {
        nx = c1.x + (nx - c1.x) / d * (r1 + r2);
        ny = c1.y + (ny - c1.y) / d * (r1 + r2);
      } else if (Math.abs(d - Math.abs(r1 - r2)) < 15) {
        nx = c1.x + (nx - c1.x) / d * Math.abs(r1 - r2);
        ny = c1.y + (ny - c1.y) / d * Math.abs(r1 - r2);
      }
      setC2({ x: nx, y: ny });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as Element).releasePointerCapture(e.pointerId);
    setIsDragging(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Lab: Tangent & Circle Properties</h1>
        </div>
      </div>

      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Theory & Setup */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" /> Theory
            </h2>
            <div className="prose prose-slate text-sm">
              <p><strong>1. Tangent Perpendicularity:</strong> A tangent to a circle is perpendicular to the radius at the point of tangency. This creates a right-angled triangle between the radius, tangent, and any secant line to the center.</p>
              <p><strong>2. Touching Circles:</strong> If two circles touch externally, the distance between their centers is <code className="bg-slate-100 px-1 rounded">R₁ + R₂</code>. If they touch internally, the distance is <code className="bg-slate-100 px-1 rounded">|R₁ - R₂|</code>.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-blue-500" /> Simulation Controls
            </h2>
            
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mb-6">
              <button 
                onClick={() => setMode('tangent')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'tangent' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}
              >
                Tangent to Radius
              </button>
              <button 
                onClick={() => setMode('touching')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'touching' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}
              >
                Touching Circles
              </button>
            </div>

            {mode === 'touching' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Circle 1 Radius ({r1})</label>
                  <input type="range" min="30" max="120" value={r1} onChange={e => setR1(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Circle 2 Radius ({r2})</label>
                  <input type="range" min="30" max="120" value={r2} onChange={e => setR2(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
            )}
            {mode === 'tangent' && (
              <p className="text-sm text-slate-600 italic">Drag the red point on the circle circumference to see the tangent adjust dynamically.</p>
            )}
          </div>
        </div>

        {/* Middle Column: Interactive Canvas */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          <h2 className="absolute top-6 left-6 text-lg font-semibold text-slate-800 flex items-center gap-2 z-10">
            <Crosshair className="w-5 h-5 text-indigo-500" /> Interactive Simulation
          </h2>

          <svg 
            ref={svgRef}
            viewBox="0 0 400 400" 
            className="w-full max-w-[400px] aspect-square border border-slate-200 rounded-lg bg-slate-50 touch-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Grid */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {mode === 'tangent' && (() => {
              const px = c1.x + r1 * Math.cos(angleP);
              const py = c1.y + r1 * Math.sin(angleP);
              const tx = Math.cos(angleP + Math.PI/2);
              const ty = Math.sin(angleP + Math.PI/2);
              
              return (
                <>
                  <circle cx={c1.x} cy={c1.y} r={r1} fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx={c1.x} cy={c1.y} r={3} fill="#1e40af" />
                  
                  {/* Radius */}
                  <line x1={c1.x} y1={c1.y} x2={px} y2={py} stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
                  
                  {/* Tangent */}
                  <line 
                    x1={px - 200*tx} y1={py - 200*ty} 
                    x2={px + 200*tx} y2={py + 200*ty} 
                    stroke="#ef4444" strokeWidth="2" 
                  />

                  {/* Right angle marker */}
                  <path 
                    d={`M ${px - 15*Math.cos(angleP)} ${py - 15*Math.sin(angleP)} 
                        L ${px - 15*Math.cos(angleP) + 15*tx} ${py - 15*Math.sin(angleP) + 15*ty}
                        L ${px + 15*tx} ${py + 15*ty}`} 
                    fill="none" stroke="#ef4444" strokeWidth="2" 
                  />

                  {/* Drag Handle */}
                  <circle 
                    cx={px} cy={py} r={8} fill="#ef4444" 
                    className="cursor-pointer hover:r-[10px] transition-all"
                    onPointerDown={(e) => handlePointerDown(e, 'P')}
                  />
                  
                  <text x={c1.x - 15} y={c1.y + 15} className="text-xs fill-slate-600 font-bold">O</text>
                  <text x={px + 10} y={py + 10} className="text-xs fill-slate-600 font-bold">P</text>
                  <text x={10} y={350} className="text-sm fill-slate-700 font-medium">Radius ⊥ Tangent</text>
                  <text x={10} y={370} className="text-sm fill-slate-700 font-medium">Angle = 90°</text>
                </>
              );
            })()}

            {mode === 'touching' && (() => {
              const isExt = Math.abs(distCenters - (r1 + r2)) < 2;
              const isInt = Math.abs(distCenters - Math.abs(r1 - r2)) < 2;
              
              return (
                <>
                  <circle cx={c1.x} cy={c1.y} r={r1} fill="transparent" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx={c1.x} cy={c1.y} r={3} fill="#1e40af" />
                  
                  <circle cx={c2.x} cy={c2.y} r={r2} fill="transparent" stroke="#ef4444" strokeWidth="2" />
                  
                  {/* Line between centers */}
                  <line x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y} stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
                  
                  {/* Center drag handle */}
                  <circle 
                    cx={c2.x} cy={c2.y} r={8} fill="#ef4444" 
                    className="cursor-move hover:r-[10px] transition-all"
                    onPointerDown={(e) => handlePointerDown(e, 'C2')}
                  />
                  
                  <text x={10} y={330} className="text-sm fill-slate-700 font-medium">Distance (d) = {distCenters.toFixed(1)}</text>
                  <text x={10} y={350} className="text-sm fill-slate-700 font-medium">R₁ + R₂ = {r1 + r2}</text>
                  <text x={10} y={370} className="text-sm fill-slate-700 font-medium">|R₁ - R₂| = {Math.abs(r1 - r2)}</text>
                  
                  {isExt && <text x={200} y={380} textAnchor="middle" className="text-sm fill-green-600 font-bold">Touches Externally (d = R₁ + R₂)</text>}
                  {isInt && <text x={200} y={380} textAnchor="middle" className="text-sm fill-orange-600 font-bold">Touches Internally (d = |R₁ - R₂|)</text>}
                </>
              );
            })()}
          </svg>
        </div>

        {/* Right Column: Assessment */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-500" /> Assessment
          </h2>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <p className="text-sm text-slate-800 font-medium mb-4">
              {questionParams.type === 'pythagoras' && 
                `A point P is ${questionParams.d} cm away from the center of a circle. If the radius is ${questionParams.r} cm, find the length of the tangent from P to the circle.`
              }
              {questionParams.type === 'ext_touch' && 
                `Two circles of radii ${questionParams.r} cm and ${questionParams.d} cm touch externally. What is the distance between their centers?`
              }
              {questionParams.type === 'int_touch' && 
                `Two circles of radii ${questionParams.r} cm and ${questionParams.d} cm touch internally. What is the distance between their centers?`
              }
            </p>
            
            <div className="flex gap-2">
              <input 
                type="number" 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter answer (cm)"
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
