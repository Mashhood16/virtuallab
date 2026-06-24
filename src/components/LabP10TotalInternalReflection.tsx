import { useState, useEffect } from 'react';
import { Save, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit?: () => void;
}

const MATERIALS = [
  { id: 'water', name: 'Water', n: 1.33 },
  { id: 'glass', name: 'Crown Glass', n: 1.52 },
  { id: 'diamond', name: 'Diamond', n: 2.42 },
  { id: 'mystery', name: 'Mystery Material', n: 1.65 }, // Unknown to user
];

export default function LabP10TotalInternalReflection({ onExit }: LabProps) {
  const [materialId, setMaterialId] = useState('glass');
  const [angle1, setAngle1] = useState(30); // Incident angle in denser medium
  
  const [data, setData] = useState<Array<{ id: number; theta1: number; theta2: number | 'TIR'; n1: number }>>([]);
  const [assessmentInput, setAssessmentInput] = useState('');
  const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  // Noise for real-world complexity
  const [noise, setNoise] = useState(0);

  const selectedMaterial = MATERIALS.find(m => m.id === materialId) || MATERIALS[0];
  const n1 = selectedMaterial.n;
  const n2 = 1.0; // Air

  useEffect(() => {
    // Add ±0.5 deg noise to refracted measurement when angle changes
    setNoise((Math.random() - 0.5) * 1.0);
  }, [angle1, materialId]);

  // Snell's Law Calculations
  const criticalAngle = Math.asin(n2 / n1) * (180 / Math.PI);
  const isTIR = angle1 >= criticalAngle;

  let trueTheta2 = 0;
  let measuredTheta2: number | 'TIR' = 'TIR';

  if (!isTIR) {
    const sinTheta2 = (n1 / n2) * Math.sin(angle1 * (Math.PI / 180));
    trueTheta2 = Math.asin(sinTheta2) * (180 / Math.PI);
    measuredTheta2 = Number((trueTheta2 + noise).toFixed(1));
  }

  const recordData = () => {
    setData(prev => [
      ...prev,
      {
        id: Date.now(),
        theta1: angle1,
        theta2: measuredTheta2,
        n1: materialId === 'mystery' ? NaN : n1
      }
    ]);
  };

  const checkAssessment = () => {
    const userAns = parseFloat(assessmentInput);
    if (isNaN(userAns)) return;
    // Accept ±0.05 error
    if (Math.abs(userAns - 1.65) <= 0.05) {
      setAssessmentStatus('correct');
    } else {
      setAssessmentStatus('incorrect');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Unit 14: Total Internal Reflection" subtitle="Investigate Snell's Law and the Critical Angle." />

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
        
        {/* Column 1: Theory & Setup */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Theory & Setup</h2>
          <div className="prose prose-sm text-slate-600 mb-6">
            <p>
              When light travels from a <strong>denser</strong> to a <strong>less dense</strong> medium (e.g., Glass to Air), it bends <em>away</em> from the normal. This is governed by Snell's Law:
            </p>
            <div className="bg-slate-100 p-3 rounded-lg text-center font-mono font-bold text-sm">
              n₁ · sin(θ₁) = n₂ · sin(θ₂)
            </div>
            <p className="mt-2">
              If the angle of incidence <span className="font-mono">θ₁</span> is increased, <span className="font-mono">θ₂</span> eventually reaches 90°. The incident angle at which this occurs is the <strong>Critical Angle (θ_c)</strong>. If <span className="font-mono">θ₁ &gt; θ_c</span>, all light is reflected back (Total Internal Reflection).
            </p>
          </div>

          <div className="space-y-6 flex-1">
            <div>
              <label className="flex justify-between font-medium text-sm text-slate-700 mb-1">
                <span>Denser Medium (n₁)</span>
              </label>
              <select 
                value={materialId} 
                onChange={(e) => setMaterialId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md bg-slate-50"
              >
                {MATERIALS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex justify-between font-medium text-sm text-slate-700 mb-1">
                <span>Less Dense Medium (n₂)</span>
              </label>
              <div className="w-full p-2 border border-slate-200 rounded-md bg-slate-100 text-slate-500 font-mono">
                Air (n = 1.00)
              </div>
            </div>

            <div>
              <label className="flex justify-between font-medium text-sm text-slate-700 mb-1">
                <span>Angle of Incidence (θ₁)</span>
                <span className="text-blue-600 font-bold">{angle1}°</span>
              </label>
              <input 
                type="range" min="0" max="85" step="1"
                value={angle1}
                onChange={(e) => setAngle1(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Column 2: Simulation */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-700 p-6 flex flex-col items-center relative overflow-hidden">
          <h2 className="text-lg font-bold text-white mb-4 w-full text-left">Simulation</h2>
          
          <div className="flex-1 w-full flex items-center justify-center relative">
            <svg width="100%" height="100%" viewBox="-200 -200 400 400" className="bg-black rounded-lg shadow-inner">
              
              {/* Air Medium (Top Half) */}
              <rect x="-200" y="-200" width="400" height="200" fill="#0f172a" />
              <text x="180" y="-180" fill="#475569" fontSize="14" textAnchor="end" fontWeight="bold">Air (n=1.00)</text>

              {/* Denser Medium (Bottom Half) */}
              <rect x="-200" y="0" width="400" height="200" fill="#1e3a8a" opacity="0.6" />
              <text x="180" y="180" fill="#60a5fa" fontSize="14" textAnchor="end" fontWeight="bold" opacity="0.8">
                {selectedMaterial.name} {materialId === 'mystery' ? '(?)' : `(n=${n1})`}
              </text>

              {/* Normal Line */}
              <line x1="0" y1="-180" x2="0" y2="180" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" />

              {/* Boundary */}
              <line x1="-200" y1="0" x2="200" y2="0" stroke="#38bdf8" strokeWidth="2" />

              {/* Laser Source */}
              <g transform={`rotate(${angle1})`}>
                <rect x="-8" y="160" width="16" height="30" fill="#333" rx="2" />
                <circle cx="0" cy="160" r="4" fill="#22c55e" />
              </g>

              {/* Incident Ray */}
              <line 
                x1={160 * Math.sin(angle1 * Math.PI / 180)} 
                y1={160 * Math.cos(angle1 * Math.PI / 180)} 
                x2="0" y2="0" 
                stroke="#22c55e" strokeWidth="3" 
                style={{ filter: 'drop-shadow(0px 0px 4px #22c55e)' }} 
              />

              {/* Weak Reflected Ray (always present) */}
              <line 
                x1="0" y1="0" 
                x2={-160 * Math.sin(angle1 * Math.PI / 180)} 
                y2={160 * Math.cos(angle1 * Math.PI / 180)} 
                stroke="#22c55e" strokeWidth={isTIR ? 3 : 1} 
                opacity={isTIR ? 1 : 0.3}
                style={{ filter: isTIR ? 'drop-shadow(0px 0px 4px #22c55e)' : 'none' }} 
              />

              {/* Refracted Ray */}
              {!isTIR && (
                <line 
                  x1="0" y1="0" 
                  x2={-160 * Math.sin(trueTheta2 * Math.PI / 180)} 
                  y2={-160 * Math.cos(trueTheta2 * Math.PI / 180)} 
                  stroke="#22c55e" strokeWidth="3" 
                  style={{ filter: 'drop-shadow(0px 0px 4px #22c55e)' }} 
                />
              )}

              {/* Arc for theta1 */}
              <path 
                d={`M 0 40 A 40 40 0 0 0 ${40 * Math.sin(angle1 * Math.PI / 180)} ${40 * Math.cos(angle1 * Math.PI / 180)}`} 
                fill="none" stroke="#facc15" strokeWidth="1.5" 
              />
              <text x={20 * Math.sin(angle1/2 * Math.PI / 180)} y={20 * Math.cos(angle1/2 * Math.PI / 180) + 15} fill="#facc15" fontSize="12" textAnchor="middle">θ₁</text>

              {/* Arc for theta2 */}
              {!isTIR && (
                <>
                  <path 
                    d={`M 0 -40 A 40 40 0 0 1 ${-40 * Math.sin(trueTheta2 * Math.PI / 180)} ${-40 * Math.cos(trueTheta2 * Math.PI / 180)}`} 
                    fill="none" stroke="#f87171" strokeWidth="1.5" 
                  />
                  <text x={-20 * Math.sin(trueTheta2/2 * Math.PI / 180) - 10} y={-20 * Math.cos(trueTheta2/2 * Math.PI / 180) - 10} fill="#f87171" fontSize="12" textAnchor="middle">θ₂</text>
                </>
              )}
            </svg>

            {isTIR && (
              <div className="absolute top-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-1 rounded font-bold animate-pulse text-sm">
                TOTAL INTERNAL REFLECTION
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Data & Assessment */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Data Logger</h2>
            <button 
              onClick={recordData}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium transition-colors"
            >
              <Save className="w-4 h-4" /> Record Data
            </button>
          </div>

          <div className="overflow-auto max-h-40 border border-slate-200 rounded-lg mb-4">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 border-b">n₁</th>
                  <th className="px-3 py-2 border-b">θ₁ (°)</th>
                  <th className="px-3 py-2 border-b">Measured θ₂ (°)</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-center text-slate-400 italic">No data recorded yet</td>
                  </tr>
                )}
                {data.map(d => (
                  <tr key={d.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-3 py-2">{Number.isNaN(d.n1) ? '?' : d.n1}</td>
                    <td className="px-3 py-2">{d.theta1}</td>
                    <td className={`px-3 py-2 font-medium ${d.theta2 === 'TIR' ? 'text-red-500' : 'text-blue-600'}`}>{d.theta2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-4 relative mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase absolute top-2 left-3">sin(θ₁) vs sin(θ₂)</h3>
            <div className="w-full h-full pt-6">
               <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <line x1="10" y1="90" x2="100" y2="90" stroke="#cbd5e1" strokeWidth="1" />
                 <line x1="10" y1="10" x2="10" y2="90" stroke="#cbd5e1" strokeWidth="1" />
                 
                 {data.filter(d => d.theta2 !== 'TIR').map((d, i) => {
                   // x-axis: sin(theta2) from 0 to 1
                   const sin2 = Math.sin((d.theta2 as number) * Math.PI / 180);
                   const x = 10 + sin2 * 90;
                   // y-axis: sin(theta1) from 0 to 1
                   const sin1 = Math.sin(d.theta1 * Math.PI / 180);
                   const y = 90 - sin1 * 80;
                   return <circle key={i} cx={x} cy={y} r="2.5" fill="#3b82f6" />;
                 })}
               </svg>
            </div>
            <p className="absolute bottom-1 right-2 text-[10px] text-slate-400">Slope = n₂ / n₁</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-bold text-amber-800 text-sm mb-2">Assessment: Mystery Material</h3>
            <p className="text-xs text-amber-700 mb-3">
              Select the "Mystery Material". Slowly increase <span className="font-mono">θ₁</span> until TIR occurs to find the Critical Angle <span className="font-mono">θ_c</span>. Then calculate its refractive index using <span className="font-mono">n₁ = 1 / sin(θ_c)</span>.
            </p>
            <div className="flex gap-2">
              <input 
                type="number" 
                step="0.01"
                placeholder="e.g. 1.50"
                value={assessmentInput}
                onChange={(e) => { setAssessmentInput(e.target.value); setAssessmentStatus('idle'); }}
                className="flex-1 px-3 py-1.5 border border-amber-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-xs self-center text-amber-700 font-bold mr-2">n</span>
              <button 
                onClick={checkAssessment}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm font-bold transition-colors"
              >
                Check
              </button>
            </div>
            {assessmentStatus === 'correct' && (
              <div className="mt-2 flex items-center gap-1 text-emerald-600 text-sm font-bold">
                <CheckCircle className="w-4 h-4" /> Correct! n ≈ 1.65.
              </div>
            )}
            {assessmentStatus === 'incorrect' && (
              <div className="mt-2 flex items-center gap-1 text-red-600 text-sm font-bold">
                <XCircle className="w-4 h-4" /> Incorrect. Find where θ₂ hits 90°!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
