import { useState, useEffect } from 'react';
import { Play, Square, CheckCircle } from 'lucide-react';

export default function LabC10EthanolHydration({ onExit }: { onExit?: () => void }) {
  const [temp, setTemp] = useState(300); 
  const [pressure, setPressure] = useState(60); 
  const [catalyst, setCatalyst] = useState(true); 
  
  const [time, setTime] = useState(0); 
  const [running, setRunning] = useState(false);
  const [yieldPercent, setYieldPercent] = useState(0);
  const [rate, setRate] = useState(0);
  
  const [logs, setLogs] = useState<{run: number, t: number, p: number, cat: string, y: number, r: number}[]>([]);
  
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let timer: number;
    if (running) {
      timer = window.setInterval(() => {
        setTime(t => {
          if (t >= 100) {
            setRunning(false);
            return 100;
          }
          return t + 1; 
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    let eqYield = 5 * (pressure / 60) * (300 / Math.max(temp, 100));
    if (eqYield > 100) eqYield = 100;

    let r = (temp / 300) * (pressure / 60);
    if (catalyst) r *= 10; else r *= 0.1;
    
    setRate(r);
    
    if (time === 0) {
      setYieldPercent(0);
      return;
    }
    
    const currentY = eqYield * (1 - Math.exp(-r * (time / 20)));
    setYieldPercent(Math.min(currentY, 100));

  }, [time, temp, pressure, catalyst]);

  const handleStart = () => {
    if (running) setRunning(false);
    else {
      if (time >= 100) setTime(0);
      setRunning(true);
    }
  };

  const handleLog = () => {
    setLogs([...logs, { run: logs.length + 1, t: temp, p: pressure, cat: catalyst ? 'Yes' : 'No', y: parseFloat(yieldPercent.toFixed(1)), r: parseFloat(rate.toFixed(2)) }]);
  };

  const checkAnswer = () => {
    if (parseFloat(answer) === 100) {
      setFeedback('Correct! Addition reactions have 100% atom economy.');
    } else {
      setFeedback(`Incorrect. Hint: In an addition reaction, all reactant atoms end up in the desired product.`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-purple-800 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Virtual Lab: Hydration of Ethene</h1>
        {onExit && <button onClick={onExit} className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded">Exit Lab</button>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 flex-1">
        <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Theory & Setup</h2>
          <div className="text-slate-600 space-y-2 text-sm">
            <p><strong>Hydration</strong> of ethene is an addition reaction used for the industrial manufacture of ethanol.</p>
            <div className="bg-purple-50 p-3 rounded font-mono text-center text-purple-900 border border-purple-200">
              C₂H₄(g) + H₂O(g) ⇌ C₂H₅OH(g)
            </div>
            <p><strong>Conditions:</strong> Concentrated phosphoric acid (H₃PO₄) catalyst, high temperature (300°C), and high pressure (60 atm).</p>
            <p><strong>Kinetics vs Equilibrium:</strong> The reaction is exothermic. A lower temperature favors the yield of ethanol, but lowers the rate. 300°C is a compromise temperature.</p>
          </div>
          
          <div className="flex-1 overflow-auto">
            <h3 className="font-bold text-slate-800 mb-2 mt-4">Experiment Controls</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold flex justify-between">
                  <span>Temperature (°C)</span>
                  <span>{temp} °C</span>
                </label>
                <input type="range" min="100" max="500" value={temp} onChange={(e) => { setTemp(Number(e.target.value)); setTime(0); }} className="w-full" disabled={running} />
              </div>
              <div>
                <label className="text-sm font-semibold flex justify-between">
                  <span>Pressure (atm)</span>
                  <span>{pressure} atm</span>
                </label>
                <input type="range" min="10" max="100" value={pressure} onChange={(e) => { setPressure(Number(e.target.value)); setTime(0); }} className="w-full" disabled={running} />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="catalyst" checked={catalyst} onChange={(e) => { setCatalyst(e.target.checked); setTime(0); }} disabled={running} className="w-4 h-4" />
                <label htmlFor="catalyst" className="text-sm font-semibold">H₃PO₄ Catalyst Present</label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col items-center relative">
          <h2 className="text-xl font-bold text-slate-800 w-full border-b pb-2 mb-4">Simulation</h2>
          
          <div className="flex-1 w-full flex flex-col items-center justify-center relative">
            <svg viewBox="0 0 300 200" className="w-full h-auto max-h-full drop-shadow-xl">
              <rect x="100" y="50" width="100" height="100" rx="10" fill="#ddd" stroke="#333" strokeWidth="2" />
              <path d="M 20 70 L 100 70" stroke="#333" strokeWidth="4" />
              <text x="20" y="60" fontSize="12">Ethene</text>
              <path d="M 20 130 L 100 130" stroke="#333" strokeWidth="4" />
              <text x="20" y="120" fontSize="12">Steam</text>
              
              <path d="M 200 100 L 280 100" stroke="#333" strokeWidth="4" />
              <text x="220" y="90" fontSize="12">Ethanol</text>
              
              <rect x="110" y="60" width="80" height="80" fill={catalyst ? "rgba(255, 200, 0, 0.3)" : "rgba(100, 100, 100, 0.1)"} />
              <text x="150" y="105" textAnchor="middle" fontSize="14" fontWeight="bold">{temp}°C</text>
              <text x="150" y="125" textAnchor="middle" fontSize="12">{pressure} atm</text>
              
              {running && time > 0 && Array.from({length: 6}).map((_, i) => (
                <circle key={i} cx={200 + (time % 20)*4} cy={95 + (i%2)*10} r="3" fill="blue" opacity="0.5" />
              ))}
            </svg>

            <div className="w-full mt-4 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span className="font-bold text-slate-800">Reaction Rate (rel):</span>
                <span className="font-mono">{rate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-800">Single-Pass Yield:</span>
                <span className="font-mono text-purple-700 font-bold">{yieldPercent.toFixed(1)} %</span>
              </div>
            </div>
          </div>

          <div className="w-full mt-4 flex items-center justify-between gap-4">
            <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full transition-all duration-100" style={{ width: `${(time/100)*100}%` }} />
            </div>
            <div className="text-sm font-mono">{time}%</div>
            <button onClick={handleStart} className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow">
              {running ? <Square size={16} /> : <Play size={16} />}
              {running ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Data & Analysis</h2>
          
          <div className="bg-slate-100 p-3 rounded flex justify-between items-center">
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold">Eq Yield</div>
              <div className="text-2xl font-mono text-purple-700">{yieldPercent.toFixed(1)}%</div>
            </div>
            <button onClick={handleLog} disabled={time === 0} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50">
              Record Data
            </button>
          </div>

          <div className="flex-1 overflow-auto border rounded bg-slate-50">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-200 sticky top-0">
                <tr>
                  <th className="p-2">Run</th>
                  <th className="p-2">T(°C)</th>
                  <th className="p-2">P(atm)</th>
                  <th className="p-2">Cat</th>
                  <th className="p-2">Rate</th>
                  <th className="p-2">Yield(%)</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={6} className="p-4 text-center text-slate-500">No data recorded yet.</td></tr>
                ) : (
                  logs.map((log, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{log.run}</td>
                      <td className="p-2">{log.t}</td>
                      <td className="p-2">{log.p}</td>
                      <td className="p-2">{log.cat}</td>
                      <td className="p-2">{log.r}</td>
                      <td className="p-2 font-mono font-bold text-purple-700">{log.y}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded p-4">
            <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
              <CheckCircle size={18} /> Knowledge Check
            </h3>
            <p className="text-sm text-purple-800 mb-3">
              What is the <strong>atom economy (%)</strong> for the hydration of ethene to produce ethanol?
            </p>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="%" 
                className="flex-1 px-3 py-1 border rounded"
              />
              <button onClick={checkAnswer} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded">
                Check
              </button>
            </div>
            {feedback && (
              <p className={`mt-2 text-sm font-semibold ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>
                {feedback}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
