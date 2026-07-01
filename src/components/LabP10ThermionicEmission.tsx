import { useState, useMemo } from 'react';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabP10ThermionicEmission({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [heaterCurrent, setHeaterCurrent] = useState<number>(1.0);
 const [anodeVoltage, setAnodeVoltage] = useState<number>(1000);
 const [data, setData] = useState<{ id: number; v: number; vel: number; vel2: number }[]>([]);
 const [answer, setAnswer] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const e = 1.6e-19;
 const m = 9.11e-31;

 const actualVelocity = useMemo(() => {
 if (heaterCurrent < 1.5 || anodeVoltage <= 0) return 0;
 const v = Math.sqrt((2 * e * anodeVoltage) / m);
 const noise = 1 + (Math.random() - 0.5) * 0.04;
 return v * noise;
 }, [heaterCurrent, anodeVoltage]);

 const handleRecord = () => {
 if (heaterCurrent < 1.5) {
  alert("Heater current too low for emission! Increase to >1.5 A.");
  return;
 }
 if (anodeVoltage === 0) {
  alert("Anode voltage is 0. Electrons are not accelerated!");
  return;
 }
 const vel10_7 = actualVelocity / 1e7;
 setData([...data, { 
  id: Date.now(), 
  v: anodeVoltage, 
  vel: parseFloat(vel10_7.toFixed(2)), 
  vel2: parseFloat((vel10_7 * vel10_7).toFixed(2)) 
 }]);
 };

 const handleCheck = () => {
 const val = parseFloat(answer);
 if (val >= 1.6 && val <= 1.9) setIsCorrect(true);
 else setIsCorrect(false);
 };

 const n = data.length;
 const sumX = data.reduce((acc, d) => acc + d.v, 0);
 const sumY = data.reduce((acc, d) => acc + d.vel2, 0);
 const sumXY = data.reduce((acc, d) => acc + d.v * d.vel2, 0);
 const sumXX = data.reduce((acc, d) => acc + d.v * d.v, 0);
 const denom = n * sumXX - sumX * sumX;
 const slope = n > 1 && denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
 const intercept = n > 1 && denom !== 0 ? (sumY - slope * sumX) / n : 0;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Unit 18: Thermionic Emission" subtitle="Determine the specific charge of an electron." />

  
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg: overflow-y-auto lg:overflow-visible">
  {/* Left Column: Theory & Setup */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-6 lg:overflow-y-auto  ? 'flex' : 'hidden'} lg:flex`}>
   <div>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2">Theory</h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    When a metal filament is heated, free electrons gain enough thermal energy to escape the surface. This is called <strong>thermionic emission</strong>.
   </p>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    If a positive voltage (V) is applied to an anode, the emitted electrons are accelerated. The electrical work done (eV) is converted into kinetic energy:
   </p>
   <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-center font-mono text-sm mb-4 border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    eV = ½mv²
   </div>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    Rearranging this gives a linear relationship between v² and V:
   </p>
   <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-center font-mono text-sm border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    v² = (2e/m)V
   </div>
   </div>

   <div>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2">Setup</h2>
   <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
    Heater Current: {heaterCurrent.toFixed(1)} A
    </label>
    <input type="range" min="0" max="3" step="0.1" value={heaterCurrent} onChange={(e) => setHeaterCurrent(parseFloat(e.target.value))} className="w-full accent-orange-500" />
    <p className="text-xs text-slate-500 dark:text-[#71717a] mt-1">Requires &gt;1.5A to emit electrons.</p>
   </div>
   <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
    Anode Voltage: {anodeVoltage} V
    </label>
    <input type="range" min="0" max="5000" step="100" value={anodeVoltage} onChange={(e) => setAnodeVoltage(parseFloat(e.target.value))} className="w-full accent-blue-600" />
   </div>
   </div>
  </div>

  {/* Center Column: Simulation */}
  <div className={`w-full bg-[#000000] dark:!bg-[#121212] rounded-xl shadow-sm border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center relative overflow-  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className={`relative w-full aspect-video border-4 border-slate-600 dark:border-[#1c1b1b] rounded-[100px] bg-[#121212] dark:!bg-[#121212] flex items-center shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] flex-col `}>
    <div className="absolute left-10 w-4 h-24 bg-slate-400 dark:bg-[#121212] rounded flex items-center justify-center">
    <div className="absolute w-6 h-20 rounded-full blur-md transition-all duration-300" style={{ backgroundColor: heaterCurrent > 0.5 ? `rgba(255, 100, 0, ${heaterCurrent / 3})` : 'transparent', boxShadow: heaterCurrent > 1.0 ? `0 0 ${heaterCurrent * 10}px rgba(255,100,0,0.8)` : 'none' }} />
    </div>
    <div className="absolute right-16 w-4 h-32 bg-slate-300 dark:bg-[#121212] rounded border-2 border-slate-400 dark:border-[#1c1b1b] flex flex-col justify-between items-center">
    <div className="w-full h-12 bg-slate-300 dark:bg-[#121212]" />
    <div className="w-1 h-8 bg-transparent" />
    <div className="w-full h-12 bg-slate-300 dark:bg-[#121212]" />
    </div>
    {actualVelocity > 0 && (
    <div className="absolute left-[56px] h-2 bg-cyan-300 rounded-full" style={{ width: 'calc(100% - 120px)', boxShadow: '0 0 10px rgba(103, 232, 249, 0.8)', opacity: Math.min(1, (heaterCurrent - 1.5) * 2), filter: `blur(${Math.max(1, 4 - anodeVoltage/1000)}px)` }} />
    )}
   </div>

   <div className="mt-8 flex gap-8 text-white font-mono text-sm bg-[#121212] dark:bg-[#121212] p-4 rounded-lg border border-[#1c1b1b] dark:border-[#1c1b1b] w-full justify-between items-center">
    <div>
    <div className="text-slate-400 text-xs">MEASURED VELOCITY</div>
    <div className="text-xl text-cyan-400">
     {actualVelocity > 0 ? (actualVelocity / 1e7).toFixed(2) : '0.00'} × 10⁷ m/s
    </div>
    </div>
    <button onClick={handleRecord} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md font-sans font-bold shadow-lg active:scale-95 transition-all dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
    Record Data
    </button>
   </div>
  </div>

  {/* Right Column: Analysis */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <div className="p-4 border-b bg-slate-50 dark:bg-[#121212]">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Data & Analysis</h2>
   </div>
   
   <div className="p-4 flex-1 lg:overflow-y-auto">
   <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] text-sm">Measurements</h3>
    <button onClick={() => setData([])} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
    </div>
    <div className="max-h-40 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] rounded">
    <table className="w-full text-sm text-center">
     <thead className="bg-slate-100 dark:bg-[#121212] sticky top-0">
     <tr>
      <th className="py-2 border-b">V (V)</th>
      <th className="py-2 border-b">v (10⁷ m/s)</th>
      <th className="py-2 border-b">v² (10¹⁴)</th>
     </tr>
     </thead>
     <tbody>
     {data.length === 0 ? (
      <tr><td colSpan={3} className="py-4 text-slate-400 italic">No data recorded.</td></tr>
     ) : (
      data.map(d => (
      <tr key={d.id} className="border-b last:border-0 hover:bg-slate-50 dark:bg-[#121212]">
       <td className="py-1">{d.v}</td>
       <td className="py-1">{d.vel}</td>
       <td className="py-1">{d.vel2}</td>
      </tr>
      ))
     )}
     </tbody>
    </table>
    </div>
   </div>

   <div className="mb-6">
    <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] text-sm mb-2">Graph: v² vs V</h3>
    <div className="w-full aspect-video bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded relative">
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible p-4">
     <line x1="10" y1="90" x2="90" y2="90" stroke="#94a3b8" strokeWidth="1" />
     <line x1="10" y1="90" x2="10" y2="10" stroke="#94a3b8" strokeWidth="1" />
     {data.map(d => {
     const cx = 10 + (d.v / 5000) * 80;
     const cy = 90 - (d.vel2 / 20) * 80;
     return <circle key={d.id} cx={cx} cy={cy} r="1.5" fill="#2563eb" />;
     })}
     {n > 1 && (
     <line x1={10} y1={90 - (intercept / 20) * 80} x2={90} y2={90 - ((slope * 5000 + intercept) / 20) * 80} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2" />
     )}
    </svg>
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 dark:text-[#71717a]">V (Volts)</div>
    <div className="absolute top-1/2 -left-2 -translate-y-1/2 -rotate-90 text-[10px] text-slate-500 dark:text-[#71717a]">v² (10¹⁴)</div>
    </div>
    {n > 1 && (
    <div className="text-xs text-slate-500 dark:text-[#71717a] mt-2 text-center">
     Gradient = {slope.toFixed(4)} × 10¹⁴ C/kg
    </div>
    )}
   </div>

   <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900">
    <h3 className="font-semibold text-blue-800 text-sm mb-2 dark:text-[#ffffff]">Analysis</h3>
    <p className="text-xs text-blue-700 mb-3">
    Using your graph's gradient (2e/m), calculate the specific charge of an electron (e/m) in 10¹¹ C/kg.
    </p>
    <div className="flex gap-2 items-center">
    <input type="number" step="0.01" value={answer} onChange={(e) => { setAnswer(e.target.value); setIsCorrect(null); }} placeholder="e.g. 1.76" className="w-24 px-2 py-1 border rounded text-sm" />
    <span className="text-xs text-slate-600 dark:text-[#a1a1aa] font-mono">× 10¹¹ C/kg</span>
    <button onClick={handleCheck} className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">Check</button>
    </div>
    {isCorrect === true && <div className="mt-2 text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Correct! Expected ~1.76</div>}
    {isCorrect === false && <div className="mt-2 text-red-600 text-xs font-bold flex items-center gap-1"><XCircle className="w-4 h-4"/> Incorrect, try again.</div>}
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
