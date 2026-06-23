import { useState, useRef, useEffect } from 'react';
import type { PointerEvent } from 'react';
import { ArrowRight, BookOpen, CheckCircle, RefreshCw } from 'lucide-react';

interface LabProps {
  onExit?: () => void;
}

const triples = [
  { R: 5, D: 3, L: 8 },
  { R: 13, D: 5, L: 24 },
  { R: 17, D: 8, L: 30 },
  { R: 25, D: 7, L: 48 },
  { R: 10, D: 6, L: 16 }
];

export default function LabM10ChordBisectors({ onExit }: LabProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragged, setDragged] = useState<'A'|'B'|'C'|null>(null);
  const [angles, setAngles] = useState({ A: 0.5, B: 2.5, C: 4.5 });

  const R = 150;
  const origin = { x: 250, y: 250 };

  const toSvg = (angle: number) => ({
    x: origin.x + R * Math.cos(angle),
    y: origin.y - R * Math.sin(angle)
  });

  const handlePointerDown = (pt: 'A'|'B'|'C') => setDragged(pt);
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

  const drawBisector = (p1: {x:number, y:number}, p2: {x:number, y:number}, color: string) => {
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    const dx = mx - origin.x;
    const dy = my - origin.y;
    const len = Math.hypot(dx, dy);
    
    if (len < 0.1) return null; // chord is essentially a diameter
    
    const ex = (dx / len) * 200;
    const ey = (dy / len) * 200;

    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return (
      <g>
        {/* Full bisector line */}
        <line x1={origin.x - ex} y1={origin.y - ey} x2={origin.x + ex} y2={origin.y + ey} stroke={color} strokeDasharray="5,5" strokeWidth="2" opacity="0.6" />
        {/* Right angle square */}
        <path d={`M ${mx} ${my} L ${mx + 10*cos} ${my + 10*sin} L ${mx + 10*cos - 10*(dx/len)} ${my + 10*sin - 10*(dy/len)} L ${mx - 10*(dx/len)} ${my - 10*(dy/len)} Z`} fill="none" stroke={color} strokeWidth="1.5" />
        {/* Thick radius from center to midpoint */}
        <line x1={origin.x} y1={origin.y} x2={mx} y2={my} stroke={color} strokeWidth="3" opacity="0.4" />
      </g>
    );
  };

  // Quiz State
  const [quizIdx, setQuizIdx] = useState(0);
  const [ans, setAns] = useState('');
  const [feedback, setFeedback] = useState('');

  const generateQuiz = () => {
    setQuizIdx(Math.floor(Math.random() * triples.length));
    setAns('');
    setFeedback('');
  };

  useEffect(() => {
    generateQuiz();
  }, []);

  const handleCheckQuiz = () => {
    const numericAns = parseFloat(ans);
    if (isNaN(numericAns)) {
      setFeedback('Please enter a valid number.');
      return;
    }
    if (Math.abs(numericAns - triples[quizIdx].L) < 0.1) {
      setFeedback('Correct! The perpendicular bisects the chord, so the total length is 2 × √(R² - D²).');
    } else {
      setFeedback(`Incorrect. Hint: Half the chord forms a right triangle with the radius and the distance D.`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-slate-800 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold">Lab M10: Chord Bisectors</h1>
        </div>
        {onExit && (
          <button onClick={onExit} className="flex items-center gap-2 hover:text-blue-300 transition-colors">
            <ArrowRight className="w-5 h-5" />
            <span>Exit Lab</span>
          </button>
        )}
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Column: Theory */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Theory & Concepts
          </h2>
          <div className="space-y-4 text-slate-600 text-sm">
            <p>
              A <strong>chord</strong> is a line segment whose endpoints lie on the circle.
            </p>
            <p>
              A <strong>perpendicular bisector</strong> of a chord is a line that divides the chord into two equal parts at exactly a 90° angle.
            </p>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <h3 className="font-semibold text-indigo-800 mb-2">Key Theorem</h3>
              <p className="text-indigo-700">
                The perpendicular bisector of any chord of a circle always passes through the center of the circle.
              </p>
            </div>
            <p>
              Consequently, if you draw a line from the center of a circle to the midpoint of a chord, that line will always be perpendicular to the chord. 
              This creates a right-angled triangle, allowing you to use the Pythagorean theorem to calculate missing lengths.
            </p>
          </div>
        </div>

        {/* Middle Column: Interactive Lab */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative flex flex-col h-[500px]">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800 text-center">Interactive Canvas</h3>
            <p className="text-xs text-slate-500 text-center">Drag points A, B, and C along the circumference.</p>
          </div>
          <div className="flex-1 relative">
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
              <text x={origin.x + 8} y={origin.y + 16} fontSize="12" fill="#475569" fontWeight="bold">Center</text>

              {/* Chords */}
              <line x1={ptA.x} y1={ptA.y} x2={ptB.x} y2={ptB.y} stroke="#ef4444" strokeWidth="3" />
              <line x1={ptB.x} y1={ptB.y} x2={ptC.x} y2={ptC.y} stroke="#3b82f6" strokeWidth="3" />
              <line x1={ptC.x} y1={ptC.y} x2={ptA.x} y2={ptA.y} stroke="#22c55e" strokeWidth="3" />

              {/* Perpendicular Bisectors */}
              {drawBisector(ptA, ptB, "#ef4444")}
              {drawBisector(ptB, ptC, "#3b82f6")}
              {drawBisector(ptC, ptA, "#22c55e")}

              {/* Draggable Points */}
              <g className="cursor-pointer" onPointerDown={() => handlePointerDown('A')}>
                <circle cx={ptA.x} cy={ptA.y} r={10} fill="#ef4444" opacity="0.8" />
                <text x={ptA.x + 12} y={ptA.y - 12} fontSize="14" fill="#ef4444" fontWeight="bold">A</text>
              </g>
              <g className="cursor-pointer" onPointerDown={() => handlePointerDown('B')}>
                <circle cx={ptB.x} cy={ptB.y} r={10} fill="#3b82f6" opacity="0.8" />
                <text x={ptB.x + 12} y={ptB.y - 12} fontSize="14" fill="#3b82f6" fontWeight="bold">B</text>
              </g>
              <g className="cursor-pointer" onPointerDown={() => handlePointerDown('C')}>
                <circle cx={ptC.x} cy={ptC.y} r={10} fill="#22c55e" opacity="0.8" />
                <text x={ptC.x + 12} y={ptC.y - 12} fontSize="14" fill="#22c55e" fontWeight="bold">C</text>
              </g>
            </svg>
            <div className="absolute bottom-2 left-2 right-2 bg-white/90 p-2 rounded text-xs border border-slate-200 text-center text-slate-700 shadow-sm pointer-events-none">
              Notice how the perpendicular bisectors of all three chords intersect precisely at the center of the circle!
            </div>
          </div>
        </div>

        {/* Right Column: Assessment */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Assessment
            </h2>
            <button onClick={generateQuiz} className="p-2 hover:bg-slate-100 rounded-full transition-colors" title="New Question">
              <RefreshCw className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                A circle has a radius of <strong className="text-slate-900">{triples[quizIdx].R} cm</strong>. 
                A chord is drawn at a perpendicular distance of <strong className="text-slate-900">{triples[quizIdx].D} cm</strong> from the center.
              </p>
              <p className="text-sm font-semibold text-slate-800 mb-2">
                What is the total length of the chord?
              </p>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={ans}
                  onChange={(e) => setAns(e.target.value)}
                  className="border border-slate-300 rounded px-3 py-2 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 10"
                />
                <span className="text-sm text-slate-500">cm</span>
              </div>
              <button 
                onClick={handleCheckQuiz}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors text-sm"
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
