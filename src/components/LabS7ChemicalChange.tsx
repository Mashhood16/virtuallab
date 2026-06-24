import { useState } from 'react';
import {  } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7ChemicalChange({ onExit }: LabProps) {
  const [mixed, setMixed] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-800 font-sans">
      <LabHeader onExit={onExit} variant="dark" title="Unit 4: Chemical Change" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 max-w-2xl w-full text-center mb-8">
          <h2 className="text-2xl font-bold text-amber-400 mb-4">Baking Soda and Vinegar</h2>
          <p className="text-slate-300 mb-6">A balloon containing Baking Soda (NaHCO₃) is stretched over a flask of Vinegar (Acetic Acid). Click to tip the balloon and mix the chemicals to observe a chemical reaction.</p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setMixed(true)}
              disabled={mixed}
              className="flex items-center px-6 py-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 disabled:opacity-50 font-bold"
            >
              Tip Balloon (Mix)
            </button>
            <button 
              onClick={() => setMixed(false)}
              className="flex items-center px-6 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 font-medium"
            >
              Reset Setup
            </button>
          </div>
        </div>

        {/* Experiment Setup */}
        <div className="relative w-[500px] h-[500px] flex justify-center items-end pb-8">
          
          {/* Flask */}
          <div className="relative w-40 h-48 border-4 border-slate-400/50 bg-slate-50/5 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] flex justify-center items-end overflow-hidden z-20 backdrop-blur-sm">
             {/* Neck of flask */}
             <div className="absolute top-0 w-12 h-16 border-l-4 border-r-4 border-slate-400/50 bg-slate-800"></div>

             {/* Vinegar / Reaction Liquid */}
             <div className={`w-full absolute bottom-0 transition-all duration-1000 ${mixed ? 'h-32 bg-amber-500/40' : 'h-24 bg-slate-50/20'}`}>
                {/* Bubbles / Effervescence */}
                {mixed && (
                  <div className="absolute inset-0 flex flex-wrap gap-2 p-2 justify-center content-end overflow-hidden">
                    <div className="w-3 h-3 rounded-full bg-slate-50/60 animate-[bounce_1s_ease-in_infinite]"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-50/60 animate-[bounce_0.8s_ease-in_infinite_0.2s]"></div>
                    <div className="w-4 h-4 rounded-full bg-slate-50/60 animate-[bounce_1.2s_ease-in_infinite_0.1s]"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-50/60 animate-[bounce_0.9s_ease-in_infinite_0.4s]"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-50/60 animate-[bounce_1.1s_ease-in_infinite_0.3s]"></div>
                  </div>
                )}
             </div>
          </div>

          {/* Balloon */}
          <div className="absolute z-10 bottom-44 left-1/2 ml-[-32px] w-16 flex flex-col items-center" style={{ transformOrigin: 'bottom center' }}>
             {/* The neck of the balloon stretched over the flask */}
             <div className="w-12 h-6 bg-red-500 opacity-80 rounded-b-md z-30"></div>
             
             {/* The main body of the balloon */}
             <div className={`bg-red-500 opacity-80 rounded-t-full rounded-b-[40%] transition-all duration-[2000ms] ease-out ${
               mixed ? 'w-48 h-56 -mt-48 translate-y-[-10px]' : 'w-16 h-16 rotate-[-90deg] translate-x-[-40px] translate-y-[10px]'
             }`}>
                {/* Baking Soda Powder (Before mixing) */}
                {!mixed && (
                  <div className="absolute bottom-2 left-2 w-8 h-8 bg-slate-50/80 rounded-full blur-[2px]"></div>
                )}
                {/* Gas indicator (After mixing) */}
                {mixed && (
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-white/50 text-3xl">
                    CO₂ Gas
                  </div>
                )}
             </div>
          </div>

        </div>

        {mixed && (
          <div className="mt-8 p-6 bg-slate-700 text-slate-200 rounded-xl border border-amber-500/50 max-w-xl text-center">
            <h3 className="text-amber-400 font-bold text-lg mb-2">Chemical Change Observed!</h3>
            <p>The baking soda and vinegar reacted to create a completely new substance: <strong>Carbon Dioxide (CO₂) gas</strong>. The production of this gas rapidly expanded, filling and inflating the balloon. This creation of a new substance with different properties proves it is a chemical change, not a physical one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
