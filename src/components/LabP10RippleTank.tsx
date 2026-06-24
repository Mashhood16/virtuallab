import  { useState, useEffect } from 'react';
import {Play, Pause, Plus, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabP10RippleTank({ onExit }: LabProps) {
  const [angleI, setAngleI] = useState(30);
  const [medium, setMedium] = useState('Shallow');
  
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);

  const [data, setData] = useState<{ i: number; r: number }[]>([]);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const mediums: Record<string, number> = {
    Shallow: 15, // cm/s
    VeryShallow: 10,
    Mystery: 12
  };

  const v1 = 20; // cm/s (Deep Water)
  const v2 = mediums[medium];

  const n = v1 / v2;
  const radI = (angleI * Math.PI) / 180;
  const sinR = Math.sin(radI) / n;
  const angleR = (Math.asin(sinR) * 180) / Math.PI;

  useEffect(() => {
    let timer: number;
    if (!isPaused) {
      timer = window.setInterval(() => {
        setTime(t => t + 0.05);
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isPaused]);

  const getSensorReading = () => {
    // Deterministic noise based on angle and medium so it doesn't flicker wildly
    const noise = (Math.sin(angleI * 12.34 + v2) * 0.8).toFixed(1);
    return (angleR + parseFloat(noise)).toFixed(1);
  };

  const handleRecord = () => {
    setData(prev => [...prev, { i: angleI, r: Number(getSensorReading()) }]);
  };

  const checkAnswer = () => {
    const val = parseFloat(answer);
    if (isNaN(val)) return setFeedback('Enter a valid number.');
    if (val >= 11.5 && val <= 12.5) {
      setFeedback('Correct! The speed in the Mystery Liquid is 12 cm/s.');
    } else {
      setFeedback("Incorrect. Use Snell's Law: v₂ = v₁ · (sin θr / sin θi)");
    }
  };

  const renderWavefronts = () => {
    const f = 0.5; // Frequency
    const lambda1 = v1 / f; 
    const lambda2 = v2 / f; 
    const W = 300; // Half-width of wavefront
    const cx = 200, cy = 150; // Origin
    const lines = [];

    const radR = (angleR * Math.PI) / 180;

    for (let k = -15; k <= 15; k++) {
      const p = k + f * time;
      if (p < 0) {
        // Incident (y < 150)
        const d = p * lambda1; // Negative distance
        const mx = cx + d * Math.sin(radI);
        const my = cy + d * Math.cos(radI);
        const x1 = mx + W * Math.cos(radI);
        const y1 = my - W * Math.sin(radI);
        const x2 = mx - W * Math.cos(radI);
        const y2 = my + W * Math.sin(radI);
        lines.push(<line key={`inc-${k}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a5f3fc" strokeWidth="3" opacity="0.6" clipPath="url(#topHalf)" />);
      } else {
        // Refracted (y > 150)
        const d = p * lambda2; // Positive distance
        const mx = cx + d * Math.sin(radR);
        const my = cy + d * Math.cos(radR);
        const x1 = mx + W * Math.cos(radR);
        const y1 = my - W * Math.sin(radR);
        const x2 = mx - W * Math.cos(radR);
        const y2 = my + W * Math.sin(radR);
        lines.push(<line key={`ref-${k}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth="3" opacity="0.8" clipPath="url(#bottomHalf)" />);
      }
    }
    return lines;
  };

  const renderGraph = () => {
    const pts = data.map(d => ({
      x: Math.sin((d.r * Math.PI) / 180),
      y: Math.sin((d.i * Math.PI) / 180)
    }));

    return (
      <svg viewBox="0 0 200 200" className="w-full h-48 bg-slate-50 border rounded-md shadow-inner mt-4">
        <line x1="30" y1="170" x2="180" y2="170" stroke="#94a3b8" strokeWidth="2" />
        <line x1="30" y1="170" x2="30" y2="20" stroke="#94a3b8" strokeWidth="2" />
        <text x="90" y="195" fontSize="10" fill="#64748b" fontWeight="bold">sin(θ_r)</text>
        <text x="-120" y="15" fontSize="10" fill="#64748b" fontWeight="bold" transform="rotate(-90)">sin(θ_i)</text>
        
        {/* Unit markers */}
        <text x="180" y="185" fontSize="8" fill="#94a3b8" textAnchor="middle">1.0</text>
        <text x="15" y="25" fontSize="8" fill="#94a3b8">1.0</text>

        {pts.map((p, idx) => {
          const cx = 30 + p.x * 150;
          const cy = 170 - p.y * 150;
          return <circle key={idx} cx={cx} cy={cy} r="4" fill="#0ea5e9" />;
        })}
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Unit 12: Ripple Tank" subtitle="Investigate wave refraction and Snell's Law quantitatively." />

      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {/* Column 1: Setup */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Theory & Setup</h2>
            <p className="text-sm text-slate-600 mb-4">
              When water waves travel from deep to shallow water, they slow down and their path bends. This is <strong>refraction</strong>.
            </p>
            <p className="text-sm text-slate-600 mb-4">
              According to Snell's Law:
              <br/><span className="font-mono bg-slate-100 p-1 rounded mt-1 inline-block">sin(θ_i) / sin(θ_r) = v₁ / v₂ = n</span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Incident Angle (θ_i): {angleI}°</label>
              <input
                type="range" min="10" max="80" step="1"
                value={angleI}
                onChange={(e) => setAngleI(Number(e.target.value))}
                className="w-full accent-cyan-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Medium 2 (Bottom Region)</label>
              <select
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md bg-slate-50 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="Shallow">Shallow Water (v₂ = 15 cm/s)</option>
                <option value="VeryShallow">Very Shallow Water (v₂ = 10 cm/s)</option>
                <option value="Mystery">Mystery Liquid (Unknown v₂)</option>
              </select>
            </div>
            
            <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-100 mt-4">
              <span className="text-sm text-cyan-800">Fixed: Deep Water Speed v₁ = 20 cm/s</span>
            </div>
          </div>
        </div>

        {/* Column 2: Simulation */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-4 flex flex-col relative overflow-hidden h-[500px] lg:h-auto">
          <div className="flex justify-center gap-4 mb-2 z-10 relative">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-white transition-all ${
                isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.5)]'
              }`}
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              {isPaused ? 'Resume' : 'Pause Waves'}
            </button>
          </div>

          <div className="flex-1 w-full relative border border-slate-700 rounded-lg overflow-hidden bg-cyan-950">
            <svg viewBox="0 0 400 300" className="w-full h-full absolute inset-0">
              <defs>
                <clipPath id="topHalf"><rect x="0" y="0" width="400" height="150" /></clipPath>
                <clipPath id="bottomHalf"><rect x="0" y="150" width="400" height="150" /></clipPath>
              </defs>
              
              <rect x="0" y="0" width="400" height="150" fill="#082f49" />
              <rect x="0" y="150" width="400" height="150" fill="#0f172a" />
              
              {/* Normal line */}
              <line x1="200" y1="20" x2="200" y2="280" stroke="#cbd5e1" strokeDasharray="6,4" strokeWidth="2" opacity="0.6" />
              
              {renderWavefronts()}
              
              {/* Ray Lines */}
              <line 
                x1={200 - 150 * Math.sin(radI)} y1={150 - 150 * Math.cos(radI)} 
                x2="200" y2="150" 
                stroke="#fcd34d" strokeWidth="3" strokeDasharray="6,4" 
              />
              <line 
                x1="200" y1="150" 
                x2={200 + 150 * Math.sin(angleR * Math.PI / 180)} y2={150 + 150 * Math.cos(angleR * Math.PI / 180)} 
                stroke="#fcd34d" strokeWidth="3" strokeDasharray="6,4" 
              />
              
              {/* Labels */}
              <text x="10" y="20" fill="white" fontSize="12" fontWeight="bold">Medium 1 (Deep)</text>
              <text x="10" y="290" fill="white" fontSize="12" fontWeight="bold">Medium 2 ({medium})</text>
              
              {/* Sensor Display */}
              <rect x="230" y="240" width="160" height="45" fill="rgba(0,0,0,0.8)" rx="6" stroke="#38bdf8" strokeWidth="1" />
              <text x="245" y="268" fill="#38bdf8" fontSize="14" fontWeight="bold">
                Sensor: {getSensorReading()}°
              </text>
            </svg>
          </div>
        </div>

        {/* Column 3: Data & Analysis */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Data Logging</h2>
            
            <button
              onClick={handleRecord}
              className="w-full flex justify-center items-center gap-2 bg-cyan-100 hover:bg-cyan-200 text-cyan-700 px-4 py-2 rounded-md font-bold transition-colors mb-4"
            >
              <Plus className="w-4 h-4" /> Record (θ_i, θ_r)
            </button>
            
            <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-md mb-2">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-2 py-2 font-bold text-slate-700">θ_i (°)</th>
                    <th className="px-2 py-2 font-bold text-slate-700">θ_r (°)</th>
                    <th className="px-2 py-2 font-bold text-slate-700">sin(θ_i)</th>
                    <th className="px-2 py-2 font-bold text-slate-700">sin(θ_r)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.length === 0 ? (
                    <tr><td colSpan={4} className="px-2 py-4 text-center text-slate-400 italic">No data recorded</td></tr>
                  ) : (
                    data.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-2 py-1 font-mono text-slate-600">{d.i}</td>
                        <td className="px-2 py-1 font-mono text-slate-600">{d.r}</td>
                        <td className="px-2 py-1 font-mono text-slate-600">{Math.sin(d.i * Math.PI / 180).toFixed(3)}</td>
                        <td className="px-2 py-1 font-mono text-slate-600">{Math.sin(d.r * Math.PI / 180).toFixed(3)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {renderGraph()}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">Analysis</h3>
            <p className="text-sm text-slate-600 mb-3">
              Calculate the speed <span className="italic">v₂</span> of the <strong>Mystery Liquid</strong> using Snell's Law and your graph slope.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="v₂ (cm/s)..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
              />
              <button
                onClick={checkAnswer}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md font-bold transition-colors"
              >
                Check
              </button>
            </div>
            {feedback && (
              <div className={`mt-3 p-3 rounded-md text-sm flex items-center gap-2 ${feedback.includes('Correct') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                {feedback.includes('Correct') && <CheckCircle className="w-4 h-4" />}
                {feedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
