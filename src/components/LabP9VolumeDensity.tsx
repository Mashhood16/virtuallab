import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw} from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP9VolumeDensity({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [objectData, setObjectData] = useState({ mass: 0, volume: 0, density: 0, name: '' });
 const [step, setStep] = useState<'start' | 'on_balance' | 'in_water'>('start');
 
 const [massInput, setMassInput] = useState('');
 const [v1Input, setV1Input] = useState('');
 const [v2Input, setV2Input] = useState('');
 const [densityInput, setDensityInput] = useState('');
 const [feedback, setFeedback] = useState<string | null>(null);

 const materials = [
 { name: 'Aluminium', density: 2.7 },
 { name: 'Iron', density: 7.8 },
 { name: 'Copper', density: 8.9 },
 { name: 'Lead', density: 11.3 }
 ];

 const v1 = 50; // Initial water volume in mL

 useEffect(() => {
 generateObject();
 }, []);

 const generateObject = () => {
 const mat = materials[Math.floor(Math.random() * materials.length)];
 // random volume between 15 and 40 cm^3
 const vol = Math.floor(Math.random() * 25 + 15);
 const mass = parseFloat((vol * mat.density).toFixed(1));
 setObjectData({ mass, volume: vol, density: mat.density, name: mat.name });
 setStep('start');
 setMassInput('');
 setV1Input('');
 setV2Input('');
 setDensityInput('');
 setFeedback(null);
 };

 const checkAnswer = () => {
 const m = parseFloat(massInput);
 const v1_val = parseFloat(v1Input);
 const v2_val = parseFloat(v2Input);
 const d = parseFloat(densityInput);
 
 if (Math.abs(m - objectData.mass) > 0.1 || Math.abs(v1_val - v1) > 0.1 || Math.abs(v2_val - (v1 + objectData.volume)) > 0.1) {
  setFeedback('measurements_error');
  return;
 }

 const calcDensity = m / (v2_val - v1_val);
 if (Math.abs(calcDensity - d) < 0.2) {
  setFeedback('correct');
 } else {
  setFeedback('density_error');
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Physics Grade 9: Volume & Density" />

  
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
  {/* Column 1: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-4  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-2">Theory: Density</h2>
   <div className="prose prose-sm">
   <p>
    <strong>Density</strong> is the mass per unit volume of a substance. 
   </p>
   <div className={`bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-900 my-2 flex justify-center text-lg dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff] flex-col `}>
    &rho; = m / V
   </div>
   <p>
    To find the density of an irregular solid:
   </p>
   <ul className="list-disc pl-4 space-y-1">
    <li>Measure its mass (m) using an electronic balance.</li>
    <li>Measure initial water volume (V<sub>1</sub>) in a measuring cylinder.</li>
    <li>Immerse the solid completely in the water.</li>
    <li>Measure the final water volume (V<sub>2</sub>).</li>
    <li>The volume of the solid is V = V<sub>2</sub> - V<sub>1</sub>.</li>
   </ul>
   <p className="text-xs text-slate-500 dark:text-[#71717a] mt-4">
    Note: 1 mL of water = 1 cm&sup3; of volume.
   </p>
   </div>
  </div>

  {/* Column 2: Simulator */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center relative  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-2 w-full mb-4">Laboratory Bench</h2>

   <div className="flex gap-2 w-full justify-center mb-6">
   <button 
    onClick={() => setStep('start')}
    className={`px-3 py-1 rounded border text-sm transition-colors ${step === 'start' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-slate-50 dark:bg-[#121212] hover:bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'}`}
   >
    Table
   </button>
   <button 
    onClick={() => setStep('on_balance')}
    className={`px-3 py-1 rounded border text-sm transition-colors ${step === 'on_balance' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-slate-50 dark:bg-[#121212] hover:bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'}`}
   >
    Put on Balance
   </button>
   <button 
    onClick={() => setStep('in_water')}
    className={`px-3 py-1 rounded border text-sm transition-colors ${step === 'in_water' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-slate-50 dark:bg-[#121212] hover:bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'}`}
   >
    Drop in Cylinder
   </button>
   <button 
    onClick={generateObject}
    className={`px-3 py-1 rounded border text-sm ml-auto flex items-center gap-1 hover:bg-slate-100 dark:bg-[#121212] flex-col `}
   >
    <RotateCcw size={14}/> Reset
   </button>
   </div>

   <div className={`relative w-full h-[300px] bg-slate-100 dark:bg-[#121212] rounded-lg border flex items-end justify-center p-4 `}>
   
   {/* Balance */}
   <div className="absolute left-10 bottom-4 w-32 h-16 bg-white lg:bg-slate-300 dark:bg-[#121212] lg:dark:bg-[#121212] rounded flex flex-col items-center shadow-md border border-slate-400 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    <div className="w-24 h-2 bg-slate-400 dark:bg-[#121212] mt-2 rounded"></div>
    <div className="mt-4 bg-black text-green-400 font-mono px-2 py-1 rounded w-20 text-center text-sm border border-slate-600 dark:border-[#1c1b1b]">
    {step === 'on_balance' ? objectData.mass.toFixed(1) : '0.0'} g
    </div>
   </div>

   {/* Cylinder */}
   <div className={`absolute right-20 bottom-4 w-16 h-48 border-x-2 border-b-2 border-slate-400 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212]/50 rounded-b-lg relative overflow- flex-col `}>
    {/* Ticks */}
    {[20, 40, 60, 80, 100].map(val => (
    <div key={val} className="absolute w-4 border-b border-slate-400 dark:border-[#1c1b1b]" style={{ bottom: `${val}%` }}>
     <span className="absolute left-6 text-[10px] -translate-y-1/2">{val}</span>
    </div>
    ))}
    {/* Water */}
    <div 
    className="absolute bottom-0 w-full bg-blue-400/50 transition-all duration-1000 ease-in-out border-t-2 border-blue-500"
    style={{ height: `${step === 'in_water' ? v1 + objectData.volume : v1}%` }}
    ></div>
    {/* Object in water */}
    {step === 'in_water' && (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-600 dark:bg-[#121212] rounded-lg shadow-inner"></div>
    )}
   </div>

   {/* Object on table / balance */}
   {step === 'start' && (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-600 dark:!bg-[#121212] rounded-lg shadow-lg cursor-pointer hover:bg-slate-500 dark:!bg-[#121212]"></div>
   )}
   {step === 'on_balance' && (
    <div className="absolute bottom-20 left-10 translate-x-12 w-8 h-8 bg-slate-600 dark:!bg-[#121212] rounded-lg shadow-lg"></div>
   )}
   </div>
  </div>

  {/* Column 3: Analysis */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-4">
   <h2 className="text-lg font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-2">Record Data</h2>
   
   <div className="grid grid-cols-2 gap-4">
   <div>
    <label className="block text-xs font-medium text-slate-700 dark:text-[#ffffff] mb-1">Mass (g)</label>
    <input type="number" value={massInput} onChange={e=>setMassInput(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="0.0"/>
   </div>
   <div>
    <label className="block text-xs font-medium text-slate-700 dark:text-[#ffffff] mb-1">V1 (mL)</label>
    <input type="number" value={v1Input} onChange={e=>setV1Input(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="0"/>
   </div>
   <div>
    <label className="block text-xs font-medium text-slate-700 dark:text-[#ffffff] mb-1">V2 (mL)</label>
    <input type="number" value={v2Input} onChange={e=>setV2Input(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="0"/>
   </div>
   <div>
    <label className="block text-xs font-medium text-slate-700 dark:text-[#ffffff] mb-1">Calculated Density (g/cm&sup3;)</label>
    <input type="number" value={densityInput} onChange={e=>setDensityInput(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="0.0"/>
   </div>
   </div>
   
   <button 
   onClick={checkAnswer}
   className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors mt-2 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
   Verify Calculations
   </button>

   {feedback === 'measurements_error' && (
   <div className="p-3 bg-red-100 text-red-800 rounded-lg flex items-start gap-2 text-sm">
    <XCircle size={16} className="mt-0.5 shrink-0" />
    <span>Your raw measurements (Mass, V1, or V2) are incorrect. Check the balance and cylinder readings carefully.</span>
   </div>
   )}

   {feedback === 'density_error' && (
   <div className="p-3 bg-orange-100 text-orange-800 rounded-lg flex items-start gap-2 text-sm">
    <XCircle size={16} className="mt-0.5 shrink-0" />
    <span>Measurements are correct, but your calculated density is wrong. Use &rho; = m / (V2 - V1).</span>
   </div>
   )}

   {feedback === 'correct' && (
   <div className="p-3 bg-green-100 text-green-800 rounded-lg flex items-start gap-2 text-sm dark:text-[#ffffff]">
    <CheckCircle size={16} className="mt-0.5 shrink-0" />
    <div>
    <strong>Excellent!</strong><br />
    The density is {parseFloat(densityInput).toFixed(1)} g/cm&sup3;.<br/>
    Based on this, the material is likely <strong>{objectData.name}</strong>.
    </div>
   </div>
   )}
  </div>
  </div>
 </div>
 );
}
