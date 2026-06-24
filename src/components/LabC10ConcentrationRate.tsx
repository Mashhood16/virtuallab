import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Save, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC10ConcentrationRate({ onExit }: { onExit?: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [tablets, setTablets] = useState(1);
  const [data, setData] = useState<Array<{t: number, vol: number, tabs: number}>>([]);

  const maxVol = tablets * 40;
  const k = 0.08;
  const currentVol = isPlaying ? maxVol * (1 - Math.exp(-k * time)) : (time > 0 ? maxVol * (1 - Math.exp(-k * time)) : 0);

  useEffect(() => {
    let timer: number;
    if (isPlaying && currentVol < maxVol * 0.99) {
      timer = window.setInterval(() => setTime(t => t + 1), 500);
    } else if (currentVol >= maxVol * 0.99) {
      setIsPlaying(false);
    }
    return () => window.clearInterval(timer);
  }, [isPlaying, currentVol, maxVol]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    setData([]);
  };

  const recordData = () => {
    setData(prev => [...prev, { t: time, vol: parseFloat(currentVol.toFixed(1)), tabs: tablets }]);
  };

  const [assQ] = useState({ moles: Math.floor(Math.random() * 5 + 1) * 0.005 });
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkAnswer = () => {
    const expected = assQ.moles * 24000;
    if (Math.abs(parseFloat(answer) - expected) < 1) setIsCorrect(true);
    else setIsCorrect(false);
  };

  const renderGraph = () => {
    if (data.length === 0) return <div className="h-48 flex items-center justify-center text-slate-400">No data recorded</div>;
    const maxT = Math.max(20, ...data.map(d => d.t));
    const maxY = 80;
    const pts = data.map(d => `${(d.t / maxT) * 100},${100 - (d.vol / maxY) * 100}`).join(' ');

    return (
      <svg viewBox="-15 -10 130 130" className="w-full h-48 bg-slate-50 border rounded-lg p-2 overflow-visible">
        <line x1="0" y1="100" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="100" stroke="#94a3b8" strokeWidth="1" />
        <polyline points={pts} fill="none" stroke="#2563eb" strokeWidth="2" />
        {data.map((d, i) => (
          <circle key={i} cx={(d.t / maxT) * 100} cy={100 - (d.vol / maxY) * 100} r="2" fill="#ef4444" />
        ))}
        <text x="50" y="115" fontSize="6" textAnchor="middle" fill="#64748b">Time (s)</text>
        <text x="-10" y="50" fontSize="6" textAnchor="middle" fill="#64748b" transform="rotate(-90 -10 50)">Gas Vol (mL)</text>
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none p-4">
<LabHeader onExit={onExit} title="Reaction Kinetics: Reactant Quantity" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Theory & Setup</h2>
          <p className="text-slate-600 text-sm mb-4">
            Increasing the amount of reactants increases the total volume of product gas generated. We monitor the neutralization of stomach acid (HCl) using Calcium Carbonate (CaCO₃) antacid tablets.
          </p>
          <div className="bg-slate-100 p-4 rounded-lg mb-6 text-sm font-mono overflow-x-auto">
            CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Number of Tablets</label>
              <select 
                value={tablets} 
                onChange={(e) => { setTablets(parseInt(e.target.value)); handleReset(); }}
                className="w-full p-2 border border-slate-300 rounded-md"
              >
                <option value="1">1 Tablet</option>
                <option value="2">2 Tablets</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 self-start">Simulation Viewer</h2>
          
          <div className="w-full flex justify-center space-x-4 mb-6">
            <button onClick={() => setIsPlaying(!isPlaying)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Start'}
            </button>
            <button onClick={handleReset} className="flex items-center px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </button>
          </div>

          <div className="relative w-full max-w-sm aspect-square bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Flask */}
              <path d="M 60 40 L 60 90 L 30 160 Q 20 180 50 180 L 110 180 Q 140 180 130 160 L 100 90 L 100 40 Z" fill="none" stroke="#94a3b8" strokeWidth="3" />
              {/* Acid Liquid */}
              <path d="M 40 130 L 120 130 L 127 160 Q 140 180 110 180 L 50 180 Q 20 180 33 160 Z" fill="#fef08a" opacity="0.6" />
              
              {/* Tablets */}
              <circle cx="70" cy="165" r="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              {tablets === 2 && <circle cx="90" cy="165" r="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />}

              {/* Bubbles */}
              {isPlaying && currentVol < maxVol * 0.99 && (
                <>
                  {[...Array(tablets === 2 ? 8 : 4)].map((_, i) => (
                    <circle key={i} cx={70 + (i * 5) + (time % 2)} cy={140 - ((time * 10 + i * 15) % 40)} r="2" fill="white" opacity="0.8" />
                  ))}
                </>
              )}

              {/* Gas Syringe Tube */}
              <path d="M 100 60 L 140 60 L 140 80 L 100 80" fill="none" stroke="#94a3b8" strokeWidth="2" />
              {/* Syringe Body */}
              <rect x="140" y="50" width="50" height="40" fill="none" stroke="#94a3b8" strokeWidth="2" />
              {/* Plunger (Scaled by 80max) */}
              <rect x={140 + (currentVol / 80) * 45} y="52" width="5" height="36" fill="#475569" />
              <line x1={145 + (currentVol / 80) * 45} y1="70" x2={190} y2="70" stroke="#475569" strokeWidth="4" />
            </svg>
          </div>

          <div className="mt-4 w-full grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-100 p-3 rounded-lg">
              <div className="text-xs text-slate-500 uppercase font-bold">Time</div>
              <div className="text-xl font-mono text-slate-800">{time} s</div>
            </div>
            <div className="bg-slate-100 p-3 rounded-lg">
              <div className="text-xs text-slate-500 uppercase font-bold">CO₂ Volume</div>
              <div className="text-xl font-mono text-slate-800">{currentVol.toFixed(1)} mL</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Data & Analysis</h2>
            <button onClick={recordData} className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
              <Save className="w-4 h-4 mr-1" /> Record
            </button>
          </div>

          {renderGraph()}

          <div className="mt-4 flex-1 overflow-y-auto min-h-[100px] border border-slate-200 rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 border-b">Time (s)</th>
                  <th className="px-3 py-2 border-b">Tablets</th>
                  <th className="px-3 py-2 border-b">Volume (mL)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-3 py-2">{d.t}</td>
                    <td className="px-3 py-2">{d.tabs}</td>
                    <td className="px-3 py-2 font-mono text-blue-600">{d.vol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-sm font-bold text-blue-900 mb-2">Assessment</h3>
            <p className="text-sm text-blue-800 mb-3">
              If an antacid tablet contains {assQ.moles} moles of CaCO₃, calculate the theoretical maximum volume of CO₂ gas produced at Room Temperature and Pressure (where 1 mol of gas = 24,000 mL).
            </p>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Volume (mL)" 
                className="flex-1 p-2 border border-blue-300 rounded-md text-sm"
              />
              <button onClick={checkAnswer} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                Check
              </button>
            </div>
            {isCorrect === true && <div className="mt-2 text-green-600 text-sm font-bold flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> Correct!</div>}
            {isCorrect === false && <div className="mt-2 text-red-600 text-sm font-bold flex items-center"><XCircle className="w-4 h-4 mr-1" /> Incorrect, try again.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
