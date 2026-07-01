import { useState, useEffect, useRef } from 'react';
import { Play, Square, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC10Esterification({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [ethanoic, setEthanoic] = useState(10);
 const [methanol, setMethanol] = useState(10);
 const [temp, setTemp] = useState(25);
 const [catalyst, setCatalyst] = useState(0);
 const [running, setRunning] = useState(false);
 const [time, setTime] = useState(0);
 const [yieldPercent, setYieldPercent] = useState(0);
 const [smell, setSmell] = useState('None');
 
 const [logs, setLogs] = useState<{run: number, eth: number, meth: number, t: number, cat: number, y: number}[]>([]);
 
 const [answer, setAnswer] = useState('');
 const [feedback, setFeedback] = useState('');
 const targetMass = useRef(Math.floor(Math.random() * 10 + 5) * 10); 
 
 useEffect(() => {
 let timer: number;
 if (running) {
  timer = window.setInterval(() => {
  setTime(t => {
   if (t >= 60) {
   setRunning(false);
   return 60;
   }
   return t + 1;
  });
  }, 100);
 }
 return () => clearInterval(timer);
 }, [running]);

 useEffect(() => {
 if (time === 0) {
  setYieldPercent(0);
  setSmell('None');
  return;
 }
 let k = 0.001 * Math.exp((temp - 25) / 15);
 if (catalyst > 0) k *= (1 + catalyst * 5); 
 
 const limiting = Math.min(ethanoic, methanol);
 const maxTheoretical = (limiting / Math.max(ethanoic, methanol)) * 100 * (catalyst > 0 ? 0.7 : 0.6); 
 
 const currentYield = maxTheoretical * (1 - Math.exp(-k * time));
 setYieldPercent(Math.min(currentYield, 100));
 
 if (currentYield > 30) setSmell('Fruity (Sweet)');
 else if (currentYield > 10) setSmell('Faintly Sweet');
 else setSmell('Vinegar-like');
 
 }, [time, temp, catalyst, ethanoic, methanol]);

 const handleStart = () => {
 if (running) {
  setRunning(false);
 } else {
  if (time >= 60) setTime(0);
  setRunning(true);
 }
 };

 const handleLog = () => {
 setLogs([...logs, { run: logs.length + 1, eth: ethanoic, meth: methanol, t: temp, cat: catalyst, y: parseFloat(yieldPercent.toFixed(1)) }]);
 };

 const checkAnswer = () => {
 const expected = (targetMass.current * 74) / 60;
 if (Math.abs(parseFloat(answer) - expected) < 1) {
  setFeedback('Correct! Well done.');
 } else {
  setFeedback(`Incorrect. Hint: M_r of ethanoic acid is 60, M_r of methyl ethanoate is 74. Target mass was ${targetMass.current}g.`);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Virtual Lab: Esterification" subtitle="Synthesizing Methyl Ethanoate" />

  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:flex-1 overflow-y-auto lg:overflow-visible">
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-sm border p-4 flex flex-col gap-4  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">Theory & Setup</h2>
   <div className="text-slate-600 dark:text-[#a1a1aa] space-y-2 text-sm">
   <p><strong>Esterification</strong> is the reaction between a carboxylic acid and an alcohol to produce an ester and water.</p>
   <div className={`bg-blue-50 p-3 rounded font-mono text-center text-blue-900 border border-blue-200 dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff] flex-col `}>
    CH₃COOH + CH₃OH ⇌ CH₃COOCH₃ + H₂O
   </div>
   <p><strong>Conditions:</strong> Concentrated sulfuric acid (H₂SO₄) is used as a catalyst, and the mixture is heated in a water bath.</p>
   <p><strong>Observation:</strong> Esters have a characteristic fruity or sweet smell. The reaction mixture initially smells of vinegar (ethanoic acid).</p>
   </div>
   
   <div className="flex-1 overflow-auto">
   <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-2 mt-4">Experiment Controls</h3>
   <div className="space-y-4">
    <div>
    <label className="text-sm font-semibold flex justify-between">
     <span>Ethanoic Acid Volume (mL)</span>
     <span>{ethanoic} mL</span>
    </label>
    <input type="range" min="5" max="50" value={ethanoic} onChange={(e) => { setEthanoic(Number(e.target.value)); setTime(0); }} className="w-full" disabled={running} />
    </div>
    <div>
    <label className="text-sm font-semibold flex justify-between">
     <span>Methanol Volume (mL)</span>
     <span>{methanol} mL</span>
    </label>
    <input type="range" min="5" max="50" value={methanol} onChange={(e) => { setMethanol(Number(e.target.value)); setTime(0); }} className="w-full" disabled={running} />
    </div>
    <div>
    <label className="text-sm font-semibold flex justify-between">
     <span>Water Bath Temp (°C)</span>
     <span>{temp} °C</span>
    </label>
    <input type="range" min="20" max="80" value={temp} onChange={(e) => { setTemp(Number(e.target.value)); setTime(0); }} className="w-full" disabled={running} />
    </div>
    <div>
    <label className="text-sm font-semibold flex justify-between">
     <span>Conc. H₂SO₄ Catalyst (drops)</span>
     <span>{catalyst} drops</span>
    </label>
    <input type="range" min="0" max="10" value={catalyst} onChange={(e) => { setCatalyst(Number(e.target.value)); setTime(0); }} className="w-full" disabled={running} />
    </div>
   </div>
   </div>
  </div>

  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-sm border p-4 flex flex-col items-center relative  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] w-full border-b pb-2 mb-4">Simulation</h2>
   
   <div className="flex-1 w-full flex flex-col items-center justify-center relative">
   <svg viewBox="0 0 200 300" className="w-64 h-auto max-h-full drop-shadow-xl">
    <rect x="30" y="150" width="140" height="100" rx="10" fill="rgba(100,200,255,0.3)" stroke="#333" strokeWidth="2" />
    <text x="100" y="240" textAnchor="middle" fill="#0066cc" fontSize="12">Water Bath</text>
    <text x="100" y="225" textAnchor="middle" fill="#0066cc" fontSize="14" fontWeight="bold">{temp}°C</text>
    
    {temp > 30 && <path d="M 80 260 Q 100 250 120 260" stroke="red" strokeWidth="3" fill="none" opacity={(temp-30)/50} />}
    {temp > 50 && <path d="M 90 270 Q 100 260 110 270" stroke="orange" strokeWidth="3" fill="none" opacity={(temp-50)/30} />}

    <path d="M 90 80 L 90 140 L 60 190 A 20 20 0 0 0 80 220 L 120 220 A 20 20 0 0 0 140 190 L 110 140 L 110 80 Z" fill="rgba(255,255,255,0.8)" stroke="#444" strokeWidth="2" />
    <path d="M 65 180 L 135 180 A 20 20 0 0 1 120 218 L 80 218 A 20 20 0 0 1 65 180 Z" fill={`rgba(200, 220, 200, ${0.4 + yieldPercent/200})`} />
    
    {running && temp > 40 && (
    <g className="animate-pulse">
     <circle cx="100" cy="120" r="3" fill="#aaa" opacity="0.5" />
     <circle cx="95" cy="100" r="4" fill="#aaa" opacity="0.4" />
     <circle cx="105" cy="80" r="5" fill="#aaa" opacity="0.3" />
    </g>
    )}
   </svg>

   <div className={`absolute top-4 right-4 bg-slate-100 dark:bg-[#121212] p-3 rounded border text-sm w-40 text-center flex-col `}>
    <div className="font-bold text-slate-700 dark:text-[#ffffff]">Odor Detected:</div>
    <div className={`font-semibold ${smell === 'None' ? 'text-slate-500 dark:text-[#a1a1aa]' : smell === 'Fruity (Sweet)' ? 'text-pink-600' : 'text-orange-500'}`}>
    {smell}
    </div>
   </div>
   
   {catalyst > 0 && <div className={`absolute top-10 left-10 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded flex-col `}>H₂SO₄ added</div>}
   </div>

   <div className="w-full mt-4 flex items-center justify-between gap-4">
   <div className="flex-1 bg-slate-200 dark:bg-[#121212] h-2 rounded-full lg:overflow-hidden">
    <div className="bg-blue-500 h-full transition-all duration-100 dark:bg-teal-950/20 dark:border-teal-900" style={{ width: `${(time/60)*100}%` }} />
   </div>
   <div className="text-sm font-mono">{time}s / 60s</div>
   <button onClick={handleStart} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
    {running ? <Square size={16} /> : <Play size={16} />}
    {running ? 'Stop' : 'Start'}
   </button>
   </div>
  </div>

  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-sm border p-4 flex flex-col gap-4  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">Data & Analysis</h2>
   
   <div className="bg-slate-100 dark:bg-[#121212] p-3 rounded flex justify-between items-center">
   <div>
    <div className="text-xs text-slate-500 dark:text-[#71717a] uppercase font-bold">Ester Yield</div>
    <div className="text-2xl font-mono text-blue-700">{yieldPercent.toFixed(1)}%</div>
   </div>
   <button onClick={handleLog} disabled={time === 0} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
    Record Data
   </button>
   </div>

   <div className="flex-1 overflow-auto border rounded bg-slate-50 dark:bg-[#121212]">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-200 dark:bg-[#121212] sticky top-0">
    <tr>
     <th className="p-2">Run</th>
     <th className="p-2">Eth(mL)</th>
     <th className="p-2">Meth(mL)</th>
     <th className="p-2">T(°C)</th>
     <th className="p-2">Cat</th>
     <th className="p-2">Yield(%)</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 ? (
     <tr><td colSpan={6} className="p-4 text-center text-slate-500 dark:text-[#71717a]">No data recorded yet.</td></tr>
    ) : (
     logs.map((log, i) => (
     <tr key={i} className="border-b">
      <td className="p-2">{log.run}</td>
      <td className="p-2">{log.eth}</td>
      <td className="p-2">{log.meth}</td>
      <td className="p-2">{log.t}</td>
      <td className="p-2">{log.cat}</td>
      <td className="p-2 font-mono font-bold text-blue-700">{log.y}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

   <div className="bg-blue-50 border border-blue-200 rounded p-4 dark:bg-teal-950/20 dark:border-teal-900">
   <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2 dark:text-[#ffffff]">
    <CheckCircle size={18} /> Knowledge Check
   </h3>
   <p className="text-sm text-blue-800 mb-3 dark:text-[#ffffff]">
    Calculate the theoretical maximum mass of methyl ethanoate produced if you react <strong>{targetMass.current} g</strong> of ethanoic acid with excess methanol. (Aᵣ: H=1, C=12, O=16)
   </p>
   <div className="flex gap-2">
    <input 
    type="number" 
    value={answer}
    onChange={e => setAnswer(e.target.value)}
    placeholder="Mass (g)" 
    className="flex-1 px-3 py-1 border rounded"
    />
    <button onClick={checkAnswer} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
    Check
    </button>
   </div>
   {feedback && (
    <p className={`mt-2 text-sm font-semibold ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>
    {feedback}
    </p>
   )}
   </div>

  </div>
  </div>
 </div>
 );
}
