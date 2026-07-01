import { useState, useRef, useEffect, useMemo } from 'react';
import { Car, Waves, Activity, CheckCircle, XCircle, Volume2 } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP12SHM({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [scenario] = useState<'damping' | 'waves'>('damping');

 // Damping State
 const [mass, setMass] = useState<number>(1000); // kg
 const [springK, setSpringK] = useState<number>(40000); // N/m
 const [dampingC, setDampingC] = useState<number>(2000); // Ns/m
 const [bumpTrigger, setBumpTrigger] = useState<number>(0);
 const [dampingAns, setDampingAns] = useState('');
 const [dampingStatus, setDampingStatus] = useState<'idle'|'correct'|'incorrect'>('idle');

 // Waves State
 const [frequency, setFrequency] = useState<number>(100); // Hz
 const L = 1.0; // m
 const v_sound = 340; // m/s
 const [waveAns, setWaveAns] = useState('');
 const [waveStatus, setWaveStatus] = useState<'idle'|'correct'|'incorrect'>('idle');

 const checkDamping = () => {
 const val = parseFloat(dampingAns);
 // critical damping c = 2 * sqrt(m*k)
 // for m=1000, k=40000 -> c = 2*sqrt(4e7) = 2*6324.5 = 12649
 if (!isNaN(val) && val >= 12600 && val <= 12700) setDampingStatus('correct');
 else setDampingStatus('incorrect');
 };

 const checkWave = () => {
 const val = parseFloat(waveAns);
 // f3 = 3 * 340 / (2 * 1.0) = 510 Hz
 if (!isNaN(val) && val === 510) setWaveStatus('correct');
 else setWaveStatus('incorrect');
 };

 // Damping Simulation Animation Loop
 const [displacement, setDisplacement] = useState<number>(0);
 const simRef = useRef({ y: 0, v: 0, lastTime: 0 });
 const reqRef = useRef<number>(0);

 useEffect(() => {
 if (scenario !== 'damping') return;
 
 // trigger bump
 simRef.current.v = -2; // initial velocity kick upward
 simRef.current.y = 0;
 simRef.current.lastTime = performance.now();

 const animate = (time: number) => {
  const dt = Math.min((time - simRef.current.lastTime) / 1000, 0.05);
  simRef.current.lastTime = time;

  // m * a + c * v + k * y = 0
  // a = -(c * v + k * y) / m
  const a = -(dampingC * simRef.current.v + springK * simRef.current.y) / mass;
  
  simRef.current.v += a * dt;
  simRef.current.y += simRef.current.v * dt;

  setDisplacement(simRef.current.y);
  reqRef.current = requestAnimationFrame(animate);
 };
 
 reqRef.current = requestAnimationFrame(animate);
 return () => cancelAnimationFrame(reqRef.current);
 }, [bumpTrigger, mass, springK, dampingC, scenario]);

 // Flames Simulation
 const numHoles = 50;
 const [timeState, setTimeState] = useState(0);
 
 useEffect(() => {
 if (scenario !== 'waves') return;
 const interval = setInterval(() => {
  setTimeState(t => t + 0.05);
 }, 50);
 return () => clearInterval(interval);
 }, [scenario]);

 const flames = useMemo(() => {
 // Check resonance
 // n = f * 2L / v
 const nExact = (frequency * 2 * L) / v_sound;
 const nearestN = Math.round(nExact);
 const detuning = Math.abs(nExact - nearestN); // 0 at resonance
 
 // Resonance amplification
 const amplitude = detuning < 0.1 ? 40 : (detuning < 0.2 ? 20 : 5);
 const k = (2 * Math.PI * frequency) / v_sound;

 return Array.from({length: numHoles}).map((_, i) => {
  const x = (i / (numHoles - 1)) * L;
  // Standing wave equation: y = A * sin(kx) * cos(wt) + noise
  const standing = amplitude * Math.abs(Math.sin(k * x) * Math.cos(frequency * timeState * 0.1));
  const noise = Math.random() * 5 + 2;
  return Math.max(standing + noise, 5); // min flame height 5
 });
 }, [frequency, timeState]);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Oscillations & Waves" />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >Lab</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 lg:flex-1 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
  
  {/* Left Column: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-4 lg:overflow-y-auto  ? 'flex' : 'hidden'} lg:flex`}>
   {scenario === 'damping' ? (
   <>
    <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
    <Car className="text-blue-600"/> Damped Harmonic Motion
    </h2>
    <div className="text-slate-600 dark:text-[#a1a1aa] space-y-4">
    <p>
     A car suspension system uses springs and shock absorbers (dampers) to isolate the vehicle from road bumps.
    </p>
    <p>
     Without dampers, the car would bounce endlessly (Simple Harmonic Motion). Dampers dissipate energy, usually as heat, reducing the amplitude over time.
    </p>
    <div className={`bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
     <h3 className="font-semibold text-blue-900 mb-2 dark:text-[#ffffff]">Critical Damping</h3>
     <p className="font-mono text-center text-blue-800 dark:text-[#ffffff]">c_c = 2√(mk)</p>
     <ul className="text-sm text-blue-800 mt-2 list-disc pl-5 dark:text-[#ffffff]">
     <li><strong>Underdamped (c &lt; c_c):</strong> System oscillates with decreasing amplitude.</li>
     <li><strong>Critically Damped (c = c_c):</strong> System returns to equilibrium as fast as possible without oscillating. Ideal for cars!</li>
     <li><strong>Overdamped (c &gt; c_c):</strong> System returns to equilibrium slowly without oscillating.</li>
     </ul>
    </div>
    </div>
   </>
   ) : (
   <>
    <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
    <Waves className="text-red-500"/> Standing Waves
    </h2>
    <div className="text-slate-600 dark:text-[#a1a1aa] space-y-4">
    <p>
     When two identical waves traveling in opposite directions interfere, they can form a <strong>Standing Wave</strong>.
    </p>
    <p>
     A <strong>Rubens Tube</strong> is a pipe filled with flammable gas, with holes drilled along its top. A speaker at one end creates sound waves. When driven at resonant frequencies, standing pressure waves form inside.
    </p>
    <div className={`bg-red-50 p-4 rounded-lg border border-red-100 flex-col `}>
     <h3 className="font-semibold text-red-900 mb-2">Resonance Condition (Closed Tube)</h3>
     <p className="font-mono text-center text-red-800">f_n = n · v / (2L)</p>
     <p className="text-sm text-red-800 mt-2">
     Where <em>n</em> is an integer (1, 2, 3...), <em>v</em> is the speed of sound (~340 m/s), and <em>L</em> is the tube length. At resonance, gas flows faster at pressure antinodes, creating taller flames!
     </p>
    </div>
    </div>
   </>
   )}
  </div>

  {/* Middle Column: Simulation */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2 w-full">
   {scenario === 'damping' ? <Car className="text-indigo-500"/> : <Volume2 className="text-indigo-500"/>}
   Interactive Visualizer
   </h2>
   
   <div className={`w-full aspect-square max-w-md bg-[#000000] dark:bg-[#121212] rounded-xl relative overflow- flex flex-col items-center justify-end border-4 border-[#1c1b1b] dark:border-[#1c1b1b] shadow-inner pb-10 `}>
   {scenario === 'damping' ? (
    <div className="relative w-full h-full flex justify-center items-center">
    {/* Reference line */}
    <div className="absolute top-1/2 w-full border-t border-dashed border-slate-600 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t"></div>
    
    {/* Mass (Car Chassis) */}
    <div 
     className="w-32 h-16 bg-blue-500 rounded-t-xl absolute flex items-center justify-center shadow-lg border-2 border-blue-400 dark:bg-teal-950/20 dark:border-teal-900"
     style={{ transform: `translateY(${displacement * 50}px)` }} // Scale displacement
    >
     <span className="text-white font-bold">{mass} kg</span>
    </div>

    {/* Spring/Damper */}
    <div 
     className="w-4 bg-slate-400 dark:bg-[#121212] absolute left-[calc(50%-2rem)]"
     style={{ 
     bottom: '20%', 
     height: `${50 - displacement * 50}px`,
     transition: 'none'
     }}
    />
    <div 
     className="w-4 bg-orange-400 absolute left-[calc(50%+1rem)]"
     style={{ 
     bottom: '20%', 
     height: `${50 - displacement * 50}px`,
     transition: 'none'
     }}
    />
    
    {/* Ground Wheel */}
    <div className="absolute bottom-[10%] w-64 h-2 bg-slate-700 dark:bg-[#121212] rounded"></div>
    
    {/* Control Panel overlay */}
    <div className="absolute top-4 right-4 flex flex-col gap-2">
     <button 
     onClick={() => setBumpTrigger(t => t + 1)}
     className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"
     >
     HIT BUMP!
     </button>
    </div>
    </div>
   ) : (
    <div className="relative w-full h-full flex flex-col justify-end items-center px-4 pb-12">
    {/* Flames */}
    <div className="flex w-full items-end justify-between px-2 h-40">
     {flames.map((h, i) => (
     <div 
      key={i} 
      className="w-1 bg-gradient-to-t from-blue-500 via-orange-500 to-yellow-300 rounded-t"
      style={{ height: `${h}px`, opacity: 0.9 }}
     />
     ))}
    </div>
    {/* Tube */}
    <div className="w-full h-6 bg-slate-400 dark:bg-[#121212] rounded-sm border-2 border-slate-500 dark:border-[#1c1b1b] relative flex items-center">
     <div className="absolute left-[-10px] w-4 h-8 bg-[#121212] dark:bg-[#121212] rounded-l" /> {/* Speaker */}
     <div className="absolute right-[-10px] w-2 h-8 bg-slate-600 dark:bg-[#121212]" /> {/* Closed end */}
     <span className="text-xs font-bold text-slate-800 dark:text-[#ffffff] w-full text-center">L = 1.0 m</span>
    </div>
    </div>
   )}
   </div>

   <div className="w-full mt-6 space-y-4">
   {scenario === 'damping' ? (
    <>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">Mass (m)</label>
     <span className="text-sm font-mono text-indigo-600">{mass} kg</span>
     </div>
     <input 
     type="range" min="500" max="2000" step="50" 
     value={mass} onChange={(e) => setMass(parseFloat(e.target.value))}
     className="w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-indigo-600"
     />
    </div>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">Spring Constant (k)</label>
     <span className="text-sm font-mono text-indigo-600">{springK} N/m</span>
     </div>
     <input 
     type="range" min="10000" max="100000" step="1000" 
     value={springK} onChange={(e) => setSpringK(parseFloat(e.target.value))}
     className="w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-indigo-600"
     />
    </div>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">Damping (c)</label>
     <span className="text-sm font-mono text-indigo-600">{dampingC} Ns/m</span>
     </div>
     <input 
     type="range" min="0" max="30000" step="100" 
     value={dampingC} onChange={(e) => setDampingC(parseFloat(e.target.value))}
     className="w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-indigo-600"
     />
    </div>
    </>
   ) : (
    <>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">Speaker Frequency (f)</label>
     <span className="text-sm font-mono text-red-600">{frequency} Hz</span>
     </div>
     <input 
     type="range" 
     min="50" max="1000" step="1" 
     value={frequency} 
     onChange={(e) => setFrequency(parseFloat(e.target.value))}
     className="w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-red-600"
     />
    </div>
    </>
   )}
   </div>
  </div>

  {/* Right Column: Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-6 lg:overflow-y-auto `}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <Activity className="text-emerald-500" />
   Engineering Tasks
   </h2>

   <div className="space-y-6">
   {scenario === 'damping' ? (
    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Tune the Suspension</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
     A car has a mass of <strong>1000 kg</strong> and a combined spring constant of <strong>40,000 N/m</strong>.
     Calculate the exact damping coefficient <em>c</em> required for <strong>Critical Damping</strong>.
    </p>
    <div className="flex gap-2">
     <input 
     type="text" 
     value={dampingAns}
     onChange={(e) => setDampingAns(e.target.value)}
     placeholder="e.g. 12000"
     className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
     />
     <button 
     onClick={checkDamping}
     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
     >
     Check
     </button>
    </div>
    {dampingStatus === 'correct' && (
     <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1">
     <CheckCircle size={16}/> Correct! c ≈ 12,649 Ns/m. Try setting this in the simulator and hit the bump!
     </p>
    )}
    {dampingStatus === 'incorrect' && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><XCircle size={16}/> Try again. Use c = 2√(mk).</p>}
    </div>
   ) : (
    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Find the Harmonic</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
     For a closed tube of length L = 1.0 m, calculate the frequency required to generate the <strong>3rd Harmonic (n=3)</strong> standing wave. Assume the speed of sound v = 340 m/s.
    </p>
    <div className="flex gap-2">
     <input 
     type="text" 
     value={waveAns}
     onChange={(e) => setWaveAns(e.target.value)}
     placeholder="e.g. 400"
     className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
     />
     <button 
     onClick={checkWave}
     className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"
     >
     Check
     </button>
    </div>
    {waveStatus === 'correct' && (
     <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1">
     <CheckCircle size={16}/> Correct! f = 510 Hz. Set the simulator to 510 Hz to see the 3 antinodes!
     </p>
    )}
    {waveStatus === 'incorrect' && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><XCircle size={16}/> Try again. f_n = n(v/2L).</p>}
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
