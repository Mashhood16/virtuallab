import { useState, useEffect } from 'react';
import { Play, Square, Info, Save, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC10AqueousElectrolysis({ onExit }: { onExit: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [isRunning, setIsRunning] = useState(false);
 const [voltage, setVoltage] = useState(5);
 const [solutionType, setSolutionType] = useState<'conc' | 'dilute'>('conc');
 const [time, setTime] = useState(0); 
 const [volCathode, setVolCathode] = useState(0); 
 const [volAnode, setVolAnode] = useState(0); 
 const [logs, setLogs] = useState<{id: number, time: number, type: string, current: number, volC: number, volA: number}[]>([]);
 
 const [userAnswer, setUserAnswer] = useState('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const resistance = solutionType === 'conc' ? 2.0 : 4.0; 
 const F = 96485; 
 
 useEffect(() => {
 let timer: number;
 if (isRunning) {
  const current = voltage / resistance;
  const dt = 30; 
  timer = window.setInterval(() => {
  setTime(prev => prev + dt);
  const dMolesE = (current * dt) / F;
  
  const dVolH2 = (dMolesE / 2) * 24000;
  setVolCathode(prev => prev + dVolH2);
  
  if (solutionType === 'conc') {
   const dVolCl2 = (dMolesE / 2) * 24000;
   setVolAnode(prev => prev + dVolCl2);
  } else {
   const dVolO2 = (dMolesE / 4) * 24000;
   setVolAnode(prev => prev + dVolO2);
  }
  }, 100);
 }
 return () => clearInterval(timer);
 }, [isRunning, voltage, solutionType]);

 const current = isRunning ? voltage / resistance : 0;

 const recordData = () => {
 const noiseC = volCathode * (1 + (Math.random() - 0.5) * 0.04);
 const noiseA = volAnode * (1 + (Math.random() - 0.5) * 0.04);
 setLogs([...logs, {
  id: Date.now(),
  time: time,
  type: solutionType === 'conc' ? 'Conc NaCl' : 'Dilute NaCl',
  current: current,
  volC: Number(noiseC.toFixed(1)),
  volA: Number(noiseA.toFixed(1))
 }]);
 };

 const handleSolutionChange = (type: 'conc' | 'dilute') => {
 setSolutionType(type);
 reset();
 };

 const reset = () => {
 setIsRunning(false);
 setTime(0);
 setVolCathode(0);
 setVolAnode(0);
 setIsCorrect(null);
 setUserAnswer('');
 };

 const clearLogs = () => setLogs([]);

 const checkAnswer = () => {
 const parsed = userAnswer.toLowerCase().trim();
 if (parsed.includes('oxygen') || parsed === 'o2') {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 const svgW = 400;
 const svgH = 500;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Electrolysis of Aqueous Solutions" />

  
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
  <main className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 overflow-y-auto lg:overflow-visible">
  
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6  ? 'flex' : 'hidden'} lg:flex`}>
   <div>
   <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
    <Info className="w-5 h-5 text-sky-600" />
    Theory
   </h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-2">
    In aqueous solutions, water competes with dissolved ions at the electrodes.
   </p>
   {solutionType === 'conc' ? (
    <div className={`w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-4 rounded-lg font-mono text-sm mb-2 text-slate-700 dark:text-[#ffffff] flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
    <div className="font-bold text-sky-700 mb-1">Concentrated NaCl (Brine)</div>
    <div><strong>Cathode (-):</strong> 2H₂O + 2e⁻ → H₂(g) + 2OH⁻</div>
    <div><strong>Anode (+):</strong> 2Cl⁻ → Cl₂(g) + 2e⁻</div>
    <div className="mt-2 text-xs text-slate-500 dark:text-[#71717a]">Cl⁻ is in high concentration, so it discharges over OH⁻.</div>
    </div>
   ) : (
    <div className={`w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-4 rounded-lg font-mono text-sm mb-2 text-slate-700 dark:text-[#ffffff] flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    <div className="font-bold text-sky-700 mb-1">Dilute NaCl</div>
    <div><strong>Cathode (-):</strong> 2H₂O + 2e⁻ → H₂(g) + 2OH⁻</div>
    <div><strong>Anode (+):</strong> 2H₂O → O₂(g) + 4H⁺ + 4e⁻</div>
    <div className="mt-2 text-xs text-slate-500 dark:text-[#71717a]">Cl⁻ is sparse, so water is oxidized to form Oxygen gas.</div>
    </div>
   )}
   </div>

   <div className="flex-1">
   <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-4">Experiment Setup</h2>
   <div className="space-y-4">
    
    <div>
    <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2 block">Electrolyte Solution</label>
    <div className="flex gap-2">
     <button 
     onClick={() => handleSolutionChange('conc')}
     className={`flex-1 py-2 rounded border ${solutionType === 'conc' ? 'bg-sky-100 border-sky-400 text-sky-800 font-semibold' : 'bg-slate-50 dark:bg-[#121212] border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:bg-slate-50 dark:bg-[#121212]'}`}
     >
     Conc NaCl (Brine)
     </button>
     <button 
     onClick={() => handleSolutionChange('dilute')}
     className={`flex-1 py-2 rounded border ${solutionType === 'dilute' ? 'bg-sky-100 border-sky-400 text-sky-800 font-semibold' : 'bg-slate-50 dark:bg-[#121212] border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:bg-slate-50 dark:bg-[#121212]'}`}
     >
     Dilute NaCl
     </button>
    </div>
    </div>

    <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2 mt-4">
     <span>Voltage</span>
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
     className="w-full accent-sky-600"
    />
    </div>

    <div className="flex gap-4 mt-4">
    <button
     onClick={() => setIsRunning(!isRunning)}
     className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-colors ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
    >
     {isRunning ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
     {isRunning ? 'Pause' : 'Start'}
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

  <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col items-center justify-center relative">
   <h2 className="absolute top-6 left-6 text-lg font-semibold text-slate-800 dark:text-[#ffffff]">Hoffman Voltameter</h2>
   
   <div className="absolute top-6 right-6 text-right">
   <div className="text-2xl font-mono font-bold text-sky-600">{(time / 60).toFixed(1)} min</div>
   <div className="text-sm text-slate-500 dark:text-[#71717a]">Elapsed</div>
   </div>

   <svg width={svgW} height={svgH} className="mt-8" viewBox="0 0 400 500">
   <rect x="150" y="20" width="100" height="40" rx="4" fill="#334155" />
   <text x="200" y="45" fill="white" textAnchor="middle" fontSize="16" fontWeight="bold">{voltage.toFixed(1)}V</text>
   <text x="140" y="45" fill="#ef4444" textAnchor="end" fontSize="20" fontWeight="bold">+</text>
   <text x="260" y="45" fill="#3b82f6" textAnchor="start" fontSize="20" fontWeight="bold">-</text>

   <path d="M 170 60 L 170 420" stroke="#ef4444" strokeWidth="2" fill="none" />
   <path d="M 230 60 L 230 420" stroke="#3b82f6" strokeWidth="2" fill="none" />
   
   <path d="M 150 150 L 150 450 Q 150 470 170 470 L 230 470 Q 250 470 250 450 L 250 150" stroke="#94a3b8" strokeWidth="4" fill="none" />
   <path d="M 190 470 L 190 350" stroke="#94a3b8" strokeWidth="4" fill="none" />
   <path d="M 210 470 L 210 350" stroke="#94a3b8" strokeWidth="4" fill="none" />
   
   <path d={`M 152 ${160 + Math.min(280, volAnode * 1.5)} L 152 450 Q 152 468 170 468 L 230 468 Q 248 468 248 450 L 248 ${160 + Math.min(280, volCathode * 1.5)}`} stroke="none" fill="#bae6fd" opacity="0.6" />
   
   <path d={`M 192 200 L 192 468 L 208 468 L 208 200 Z`} fill="#bae6fd" opacity="0.6" />
   <path d="M 190 200 L 190 350" stroke="#94a3b8" strokeWidth="4" fill="none" />
   <path d="M 210 200 L 210 350" stroke="#94a3b8" strokeWidth="4" fill="none" />

   <rect x="165" y="420" width="10" height="30" fill="#1e293b" />
   <rect x="225" y="420" width="10" height="30" fill="#1e293b" />

   {isRunning && Array.from({length: solutionType === 'conc' ? 8 : 4}).map((_, i) => (
    <circle key={`anode-b-${i}`} cx={170 + Math.random() * 6 - 3} cy={420 - Math.random() * 100} r="3" fill={solutionType === 'conc' ? '#4ade80' : 'white'} opacity="0.8">
    <animate attributeName="cy" values={`420;${160 + Math.min(280, volAnode * 1.5)}`} dur={`${1 + Math.random()}s`} repeatCount="indefinite" />
    </circle>
   ))}
   {isRunning && Array.from({length: 8}).map((_, i) => (
    <circle key={`cathode-b-${i}`} cx={230 + Math.random() * 6 - 3} cy={420 - Math.random() * 100} r="3" fill="white" opacity="0.8">
    <animate attributeName="cy" values={`420;${160 + Math.min(280, volCathode * 1.5)}`} dur={`${0.8 + Math.random()}s`} repeatCount="indefinite" />
    </circle>
   ))}

   <text x="170" y="140" fill="#64748b" textAnchor="middle" fontSize="12" fontWeight="bold">Anode (+)</text>
   <text x="230" y="140" fill="#64748b" textAnchor="middle" fontSize="12" fontWeight="bold">Cathode (-)</text>
   <text x="170" y="125" fill="#ef4444" textAnchor="middle" fontSize="10">{solutionType === 'conc' ? 'Cl₂' : 'O₂'}</text>
   <text x="230" y="125" fill="#3b82f6" textAnchor="middle" fontSize="10">H₂</text>

   </svg>
   
   <div className="absolute bottom-6 left-6 right-6 flex justify-between px-4">
   <div className="bg-slate-100 dark:bg-[#121212] px-3 py-1 rounded text-sm font-semibold text-slate-700 dark:text-[#ffffff]">
    Anode Gas: {volAnode.toFixed(1)} mL
   </div>
   <div className="bg-slate-100 dark:bg-[#121212] px-3 py-1 rounded text-sm font-semibold text-slate-700 dark:text-[#ffffff]">
    Cathode Gas: {volCathode.toFixed(1)} mL
   </div>
   </div>
  </div>

  <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6 lg:overflow-y-auto `}>
   <div>
   <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff]">Collected Data</h2>
    <div className="flex gap-2">
    <button onClick={clearLogs} className="text-xs text-slate-500 dark:text-[#71717a] hover:text-slate-700 dark:text-[#ffffff] px-2">Clear</button>
    <button
     onClick={recordData}
     disabled={!isRunning}
     className="flex items-center gap-2 px-3 py-1.5 bg-sky-100 text-sky-700 hover:bg-sky-200 rounded-lg font-medium transition-colors disabled:opacity-50"
    >
     <Save className="w-4 h-4" />
     Record
    </button>
    </div>
   </div>
   
   <div className="overflow-x-auto border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
    <table className="w-full text-xs text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] text-slate-600 dark:text-[#a1a1aa] border-b border-slate-200 dark:border-[#1c1b1b]">
     <tr>
     <th className="px-3 py-2">Solution</th>
     <th className="px-3 py-2">Anode Vol (mL)</th>
     <th className="px-3 py-2">Cathode Vol (mL)</th>
     <th className="px-3 py-2">Ratio (C:A)</th>
     </tr>
    </thead>
    <tbody>
     {logs.map(log => (
     <tr key={log.id} className="border-b border-slate-100">
      <td className="px-3 py-2">{log.type}</td>
      <td className="px-3 py-2 font-mono text-rose-600">{log.volA}</td>
      <td className="px-3 py-2 font-mono text-blue-600">{log.volC}</td>
      <td className="px-3 py-2 font-mono font-bold">
      {log.volA > 0 ? (log.volC / log.volA).toFixed(2) : '-'}
      </td>
     </tr>
     ))}
    </tbody>
    </table>
   </div>
   </div>

   <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 mt-auto">
   <h3 className="font-semibold text-sky-900 mb-2">Analysis</h3>
   <p className="text-sm text-sky-800 mb-4">
    Look at the volume ratio for Dilute NaCl. The cathode gas volume is exactly double the anode gas volume. Based on the chemical formula of water (H₂O), what gas is being produced at the <strong>anode</strong>?
   </p>
   <div className="flex gap-2">
    <input 
    type="text" 
    placeholder="Name of gas..."
    value={userAnswer}
    onChange={(e) => setUserAnswer(e.target.value)}
    className="flex-1 px-3 py-2 rounded-lg border border-sky-200"
    />
    <button 
    onClick={checkAnswer}
    className="px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 dark:text-white dark:text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-sky-500/40"
    >
    Check
    </button>
   </div>
   
   {isCorrect !== null && (
    <div className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} `}>
    {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
    <div>
     <p className="font-medium">{isCorrect ? 'Correct!' : 'Incorrect.'}</p>
     <p className="text-sm mt-1">
     {isCorrect 
      ? "Yes, Oxygen (O2) is produced at the anode. H2 is double the volume of O2." 
      : "Hint: Water is H2O. If H2 is produced at the cathode (2 parts), what is produced at the anode (1 part)?"}
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
