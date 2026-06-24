import { useState, useMemo } from 'react';
import {Calculator, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP11TranslatoryMotion({ onExit }: { onExit?: () => void }) {
  const [velocity, setVelocity] = useState(30);
  const [angle, setAngle] = useState(45);
  const [drag, setDrag] = useState(0);

  const [rangeGuess, setRangeGuess] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const trajectory = useMemo(() => {
    let x = 0;
    let y = 0;
    let vx = velocity * Math.cos((angle * Math.PI) / 180);
    let vy = velocity * Math.sin((angle * Math.PI) / 180);
    const dt = 0.05;
    const g = 9.81;
    const points = [{ x, y }];

    for (let i = 0; i < 800; i++) {
      const ax = -drag * vx;
      const ay = -g - drag * vy;
      vx += ax * dt;
      vy += ay * dt;
      x += vx * dt;
      y += vy * dt;
      if (y < 0 && i > 5) {
        const tInterp = y / vy;
        x -= vx * tInterp;
        y = 0;
        points.push({ x, y });
        break;
      }
      points.push({ x, y });
    }
    return points;
  }, [velocity, angle, drag]);

  const actualRange = trajectory[trajectory.length - 1].x;
  const maxHeight = Math.max(...trajectory.map(p => p.y));

  const checkAnswer = () => {
    const guess = parseFloat(rangeGuess);
    if (Math.abs(actualRange - guess) < 3) {
      setFeedback('Correct! You accurately calculated or estimated the range.');
    } else {
      setFeedback(`Incorrect. The actual range is ${actualRange.toFixed(1)} m.`);
    }
  };

  const scale = 2; // 2 pixels per meter. Max X = 150m (300px).
  
  // ensure trajectory points fit well or we just draw what we have
  const pathD = trajectory.map((p, i) => `${i === 0 ? 'M' : 'L'} ${20 + p.x * scale} ${280 - p.y * scale}`).join(' ');

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Translatory Motion" />

      <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 gap-4 p-4 min-h-0">
        {/* Theory */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Ballistics & Kinematics</h2>
          <div className="prose prose-sm text-slate-600">
            <p>Projectile motion describes an object in flight under the influence of gravity alone (ideal) or with air resistance (realistic).</p>
            <p>Without drag, the horizontal velocity remains constant, and vertical motion has constant acceleration -g (-9.81 m/s²).</p>
            <p>Air resistance applies a force proportional to velocity, slowing the projectile and altering its optimal launch angle.</p>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              <li>Adjust Launch Velocity and Angle.</li>
              <li>Observe how increasing the drag coefficient (air resistance) limits the range.</li>
            </ul>
          </div>
          
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 flex justify-between">
                <span>Velocity (m/s)</span> <span>{velocity}</span>
              </label>
              <input type="range" min="10" max="40" value={velocity} onChange={e => setVelocity(Number(e.target.value))} className="w-full accent-red-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 flex justify-between">
                <span>Angle (°)</span> <span>{angle}°</span>
              </label>
              <input type="range" min="5" max="85" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full accent-red-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 flex justify-between">
                <span>Air Resistance (k)</span> <span>{drag.toFixed(2)}</span>
              </label>
              <input type="range" min="0" max="0.5" step="0.05" value={drag} onChange={e => setDrag(Number(e.target.value))} className="w-full accent-slate-500" />
            </div>
          </div>
        </div>

        {/* Simulator */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col items-center">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Trajectory Visualizer</h2>
          <svg width="340" height="300" className="bg-blue-50 rounded-lg border border-slate-300 shadow-inner">
            {/* Grid */}
            {[...Array(11)].map((_, i) => (
              <line key={`h${i}`} x1="20" y1={280 - i * 25} x2="340" y2={280 - i * 25} stroke="#e2e8f0" strokeWidth="1" />
            ))}
            {[...Array(11)].map((_, i) => (
              <line key={`v${i}`} x1={20 + i * 30} y1="0" x2={20 + i * 30} y2="280" stroke="#e2e8f0" strokeWidth="1" />
            ))}

            {/* Axes */}
            <line x1="20" y1="0" x2="20" y2="280" stroke="#64748b" strokeWidth="2" />
            <line x1="20" y1="280" x2="340" y2="280" stroke="#64748b" strokeWidth="2" />

            {/* Trajectory */}
            <path d={pathD} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeDasharray={drag > 0 ? "5,5" : "none"} />
            
            {/* Projectile (end point) */}
            <circle cx={20 + actualRange * scale} cy="280" r="5" fill="#991b1b" />
          </svg>
          <div className="mt-4 text-sm text-slate-500 text-center flex gap-4">
            <span>Max Height: {maxHeight.toFixed(1)} m</span>
            <span>Range: {actualRange.toFixed(1)} m</span>
          </div>
        </div>

        {/* Assessment */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-500" />
            Kinematics Assessment
          </h2>
          
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-sm text-slate-700">
            <p><strong>v₀</strong> = {velocity} m/s</p>
            <p><strong>θ</strong> = {angle}°</p>
            <p><strong>k</strong> = {drag}</p>
            <p className="text-xs text-slate-500 mt-2">
              If k=0, use R = (v₀² * sin(2θ)) / g to calculate range. If k&gt;0, make your best estimation based on the visualizer scale.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Horizontal Range (m):
              </label>
              <input
                type="number"
                value={rangeGuess}
                onChange={(e) => setRangeGuess(e.target.value)}
                placeholder="e.g. 50.5"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <button 
              onClick={checkAnswer}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Check Answer
            </button>

            {feedback && (
              <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${feedback.includes('Correct') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {feedback.includes('Correct') ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                <span>{feedback}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
