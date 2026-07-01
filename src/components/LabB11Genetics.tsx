import { useState } from 'react';
import { Dna, TestTube, Bug, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabB11Genetics({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeTab, setActiveTab] = useState<'meselson' | 'hershey'>('meselson');

 // Meselson-Stahl State
 const [generation, setGeneration] = useState<number>(0);
 const [isSpinning, setIsSpinning] = useState(false);

 // Hershey-Chase State
 const [phageLabel, setPhageLabel] = useState<'35S' | '32P'>('35S');
 const [hcStep, setHcStep] = useState<0 | 1 | 2 | 3>(0); // 0: Init, 1: Infect, 2: Blend, 3: Centrifuge

 // Assessment State
 const [q1Answer, setQ1Answer] = useState('');
 const [q2Answer, setQ2Answer] = useState('');
 const [q3Answer, setQ3Answer] = useState('');
 const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'checking' | 'passed' | 'failed'>('idle');

 // --- Meselson-Stahl Logic ---
 const handleNextGeneration = () => {
 setIsSpinning(true);
 setTimeout(() => {
  setIsSpinning(false);
  setGeneration(prev => Math.min(prev + 1, 3));
 }, 1200);
 };

 const handleResetMS = () => {
 setGeneration(0);
 setIsSpinning(false);
 };

 // --- Hershey-Chase Logic ---
 const handleNextStepHC = () => {
 if (hcStep === 2) {
  setIsSpinning(true);
  setTimeout(() => {
  setIsSpinning(false);
  setHcStep(3);
  }, 1500);
 } else {
  setHcStep(prev => Math.min(prev + 1, 3) as 0 | 1 | 2 | 3);
 }
 };

 const handleResetHC = () => {
 setHcStep(0);
 setIsSpinning(false);
 };

 // --- Assessment Logic ---
 const checkAnswers = () => {
 setAssessmentStatus('checking');
 setTimeout(() => {
  // Q1: 50
  const isQ1Correct = q1Answer.trim() === '50' || q1Answer.trim() === '50%';
  // Q2: 32P
  const q2 = q2Answer.trim().toUpperCase();
  const isQ2Correct = q2 === '32P' || q2 === 'P32';
  // Q3: semi-conservative
  const q3 = q3Answer.trim().toLowerCase().replace('-', '');
  const isQ3Correct = q3 === 'semiconservative';

  if (isQ1Correct && isQ2Correct && isQ3Correct) {
  setAssessmentStatus('passed');
  } else {
  setAssessmentStatus('failed');
  }
 }, 800);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Molecular Genetics Lab" variant="dark" subtitle="Meselson-Stahl & Hershey-Chase" />

  
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
    <h3 className="text-lg font-semibold text-indigo-800 flex items-center gap-2 mb-2 dark:text-[#ffffff]">
    <Dna size={18} /> Meselson-Stahl Experiment
    </h3>
    <p className="text-sm mb-2">
    Proved that DNA replication is <strong>semi-conservative</strong>. They grew <i>E. coli</i> in a medium containing a heavy isotope of Nitrogen (${'^15'}N$), then transferred them to a light isotope (${'^14'}N$).
    </p>
    <p className="text-sm">
    By centrifuging the DNA in a density gradient, they observed where the DNA bands formed. Heavy DNA (${'^15'}N$) sinks to the bottom, while lighter DNA stays near the top. Hybrid DNA (${'^15'}N$/${'^14'}N$) forms a band in the middle.
    </p>
   </section>

   <section>
    <h3 className="text-lg font-semibold text-indigo-800 flex items-center gap-2 mb-2 dark:text-[#ffffff]">
    <Bug size={18} /> Hershey-Chase Experiment
    </h3>
    <p className="text-sm mb-2">
    Confirmed that DNA is the genetic material, not protein. They used bacteriophages (viruses that infect bacteria).
    </p>
    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
    <li><strong>${'^35'}S (Sulfur):</strong> Labels viral proteins.</li>
    <li><strong>${'^32'}P (Phosphorus):</strong> Labels viral DNA.</li>
    </ul>
    <p className="text-sm mt-2">
    After infection, agitation in a blender removes empty viral coats. Centrifugation separates the heavy bacteria (pellet) from the lighter viral coats (supernatant). Radioactivity in the pellet indicates the genetic material entered the cell.
    </p>
   </section>
   </div>
  </div>

  {/* Column 2: Simulator */}
  <div className={`w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-6 flex flex-col lg:  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className={`flex bg-slate-50 dark:!bg-[#121212] rounded-lg p-1 shadow-sm mb-6 shrink-0 `}>
   <button 
    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'meselson' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-500 hover:bg-gray-50'}`}
    onClick={() => setActiveTab('meselson')}
   >
    Meselson-Stahl Lab
   </button>
   <button 
    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'hershey' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-500 hover:bg-gray-50'}`}
    onClick={() => setActiveTab('hershey')}
   >
    Hershey-Chase Lab
   </button>
   </div>

   {activeTab === 'meselson' && (
   <div className="flex-1 flex flex-col">
    <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border p-6 flex-1 flex flex-col items-center `}>
    <h3 className="font-bold text-gray-800 dark:text-[#ffffff] mb-2">Density Gradient Centrifugation</h3>
    <p className="text-sm text-gray-500 mb-6">Current Medium: <span className="font-bold text-blue-600">14N (Light)</span></p>
    
    <div className="flex-1 flex items-center justify-center relative w-full">
     {/* Centrifuge Tube */}
     <svg width="80" height="250" viewBox="0 0 80 250" className={isSpinning ? 'animate-spin' : ''}>
     {/* Tube Outline */}
     <path d="M20,10 L20,200 Q20,240 40,240 Q60,240 60,200 L60,10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" />
     <ellipse cx="40" cy="10" rx="20" ry="5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
     
     {/* Liquid */}
     <path d="M22,30 L58,30 L58,200 Q58,238 40,238 Q22,238 22,200 Z" fill="#e0e7ff" opacity="0.6" />

     {/* DNA Bands */}
     {!isSpinning && (
      <>
      {generation === 0 && (
       <rect x="25" y="210" width="30" height="10" fill="#1e3a8a" rx="2" /> // Bottom (15N/15N)
      )}
      {generation === 1 && (
       <rect x="25" y="120" width="30" height="10" fill="#6366f1" rx="2" /> // Middle (14N/15N)
      )}
      {generation === 2 && (
       <>
       <rect x="25" y="50" width="30" height="10" fill="#93c5fd" rx="2" /> // Top (14N/14N)
       <rect x="25" y="120" width="30" height="10" fill="#6366f1" rx="2" /> // Middle (14N/15N)
       </>
      )}
      {generation === 3 && (
       <>
       <rect x="25" y="50" width="30" height="14" fill="#93c5fd" rx="2" /> // Top (14N/14N) Thicker
       <rect x="25" y="120" width="30" height="6" fill="#6366f1" rx="2" /> // Middle (14N/15N) Thinner
       </>
      )}
      </>
     )}
     </svg>
     
     {!isSpinning && (
     <div className="absolute right-10 top-0 lg:h-[250px] flex flex-col justify-between text-xs text-gray-500 py-6 font-medium ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
      <div className="flex items-center gap-2"><span className="w-4 border-b border-gray-400"></span>14N/14N</div>
      <div className="flex items-center gap-2"><span className="w-4 border-b border-gray-400"></span>14N/15N</div>
      <div className="flex items-center gap-2"><span className="w-4 border-b border-gray-400"></span>15N/15N</div>
     </div>
     )}
    </div>

    <div className="w-full mt-6 space-y-3">
     <div className={`flex justify-between items-center text-sm font-bold text-gray-700 dark:text-[#ffffff] bg-gray-100 p-3 rounded-lg flex-col `}>
     <span>Generation: {generation}</span>
     <span>{generation === 0 ? '100% 15N' : generation === 1 ? '100% Hybrid' : generation === 2 ? '50% Light / 50% Hybrid' : '75% Light / 25% Hybrid'}</span>
     </div>
     <div className="flex gap-2">
     <button 
      onClick={handleNextGeneration}
      disabled={isSpinning || generation >= 3}
      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
     >
      Grow & Centrifuge (Gen {generation + 1})
     </button>
     <button 
      onClick={handleResetMS}
      disabled={isSpinning}
      className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:text-[#ffffff] rounded-lg font-bold transition-colors disabled:opacity-50"
     >
      Reset
     </button>
     </div>
    </div>
    </div>
   </div>
   )}

   {activeTab === 'hershey' && (
   <div className="flex-1 flex flex-col">
    <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border p-6 flex-1 flex flex-col `}>
    <h3 className="font-bold text-gray-800 dark:text-[#ffffff] mb-4">Hershey-Chase Viral Infection</h3>
    
    <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
     <button 
     className={`w-full py-2 text-sm font-bold rounded-md ${phageLabel === '35S' ? 'bg-amber-100 text-amber-800' : 'text-gray-500'}`}
     onClick={() => { setPhageLabel('35S'); setHcStep(0); }}
     disabled={hcStep > 0}
     >
     35S (Protein Label)
     </button>
     <button 
     className={`w-full py-2 text-sm font-bold rounded-md ${phageLabel === '32P' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-500'}`}
     onClick={() => { setPhageLabel('32P'); setHcStep(0); }}
     disabled={hcStep > 0}
     >
     32P (DNA Label)
     </button>
    </div>

    <div className="flex-1 flex flex-col justify-center items-center relative bg-slate-50 dark:bg-[#121212] border rounded-xl p-4 mb-4">
     {hcStep === 0 && <p className="text-gray-400 font-medium text-center">Select label type and click next to infect bacteria.</p>}
     
     {/* Infection SVG */}
     {hcStep === 1 && (
     <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 100 100">
      {/* Bacteriophage */}
      <path d="M50,10 L65,30 L35,30 Z" fill={phageLabel === '35S' ? '#f59e0b' : '#94a3b8'} stroke="#475569" /> {/* Head */}
      <rect x="47" y="30" width="6" height="20" fill="#94a3b8" /> {/* Tail */}
      <path d="M47,50 L30,65 M53,50 L70,65" stroke="#475569" strokeWidth="2" /> {/* Legs */}
      {/* DNA */}
      <path d="M48,18 Q50,25 52,18 T50,28" stroke={phageLabel === '32P' ? '#5560F1' : '#ef4444'} strokeWidth="2" fill="none" />
      
      {/* Bacterium */}
      <rect x="20" y="60" width="60" height="30" rx="15" fill="#86efac" opacity="0.5" />
      <path d="M50,60 L50,80" stroke={phageLabel === '32P' ? '#5560F1' : '#ef4444'} strokeWidth="2" className="animate-pulse" /> {/* Injecting DNA */}
      </svg>
      <p className="text-sm font-bold mt-2 text-indigo-800 dark:text-[#ffffff]">1. Infection phase</p>
     </div>
     )}

     {/* Blending SVG */}
     {hcStep === 2 && (
     <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 100 100" className="animate-bounce">
      {/* Separated Phage Coats */}
      <path d="M20,20 L30,35 L10,35 Z" fill={phageLabel === '35S' ? '#f59e0b' : '#94a3b8'} opacity="0.8" /> 
      <path d="M80,30 L90,45 L70,45 Z" fill={phageLabel === '35S' ? '#f59e0b' : '#94a3b8'} opacity="0.8" /> 
      
      {/* Bacterium with DNA */}
      <rect x="20" y="50" width="60" height="30" rx="15" fill="#86efac" />
      <path d="M40,65 Q50,55 60,65 T40,65" stroke={phageLabel === '32P' ? '#5560F1' : '#ef4444'} strokeWidth="2" fill="none" />
      </svg>
      <p className="text-sm font-bold mt-2 text-indigo-800 dark:text-[#ffffff]">2. Agitation (Blending)</p>
     </div>
     )}

     {/* Centrifugation SVG */}
     {hcStep === 3 && (
     <div className="flex flex-col items-center">
      {isSpinning ? (
      <TestTube size={48} className="animate-spin text-gray-400" />
      ) : (
      <>
       <svg width="60" height="150" viewBox="0 0 60 150">
       <path d="M10,10 L10,130 Q10,145 30,145 Q50,145 50,130 L50,10" fill="none" stroke="#94a3b8" strokeWidth="2" />
       {/* Supernatant */}
       <path d="M12,30 L48,30 L48,110 L12,110 Z" fill={phageLabel === '35S' ? '#fef3c7' : '#f1f5f9'} />
       {/* Pellet */}
       <path d="M12,110 L48,110 L48,130 Q48,143 30,143 Q12,143 12,130 Z" fill={phageLabel === '32P' ? '#e9d5ff' : '#cbd5e1'} />
       
       {/* Radioactivity indicators */}
       {phageLabel === '35S' && <circle cx="30" cy="70" r="5" fill="#f59e0b" className="animate-ping" />}
       {phageLabel === '32P' && <circle cx="30" cy="125" r="5" fill="#5560F1" className="animate-ping" />}
       </svg>
       <div className="mt-3 text-center text-sm font-bold">
       {phageLabel === '35S' ? (
        <p className="text-amber-600">Radioactivity in Supernatant</p>
       ) : (
        <p className="text-indigo-600">Radioactivity in Pellet</p>
       )}
       </div>
      </>
      )}
     </div>
     )}
    </div>

    <div className="flex gap-2">
     <button 
     onClick={handleNextStepHC}
     disabled={hcStep === 3 || isSpinning}
     className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
     >
     {hcStep === 0 ? 'Infect Bacteria' : hcStep === 1 ? 'Blend Mixture' : hcStep === 2 ? 'Centrifuge' : 'Experiment Complete'}
     </button>
     <button 
     onClick={handleResetHC}
     disabled={isSpinning || hcStep === 0}
     className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:text-[#ffffff] rounded-lg font-bold transition-colors disabled:opacity-50"
     >
     Reset
     </button>
    </div>
    </div>
   </div>
   )}
  </div>

  {/* Column 3: Assessment */}
  <div className="bg-slate-50 dark:bg-[#121212] p-6 border-l flex flex-col lg:overflow-y-auto">
   <h2 className="text-2xl font-bold text-gray-800 dark:text-[#ffffff] mb-4">Assessment</h2>
   
   <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 flex-1 flex flex-col dark:bg-[#121212] dark:border-[#1c1b1b]">
   <h3 className="font-bold text-indigo-900 mb-4 dark:text-[#ffffff]">Knowledge Check</h3>
   
   <div className="space-y-6 flex-1">
    <div>
    <label className="block text-sm font-medium text-gray-800 dark:text-[#ffffff] mb-1">
     1. In the Meselson-Stahl experiment, after 2 generations in 14N, what percentage of the DNA is fully light (14N/14N)?
    </label>
    <div className="flex items-center gap-2">
     <input 
     type="text" 
     value={q1Answer}
     onChange={(e) => setQ1Answer(e.target.value)}
     placeholder="e.g. 25"
     className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
     />
     <span className="text-gray-600 font-medium">%</span>
    </div>
    </div>

    <div>
    <label className="block text-sm font-medium text-gray-800 dark:text-[#ffffff] mb-1">
     2. Which radioactive isotope was used to label DNA in the Hershey-Chase experiment?
    </label>
    <input 
     type="text" 
     value={q2Answer}
     onChange={(e) => setQ2Answer(e.target.value)}
     placeholder="e.g. 14C"
     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
    />
    </div>

    <div>
    <label className="block text-sm font-medium text-gray-800 dark:text-[#ffffff] mb-1">
     3. The Meselson-Stahl experiment proved that DNA replication is:
    </label>
    <input 
     type="text" 
     value={q3Answer}
     onChange={(e) => setQ3Answer(e.target.value)}
     placeholder="e.g. dispersive"
     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
    />
    </div>
   </div>

   <div className="mt-6 pt-4 border-t border-indigo-200">
    <button 
    onClick={checkAnswers}
    disabled={assessmentStatus === 'checking'}
    className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 dark:text-white dark:text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    {assessmentStatus === 'checking' ? 'Evaluating...' : 'Check Answers'}
    </button>

    {assessmentStatus === 'passed' && (
    <div className="mt-3 p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2 text-sm font-medium dark:text-[#ffffff]">
     <CheckCircle size={18} /> Correct! 50% light DNA, 32P labels DNA, and replication is semi-conservative.
    </div>
    )}
    {assessmentStatus === 'failed' && (
    <div className="mt-3 p-3 bg-red-100 text-red-800 rounded-lg flex items-center gap-2 text-sm font-medium">
     <XCircle size={18} /> Incorrect. Review your generations and isotope usages.
    </div>
    )}
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
