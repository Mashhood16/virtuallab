import { useState, useEffect } from 'react';
import { RefreshCw, Plus, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit?: () => void;
}

export default function LabP10ParallelCircuit({ onExit }: LabProps) {
  const [numBranches, setNumBranches] = useState<number>(3); // 1 to 3
  const [voltage, setVoltage] = useState<number>(12); // Volts
  const [r1, setR1] = useState<number>(50); // Ohms
  const [r2, setR2] = useState<number>(50);
  const [r3, setR3] = useState<number>(50);
  const [rInt, setRInt] = useState<number>(2); // Internal resistance (Ohms)
  
  const [noise, setNoise] = useState<number>(0);

  // Periodic noise for realistic meter readings
  useEffect(() => {
    const interval = setInterval(() => {
      setNoise((Math.random() - 0.5) * 0.02); // +/- 1% noise
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Circuit calculations
  const invReq = (numBranches >= 1 ? 1/r1 : 0) + 
                 (numBranches >= 2 ? 1/r2 : 0) + 
                 (numBranches >= 3 ? 1/r3 : 0);
  
  const rEqExt = invReq > 0 ? 1 / invReq : Infinity;
  const rTotal = rEqExt + rInt;
  
  const currentTotalExact = voltage / rTotal; // Amperes
  const currentTotalMeasured = currentTotalExact * (1 + noise);
  
  // Terminal voltage (voltage across the parallel branches)
  const vTerminalExact = currentTotalExact * rEqExt;
  const vTerminalMeasured = vTerminalExact * (1 + noise);

  // Branch currents
  const i1 = numBranches >= 1 ? vTerminalExact / r1 : 0;
  const i2 = numBranches >= 2 ? vTerminalExact / r2 : 0;
  const i3 = numBranches >= 3 ? vTerminalExact / r3 : 0;

  // Power for brightness (P = V^2 / R)
  // Assuming a reference power of 1.5W is "max brightness"
  const getBrightness = (vT: number, r: number) => Math.min(1, Math.max(0.05, (vT * vT / r) / 1.5));

  // Data Logging
  const [dataPoints, setDataPoints] = useState<Array<{ id: number; n: number; vt: number; iTotal: number; iBranch1: number }>>([]);
  const recordData = () => {
    setDataPoints((prev) => [
      ...prev,
      { 
        id: Date.now(), 
        n: numBranches, 
        vt: vTerminalMeasured, 
        iTotal: currentTotalMeasured * 1000, 
        iBranch1: i1 * 1000 * (1 + noise)
      }
    ]);
  };
  const clearData = () => setDataPoints([]);

  // Assessment
  const [assessmentAnswer, setAssessmentAnswer] = useState<string>('');
  const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  // Problem: 12V battery, internal resistance = 0. We have two identical 30 Ohm resistors in parallel. Total current?
  // R_eq = 15 Ohms. I = 12 / 15 = 0.8 A = 800 mA.
  const expectedAnswer = 800;

  const checkAnswer = () => {
    const val = parseFloat(assessmentAnswer);
    if (!isNaN(val) && Math.abs(val - expectedAnswer) < 5) {
      setAssessmentStatus('correct');
    } else {
      setAssessmentStatus('incorrect');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      {/* Header */}
      <LabHeader onExit={onExit} title="Unit 16: Resistors in Parallel" subtitle="Investigate voltage, current, and equivalent resistance in parallel branches." />

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto w-full">
        
        {/* Column 1: Theory & Setup */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Theory</h2>
            <p className="text-slate-600 text-sm mb-3">
              In a parallel circuit, the voltage across each branch is identical. The total current splits among the branches.
            </p>
            <div className="bg-slate-100 p-3 rounded-lg text-center font-serif text-slate-800 mb-2 text-sm">
              <div className="mb-1">1/R_eq = 1/R₁ + 1/R₂ + ...</div>
              <div>I_total = I₁ + I₂ + ...</div>
            </div>
            <p className="text-xs text-slate-500">
              Adding branches <em>decreases</em> total resistance. Notice how real batteries have internal resistance (r_int), causing the terminal voltage to drop when total current increases.
            </p>
          </div>

          <div className="h-px bg-slate-200" />

          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Experiment Setup</h2>
            
            <div className="mb-4">
              <label className="text-sm font-medium text-slate-700 block mb-2">Number of Parallel Branches</label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {[1, 2, 3].map((n) => (
                  <button 
                    key={n}
                    onClick={() => setNumBranches(n)}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${numBranches === n ? 'bg-slate-50 shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {n} Branch{n > 1 ? 'es' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-slate-700">EMF Voltage (V)</label>
                <span className="text-sm font-mono text-emerald-600">{voltage} V</span>
              </div>
              <input 
                type="range" min="1" max="24" step="1" value={voltage}
                onChange={(e) => setVoltage(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-slate-700">Internal Resistance (r_int)</label>
                <span className="text-sm font-mono text-slate-500">{rInt} Ω</span>
              </div>
              <input 
                type="range" min="0" max="10" step="0.5" value={rInt}
                onChange={(e) => setRInt(parseFloat(e.target.value))}
                className="w-full accent-slate-500"
              />
            </div>

            <div className="space-y-4">
              {[ { r: r1, setR: setR1, id: 1 }, { r: r2, setR: setR2, id: 2 }, { r: r3, setR: setR3, id: 3 } ].map((item, idx) => (
                <div key={item.id} className={idx < numBranches ? 'opacity-100' : 'opacity-40 pointer-events-none'}>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-slate-700">Branch {item.id} Resistance</label>
                    <span className="text-sm font-mono text-amber-600">{item.r} Ω</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" step="5" value={item.r}
                    onChange={(e) => item.setR(parseFloat(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Column 2: Simulation */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-700 p-6 flex flex-col relative overflow-hidden">
          <h2 className="text-lg font-bold text-white mb-4 absolute top-6 left-6 z-10">Circuit Simulation</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center relative pt-10">
            
            {/* The Circuit Network */}
            <div className="w-[300px] sm:w-[400px] h-[300px] border-4 border-amber-600 rounded-xl relative flex items-center shadow-[0_0_15px_#d97706_inset] z-0">
               
               {/* Main Wires */}
               <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                 {/* Top Wire Main */}
                 <div className="absolute -top-1 w-4 h-2 bg-yellow-300 shadow-[0_0_10px_#fde047] rounded-full animate-[flowRight_2s_linear_infinite]" style={{ animationDuration: `${Math.max(0.1, 1 / (currentTotalExact * 10))}s` }} />
                 {/* Bottom Wire Main */}
                 <div className="absolute -bottom-1 w-4 h-2 bg-yellow-300 shadow-[0_0_10px_#fde047] rounded-full animate-[flowLeft_2s_linear_infinite]" style={{ animationDuration: `${Math.max(0.1, 1 / (currentTotalExact * 10))}s` }} />
                 
                 {/* Parallel Branches */}
                 {[r1, r2, r3].slice(0, numBranches).map((rVal, i) => {
                   const bCurrent = i === 0 ? i1 : i === 1 ? i2 : i3;
                   const brightness = getBrightness(vTerminalExact, rVal);
                   return (
                     <div key={i} className="absolute top-0 bottom-0 border-l-4 border-amber-600 shadow-[0_0_15px_#d97706_inset] flex justify-center" style={{ left: `${25 + i * 25}%` }}>
                       <div className="absolute -left-1 w-2 h-4 bg-yellow-300 shadow-[0_0_10px_#fde047] rounded-full animate-[flowDown_2s_linear_infinite]" style={{ animationDuration: `${Math.max(0.1, 1 / (bCurrent * 10))}s` }} />
                       
                       {/* The Bulb Physical */}
                       <div className="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-black border-2 border-white/30 rounded-full z-10 flex flex-col items-center justify-end pb-1 backdrop-blur-sm">
                          <div className={`w-2 h-4 border rounded-t-full ${vTerminalExact > 0 ? 'border-yellow-300' : 'border-zinc-500'}`} />
                       </div>
                       {/* Base */}
                       <div className="absolute top-1/2 -translate-y-1/2 -mt-7 w-6 h-6 bg-zinc-400 rounded-t-md z-10" />
                       
                       {/* The Bulb Glow */}
                       <div className="absolute top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-yellow-400 pointer-events-none transition-opacity duration-500 mix-blend-screen" style={{ 
                         opacity: brightness,
                         boxShadow: `0 0 ${40 * brightness}px ${20 * brightness}px #facc15`
                       }} />

                       <div className="absolute top-1/2 -translate-y-1/2 ml-14 text-[10px] text-slate-400 font-mono bg-black/50 px-1.5 py-0.5 rounded">{rVal}Ω</div>
                     </div>
                   );
                 })}
               </div>

               {/* Battery (Left side) */}
               <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-28 bg-zinc-800 rounded-md border-2 border-zinc-600 flex flex-col items-center justify-between py-2 shadow-lg z-20">
                 <div className="text-red-500 font-bold">+</div>
                 <div className="text-white font-mono font-bold text-xs rotate-90 my-2">{voltage}V</div>
                 <div className="text-blue-500 font-bold">-</div>
                 <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-zinc-400" />
               </div>

               <style>{`
                 @keyframes flowRight { 0% { left: 0; } 100% { left: 100%; } }
                 @keyframes flowLeft { 0% { right: 0; } 100% { right: 100%; } }
                 @keyframes flowDown { 0% { top: 0; } 100% { top: 100%; } }
               `}</style>
            </div>

            {/* Meters Dashboard */}
            <div className="mt-8 flex gap-4 w-full justify-center">
              <div className="bg-black p-3 rounded-xl border border-slate-700 flex flex-col items-center w-36 shadow-lg">
                <span className="text-slate-400 text-[10px] uppercase tracking-widest mb-1 font-bold">Total Current</span>
                <div className="font-mono text-xl font-bold text-emerald-400 tracking-wider">
                  {(currentTotalMeasured * 1000).toFixed(0)} <span className="text-xs">mA</span>
                </div>
              </div>
              <div className="bg-black p-3 rounded-xl border border-slate-700 flex flex-col items-center w-36 shadow-lg">
                <span className="text-slate-400 text-[10px] uppercase tracking-widest mb-1 font-bold">Terminal Volts</span>
                <div className="font-mono text-xl font-bold text-blue-400 tracking-wider">
                  {vTerminalMeasured.toFixed(2)} <span className="text-xs">V</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Column 3: Data & Analysis */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Data Logging</h2>
            <button 
              onClick={recordData}
              className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Record
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-6 border border-slate-200 rounded-lg max-h-[200px]">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-slate-600 uppercase bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2">N</th>
                  <th className="px-3 py-2">V_term (V)</th>
                  <th className="px-3 py-2">I_tot (mA)</th>
                  <th className="px-3 py-2">I_branch1 (mA)</th>
                </tr>
              </thead>
              <tbody>
                {dataPoints.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-slate-500 italic">No data recorded yet.</td>
                  </tr>
                ) : (
                  dataPoints.map((dp) => (
                    <tr key={dp.id} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="px-3 py-2 font-mono">{dp.n}</td>
                      <td className="px-3 py-2 font-mono">{dp.vt.toFixed(2)}</td>
                      <td className="px-3 py-2 font-mono">{dp.iTotal.toFixed(0)}</td>
                      <td className="px-3 py-2 font-mono">{dp.iBranch1.toFixed(0)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="h-px bg-slate-200 mb-6" />

          {/* Assessment Section */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Analysis Check</h2>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-slate-700 mb-3">
                <strong>Problem:</strong> Assume r_int = 0. A 12V battery is connected to two identical 30 Ω resistors in parallel. 
                What is the total current flowing out of the battery (in mA)?
              </p>
              <div className="flex gap-2 items-center">
                <input 
                  type="number" 
                  placeholder="e.g. 500"
                  value={assessmentAnswer}
                  onChange={(e) => { setAssessmentAnswer(e.target.value); setAssessmentStatus('idle'); }}
                  className="border border-slate-300 rounded px-3 py-2 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-600 mr-2">mA</span>
                <button 
                  onClick={checkAnswer}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Check Answer
                </button>
              </div>
              {assessmentStatus === 'correct' && (
                <div className="mt-3 flex items-start gap-1 text-emerald-700 text-sm font-medium bg-emerald-100 p-2 rounded">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> 
                  Correct! R_eq = 15 Ω. I = 12 / 15 = 0.8 A = 800 mA.
                </div>
              )}
              {assessmentStatus === 'incorrect' && (
                <div className="mt-3 flex items-center gap-1 text-rose-600 text-sm font-medium">
                  <XCircle className="w-4 h-4" /> Incorrect. Try finding equivalent resistance (1/Req = 1/R1 + 1/R2).
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
