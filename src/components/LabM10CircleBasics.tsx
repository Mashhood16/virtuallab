import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle2, XCircle, Calculator, Info, Settings2, Compass, Play } from 'lucide-react';

interface Props {
  onExit?: () => void;
}

export default function LabM10CircleBasics({ onExit }: Props) {
  const [mode, setMode] = useState<'construction' | 'chord'>('construction');
  const svgRef = useRef<SVGSVGElement>(null);

  // Mode 1: Construction State
  const [pts, setPts] = useState([
    { x: 120, y: 220 },
    { x: 200, y: 80 },
    { x: 280, y: 150 }
  ]);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [step, setStep] = useState(0);

  // Construction math
  const A = pts[0], B = pts[1], C = pts[2];
  const D = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
  const hasCenter = Math.abs(D) > 0.1;
  const ux = hasCenter ? ((A.x*A.x + A.y*A.y) * (B.y - C.y) + (B.x*B.x + B.y*B.y) * (C.y - A.y) + (C.x*C.x + C.y*C.y) * (A.y - B.y)) / D : 0;
  const uy = hasCenter ? ((A.x*A.x + A.y*A.y) * (C.x - B.x) + (B.x*B.x + B.y*B.y) * (A.x - C.x) + (C.x*C.x + C.y*C.y) * (B.x - A.x)) / D : 0;
  const center = { x: ux, y: uy };
  const radius = hasCenter ? Math.hypot(A.x - center.x, A.y - center.y) : 0;

  // Mode 2: Chord State
  const [chordY, setChordY] = useState(260);
  const [isDraggingChord, setIsDraggingChord] = useState(false);
  
  const cRadius = 120;
  const cCenter = { x: 200, y: 200 };
  const dy = chordY - cCenter.y;
  const halfX = Math.sqrt(Math.max(0, cRadius*cRadius - dy*dy));

  // Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent, idx: number | 'chord') => {
    (e.target as Element).setPointerCapture(e.pointerId);
    if (idx === 'chord') {
      setIsDraggingChord(true);
    } else {
      setIsDragging(idx);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    if (isDragging !== null) {
      const newPts = [...pts];
      newPts[isDragging] = { x: cursor.x, y: cursor.y };
      setPts(newPts);
    } else if (isDraggingChord) {
      // limit Y so it stays within the circle
      const newY = Math.max(cCenter.y - cRadius, Math.min(cCenter.y + cRadius, cursor.y));
      setChordY(newY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as Element).releasePointerCapture(e.pointerId);
    setIsDragging(null);
    setIsDraggingChord(false);
  };

  // Assessment
  const [questionParams, setQuestionParams] = useState({ type: 'find_d', given: { L: 8, r: 5, d: 3 }, ans: 3 });
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct'|'incorrect'|null>(null);

  const generateQuestion = useCallback(() => {
    setUserAnswer('');
    setFeedback(null);
    const types = ['find_d', 'find_r', 'find_L'];
    const type = types[Math.floor(Math.random() * types.length)];
    const triples = [[3,4,5], [5,12,13], [6,8,10], [8,15,17]];
    const t = triples[Math.floor(Math.random() * triples.length)];
    const d = t[0], x = t[1], r = t[2];
    
    if (type === 'find_d') {
      setQuestionParams({ type, given: { L: x*2, r, d }, ans: d });
    } else if (type === 'find_r') {
      setQuestionParams({ type, given: { L: x*2, d, r }, ans: r });
    } else {
      setQuestionParams({ type, given: { r, d, L: x*2 }, ans: x*2 });
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
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Lab: Circle Basics & Construction</h1>
        </div>
      </div>

      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" /> Concepts
            </h2>
            <div className="prose prose-slate text-sm space-y-3">
              <p><strong>1. Finding the Center:</strong> The perpendicular bisector of any chord passes through the center. Using 3 points on an arc, we can find the center by drawing bisectors of two chords.</p>
              <p><strong>2. Distance to Chord:</strong> The perpendicular from the center to a chord bisects the chord. This forms a right triangle where <code className="bg-slate-100 px-1 rounded">d² + (L/2)² = r²</code>.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-blue-500" /> Interactive Modes
            </h2>
            
            <div className="flex flex-col gap-2 p-1 bg-slate-100 rounded-lg mb-4">
              <button 
                onClick={() => { setMode('construction'); setStep(0); }} 
                className={`py-2 text-sm font-medium rounded-md transition-all ${mode === 'construction' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}
              >
                Find Center & Circle
              </button>
              <button 
                onClick={() => setMode('chord')} 
                className={`py-2 text-sm font-medium rounded-md transition-all ${mode === 'chord' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}
              >
                Chord Distance Properties
              </button>
            </div>

            {mode === 'construction' && (
              <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Construction Steps</span>
                  <button onClick={() => setStep(0)} className="text-xs text-blue-600 hover:underline">Reset</button>
                </div>
                <div className="space-y-2">
                  <div className={`text-sm flex items-center gap-2 ${step >= 1 ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>1</div>
                    Draw Chords AB and BC
                  </div>
                  <div className={`text-sm flex items-center gap-2 ${step >= 2 ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>2</div>
                    Perpendicular Bisectors
                  </div>
                  <div className={`text-sm flex items-center gap-2 ${step >= 3 ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>3</div>
                    Locate Center & Draw Circle
                  </div>
                </div>
                {step < 3 && (
                  <button 
                    onClick={() => setStep(s => s + 1)}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Play className="w-4 h-4" /> Next Step
                  </button>
                )}
              </div>
            )}
            
            {mode === 'chord' && (
              <p className="text-sm text-slate-600 italic">Drag the horizontal chord up and down to observe the relationship between distance to center, chord length, and radius.</p>
            )}
          </div>
        </div>

        {/* Middle Column */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          <h2 className="absolute top-6 left-6 text-lg font-semibold text-slate-800 flex items-center gap-2 z-10">
            <Compass className="w-5 h-5 text-indigo-500" /> Interactive Canvas
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

            {mode === 'construction' && (
              <>
                {step >= 1 && (
                  <>
                    <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#64748b" strokeWidth="2" />
                    <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke="#64748b" strokeWidth="2" />
                  </>
                )}
                
                {step >= 2 && hasCenter && (
                  <>
                    <line 
                      x1={(A.x+B.x)/2 - 500*(A.y-B.y)} y1={(A.y+B.y)/2 + 500*(A.x-B.x)} 
                      x2={(A.x+B.x)/2 + 500*(A.y-B.y)} y2={(A.y+B.y)/2 - 500*(A.x-B.x)} 
                      stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" 
                    />
                    <line 
                      x1={(B.x+C.x)/2 - 500*(B.y-C.y)} y1={(B.y+C.y)/2 + 500*(B.x-C.x)} 
                      x2={(B.x+C.x)/2 + 500*(B.y-C.y)} y2={(B.y+C.y)/2 - 500*(B.x-C.x)} 
                      stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" 
                    />
                  </>
                )}

                {step >= 3 && hasCenter && (
                  <>
                    <circle cx={center.x} cy={center.y} r={radius} fill="none" stroke="#3b82f6" strokeWidth="2" />
                    <circle cx={center.x} cy={center.y} r={4} fill="#ef4444" />
                    <text x={center.x + 8} y={center.y + 8} className="text-sm font-bold fill-red-500">O</text>
                  </>
                )}

                <circle cx={A.x} cy={A.y} r={8} fill="#ef4444" className="cursor-pointer" onPointerDown={e => handlePointerDown(e, 0)} />
                <circle cx={B.x} cy={B.y} r={8} fill="#ef4444" className="cursor-pointer" onPointerDown={e => handlePointerDown(e, 1)} />
                <circle cx={C.x} cy={C.y} r={8} fill="#ef4444" className="cursor-pointer" onPointerDown={e => handlePointerDown(e, 2)} />
                
                <text x={A.x + 10} y={A.y + 10} className="text-xs font-bold">A</text>
                <text x={B.x + 10} y={B.y + 10} className="text-xs font-bold">B</text>
                <text x={C.x + 10} y={C.y + 10} className="text-xs font-bold">C</text>
              </>
            )}

            {mode === 'chord' && (
              <>
                <circle cx={cCenter.x} cy={cCenter.y} r={cRadius} fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                <circle cx={cCenter.x} cy={cCenter.y} r={3} fill="#1e40af" />
                <text x={cCenter.x - 15} y={cCenter.y + 15} className="text-xs font-bold">O</text>

                {/* Triangle */}
                <polygon points={`${cCenter.x},${cCenter.y} ${cCenter.x},${chordY} ${cCenter.x + halfX},${chordY}`} fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" />
                <line x1={cCenter.x} y1={cCenter.y} x2={cCenter.x + halfX} y2={chordY} stroke="#3b82f6" strokeWidth="2" />

                {/* The Chord */}
                <line x1={cCenter.x - halfX} y1={chordY} x2={cCenter.x + halfX} y2={chordY} stroke="#ef4444" strokeWidth="3" />
                
                <circle cx={cCenter.x} cy={chordY} r={8} fill="#ef4444" className="cursor-move hover:r-[10px] transition-all" onPointerDown={e => handlePointerDown(e, 'chord')} />

                {/* Right angle marker */}
                <path d={`M ${cCenter.x} ${chordY + (dy < 0 ? 10 : -10)} L ${cCenter.x + 10} ${chordY + (dy < 0 ? 10 : -10)} L ${cCenter.x + 10} ${chordY}`} fill="none" stroke="#64748b" strokeWidth="1.5" />

                <text x={10} y={30} className="text-sm fill-slate-700 font-medium">Radius (r) = {cRadius}</text>
                <text x={10} y={50} className="text-sm fill-slate-700 font-medium">Distance (d) = {Math.abs(dy).toFixed(1)}</text>
                <text x={10} y={70} className="text-sm fill-slate-700 font-medium">Chord (L) = {(halfX * 2).toFixed(1)}</text>
                
                <text x={cCenter.x + 5} y={(cCenter.y + chordY)/2} className="text-xs font-bold text-slate-600">d</text>
                <text x={cCenter.x + halfX/2} y={chordY - 5} className="text-xs font-bold text-red-500">L/2</text>
                <text x={cCenter.x + halfX/2 + 5} y={(cCenter.y + chordY)/2 - 5} className="text-xs font-bold text-blue-600">r</text>
              </>
            )}
          </svg>
        </div>

        {/* Right Column */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-500" /> Assessment
          </h2>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <p className="text-sm text-slate-800 font-medium mb-4">
              {questionParams.type === 'find_d' && 
                `A circle has a radius of ${questionParams.given.r} cm. A chord has a length of ${questionParams.given.L} cm. What is its perpendicular distance from the center?`
              }
              {questionParams.type === 'find_r' && 
                `A chord of length ${questionParams.given.L} cm is at a distance of ${questionParams.given.d} cm from the center. What is the radius of the circle?`
              }
              {questionParams.type === 'find_L' && 
                `A circle has a radius of ${questionParams.given.r} cm. A chord is ${questionParams.given.d} cm from the center. What is the length of the chord?`
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
