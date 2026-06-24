import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, Factory, ShieldAlert, FlaskConical } from 'lucide-react';
import LabHeader from './LabHeader';

type IndProcess = 'CementKiln' | 'CatalyticCracking' | 'Cosmetics';

export default function LabC12IndustryMaterials({ onExit }: { onExit?: () => void }) {
  const [process, setProcess] = useState<IndProcess>('CementKiln');
  const [parameter, setParameter] = useState<number>(1450);
  const [time, setTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setTime(t => {
          if (t >= 20) {
            setIsPlaying(false);
            return 20;
          }
          return t + 0.1;
        });
      }, 50);
    } else if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
    setFeedback(null);
    setAnswer('');
  };

  const handleProcessChange = (p: IndProcess) => {
    setProcess(p);
    reset();
    if (p === 'CementKiln') setParameter(1450);
    else if (p === 'CatalyticCracking') setParameter(500);
    else setParameter(5);
  };

  const checkAnswer = () => {
    let correct = false;
    const val = parseFloat(answer);
    if (isNaN(val)) {
      setFeedback('Please enter a valid number.');
      return;
    }

    if (process === 'CementKiln') {
      // rate = (1350-1200)/300 = 0.5. Yield = 10 * 0.5 * 10 = 50.
      if (Math.abs(val - 50) < 0.5) correct = true;
    } else if (process === 'CatalyticCracking') {
      // rate = (550-300)/500 = 0.5. Conversion = 5 * 0.5 * 10 = 25.
      if (Math.abs(val - 25) < 0.5) correct = true;
    } else if (process === 'Cosmetics') {
      // rate = 4/10 = 0.4. Stability = t * 0.4 * 20 = 8t. 100 = 8t => t = 12.5.
      if (Math.abs(val - 12.5) < 0.2) correct = true;
    }
    
    if (correct) {
      setFeedback('Correct! Excellent industrial process analysis.');
    } else {
      setFeedback('Incorrect. Please review the operating parameters and kinetics.');
    }
  };

  const getMetrics = () => {
    if (process === 'CementKiln') {
      const rate = Math.max(0, (parameter - 1200) / 300);
      const yieldAmt = Math.min(100, time * rate * 10);
      return yieldAmt;
    } else if (process === 'CatalyticCracking') {
      const rate = Math.max(0, (parameter - 300) / 500);
      const conversion = Math.min(100, time * rate * 10);
      return conversion;
    } else {
      const rate = parameter / 10;
      const stability = Math.min(100, time * rate * 20);
      return stability;
    }
  };

  const metricValue = getMetrics();

  const renderSimulation = () => {
    if (process === 'CementKiln') {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64 bg-slate-900 rounded-lg shadow-inner">
          <text x="20" y="30" fill="white" className="text-sm">Clinker Yield: {metricValue.toFixed(1)}%</text>
          
          {/* Rotary Kiln Cylinder */}
          <g transform={`rotate(${isPlaying ? (time * 20) % 360 : 0} 200 150)`}>
            <ellipse cx="200" cy="150" rx="140" ry="60" fill="#475569" stroke="#334155" strokeWidth="4" />
            <path d="M 60 150 Q 200 100, 340 150" fill="none" stroke="#64748b" strokeWidth="2" />
          </g>

          {/* Flames based on temp */}
          {parameter >= 1200 && (
            <path d="M 320 180 Q 350 100, 380 180 Z" fill="#ef4444" opacity={(parameter - 1000) / 500} />
          )}
          {parameter >= 1300 && (
            <path d="M 330 180 Q 350 120, 370 180 Z" fill="#f59e0b" opacity={(parameter - 1200) / 300} />
          )}

          {/* Clinker rocks */}
          {Array.from({ length: 15 }).map((_, i) => {
            const isClinker = metricValue > (i / 15) * 100;
            return (
              <circle 
                key={i} 
                cx={100 + i * 15} 
                cy={180 + Math.sin(i) * 10} 
                r={isClinker ? 6 : 8} 
                fill={isClinker ? "#1e293b" : "#cbd5e1"} 
              />
            );
          })}
          {metricValue > 80 && <text x="130" y="250" fill="#22c55e" className="text-sm font-bold">High Quality Clinker Formed!</text>}
        </svg>
      );
    } else if (process === 'CatalyticCracking') {
      const isCracked = metricValue > 50;
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64 bg-slate-900 rounded-lg shadow-inner">
          <text x="20" y="30" fill="white" className="text-sm">Conversion: {metricValue.toFixed(1)}%</text>
          
          {/* Zeolite Catalyst Bed */}
          <rect x="50" y="200" width="300" height="50" fill="#a1a1aa" />
          {[1, 2, 3, 4, 5, 6].map(i => (
            <path key={i} d={`M ${50 + i * 40} 200 L ${70 + i * 40} 250`} stroke="#71717a" strokeWidth="2" />
          ))}

          {/* Molecule */}
          <g transform={`translate(0, ${Math.min(100, time * 10)})`}>
            {/* C12H26 Alkane chain */}
            {!isCracked ? (
              <path d="M 100 100 L 120 80 L 140 100 L 160 80 L 180 100 L 200 80 L 220 100 L 240 80 L 260 100 L 280 80 L 300 100" fill="none" stroke="#f8fafc" strokeWidth="4" />
            ) : (
              <>
                {/* Cracked pieces */}
                <path d="M 80 100 L 100 80 L 120 100 L 140 80" fill="none" stroke="#f8fafc" strokeWidth="4" />
                <path d="M 200 80 L 220 100 L 240 80 L 260 100 L 280 80" fill="none" stroke="#f8fafc" strokeWidth="4" />
              </>
            )}
            
            {/* Heat indicator */}
            {parameter > 600 && <text x="150" y="60" fill="#ef4444" className="text-xs">High Thermal Energy</text>}
          </g>
          
          {isCracked && <text x="120" y="180" fill="#22c55e" className="text-sm font-bold">C-C Bonds Cleaved!</text>}
        </svg>
      );
    } else {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64 bg-slate-900 rounded-lg shadow-inner">
          <text x="20" y="30" fill="white" className="text-sm">Emulsion Stability: {metricValue.toFixed(1)}%</text>
          
          {/* Beaker */}
          <path d="M 120 50 L 120 250 A 20 20 0 0 0 140 270 L 260 270 A 20 20 0 0 0 280 250 L 280 50 Z" fill="none" stroke="#cbd5e1" strokeWidth="4" />
          
          {/* Water Layer */}
          <path d="M 122 150 L 278 150 L 278 250 A 18 18 0 0 1 260 268 L 140 268 A 18 18 0 0 1 122 250 Z" fill="#3b82f6" opacity="0.6" />
          
          {/* Oil Layer -> Micelles */}
          {metricValue < 20 ? (
            <path d="M 122 100 L 278 100 L 278 150 L 122 150 Z" fill="#eab308" opacity="0.8" />
          ) : (
            <>
              {Array.from({ length: 40 }).map((_, i) => {
                const spread = metricValue / 100;
                const cx = 140 + (i * 37) % 120;
                const cy = 130 + (spread * 100 * Math.random());
                const r = Math.max(2, 10 - spread * 6);
                return <circle key={i} cx={cx} cy={Math.min(250, cy)} r={r} fill="#eab308" opacity="0.8" />;
              })}
            </>
          )}

          {metricValue > 90 && <text x="140" y="200" fill="#1e293b" className="text-sm font-bold">Stable Micelles</text>}
        </svg>
      );
    }
  };

  const getSliderConfig = () => {
    if (process === 'CementKiln') return { min: 1000, max: 1500, step: 50, label: 'Temperature (°C)' };
    if (process === 'CatalyticCracking') return { min: 400, max: 800, step: 10, label: 'Temperature (°C)' };
    return { min: 1, max: 10, step: 0.5, label: 'Emulsifier (%)' };
  };
  const config = getSliderConfig();

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      {/* Header */}
      <LabHeader onExit={onExit} title="Interactive Industry Materials Lab" />

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        
        {/* Left Column: Theory & Setup */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 border-b pb-2 flex items-center gap-2">
              <ShieldAlert className="text-slate-500" size={20} />
              Process Theory
            </h2>
            {process === 'CementKiln' && (
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                <strong>Cement Production</strong> requires heating limestone (CaCO₃) and clay in a rotary kiln up to 1450°C. The intense heat causes calcination and fusion, forming solid clinker nodules (mostly tricalcium silicate).
              </p>
            )}
            {process === 'CatalyticCracking' && (
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                <strong>Catalytic Cracking</strong> breaks down large, low-value hydrocarbon molecules into lighter, higher-value products (like gasoline components) using heat and a zeolite catalyst.
              </p>
            )}
            {process === 'Cosmetics' && (
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                <strong>Cosmetics Formulation</strong> relies heavily on creating stable emulsions. Emulsifiers (surfactants) reduce the surface tension between oil and water, forming stable micelles that prevent phase separation.
              </p>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-slate-700 mb-4">Operating Parameters</h3>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {config.label}: {parameter}
            </label>
            <input
              type="range"
              min={config.min}
              max={config.max}
              step={config.step}
              value={parameter}
              onChange={(e) => { setParameter(Number(e.target.value)); reset(); }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600 mb-6"
            />
            
            <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-between border border-slate-200">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Elapsed Time</span>
                <span className="text-2xl font-mono text-slate-800">{time.toFixed(1)} s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Interactive Simulation */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center relative">
          <h2 className="absolute top-6 left-6 text-xl font-bold text-slate-800 flex items-center gap-2">
            <FlaskConical className="text-slate-500" size={20} />
            Plant Simulator
          </h2>
          
          <div className="w-full mt-10">
            {renderSimulation()}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-sm"
            >
              <Play size={18} />
              {isPlaying ? 'Pause' : 'Start Process'}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </div>

        {/* Right Column: Assessment */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-2 border-b pb-2">
            Production Engineering Analysis
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Compute the industrial yields and rates based on the plant simulator's operational data.
          </p>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-6">
            <h3 className="font-semibold text-orange-900 mb-2">Assignment Question</h3>
            {process === 'CementKiln' && (
              <p className="text-sm text-orange-800">
                At a kiln temperature of <strong>1350°C</strong>, what is the exact clinker yield (%) precisely at <strong>t = 10.0 s</strong>? <br/><br/><em>(Rate = (Temp - 1200) / 300. Yield = Rate × time × 10)</em>
              </p>
            )}
            {process === 'CatalyticCracking' && (
              <p className="text-sm text-orange-800">
                At a cracking temperature of <strong>550°C</strong>, calculate the exact % conversion at precisely <strong>t = 5.0 s</strong>. <br/><br/><em>(Rate = (Temp - 300) / 500. Conv = Rate × time × 10)</em>
              </p>
            )}
            {process === 'Cosmetics' && (
              <p className="text-sm text-orange-800">
                With an emulsifier concentration of <strong>4.0%</strong>, at what exact time (in seconds) does the emulsion stability reach <strong>100%</strong>? <br/><br/><em>(Rate = Emulsifier / 10. Stability = Rate × time × 20)</em>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Answer</label>
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter numerical value"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <button
              onClick={checkAnswer}
              className="w-full py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
            >
              Check Answer
            </button>
            
            {feedback && (
              <div className={`p-4 rounded-lg flex items-start gap-3 ${feedback.includes('Correct') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {feedback.includes('Correct') ? <CheckCircle size={20} className="text-green-600 shrink-0" /> : <XCircle size={20} className="text-red-600 shrink-0" />}
                <span className="text-sm font-medium">{feedback}</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
