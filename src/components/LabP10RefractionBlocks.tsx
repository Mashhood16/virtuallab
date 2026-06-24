import { useState } from 'react';
import {Activity } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

const MATERIALS = [
  { id: 'Glass', n: 1.50, color: 'bg-cyan-400/20 border-cyan-300' },
  { id: 'Water', n: 1.33, color: 'bg-blue-400/20 border-blue-300' },
  { id: 'Diamond', n: 2.42, color: 'bg-slate-50/30 border-white' },
  { id: 'Unknown', n: 1.75, color: 'bg-purple-400/20 border-purple-300' }, // Sapphire approx
];

export default function LabP10RefractionBlocks({ onExit }: LabProps) {
  const [material, setMaterial] = useState(MATERIALS[0]);
  const [angle, setAngle] = useState(45); // Angle of incidence
  const [dataPoints, setDataPoints] = useState<{i: number, r: number, sinI: number, sinR: number}[]>([]);
  
  const [answerN, setAnswerN] = useState('');
  const [feedback, setFeedback] = useState('');

  // Add slight noise to angle r to simulate measurement error (0.5 degrees max)
  const [noiseSeed, setNoiseSeed] = useState(Math.random());
  
  const getMeasurementNoise = (i: number) => {
    return Math.sin(i * 5 + noiseSeed) * 0.5; 
  };

  const angleRad = angle * (Math.PI / 180);
  const trueRefractedRad = Math.asin((1.0 / material.n) * Math.sin(angleRad));
  const trueRefractedDeg = trueRefractedRad * (180 / Math.PI);
  
  // Apply noise but don't let r > i (which would break physics here)
  const measuredRefractedDeg = angle === 0 ? 0 : Math.max(0, Math.min(angle, trueRefractedDeg + getMeasurementNoise(angle)));
  const emergentAngle = angle; // Assuming parallel block

  const recordData = () => {
    if (dataPoints.find(p => p.i === angle)) return;
    const sinI = Math.sin(angle * Math.PI / 180);
    const sinR = Math.sin(measuredRefractedDeg * Math.PI / 180);
    setDataPoints(prev => [...prev, {i: angle, r: measuredRefractedDeg, sinI, sinR}].sort((a,b) => a.i - b.i));
  };

  const reset = () => {
    setAngle(45);
    setDataPoints([]);
    setAnswerN('');
    setFeedback('');
    setNoiseSeed(Math.random());
  };

  const checkAnswer = () => {
    const userN = parseFloat(answerN);
    if (isNaN(userN)) {
      setFeedback('Please enter a valid number.');
      return;
    }
    const error = Math.abs((userN - material.n) / material.n) * 100;
    if (error < 5) {
      setFeedback(`Correct! The refractive index is ${material.n.toFixed(2)}.`);
    } else {
      setFeedback(`Incorrect. Check your calculations. (Error: ${error.toFixed(1)}%)`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Unit 14: Refraction & Snell's Law" subtitle="Determine the refractive index by measuring incident and refracted angles." />

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel: Theory & Controls */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Theory: Snell's Law</h2>
            <div className="text-sm text-slate-600 space-y-3">
              <p>When light travels from air (less dense) into a block (more dense), it bends towards the normal.</p>
              <div className="bg-slate-100 p-3 rounded font-mono text-center text-lg text-slate-800 font-bold">
                n₁ sin(i) = n₂ sin(r)
              </div>
              <p>Since air has a refractive index $n_1 \approx 1.0$, the equation simplifies. The refractive index ($n$) of the block is:</p>
              <div className="bg-blue-50 p-2 rounded text-center text-blue-800 font-bold font-mono">
                n = sin(i) / sin(r)
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Setup</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Material</label>
                <div className="grid grid-cols-2 gap-2">
                  {MATERIALS.map(m => (
                    <button 
                      key={m.id}
                      onClick={() => { setMaterial(m); reset(); }}
                      className={`py-2 rounded text-sm font-bold border transition-colors ${material.id === m.id ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                    >
                      {m.id}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between">
                  <span>Angle of Incidence (i)</span>
                  <span className="text-red-600 font-bold">{angle}°</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="85" step="1" 
                  value={angle} 
                  onChange={e => setAngle(Number(e.target.value))} 
                  className="w-full accent-red-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                />
              </div>

              <button 
                onClick={recordData}
                disabled={dataPoints.some(p => p.i === angle)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-lg font-bold transition-colors"
              >
                <Activity className="w-5 h-5" /> Record Angles
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Analysis</h2>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Calculate Refractive Index (n):</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  step="0.01"
                  value={answerN}
                  onChange={e => setAnswerN(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="e.g. 1.50"
                />
                <button onClick={checkAnswer} className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">Check</button>
              </div>
              {feedback && (
                <div className={`p-3 rounded text-sm ${feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {feedback}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Panel: Laser Simulation & Data */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-700 p-6 flex flex-col items-center justify-center relative min-h-[400px] overflow-hidden">
            <h3 className="absolute top-4 left-4 font-bold text-slate-300">Laser Ray Box Simulation</h3>
            
            <div className="relative w-full max-w-lg h-[300px] flex items-center justify-center mt-6">
              
              {/* The Block */}
              <div className={`w-[80%] h-[150px] border-2 rounded-sm backdrop-blur-md z-10 relative flex items-center justify-center ${material.color}`}>
                 <div className="text-white/50 text-xl font-bold tracking-widest uppercase">{material.id}</div>
              </div>

              {/* Normal Lines */}
              <div className="absolute top-0 bottom-1/2 left-1/2 w-px border-l-2 border-dashed border-white/40 z-0" />
              <div className="absolute top-1/2 bottom-0 left-1/2 w-px border-l-2 border-dashed border-white/40 z-0" 
                   style={{ transform: `translateX(${Math.tan(measuredRefractedDeg * Math.PI / 180) * 150}px)` }} />

              {/* Incident Beam */}
              <div className="absolute top-[75px] left-1/2 w-[300px] h-1 bg-red-500 shadow-[0_0_12px_red] origin-right z-20" 
                   style={{ transform: `translate(-100%, -50%) rotate(${angle}deg)` }}>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-white" />
              </div>

              {/* Refracted Beam */}
              <div className="absolute top-[75px] left-1/2 h-1 bg-red-500/80 shadow-[0_0_8px_red] origin-left z-20" 
                   style={{ 
                     width: `${150 / Math.cos(measuredRefractedDeg * Math.PI / 180)}px`,
                     transform: `translateY(-50%) rotate(${90 - measuredRefractedDeg}deg)` 
                   }} />

              {/* Emergent Beam */}
              <div className="absolute top-[225px] h-1 w-[300px] bg-red-500 shadow-[0_0_10px_red] origin-left z-20" 
                   style={{ 
                     left: `calc(50% + ${Math.tan(measuredRefractedDeg * Math.PI / 180) * 150}px)`,
                     transform: `translateY(-50%) rotate(${90 - emergentAngle}deg)` 
                   }}>
                 <div className="absolute left-[50px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-white" />
              </div>

              {/* Angle Labels */}
              <div className="absolute top-10 left-1/2 -translate-x-16 text-red-400 font-bold text-sm bg-black/50 px-2 rounded">i = {angle}°</div>
              <div className="absolute top-[100px] left-1/2 translate-x-4 text-red-300 font-bold text-sm bg-black/50 px-2 rounded">r = {measuredRefractedDeg.toFixed(1)}°</div>

            </div>
          </div>

          <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col flex-1 min-h-[250px]">
            <h3 className="font-bold text-slate-700 mb-4">Experimental Data (Snell's Law Table)</h3>
            <div className="flex-1 border border-slate-200 rounded-lg overflow-y-auto">
              <table className="w-full text-sm text-center">
                <thead className="bg-slate-100 text-slate-600 sticky top-0">
                  <tr>
                    <th className="py-3 px-3 font-medium">Angle of Incidence (i°)</th>
                    <th className="py-3 px-3 font-medium">Angle of Refraction (r°)</th>
                    <th className="py-3 px-3 font-medium">sin(i)</th>
                    <th className="py-3 px-3 font-medium">sin(r)</th>
                    <th className="py-3 px-3 font-medium">n = sin(i)/sin(r)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPoints.map((pt, i) => {
                    const nCalc = pt.sinI === 0 ? 0 : pt.sinI / pt.sinR;
                    return (
                      <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono">{pt.i}</td>
                        <td className="py-2 px-3 font-mono">{pt.r.toFixed(1)}</td>
                        <td className="py-2 px-3 font-mono text-blue-600">{pt.sinI.toFixed(4)}</td>
                        <td className="py-2 px-3 font-mono text-blue-600">{pt.sinR.toFixed(4)}</td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-600">
                          {pt.i === 0 ? '-' : nCalc.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                  {dataPoints.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-slate-400">Adjust the laser angle and click "Record Angles"</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-500 mt-4 text-center">
              Notice that the ratio of <strong>sin(i) / sin(r)</strong> remains constant regardless of the angle! This constant is the refractive index (n).
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
