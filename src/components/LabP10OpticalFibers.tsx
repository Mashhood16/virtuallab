import { useState } from 'react';
import { RefreshCw, Activity, Table2, Info, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

interface DataPoint {
  bendRadius: number;
  measuredPower: number;
}

export default function LabP10OpticalFibers({ onExit }: LabProps) {
  const [nCore, setNCore] = useState(1.50);
  const [nClad, setNClad] = useState(1.45);
  const [bendRadius, setBendRadius] = useState(50);
  const [laserPower, setLaserPower] = useState(5.0);
  const [isLaserOn, setIsLaserOn] = useState(false);
  const [loggedData, setLoggedData] = useState<DataPoint[]>([]);
  
  const [assessmentAns, setAssessmentAns] = useState('');
  const [assessmentStatus, setAssessmentStatus] = useState<null | 'correct' | 'incorrect'>(null);

  // Physics calculations
  const d = 2.0; // fiber thickness parameter for our model
  let T = 0;
  let criticalAngle = NaN;
  let R_leak = 0;
  
  if (nClad < nCore) {
    criticalAngle = Math.asin(nClad / nCore) * (180 / Math.PI);
    R_leak = d / (1 - nClad / nCore);
    if (bendRadius >= R_leak) {
      T = 1.0;
    } else {
      T = Math.exp(-(R_leak - bendRadius) / 20);
    }
  }

  // Add ±2% noise to measurement
  const noise = 1 + (Math.random() - 0.5) * 0.04;
  const measuredPower = isLaserOn ? (nClad < nCore ? laserPower * T * noise : 0) : 0;

  const recordData = () => {
    if (isLaserOn) {
      setLoggedData(prev => [...prev, { bendRadius, measuredPower: Number(measuredPower.toFixed(2)) }]);
    }
  };

  const checkAssessment = () => {
    const val = parseFloat(assessmentAns);
    // Question: nCore = 1.52, theta_c = 82 degrees. nClad = ?
    // nClad = 1.52 * sin(82) = 1.505
    if (!isNaN(val) && val >= 1.50 && val <= 1.51) {
      setAssessmentStatus('correct');
    } else {
      setAssessmentStatus('incorrect');
    }
  };

  // Escaping rays visual logic
  const escapingRays = [];
  if (isLaserOn) {
    if (nClad >= nCore) {
      // Complete leakage immediately
      for(let i=0; i<15; i++) {
        escapingRays.push(<line key={`l1-${i}`} x1={50 + i*15} y1={92} x2={40 + i*15} y2={40} stroke="red" strokeWidth="2" strokeOpacity={0.6}/>);
        escapingRays.push(<line key={`l2-${i}`} x1={50 + i*15} y1={108} x2={40 + i*15} y2={160} stroke="red" strokeWidth="2" strokeOpacity={0.6}/>);
      }
    } else if (T < 1) {
      // Leakage at the bend
      const numRays = Math.floor((1 - T) * 30);
      for(let i=0; i<numRays; i++) {
         const theta = -Math.PI/2 + (Math.PI * (i+1)/(numRays+1));
         const startX = 250 + bendRadius * Math.cos(theta);
         const startY = 100 + bendRadius + bendRadius * Math.sin(theta);
         const endX = startX + 60 * Math.cos(theta);
         const endY = startY + 60 * Math.sin(theta);
         escapingRays.push(<line key={`l3-${i}`} x1={startX} y1={startY} x2={endX} y2={endY} stroke="red" strokeWidth="2" strokeOpacity={1-T} />);
      }
    }
  }

  // Graph plotting
  const maxP = 10;
  const points = loggedData.map(d => {
    const x = ((d.bendRadius - 20) / 80) * 300;
    const y = 200 - (d.measuredPower / maxP) * 200;
    return `${x},${y}`;
  });

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Unit 19: Optical Fibers & Total Internal Reflection" subtitle="Quantitative analysis of critical angles and macrobending loss." />

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: Theory & Setup */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600"/> Theory</h2>
            <p className="text-sm text-slate-600 mb-4">
              Total Internal Reflection (TIR) occurs when light travels from a denser to a less dense medium (n₁ {'>'} n₂) and the angle of incidence exceeds the <strong>critical angle</strong> (θ_c):
            </p>
            <div className="bg-blue-50 p-3 rounded-lg text-center font-mono text-blue-900 mb-4 font-bold border border-blue-100">
              sin(θ_c) = n₂ / n₁
            </div>
            <p className="text-sm text-slate-600">
              If an optical fiber is bent too sharply, light rays hit the boundary at angles smaller than θ_c, causing light to leak out (macrobending loss).
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-600"/> Setup</h2>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-slate-700">Core Index (n₁)</span>
                  <span className="text-indigo-600 font-mono">{nCore.toFixed(2)}</span>
                </div>
                <input type="range" min="1.40" max="1.60" step="0.01" value={nCore} onChange={(e) => setNCore(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-slate-700">Cladding Index (n₂)</span>
                  <span className="text-indigo-600 font-mono">{nClad.toFixed(2)}</span>
                </div>
                <input type="range" min="1.30" max="1.55" step="0.01" value={nClad} onChange={(e) => setNClad(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-slate-700">Bend Radius (mm)</span>
                  <span className="text-indigo-600 font-mono">{bendRadius}</span>
                </div>
                <input type="range" min="20" max="100" step="1" value={bendRadius} onChange={(e) => setBendRadius(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-slate-700">Input Laser Power (mW)</span>
                  <span className="text-indigo-600 font-mono">{laserPower.toFixed(1)}</span>
                </div>
                <input type="range" min="1.0" max="10.0" step="0.5" value={laserPower} onChange={(e) => setLaserPower(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-sm text-slate-500 mb-1">Calculated Critical Angle:</div>
              <div className={`text-xl font-mono font-bold ${isNaN(criticalAngle) ? 'text-red-500' : 'text-slate-800'}`}>
                {isNaN(criticalAngle) ? 'No TIR (n₁ ≤ n₂)' : `${criticalAngle.toFixed(1)}°`}
              </div>
            </div>

            <button 
              onClick={() => setIsLaserOn(!isLaserOn)}
              className={`mt-4 w-full py-3 rounded-xl font-bold text-white transition-colors ${isLaserOn ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-800'}`}
            >
              {isLaserOn ? 'Turn Laser OFF' : 'Turn Laser ON'}
            </button>
          </div>
        </div>

        {/* MIDDLE: Simulation */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 flex flex-col relative overflow-hidden h-full min-h-[500px]">
          <div className="absolute top-4 left-4 text-white font-medium text-sm flex items-center gap-2 z-10">
            <Info className="w-4 h-4 text-blue-400" /> Virtual Fiber Optic Bench
          </div>
          
          <div className="flex-1 relative w-full flex items-center justify-center p-8">
            <svg className="w-full h-full" viewBox="0 0 450 350" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Laser Source Box */}
              <rect x="5" y="80" width="40" height="40" fill="#27272a" rx="4" stroke="#52525b" strokeWidth="2" />
              <rect x="45" y="95" width="5" height="10" fill={isLaserOn ? "#ef4444" : "#7f1d1d"} />

              {/* The Fiber Path */}
              {/* Cladding */}
              <path 
                d={`M 50 100 L 250 100 A ${bendRadius} ${bendRadius} 0 0 1 250 ${100 + 2*bendRadius} L 50 ${100 + 2*bendRadius}`} 
                fill="none" stroke="#64748b" strokeWidth="24" strokeLinecap="round" strokeOpacity="0.4"
              />
              {/* Core */}
              <path 
                d={`M 50 100 L 250 100 A ${bendRadius} ${bendRadius} 0 0 1 250 ${100 + 2*bendRadius} L 50 ${100 + 2*bendRadius}`} 
                fill="none" stroke="#cbd5e1" strokeWidth="14" strokeLinecap="round" strokeOpacity="0.6"
              />

              {/* Escaping Rays */}
              {escapingRays}

              {/* Internal Laser Guided Path */}
              {isLaserOn && T > 0 && nClad < nCore && (
                <path 
                  d={`M 50 100 L 250 100 A ${bendRadius} ${bendRadius} 0 0 1 250 ${100 + 2*bendRadius} L 50 ${100 + 2*bendRadius}`} 
                  fill="none" stroke="#ef4444" strokeWidth="4" 
                  strokeOpacity={0.4 + 0.6 * T}
                  filter="url(#glow)"
                />
              )}

              {/* Receiver (Photodiode) */}
              <rect x="5" y={100 + 2*bendRadius - 20} width="40" height="40" fill="#1e293b" rx="20" stroke="#475569" strokeWidth="2" />
              <circle cx="25" cy={100 + 2*bendRadius} r="10" fill={isLaserOn && T > 0.1 ? "#ef4444" : "#000"} filter={isLaserOn && T > 0.1 ? "url(#glow)" : ""} />

            </svg>
          </div>

          <div className="bg-slate-800 p-4 border-t border-slate-700 flex justify-between items-center text-white">
            <div className="text-sm text-slate-400">Power Meter</div>
            <div className="font-mono text-2xl font-bold text-emerald-400">
              {measuredPower.toFixed(2)} <span className="text-sm text-emerald-600">mW</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Data & Assessment */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Table2 className="w-5 h-5 text-emerald-600"/> Data Log</h2>
              <button 
                onClick={recordData}
                disabled={!isLaserOn}
                className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md text-sm font-bold hover:bg-emerald-200 disabled:opacity-50"
              >
                Record Data
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg mb-4">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="p-3 font-semibold text-slate-700">R (mm)</th>
                    <th className="p-3 font-semibold text-slate-700">Power (mW)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loggedData.length === 0 && <tr><td colSpan={2} className="p-4 text-center text-slate-400 italic">No data recorded</td></tr>}
                  {loggedData.map((d, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-600">{d.bendRadius}</td>
                      <td className="p-3 font-mono text-slate-600">{d.measuredPower.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="h-32 border border-slate-200 rounded-lg p-2 relative bg-slate-50">
              <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-bold">Power vs Radius</div>
              <svg className="w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none">
                {/* Axes */}
                <line x1="0" y1="200" x2="300" y2="200" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="0" y1="0" x2="0" y2="200" stroke="#cbd5e1" strokeWidth="2" />
                {/* Points */}
                {points.length > 1 && (
                  <polyline points={points.join(' ')} fill="none" stroke="#10b981" strokeWidth="2" opacity="0.3" />
                )}
                {points.map((p, i) => {
                  const [x, y] = p.split(',');
                  return <circle key={i} cx={x} cy={y} r="4" fill="#10b981" />;
                })}
              </svg>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-6 text-white flex-1">
            <h2 className="text-lg font-bold mb-3 text-amber-400">Analysis Assessment</h2>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              A faulty optical fiber starts leaking light heavily when it bends. Experimental data reveals its critical angle is <strong>82.0°</strong>, and you know the core index is <strong>1.52</strong>. Calculate the refractive index of the cladding.
            </p>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. 1.45"
                value={assessmentAns}
                onChange={e => setAssessmentAns(e.target.value)}
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
              />
              <button onClick={checkAssessment} className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg font-bold text-sm">
                Check
              </button>
            </div>
            {assessmentStatus === 'correct' && <div className="mt-3 text-emerald-400 text-sm font-bold">✓ Correct! n_clad ≈ 1.505</div>}
            {assessmentStatus === 'incorrect' && <div className="mt-3 text-rose-400 text-sm font-bold">✗ Incorrect. Hint: sin(82°) = n_clad / 1.52</div>}
          </div>
        </div>

      </div>
    </div>
  );
}
