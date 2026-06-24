import { useState } from 'react';
import { Droplets, Info, FlaskConical, Activity, Plus, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC10SaturatedUnsaturated({ onExit }: { onExit: () => void }) {
  const [flaskSample, setFlaskSample] = useState<'Oil' | 'Butter' | null>(null);
  const [sampleMass, setSampleMass] = useState<number>(1);
  const [br2Volume, setBr2Volume] = useState<number>(0);
  const [isBrown, setIsBrown] = useState<boolean>(false);
  const [equation, setEquation] = useState<string>('Empty Flask');
  const [logs, setLogs] = useState<{ id: number; mass: number; volume: number; type: string }[]>([]);
  
  const [assessmentAns, setAssessmentAns] = useState<string>('');
  const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [targetMass] = useState<number>(() => Math.floor(Math.random() * 5) + 5);

  const maxBr2ForOil = sampleMass * 1.5;

  const addSample = (type: 'Oil' | 'Butter') => {
    setFlaskSample(type);
    setBr2Volume(0);
    setIsBrown(false);
    setEquation(type === 'Oil' ? 'R-CH=CH-R' : 'R-CH₂-CH₂-R');
  };

  const addBr2 = () => {
    if (!flaskSample) return;
    const newVol = br2Volume + 0.5;
    setBr2Volume(newVol);
    
    if (flaskSample === 'Butter') {
      setIsBrown(true);
      setEquation('R-CH₂-CH₂-R + Br₂ → No Reaction');
    } else {
      if (newVol >= maxBr2ForOil) {
        setIsBrown(true);
        setEquation('R-CH=CH-R + excess Br₂ → R-CH(Br)-CH(Br)-R + Br₂(aq)');
      } else {
        setIsBrown(false);
        setEquation('R-CH=CH-R + Br₂ → R-CH(Br)-CH(Br)-R');
      }
    }
  };

  const resetFlask = () => {
    setFlaskSample(null);
    setBr2Volume(0);
    setIsBrown(false);
    setEquation('Empty Flask');
  };

  const recordData = () => {
    if (flaskSample && isBrown) {
      setLogs((prev) => [...prev, { id: Date.now(), mass: sampleMass, volume: br2Volume, type: flaskSample }]);
      resetFlask();
    }
  };

  const checkAns = () => {
    const expected = targetMass * 1.5;
    if (Math.abs(parseFloat(assessmentAns) - expected) < 0.5) {
      setAssessmentStatus('correct');
    } else {
      setAssessmentStatus('incorrect');
    }
  };

  const oilLogs = logs.filter(l => l.type === 'Oil');
  const maxMass = Math.max(5, ...oilLogs.map((l) => l.mass));
  const maxVol = Math.max(10, ...oilLogs.map((l) => l.volume));

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Bromine Water Test: Saturated vs Unsaturated" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
        {/* Theory Section */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <Info className="w-5 h-5 text-blue-500" /> Theory & Setup
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Unsaturated compounds (like vegetable oil) contain carbon-carbon double bonds (C=C). They react with bromine water (Br₂), adding across the double bond and decolourizing the orange/brown bromine solution.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            Saturated compounds (like butter) have only single bonds (C-C) and do not react with bromine water. The solution remains brown.
          </p>
          
          <div className="bg-slate-100 p-4 rounded-lg mt-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Set Sample Mass (g): {sampleMass} g
            </label>
            <input 
              type="range" 
              min="1" max="5" step="0.5" 
              value={sampleMass} 
              onChange={(e) => setSampleMass(parseFloat(e.target.value))}
              disabled={flaskSample !== null}
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-2">Set mass before adding sample to flask.</p>
          </div>
        </div>

        {/* Simulation Section */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col items-center">
          <div className="flex justify-around w-full mb-6 bg-slate-50 p-3 rounded-lg">
            <button onClick={() => addSample('Oil')} disabled={flaskSample !== null} className="flex flex-col items-center p-2 border rounded hover:bg-yellow-50 disabled:opacity-50 transition-colors">
              <FlaskConical className="text-yellow-500 w-8 h-8 mb-1" />
              <span className="text-xs font-semibold">Add Oil</span>
            </button>
            <button onClick={() => addSample('Butter')} disabled={flaskSample !== null} className="flex flex-col items-center p-2 border rounded hover:bg-orange-50 disabled:opacity-50 transition-colors">
              <FlaskConical className="text-orange-300 w-8 h-8 mb-1" />
              <span className="text-xs font-semibold">Add Butter</span>
            </button>
            <button onClick={addBr2} disabled={!flaskSample} className="flex flex-col items-center p-2 border rounded hover:bg-red-50 disabled:opacity-50 transition-colors">
              <Droplets className="text-orange-700 w-8 h-8 mb-1" />
              <span className="text-xs font-semibold">+ 0.5mL Br₂</span>
            </button>
            <button onClick={resetFlask} className="flex flex-col items-center p-2 border rounded hover:bg-slate-100 transition-colors">
              <RefreshCw className="text-slate-500 w-8 h-8 mb-1" />
              <span className="text-xs font-semibold">Empty Flask</span>
            </button>
          </div>

          <div className="relative w-full max-w-[250px] aspect-square flex justify-center items-end bg-slate-50 rounded-xl p-4 border border-slate-200">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <clipPath id="flask-clip">
                <path d="M80,40 L80,100 L40,180 L160,180 L120,100 L120,40 Z" />
              </clipPath>
              <path d="M80,40 L80,100 L40,180 L160,180 L120,100 L120,40 Z" fill="rgba(255,255,255,0.8)" stroke="#475569" strokeWidth="4" />
              
              {flaskSample && (
                <rect 
                  x="0" 
                  y={180 - (sampleMass * 8) - (br2Volume * 4)} 
                  width="200" 
                  height="200" 
                  fill={isBrown ? "rgba(217, 119, 6, 0.85)" : (flaskSample === 'Oil' ? "rgba(253, 224, 71, 0.7)" : "rgba(253, 186, 116, 0.9)")} 
                  clipPath="url(#flask-clip)" 
                  className="transition-all duration-300"
                />
              )}
            </svg>
            {flaskSample && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-xs font-bold text-slate-800 bg-slate-50/70 px-2 py-1 rounded">
                {flaskSample} ({sampleMass}g)<br/>
                Br₂: {br2Volume}mL
              </div>
            )}
          </div>

          <div className="w-full mt-6 bg-slate-800 text-green-400 font-mono text-sm p-4 rounded-lg min-h-[80px] flex items-center justify-center text-center">
            {equation}
          </div>
          
          <button 
            onClick={recordData} 
            disabled={!flaskSample || !isBrown}
            className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Record Permanent Color Data
          </button>
        </div>

        {/* Data Section */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <Activity className="w-5 h-5 text-green-500" /> Data & Analysis
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2 rounded-tl-lg">Sample</th>
                  <th className="px-3 py-2">Mass (g)</th>
                  <th className="px-3 py-2 rounded-tr-lg">Br₂ Vol (mL)</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && <tr><td colSpan={3} className="text-center p-3 text-slate-400">No data recorded</td></tr>}
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{log.type}</td>
                    <td className="px-3 py-2">{log.mass}</td>
                    <td className="px-3 py-2">{log.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="h-48 w-full border border-slate-200 rounded-lg p-2 bg-slate-50 relative mt-2">
            <div className="absolute top-2 left-2 text-xs font-semibold text-slate-500">Vol Br₂ (mL) vs Mass of Oil (g)</div>
            <svg viewBox="0 0 100 100" className="w-full h-full transform scale-y-[-1] overflow-visible pb-6 pl-8">
               <line x1="0" y1="0" x2="100" y2="0" stroke="#94a3b8" strokeWidth="1" />
               <line x1="0" y1="0" x2="0" y2="100" stroke="#94a3b8" strokeWidth="1" />
               {oilLogs.map((log, i) => (
                 <circle 
                   key={i} 
                   cx={(log.mass / maxMass) * 90} 
                   cy={(log.volume / maxVol) * 90} 
                   r="3" 
                   fill="#ef4444" 
                 />
               ))}
               {oilLogs.length > 1 && (
                 <line 
                   x1="0" y1="0" 
                   x2="90" y2={90 * ((maxMass * 1.5) / maxVol)} 
                   stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" 
                 />
               )}
            </svg>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg mt-auto border border-orange-100">
            <h3 className="font-bold text-sm text-slate-800 mb-2">Assessment</h3>
            <p className="text-xs text-slate-600 mb-3">
              Based on your data, how many mL of Br₂ would be required to fully saturate {targetMass}g of Vegetable Oil?
            </p>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={assessmentAns} 
                onChange={(e) => setAssessmentAns(e.target.value)}
                placeholder="Vol (mL)" 
                className="w-24 px-2 py-1 text-sm border rounded"
              />
              <button 
                onClick={checkAns}
                className="bg-orange-600 text-white px-3 py-1 text-sm rounded hover:bg-orange-700 transition-colors"
              >
                Check
              </button>
            </div>
            {assessmentStatus === 'correct' && <div className="mt-2 text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Correct! 1.5 mL per gram.</div>}
            {assessmentStatus === 'incorrect' && <div className="mt-2 text-red-600 text-xs font-bold flex items-center gap-1"><XCircle className="w-4 h-4"/> Incorrect. Check the ratio.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
