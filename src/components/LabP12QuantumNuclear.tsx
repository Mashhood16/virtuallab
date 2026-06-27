import { useState, useEffect, useRef } from 'react';
import { Activity, AlertTriangle, Zap, ThermometerSun, Shield } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP12QuantumNuclear({ onExit }: { onExit?: () => void }) {
  const [controlRodDepth, setControlRodDepth] = useState(80);
  const [coolantFlow, setCoolantFlow] = useState(50);
  const [temperature, setTemperature] = useState(300);
  const [power, setPower] = useState(0);
  const [meltdown, setMeltdown] = useState(false);
  
  const [petAns, setPetAns] = useState('');
  const [reactorAns, setReactorAns] = useState('');
  const [petFeedback, setPetFeedback] = useState('');
  const [reactorFeedback, setReactorFeedback] = useState('');

  const tempRef = useRef(300);
  const powerRef = useRef(0);
  const meltdownRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (meltdownRef.current) return;
      
      const reactivity = 100 - controlRodDepth;
      const cooling = coolantFlow * 2;
      const heating = reactivity * 18;
      
      const targetTemp = 300 + Math.max(0, heating - cooling * 0.5);
      
      tempRef.current += (targetTemp - tempRef.current) * 0.02;
      
      if (tempRef.current > 2000) {
        meltdownRef.current = true;
        setMeltdown(true);
      }
      
      const pwr = Math.max(0, tempRef.current > 400 ? (tempRef.current - 400) * 3 : 0);
      powerRef.current += (pwr - powerRef.current) * 0.05;
      
      setTemperature(Math.round(tempRef.current));
      setPower(Math.round(powerRef.current));
    }, 50);
    return () => clearInterval(interval);
  }, [controlRodDepth, coolantFlow]);

  const checkPet = () => {
    const v = parseFloat(petAns);
    if (v >= 1.02 && v <= 1.03) setPetFeedback('Correct! 1.022 MeV');
    else setPetFeedback('Incorrect. Use E = 2mc², convert to MeV (1 eV = 1.6e-19 J).');
  };

  const checkReactor = () => {
    const v = parseFloat(reactorAns);
    // 1 GW = 1e9 J/s. m = E/c^2 = 1e9 / 9e16 = 1.11e-8 kg
    if (v >= 1.1 && v <= 1.12) setReactorFeedback('Correct! ~1.11e-8 kg/s');
    else setReactorFeedback('Incorrect. Use m = E/c².');
  };

  const restart = () => {
    meltdownRef.current = false;
    setMeltdown(false);
    setControlRodDepth(80);
    setCoolantFlow(50);
    tempRef.current = 300;
    powerRef.current = 0;
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 font-sans select-none">
      <LabHeader onExit={onExit} title="Lab 12.1: Quantum & Nuclear Engineering" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 min-h-0">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-5 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 border-b pb-2">Theory & Context</h2>
          
          <div className="space-y-4 text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
            <section>
              <h3 className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <Shield size={16} className="text-emerald-600"/> Nuclear Fission & Reactors
              </h3>
              <p className="mt-1">
                Nuclear power harnesses the energy released from induced fission of U-235. Neutrons strike the nucleus, splitting it into daughter nuclei and releasing 2-3 fast neutrons plus energy (E=mc²).
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><b>Moderator:</b> Slows down fast neutrons to thermal speeds so they can induce fission.</li>
                <li><b>Control Rods:</b> (e.g., Boron, Cadmium) Absorb neutrons to control the chain reaction rate.</li>
                <li><b>Coolant:</b> Transfers heat to generate steam, producing electricity.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2 mt-4">
                <Zap size={16} className="text-amber-500"/> PET Scans & Antimatter
              </h3>
              <p className="mt-1">
                Positron Emission Tomography (PET) relies on antimatter. A tracer emits a positron (e⁺), which annihilates with an electron (e⁻). 
                The entire mass is converted into two gamma rays traveling in opposite directions: E = 2m_e c².
              </p>
            </section>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-5 flex flex-col relative overflow-hidden">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Reactor Control Panel</h2>
          
          <div className="flex gap-4 mb-4 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
                Control Rod Depth: {controlRodDepth}%
              </label>
              <input 
                type="range" min="0" max="100" value={controlRodDepth} 
                onChange={(e) => setControlRodDepth(Number(e.target.value))}
                disabled={meltdown}
                className="w-full accent-slate-700"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
                Coolant Flow: {coolantFlow}%
              </label>
              <input 
                type="range" min="0" max="100" value={coolantFlow} 
                onChange={(e) => setCoolantFlow(Number(e.target.value))}
                disabled={meltdown}
                className="w-full accent-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-around mb-4">
            <div className={`p-3 rounded-lg flex flex-col items-center ${meltdown ? 'bg-red-100 text-red-700' : temperature > 1200 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
              <ThermometerSun size={24} className="mb-1" />
              <span className="text-xl font-bold">{temperature}°C</span>
              <span className="text-xs">Core Temp</span>
            </div>
            <div className="p-3 rounded-lg flex flex-col items-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <Activity size={24} className="mb-1 text-emerald-600" />
              <span className="text-xl font-bold">{power} MW</span>
              <span className="text-xs">Power Output</span>
            </div>
          </div>

          <div className="flex-1 border-2 border-slate-200 dark:border-slate-700 dark:border-slate-500 rounded-lg bg-slate-900 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
            {meltdown ? (
              <div className="text-center text-red-500 animate-pulse flex flex-col items-center">
                <AlertTriangle size={64} className="mb-4" />
                <h3 className="text-2xl font-bold uppercase tracking-widest">Meltdown</h3>
                <p className="text-sm mt-2 text-slate-300">Core temperature exceeded 2000°C</p>
                <button onClick={restart} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Reset System
                </button>
              </div>
            ) : (
              <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
                <rect x="50" y="40" width="100" height="140" fill="#3b82f6" opacity={0.2 + (coolantFlow/200)} />
                <rect x="45" y="30" width="110" height="160" rx="10" fill="none" stroke="#64748b" strokeWidth="4" />
                
                <rect x="60" y="60" width="15" height="110" fill="#ef4444" opacity={temperature > 500 ? 1 : 0.6} />
                <rect x="92.5" y="60" width="15" height="110" fill="#ef4444" opacity={temperature > 500 ? 1 : 0.6} />
                <rect x="125" y="60" width="15" height="110" fill="#ef4444" opacity={temperature > 500 ? 1 : 0.6} />
                
                <g fill="#334155" transform={`translate(0, ${(100 - controlRodDepth) * -1.2})`}>
                  <rect x="78" y="40" width="10" height="130" />
                  <rect x="111" y="40" width="10" height="130" />
                </g>
                
                <rect x="50" y="40" width="100" height="140" fill="#ef4444" opacity={Math.max(0, (temperature - 500)/2000)} style={{ mixBlendMode: 'screen' }} />
              </svg>
            )}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-5 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 border-b pb-2">Analysis & Computing</h2>
          
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Q1: PET Scan Annihilation</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                In a PET scan, a positron and electron annihilate. Calculate the total energy of the two gamma rays produced in <strong>MeV</strong>.
                <br/><span className="text-xs italic">(m_e = 9.11×10⁻³¹ kg, c = 3×10⁸ m/s, 1 eV = 1.6×10⁻¹⁹ J)</span>
              </p>
              <div className="flex gap-2">
                <input 
                  type="number" value={petAns} onChange={e => setPetAns(e.target.value)}
                  placeholder="e.g. 1.022" 
                  className="flex-1 border rounded px-3 py-1.5 text-sm"
                />
                <button onClick={checkPet} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700">
                  Check
                </button>
              </div>
              {petFeedback && <p className={`mt-2 text-sm font-medium ${petFeedback.includes('Correct') ? 'text-emerald-600' : 'text-red-600'}`}>{petFeedback}</p>}
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Q2: Mass Defect</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                If your reactor operates continuously at 1.0 GW (10⁹ W), how much mass is converted to pure energy every second? (Provide answer in <strong>×10⁻⁸ kg</strong>).
                <br/><span className="text-xs italic">Use E = mc²</span>
              </p>
              <div className="flex gap-2 items-center">
                <input 
                  type="number" value={reactorAns} onChange={e => setReactorAns(e.target.value)}
                  placeholder="e.g. 1.11" 
                  className="flex-1 border rounded px-3 py-1.5 text-sm"
                />
                <span className="text-sm text-slate-600 dark:text-slate-300">× 10⁻⁸ kg</span>
                <button onClick={checkReactor} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700">
                  Check
                </button>
              </div>
              {reactorFeedback && <p className={`mt-2 text-sm font-medium ${reactorFeedback.includes('Correct') ? 'text-emerald-600' : 'text-red-600'}`}>{reactorFeedback}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
