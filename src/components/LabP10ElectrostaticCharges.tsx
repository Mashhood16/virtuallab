import { useState, useEffect } from 'react';
import {Plus, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit?: () => void;
}

export default function LabP10ElectrostaticCharges({ onExit }: LabProps) {
  const [q1, setQ1] = useState<number>(5); // microCoulombs
  const [q2, setQ2] = useState<number>(5); // microCoulombs
  const [distance, setDistance] = useState<number>(5); // centimeters
  const [noise, setNoise] = useState<number>(0);

  // Update noise slightly periodically to simulate sensor fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setNoise((Math.random() - 0.5) * 0.04); // +/- 2% noise
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const k = 8.987e9;
  const F_exact = (k * Math.abs(q1 * 1e-6) * Math.abs(q2 * 1e-6)) / Math.pow(distance * 1e-2, 2);
  const F_measured = F_exact === 0 ? 0 : F_exact * (1 + noise);

  // Assessment
  const [assessmentAnswer, setAssessmentAnswer] = useState<string>('');
  const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  
  const checkAnswer = () => {
    const val = parseFloat(assessmentAnswer);
    // F = k*|q1*q2|/r^2 => 90 = 8.987e9 * 4e-6 * q2e-6 / (0.02)^2 => q2 ≈ 1.0
    if (!isNaN(val) && Math.abs(val - 1.0) < 0.2) {
      setAssessmentStatus('correct');
    } else {
      setAssessmentStatus('incorrect');
    }
  };

  // Data Logging
  const [dataPoints, setDataPoints] = useState<Array<{ id: number; q1: number; q2: number; r: number; f: number }>>([]);
  const recordData = () => {
    setDataPoints((prev) => [
      ...prev,
      { id: Date.now(), q1, q2, r: distance, f: F_measured }
    ]);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      {/* Header */}
      <LabHeader onExit={onExit} title="Unit 15: Coulomb's Law & Electrostatics" subtitle="Investigate the electric force between two point charges." />

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto w-full">
        
        {/* Column 1: Theory & Setup */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Theory</h2>
            <p className="text-slate-600 text-sm mb-4">
              Coulomb's Law states that the electrical force between two charged objects is directly proportional to the product of the quantity of charge on the objects and inversely proportional to the square of the separation distance between the two objects.
            </p>
            <div className="bg-slate-100 p-3 rounded-lg text-center font-serif text-lg text-slate-800 mb-2">
              F = k · |q₁q₂| / r²
            </div>
            <p className="text-xs text-slate-500">
              Where k ≈ 8.99 × 10⁹ N·m²/C² (Coulomb's constant). Measurements include realistic sensor noise (±2%).
            </p>
          </div>

          <div className="h-px bg-slate-200" />

          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Experiment Setup</h2>
            
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-slate-700">Charge 1 (q₁)</label>
                <span className="text-sm font-mono text-blue-600">{q1 > 0 ? '+' : ''}{q1} μC</span>
              </div>
              <input 
                type="range" min="-10" max="10" step="1" value={q1}
                onChange={(e) => setQ1(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-slate-700">Charge 2 (q₂)</label>
                <span className="text-sm font-mono text-red-600">{q2 > 0 ? '+' : ''}{q2} μC</span>
              </div>
              <input 
                type="range" min="-10" max="10" step="1" value={q2}
                onChange={(e) => setQ2(parseFloat(e.target.value))}
                className="w-full accent-red-600"
              />
            </div>

            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-slate-700">Separation Distance (r)</label>
                <span className="text-sm font-mono text-emerald-600">{distance} cm</span>
              </div>
              <input 
                type="range" min="2" max="10" step="0.5" value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Column 2: Simulation */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-700 p-6 flex flex-col relative overflow-hidden">
          <h2 className="text-lg font-bold text-white mb-4 absolute top-6 left-6 z-10">Simulation</h2>
          
          <div className="flex-1 flex items-center justify-center relative">
            <svg viewBox="0 0 400 200" className="w-full h-full max-h-[300px] overflow-visible">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
                </marker>
              </defs>

              {/* Ruler */}
              <line x1="50" y1="150" x2="350" y2="150" stroke="#475569" strokeWidth="2" />
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tick) => (
                <g key={tick} transform={`translate(${50 + tick * 30}, 150)`}>
                  <line x1="0" y1="-5" x2="0" y2="5" stroke="#475569" strokeWidth="2" />
                  <text x="0" y="20" fill="#94a3b8" fontSize="10" textAnchor="middle">{tick}</text>
                </g>
              ))}
              <text x="200" y="185" fill="#94a3b8" fontSize="12" textAnchor="middle">Distance (cm)</text>

              {/* Charges */}
              {(() => {
                const cx1 = 50 + (10 - distance) / 2 * 30;
                const cx2 = 50 + (10 + distance) / 2 * 30;
                const cy = 80;
                const isAttractive = q1 * q2 < 0;
                const isRepulsive = q1 * q2 > 0;
                
                // Visual Force Arrow Length (logarithmic to fit screen)
                const arrowLen = F_exact > 0 ? Math.max(15, Math.min(80, 15 + Math.log10(F_exact + 1) * 20)) : 0;
                
                return (
                  <>
                    {/* Dashed line connecting them */}
                    <line x1={cx1} y1={cy} x2={cx2} y2={cy} stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                    
                    {/* Force Arrows */}
                    {isRepulsive && F_exact > 0 && (
                      <>
                        <line x1={cx1 - 15} y1={cy} x2={cx1 - 15 - arrowLen} y2={cy} stroke="#cbd5e1" strokeWidth="3" markerEnd="url(#arrowhead)" />
                        <line x1={cx2 + 15} y1={cy} x2={cx2 + 15 + arrowLen} y2={cy} stroke="#cbd5e1" strokeWidth="3" markerEnd="url(#arrowhead)" />
                      </>
                    )}
                    {isAttractive && F_exact > 0 && (
                      <>
                        <line x1={cx1 + 15} y1={cy} x2={cx1 + 15 + arrowLen} y2={cy} stroke="#cbd5e1" strokeWidth="3" markerEnd="url(#arrowhead)" />
                        <line x1={cx2 - 15} y1={cy} x2={cx2 - 15 - arrowLen} y2={cy} stroke="#cbd5e1" strokeWidth="3" markerEnd="url(#arrowhead)" />
                      </>
                    )}

                    {/* Sphere 1 */}
                    <circle cx={cx1} cy={cy} r="15" fill={q1 > 0 ? '#3b82f6' : q1 < 0 ? '#64748b' : '#94a3b8'} stroke={q1 > 0 ? '#2563eb' : '#475569'} strokeWidth="2" />
                    <text x={cx1} y={cy} fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
                      {q1 > 0 ? '+' : q1 < 0 ? '-' : '0'}
                    </text>

                    {/* Sphere 2 */}
                    <circle cx={cx2} cy={cy} r="15" fill={q2 > 0 ? '#ef4444' : q2 < 0 ? '#64748b' : '#94a3b8'} stroke={q2 > 0 ? '#dc2626' : '#475569'} strokeWidth="2" />
                    <text x={cx2} y={cy} fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
                      {q2 > 0 ? '+' : q2 < 0 ? '-' : '0'}
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
            <span className="text-slate-400 text-sm font-medium mb-1">Force Sensor Output</span>
            <div className="font-mono text-3xl font-bold text-amber-400 tracking-wider">
              {F_measured.toFixed(1)} <span className="text-xl">N</span>
            </div>
            <span className="text-slate-500 text-xs mt-1">± 2% environmental noise</span>
          </div>
        </div>

        {/* Column 3: Data & Analysis */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Data Logging</h2>
            <button 
              onClick={recordData}
              className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Record
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-6 border border-slate-200 rounded-lg max-h-[200px]">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-600 uppercase bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2">q₁ (μC)</th>
                  <th className="px-4 py-2">q₂ (μC)</th>
                  <th className="px-4 py-2">r (cm)</th>
                  <th className="px-4 py-2">F (N)</th>
                </tr>
              </thead>
              <tbody>
                {dataPoints.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-slate-500 italic">No data recorded yet.</td>
                  </tr>
                ) : (
                  dataPoints.map((dp) => (
                    <tr key={dp.id} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-2 font-mono">{dp.q1}</td>
                      <td className="px-4 py-2 font-mono">{dp.q2}</td>
                      <td className="px-4 py-2 font-mono">{dp.r}</td>
                      <td className="px-4 py-2 font-mono">{dp.f.toFixed(1)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="h-px bg-slate-200 mb-6" />

          {/* Assessment Section */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Analysis Check</h2>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-slate-700 mb-3">
                <strong>Problem:</strong> In a separate experiment, charge q₁ is fixed at +4 μC. A force sensor measures 90.0 N of repulsive force when charge q₂ is placed exactly 2.0 cm away. 
                What is the magnitude of q₂ in μC?
              </p>
              <div className="flex gap-2 items-center">
                <input 
                  type="number" 
                  step="0.1"
                  placeholder="e.g. 5.0"
                  value={assessmentAnswer}
                  onChange={(e) => { setAssessmentAnswer(e.target.value); setAssessmentStatus('idle'); }}
                  className="border border-slate-300 rounded px-3 py-2 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-600 mr-2">μC</span>
                <button 
                  onClick={checkAnswer}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Check Answer
                </button>
              </div>
              {assessmentStatus === 'correct' && (
                <div className="mt-3 flex items-center gap-1 text-emerald-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> Correct! q₂ ≈ 1.0 μC.
                </div>
              )}
              {assessmentStatus === 'incorrect' && (
                <div className="mt-3 flex items-center gap-1 text-rose-600 text-sm font-medium">
                  <XCircle className="w-4 h-4" /> Incorrect. Try rearranging the Coulomb's Law formula for q₂.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
