import { useState, useEffect } from 'react';
import { Plus, RotateCcw, Check, Activity } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC10DiluteSolution({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [stockConcentration] = useState(2.0);
 const [volumeStock, setVolumeStock] = useState(0);
 const [volumeWater, setVolumeWater] = useState(0);
 const [logs, setLogs] = useState<{vStock: number, vWater: number, vTotal: number, conc: number}[]>([]);
 const [equation, setEquation] = useState<string>("Empty Flask");
 const [assessmentAns, setAssessmentAns] = useState("");
 const [assessmentStatus, setAssessmentStatus] = useState<boolean | null>(null);
 const [randomTarget] = useState(() => (Math.random() * 0.8 + 0.2).toFixed(2));

 const totalVolume = volumeStock + volumeWater;
 const currentConcentration = totalVolume > 0 ? (stockConcentration * volumeStock) / totalVolume : 0;
 const maxVolume = 100;

 useEffect(() => {
 if (volumeStock > 0 && volumeWater === 0) {
  setEquation(`CuSO₄(aq, ${stockConcentration.toFixed(1)}M)`);
 } else if (volumeStock > 0 && volumeWater > 0) {
  setEquation(`CuSO₄(aq, ${stockConcentration.toFixed(1)}M) + H₂O(l) ➔ Diluted CuSO₄(aq, ${currentConcentration.toFixed(2)}M)`);
 } else if (volumeStock === 0 && volumeWater > 0) {
  setEquation(`H₂O(l)`);
 } else {
  setEquation("Empty Flask");
 }
 }, [volumeStock, volumeWater, stockConcentration, currentConcentration]);

 const addStock = () => { if (totalVolume + 10 <= maxVolume) setVolumeStock(v => v + 10); };
 const addWater = () => { if (totalVolume + 10 <= maxVolume) setVolumeWater(v => v + 10); };
 const reset = () => { setVolumeStock(0); setVolumeWater(0); setAssessmentStatus(null); setAssessmentAns(""); };
 const logData = () => { if (totalVolume > 0) setLogs([...logs, { vStock: volumeStock, vWater: volumeWater, vTotal: totalVolume, conc: currentConcentration }]); };

 const checkAns = () => {
 const correctV1 = (parseFloat(randomTarget) * 100) / stockConcentration;
 setAssessmentStatus(Math.abs(parseFloat(assessmentAns) - correctV1) < 1.0);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Dilution of Solutions" subtitle="C10 Chemistry" variant="blue" />
  
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">Theory & Setup</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa]">Dilution is the process of decreasing the concentration of a solute in a solution by adding more solvent (water).</p>
   <div className={`bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    <h3 className="font-semibold text-blue-800 mb-2 dark:text-[#ffffff]">Dilution Equation</h3>
    <p className="text-lg font-mono text-center text-blue-900 dark:text-[#ffffff]">M₁V₁ = M₂V₂</p>
    <ul className="mt-2 text-sm text-blue-800 space-y-1 dark:text-[#ffffff]">
    <li><strong>M₁</strong> = Initial Molarity (Stock)</li>
    <li><strong>V₁</strong> = Volume of Stock added</li>
    <li><strong>M₂</strong> = Final Molarity</li>
    <li><strong>V₂</strong> = Total Final Volume</li>
    </ul>
   </div>
   <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mt-4">Procedure</h3>
   <ol className="list-decimal list-inside text-slate-600 dark:text-[#a1a1aa] space-y-2 text-sm">
    <li>Click <strong>Stock CuSO₄</strong> to add 10mL increments.</li>
    <li>Click <strong>Distilled H₂O</strong> to dilute the solution.</li>
    <li>Observe the concentration change and the dynamic equation.</li>
    <li>Click <strong>Record Data</strong> to log measurements.</li>
   </ol>
  </div>
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-6 w-full text-left">Interactive Simulation</h2>
   <div className={`w-full bg-[#000000] dark:bg-[#121212] text-green-400 font-mono p-4 rounded-lg shadow-inner mb-8 min-h-[80px] flex items-center justify-center text-center text-lg flex-col `}>{equation}</div>
   <div className="flex gap-8 mb-12">
    <button onClick={addStock} disabled={totalVolume >= maxVolume} className="flex flex-col items-center gap-2 group disabled:opacity-50">
     <div className={`w-16 h-24 bg-blue-100 border-4 border-slate-300 dark:border-[#1c1b1b] rounded-t-lg rounded-b-md relative overflow- group-hover:-translate-y-1 transition-transform shadow-md flex-col `}>
      <div className="absolute bottom-0 w-full h-3/4 bg-blue-600"></div><div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-6 border-2 border-slate-300 dark:border-[#1c1b1b] rounded-sm"></div>
     </div>
     <span className="font-semibold text-sm text-slate-700 dark:text-[#ffffff] bg-slate-100 dark:bg-[#121212] px-2 py-1 rounded">Stock CuSO₄</span>
     <span className="text-xs text-blue-600 font-bold">+10 mL</span>
    </button>
    <button onClick={addWater} disabled={totalVolume >= maxVolume} className="flex flex-col items-center gap-2 group disabled:opacity-50">
     <div className="w-16 h-24 bg-slate-50 dark:!bg-[#121212] border-4 border-slate-300 dark:border-[#1c1b1b] rounded-t-lg rounded-b-md relative overflow-hidden group-hover:-translate-y-1 transition-transform shadow-md">
      <div className="absolute bottom-0 w-full h-3/4 bg-blue-100/50"></div><div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-6 border-2 border-slate-300 dark:border-[#1c1b1b] rounded-sm"></div>
     </div>
     <span className="font-semibold text-sm text-slate-700 dark:text-[#ffffff] bg-slate-100 dark:bg-[#121212] px-2 py-1 rounded">Distilled H₂O</span>
     <span className="text-xs text-blue-400 font-bold">+10 mL</span>
    </button>
   </div>
   <div className="relative w-48 h-64 flex justify-center items-end">
    <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-lg">
     <path d="M40,10 L60,10 L60,60 C60,60 85,80 85,130 C85,145 75,150 50,150 C25,150 15,145 15,130 C15,80 40,60 40,60 Z" fill="rgba(255,255,255,0.8)" stroke="#cbd5e1" strokeWidth="3" />
     <clipPath id="flask-clip"><path d="M40,10 L60,10 L60,60 C60,60 85,80 85,130 C85,145 75,150 50,150 C25,150 15,145 15,130 C15,80 40,60 40,60 Z" /></clipPath>
     <g clipPath="url(#flask-clip)">
      {totalVolume > 0 && <rect x="0" y={150 - (totalVolume / maxVolume) * 140} width="100" height={150} fill={`rgba(37, 99, 235, ${Math.max(0.1, currentConcentration / stockConcentration)})`} className="transition-all duration-500 ease-in-out" />}
     </g>
     <line x1="45" y1="40" x2="55" y2="40" stroke="#94a3b8" strokeWidth="2" />
     <text x="65" y="45" fontSize="8" fill="#64748b">100mL</text>
    </svg>
    <div className="absolute top-0 right-[-60px] bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] p-2 rounded shadow-md flex flex-col items-center">
     <Activity size={20} className="text-slate-500 dark:text-[#71717a] mb-1" />
     <span className="text-xs text-slate-500 dark:text-[#71717a]">Conc.</span>
     <span className="font-mono font-bold text-blue-600">{currentConcentration.toFixed(2)} M</span>
    </div>
   </div>
   <div className="mt-8 flex gap-4">
    <button onClick={logData} disabled={totalVolume===0} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"><Plus size={18} /> Record Data</button>
    <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg transition-colors"><RotateCcw size={18} /> Reset</button>
   </div>
  </div>
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-6 `}>
   <div>
    <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4">Data Log</h2>
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
     <table className="w-full text-sm text-left">
      <thead className="bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff]">
       <tr><th className="px-4 py-2">V₁ (mL)</th><th className="px-4 py-2">H₂O (mL)</th><th className="px-4 py-2">V₂ (mL)</th><th className="px-4 py-2">M₂ (M)</th></tr>
      </thead>
      <tbody>
       {logs.length === 0 ? <tr><td colSpan={4} className="px-4 py-4 text-center text-slate-500 dark:text-[#71717a] italic">No data.</td></tr> : logs.map((log, i) => (
        <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 dark:bg-[#121212]">
         <td className="px-4 py-2">{log.vStock}</td><td className="px-4 py-2">{log.vWater}</td><td className="px-4 py-2">{log.vTotal}</td><td className="px-4 py-2 font-mono text-blue-600">{log.conc.toFixed(2)}</td>
        </tr>
       ))}
      </tbody>
     </table>
    </div>
   </div>
   <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 mt-auto dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2 dark:text-[#ffffff]"><Check size={20} /> Analysis Check</h3>
    <p className="text-sm text-amber-800 mb-4 dark:text-[#ffffff]">Suppose you need <strong>100 mL</strong> of a <strong>{randomTarget} M</strong> CuSO₄ solution. What volume of the {stockConcentration.toFixed(1)} M stock (V₁) is required?</p>
    <div className="flex gap-2">
     <input type="number" value={assessmentAns} onChange={(e) => setAssessmentAns(e.target.value)} placeholder="V1 in mL" className="flex-1 px-3 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 dark:bg-[#121212]" />
     <button onClick={checkAns} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors font-medium dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40">Check</button>
    </div>
    {assessmentStatus === true && <p className="mt-2 text-sm text-green-700 font-semibold">Correct! V₁ = (M₂ × V₂) / M₁</p>}
    {assessmentStatus === false && <p className="mt-2 text-sm text-red-600 font-semibold">Incorrect. Try using M₁V₁ = M₂V₂.</p>}
   </div>
  </div>
  </div>
 </div>
 );
}
