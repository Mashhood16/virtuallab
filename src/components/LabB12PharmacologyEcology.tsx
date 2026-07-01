import { useState } from 'react';
import { Shield, Waves, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabB12PharmacologyEcology({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeTab, setActiveTab] = useState<'pharma' | 'ecology'>('pharma');
 
 // Pharma state
 const [penicillinDose, setPenicillinDose] = useState(0);
 
 // Ecology state
 const [pCO2, setPCO2] = useState(280);
 
 // Assessment state
 const [ans1, setAns1] = useState('');
 const [ans2, setAns2] = useState('');
 const [ans3, setAns3] = useState('');
 const [feedback, setFeedback] = useState('');

 const currentPH = (8.2 - ((pCO2 - 280) * 0.0007)).toFixed(2);
 const isBleached = parseFloat(currentPH) < 7.9;
 const isBurst = penicillinDose > 70;

 const checkAnswers = () => {
 let score = 0;
 if (ans1.trim().toLowerCase() === 'transpeptidase') score++;
 if (ans2.trim() === '3') score++;
 if (ans3.trim() === '8.1') score++;
 
 if (score === 3) setFeedback('Excellent! All systems analyzed correctly.');
 else setFeedback(`You scored ${score}/3. Review the theory sections and try again.`);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Pharmacology & Ecosystems" subtitle="Antibiotic Mechanisms & Ocean Acidification" />
  <div className="flex gap-2 px-6 py-2 bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b]">
  <button 
   onClick={() => setActiveTab('pharma')}
   className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${activeTab === 'pharma' ? 'bg-slate-50 dark:bg-[#121212] text-teal-800' : 'bg-teal-700 text-white hover:bg-teal-600'}`}>
   <Shield className="w-4 h-4" /> Pharma
  </button>
  <button 
   onClick={() => setActiveTab('ecology')}
   className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${activeTab === 'ecology' ? 'bg-slate-50 dark:bg-[#121212] text-teal-800' : 'bg-teal-700 text-white hover:bg-teal-600'}`}>
   <Waves className="w-4 h-4" /> Ecology
  </button>
  </div>

  
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
  <main className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:min-h-0 overflow-y-auto lg:overflow-visible">
  {/* Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col lg:overflow-y-auto  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">
   {activeTab === 'pharma' ? 'Pharmacology Theory' : 'Ecology Theory'}
   </h2>
   
   {activeTab === 'pharma' ? (
   <div className="space-y-4 text-sm text-slate-600 dark:text-[#a1a1aa]">
    <p><strong>Penicillin Mechanism:</strong> Beta-lactam antibiotics irreversibly inhibit the enzyme <em>transpeptidase</em>, which forms cross-links in the bacterial peptidoglycan cell wall.</p>
    <p>Without cross-links, the cell wall weakens. Due to high internal osmotic pressure, water rushes into the bacterium, causing it to lyse (burst).</p>
    <p><strong>Clinical Trials:</strong></p>
    <ul className="list-disc pl-5 space-y-1">
    <li><strong>Phase 1:</strong> Safety, dosage, and pharmacokinetics in healthy volunteers (20-100 people).</li>
    <li><strong>Phase 2:</strong> Efficacy and side effects in patients with the disease (100-300).</li>
    <li><strong>Phase 3:</strong> Large-scale comparison with standard treatments (1000+ patients).</li>
    <li><strong>Phase 4:</strong> Post-marketing surveillance.</li>
    </ul>
   </div>
   ) : (
   <div className="space-y-4 text-sm text-slate-600 dark:text-[#a1a1aa]">
    <p><strong>Ocean Acidification:</strong> Increased atmospheric carbon dioxide dissolves into ocean water, forming carbonic acid:</p>
    <p className={`font-mono bg-slate-100 dark:bg-[#121212] p-2 rounded text-center text-xs border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    CO₂ + H₂O ⇌ H₂CO₃ ⇌ HCO₃⁻ + H⁺
    </p>
    <p>This increases the concentration of hydrogen ions [H⁺], lowering the pH.</p>
    <p><strong>Coral Bleaching:</strong> Corals live in symbiosis with photosynthetic algae (zooxanthellae). Environmental stress (low pH, high temp) causes corals to expel these algae, leaving their white calcium carbonate (CaCO₃) skeletons visible.</p>
   </div>
   )}
  </div>

  {/* Interactive */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">
   {activeTab === 'pharma' ? 'Bacterial Lysis Simulator' : 'Coral Reef Simulator'}
   </h2>
   
   {activeTab === 'pharma' ? (
   <div className="flex-1 flex flex-col items-center">
    <div className="w-full mb-6">
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>Penicillin Concentration (mg/L)</span>
     <span className="font-bold text-teal-600">{penicillinDose}</span>
    </label>
    <input 
     type="range" min="0" max="100" value={penicillinDose}
     onChange={(e) => setPenicillinDose(Number(e.target.value))}
     className="w-full accent-teal-600"
    />
    </div>
    
    <div className={`relative w-64 h-64 bg-slate-100 dark:bg-[#121212] rounded-full flex items-center justify-center border border-slate-300 dark:border-[#1c1b1b] overflow- shadow-inner flex-col `}>
    <svg viewBox="0 0 200 200" className={`w-full h-full transition-all duration-500 ${isBurst ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
     {/* Cell interior */}
     <ellipse cx="100" cy="100" rx={60 + (penicillinDose * 0.2)} ry={40 + (penicillinDose * 0.1)} fill="#fecaca" />
     {/* DNA */}
     <path d="M 90 90 Q 100 80 110 90 T 100 110 T 80 100" fill="none" stroke="#dc2626" strokeWidth="2" />
     {/* Cell Wall (peptidoglycan) */}
     <ellipse cx="100" cy="100" rx={64 + (penicillinDose * 0.2)} ry={44 + (penicillinDose * 0.1)} fill="none" stroke="#059669" strokeWidth="6" 
     strokeDasharray={penicillinDose > 20 ? (penicillinDose > 50 ? "10 20" : "20 5") : "none"} 
     />
     {/* Water rushing in */}
     {penicillinDose > 30 && (
     <g className="animate-pulse">
      <circle cx="20" cy="100" r="3" fill="#3b82f6" />
      <circle cx="30" cy="110" r="3" fill="#3b82f6" />
      <circle cx="180" cy="90" r="3" fill="#3b82f6" />
      <circle cx="170" cy="80" r="3" fill="#3b82f6" />
      <path d="M 30 100 L 50 100 M 170 100 L 150 100" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow)" />
     </g>
     )}
    </svg>
    {isBurst && (
     <div className="absolute inset-0 flex items-center justify-center font-bold text-red-600 text-xl tracking-widest bg-red-50/80 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
     CELL LYSED
     </div>
    )}
    </div>
   </div>
   ) : (
   <div className="flex-1 flex flex-col items-center">
    <div className="w-full mb-6">
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>Atmospheric pCO₂ (ppm)</span>
     <span className="font-bold text-blue-600">{pCO2}</span>
    </label>
    <input 
     type="range" min="280" max="1000" value={pCO2}
     onChange={(e) => setPCO2(Number(e.target.value))}
     className="w-full accent-blue-600"
    />
    <div className={`text-center text-xs mt-2 font-mono bg-blue-50 p-1 rounded border border-blue-200 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>Ocean pH: {currentPH}</div>
    </div>

    <div className="relative w-64 h-64 bg-cyan-900 rounded-lg flex items-center justify-center border-4 border-cyan-800 overflow-hidden shadow-inner">
    <svg viewBox="0 0 200 200" className="w-full h-full">
     {/* Water background */}
     <rect width="200" height="200" fill={isBleached ? "#083344" : "#164e63"} className="transition-colors duration-1000" />
     
     {/* Coral Skeleton */}
     <path d="M 50 200 Q 60 140 40 100 Q 80 120 100 160 Q 120 80 160 110 Q 140 160 150 200 Z" fill={isBleached ? "#f8fafc" : "#fdba74"} className="transition-colors duration-1000" />
     
     {/* Zooxanthellae */}
     {!isBleached && (
     <g className="opacity-80 transition-opacity duration-1000">
      <circle cx="60" cy="130" r="3" fill="#166534" />
      <circle cx="70" cy="150" r="2" fill="#166534" />
      <circle cx="110" cy="140" r="3" fill="#166534" />
      <circle cx="130" cy="120" r="2" fill="#166534" />
      <circle cx="140" cy="170" r="3" fill="#166534" />
      <circle cx="50" cy="170" r="2" fill="#166534" />
     </g>
     )}
     {/* Escaping Zooxanthellae */}
     {isBleached && (
     <g className="animate-[bounce_3s_ease-in-out_infinite] opacity-50">
      <circle cx="80" cy="50" r="3" fill="#166534" />
      <circle cx="120" cy="30" r="2" fill="#166534" />
      <circle cx="160" cy="60" r="3" fill="#166534" />
     </g>
     )}
    </svg>
    {isBleached && (
     <div className="absolute top-4 bg-slate-50 dark:bg-[#121212]/90 px-2 py-1 rounded text-xs font-bold text-red-600 shadow">
     Bleaching Event
     </div>
    )}
    </div>
   </div>
   )}
  </div>

  {/* Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col lg:overflow-y-auto `}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">Comprehensive Assessment</h2>
   
   <div className="space-y-4 text-sm">
   <div className="space-y-1">
    <label className="block font-medium text-slate-700 dark:text-[#ffffff]">
    1. Which specific bacterial enzyme does Penicillin irreversibly inhibit?
    </label>
    <input 
    type="text" 
    className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-teal-500 outline-none"
    value={ans1}
    onChange={e => setAns1(e.target.value)}
    placeholder="e.g. amylase"
    />
   </div>

   <div className="space-y-1">
    <label className="block font-medium text-slate-700 dark:text-[#ffffff]">
    2. Which phase of a clinical trial involves a large-scale comparison (1000+ patients) to standard treatments? (Enter 1, 2, 3, or 4)
    </label>
    <input 
    type="number" min="1" max="4"
    className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-teal-500 outline-none"
    value={ans2}
    onChange={e => setAns2(e.target.value)}
    />
   </div>

   <div className="space-y-1">
    <label className="block font-medium text-slate-700 dark:text-[#ffffff]">
    3. If the concentration of [H⁺] ions in ocean water is measured at 1.0 × 10⁻⁸.¹ M, what is the pH of the water?
    </label>
    <input 
    type="number" step="0.1"
    className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-teal-500 outline-none"
    value={ans3}
    onChange={e => setAns3(e.target.value)}
    placeholder="e.g. 7.5"
    />
   </div>

   <button 
    onClick={checkAnswers}
    className="w-full bg-[#121212] dark:bg-[#121212] text-white font-semibold py-2 mt-4 rounded hover:bg-[#000000] dark:bg-[#121212] transition-colors flex items-center justify-center gap-2">
    <CheckCircle className="w-5 h-5" /> Submit Assessment
   </button>

   {feedback && (
    <div className={`p-3 mt-2 rounded text-sm font-medium ${feedback.includes('Excellent') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
    {feedback}
    </div>
   )}
   </div>
  </div>
  </main>
 </div>
 );
}
