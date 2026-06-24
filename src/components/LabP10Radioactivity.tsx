import { useState, useEffect } from 'react';
import { RefreshCw, Activity, Table2, Info, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

type SourceType = 'Alpha' | 'Beta' | 'Gamma';
type AbsorberType = 'Paper' | 'Aluminum' | 'Lead';

interface DataPoint {
  source: SourceType;
  absorber: AbsorberType;
  thickness: number;
  cpm: number;
}

export default function LabP10Radioactivity({ onExit }: LabProps) {
  const [source, setSource] = useState<SourceType>('Gamma');
  const [absorber, setAbsorber] = useState<AbsorberType>('Lead');
  const [thickness, setThickness] = useState(10);
  const [sourceOpen, setSourceOpen] = useState(false);
  
  const [currentCPM, setCurrentCPM] = useState(25); // background
  const [loggedData, setLoggedData] = useState<DataPoint[]>([]);
  
  const [assessmentAns, setAssessmentAns] = useState('');
  const [assessmentStatus, setAssessmentStatus] = useState<null | 'correct' | 'incorrect'>(null);

  const sourceData = {
    Alpha: { I0: 1000, color: '#ef4444', desc: 'Helium nucleus, highly ionizing, low penetration.' },
    Beta: { I0: 2500, color: '#3b82f6', desc: 'High-speed electron, moderate penetration.' },
    Gamma: { I0: 4000, color: '#22c55e', desc: 'High-energy photon, very high penetration.' }
  };

  const muData = {
    Paper: { Alpha: 100, Beta: 0.2, Gamma: 0.0001 },
    Aluminum: { Alpha: 1000, Beta: 1.5, Gamma: 0.01 },
    Lead: { Alpha: 1000, Beta: 1000, Gamma: 0.0693 }
  };

  const absorberColors = {
    Paper: '#fef3c7',
    Aluminum: '#cbd5e1',
    Lead: '#475569'
  };

  // Physics calculation
  const bgCPM = 25;
  const mu = muData[absorber][source];
  const expectedCPM = sourceOpen ? sourceData[source].I0 * Math.exp(-mu * thickness) + bgCPM : bgCPM;
  const transmissionRatio = sourceOpen ? Math.exp(-mu * thickness) : 0;

  // Simulate GM tube counts live
  useEffect(() => {
    const interval = setInterval(() => {
      // Add Poisson-like noise
      const noise = (Math.random() - 0.5) * Math.sqrt(expectedCPM) * 2;
      setCurrentCPM(Math.max(0, Math.round(expectedCPM + noise)));
    }, 500);
    return () => clearInterval(interval);
  }, [expectedCPM]);

  const recordData = () => {
    setLoggedData(prev => [...prev, { source, absorber, thickness, cpm: currentCPM }]);
  };

  const checkAssessment = () => {
    const val = parseFloat(assessmentAns);
    // Question: half-thickness = 10mm. mu = ln(2)/10 = 0.0693
    if (!isNaN(val) && val >= 0.069 && val <= 0.070) {
      setAssessmentStatus('correct');
    } else {
      setAssessmentStatus('incorrect');
    }
  };

  const maxCPM = 4000;
  const points = loggedData.map(d => {
    const x = (d.thickness / 30) * 300;
    const y = 200 - (d.cpm / maxCPM) * 200;
    return `${x},${y}`;
  });

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Unit 20: Radioactivity & Attenuation" subtitle="Quantitative analysis of ionizing radiation absorption." />

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: Theory & Setup */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-purple-600"/> Theory</h2>
            <p className="text-sm text-slate-600 mb-4">
              Radiation intensity <strong>I</strong> decreases exponentially as it passes through an absorber of thickness <strong>x</strong>:
            </p>
            <div className="bg-purple-50 p-3 rounded-lg text-center font-mono text-purple-900 mb-4 font-bold border border-purple-100">
              I = I₀ e^(-μx)
            </div>
            <p className="text-sm text-slate-600">
              Where <strong>I₀</strong> is the initial intensity and <strong>μ</strong> is the linear attenuation coefficient. 
              The <em>half-thickness</em> is the thickness needed to halve the intensity: <strong>x_½ = ln(2) / μ</strong>.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-purple-600"/> Setup</h2>
            
            <div className="space-y-5">
              <div>
                <div className="text-sm font-medium mb-2 text-slate-700">Source Type</div>
                <div className="flex gap-2">
                  {(['Alpha', 'Beta', 'Gamma'] as SourceType[]).map(s => (
                    <button 
                      key={s} onClick={() => setSource(s)}
                      className={`flex-1 py-2 rounded-md text-sm font-bold border transition-colors ${source === s ? 'bg-purple-100 border-purple-500 text-purple-800' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-slate-500 mt-2">{sourceData[source].desc}</div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2 text-slate-700">Absorber Material</div>
                <div className="flex gap-2">
                  {(['Paper', 'Aluminum', 'Lead'] as AbsorberType[]).map(a => (
                    <button 
                      key={a} onClick={() => setAbsorber(a)}
                      className={`flex-1 py-2 rounded-md text-sm font-bold border transition-colors ${absorber === a ? 'bg-purple-100 border-purple-500 text-purple-800' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-slate-700">Absorber Thickness</span>
                  <span className="text-purple-600 font-mono">{thickness} mm</span>
                </div>
                <input type="range" min="0" max="30" step="1" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="w-full accent-purple-600" />
              </div>
            </div>

            <button 
              onClick={() => setSourceOpen(!sourceOpen)}
              className={`mt-6 w-full py-3 rounded-xl font-bold text-white transition-colors ${sourceOpen ? 'bg-amber-500 hover:bg-amber-600 text-amber-950' : 'bg-slate-700 hover:bg-slate-800'}`}
            >
              {sourceOpen ? 'CLOSE LEAD SHIELD' : 'OPEN LEAD SHIELD'}
            </button>
          </div>
        </div>

        {/* MIDDLE: Simulation */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 flex flex-col relative overflow-hidden h-full min-h-[500px]">
          <div className="absolute top-4 left-4 text-white font-medium text-sm flex items-center gap-2 z-10">
            <Info className="w-4 h-4 text-purple-400" /> Virtual Geiger-Muller Bench
          </div>
          
          <div className="flex-1 relative w-full flex flex-col items-center justify-center p-8">
            
            <svg className="w-full h-48" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Source Box */}
              <rect x="20" y="60" width="60" height="80" fill="#334155" rx="4" stroke="#475569" strokeWidth="2" />
              <rect x="75" y="90" width="10" height="20" fill="#000" />
              {/* Cover */}
              <rect x="80" y={sourceOpen ? 20 : 80} width="10" height="40" fill="#64748b" rx="2" className="transition-all duration-500" />

              {/* Radiation Rays (Before Absorber) */}
              {sourceOpen && (
                <>
                  <line x1="85" y1="100" x2="200" y2="100" stroke={sourceData[source].color} strokeWidth="4" strokeDasharray="10 5" filter="url(#glow)" className="animate-[dash_0.5s_linear_infinite]" />
                  <line x1="85" y1="90" x2="200" y2="90" stroke={sourceData[source].color} strokeWidth="2" strokeDasharray="10 5" opacity="0.6" filter="url(#glow)" className="animate-[dash_0.5s_linear_infinite]" />
                  <line x1="85" y1="110" x2="200" y2="110" stroke={sourceData[source].color} strokeWidth="2" strokeDasharray="10 5" opacity="0.6" filter="url(#glow)" className="animate-[dash_0.5s_linear_infinite]" />
                </>
              )}

              {/* Absorber */}
              {thickness > 0 && (
                <rect 
                  x="200" 
                  y="50" 
                  width={Math.max(4, thickness * 2)} 
                  height="100" 
                  fill={absorberColors[absorber]} 
                  stroke="#334155" 
                  strokeWidth="2" 
                />
              )}

              {/* Radiation Rays (After Absorber) */}
              {sourceOpen && transmissionRatio > 0.01 && (
                <>
                  <line x1={200 + Math.max(4, thickness * 2)} y1="100" x2="350" y2="100" stroke={sourceData[source].color} strokeWidth="4" strokeDasharray="10 5" opacity={transmissionRatio} filter="url(#glow)" className="animate-[dash_0.5s_linear_infinite]" />
                  <line x1={200 + Math.max(4, thickness * 2)} y1="90" x2="350" y2="90" stroke={sourceData[source].color} strokeWidth="2" strokeDasharray="10 5" opacity={transmissionRatio * 0.6} filter="url(#glow)" className="animate-[dash_0.5s_linear_infinite]" />
                  <line x1={200 + Math.max(4, thickness * 2)} y1="110" x2="350" y2="110" stroke={sourceData[source].color} strokeWidth="2" strokeDasharray="10 5" opacity={transmissionRatio * 0.6} filter="url(#glow)" className="animate-[dash_0.5s_linear_infinite]" />
                </>
              )}

              {/* GM Tube */}
              <rect x="350" y="70" width="40" height="60" fill="#1e293b" rx="4" stroke="#475569" strokeWidth="2" />
              <rect x="345" y="80" width="10" height="40" fill="#94a3b8" rx="2" />

              <style>{`
                @keyframes dash {
                  to { stroke-dashoffset: -15; }
                }
              `}</style>
            </svg>

            {/* Audio Blips Visualization */}
            <div className="mt-8 flex gap-1 h-8 items-end">
              {[...Array(20)].map((_, i) => (
                 <div key={i} className="w-2 bg-purple-500 transition-all duration-75 rounded-t" style={{ height: `${Math.random() * Math.min(100, currentCPM / 40)}%` }} />
              ))}
            </div>

          </div>

          <div className="bg-slate-800 p-4 border-t border-slate-700 flex justify-between items-center text-white">
            <div className="text-sm text-slate-400">GM Tube Count Rate</div>
            <div className="font-mono text-3xl font-bold text-amber-400">
              {currentCPM} <span className="text-sm text-amber-600">CPM</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Data & Assessment */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Table2 className="w-5 h-5 text-purple-600"/> Data Log</h2>
              <button 
                onClick={recordData}
                disabled={!sourceOpen}
                className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md text-sm font-bold hover:bg-purple-200 disabled:opacity-50"
              >
                Record Data
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg mb-4">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="p-3 font-semibold text-slate-700">Source</th>
                    <th className="p-3 font-semibold text-slate-700">Mat.</th>
                    <th className="p-3 font-semibold text-slate-700">x (mm)</th>
                    <th className="p-3 font-semibold text-slate-700">CPM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loggedData.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-slate-400 italic">No data recorded</td></tr>}
                  {loggedData.map((d, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-600">{d.source}</td>
                      <td className="p-3 font-mono text-slate-600">{d.absorber}</td>
                      <td className="p-3 font-mono text-slate-600">{d.thickness}</td>
                      <td className="p-3 font-mono font-bold text-purple-600">{d.cpm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="h-32 border border-slate-200 rounded-lg p-2 relative bg-slate-50">
              <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-bold">CPM vs Thickness</div>
              <svg className="w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none">
                <line x1="0" y1="200" x2="300" y2="200" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="0" y1="0" x2="0" y2="200" stroke="#cbd5e1" strokeWidth="2" />
                {points.length > 1 && (
                  <polyline points={points.join(' ')} fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.5" />
                )}
                {points.map((p, i) => {
                  const [x, y] = p.split(',');
                  return <circle key={i} cx={x} cy={y} r="4" fill="#9333ea" />;
                })}
              </svg>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-6 text-white flex-1">
            <h2 className="text-lg font-bold mb-3 text-amber-400">Analysis Assessment</h2>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Based on the formula <code>I = I₀ e^(-μx)</code>, if a student finds that exactly <strong>10 mm</strong> of Lead is required to halve the Gamma ray count rate, calculate the attenuation coefficient <strong>μ</strong> of Lead in mm⁻¹. (Use ln(2) ≈ 0.693).
            </p>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. 0.05"
                value={assessmentAns}
                onChange={e => setAssessmentAns(e.target.value)}
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
              />
              <button onClick={checkAssessment} className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg font-bold text-sm">
                Check
              </button>
            </div>
            {assessmentStatus === 'correct' && <div className="mt-3 text-emerald-400 text-sm font-bold">✓ Correct! μ ≈ 0.0693 mm⁻¹</div>}
            {assessmentStatus === 'incorrect' && <div className="mt-3 text-rose-400 text-sm font-bold">✗ Incorrect. Hint: μ = ln(2) / x_½</div>}
          </div>
        </div>

      </div>
    </div>
  );
}
