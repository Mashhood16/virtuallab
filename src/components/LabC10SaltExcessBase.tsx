import { useState } from 'react';
import { Beaker, Flame, Filter, Droplet, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
  onExit?: () => void;
}

export default function LabC10SaltExcessBase({ onExit }: Props) {
  const [step, setStep] = useState(0); 
  const [h2so4Vol, setH2so4Vol] = useState(50);
  const [cuoMass, setCuoMass] = useState(5.0);
  const [equation, setEquation] = useState("Setup your experiment by selecting variables.");
  const [logs, setLogs] = useState<{vol: number, mass: number, yield: number}[]>([]);
  const [assessmentAnswer, setAssessmentAnswer] = useState("");
  const [assessmentResult, setAssessmentResult] = useState<string | null>(null);
  const [currentYield, setCurrentYield] = useState(0);

  const h2so4Conc = 1.0; 
  const mmCuO = 79.55;
  const mmCuSO4_5H2O = 249.68;
  
  const molesH2SO4 = (h2so4Vol / 1000) * h2so4Conc;
  const molesCuO = cuoMass / mmCuO;
  const limitingMoles = Math.min(molesH2SO4, molesCuO);
  const theorYield = limitingMoles * mmCuSO4_5H2O;

  const handleAction = (action: string) => {
    if (action === 'acid' && step === 0) {
      setStep(1);
      setEquation("H₂SO₄(aq)");
    } else if (action === 'cuo' && step === 1) {
      setStep(2);
      setEquation("H₂SO₄(aq) + CuO(s)");
    } else if (action === 'heat' && step === 2) {
      setStep(3);
      setEquation("H₂SO₄(aq) + CuO(s) → CuSO₄(aq) + H₂O(l)  [Excess CuO remains]");
    } else if (action === 'filter' && step === 3) {
      setStep(4);
      setEquation("Filtrate: CuSO₄(aq)  |  Residue: CuO(s)");
    } else if (action === 'crystallize' && step === 4) {
      setStep(5);
      setEquation("CuSO₄(aq) → CuSO₄·5H₂O(s) + Heat");
      setCurrentYield(theorYield * (0.80 + Math.random() * 0.10));
    }
  };

  const handleLogData = () => {
    if (step === 5) {
      setLogs([...logs, { vol: h2so4Vol, mass: cuoMass, yield: parseFloat(currentYield.toFixed(2)) }]);
      setStep(0);
      setEquation("Experiment reset. Change variables and run again!");
    }
  };

  const checkAssessment = () => {
    const ans = parseFloat(assessmentAnswer);
    if (isNaN(ans)) {
      setAssessmentResult("Please enter a valid number.");
      return;
    }
    const diff = Math.abs(ans - theorYield);
    if (diff < 0.5) {
      setAssessmentResult("Correct! Well done calculating the theoretical yield.");
    } else {
      setAssessmentResult(`Incorrect. Check limiting reactant. Theoretical yield is ~${theorYield.toFixed(2)}g.`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      {/* Header */}
      <LabHeader onExit={onExit} title="Preparation of Soluble Salt: Excess Base Method" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
        
        {/* Left Column: Theory & Setup */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="bg-slate-100 p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Beaker className="text-blue-600" /> Theory & Setup
            </h2>
          </div>
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Reaction Principle</h3>
              <p className="text-sm text-slate-600 mb-2">
                A soluble salt can be prepared by reacting an acid with an insoluble base (metal oxide).
              </p>
              <div className="bg-slate-800 text-green-400 p-3 rounded-lg font-mono text-sm shadow-inner">
                CuO(s) + H₂SO₄(aq) → CuSO₄(aq) + H₂O(l)
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Set Variables</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Volume of 1.0M H₂SO₄: {h2so4Vol} mL
                  </label>
                  <input 
                    type="range" min="20" max="100" step="10" value={h2so4Vol}
                    onChange={(e) => setH2so4Vol(parseFloat(e.target.value))}
                    disabled={step > 0}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mass of CuO powder: {cuoMass.toFixed(1)} g
                  </label>
                  <input 
                    type="range" min="1.0" max="10.0" step="0.5" value={cuoMass}
                    onChange={(e) => setCuoMass(parseFloat(e.target.value))}
                    disabled={step > 0}
                    className="w-full accent-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-800 text-sm mb-2">Procedure:</h4>
              <ol className="text-sm text-blue-900 space-y-1 list-decimal list-inside">
                <li>Add Acid to beaker.</li>
                <li>Add base until in excess.</li>
                <li>Heat gently to speed up reaction.</li>
                <li>Filter unreacted base.</li>
                <li>Evaporate filtrate to crystallize.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Middle Column: Simulation */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="bg-slate-100 p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Virtual Workbench</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-between">
            
            {/* Interactive Bottles */}
            <div className="flex flex-wrap justify-center gap-4 w-full">
              <button onClick={() => handleAction('acid')} disabled={step !== 0} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${step === 0 ? 'border-blue-400 bg-blue-50 hover:bg-blue-100 cursor-pointer shadow-md' : 'border-slate-100 opacity-40 cursor-not-allowed'}`}>
                <Droplet size={28} className="text-blue-500 mb-2" />
                <span className="font-semibold text-xs text-center">H₂SO₄ Bottle</span>
              </button>
              <button onClick={() => handleAction('cuo')} disabled={step !== 1} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${step === 1 ? 'border-slate-800 bg-slate-50 hover:bg-slate-200 cursor-pointer shadow-md' : 'border-slate-100 opacity-40 cursor-not-allowed'}`}>
                <Beaker size={28} className="text-slate-800 mb-2" />
                <span className="font-semibold text-xs text-center">CuO Bottle</span>
              </button>
              <button onClick={() => handleAction('heat')} disabled={step !== 2} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${step === 2 ? 'border-red-400 bg-red-50 hover:bg-red-100 cursor-pointer shadow-md' : 'border-slate-100 opacity-40 cursor-not-allowed'}`}>
                <Flame size={28} className="text-red-500 mb-2" />
                <span className="font-semibold text-xs text-center">Heat & Stir</span>
              </button>
              <button onClick={() => handleAction('filter')} disabled={step !== 3} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${step === 3 ? 'border-amber-400 bg-amber-50 hover:bg-amber-100 cursor-pointer shadow-md' : 'border-slate-100 opacity-40 cursor-not-allowed'}`}>
                <Filter size={28} className="text-amber-700 mb-2" />
                <span className="font-semibold text-xs text-center">Filter</span>
              </button>
              <button onClick={() => handleAction('crystallize')} disabled={step !== 4} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${step === 4 ? 'border-cyan-400 bg-cyan-50 hover:bg-cyan-100 cursor-pointer shadow-md' : 'border-slate-100 opacity-40 cursor-not-allowed'}`}>
                <CheckCircle size={28} className="text-cyan-600 mb-2" />
                <span className="font-semibold text-xs text-center">Crystallize</span>
              </button>
            </div>

            {/* Simulation Canvas */}
            <div className="w-full max-w-md my-8 relative">
              <svg viewBox="0 0 200 200" className="w-full h-auto drop-shadow-md">
                {/* Desk */}
                <rect x="20" y="180" width="160" height="8" fill="#cbd5e1" rx="2" />
                
                {step === 5 ? (
                  <g transform="translate(0, 30)">
                    {/* Evaporating Dish */}
                    <path d="M 60 130 Q 100 160 140 130" fill="#f8fafc" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                    {/* Crystals */}
                    <polygon points="90,140 100,125 110,140 100,150" fill="#2563eb" />
                    <polygon points="105,135 115,120 125,135 115,145" fill="#3b82f6" />
                    <polygon points="75,135 85,120 95,135 85,145" fill="#1d4ed8" />
                    <polygon points="85,145 90,135 105,145 95,150" fill="#60a5fa" />
                  </g>
                ) : step === 4 ? (
                  <g>
                    {/* Filtrate */}
                    <path d="M 70 90 L 70 170 Q 70 180 80 180 L 120 180 Q 130 180 130 170 L 130 90" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" />
                    <rect x="72" y="140" width="56" height="38" fill="#3b82f6" opacity="0.8" rx="2" />
                  </g>
                ) : (
                  <g>
                    {/* Main Beaker */}
                    <path d="M 70 90 L 70 170 Q 70 180 80 180 L 120 180 Q 130 180 130 170 L 130 90" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" />
                    {step >= 1 && (
                      <rect x="72" y={178 - h2so4Vol * 0.6} width="56" height={h2so4Vol * 0.6} fill={step >= 3 ? "#3b82f6" : "#e2e8f0"} opacity="0.8" rx="2" />
                    )}
                    {step >= 2 && step <= 3 && (
                      <g>
                        {Array.from({ length: Math.min(20, cuoMass * 3) }).map((_, i) => (
                           <circle key={i} cx={80 + (i * 3.7) % 40} cy={175 - (i % 4)} r="2" fill="#0f172a" />
                        ))}
                      </g>
                    )}
                    {step === 3 && (
                      <g>
                         <path d="M 90 190 Q 100 170 110 190 Z" fill="#ef4444" />
                         <path d="M 95 190 Q 100 180 105 190 Z" fill="#facc15" />
                      </g>
                    )}
                  </g>
                )}
              </svg>
            </div>

            {/* Dynamic Equation */}
            <div className="w-full bg-slate-800 text-green-400 p-4 rounded-xl font-mono text-center shadow-inner min-h-[4rem] flex flex-col justify-center items-center">
              <span className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Live Reaction</span>
              <span className="text-lg">{equation}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Data & Analysis */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="bg-slate-100 p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Data & Analysis</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            
            <div className="flex-1 overflow-y-auto mb-6">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-2 font-semibold text-slate-700">H₂SO₄ (mL)</th>
                    <th className="py-3 px-2 font-semibold text-slate-700">CuO (g)</th>
                    <th className="py-3 px-2 font-semibold text-slate-700">Yield (g)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.length === 0 && (
                    <tr><td colSpan={3} className="py-4 text-center text-slate-500 italic">No data recorded yet.</td></tr>
                  )}
                  {logs.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-2">{log.vol}</td>
                      <td className="py-3 px-2">{log.mass.toFixed(1)}</td>
                      <td className="py-3 px-2 font-semibold text-blue-600">{log.yield}</td>
                    </tr>
                  ))}
                  {step === 5 && (
                    <tr className="bg-blue-50 animate-pulse">
                      <td className="py-3 px-2">{h2so4Vol}</td>
                      <td className="py-3 px-2">{cuoMass.toFixed(1)}</td>
                      <td className="py-3 px-2 font-semibold text-blue-600">{currentYield.toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <button 
              onClick={handleLogData}
              disabled={step !== 5}
              className="w-full py-3 bg-slate-800 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900 transition-colors mb-6"
            >
              Record Data & Reset
            </button>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-2">Assessment</h3>
              <p className="text-sm text-slate-600 mb-4">
                Calculate the theoretical yield of CuSO₄·5H₂O crystals (g) based on your current setup variables. 
                <br/><span className="text-xs text-slate-400">Molar masses: CuO=79.55, CuSO₄·5H₂O=249.68</span>
              </p>
              <div className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  value={assessmentAnswer}
                  onChange={e => setAssessmentAnswer(e.target.value)}
                  placeholder="e.g. 15.5"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
                <button onClick={checkAssessment} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-sm">
                  Check
                </button>
              </div>
              {assessmentResult && (
                <div className={`text-sm p-3 rounded-lg ${assessmentResult.startsWith('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {assessmentResult}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
