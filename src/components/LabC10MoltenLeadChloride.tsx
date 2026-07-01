import { useState, useEffect } from 'react';
import { Play, Square, Info, Save, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC10MoltenLeadChloride({ onExit }: { onExit: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [isRunning, setIsRunning] = useState(false);
 const [voltage, setVoltage] = useState(6);
 const [time, setTime] = useState(0); 
 const [massPb, setMassPb] = useState(0); 
 const [volCl2, setVolCl2] = useState(0); 
 const [logs, setLogs] = useState<{id: number, time: number, current: number, massPb: number, volCl2: number}[]>([]);
 
 const [assessmentCurrent, setAssessmentCurrent] = useState(4);
 const [assessmentTime, setAssessmentTime] = useState(45);
 const [userAnswer, setUserAnswer] = useState('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const resistance = 3.0; 
 const F = 96485; 
 const M_Pb = 207.2;
 
 useEffect(() => {
 setAssessmentCurrent(Math.floor(Math.random() * 4) + 2);
 setAssessmentTime(Math.floor(Math.random() * 40) + 20);
 }, []);

 useEffect(() => {
 let timer: number;
 if (isRunning) {
  const current = voltage / resistance;
  const dt = 60; 
  timer = window.setInterval(() => {
  setTime(prev => prev + dt);
  const dMolesE = (current * dt) / F;
  setMassPb(prev => prev + (dMolesE / 2) * M_Pb);
  setVolCl2(prev => prev + (dMolesE / 2) * 24000);
  }, 100);
 }
 return () => clearInterval(timer);
 }, [isRunning, voltage]);

 const current = isRunning ? voltage / resistance : 0;

 const recordData = () => {
 const noiseMass = massPb * (1 + (Math.random() - 0.5) * 0.04);
 const noiseVol = volCl2 * (1 + (Math.random() - 0.5) * 0.04);
 setLogs([...logs, {
  id: Date.now(),
  time: time,
  current: current,
  massPb: Number(noiseMass.toFixed(2)),
  volCl2: Number(noiseVol.toFixed(0))
 }]);
 };

 const checkAnswer = () => {
 const q = assessmentCurrent * assessmentTime * 60;
 const molesE = q / F;
 const correctMass = (molesE / 2) * M_Pb;
 const parsed = parseFloat(userAnswer);
 if (!isNaN(parsed) && Math.abs(parsed - correctMass) < correctMass * 0.05) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 const reset = () => {
 setIsRunning(false);
 setTime(0);
 setMassPb(0);
 setVolCl2(0);
 setLogs([]);
 setVoltage(6);
 setIsCorrect(null);
 setUserAnswer('');
 };

 const svgW = 400;
 const svgH = 500;
 const maxTime = logs.length > 0 ? Math.max(...logs.map(l => l.time), 1000) : 1000;
 const maxMass = logs.length > 0 ? Math.max(...logs.map(l => l.massPb), 1) : 1;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Electrolysis of Molten PbCl₂" />

  
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
  <main className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 overflow-y-auto lg:overflow-visible">
  
  <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div>
   <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
    <Info className="w-5 h-5 text-fuchsia-600" />
    Theory
   </h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-2">
    When lead(II) chloride (PbCl₂) is heated until it melts, the Pb²⁺ and Cl⁻ ions become free to move and carry charge.
   </p>
   <div className={`bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-4 rounded-lg font-mono text-sm mb-2 text-slate-700 dark:text-[#ffffff] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    <div><strong>Cathode (-):</strong> Pb²⁺ + 2e⁻ → Pb(l)</div>
    <div><strong>Anode (+):</strong> 2Cl⁻ → Cl₂(g) + 2e⁻</div>
    <div className="mt-2 text-fuchsia-600 font-bold border-t border-slate-300 dark:border-[#1c1b1b] pt-2">
    Overall: PbCl₂(l) → Pb(l) + Cl₂(g)
    </div>
   </div>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    Silvery liquid lead forms at the cathode and sinks to the bottom. Pale green chlorine gas bubbles off at the anode.
   </p>
   </div>

   <div className="flex-1">
   <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-4">Experiment Setup</h2>
   <div className="space-y-6">
    <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2">
     <span>Power Supply Voltage</span>
     <span>{voltage.toFixed(1)} V</span>
    </label>
    <input
     type="range"
     min="2"
     max="12"
     step="0.5"
     value={voltage}
     onChange={(e) => setVoltage(parseFloat(e.target.value))}
     disabled={isRunning}
     className="w-full accent-fuchsia-600"
    />
    </div>

    <div className="flex gap-4">
    <button
     onClick={() => setIsRunning(!isRunning)}
     className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-colors ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
    >
     {isRunning ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
     {isRunning ? 'Pause Electrolysis' : 'Start Electrolysis'}
    </button>
    <button
     onClick={reset}
     className={`p-3 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg transition-colors flex-col `}
    >
     <RefreshCw className="w-5 h-5" />
    </button>
    </div>
   </div>
   </div>
  </div>

  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center justify-center relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="absolute top-6 left-6 text-lg font-semibold text-slate-800 dark:text-[#ffffff]">Crucible View</h2>
   
   <div className="absolute top-6 right-6 text-right">
   <div className="text-2xl font-mono font-bold text-fuchsia-600">{(time / 60).toFixed(1)} min</div>
   <div className="text-sm text-slate-500 dark:text-[#71717a]">Elapsed Time</div>
   <div className="text-lg font-mono font-bold text-emerald-600 mt-2">{current.toFixed(2)} A</div>
   </div>

   <svg width={svgW} height={svgH} className="mt-8" viewBox="0 0 400 500">
   <rect x="150" y="20" width="100" height="40" rx="4" fill="#334155" />
   <text x="200" y="45" fill="white" textAnchor="middle" fontSize="16" fontWeight="bold">{voltage.toFixed(1)}V</text>
   <text x="140" y="45" fill="#ef4444" textAnchor="end" fontSize="20" fontWeight="bold">+</text>
   <text x="260" y="45" fill="#3b82f6" textAnchor="start" fontSize="20" fontWeight="bold">-</text>

   <path d="M 170 60 L 170 150" stroke="#ef4444" strokeWidth="4" fill="none" />
   <path d="M 230 60 L 230 150" stroke="#3b82f6" strokeWidth="4" fill="none" />
   
   <path d="M 100 200 L 120 450 Q 200 480 280 450 L 300 200" stroke="#94a3b8" strokeWidth="6" fill="#f8fafc" />
   <line x1="80" y1="200" x2="320" y2="200" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
   
   <path d="M 180 490 L 190 470 L 200 485 L 210 470 L 220 490 Z" fill="#ef4444" opacity="0.8" />
   <path d="M 185 490 L 195 475 L 200 485 L 205 475 L 215 490 Z" fill="#fbbf24" />

   <path d="M 105 250 L 118 445 Q 200 475 282 445 L 295 250 Z" fill="#fdba74" opacity="0.5" />
   <text x="200" y="430" fill="#c2410c" textAnchor="middle" fontSize="14" fontWeight="bold">Molten PbCl₂</text>
   
   {massPb > 0 && (
    <path d={`M 130 435 Q 200 ${460 - Math.min(20, massPb * 0.1)} 270 435 Q 200 470 130 435`} fill="#94a3b8" />
   )}

   <rect x="160" y="150" width="20" height="200" fill="#1e293b" />
   <rect x="220" y="150" width="20" height="200" fill="#1e293b" />
   
   <text x="170" y="140" fill="#1e293b" textAnchor="middle" fontSize="12" fontWeight="bold">Anode (+)</text>
   <text x="230" y="140" fill="#1e293b" textAnchor="middle" fontSize="12" fontWeight="bold">Cathode (-)</text>

   {isRunning && (
    <>
    <circle cx="170" cy="100" r="4" fill="#fbbf24">
     <animate attributeName="cy" values="150;60" dur={`${2/voltage}s`} repeatCount="indefinite" />
    </circle>
    <circle cx="230" cy="100" r="4" fill="#fbbf24">
     <animate attributeName="cy" values="60;150" dur={`${2/voltage}s`} repeatCount="indefinite" />
    </circle>
    </>
   )}

   {isRunning && Array.from({length: 8}).map((_, i) => (
    <circle key={`cl2-${i}`} cx={160 + Math.random() * 20} cy={350 - Math.random() * 100} r="4" fill="#4ade80" opacity="0.8">
    <animate attributeName="cy" values={`${350 - i*15};250`} dur={`${1 + Math.random()}s`} repeatCount="indefinite" />
    <animate attributeName="opacity" values="0.8;0" dur={`${1 + Math.random()}s`} repeatCount="indefinite" />
    </circle>
   ))}

   {isRunning && Array.from({length: 4}).map((_, i) => (
    <circle key={`pb-${i}`} cx={220 + Math.random() * 20} cy={350 + Math.random() * 50} r="3" fill="#94a3b8">
    <animate attributeName="cy" values={`350;440`} dur={`${0.5 + Math.random()}s`} repeatCount="indefinite" />
    <animate attributeName="opacity" values="1;0" dur={`${0.5 + Math.random()}s`} repeatCount="indefinite" />
    </circle>
   ))}
   </svg>
   
   <div className="absolute bottom-6 left-6 right-6 flex justify-between px-4">
   <div className="bg-slate-100 dark:bg-[#121212] px-3 py-1 rounded text-sm font-semibold text-slate-700 dark:text-[#ffffff]">
    Pb Mass: {massPb.toFixed(2)} g
   </div>
   <div className="bg-slate-100 dark:bg-[#121212] px-3 py-1 rounded text-sm font-semibold text-slate-700 dark:text-[#ffffff]">
    Cl₂ Vol: {volCl2.toFixed(0)} mL
   </div>
   </div>
  </div>

  <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6 lg:overflow-y-auto `}>
   <div>
   <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff]">Data Table</h2>
    <button
    onClick={recordData}
    disabled={!isRunning}
    className="flex items-center gap-2 px-3 py-1.5 bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200 rounded-lg font-medium transition-colors disabled:opacity-50"
    >
    <Save className="w-4 h-4" />
    Record Data
    </button>
   </div>
   
   <div className="overflow-x-auto border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
    <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] text-slate-600 dark:text-[#a1a1aa] border-b border-slate-200 dark:border-[#1c1b1b]">
     <tr>
     <th className="px-4 py-2">Time (s)</th>
     <th className="px-4 py-2">Current (A)</th>
     <th className="px-4 py-2">Mass Pb (g)</th>
     <th className="px-4 py-2">Vol Cl₂ (mL)</th>
     </tr>
    </thead>
    <tbody>
     {logs.map(log => (
     <tr key={log.id} className="border-b border-slate-100">
      <td className="px-4 py-2 font-mono">{log.time}</td>
      <td className="px-4 py-2 font-mono">{log.current.toFixed(2)}</td>
      <td className="px-4 py-2 font-mono">{log.massPb}</td>
      <td className="px-4 py-2 font-mono">{log.volCl2}</td>
     </tr>
     ))}
    </tbody>
    </table>
   </div>
   </div>

   {logs.length > 1 && (
   <div>
    <h3 className="text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">Graph: Mass of Pb vs Time</h3>
    <div className={`w-full h-48 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg relative p-2 `}>
    <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none">
     <line x1="20" y1="130" x2="280" y2="130" stroke="#94a3b8" strokeWidth="2" />
     <line x1="20" y1="20" x2="20" y2="130" stroke="#94a3b8" strokeWidth="2" />
     
     {logs.map((log, i) => (
     <circle key={`pt-${i}`} cx={20 + (log.time / maxTime) * 260} cy={130 - (log.massPb / maxMass) * 110} r="3" fill="#c026d3" />
     ))}
     
     <path 
     d={`M ${logs.map(l => `${20 + (l.time / maxTime) * 260},${130 - (l.massPb / maxMass) * 110}`).join(' L ')}`} 
     fill="none" 
     stroke="#c026d3" 
     strokeWidth="1.5" 
     opacity="0.5"
     />
    </svg>
    </div>
   </div>
   )}

   <div className="bg-fuchsia-50 p-4 rounded-xl border border-fuchsia-100 mt-auto">
   <h3 className="font-semibold text-fuchsia-900 mb-2">Analysis</h3>
   <p className="text-sm text-fuchsia-800 mb-4">
    A cell operating at <strong>{assessmentCurrent} A</strong> runs for <strong>{assessmentTime} minutes</strong>. 
    Calculate the theoretical mass of lead produced. (Pb = 207.2)
   </p>
   <div className="flex gap-2">
    <input 
    type="number" 
    step="0.01"
    placeholder="Mass (g)"
    value={userAnswer}
    onChange={(e) => setUserAnswer(e.target.value)}
    className="flex-1 px-3 py-2 rounded-lg border border-fuchsia-200"
    />
    <button 
    onClick={checkAnswer}
    className="px-4 py-2 bg-fuchsia-600 text-white font-medium rounded-lg hover:bg-fuchsia-700 dark:text-white dark:text-white dark:bg-fuchsia-500 dark:hover:bg-fuchsia-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-fuchsia-500/40"
    >
    Check
    </button>
   </div>
   
   {isCorrect !== null && (
    <div className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
    {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
    <div>
     <p className="font-medium">{isCorrect ? 'Correct!' : 'Incorrect.'}</p>
     <p className="text-sm mt-1">
     {isCorrect 
      ? "Great! Pb2+ requires 2 electrons per atom." 
      : "Hint: Remember that Pb2+ needs 2 moles of electrons for 1 mole of Pb."}
     </p>
    </div>
    </div>
   )}
   </div>
  </div>

  </main>
 </div>
 );
}
