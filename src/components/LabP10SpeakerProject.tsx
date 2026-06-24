import { useState, useEffect } from 'react';
import { Save, RefreshCw, CheckCircle, XCircle, Music } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit?: () => void;
}

const MAGNETS = [
  { id: 'ceramic', name: 'Ceramic Magnet', B: 0.05 }, // Tesla
  { id: 'neodymium', name: 'Neodymium Magnet', B: 0.25 },
  { id: 'mystery', name: 'Mystery Magnet', B: 0.12 }, // Unknown to user
];

export default function LabP10SpeakerProject({ onExit }: LabProps) {
  const [turns, setTurns] = useState(50); // N
  const [current, setCurrent] = useState(0.5); // A
  const [radius] = useState(0.02); // m (fixed for simplicity, or make it variable)
  const [magnetId, setMagnetId] = useState('ceramic');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [measuredForce, setMeasuredForce] = useState<number | null>(null);
  
  const [data, setData] = useState<Array<{ id: number; turns: number; current: number; B: number; F: number }>>([]);
  const [assessmentInput, setAssessmentInput] = useState('');
  const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const selectedMagnet = MAGNETS.find(m => m.id === magnetId) || MAGNETS[0];

  useEffect(() => {
    if (!isPlaying) {
      setMeasuredForce(null);
      return;
    }

    // F = B * I * L
    // L = N * 2 * pi * r
    const L = turns * 2 * Math.PI * radius;
    const trueForce = selectedMagnet.B * current * L;
    
    // Add ±2% real-world noise, and maybe internal resistance drop depending on turns
    // The more turns, the more resistance. Let's just add simple measurement noise.
    const noise = 1 + (Math.random() - 0.5) * 0.04;
    const peakForce = trueForce * noise;

    const interval = setInterval(() => {
      setMeasuredForce(peakForce + (Math.random() * 0.001 - 0.0005));
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, turns, current, radius, selectedMagnet]);

  const recordData = () => {
    if (measuredForce === null) return;
    setData(prev => [
      ...prev,
      {
        id: Date.now(),
        turns,
        current,
        B: selectedMagnet.id === 'mystery' ? NaN : selectedMagnet.B,
        F: Number(measuredForce.toFixed(4))
      }
    ]);
  };

  const checkAssessment = () => {
    const userB = parseFloat(assessmentInput);
    if (isNaN(userB)) return;
    // Accept ±5% error
    const error = Math.abs(userB - 0.12) / 0.12;
    if (error <= 0.05) {
      setAssessmentStatus('correct');
    } else {
      setAssessmentStatus('incorrect');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Unit 13: Making a Speaker (Motor Effect)" subtitle="Investigate the electromagnetic forces that drive a DIY speaker." />

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
        
        {/* Column 1: Theory & Setup */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Theory & Setup</h2>
          <div className="prose prose-sm text-slate-600 mb-6">
            <p>
              A speaker works using the <strong>Motor Effect</strong>. When an alternating current <span className="font-mono">I</span> flows through a coil of wire in a magnetic field <span className="font-mono">B</span>, a force is exerted on the wire.
            </p>
            <div className="bg-slate-100 p-3 rounded-lg text-center font-mono font-bold text-lg">
              F = B · I · L
            </div>
            <p className="mt-2">
              For a circular coil, the total length <span className="font-mono">L</span> of wire in the magnetic field is <span className="font-mono">N × 2πr</span>, where <span className="font-mono">N</span> is the number of turns and <span className="font-mono">r</span> is the radius. The alternating force vibrates the cup, creating sound waves.
            </p>
          </div>

          <div className="space-y-6 flex-1">
            <div>
              <label className="flex justify-between font-medium text-sm text-slate-700 mb-1">
                <span>Magnet Type</span>
              </label>
              <select 
                value={magnetId} 
                onChange={(e) => setMagnetId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md bg-slate-50"
              >
                {MAGNETS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex justify-between font-medium text-sm text-slate-700 mb-1">
                <span>Coil Turns (N)</span>
                <span className="text-orange-600 font-bold">{turns} turns</span>
              </label>
              <input 
                type="range" min="10" max="200" step="10"
                value={turns}
                onChange={(e) => setTurns(Number(e.target.value))}
                className="w-full accent-orange-600"
              />
            </div>

            <div>
              <label className="flex justify-between font-medium text-sm text-slate-700 mb-1">
                <span>Peak Current (I)</span>
                <span className="text-blue-600 font-bold">{current.toFixed(2)} A</span>
              </label>
              <input 
                type="range" min="0.1" max="2.0" step="0.1"
                value={current}
                onChange={(e) => setCurrent(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Column 2: Simulation */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-700 p-6 flex flex-col items-center relative overflow-hidden">
          <h2 className="text-lg font-bold text-white mb-4 w-full text-left">Simulation</h2>
          
          <div className="flex-1 w-full flex flex-col items-center justify-center relative">
            
            {/* The DIY Speaker */}
            <div className="relative w-48 h-48 flex flex-col items-center justify-center">
               {/* Sound waves emitting from cup */}
               {isPlaying && (
                 <div className="absolute -top-16 inset-x-0 h-32 flex justify-center pointer-events-none">
                    <div className="w-full h-full border-t-8 border-indigo-400 rounded-t-[100px] animate-[ping_0.5s_linear_infinite] opacity-50" />
                 </div>
               )}

               {/* The Cup */}
               <div className={`w-40 h-32 border-4 border-white/20 bg-slate-50/10 rounded-b-3xl relative flex flex-col justify-end items-center pb-4 backdrop-blur-sm z-10 transition-transform ${isPlaying ? 'animate-[vibrate_0.1s_infinite]' : ''}`}>
                 {/* Magnet inside */}
                 <div className={`w-12 h-6 bg-slate-400 border-2 border-slate-500 rounded-sm mb-2 z-0 shadow-lg relative flex items-center justify-center ${selectedMagnet.id === 'mystery' ? 'bg-purple-900' : ''}`}>
                   <span className="text-[10px] text-white font-bold">{selectedMagnet.id === 'mystery' ? '?' : 'N  S'}</span>
                 </div>
               </div>
               
               {/* The Coil on bottom */}
               <div className={`absolute bottom-[-10px] w-20 border-4 border-orange-500 rounded-full z-20 flex flex-col justify-center transition-all ${isPlaying ? 'shadow-[0_0_15px_#f97316]' : ''}`} style={{ height: `${20 + (turns/200)*30}px` }}>
                  <div className="w-full h-full absolute inset-0 opacity-50 flex flex-col justify-between py-1">
                    {[...Array(Math.min(5, Math.max(2, Math.floor(turns/40))))].map((_,i) => (
                      <div key={i} className="w-full border-t border-orange-300" />
                    ))}
                  </div>
               </div>
            </div>

            <div className="mt-12 flex flex-col items-center z-30">
              <div className="text-3xl font-mono text-indigo-400 font-bold bg-black/50 px-6 py-2 rounded-xl border border-indigo-900 mb-4 h-14 flex items-center justify-center min-w-[200px]">
                {measuredForce !== null ? `${measuredForce.toFixed(4)} N` : '0.0000 N'}
              </div>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95 ${isPlaying ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
              >
                {isPlaying ? 'Stop Audio' : <><Music className="w-5 h-5" /> Play Audio</>}
              </button>
            </div>
          </div>

          <style>{`
            @keyframes vibrate {
              0% { transform: translateY(-2px); }
              50% { transform: translateY(2px); }
              100% { transform: translateY(-2px); }
            }
          `}</style>
        </div>

        {/* Column 3: Data & Assessment */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Data Logger</h2>
            <button 
              onClick={recordData}
              disabled={measuredForce === null}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white rounded text-sm font-medium transition-colors"
            >
              <Save className="w-4 h-4" /> Record Data
            </button>
          </div>

          <div className="overflow-auto max-h-40 border border-slate-200 rounded-lg mb-4">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 border-b">N</th>
                  <th className="px-3 py-2 border-b">I (A)</th>
                  <th className="px-3 py-2 border-b">Mag B</th>
                  <th className="px-3 py-2 border-b">F (N)</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-slate-400 italic">No data recorded yet</td>
                  </tr>
                )}
                {data.map(d => (
                  <tr key={d.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-3 py-2">{d.turns}</td>
                    <td className="px-3 py-2">{d.current}</td>
                    <td className="px-3 py-2">{Number.isNaN(d.B) ? '?' : d.B}</td>
                    <td className="px-3 py-2 font-medium text-indigo-600">{d.F}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-4 relative mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase absolute top-2 left-3">Force vs Current (I)</h3>
            <div className="w-full h-full pt-6">
               <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <line x1="10" y1="90" x2="100" y2="90" stroke="#cbd5e1" strokeWidth="1" />
                 <line x1="10" y1="10" x2="10" y2="90" stroke="#cbd5e1" strokeWidth="1" />
                 
                 {data.map((d, i) => {
                   const x = 10 + (d.current / 2.0) * 90;
                   const maxF = Math.max(...data.map(item => item.F), 0.1);
                   const y = 90 - (d.F / maxF) * 80;
                   return <circle key={i} cx={x} cy={y} r="2.5" fill="#4f46e5" />;
                 })}
               </svg>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-bold text-purple-800 text-sm mb-2">Assessment: Mystery Magnet</h3>
            <p className="text-xs text-purple-700 mb-3">
              Use the Mystery Magnet. Assume <span className="font-mono">r = 0.02 m</span>. Record peak force for a known <span className="font-mono">I</span> and <span className="font-mono">N</span>, then calculate the magnetic field strength <span className="font-mono">B</span> in Tesla using <span className="font-mono">B = F / (I · N · 2πr)</span>.
            </p>
            <div className="flex gap-2">
              <input 
                type="number" 
                step="0.01"
                placeholder="e.g. 0.15"
                value={assessmentInput}
                onChange={(e) => { setAssessmentInput(e.target.value); setAssessmentStatus('idle'); }}
                className="flex-1 px-3 py-1.5 border border-purple-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-xs self-center text-purple-700 font-bold mr-2">T</span>
              <button 
                onClick={checkAssessment}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-bold transition-colors"
              >
                Check
              </button>
            </div>
            {assessmentStatus === 'correct' && (
              <div className="mt-2 flex items-center gap-1 text-emerald-600 text-sm font-bold">
                <CheckCircle className="w-4 h-4" /> Correct! B ≈ 0.12 T.
              </div>
            )}
            {assessmentStatus === 'incorrect' && (
              <div className="mt-2 flex items-center gap-1 text-red-600 text-sm font-bold">
                <XCircle className="w-4 h-4" /> Incorrect. Check your formula!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
