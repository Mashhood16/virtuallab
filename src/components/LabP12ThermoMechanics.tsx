import { useState } from 'react';
import { ArrowLeft, Train, Star, Activity, CheckCircle, XCircle, Thermometer, Layers } from 'lucide-react';

export default function LabP12ThermoMechanics({ onExit }: { onExit?: () => void }) {
  const [scenario, setScenario] = useState<'maglev' | 'whitedwarf'>('maglev');

  // Maglev State
  const [temperature, setTemperature] = useState<number>(293); // K
  const [magneticField, setMagneticField] = useState<number>(1.0); // T
  const Tc = 92; // YBCO Critical Temp
  const [maglevAns, setMaglevAns] = useState('');
  const [maglevStatus, setMaglevStatus] = useState<'idle'|'correct'|'incorrect'>('idle');

  // White Dwarf State
  const [mass, setMass] = useState<number>(1.0); // Solar masses
  const limit = 1.44;
  const [wdAns, setWdAns] = useState('');
  const [wdStatus, setWdStatus] = useState<'idle'|'correct'|'incorrect'>('idle');

  const checkMaglev = () => {
    const v = parseFloat(maglevAns);
    if (!isNaN(v) && v >= 9.7 && v <= 9.9) setMaglevStatus('correct');
    else setMaglevStatus('incorrect');
  };

  const checkWd = () => {
    const v = parseFloat(wdAns);
    if (!isNaN(v) && v >= 1.43 && v <= 1.45) setWdStatus('correct');
    else setWdStatus('incorrect');
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Layers className="text-orange-400" />
            Extreme States of Matter
          </h1>
        </div>
        <div className="flex gap-4 items-center">
          <select 
            className="bg-slate-800 border border-slate-700 text-white px-3 py-1 rounded-md outline-none focus:border-orange-500"
            value={scenario}
            onChange={(e) => setScenario(e.target.value as any)}
          >
            <option value="maglev">Superconducting Maglev</option>
            <option value="whitedwarf">White Dwarf Degeneracy</option>
          </select>
          <div className="text-sm font-medium text-slate-400">Grade 12 Physics</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 gap-6 p-6">
        
        {/* Left Column: Theory */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4 overflow-y-auto">
          {scenario === 'maglev' ? (
            <>
              <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                <Train className="text-blue-600"/> Superconductivity
              </h2>
              <div className="text-slate-600 space-y-4">
                <p>
                  At extremely low temperatures, certain materials undergo a phase transition where their electrical resistance drops exactly to zero.
                </p>
                <p>
                  <strong>Meissner Effect:</strong> Superconductors expel magnetic fields from their interior. This perfectly diamagnetic behavior allows them to stably levitate above permanent magnets, a principle used in Maglev trains.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-900 mb-2">Magnetic Levitation Force</h3>
                  <p className="font-mono text-center text-blue-800">F_m = (B² / 2μ₀) × A</p>
                  <p className="text-sm text-blue-700 mt-2">
                    For levitation, the magnetic force F_m must equal the gravitational force (m·g).
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                <Star className="text-orange-500"/> Electron Degeneracy
              </h2>
              <div className="text-slate-600 space-y-4">
                <p>
                  When a medium-sized star exhausts its nuclear fuel, it collapses under its own gravity to form a White Dwarf.
                </p>
                <p>
                  <strong>Pauli Exclusion Principle:</strong> No two electrons can occupy the same quantum state. As gravity crushes the star, electrons are forced into higher energy states, generating immense <strong>Electron Degeneracy Pressure</strong> that halts the collapse.
                </p>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <h3 className="font-semibold text-orange-900 mb-2">Mass-Radius Relation</h3>
                  <p className="font-mono text-center text-orange-800">R ∝ M^(-1/3)</p>
                  <p className="text-sm text-orange-800 mt-2">
                    Unlike normal objects, adding mass to a white dwarf makes it <em>smaller</em>. If it exceeds the <strong>Chandrasekhar Limit (~1.44 M_sun)</strong>, electron degeneracy pressure fails, and it collapses into a neutron star or black hole.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Middle Column: Simulation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 w-full">
            {scenario === 'maglev' ? <Thermometer className="text-blue-500"/> : <Star className="text-orange-500"/>}
            Interactive Visualizer
          </h2>
          
          <div className="w-full aspect-square max-w-md bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border-4 border-slate-800 shadow-inner">
            {scenario === 'maglev' ? (
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Track */}
                <rect x="20" y="160" width="160" height="20" fill="#475569" />
                <rect x="20" y="150" width="160" height="10" fill="#64748b" />
                <text x="100" y="175" fill="white" fontSize="10" textAnchor="middle">Magnetic Track</text>
                
                {/* Field lines */}
                {Array.from({length: 7}).map((_, i) => {
                  const x = 40 + i * 20;
                  const levitating = temperature <= Tc;
                  const curve = levitating ? `Q ${x} 100, ${x < 100 ? x - 40 : x + 40} 60` : `L ${x} 60`;
                  return (
                    <path 
                      key={i} 
                      d={`M ${x} 150 ${curve}`} 
                      stroke="rgba(56, 189, 248, 0.4)" 
                      strokeWidth="2" 
                      fill="none" 
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* Train Block */}
                <g style={{ transform: `translateY(${temperature <= Tc ? -40 - magneticField * 20 : 0}px)`, transition: 'transform 0.5s ease' }}>
                  <rect x="60" y="110" width="80" height="40" fill={temperature <= Tc ? "#10b981" : "#94a3b8"} rx="4" />
                  <text x="100" y="135" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">
                    {temperature <= Tc ? "SUPERCONDUCTING" : "NORMAL"}
                  </text>
                </g>
                
                {/* Frost overlay */}
                {temperature < 200 && (
                  <rect x="0" y="0" width="200" height="200" fill="rgba(255,255,255,0.1)" style={{ opacity: (200 - temperature)/200 }} pointerEvents="none" />
                )}
              </svg>
            ) : (
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r={mass > limit ? 2 : Math.max(10, 80 * Math.pow(mass, -1/3))} fill={mass > limit ? "#000" : "#fff"} />
                {mass <= limit && <circle cx="100" cy="100" r={Math.max(10, 80 * Math.pow(mass, -1/3))} fill="url(#wd-glow)" />}
                <defs>
                  <radialGradient id="wd-glow">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
                    <stop offset="50%" stopColor="rgba(100, 200, 255, 0.5)" />
                    <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                  </radialGradient>
                </defs>
                
                {/* Gravity vs Pressure arrows */}
                {mass <= limit && (
                  <>
                    {/* Gravity (Inward) */}
                    <path d="M 50 50 L 80 80" stroke="rgba(239, 68, 68, 0.8)" strokeWidth={2 + mass} markerEnd="url(#arrow-in)" />
                    <path d="M 150 150 L 120 120" stroke="rgba(239, 68, 68, 0.8)" strokeWidth={2 + mass} markerEnd="url(#arrow-in)" />
                    
                    {/* Degeneracy Pressure (Outward) */}
                    <path d="M 100 100 L 60 140" stroke="rgba(56, 189, 248, 0.8)" strokeWidth={2 + mass} markerEnd="url(#arrow-out)" />
                    <path d="M 100 100 L 140 60" stroke="rgba(56, 189, 248, 0.8)" strokeWidth={2 + mass} markerEnd="url(#arrow-out)" />
                  </>
                )}
                
                <defs>
                  <marker id="arrow-in" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto-start-reverse">
                    <path d="M 0 0 L 6 3 L 0 6 z" fill="rgba(239, 68, 68, 0.8)" />
                  </marker>
                  <marker id="arrow-out" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto-start-reverse">
                    <path d="M 0 0 L 6 3 L 0 6 z" fill="rgba(56, 189, 248, 0.8)" />
                  </marker>
                </defs>

                {mass > limit && (
                  <text x="100" y="100" fill="red" fontSize="14" textAnchor="middle" fontWeight="bold">COLLAPSED (Black Hole)</text>
                )}
              </svg>
            )}
          </div>

          <div className="w-full mt-6 space-y-4">
            {scenario === 'maglev' ? (
              <>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-semibold text-slate-700">Temperature (T)</label>
                    <span className="text-sm font-mono text-blue-600">{temperature} K</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" max="300" step="1" 
                    value={temperature} 
                    onChange={(e) => setTemperature(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="text-xs text-slate-500 mt-1 flex justify-between">
                    <span>Liquid Helium (4K)</span>
                    <span>Liquid N2 (77K)</span>
                    <span>Room Temp</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-semibold text-slate-700">Magnetic Field (B)</label>
                    <span className="text-sm font-mono text-blue-600">{magneticField.toFixed(1)} Tesla</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="5" step="0.1" 
                    value={magneticField} 
                    onChange={(e) => setMagneticField(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-semibold text-slate-700">Star Mass (M)</label>
                    <span className="text-sm font-mono text-orange-600">{mass.toFixed(2)} M_sun</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1" max="2.0" step="0.01" 
                    value={mass} 
                    onChange={(e) => setMass(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Assessment */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <Activity className="text-emerald-500" />
            Analysis & Computation
          </h2>

          <div className="space-y-6">
            {scenario === 'maglev' ? (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2">Magnetic Pressure</h3>
                <p className="text-sm text-slate-600 mb-3">
                  To levitate a train of mass 50,000 kg over an area of 50 m², the magnetic pressure P = F/A must equal the pressure from gravity. 
                  Given P = B² / 2μ₀ (where μ₀ = 4π × 10⁻⁷ T·m/A) and g = 9.8 m/s².
                  Calculate the required Magnetic Field (B) in milliTesla (mT).
                </p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={maglevAns}
                    onChange={(e) => setMaglevAns(e.target.value)}
                    placeholder="e.g. 9.8"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button 
                    onClick={checkMaglev}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Check
                  </button>
                </div>
                {maglevStatus === 'correct' && <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1"><CheckCircle size={16}/> Correct! B ≈ 9.8 mT.</p>}
                {maglevStatus === 'incorrect' && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><XCircle size={16}/> Try again. Evaluate mg/A first, then solve for B.</p>}
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2">Chandrasekhar Limit</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Subrahmanyan Chandrasekhar determined that a white dwarf cannot support itself if its mass exceeds a certain limit.
                  Based on the simulation, at what exact mass (in M_sun) does the star completely collapse?
                </p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={wdAns}
                    onChange={(e) => setWdAns(e.target.value)}
                    placeholder="e.g. 1.44"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <button 
                    onClick={checkWd}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Check
                  </button>
                </div>
                {wdStatus === 'correct' && <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1"><CheckCircle size={16}/> Correct! Limit is ~1.44 Solar Masses.</p>}
                {wdStatus === 'incorrect' && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><XCircle size={16}/> Try again. Observe the simulator carefully.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
