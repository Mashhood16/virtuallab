import { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Save, Lightbulb, Activity } from 'lucide-react';

export default function LabP11Electricity({ onExit }: { onExit?: () => void }) {
  const [mode, setMode] = useState<'sensor' | 'concrete'>('sensor');
  
  // Sensor Circuit State
  const [lightIntensity, setLightIntensity] = useState(50); // 0-100
  const [sensorLogs, setSensorLogs] = useState<{id: number, light: number, r1: number, vout: string}[]>([]);
  const [sensorAns, setSensorAns] = useState('');
  const [sensorStatus, setSensorStatus] = useState<'idle'|'correct'|'incorrect'>('idle');
  
  // Concrete State
  const [severity, setSeverity] = useState(0); // 0-100
  const [concreteLogs, setConcreteLogs] = useState<{id: number, sev: number, vdrop: string, r: number}[]>([]);
  const [concreteAns, setConcreteAns] = useState('');
  const [concreteStatus, setConcreteStatus] = useState<'idle'|'correct'|'incorrect'>('idle');

  // Derived properties
  const R1 = 101 - lightIntensity; // kOhm (LDR resistance)
  const R2 = 10; // kOhm (fixed)
  const Vout = 5 * (R2 / (R1 + R2));

  const R_concrete = 50 + (severity * 0.5); // Ohms
  const I_concrete = 0.1; // A constant
  const V_drop = I_concrete * R_concrete;

  const checkSensor = () => {
    if (Math.abs(parseFloat(sensorAns) - 7.5) < 0.1) setSensorStatus('correct');
    else setSensorStatus('incorrect');
  };

  const checkConcrete = () => {
    if (Math.abs(parseFloat(concreteAns) - 62.5) < 0.1) setConcreteStatus('correct');
    else setConcreteStatus('incorrect');
  };

  const logSensor = () => {
    setSensorLogs(prev => [...prev, { id: Date.now(), light: lightIntensity, r1: R1, vout: Vout.toFixed(2) }]);
  };

  const logConcrete = () => {
    setConcreteLogs(prev => [...prev, { id: Date.now(), sev: severity, vdrop: V_drop.toFixed(2), r: R_concrete }]);
  };

  const renderSimulation = () => {
    if (mode === 'sensor') {
      const isAlarmOn = Vout > 2.5;
      return (
        <svg viewBox="0 0 400 250" className="w-full h-full bg-slate-900 rounded-lg">
          {/* Wires */}
          <path d="M 100 200 L 100 80 L 150 80" stroke="#cbd5e1" strokeWidth={3} fill="none" />
          <path d="M 210 80 L 300 80 L 300 120" stroke="#cbd5e1" strokeWidth={3} fill="none" />
          <path d="M 300 180 L 300 230 L 100 230 L 100 210" stroke="#cbd5e1" strokeWidth={3} fill="none" />
          
          {/* Battery */}
          <rect x="85" y="200" width="30" height="10" fill="#ef4444" />
          <rect x="90" y="210" width="20" height="20" fill="#3b82f6" />
          <text x="50" y="220" fill="white" fontSize="12">5V</text>

          {/* LDR R1 */}
          <rect x="150" y="70" width="60" height="20" fill="#1e293b" stroke="#cbd5e1" strokeWidth={2} />
          <text x="180" y="105" fill="white" fontSize="12" textAnchor="middle">LDR ({R1} kΩ)</text>
          {/* Light aura */}
          <circle cx="180" cy="80" r="25" fill="#eab308" opacity={lightIntensity / 150} />

          {/* Fixed R2 */}
          <rect x="290" y="120" width="20" height="60" fill="#1e293b" stroke="#cbd5e1" strokeWidth={2} />
          <text x="340" y="150" fill="white" fontSize="12" textAnchor="middle">10 kΩ</text>

          {/* Vout Node */}
          <circle cx="300" cy="100" r="5" fill="#ef4444" />
          <text x="320" y="105" fill="#ef4444" fontSize="14" fontWeight="bold">V_out</text>

          {/* Alarm indicator */}
          <circle cx="300" cy="100" r={isAlarmOn ? 15 : 0} fill="red" opacity={0.5} className="animate-ping" />
          {isAlarmOn && <text x="250" y="40" fill="red" fontSize="16" fontWeight="bold">ALARM TRIGGERED!</text>}
        </svg>
      );
    } else {
      const crackPath = `M 200 50 L 210 70 L 190 90 L 220 120 L 200 150 L 230 180`;
      return (
        <svg viewBox="0 0 400 250" className="w-full h-full bg-slate-900 rounded-lg">
          {/* Concrete Block */}
          <rect x="100" y="50" width="200" height="150" fill="#475569" stroke="#334155" strokeWidth={4} rx="4" />
          
          {/* Crack */}
          <path 
            d={crackPath} 
            stroke="#0f172a" 
            strokeWidth={3} 
            fill="none" 
            strokeDasharray="200" 
            strokeDashoffset={200 - severity * 2} 
            className="transition-all duration-300"
          />

          {/* Probes */}
          <line x1="50" y1="125" x2="100" y2="125" stroke="#ef4444" strokeWidth={4} />
          <line x1="300" y1="125" x2="350" y2="125" stroke="#0f172a" strokeWidth={4} />
          
          {/* Multimeter */}
          <rect x="140" y="210" width="120" height="30" fill="#1e293b" stroke="#64748b" strokeWidth={2} rx="4" />
          <text x="200" y="230" fill="#38bdf8" fontSize="16" textAnchor="middle" fontWeight="bold" className="font-mono">
            V = {V_drop.toFixed(2)} V
          </text>
          
          <text x="200" y="30" fill="white" fontSize="14" textAnchor="middle">Carbon Fiber Concrete Bridge Support</text>
        </svg>
      );
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <header className="bg-slate-800 text-white p-4 flex items-center shadow-md">
        <button onClick={onExit} className="mr-4 hover:bg-slate-700 p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Grade 11 Physics: Practical Electricity</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-grow">
        {/* Theory & Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Lightbulb className="text-yellow-500" /> Circuit Builder
          </h2>
          
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            <button 
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${mode === 'sensor' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:bg-slate-200'}`}
              onClick={() => setMode('sensor')}
            >
              LDR Alarm Circuit
            </button>
            <button 
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${mode === 'concrete' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:bg-slate-200'}`}
              onClick={() => setMode('concrete')}
            >
              Smart Concrete
            </button>
          </div>

          <div className="flex-grow space-y-4">
            {mode === 'sensor' ? (
              <>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A potential divider uses two resistors in series to divide voltage. An LDR (Light Dependent Resistor) decreases its resistance as light intensity increases.
                  {"$$V_{out} = V_{in} \\times \\frac{R_2}{R_1 + R_2}$$"}
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Light Intensity: {lightIntensity}%</label>
                  <input type="range" min="0" max="100" value={lightIntensity} onChange={(e) => setLightIntensity(Number(e.target.value))} className="w-full accent-yellow-500" />
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Carbon fiber is mixed into concrete to make it slightly conductive. As cracks form, the cross-sectional area $A$ decreases, increasing resistance $R = \rho L / A$. A constant current of 0.1A is applied to monitor the voltage drop.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Crack Severity: {severity}%</label>
                  <input type="range" min="0" max="100" value={severity} onChange={(e) => setSeverity(Number(e.target.value))} className="w-full accent-slate-800" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Simulation */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4 border border-slate-200 lg:col-span-1">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Interactive Board</h2>
          </div>
          <div className="flex-grow flex items-center justify-center">
            {renderSimulation()}
          </div>
        </div>

        {/* Assessment & Data */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-500" /> Analysis & Assessment
          </h2>
          
          <div className="space-y-4">
            <button 
              onClick={mode === 'sensor' ? logSensor : logConcrete}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors"
            >
              <Save size={18} /> Record Data
            </button>
            
            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 sticky top-0">
                  {mode === 'sensor' ? (
                    <tr><th className="p-2">Light (%)</th><th className="p-2">R_1 (kΩ)</th><th className="p-2">V_out (V)</th></tr>
                  ) : (
                    <tr><th className="p-2">Severity (%)</th><th className="p-2">R (Ω)</th><th className="p-2">V_drop (V)</th></tr>
                  )}
                </thead>
                <tbody>
                  {mode === 'sensor' ? sensorLogs.map(l => (
                    <tr key={l.id} className="border-t border-slate-100"><td className="p-2">{l.light}</td><td className="p-2">{l.r1}</td><td className="p-2 font-mono text-red-600">{l.vout}</td></tr>
                  )) : concreteLogs.map(l => (
                    <tr key={l.id} className="border-t border-slate-100"><td className="p-2">{l.sev}</td><td className="p-2">{l.r}</td><td className="p-2 font-mono text-blue-600">{l.vdrop}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2">Knowledge Check</h3>
            {mode === 'sensor' ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">In a voltage divider, {"$V_{in} = 9V$"}, {"$R_1$"} (LDR) {"$= 2k\\Omega$"}, and {"$R_2 = 10k\\Omega$"}. Find {"$V_{out}$"}. (V)</p>
                <div className="flex gap-2">
                  <input type="number" step="0.1" value={sensorAns} onChange={e => {setSensorAns(e.target.value); setSensorStatus('idle');}} className="flex-grow px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 7.5" />
                  <button onClick={checkSensor} className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors">Check</button>
                </div>
                {sensorStatus === 'correct' && <p className="text-green-600 text-sm flex items-center gap-1"><CheckCircle2 size={16}/> Correct!</p>}
                {sensorStatus === 'incorrect' && <p className="text-red-600 text-sm flex items-center gap-1"><XCircle size={16}/> Incorrect. Try again.</p>}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">A concrete beam has an initial resistance of $50\Omega$. If a crack reduces the cross-sectional area by 20% (so Area is now 0.8), what is the new resistance? ($\Omega$)</p>
                <div className="flex gap-2">
                  <input type="number" step="0.1" value={concreteAns} onChange={e => {setConcreteAns(e.target.value); setConcreteStatus('idle');}} className="flex-grow px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 62.5" />
                  <button onClick={checkConcrete} className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors">Check</button>
                </div>
                {concreteStatus === 'correct' && <p className="text-green-600 text-sm flex items-center gap-1"><CheckCircle2 size={16}/> Correct!</p>}
                {concreteStatus === 'incorrect' && <p className="text-red-600 text-sm flex items-center gap-1"><XCircle size={16}/> Incorrect. Remember $R \propto 1/A$.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
