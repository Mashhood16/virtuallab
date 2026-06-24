import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Play, Pause } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit?: () => void;
}

const getSpecificHeat = (mat: string) => {
  switch(mat) {
    case 'Aluminum': return 900;
    case 'Copper': return 385;
    case 'Iron': return 450;
    case 'Unknown': return 620;
    default: return 900;
  }
};

const getBlockFill = (mat: string) => {
  switch(mat) {
    case 'Aluminum': return 'url(#grad-al)';
    case 'Copper': return 'url(#grad-cu)';
    case 'Iron': return 'url(#grad-fe)';
    case 'Unknown': return 'url(#grad-unk)';
    default: return '#cbd5e1';
  }
};

export default function LabP10SpecificHeatElectrical({ onExit }: LabProps) {
  const [material, setMaterial] = useState('Aluminum');
  const [mass, setMass] = useState(1.0);
  const [voltage, setVoltage] = useState(12);
  const [insulation, setInsulation] = useState('Foam');
  
  const [time, setTime] = useState(0);
  const [temperature, setTemperature] = useState(20.0);
  const [isHeating, setIsHeating] = useState(false);
  const [displayVals, setDisplayVals] = useState({ V: 0, I: 0, T: 20 });
  
  const [recordedData, setRecordedData] = useState<{ id: number, time: number, energy: number, temp: number }[]>([]);
  
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{type: 'success'|'error'|'', message: string}>({type: '', message: ''});

  // Physics simulation loop
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isHeating) {
      timer = setInterval(() => {
        setTime(t => t + 5); 
        
        setTemperature(prev => {
           const R_total = 5.0; // Ohms (internal + wires + heater)
           const current_I = voltage / R_total;
           const heater_V = current_I * 4.0;
           const P = heater_V * current_I;
           
           const k = insulation === 'None' ? 2.0 : 0.1; // Heat loss coefficient W/°C
           const dQ_in = P * 5; // Energy in 5 seconds
           const dQ_loss = k * (prev - 20) * 5;
           
           const c = getSpecificHeat(material);
           const dTemp = (dQ_in - dQ_loss) / (mass * c);
           
           return prev + dTemp;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isHeating, voltage, insulation, mass, material]);

  // Noise generator for displays
  useEffect(() => {
    const R_total = 5.0;
    const current_I = voltage / R_total;
    const heater_V = current_I * 4.0;
    
    const active = isHeating || (time > 0 && voltage > 0);
    
    const noiseV = active ? (Math.sin(time * 0.1) * 0.05 + (Math.random() - 0.5) * 0.05) : 0;
    const noiseI = active ? (Math.cos(time * 0.1) * 0.02 + (Math.random() - 0.5) * 0.02) : 0;
    const noiseT = active ? ((Math.random() - 0.5) * 0.1) : 0;

    setDisplayVals({
      V: active ? Math.max(0, heater_V + noiseV) : 0,
      I: active ? Math.max(0, current_I + noiseI) : 0,
      T: temperature + noiseT
    });
  }, [time, temperature, isHeating, voltage]);

  const recordPoint = () => {
    setRecordedData(prev => [...prev, {
      id: prev.length + 1,
      time,
      energy: displayVals.V * displayVals.I * time, 
      temp: displayVals.T
    }]);
  };

  const resetExperiment = () => {
    setTime(0);
    setTemperature(20.0);
    setIsHeating(false);
    setRecordedData([]);
    setDisplayVals({ V: 0, I: 0, T: 20.0 });
    setUserAnswer('');
    setFeedback({type: '', message: ''});
  };

  const checkAnswer = () => {
    const c_true = getSpecificHeat(material);
    const user_c = parseFloat(userAnswer);
    if (isNaN(user_c)) {
      setFeedback({type: 'error', message: 'Please enter a valid number.'});
      return;
    }
    const error = Math.abs(user_c - c_true) / c_true;
    if (error < 0.08) { 
      setFeedback({type: 'success', message: `Correct! The specific heat of ${material} is ~${c_true} J/kg°C.`});
    } else {
      setFeedback({type: 'error', message: `Incorrect. Remember c = ΔE / (m × ΔT). Have you converted correctly?`});
    }
  };

  const getFluidHeight = (temp: number) => {
    const h = 20 + ((temp - 20) / 80) * 130;
    return Math.min(170, Math.max(0, h));
  };

  const maxEnergy = Math.max(100, ...recordedData.map(d => d.energy)) * 1.1;
  const maxTemp = Math.max(30, ...recordedData.map(d => d.temp)) * 1.1;

  const { slope, intercept } = useMemo(() => {
    if (recordedData.length < 2) return { slope: 0, intercept: 20 };
    const n = recordedData.length;
    const sumX = recordedData.reduce((acc, d) => acc + d.energy, 0);
    const sumY = recordedData.reduce((acc, d) => acc + d.temp, 0);
    const sumXY = recordedData.reduce((acc, d) => acc + d.energy * d.temp, 0);
    const sumX2 = recordedData.reduce((acc, d) => acc + d.energy * d.energy, 0);
    
    const denom = n * sumX2 - sumX * sumX;
    if (denom === 0) return { slope: 0, intercept: 20 };
    
    const m = (n * sumXY - sumX * sumY) / denom;
    const b = (sumY - m * sumX) / n;
    return { slope: m, intercept: b };
  }, [recordedData]);

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Specific Heat Capacity" subtitle="Determine specific heat using the electrical method" />

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        
        {/* Left Column: Theory & Setup */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border p-5 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Theory</h2>
            <p className="text-sm text-slate-600 mb-3">
              Specific heat capacity ($c$) is the amount of energy required to raise the temperature of 1 kg of a substance by 1°C.
            </p>
            <div className="bg-slate-100 p-3 rounded-lg text-sm text-center font-mono text-slate-800 font-bold mb-3 border border-slate-200">
              c = ΔE / (m × ΔT)
            </div>
            <p className="text-sm text-slate-600">
              In this experiment, electrical energy supplied is $E = V \times I \times t$. By recording Temperature and Energy, you can calculate the specific heat of the block.
            </p>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Setup Parameters</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Block Material</label>
                <select 
                  className="w-full p-2 border rounded-md bg-slate-50 disabled:opacity-50 outline-none focus:border-blue-500"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  disabled={time > 0}
                >
                  <option value="Aluminum">Aluminum (Al)</option>
                  <option value="Copper">Copper (Cu)</option>
                  <option value="Iron">Iron (Fe)</option>
                  <option value="Unknown">Unknown Alloy</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-slate-700">Block Mass</label>
                  <span className="text-sm text-blue-600 font-bold">{mass.toFixed(2)} kg</span>
                </div>
                <input 
                  type="range" min="0.5" max="2.0" step="0.1" 
                  value={mass} onChange={(e) => setMass(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                  disabled={time > 0}
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-slate-700">Power Supply Voltage</label>
                  <span className="text-sm text-blue-600 font-bold">{voltage.toFixed(1)} V</span>
                </div>
                <input 
                  type="range" min="0" max="20" step="1" 
                  value={voltage} onChange={(e) => setVoltage(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                  disabled={time > 0}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Insulation Level</label>
                <select 
                  className="w-full p-2 border rounded-md bg-slate-50 disabled:opacity-50 outline-none focus:border-blue-500"
                  value={insulation}
                  onChange={(e) => setInsulation(e.target.value)}
                  disabled={time > 0}
                >
                  <option value="Foam">Foam (Low Heat Loss)</option>
                  <option value="None">None (High Heat Loss)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-auto border-t pt-4">
            <button 
              onClick={() => setIsHeating(!isHeating)}
              className={`w-full py-3 rounded-lg font-bold flex justify-center items-center gap-2 text-white transition-colors ${
                isHeating ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isHeating ? <><Pause className="w-5 h-5"/> Pause Heating</> : <><Play className="w-5 h-5"/> {time > 0 ? 'Resume Heating' : 'Start Heating'}</>}
            </button>
          </div>
        </div>

        {/* Center Column: Simulation */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-5 flex flex-col relative overflow-hidden min-h-[400px]">
          <h2 className="text-lg font-bold text-white mb-2 z-10">Live Simulation</h2>
          <p className="text-slate-400 text-xs mb-4 z-10">Watch the thermometer and instruments as the block heats up.</p>
          
          <div className="flex-1 flex items-center justify-center relative">
            <svg viewBox="0 0 500 400" className="w-full max-w-md">
              <defs>
                <linearGradient id="grad-al" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
                <linearGradient id="grad-cu" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <linearGradient id="grad-fe" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
                <linearGradient id="grad-unk" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
              </defs>
              
              {/* Desk */}
              <rect x="0" y="320" width="500" height="80" fill="#1e293b" />
              
              {/* Circuit wires */}
              <path d="M 230 65 L 230 85 L 330 85" fill="none" stroke="#ef4444" strokeWidth="3" />
              <path d="M 380 110 L 380 150 L 209 150" fill="none" stroke="#ef4444" strokeWidth="3" />
              <path d="M 270 65 L 270 160 L 197 160" fill="none" stroke="#3b82f6" strokeWidth="3" />

              <path d="M 120 110 L 120 140 L 197 140" fill="none" stroke="#3b82f6" strokeWidth="2" />
              <path d="M 160 85 L 180 85 L 180 140 L 209 140" fill="none" stroke="#ef4444" strokeWidth="2" />
              
              {/* Ammeter box */}
              <rect x="330" y="60" width="100" height="50" fill="#0f172a" rx="4" stroke="#475569" strokeWidth="2" />
              <text x="380" y="92" fill="#60a5fa" fontSize="20" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                {displayVals.I.toFixed(2)}A
              </text>
              <text x="380" y="75" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">AMMETER</text>

              {/* Voltmeter box */}
              <rect x="70" y="60" width="100" height="50" fill="#0f172a" rx="4" stroke="#475569" strokeWidth="2" />
              <text x="120" y="92" fill="#4ade80" fontSize="20" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                {displayVals.V.toFixed(2)}V
              </text>
              <text x="120" y="75" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">VOLTMETER</text>

              {/* Power Supply Box */}
              <rect x="210" y="20" width="80" height="60" fill="#0f172a" rx="4" stroke="#334155" strokeWidth="3" />
              <text x="250" y="45" fill="#f8fafc" fontSize="14" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">SUPPLY</text>
              <circle cx="230" cy="65" r="4" fill="#ef4444" />
              <circle cx="270" cy="65" r="4" fill="#3b82f6" />

              {/* Insulation */}
              {insulation === 'Foam' && (
                <rect x="150" y="210" width="200" height="110" fill="#fef3c7" fillOpacity="0.2" stroke="#fbbf24" strokeWidth="4" strokeDasharray="8 4" rx="12" />
              )}

              {/* Metal Block */}
              <rect x="170" y="230" width="160" height="90" fill={getBlockFill(material)} rx="8" />

              {/* Holes */}
              <rect x="195" y="230" width="16" height="70" fill="#1e293b" />
              <rect x="275" y="230" width="12" height="70" fill="#1e293b" />
              
              {/* Heater Element */}
              <rect x="197" y="160" width="12" height="135" fill={isHeating ? "#ef4444" : "#475569"} rx="6" className="transition-colors duration-500" />
              
              {/* Thermometer */}
              <g transform="translate(275, 120)">
                <rect x="2" y="0" width="8" height="175" fill="#f1f5f9" rx="4" stroke="#cbd5e1" strokeWidth="1" />
                <rect x="4" y={170 - getFluidHeight(displayVals.T)} width="4" height={getFluidHeight(displayVals.T)} fill="#ef4444" rx="2" className="transition-all duration-100" />
                <line x1="10" y1="20" x2="16" y2="20" stroke="#94a3b8" strokeWidth="1" />
                <line x1="10" y1="95" x2="16" y2="95" stroke="#94a3b8" strokeWidth="1" />
                <line x1="10" y1="170" x2="16" y2="170" stroke="#94a3b8" strokeWidth="1" />
              </g>

              {/* Live readout near thermometer */}
              <rect x="295" y="180" width="60" height="26" fill="#0f172a" rx="4" stroke="#475569" strokeWidth="1" />
              <text x="325" y="198" fill="#f87171" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                {displayVals.T.toFixed(1)}°C
              </text>
            </svg>
          </div>

          <div className="absolute bottom-6 left-6 bg-black/60 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Stopwatch</div>
            <div className="text-white font-mono text-2xl font-bold">{time} s</div>
          </div>
        </div>

        {/* Right Column: Data Logging & Analysis */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border flex flex-col overflow-hidden h-[calc(100vh-8rem)] min-h-[500px]">
          
          {/* Data Table Section */}
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center shrink-0">
            <h2 className="text-lg font-bold text-slate-800">Data Logging</h2>
            <button 
              onClick={recordPoint}
              disabled={time === 0 && recordedData.length === 0}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              Record Point
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-0 bg-slate-50">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-100 sticky top-0">
                <tr>
                  <th className="px-4 py-2">Time (s)</th>
                  <th className="px-4 py-2">Energy (J)</th>
                  <th className="px-4 py-2">Temp (°C)</th>
                </tr>
              </thead>
              <tbody>
                {[...recordedData].reverse().map((d, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2 font-mono">{d.time}</td>
                    <td className="px-4 py-2 font-mono">{Math.round(d.energy)}</td>
                    <td className="px-4 py-2 font-mono">{d.temp.toFixed(1)}</td>
                  </tr>
                ))}
                {recordedData.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-slate-500 italic">No data recorded. Start heating and click "Record Point".</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Graph Section */}
          <div className="h-48 border-t border-b bg-slate-50 relative p-4 shrink-0">
            {recordedData.length > 0 ? (
              <svg width="100%" height="100%" viewBox="0 0 300 150">
                <line x1="30" y1="130" x2="290" y2="130" stroke="#94a3b8" strokeWidth="2" />
                <line x1="30" y1="10" x2="30" y2="130" stroke="#94a3b8" strokeWidth="2" />
                
                <text x="20" y="140" fontSize="8" fill="#64748b">0</text>
                <text x="250" y="145" fontSize="8" fill="#64748b">Energy (J)</text>
                <text x="5" y="20" fontSize="8" fill="#64748b" transform="rotate(-90 5,20)">Temp (°C)</text>
                
                {recordedData.map((d, i) => {
                  const cx = 30 + (d.energy / maxEnergy) * 250;
                  const cy = 130 - (d.temp / maxTemp) * 110;
                  return <circle key={i} cx={cx} cy={cy} r="3" fill="#ef4444" />;
                })}
                
                {recordedData.length > 1 && (
                   <line 
                     x1={30 + (0 / maxEnergy) * 250}
                     y1={130 - (intercept / maxTemp) * 110}
                     x2={30 + (maxEnergy / maxEnergy) * 250}
                     y2={130 - ((intercept + slope * maxEnergy) / maxTemp) * 110}
                     stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2"
                   />
                )}
              </svg>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">Graph will appear here</div>
            )}
          </div>

          {/* Assessment Section */}
          <div className="p-4 bg-slate-100 shrink-0">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Analysis</h3>
            <p className="text-xs text-slate-600 mb-3">Hint: Pick two data points to find ΔE and ΔT. Then use $c = \Delta E / (m \times \Delta T)$.</p>
            <div className="flex gap-2 mb-2">
              <input 
                type="number" 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Specific Heat (c)"
                className="flex-1 px-3 py-2 text-sm border rounded-md outline-none focus:border-blue-500"
              />
              <span className="self-center text-xs text-slate-500 font-medium w-12">J/kg°C</span>
              <button 
                onClick={checkAnswer}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-md transition-colors"
              >
                Check
              </button>
            </div>
            {feedback.message && (
              <div className={`p-2 rounded text-xs font-medium ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {feedback.message}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
