import { useState, useEffect } from 'react';
import { Beaker, Droplet, Filter, Activity, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
  onExit?: () => void;
}

export default function LabC10SaltExcessCarbonate({ onExit }: Props) {
  const [step, setStep] = useState(0); 
  const [hclVol, setHclVol] = useState(50);
  const [hclConc, setHclConc] = useState(1.0);
  const [caco3Mass, setCaco3Mass] = useState(5.0);
  const [equation, setEquation] = useState("Setup your experiment by selecting variables.");
  
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [currentMass, setCurrentMass] = useState(100.00); // 100g base beaker
  const [massData, setMassData] = useState<{time: number, mass: number}[]>([]);
  
  const [assessmentAnswer, setAssessmentAnswer] = useState("");
  const [assessmentResult, setAssessmentResult] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (step === 2 && running) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, running]);

  useEffect(() => {
    if (step === 2 && running) {
      const molesHCl = (hclVol / 1000) * hclConc;
      const molesCaCO3 = caco3Mass / 100.09;
      const molesCO2 = Math.min(molesHCl / 2, molesCaCO3);
      const totalLoss = molesCO2 * 44.01;
      const k = hclConc * 0.15; // rate depends on concentration
      
      const loss = totalLoss * (1 - Math.exp(-k * time));
      const newMass = 100 + hclVol + caco3Mass - loss + (Math.random() * 0.02 - 0.01);
      
      setCurrentMass(newMass);
      setMassData(prev => {
        if (prev.length > 0 && prev[prev.length - 1].time === time) return prev;
        return [...prev, { time, mass: newMass }];
      });
      
      if (loss >= totalLoss * 0.99 && time > 5) {
        setRunning(false);
        setEquation("Reaction Complete: 2HCl(aq) + CaCO₃(s) → CaCl₂(aq) + H₂O(l) + CO₂(g)↑");
      }
    }
  }, [time, step, running, hclVol, hclConc, caco3Mass]);

  const handleAction = (action: string) => {
    if (action === 'acid' && step === 0) {
      setStep(1);
      setCurrentMass(100 + hclVol); 
      setEquation("2HCl(aq)");
    } else if (action === 'caco3' && step === 1) {
      setStep(2);
      setCurrentMass(100 + hclVol + caco3Mass);
      setRunning(true);
      setTime(0);
      setMassData([{ time: 0, mass: 100 + hclVol + caco3Mass }]);
      setEquation("2HCl(aq) + CaCO₃(s) → CaCl₂(aq) + H₂O(l) + CO₂(g)↑");
    } else if (action === 'filter' && step === 2 && !running) {
      setStep(3);
      setEquation("Filtrate: CaCl₂(aq)  |  Residue: Unreacted CaCO₃(s)");
    } else if (action === 'crystallize' && step === 3) {
      setStep(4);
      setEquation("CaCl₂(aq) → CaCl₂·2H₂O(s) + Heat");
    } else if (action === 'reset') {
      setStep(0);
      setCurrentMass(100.00);
      setMassData([]);
      setTime(0);
      setRunning(false);
      setEquation("Experiment reset.");
    }
  };

  const checkAssessment = () => {
    const totalLoss = Math.min((hclVol/1000)*hclConc/2, caco3Mass/100.09) * 44.01;
    const ans = parseFloat(assessmentAnswer);
    if (isNaN(ans)) {
      setAssessmentResult("Please enter a valid number.");
      return;
    }
    const diff = Math.abs(ans - totalLoss);
    if (diff < 0.1) {
      setAssessmentResult("Correct! You accurately calculated the total mass of CO₂ lost.");
    } else {
      setAssessmentResult(`Incorrect. Consider the limiting reactant. Theoretical mass loss is ~${totalLoss.toFixed(2)}g.`);
    }
  };

  const renderGraph = () => {
    if (massData.length === 0) return null;
    const maxT = Math.max(30, time);
    const maxMass = 100 + hclVol + caco3Mass + 0.5;
    const totalLoss = Math.min((hclVol/1000)*hclConc/2, caco3Mass/100.09) * 44.01;
    const minMass = maxMass - totalLoss - 1.0;

    return (
      <svg viewBox="-30 -10 250 160" className="w-full h-48 bg-slate-50 dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500">
         {/* Axes */}
         <line x1="0" y1="120" x2="200" y2="120" stroke="#94a3b8" strokeWidth="2" />
         <line x1="0" y1="0" x2="0" y2="120" stroke="#94a3b8" strokeWidth="2" />
         <text x="100" y="140" fontSize="10" textAnchor="middle" fill="#64748b">Time (s)</text>
         <text x="-25" y="60" fontSize="10" textAnchor="middle" transform="rotate(-90 -25 60)" fill="#64748b">Mass (g)</text>
         
         <text x="-5" y="10" fontSize="8" textAnchor="end" fill="#94a3b8">{maxMass.toFixed(1)}</text>
         <text x="-5" y="120" fontSize="8" textAnchor="end" fill="#94a3b8">{minMass.toFixed(1)}</text>

         <polyline 
           points={massData.map(d => `${(d.time/maxT)*200},${120 - ((d.mass - minMass)/(maxMass - minMass))*120}`).join(" ")} 
           fill="none" stroke="#2563eb" strokeWidth="3" strokeLinejoin="round" 
         />
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 font-sans select-none">
      <LabHeader onExit={onExit} title="Preparation of Soluble Salt: Excess Carbonate Method" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
        
        {/* Left Column: Theory & Setup */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 flex flex-col overflow-hidden">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 dark:border-slate-500">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Beaker className="text-slate-600 dark:text-slate-300" /> Theory & Setup
            </h2>
          </div>
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Reaction Principle</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                An acid reacts with a metal carbonate to produce salt, water, and carbon dioxide gas. The mass decreases as CO₂ escapes.
              </p>
              <div className="bg-slate-800 dark:bg-slate-800 text-green-400 p-3 rounded-lg font-mono text-sm shadow-inner">
                CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Set Variables</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Volume of HCl: {hclVol} mL
                  </label>
                  <input 
                    type="range" min="20" max="100" step="10" value={hclVol}
                    onChange={(e) => setHclVol(parseFloat(e.target.value))}
                    disabled={step > 0} className="w-full accent-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Concentration of HCl: {hclConc.toFixed(1)} M
                  </label>
                  <input 
                    type="range" min="0.5" max="2.0" step="0.5" value={hclConc}
                    onChange={(e) => setHclConc(parseFloat(e.target.value))}
                    disabled={step > 0} className="w-full accent-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Mass of CaCO₃: {caco3Mass.toFixed(1)} g
                  </label>
                  <input 
                    type="range" min="2.0" max="10.0" step="1.0" value={caco3Mass}
                    onChange={(e) => setCaco3Mass(parseFloat(e.target.value))}
                    disabled={step > 0} className="w-full accent-slate-800"
                  />
                </div>
              </div>
            </div>
            
            <button onClick={() => handleAction('reset')} className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:bg-slate-800">
              Reset Experiment
            </button>
          </div>
        </div>

        {/* Middle Column: Simulation */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 flex flex-col">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 dark:border-slate-500">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Virtual Workbench</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-between">
            
            {/* Interactive Bottles */}
            <div className="flex flex-wrap justify-center gap-4 w-full">
              <button onClick={() => handleAction('acid')} disabled={step !== 0} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${step === 0 ? 'border-blue-400 bg-blue-50 hover:bg-blue-100 cursor-pointer shadow-md' : 'border-slate-100 opacity-40 cursor-not-allowed'}`}>
                <Droplet size={28} className="text-blue-500 mb-2" />
                <span className="font-semibold text-xs text-center">HCl Bottle</span>
              </button>
              <button onClick={() => handleAction('caco3')} disabled={step !== 1} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${step === 1 ? 'border-slate-800 dark:border-slate-500 bg-slate-50 dark:bg-slate-900 hover:bg-slate-200 dark:bg-slate-800 cursor-pointer shadow-md' : 'border-slate-100 opacity-40 cursor-not-allowed'}`}>
                <Activity size={28} className="text-slate-800 dark:text-slate-100 mb-2" />
                <span className="font-semibold text-xs text-center">CaCO₃ Solid</span>
              </button>
              <button onClick={() => handleAction('filter')} disabled={step !== 2 || running} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${step === 2 && !running ? 'border-amber-400 bg-amber-50 hover:bg-amber-100 cursor-pointer shadow-md' : 'border-slate-100 opacity-40 cursor-not-allowed'}`}>
                <Filter size={28} className="text-amber-700 mb-2" />
                <span className="font-semibold text-xs text-center">Filter</span>
              </button>
              <button onClick={() => handleAction('crystallize')} disabled={step !== 3} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${step === 3 ? 'border-cyan-400 bg-cyan-50 hover:bg-cyan-100 cursor-pointer shadow-md' : 'border-slate-100 opacity-40 cursor-not-allowed'}`}>
                <CheckCircle size={28} className="text-cyan-600 mb-2" />
                <span className="font-semibold text-xs text-center">Crystallize</span>
              </button>
            </div>

            {/* Simulation Canvas with Digital Balance */}
            <div className="w-full max-w-sm my-4 flex flex-col items-center">
              <svg viewBox="0 0 200 200" className="w-full h-auto drop-shadow-md z-10">
                {step === 4 ? (
                  <g transform="translate(0, 30)">
                    <path d="M 60 130 Q 100 160 140 130" fill="#f8fafc" stroke="#94a3b8" strokeWidth="4" />
                    <polygon points="90,140 100,125 110,140 100,150" fill="#f8fafc" stroke="#cbd5e1" />
                    <polygon points="105,135 115,120 125,135 115,145" fill="#f8fafc" stroke="#cbd5e1" />
                    <polygon points="75,135 85,120 95,135 85,145" fill="#f8fafc" stroke="#cbd5e1" />
                  </g>
                ) : step === 3 ? (
                  <g>
                    <path d="M 70 90 L 70 170 Q 70 180 80 180 L 120 180 Q 130 180 130 170 L 130 90" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" />
                    <rect x="72" y="140" width="56" height="38" fill="#e2e8f0" opacity="0.8" rx="2" />
                  </g>
                ) : (
                  <g>
                    {/* Beaker */}
                    <path d="M 60 80 L 60 180 Q 60 190 70 190 L 130 190 Q 140 190 140 180 L 140 80" fill="none" stroke="#94a3b8" strokeWidth="4" />
                    {step >= 1 && (
                      <rect x="62" y={188 - hclVol * 0.8} width="76" height={hclVol * 0.8} fill="#e2e8f0" opacity="0.8" rx="2" />
                    )}
                    {step >= 2 && step <= 2 && (
                      <g>
                         <path d="M 80 186 Q 90 170 100 186 Q 110 170 120 186 Z" fill="#f8fafc" stroke="#cbd5e1" />
                         {running && Array.from({length: 8}).map((_, i) => (
                           <circle key={i} cx={70 + Math.random()*60} cy={180 - Math.random()*80} r="2" fill="#ffffff" opacity={Math.random()} />
                         ))}
                      </g>
                    )}
                  </g>
                )}
              </svg>
              
              {/* Balance Screen */}
              {step <= 2 && (
                <div className="bg-slate-900 dark:bg-slate-800 w-48 mt-[-10px] z-0 rounded-b-xl border-4 border-slate-700 dark:border-slate-500 p-3 shadow-lg flex justify-center">
                  <div className="bg-[#a3e635] px-4 py-2 rounded text-slate-900 dark:text-slate-200 font-mono text-2xl font-bold tracking-widest shadow-inner">
                    {currentMass.toFixed(2)}<span className="text-sm ml-1">g</span>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Equation */}
            <div className="w-full bg-slate-800 dark:bg-slate-800 text-green-400 p-4 rounded-xl font-mono text-center shadow-inner min-h-[4rem] flex flex-col justify-center items-center mt-2">
              <span className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Live Reaction</span>
              <span className="text-sm md:text-base">{equation}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Data & Analysis */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 flex flex-col">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 dark:border-slate-500">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Kinetics & Analysis</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            
            <div className="mb-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Mass Loss Curve</h3>
              {renderGraph() || (
                <div className="w-full h-48 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:border-slate-500 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                  Run the experiment to see the graph.
                </div>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-500 mt-auto">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Assessment</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Calculate the theoretical maximum mass of CO₂ lost (g) for the current setup.
                <br/><span className="text-xs text-slate-400">CaCO₃=100.09 g/mol, CO₂=44.01 g/mol</span>
              </p>
              <div className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  value={assessmentAnswer}
                  onChange={e => setAssessmentAnswer(e.target.value)}
                  placeholder="e.g. 2.2"
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-lg text-sm outline-none focus:border-slate-500 dark:border-slate-500"
                />
                <button onClick={checkAssessment} className="px-4 py-2 bg-slate-800 dark:bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 dark:bg-slate-800 text-sm">
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
