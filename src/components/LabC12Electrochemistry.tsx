import { useState } from 'react';
import { ArrowLeft, Beaker, Zap, Activity, CheckCircle2 } from 'lucide-react';

interface Metal {
  symbol: string;
  name: string;
  e0: number;
  color: string;
  ion: string;
  n: number;
}

const metals: Record<string, Metal> = {
  Mg: { symbol: 'Mg', name: 'Magnesium', e0: -2.37, color: '#e0e0e0', ion: 'Mg²⁺', n: 2 },
  Zn: { symbol: 'Zn', name: 'Zinc', e0: -0.76, color: '#b0bec5', ion: 'Zn²⁺', n: 2 },
  Fe: { symbol: 'Fe', name: 'Iron', e0: -0.44, color: '#8d6e63', ion: 'Fe²⁺', n: 2 },
  Pb: { symbol: 'Pb', name: 'Lead', e0: -0.13, color: '#78909c', ion: 'Pb²⁺', n: 2 },
  Cu: { symbol: 'Cu', name: 'Copper', e0: 0.34, color: '#bcaaa4', ion: 'Cu²⁺', n: 2 },
  Ag: { symbol: 'Ag', name: 'Silver', e0: 0.80, color: '#e0e0e0', ion: 'Ag⁺', n: 1 },
};

export default function LabC12Electrochemistry({ onExit }: { onExit?: () => void }) {
  const [leftElectrode, setLeftElectrode] = useState<string>('Zn');
  const [rightElectrode, setRightElectrode] = useState<string>('Cu');
  const [leftConc, setLeftConc] = useState<number>(1.0);
  const [rightConc, setRightConc] = useState<number>(1.0);
  const [logs, setLogs] = useState<string[]>([]);
  
  const [ansCell, setAnsCell] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  const mLeft = metals[leftElectrode];
  const mRight = metals[rightElectrode];

  const e0Cell = mRight.e0 - mLeft.e0;
  
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const lcm = (mLeft.n * mRight.n) / gcd(mLeft.n, mRight.n);
  const coeffLeft = lcm / mLeft.n;
  const coeffRight = lcm / mRight.n;
  
  const Q = Math.pow(leftConc, coeffLeft) / Math.pow(rightConc, coeffRight);
  // Add a tiny bit of internal resistance/noise for realism
  const noise = (Math.random() - 0.5) * 0.005;
  const cellVoltage = e0Cell - (0.0592 / lcm) * Math.log10(Q) + noise;

  const handleLog = () => {
    setLogs(prev => [...prev, `Anode: ${mLeft.symbol} (${leftConc.toFixed(2)}M), Cathode: ${mRight.symbol} (${rightConc.toFixed(2)}M) -> Voltage: ${cellVoltage.toFixed(3)} V`]);
  };

  const checkAnswer = () => {
    const val = parseFloat(ansCell);
    const exactVolts = e0Cell - (0.0592 / lcm) * Math.log10(Q);
    if (!isNaN(val) && Math.abs(val - exactVolts) < 0.05) {
      setFeedback('Correct! You used the Nernst equation accurately.');
    } else {
      setFeedback('Incorrect. E = E° - (0.0592/n) * log(Q). Check n and Q!');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <header className="flex items-center p-4 bg-indigo-900 text-white shadow-md">
        {onExit && (
          <button onClick={onExit} className="mr-4 hover:bg-indigo-800 p-2 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
        )}
        <Zap className="mr-3" size={28} />
        <h1 className="text-2xl font-bold">Virtual Lab: Electrochemistry</h1>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 overflow-y-auto border border-slate-200">
          <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
            <Beaker className="mr-2" /> Theory & Setup
          </h2>
          <div className="prose text-sm text-slate-700">
            <p><strong>Galvanic Cells</strong> convert chemical energy to electrical energy via spontaneous redox reactions.</p>
            <h3 className="text-md font-semibold mt-4">Standard Potential (E°)</h3>
            <div className="bg-slate-100 p-3 rounded text-center font-mono my-2">E°_cell = E°_cathode - E°_anode</div>
            
            <h3 className="text-md font-semibold mt-4">Nernst Equation</h3>
            <p>For non-standard concentrations:</p>
            <div className="bg-slate-100 p-3 rounded text-center font-mono my-2">
              E = E° - (0.0592 / n) log₁₀(Q)
            </div>
            
            <h3 className="text-md font-semibold mt-4">Winkler Method (BOD)</h3>
            <p>Biochemical Oxygen Demand (BOD) is measured using redox titrations (Winkler Method) to find dissolved O₂ in water. Mn²⁺ is oxidized, then reacted with iodide, and titrated with thiosulfate.</p>

            <h3 className="text-md font-semibold mt-4">Standard Potentials</h3>
            <ul className="list-disc pl-5">
              {Object.values(metals).map(m => (
                <li key={m.symbol}>{m.ion} + {m.n}e⁻ ⇌ {m.symbol} ({m.e0 > 0 ? '+' : ''}{m.e0.toFixed(2)} V)</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center border border-slate-200">
          <h2 className="text-xl font-bold text-indigo-900 mb-4">Galvanic Cell Simulator</h2>
          
          <div className="flex w-full justify-between mb-4 gap-4">
            <div className="w-1/2 space-y-2">
              <label className="block text-sm font-semibold">Left Beaker (Anode)</label>
              <select 
                className="w-full p-2 border rounded bg-slate-50"
                value={leftElectrode}
                onChange={e => setLeftElectrode(e.target.value)}
              >
                {Object.keys(metals).map(k => <option key={k} value={k}>{metals[k].name} ({k})</option>)}
              </select>
              <label className="block text-sm">[{mLeft.ion}] (M)</label>
              <input type="range" min="0.01" max="2" step="0.01" value={leftConc} onChange={e => setLeftConc(parseFloat(e.target.value))} className="w-full" />
              <div className="text-center text-xs font-mono">{leftConc.toFixed(2)} M</div>
            </div>
            
            <div className="w-1/2 space-y-2">
              <label className="block text-sm font-semibold">Right Beaker (Cathode)</label>
              <select 
                className="w-full p-2 border rounded bg-slate-50"
                value={rightElectrode}
                onChange={e => setRightElectrode(e.target.value)}
              >
                {Object.keys(metals).map(k => <option key={k} value={k}>{metals[k].name} ({k})</option>)}
              </select>
              <label className="block text-sm">[{mRight.ion}] (M)</label>
              <input type="range" min="0.01" max="2" step="0.01" value={rightConc} onChange={e => setRightConc(parseFloat(e.target.value))} className="w-full" />
              <div className="text-center text-xs font-mono">{rightConc.toFixed(2)} M</div>
            </div>
          </div>

          <div className="relative w-full max-w-sm aspect-video bg-slate-50 border rounded-xl overflow-hidden mt-4">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-green-400 font-mono text-xl px-4 py-2 rounded-lg shadow-inner z-10 border-2 border-gray-900">
              {cellVoltage.toFixed(3)} V
            </div>
            
            <svg viewBox="0 0 400 200" className="w-full h-full">
              <path d="M 100 120 L 100 30 L 200 30" stroke="#333" strokeWidth="4" fill="none" />
              <path d="M 300 120 L 300 30 L 200 30" stroke="#333" strokeWidth="4" fill="none" />
              <path d="M 140 100 L 140 70 A 60 60 0 0 1 260 70 L 260 100" stroke="#a7f3d0" strokeWidth="16" fill="none" opacity="0.8" />
              <text x="200" y="85" textAnchor="middle" fontSize="10" fill="#065f46" fontWeight="bold">KNO₃ Salt Bridge</text>
              
              <path d="M 50 80 L 50 180 Q 50 190 60 190 L 140 190 Q 150 190 150 180 L 150 80" stroke="#94a3b8" strokeWidth="3" fill="none" />
              <rect x="52" y="100" width="96" height="88" fill="#e0f2fe" opacity="0.6" />
              <rect x="80" y="60" width="40" height="100" fill={mLeft.color} stroke="#64748b" strokeWidth="2" />
              <text x="100" y="140" textAnchor="middle" fontSize="14" fill="#1e293b" fontWeight="bold">{mLeft.symbol}</text>
              <text x="100" y="160" textAnchor="middle" fontSize="12" fill="#0369a1">{mLeft.ion}</text>
              
              <path d="M 250 80 L 250 180 Q 250 190 260 190 L 340 190 Q 350 190 350 180 L 350 80" stroke="#94a3b8" strokeWidth="3" fill="none" />
              <rect x="252" y="100" width="96" height="88" fill="#e0f2fe" opacity="0.6" />
              <rect x="280" y="60" width="40" height="100" fill={mRight.color} stroke="#64748b" strokeWidth="2" />
              <text x="300" y="140" textAnchor="middle" fontSize="14" fill="#1e293b" fontWeight="bold">{mRight.symbol}</text>
              <text x="300" y="160" textAnchor="middle" fontSize="12" fill="#0369a1">{mRight.ion}</text>
            </svg>
          </div>
          
          <button 
            onClick={handleLog}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors w-full"
          >
            Record Data Point
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
            <Activity className="mr-2" /> Assessment
          </h2>
          
          <div className="flex-1 overflow-y-auto bg-slate-50 rounded-lg p-4 border border-slate-200 text-sm font-mono mb-4">
            <h3 className="font-bold text-slate-700 mb-2 border-b pb-1">Lab Journal</h3>
            {logs.length === 0 ? (
              <p className="text-slate-400 italic">No data recorded. Build a cell and record measurements.</p>
            ) : (
              <ul className="space-y-2">
                {logs.map((log, i) => <li key={i} className="text-xs">{i+1}. {log}</li>)}
              </ul>
            )}
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <h3 className="font-semibold text-indigo-900 mb-2">Theoretical Calculation</h3>
            <p className="text-sm text-indigo-800 mb-3">
              Calculate the precise theoretical voltage (no noise) for your current cell setup using the Nernst equation.
            </p>
            <input 
              type="text" 
              placeholder="e.g. 1.100" 
              value={ansCell}
              onChange={e => setAnsCell(e.target.value)}
              className="w-full p-2 border border-indigo-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
            />
            <button 
              onClick={checkAnswer}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition-colors flex items-center justify-center"
            >
              <CheckCircle2 className="mr-2" size={18} /> Check Answer
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
