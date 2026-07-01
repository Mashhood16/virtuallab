import { useState, useEffect } from 'react';
import { Wind, Calculator, Database } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabC11PhasesOfMatter({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [liquidType, setLiquidType] = useState<'water'|'ethanol'>('water');
 const [extPressure, setExtPressure] = useState(1.0); // atm
 const [temperature, setTemperature] = useState(298); // K
 
 const getVaporPressure = (T: number, type: string) => {
 const Tc = T - 273.15;
 let A, B, C;
 if (type === 'water') {
  A = 8.07131; B = 1730.63; C = 233.426;
 } else {
  A = 8.20417; B = 1642.89; C = 230.300;
 }
 const p_mmHg = Math.pow(10, A - B / (C + Tc));
 return p_mmHg / 760; 
 };

 const vp = getVaporPressure(temperature, liquidType);
 const isBoiling = vp >= extPressure;

 const [logs, setLogs] = useState<{liquid: string, T: number, Pext: number, vp: number, boiling: boolean}[]>([]);
 const logData = () => {
 setLogs([...logs, {liquid: liquidType, T: temperature, Pext: extPressure, vp, boiling: isBoiling}]);
 };

 // Assessment
 const [randomPext, setRandomPext] = useState<number>(1.0);
 useEffect(() => {
 setRandomPext(Number((0.3 + Math.random() * 1.5).toFixed(2)));
 }, []);

 const [answerTemp, setAnswerTemp] = useState('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
 
 const checkAnswer = () => {
 const parsed = parseFloat(answerTemp);
 if (!isNaN(parsed)) {
  const expectedVP = getVaporPressure(parsed, liquidType);
  if (Math.abs(expectedVP - randomPext) < 0.1) {
  setIsCorrect(true);
  } else {
  setIsCorrect(false);
  }
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Phases of Matter & Vapor Pressure" subtitle="Vacuum Distillation & Boiling Points" />

  
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
  
  {/* Column 1 */}
  <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
    <Wind className="w-5 h-5 text-orange-500" />
    Vacuum Distillation Setup
   </h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed mb-4">
    A liquid boils when its <strong>Vapor Pressure</strong> equals the <strong>External Ambient Pressure</strong>. 
    By lowering the external pressure (using a vacuum), liquids can boil at much lower temperatures!
   </p>
   </div>

   <div className={`flex-1 bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
   <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Select Liquid Phase</label>
   <select 
    value={liquidType} onChange={(e) => setLiquidType(e.target.value as 'water'|'ethanol')}
    className={`w-full mb-4 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 dark:bg-[#121212] flex-col `}
   >
    <option value="water">Water (H₂O)</option>
    <option value="ethanol">Ethanol (C₂H₅OH)</option>
   </select>

   <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">External Pressure: {extPressure.toFixed(2)} atm</label>
   <input 
    type="range" min="0.1" max="2.0" step="0.05" 
    value={extPressure} onChange={(e) => setExtPressure(parseFloat(e.target.value))}
    className="w-full mb-4 accent-blue-500"
   />

   <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Temperature: {temperature} K</label>
   <input 
    type="range" min="273" max="400" step="1" 
    value={temperature} onChange={(e) => setTemperature(parseInt(e.target.value))}
    className="w-full mb-6 accent-red-500"
   />

   <div className={`p-3 bg-slate-50 dark:!bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg shadow-sm text-center flex-col `}>
    <span className="text-xs text-slate-500 dark:text-[#71717a] font-bold uppercase tracking-wider block mb-1">Current Vapor Pressure</span>
    <span className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{vp.toFixed(3)} atm</span>
   </div>
   </div>
  </div>

  {/* Column 2 */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center justify-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] w-full mb-4 text-center">Boiling Simulator</h2>
   
   <svg viewBox="0 0 200 300" className="w-full h-80 bg-slate-100 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b] overflow-hidden relative">
   <rect x="50" y={isBoiling ? "20" : "80"} width="100" height="10" fill="#64748b" className="transition-all duration-1000" />
   <rect x="95" y="0" width="10" height={isBoiling ? "20" : "80"} fill="#94a3b8" className="transition-all duration-1000" />
   <text x="100" y="15" textAnchor="middle" className="text-[10px] font-bold fill-slate-700">P_ext = {extPressure.toFixed(2)}</text>
   
   <path d="M 50 0 L 50 250 A 20 20 0 0 0 70 270 L 130 270 A 20 20 0 0 0 150 250 L 150 0" fill="none" stroke="#475569" strokeWidth="4" />
   
   <path d="M 52 150 L 148 150 L 148 250 A 18 18 0 0 1 130 268 L 70 268 A 18 18 0 0 1 52 250 Z" fill={liquidType === 'water' ? "#38bdf8" : "#a78bfa"} opacity="0.6" className="transition-colors duration-500" />
   
   {isBoiling && (
    <g className="animate-bounce">
    <circle cx="80" cy="200" r="4" fill="white" opacity="0.8" />
    <circle cx="120" cy="180" r="6" fill="white" opacity="0.8" />
    <circle cx="100" cy="220" r="5" fill="white" opacity="0.8" />
    <circle cx="90" cy="160" r="3" fill="white" opacity="0.8" />
    </g>
   )}
   
   {isBoiling && (
    <g>
    <circle cx="100" cy="100" r="20" fill="white" opacity="0.6" filter="blur(4px)" />
    <circle cx="70" cy="120" r="15" fill="white" opacity="0.6" filter="blur(4px)" />
    <circle cx="130" cy="90" r="25" fill="white" opacity="0.6" filter="blur(4px)" />
    </g>
   )}

   <text x="100" y="290" textAnchor="middle" className="text-xs font-bold fill-slate-500">T = {temperature} K</text>
   </svg>

   <button onClick={logData} className={`mt-6 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg font-semibold flex items-center gap-2 `}>
   <Database className="w-4 h-4" /> Log T-P Data Point
   </button>
  </div>

  {/* Column 3 */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col gap-6 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex-1">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
    <Database className="w-5 h-5 text-emerald-500" />
    Phase Data
   </h2>
   <div className="lg:overflow-y-auto max-h-48 border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
    <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff] sticky top-0">
     <tr>
     <th className="px-3 py-2">Liquid</th>
     <th className="px-3 py-2">T (K)</th>
     <th className="px-3 py-2">P (atm)</th>
     <th className="px-3 py-2">Boiling?</th>
     </tr>
    </thead>
    <tbody>
     {logs.length === 0 ? (
     <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-500 dark:text-[#71717a] italic">No points logged.</td></tr>
     ) : (
     logs.map((l, i) => (
      <tr key={i} className="border-b border-slate-100">
      <td className="px-3 py-2 capitalize">{l.liquid}</td>
      <td className="px-3 py-2">{l.T}</td>
      <td className="px-3 py-2">{l.vp.toFixed(3)}</td>
      <td className="px-3 py-2">
       <span className={`px-2 py-1 text-xs rounded-full ${l.boiling ? 'bg-red-100 text-red-700' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'}`}>
       {l.boiling ? 'Yes' : 'No'}
       </span>
      </td>
      </tr>
     ))
     )}
    </tbody>
    </table>
   </div>
   </div>

   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
    <Calculator className="w-5 h-5 text-indigo-500" />
    Clausius-Clapeyron Challenge
   </h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    If the pressure is drastically reduced to <strong>{randomPext.toFixed(2)} atm</strong>, at what <strong>Temperature (K)</strong> would the {liquidType} begin to boil? Use the simulator to find it experimentally.
   </p>
   <div className="flex gap-2">
    <input 
    type="number" step="1" placeholder="Temperature (K)" 
    value={answerTemp} onChange={(e) => setAnswerTemp(e.target.value)}
    className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <button 
    onClick={checkAnswer} 
    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
     Verify
    </button>
   </div>
   {isCorrect === true && <p className="text-emerald-600 text-sm font-bold mt-2">Correct! You found the new boiling point.</p>}
   {isCorrect === false && <p className="text-red-500 text-sm font-bold mt-2">Incorrect. Keep adjusting the temperature slider.</p>}
   </div>
  </div>

  </div>
 </div>
 );
}
