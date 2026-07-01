import { useState, useMemo } from 'react';
import { Activity, Battery, DollarSign, Target, UserCheck, AlertCircle, Play, Layers, CheckCircle2 } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabCS11ProductDev({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [foamDensity, setFoamDensity] = useState<number>(40);
 const [sensorCount, setSensorCount] = useState<number>(200);
 const [processorClock, setProcessorClock] = useState<number>(40);
 const [feedback, setFeedback] = useState<{success: boolean, message: string} | null>(null);

 const metrics = useMemo(() => {
 const cost = (foamDensity / 10) + (sensorCount * 0.1) + (processorClock * 0.2) + 20;
 const comfort = foamDensity / 10;
 const accuracy = ((sensorCount / 500) * 5) + ((processorClock / 100) * 5);
 const battery = 48 - (sensorCount * 0.02) - (processorClock * 0.1);
 
 return {
  cost: Number(cost.toFixed(2)),
  comfort: Number(comfort.toFixed(1)),
  accuracy: Number(accuracy.toFixed(1)),
  battery: Number(battery.toFixed(1))
 };
 }, [foamDensity, sensorCount, processorClock]);

 const testMVP = () => {
 if (metrics.cost > 90) {
  setFeedback({ success: false, message: "MVP failed. Production costs exceed our target of $90/unit. Investors rejected the proposal." });
 } else if (metrics.comfort < 7) {
  setFeedback({ success: false, message: "MVP failed user testing. The mat is too uncomfortable for patients to sleep on." });
 } else if (metrics.accuracy < 8) {
  setFeedback({ success: false, message: "MVP failed medical review. Sensor accuracy is too low for clinical e-health tracking." });
 } else if (metrics.battery < 24) {
  setFeedback({ success: false, message: "MVP failed practical testing. Users complained the battery died before 24 hours." });
 } else {
  setFeedback({ success: true, message: "MVP SUCCESS! You balanced comfort, accuracy, battery life, and cost perfectly. The startup secured Series A funding!" });
 }
 };

 const visualSensors = Math.floor(sensorCount / 10);
 const foamHeight = (foamDensity / 100) * 60 + 20;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Lab: Neuro-Mat Startup Simulator" />

  
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
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto  ? 'block' : 'hidden'} lg:block`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4">1. Minimum Viable Product</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-4 text-sm leading-relaxed">
   In software and hardware product development, an MVP (Minimum Viable Product) is the version of a new product that allows a team to collect the maximum amount of validated learning about customers with the least effort.
   </p>
   <div className={`w-full bg-emerald-50 p-4 rounded-lg border border-emerald-100 mb-4 flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h3 className="font-semibold text-emerald-800 mb-2">Trade-offs in Engineering:</h3>
   <ul className="list-disc list-inside text-sm text-emerald-900 space-y-1">
    <li><strong>Cost vs Quality:</strong> Premium materials cost more but yield higher user satisfaction.</li>
    <li><strong>Performance vs Battery:</strong> High processing power drains battery faster.</li>
    <li><strong>Resolution:</strong> More sensors give better data but increase complexity and cost.</li>
   </ul>
   </div>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed">
   You are the lead engineer for <strong>Neuro-Mat</strong>, an e-health smart mattress pad. Adjust your design parameters to pass all user and investor requirements.
   </p>
  </div>

  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-6 flex items-center">
   <Layers className="mr-2 text-emerald-500" /> MVP Blueprint
   </h2>
   
   <div className={`flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b] p-4 mb-6 relative `}>
   <svg width="100%" height="200" viewBox="0 0 400 200" className="drop-shadow-md">
    <defs>
    <linearGradient id="foamGrad" x1="0" y1="0" x2="0" y2="1">
     <stop offset="0%" stopColor="#e2e8f0" />
     <stop offset="100%" stopColor="#cbd5e1" />
    </linearGradient>
    <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
     <stop offset="0%" stopColor="#334155" />
     <stop offset="100%" stopColor="#0f172a" />
    </linearGradient>
    </defs>
    
    <rect x="50" y={150 - foamHeight} width="300" height={foamHeight} rx="8" fill="url(#foamGrad)" />
    <text x="200" y={150 - foamHeight / 2} textAnchor="middle" alignmentBaseline="middle" fill="#64748b" fontSize="12" fontWeight="bold">Memory Foam ({foamDensity} kg/m³)</text>
    
    <g>
    {Array.from({ length: visualSensors }).map((_, i) => (
     <circle 
     key={i}
     cx={60 + (i * (280 / Math.max(1, visualSensors - 1)))} 
     cy={150} 
     r="3" 
     fill="#10b981" 
     />
    ))}
    </g>
    <rect x="50" y="150" width="300" height="20" rx="4" fill="url(#baseGrad)" />
    
    <rect x="175" y="155" width="50" height="10" rx="2" fill="#3b82f6" />
    <text x="200" y="160" textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="8">CPU {processorClock}MHz</text>
   </svg>
   </div>

   <div className="grid grid-cols-2 gap-4">
   <div className={`bg-slate-50 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    <div className="flex justify-between items-center mb-1">
    <span className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase flex items-center"><DollarSign size={14} className="mr-1"/> Unit Cost</span>
    <span className={`text-sm font-bold ${metrics.cost <= 90 ? 'text-emerald-600' : 'text-red-500'}`}>${metrics.cost}</span>
    </div>
   </div>
   <div className={`bg-slate-50 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    <div className="flex justify-between items-center mb-1">
    <span className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase flex items-center"><UserCheck size={14} className="mr-1"/> Comfort</span>
    <span className={`text-sm font-bold ${metrics.comfort >= 7 ? 'text-emerald-600' : 'text-amber-500'}`}>{metrics.comfort}/10</span>
    </div>
   </div>
   <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b]">
    <div className="flex justify-between items-center mb-1">
    <span className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase flex items-center"><Activity size={14} className="mr-1"/> Accuracy</span>
    <span className={`text-sm font-bold ${metrics.accuracy >= 8 ? 'text-emerald-600' : 'text-amber-500'}`}>{metrics.accuracy}/10</span>
    </div>
   </div>
   <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b]">
    <div className="flex justify-between items-center mb-1">
    <span className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase flex items-center"><Battery size={14} className="mr-1"/> Battery</span>
    <span className={`text-sm font-bold ${metrics.battery >= 24 ? 'text-emerald-600' : 'text-red-500'}`}>{metrics.battery}h</span>
    </div>
   </div>
   </div>
  </div>

  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex flex-col">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4">3. Prototyping Controls</h2>
   
   <div className="space-y-6 flex-1">
   <div className="space-y-3">
    <div>
    <label className="flex justify-between text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-1">
     <span>Foam Density</span>
     <span className="text-emerald-600">{foamDensity} kg/m³</span>
    </label>
    <input type="range" min="10" max="100" step="5" value={foamDensity} onChange={(e) => setFoamDensity(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    
    <div>
    <label className="flex justify-between text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-1">
     <span>Sensor Grid Count</span>
     <span className="text-emerald-600">{sensorCount} units</span>
    </label>
    <input type="range" min="50" max="500" step="10" value={sensorCount} onChange={(e) => setSensorCount(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    
    <div>
    <label className="flex justify-between text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-1">
     <span>Processor Clock</span>
     <span className="text-emerald-600">{processorClock} MHz</span>
    </label>
    <input type="range" min="10" max="100" step="5" value={processorClock} onChange={(e) => setProcessorClock(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
   </div>

   <div className="bg-slate-100 dark:bg-[#121212] p-4 rounded-lg text-sm text-slate-700 dark:text-[#ffffff] border border-slate-200 dark:border-[#1c1b1b]">
    <strong>Target Specifications:</strong>
    <ul className="mt-2 space-y-1 text-xs">
    <li className="flex items-center"><Target size={12} className="mr-2 text-slate-400" /> Cost ≤ $90.00</li>
    <li className="flex items-center"><Target size={12} className="mr-2 text-slate-400" /> Comfort ≥ 7.0/10</li>
    <li className="flex items-center"><Target size={12} className="mr-2 text-slate-400" /> Accuracy ≥ 8.0/10</li>
    <li className="flex items-center"><Target size={12} className="mr-2 text-slate-400" /> Battery Life ≥ 24.0h</li>
    </ul>
   </div>
   
   <button 
    onClick={testMVP}
    className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm flex justify-center items-center dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
   >
    <Play size={18} className="mr-2" /> Run User Testing
   </button>

   {feedback && (
    <div className={`p-4 rounded-lg border text-sm ${feedback.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
    <div className="flex items-start">
     {feedback.success ? <CheckCircle2 className="mt-0.5 mr-2 shrink-0" size={16} /> : <AlertCircle className="mt-0.5 mr-2 shrink-0" size={16} />}
     <span>{feedback.message}</span>
    </div>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
