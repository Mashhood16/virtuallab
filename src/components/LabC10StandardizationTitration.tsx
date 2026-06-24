import { useState, useEffect } from 'react';
import { FlaskConical, RotateCcw, Check, Plus } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC10StandardizationTitration({ onExit }: { onExit?: () => void }) {
  const [hclMolarity] = useState(() => (Math.random() * 0.04 + 0.08).toFixed(3));
  const hclVolume = 25;
  const naohMolarity = 0.100;
  
  const [flaskFilled, setFlaskFilled] = useState(false);
  const [indicatorAdded, setIndicatorAdded] = useState(false);
  const [buretteFilled, setBuretteFilled] = useState(false);
  const [naohAdded, setNaohAdded] = useState(0);
  const [logs, setLogs] = useState<{hclVol: number, initialBurette: number, finalBurette: number, added: number}[]>([]);
  const [equation, setEquation] = useState("Setup your experiment...");
  const [assessmentAns, setAssessmentAns] = useState("");
  const [assessmentStatus, setAssessmentStatus] = useState<boolean | null>(null);

  const endpointVolume = (parseFloat(hclMolarity) * hclVolume) / naohMolarity;
  const isPastEndpoint = naohAdded >= endpointVolume;
  
  let flaskColor = "rgba(255, 255, 255, 0.5)";
  if (flaskFilled) {
      if (indicatorAdded && isPastEndpoint) {
          const excess = naohAdded - endpointVolume;
          const alpha = Math.min(0.8, 0.2 + excess * 0.2);
          flaskColor = `rgba(236, 72, 153, ${alpha})`;
      } else {
          flaskColor = "rgba(241, 245, 249, 0.8)";
      }
  }

  useEffect(() => {
      let eq = "";
      if (flaskFilled) eq += "HCl(aq)";
      if (flaskFilled && indicatorAdded) eq += " + Phph(colorless)";
      if (buretteFilled && naohAdded === 0) eq = `NaOH(aq) [Burette] | ${eq} [Flask]`;
      if (naohAdded > 0) {
          eq = `NaOH(aq) + HCl(aq) ➔ NaCl(aq) + H₂O(l)`;
          if (isPastEndpoint) eq += " [Endpoint Reached!]";
      }
      if (!flaskFilled && !buretteFilled) eq = "Waiting for chemicals...";
      setEquation(eq);
  }, [flaskFilled, indicatorAdded, buretteFilled, naohAdded, isPastEndpoint]);

  const addHCl = () => setFlaskFilled(true);
  const addIndicator = () => setIndicatorAdded(true);
  const fillBurette = () => setBuretteFilled(true);
  
  const addNaoh = (amount: number) => {
    if (buretteFilled && flaskFilled && naohAdded + amount <= 50) {
        setNaohAdded(prev => parseFloat((prev + amount).toFixed(1)));
    }
  };

  const reset = () => {
    setFlaskFilled(false); setIndicatorAdded(false); setBuretteFilled(false); setNaohAdded(0); setAssessmentStatus(null); setAssessmentAns("");
  };
  
  const logData = () => {
    if (naohAdded > 0) setLogs([...logs, { hclVol: hclVolume, initialBurette: 0, finalBurette: naohAdded, added: naohAdded }]);
  };

  const checkAns = () => {
    const correctM = (naohAdded * naohMolarity) / hclVolume;
    setAssessmentStatus(Math.abs(parseFloat(assessmentAns) - correctM) < 0.005);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <header className="bg-purple-600 text-white p-4 shadow-md flex items-center justify-between">
        <LabHeader onExit={onExit} title="Standardization Titration" />
        <div className="flex items-center gap-2"><FlaskConical size={24} /><span className="font-medium">C10 Chemistry</span></div>
      </header>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Theory & Setup</h2>
            <p className="text-slate-600">Titration is used to determine the unknown concentration of an acid by neutralizing it with a standard base of known concentration.</p>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="font-semibold text-purple-800 mb-2">Neutralization Equation</h3>
              <p className="text-sm font-mono text-center text-purple-900">M_acid × V_acid = M_base × V_base</p>
              <ul className="mt-2 text-xs text-purple-800 space-y-1">
                <li><strong>Base:</strong> 0.100 M NaOH</li>
                <li><strong>Acid:</strong> Unknown M HCl</li>
                <li><strong>Indicator:</strong> Phenolphthalein (Pink in base)</li>
              </ul>
            </div>
            <h3 className="font-bold text-slate-800 mt-4">Procedure</h3>
            <ol className="list-decimal list-inside text-slate-600 space-y-2 text-sm">
                <li>Add <strong>Unknown HCl</strong> to the flask.</li>
                <li>Add <strong>Indicator</strong> to the flask.</li>
                <li>Fill the burette with <strong>0.1M NaOH</strong>.</li>
                <li>Add NaOH dropwise until the solution turns permanently pink.</li>
            </ol>
        </div>
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center relative">
            <h2 className="text-xl font-bold text-slate-800 mb-6 w-full text-left">Interactive Simulation</h2>
            <div className="w-full bg-slate-900 text-green-400 font-mono p-4 rounded-lg shadow-inner mb-6 min-h-[80px] flex items-center justify-center text-center text-lg">{equation}</div>
            
            <div className="flex gap-4 mb-8">
                <button onClick={addHCl} disabled={flaskFilled} className="px-3 py-2 bg-slate-100 border border-slate-300 rounded hover:bg-slate-200 disabled:opacity-50 text-sm font-medium">Add HCl (25mL)</button>
                <button onClick={addIndicator} disabled={!flaskFilled || indicatorAdded} className="px-3 py-2 bg-slate-100 border border-slate-300 rounded hover:bg-slate-200 disabled:opacity-50 text-sm font-medium">Add Indicator</button>
                <button onClick={fillBurette} disabled={buretteFilled} className="px-3 py-2 bg-slate-100 border border-slate-300 rounded hover:bg-slate-200 disabled:opacity-50 text-sm font-medium">Fill Burette</button>
            </div>

            <div className="relative w-64 h-80 flex flex-col items-center">
                {/* Burette */}
                <div className="relative w-8 h-48 border-x-2 border-b-2 border-slate-400 rounded-b flex flex-col justify-end overflow-hidden mb-2">
                    {buretteFilled && <div className="w-full bg-blue-100/50 transition-all duration-300" style={{ height: `${((50 - naohAdded) / 50) * 100}%` }}></div>}
                    {buretteFilled && <div className="absolute top-0 w-full text-center text-[10px] text-slate-500 font-mono mt-1">{naohAdded.toFixed(1)}mL</div>}
                </div>
                {/* Tap Controls */}
                <div className="flex gap-2 mb-4">
                    <button onClick={() => addNaoh(1.0)} disabled={!buretteFilled || !flaskFilled} className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded disabled:opacity-50">+1.0 mL</button>
                    <button onClick={() => addNaoh(0.1)} disabled={!buretteFilled || !flaskFilled} className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded disabled:opacity-50">+0.1 mL</button>
                </div>
                {/* Flask */}
                <div className="relative w-24 h-24 flex justify-center items-end">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                        <path d="M40,0 L60,0 L60,30 L90,90 C95,100 85,100 50,100 C15,100 5,100 10,90 L40,30 Z" fill="rgba(255,255,255,0.7)" stroke="#94a3b8" strokeWidth="3" />
                        {flaskFilled && (
                            <path d="M30,50 L70,50 L85,85 C90,95 80,95 50,95 C20,95 10,95 15,85 Z" fill={flaskColor} className="transition-colors duration-500" />
                        )}
                    </svg>
                </div>
            </div>

            <div className="mt-8 flex gap-4">
                <button onClick={logData} disabled={naohAdded === 0} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"><Plus size={18} /> Record Data</button>
                <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"><RotateCcw size={18} /> Reset</button>
            </div>
        </div>
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Data Log</h2>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-700">
                            <tr><th className="px-4 py-2">HCl (mL)</th><th className="px-4 py-2">Initial NaOH (mL)</th><th className="px-4 py-2">Final NaOH (mL)</th><th className="px-4 py-2">NaOH Used (mL)</th></tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? <tr><td colSpan={4} className="px-4 py-4 text-center text-slate-500 italic">No data.</td></tr> : logs.map((log, i) => (
                                <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2">{log.hclVol}</td><td className="px-4 py-2">{log.initialBurette.toFixed(1)}</td><td className="px-4 py-2">{log.finalBurette.toFixed(1)}</td><td className="px-4 py-2 font-mono text-purple-600">{log.added.toFixed(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 mt-auto">
                <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2"><Check size={20} /> Analysis Check</h3>
                <p className="text-sm text-amber-800 mb-4">Based on your titration, calculate the molarity of the unknown HCl solution.</p>
                <div className="flex gap-2">
                    <input type="number" step="0.001" value={assessmentAns} onChange={(e) => setAssessmentAns(e.target.value)} placeholder="Molarity (M)" className="flex-1 px-3 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50" />
                    <button onClick={checkAns} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors font-medium">Check</button>
                </div>
                {assessmentStatus === true && <p className="mt-2 text-sm text-green-700 font-semibold">Correct! The exact molarity is {hclMolarity} M.</p>}
                {assessmentStatus === false && <p className="mt-2 text-sm text-red-600 font-semibold">Incorrect. Remember: M_acid = (M_base × V_base) / V_acid</p>}
            </div>
        </div>
      </div>
    </div>
  );
}
