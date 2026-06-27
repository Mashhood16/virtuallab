import { useState } from 'react';
import { Info } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7TranspirationLeaves({ onExit }: LabProps) {
  const [upperColor, setUpperColor] = useState('blue');
  const [lowerColor, setLowerColor] = useState('blue');
  const [tested, setTested] = useState(false);

  const runTest = () => {
    // Stomata are primarily on the lower surface. Upper surface has fewer/none depending on the plant.
    setTested(true);
    setTimeout(() => {
      setLowerColor('pink'); // Water vapour turns dry cobalt chloride paper pink
      setTimeout(() => {
        setUpperColor('blue'); // Stays blue or turns slightly pink much slower (simulated as staying blue for contrast)
      }, 1000);
    }, 500);
  };

  const reset = () => {
    setTested(false);
    setUpperColor('blue');
    setLowerColor('blue');
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Unit 1: Transpiration from Leaves" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 max-w-2xl w-full text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Stomata and Water Vapour</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">Attach dry blue cobalt chloride paper to both sides of a leaf. Cobalt chloride paper turns from blue to pink in the presence of water vapour. Let's see which side loses more water.</p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={runTest}
              disabled={tested}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              Wait 1 Hour
            </button>
            <button 
              onClick={reset}
              className="flex items-center px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:bg-slate-800 font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex gap-16 justify-center mt-8">
          {/* Upper Surface View */}
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Leaf Upper Surface</h3>
            <div className="relative w-48 h-64 bg-green-500 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] shadow-md border-t border-green-400 flex items-center justify-center">
               <div className="w-1 h-full bg-green-600 absolute"></div> {/* Midrib */}
               {/* Tape & Paper */}
               <div className="w-24 h-12 bg-slate-50 dark:bg-slate-900/30 backdrop-blur-sm border border-white/50 absolute rotate-[-10deg] flex items-center justify-center z-10 shadow-sm">
                 {/* Cobalt Paper */}
                 <div className={`w-16 h-8 transition-colors duration-1000 border border-slate-300 dark:border-slate-700 dark:border-slate-500 ${upperColor === 'blue' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
               </div>
            </div>
            <div className="mt-4 font-medium text-slate-500 dark:text-slate-400">
              Color: {upperColor === 'blue' ? <span className="text-blue-600">Dry (Blue)</span> : <span className="text-pink-500">Wet (Pink)</span>}
            </div>
          </div>

          {/* Lower Surface View */}
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Leaf Lower Surface</h3>
            <div className="relative w-48 h-64 bg-green-400 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] shadow-md border-t border-green-300 flex items-center justify-center">
               <div className="w-2 h-full bg-green-600 absolute"></div> {/* Vein */}
               {/* Stomata dots (stylized) */}
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_30%,_rgba(0,100,0,1)_2px,_transparent_3px)] bg-[length:15px_15px]"></div>
               {/* Tape & Paper */}
               <div className="w-24 h-12 bg-slate-50 dark:bg-slate-900/30 backdrop-blur-sm border border-white/50 absolute rotate-[5deg] flex items-center justify-center z-10 shadow-sm">
                 {/* Cobalt Paper */}
                 <div className={`w-16 h-8 transition-colors duration-1000 border border-slate-300 dark:border-slate-700 dark:border-slate-500 ${lowerColor === 'blue' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
               </div>
            </div>
            <div className="mt-4 font-medium text-slate-500 dark:text-slate-400">
              Color: {lowerColor === 'blue' ? <span className="text-blue-600">Dry (Blue)</span> : <span className="text-pink-500">Wet (Pink)</span>}
            </div>
          </div>
        </div>

        {tested && (
          <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900 shadow-lg text-slate-800 dark:text-slate-100 rounded-xl border-l-4 border-blue-500 max-w-xl animate-bounce">
            <h4 className="font-bold text-lg mb-2 flex items-center"><Info className="w-5 h-5 mr-2 text-blue-500"/> Observation Result</h4>
            <p>The paper on the <strong>lower surface</strong> turned pink, while the upper surface paper remained blue! This proves that transpiration occurs mainly through tiny pores called <strong>stomata</strong>, which are concentrated on the underside of leaves to reduce excessive water loss from direct sunlight.</p>
          </div>
        )}
      </div>
    </div>
  );
}
