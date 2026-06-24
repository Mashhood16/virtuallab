import { useState, useEffect, useRef } from 'react';
import { Play, Square, CheckCircle } from 'lucide-react';

export default function LabC10Esterification({ onExit }: { onExit?: () => void }) {
  const [ethanoic, setEthanoic] = useState(10);
  const [methanol, setMethanol] = useState(10);
  const [temp, setTemp] = useState(25);
  const [catalyst, setCatalyst] = useState(0);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [yieldPercent, setYieldPercent] = useState(0);
  const [smell, setSmell] = useState('None');
  
  const [logs, setLogs] = useState<{run: number, eth: number, meth: number, t: number, cat: number, y: number}[]>([]);
  
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const targetMass = useRef(Math.floor(Math.random() * 10 + 5) * 10); 
  
  useEffect(() => {
    let timer: number;
    if (running) {
      timer = window.setInterval(() => {
        setTime(t => {
          if (t >= 60) {
            setRunning(false);
            return 60;
          }
          return t + 1;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (time === 0) {
      setYieldPercent(0);
      setSmell('None');
      return;
    }
    let k = 0.001 * Math.exp((temp - 25) / 15);
    if (catalyst > 0) k *= (1 + catalyst * 5); 
    
    const limiting = Math.min(ethanoic, methanol);
    const maxTheoretical = (limiting / Math.max(ethanoic, methanol)) * 100 * (catalyst > 0 ? 0.7 : 0.6); 
    
    const currentYield = maxTheoretical * (1 - Math.exp(-k * time));
    setYieldPercent(Math.min(currentYield, 100));
    
    if (currentYield > 30) setSmell('Fruity (Sweet)');
    else if (currentYield > 10) setSmell('Faintly Sweet');
    else setSmell('Vinegar-like');
    
  }, [time, temp, catalyst, ethanoic, methanol]);

  const handleStart = () => {
    if (running) {
      setRunning(false);
    } else {
      if (time >= 60) setTime(0);
      setRunning(true);
    }
  };

  const handleLog = () => {
    setLogs([...logs, { run: logs.length + 1, eth: ethanoic, meth: methanol, t: temp, cat: catalyst, y: parseFloat(yieldPercent.toFixed(1)) }]);
  };

  const checkAnswer = () => {
    const expected = (targetMass.current * 74) / 60;
    if (Math.abs(parseFloat(answer) - expected) < 1) {
      setFeedback('Correct! Well done.');
    } else {
      setFeedback(`Incorrect. Hint: M_r of ethanoic acid is 60, M_r of methyl ethanoate is 74. Target mass was ${targetMass.current}g.`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-blue-800 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Virtual Lab: Esterification</h1>
        {onExit && <button onClick={onExit} className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded">Exit Lab</button>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 flex-1">
        <div className="bg-slate-50 rounded-lg shadow-sm border p-4 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Theory & Setup</h2>
          <div className="text-slate-600 space-y-2 text-sm">
            <p><strong>Esterification</strong> is the reaction between a carboxylic acid and an alcohol to produce an ester and water.</p>
            <div className="bg-blue-50 p-3 rounded font-mono text-center text-blue-900 border border-blue-200">
              CH₃COOH + CH₃OH ⇌ CH₃COOCH₃ + H₂O
            </div>
            <p><strong>Conditions:</strong> Concentrated sulfuric acid (H₂SO₄) is used as a catalyst, and the mixture is heated in a water bath.</p>
            <p><strong>Observation:</strong> Esters have a characteristic fruity or sweet smell. The reaction mixture initially smells of vinegar (ethanoic acid).</p>
          </div>
          
          <div className="flex-1 overflow-auto">
            <h3 className="font-bold text-slate-800 mb-2 mt-4">Experiment Controls</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold flex justify-between">
                  <span>Ethanoic Acid Volume (mL)</span>
                  <span>{ethanoic} mL</span>
                </label>
                <input type="range" min="5" max="50" value={ethanoic} onChange={(e) => { setEthanoic(Number(e.target.value)); setTime(0); }} className="w-full" disabled={running} />
              </div>
              <div>
                <label className="text-sm font-semibold flex justify-between">
                  <span>Methanol Volume (mL)</span>
                  <span>{methanol} mL</span>
                </label>
                <input type="range" min="5" max="50" value={methanol} onChange={(e) => { setMethanol(Number(e.target.value)); setTime(0); }} className="w-full" disabled={running} />
              </div>
              <div>
                <label className="text-sm font-semibold flex justify-between">
                  <span>Water Bath Temp (°C)</span>
                  <span>{temp} °C</span>
                </label>
                <input type="range" min="20" max="80" value={temp} onChange={(e) => { setTemp(Number(e.target.value)); setTime(0); }} className="w-full" disabled={running} />
              </div>
              <div>
                <label className="text-sm font-semibold flex justify-between">
                  <span>Conc. H₂SO₄ Catalyst (drops)</span>
                  <span>{catalyst} drops</span>
                </label>
                <input type="range" min="0" max="10" value={catalyst} onChange={(e) => { setCatalyst(Number(e.target.value)); setTime(0); }} className="w-full" disabled={running} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg shadow-sm border p-4 flex flex-col items-center relative">
          <h2 className="text-xl font-bold text-slate-800 w-full border-b pb-2 mb-4">Simulation</h2>
          
          <div className="flex-1 w-full flex flex-col items-center justify-center relative">
            <svg viewBox="0 0 200 300" className="w-64 h-auto max-h-full drop-shadow-xl">
              <rect x="30" y="150" width="140" height="100" rx="10" fill="rgba(100,200,255,0.3)" stroke="#333" strokeWidth="2" />
              <text x="100" y="240" textAnchor="middle" fill="#0066cc" fontSize="12">Water Bath</text>
              <text x="100" y="225" textAnchor="middle" fill="#0066cc" fontSize="14" fontWeight="bold">{temp}°C</text>
              
              {temp > 30 && <path d="M 80 260 Q 100 250 120 260" stroke="red" strokeWidth="3" fill="none" opacity={(temp-30)/50} />}
              {temp > 50 && <path d="M 90 270 Q 100 260 110 270" stroke="orange" strokeWidth="3" fill="none" opacity={(temp-50)/30} />}

              <path d="M 90 80 L 90 140 L 60 190 A 20 20 0 0 0 80 220 L 120 220 A 20 20 0 0 0 140 190 L 110 140 L 110 80 Z" fill="rgba(255,255,255,0.8)" stroke="#444" strokeWidth="2" />
              <path d="M 65 180 L 135 180 A 20 20 0 0 1 120 218 L 80 218 A 20 20 0 0 1 65 180 Z" fill={`rgba(200, 220, 200, ${0.4 + yieldPercent/200})`} />
              
              {running && temp > 40 && (
                <g className="animate-pulse">
                  <circle cx="100" cy="120" r="3" fill="#aaa" opacity="0.5" />
                  <circle cx="95" cy="100" r="4" fill="#aaa" opacity="0.4" />
                  <circle cx="105" cy="80" r="5" fill="#aaa" opacity="0.3" />
                </g>
              )}
            </svg>

            <div className="absolute top-4 right-4 bg-slate-100 p-3 rounded border text-sm w-40 text-center">
              <div className="font-bold text-slate-700">Odor Detected:</div>
              <div className={`font-semibold ${smell === 'None' ? 'text-slate-500' : smell === 'Fruity (Sweet)' ? 'text-pink-600' : 'text-orange-500'}`}>
                {smell}
              </div>
            </div>
            
            {catalyst > 0 && <div className="absolute top-10 left-10 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">H₂SO₄ added</div>}
          </div>

          <div className="w-full mt-4 flex items-center justify-between gap-4">
            <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full transition-all duration-100" style={{ width: `${(time/60)*100}%` }} />
            </div>
            <div className="text-sm font-mono">{time}s / 60s</div>
            <button onClick={handleStart} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
              {running ? <Square size={16} /> : <Play size={16} />}
              {running ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg shadow-sm border p-4 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Data & Analysis</h2>
          
          <div className="bg-slate-100 p-3 rounded flex justify-between items-center">
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold">Ester Yield</div>
              <div className="text-2xl font-mono text-blue-700">{yieldPercent.toFixed(1)}%</div>
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
                  <th className="p-2">Eth(mL)</th>
                  <th className="p-2">Meth(mL)</th>
                  <th className="p-2">T(°C)</th>
                  <th className="p-2">Cat</th>
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
                      <td className="p-2">{log.eth}</td>
                      <td className="p-2">{log.meth}</td>
                      <td className="p-2">{log.t}</td>
                      <td className="p-2">{log.cat}</td>
                      <td className="p-2 font-mono font-bold text-blue-700">{log.y}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <CheckCircle size={18} /> Knowledge Check
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              Calculate the theoretical maximum mass of methyl ethanoate produced if you react <strong>{targetMass.current} g</strong> of ethanoic acid with excess methanol. (Aᵣ: H=1, C=12, O=16)
            </p>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Mass (g)" 
                className="flex-1 px-3 py-1 border rounded"
              />
              <button onClick={checkAnswer} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
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
