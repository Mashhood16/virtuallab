import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS7LithiumBonding({ onExit }: LabProps) {
 const [isIon, setIsIon] = useState(false);

 return (
 <div className="flex flex-col h-screen overflow-y-auto font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff]">
  <LabHeader onExit={onExit} title="Unit 6: Chemical Bonds (Atoms vs. Ions)" />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="p-6 rounded-2xl shadow-xl max-w-3xl w-full text-center mb-8" style={{backgroundColor: '#1e293b', borderColor: '#334155', borderWidth: '1px', borderStyle: 'solid'}}>
   <h2 className="text-2xl font-bold text-indigo-400 mb-4">Lithium Atom vs. Lithium Ion</h2>
   <p className="text-slate-300 mb-6">Compare a neutral Lithium atom (Li) with a Lithium ion (Li⁺). Observe what happens to its valence electron during ionization.</p>
   
   <div className="flex justify-center gap-4">
   <button 
    onClick={() => setIsIon(!isIon)}
    className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    <RefreshCw className="w-5 h-5 mr-2" />
    Toggle: {isIon ? 'Show Neutral Atom (Li)' : 'Show Ion (Li⁺)'}
   </button>
   </div>
  </div>

  <div className="flex gap-16 w-full max-w-5xl justify-center items-center mt-12">
   
   {/* Visual Model */}
   <div className="relative w-96 h-96 flex justify-center items-center">
    
    {/* Shell 1 */}
    <div className="absolute border border-slate-500 dark:border-[#1c1b1b]/50 rounded-full w-40 h-40 flex justify-center items-center">
    <div className="absolute -top-3 w-6 h-6 bg-blue-400 rounded-full shadow-[0_0_15px_#60a5fa] dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"></div>
    <div className="absolute -bottom-3 w-6 h-6 bg-blue-400 rounded-full shadow-[0_0_15px_#60a5fa]"></div>
    </div>

    {/* Shell 2 (Valence) */}
    <div className={`absolute border rounded-full w-72 h-72 flex justify-center items-center transition-all duration-1000 ${isIon ? 'border-transparent scale-110 opacity-0' : 'border-slate-500 dark:border-slate-500/50 scale-100 opacity-100'}`}>
    <div className={`absolute -top-3 w-6 h-6 bg-yellow-400 rounded-full shadow-[0_0_15px_#facc15] transition-all duration-1000 ${isIon ? 'translate-y-[-100px] opacity-0' : 'translate-y-0 opacity-100'}`}></div>
    </div>

    {/* Nucleus */}
    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-red-600 z-10">
    +3
    </div>

    {/* Charge Badge */}
    <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl shadow-lg transition-colors duration-500 border-4 border-[#1c1b1b] dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-[#ffffff]">
    {isIon ? '+1' : '0'}
    </div>
   </div>

   {/* Properties Panel */}
   <div className="flex-1 rounded-3xl p-8" style={{backgroundColor: '#1e293b', borderColor: '#334155', borderWidth: '1px', borderStyle: 'solid'}}>
    <h3 className="text-3xl font-bold text-white mb-6">
    {isIon ? 'Lithium Ion (Li⁺)' : 'Lithium Atom (Li)'}
    </h3>
    
    <div className="space-y-4">
    <div className="flex justify-between border-b border-[#1c1b1b] dark:border-[#1c1b1b] pb-2">
     <span className="text-slate-400">Protons (Positive)</span>
     <span className="text-white font-bold text-lg">3</span>
    </div>
    <div className="flex justify-between border-b border-[#1c1b1b] dark:border-[#1c1b1b] pb-2">
     <span className="text-slate-400">Electrons (Negative)</span>
     <span className="text-white font-bold text-lg">{isIon ? '2' : '3'}</span>
    </div>
    <div className="flex justify-between border-b border-[#1c1b1b] dark:border-[#1c1b1b] pb-2">
     <span className="text-slate-400">Net Charge</span>
     <span className={`font-bold text-lg ${isIon ? 'text-red-400' : 'text-slate-300'}`}>{isIon ? '+1' : '0'}</span>
    </div>
    <div className="flex justify-between border-b border-[#1c1b1b] dark:border-[#1c1b1b] pb-2">
     <span className="text-slate-400">Valence Shell</span>
     <span className="text-white font-bold text-lg">{isIon ? 'Empty (Lost e⁻)' : '1 Electron'}</span>
    </div>
    </div>

    <div className="mt-8 p-4 rounded-xl text-sm leading-relaxed" style={{backgroundColor: 'rgba(51,65,85,0.5)', color: '#cbd5e1'}}>
    {isIon 
     ? "To achieve a stable, full outer shell (like Helium), Lithium loses its single valence electron. Because it now has 3 positive protons and only 2 negative electrons, it has a net charge of +1, making it a positive ion (cation)."
     : "A neutral Lithium atom has equal numbers of protons and electrons. It has 1 electron in its outermost (valence) shell, making it highly reactive and eager to bond."
    }
    </div>
   </div>

  </div>
  </div>
 </div>
 );
}
