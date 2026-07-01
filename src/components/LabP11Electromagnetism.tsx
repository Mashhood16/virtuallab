import { useState, useEffect, useRef } from 'react';
import { Play, Pause, CheckCircle2, XCircle, Save, Target, Activity } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP11Electromagnetism({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [mode, setMode] = useState<'velocity' | 'seismometer'>('velocity');
 const [isPlaying, setIsPlaying] = useState(false);
 const [time, setTime] = useState(0);
 const reqRef = useRef<number>(0);
 
 // Velocity Selector State
 const [eField, setEField] = useState(4); // kV/m
 const [bField, setBField] = useState(2); // mT
 const [velocity, setVelocity] = useState(2); // x10^6 m/s
 const [velLogs, setVelLogs] = useState<{id: number, e: number, b: number, v: number, undeflected: string}[]>([]);
 const [velAns, setVelAns] = useState('');
 const [velStatus, setVelStatus] = useState<'idle'|'correct'|'incorrect'>('idle');
 
 // Seismometer State
 const [shakeFreq, setShakeFreq] = useState(2); // Hz
 const [amplitude, setAmplitude] = useState(20); // mm
 const [seisLogs, setSeisLogs] = useState<{id: number, f: number, a: number, emf: string}[]>([]);
 const [seisAns, setSeisAns] = useState('');
 const [seisStatus, setSeisStatus] = useState<'idle'|'correct'|'incorrect'>('idle');

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

 const checkVelocity = () => {
 if (Math.abs(parseFloat(velAns) - 2) < 0.1) setVelStatus('correct');
 else setVelStatus('incorrect');
 };

 const checkSeismometer = () => {
 if (Math.abs(parseFloat(seisAns) - 100) < 1) setSeisStatus('correct');
 else setSeisStatus('incorrect');
 };

 const logVelocity = () => {
 const isUndeflected = Math.abs(eField - velocity * bField) < 0.1 ? 'Yes' : 'No';
 setVelLogs(prev => [...prev, { id: Date.now(), e: eField, b: bField, v: velocity, undeflected: isUndeflected }]);
 };

 const logSeismometer = () => {
 const peakEmf = 0.5 * (amplitude * 2 * Math.PI * shakeFreq);
 setSeisLogs(prev => [...prev, { id: Date.now(), f: shakeFreq, a: amplitude, emf: peakEmf.toFixed(1) }]);
 };

 const renderSimulation = () => {
 if (mode === 'velocity') {
  const c = 0.05; // curvature scale
  let pathData = `M 0 125 `;
  for (let x = 0; x <= 400; x += 5) {
   const y = 125 + c * (eField - velocity * bField) * (x/velocity) * (x/velocity); 
   pathData += `L ${x} ${Math.max(15, Math.min(235, y))} `;
  }
  
  const particleX = isPlaying ? (time * velocity * 80) % 450 : 0;
  const particleY = 125 + c * (eField - velocity * bField) * (particleX/velocity) * (particleX/velocity);
  const renderY = Math.max(15, Math.min(235, particleY));

  return (
  <svg viewBox="0 0 400 250" className="w-full h-full bg-[#000000] dark:bg-[#121212] rounded-lg">
   {/* Plates */}
   <rect x="0" y="5" width="400" height="10" fill="#ef4444" opacity={0.6} />
   <rect x="0" y="235" width="400" height="10" fill="#3b82f6" opacity={0.6} />
   
   {/* B field array */}
   {Array.from({length: 40}).map((_, i) => (
   <circle key={i} cx={20 + (i%10)*40} cy={40 + Math.floor(i/10)*50} r="3" fill="#94a3b8" />
   ))}
   
   <path d={pathData} stroke="rgba(234, 179, 8, 0.4)" strokeWidth={2} strokeDasharray="4 4" fill="none" />
   <circle cx={particleX} cy={renderY} r={6} fill="#fbbf24" />
   {particleY <= 15 || particleY >= 235 ? (
   <circle cx={particleX} cy={renderY} r={12} fill="red" opacity={0.5} className="animate-ping" />
   ) : null}
   <text x="200" y="25" fill="white" fontSize="12" textAnchor="middle">Positive Plate (+)</text>
  </svg>
  );
 } else {
  const magY = 125 + amplitude * Math.sin(2 * Math.PI * shakeFreq * (isPlaying ? time : 0));
  const v_mag = amplitude * 2 * Math.PI * shakeFreq * Math.cos(2 * Math.PI * shakeFreq * (isPlaying ? time : 0));
  const currentEmf = 0.5 * v_mag;

  const graphData = `M 200 125 ` + Array.from({length: 180}).map((_, i) => {
   const t_past = (isPlaying ? time : 0) - (180 - i) * 0.02;
   const v_past = amplitude * 2 * Math.PI * shakeFreq * Math.cos(2 * Math.PI * shakeFreq * t_past);
   const emf_past = 0.5 * v_past;
   return `L ${200 + i} ${125 - emf_past}`;
  }).join(' ');

  return (
  <svg viewBox="0 0 400 250" className="w-full h-full bg-[#000000] dark:bg-[#121212] rounded-lg">
   {/* Spring */}
   <path d={`M 100 0 Q 80 ${magY/4} 100 ${magY/2} Q 120 ${3*magY/4} 100 ${magY}`} fill="none" stroke="#94a3b8" strokeWidth={3} />
   
   {/* Magnet */}
   <rect x="80" y={magY} width="40" height="20" fill="#ef4444" />
   <text x="100" y={magY + 14} fill="white" fontSize="10" textAnchor="middle">N</text>
   <rect x="80" y={magY+20} width="40" height="20" fill="#3b82f6" />
   <text x="100" y={magY + 34} fill="white" fontSize="10" textAnchor="middle">S</text>
   
   {/* Coil */}
   <path d="M 60 100 L 140 100 M 60 115 L 140 115 M 60 130 L 140 130 M 60 145 L 140 145" stroke="#f97316" strokeWidth={4} opacity={0.8} />

   {/* Graph axes */}
   <line x1="200" y1="125" x2="380" y2="125" stroke="#475569" strokeWidth={2} />
   <line x1="200" y1="50" x2="200" y2="200" stroke="#475569" strokeWidth={2} />
   
   {/* Graph Data */}
   {isPlaying && <path d={graphData} stroke="#10b981" strokeWidth={2} fill="none" />}
   
   <text x="300" y="40" fill="#10b981" fontSize="14" textAnchor="middle">Induced EMF</text>
   <text x="300" y="230" fill="white" fontSize="12" textAnchor="middle">EMF: {currentEmf.toFixed(1)} V</text>
  </svg>
  );
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Grade 11 Physics: Induction & Fields" />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >Lab</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 flex-grow overflow-y-auto lg:overflow-visible">
  {/* Theory & Controls */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <Target className="text-red-500" /> Theory & Setup
   </h2>
   
   <div className={`flex gap-2 p-1 bg-slate-100 dark:bg-[#121212] rounded-lg flex-col `}>
   <button 
    className={`flex-1 py-2 rounded-md font-medium transition-colors ${mode === 'velocity' ? 'bg-slate-50 dark:bg-[#121212] shadow text-blue-600' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
    onClick={() => { setMode('velocity'); setIsPlaying(false); }}
   >
    Velocity Selector
   </button>
   <button 
    className={`flex-1 py-2 rounded-md font-medium transition-colors ${mode === 'seismometer' ? 'bg-slate-50 dark:bg-[#121212] shadow text-blue-600' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
    onClick={() => { setMode('seismometer'); setIsPlaying(false); }}
   >
    Inductive Seismometer
   </button>
   </div>

   <div className="flex-grow space-y-4">
   {mode === 'velocity' ? (
    <>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] leading-relaxed">
     A velocity selector uses perpendicular electric and magnetic fields. A charged particle passes undeflected only if the electric force equals the magnetic force: $qE = qvB \implies v = E/B$.
    </p>
    <div className="space-y-2">
     <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">E-Field ($E$): {eField} kV/m</label>
     <input type="range" min="1" max="10" value={eField} onChange={(e) => setEField(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    <div className="space-y-2">
     <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">B-Field ($B$): {bField} mT</label>
     <input type="range" min="1" max="10" value={bField} onChange={(e) => setBField(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    <div className="space-y-2">
     <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">Velocity ($v$): {velocity} $\times 10^6$ m/s</label>
     <input type="range" min="0.5" max="10" step="0.5" value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} className="w-full accent-yellow-500" />
    </div>
    </>
   ) : (
    <>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] leading-relaxed">
     According to Faraday's Law, a changing magnetic flux induces an EMF. In a seismometer, ground vibrations move a magnet inside a coil, inducing an EMF proportional to velocity.
     {"$$\\mathcal{E} = -N \\frac{\\Delta \\Phi}{\\Delta t}$$"}
    </p>
    <div className="space-y-2">
     <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">Shake Frequency: {shakeFreq} Hz</label>
     <input type="range" min="0.5" max="5" step="0.5" value={shakeFreq} onChange={(e) => setShakeFreq(Number(e.target.value))} className="w-full accent-red-500" />
    </div>
    <div className="space-y-2">
     <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">Amplitude: {amplitude} mm</label>
     <input type="range" min="10" max="50" value={amplitude} onChange={(e) => setAmplitude(Number(e.target.value))} className="w-full accent-red-500" />
    </div>
    </>
   )}
   </div>
  </div>

  {/* Simulation */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col gap-4 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] lg:col-span-1 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="flex justify-between items-center">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">Live Simulator</h2>
   <button 
    onClick={() => setIsPlaying(!isPlaying)} 
    className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 flex-col `}
   >
    {isPlaying ? <><Pause size={18}/> Pause</> : <><Play size={18}/> Run</>}
   </button>
   </div>
   <div className="flex-grow flex items-center justify-center">
   {renderSimulation()}
   </div>
  </div>

  {/* Assessment & Data */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <Activity className="text-blue-500" /> Analysis & Assessment
   </h2>
   
   <div className="space-y-4">
   <button 
    onClick={mode === 'velocity' ? logVelocity : logSeismometer}
    className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#121212] dark:bg-[#121212] hover:bg-[#000000] dark:bg-[#121212] text-white rounded-lg font-medium transition-colors flex-col `}
   >
    <Save size={18} /> Record Result
   </button>
   
   <div className="max-h-40 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
    <table className="w-full text-sm text-left text-slate-600 dark:text-[#a1a1aa]">
    <thead className="bg-slate-50 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] sticky top-0">
     {mode === 'velocity' ? (
     <tr><th className="p-2">E (kV/m)</th><th className="p-2">B (mT)</th><th className="p-2">v (10^6)</th><th className="p-2">Straight?</th></tr>
     ) : (
     <tr><th className="p-2">Freq (Hz)</th><th className="p-2">Amp (mm)</th><th className="p-2">Peak EMF (V)</th></tr>
     )}
    </thead>
    <tbody>
     {mode === 'velocity' ? velLogs.map(l => (
     <tr key={l.id} className="border-t border-slate-100"><td className="p-2">{l.e}</td><td className="p-2">{l.b}</td><td className="p-2">{l.v}</td><td className={`p-2 font-bold ${l.undeflected === 'Yes' ? 'text-green-600' : 'text-red-600'}`}>{l.undeflected}</td></tr>
     )) : seisLogs.map(l => (
     <tr key={l.id} className="border-t border-slate-100"><td className="p-2">{l.f}</td><td className="p-2">{l.a}</td><td className="p-2 font-mono text-green-600">{l.emf}</td></tr>
     ))}
    </tbody>
    </table>
   </div>
   </div>

   <div className="mt-auto pt-4 border-t border-slate-200 dark:border-[#1c1b1b]">
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Knowledge Check</h3>
   {mode === 'velocity' ? (
    <div className="space-y-3">
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">An electron passes undeflected through crossed fields with {"$E = 4 \\text{ kV/m}$"} and {"$B = 2 \\text{ mT}$"}. What is its velocity? ($\times 10^6$ m/s)</p>
    <div className="flex gap-2">
     <input type="number" step="0.1" value={velAns} onChange={e => {setVelAns(e.target.value); setVelStatus('idle');}} className="flex-grow px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 2" />
     <button onClick={checkVelocity} className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors">Check</button>
    </div>
    {velStatus === 'correct' && <p className="text-green-600 text-sm flex items-center gap-1"><CheckCircle2 size={16}/> Correct! v = E/B.</p>}
    {velStatus === 'incorrect' && <p className="text-red-600 text-sm flex items-center gap-1"><XCircle size={16}/> Incorrect. Try again.</p>}
    </div>
   ) : (
    <div className="space-y-3">
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">A coil of 500 turns experiences a magnetic flux change of 0.02 Wb in 0.1 s. What is the induced EMF magnitude? (V)</p>
    <div className="flex gap-2">
     <input type="number" step="1" value={seisAns} onChange={e => {setSeisAns(e.target.value); setSeisStatus('idle');}} className="flex-grow px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 100" />
     <button onClick={checkSeismometer} className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors">Check</button>
    </div>
    {seisStatus === 'correct' && <p className="text-green-600 text-sm flex items-center gap-1"><CheckCircle2 size={16}/> Correct!</p>}
    {seisStatus === 'incorrect' && <p className="text-red-600 text-sm flex items-center gap-1"><XCircle size={16}/> Incorrect. Use Faraday's Law.</p>}
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
