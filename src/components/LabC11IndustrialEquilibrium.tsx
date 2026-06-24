import { useState, useEffect } from 'react';
import { Settings, Info, Activity, Database, CheckCircle,  Factory, Gauge, XCircle, Save } from 'lucide-react';
import LabHeader from './LabHeader';

interface LogEntry {
  t: number;
  p: number;
  y: number;
}

export default function LabC11IndustrialEquilibrium({ onExit }: { onExit?: () => void }) {
  const [processType, setProcessType] = useState<'haber' | 'contact'>('haber');
  const [temperature, setTemperature] = useState<number>(450);
  const [pressure, setPressure] = useState<number>(200);
  
  const [yieldPercent, setYieldPercent] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isGoalMet, setIsGoalMet] = useState<boolean | null>(null);

  useEffect(() => {
    let y = 0;
    if (processType === 'haber') {
      const p_factor = Math.pow(pressure / 200, 0.5);
      const t_factor = Math.exp((450 - temperature) / 150);
      y = 15 * p_factor * t_factor;
    } else {
      const p_factor = Math.pow(pressure / 1, 0.1); 
      const t_factor = Math.exp((450 - temperature) / 200);
      y = 98 * p_factor * t_factor;
    }
    
    y = Math.min(Math.max(y, 0), 100);
    setYieldPercent(y);
  }, [processType, temperature, pressure]);

  const logData = () => {
    setLogs(prev => [...prev, { t: temperature, p: pressure, y: Number(yieldPercent.toFixed(1)) }]);
  };

  const checkGoal = () => {
    if (yieldPercent >= 80) setIsGoalMet(true);
    else setIsGoalMet(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none text-slate-800">
      <div className="bg-slate-900 text-white p-4 flex items-center shadow-md shrink-0">
        {onExit && (
          <LabHeader onExit={onExit} title="Industrial Equilibrium" />
        )}
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Factory className="text-blue-400" /> Industrial Equilibrium
        </h1>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
        {/* Column 1 */}
        <div className="bg-slate-50 rounded-xl shadow-sm border p-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
            <Info size={20} className="text-blue-500" /> Theory & Setup
          </h2>
          <div className="text-sm text-slate-600 space-y-2">
            <p><strong>Le Chatelier's Principle</strong> states that if a dynamic equilibrium is disturbed, the position of equilibrium shifts to counteract the change.</p>
            {processType === 'haber' ? (
              <p>The <strong>Haber Process</strong> synthesizes Ammonia: <br/><code>N₂ + 3H₂ ⇌ 2NH₃ (ΔH = -92 kJ/mol)</code>.</p>
            ) : (
              <p>The <strong>Contact Process</strong> synthesizes Sulfur Trioxide: <br/><code>2SO₂ + O₂ ⇌ 2SO₃ (ΔH = -196 kJ/mol)</code>.</p>
            )}
            <p>Determine the optimal conditions to maximize yield.</p>
          </div>
          
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Industrial Process</label>
              <select 
                className="w-full p-2 border rounded bg-slate-50"
                value={processType} 
                onChange={(e) => {
                  setProcessType(e.target.value as 'haber' | 'contact');
                  setLogs([]);
                  setIsGoalMet(null);
                }}
              >
                <option value="haber">Haber Process (Ammonia)</option>
                <option value="contact">Contact Process (Sulfuric Acid)</option>
              </select>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-slate-700">
                <Settings size={18} /> Control Panel
              </h3>
              <div>
                <label className="block text-sm font-semibold mb-1">Temperature: {temperature} °C</label>
                <input 
                  type="range" min="100" max="800" step="10" 
                  value={temperature} onChange={e => setTemperature(Number(e.target.value))}
                  className="w-full cursor-pointer accent-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Pressure: {pressure} atm</label>
                <input 
                  type="range" min="1" max="500" step="1" 
                  value={pressure} onChange={e => setPressure(Number(e.target.value))}
                  className="w-full cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="bg-slate-50 rounded-xl shadow-sm border p-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
            <Activity size={20} className="text-blue-500" /> Industrial Reactor
          </h2>
          
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-lg border p-4 relative">
            <svg viewBox="0 0 300 300" className="w-full h-64 drop-shadow-md">
              <rect x="80" y="50" width="140" height="200" rx="20" fill="#f1f5f9" stroke="#64748b" strokeWidth="6" />
              <rect 
                x="83" 
                y={247 - (yieldPercent * 1.94)} 
                width="134" 
                height={yieldPercent * 1.94} 
                fill={yieldPercent > 80 ? "#22c55e" : "#eab308"} 
                opacity="0.8" 
                rx="15" 
                className="transition-all duration-500 ease-in-out"
              />
              <text x="150" y="160" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#334155">
                {yieldPercent.toFixed(1)}%
              </text>
              <text x="150" y="180" textAnchor="middle" fontSize="14" fill="#64748b">
                Yield
              </text>

              {/* Decorative Pipes */}
              <path d="M 40 70 L 80 70" stroke="#64748b" strokeWidth="10" />
              <path d="M 220 220 L 260 220" stroke="#64748b" strokeWidth="10" />
              {yieldPercent > 0 && (
                <circle cx="240" cy="220" r="4" fill="#3b82f6" className="animate-ping" />
              )}
            </svg>
          </div>

          <div className="flex justify-center gap-3 mt-2">
            <button onClick={logData} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              <Save size={18} /> Log Attempt
            </button>
          </div>
        </div>

        {/* Column 3 */}
        <div className="bg-slate-50 rounded-xl shadow-sm border p-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
            <Database size={20} className="text-blue-500" /> Data & Analysis
          </h2>
          
          <div className="h-48 overflow-y-auto border rounded bg-slate-50 p-2 text-sm font-mono flex-shrink-0">
            <table className="w-full text-center">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="pb-1">Temp (°C)</th>
                  <th className="pb-1">Pres (atm)</th>
                  <th className="pb-1">Yield (%)</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && <tr><td colSpan={3} className="py-4 text-slate-400">No attempts logged</td></tr>}
                {logs.map((log, i) => (
                  <tr key={i} className="border-b border-slate-200 last:border-0 hover:bg-slate-100">
                    <td className="py-2">{log.t}</td>
                    <td>{log.p}</td>
                    <td className={log.y > 80 ? 'text-green-600 font-bold' : ''}>{log.y}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-auto">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Gauge size={16}/> Goal Assessment
            </h3>
            <p className="text-xs text-blue-800 mb-3">
              Your objective is to find a set of conditions that produces a yield of <strong>&gt; 80%</strong>. Manipulate the valves and check if you have met the goal.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={checkGoal}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-semibold transition-colors"
              >
                Evaluate Current Setup
              </button>
            </div>
            {isGoalMet === true && (
              <p className="text-green-600 font-semibold flex items-center gap-1 mt-3 text-sm"><CheckCircle size={16}/> Goal Met! The yield is high enough.</p>
            )}
            {isGoalMet === false && (
              <p className="text-red-600 font-semibold flex items-center gap-1 mt-3 text-sm"><XCircle size={16}/> Yield too low. Try adjusting Temperature and Pressure.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
