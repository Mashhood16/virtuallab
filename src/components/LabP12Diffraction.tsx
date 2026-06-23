import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Activity, Settings2, Database, Calculator } from 'lucide-react';

export default function LabP12Diffraction({ onExit }: { onExit?: () => void }) {
  const [mode, setMode] = useState<'noise' | 'diffraction'>('diffraction');
  
  // Diffraction State
  const [wavelength, setWavelength] = useState<number>(550);
  const [linesPerMm, setLinesPerMm] = useState<number>(500);
  const [distanceL, setDistanceL] = useState<number>(2.0);
  
  // Noise State
  const [phaseShift, setPhaseShift] = useState<number>(0);
  
  // Data Logger
  const [logs, setLogs] = useState<Array<{wl: number, lpm: number, L: number, y1: number}>>([]);
  
  // Assessments
  const [ans1, setAns1] = useState('');
  const [ans2, setAns2] = useState('');
  const [feedback, setFeedback] = useState('');
  
  const [time, setTime] = useState(0);

  useEffect(() => {
    let rid: number;
    const loop = () => {
      setTime(t => t + 0.05);
      rid = requestAnimationFrame(loop);
    };
    rid = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rid);
  }, []);

  const d = 1 / (linesPerMm * 1000);
  const lambda = wavelength * 1e-9;
  const sinTheta1 = lambda / d;
  const hasM1 = sinTheta1 <= 1;
  const theta1 = hasM1 ? Math.asin(sinTheta1) : 0;
  const y1 = hasM1 ? distanceL * Math.tan(theta1) : 0;

  const handleRecord = () => {
    setLogs([...logs, { wl: wavelength, lpm: linesPerMm, L: distanceL, y1: Number(y1.toFixed(3)) }]);
  };

  const getWavelengthColor = (wl: number) => {
    let R, G, B;
    if (wl >= 380 && wl < 440) { R = -(wl - 440) / (440 - 380); G = 0; B = 1; }
    else if (wl >= 440 && wl < 490) { R = 0; G = (wl - 440) / (490 - 440); B = 1; }
    else if (wl >= 490 && wl < 510) { R = 0; G = 1; B = -(wl - 510) / (510 - 490); }
    else if (wl >= 510 && wl < 580) { R = (wl - 510) / (580 - 510); G = 1; B = 0; }
    else if (wl >= 580 && wl < 645) { R = 1; G = -(wl - 645) / (645 - 580); B = 0; }
    else if (wl >= 645 && wl <= 780) { R = 1; G = 0; B = 0; }
    else { R = 0; G = 0; B = 0; }
    
    let alpha = 1;
    if (wl > 700) alpha = 0.3 + 0.7 * (780 - wl) / (780 - 700);
    else if (wl < 420) alpha = 0.3 + 0.7 * (wl - 380) / (420 - 380);
    
    return `rgba(${Math.round(R * 255)}, ${Math.round(G * 255)}, ${Math.round(B * 255)}, ${alpha})`;
  };

  const laserColor = getWavelengthColor(wavelength);

  const checkAnswers = () => {
    let score = 0;
    if (ans1.trim() === '180') score++;
    if (ans2.trim() === '0.67') score++;
    if (score === 2) setFeedback('Perfect! You have mastered wave interference.');
    else setFeedback('Keep trying! Check your math (use two decimal places for Q2).');
  };

  const renderNoiseSVG = () => {
    const points1 = [];
    const points2 = [];
    const pointsSum = [];
    for(let x = 0; x <= 400; x += 5) {
      const rad = (x / 400) * Math.PI * 4;
      const v1 = Math.sin(rad - time);
      const v2 = Math.sin(rad - time + (phaseShift * Math.PI) / 180);
      points1.push(`${x},${100 + 40 * v1}`);
      points2.push(`${x},${100 + 40 * v2}`);
      pointsSum.push(`${x},${250 + 40 * (v1 + v2)}`);
    }
    return (
      <svg viewBox="0 0 400 350" className="w-full h-full bg-slate-900 rounded-lg shadow-inner">
        <text x="10" y="30" fill="white" fontSize="14" fontWeight="bold">Wave 1 & 2 (Original & Canceling)</text>
        <path d={`M ${points1.join(' L ')}`} stroke="#3b82f6" fill="none" strokeWidth="2" opacity="0.8" />
        <path d={`M ${points2.join(' L ')}`} stroke="#ef4444" fill="none" strokeWidth="2" opacity="0.8" />
        <line x1="0" y1="100" x2="400" y2="100" stroke="white" opacity="0.2" strokeDasharray="4" />
        
        <text x="10" y="180" fill="white" fontSize="14" fontWeight="bold">Resulting Sum Wave (Your Ear)</text>
        <path d={`M ${pointsSum.join(' L ')}`} stroke="#22c55e" fill="none" strokeWidth="3" />
        <line x1="0" y1="250" x2="400" y2="250" stroke="white" opacity="0.2" strokeDasharray="4" />
      </svg>
    );
  };

  const renderDiffractionSVG = () => {
    const gratingX = 60;
    const screenX = 60 + (distanceL / 5) * 280;
    const centerY = 175;
    const pixelsPerMeter = 60;
    const y1Svg = y1 * pixelsPerMeter;

    return (
      <svg viewBox="0 0 400 350" className="w-full h-full bg-slate-900 rounded-lg shadow-inner">
        {/* Laser Source */}
        <rect x="10" y={centerY - 10} width="30" height="20" fill="#333" rx="2" />
        <rect x="40" y={centerY - 5} width="10" height="10" fill="#555" />
        
        {/* Grating */}
        <line x1={gratingX} y1="50" x2={gratingX} y2="300" stroke="#aaa" strokeWidth="4" strokeDasharray="2 4" />
        <text x={gratingX - 25} y="40" fill="white" fontSize="12">Grating</text>

        {/* Screen */}
        <line x1={screenX} y1="50" x2={screenX} y2="300" stroke="#fff" strokeWidth="4" />
        <text x={screenX - 20} y="40" fill="white" fontSize="12">Screen</text>

        {/* Rays */}
        <line x1="50" y1={centerY} x2={gratingX} y2={centerY} stroke={laserColor} strokeWidth="3" opacity="0.9" />
        <line x1={gratingX} y1={centerY} x2={screenX} y2={centerY} stroke={laserColor} strokeWidth="2" opacity="0.6" strokeDasharray="4" />
        
        <circle cx={screenX} cy={centerY} r="5" fill={laserColor} />
        <text x={screenX + 10} y={centerY + 4} fill="white" fontSize="12">m=0</text>

        {hasM1 && (
          <>
            <line x1={gratingX} y1={centerY} x2={screenX} y2={centerY - y1Svg} stroke={laserColor} strokeWidth="2" opacity="0.6" strokeDasharray="4" />
            <line x1={gratingX} y1={centerY} x2={screenX} y2={centerY + y1Svg} stroke={laserColor} strokeWidth="2" opacity="0.6" strokeDasharray="4" />
            <circle cx={screenX} cy={centerY - y1Svg} r="5" fill={laserColor} />
            <circle cx={screenX} cy={centerY + y1Svg} r="5" fill={laserColor} />
            <text x={screenX + 10} y={centerY - y1Svg + 4} fill="white" fontSize="12">m=1</text>
            <text x={screenX + 10} y={centerY + y1Svg + 4} fill="white" fontSize="12">m=-1</text>
            
            {/* Dimension lines */}
            <line x1={screenX - 20} y1={centerY} x2={screenX - 20} y2={centerY - y1Svg} stroke="#aaa" strokeWidth="1" />
            <text x={screenX - 45} y={centerY - y1Svg/2} fill="#aaa" fontSize="10">y₁</text>
          </>
        )}
        
        {/* L dimension */}
        <line x1={gratingX} y1="320" x2={screenX} y2="320" stroke="#aaa" strokeWidth="1" />
        <text x={(gratingX + screenX)/2 - 10} y="335" fill="#aaa" fontSize="12">L = {distanceL.toFixed(1)}m</text>
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans select-none overflow-hidden">
      <div className="bg-slate-900 text-white p-4 flex items-center shadow-md shrink-0">
        <button onClick={onExit} className="flex items-center text-slate-300 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Go Back
        </button>
        <h1 className="ml-6 text-xl font-semibold">Lab P12.1: Optical Interference & Diffraction</h1>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto">
        
        {/* Left Column: Theory */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center mb-4 text-blue-700">
            <Activity className="w-6 h-6 mr-2" />
            <h2 className="text-lg font-bold">Theory & Context</h2>
          </div>
          <div className="text-slate-700 space-y-4 text-sm leading-relaxed overflow-y-auto flex-1 pr-2">
            <p>
              <strong>Interference</strong> occurs when two or more waves superpose to form a resultant wave. 
              In <em>constructive interference</em>, the peaks align to amplify the wave. In <em>destructive interference</em>, 
              a peak aligns with a trough, cancelling the wave out. This is the core principle behind noise-canceling headphones.
            </p>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <strong>Noise Cancellation:</strong><br />
              Target Wave + Anti-Noise Wave (180° shifted) = Silence.
            </div>
            <p>
              <strong>Diffraction Gratings</strong> use the same principle for light. A grating contains thousands of microscopic slits per millimeter. 
              When light passes through, it diffracts and interferes.
            </p>
            <p>
              Constructive interference creates bright spots (fringes) on a screen, governed by the equation:
            </p>
            <div className="bg-slate-100 p-3 rounded-lg font-mono text-center">
              d · sin(θ) = m · λ
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>d:</strong> Distance between slits (grating spacing)</li>
              <li><strong>θ:</strong> Angle to the maximum</li>
              <li><strong>m:</strong> Order maximum (0, 1, 2...)</li>
              <li><strong>λ:</strong> Wavelength of light</li>
            </ul>
            <p>
              To find the vertical distance <strong>y</strong> on the screen at a distance <strong>L</strong>:
            </p>
            <div className="bg-slate-100 p-3 rounded-lg font-mono text-center">
              y = L · tan(θ)
            </div>
          </div>
        </div>

        {/* Middle Column: Simulation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-blue-700">
              <Settings2 className="w-6 h-6 mr-2" />
              <h2 className="text-lg font-bold">Interactive Simulator</h2>
            </div>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button 
                onClick={() => setMode('diffraction')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${mode === 'diffraction' ? 'bg-white shadow text-blue-700' : 'text-slate-500'}`}
              >
                Grating
              </button>
              <button 
                onClick={() => setMode('noise')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${mode === 'noise' ? 'bg-white shadow text-blue-700' : 'text-slate-500'}`}
              >
                Acoustic
              </button>
            </div>
          </div>

          <div className="h-64 mb-6 rounded-lg overflow-hidden border border-slate-800">
            {mode === 'noise' ? renderNoiseSVG() : renderDiffractionSVG()}
          </div>

          <div className="flex-1 space-y-4">
            {mode === 'noise' ? (
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                    <span>Phase Shift (Degrees)</span>
                    <span className="text-blue-600 font-bold">{phaseShift}°</span>
                  </label>
                  <input type="range" min="0" max="360" value={phaseShift} onChange={(e) => setPhaseShift(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
            ) : (
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                    <span>Wavelength (λ)</span>
                    <span className="font-bold" style={{ color: laserColor }}>{wavelength} nm</span>
                  </label>
                  <input type="range" min="400" max="700" step="10" value={wavelength} onChange={(e) => setWavelength(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                    <span>Grating Lines/mm</span>
                    <span className="text-blue-600 font-bold">{linesPerMm}</span>
                  </label>
                  <input type="range" min="100" max="1000" step="100" value={linesPerMm} onChange={(e) => setLinesPerMm(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                    <span>Screen Distance (L)</span>
                    <span className="text-blue-600 font-bold">{distanceL.toFixed(1)} m</span>
                  </label>
                  <input type="range" min="1.0" max="5.0" step="0.5" value={distanceL} onChange={(e) => setDistanceL(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Assessment & Data */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 text-blue-700">
            <div className="flex items-center">
              <Database className="w-6 h-6 mr-2" />
              <h2 className="text-lg font-bold">Data & Analysis</h2>
            </div>
            {mode === 'diffraction' && (
              <button onClick={handleRecord} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-semibold transition-colors">
                Record Data
              </button>
            )}
          </div>

          {mode === 'diffraction' && (
            <div className="max-h-40 overflow-y-auto mb-6 border border-slate-200 rounded-lg">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2">λ (nm)</th>
                    <th className="px-3 py-2">lines/mm</th>
                    <th className="px-3 py-2">L (m)</th>
                    <th className="px-3 py-2 font-bold text-blue-700">y₁ (m)</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-400">No data recorded yet.</td></tr>
                  ) : (
                    logs.map((log, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="px-3 py-2">{log.wl}</td>
                        <td className="px-3 py-2">{log.lpm}</td>
                        <td className="px-3 py-2">{log.L.toFixed(1)}</td>
                        <td className="px-3 py-2 font-bold">{log.y1}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex-1 flex flex-col bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center mb-3 text-slate-800">
              <Calculator className="w-5 h-5 mr-2 text-blue-600" />
              <h3 className="font-bold">Knowledge Check</h3>
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  1. To achieve perfect noise cancellation via destructive interference, what phase shift (in degrees) is required?
                </label>
                <input 
                  type="text" 
                  value={ans1} 
                  onChange={e => setAns1(e.target.value)} 
                  placeholder="e.g. 90" 
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  2. Calculate the expected y₁ position (in meters) for a 650 nm laser using a 400 lines/mm grating at a screen distance L = 2.5 m. <em>(Round to 2 decimal places)</em>
                </label>
                <input 
                  type="text" 
                  value={ans2} 
                  onChange={e => setAns2(e.target.value)} 
                  placeholder="e.g. 0.55" 
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {feedback && (
              <div className={`mt-4 p-3 rounded text-sm flex items-start ${feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {feedback.includes('Perfect') ? <CheckCircle className="w-5 h-5 mr-2 shrink-0" /> : <XCircle className="w-5 h-5 mr-2 shrink-0" />}
                {feedback}
              </div>
            )}

            <button onClick={checkAnswers} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
              Check Answers
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
