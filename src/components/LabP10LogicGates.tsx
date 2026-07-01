import { useState, useMemo } from 'react';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

type GateType = 'AND' | 'OR' | 'NAND' | 'NOR' | 'MYSTERY';

export default function LabP10LogicGates({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [gate, setGate] = useState<GateType>('AND');
 const [vA, setVa] = useState<number>(0);
 const [vB, setVb] = useState<number>(0);
 
 const [data, setData] = useState<{ id: number; vA: number; vB: number; vOut: number }[]>([]);
 const [answer, setAnswer] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const sigmoid = (v: number) => 1 / (1 + Math.exp(-10 * (v - 1.5)));

 const vOut = useMemo(() => {
 const aEff = sigmoid(vA);
 const bEff = sigmoid(vB);
 let outProb = 0;
 
 const xorProb = aEff + bEff - 2 * aEff * bEff;

 switch (gate) {
  case 'AND': outProb = aEff * bEff; break;
  case 'OR': outProb = aEff + bEff - aEff * bEff; break;
  case 'NAND': outProb = 1 - (aEff * bEff); break;
  case 'NOR': outProb = 1 - (aEff + bEff - aEff * bEff); break;
  case 'MYSTERY': outProb = xorProb; break;
 }

 const noise = (Math.random() - 0.5) * 0.1;
 const outV = 0.2 + 4.6 * outProb + noise;
 return Math.max(0, Math.min(5, outV));
 }, [vA, vB, gate]);

 const handleRecord = () => {
 setData([...data, { 
  id: Date.now(), 
  vA: parseFloat(vA.toFixed(2)), 
  vB: parseFloat(vB.toFixed(2)), 
  vOut: parseFloat(vOut.toFixed(2)) 
 }]);
 };

 const handleCheck = () => {
 if (answer.toUpperCase().trim() === 'XOR') {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Unit 18: Logic Gates" subtitle="Test different logic gates and observe their truth tables with continuous voltages." />

  
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg: overflow-y-auto lg:overflow-visible">
  {/* Left Column: Theory & Setup */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-6 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2">Theory</h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">In real electronic circuits, logic gates process continuous voltages. TTL (Transistor-Transistor Logic) defines specific voltage thresholds.</p>
   <ul className="text-sm text-slate-600 dark:text-[#a1a1aa] list-disc pl-5 mb-4">
    <li><b>HIGH (1):</b> Between 2.0V and 5.0V</li>
    <li><b>LOW (0):</b> Between 0.0V and 0.8V</li>
    <li><b>Undefined:</b> Between 0.8V and 2.0V</li>
   </ul>
   </div>
   <div>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2">Setup</h2>
   <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Gate Type</label>
    <select value={gate} onChange={e => {setGate(e.target.value as GateType); setData([]); setIsCorrect(null);}} className="w-full p-2 border rounded text-sm">
    <option value="AND">AND</option>
    <option value="OR">OR</option>
    <option value="NAND">NAND</option>
    <option value="NOR">NOR</option>
    <option value="MYSTERY">MYSTERY GATE</option>
    </select>
   </div>
   <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Input A Voltage: {vA.toFixed(2)} V</label>
    <input type="range" min="0" max="5" step="0.1" value={vA} onChange={e => setVa(parseFloat(e.target.value))} className="w-full accent-blue-600" />
   </div>
   <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Input B Voltage: {vB.toFixed(2)} V</label>
    <input type="range" min="0" max="5" step="0.1" value={vB} onChange={e => setVb(parseFloat(e.target.value))} className="w-full accent-blue-600" />
   </div>
   </div>
  </div>

  {/* Center Column: Simulation */}
  <div className={`bg-[#000000] dark:!bg-[#121212] rounded-xl shadow-sm border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center relative overflow- ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className={`relative w-full aspect-square max-w-sm bg-green-900 border-4 border-green-800 rounded-lg p-4 shadow-xl flex flex-col justify-between `}>
   <div className="text-white/50 text-xs font-mono absolute top-2 left-2">IC 74HCXX</div>
   
   <div className="flex flex-col gap-8 mt-8">
    <div className="flex items-center gap-4">
    <div className={`bg-[#121212] dark:bg-[#121212] border-2 border-slate-600 dark:border-[#1c1b1b] rounded p-2 text-cyan-400 font-mono w-16 text-center flex-col `}>{vA.toFixed(1)}V</div>
    <div className="w-16 h-1 bg-cyan-600" />
    </div>
    <div className="flex items-center gap-4">
    <div className={`bg-[#121212] dark:bg-[#121212] border-2 border-slate-600 dark:border-[#1c1b1b] rounded p-2 text-cyan-400 font-mono w-16 text-center flex-col `}>{vB.toFixed(1)}V</div>
    <div className="w-16 h-1 bg-cyan-600" />
    </div>
   </div>

   <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#121212] dark:!bg-[#121212] border-2 border-[#1c1b1b] dark:border-[#1c1b1b] rounded-lg flex items-center justify-center shadow-2xl flex-col `}>
    <div className="text-slate-400 font-bold text-xl">{gate === 'MYSTERY' ? '?' : gate}</div>
   </div>

   <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-4">
    <div className="w-16 h-1 bg-indigo-600" />
    <div className="bg-[#121212] dark:bg-[#121212] border-2 border-slate-600 dark:border-[#1c1b1b] rounded p-2 text-indigo-400 font-mono w-16 text-center shadow-[0_0_15px_#4158D1]">{vOut.toFixed(1)}V</div>
   </div>
   </div>

   <div className="mt-8 w-full flex justify-center">
   <button onClick={handleRecord} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-md font-sans font-bold shadow-lg active:scale-95 transition-all dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">Record Data</button>
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
      <th className="py-2 border-b">V_A (V)</th>
      <th className="py-2 border-b">V_B (V)</th>
      <th className="py-2 border-b">V_out (V)</th>
     </tr>
     </thead>
     <tbody>
     {data.length === 0 ? (
      <tr><td colSpan={3} className="py-4 text-slate-400 italic">No data recorded.</td></tr>
     ) : (
      data.map(d => (
      <tr key={d.id} className="border-b last:border-0 hover:bg-slate-50 dark:bg-[#121212]">
       <td className="py-1">{d.vA}</td>
       <td className="py-1">{d.vB}</td>
       <td className="py-1">{d.vOut}</td>
      </tr>
      ))
     )}
     </tbody>
    </table>
    </div>
   </div>

   <div className="mb-6">
    <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] text-sm mb-2">Graph: V_out vs V_A</h3>
    <div className="w-full aspect-video bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded relative">
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible p-4">
     <line x1="10" y1="90" x2="90" y2="90" stroke="#94a3b8" strokeWidth="1" />
     <line x1="10" y1="90" x2="10" y2="10" stroke="#94a3b8" strokeWidth="1" />
     {data.map(d => {
     const cx = 10 + (d.vA / 5) * 80;
     const cy = 90 - (d.vOut / 5) * 80;
     return <circle key={d.id} cx={cx} cy={cy} r="2" fill="#4158D1" />;
     })}
    </svg>
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 dark:text-[#71717a]">V_A (Volts)</div>
    <div className="absolute top-1/2 -left-2 -translate-y-1/2 -rotate-90 text-[10px] text-slate-500 dark:text-[#71717a]">V_out (Volts)</div>
    </div>
   </div>

   <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900">
    <h3 className="font-semibold text-blue-800 text-sm mb-2 dark:text-[#ffffff]">Analysis</h3>
    <p className="text-xs text-blue-700 mb-3">
    Select the "MYSTERY GATE" and test different inputs to construct its truth table. Identify the Boolean function.
    </p>
    <div className="flex gap-2 items-center">
    <input type="text" value={answer} onChange={(e) => { setAnswer(e.target.value); setIsCorrect(null); }} placeholder="e.g. AND" className="w-24 px-2 py-1 border rounded text-sm uppercase" />
    <button onClick={handleCheck} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">Check</button>
    </div>
    {isCorrect === true && <div className="mt-2 text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Correct! It's an XOR gate.</div>}
    {isCorrect === false && <div className="mt-2 text-red-600 text-xs font-bold flex items-center gap-1"><XCircle className="w-4 h-4"/> Incorrect, try testing combinations.</div>}
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
