import { useState } from 'react';
import { Beaker, Plus, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7HandSanitizer({ onExit }: LabProps) {
  const [alcohol, setAlcohol] = useState(0); // target 2/3 cup (say 60)
  const [aloe, setAloe] = useState(0); // target 1/3 cup (say 30)
  const [essentialOil, setEssentialOil] = useState(0); // target 10 drops
  const [mixed, setMixed] = useState(false);

  const addAlcohol = () => setAlcohol(a => Math.min(100, a + 20));
  const addAloe = () => setAloe(a => Math.min(100, a + 10));
  const addOil = () => setEssentialOil(o => Math.min(20, o + 2));
  
  const reset = () => {
    setAlcohol(0);
    setAloe(0);
    setEssentialOil(0);
    setMixed(false);
  };

  const isComplete = alcohol === 60 && aloe === 30 && essentialOil === 10;
  const totalVolume = alcohol + aloe;

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-emerald-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 11: Make a Hand Sanitizer" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-emerald-100 max-w-2xl w-full text-center mb-8">
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">Homemade Hygiene Product</h2>
          <p className="text-slate-600 mb-6">Create an effective hand sanitizer by combining the correct ratio of ingredients. You need exactly 60ml (2/3 part) Rubbing Alcohol, 30ml (1/3 part) Aloe Vera Gel, and 10 drops of Essential Oil.</p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setMixed(true)}
              disabled={!isComplete || mixed}
              className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-bold"
            >
              <Beaker className="w-5 h-5 mr-2" />
              Blend Mixture
            </button>
            <button 
              onClick={reset}
              className="flex items-center px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
            >
              Empty Bowl
            </button>
          </div>
        </div>

        <div className="flex gap-16 items-center mt-8 w-full max-w-4xl">
           
           {/* Ingredients Controls */}
           <div className="flex-1 space-y-4">
             <div className="bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
               <div>
                 <h4 className="font-bold text-blue-600">Rubbing Alcohol (99%)</h4>
                 <div className="text-sm text-slate-500">Current: {alcohol} ml</div>
               </div>
               <button onClick={addAlcohol} disabled={mixed} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 disabled:opacity-50"><Plus className="w-5 h-5" /></button>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
               <div>
                 <h4 className="font-bold text-green-600">Aloe Vera Gel</h4>
                 <div className="text-sm text-slate-500">Current: {aloe} ml</div>
               </div>
               <button onClick={addAloe} disabled={mixed} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 disabled:opacity-50"><Plus className="w-5 h-5" /></button>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
               <div>
                 <h4 className="font-bold text-yellow-600">Essential Oil</h4>
                 <div className="text-sm text-slate-500">Current: {essentialOil} drops</div>
               </div>
               <button onClick={addOil} disabled={mixed} className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 disabled:opacity-50"><Plus className="w-5 h-5" /></button>
             </div>
           </div>

           {/* Mixing Bowl */}
           <div className="relative w-80 h-64 flex justify-center items-end">
             {/* Measuring Marks */}
             <div className="absolute right-0 bottom-8 h-48 w-8 flex flex-col justify-end gap-[18px] opacity-30 z-20">
                <div className="w-full border-t border-slate-600"></div>
                <div className="w-full border-t border-slate-600"></div>
                <div className="w-full border-t border-slate-600"></div>
                <div className="w-full border-t border-slate-600"></div>
                <div className="w-full border-t border-slate-600 text-xs">90</div>
             </div>

             <div className="w-64 h-48 border-8 border-slate-300 rounded-[20px_20px_80px_80px] bg-slate-50/50 backdrop-blur-md shadow-inner flex flex-col justify-end overflow-hidden relative z-10">
                
                {mixed ? (
                  <div className="w-full h-[90px] bg-emerald-300/80 border-t-4 border-emerald-400/50 flex items-center justify-center">
                    <span className="font-bold text-emerald-800 text-lg uppercase tracking-widest drop-shadow-sm">Sanitizer Gel</span>
                  </div>
                ) : (
                  <>
                    {/* Oil Drops floating on top */}
                    {essentialOil > 0 && (
                      <div className="absolute w-full flex justify-center gap-1 z-30" style={{ bottom: `${totalVolume}px` }}>
                        {Array.from({ length: essentialOil }).map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full shadow-sm"></div>
                        ))}
                      </div>
                    )}
                    
                    {/* Alcohol Layer */}
                    <div 
                      className="w-full bg-blue-400/40 border-t border-blue-400/50 transition-all z-20"
                      style={{ height: `${alcohol}px` }}
                    ></div>
                    
                    {/* Aloe Layer (thicker, sits at bottom initially) */}
                    <div 
                      className="w-full bg-green-400/60 border-t border-green-500/50 transition-all z-10"
                      style={{ height: `${aloe}px` }}
                    ></div>
                  </>
                )}
             </div>
           </div>
        </div>

        {mixed && (
          <div className="mt-8 p-6 bg-slate-50 shadow-lg text-slate-800 rounded-xl border-l-4 border-emerald-500 max-w-2xl flex items-start">
             <CheckCircle className="w-8 h-8 text-emerald-500 mr-4 shrink-0" />
             <div>
               <h4 className="font-bold text-lg mb-2">Sanitizer Ready!</h4>
               <p>The rubbing alcohol provides the active ingredient to kill bacteria and viruses (it must be at least 60% of the total volume to be effective). The aloe vera gel prevents your hands from drying out, and the essential oil provides a pleasant fragrance.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
