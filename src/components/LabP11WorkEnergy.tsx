import { useState, useEffect, useRef } from 'react';
import { Activity, Target, Save, Info, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP11WorkEnergy({ onExit }: { onExit?: () => void }) {
  const [mass, setMass] = useState(80);
  const [area, setArea] = useState(20);
  const [deployed, setDeployed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [simState, setSimState] = useState({ h: 3000, v: 0 });
  const [dataPoints, setDataPoints] = useState<{ mass: number, area: number, vTerm: number }[]>([]);
  const [assessmentAnswer, setAssessmentAnswer] = useState('');
  const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const physicsRef = useRef({ h: 3000, v: 0 });
  const requestRef = useRef<number>(0);
  const prevTimeRef = useRef<number>(0);

  useEffect(() => {
    const updatePhysics = (time: number) => {
      if (prevTimeRef.current !== 0 && isRunning) {
        const dt = Math.min((time - prevTimeRef.current) / 1000, 0.05);
        const g = 9.81;
        const rho = 1.225;
        const Cd = deployed ? 1.5 : 0.7;
        const currentArea = deployed ? area : 0.5;

        let { h, v } = physicsRef.current;
        const Fd = 0.5 * rho * Cd * currentArea * v * v;
        const Fnet = mass * g - Fd;
        const a = Fnet / mass;

        v += a * dt;
        h -= v * dt;
        if (h <= 0) {
          h = 0;
          v = 0;
          setIsRunning(false);
        }

        physicsRef.current = { h, v };
        setSimState({ h, v });
      }
      prevTimeRef.current = time;
      if (isRunning) {
        requestRef.current = requestAnimationFrame(updatePhysics);
      }
    };

    if (isRunning) {
      requestRef.current = requestAnimationFrame(updatePhysics);
    } else {
      prevTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning, mass, area, deployed]);

  const handleRecord = () => {
    setDataPoints(prev => [...prev, { mass, area: deployed ? area : 0.5, vTerm: Math.abs(simState.v) }]);
  };

  const handleReset = () => {
    setIsRunning(false);
    physicsRef.current = { h: 3000, v: 0 };
    setSimState({ h: 3000, v: 0 });
    setDeployed(false);
  };

  const checkAssessment = () => {
    const val = parseFloat(assessmentAnswer);
    if (!isNaN(val) && Math.abs(val - 1.72) < 0.05) {
      setAssessmentStatus('correct');
    } else {
      setAssessmentStatus('incorrect');
    }
  };

  const cloudOffset = (simState.h * 10) % 400;

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Work & Energy: Skydiver Parachute Simulator" />

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theory & Setup */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Info className="text-blue-500" />
            <h2 className="text-lg font-semibold">Theory & Setup</h2>
          </div>
          <div className="text-sm text-slate-600 space-y-2">
            <p><strong>Work-Energy Theorem:</strong> The work done by non-conservative forces (like air resistance) changes the total mechanical energy of the system.</p>
            <p><strong>Terminal Velocity:</strong> Reached when the downward force of gravity equals the upward drag force. <br/> <code className="bg-slate-100 px-1 rounded">Fg = Fd</code> ➔ <code className="bg-slate-100 px-1 rounded">mg = ½ρCdAv²</code></p>
          </div>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="flex justify-between text-sm font-medium text-slate-700">
                <span>Skydiver Mass (kg)</span>
                <span>{mass} kg</span>
              </label>
              <input type="range" min="50" max="120" step="1" value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-full mt-1" disabled={isRunning} />
            </div>
            <div>
              <label className="flex justify-between text-sm font-medium text-slate-700">
                <span>Parachute Area (m²)</span>
                <span>{area} m²</span>
              </label>
              <input type="range" min="10" max="40" step="1" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full mt-1" disabled={isRunning} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsRunning(!isRunning)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                {isRunning ? 'Pause' : 'Start Fall'}
              </button>
              <button onClick={handleReset} className="py-2 px-4 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors">
                Reset
              </button>
            </div>
            <button onClick={() => setDeployed(true)} disabled={deployed || !isRunning} className="w-full py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 transition-colors">
              Deploy Parachute
            </button>
          </div>
        </div>

        {/* Simulator */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Activity className="text-green-500" />
            <h2 className="text-lg font-semibold">Interactive Simulator</h2>
          </div>
          <div className="relative flex-1 bg-sky-300 rounded-lg overflow-hidden border border-slate-200 min-h-[300px]">
            <svg viewBox="0 0 400 400" className="w-full h-full absolute inset-0">
              <g transform={`translate(0, ${cloudOffset})`}>
                 <circle cx="100" cy="50" r="30" fill="white" opacity="0.8" />
                 <circle cx="300" cy="200" r="40" fill="white" opacity="0.8" />
                 <circle cx="150" cy="350" r="25" fill="white" opacity="0.8" />
              </g>
              <g transform={`translate(0, ${cloudOffset - 400})`}>
                 <circle cx="100" cy="50" r="30" fill="white" opacity="0.8" />
                 <circle cx="300" cy="200" r="40" fill="white" opacity="0.8" />
                 <circle cx="150" cy="350" r="25" fill="white" opacity="0.8" />
              </g>
              
              <g transform="translate(200, 200)">
                 <rect x="-5" y="0" width="10" height="30" fill="#1e293b" rx="2" />
                 <circle cx="0" cy="-10" r="8" fill="#fcd34d" />
                 {deployed && (
                    <path d={`M -${area*2} -50 Q 0 -100 ${area*2} -50 L 0 0 Z`} fill="#ef4444" opacity="0.9" />
                 )}
              </g>
              
              <rect x="10" y="10" width="140" height="60" fill="rgba(255,255,255,0.8)" rx="4" />
              <text x="20" y="30" className="text-sm font-bold fill-slate-800">Alt: {simState.h.toFixed(0)} m</text>
              <text x="20" y="55" className="text-sm font-bold fill-slate-800">Vel: {Math.abs(simState.v).toFixed(1)} m/s</text>
            </svg>
          </div>
        </div>

        {/* Data & Assessment */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4 overflow-y-auto">
          <div className="flex items-center gap-2 border-b pb-2">
            <Target className="text-purple-500" />
            <h2 className="text-lg font-semibold">Data & Assessment</h2>
          </div>
          
          <button onClick={handleRecord} className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
            <Save size={18} /> Record Data Point
          </button>
          
          {dataPoints.length > 0 && (
            <div className="mt-2 text-sm max-h-40 overflow-y-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border p-1">Mass (kg)</th>
                    <th className="border p-1">Area (m²)</th>
                    <th className="border p-1">V_term (m/s)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPoints.map((d, i) => (
                    <tr key={i} className="text-center">
                      <td className="border p-1">{d.mass}</td>
                      <td className="border p-1">{d.area}</td>
                      <td className="border p-1">{d.vTerm.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-purple-900 mb-2">Analysis Question</h3>
            <p className="text-sm text-purple-800 mb-3">
              Calculate the drag coefficient (Cd) of an unknown parachute when Mass = 85 kg, Area = 22 m², and Terminal Velocity = 6.0 m/s. Assume ρ = 1.225 kg/m³ and g = 9.81 m/s².
            </p>
            <div className="flex gap-2 items-center">
              <input 
                type="number" 
                value={assessmentAnswer} 
                onChange={(e) => { setAssessmentAnswer(e.target.value); setAssessmentStatus('idle'); }} 
                className="flex-1 p-2 border border-purple-200 rounded outline-none focus:border-purple-500"
                placeholder="Enter Cd..."
              />
              <button onClick={checkAssessment} className="py-2 px-4 bg-purple-600 text-white rounded font-medium hover:bg-purple-700">
                Check
              </button>
            </div>
            {assessmentStatus === 'correct' && <div className="mt-2 text-sm text-green-600 flex items-center gap-1"><CheckCircle size={16}/> Correct! Excellent work.</div>}
            {assessmentStatus === 'incorrect' && <div className="mt-2 text-sm text-red-600 flex items-center gap-1"><XCircle size={16}/> Incorrect, check your formula: Cd = 2mg / (ρAv²)</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
