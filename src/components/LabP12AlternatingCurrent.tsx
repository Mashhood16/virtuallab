import { useState } from 'react';
import { ArrowLeft, Power, CheckCircle, XCircle, Settings2, Database, Calculator } from 'lucide-react';

export default function LabP12AlternatingCurrent({ onExit }: { onExit?: () => void }) {
  const [frequency, setFrequency] = useState<number>(50);
  const [peakVoltage, setPeakVoltage] = useState<number>(100);
  const [capacitance, setCapacitance] = useState<number>(100);
  const [loadResistance, setLoadResistance] = useState<number>(1000);
  const [filterEnabled, setFilterEnabled] = useState<boolean>(true);

  const [logs, setLogs] = useState<Array<any>>([]);
  const [ans1, setAns1] = useState('');
  const [ans2, setAns2] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleRecord = () => {
    setLogs([...logs, { f: frequency, Vp: peakVoltage, C: capacitance, R: loadResistance, filter: filterEnabled ? 'On' : 'Off' }]);
  };

  const checkAnswers = () => {
    let score = 0;
    if (ans1.trim() === '120') score++;
    if (ans2.trim() === '10.0') score++;
    if (score === 2) setFeedback('Spot on! You understand AC to DC conversion.');
    else setFeedback('Not quite. Review the ripple formulas and try again.');
  };

  const renderSimulationSVG = () => {
    const timeWindow = 0.1; // 100ms
    const points = 400;
    const dt = timeWindow / points;
    let currentV = 0;
    
    const rawPathPoints = [];
    const filterPathPoints = [];
    
    for(let i=0; i<=points; i++) {
      const t = i * dt;
      const vRaw = Math.abs(peakVoltage * Math.sin(2 * Math.PI * frequency * t));
      const vDischarge = currentV * Math.exp(-dt / (loadResistance * capacitance * 1e-6));
      
      if (filterEnabled) {
        currentV = Math.max(vRaw, vDischarge);
      } else {
        currentV = vRaw;
      }
      
      const xSvg = (t / timeWindow) * 400;
      const ySvgRaw = 250 - (vRaw / 250) * 200;
      const ySvgFilt = 250 - (currentV / 250) * 200;
      
      rawPathPoints.push(`${xSvg},${ySvgRaw}`);
      filterPathPoints.push(`${xSvg},${ySvgFilt}`);
    }
    
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full bg-slate-900 rounded-lg shadow-inner">
        {/* Grid lines */}
        <line x1="0" y1="50" x2="400" y2="50" stroke="#333" strokeDasharray="4" />
        <text x="5" y="45" fill="#666" fontSize="10">250V</text>
        <line x1="0" y1="150" x2="400" y2="150" stroke="#333" strokeDasharray="4" />
        <text x="5" y="145" fill="#666" fontSize="10">125V</text>
        <line x1="0" y1="250" x2="400" y2="250" stroke="#555" />
        <text x="5" y="265" fill="#666" fontSize="10">0V</text>
        <text x="360" y="265" fill="#666" fontSize="10">100ms</text>
        
        {/* Raw full wave rectified */}
        <path d={`M ${rawPathPoints.join(' L ')}`} stroke="#3b82f6" fill="none" strokeWidth="2" opacity="0.4" strokeDasharray="4" />
        
        {/* Filtered output */}
        <path d={`M ${filterPathPoints.join(' L ')}`} stroke="#22c55e" fill="none" strokeWidth="3" />
        
        {/* Legend */}
        <rect x="230" y="10" width="160" height="40" fill="#1e293b" rx="4" />
        <line x1="240" y1="20" x2="260" y2="20" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
        <text x="270" y="24" fill="#cbd5e1" fontSize="10">Rectified (Unfiltered)</text>
        <line x1="240" y1="35" x2="260" y2="35" stroke="#22c55e" strokeWidth="3" />
        <text x="270" y="39" fill="#cbd5e1" fontSize="10">Smoothed DC Output</text>
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans select-none overflow-hidden">
      <div className="bg-slate-900 text-white p-4 flex items-center shadow-md shrink-0">
        <button onClick={onExit} className="flex items-center text-slate-300 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Go Back
        </button>
        <h1 className="ml-6 text-xl font-semibold">Lab P12.3: Circuit Engineering (AC to DC)</h1>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto">
        
        {/* Left Column: Theory */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center mb-4 text-orange-600">
            <Power className="w-6 h-6 mr-2" />
            <h2 className="text-lg font-bold">Theory & Context</h2>
          </div>
          <div className="text-slate-700 space-y-4 text-sm leading-relaxed overflow-y-auto flex-1 pr-2">
            <p>
              Electronic devices (like laptops and phones) require steady <strong>Direct Current (DC)</strong>, 
              but the power grid delivers <strong>Alternating Current (AC)</strong>. Converting AC to DC requires several steps.
            </p>
            
            <h3 className="font-bold text-orange-800">1. Rectification</h3>
            <p>
              A <em>Full-Wave Bridge Rectifier</em> uses four diodes to flip the negative half-cycles of the AC wave into positive ones. 
              The result is a pulsing DC voltage.
            </p>
            
            <h3 className="font-bold text-orange-800 mt-4">2. Capacitive Filtering</h3>
            <p>
              To smooth out the pulses, we add a capacitor in parallel with the load. The capacitor charges up to the peak voltage, 
              then discharges slowly through the load when the input voltage drops.
            </p>
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
              The remaining fluctuation is called <strong>Ripple Voltage (V_r)</strong>:
              <br /><br />
              <div className="font-mono text-center font-bold">
                V_r ≈ I / (2 · f · C)
              </div>
              <div className="text-xs text-center mt-2">(Assuming Full-Wave where ripple frequency is 2f)</div>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>f:</strong> AC source frequency (Hz)</li>
              <li><strong>C:</strong> Filter capacitance (F)</li>
              <li><strong>I:</strong> Load current (A) ≈ V_peak / R</li>
            </ul>
          </div>
        </div>

        {/* Middle Column: Simulation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-orange-600">
              <Settings2 className="w-6 h-6 mr-2" />
              <h2 className="text-lg font-bold">Interactive Oscilloscope</h2>
            </div>
          </div>

          <div className="h-64 mb-6 rounded-lg overflow-hidden border border-slate-800 relative">
            {renderSimulationSVG()}
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200 shadow-sm">
                <span className="text-sm font-bold text-slate-700">Filter Capacitor</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={filterEnabled} onChange={(e) => setFilterEnabled(e.target.checked)} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                  <span>AC Frequency</span>
                  <span className="text-orange-600 font-bold">{frequency} Hz</span>
                </label>
                <input type="range" min="10" max="100" step="10" value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} className="w-full accent-orange-600" />
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                  <span>Peak Voltage</span>
                  <span className="text-orange-600 font-bold">{peakVoltage} V</span>
                </label>
                <input type="range" min="10" max="200" step="10" value={peakVoltage} onChange={(e) => setPeakVoltage(Number(e.target.value))} className="w-full accent-orange-600" />
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                  <span>Filter Capacitance</span>
                  <span className="text-orange-600 font-bold">{capacitance} μF</span>
                </label>
                <input type="range" min="10" max="2000" step="50" value={capacitance} onChange={(e) => setCapacitance(Number(e.target.value))} className="w-full accent-orange-600" disabled={!filterEnabled} />
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                  <span>Load Resistance</span>
                  <span className="text-orange-600 font-bold">{loadResistance} Ω</span>
                </label>
                <input type="range" min="50" max="5000" step="50" value={loadResistance} onChange={(e) => setLoadResistance(Number(e.target.value))} className="w-full accent-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assessment & Data */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 text-orange-600">
            <div className="flex items-center">
              <Database className="w-6 h-6 mr-2" />
              <h2 className="text-lg font-bold">Data Log & Analysis</h2>
            </div>
            <button onClick={handleRecord} className="px-3 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 text-sm font-semibold transition-colors">
              Record Data
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto mb-6 border border-slate-200 rounded-lg">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2">Freq (Hz)</th>
                  <th className="px-3 py-2">Vp (V)</th>
                  <th className="px-3 py-2">C (μF)</th>
                  <th className="px-3 py-2">R (Ω)</th>
                  <th className="px-3 py-2">Filter</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={5} className="px-3 py-4 text-center text-slate-400">No data recorded yet.</td></tr>
                ) : (
                  logs.map((log, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-medium">{log.f}</td>
                      <td className="px-3 py-2">{log.Vp}</td>
                      <td className="px-3 py-2">{log.C}</td>
                      <td className="px-3 py-2">{log.R}</td>
                      <td className="px-3 py-2 font-bold text-orange-600">{log.filter}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex-1 flex flex-col bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center mb-3 text-slate-800">
              <Calculator className="w-5 h-5 mr-2 text-orange-600" />
              <h3 className="font-bold">Knowledge Check</h3>
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  1. In a full-wave rectifier, what is the ripple frequency if the input AC source frequency is 60 Hz?
                </label>
                <input 
                  type="text" 
                  value={ans1} 
                  onChange={e => setAns1(e.target.value)} 
                  placeholder="e.g. 60" 
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  2. Calculate the approximate ripple voltage (V_r) given Peak Voltage = 100V, f = 50Hz, R = 1000Ω, and C = 100μF. <em>(Hint: use the formula provided in the theory. Round to 1 decimal place.)</em>
                </label>
                <input 
                  type="text" 
                  value={ans2} 
                  onChange={e => setAns2(e.target.value)} 
                  placeholder="e.g. 5.5" 
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {feedback && (
              <div className={`mt-4 p-3 rounded text-sm flex items-start ${feedback.includes('Spot on') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {feedback.includes('Spot on') ? <CheckCircle className="w-5 h-5 mr-2 shrink-0" /> : <XCircle className="w-5 h-5 mr-2 shrink-0" />}
                {feedback}
              </div>
            )}

            <button onClick={checkAnswers} className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors">
              Check Answers
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
