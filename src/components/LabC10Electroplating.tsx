import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Save, CheckCircle, XCircle } from 'lucide-react';

const METALS = {
  Zn: { name: 'Zinc', mass: 65.38, z: 2, color: '#e2e8f0', electrolyte: '#bfdbfe' },
  Sn: { name: 'Tin', mass: 118.71, z: 2, color: '#d6d3d1', electrolyte: '#f1f5f9' },
  Cr: { name: 'Chromium', mass: 51.99, z: 3, color: '#94a3b8', electrolyte: '#fed7aa' }
};

export default function LabC10Electroplating({ onExit }: { onExit?: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [current, setCurrent] = useState(2);
  const [metal, setMetal] = useState<keyof typeof METALS>('Zn');
  const [data, setData] = useState<Array<{t: number, mass: number, current: number}>>([]);

  const mData = METALS[metal];
  const F = 96485;
  const massDeposited = (current * (time * 100) * mData.mass) / (mData.z * F);

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => setTime(t => t + 1), 100);
    }
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    setData([]);
  };

  const recordData = () => {
    setData(prev => [...prev, { t: time, mass: parseFloat(massDeposited.toFixed(4)), current }]);
  };

  const [assQ] = useState({ i: Math.floor(Math.random() * 3) + 2, t: Math.floor(Math.random() * 30) + 10 });
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkAnswer = () => {
    const expected = (assQ.i * assQ.t * mData.mass) / (mData.z * F);
    if (Math.abs(parseFloat(answer) - expected) < 0.005) setIsCorrect(true);
    else setIsCorrect(false);
  };

  const renderGraph = () => {
    if (data.length === 0) return <div className="h-48 flex items-center justify-center text-slate-400">No data recorded</div>;
    const maxT = Math.max(10, ...data.map(d => d.t));
    const maxM = Math.max(0.001, ...data.map(d => d.mass));
    const pts = data.map(d => `${(d.t / maxT) * 100},${100 - (d.mass / maxM) * 100}`).join(' ');

    return (
      <svg viewBox="-15 -10 130 130" className="w-full h-48 bg-white border rounded-lg p-2 overflow-visible">
        <line x1="0" y1="100" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="100" stroke="#94a3b8" strokeWidth="1" />
        <polyline points={pts} fill="none" stroke="#2563eb" strokeWidth="2" />
        {data.map((d, i) => (
          <circle key={i} cx={(d.t / maxT) * 100} cy={100 - (d.mass / maxM) * 100} r="2" fill="#ef4444" />
        ))}
        <text x="50" y="115" fontSize="6" textAnchor="middle" fill="#64748b">Time (s)</text>
        <text x="-10" y="50" fontSize="6" textAnchor="middle" fill="#64748b" transform="rotate(-90 -10 50)">Mass (g)</text>
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none p-4">
      <div className="flex items-center mb-4">
        <button onClick={onExit} className="flex items-center text-slate-600 hover:text-slate-900 mr-4">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Electroplating Virtual Lab</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Column 1: Theory & Setup */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Theory & Setup</h2>
          <p className="text-slate-600 text-sm mb-4">
            Electroplating uses an electric current to reduce dissolved metal cations so that they form a coherent metal coating on an electrode.
            The mass of metal deposited is proportional to the current and time (Faraday's First Law).
          </p>
          <div className="bg-slate-100 p-4 rounded-lg mb-6 text-sm font-mono">
            m = (I × t × M) / (z × F)
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Plating Metal (Anode)</label>
              <select 
                value={metal} 
                onChange={(e) => setMetal(e.target.value as keyof typeof METALS)}
                className="w-full p-2 border border-slate-300 rounded-md"
              >
                <option value="Zn">Zinc (Zn²⁺)</option>
                <option value="Sn">Tin (Sn²⁺)</option>
                <option value="Cr">Chromium (Cr³⁺)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Current: {current} A</label>
              <input 
                type="range" min="1" max="5" step="0.5" 
                value={current} onChange={(e) => setCurrent(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Column 2: Simulation */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col items-center">
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
              {/* Beaker */}
              <path d="M 40 40 L 40 180 Q 40 190 50 190 L 150 190 Q 160 190 160 180 L 160 40" fill="none" stroke="#94a3b8" strokeWidth="4" />
              {/* Liquid */}
              <path d="M 42 80 L 158 80 L 158 188 L 42 188 Z" fill={mData.electrolyte} opacity="0.6" />
              
              {/* Cathode (Steel with plating) */}
              <rect x={60 - Math.min(10, massDeposited * 100)} y={60} width={20 + Math.min(20, massDeposited * 200)} height={110} fill="#64748b" rx="2" />
              <rect x={60 - Math.min(10, massDeposited * 100)} y={80} width={20 + Math.min(20, massDeposited * 200)} height={110} fill={mData.color} opacity={Math.min(1, massDeposited * 100)} />

              {/* Anode */}
              <rect x="120" y="60" width={20 - Math.min(15, massDeposited * 50)} height={110} fill={mData.color} rx="2" />

              {/* Circuit */}
              <polyline points="70,60 70,20 130,20 130,60" fill="none" stroke="#1e293b" strokeWidth="2" />
              <rect x="85" y="10" width="30" height="20" fill="#334155" rx="2" />
              <text x="100" y="24" fill="white" fontSize="10" textAnchor="middle">{current}A</text>

              {/* Ions moving */}
              {isPlaying && (
                <>
                  <circle cx={110 - (time % 10) * 4} cy="120" r="3" fill={mData.color} />
                  <circle cx={115 - ((time + 5) % 10) * 4} cy="150" r="3" fill={mData.color} />
                </>
              )}
            </svg>
          </div>
          
          <div className="mt-6 w-full grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-100 p-3 rounded-lg">
              <div className="text-xs text-slate-500 uppercase font-bold">Simulated Time</div>
              <div className="text-xl font-mono text-slate-800">{time * 100} s</div>
            </div>
            <div className="bg-slate-100 p-3 rounded-lg">
              <div className="text-xs text-slate-500 uppercase font-bold">Mass Deposited</div>
              <div className="text-xl font-mono text-slate-800">{massDeposited.toFixed(4)} g</div>
            </div>
          </div>
        </div>

        {/* Column 3: Data & Analysis */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
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
                  <th className="px-3 py-2 border-b">Sim. Time (s)</th>
                  <th className="px-3 py-2 border-b">Current (A)</th>
                  <th className="px-3 py-2 border-b">Mass (g)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-3 py-2">{d.t * 100}</td>
                    <td className="px-3 py-2">{d.current}</td>
                    <td className="px-3 py-2 font-mono">{d.mass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-sm font-bold text-blue-900 mb-2">Assessment</h3>
            <p className="text-sm text-blue-800 mb-3">
              Calculate the theoretical mass of {mData.name} deposited after {assQ.t} seconds at {assQ.i} Amps. (Provide answer to 4 decimal places).
            </p>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Mass (g)" 
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
