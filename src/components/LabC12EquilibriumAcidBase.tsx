import { useState } from 'react';
import {Droplets, Activity, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC12EquilibriumAcidBase({ onExit }: { onExit?: () => void }) {
  const [baseVol, setBaseVol] = useState<number>(0);
  const acidVol = 25; 
  const acidConc = 0.1; 
  const baseConc = 0.1; 
  const pKa = 4.76; 
  const Ka = Math.pow(10, -pKa);
  const Kw = 1e-14;

  const [graphData, setGraphData] = useState<{v: number, ph: number}[]>([]);
  const [ansPH, setAnsPH] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  const calculatePH = (v: number) => {
    const molesAcid = acidVol * acidConc;
    const molesBase = v * baseConc;
    const totalVol = acidVol + v;
    let ph = 0;
    
    if (v === 0) {
      ph = -Math.log10(Math.sqrt(Ka * acidConc));
    } else if (molesBase < molesAcid) {
      const remainingAcid = molesAcid - molesBase;
      ph = pKa + Math.log10(molesBase / remainingAcid);
    } else if (Math.abs(molesBase - molesAcid) < 1e-5) {
      const concA = molesAcid / totalVol;
      const Kb = Kw / Ka;
      const concOH = Math.sqrt(Kb * concA);
      ph = 14 - (-Math.log10(concOH));
    } else {
      const excessBase = molesBase - molesAcid;
      const concOH = excessBase / totalVol;
      ph = 14 - (-Math.log10(concOH));
    }
    
    if (ph < 0) ph = 0;
    if (ph > 14) ph = 14;
    return ph;
  };

  const handleAddDrop = (amount: number) => {
    let newVol = baseVol + amount;
    if (newVol > 50) newVol = 50;
    if (newVol < 0) newVol = 0;
    const noise = (Math.random() - 0.5) * 0.05;
    setBaseVol(newVol);
    setGraphData(prev => [...prev, { v: newVol, ph: calculatePH(newVol) + noise }]);
  };
  
  const resetTitration = () => {
    setBaseVol(0);
    setGraphData([]);
    setFeedback('');
    setAnsPH('');
  };

  const checkAnswer = () => {
    const val = parseFloat(ansPH);
    const expected = pKa; 
    if (!isNaN(val) && Math.abs(val - expected) < 0.15) {
      setFeedback('Correct! At half-equivalence point (12.5 mL base added), pH = pKa.');
    } else {
      setFeedback('Incorrect. Hint: Look at the pH exactly halfway to the equivalence point.');
    }
  };

  const currentPh = baseVol > 0 ? (graphData[graphData.length - 1]?.ph || calculatePH(0)) : calculatePH(0);
  const color = currentPh > 8.2 ? (currentPh > 10 ? '#f472b6' : '#fbcfe8') : '#f8fafc';

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Virtual Lab: Equilibrium & Acid-Base" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 overflow-y-auto border border-slate-200">
          <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
            <Droplets className="mr-2" /> Theory
          </h2>
          <div className="prose text-sm text-slate-700">
            <p><strong>Titrations</strong> determine the concentration of an unknown solution by reacting it with a standard solution.</p>
            <h3 className="text-md font-semibold mt-4">Henderson-Hasselbalch Equation</h3>
            <p>Used for buffer regions (like blood plasma buffers):</p>
            <div className="bg-slate-100 p-3 rounded text-center font-mono my-2">
              pH = pKa + log([A⁻]/[HA])
            </div>
            <p>At the <strong>half-equivalence point</strong>, [A⁻] = [HA], so <strong>pH = pKa</strong>.</p>
            
            <h3 className="text-md font-semibold mt-4">Partition Coefficients</h3>
            <p>In equilibrium, solutes partition between two immiscible phases (e.g. organic and aqueous). K_pc = [Solute]_org / [Solute]_aq.</p>
            
            <h3 className="text-md font-semibold mt-4">Current Experiment</h3>
            <ul className="list-disc pl-5">
              <li>Flask: 25.0 mL of 0.1 M Weak Acid (CH₃COOH)</li>
              <li>Burette: 0.1 M Strong Base (NaOH)</li>
              <li>Indicator: Phenolphthalein (colorless &lt; pH 8.2, pink &gt; 8.2)</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col items-center border border-slate-200">
          <h2 className="text-xl font-bold text-purple-900 mb-4">Titration Simulator</h2>
          
          <div className="flex flex-col items-center w-full max-w-sm mb-4">
            <div className="bg-slate-100 px-4 py-2 rounded-lg font-mono text-lg font-bold border border-slate-300 text-slate-800 mb-4 w-full text-center shadow-inner">
              pH Meter: {currentPh.toFixed(2)}
            </div>

            <div className="relative w-full aspect-square bg-slate-50 border rounded-xl overflow-hidden flex flex-col items-center justify-end pb-8">
              {/* Burette tip */}
              <div className="w-4 h-16 bg-slate-200 absolute top-0 border-x-2 border-b-2 border-slate-400 rounded-b-sm"></div>
              {/* Drop animation (static representation) */}
              <div className="w-2 h-2 rounded-full bg-blue-300 absolute top-16 animate-bounce"></div>
              
              {/* Flask */}
              <svg width="120" height="140" viewBox="0 0 120 140" className="z-10">
                <path d="M 50 10 L 50 50 L 20 120 Q 15 130 30 130 L 90 130 Q 105 130 100 120 L 70 50 L 70 10" stroke="#94a3b8" strokeWidth="4" fill="rgba(255,255,255,0.5)" />
                {/* Liquid level */}
                <path d="M 32 90 L 88 90 L 96 110 Q 105 130 90 130 L 30 130 Q 15 130 24 110 Z" fill={color} opacity="0.8" />
              </svg>
            </div>
          </div>
          
          <div className="w-full flex flex-col space-y-3">
            <div className="flex justify-between items-center text-sm font-mono bg-slate-100 p-2 rounded">
              <span>Base Added:</span>
              <span className="font-bold text-purple-700">{baseVol.toFixed(1)} mL</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleAddDrop(1)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded">+ 1 mL</button>
              <button onClick={() => handleAddDrop(5)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded">+ 5 mL</button>
              <button onClick={resetTitration} className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-800 font-semibold py-2 rounded">Reset</button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
            <Activity className="mr-2" /> Data Plot & Analysis
          </h2>
          
          <div className="relative w-full flex-1 min-h-[200px] mb-4 bg-slate-50 border border-slate-300 rounded-lg p-2">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              {/* Gridlines */}
              <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeWidth="0.5" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="#e2e8f0" strokeWidth="0.5" />
              <text x="50" y="98" fontSize="4" textAnchor="middle" fill="#64748b">25 mL</text>
              <text x="98" y="98" fontSize="4" textAnchor="end" fill="#64748b">50 mL</text>
              <text x="2" y="5" fontSize="4" fill="#64748b">pH 14</text>
              <text x="2" y="52" fontSize="4" fill="#64748b">pH 7</text>
              
              {/* Points */}
              {graphData.map((d, i) => {
                const cx = (d.v / 50) * 100;
                const cy = 100 - ((d.ph / 14) * 100);
                return <circle key={i} cx={cx} cy={cy} r="1.5" fill="#9333ea" />;
              })}
            </svg>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
            <h3 className="font-semibold text-purple-900 mb-2">Unknown Identification</h3>
            <p className="text-sm text-purple-800 mb-3">
              Observe the pH curve. Estimate the pKa of the weak acid from the graph at the half-equivalence point.
            </p>
            <input 
              type="text" 
              placeholder="Enter pKa value..." 
              value={ansPH}
              onChange={e => setAnsPH(e.target.value)}
              className="w-full p-2 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
            />
            <button 
              onClick={checkAnswer}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition-colors flex items-center justify-center"
            >
              <CheckCircle className="mr-2" size={18} /> Check Answer
            </button>
            {feedback && (
              <p className={`mt-3 text-sm font-semibold p-2 rounded ${feedback.includes('Correct') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {feedback}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
