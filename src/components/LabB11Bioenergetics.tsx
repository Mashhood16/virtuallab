import { useState } from 'react';
import { BookOpen, Activity, Plus, LineChart, Target, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface DataPoint {
 id: number;
 wavelength: number;
 absorbance: number;
 isUnknown: boolean;
}

export default function LabB11Bioenergetics({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [wavelength, setWavelength] = useState<number>(400);
 const [concentration, setConcentration] = useState<number>(5);
 const [isUnknown, setIsUnknown] = useState<boolean>(false);
 const [data, setData] = useState<DataPoint[]>([]);
 const [unknownConcentration] = useState<number>(() => Math.round((2 + Math.random() * 6) * 10) / 10);
 
 const [answer, setAnswer] = useState<string>('');
 const [feedback, setFeedback] = useState<string | null>(null);

 const calcEpsilon = (w: number) => {
 const peak1 = 0.8 * Math.exp(-0.5 * Math.pow((w - 430) / 15, 2));
 const peak2 = 0.5 * Math.exp(-0.5 * Math.pow((w - 662) / 12, 2));
 return 0.05 + peak1 + peak2;
 };

 const trueConcentration = isUnknown ? unknownConcentration : concentration;
 const epsilon = calcEpsilon(wavelength);
 const noise = 1 + (Math.sin(wavelength * concentration) * 0.015);
 const absorbance = Math.max(0, (epsilon * trueConcentration * 0.2) * noise);
 const transmittance = Math.pow(10, -absorbance);

 const wavelengthToColor = (w: number) => {
 let r, g, b;
 if (w >= 380 && w < 440) { r = -(w - 440) / (440 - 380); g = 0.0; b = 1.0; }
 else if (w >= 440 && w < 490) { r = 0.0; g = (w - 440) / (490 - 440); b = 1.0; }
 else if (w >= 490 && w < 510) { r = 0.0; g = 1.0; b = -(w - 510) / (510 - 490); }
 else if (w >= 510 && w < 580) { r = (w - 510) / (580 - 510); g = 1.0; b = 0.0; }
 else if (w >= 580 && w < 645) { r = 1.0; g = -(w - 645) / (645 - 580); b = 0.0; }
 else if (w >= 645 && w <= 780) { r = 1.0; g = 0.0; b = 0.0; }
 else { r = 0.0; g = 0.0; b = 0.0; }
 
 let factor = 1.0;
 if (w >= 380 && w < 420) factor = 0.3 + 0.7 * (w - 380) / (420 - 380);
 else if (w >= 701 && w <= 780) factor = 0.3 + 0.7 * (780 - w) / (780 - 700);
 
 const format = (c: number) => Math.round(255 * Math.pow(c * factor, 0.8));
 return `rgb(${format(r)}, ${format(g)}, ${format(b)})`;
 };

 const beamColor = wavelengthToColor(wavelength);

 const handleRecord = () => {
 setData(prev => [...prev, {
  id: Date.now(),
  wavelength,
  absorbance: Number(absorbance.toFixed(3)),
  isUnknown
 }]);
 };

 const checkAnswer = () => {
 const val = parseFloat(answer);
 if (isNaN(val)) {
  setFeedback("Please enter a valid number.");
  return;
 }
 const err = Math.abs(val - unknownConcentration) / unknownConcentration;
 if (err < 0.1) {
  setFeedback(`Correct! The unknown concentration is approximately ${unknownConcentration} μM.`);
 } else {
  setFeedback("Incorrect. Hint: Measure the unknown at 430nm, then measure a known concentration at 430nm and use ratios.");
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} variant="emerald" title="Bioenergetics: Chlorophyll Spectrophotometry" />

  
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
  {/* Left Column: Theory & Controls */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col gap-6  ? 'flex' : 'hidden'} lg:flex`}>
   <div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2 mb-3">
    <BookOpen className="text-emerald-600" /> Theory & Setup
   </h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm mb-4 leading-relaxed">
    Chlorophyll extracts absorb light at specific wavelengths. The spectrophotometer measures the 
    amount of light absorbed. According to the <strong>Beer-Lambert Law</strong>, absorbance is directly proportional 
    to the concentration of the solution.
   </p>
   </div>

   <div className={`space-y-5 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff]">Spectrophotometer Controls</h3>
   
   <div className="space-y-2">
    <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] flex justify-between">
    <span>Wavelength (λ)</span>
    <span className="text-emerald-600 font-mono">{wavelength} nm</span>
    </label>
    <input 
    type="range" min="400" max="700" step="10" 
    value={wavelength} onChange={(e) => setWavelength(Number(e.target.value))}
    className="w-full accent-emerald-600"
    />
   </div>

   <div className="space-y-2">
    <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">Sample Selection</label>
    <div className="flex gap-2">
    <button 
     onClick={() => setIsUnknown(false)}
     className={`flex-1 py-2 text-sm rounded border transition-colors ${!isUnknown ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-slate-50 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-50 dark:bg-[#121212]'}`}
    >
     Known Standard
    </button>
    <button 
     onClick={() => setIsUnknown(true)}
     className={`flex-1 py-2 text-sm rounded border transition-colors ${isUnknown ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-50 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-50 dark:bg-[#121212]'}`}
    >
     Unknown Sample
    </button>
    </div>
   </div>

   {!isUnknown && (
    <div className="space-y-2">
    <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] flex justify-between">
     <span>Known Concentration</span>
     <span className="text-emerald-600 font-mono">{concentration} μM</span>
    </label>
    <input 
     type="range" min="1" max="10" step="0.5" 
     value={concentration} onChange={(e) => setConcentration(Number(e.target.value))}
     className="w-full accent-emerald-600"
    />
    </div>
   )}
   </div>
  </div>

  {/* Middle Column: Simulation */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col items-center justify-center relative  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="absolute top-5 left-5 right-5 flex justify-between items-center">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <Activity className="text-emerald-600" /> Virtual Spectrometer
   </h2>
   <div className="bg-slate-100 dark:bg-[#121212] text-slate-500 dark:text-[#71717a] text-xs font-bold px-2 py-1 rounded">Interactive Model</div>
   </div>
   
   <div className={`w-full max-w-md aspect-video bg-[#000000] dark:bg-[#121212] rounded-xl overflow- relative shadow-inner mt-8 flex-col `}>
   {/* Light Source */}
   <div className={`w-full absolute left-4 top-1/2 -translate-y-1/2 w-12 h-16 bg-white lg:bg-slate-700 dark:bg-[#121212] lg:dark:bg-[#121212] rounded-sm border-2 border-slate-500 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex items-center justify-center flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    <div className="w-6 h-6 rounded-full bg-yellow-100 shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
   </div>

   {/* Prism / Monochromator */}
   <div className="absolute left-24 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[34px] border-b-slate-600" />

   {/* Incident Beam */}
   <div 
    className="absolute left-32 top-1/2 -translate-y-1/2 h-8" 
    style={{ width: '80px', backgroundColor: beamColor, opacity: 0.8, boxShadow: `0 0 10px ${beamColor}` }}
   />

   {/* Cuvette */}
   <div className="absolute left-[210px] top-1/2 -translate-y-1/2 w-14 h-24 border-4 border-slate-400 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212]/10 rounded-sm overflow-hidden flex flex-col justify-end">
    <div className="w-full bg-green-500/40 dark:bg-[#121212] dark:border-[#1c1b1b]" style={{ height: '80%' }} />
    <div className="absolute top-1/2 -translate-y-1/2 w-full h-8" style={{ backgroundColor: beamColor, opacity: 0.4 }} />
   </div>

   {/* Transmitted Beam */}
   <div 
    className="absolute left-[266px] top-1/2 -translate-y-1/2 h-8 transition-opacity duration-300" 
    style={{ width: '80px', backgroundColor: beamColor, opacity: transmittance * 0.8, boxShadow: `0 0 ${transmittance * 10}px ${beamColor}` }}
   />

   {/* Detector */}
   <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-16 bg-slate-700 dark:bg-[#121212] rounded-sm border-2 border-slate-500 dark:border-[#1c1b1b] flex items-center justify-center">
    <div className="w-2 h-10 bg-black rounded-full" />
   </div>
   </div>

   <div className="mt-8 grid grid-cols-2 gap-6 w-full max-w-md">
   <div className="bg-slate-100 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] text-center">
    <p className="text-xs text-slate-500 dark:text-[#71717a] font-bold uppercase tracking-wider">Transmittance</p>
    <p className="text-3xl font-mono text-slate-800 dark:text-[#ffffff] mt-1">{(transmittance * 100).toFixed(1)}%</p>
   </div>
   <div className="bg-slate-100 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] text-center relative overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
    <p className="text-xs text-slate-500 dark:text-[#71717a] font-bold uppercase tracking-wider">Absorbance (A)</p>
    <p className="text-3xl font-mono text-emerald-700 mt-1">{absorbance.toFixed(3)}</p>
   </div>
   </div>
  </div>

  {/* Right Column: Data & Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col gap-6 `}>
   <div className="flex justify-between items-center">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <LineChart className="text-emerald-600" /> Data Analysis
   </h2>
   <button 
    onClick={handleRecord}
    className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-emerald-200 flex items-center gap-1 transition-colors"
   >
    <Plus size={16} /> Record Point
   </button>
   </div>

   <div className="h-48 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg relative overflow-hidden flex flex-col justify-end pb-6 pl-8 pr-4">
   {data.length === 0 ? (
    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
    No data recorded yet
    </div>
   ) : (
    <div className="w-full h-full relative">
    <svg viewBox="0 0 300 150" className="w-full h-full absolute inset-0 overflow-visible">
     {/* Axes */}
     <line x1="0" y1="150" x2="300" y2="150" stroke="#cbd5e1" strokeWidth="2" />
     <line x1="0" y1="0" x2="0" y2="150" stroke="#cbd5e1" strokeWidth="2" />
     <text x="150" y="170" fontSize="10" textAnchor="middle" fill="#64748b">Wavelength (nm)</text>
     <text x="-75" y="-15" fontSize="10" textAnchor="middle" fill="#64748b" transform="rotate(-90)">Absorbance</text>
     
     {data.map(d => (
     <circle 
      key={d.id} 
      cx={((d.wavelength - 400) / 300) * 300} 
      cy={150 - Math.min(1, d.absorbance / 1.5) * 150} 
      r="4" 
      fill={d.isUnknown ? "#4f46e5" : "#059669"} 
     />
     ))}
    </svg>
    </div>
   )}
   </div>

   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-1 flex flex-col">
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] flex items-center gap-2 mb-3">
    <Target size={18} /> Assessment
   </h3>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    Using the Beer-Lambert Law and your recorded data, determine the concentration of the unknown sample.
   </p>
   <div className="flex gap-2 mb-4">
    <input 
    type="number" step="0.1"
    placeholder="Calculated μM" 
    value={answer} onChange={(e) => setAnswer(e.target.value)}
    className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded text-sm focus:outline-emerald-500"
    />
    <button 
    onClick={checkAnswer}
    className="bg-[#121212] dark:bg-[#121212] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-slate-700 dark:bg-[#121212] transition-colors"
    >
    Check
    </button>
   </div>
   {feedback && (
    <div className={`text-sm p-3 rounded-md flex items-start gap-2 ${feedback.includes('Correct') ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
    {feedback.includes('Correct') ? <CheckCircle size={16} className="mt-0.5 shrink-0" /> : <XCircle size={16} className="mt-0.5 shrink-0" />}
    <span className="flex-1">{feedback}</span>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
