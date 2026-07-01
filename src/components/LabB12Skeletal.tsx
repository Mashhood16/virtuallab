import { useState } from 'react';
import { Bone, Activity, PenTool, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabB12Skeletal({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [fractureStage, setFractureStage] = useState<number>(1);
 const [jointState, setJointState] = useState<'healthy' | 'damaged' | 'prosthetic'>('healthy');
 
 // Assessment
 const [assessmentStress, setAssessmentStress] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const stages = [
 { id: 1, name: 'Hematoma Formation', desc: 'Blood vessels tear and hemorrhage, forming a mass of clotted blood (hematoma).' },
 { id: 2, name: 'Fibrocartilaginous Callus', desc: 'Capillaries grow into the hematoma; phagocytic cells clear debris; fibroblasts secrete collagen to connect broken ends.' },
 { id: 3, name: 'Bony Callus', desc: 'Osteoblasts and osteoclasts multiply. The fibrocartilaginous callus is converted into a bony callus of spongy bone.' },
 { id: 4, name: 'Bone Remodeling', desc: 'The bony callus is remodeled by osteoclasts and osteoblasts. Compact bone is laid down to reconstruct shaft walls.' },
 ];

 const handleCheckAnswer = () => {
 const val = parseFloat(assessmentStress);
 if (!isNaN(val) && Math.abs(val - 0.6) < 0.05) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  {/* Header */}
  <LabHeader onExit={onExit} title="Interactive Orthopedics" subtitle="Arthroplasty & Bone Fracture Repair" />

  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 flex-grow overflow-y-auto lg:overflow-visible">
  
  {/* Theory Column */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
   <Bone className="mr-2 text-blue-500" /> Theory & Context
   </h2>
   <div className="space-y-4 text-slate-600 dark:text-[#a1a1aa] text-sm">
   <div className={`p-4 bg-orange-50 rounded-lg border border-orange-100 flex-col `}>
    <h3 className="font-semibold text-orange-800 mb-2">The 4 Steps of Fracture Repair</h3>
    <ol className="list-decimal pl-5 space-y-2">
    <li><strong>Hematoma:</strong> Clotted blood forms at the fracture site within hours.</li>
    <li><strong>Fibrocartilaginous Callus:</strong> Soft callus forms within days.</li>
    <li><strong>Bony Callus:</strong> Trabecular bone replaces soft callus over weeks.</li>
    <li><strong>Remodeling:</strong> Compact bone replaces spongy bone over months.</li>
    </ol>
   </div>
   
   <div className={`p-4 bg-zinc-50 rounded-lg border border-zinc-200 flex-col `}>
    <h3 className="font-semibold text-zinc-800 mb-2">Arthroplasty</h3>
    <p>
    Joint replacement surgery involves removing damaged articular cartilage and bone, replacing it with prosthetic components. 
    <strong> Titanium</strong> is highly biocompatible, meaning it integrates well with bone (osseointegration) without causing an immune response.
    </p>
   </div>
   </div>
  </div>

  {/* Simulation Column */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col relative lg: ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex">
   <Activity className="mr-2 text-indigo-500" /> Clinical Simulators
   </h2>
   
   {/* Fracture Timeline */}
   <div className="mb-8">
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-3 text-center">Fracture Repair Timeline</h3>
   <div className="flex justify-between items-center mb-4">
    {stages.map((st) => (
    <button
     key={st.id}
     onClick={() => setFractureStage(st.id)}
     className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${fractureStage === st.id ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-200 dark:bg-[#121212] text-slate-500 dark:text-[#a1a1aa] hover:bg-slate-300 dark:bg-[#121212]'}`}
    >
     {st.id}
    </button>
    ))}
   </div>
   <div className="p-4 bg-slate-50 dark:bg-[#121212] border rounded-lg h-32">
    <h4 className="font-bold text-orange-700">{stages[fractureStage - 1].name}</h4>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mt-2">{stages[fractureStage - 1].desc}</p>
   </div>
   {/* SVG Illustration of bone */}
   <div className="mt-4 flex justify-center">
    <svg width="200" height="100" viewBox="0 0 200 100" className="drop-shadow-lg">
    {/* Basic bone shape */}
    <path d="M 20 30 C 10 10, 50 10, 60 30 L 140 30 C 150 10, 190 10, 180 30 C 190 50, 190 80, 180 70 C 190 90, 150 90, 140 70 L 60 70 C 50 90, 10 90, 20 70 C 10 80, 10 50, 20 30 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
    
    {fractureStage === 1 && (
     <circle cx="100" cy="50" r="15" fill="#EF4444" opacity="0.8" /> // Hematoma
    )}
    {fractureStage === 2 && (
     <ellipse cx="100" cy="50" rx="20" ry="25" fill="#93C5FD" opacity="0.8" /> // Fibrocartilage
    )}
    {fractureStage === 3 && (
     <ellipse cx="100" cy="50" rx="20" ry="25" fill="#D97706" opacity="0.6" /> // Bony callus
    )}
    {fractureStage === 4 && (
     // Remodeled - thicker shaft wall
     <rect x="80" y="28" width="40" height="44" fill="#FDE68A" stroke="#B45309" strokeWidth="4" />
    )}
    {/* Fracture line */}
    {fractureStage < 4 && (
     <path d="M 95 30 L 105 50 L 95 70" stroke="#78350F" strokeWidth="2" fill="none" />
    )}
    </svg>
   </div>
   </div>

   <hr className="my-4 border-slate-200 dark:border-[#1c1b1b]" />

   {/* Arthroplasty */}
   <div>
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-3 text-center">Hip Arthroplasty (Joint Replacement)</h3>
   <div className="flex justify-center space-x-2 mb-4">
    {['healthy', 'damaged', 'prosthetic'].map(state => (
     <button
     key={state}
     onClick={() => setJointState(state as any)}
     className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-colors ${jointState === state ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-300 dark:bg-[#121212]'}`}
     >
     {state}
     </button>
    ))}
   </div>
   
   <div className="flex justify-center items-center p-4 bg-slate-100 dark:bg-[#121212] rounded-lg relative h-40">
    <svg width="100" height="120" viewBox="0 0 100 120">
    {/* Pelvis Acetabulum */}
    <path d="M 20 20 C 50 10, 70 30, 80 50 C 70 70, 50 90, 20 80 C 40 60, 40 40, 20 20 Z" fill="#FDE68A" stroke="#92400E" strokeWidth="2" />
    
    {jointState === 'healthy' && (
     <g>
     <circle cx="65" cy="50" r="18" fill="#FDE68A" stroke="#92400E" strokeWidth="2" />
     {/* Cartilage */}
     <path d="M 50 40 A 18 18 0 0 0 50 60" stroke="#93C5FD" strokeWidth="4" fill="none" />
     <path d="M 65 68 L 50 120 L 80 120 Z" fill="#FDE68A" stroke="#92400E" strokeWidth="2" />
     </g>
    )}
    
    {jointState === 'damaged' && (
     <g>
     <circle cx="65" cy="50" r="18" fill="#FDE68A" stroke="#92400E" strokeWidth="2" strokeDasharray="2 2" />
     {/* Damaged Cartilage */}
     <path d="M 50 40 A 18 18 0 0 0 50 60" stroke="#EF4444" strokeWidth="2" fill="none" strokeDasharray="1 3" />
     <path d="M 65 68 L 50 120 L 80 120 Z" fill="#FDE68A" stroke="#92400E" strokeWidth="2" />
     </g>
    )}

    {jointState === 'prosthetic' && (
     <g>
     {/* Acetabular cup (Titanium) */}
     <path d="M 40 35 C 55 35, 65 45, 65 50 C 65 55, 55 65, 40 65" fill="none" stroke="#94A3B8" strokeWidth="6" />
     {/* Prosthetic Head */}
     <circle cx="62" cy="50" r="14" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
     {/* Stem */}
     <path d="M 62 64 L 62 100 L 68 120 L 56 120 Z" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
     </g>
    )}
    </svg>
   </div>
   </div>
  </div>

  {/* Assessment Column */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
   <PenTool className="mr-2 text-green-500" /> Computing Task
   </h2>
   
   <div className="flex-grow space-y-6">
   <div className="p-4 bg-slate-100 dark:bg-[#121212] rounded-lg text-sm text-slate-700 dark:text-[#ffffff]">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Biomechanical Stress on Prosthetic</h3>
    <p className="mb-2">
    A patient weighing <strong>100 kg</strong> receives a titanium hip implant. When walking, the force on the hip joint can peak at roughly <strong>3 times body weight</strong>.
    </p>
    <ul className="list-disc pl-5 mb-2">
    <li>Gravity: g = 9.8 m/s²</li>
    <li>Force = 3 × mass × g = 3 × 100 × 9.8 = <strong>2940 N</strong></li>
    <li>Cross-sectional area of prosthetic stem: <strong>0.0049 m²</strong></li>
    </ul>
    <p>Calculate the compressive stress applied to the prosthetic stem in Megapascals (MPa). <em>(Stress = Force / Area)</em></p>
    <p className="text-xs text-slate-500 dark:text-[#71717a] mt-2">Note: 1 MPa = 1,000,000 Pa = 1,000,000 N/m².</p>
   </div>

   <div className="space-y-4">
    <div>
    <label className="block text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-wide mb-1">
     Compressive Stress (MPa)
    </label>
    <div className="flex space-x-2">
     <input 
     type="number"
     step="0.01"
     className="flex-grow p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
     placeholder="e.g. 1.5"
     value={assessmentStress}
     onChange={(e) => setAssessmentStress(e.target.value)}
     />
     <button 
     onClick={handleCheckAnswer}
     disabled={!assessmentStress}
     className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
     >
     Check
     </button>
    </div>
    </div>

    {isCorrect !== null && (
    <div className={`p-4 rounded-lg flex items-start space-x-3 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
     {isCorrect ? <CheckCircle className="mt-0.5" size={20} /> : <XCircle className="mt-0.5" size={20} />}
     <div>
     <h4 className="font-bold">{isCorrect ? 'Correct!' : 'Incorrect'}</h4>
     <p className="text-sm mt-1">
      {isCorrect 
      ? '2940 N / 0.0049 m² = 600,000 Pa = 0.6 MPa.' 
      : 'Check your calculation. Stress = 2940 / 0.0049. Convert to MPa by dividing by 1,000,000.'}
     </p>
     </div>
    </div>
    )}
   </div>
   </div>
  </div>

  </div>
 </div>
 );
}
