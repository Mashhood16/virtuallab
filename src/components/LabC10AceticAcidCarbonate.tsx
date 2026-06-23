import { useState, useEffect, useRef } from 'react';
import { Beaker, Info, Activity, Plus, RefreshCw, CheckCircle2, XCircle, ArrowLeft, Box } from 'lucide-react';

export default function LabC10AceticAcidCarbonate({ onExit }: { onExit: () => void }) {
  const [acidAdded, setAcidAdded] = useState(false);
  const [carbMass, setCarbMass] = useState<number>(0.2);
  const [totalCarbAdded, setTotalCarbAdded] = useState<number>(0);
  const [gasVolume, setGasVolume] = useState<number>(0);
  const [equation, setEquation] = useState<string>('Empty Flask');
  const [isReacting, setIsReacting] = useState(false);
  
  const [logs, setLogs] = useState<{ id: number; mass: number; volume: number }[]>([]);
  const [assessmentAns, setAssessmentAns] = useState<string>('');
  const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [targetMass] = useState<number>(() => Math.floor(Math.random() * 8 + 2) / 10); // 0.2 to 1.0

  // 1g Na2CO3 produces ~226.4 mL CO2.
  const reactionInterval = useRef<number | null>(null);

  const addAcid = () => {
    setAcidAdded(true);
    setTotalCarbAdded(0);
    setGasVolume(0);
    setEquation('CH₃COOH(aq)');
  };

  const addCarbonate = () => {
    if (!acidAdded || isReacting) return;
    const newCarb = totalCarbAdded + carbMass;
    setTotalCarbAdded(newCarb);
    setIsReacting(true);
    setEquation('2CH₃COOH(aq) + Na₂CO₃(s) → 2CH₃COONa(aq) + H₂O(l) + CO₂(g) ↑');
    
    // Target gas volume = newCarb * 226.4 * (1 + (Math.random()*0.06 - 0.03)) // 3% noise
    const noise = 1 + (Math.random() * 0.06 - 0.03);
    const targetVol = newCarb * 226.4 * noise;

    let currentVol = gasVolume;
    if (reactionInterval.current) window.clearInterval(reactionInterval.current);

    reactionInterval.current = window.setInterval(() => {
      currentVol += (targetVol - gasVolume) * 0.15 + 2;
      if (currentVol >= targetVol) {
        currentVol = targetVol;
        setIsReacting(false);
        if (reactionInterval.current) window.clearInterval(reactionInterval.current);
      }
      setGasVolume(parseFloat(currentVol.toFixed(1)));
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (reactionInterval.current) window.clearInterval(reactionInterval.current);
    };
  }, []);

  const resetFlask = () => {
    setAcidAdded(false);
    setTotalCarbAdded(0);
    setGasVolume(0);
    setIsReacting(false);
    setEquation('Empty Flask');
    if (reactionInterval.current) window.clearInterval(reactionInterval.current);
  };

  const recordData = () => {
    if (acidAdded && totalCarbAdded > 0 && !isReacting) {
      setLogs((prev) => [...prev, { id: Date.now(), mass: totalCarbAdded, volume: gasVolume }]);
    }
  };

  const checkAns = () => {
    const expected = targetMass * 226.4;
    if (Math.abs(parseFloat(assessmentAns) - expected) < expected * 0.05) {
      setAssessmentStatus('correct');
    } else {
      setAssessmentStatus('incorrect');
    }
  };

  const maxMass = Math.max(2, ...logs.map((l) => l.mass));
  const maxVol = Math.max(500, ...logs.map((l) => l.volume));

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-teal-600 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6" />
          <h1 className="text-xl font-bold">Acid-Carbonate Reaction: Acetic Acid & Sodium Carbonate</h1>
        </div>
        <button onClick={onExit} className="flex items-center gap-2 hover:bg-teal-700 px-3 py-1 rounded transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
        {/* Theory Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <Info className="w-5 h-5 text-teal-500" /> Theory & Setup
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Acids react with metal carbonates to produce a salt, water, and carbon dioxide gas.
            Here, Acetic acid reacts with Sodium Carbonate (Na₂CO₃) powder.
          </p>
          <div className="p-3 bg-slate-100 rounded text-center font-mono text-sm font-bold text-slate-700">
            2CH₃COOH + Na₂CO₃ → 2CH₃COONa + H₂O + CO₂
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mt-2">
            The volume of CO₂ gas produced indicates the extent of the reaction and can be used to verify the molar relationships.
          </p>
          
          <div className="bg-teal-50 p-4 rounded-lg mt-4 border border-teal-100">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mass of Na₂CO₃ to Add (g): {carbMass.toFixed(1)} g
            </label>
            <input 
              type="range" 
              min="0.2" max="1.0" step="0.2" 
              value={carbMass} 
              onChange={(e) => setCarbMass(parseFloat(e.target.value))}
              disabled={isReacting}
              className="w-full"
            />
          </div>
        </div>

        {/* Simulation Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col items-center">
          <div className="flex justify-around w-full mb-6 bg-slate-50 p-3 rounded-lg">
            <button onClick={addAcid} disabled={acidAdded} className="flex flex-col items-center p-2 border rounded hover:bg-teal-50 disabled:opacity-50 transition-colors">
              <Beaker className="text-teal-500 w-8 h-8 mb-1" />
              <span className="text-xs font-semibold">Add Acid (Excess)</span>
            </button>
            <button onClick={addCarbonate} disabled={!acidAdded || isReacting} className="flex flex-col items-center p-2 border rounded hover:bg-slate-200 disabled:opacity-50 transition-colors">
              <Box className="text-slate-500 w-8 h-8 mb-1" />
              <span className="text-xs font-semibold">+ {carbMass.toFixed(1)}g Na₂CO₃</span>
            </button>
            <button onClick={resetFlask} disabled={isReacting} className="flex flex-col items-center p-2 border rounded hover:bg-red-50 disabled:opacity-50 transition-colors">
              <RefreshCw className="text-slate-500 w-8 h-8 mb-1" />
              <span className="text-xs font-semibold">Reset</span>
            </button>
          </div>

          <div className="relative w-full max-w-[300px] h-64 flex flex-col items-center justify-end bg-slate-50 rounded-xl p-4 border border-slate-200">
            {/* Gas Syringe */}
            <div className="absolute top-4 right-4 w-40 h-8 border-2 border-slate-400 rounded-sm flex bg-white overflow-hidden">
               <div className="h-full bg-teal-100 transition-all" style={{ width: `${(gasVolume / 500) * 100}%` }}></div>
               <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
                 {gasVolume.toFixed(1)} mL CO₂
               </div>
            </div>
            {/* Tube from flask to syringe */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
               <path d="M150,110 C150,70 180,50 210,50" fill="none" stroke="#94a3b8" strokeWidth="4" />
            </svg>

            {/* Flask */}
            <svg viewBox="0 0 200 200" className="w-32 h-32 relative z-10">
              <clipPath id="flask-clip-3">
                <path d="M80,40 L80,100 L40,180 L160,180 L120,100 L120,40 Z" />
              </clipPath>
              <path d="M80,40 L80,100 L40,180 L160,180 L120,100 L120,40 Z" fill="rgba(255,255,255,0.9)" stroke="#475569" strokeWidth="4" />
              
              {acidAdded && (
                <rect 
                  x="0" 
                  y="120" 
                  width="200" 
                  height="200" 
                  fill="rgba(204, 253, 246, 0.6)" 
                  clipPath="url(#flask-clip-3)" 
                />
              )}
              {isReacting && (
                <g clipPath="url(#flask-clip-3)">
                  <circle cx="90" cy="170" r="4" fill="#fff" className="animate-bounce" />
                  <circle cx="110" cy="160" r="3" fill="#fff" className="animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <circle cx="100" cy="150" r="5" fill="#fff" className="animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <circle cx="80" cy="140" r="2" fill="#fff" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
                </g>
              )}
              {totalCarbAdded > 0 && (
                <ellipse cx="100" cy="175" rx="30" ry="5" fill="#e2e8f0" clipPath="url(#flask-clip-3)"/>
              )}
            </svg>
          </div>

          <div className="w-full mt-6 bg-slate-800 text-green-400 font-mono text-sm p-4 rounded-lg min-h-[60px] flex items-center justify-center text-center">
            {equation}
          </div>
          
          <button 
            onClick={recordData} 
            disabled={!acidAdded || totalCarbAdded === 0 || isReacting}
            className="mt-4 flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Record Data Point
          </button>
        </div>

        {/* Data Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <Activity className="w-5 h-5 text-green-500" /> Data & Analysis
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2 rounded-tl-lg">Total Na₂CO₃ (g)</th>
                  <th className="px-3 py-2 rounded-tr-lg">Vol CO₂ (mL)</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && <tr><td colSpan={2} className="text-center p-3 text-slate-400">No data recorded</td></tr>}
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{log.mass.toFixed(1)}</td>
                    <td className="px-3 py-2">{log.volume.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="h-48 w-full border border-slate-200 rounded-lg p-2 bg-slate-50 relative mt-2">
            <div className="absolute top-2 left-2 text-xs font-semibold text-slate-500">Vol CO₂ vs Mass Na₂CO₃</div>
            <svg viewBox="0 0 100 100" className="w-full h-full transform scale-y-[-1] overflow-visible pb-6 pl-8">
               <line x1="0" y1="0" x2="100" y2="0" stroke="#94a3b8" strokeWidth="1" />
               <line x1="0" y1="0" x2="0" y2="100" stroke="#94a3b8" strokeWidth="1" />
               {logs.map((log, i) => (
                 <circle 
                   key={i} 
                   cx={(log.mass / maxMass) * 90} 
                   cy={(log.volume / maxVol) * 90} 
                   r="3" 
                   fill="#0d9488" 
                 />
               ))}
               {logs.length > 1 && (
                 <line 
                   x1="0" y1="0" 
                   x2="90" y2={90 * ((maxMass * 226.4) / maxVol)} 
                   stroke="#0d9488" strokeWidth="1" strokeDasharray="2,2" 
                 />
               )}
            </svg>
          </div>

          <div className="bg-teal-50 p-4 rounded-lg mt-auto border border-teal-100">
            <h3 className="font-bold text-sm text-slate-800 mb-2">Assessment</h3>
            <p className="text-xs text-slate-600 mb-3">
              Calculate the theoretical volume of CO₂ produced (at RTP, 24000 mL/mol) if {targetMass} g of Na₂CO₃ completely reacts. (Molar mass = 106 g/mol).
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
                className="bg-teal-600 text-white px-3 py-1 text-sm rounded hover:bg-teal-700 transition-colors"
              >
                Check
              </button>
            </div>
            {assessmentStatus === 'correct' && <div className="mt-2 text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Correct!</div>}
            {assessmentStatus === 'incorrect' && <div className="mt-2 text-red-600 text-xs font-bold flex items-center gap-1"><XCircle className="w-4 h-4"/> Incorrect. Use: Vol = (Mass/106) * 24000</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
