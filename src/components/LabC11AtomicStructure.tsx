import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Activity, Atom, Target, Calculator, Database } from 'lucide-react';

export default function LabC11AtomicStructure({ onExit }: { onExit?: () => void }) {
  const [bField, setBField] = useState<number>(1.0);
  const [voltage, setVoltage] = useState<number>(1000);
  const [massData, setMassData] = useState<{mass: number, radius: number, yPos: number}[]>([]);
  const [logs, setLogs] = useState<{bField: number, voltage: number, r20: string, r21: string, r22: string}[]>([]);

  const handleRunMassSpec = () => {
    const k = 5; 
    const r20 = (k * Math.sqrt(20 * voltage)) / (bField * 100);
    const r21 = (k * Math.sqrt(21 * voltage)) / (bField * 100);
    const r22 = (k * Math.sqrt(22 * voltage)) / (bField * 100);
    setMassData([
      { mass: 20, radius: r20, yPos: 150 + r20 },
      { mass: 21, radius: r21, yPos: 150 + r21 },
      { mass: 22, radius: r22, yPos: 150 + r22 },
    ]);
  };

  const handleLog = () => {
    if (massData.length === 0) return;
    setLogs([...logs, {
      bField, voltage,
      r20: massData[0].radius.toFixed(2),
      r21: massData[1].radius.toFixed(2),
      r22: massData[2].radius.toFixed(2)
    }]);
  };

  // Assessment
  const [unknownIsotopeMass, setUnknownIsotopeMass] = useState<number>(0);
  const [answerRadius, setAnswerRadius] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setUnknownIsotopeMass(Math.floor(Math.random() * 10) + 30);
  }, []);

  const checkAnswer = () => {
    const k = 5;
    const expected = (k * Math.sqrt(unknownIsotopeMass * voltage)) / (bField * 100);
    const parsed = parseFloat(answerRadius);
    if (!isNaN(parsed) && Math.abs(parsed - expected) < 0.5) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Atom className="w-6 h-6 text-indigo-600" />
            Atomic Structure & Mass Spectrometry
          </h1>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        
        {/* Column 1: Theory & Setup */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Theory
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              A mass spectrometer separates isotopes based on their mass-to-charge ratio. Ions are accelerated by an electric field and then deflected by a magnetic field. 
              The radius of curvature \( r \) of their path is proportional to the square root of their mass \( m \):
            </p>
            <div className="bg-indigo-50 p-4 rounded-lg text-center font-mono text-indigo-800 text-sm mb-4">
              r ∝ √(m · V) / B
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Adjust the <strong>Accelerating Voltage (V)</strong> and <strong>Magnetic Field (B)</strong> to see how Neon isotopes (Ne-20, Ne-21, Ne-22) separate!
            </p>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-slate-700 mb-4">Instrument Controls</h3>
            
            <label className="block text-sm font-medium text-slate-700 mb-1">Magnetic Field: {bField.toFixed(2)} T</label>
            <input 
              type="range" min="0.5" max="2.0" step="0.1" 
              value={bField} onChange={(e) => setBField(parseFloat(e.target.value))}
              className="w-full mb-4 accent-indigo-600"
            />

            <label className="block text-sm font-medium text-slate-700 mb-1">Accelerating Voltage: {voltage} V</label>
            <input 
              type="range" min="500" max="2000" step="100" 
              value={voltage} onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className="w-full mb-6 accent-indigo-600"
            />

            <button 
              onClick={handleRunMassSpec}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" /> Fire Ion Gun
            </button>
          </div>
        </div>

        {/* Column 2: Simulation Visualizer */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold text-slate-800 w-full mb-4">Mass Spectrometer Tube</h2>
          
          <svg viewBox="0 0 400 300" className="w-full h-80 bg-slate-100 rounded-lg shadow-inner overflow-hidden">
            <rect x="100" y="0" width="250" height="300" fill="#e2e8f0" opacity="0.5" />
            <text x="225" y="20" className="text-xs fill-slate-500 text-center font-semibold" textAnchor="middle">Magnetic Field (B) Region</text>

            {massData.map((d, i) => (
              <g key={i}>
                <path
                  d={`M 0 150 L 100 150 A ${d.radius} ${d.radius} 0 0 0 ${100 + d.radius} ${d.yPos}`}
                  fill="none"
                  stroke={i === 0 ? "#ef4444" : i === 1 ? "#3b82f6" : "#10b981"}
                  strokeWidth="2"
                  strokeDasharray="4"
                  className="animate-[dash_2s_linear_forwards]"
                />
                <circle cx={100 + d.radius} cy={d.yPos} r="4" fill={i === 0 ? "#ef4444" : i === 1 ? "#3b82f6" : "#10b981"} />
                <text x={100 + d.radius} y={d.yPos + 15} className="text-[10px] font-bold" textAnchor="middle">Ne-{d.mass}</text>
              </g>
            ))}
            
            <rect x="100" y="290" width="250" height="10" fill="#334155" />
            <text x="225" y="285" className="text-xs fill-slate-600 font-bold" textAnchor="middle">Detector Array</text>
            
            <rect x="0" y="130" width="30" height="40" fill="#94a3b8" />
            <text x="15" y="145" className="text-[10px] font-bold fill-white" textAnchor="middle">Ion</text>
            <text x="15" y="155" className="text-[10px] font-bold fill-white" textAnchor="middle">Gun</text>
          </svg>

          {massData.length > 0 && (
            <button onClick={handleLog} className="mt-6 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-semibold flex items-center gap-2 transition-colors">
              <Database className="w-4 h-4" /> Record Data
            </button>
          )}
        </div>

        {/* Column 3: Data Logging & Assessment */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-500" />
              Data Log
            </h2>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="px-3 py-2">B (T)</th>
                    <th className="px-3 py-2">V (V)</th>
                    <th className="px-3 py-2">r(20)</th>
                    <th className="px-3 py-2">r(22)</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-500 italic">No data recorded.</td></tr>
                  ) : (
                    logs.map((l, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="px-3 py-2">{l.bField}</td>
                        <td className="px-3 py-2">{l.voltage}</td>
                        <td className="px-3 py-2">{l.r20}</td>
                        <td className="px-3 py-2">{l.r22}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-500" />
              Analysis
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              An unknown isotope of element X has a mass of <strong>{unknownIsotopeMass} amu</strong>. 
              Based on the instrument settings (V={voltage} V, B={bField} T), calculate its expected <strong>radius of curvature</strong> on the detector.
            </p>
            <div className="flex gap-2">
              <input 
                type="number" step="0.1" placeholder="Radius..." 
                value={answerRadius} onChange={(e) => setAnswerRadius(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button onClick={checkAnswer} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                <Target className="w-4 h-4" /> Check
              </button>
            </div>
            {isCorrect === true && <p className="text-emerald-600 text-sm font-bold mt-2">Correct! Excellent job.</p>}
            {isCorrect === false && <p className="text-red-500 text-sm font-bold mt-2">Incorrect. Check your formula and try again.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
