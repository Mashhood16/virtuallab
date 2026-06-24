import { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, Heart, CheckCircle2, RefreshCcw, Stethoscope, LineChart, Table2, Play } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabB12Cardiorespiratory({ onExit }: { onExit?: () => void }) {
  const [activeTab, setActiveTab] = useState<'ecg' | 'cpr'>('ecg');
  
  // ECG State
  const [stressLevel, setStressLevel] = useState(50);
  const [isSimulating, setIsSimulating] = useState(false);
  const [pathData, setPathData] = useState('');
  
  // CPR State
  const [cprActive, setCprActive] = useState(false);
  const [compressions, setCompressions] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [cpmResult, setCpmResult] = useState<number | null>(null);

  // Data & Analysis
  const [dataPoints, setDataPoints] = useState<{ stress: number, hr: number }[]>([]);
  const [calculatedHr, setCalculatedHr] = useState('');
  const [hrStatus, setHrStatus] = useState<boolean | null>(null);

  const timeRef = useRef<number>(0);
  const reqRef = useRef<number>(0);

  // Background Grid for ECG (1 small square = 10px = 0.04s at 250px/s)
  const drawGrid = () => {
    const lines = [];
    for (let i = 0; i <= 300; i += 10) {
      lines.push(<line key={`v${i}`} x1={i} y1="0" x2={i} y2="100" stroke={i % 50 === 0 ? "#fca5a5" : "#fee2e2"} strokeWidth={i % 50 === 0 ? "1.5" : "0.5"} />);
    }
    for (let j = 0; j <= 100; j += 10) {
      lines.push(<line key={`h${j}`} x1="0" y1={j} x2="300" y2={j} stroke={j % 50 === 0 ? "#fca5a5" : "#fee2e2"} strokeWidth={j % 50 === 0 ? "1.5" : "0.5"} />);
    }
    return lines;
  };

  const animateEcg = useCallback(() => {
    timeRef.current += 1.5;
    
    let d = "M 0 50 ";
    // Normal HR (60bpm) -> period ~ 250px. Tachycardia (150bpm) -> period ~ 100px.
    const period = 250 - stressLevel * 1.5;
    
    for (let x = 0; x <= 300; x += 2) {
      const pos = (x + timeRef.current) % period;
      let y = 50;
      
      const noise = (Math.random() - 0.5) * 1.5;

      if (pos < 10) y -= Math.sin((pos / 10) * Math.PI) * 4; // P wave
      else if (pos > 15 && pos < 25) { // QRS complex
        if (pos < 18) y += 5; // Q
        else if (pos < 20) y -= 35; // R
        else if (pos < 22) y += 8; // S
      }
      else if (pos > 40 && pos < 70) y -= Math.sin(((pos - 40) / 30) * Math.PI) * 7; // T wave
      
      d += `L ${x} ${y + noise} `;
    }
    setPathData(d);

    if (isSimulating) {
      reqRef.current = requestAnimationFrame(animateEcg);
    }
  }, [stressLevel, isSimulating]);

  useEffect(() => {
    if (activeTab === 'ecg' && isSimulating) {
      reqRef.current = requestAnimationFrame(animateEcg);
    }
    return () => cancelAnimationFrame(reqRef.current);
  }, [activeTab, isSimulating, animateEcg]);

  // CPR Timer Effect
  useEffect(() => {
    let t: number;
    if (cprActive && timeLeft > 0) {
      t = window.setInterval(() => setTimeLeft(l => l - 1), 1000);
    } else if (timeLeft === 0 && cprActive) {
      setCprActive(false);
      setCpmResult(compressions.length * 6); // extrapolation to 1 minute
    }
    return () => clearInterval(t);
  }, [cprActive, timeLeft, compressions.length]);

  const handleCompress = () => {
    if (!cprActive && timeLeft === 10) setCprActive(true);
    if (timeLeft > 0) {
      setCompressions(prev => [...prev, Date.now()]);
    }
  };

  const resetCpr = () => {
    setCprActive(false);
    setTimeLeft(10);
    setCompressions([]);
    setCpmResult(null);
  };

  const recordData = () => {
    if (activeTab === 'ecg') {
      const actualPeriod = 250 - stressLevel * 1.5;
      const actualHr = 1500 / (actualPeriod / 10);
      setDataPoints(prev => [...prev, { stress: stressLevel, hr: actualHr }]);
    }
  };

  const checkHr = () => {
    if (dataPoints.length === 0) return;
    const latestData = dataPoints[dataPoints.length - 1];
    const actualPeriod = 250 - latestData.stress * 1.5;
    const actualHr = 1500 / (actualPeriod / 10);
    
    const userHr = parseFloat(calculatedHr);
    if (!isNaN(userHr) && Math.abs(userHr - actualHr) < 5) {
      setHrStatus(true);
    } else {
      setHrStatus(false);
    }
  };

  const maxStress = 100;
  const maxHr = Math.max(200, ...dataPoints.map(d => d.hr)) || 200;

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Lab B12.2: Cardiorespiratory Systems" subtitle="Medical Diagnostics & Resuscitation Training" />

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
        {/* Left Column: Theory */}
        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <Stethoscope className="w-5 h-5 text-red-600"/> Theory & Context
          </h2>
          <div className="prose text-slate-700 text-sm flex flex-col gap-3">
            <p><strong>Electrocardiogram (ECG):</strong> A recording of the electrical activity of the heart over time. Key components include the P wave (atrial depolarization), QRS complex (ventricular depolarization), and T wave (ventricular repolarization).</p>
            <p><strong>Heart Rate Calculation:</strong> Standard ECG paper moves at 25 mm/s. Each small square is 1 mm (0.04 seconds). Heart Rate (bpm) can be calculated by dividing 1500 by the number of small squares between two consecutive R peaks (the R-R interval).</p>
            <p><strong>Cardiopulmonary Resuscitation (CPR):</strong> An emergency life-saving procedure performed when the heart stops beating. The optimal chest compression rate is 100 to 120 compressions per minute (CPM), allowing adequate cardiac output and perfusion.</p>
            <div className="bg-red-50 p-3 rounded-lg border border-red-100 mt-2">
              <h3 className="font-semibold text-red-800 text-sm mb-1">Key Objectives:</h3>
              <ul className="list-disc pl-4 text-red-900 text-xs flex flex-col gap-1">
                <li>Read an ECG trace to determine R-R intervals.</li>
                <li>Calculate exact heart rate mathematically from grid measurements.</li>
                <li>Practice maintaining physiological compression rates in CPR.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Middle Column: Simulator */}
        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
          <h2 className="text-xl font-bold flex items-center gap-2 w-full text-left mb-4 text-slate-800">
            <Activity className="w-5 h-5 text-red-600"/> Interactive Simulator
          </h2>
          
          <div className="flex gap-2 w-full mb-6">
            <button onClick={() => { setActiveTab('ecg'); setIsSimulating(false); }} className={`flex-1 py-2 rounded-lg font-medium transition-colors ${activeTab === 'ecg' ? 'bg-red-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>ECG Diagnostic</button>
            <button onClick={() => { setActiveTab('cpr'); setIsSimulating(false); }} className={`flex-1 py-2 rounded-lg font-medium transition-colors ${activeTab === 'cpr' ? 'bg-orange-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>CPR Training</button>
          </div>

          {activeTab === 'ecg' ? (
            <div className="w-full flex flex-col items-center gap-4">
              <div className="w-full bg-slate-50 p-4 rounded-lg border border-slate-100 mb-2">
                <label className="flex justify-between text-sm font-semibold mb-2 text-slate-700">
                  <span className="flex items-center gap-1"><Heart className="w-4 h-4"/> Patient Stress Level</span>
                  <span className="text-red-600">{stressLevel}%</span>
                </label>
                <input type="range" min="0" max="100" value={stressLevel} onChange={e => setStressLevel(Number(e.target.value))} className="w-full accent-red-600 cursor-pointer" />
              </div>

              {/* ECG Visualization */}
              <div className="relative w-full h-48 bg-slate-50 border-2 border-red-200 rounded overflow-hidden">
                <svg viewBox="0 0 300 100" className="w-full h-full">
                  {drawGrid()}
                  {isSimulating && <path d={pathData} fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" />}
                </svg>
                {!isSimulating && (
                   <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm">
                     <span className="text-sm font-semibold text-slate-500">Monitor Offline</span>
                   </div>
                )}
              </div>
              <p className="text-xs text-slate-500 italic text-center w-full">Note: 1 small grid square = 0.04s. Speed = 25mm/s.</p>

              <div className="grid grid-cols-1 gap-3 w-full mt-2">
                <button onClick={() => setIsSimulating(!isSimulating)} className={`flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-colors ${isSimulating ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                  {isSimulating ? <><RefreshCcw className="w-4 h-4"/> Pause Monitor</> : <><Play className="w-4 h-4"/> Start Monitor</>}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-6">
               <div className="relative w-40 h-40 mt-4">
                 <div className={`absolute inset-0 rounded-full bg-orange-100 flex items-center justify-center border-4 ${cprActive ? 'border-orange-500' : 'border-slate-300'} transition-all`}>
                    <Heart className={`w-16 h-16 ${cprActive ? 'text-orange-600 animate-pulse' : 'text-slate-400'}`} />
                 </div>
               </div>

               <div className="w-full grid grid-cols-2 gap-3 text-sm">
                <div className="flex flex-col bg-orange-50 p-3 rounded border border-orange-100 text-center">
                  <span className="text-orange-700 font-semibold text-xs uppercase">Time Remaining</span>
                  <span className="font-mono font-bold text-2xl text-orange-900">{timeLeft} s</span>
                </div>
                <div className="flex flex-col bg-slate-50 p-3 rounded border border-slate-200 text-center">
                  <span className="text-slate-500 font-semibold text-xs uppercase">Compressions</span>
                  <span className="font-mono font-bold text-2xl text-slate-800">{compressions.length}</span>
                </div>
              </div>

              {cpmResult !== null && (
                 <div className={`w-full p-4 rounded-lg border text-center font-semibold ${cpmResult >= 100 && cpmResult <= 120 ? 'bg-green-100 border-green-300 text-green-800' : 'bg-red-100 border-red-300 text-red-800'}`}>
                    Result: {cpmResult} CPM
                    <p className="text-xs mt-1">{cpmResult >= 100 && cpmResult <= 120 ? 'Optimal Rate achieved!' : 'Rate must be between 100-120 CPM.'}</p>
                 </div>
              )}

              <div className="grid grid-cols-2 gap-3 w-full mt-2">
                <button 
                  onClick={handleCompress} 
                  disabled={timeLeft === 0}
                  className="col-span-2 flex items-center justify-center gap-2 bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 active:bg-orange-800 active:scale-95 transition-all font-bold text-xl disabled:opacity-50"
                >
                  <Activity className="w-6 h-6"/> {cprActive ? 'COMPRESS!' : 'START CPR'}
                </button>
                <button onClick={resetCpr} className="col-span-2 flex items-center justify-center gap-1 bg-slate-200 text-slate-700 p-3 rounded-lg hover:bg-slate-300 font-medium transition-colors">
                  <RefreshCcw className="w-4 h-4"/> Reset Drill
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Assessment */}
        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <LineChart className="w-5 h-5 text-red-600"/> Data & Analysis
          </h2>
          
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
             <span className="text-sm text-slate-600 font-medium flex items-center gap-2"><Table2 className="w-4 h-4"/> Data Logger (ECG)</span>
             <button onClick={recordData} disabled={activeTab !== 'ecg' || !isSimulating} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
               Log Patient Data
             </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-40">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                <tr>
                  <th className="px-4 py-2 border-b">Trial</th>
                  <th className="px-4 py-2 border-b">Stress (%)</th>
                  <th className="px-4 py-2 border-b">HR (bpm)</th>
                </tr>
              </thead>
              <tbody>
                {dataPoints.map((dp, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium">{i + 1}</td>
                    <td className="px-4 py-2">{dp.stress}</td>
                    <td className="px-4 py-2">{Math.round(dp.hr)}</td>
                  </tr>
                ))}
                {dataPoints.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-center text-slate-400 italic">No ECG data recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* SVG Graph */}
          <div className="w-full h-48 bg-slate-50 rounded-lg relative border border-slate-200 mt-2">
            <h3 className="absolute top-2 left-2 text-xs font-semibold text-slate-500">Heart Rate vs Stress Level</h3>
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible p-6">
              <line x1="0" y1="100" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1"/>
              <line x1="0" y1="100" x2="0" y2="0" stroke="#94a3b8" strokeWidth="1"/>
              
              {dataPoints.length > 1 && (
                <polyline 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="1.5" 
                  points={dataPoints.map(dp => `${(dp.stress / maxStress) * 100},${100 - (dp.hr / maxHr) * 100}`).join(' ')} 
                />
              )}
              
              {dataPoints.map((dp, i) => (
                <circle key={i} cx={(dp.stress / maxStress) * 100} cy={100 - (dp.hr / maxHr) * 100} r="2.5" fill="#1e293b" />
              ))}
            </svg>
            <span className="absolute bottom-1 right-2 text-[10px] text-slate-400">Stress (%)</span>
            <span className="absolute top-2 left-1 text-[10px] text-slate-400 -rotate-90 origin-left">HR (bpm)</span>
          </div>

          {/* Assessment Section */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-2">
            <h3 className="font-bold text-red-900 text-sm mb-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Clinical Assessment</h3>
            <p className="text-xs text-red-800 mb-3 leading-relaxed">
              Based on the currently simulating ECG, count the small squares between two R peaks and calculate the exact Heart Rate.
              <br/>
              <span className="font-mono bg-red-100 px-1 rounded block mt-1">HR = 1500 / (number of small squares)</span>
            </p>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Enter calculated HR..." 
                value={calculatedHr} 
                onChange={e => { setCalculatedHr(e.target.value); setHrStatus(null); }}
                className="flex-1 px-3 py-2 text-sm border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                disabled={dataPoints.length === 0}
              />
              <button 
                onClick={checkHr} 
                disabled={dataPoints.length === 0}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Verify
              </button>
            </div>
            {hrStatus !== null && (
              <div className={`mt-3 text-sm font-medium p-2 rounded ${hrStatus ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                {hrStatus ? 'Correct! Accurate diagnosis.' : 'Incorrect. Check your R-R interval measurement.'}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
