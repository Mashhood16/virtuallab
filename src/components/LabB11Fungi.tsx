import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Activity, Play, Pause, RotateCcw, LineChart, Target, CheckCircle, XCircle, Beaker } from 'lucide-react';

interface LogEntry {
  id: number;
  temp: number;
  conc: number;
  volume: number;
}

export default function LabB11Fungi({ onExit }: { onExit?: () => void }) {
  const [temperature, setTemperature] = useState<number>(20);
  const [glucose, setGlucose] = useState<number>(0.5);
  const [time, setTime] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Assessment
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const calculateRate = (T: number, S: number) => {
    let r = 80 * S * Math.exp(-0.5 * Math.pow((T - 35) / 8, 2));
    if (T > 45) r *= Math.max(0, 1 - (T - 45) / 3); 
    return r; 
  };

  useEffect(() => {
    let interval: number;
    if (running && time < 60) {
      interval = window.setInterval(() => {
        setTime(t => {
          const nextTime = t + 1;
          if (nextTime >= 60) setRunning(false);
          return nextTime;
        });
        
        const rate = calculateRate(temperature, glucose);
        const noise = 1 + (Math.random() - 0.5) * 0.05;
        const volumeIncrement = (rate / 60) * noise;
        
        setVolume(v => Math.min(100, v + volumeIncrement));
      }, 50); 
    }
    return () => window.clearInterval(interval);
  }, [running, time, temperature, glucose]);

  const handleReset = () => {
    setRunning(false);
    setTime(0);
    setVolume(0);
  };

  const handleLog = () => {
    if (time < 60 && volume === 0) return;
    setLogs(prev => [...prev, {
      id: Date.now(),
      temp: temperature,
      conc: glucose,
      volume: Number(volume.toFixed(1))
    }]);
  };

  const checkAnswer = () => {
    const val = parseFloat(answer);
    if (isNaN(val)) {
      setFeedback("Enter a valid number.");
      return;
    }
    if (Math.abs(val - 35) <= 2) {
      setFeedback("Correct! The optimal temperature for this yeast strain's enzymes is approximately 35°C.");
    } else {
      setFeedback("Incorrect. Hint: Run experiments from 10°C to 50°C. Look for the peak final volume of CO₂.");
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-amber-700 text-white p-4 flex items-center shadow-md justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="hover:bg-amber-600 p-2 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Fungi: Yeast Fermentation</h1>
        </div>
        <div className="flex items-center gap-2">
          <Beaker size={24} />
          <span className="font-semibold">Virtual Lab B11</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Column: Theory & Setup */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-3">
              <BookOpen className="text-amber-600" /> Theory & Variables
            </h2>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              Yeast (<i>Saccharomyces cerevisiae</i>) perform anaerobic respiration (fermentation) converting glucose into ethanol and carbon dioxide gas (CO₂).
              Enzyme activity regulates this reaction, heavily influenced by temperature.
            </p>
          </div>

          <div className="space-y-5 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-700">Environmental Controls</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex justify-between">
                <span>Incubator Temperature</span>
                <span className="text-amber-600 font-mono font-bold">{temperature}°C</span>
              </label>
              <input 
                type="range" min="10" max="50" step="1" 
                value={temperature} onChange={(e) => setTemperature(Number(e.target.value))}
                disabled={running || time > 0}
                className="w-full accent-amber-600 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex justify-between">
                <span>Glucose Concentration</span>
                <span className="text-amber-600 font-mono font-bold">{glucose} M</span>
              </label>
              <input 
                type="range" min="0.1" max="1.0" step="0.1" 
                value={glucose} onChange={(e) => setGlucose(Number(e.target.value))}
                disabled={running || time > 0}
                className="w-full accent-amber-600 disabled:opacity-50"
              />
            </div>

            <div className="pt-4 flex gap-2 justify-center border-t border-slate-200">
              {!running && time === 0 && (
                <button onClick={() => setRunning(true)} className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 font-semibold text-sm shadow-sm transition-colors">
                  <Play size={16} /> Start
                </button>
              )}
              {!running && time > 0 && time < 60 && (
                <button onClick={() => setRunning(true)} className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 font-semibold text-sm shadow-sm transition-colors">
                  <Play size={16} /> Resume
                </button>
              )}
              {running && (
                <button onClick={() => setRunning(false)} className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 font-semibold text-sm shadow-sm transition-colors">
                  <Pause size={16} /> Pause
                </button>
              )}
              <button onClick={handleReset} className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 font-semibold text-sm shadow-sm transition-colors">
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column: Simulator */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col items-center relative">
          <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-amber-600" /> Respirometer
            </h2>
            <div className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded">Interactive Model</div>
          </div>
          
          <div className="w-full max-w-sm aspect-square relative bg-slate-50 rounded-2xl border border-slate-200 shadow-inner mt-12 overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Delivery Tube */}
              <path d="M 100 90 L 100 40 L 160 40 L 160 90" fill="none" stroke="#94a3b8" strokeWidth="4" />
              
              {/* Flask */}
              <path d="M 85 90 L 85 110 L 50 160 A 10 10 0 0 0 60 170 L 140 170 A 10 10 0 0 0 150 160 L 115 110 L 115 90 Z" fill="rgba(255, 255, 255, 0.9)" stroke="#cbd5e1" strokeWidth="4" />
              
              {/* Liquid in Flask */}
              <path d="M 62 140 L 138 140 L 148 160 A 8 8 0 0 1 140 168 L 60 168 A 8 8 0 0 1 52 160 Z" fill="#fef08a" opacity="0.9" />
              
              {/* Bubbles if running */}
              {running && Array.from({ length: 8 }).map((_, i) => (
                <circle 
                  key={i} 
                  cx={70 + Math.random() * 60} 
                  cy={165 - Math.random() * 25} 
                  r={1.5 + Math.random() * 2} 
                  fill="white" 
                  opacity="0.8" 
                />
              ))}

              {/* Gas Syringe Body */}
              <rect x="140" y="80" width="40" height="90" fill="white" stroke="#cbd5e1" strokeWidth="2" />
              {/* Syringe Plunger (moves down as volume increases) */}
              <rect x="142" y={82 + (volume / 100) * 86} width="36" height="8" fill="#64748b" />
              <line x1="160" y1={82 + (volume / 100) * 86} x2="160" y2="180" stroke="#64748b" strokeWidth="4" />
              
              {/* Ticks on Syringe */}
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={i} x1="140" y1={82 + (i / 10) * 86} x2="148" y2={82 + (i / 10) * 86} stroke="#94a3b8" strokeWidth="1" />
              ))}
            </svg>
            
            <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded shadow-sm text-sm font-mono font-bold text-slate-700 border border-slate-200 backdrop-blur">
              Vol: {volume.toFixed(1)} mL
            </div>
            <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded shadow-sm text-sm font-mono font-bold text-amber-700 border border-slate-200 backdrop-blur">
              {time} min
            </div>
          </div>
        </div>

        {/* Right Column: Assessment */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <LineChart className="text-amber-600" /> Data Logging
            </h2>
            <button 
              onClick={handleLog}
              className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-amber-200 flex items-center gap-1 transition-colors"
            >
              Log Final Data
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden h-40 overflow-y-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                <tr>
                  <th className="px-4 py-2">Temp (°C)</th>
                  <th className="px-4 py-2">Glucose (M)</th>
                  <th className="px-4 py-2">Vol (mL)</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-slate-400">No data logged yet</td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} className="border-b border-slate-100">
                      <td className="px-4 py-2 font-mono">{log.temp}</td>
                      <td className="px-4 py-2 font-mono">{log.conc}</td>
                      <td className="px-4 py-2 font-mono font-bold text-amber-700">{log.volume}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex-1 flex flex-col">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-3">
              <Target size={18} /> Analysis
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Determine the optimal temperature for yeast fermentation based on your logged CO₂ data points.
            </p>
            <div className="flex gap-2 mb-4">
              <input 
                type="number"
                placeholder="Optimal Temp (°C)" 
                value={answer} onChange={(e) => setAnswer(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm focus:outline-amber-500"
              />
              <button 
                onClick={checkAnswer}
                className="bg-slate-800 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-slate-700 transition-colors shadow-sm"
              >
                Check
              </button>
            </div>
            {feedback && (
              <div className={`text-sm p-3 rounded-lg flex items-start gap-2 border ${feedback.includes('Correct') ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                {feedback.includes('Correct') ? <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-600" /> : <XCircle size={16} className="mt-0.5 shrink-0 text-rose-600" />}
                <span className="flex-1 leading-relaxed">{feedback}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
