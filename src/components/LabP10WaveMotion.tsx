import React, { useState, useEffect } from 'react';
import {Play, Pause, Plus, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabP10WaveMotion({ onExit }: LabProps) {
  const [stringType, setStringType] = useState('Cotton');
  const [tension, setTension] = useState(10); // N
  const [frequency, setFrequency] = useState(2); // Hz

  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [cursorX, setCursorX] = useState<number | null>(null);

  const [data, setData] = useState<{ T: number; f: number; L: number }[]>([]);
  const [measuredL, setMeasuredL] = useState('');
  
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const strings: Record<string, number> = {
    Nylon: 0.02,
    Cotton: 0.05,
    Mystery: 0.08
  };

  const mu = strings[stringType];
  const velocity = Math.sqrt(tension / mu);
  const lambda = velocity / frequency;

  useEffect(() => {
    let timer: number;
    if (!isPaused) {
      timer = window.setInterval(() => {
        setTime(t => t + 0.02);
      }, 20); // Smooth 50fps
    }
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleRecord = () => {
    const L = parseFloat(measuredL);
    if (!isNaN(L) && L > 0) {
      setData(prev => [...prev, { T: tension, f: frequency, L: Number(L.toFixed(2)) }]);
      setMeasuredL('');
    }
  };

  const checkAnswer = () => {
    const val = parseFloat(answer);
    if (isNaN(val)) return setFeedback('Enter a number.');
    if (val >= 0.075 && val <= 0.085) {
      setFeedback('Correct! The linear density is approx 0.08 kg/m.');
    } else {
      setFeedback('Incorrect. Remember μ = T / (f·λ)². Try measuring λ more carefully.');
    }
  };

  const renderWave = () => {
    const pts = [];
    for (let i = 0; i <= 400; i += 2) {
      const x = i / 40; // 0 to 10 m
      const y = 150 + 60 * Math.sin(2 * Math.PI * (x / lambda) - 2 * Math.PI * frequency * time);
      pts.push(`${i},${y}`);
    }
    return `M 0,150 L ${pts.join(' L ')}`;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const svgX = (x / rect.width) * 400;
    setCursorX(svgX / 40); // Convert pixel to meters
  };

  const renderGraph = () => {
    // Plot Tension (X) vs v^2 (Y)
    const pts = data.map(d => ({ x: d.T, y: Math.pow(d.f * d.L, 2) }));
    const maxX = 25;
    const maxY = Math.max(500, ...pts.map(p => p.y), 100);

    return (
      <svg viewBox="0 0 300 200" className="w-full h-48 bg-slate-50 border rounded-md shadow-inner mt-4">
        <line x1="40" y1="160" x2="280" y2="160" stroke="#94a3b8" strokeWidth="2" />
        <line x1="40" y1="160" x2="40" y2="20" stroke="#94a3b8" strokeWidth="2" />
        <text x="130" y="190" fontSize="12" fill="#64748b" fontWeight="bold">Tension T (N)</text>
        <text x="-140" y="20" fontSize="12" fill="#64748b" fontWeight="bold" transform="rotate(-90)">Velocity² (m²/s²)</text>
        
        <text x="35" y="165" fontSize="10" fill="#94a3b8" textAnchor="end">0</text>
        <text x="35" y="25" fontSize="10" fill="#94a3b8" textAnchor="end">{maxY.toFixed(0)}</text>
        <text x="280" y="175" fontSize="10" fill="#94a3b8" textAnchor="middle">{maxX}</text>

        {pts.map((p, i) => {
          const cx = 40 + (p.x / maxX) * 240;
          const cy = 160 - (p.y / maxY) * 140;
          return <circle key={i} cx={cx} cy={cy} r="4" fill="#8b5cf6" />;
        })}
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Unit 12: Wave Motion" subtitle="Investigate the relationship between wave speed, tension, and linear density." />

      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {/* Column 1: Setup */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Theory & Setup</h2>
            <p className="text-sm text-slate-600 mb-4">
              The speed <span className="italic">v</span> of a transverse wave on a string depends on the tension <span className="italic">T</span> and the linear mass density <span className="italic">μ</span> (kg/m):
              <br/><span className="font-mono bg-slate-100 p-1 rounded mt-1 inline-block">v = √(T / μ)</span>
            </p>
            <p className="text-sm text-slate-600 mb-4">
              Using the wave equation <span className="font-mono bg-slate-100 p-1 rounded">v = f · λ</span>, you can determine <span className="italic">μ</span> experimentally by measuring the wavelength λ for different frequencies or tensions.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">String Material</label>
              <select
                value={stringType}
                onChange={(e) => setStringType(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Cotton">Cotton (μ = 0.05 kg/m)</option>
                <option value="Nylon">Nylon (μ = 0.02 kg/m)</option>
                <option value="Mystery">Mystery String</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Tension (T): {tension.toFixed(1)} N
              </label>
              <input
                type="range" min="2" max="20" step="0.5"
                value={tension}
                onChange={(e) => setTension(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Oscillator Frequency (f): {frequency.toFixed(1)} Hz
              </label>
              <input
                type="range" min="1" max="5" step="0.1"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
            </div>
          </div>
        </div>

        {/* Column 2: Simulation */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-4 flex flex-col relative overflow-hidden h-[500px] lg:h-auto">
          <div className="flex justify-center gap-4 mb-2 z-10 relative">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-white transition-all ${
                isPaused ? 'bg-green-500 hover:bg-green-600 shadow-md' : 'bg-rose-500 hover:bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
              }`}
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              {isPaused ? 'Resume' : 'Pause & Measure'}
            </button>
          </div>
          <p className="text-center text-slate-400 text-xs mb-2">Pause to measure λ. Hover over grid to see precise position.</p>

          <div className="flex-1 w-full relative border border-slate-700 rounded-lg overflow-hidden bg-slate-950">
            <svg 
              viewBox="0 0 400 300" 
              className="w-full h-full absolute inset-0 cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setCursorX(null)}
            >
              {/* Grid lines (1m spacing) */}
              {Array.from({ length: 11 }).map((_, i) => (
                <g key={i}>
                  <line x1={i * 40} y1="0" x2={i * 40} y2="300" stroke="#334155" strokeWidth="1" />
                  <text x={i * 40 + 4} y="290" fill="#64748b" fontSize="10">{i}m</text>
                </g>
              ))}
              <line x1="0" y1="150" x2="400" y2="150" stroke="#475569" strokeWidth="2" strokeDasharray="5,5" />
              
              <path d={renderWave()} fill="none" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Oscillator */}
              <rect x="-10" y={130 + 60 * Math.sin(-2 * Math.PI * frequency * time)} width="20" height="40" fill="#facc15" rx="4" />
              <circle cx="10" cy={150 + 60 * Math.sin(-2 * Math.PI * frequency * time)} r="5" fill="#ca8a04" />
              
              {/* Hover Cursor */}
              {cursorX !== null && isPaused && (
                <line x1={cursorX * 40} y1="0" x2={cursorX * 40} y2="300" stroke="#fb7185" strokeWidth="2" strokeDasharray="4,2" />
              )}
              {cursorX !== null && isPaused && (
                <rect x={Math.min(cursorX * 40 + 5, 335)} y="10" width="60" height="24" fill="rgba(0,0,0,0.8)" rx="4" />
              )}
              {cursorX !== null && isPaused && (
                <text x={Math.min(cursorX * 40 + 10, 340)} y="27" fill="#fb7185" fontSize="12" fontWeight="bold">
                  x: {cursorX.toFixed(2)}m
                </text>
              )}
            </svg>
          </div>
        </div>

        {/* Column 3: Data & Analysis */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Data Logging</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="number"
                step="0.01"
                placeholder="Measured λ (m)..."
                value={measuredL}
                onChange={(e) => setMeasuredL(e.target.value)}
                className="w-1/2 px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
              />
              <button
                onClick={handleRecord}
                className="w-1/2 flex justify-center items-center gap-2 bg-violet-100 hover:bg-violet-200 text-violet-700 px-2 py-2 rounded-md font-bold transition-colors text-sm"
              >
                <Plus className="w-4 h-4" /> Record Data
              </button>
            </div>
            
            <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-md mb-2">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-2 py-2 font-bold text-slate-700">T (N)</th>
                    <th className="px-2 py-2 font-bold text-slate-700">f (Hz)</th>
                    <th className="px-2 py-2 font-bold text-slate-700">λ (m)</th>
                    <th className="px-2 py-2 font-bold text-slate-700">v² (m²/s²)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.length === 0 ? (
                    <tr><td colSpan={4} className="px-2 py-4 text-center text-slate-400 italic">Measure & log λ data points</td></tr>
                  ) : (
                    data.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-2 py-1 font-mono text-slate-600">{d.T.toFixed(1)}</td>
                        <td className="px-2 py-1 font-mono text-slate-600">{d.f.toFixed(1)}</td>
                        <td className="px-2 py-1 font-mono text-slate-600">{d.L.toFixed(2)}</td>
                        <td className="px-2 py-1 font-mono text-slate-600">{Math.pow(d.f * d.L, 2).toFixed(1)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {renderGraph()}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">Analysis: Mystery String</h3>
            <p className="text-sm text-slate-600 mb-3">
              Calculate the linear mass density <span className="italic">μ</span> of the Mystery String in kg/m.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Calculated μ..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-violet-500 font-mono"
              />
              <button
                onClick={checkAnswer}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md font-bold transition-colors"
              >
                Check
              </button>
            </div>
            {feedback && (
              <div className={`mt-3 p-3 rounded-md text-sm flex items-center gap-2 ${feedback.includes('Correct') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                {feedback.includes('Correct') && <CheckCircle className="w-4 h-4" />}
                {feedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
