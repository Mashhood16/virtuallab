import { useState, useEffect } from 'react';
import { Play, Square, Info, Activity, Save, RefreshCw, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC10DownsCell({ onExit }: { onExit: () => void }) {
  const [isRunning, setIsRunning] = useState(false);
  const [voltage, setVoltage] = useState(5);
  const [time, setTime] = useState(0); 
  const [massNa, setMassNa] = useState(0); 
  const [volCl2, setVolCl2] = useState(0); 
  const [logs, setLogs] = useState<{id: number, time: number, current: number, massNa: number, volCl2: number}[]>([]);
  
  const [assessmentCurrent, setAssessmentCurrent] = useState(3);
  const [assessmentTime, setAssessmentTime] = useState(60);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const resistance = 2.5; 
  const F = 96485; 
  
  useEffect(() => {
    setAssessmentCurrent(Math.floor(Math.random() * 5) + 2);
    setAssessmentTime(Math.floor(Math.random() * 60) + 30);
  }, []);

  useEffect(() => {
    let timer: number;
    if (isRunning) {
      const current = voltage / resistance;
      const dt = 60; 
      timer = window.setInterval(() => {
        setTime(prev => prev + dt);
        setMassNa(prev => prev + (current * dt / F) * 23);
        setVolCl2(prev => prev + (current * dt / F) * 0.5 * 24000);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isRunning, voltage]);

  const current = isRunning ? voltage / resistance : 0;

  const recordData = () => {
    const noiseMass = massNa * (1 + (Math.random() - 0.5) * 0.04);
    const noiseVol = volCl2 * (1 + (Math.random() - 0.5) * 0.04);
    setLogs([...logs, {
      id: Date.now(),
      time: time,
      current: current,
      massNa: Number(noiseMass.toFixed(3)),
      volCl2: Number(noiseVol.toFixed(0))
    }]);
  };

  const checkAnswer = () => {
    const q = assessmentCurrent * assessmentTime * 60;
    const molesE = q / F;
    const correctMass = molesE * 23;
    const parsed = parseFloat(userAnswer);
    if (!isNaN(parsed) && Math.abs(parsed - correctMass) < correctMass * 0.05) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setMassNa(0);
    setVolCl2(0);
    setLogs([]);
    setVoltage(5);
    setIsCorrect(null);
    setUserAnswer('');
  };

  const svgW = 400;
  const svgH = 500;
  const maxTime = logs.length > 0 ? Math.max(...logs.map(l => l.time), 1000) : 1000;
  const maxMass = logs.length > 0 ? Math.max(...logs.map(l => l.massNa), 1) : 1;

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Electrolysis of Molten NaCl (Downs Cell)" />

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
        
        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600" />
              Theory
            </h2>
            <p className="text-sm text-slate-600 mb-2">
              The Downs cell is used for the commercial extraction of sodium by the electrolysis of molten sodium chloride (NaCl).
            </p>
            <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm mb-2 text-slate-700">
              <div><strong>Cathode (-):</strong> Na⁺ + e⁻ → Na(l)</div>
              <div><strong>Anode (+):</strong> 2Cl⁻ → Cl₂(g) + 2e⁻</div>
              <div className="mt-2 text-indigo-600 font-bold border-t border-slate-300 pt-2">
                2NaCl(l) → 2Na(l) + Cl₂(g)
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Calcium chloride is often added to lower the melting point. Solid NaCl does not conduct electricity as its ions are fixed in a lattice.
            </p>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Experiment Setup</h2>
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                  <span>Power Supply Voltage</span>
                  <span>{voltage.toFixed(1)} V</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="0.5"
                  value={voltage}
                  onChange={(e) => setVoltage(parseFloat(e.target.value))}
                  disabled={isRunning}
                  className="w-full accent-indigo-600"
                />
                <p className="text-xs text-slate-500 mt-1">Adjusts the potential difference across the electrodes.</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-colors ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                  {isRunning ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isRunning ? 'Pause Electrolysis' : 'Start Electrolysis'}
                </button>
                <button
                  onClick={reset}
                  className="p-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                  title="Reset Experiment"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center relative">
          <h2 className="absolute top-6 left-6 text-lg font-semibold text-slate-800">Simulation View</h2>
          
          <div className="absolute top-6 right-6 text-right">
            <div className="text-2xl font-mono font-bold text-indigo-600">{(time / 60).toFixed(1)} min</div>
            <div className="text-sm text-slate-500">Elapsed Time</div>
            <div className="text-lg font-mono font-bold text-emerald-600 mt-2">{current.toFixed(2)} A</div>
            <div className="text-sm text-slate-500">Current Flow</div>
          </div>

          <svg width={svgW} height={svgH} className="mt-8" viewBox="0 0 400 500">
            <rect x="150" y="20" width="100" height="40" rx="4" fill="#334155" />
            <text x="200" y="45" fill="white" textAnchor="middle" fontSize="16" fontWeight="bold">{voltage.toFixed(1)}V DC</text>
            <text x="140" y="45" fill="#ef4444" textAnchor="end" fontSize="20" fontWeight="bold">+</text>
            <text x="260" y="45" fill="#3b82f6" textAnchor="start" fontSize="20" fontWeight="bold">-</text>

            <path d="M 170 60 L 170 120 L 170 120" stroke="#ef4444" strokeWidth="4" fill="none" />
            <path d="M 230 60 L 230 120 L 230 120" stroke="#3b82f6" strokeWidth="4" fill="none" />
            
            <path d="M 50 150 L 50 450 Q 50 480 80 480 L 320 480 Q 350 480 350 450 L 350 150" stroke="#94a3b8" strokeWidth="6" fill="#f8fafc" />
            
            <path d="M 53 220 L 53 450 Q 53 477 80 477 L 320 477 Q 347 477 347 450 L 347 220 Z" fill="#fef08a" opacity="0.6" />
            <text x="200" y="460" fill="#ca8a04" textAnchor="middle" fontSize="14" fontWeight="bold">Molten NaCl (800°C)</text>
            
            <rect x="180" y="150" width="40" height="280" fill="#1e293b" />
            <text x="200" y="140" fill="#1e293b" textAnchor="middle" fontSize="12" fontWeight="bold">Graphite Anode (+)</text>

            <rect x="100" y="150" width="20" height="280" fill="#64748b" />
            <rect x="280" y="150" width="20" height="280" fill="#64748b" />
            <path d="M 110 150 L 110 100 L 230 100 L 230 120" stroke="#3b82f6" strokeWidth="4" fill="none" />
            <path d="M 290 150 L 290 100 L 230 100" stroke="#3b82f6" strokeWidth="4" fill="none" />
            
            <path d="M 170 120 L 170 150 L 200 150" stroke="#ef4444" strokeWidth="4" fill="none" />

            <text x="110" y="140" fill="#64748b" textAnchor="middle" fontSize="12" fontWeight="bold">Iron Cathode (-)</text>
            <text x="290" y="140" fill="#64748b" textAnchor="middle" fontSize="12" fontWeight="bold">Iron Cathode (-)</text>

            {isRunning && (
              <>
                <circle cx="170" cy="90" r="4" fill="#fbbf24">
                  <animate attributeName="cy" values="120;60" dur={`${2/voltage}s`} repeatCount="indefinite" />
                </circle>
                <circle cx="230" cy="90" r="4" fill="#fbbf24">
                  <animate attributeName="cy" values="60;120" dur={`${2/voltage}s`} repeatCount="indefinite" />
                </circle>
              </>
            )}

            {isRunning && Array.from({length: 8}).map((_, i) => (
              <circle key={`cl2-${i}`} cx={185 + Math.random() * 30} cy={400 - Math.random() * 100} r="4" fill="#4ade80" opacity="0.8">
                <animate attributeName="cy" values={`${400 - i*20};220`} dur={`${1 + Math.random()}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur={`${1 + Math.random()}s`} repeatCount="indefinite" />
              </circle>
            ))}

            {massNa > 0 && (
              <>
                <ellipse cx="110" cy="220" rx={Math.min(20, massNa * 0.5)} ry={Math.min(10, massNa * 0.25)} fill="#cbd5e1" opacity="0.9" />
                <ellipse cx="290" cy="220" rx={Math.min(20, massNa * 0.5)} ry={Math.min(10, massNa * 0.25)} fill="#cbd5e1" opacity="0.9" />
              </>
            )}
            
            <line x1="155" y1="200" x2="155" y2="430" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="245" y1="200" x2="245" y2="430" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
            
            <path d="M 160 200 Q 200 130 240 200 Z" fill="#dcfce7" opacity="0.5" stroke="#4ade80" strokeWidth="2" />
            <text x="200" y="180" fill="#166534" textAnchor="middle" fontSize="12" fontWeight="bold">Cl₂ gas</text>
          </svg>
          
          <div className="absolute bottom-6 left-6 right-6 flex justify-between px-4">
            <div className="bg-slate-100 px-3 py-1 rounded text-sm font-semibold text-slate-700">
              Na Mass: {massNa.toFixed(2)} g
            </div>
            <div className="bg-slate-100 px-3 py-1 rounded text-sm font-semibold text-slate-700">
              Cl₂ Vol: {volCl2.toFixed(0)} mL
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-6 overflow-y-auto">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Data Collection</h2>
              <button
                onClick={recordData}
                disabled={!isRunning}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Record Data
              </button>
            </div>
            
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2">Time (s)</th>
                    <th className="px-4 py-2">Current (A)</th>
                    <th className="px-4 py-2">Mass Na (g)</th>
                    <th className="px-4 py-2">Vol Cl₂ (mL)</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-center text-slate-400 italic">No data recorded yet. Start the electrolysis and record points.</td>
                    </tr>
                  )}
                  {logs.map(log => (
                    <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-2 font-mono">{log.time}</td>
                      <td className="px-4 py-2 font-mono">{log.current.toFixed(2)}</td>
                      <td className="px-4 py-2 font-mono">{log.massNa}</td>
                      <td className="px-4 py-2 font-mono">{log.volCl2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {logs.length > 1 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Graph: Mass of Na vs Time</h3>
              <div className="w-full h-48 bg-slate-50 border border-slate-200 rounded-lg relative p-2">
                <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none">
                  <line x1="20" y1="130" x2="280" y2="130" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="20" y1="20" x2="20" y2="130" stroke="#94a3b8" strokeWidth="2" />
                  
                  {logs.map((log, i) => {
                    const cx = 20 + (log.time / maxTime) * 260;
                    const cy = 130 - (log.massNa / maxMass) * 110;
                    return (
                      <circle key={`pt-${i}`} cx={cx} cy={cy} r="3" fill="#4f46e5" />
                    );
                  })}
                  
                  <path 
                    d={`M ${logs.map(l => `${20 + (l.time / maxTime) * 260},${130 - (l.massNa / maxMass) * 110}`).join(' L ')}`} 
                    fill="none" 
                    stroke="#4f46e5" 
                    strokeWidth="1.5" 
                    opacity="0.5"
                  />
                </svg>
              </div>
            </div>
          )}

          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mt-auto">
            <h3 className="font-semibold text-indigo-900 mb-2">Analysis & Assessment</h3>
            <p className="text-sm text-indigo-800 mb-4">
              If a Downs cell operates at a constant current of <strong>{assessmentCurrent} A</strong> for <strong>{assessmentTime} minutes</strong>, calculate the theoretical mass of sodium metal produced. (F = 96,485 C/mol, Ar(Na) = 23).
            </p>
            <div className="flex gap-2">
              <input 
                type="number" 
                step="0.01"
                placeholder="Mass in grams"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                onClick={checkAnswer}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Check
              </button>
            </div>
            
            {isCorrect !== null && (
              <div className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${isCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'}`}>
                {isCorrect ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                <div>
                  <p className="font-medium">{isCorrect ? 'Correct!' : 'Incorrect.'}</p>
                  <p className="text-sm mt-1">
                    {isCorrect 
                      ? "Excellent! You used Q = It and stoichiometry correctly." 
                      : "Hint: First find total charge Q in Coulombs (time must be in seconds!). Then find moles of electrons. Na+ needs 1 e- per atom."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
