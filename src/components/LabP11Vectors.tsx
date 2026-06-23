import { useState } from 'react';
import { ArrowLeft, Compass, Calculator, CheckCircle, XCircle } from 'lucide-react';

export default function LabP11Vectors({ onExit }: { onExit?: () => void }) {
  const [fMag, setFMag] = useState(50);
  const [fAngle, setFAngle] = useState(30);
  const [dMag, setDMag] = useState(10);
  const [dAngle, setDAngle] = useState(0);

  const [workGuess, setWorkGuess] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const fRad = (fAngle * Math.PI) / 180;
  const dRad = (dAngle * Math.PI) / 180;

  const fx = fMag * Math.cos(fRad);
  const fy = fMag * Math.sin(fRad);
  const dx = dMag * Math.cos(dRad);
  const dy = dMag * Math.sin(dRad);

  const actualWork = fx * dx + fy * dy;

  const checkAnswer = () => {
    const guess = parseFloat(workGuess);
    if (Math.abs(actualWork - guess) < 5) {
      setFeedback('Correct! You successfully calculated the dot product (Work done).');
    } else {
      setFeedback(`Incorrect. Try resolving both vectors into x and y components and using W = Fx*Dx + Fy*Dy. The actual answer is ${actualWork.toFixed(1)} J.`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      {/* Header */}
      <div className="bg-slate-800 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          {onExit && (
            <button onClick={onExit} className="hover:bg-slate-700 p-2 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-bold flex items-center gap-2"><Compass className="text-orange-400" /> Vectors & Dot Product</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 gap-4 p-4 min-h-0">
        {/* Theory */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Vector Resolution & Work</h2>
          <div className="prose prose-sm text-slate-600">
            <p>Work is defined as the dot product of Force and Displacement vectors:</p>
            <p className="text-center font-mono bg-slate-100 p-2 rounded text-slate-800">W = F · D = |F||D|cos(θ)</p>
            <p>Alternatively, resolving into components:</p>
            <p className="text-center font-mono bg-slate-100 p-2 rounded text-slate-800">W = F_x D_x + F_y D_y</p>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              <li><strong>Force (F)</strong> represents the push on a trolley.</li>
              <li><strong>Displacement (D)</strong> represents the movement.</li>
              <li>Adjust the magnitudes and angles using the sliders below.</li>
              <li>Calculate the total work done based on your parameters.</li>
            </ul>
          </div>
          
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 flex justify-between">
                <span>Force Magnitude (N)</span> <span>{fMag} N</span>
              </label>
              <input type="range" min="10" max="100" value={fMag} onChange={e => setFMag(Number(e.target.value))} className="w-full accent-orange-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 flex justify-between">
                <span>Force Angle (°)</span> <span>{fAngle}°</span>
              </label>
              <input type="range" min="-90" max="90" value={fAngle} onChange={e => setFAngle(Number(e.target.value))} className="w-full accent-orange-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 flex justify-between">
                <span>Disp. Magnitude (m)</span> <span>{dMag} m</span>
              </label>
              <input type="range" min="5" max="50" value={dMag} onChange={e => setDMag(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 flex justify-between">
                <span>Disp. Angle (°)</span> <span>{dAngle}°</span>
              </label>
              <input type="range" min="-90" max="90" value={dAngle} onChange={e => setDAngle(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
          </div>
        </div>

        {/* Simulator */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col items-center">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Vector Mapping</h2>
          <svg width="300" height="300" className="bg-slate-100 rounded-lg border border-slate-300 shadow-inner">
            <defs>
              <marker id="arrowForce" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
              </marker>
              <marker id="arrowDisp" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
              </marker>
            </defs>

            {/* Grid */}
            {[...Array(11)].map((_, i) => (
              <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="300" stroke="#e2e8f0" strokeWidth="1" />
            ))}
            {[...Array(11)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 30} x2="300" y2={i * 30} stroke="#e2e8f0" strokeWidth="1" />
            ))}

            {/* Axes */}
            <line x1="0" y1="150" x2="300" y2="150" stroke="#94a3b8" strokeWidth="2" />
            <line x1="150" y1="0" x2="150" y2="300" stroke="#94a3b8" strokeWidth="2" />

            {/* Displacement Vector (Blue) drawn first so it's under Force */}
            <line 
              x1="150" y1="150" 
              x2={150 + dx * 2} y2={150 - dy * 2} 
              stroke="#3b82f6" strokeWidth="3" 
              markerEnd="url(#arrowDisp)" 
            />

            {/* Force Vector (Orange) */}
            <line 
              x1="150" y1="150" 
              x2={150 + fx * 1.5} y2={150 - fy * 1.5} 
              stroke="#f97316" strokeWidth="3" 
              markerEnd="url(#arrowForce)" 
            />
          </svg>
          <div className="mt-4 flex gap-4 text-sm font-medium">
            <div className="flex items-center gap-1 text-orange-600"><div className="w-3 h-3 bg-orange-500 rounded-full"></div> Force</div>
            <div className="flex items-center gap-1 text-blue-600"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Displacement</div>
          </div>
        </div>

        {/* Assessment */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-500" />
            Calculate Work Done
          </h2>
          
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-sm text-slate-700">
            <p><strong>F</strong> = {fMag} N at {fAngle}°</p>
            <p><strong>D</strong> = {dMag} m at {dAngle}°</p>
            <p className="text-xs text-slate-500 mt-2">Hint: Find components of F and D or use the angle difference.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Work Done (Joules):
              </label>
              <input
                type="number"
                value={workGuess}
                onChange={(e) => setWorkGuess(e.target.value)}
                placeholder="e.g. 250"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <button 
              onClick={checkAnswer}
              className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Check Answer
            </button>

            {feedback && (
              <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${feedback.includes('Correct') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {feedback.includes('Correct') ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                <span>{feedback}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
