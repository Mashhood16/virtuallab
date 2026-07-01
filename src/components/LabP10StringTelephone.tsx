import { useState } from 'react';
import { Play, Save, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit?: () => void;
}

const MATERIALS = [
 { id: 'cotton', name: 'Cotton String', mu: 0.002 },
 { id: 'nylon', name: 'Nylon Fishing Line', mu: 0.0005 },
 { id: 'mystery', name: 'Mystery String', mu: 0.0012 }, // Unknown to user
];

export default function LabP10StringTelephone({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [tension, setTension] = useState(20); // N
 const [length, setLength] = useState(10); // m
 const [materialId, setMaterialId] = useState('cotton');
 const [isPlaying, setIsPlaying] = useState(false);
 const [timeMeasured, setTimeMeasured] = useState<number | null>(null);
 
 const [data, setData] = useState<Array<{ id: number; tension: number; length: number; time: number; v: number; v2: number }>>([]);
 const [assessmentInput, setAssessmentInput] = useState('');
 const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 const selectedMaterial = MATERIALS.find(m => m.id === materialId) || MATERIALS[0];

 const handlePulse = () => {
 if (isPlaying) return;
 setIsPlaying(true);
 
 // Physics calculation: v = sqrt(T / mu)
 const trueVelocity = Math.sqrt(tension / selectedMaterial.mu);
 const trueTime = length / trueVelocity;
 
 // Add ±2% real-world noise
 const noise = 1 + (Math.random() - 0.5) * 0.04;
 const measuredTime = trueTime * noise;
 
 setTimeMeasured(measuredTime);
 
 setTimeout(() => {
  setIsPlaying(false);
 }, measuredTime * 1000);
 };

 const recordData = () => {
 if (timeMeasured === null) return;
 const v = length / timeMeasured;
 setData(prev => [
  ...prev,
  {
  id: Date.now(),
  tension,
  length,
  time: Number(timeMeasured.toFixed(4)),
  v: Number(v.toFixed(2)),
  v2: Number((v * v).toFixed(2))
  }
 ]);
 };

 const checkAssessment = () => {
 const userMu = parseFloat(assessmentInput);
 if (isNaN(userMu)) return;
 // Accept ±10% error
 const error = Math.abs(userMu - 0.0012) / 0.0012;
 if (error <= 0.1) {
  setAssessmentStatus('correct');
 } else {
  setAssessmentStatus('incorrect');
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Unit 13: String Telephone & Wave Speed" subtitle="Investigate the speed of a mechanical wave through a solid medium." />

  
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
  <div className="lg:flex-1 p-4 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 max-w-7xl mx-auto w-full overflow-y-auto lg:overflow-visible">
  {/* Column 1: Theory & Setup */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 border-b pb-2">Theory & Setup</h2>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] mb-6">
   <p>
    In a string telephone, a mechanical wave travels along a taut string. 
    The speed <span className="font-mono">v</span> of a transverse wave in a string depends on the tension <span className="font-mono">T</span> and the linear mass density <span className="font-mono">μ</span> (mass per unit length):
   </p>
   <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-center font-mono font-bold text-lg flex-col `}>
    v = √(T / μ)
   </div>
   <p className="mt-2">
    The time <span className="font-mono">t</span> taken for the wave to travel distance <span className="font-mono">L</span> is given by <span className="font-mono">t = L / v</span>.
   </p>
   </div>

   <div className="space-y-6 flex-1">
   <div>
    <label className="flex justify-between font-medium text-sm text-slate-700 dark:text-[#ffffff] mb-1">
    <span>String Material</span>
    </label>
    <select 
    value={materialId} 
    onChange={(e) => { setMaterialId(e.target.value); setTimeMeasured(null); }}
    className={`w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md bg-slate-50 dark:bg-[#121212] flex-col `}
    >
    {MATERIALS.map(m => (
     <option key={m.id} value={m.id}>{m.name}</option>
    ))}
    </select>
   </div>

   <div>
    <label className="flex justify-between font-medium text-sm text-slate-700 dark:text-[#ffffff] mb-1">
    <span>Tension (T)</span>
    <span className="text-emerald-600 font-bold">{tension} N</span>
    </label>
    <input 
    type="range" min="10" max="100" step="5"
    value={tension}
    onChange={(e) => { setTension(Number(e.target.value)); setTimeMeasured(null); }}
    className="w-full accent-emerald-600"
    />
   </div>

   <div>
    <label className="flex justify-between font-medium text-sm text-slate-700 dark:text-[#ffffff] mb-1">
    <span>Distance (L)</span>
    <span className="text-blue-600 font-bold">{length} m</span>
    </label>
    <input 
    type="range" min="5" max="50" step="1"
    value={length}
    onChange={(e) => { setLength(Number(e.target.value)); setTimeMeasured(null); }}
    className="w-full accent-blue-600"
    />
   </div>
   </div>
  </div>

  {/* Column 2: Simulation */}
  <div className={`bg-[#000000] dark:!bg-[#121212] rounded-2xl shadow-sm border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center relative overflow- ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold text-white mb-4 w-full text-left">Simulation</h2>
   
   <div className="flex-1 w-full flex flex-col items-center justify-center relative">
   <div className="w-full h-48 relative flex items-center justify-between px-8">
    {/* Cup A */}
    <div className="flex flex-col items-center z-10 relative">
    <div className={`w-8 h-12 bg-red-500 rounded-b-md border-t-4 border-red-700 rotate-90 flex-col `} />
    <span className="absolute -top-8 text-white text-xs">Speaker</span>
    </div>

    {/* The String */}
    <div className="lg:flex-1 h-0.5 bg-white lg:bg-slate-500 dark:bg-[#121212] lg:dark:bg-[#121212] relative flex items-center flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    {isPlaying && timeMeasured && (
     <div 
     className="absolute w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]"
     style={{
      animation: `pulseTravel ${timeMeasured}s linear forwards`
     }}
     />
    )}
    </div>

    {/* Cup B */}
    <div className="flex flex-col items-center z-10 relative">
    <div className="w-8 h-12 bg-blue-500 rounded-b-md border-t-4 border-blue-700 -rotate-90 dark:bg-teal-950/20 dark:border-teal-900" />
    <span className="absolute -top-8 text-white text-xs">Listener</span>
    </div>
   </div>

   <div className="mt-8 flex flex-col items-center">
    <div className="text-4xl font-mono text-emerald-400 font-bold bg-black/50 px-6 py-2 rounded-xl border border-emerald-900 mb-4">
    {isPlaying ? 'Measuring...' : (timeMeasured ? `${timeMeasured.toFixed(4)} s` : '0.0000 s')}
    </div>
    <button 
    onClick={handlePulse}
    disabled={isPlaying}
    className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white rounded-full font-bold shadow-lg transition-all active:scale-95 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
    >
    <Play className="w-5 h-5" /> {isPlaying ? 'Pulsing...' : 'Send Pulse'}
    </button>
   </div>
   </div>

   <style>{`
   @keyframes pulseTravel {
    0% { left: 0%; transform: translateY(0); }
    10% { transform: translateY(-10px); }
    20% { transform: translateY(10px); }
    30% { transform: translateY(-8px); }
    40% { transform: translateY(8px); }
    50% { transform: translateY(-5px); }
    60% { transform: translateY(5px); }
    70% { transform: translateY(-3px); }
    80% { transform: translateY(3px); }
    90% { transform: translateY(-1px); }
    100% { left: 100%; transform: translateY(0); }
   }
   `}</style>
  </div>

  {/* Column 3: Data & Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col `}>
   <div className="flex justify-between items-center mb-4">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Data Logger</h2>
   <button 
    onClick={recordData}
    disabled={timeMeasured === null || isPlaying}
    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white rounded text-sm font-medium transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
    <Save className="w-4 h-4" /> Record Data
   </button>
   </div>

   <div className="overflow-auto max-h-48 border border-slate-200 dark:border-[#1c1b1b] rounded-lg mb-4">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0">
    <tr>
     <th className="px-3 py-2 border-b">T (N)</th>
     <th className="px-3 py-2 border-b">L (m)</th>
     <th className="px-3 py-2 border-b">t (s)</th>
     <th className="px-3 py-2 border-b">v (m/s)</th>
     <th className="px-3 py-2 border-b">v² (m²/s²)</th>
    </tr>
    </thead>
    <tbody>
    {data.length === 0 && (
     <tr>
     <td colSpan={5} className="px-3 py-4 text-center text-slate-400 italic">No data recorded yet</td>
     </tr>
    )}
    {data.map(d => (
     <tr key={d.id} className="border-b last:border-0 hover:bg-slate-50 dark:bg-[#121212]">
     <td className="px-3 py-2">{d.tension}</td>
     <td className="px-3 py-2">{d.length}</td>
     <td className="px-3 py-2">{d.time}</td>
     <td className="px-3 py-2 font-medium">{d.v}</td>
     <td className="px-3 py-2 text-blue-600">{d.v2}</td>
     </tr>
    ))}
    </tbody>
   </table>
   </div>

   <div className="flex-1 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-4 relative mb-4">
   <h3 className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase absolute top-2 left-3">v² vs T Graph</h3>
   {/* Simple Scatter Plot */}
   <div className="w-full h-full pt-6">
    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
     {/* Grid */}
     <line x1="10" y1="90" x2="100" y2="90" stroke="#cbd5e1" strokeWidth="1" />
     <line x1="10" y1="10" x2="10" y2="90" stroke="#cbd5e1" strokeWidth="1" />
     
     {data.map((d, i) => {
     // Map T (10-100) to X (10-100)
     const x = 10 + (d.tension / 100) * 90;
     // Max v2 is roughly 100 / 0.0005 = 200,000. Let's scale dynamically.
     const maxV2 = Math.max(...data.map(item => item.v2), 1000);
     const y = 90 - (d.v2 / maxV2) * 80;
     return <circle key={i} cx={x} cy={y} r="2" fill="#2563eb" />;
     })}
    </svg>
   </div>
   </div>

   <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 dark:bg-[#121212] dark:border-[#1c1b1b]">
   <h3 className="font-bold text-amber-800 text-sm mb-2 dark:text-[#ffffff]">Assessment: Mystery String</h3>
   <p className="text-xs text-amber-700 mb-3">
    Select the "Mystery String" material. Record data for varying tensions, calculate velocity <span className="italic">v</span>, and determine the unknown linear mass density <span className="font-mono">μ</span> using <span className="font-mono">μ = T / v²</span>.
   </p>
   <div className="flex gap-2">
    <input 
    type="number" 
    step="0.0001"
    placeholder="e.g. 0.0015"
    value={assessmentInput}
    onChange={(e) => { setAssessmentInput(e.target.value); setAssessmentStatus('idle'); }}
    className="flex-1 px-3 py-1.5 border border-amber-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
    />
    <span className="text-xs self-center text-amber-700 font-bold mr-2">kg/m</span>
    <button 
    onClick={checkAssessment}
    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm font-bold transition-colors dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"
    >
    Check
    </button>
   </div>
   {assessmentStatus === 'correct' && (
    <div className="mt-2 flex items-center gap-1 text-emerald-600 text-sm font-bold">
    <CheckCircle className="w-4 h-4" /> Correct! The mystery string is approx 0.0012 kg/m.
    </div>
   )}
   {assessmentStatus === 'incorrect' && (
    <div className="mt-2 flex items-center gap-1 text-red-600 text-sm font-bold">
    <XCircle className="w-4 h-4" /> Incorrect. Try collecting more data!
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
