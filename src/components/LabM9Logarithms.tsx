import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Activity, Globe } from 'lucide-react';

interface Props {
  onExit?: () => void;
}

export default function LabM9Logarithms({ onExit }: Props) {
  const [magnitude, setMagnitude] = useState<number>(5.0);
  const [isQuaking, setIsQuaking] = useState(false);
  const [logs, setLogs] = useState<{ id: number; mag: number; energyStr: string }[]>([]);

  // Assessment
  const [m1, setM1] = useState(0);
  const [m2, setM2] = useState(0);
  const [qAns, setQAns] = useState("");
  const [qStatus, setQStatus] = useState<null | boolean>(null);
  const [qExpected, setQExpected] = useState(0);

  useEffect(() => {
    const mag1 = Math.floor(Math.random() * 3) + 4; // 4, 5, 6
    const mag2 = mag1 + 2; // +2 difference means 1000x energy
    setM1(mag1);
    setM2(mag2);
    setQExpected(Math.pow(10, 1.5 * (mag2 - mag1)));
  }, []);

  const triggerEarthquake = () => {
    setIsQuaking(true);
    setTimeout(() => setIsQuaking(false), 2000);
    
    // E = 10^(1.5M + 4.8)
    const exp = 1.5 * magnitude + 4.8;
    const power = Math.floor(exp);
    const coeff = Math.pow(10, exp - power);
    const energyStr = `${coeff.toFixed(2)} × 10^${power} J`;
    
    setLogs([...logs, { id: logs.length + 1, mag: magnitude, energyStr }]);
  };

  const checkAnswer = () => {
    const numAns = Number(qAns.replace(/,/g, ''));
    setQStatus(Math.abs(numAns - qExpected) < 1);
  };

  const seismographPoints = Array.from({ length: 100 }).map((_, i) => {
    const x = i * 4;
    const noise = isQuaking ? (Math.random() - 0.5) * Math.pow(1.8, magnitude) : (Math.random() - 0.5) * 2;
    // Cap visual noise
    const y = 50 + Math.max(-45, Math.min(45, noise));
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-slate-800 text-white p-4 flex items-center shadow-md">
        <button onClick={onExit} className="mr-4 hover:bg-slate-700 p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Globe /> Grade 9 Math: Logarithms & Richter Scale</h1>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Theory Column */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Theory: Logarithms & Scientific Notation</h2>
          
          <div className="prose prose-slate">
            <h3 className="text-lg font-semibold text-red-700">The Richter Scale</h3>
            <p className="text-slate-600">
              The Richter scale is a base-10 logarithmic scale used to measure earthquakes. 
              Because earthquake energies vary drastically, a logarithmic scale helps represent them with simple numbers.
            </p>
            
            <h3 className="text-lg font-semibold text-red-700 mt-4">Energy Formula</h3>
            <p className="text-slate-600">
              The energy E (in Joules) relates to magnitude M by the equation:<br />
              <strong>E = 10^(1.5M + 4.8)</strong><br/>
              An increase of 1.0 in magnitude means exactly 10^(1.5) ≈ 31.6 times more energy released!
            </p>

            <h3 className="text-lg font-semibold text-red-700 mt-4">Scientific Notation</h3>
            <p className="text-slate-600">
              Very large numbers are written as a × 10^n. 
              For example, 1,500,000 becomes 1.5 × 10^6.
            </p>
          </div>
        </div>

        {/* Interactive Simulator */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <Activity className="text-red-600" /> Seismograph Simulator
          </h2>
          
          {/* Visualizer */}
          <div className="relative w-full h-40 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 400 100">
              <path d={seismographPoints} stroke="#10b981" strokeWidth="2" fill="none" className="transition-all duration-75" />
            </svg>
            <div className="absolute top-2 left-2 text-green-400 font-mono text-xs">Seismic Data Feed // Live</div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-lg border">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex justify-between">
                <span>Magnitude (M): {magnitude.toFixed(1)}</span>
                <span className="text-red-600 text-xs">{magnitude > 7 ? 'Severe' : magnitude > 5 ? 'Moderate' : 'Minor'}</span>
              </label>
              <input 
                type="range" min="1.0" max="9.0" step="0.1" 
                value={magnitude} onChange={(e) => setMagnitude(Number(e.target.value))}
                className="w-full accent-red-600"
              />
            </div>

            <button 
              onClick={triggerEarthquake}
              disabled={isQuaking}
              className={`w-full py-3 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${isQuaking ? 'bg-slate-400' : 'bg-red-600 hover:bg-red-700'}`}
            >
              <Globe size={20} /> {isQuaking ? 'Recording...' : 'Trigger Earthquake'}
            </button>
          </div>
        </div>

        {/* Data & Assessment */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Data Logs & Assessment</h2>
          
          <div className="flex-1 overflow-y-auto border rounded-lg bg-slate-50 p-2 min-h-[150px]">
            {logs.length === 0 ? (
              <div className="text-center text-slate-400 mt-10">Trigger an event to record data.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase border-b">
                  <tr>
                    <th className="px-2 py-1">Event</th>
                    <th className="px-2 py-1">Mag (M)</th>
                    <th className="px-2 py-1">Est. Energy (Joules)</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(l => (
                    <tr key={l.id} className="border-b">
                      <td className="px-2 py-1">#{l.id}</td>
                      <td className="px-2 py-1 font-bold text-red-600">{l.mag.toFixed(1)}</td>
                      <td className="px-2 py-1 font-mono text-slate-700">{l.energyStr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <p className="text-sm font-semibold mb-2">
              An earthquake of Magnitude {m2.toFixed(1)} releases how many times more energy than a Magnitude {m1.toFixed(1)} earthquake?
            </p>
            <div className="flex gap-2">
              <input 
                type="number" value={qAns} onChange={(e) => setQAns(e.target.value)}
                className="flex-1 border rounded px-2 py-1 outline-none focus:border-red-400"
                placeholder="Factor..."
              />
              <button onClick={checkAnswer} className="px-3 bg-red-600 text-white rounded font-bold hover:bg-red-700">Check</button>
            </div>
            {qStatus !== null && (
              <div className={`mt-2 flex items-center gap-1 text-sm font-bold ${qStatus ? 'text-green-600' : 'text-red-500'}`}>
                {qStatus ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {qStatus ? 'Correct! It increases by 10^(1.5 * difference).' : 'Try again. Formula: 10^(1.5 * difference)'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
