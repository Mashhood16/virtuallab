import { useState, useEffect } from 'react';
import { Play, Square, Info, Save, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC10CopperRefining({ onExit }: { onExit: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const initialAnode = 100.0;
 const initialCathode = 10.0;
 
 const [isRunning, setIsRunning] = useState(false);
 const [voltage, setVoltage] = useState(2);
 const [time, setTime] = useState(0); 
 const [massAnode, setMassAnode] = useState(initialAnode); 
 const [massCathode, setMassCathode] = useState(initialCathode); 
 const [logs, setLogs] = useState<{id: number, time: number, current: number, mAnode: number, mCathode: number}[]>([]);
 
 const [assessmentLoss, setAssessmentLoss] = useState(20);
 const [assessmentGain, setAssessmentGain] = useState(19);
 const [userAnswer, setUserAnswer] = useState('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const purityFactor = 0.95; 
 const resistance = 1.5; 
 const F = 96485; 
 const M_Cu = 63.5;
 
 useEffect(() => {
 const l = Math.floor(Math.random() * 30) + 10;
 const g = l * purityFactor;
 setAssessmentLoss(l);
 setAssessmentGain(Number(g.toFixed(2)));
 }, []);

 useEffect(() => {
 let timer: number;
 if (isRunning) {
  const current = voltage / resistance;
  const dt = 3600; 
  timer = window.setInterval(() => {
  setTime(prev => prev + dt);
  const dMolesE = (current * dt) / F;
  const massChange = (dMolesE / 2) * M_Cu;
  
  setMassAnode(prev => Math.max(0, prev - massChange));
  setMassCathode(prev => prev + massChange * purityFactor);
  }, 100);
 }
 return () => clearInterval(timer);
 }, [isRunning, voltage]);

 const current = isRunning ? voltage / resistance : 0;

 const recordData = () => {
 setLogs([...logs, {
  id: Date.now(),
  time: time,
  current: current,
  mAnode: Number(massAnode.toFixed(2)),
  mCathode: Number(massCathode.toFixed(2))
 }]);
 };

 const reset = () => {
 setIsRunning(false);
 setTime(0);
 setMassAnode(initialAnode);
 setMassCathode(initialCathode);
 setLogs([]);
 setVoltage(2);
 setIsCorrect(null);
 setUserAnswer('');
 };

 const checkAnswer = () => {
 const purity = (assessmentGain / assessmentLoss) * 100;
 const parsed = parseFloat(userAnswer);
 if (!isNaN(parsed) && Math.abs(parsed - purity) < 1.0) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 const svgW = 400;
 const svgH = 500;
 
 const anodeWidth = 40 * (massAnode / initialAnode);
 const cathodeWidth = 10 + 30 * ((massCathode - initialCathode) / 100);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Electrolytic Refining of Copper" />

  
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
    <Info className="w-5 h-5 text-orange-600" />
    Theory
   </h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-2">
    Impure copper from smelting is purified via electrolysis using a CuSO₄ electrolyte.
   </p>
   <div className={`bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-4 rounded-lg font-mono text-sm mb-2 text-slate-700 dark:text-[#ffffff] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    <div><strong>Anode (+):</strong> Cu(s) → Cu²⁺(aq) + 2e⁻</div>
    <div><strong>Cathode (-):</strong> Cu²⁺(aq) + 2e⁻ → Cu(s)</div>
   </div>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    The impure anode dissolves, while pure copper plates onto the cathode. Impurities (like Ag, Au) fall to the bottom as <strong>anode slime</strong>.
   </p>
   </div>

   <div className="flex-1">
   <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-4">Experiment Setup</h2>
   <div className="space-y-6">
    <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2">
     <span>Operating Voltage</span>
     <span>{voltage.toFixed(1)} V</span>
    </label>
    <input
     type="range"
     min="0.5"
     max="5"
     step="0.5"
     value={voltage}
     onChange={(e) => setVoltage(parseFloat(e.target.value))}
     disabled={isRunning || massAnode <= 0}
     className="w-full accent-orange-600"
    />
    </div>

    <div className="flex gap-4">
    <button
     onClick={() => setIsRunning(!isRunning)}
     disabled={massAnode <= 0}
     className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-colors ${(isRunning || massAnode <= 0) ? 'bg-amber-500 hover:bg-amber-600 disabled:opacity-50' : 'bg-emerald-600 hover:bg-emerald-700'}`}
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

  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center justify-center relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="absolute top-6 left-6 text-lg font-semibold text-slate-800 dark:text-[#ffffff]">Cell View</h2>
   
   <div className="absolute top-6 right-6 text-right">
   <div className="text-2xl font-mono font-bold text-orange-600">{(time / 3600).toFixed(1)} hr</div>
   <div className="text-sm text-slate-500 dark:text-[#71717a]">Elapsed Time</div>
   </div>

   <svg width={svgW} height={svgH} className="mt-8" viewBox="0 0 400 500">
   <rect x="150" y="20" width="100" height="40" rx="4" fill="#334155" />
   <text x="200" y="45" fill="white" textAnchor="middle" fontSize="16" fontWeight="bold">{voltage.toFixed(1)}V</text>
   <text x="140" y="45" fill="#ef4444" textAnchor="end" fontSize="20" fontWeight="bold">+</text>
   <text x="260" y="45" fill="#3b82f6" textAnchor="start" fontSize="20" fontWeight="bold">-</text>

   <path d="M 170 60 L 170 150" stroke="#ef4444" strokeWidth="4" fill="none" />
   <path d="M 230 60 L 230 150" stroke="#3b82f6" strokeWidth="4" fill="none" />
   
   <path d="M 100 200 L 100 480 Q 100 490 110 490 L 290 490 Q 300 490 300 480 L 300 200" stroke="#94a3b8" strokeWidth="6" fill="#f8fafc" />
   
   <path d="M 103 230 L 103 487 L 297 487 L 297 230 Z" fill="#3b82f6" opacity="0.3" />
   <text x="200" y="460" fill="#1d4ed8" textAnchor="middle" fontSize="14" fontWeight="bold">CuSO₄(aq)</text>
   
   {initialAnode - massAnode > 0 && (
    <path d={`M 140 487 L 190 487 L 180 ${487 - Math.min(20, (initialAnode - massAnode)*0.2)} L 150 ${487 - Math.min(20, (initialAnode - massAnode)*0.2)} Z`} fill="#475569" />
   )}

   {massAnode > 0 && (
    <rect x={170 - anodeWidth/2} y="150" width={Math.max(1, anodeWidth)} height="250" fill="#b45309" />
   )}
   
   <rect x={230 - cathodeWidth/2} y="150" width={cathodeWidth} height="250" fill="#d97706" />

   <text x="170" y="140" fill="#b45309" textAnchor="middle" fontSize="12" fontWeight="bold">Impure Anode</text>
   <text x="230" y="140" fill="#d97706" textAnchor="middle" fontSize="12" fontWeight="bold">Pure Cathode</text>

   {isRunning && massAnode > 0 && (
    <>
    <circle cx="200" cy="300" r="3" fill="#1d4ed8">
     <animate attributeName="cx" values="170;230" dur={`${3/voltage}s`} repeatCount="indefinite" />
    </circle>
    <circle cx="200" cy="350" r="3" fill="#1d4ed8">
     <animate attributeName="cx" values="170;230" dur={`${3.5/voltage}s`} repeatCount="indefinite" />
    </circle>
    <text x="200" y="290" fill="#1d4ed8" fontSize="10">Cu²⁺</text>
    </>
   )}

   {isRunning && massAnode > 0 && Array.from({length: 3}).map((_, i) => (
    <circle key={`slime-${i}`} cx={170 + Math.random() * 10 - 5} cy={400 + Math.random() * 30} r="2" fill="#475569">
    <animate attributeName="cy" values="400;487" dur={`${1 + Math.random()}s`} repeatCount="indefinite" />
    <animate attributeName="opacity" values="1;0" dur={`${1 + Math.random()}s`} repeatCount="indefinite" />
    </circle>
   ))}
   </svg>
   
   <div className="absolute bottom-6 left-6 right-6 flex justify-between px-4">
   <div className="bg-slate-100 dark:bg-[#121212] px-3 py-1 rounded text-sm font-semibold text-slate-700 dark:text-[#ffffff]">
    Anode: {massAnode.toFixed(1)} g
   </div>
   <div className="bg-slate-100 dark:bg-[#121212] px-3 py-1 rounded text-sm font-semibold text-slate-700 dark:text-[#ffffff]">
    Cathode: {massCathode.toFixed(1)} g
   </div>
   </div>
  </div>

  <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6 lg:overflow-y-auto `}>
   <div>
   <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff]">Mass Log</h2>
    <button
    onClick={recordData}
    disabled={!isRunning}
    className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg font-medium transition-colors disabled:opacity-50"
    >
    <Save className="w-4 h-4" />
    Record
    </button>
   </div>
   
   <div className="overflow-x-auto border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
    <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] text-slate-600 dark:text-[#a1a1aa] border-b border-slate-200 dark:border-[#1c1b1b]">
     <tr>
     <th className="px-4 py-2">Time (hr)</th>
     <th className="px-4 py-2">Anode (g)</th>
     <th className="px-4 py-2">Cathode (g)</th>
     </tr>
    </thead>
    <tbody>
     {logs.map(log => (
     <tr key={log.id} className="border-b border-slate-100">
      <td className="px-4 py-2 font-mono">{(log.time / 3600).toFixed(1)}</td>
      <td className="px-4 py-2 font-mono">{log.mAnode}</td>
      <td className="px-4 py-2 font-mono">{log.mCathode}</td>
     </tr>
     ))}
    </tbody>
    </table>
   </div>
   </div>

   <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mt-auto">
   <h3 className="font-semibold text-orange-900 mb-2">Purity Analysis</h3>
   <p className="text-sm text-orange-800 mb-4">
    During a real trial, the anode lost <strong>{assessmentLoss} g</strong> in mass, while the cathode gained <strong>{assessmentGain} g</strong> in mass. Calculate the percentage purity of the original copper anode.
   </p>
   <div className="flex gap-2">
    <input 
    type="number" 
    step="0.1"
    placeholder="% Purity"
    value={userAnswer}
    onChange={(e) => setUserAnswer(e.target.value)}
    className="flex-1 px-3 py-2 rounded-lg border border-orange-200"
    />
    <button 
    onClick={checkAnswer}
    className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40"
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
      ? "Correct! Purity = (Mass Gained / Mass Lost) * 100." 
      : "Hint: Mass of pure copper deposited divided by total mass lost by the anode, multiplied by 100."}
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
