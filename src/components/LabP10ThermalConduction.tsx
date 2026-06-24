import  { useState, useEffect } from 'react';
import { RefreshCw, Play, Pause, Plus, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabP10ThermalConduction({ onExit }: LabProps) {
  const [material, setMaterial] = useState('Cu');
  const [length, setLength] = useState(0.2);
  const [tempSource, setTempSource] = useState(200);

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [meltedMass, setMeltedMass] = useState(0);

  const [data, setData] = useState<{ t: number; m: number }[]>([]);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const materials: Record<string, number> = {
    Cu: 385,
    Al: 205,
    Fe: 80,
    Mystery: 50
  };

  const A = 0.0001; // m^2
  const Lf = 334; // J/g
  const Tc = 0; // °C

  useEffect(() => {
    let timer: number;
    if (isRunning) {
      timer = window.setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          setMeltedMass(prevMass => {
            const P = (materials[material] * A * (tempSource - Tc)) / length;
            const rate = P / Lf;
            const noise = 1 + (Math.random() - 0.5) * 0.04; // +/- 2% noise
            return prevMass + rate * noise;
          });
          return newTime;
        });
      }, 1000); // 1 real second = 1 sim second
    }
    return () => clearInterval(timer);
  }, [isRunning, material, tempSource, length, Tc, A, Lf, materials]);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setMeltedMass(0);
    setData([]);
    setFeedback('');
    setAnswer('');
  };

  const handleRecord = () => {
    setData(prev => [...prev, { t: time, m: Number(meltedMass.toFixed(2)) }]);
  };

  const checkAnswer = () => {
    const val = parseFloat(answer);
    if (isNaN(val)) {
      setFeedback('Please enter a valid number.');
      return;
    }
    if (val > 45 && val < 55) {
      setFeedback('Correct! The thermal conductivity is approximately 50 W/m·K.');
    } else {
      setFeedback('Incorrect. Check your slope and formula.');
    }
  };

  const renderGraph = () => {
    const pts = data.map(d => ({ x: d.t, y: d.m }));
    const maxX = Math.max(60, ...pts.map(p => p.x));
    const maxY = Math.max(10, ...pts.map(p => p.y));

    return (
      <svg viewBox="0 0 300 200" className="w-full h-48 bg-slate-50 border rounded-md shadow-inner">
        {/* Axes */}
        <line x1="40" y1="160" x2="280" y2="160" stroke="#94a3b8" strokeWidth="2" />
        <line x1="40" y1="160" x2="40" y2="20" stroke="#94a3b8" strokeWidth="2" />
        {/* Labels */}
        <text x="140" y="190" fontSize="12" fill="#64748b" fontWeight="bold">Time (s)</text>
        <text x="-120" y="20" fontSize="12" fill="#64748b" fontWeight="bold" transform="rotate(-90)">Mass (g)</text>
        
        {/* Ticks */}
        <text x="35" y="165" fontSize="10" fill="#94a3b8" textAnchor="end">0</text>
        <text x="35" y="25" fontSize="10" fill="#94a3b8" textAnchor="end">{maxY.toFixed(1)}</text>
        <text x="280" y="175" fontSize="10" fill="#94a3b8" textAnchor="middle">{maxX.toFixed(0)}</text>

        {/* Data points */}
        {pts.map((p, i) => {
          const cx = 40 + (p.x / maxX) * 240;
          const cy = 160 - (p.y / maxY) * 140;
          return <circle key={i} cx={cx} cy={cy} r="4" fill="#ef4444" className="hover:r-6 transition-all" />;
        })}
        {pts.length > 1 && (
          <polyline
            points={pts.map(p => `${40 + (p.x / maxX) * 240},${160 - (p.y / maxY) * 140}`).join(' ')}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="4,4"
            opacity="0.5"
          />
        )}
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Unit 10: Thermal Conduction" subtitle="Determine the thermal conductivity of materials using Fourier's Law." rightContent={<>{rightJsx}</>} />

      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {/* Column 1: Setup */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Theory & Setup</h2>
            <p className="text-sm text-slate-600 mb-4">
              Heat transfers through a rod at a steady rate according to <strong>Fourier's Law</strong>: <br/>
              <span className="font-mono bg-slate-100 p-1 rounded mt-1 inline-block">P = k · A · ΔT / L</span>
            </p>
            <p className="text-sm text-slate-600 mb-4">
              The heat melts an ice block at 0°C. By measuring the mass of water melted over time, we find P:
              <br/>
              <span className="font-mono bg-slate-100 p-1 rounded mt-1 inline-block">P = (Δm/Δt) · L_f</span><br/>
              <span className="text-xs text-slate-500">(L_f = 334 J/g for water)</span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Material</label>
              <select
                value={material}
                onChange={(e) => { setMaterial(e.target.value); handleReset(); }}
                className="w-full p-2 border border-slate-300 rounded-md bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Cu">Copper</option>
                <option value="Al">Aluminium</option>
                <option value="Fe">Iron</option>
                <option value="Mystery">Mystery Alloy</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Source Temperature: {tempSource}°C
              </label>
              <input
                type="range" min="100" max="500" step="10"
                value={tempSource}
                onChange={(e) => { setTempSource(Number(e.target.value)); handleReset(); }}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Rod Length: {length.toFixed(2)} m
              </label>
              <input
                type="range" min="0.1" max="0.5" step="0.05"
                value={length}
                onChange={(e) => { setLength(Number(e.target.value)); handleReset(); }}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <span className="text-sm text-blue-800">Fixed Cross-sectional Area (A): 1.0 × 10⁻⁴ m²</span>
            </div>
          </div>
        </div>

        {/* Column 2: Simulation */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-4 flex flex-col relative overflow-hidden h-[500px] lg:h-auto">
          <div className="flex justify-center gap-4 mb-4 z-10 relative">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-white transition-all ${
                isRunning ? 'bg-amber-500 hover:bg-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-green-500 hover:bg-green-600 shadow-md'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isRunning ? 'Pause' : 'Start Burner'}
            </button>
            <div className="bg-slate-800 text-cyan-300 font-mono px-4 py-2 rounded-full border border-slate-700 shadow-inner flex gap-4">
              <span>Time: {time}s</span>
              <span>Mass: {meltedMass.toFixed(2)}g</span>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <svg viewBox="0 0 500 300" className="w-full h-full absolute inset-0">
              <defs>
                <linearGradient id="rodGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={tempSource > 300 ? "#fca5a5" : "#fde68a"} />
                  <stop offset="100%" stopColor="#93c5fd" />
                </linearGradient>
              </defs>
              
              {/* Burner Stand */}
              <rect x="25" y="180" width="30" height="120" fill="#475569" />
              {/* Flame */}
              {isRunning && (
                <path d="M 30 180 Q 40 100 50 180 Z" fill="#ef4444" className="animate-pulse origin-bottom" style={{ transformOrigin: '40px 180px' }} />
              )}
              {/* Heat Source Block */}
              <rect x="20" y="140" width="40" height="40" fill={isRunning ? "#ea580c" : "#64748b"} rx="4" />
              <text x="25" y="165" fill="white" fontSize="12" fontWeight="bold">{isRunning ? tempSource : 20}°C</text>
              
              {/* Rod */}
              <rect x="60" y="150" width={length * 600} height="20" fill="url(#rodGrad)" stroke="#1e293b" strokeWidth="2" />
              
              {/* Ice Block */}
              <rect x={60 + length * 600} y="120" width="60" height="80" fill="#a5f3fc" opacity="0.8" rx="4" />
              <text x={65 + length * 600} y="165" fill="#0f172a" fontSize="12" fontWeight="bold">0°C Ice</text>
              
              {/* Beaker */}
              <path d={`M ${70 + length*600} 220 L ${70 + length*600} 280 L ${110 + length*600} 280 L ${110 + length*600} 220`} fill="none" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Water in beaker */}
              <rect x={73 + length*600} y={278 - Math.min(50, meltedMass*2)} width="34" height={Math.min(50, meltedMass*2)} fill="#3b82f6" opacity="0.8" />
              
              {/* Dripping water animation */}
              {isRunning && meltedMass > 0 && time % 2 === 0 && (
                <circle cx={90 + length*600} cy={205 + (time % 3)*20} r="3" fill="#3b82f6" opacity="0.8" />
              )}
              {isRunning && meltedMass > 0 && time % 2 !== 0 && (
                <circle cx={90 + length*600} cy={215 + (time % 3)*20} r="3" fill="#3b82f6" opacity="0.8" />
              )}
            </svg>
          </div>
        </div>

        {/* Column 3: Data & Analysis */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Data Logging</h2>
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleRecord}
                className="flex-1 flex justify-center items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-md font-bold transition-colors"
              >
                <Plus className="w-4 h-4" /> Record Data Point
              </button>
            </div>
            
            <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-md mb-4">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 font-bold text-slate-700">Time (s)</th>
                    <th className="px-4 py-2 font-bold text-slate-700">Mass (g)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.length === 0 ? (
                    <tr><td colSpan={2} className="px-4 py-4 text-center text-slate-400 italic">No data recorded</td></tr>
                  ) : (
                    data.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-mono text-slate-600">{d.t}</td>
                        <td className="px-4 py-2 font-mono text-slate-600">{d.m.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {renderGraph()}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">Analysis: Mystery Material</h3>
            <p className="text-sm text-slate-600 mb-3">
              1. Select the <strong>Mystery Alloy</strong>, set T_s to 300°C and L to 0.2 m.<br/>
              2. Log data for 60 seconds to find the melting rate Δm/Δt.<br/>
              3. Calculate its thermal conductivity k (W/m·K).
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Calculated k..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 font-mono"
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
