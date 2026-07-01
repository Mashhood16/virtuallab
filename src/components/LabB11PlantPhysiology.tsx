import { useState, useEffect, useRef } from 'react';
import { Droplets, FlaskConical, Activity, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabB11PlantPhysiology({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeTab, setActiveTab] = useState<'water' | 'xylem'>('water');
 
 // Water Potential State
 const [sucroseMolarity, setSucroseMolarity] = useState<number>(0);
 const [dataPoints, setDataPoints] = useState<{ m: number; change: number }[]>([]);
 const [isSimulatingWP, setIsSimulatingWP] = useState(false);
 const [currentMass, setCurrentMass] = useState(5.0);

 // Xylem State
 const [temperature, setTemperature] = useState<number>(20);
 const [humidity, setHumidity] = useState<number>(50);
 const [timePassed, setTimePassed] = useState<number>(0);
 const [isSimulatingXylem, setIsSimulatingXylem] = useState(false);
 const requestRef = useRef<number>(0);

 // Assessment State
 const [q1Answer, setQ1Answer] = useState('');
 const [q2Answer, setQ2Answer] = useState('');
 const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'checking' | 'passed' | 'failed'>('idle');

 // --- Water Potential Logic ---
 const handleTestPotato = () => {
 if (isSimulatingWP) return;
 setIsSimulatingWP(true);
 
 // Isotonic point is 0.3M
 // Initial mass = 5.0g
 // % change = (0.3 - molarity) * 20
 const changePct = (0.3 - sucroseMolarity) * 20;
 const finalMass = 5.0 * (1 + changePct / 100);

 setTimeout(() => {
  setCurrentMass(finalMass);
  setDataPoints(prev => {
  const exists = prev.find(p => p.m === sucroseMolarity);
  if (exists) return prev;
  return [...prev, { m: sucroseMolarity, change: parseFloat(changePct.toFixed(1)) }].sort((a, b) => a.m - b.m);
  });
  setIsSimulatingWP(false);
 }, 1500);
 };

 const clearData = () => {
 setDataPoints([]);
 setCurrentMass(5.0);
 };

 // --- Xylem Capillary Action Logic ---
 const animateXylem = () => {
 setTimePassed(prev => {
  const next = prev + 1;
  if (next >= 100) {
  setIsSimulatingXylem(false);
  return 100;
  }
  return next;
 });
 if (isSimulatingXylem) {
  requestRef.current = requestAnimationFrame(animateXylem);
 }
 };

 useEffect(() => {
 if (isSimulatingXylem) {
  requestRef.current = requestAnimationFrame(animateXylem);
 } else {
  cancelAnimationFrame(requestRef.current);
 }
 return () => cancelAnimationFrame(requestRef.current);
 }, [isSimulatingXylem]);

 const startXylem = () => {
 setTimePassed(0);
 setIsSimulatingXylem(true);
 };

 const calculateDyeHeight = () => {
 // Height depends on time, temperature (increases rate), and humidity (decreases rate)
 const baseRate = 0.5;
 const tempFactor = temperature / 20;
 const humidityFactor = (100 - humidity) / 50;
 const rate = baseRate * tempFactor * humidityFactor;
 return Math.min(100, timePassed * rate);
 };

 const dyeHeight = calculateDyeHeight();

 // --- Assessment Logic ---
 const checkAnswers = () => {
 setAssessmentStatus('checking');
 setTimeout(() => {
  const q1Num = parseFloat(q1Answer);
  const isQ1Correct = !isNaN(q1Num) && q1Num >= 0.28 && q1Num <= 0.32;
  
  // Ψs = -iCRT. i=1, C=0.3, R=0.0831, T=293K (20C) => -7.3
  const q2Num = parseFloat(q2Answer);
  const isQ2Correct = !isNaN(q2Num) && q2Num >= -7.5 && q2Num <= -7.1;

  if (isQ1Correct && isQ2Correct) {
  setAssessmentStatus('passed');
  } else {
  setAssessmentStatus('failed');
  }
 }, 800);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  {/* Header */}
  <LabHeader onExit={onExit} variant="amber" title="Plant Physiology Virtual Lab" />

  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 lg:flex-1 lg: overflow-y-auto lg:overflow-visible">
  
  {/* Column 1: Theory */}
  <div className={`w-full bg-slate-50 dark:bg-[#121212] p-6 border-r lg:overflow-y-auto flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-2xl font-bold text-gray-800 dark:text-[#ffffff] mb-4">Background Theory</h2>
   
   <div className="space-y-6 text-gray-600">
   <section>
    <h3 className="text-lg font-semibold text-emerald-700 flex items-center gap-2 mb-2">
    <FlaskConical size={18} /> Water Potential (Ψ)
    </h3>
    <p className="mb-2">
    Water potential is a measure of the potential energy in water, driving the movement of water through plants. Water always moves from an area of higher water potential to an area of lower water potential.
    </p>
    <div className={`bg-emerald-50 p-3 rounded-lg text-sm text-emerald-900 mb-2 border border-emerald-200 flex-col `}>
    <span className="font-bold">Formula:</span> Ψ = Ψs + Ψp
    <br/>Ψs = Solute Potential
    <br/>Ψp = Pressure Potential
    </div>
    <p>
    The solute potential (Ψs) can be calculated using: <strong>Ψs = -iCRT</strong>
    </p>
    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
    <li>i = Ionization constant (1.0 for sucrose)</li>
    <li>C = Molar concentration</li>
    <li>R = Pressure constant (0.0831 L·bars/mol·K)</li>
    <li>T = Temperature in Kelvin (273 + °C)</li>
    </ul>
   </section>

   <section>
    <h3 className="text-lg font-semibold text-emerald-700 flex items-center gap-2 mb-2">
    <Droplets size={18} /> Transpiration & Xylem
    </h3>
    <p>
    Water is pulled up through the xylem by capillary action and the cohesive/adhesive properties of water, driven by transpiration from the leaves. 
    </p>
    <p className="mt-2">
    Environmental factors like temperature and humidity heavily influence the rate of transpiration. Higher temperatures increase evaporation, while high humidity decreases the concentration gradient, slowing it down.
    </p>
   </section>
   </div>
  </div>

  {/* Column 2: Simulator */}
  <div className={`w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-6 flex flex-col lg:  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className={`flex bg-slate-50 dark:!bg-[#121212] rounded-lg p-1 shadow-sm mb-6 shrink-0 `}>
   <button 
    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'water' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-500 hover:bg-gray-50'}`}
    onClick={() => setActiveTab('water')}
   >
    Water Potential Lab
   </button>
   <button 
    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'xylem' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-500 hover:bg-gray-50'}`}
    onClick={() => setActiveTab('xylem')}
   >
    Transpiration Lab
   </button>
   </div>

   {activeTab === 'water' && (
   <div className="flex-1 flex flex-col">
    <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border p-6 flex-1 flex flex-col `}>
    <div className="flex justify-between items-center mb-6">
     <h3 className="font-bold text-gray-800 dark:text-[#ffffff]">Potato Core Plasmolysis</h3>
     <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium dark:bg-teal-950/20 dark:border-teal-900">
     Initial Mass: 5.00g
     </div>
    </div>
    
    <div className="flex flex-col items-center justify-center flex-1 relative mb-6">
     {/* Beaker SVG */}
     <svg width="120" height="150" viewBox="0 0 120 150">
     {/* Beaker Outline */}
     <path d="M20,10 L20,130 Q20,140 30,140 L90,140 Q100,140 100,130 L100,10" fill="none" stroke="#94a3b8" strokeWidth="4" />
     <line x1="15" y1="10" x2="105" y2="10" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
     {/* Liquid */}
     <path d="M22,60 L98,60 L98,130 Q98,138 90,138 L30,138 Q22,138 22,130 Z" fill={isSimulatingWP ? '#bfdbfe' : '#e0e7ff'} opacity="0.8" />
     {/* Potato */}
     <rect x="45" y={isSimulatingWP ? "90" : "20"} width="30" height="40" rx="10" fill="#fcd34d" 
      className="transition-all duration-1000 ease-in-out" />
     {isSimulatingWP && (
      <>
      <circle cx="35" cy="100" r="2" fill="#60a5fa" className="animate-ping" />
      <circle cx="85" cy="110" r="3" fill="#60a5fa" className="animate-ping delay-100" />
      <circle cx="40" cy="80" r="2" fill="#60a5fa" className="animate-ping delay-200" />
      </>
     )}
     </svg>
     <div className="mt-4 text-center">
     <p className="text-sm font-medium text-gray-600">Current Mass</p>
     <p className="text-3xl font-bold text-gray-800 dark:text-[#ffffff]">{currentMass.toFixed(2)}g</p>
     </div>
    </div>

    <div className="space-y-4">
     <div>
     <div className="flex justify-between text-sm mb-1">
      <label className="font-medium text-gray-700 dark:text-[#ffffff]">Sucrose Molarity</label>
      <span className="text-emerald-700 font-bold">{sucroseMolarity.toFixed(1)} M</span>
     </div>
     <input 
      type="range" 
      min="0.0" max="1.0" step="0.1" 
      value={sucroseMolarity}
      onChange={(e) => setSucroseMolarity(parseFloat(e.target.value))}
      disabled={isSimulatingWP}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
     />
     </div>
     <div className="flex gap-2">
     <button 
      onClick={handleTestPotato}
      disabled={isSimulatingWP}
      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
     >
      {isSimulatingWP ? 'Incubating...' : 'Submerge Potato (1 Hr)'}
     </button>
     <button 
      onClick={clearData}
      disabled={isSimulatingWP || dataPoints.length === 0}
      className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:text-[#ffffff] rounded-lg font-medium transition-colors disabled:opacity-50"
     >
      Clear Data
     </button>
     </div>
    </div>
    </div>
   </div>
   )}

   {activeTab === 'xylem' && (
   <div className="flex-1 flex flex-col">
    <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border p-6 flex-1 flex flex-col `}>
    <div className="flex justify-between items-center mb-6">
     <h3 className="font-bold text-gray-800 dark:text-[#ffffff]">Celery Transpiration</h3>
     <div className="text-sm bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium dark:bg-[#121212] dark:border-[#1c1b1b]">
     Time: {timePassed.toFixed(0)} min
     </div>
    </div>

    <div className="flex flex-col items-center justify-center flex-1 mb-6">
     <svg width="150" height="200" viewBox="0 0 150 200">
     {/* Beaker */}
     <path d="M40,120 L40,180 Q40,190 50,190 L100,190 Q110,190 110,180 L110,120" fill="none" stroke="#94a3b8" strokeWidth="3" />
     <line x1="35" y1="120" x2="115" y2="120" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
     {/* Dye Liquid */}
     <path d="M42,150 L108,150 L108,180 Q108,188 100,188 L50,188 Q42,188 42,180 Z" fill="#ef4444" opacity="0.6" />
     
     {/* Celery Base */}
     <path d="M65,40 L65,185 L85,185 L85,40 Z" fill="#86efac" />
     {/* Celery Leaves */}
     <path d="M60,45 Q40,20 65,10 Q80,0 85,20 Q105,10 90,45" fill="#4ade80" />
     
     {/* Dye moving up */}
     <rect x="68" y={185 - (145 * dyeHeight / 100)} width="14" height={145 * dyeHeight / 100} fill="#ef4444" opacity="0.7" className="transition-all" />
     </svg>
    </div>

    <div className="space-y-4">
     <div>
     <div className="flex justify-between text-sm mb-1">
      <label className="font-medium text-gray-700 dark:text-[#ffffff] flex items-center gap-1"><Activity size={14}/> Temperature (°C)</label>
      <span className="text-emerald-700 font-bold">{temperature}°C</span>
     </div>
     <input 
      type="range" min="10" max="40" step="1" 
      value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))}
      disabled={isSimulatingXylem}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
     />
     </div>
     <div>
     <div className="flex justify-between text-sm mb-1">
      <label className="font-medium text-gray-700 dark:text-[#ffffff] flex items-center gap-1"><Droplets size={14}/> Humidity (%)</label>
      <span className="text-emerald-700 font-bold">{humidity}%</span>
     </div>
     <input 
      type="range" min="20" max="90" step="1" 
      value={humidity} onChange={(e) => setHumidity(parseFloat(e.target.value))}
      disabled={isSimulatingXylem}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
     />
     </div>
     <button 
     onClick={startXylem}
     disabled={isSimulatingXylem}
     className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
     >
     {isSimulatingXylem ? 'Simulating...' : 'Start Experiment'}
     </button>
    </div>
    </div>
   </div>
   )}
  </div>

  {/* Column 3: Assessment & Data */}
  <div className="bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-6 border-l flex flex-col lg: ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <h2 className="text-2xl font-bold text-gray-800 dark:text-[#ffffff] mb-4">Data Analysis</h2>
   
   {activeTab === 'water' && (
   <>
    <div className="bg-slate-50 dark:bg-[#121212] border rounded-xl p-4 mb-6">
    <h3 className="font-semibold text-sm text-gray-700 dark:text-[#ffffff] mb-2">Recorded Measurements</h3>
    {dataPoints.length === 0 ? (
     <p className="text-sm text-gray-400 italic text-center py-4">No data collected yet. Run the simulation.</p>
    ) : (
     <div className="overflow-x-auto">
     <table className="w-full text-sm text-left">
      <thead className="text-xs text-gray-600 bg-gray-100">
      <tr>
       <th className="px-3 py-2 rounded-tl-lg">Molarity (M)</th>
       <th className="px-3 py-2">% Change</th>
      </tr>
      </thead>
      <tbody>
      {dataPoints.map((dp, i) => (
       <tr key={i} className="border-b last:border-0 border-gray-200 bg-slate-50 dark:bg-[#121212]">
       <td className="px-3 py-2 font-medium">{dp.m.toFixed(1)}</td>
       <td className={`px-3 py-2 font-bold ${dp.change > 0 ? 'text-blue-600' : dp.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
        {dp.change > 0 ? '+' : ''}{dp.change}%
       </td>
       </tr>
      ))}
      </tbody>
     </table>
     </div>
    )}

    {/* Graph plotting */}
    {dataPoints.length > 1 && (
     <div className="mt-4 border-t pt-4">
     <h4 className="text-xs font-semibold text-center mb-2">Mass Change vs Molarity</h4>
     <div className="h-32 w-full relative">
      <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none" className="overflow-visible">
      {/* Axes */}
      <line x1="20" y1="50" x2="190" y2="50" stroke="#cbd5e1" strokeWidth="1" />
      <line x1="20" y1="10" x2="20" y2="90" stroke="#cbd5e1" strokeWidth="1" />
      
      {/* Data Points and Lines */}
      {dataPoints.map((dp, i) => {
       const x = 20 + (dp.m * 170); // 0M to 1.0M
       const y = 50 - (dp.change * 2); // Map % change to Y axis
       
       return (
       <g key={`pt-${i}`}>
        {i > 0 && (
        <line 
         x1={20 + (dataPoints[i-1].m * 170)} 
         y1={50 - (dataPoints[i-1].change * 2)} 
         x2={x} 
         y2={y} 
         stroke="#059669" 
         strokeWidth="2" 
        />
        )}
        <circle cx={x} cy={y} r="3" fill="#047857" />
       </g>
       );
      })}
      </svg>
      <div className="absolute top-0 left-0 text-[10px] text-gray-400">-%</div>
      <div className="absolute bottom-0 left-0 text-[10px] text-gray-400">+%</div>
      <div className="absolute bottom-0 right-0 text-[10px] text-gray-400">1.0M</div>
     </div>
     </div>
    )}
    </div>
   </>
   )}

   <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 flex-1 flex flex-col">
   <h3 className="font-bold text-emerald-900 mb-4">Assessment</h3>
   
   <div className="space-y-4 flex-1">
    <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-[#ffffff] mb-1">
     1. Based on your data, what is the isotonic sucrose concentration? (M)
    </label>
    <input 
     type="number" step="0.01"
     value={q1Answer}
     onChange={(e) => setQ1Answer(e.target.value)}
     placeholder="e.g. 0.25"
     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
    />
    <p className="text-xs text-gray-500 mt-1">Hint: Look for the point where % mass change is 0.</p>
    </div>

    <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-[#ffffff] mb-1">
     2. Calculate the solute potential (Ψs) of the potato cells at 20°C in bars.
    </label>
    <input 
     type="number" step="0.1"
     value={q2Answer}
     onChange={(e) => setQ2Answer(e.target.value)}
     placeholder="e.g. -5.2"
     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
    />
    <p className="text-xs text-gray-500 mt-1">Use Ψs = -iCRT. Assume i=1, R=0.0831. T must be in Kelvin.</p>
    </div>
   </div>

   <div className="mt-6 pt-4 border-t border-emerald-200">
    <button 
    onClick={checkAnswers}
    disabled={assessmentStatus === 'checking'}
    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 dark:text-white dark:text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
    >
    {assessmentStatus === 'checking' ? 'Evaluating...' : 'Check Answers'}
    </button>

    {assessmentStatus === 'passed' && (
    <div className="mt-3 p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2 text-sm font-medium dark:text-[#ffffff]">
     <CheckCircle size={18} /> Correct! The isotonic point is ~0.3M and Ψs is -7.3 bars.
    </div>
    )}
    {assessmentStatus === 'failed' && (
    <div className="mt-3 p-3 bg-red-100 text-red-800 rounded-lg flex items-center gap-2 text-sm font-medium">
     <XCircle size={18} /> Incorrect. Check your graph for where it crosses 0%, and ensure T = 293K.
    </div>
    )}
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
