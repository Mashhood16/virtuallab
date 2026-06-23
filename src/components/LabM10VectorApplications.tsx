import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Navigation, Anchor, Compass } from 'lucide-react';

export default function LabM10VectorApplications({ onExit }: { onExit: () => void }) {
  const [scenario, setScenario] = useState<'aviation' | 'river' | 'tractor'>('aviation');

  const [mag1, setMag1] = useState(200);
  const [ang1, setAng1] = useState(90);
  const [mag2, setMag2] = useState(50);
  const [ang2, setAng2] = useState(0);

  const [ansMag, setAnsMag] = useState('');
  const [ansMagStatus, setAnsMagStatus] = useState<'none'|'correct'|'incorrect'>('none');
  const [ansAng, setAnsAng] = useState('');
  const [ansAngStatus, setAnsAngStatus] = useState<'none'|'correct'|'incorrect'>('none');

  useEffect(() => {
    if (scenario === 'aviation') {
      setMag1(200); setAng1(90); 
      setMag2(50); setAng2(0); 
    } else if (scenario === 'river') {
      setMag1(5); setAng1(90); 
      setMag2(2); setAng2(0); 
    } else if (scenario === 'tractor') {
      setMag1(100); setAng1(45);
      setMag2(100); setAng2(315);
    }
    setAnsMag(''); setAnsMagStatus('none');
    setAnsAng(''); setAnsAngStatus('none');
  }, [scenario]);

  const rx = mag1 * Math.cos(ang1 * Math.PI / 180) + mag2 * Math.cos(ang2 * Math.PI / 180);
  const ry = mag1 * Math.sin(ang1 * Math.PI / 180) + mag2 * Math.sin(ang2 * Math.PI / 180);
  const resMag = Math.sqrt(rx*rx + ry*ry);
  let resAng = Math.atan2(ry, rx) * 180 / Math.PI;
  if (resAng < 0) resAng += 360;

  const checkAnswers = () => {
    if (Math.abs(parseFloat(ansMag) - resMag) <= 1.0) setAnsMagStatus('correct');
    else setAnsMagStatus('incorrect');

    if (Math.abs(parseFloat(ansAng) - resAng) <= 1.0) setAnsAngStatus('correct');
    else setAnsAngStatus('incorrect');
  };

  const maxMag = scenario === 'aviation' ? 300 : scenario === 'tractor' ? 250 : 10;
  const scale = 120 / maxMag; 
  const originX = 200;
  const originY = 200;

  const v1x = originX + mag1 * Math.cos(ang1 * Math.PI / 180) * scale;
  const v1y = originY - mag1 * Math.sin(ang1 * Math.PI / 180) * scale;

  const v2x = v1x + mag2 * Math.cos(ang2 * Math.PI / 180) * scale;
  const v2y = v1y - mag2 * Math.sin(ang2 * Math.PI / 180) * scale;

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-slate-800 text-white p-4 flex items-center shadow-md shrink-0">
        <button onClick={onExit} className="flex items-center text-slate-300 hover:text-white transition-colors">
          <ArrowLeft className="mr-2" size={20} />
          Back to Dashboard
        </button>
        <h1 className="text-xl font-bold ml-6">Vector Applications Lab</h1>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Theory Column */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Theory & Formulas</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-slate-700">
            <p><strong>Vectors</strong> have both magnitude (size) and direction (angle).</p>
            <p>To add two vectors, we resolve them into their horizontal (X) and vertical (Y) components:</p>
            <div className="bg-blue-50 p-3 rounded-lg font-mono text-sm">
              X = Magnitude × cos(θ)<br/>
              Y = Magnitude × sin(θ)
            </div>
            
            <p><strong>Resultant Vector</strong></p>
            <p>The sum of the vectors is the Resultant Vector, found by adding the individual components:</p>
            <div className="bg-slate-100 p-3 rounded-lg font-mono text-sm">
              Rₓ = X₁ + X₂<br/>
              Rₗ = Y₁ + Y₂
            </div>
            
            <p>To find the Resultant Magnitude and Angle:</p>
            <div className="bg-green-50 p-3 rounded-lg font-mono text-sm">
              |R| = √(Rₓ² + Rₗ²)<br/>
              θ = tan⁻¹(Rₗ / Rₓ)
            </div>
            
            <div className="text-xs text-slate-500 mt-4">
              * Note: In this lab, standard mathematical degrees are used (0° is East, 90° is North).
            </div>
          </div>
        </div>

        {/* Interactive Column */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <div className="flex space-x-2 mb-6 text-sm">
            <button 
              onClick={() => setScenario('aviation')}
              className={`flex-1 flex items-center justify-center py-2 rounded-lg font-medium transition-colors ${scenario === 'aviation' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <Navigation size={16} className="mr-1" /> Aviation
            </button>
            <button 
              onClick={() => setScenario('river')}
              className={`flex-1 flex items-center justify-center py-2 rounded-lg font-medium transition-colors ${scenario === 'river' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <Anchor size={16} className="mr-1" /> River
            </button>
            <button 
              onClick={() => setScenario('tractor')}
              className={`flex-1 flex items-center justify-center py-2 rounded-lg font-medium transition-colors ${scenario === 'tractor' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <Compass size={16} className="mr-1" /> Forces
            </button>
          </div>

          {/* Visualizer */}
          <div className="relative h-64 bg-white rounded-xl mb-6 overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-full h-full bg-slate-50">
              {/* Grid lines */}
              <line x1="0" y1="200" x2="400" y2="200" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="200" y1="0" x2="200" y2="400" stroke="#cbd5e1" strokeWidth="1" />
              
              {/* Labels */}
              <text x="380" y="215" fontSize="12" fill="#64748b">E(0°)</text>
              <text x="210" y="20" fontSize="12" fill="#64748b">N(90°)</text>
              
              {/* Vector 1 */}
              <line x1={originX} y1={originY} x2={v1x} y2={v1y} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow-blue)" />
              
              {/* Vector 2 */}
              <line x1={v1x} y1={v1y} x2={v2x} y2={v2y} stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrow-red)" />
              
              {/* Resultant */}
              <line x1={originX} y1={originY} x2={v2x} y2={v2y} stroke="#10b981" strokeWidth="4" strokeDasharray="5,5" markerEnd="url(#arrow-green)" />

              <defs>
                <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                </marker>
                <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                </marker>
                <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-blue-600 border-b pb-1">Vector 1 (Blue)</h3>
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Magnitude</span>
                  <span>{mag1}</span>
                </div>
                <input type="range" min="0" max={maxMag} step="1" value={mag1} onChange={e => setMag1(Number(e.target.value))} className="w-full accent-blue-600" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Angle (°)</span>
                  <span>{ang1}°</span>
                </div>
                <input type="range" min="0" max="360" step="1" value={ang1} onChange={e => setAng1(Number(e.target.value))} className="w-full accent-blue-600" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-red-500 border-b pb-1">Vector 2 (Red)</h3>
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Magnitude</span>
                  <span>{mag2}</span>
                </div>
                <input type="range" min="0" max={maxMag} step="1" value={mag2} onChange={e => setMag2(Number(e.target.value))} className="w-full accent-red-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Angle (°)</span>
                  <span>{ang2}°</span>
                </div>
                <input type="range" min="0" max="360" step="1" value={ang2} onChange={e => setAng2(Number(e.target.value))} className="w-full accent-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Column */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Data Analysis</h2>
          <div className="flex-1 space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-slate-700 font-medium mb-2">Given the vectors, what is the magnitude of the resultant vector?</p>
              <p className="text-xs text-slate-500 mb-3">(Round to 1 decimal place)</p>
              
              <div className="flex items-center space-x-3">
                <input 
                  type="number" 
                  step="0.1"
                  value={ansMag}
                  onChange={e => setAnsMag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {ansMagStatus === 'correct' && <CheckCircle2 className="text-green-600" />}
                {ansMagStatus === 'incorrect' && <XCircle className="text-red-500" />}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-slate-700 font-medium mb-2">What is the angle (in standard degrees) of the resultant vector?</p>
              <p className="text-xs text-slate-500 mb-3">(Round to 1 decimal place, between 0 and 360)</p>
              
              <div className="flex items-center space-x-3">
                <input 
                  type="number" 
                  step="0.1"
                  value={ansAng}
                  onChange={e => setAnsAng(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {ansAngStatus === 'correct' && <CheckCircle2 className="text-green-600" />}
                {ansAngStatus === 'incorrect' && <XCircle className="text-red-500" />}
              </div>
            </div>

            <button 
              onClick={checkAnswers}
              className="w-full mt-4 px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
            >
              Check Answers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
