import { useState } from 'react';
import { RefreshCw, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit?: () => void;
}

interface DataPoint {
  id: string;
  angleI: number;
  angleR: number;
  sinI: number;
  sinR: number;
}

export default function LabP10RefractionIllusion({ onExit }: LabProps) {
  const [angleI, setAngleI] = useState<number>(30);
  const [material, setMaterial] = useState<string>('water');
  const [data, setData] = useState<DataPoint[]>([]);
  const [assessmentAnswer, setAssessmentAnswer] = useState<string>('');
  const [assessmentResult, setAssessmentResult] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const materials: Record<string, { name: string; n: number }> = {
    water: { name: 'Water', n: 1.33 },
    oil: { name: 'Vegetable Oil', n: 1.47 },
    glass: { name: 'Crown Glass', n: 1.52 },
    unknown: { name: 'Unknown Liquid', n: 1.65 },
  };

  const currentN = materials[material].n;

  // Calculate actual and measured angle of refraction
  // n1 * sin(i) = n2 * sin(r) -> sin(r) = (n1/n2) * sin(i)
  const n1 = 1.0; // Air
  const radI = (angleI * Math.PI) / 180;
  const sinR_actual = (n1 / currentN) * Math.sin(radI);
  const actualR = (Math.asin(sinR_actual) * 180) / Math.PI;

  // Add some realistic noise (+/- 0.5 degrees)
  const measuredR = Math.max(0, actualR + (Math.random() * 1 - 0.5));

  const handleRecordData = () => {
    const newPoint: DataPoint = {
      id: Math.random().toString(36).substring(2, 9),
      angleI,
      angleR: parseFloat(measuredR.toFixed(1)),
      sinI: parseFloat(Math.sin(radI).toFixed(3)),
      sinR: parseFloat(Math.sin((measuredR * Math.PI) / 180).toFixed(3)),
    };
    setData([...data, newPoint]);
  };

  const handleClearData = () => {
    setData([]);
  };

  const checkAssessment = () => {
    const ans = parseFloat(assessmentAnswer);
    if (!isNaN(ans) && Math.abs(ans - materials.unknown.n) < 0.05) {
      setAssessmentResult('correct');
    } else {
      setAssessmentResult('incorrect');
    }
  };

  const resetLab = () => {
    setAngleI(30);
    setMaterial('water');
    setData([]);
    setAssessmentAnswer('');
    setAssessmentResult('idle');
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none text-slate-800">
      {/* Header */}
      <LabHeader onExit={onExit} title="Refraction & Snell's Law" subtitle="Investigate the bending of light across different media" />

      {/* Main Grid */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        
        {/* Column 1: Theory and Setup */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="bg-slate-100 border-b border-slate-200 p-4">
            <h2 className="font-semibold text-slate-800">Theory & Setup</h2>
          </div>
          <div className="p-5 flex-1 overflow-y-auto space-y-6">
            <div className="space-y-2 text-sm text-slate-600">
              <p>
                When light travels from one transparent medium to another, its speed changes, causing the ray to bend. This is called <strong>refraction</strong>.
              </p>
              <p>
                <strong>Snell's Law</strong> describes this relationship quantitatively:
              </p>
              <div className="bg-slate-50 p-3 rounded border border-slate-100 text-center font-mono text-base text-slate-800">
                n₁·sin(θ₁) = n₂·sin(θ₂)
              </div>
              <p>
                Where <strong>n</strong> is the refractive index, <strong>θ₁</strong> is the angle of incidence, and <strong>θ₂</strong> is the angle of refraction.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4">
              <div className="space-y-2">
                <label className="flex justify-between text-sm font-medium text-slate-700">
                  <span>Angle of Incidence (θ₁)</span>
                  <span>{angleI}°</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="1"
                  value={angleI}
                  onChange={(e) => setAngleI(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Refracting Medium (n₂)
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {Object.entries(materials).map(([key, mat]) => (
                    <option key={key} value={key}>
                      {mat.name} {key !== 'unknown' && `(n ≈ ${mat.n})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>Experiment:</strong> Change the angle of incidence and record the angle of refraction. Plot sin(θ₁) vs sin(θ₂) to determine the refractive index.
              </p>
            </div>
          </div>
        </div>

        {/* Column 2: Simulation */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden lg:col-span-1">
          <div className="bg-slate-100 border-b border-slate-200 p-4 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">Simulation View</h2>
          </div>
          <div className="p-4 flex-1 flex flex-col items-center justify-center bg-slate-900 relative overflow-hidden">
            
            <svg viewBox="-200 -200 400 400" className="w-full max-w-[350px] aspect-square drop-shadow-xl">
              {/* Backgrounds */}
              <rect x="-200" y="-200" width="400" height="200" fill="#1e293b" /> {/* Air */}
              <rect x="-200" y="0" width="400" height="200" fill={material === 'water' ? '#0ea5e9' : material === 'oil' ? '#eab308' : material === 'glass' ? '#94a3b8' : '#8b5cf6'} opacity="0.4" /> {/* Medium */}
              
              {/* Normal Line */}
              <line x1="0" y1="-180" x2="0" y2="180" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
              
              {/* Surface Line */}
              <line x1="-180" y1="0" x2="180" y2="0" stroke="#cbd5e1" strokeWidth="2" />
              
              {/* Protractor Semi-circles */}
              <path d="M -150 0 A 150 150 0 0 1 150 0" fill="none" stroke="#475569" strokeWidth="1" />
              <path d="M -150 0 A 150 150 0 0 0 150 0" fill="none" stroke="#475569" strokeWidth="1" />
              
              {/* Protractor ticks */}
              {[...Array(19)].map((_, i) => {
                const angle = (i * 10 - 90) * Math.PI / 180;
                const isMajor = i % 3 === 0;
                return (
                  <g key={`tick-${i}`}>
                    <line 
                      x1={140 * Math.sin(angle)} 
                      y1={-140 * Math.cos(angle)} 
                      x2={150 * Math.sin(angle)} 
                      y2={-150 * Math.cos(angle)} 
                      stroke="#64748b" 
                      strokeWidth={isMajor ? 2 : 1} 
                    />
                    <line 
                      x1={140 * Math.sin(angle)} 
                      y1={140 * Math.cos(angle)} 
                      x2={150 * Math.sin(angle)} 
                      y2={150 * Math.cos(angle)} 
                      stroke="#64748b" 
                      strokeWidth={isMajor ? 2 : 1} 
                    />
                    {isMajor && i !== 9 && (
                      <text
                        x={125 * Math.sin(angle)}
                        y={-125 * Math.cos(angle)}
                        fill="#94a3b8"
                        fontSize="10"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {Math.abs(i * 10 - 90)}°
                      </text>
                    )}
                    {isMajor && i !== 9 && (
                      <text
                        x={125 * Math.sin(angle)}
                        y={125 * Math.cos(angle)}
                        fill="#94a3b8"
                        fontSize="10"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {Math.abs(i * 10 - 90)}°
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Laser Pointer Source */}
              <g transform={`rotate(${-angleI}) translate(0, -170)`}>
                <rect x="-10" y="-15" width="20" height="30" fill="#334155" rx="4" />
                <rect x="-4" y="15" width="8" height="10" fill="#ef4444" />
              </g>

              {/* Incident Ray */}
              <line 
                x1={-160 * Math.sin(radI)} 
                y1={-160 * Math.cos(radI)} 
                x2="0" 
                y2="0" 
                stroke="#ef4444" 
                strokeWidth="4" 
                className="filter drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]"
              />
              
              {/* Refracted Ray */}
              <line 
                x1="0" 
                y1="0" 
                x2={180 * Math.sin(actualR * Math.PI / 180)} 
                y2={180 * Math.cos(actualR * Math.PI / 180)} 
                stroke="#ef4444" 
                strokeWidth="4" 
                opacity="0.8"
                className="filter drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]"
              />

              {/* Angle Arcs */}
              {angleI > 0 && (
                <path 
                  d={`M 0 -40 A 40 40 0 0 0 ${-40 * Math.sin(radI)} ${-40 * Math.cos(radI)}`} 
                  fill="none" 
                  stroke="#fbbf24" 
                  strokeWidth="2" 
                />
              )}
              {actualR > 0 && (
                <path 
                  d={`M 0 40 A 40 40 0 0 1 ${40 * Math.sin(actualR * Math.PI / 180)} ${40 * Math.cos(actualR * Math.PI / 180)}`} 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="2" 
                />
              )}
            </svg>

            {/* Readout */}
            <div className="mt-6 flex justify-around w-full max-w-sm bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-inner">
              <div className="text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Incidence (θ₁)</p>
                <p className="text-2xl font-mono text-amber-400">{angleI.toFixed(1)}°</p>
              </div>
              <div className="w-px bg-slate-700"></div>
              <div className="text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Refraction (θ₂)</p>
                <p className="text-2xl font-mono text-sky-400">{measuredR.toFixed(1)}°</p>
              </div>
            </div>

          </div>
        </div>

        {/* Column 3: Data & Analysis */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="bg-slate-100 border-b border-slate-200 p-4 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">Data & Analysis</h2>
            <div className="flex gap-2">
              <button
                onClick={handleRecordData}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Record
              </button>
              <button
                onClick={handleClearData}
                className="flex items-center gap-1 bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-300 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            </div>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-6">
            
            {/* Data Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-center">θ₁ (°)</th>
                    <th className="px-3 py-2 text-center">θ₂ (°)</th>
                    <th className="px-3 py-2 text-center">sin(θ₁)</th>
                    <th className="px-3 py-2 text-center">sin(θ₂)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-slate-400 italic">
                        No data recorded yet.
                      </td>
                    </tr>
                  ) : (
                    data.map((point) => (
                      <tr key={point.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-center">{point.angleI.toFixed(1)}</td>
                        <td className="px-3 py-2 text-center">{point.angleR.toFixed(1)}</td>
                        <td className="px-3 py-2 text-center">{point.sinI.toFixed(3)}</td>
                        <td className="px-3 py-2 text-center">{point.sinR.toFixed(3)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Graph */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-sm font-bold text-slate-700 mb-2 text-center">Graph of sin(θ₁) vs sin(θ₂)</h3>
              <div className="relative w-full aspect-square max-w-[250px] mx-auto bg-slate-50 border-l-2 border-b-2 border-slate-600">
                {/* Grid lines */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((val) => (
                  <div key={`grid-${val}`}>
                    <div className="absolute left-0 right-0 border-t border-slate-100" style={{ bottom: `${val * 100}%` }} />
                    <div className="absolute top-0 bottom-0 border-l border-slate-100" style={{ left: `${val * 100}%` }} />
                  </div>
                ))}
                
                {/* Axis Labels */}
                <div className="absolute -bottom-6 left-0 right-0 text-center text-[10px] text-slate-500 font-medium">sin(θ₂)</div>
                <div className="absolute top-0 bottom-0 -left-6 flex items-center">
                  <div className="transform -rotate-90 text-[10px] text-slate-500 font-medium whitespace-nowrap">sin(θ₁)</div>
                </div>

                {/* Data Points */}
                {data.map((point) => (
                  <div
                    key={`pt-${point.id}`}
                    className="absolute w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1/2 translate-y-1/2 shadow-sm"
                    style={{
                      left: `${(point.sinR / 1.0) * 100}%`,
                      bottom: `${(point.sinI / 1.0) * 100}%`,
                    }}
                  />
                ))}

                {/* Best Fit Line (Approximate visualization if enough data) */}
                {data.length > 1 && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line 
                      x1="0" 
                      y1="100%" 
                      x2={`${(1 / currentN) * 100}%`} 
                      y2="0%" 
                      stroke="#2563eb" 
                      strokeWidth="2" 
                      strokeDasharray="4,4" 
                      opacity="0.5"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Assessment */}
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <h3 className="font-semibold text-indigo-900 mb-2">Analysis</h3>
              <p className="text-sm text-indigo-800 mb-3">
                Select "Unknown Liquid" as the medium. Record data for several angles. Calculate the gradient (sin θ₁ / sin θ₂) to find its refractive index.
              </p>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Calculated n"
                  value={assessmentAnswer}
                  onChange={(e) => setAssessmentAnswer(e.target.value)}
                  className="w-full p-2 rounded border border-indigo-200 text-sm focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={checkAssessment}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition-colors whitespace-nowrap"
                >
                  Check
                </button>
              </div>
              
              {assessmentResult === 'correct' && (
                <div className="mt-3 flex items-center gap-2 text-emerald-600 bg-emerald-50 p-2 rounded border border-emerald-200">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Correct! The index is ≈ 1.65.</span>
                </div>
              )}
              {assessmentResult === 'incorrect' && (
                <div className="mt-3 flex items-center gap-2 text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">
                  <XCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Incorrect. Try plotting the points and finding the slope.</span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
