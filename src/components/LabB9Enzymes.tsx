import { useState, useEffect } from 'react';
import { Thermometer, Droplet, CheckCircle, Activity, Info, Beaker, Play, RotateCcw, Save } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabB9Enzymes({ onExit }: { onExit?: () => void }) {
  const [enzyme, setEnzyme] = useState<'Amylase' | 'Pepsin'>('Amylase');
  const [temp, setTemp] = useState<number>(37);
  const [ph, setPh] = useState<number>(7);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dataPoints, setDataPoints] = useState<{ id: number; enzyme: string; temp: number; ph: number; rate: number }[]>([]);
  
  // Assessment state
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [feedback, setFeedback] = useState('');

  const calcRate = () => {
    let tRate = 0;
    if (temp <= 37) tRate = (temp / 37) * 100;
    else if (temp <= 60) tRate = Math.max(0, 100 - (temp - 37) * 4.34);
    
    let pRate = 0;
    if (enzyme === 'Amylase') {
      pRate = Math.max(0, 1 - Math.abs(ph - 7) * 0.3);
    } else {
      pRate = Math.max(0, 1 - Math.abs(ph - 2) * 0.5);
    }
    
    return tRate * pRate;
  };

  const rate = calcRate();
  const isDenatured = temp > 60 || (enzyme === 'Amylase' && (ph < 4 || ph > 10)) || (enzyme === 'Pepsin' && (ph > 5 || ph < 1));

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setProgress(p => {
          const inc = (rate / 100) * 2;
          if (inc <= 0 || p + inc >= 100) {
            setIsRunning(false);
            return p + inc >= 100 ? 100 : p;
          }
          return p + inc;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, rate]);

  const handleRecord = () => {
    setDataPoints(prev => [...prev, { id: Date.now(), enzyme, temp, ph, rate: Math.round(rate) }]);
  };

  const checkAnswers = () => {
    let correct = 0;
    if (q1.trim() === '37') correct++;
    if (q2.trim() === '2') correct++;
    if (q3.trim().toLowerCase() === 'denaturation' || q3.trim().toLowerCase() === 'denatured') correct++;
    
    if (correct === 3) setFeedback('Excellent! All answers are correct.');
    else setFeedback(`You got ${correct} out of 3 correct. Keep analyzing the data!`);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Virtual Lab: Enzyme Kinetics" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Column: Theory & Setup */}
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center mb-2">
              <Info className="w-5 h-5 mr-2 text-emerald-600" />
              Theory & Context
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              Enzymes are biological catalysts that speed up chemical reactions without being consumed. Their activity is heavily influenced by <strong>Temperature</strong> and <strong>pH</strong>.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Extreme heat or incorrect pH levels can break the internal bonds holding the enzyme's 3D structure together, causing <strong>denaturation</strong> and loss of function.
            </p>
          </div>

          <div className="space-y-4 flex-1">
            <h3 className="font-bold text-gray-700">Lab Setup</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Enzyme</label>
              <div className="flex space-x-2">
                <button 
                  onClick={() => { setEnzyme('Amylase'); setProgress(0); setIsRunning(false); }}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${enzyme === 'Amylase' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Amylase (Saliva)
                </button>
                <button 
                  onClick={() => { setEnzyme('Pepsin'); setProgress(0); setIsRunning(false); }}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${enzyme === 'Pepsin' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Pepsin (Stomach)
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <label className="flex justify-between text-sm font-medium text-gray-700">
                <span className="flex items-center"><Thermometer className="w-4 h-4 mr-1 text-red-500" /> Temperature (°C)</span>
                <span>{temp}°C</span>
              </label>
              <input type="range" min="0" max="80" value={temp} onChange={(e) => setTemp(Number(e.target.value))} className="w-full accent-emerald-600" />
            </div>

            <div className="space-y-2 pt-4">
              <label className="flex justify-between text-sm font-medium text-gray-700">
                <span className="flex items-center"><Droplet className="w-4 h-4 mr-1 text-blue-500" /> pH Level</span>
                <span>{ph}</span>
              </label>
              <input type="range" min="1" max="14" step="0.5" value={ph} onChange={(e) => setPh(Number(e.target.value))} className="w-full accent-emerald-600" />
            </div>

          </div>
        </div>

        {/* Middle Column: Simulation */}
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
            <Beaker className="w-5 h-5 mr-2 text-emerald-600" />
            Interactive Simulation
          </h2>
          
          <div className="relative bg-slate-100 rounded-xl aspect-video overflow-hidden border-2 border-slate-200 flex-1">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Background gradient for temperature */}
              <rect x="0" y="0" width="400" height="300" fill={temp > 60 ? '#fef2f2' : temp < 10 ? '#f0fdfa' : '#f8fafc'} />
              
              {/* Water Bath */}
              <path d="M 50 100 L 50 280 L 350 280 L 350 100" fill="none" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
              <rect x="54" y={150 - temp*0.5} width="292" height={130 + temp*0.5} fill={temp > 60 ? '#fca5a5' : temp > 30 ? '#fde68a' : '#bae6fd'} opacity="0.4" />
              
              {/* Test Tube */}
              <path d="M 180 60 L 180 250 A 20 20 0 0 0 220 250 L 220 60" fill="none" stroke="#e2e8f0" strokeWidth="4" />
              <path d="M 175 60 L 225 60" fill="none" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
              <path d="M 182 120 L 182 250 A 18 18 0 0 0 218 250 L 218 120 Z" fill={enzyme === 'Amylase' ? '#fef08a' : '#fed7aa'} opacity="0.6" />

              {/* Substrates and Products */}
              {Array.from({ length: 8 }).map((_, i) => {
                const isConverted = i < Math.floor((progress / 100) * 8);
                const x = 190 + (i % 2) * 20;
                const y = 240 - i * 15;
                return (
                  <g key={`sub-${i}`}>
                    <animateTransform attributeName="transform" type="translate" values={`${x},${y}; ${x + (i%2===0?-2:2)},${y-3}; ${x},${y}`} dur={`${2 + (i%3)*0.5}s`} repeatCount="indefinite" />
                    {isConverted ? (
                      <g>
                        <circle cx="-5" cy="0" r="4" fill="#10b981" />
                        <circle cx="5" cy="0" r="4" fill="#10b981" />
                      </g>
                    ) : (
                      <rect x="-8" y="-4" width="16" height="8" rx="3" fill="#3b82f6" />
                    )}
                  </g>
                );
              })}

              {/* Enzyme */}
              <g>
                <animateTransform attributeName="transform" type="translate" values={`0,0; -2,-2; 2,2; 0,0`} dur="3s" repeatCount="indefinite" />
                <g transform={`rotate(${progress*3.6} 200 150)`}>
                  {!isDenatured ? (
                    <path d="M 185 150 A 15 15 0 1 0 215 150 L 200 150 Z" fill="#8b5cf6" />
                  ) : (
                    <path d="M 180 145 Q 190 130 200 140 T 220 135 T 210 160 T 185 165 Z" fill="#9ca3af" />
                  )}
                </g>
              </g>

              {/* Denatured Label */}
              {isDenatured && (
                <text x="200" y="40" textAnchor="middle" fill="#ef4444" fontWeight="bold" fontSize="14">DENATURED</text>
              )}
            </svg>
          </div>

          <div className="flex justify-between items-center mt-4 space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1 font-medium text-gray-500">
                <span>Reaction Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => { setIsRunning(!isRunning); if(progress >= 100) setProgress(0); }} className={`p-2 rounded-full ${isRunning ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {isRunning ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button onClick={() => { setProgress(0); setIsRunning(false); }} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Data & Assessment */}
        <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
            <Save className="w-5 h-5 mr-2 text-emerald-600" />
            Data Logging & Analysis
          </h2>
          
          <button onClick={handleRecord} className="w-full py-2 mb-4 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center">
            <CheckCircle className="w-4 h-4 mr-2" /> Record Current State
          </button>

          <div className="overflow-y-auto max-h-40 mb-6 border rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2">Enzyme</th>
                  <th className="px-3 py-2">Temp</th>
                  <th className="px-3 py-2">pH</th>
                  <th className="px-3 py-2">Rate</th>
                </tr>
              </thead>
              <tbody>
                {dataPoints.map(dp => (
                  <tr key={dp.id} className="border-t">
                    <td className="px-3 py-1 font-medium">{dp.enzyme.substring(0,3)}</td>
                    <td className="px-3 py-1">{dp.temp}°C</td>
                    <td className="px-3 py-1">{dp.ph}</td>
                    <td className="px-3 py-1">{dp.rate}%</td>
                  </tr>
                ))}
                {dataPoints.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-gray-400">No data recorded yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex-1 space-y-4">
            <h3 className="font-bold text-gray-700">Assessment</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">1. What is the optimal temperature (°C) for Amylase?</label>
                <input type="text" value={q1} onChange={(e) => setQ1(e.target.value)} className="w-full border rounded-md px-3 py-1.5 text-sm outline-none focus:border-emerald-500" placeholder="e.g. 37" />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">2. What is the optimal pH for Pepsin?</label>
                <input type="text" value={q2} onChange={(e) => setQ2(e.target.value)} className="w-full border rounded-md px-3 py-1.5 text-sm outline-none focus:border-emerald-500" placeholder="e.g. 2" />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">3. What term describes an enzyme deformed by extreme heat?</label>
                <input type="text" value={q3} onChange={(e) => setQ3(e.target.value)} className="w-full border rounded-md px-3 py-1.5 text-sm outline-none focus:border-emerald-500" placeholder="Term..." />
              </div>
            </div>
            <button onClick={checkAnswers} className="w-full py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors mt-2">
              Check Answers
            </button>
            {feedback && (
              <div className={`p-3 mt-2 rounded-lg text-sm font-medium ${feedback.includes('Excellent') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {feedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
