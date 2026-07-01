import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS7CalculatingSubatomicParticles({ onExit }: LabProps) {
 const [protons, setProtons] = useState('');
 const [neutrons, setNeutrons] = useState('');
 const [electrons, setElectrons] = useState('');
 
 const targetAtomicNumber = 9;
 const targetMassNumber = 19;

 const isProtonsCorrect = parseInt(protons) === targetAtomicNumber;
 const isElectronsCorrect = parseInt(electrons) === targetAtomicNumber; // Assuming neutral atom
 const isNeutronsCorrect = parseInt(neutrons) === (targetMassNumber - targetAtomicNumber);

 const allCorrect = isProtonsCorrect && isElectronsCorrect && isNeutronsCorrect;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Unit 5: Subatomic Particles" />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-w-2xl w-full">
   <h2 className="text-2xl font-bold text-blue-800 mb-2 dark:text-[#ffffff]">Calculate the Particles</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-8">
   You are given an element with an <strong>Atomic Number of 9</strong> and a <strong>Mass Number of 19</strong>. 
   Calculate the number of Protons, Neutrons, and Electrons in a neutral atom of this element.
   </p>
   
   <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8 flex justify-between items-center px-12 dark:bg-teal-950/20 dark:border-teal-900">
   <div className="text-center">
    <div className="text-sm font-bold text-blue-500 uppercase tracking-wider">Atomic Number (Z)</div>
    <div className="text-5xl font-black text-blue-900 dark:text-[#ffffff]">{targetAtomicNumber}</div>
   </div>
   <div className="text-center text-3xl font-bold text-blue-200">+</div>
   <div className="text-center">
    <div className="text-sm font-bold text-indigo-500 uppercase tracking-wider">Mass Number (A)</div>
    <div className="text-5xl font-black text-indigo-900 dark:text-[#ffffff]">{targetMassNumber}</div>
   </div>
   </div>

   <div className="space-y-6">
   {/* Protons Input */}
   <div>
    <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-2">Number of Protons (p⁺)</label>
    <div className="flex items-center gap-4">
    <input 
     type="number" 
     value={protons} 
     onChange={e => setProtons(e.target.value)}
     className="flex-1 p-3 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg"
     placeholder="Enter number..."
    />
    {protons !== '' && (
     isProtonsCorrect ? <CheckCircle className="text-green-500 w-6 h-6" /> : <XCircle className="text-red-500 w-6 h-6" />
    )}
    </div>
    <p className="text-xs text-slate-500 dark:text-[#71717a] mt-1">Hint: Atomic Number equals the number of protons.</p>
   </div>

   {/* Electrons Input */}
   <div>
    <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-2">Number of Electrons (e⁻)</label>
    <div className="flex items-center gap-4">
    <input 
     type="number" 
     value={electrons} 
     onChange={e => setElectrons(e.target.value)}
     className="flex-1 p-3 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg"
     placeholder="Enter number..."
    />
    {electrons !== '' && (
     isElectronsCorrect ? <CheckCircle className="text-green-500 w-6 h-6" /> : <XCircle className="text-red-500 w-6 h-6" />
    )}
    </div>
    <p className="text-xs text-slate-500 dark:text-[#71717a] mt-1">Hint: In a neutral atom, protons equal electrons.</p>
   </div>

   {/* Neutrons Input */}
   <div>
    <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-2">Number of Neutrons (n⁰)</label>
    <div className="flex items-center gap-4">
    <input 
     type="number" 
     value={neutrons} 
     onChange={e => setNeutrons(e.target.value)}
     className="flex-1 p-3 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg"
     placeholder="Enter number..."
    />
    {neutrons !== '' && (
     isNeutronsCorrect ? <CheckCircle className="text-green-500 w-6 h-6" /> : <XCircle className="text-red-500 w-6 h-6" />
    )}
    </div>
    <p className="text-xs text-slate-500 dark:text-[#71717a] mt-1">Hint: Mass Number = Protons + Neutrons. Solve for Neutrons.</p>
   </div>
   </div>

   {allCorrect && (
   <div className="mt-8 p-4 bg-green-100 text-green-800 rounded-xl border border-green-200 text-center font-bold animate-pulse dark:text-[#ffffff]">
    Excellent! Fluorine (F) has an atomic number of 9 and mass number of 19. It contains 9 protons, 9 electrons, and 10 neutrons.
   </div>
   )}
  </div>
  </div>
 </div>
 );
}
