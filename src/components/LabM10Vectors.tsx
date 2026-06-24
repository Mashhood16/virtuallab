import { useState, useRef, useEffect } from 'react';
import type { PointerEvent } from 'react';
import { ArrowRight, BookOpen, CheckCircle, RefreshCw } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit?: () => void;
}

export default function LabM10Vectors({ onExit }: LabProps) {
  // SVG Vector Canvas State
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggedPoint, setDraggedPoint] = useState<'U' | 'V' | null>(null);
  const [u, setU] = useState({ x: 4, y: 3 });
  const [v, setV] = useState({ x: 3, y: -4 });
  
  const origin = { x: 250, y: 200 };
  const scale = 20;
  
  const toSvg = (mathPt: { x: number; y: number }) => ({
    x: origin.x + mathPt.x * scale,
    y: origin.y - mathPt.y * scale
  });
  
  const handlePointerDown = (pt: 'U' | 'V') => setDraggedPoint(pt);
  const handlePointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!draggedPoint || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - origin.x;
    const y = e.clientY - rect.top - origin.y;
    
    const mathX = Math.round((x / scale) * 2) / 2;
    const mathY = Math.round((-y / scale) * 2) / 2;
    
    if (draggedPoint === 'U') setU({ x: mathX, y: mathY });
    else setV({ x: mathX, y: mathY });
  };
  const handlePointerUp = () => setDraggedPoint(null);

  const sum = { x: u.x + v.x, y: u.y + v.y };
  
  const uSvg = toSvg(u);
  const vSvg = toSvg(v);
  const sumSvg = toSvg(sum);
  const uMag = Math.hypot(u.x, u.y).toFixed(1);
  const vMag = Math.hypot(v.x, v.y).toFixed(1);
  const sumMag = Math.hypot(sum.x, sum.y).toFixed(1);

  // Classification State
  const initialItems = [
    { id: '1', text: '40 m/s West', type: 'vector', status: 'pool' },
    { id: '2', text: '144 m²', type: 'scalar', status: 'pool' },
    { id: '3', text: '9.8 m/s² down', type: 'vector', status: 'pool' },
    { id: '4', text: '15 kg', type: 'scalar', status: 'pool' },
    { id: '5', text: '120 Joules', type: 'scalar', status: 'pool' },
    { id: '6', text: '50 N upwards', type: 'vector', status: 'pool' },
  ] as const;
  
  type QStatus = 'pool' | 'scalar' | 'vector';
  const [items, setItems] = useState<{id: string, text: string, type: 'scalar'|'vector', status: QStatus}[]>([...initialItems]);
  const [selectedItem, setSelectedItem] = useState<string|null>(null);

  const moveItem = (bucket: QStatus) => {
    if (!selectedItem) return;
    setItems(items.map(it => it.id === selectedItem ? { ...it, status: bucket } : it));
    setSelectedItem(null);
  };
  
  const checkClassification = () => items.every(it => it.status === it.type);
  const isAllClassified = items.every(it => it.status !== 'pool');

  // Quiz State
  const [qX, setQX] = useState(3);
  const [qY, setQY] = useState(4);
  const [ans, setAns] = useState('');
  const [feedback, setFeedback] = useState('');

  const generateQuiz = () => {
    setQX(Math.floor(Math.random() * 8) + 3);
    setQY(Math.floor(Math.random() * 8) + 3);
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
    const expected = Math.hypot(qX, qY);
    if (Math.abs(numericAns - expected) < 0.2) {
      setFeedback('Correct! Well done.');
    } else {
      setFeedback(`Incorrect. Try again! (Hint: Use Pythagorean theorem)`);
    }
  };

  const gridLines = [];
  for (let i = -12; i <= 12; i++) {
    gridLines.push(<line key={`v${i}`} x1={origin.x + i * scale} y1={0} x2={origin.x + i * scale} y2={400} stroke="#e2e8f0" strokeWidth={i===0?2:1} />);
    gridLines.push(<line key={`h${i}`} x1={0} y1={origin.y + i * scale} x2={500} y2={origin.y + i * scale} stroke="#e2e8f0" strokeWidth={i===0?2:1} />);
  }

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Lab M10: Vectors & Scalars" />

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Column: Theory */}
        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Theory & Concepts
          </h2>
          <div className="space-y-4 text-slate-600 text-sm">
            <p>
              <strong className="text-slate-800">Scalars</strong> are physical quantities that have only a magnitude (size). 
              Examples include mass, time, temperature, and energy.
            </p>
            <p>
              <strong className="text-slate-800">Vectors</strong> are physical quantities that have both a magnitude and a direction. 
              Examples include velocity, acceleration, force, and displacement.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">Vector Addition</h3>
              <p className="text-blue-700">
                When adding two vectors, you can use the parallelogram method. Place both vectors starting from the same origin. 
                The resultant vector (their sum) is the diagonal of the parallelogram formed by the two vectors.
              </p>
            </div>
          </div>
        </div>

        {/* Middle Column: Interactive Lab */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 overflow-hidden relative h-[400px]">
            <svg 
              ref={svgRef} 
              className="w-full h-full touch-none" 
              viewBox="0 0 500 400"
              onPointerMove={handlePointerMove} 
              onPointerUp={handlePointerUp} 
              onPointerLeave={handlePointerUp}
            >
              <defs>
                <marker id="arrowU" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                </marker>
                <marker id="arrowV" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                </marker>
                <marker id="arrowSum" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
                </marker>
              </defs>
              {gridLines}
              
              {/* Parallelogram guidelines */}
              <line x1={uSvg.x} y1={uSvg.y} x2={sumSvg.x} y2={sumSvg.y} stroke="#ef4444" strokeWidth="2" strokeDasharray="4" opacity="0.4" />
              <line x1={vSvg.x} y1={vSvg.y} x2={sumSvg.x} y2={sumSvg.y} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" opacity="0.4" />
              
              {/* Vectors */}
              <line x1={origin.x} y1={origin.y} x2={uSvg.x} y2={uSvg.y} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowU)" />
              <line x1={origin.x} y1={origin.y} x2={vSvg.x} y2={vSvg.y} stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowV)" />
              <line x1={origin.x} y1={origin.y} x2={sumSvg.x} y2={sumSvg.y} stroke="#22c55e" strokeWidth="3" markerEnd="url(#arrowSum)" />
              
              {/* Draggable heads */}
              <circle cx={uSvg.x} cy={uSvg.y} r={8} fill="#3b82f6" className="cursor-pointer hover:opacity-80" onPointerDown={() => handlePointerDown('U')} />
              <circle cx={vSvg.x} cy={vSvg.y} r={8} fill="#ef4444" className="cursor-pointer hover:opacity-80" onPointerDown={() => handlePointerDown('V')} />
            </svg>
            <div className="absolute top-2 left-2 bg-slate-50/90 p-2 rounded text-xs border border-slate-200 pointer-events-none">
              <div className="text-blue-600 font-bold">Vector U (Blue): {uMag} units</div>
              <div className="text-red-600 font-bold">Vector V (Red): {vMag} units</div>
              <div className="text-green-600 font-bold">Resultant U+V: {sumMag} units</div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 mb-2">Classify Quantities</h3>
            <div className="flex gap-2 flex-wrap mb-4 min-h-[30px]">
              {items.filter(i => i.status === 'pool').map(item => (
                <button key={item.id} onClick={() => setSelectedItem(item.id)} className={`px-3 py-1 text-sm rounded-full border ${selectedItem === item.id ? 'bg-blue-100 border-blue-400' : 'bg-slate-100 border-slate-300'}`}>
                  {item.text}
                </button>
              ))}
              {items.filter(i => i.status === 'pool').length === 0 && <span className="text-sm text-slate-400 italic">All items classified</span>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-3 min-h-[120px] cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => moveItem('scalar')}>
                <div className="font-bold text-center text-slate-500 mb-2">Scalars</div>
                <div className="flex flex-col gap-1">
                  {items.filter(i => i.status === 'scalar').map(item => (
                    <div key={item.id} onClick={(e) => { e.stopPropagation(); setSelectedItem(item.id); }} className={`text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded text-center cursor-pointer ${selectedItem === item.id ? 'ring-2 ring-blue-400' : ''}`}>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-3 min-h-[120px] cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => moveItem('vector')}>
                <div className="font-bold text-center text-slate-500 mb-2">Vectors</div>
                <div className="flex flex-col gap-1">
                  {items.filter(i => i.status === 'vector').map(item => (
                    <div key={item.id} onClick={(e) => { e.stopPropagation(); setSelectedItem(item.id); }} className={`text-xs bg-red-50 text-red-800 px-2 py-1 rounded text-center cursor-pointer ${selectedItem === item.id ? 'ring-2 ring-red-400' : ''}`}>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {isAllClassified && (
              <div className={`mt-3 p-2 flex items-center justify-center gap-2 rounded text-sm font-bold ${checkClassification() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {checkClassification() ? <CheckCircle className="w-4 h-4" /> : null}
                {checkClassification() ? 'All Correct! Great Job!' : 'Some are incorrect. Keep trying!'}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Assessment */}
        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200">
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
              <p className="text-sm text-slate-700 mb-3">
                A drone flies exactly <strong className="text-slate-900">{qX} km North</strong>, and then turns and flies <strong className="text-slate-900">{qY} km East</strong>.
              </p>
              <p className="text-sm font-semibold text-slate-800 mb-2">
                What is the magnitude of its total displacement from the starting point?
              </p>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={ans}
                  onChange={(e) => setAns(e.target.value)}
                  className="border border-slate-300 rounded px-3 py-2 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 5"
                />
                <span className="text-sm text-slate-500">km</span>
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
