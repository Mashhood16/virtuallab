import { useState, useEffect, useRef } from 'react';
import { Beaker, Info, Activity, Plus, RefreshCw, CheckCircle2, XCircle, ArrowLeft, Cylinder } from 'lucide-react';

export default function LabC10AceticAcidMetal({ onExit }: { onExit: () => void }) {
  const [acidAdded, setAcidAdded] = useState(false);
  const [naMass, setNaMass] = useState<number>(0.1);
  const [totalNaAdded, setTotalNaAdded] = useState<number>(0);
  const [gasVolume, setGasVolume] = useState<number>(0);
  const [equation, setEquation] = useState<string>('Empty Flask');
  const [isReacting, setIsReacting] = useState(false);
  
  const [logs, setLogs] = useState<{ id: number; mass: number; volume: number }[]>([]);
  const [assessmentAns, setAssessmentAns] = useState<string>('');
  const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [targetMass] = useState<number>(() => Math.floor(Math.random() * 5 + 2) / 10); // 0.2 to 0.6

  // 1g Na produces ~521.7 mL H2. Let's say max capacity of syringe is 600mL.
  // 0.1g Na -> 52 mL H2.
  const reactionInterval = useRef<number | null>(null);

  const addAcid = () => {
    setAcidAdded(true);
    setTotalNaAdded(0);
    setGasVolume(0);
    setEquation('CH₃COOH(aq)');
  };

  const addNa = () => {
    if (!acidAdded || isReacting) return;
    const newNa = totalNaAdded + naMass;
    setTotalNaAdded(newNa);
    setIsReacting(true);
    setEquation('2CH₃COOH(aq) + 2Na(s) → 2CH₃COONa(aq) + H₂(g) ↑');
    
    // Target gas volume = newNa * 521.7 * (1 + (Math.random()*0.04 - 0.02)) // 2% noise
    const noise = 1 + (Math.random() * 0.04 - 0.02);
    const targetVol = newNa * 521.7 * noise;

    let currentVol = gasVolume;
    if (reactionInterval.current) window.clearInterval(reactionInterval.current);

    reactionInterval.current = window.setInterval(() => {
      currentVol += (targetVol - gasVolume) * 0.1 + 2;
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
    setTotalNaAdded(0);
    setGasVolume(0);
    setIsReacting(false);
    setEquation('Empty Flask');
    if (reactionInterval.current) window.clearInterval(reactionInterval.current);
  };

  const recordData = () => {
    if (acidAdded && totalNaAdded > 0 && !isReacting) {
      setLogs((prev) => [...prev, { id: Date.now(), mass: totalNaAdded, volume: gasVolume }]);
    }
  };

  const checkAns = () => {
    const expected = targetMass * 521.7;
    if (Math.abs(parseFloat(assessmentAns) - expected) < expected * 0.05) { // 5% tolerance
      setAssessmentStatus('correct');
    } else {
      setAssessmentStatus('incorrect');
    }
  };

  const maxMass = Math.max(1, ...logs.map((l) => l.mass));
  const maxVol = Math.max(600, ...logs.map((l) => l.volume));

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6" />
          <h1 className="text-xl font-bold">Acid-Metal Reaction: Acetic Acid & Sodium</h1>
        </div>
        <button onClick={onExit} className="flex items-center gap-2 hover:bg-blue-700 px-3 py-1 rounded transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
        {/* Theory Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <Info className="w-5 h-5 text-blue-500" /> Theory & Setup
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Acids react with reactive metals to produce a salt and hydrogen gas. 
            Acetic acid (CH₃COOH) is a weak acid, but it still reacts vigorously with a highly reactive metal like Sodium (Na).
          </p>
          <div className="p-3 bg-slate-100 rounded text-center font-mono text-sm font-bold text-slate-700">
            2CH₃COOH + 2Na → 2CH₃COONa + H₂
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mt-2">
            The volume of Hydrogen gas produced is directly proportional to the mass of Sodium added, assuming Acetic acid is in excess.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mt-4 border border-blue-100">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Chunk Size of Sodium (g): {naMass.toFixed(1)} g
            </label>
            <input 
              type="range" 
              min="0.1" max="0.5" step="0.1" 
              value={naMass} 
              onChange={(e) => setNaMass(parseFloat(e.target.value))}
              disabled={isReacting}
              className="w-full"
            />
          </div>
        </div>

        {/* Simulation Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col items-center">
          <div className="flex justify-around w-full mb-6 bg-slate-50 p-3 rounded-lg">
            <button onClick={addAcid} disabled={acidAdded} className="flex flex-col items-center p-2 border rounded hover:bg-blue-50 disabled:opacity-50 transition-colors">
              <Beaker className="text-blue-500 w-8 h-8 mb-1" />
              <span className="text-xs font-semibold">Add Acid (Excess)</span>
            </button>
            <button onClick={addNa} disabled={!acidAdded || isReacting} className="flex flex-col items-center p-2 border rounded hover:bg-slate-200 disabled:opacity-50 transition-colors">
              <Cylinder className="text-slate-600 w-8 h-8 mb-1" />
              <span className="text-xs font-semibold">+ {naMass.toFixed(1)}g Na</span>
            </button>
            <button onClick={resetFlask} disabled={isReacting} className="flex flex-col items-center p-2 border rounded hover:bg-red-50 disabled:opacity-50 transition-colors">
              <RefreshCw className="text-slate-500 w-8 h-8 mb-1" />
              <span className="text-xs font-semibold">Reset</span>
            </button>
          </div>

          <div className="relative w-full max-w-[300px] h-64 flex flex-col items-center justify-end bg-slate-50 rounded-xl p-4 border border-slate-200">
            {/* Gas Syringe */}
            <div className="absolute top-4 right-4 w-40 h-8 border-2 border-slate-400 rounded-sm flex bg-white overflow-hidden">
               <div className="h-full bg-blue-100 transition-all" style={{ width: `${(gasVolume / 600) * 100}%` }}></div>
               <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
                 {gasVolume.toFixed(1)} mL H₂
               </div>
            </div>
            {/* Tube from flask to syringe */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
               <path d="M150,110 C150,70 180,50 210,50" fill="none" stroke="#94a3b8" strokeWidth="4" />
            </svg>

            {/* Flask */}
            <svg viewBox="0 0 200 200" className="w-32 h-32 relative z-10">
              <clipPath id="flask-clip-2">
                <path d="M80,40 L80,100 L40,180 L160,180 L120,100 L120,40 Z" />
              </clipPath>
              <path d="M80,40 L80,100 L40,180 L160,180 L120,100 L120,40 Z" fill="rgba(255,255,255,0.9)" stroke="#475569" strokeWidth="4" />
              
              {acidAdded && (
                <rect 
                  x="0" 
                  y="120" 
                  width="200" 
                  height="200" 
                  fill="rgba(191, 219, 254, 0.6)" 
                  clipPath="url(#flask-clip-2)" 
                />
              )}
              {isReacting && (
                <g clipPath="url(#flask-clip-2)">
                  <circle cx="100" cy="170" r="4" fill="#fff" className="animate-ping" />
                  <circle cx="80" cy="150" r="3" fill="#fff" className="animate-ping" style={{ animationDelay: '0.2s' }} />
                  <circle cx="120" cy="160" r="5" fill="#fff" className="animate-ping" style={{ animationDelay: '0.4s' }} />
                </g>
              )}
              {totalNaAdded > 0 && (
                <rect x="90" y="170" width="20" height="10" fill="#94a3b8" rx="2" clipPath="url(#flask-clip-2)"/>
              )}
            </svg>
          </div>

          <div className="w-full mt-6 bg-slate-800 text-green-400 font-mono text-sm p-4 rounded-lg min-h-[60px] flex items-center justify-center text-center">
            {equation}
          </div>
          
          <button 
            onClick={recordData} 
            disabled={!acidAdded || totalNaAdded === 0 || isReacting}
            className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-semibold"
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
                  <th className="px-3 py-2 rounded-tl-lg">Total Na (g)</th>
                  <th className="px-3 py-2 rounded-tr-lg">Vol H₂ (mL)</th>
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
            <div className="absolute top-2 left-2 text-xs font-semibold text-slate-500">Vol H₂ vs Mass Na</div>
            <svg viewBox="0 0 100 100" className="w-full h-full transform scale-y-[-1] overflow-visible pb-6 pl-8">
               <line x1="0" y1="0" x2="100" y2="0" stroke="#94a3b8" strokeWidth="1" />
               <line x1="0" y1="0" x2="0" y2="100" stroke="#94a3b8" strokeWidth="1" />
               {logs.map((log, i) => (
                 <circle 
                   key={i} 
                   cx={(log.mass / maxMass) * 90} 
                   cy={(log.volume / maxVol) * 90} 
                   r="3" 
                   fill="#3b82f6" 
                 />
               ))}
               {logs.length > 1 && (
                 <line 
                   x1="0" y1="0" 
                   x2="90" y2={90 * ((maxMass * 521.7) / maxVol)} 
                   stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" 
                 />
               )}
            </svg>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mt-auto border border-blue-100">
            <h3 className="font-bold text-sm text-slate-800 mb-2">Assessment</h3>
            <p className="text-xs text-slate-600 mb-3">
              Calculate the theoretical volume of H₂ produced (at RTP, 24000 mL/mol) if {targetMass} g of Sodium completely reacts. (Na = 23g/mol).
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
                className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Check
              </button>
            </div>
            {assessmentStatus === 'correct' && <div className="mt-2 text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Correct!</div>}
            {assessmentStatus === 'incorrect' && <div className="mt-2 text-red-600 text-xs font-bold flex items-center gap-1"><XCircle className="w-4 h-4"/> Incorrect. Use: Vol = (Mass/23) * 0.5 * 24000</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
