import { useState, useEffect } from 'react';
import { Save, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit?: () => void;
}

export default function LabP10PlaneMirror({ onExit }: LabProps) {
  const [objectDist, setObjectDist] = useState(20); // cm
  const [rayAngle, setRayAngle] = useState(15); // degrees
  const [isMystery, setIsMystery] = useState(false);
  const [mysteryDist] = useState(37); // Secret distance
  
  const [measuredDi, setMeasuredDi] = useState<number>(0);
  const [data, setData] = useState<Array<{ id: number; do: number; theta: number; di: number }>>([]);
  const [assessmentInput, setAssessmentInput] = useState('');
  const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  // Noise states to keep the image stable unless inputs change
  const [noise1, setNoise1] = useState(0);
  const [noise2, setNoise2] = useState(0);

  const actualDist = isMystery ? mysteryDist : objectDist;

  useEffect(() => {
    // Generate new random noise when inputs change
    const n1 = (Math.random() - 0.5) * 2; // ±1 degree
    const n2 = (Math.random() - 0.5) * 2; // ±1 degree
    setNoise1(n1);
    setNoise2(n2);
  }, [actualDist, rayAngle]);

  useEffect(() => {
    // Ray tracing calculation
    // Object at (-do, 0). Hits mirror at (0, y1) and (0, -y1)
    const thetaRad = rayAngle * (Math.PI / 180);
    const y1 = actualDist * Math.tan(thetaRad);
    
    // Slopes of virtual rays extending to the right (+x)
    // Ray 1 (top): virtual ray goes down-right
    const m1 = Math.tan((-rayAngle + noise1) * (Math.PI / 180));
    // Ray 2 (bottom): virtual ray goes up-right
    const m2 = Math.tan((rayAngle + noise2) * (Math.PI / 180));
    
    // Intersection: m1*x + y1 = m2*x - y1 => x(m1 - m2) = -2*y1
    let xi = 0;
    if (Math.abs(m1 - m2) > 0.001) {
      xi = (-2 * y1) / (m1 - m2);
    } else {
      xi = actualDist; // fallback
    }
    
    setMeasuredDi(Math.max(0, xi));
  }, [actualDist, rayAngle, noise1, noise2]);

  const recordData = () => {
    setData(prev => [
      ...prev,
      {
        id: Date.now(),
        do: isMystery ? NaN : objectDist,
        theta: rayAngle,
        di: Number(measuredDi.toFixed(1))
      }
    ]);
  };

  const checkAssessment = () => {
    const userAns = parseFloat(assessmentInput);
    if (isNaN(userAns)) return;
    // Accept ±2 cm error
    if (Math.abs(userAns - mysteryDist) <= 2.0) {
      setAssessmentStatus('correct');
    } else {
      setAssessmentStatus('incorrect');
    }
  };

  // Coordinates for SVG
  const scale = 3; // 1 cm = 3 px
  const svgW = 600;
  const svgH = 400;
  const cx = svgW / 2;
  const cy = svgH / 2;

  const x_obj = cx - actualDist * scale;
  const y_hit1 = cy - actualDist * Math.tan(rayAngle * Math.PI / 180) * scale;
  const y_hit2 = cy + actualDist * Math.tan(rayAngle * Math.PI / 180) * scale;
  
  const x_img = cx + measuredDi * scale;
  
  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Unit 14: Plane Mirror & Ray Tracing" subtitle="Investigate virtual images using the parallax pin method with real-world noise." />

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
        
        {/* Column 1: Theory & Setup */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Theory & Setup</h2>
          <div className="prose prose-sm text-slate-600 mb-6">
            <p>
              An image formed by a plane mirror is <strong>virtual</strong>, <strong>upright</strong>, and <strong>laterally inverted</strong>.
            </p>
            <p>
              In a real lab, students use pins to trace reflected rays and locate the image. Because measuring angles is prone to human error (e.g., ±1°), the calculated image distance <span className="font-mono">d_i</span> can vary from the true object distance <span className="font-mono">d_o</span>.
            </p>
            <div className="bg-slate-100 p-3 rounded-lg text-center font-mono font-bold text-sm">
              Law of Reflection: θ_incident = θ_reflected
            </div>
          </div>

          <div className="space-y-6 flex-1">
            <div>
              <label className="flex justify-between font-medium text-sm text-slate-700 mb-1">
                <span>Object Type</span>
              </label>
              <select 
                value={isMystery ? 'mystery' : 'standard'} 
                onChange={(e) => setIsMystery(e.target.value === 'mystery')}
                className="w-full p-2 border border-slate-300 rounded-md bg-slate-50"
              >
                <option value="standard">Standard Object (Known Distance)</option>
                <option value="mystery">Mystery Object (Unknown Distance)</option>
              </select>
            </div>

            {!isMystery && (
              <div>
                <label className="flex justify-between font-medium text-sm text-slate-700 mb-1">
                  <span>Object Distance (d_o)</span>
                  <span className="text-blue-600 font-bold">{objectDist} cm</span>
                </label>
                <input 
                  type="range" min="10" max="80" step="1"
                  value={objectDist}
                  onChange={(e) => setObjectDist(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            )}

            <div>
              <label className="flex justify-between font-medium text-sm text-slate-700 mb-1">
                <span>Tracing Angle (θ)</span>
                <span className="text-emerald-600 font-bold">{rayAngle}°</span>
              </label>
              <input 
                type="range" min="10" max="45" step="1"
                value={rayAngle}
                onChange={(e) => setRayAngle(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <p className="text-xs text-slate-400 mt-1">Adjusting the angle changes where the rays hit the mirror, amplifying or reducing measurement noise!</p>
            </div>
          </div>
        </div>

        {/* Column 2: Simulation */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-700 p-6 flex flex-col items-center relative overflow-hidden">
          <h2 className="text-lg font-bold text-white mb-4 w-full text-left">Simulation</h2>
          
          <div className="flex-1 w-full flex items-center justify-center relative">
            <svg width="100%" height="100%" viewBox={`0 0 ${svgW} ${svgH}`} className="bg-slate-800 rounded-lg shadow-inner">
              {/* Grid Lines */}
              <line x1="0" y1={cy} x2={svgW} y2={cy} stroke="#475569" strokeWidth="1" strokeDasharray="5,5" />
              <line x1={cx} y1="0" x2={cx} y2={svgH} stroke="#475569" strokeWidth="1" strokeDasharray="5,5" />
              
              {/* The Mirror */}
              <rect x={cx - 2} y={cy - 100} width="4" height="200" fill="#cbd5e1" />
              {/* Mirror hatching for non-reflective side */}
              {[...Array(20)].map((_, i) => (
                <line key={i} x1={cx + 2} y1={cy - 95 + i*10} x2={cx + 10} y2={cy - 85 + i*10} stroke="#cbd5e1" strokeWidth="1" />
              ))}

              {/* Rays from Object to Mirror */}
              <line x1={x_obj} y1={cy} x2={cx} y2={y_hit1} stroke="#fbbf24" strokeWidth="2" />
              <line x1={x_obj} y1={cy} x2={cx} y2={y_hit2} stroke="#fbbf24" strokeWidth="2" />
              
              {/* Reflected Rays (leaving mirror to the left) */}
              <line x1={cx} y1={y_hit1} x2={cx - 300} y2={y_hit1 + 300 * Math.tan((-rayAngle + noise1) * Math.PI / 180)} stroke="#fbbf24" strokeWidth="2" />
              <line x1={cx} y1={y_hit2} x2={cx - 300} y2={y_hit2 + 300 * Math.tan((rayAngle + noise2) * Math.PI / 180)} stroke="#fbbf24" strokeWidth="2" />

              {/* Virtual Rays (extending behind mirror) */}
              <line x1={cx} y1={y_hit1} x2={x_img} y2={cy} stroke="#fbbf24" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />
              <line x1={cx} y1={y_hit2} x2={x_img} y2={cy} stroke="#fbbf24" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />

              {/* Normal Lines at incidence */}
              <line x1={cx - 40} y1={y_hit1} x2={cx + 40} y2={y_hit1} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
              <line x1={cx - 40} y1={y_hit2} x2={cx + 40} y2={y_hit2} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />

              {/* Object */}
              <circle cx={x_obj} cy={cy} r="6" fill="#ef4444" />
              <text x={x_obj} y={cy - 12} fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">
                {isMystery ? 'Mystery' : 'Object'}
              </text>

              {/* Virtual Image Intersection */}
              <circle cx={x_img} cy={cy} r="6" fill="#a855f7" opacity="0.8" />
              <text x={x_img} y={cy - 12} fill="#a855f7" fontSize="12" textAnchor="middle" fontWeight="bold">
                Image
              </text>
            </svg>

            {/* Error visualization floating text */}
            <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded border border-slate-700 text-xs text-slate-300">
              Noise: {(noise1 > 0 ? '+' : '')}{noise1.toFixed(1)}°, {(noise2 > 0 ? '+' : '')}{noise2.toFixed(1)}°
            </div>
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
                  <th className="px-3 py-2 border-b">d_o (cm)</th>
                  <th className="px-3 py-2 border-b">θ (°)</th>
                  <th className="px-3 py-2 border-b">Measured d_i (cm)</th>
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
                    <td className="px-3 py-2">{Number.isNaN(d.do) ? '?' : d.do}</td>
                    <td className="px-3 py-2">{d.theta}</td>
                    <td className="px-3 py-2 font-medium text-purple-600">{d.di}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-4 relative mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase absolute top-2 left-3">Measured d_i vs θ</h3>
            <div className="w-full h-full pt-6">
               <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <line x1="10" y1="90" x2="100" y2="90" stroke="#cbd5e1" strokeWidth="1" />
                 <line x1="10" y1="10" x2="10" y2="90" stroke="#cbd5e1" strokeWidth="1" />
                 
                 {data.map((d, i) => {
                   const x = 10 + (d.theta / 45) * 90;
                   const maxDi = Math.max(...data.map(item => item.di), 50);
                   const y = 90 - (d.di / maxDi) * 80;
                   return <circle key={i} cx={x} cy={y} r="2.5" fill="#a855f7" />;
                 })}
               </svg>
            </div>
            <p className="absolute bottom-1 right-2 text-[10px] text-slate-400">Notice how error grows at smaller angles!</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-bold text-amber-800 text-sm mb-2">Assessment: Find Mystery Object</h3>
            <p className="text-xs text-amber-700 mb-3">
              Switch to the "Mystery Object". Record the measured image distance <span className="font-mono">d_i</span> at multiple tracing angles <span className="font-mono">θ</span>. Average your results to estimate the true object distance <span className="font-mono">d_o</span>.
            </p>
            <div className="flex gap-2">
              <input 
                type="number" 
                step="0.1"
                placeholder="e.g. 25.5"
                value={assessmentInput}
                onChange={(e) => { setAssessmentInput(e.target.value); setAssessmentStatus('idle'); }}
                className="flex-1 px-3 py-1.5 border border-amber-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-xs self-center text-amber-700 font-bold mr-2">cm</span>
              <button 
                onClick={checkAssessment}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm font-bold transition-colors"
              >
                Check
              </button>
            </div>
            {assessmentStatus === 'correct' && (
              <div className="mt-2 flex items-center gap-1 text-emerald-600 text-sm font-bold">
                <CheckCircle className="w-4 h-4" /> Correct! The mystery distance is {mysteryDist} cm.
              </div>
            )}
            {assessmentStatus === 'incorrect' && (
              <div className="mt-2 flex items-center gap-1 text-red-600 text-sm font-bold">
                <XCircle className="w-4 h-4" /> Incorrect. Try taking more measurements!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
