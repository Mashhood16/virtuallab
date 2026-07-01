import { useState } from 'react';
import {Scissors, ArrowRightLeft, Check } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabS8CrossingOverProps {
 onExit?: () => void;
}

export default function LabS8CrossingOver({ onExit }: LabS8CrossingOverProps) {
 const [step, setStep] = useState(0);

 const handleNext = () => {
 if (step < 3) setStep(step + 1);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans">
  <LabHeader onExit={onExit} title="Act 3.3: Crossing Over" subtitle="Model genetic recombination during meiosis" />

  <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
  {/* Left Column: Interactive Diagram */}
  <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center min-h-[500px]">
   
   <div className="relative w-80 h-96 flex justify-center items-center">
   
   {/* Paternal Chromosome (Blue) */}
   <div 
    className={`absolute w-12 h-64 rounded-full transition-all duration-1000 ${step >= 1 ? '-translate-x-6 rotate-6' : '-translate-x-12'}`}
   >
    <div className={`w-full h-1/2 rounded-t-full ${step >= 3 ? 'bg-pink-400' : 'bg-blue-400'}`} />
    <div className="w-full h-1/2 bg-blue-500 rounded-b-full /20 dark:border-teal-900 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40" />
    {/* Centromere */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full z-10 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40" />
   </div>

   {/* Maternal Chromosome (Pink) */}
   <div 
    className={`absolute w-12 h-64 rounded-full transition-all duration-1000 ${step >= 1 ? 'translate-x-6 -rotate-6' : 'translate-x-12'}`}
   >
    <div className={`w-full h-1/2 rounded-t-full ${step >= 3 ? 'bg-blue-400' : 'bg-pink-400'}`} />
    <div className="w-full h-1/2 bg-pink-500 rounded-b-full dark:bg-pink-500 dark:hover:bg-pink-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-pink-500/40" />
    {/* Centromere */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-pink-600 rounded-full z-10 dark:bg-pink-500 dark:hover:bg-pink-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-pink-500/40" />
   </div>

   {/* Animation Overlays */}
   {step === 2 && (
    <div className="absolute top-16 z-20 animate-bounce">
    <Scissors className="w-12 h-12 text-slate-700 dark:text-[#ffffff]" />
    </div>
   )}

   {step === 3 && (
    <div className="absolute top-16 z-20 text-green-500 animate-pulse">
    <ArrowRightLeft className="w-12 h-12" />
    </div>
   )}

   </div>

   <div className="mt-8">
   <button 
    onClick={handleNext}
    disabled={step === 3}
    className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors text-lg shadow-sm dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    {step === 0 && "Align Homologous Pairs"}
    {step === 1 && "Make the Cut"}
    {step === 2 && "Swap Segments"}
    {step === 3 && "Recombination Complete"}
   </button>
   </div>

  </div>

  {/* Right Column: Educational Text */}
  <div className="w-full md:w-80 flex flex-col gap-4">
   <div className="bg-[#121212] dark:!bg-[#121212] rounded-2xl shadow-sm text-white p-6 border border-[#1c1b1b] dark:border-[#1c1b1b] h-full">
   <h3 className="font-bold text-slate-200 mb-6 text-xl">The Process</h3>
   
   <div className="space-y-6">
    <div className={`transition-opacity duration-300 ${step >= 0 ? 'opacity-100' : 'opacity-30'}`}>
    <h4 className="font-bold text-indigo-300">1. Pairing Up</h4>
    <p className="text-sm text-slate-400 mt-1">Homologous chromosomes (one from each parent) align perfectly next to each other.</p>
    </div>

    <div className={`transition-opacity duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-30'}`}>
    <h4 className="font-bold text-indigo-300">2. Chiasma Formation</h4>
    <p className="text-sm text-slate-400 mt-1">The chromatids overlap at points called chiasmata, physically touching each other.</p>
    </div>

    <div className={`transition-opacity duration-300 ${step >= 2 ? 'opacity-100' : 'opacity-30'}`}>
    <h4 className="font-bold text-indigo-300">3. DNA Cleavage</h4>
    <p className="text-sm text-slate-400 mt-1">Enzymes cut both DNA molecules at identical locations.</p>
    </div>

    <div className={`transition-opacity duration-300 ${step >= 3 ? 'opacity-100' : 'opacity-30'}`}>
    <h4 className="font-bold text-green-400 flex items-center gap-2">
     <CheckCircle2 className="w-5 h-5" /> 4. Recombination
    </h4>
    <p className="text-sm text-slate-400 mt-1">
     The broken DNA is repaired, but the segments are swapped! This creates new, unique combinations of genes, driving genetic variation in offspring.
    </p>
    </div>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}

function CheckCircle2(props: any) {
 return <Check {...props} />;
}
