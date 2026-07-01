import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, ShieldAlert, Bug } from 'lucide-react';
import LabHeader from './LabHeader';

type DrugType = 'Cisplatin' | 'Aspirin' | 'Penicillin';

export default function LabC12Medicine({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [drug] = useState<DrugType>('Cisplatin');
 const [dosage, setDosage] = useState<number>(50);
 const [time, setTime] = useState<number>(0);
 const [isPlaying, setIsPlaying] = useState<boolean>(false);
 const timerRef = useRef<number | null>(null);

 const [answer, setAnswer] = useState<string>('');
 const [feedback, setFeedback] = useState<string | null>(null);

 useEffect(() => {
 if (isPlaying) {
  timerRef.current = window.setInterval(() => {
  setTime(t => {
   if (t >= 10) {
   setIsPlaying(false);
   return 10;
   }
   return t + 0.1;
  });
  }, 50);
 } else if (timerRef.current !== null) {
  clearInterval(timerRef.current);
 }
 return () => {
  if (timerRef.current !== null) clearInterval(timerRef.current);
 };
 }, [isPlaying]);

 const reset = () => {
 setIsPlaying(false);
 setTime(0);
 setFeedback(null);
 setAnswer('');
 };

 // Calculate effect percentage (0 to 100)
 const effectValue = Math.min(100, Math.max(0, (time * dosage) / 10));

 const checkAnswer = () => {
 let correct = false;
 const val = parseFloat(answer);
 if (isNaN(val)) {
  setFeedback('Please enter a valid number.');
  return;
 }

 if (drug === 'Cisplatin') {
  // Question: At 40mg dosage, what is the % crosslinking at t = 5s? (40*5/10 = 20)
  if (Math.abs(val - 20) < 1) correct = true;
 } else if (drug === 'Aspirin') {
  // Question: Calculate the rate of inhibition (%/s) at dosage = 60mg. (60/10 = 6)
  if (Math.abs(val - 6) < 0.1) correct = true;
 } else if (drug === 'Penicillin') {
  // Question: At what time does cell wall integrity reach 0% at 100mg dosage? (100 = t*100/10 => t = 10s)
  if (Math.abs(val - 10) < 0.5) correct = true;
 }
 
 if (correct) {
  setFeedback('Correct! Great pharmacology analysis.');
 } else {
  setFeedback('Incorrect. Check your calculations and the mechanism rate.');
 }
 };

 const renderSimulation = () => {
 if (drug === 'Cisplatin') {
  const crosslinks = Math.floor(effectValue / 10);
  return (
  <svg viewBox="0 0 400 300" className="w-full h-64 bg-[#000000] dark:bg-[#121212] rounded-lg shadow-inner">
   <text x="20" y="30" fill="white" className="text-sm">Tumor DNA Cross-linking: {effectValue.toFixed(1)}%</text>
   {/* DNA Backbone */}
   <path d="M 50 100 Q 100 50, 150 100 T 250 100 T 350 100" fill="none" stroke="#4ade80" strokeWidth="4" />
   <path d="M 50 200 Q 100 250, 150 200 T 250 200 T 350 200" fill="none" stroke="#4ade80" strokeWidth="4" />
   
   {/* Base pairs & Crosslinks */}
   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
   const x = 30 + i * 30;
   const y1 = 100 + Math.sin(i) * 20;
   const y2 = 200 - Math.sin(i) * 20;
   const isCrosslinked = i <= crosslinks;
   return (
    <g key={i}>
    <line x1={x} y1={y1} x2={x} y2={y2} stroke={isCrosslinked ? "#f43f5e" : "#cbd5e1"} strokeWidth="2" />
    {isCrosslinked && (
     <circle cx={x} cy={(y1+y2)/2} r="6" fill="#f43f5e" />
    )}
    </g>
   );
   })}
   {crosslinks > 0 && <text x="20" y="280" fill="#f43f5e" className="text-xs font-bold">Pt-Cl complex binding to Guanine!</text>}
  </svg>
  );
 } else if (drug === 'Aspirin') {
  const acetylPositionX = 50 + (effectValue / 100) * 150;
  const acetylPositionY = 150 + (effectValue / 100) * 20;
  return (
  <svg viewBox="0 0 400 300" className="w-full h-64 bg-[#000000] dark:bg-[#121212] rounded-lg shadow-inner">
   <text x="20" y="30" fill="white" className="text-sm">COX Enzyme Inhibition: {effectValue.toFixed(1)}%</text>
   {/* Enzyme */}
   <path d="M 200 100 C 250 50, 350 80, 320 180 C 300 250, 200 280, 180 200 C 160 120, 250 150, 200 100" fill="#3b82f6" opacity="0.8"/>
   <text x="230" y="150" fill="white" className="text-xs font-bold">COX Active Site</text>
   
   {/* Arachidonic Acid blocked */}
   <path d="M 350 250 Q 330 200, 280 180" fill="none" stroke="#fbbf24" strokeWidth="4" opacity={effectValue > 80 ? 0.2 : 1} />
   
   {/* Aspirin Acetyl Group */}
   <circle cx={acetylPositionX} cy={acetylPositionY} r="10" fill="#ef4444" />
   <text x={acetylPositionX - 10} y={acetylPositionY - 15} fill="#ef4444" className="text-xs">Acetyl</text>
   
   {effectValue > 90 && <text x="20" y="280" fill="#ef4444" className="text-xs font-bold">Serine residue acetylated! Pathway blocked.</text>}
  </svg>
  );
 } else {
  const integrity = 100 - effectValue;
  return (
  <svg viewBox="0 0 400 300" className="w-full h-64 bg-[#000000] dark:bg-[#121212] rounded-lg shadow-inner">
   <text x="20" y="30" fill="white" className="text-sm">Cell Wall Integrity: {integrity.toFixed(1)}%</text>
   
   {/* Peptidoglycan Grid */}
   {[1, 2, 3, 4, 5].map((row) => (
   <g key={`row-${row}`}>
    <line x1="50" y1={50 + row * 40} x2="350" y2={50 + row * 40} stroke="#5560F1" strokeWidth="4" opacity={integrity / 100} />
    {[1, 2, 3, 4, 5, 6].map((col) => (
    <line key={`col-${col}`} x1={50 + col * 45} y1="70" x2={50 + col * 45} y2="270" stroke="#d946ef" strokeWidth="2" opacity={(integrity + Math.random() * 20) / 120} />
    ))}
   </g>
   ))}
   {integrity < 20 && <text x="120" y="150" fill="#ef4444" className="text-2xl font-bold rotate-12">LYSIS!</text>}
  </svg>
  );
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  {/* Header */}
  <LabHeader onExit={onExit} title="Interactive Pharmacology Lab" />

  {/* Main Content */}
  
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
  <main className="lg:flex-1 p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 max-w-7xl mx-auto w-full overflow-y-auto lg:overflow-visible">
  
  {/* Left Column: Theory & Setup */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col gap-6  ? 'flex' : 'hidden'} lg:flex`}>
   <div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-2 border-b pb-2 flex items-center gap-2">
    <ShieldAlert className="text-slate-500 dark:text-[#71717a]" size={20} />
    Mechanism of Action
   </h2>
   {drug === 'Cisplatin' && (
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mt-2 leading-relaxed">
    <strong>Cisplatin</strong> [Pt(NH₃)₂Cl₂] is a chemotherapy medication. It cross-links DNA in tumor cells, primarily at guanine bases. This disrupts DNA replication and transcription, ultimately leading to apoptosis.
    </p>
   )}
   {drug === 'Aspirin' && (
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mt-2 leading-relaxed">
    <strong>Aspirin</strong> (acetylsalicylic acid) irreversibly inhibits Cyclooxygenase (COX) enzymes. It transfers its acetyl group to a serine residue in the active site, blocking arachidonic acid and stopping prostaglandin synthesis.
    </p>
   )}
   {drug === 'Penicillin' && (
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mt-2 leading-relaxed">
    <strong>Penicillin</strong> contains a beta-lactam ring that binds to and competitively inhibits the transpeptidase enzyme (PBP). This prevents the cross-linking of peptidoglycan in bacterial cell walls, leading to osmotic lysis.
    </p>
   )}
   </div>

   <div className="flex-1">
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-4">Experimental Setup</h3>
   <label className="block text-sm font-medium text-slate-600 dark:text-[#a1a1aa] mb-1">
    Dosage: {dosage} mg
   </label>
   <input
    type="range"
    min="10"
    max="100"
    step="10"
    value={dosage}
    onChange={(e) => { setDosage(Number(e.target.value)); reset(); }}
    className={`w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-blue-600 mb-6 flex-col `}
   />
   
   <div className={`bg-slate-100 dark:bg-[#121212] p-4 rounded-lg flex items-center justify-between border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    <div className="flex flex-col">
    <span className="text-xs text-slate-500 dark:text-[#71717a] uppercase font-bold tracking-wider">Elapsed Time</span>
    <span className="text-2xl font-mono text-slate-800 dark:text-[#ffffff]">{time.toFixed(1)} s</span>
    </div>
    <div className="flex flex-col text-right">
    <span className="text-xs text-slate-500 dark:text-[#71717a] uppercase font-bold tracking-wider">Effect %</span>
    <span className="text-2xl font-mono text-blue-600">{effectValue.toFixed(1)}%</span>
    </div>
   </div>
   </div>
  </div>

  {/* Middle Column: Interactive Simulation */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center relative  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="absolute top-6 left-6 text-xl font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <Bug className="text-slate-500 dark:text-[#71717a]" size={20} />
   Molecular Visualizer
   </h2>
   
   <div className="w-full mt-10">
   {renderSimulation()}
   </div>

   <div className="mt-8 flex gap-4">
   <button
    onClick={() => setIsPlaying(!isPlaying)}
    className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 flex-col `}
   >
    <Play size={18} />
    {isPlaying ? 'Pause' : 'Start Process'}
   </button>
   <button
    onClick={reset}
    className="flex items-center gap-2 px-6 py-3 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg font-medium hover:bg-slate-300 dark:bg-[#121212] transition-colors"
   >
    <RotateCcw size={18} />
    Reset
   </button>
   </div>
  </div>

  {/* Right Column: Assessment */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-2 border-b pb-2">
   Data Analysis
   </h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-6">
   Use the simulation data to calculate pharmacological parameters. Assume the relationship follows zero-order kinetics in this model: <code className="bg-slate-100 dark:bg-[#121212] px-1 py-0.5 rounded">Effect = k × dosage × time</code> (where k = 0.1).
   </p>

   <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 dark:bg-teal-950/20 dark:border-teal-900">
   <h3 className="font-semibold text-blue-900 mb-2 dark:text-[#ffffff]">Assignment Question</h3>
   {drug === 'Cisplatin' && (
    <p className="text-sm text-blue-800 dark:text-[#ffffff]">
    At a <strong>40 mg</strong> dosage, what will be the percentage of DNA crosslinking at exactly <strong>t = 5.0 s</strong>?
    </p>
   )}
   {drug === 'Aspirin' && (
    <p className="text-sm text-blue-800 dark:text-[#ffffff]">
    Calculate the constant rate of inhibition (%/s) when the dosage is set to <strong>60 mg</strong>.
    </p>
   )}
   {drug === 'Penicillin' && (
    <p className="text-sm text-blue-800 dark:text-[#ffffff]">
    At what exact time (in seconds) will the cell wall integrity drop to <strong>0%</strong> if the dosage is <strong>100 mg</strong>?
    </p>
   )}
   </div>

   <div className="flex flex-col gap-4">
   <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Your Answer</label>
    <input
    type="number"
    value={answer}
    onChange={(e) => setAnswer(e.target.value)}
    placeholder="Enter numerical value"
    className="w-full px-4 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
    />
   </div>
   <button
    onClick={checkAnswer}
    className="w-full py-2 bg-[#121212] dark:bg-[#121212] text-white rounded-lg font-medium hover:bg-[#000000] dark:bg-[#121212] transition-colors"
   >
    Check Answer
   </button>
   
   {feedback && (
    <div className={`p-4 rounded-lg flex items-start gap-3 ${feedback.includes('Correct') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
    {feedback.includes('Correct') ? <CheckCircle size={20} className="text-green-600 shrink-0" /> : <XCircle size={20} className="text-red-600 shrink-0" />}
    <span className="text-sm font-medium">{feedback}</span>
    </div>
   )}
   </div>
  </div>
  </main>
 </div>
 );
}
