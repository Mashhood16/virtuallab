import { useState, useEffect, useRef } from 'react';
import { Play, Square, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC10AlcoholCombustion({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [fuel, setFuel] = useState<'Methanol' | 'Ethanol'>('Methanol');
 const [waterVol, setWaterVol] = useState(100); 
 
 const [running, setRunning] = useState(false);
 const [time, setTime] = useState(0); 
 
 const initialWaterTemp = 20;
 const [waterTemp, setWaterTemp] = useState(20);
 
 const initialFuelMass = 50.00;
 const [fuelMass, setFuelMass] = useState(initialFuelMass);
 
 const [logs, setLogs] = useState<{run: number, f: string, v: number, massBurned: number, deltaT: number, q: number}[]>([]);
 
 const targetT = useRef(Math.floor(Math.random() * 20 + 10)); 
 const targetV = useRef(100);
 const targetM = useRef((Math.random() * 1 + 0.5).toFixed(2)); 

 const [answer, setAnswer] = useState('');
 const [feedback, setFeedback] = useState('');

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
  setWaterTemp(initialWaterTemp);
  setFuelMass(initialFuelMass);
  return;
 }
 
 const burnRate = fuel === 'Methanol' ? 0.025 : 0.020;
 const burned = burnRate * time;
 setFuelMass(initialFuelMass - burned);
 
 const energyPerGram = fuel === 'Methanol' ? 22700 : 29700; 
 const energyToWater = burned * energyPerGram * 0.5; 
 
 const deltaT = energyToWater / (waterVol * 4.18);
 setWaterTemp(initialWaterTemp + deltaT);

 }, [time, fuel, waterVol]);

 const handleStart = () => {
 if (running) setRunning(false);
 else {
  if (time >= 60) setTime(0);
  setRunning(true);
 }
 };

 const handleLog = () => {
 const massBurned = initialFuelMass - fuelMass;
 const deltaT = waterTemp - initialWaterTemp;
 const q = waterVol * 4.18 * deltaT;
 setLogs([...logs, { run: logs.length + 1, f: fuel, v: waterVol, massBurned: parseFloat(massBurned.toFixed(2)), deltaT: parseFloat(deltaT.toFixed(1)), q: Math.round(q) }]);
 };

 const checkAnswer = () => {
 const q = targetV.current * 4.18 * targetT.current;
 const moles = parseFloat(targetM.current) / 46;
 const enthalpy = (q / 1000) / moles;
 
 if (Math.abs(parseFloat(answer) - enthalpy) < 50) {
  setFeedback('Correct! Well done. In a real experiment, significant heat is lost to the surroundings.');
 } else {
  setFeedback(`Incorrect. Hint: q = mcΔT = ${targetV.current} × 4.18 × ${targetT.current}. Moles = Mass / 46. ΔH = (q in kJ) / moles.`);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Virtual Lab: Combustion of Alcohols" subtitle="Measuring Enthalpy of Combustion" />

  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:flex-1 overflow-y-auto lg:overflow-visible">
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-sm border p-4 flex flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">Theory & Setup</h2>
   <div className="text-slate-600 dark:text-[#a1a1aa] space-y-2 text-sm">
   <p><strong>Combustion</strong> of alcohols releases heat energy (exothermic).</p>
   <div className={`bg-orange-50 p-3 rounded font-mono text-center text-orange-900 border border-orange-200 flex-col `}>
    C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O
   </div>
   <p><strong>Experiment:</strong> We burn a known mass of fuel under a copper calorimeter containing water to measure the temperature rise.</p>
   <p><strong>Calculation:</strong> The heat energy transferred to the water is calculated using <em>q = mcΔT</em>.</p>
   </div>
   
   <div className="flex-1 overflow-auto">
   <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-2 mt-4">Experiment Controls</h3>
   <div className="space-y-4">
    <div>
    <label className="text-sm font-semibold flex justify-between mb-1">
     <span>Select Fuel</span>
    </label>
    <div className="flex gap-2">
     <button onClick={() => { setFuel('Methanol'); setTime(0); }} disabled={running} className={`flex-1 py-1 border rounded ${fuel === 'Methanol' ? 'bg-orange-100 border-orange-500 font-bold' : ''}`}>Methanol</button>
     <button onClick={() => { setFuel('Ethanol'); setTime(0); }} disabled={running} className={`flex-1 py-1 border rounded ${fuel === 'Ethanol' ? 'bg-orange-100 border-orange-500 font-bold' : ''}`}>Ethanol</button>
    </div>
    </div>
    <div>
    <label className="text-sm font-semibold flex justify-between">
     <span>Water Volume (mL)</span>
     <span>{waterVol} mL</span>
    </label>
    <input type="range" min="50" max="200" value={waterVol} onChange={(e) => { setWaterVol(Number(e.target.value)); setTime(0); }} className="w-full" disabled={running} />
    </div>
   </div>
   </div>
  </div>

  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-sm border p-4 flex flex-col items-center relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] w-full border-b pb-2 mb-4">Simulation</h2>
   
   <div className="flex-1 w-full flex flex-col items-center justify-center relative">
   <svg viewBox="0 0 200 300" className="w-64 h-auto max-h-full drop-shadow-xl">
    <rect x="50" y="200" width="100" height="5" fill="#333" />
    <rect x="40" y="200" width="10" height="80" fill="#333" />
    <rect x="150" y="200" width="10" height="80" fill="#333" />
    
    <path d="M 80 280 L 80 240 L 70 230 L 130 230 L 120 240 L 120 280 Z" fill="rgba(200, 200, 200, 0.8)" stroke="#444" strokeWidth="2" />
    <rect x="95" y="220" width="10" height="10" fill="#777" /> 
    
    {running && (
    <path d="M 95 220 Q 100 180 105 220 Q 100 230 95 220 Z" fill="rgba(255, 100, 0, 0.8)" stroke="red" className="animate-pulse" />
    )}
    
    <path d="M 60 100 L 60 190 A 10 10 0 0 0 70 200 L 130 200 A 10 10 0 0 0 140 190 L 140 100 Z" fill="rgba(184, 115, 51, 0.9)" stroke="#444" strokeWidth="2" />
    
    <rect x="95" y="30" width="10" height="160" rx="5" fill="rgba(255,255,255,0.8)" stroke="#333" />
    <rect x="98" y={180 - (waterTemp - 20)*2} width="4" height={(waterTemp - 20)*2 + 10} fill="red" />
    <circle cx="100" cy="185" r="6" fill="red" />
    
    <text x="120" y="80" fontSize="14" fontWeight="bold" fill="#333">{waterTemp.toFixed(1)}°C</text>
   </svg>

   <div className="w-full mt-4 text-xs text-slate-600 dark:text-[#a1a1aa] space-y-1">
    <div className="flex justify-between">
    <span className="font-bold text-slate-800 dark:text-[#ffffff]">Fuel Mass:</span>
    <span className="font-mono">{fuelMass.toFixed(2)} g</span>
    </div>
    <div className="flex justify-between">
    <span className="font-bold text-slate-800 dark:text-[#ffffff]">Water Temp:</span>
    <span className="font-mono">{waterTemp.toFixed(1)} °C</span>
    </div>
   </div>
   </div>

   <div className="w-full mt-4 flex items-center justify-between gap-4">
   <div className={`flex-1 bg-slate-200 dark:bg-[#121212] h-2 rounded-full lg:overflow- flex-col `}>
    <div className="bg-orange-500 h-full transition-all duration-100" style={{ width: `${(time/60)*100}%` }} />
   </div>
   <div className="text-sm font-mono">{time}s / 60s</div>
   <button onClick={handleStart} className={`flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded shadow dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40 flex-col `}>
    {running ? <Square size={16} /> : <Play size={16} />}
    {running ? 'Stop' : 'Start'}
   </button>
   </div>
  </div>

  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-sm border p-4 flex flex-col gap-4 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">Data & Analysis</h2>
   
   <div className="bg-slate-100 dark:bg-[#121212] p-3 rounded flex justify-between items-center">
   <div>
    <div className="text-xs text-slate-500 dark:text-[#71717a] uppercase font-bold">Mass Burned</div>
    <div className="text-2xl font-mono text-orange-700">{(initialFuelMass - fuelMass).toFixed(2)}g</div>
   </div>
   <button onClick={handleLog} disabled={time === 0} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
    Record Data
   </button>
   </div>

   <div className="flex-1 overflow-auto border rounded bg-slate-50 dark:bg-[#121212]">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-200 dark:bg-[#121212] sticky top-0">
    <tr>
     <th className="p-2">Fuel</th>
     <th className="p-2">Vol</th>
     <th className="p-2">Mass(g)</th>
     <th className="p-2">ΔT(°C)</th>
     <th className="p-2">q(J)</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 ? (
     <tr><td colSpan={5} className="p-4 text-center text-slate-500 dark:text-[#71717a]">No data recorded yet.</td></tr>
    ) : (
     logs.map((log, i) => (
     <tr key={i} className="border-b">
      <td className="p-2">{log.f.substring(0,4)}</td>
      <td className="p-2">{log.v}</td>
      <td className="p-2">{log.massBurned}</td>
      <td className="p-2">{log.deltaT}</td>
      <td className="p-2 font-mono font-bold text-orange-700">{log.q}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

   <div className="bg-orange-50 border border-orange-200 rounded p-4">
   <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
    <CheckCircle size={18} /> Knowledge Check
   </h3>
   <p className="text-sm text-orange-800 mb-3">
    In a separate experiment, a student burned <strong>{targetM.current} g</strong> of ethanol to heat <strong>{targetV.current} cm³</strong> of water. The temperature rise was <strong>{targetT.current} °C</strong>. Calculate the enthalpy of combustion of ethanol in <strong>kJ/mol</strong>. (c = 4.18 J/g°C, M_r = 46)
   </p>
   <div className="flex gap-2">
    <input 
    type="number" 
    value={answer}
    onChange={e => setAnswer(e.target.value)}
    placeholder="kJ/mol" 
    className="flex-1 px-3 py-1 border rounded"
    />
    <button onClick={checkAnswer} className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40">
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
