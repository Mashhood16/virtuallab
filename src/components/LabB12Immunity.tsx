import { useState, useEffect } from 'react';
import { Shield, FlaskConical, Stethoscope, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabB12Immunity({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [elisaStep, setElisaStep] = useState<number>(0);
 const [absorbance, setAbsorbance] = useState<number>(0);
 const [assessmentConc, setAssessmentConc] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const elisaStages = [
 { name: 'Empty Well', desc: 'Starting with a clean microtiter well.' },
 { name: 'Add Sample', desc: 'Patient sample added. Target antigens bind to the well surface.' },
 { name: 'Add Primary mAb', desc: 'Monoclonal antibodies specific to the antigen are added and bind.' },
 { name: 'Add Secondary mAb', desc: 'Enzyme-linked secondary antibodies bind to the primary mAbs.' },
 { name: 'Add Substrate', desc: 'Substrate is added. Enzyme converts it to a colored product. Color intensity = Antigen concentration.' }
 ];

 useEffect(() => {
 // Generate a random absorbance between 0.5 and 1.5 when component mounts
 const abs = 0.5 + Math.random();
 setAbsorbance(parseFloat(abs.toFixed(2)));
 }, []);

 const handleNextStep = () => {
 if (elisaStep < 4) {
  setElisaStep(elisaStep + 1);
 }
 };

 const handleReset = () => {
 setElisaStep(0);
 setIsCorrect(null);
 setAssessmentConc('');
 const abs = 0.5 + Math.random();
 setAbsorbance(parseFloat(abs.toFixed(2)));
 };

 const handleCheckAnswer = () => {
 // Formula: A = 0.15 * C + 0.05
 // C = (A - 0.05) / 0.15
 const correctC = (absorbance - 0.05) / 0.15;
 const val = parseFloat(assessmentConc);
 if (!isNaN(val) && Math.abs(val - correctC) < 0.2) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Interactive Immunology" />

  
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
   <Shield className="mr-2 text-blue-500" /> Theory & Mechanisms
   </h2>
   <div className="space-y-4 text-slate-600 dark:text-[#a1a1aa] text-sm">
   <div className={`p-4 bg-indigo-50 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    <h3 className="font-semibold text-indigo-800 mb-2 dark:text-[#ffffff]">Monoclonal Antibodies (mAbs)</h3>
    <p>
    mAbs are laboratory-produced molecules engineered to serve as substitute antibodies that can restore, enhance, or mimic the immune system's attack on cells. 
    They are crucial in diagnostics, such as <strong>ELISA</strong> (Enzyme-Linked Immunosorbent Assay).
    </p>
   </div>
   
   <div className={`p-4 bg-teal-50 rounded-lg border border-teal-100 flex-col `}>
    <h3 className="font-semibold text-teal-800 mb-2">Organ Transplant & Rejection</h3>
    <p>
    After an organ transplant, the recipient's immune system may recognize the donor organ as foreign and attack it, primarily via cytotoxic T-cells.
    <strong>Immunosuppressants</strong> like Cyclosporine inhibit T-cell activation, preventing organ rejection.
    </p>
   </div>
   </div>
  </div>

  {/* Simulation Column */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex w-full">
   <FlaskConical className="mr-2 text-indigo-500" /> ELISA Simulator
   </h2>
   
   <div className="flex-grow flex flex-col items-center justify-center w-full space-y-6">
   <div className="text-center h-16">
    <h3 className="font-bold text-indigo-700 text-lg">{elisaStages[elisaStep].name}</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] max-w-xs">{elisaStages[elisaStep].desc}</p>
   </div>

   {/* SVG ELISA Well */}
   <div className="relative w-48 h-48 bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] border-4 border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] rounded-b-3xl shadow-inner flex flex-col justify-end ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    
    {/* Colored liquid */}
    <div 
    className={`absolute bottom-0 w-full transition-all duration-1000 ease-in-out ${elisaStep === 4 ? 'bg-yellow-400 opacity-80' : 'bg-blue-100 opacity-0'}`}
    style={{ height: elisaStep >= 1 ? '70%' : '0%' }}
    ></div>

    {/* Molecular structures inside well (simplified) */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
    {/* Antigens */}
    {elisaStep >= 1 && (
     <g fill="#EF4444">
     <circle cx="20" cy="85" r="4" />
     <circle cx="50" cy="85" r="4" />
     <circle cx="80" cy="85" r="4" />
     </g>
    )}
    {/* Primary mAbs */}
    {elisaStep >= 2 && (
     <g stroke="#3B82F6" strokeWidth="2" fill="none">
     <path d="M 20 81 L 20 70 L 15 65 M 20 70 L 25 65" />
     <path d="M 50 81 L 50 70 L 45 65 M 50 70 L 55 65" />
     <path d="M 80 81 L 80 70 L 75 65 M 80 70 L 85 65" />
     </g>
    )}
    {/* Secondary mAbs with Enzyme */}
    {elisaStep >= 3 && (
     <g>
     <g stroke="#10B981" strokeWidth="2" fill="none">
      <path d="M 15 65 L 10 55 M 15 65 L 20 55 L 20 50" />
      <path d="M 45 65 L 40 55 M 45 65 L 50 55 L 50 50" />
      <path d="M 75 65 L 70 55 M 75 65 L 80 55 L 80 50" />
     </g>
     <g fill="#F59E0B">
      <circle cx="20" cy="48" r="3" />
      <circle cx="50" cy="48" r="3" />
      <circle cx="80" cy="48" r="3" />
     </g>
     </g>
    )}
    </svg>
   </div>

   <div className="flex space-x-4">
    <button 
    onClick={handleNextStep}
    disabled={elisaStep === 4}
    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    Next Step
    </button>
    <button 
    onClick={handleReset}
    className="px-6 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg font-semibold hover:bg-slate-300 dark:bg-[#121212]"
    >
    Reset
    </button>
   </div>
   
   {elisaStep === 4 && (
    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 font-bold">
    Spectrophotometer Reading: {absorbance} AU
    </div>
   )}
   </div>
  </div>

  {/* Assessment Column */}
  <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
   <Stethoscope className="mr-2 text-rose-500" /> Clinical Assessment
   </h2>
   
   <div className="flex-grow space-y-6">
   <div className="p-4 bg-slate-100 dark:bg-[#121212] rounded-lg text-sm text-slate-700 dark:text-[#ffffff]">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Determine Antigen Concentration</h3>
    <p className="mb-2">
    A standard curve was generated using known concentrations of the transplant rejection biomarker. The linear regression equation is:
    </p>
    <div className="bg-slate-50 dark:bg-[#121212] p-2 rounded border border-slate-300 dark:border-[#1c1b1b] font-mono text-center my-2 text-indigo-700">
    Absorbance (A) = 0.15 × C + 0.05
    </div>
    <p>Where <strong>C</strong> is the concentration of the biomarker in ng/mL.</p>
    
    {elisaStep === 4 ? (
    <p className="mt-3 font-semibold text-rose-700">
     Given the patient's absorbance reading of {absorbance} AU, calculate C.
    </p>
    ) : (
    <p className="mt-3 text-slate-500 dark:text-[#71717a] italic">
     Complete the ELISA simulation to get the patient's absorbance reading.
    </p>
    )}
   </div>

   <div className="space-y-4">
    <div>
    <label className="block text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-wide mb-1">
     Concentration (ng/mL)
    </label>
    <div className="flex space-x-2">
     <input 
     type="number"
     step="0.01"
     className="flex-grow p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
     placeholder="e.g. 5.2"
     value={assessmentConc}
     onChange={(e) => setAssessmentConc(e.target.value)}
     disabled={elisaStep < 4}
     />
     <button 
     onClick={handleCheckAnswer}
     disabled={elisaStep < 4 || !assessmentConc}
     className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
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
      ? `Excellent. C = (${absorbance} - 0.05) / 0.15 = ${((absorbance - 0.05) / 0.15).toFixed(2)} ng/mL.` 
      : 'Review your algebra: subtract 0.05 from the absorbance, then divide by 0.15.'}
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
