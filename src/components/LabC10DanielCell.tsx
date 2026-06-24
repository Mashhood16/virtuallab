import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Save, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC10DanielCell({ onExit }: { onExit?: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [znConc, setZnConc] = useState(1.0);
  const [cuConc, setCuConc] = useState(1.0);
  const [data, setData] = useState<Array<{t: number, v: number, zn: number, cu: number}>>([]);

  const E0 = 1.10;
  const Q = znConc / cuConc;
  const voltage = E0 - (0.0592 / 2) * Math.log10(Q);

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => setTime(t => t + 1), 500);
    }
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    setData([]);
  };

  const recordData = () => {
    setData(prev => [...prev, { t: time, v: parseFloat(voltage.toFixed(3)), zn: znConc, cu: cuConc }]);
  };

  const [assQ] = useState({ zn: 0.1, cu: 2.0 });
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkAnswer = () => {
    const expected = E0 - (0.0592 / 2) * Math.log10(assQ.zn / assQ.cu);
    if (Math.abs(parseFloat(answer) - expected) < 0.01) setIsCorrect(true);
    else setIsCorrect(false);
  };

  const renderGraph = () => {
    if (data.length === 0) return <div className="h-48 flex items-center justify-center text-slate-400">No data recorded</div>;
    const maxT = Math.max(10, ...data.map(d => d.t));
    const pts = data.map(d => `${(d.t / maxT) * 100},${100 - ((d.v - 1.0) / 0.2) * 100}`).join(' ');

    return (
      <svg viewBox="-15 -10 130 130" className="w-full h-48 bg-slate-50 border rounded-lg p-2 overflow-visible">
        <line x1="0" y1="100" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="100" stroke="#94a3b8" strokeWidth="1" />
        <polyline points={pts} fill="none" stroke="#2563eb" strokeWidth="2" />
        {data.map((d, i) => (
          <circle key={i} cx={(d.t / maxT) * 100} cy={100 - ((d.v - 1.0) / 0.2) * 100} r="2" fill="#ef4444" />
        ))}
        <text x="50" y="115" fontSize="6" textAnchor="middle" fill="#64748b">Time</text>
        <text x="-10" y="50" fontSize="6" textAnchor="middle" fill="#64748b" transform="rotate(-90 -10 50)">Voltage (V)</text>
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none p-4">
<LabHeader onExit={onExit} title="Galvanic Daniel Cell" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Theory & Setup</h2>
          <p className="text-slate-600 text-sm mb-4">
            The Daniel cell consists of a Zinc anode and a Copper cathode. Electrons flow through the external circuit, generating a voltage. The Nernst equation determines the cell potential under non-standard conditions.
          </p>
          <div className="bg-slate-100 p-4 rounded-lg mb-6 text-sm font-mono overflow-x-auto">
            E = E° - (0.0592 / 2) * log₁₀([Zn²⁺]/[Cu²⁺])
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Anode [Zn²⁺]: {znConc.toFixed(2)} M</label>
              <input 
                type="range" min="0.01" max="2.0" step="0.01" 
                value={znConc} onChange={(e) => setZnConc(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cathode [Cu²⁺]: {cuConc.toFixed(2)} M</label>
              <input 
                type="range" min="0.01" max="2.0" step="0.01" 
                value={cuConc} onChange={(e) => setCuConc(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 self-start">Simulation Viewer</h2>
          
          <div className="w-full flex justify-center space-x-4 mb-6">
            <button onClick={() => setIsPlaying(!isPlaying)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Disconnect' : 'Connect'}
            </button>
            <button onClick={handleReset} className="flex items-center px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </button>
          </div>

          <div className="relative w-full max-w-sm aspect-square bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Beakers */}
              <path d="M 20 100 L 20 180 Q 20 190 30 190 L 80 190 Q 90 190 90 180 L 90 100" fill="none" stroke="#94a3b8" strokeWidth="4" />
              <path d="M 110 100 L 110 180 Q 110 190 120 190 L 170 190 Q 180 190 180 180 L 180 100" fill="none" stroke="#94a3b8" strokeWidth="4" />
              
              {/* Liquids */}
              <path d="M 22 130 L 88 130 L 88 188 L 22 188 Z" fill="#f1f5f9" opacity="0.8" />
              <path d="M 112 130 L 178 130 L 178 188 L 112 188 Z" fill="#bfdbfe" opacity="0.8" />

              {/* Salt Bridge */}
              <path d="M 60 150 L 60 80 Q 60 60 100 60 Q 140 60 140 80 L 140 150" fill="none" stroke="#fef08a" strokeWidth="15" opacity="0.8" />

              {/* Electrodes */}
              <rect x="45" y="110" width="20" height="70" fill="#94a3b8" rx="2" />
              <rect x="135" y="110" width="20" height="70" fill="#f59e0b" rx="2" />
              <text x="55" y="150" fill="white" fontSize="10" textAnchor="middle">Zn</text>
              <text x="145" y="150" fill="white" fontSize="10" textAnchor="middle">Cu</text>

              {/* Circuit */}
              <polyline points="55,110 55,30 145,30 145,110" fill="none" stroke="#1e293b" strokeWidth="2" />
              
              {/* Voltmeter */}
              <circle cx="100" cy="30" r="20" fill="#334155" />
              <text x="100" y="34" fill="white" fontSize="12" textAnchor="middle">{isPlaying ? voltage.toFixed(2) : '0.00'}V</text>

              {/* Moving Electrons */}
              {isPlaying && (
                <>
                  <circle cx={55 + ((time % 10) * 4.5)} cy="30" r="3" fill="#fbbf24" />
                  <circle cx={55 + (((time + 5) % 10) * 4.5)} cy="30" r="3" fill="#fbbf24" />
                </>
              )}
            </svg>
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
                  <th className="px-3 py-2 border-b">[Zn²⁺] M</th>
                  <th className="px-3 py-2 border-b">[Cu²⁺] M</th>
                  <th className="px-3 py-2 border-b">Voltage (V)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-3 py-2">{d.zn}</td>
                    <td className="px-3 py-2">{d.cu}</td>
                    <td className="px-3 py-2 font-mono text-blue-600">{d.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-sm font-bold text-blue-900 mb-2">Assessment</h3>
            <p className="text-sm text-blue-800 mb-3">
              Given E° = 1.10V, calculate the expected cell potential when [Zn²⁺] = {assQ.zn} M and [Cu²⁺] = {assQ.cu} M. (Provide answer to 2 decimal places).
            </p>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Voltage (V)" 
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
