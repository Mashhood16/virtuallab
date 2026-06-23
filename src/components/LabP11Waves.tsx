import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, Activity, CheckCircle2, XCircle, Save, Radio, Waves } from 'lucide-react';

export default function LabP11Waves({ onExit }: { onExit?: () => void }) {
  const [mode, setMode] = useState<'doppler' | 'ligo'>('doppler');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Doppler State
  const [sourceVelocity, setSourceVelocity] = useState(30); // m/s
  const [sourceFrequency, setSourceFrequency] = useState(500); // Hz
  const [dopplerLogs, setDopplerLogs] = useState<{id: number, vs: number, fs: number, fo: string}[]>([]);
  const [dopplerAns, setDopplerAns] = useState('');
  const [dopplerStatus, setDopplerStatus] = useState<'idle'|'correct'|'incorrect'>('idle');
  
  // LIGO State
  const [strain, setStrain] = useState(5); // x10^-21
  const [gwFreq, setGwFreq] = useState(50); // Hz
  const [ligoLogs, setLigoLogs] = useState<{id: number, h: number, f: number, dl: string}[]>([]);
  const [ligoAns, setLigoAns] = useState('');
  const [ligoStatus, setLigoStatus] = useState<'idle'|'correct'|'incorrect'>('idle');
  
  const [time, setTime] = useState(0);
  const reqRef = useRef<number>(0);

  useEffect(() => {
    if (isPlaying) {
      let lastTime = performance.now();
      const loop = (t: number) => {
        const dt = (t - lastTime) / 1000;
        lastTime = t;
        setTime(prev => prev + dt);
        reqRef.current = requestAnimationFrame(loop);
      };
      reqRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(reqRef.current);
    }
    return () => cancelAnimationFrame(reqRef.current);
  }, [isPlaying]);

  const checkDoppler = () => {
    if (Math.abs(parseFloat(dopplerAns) - 585) < 5) setDopplerStatus('correct');
    else setDopplerStatus('incorrect');
  };

  const checkLigo = () => {
    if (Math.abs(parseFloat(ligoAns) - 1.6) < 0.1) setLigoStatus('correct');
    else setLigoStatus('incorrect');
  };

  const logDoppler = () => {
    const v = 343;
    const fo = sourceFrequency * (v / (v - sourceVelocity));
    setDopplerLogs(prev => [...prev, { id: Date.now(), vs: sourceVelocity, fs: sourceFrequency, fo: fo.toFixed(1) }]);
  };

  const logLigo = () => {
    const L = 4000;
    const dl = L * (strain * 1e-21);
    setLigoLogs(prev => [...prev, { id: Date.now(), h: strain, f: gwFreq, dl: dl.toExponential(2) }]);
  };

  const renderSimulation = () => {
    if (mode === 'doppler') {
      const vSound = 100;
      const vSourcePx = sourceVelocity * 0.6; 
      const cycleTime = 5; 
      const tCycle = time % cycleTime;
      const emitInterval = 100 / sourceFrequency;

      const circles = [];
      for (let t = tCycle; t >= Math.max(0, tCycle - 3); t -= emitInterval) {
        const age = tCycle - t;
        const radius = age * vSound;
        const cx = 50 + vSourcePx * t;
        circles.push(
          <circle key={t} cx={cx} cy={125} r={radius} stroke="#3b82f6" fill="none" strokeWidth={2} opacity={Math.max(0, 1 - age/3)} />
        );
      }
      
      return (
        <svg viewBox="0 0 400 250" className="w-full h-full bg-slate-900 rounded-lg">
          {circles}
          <rect x={50 + vSourcePx * tCycle - 10} y={115} width={20} height={20} fill="#ef4444" rx={4} />
          <circle cx={350} cy={125} r={8} fill="#10b981" />
          <text x={350} y={145} fill="white" fontSize={12} textAnchor="middle">Observer</text>
        </svg>
      );
    } else {
      const h = strain * 0.05; 
      const omega = 2 * Math.PI * gwFreq * 0.05; 
      const L1 = 100 * (1 + h * Math.sin(omega * time));
      const L2 = 100 * (1 - h * Math.sin(omega * time));
      const intensity = Math.cos(2 * (L1 - L2)) ** 2; 

      return (
        <svg viewBox="0 0 400 250" className="w-full h-full bg-slate-900 rounded-lg">
          {/* Laser source */}
          <rect x={20} y={115} width={30} height={20} fill="#f59e0b" />
          {/* Beams */}
          <line x1={50} y1={125} x2={200} y2={125} stroke="rgba(239,68,68,0.8)" strokeWidth={4} />
          <line x1={200} y1={125} x2={200 + L1} y2={125} stroke="rgba(239,68,68,0.8)" strokeWidth={4} />
          <line x1={200} y1={125} x2={200} y2={125 - L2} stroke="rgba(239,68,68,0.8)" strokeWidth={4} />
          <line x1={200} y1={125} x2={200} y2={220} stroke="rgba(239,68,68,0.8)" strokeWidth={4} />
          {/* Mirrors */}
          <line x1={200 + L1} y1={105} x2={200 + L1} y2={145} stroke="#cbd5e1" strokeWidth={6} />
          <line x1={180} y1={125 - L2} x2={220} y2={125 - L2} stroke="#cbd5e1" strokeWidth={6} />
          {/* Beam Splitter */}
          <line x1={185} y1={110} x2={215} y2={140} stroke="#94a3b8" strokeWidth={4} />
          {/* Detector */}
          <circle cx={200} cy={230} r={15} fill={`rgba(239, 68, 68, ${intensity})`} stroke="#fff" strokeWidth={2} />
        </svg>
      );
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <header className="bg-slate-800 text-white p-4 flex items-center shadow-md">
        <button onClick={onExit} className="mr-4 hover:bg-slate-700 p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Grade 11 Physics: Wave Phenomena</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-grow">
        {/* Theory & Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Radio className="text-blue-500" /> Theory & Setup
          </h2>
          
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            <button 
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${mode === 'doppler' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:bg-slate-200'}`}
              onClick={() => { setMode('doppler'); setIsPlaying(false); }}
            >
              Doppler Effect
            </button>
            <button 
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${mode === 'ligo' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:bg-slate-200'}`}
              onClick={() => { setMode('ligo'); setIsPlaying(false); }}
            >
              LIGO Interferometer
            </button>
          </div>

          <div className="flex-grow space-y-4">
            {mode === 'doppler' ? (
              <>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The Doppler effect is the change in frequency of a wave in relation to an observer who is moving relative to the wave source. 
                  {"$$f' = f \\left(\\frac{v}{v - v_s}\\right)$$"}
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Source Velocity: {sourceVelocity} m/s</label>
                  <input type="range" min="0" max="100" value={sourceVelocity} onChange={(e) => setSourceVelocity(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Source Frequency: {sourceFrequency} Hz</label>
                  <input type="range" min="300" max="800" step="50" value={sourceFrequency} onChange={(e) => setSourceFrequency(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-600 leading-relaxed">
                  LIGO uses a Michelson interferometer to detect gravitational waves. As a wave passes, space itself stretches and compresses, changing the relative lengths of the 4km arms and shifting the interference pattern.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">GW Strain ($h$): {strain} {"$\\times 10^{-21}$"}</label>
                  <input type="range" min="1" max="20" value={strain} onChange={(e) => setStrain(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">GW Frequency: {gwFreq} Hz</label>
                  <input type="range" min="10" max="200" step="10" value={gwFreq} onChange={(e) => setGwFreq(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Simulation */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4 border border-slate-200 lg:col-span-1">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Waves className="text-blue-500" /> Interactive Simulator
            </h2>
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {isPlaying ? <><Pause size={18}/> Pause</> : <><Play size={18}/> Play</>}
            </button>
          </div>
          <div className="flex-grow flex items-center justify-center">
            {renderSimulation()}
          </div>
        </div>

        {/* Assessment & Data */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-500" /> Analysis & Assessment
          </h2>
          
          <div className="space-y-4">
            <button 
              onClick={mode === 'doppler' ? logDoppler : logLigo}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors"
            >
              <Save size={18} /> Record Data Point
            </button>
            
            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 sticky top-0">
                  {mode === 'doppler' ? (
                    <tr><th className="p-2">v_s (m/s)</th><th className="p-2">f_s (Hz)</th><th className="p-2">f_obs (Hz)</th></tr>
                  ) : (
                    <tr><th className="p-2">Strain (x10^-21)</th><th className="p-2">f (Hz)</th><th className="p-2">ΔL (m)</th></tr>
                  )}
                </thead>
                <tbody>
                  {mode === 'doppler' ? dopplerLogs.map(l => (
                    <tr key={l.id} className="border-t border-slate-100"><td className="p-2">{l.vs}</td><td className="p-2">{l.fs}</td><td className="p-2 font-mono">{l.fo}</td></tr>
                  )) : ligoLogs.map(l => (
                    <tr key={l.id} className="border-t border-slate-100"><td className="p-2">{l.h}</td><td className="p-2">{l.f}</td><td className="p-2 font-mono">{l.dl}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2">Knowledge Check</h3>
            {mode === 'doppler' ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">A police car moves towards you at 50 m/s emitting a 500 Hz siren. Speed of sound is 343 m/s. What is the observed frequency? (Hz)</p>
                <div className="flex gap-2">
                  <input type="number" value={dopplerAns} onChange={e => {setDopplerAns(e.target.value); setDopplerStatus('idle');}} className="flex-grow px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 585" />
                  <button onClick={checkDoppler} className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors">Check</button>
                </div>
                {dopplerStatus === 'correct' && <p className="text-green-600 text-sm flex items-center gap-1"><CheckCircle2 size={16}/> Correct!</p>}
                {dopplerStatus === 'incorrect' && <p className="text-red-600 text-sm flex items-center gap-1"><XCircle size={16}/> Incorrect. Try again.</p>}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">A gravitational wave causes a strain of {"$h = 4 \\times 10^{-21}$"}. If the LIGO arms are $L = 4000$ m, what is the change in arm length {"$\\Delta L$"} in meters? (Format: X.X, answer will be in {"$\\times 10^{-17}$"})</p>
                <div className="flex gap-2">
                  <input type="number" value={ligoAns} onChange={e => {setLigoAns(e.target.value); setLigoStatus('idle');}} className="flex-grow px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 1.6" />
                  <span className="self-center font-mono text-sm">e-17</span>
                  <button onClick={checkLigo} className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors">Check</button>
                </div>
                {ligoStatus === 'correct' && <p className="text-green-600 text-sm flex items-center gap-1"><CheckCircle2 size={16}/> Correct!</p>}
                {ligoStatus === 'incorrect' && <p className="text-red-600 text-sm flex items-center gap-1"><XCircle size={16}/> Incorrect. Use $\Delta L = h \times L$.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
