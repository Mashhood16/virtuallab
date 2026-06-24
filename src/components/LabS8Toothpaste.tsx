import { useState } from 'react';
import { RefreshCw, Droplets, Beaker } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8Toothpaste({ onExit }: LabProps) {
  const [ingredients, setIngredients] = useState({
    glycerin: 0,
    bakingSoda: 0,
    salt: 0,
    peppermint: 0
  });

  const totalAdded = ingredients.glycerin + ingredients.bakingSoda + ingredients.salt + (ingredients.peppermint * 0.1);
  const target = 2 + 3 + 1 + 0.5; // roughly 6.5 units
  
  const progress = Math.min(100, (totalAdded / target) * 100);
  
  // Perfect mix check
  const isPerfect = ingredients.glycerin === 2 && ingredients.bakingSoda === 3 && ingredients.salt === 1 && ingredients.peppermint === 5;
  const isMixed = progress >= 80;

  const reset = () => {
    setIngredients({ glycerin: 0, bakingSoda: 0, salt: 0, peppermint: 0 });
  };

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Act 11.1: DIY Toothpaste" subtitle="Mix household ingredients to formulate toothpaste" rightContent={<>{rightJsx}</>} />

      <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 max-w-5xl mx-auto w-full">
        
        {/* Ingredients Panel */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          <h3 className="font-bold text-slate-700">Add Ingredients</h3>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between font-bold text-sm">
              <span>Glycerin (tsp)</span>
              <span className="text-blue-600">{ingredients.glycerin} / 2</span>
            </div>
            <button 
              onClick={() => setIngredients({...ingredients, glycerin: Math.min(5, ingredients.glycerin + 1)})}
              className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium flex justify-center items-center gap-2"
            >
              <Droplets className="w-4 h-4" /> Add 1 tsp
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between font-bold text-sm">
              <span>Baking Soda (tsp)</span>
              <span className="text-zinc-600">{ingredients.bakingSoda} / 3</span>
            </div>
            <button 
              onClick={() => setIngredients({...ingredients, bakingSoda: Math.min(6, ingredients.bakingSoda + 1)})}
              className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg font-medium flex justify-center items-center gap-2"
            >
              <Beaker className="w-4 h-4" /> Add 1 tsp
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between font-bold text-sm">
              <span>Salt (pinches)</span>
              <span className="text-slate-600">{ingredients.salt} / 1</span>
            </div>
            <button 
              onClick={() => setIngredients({...ingredients, salt: Math.min(3, ingredients.salt + 1)})}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium flex justify-center items-center gap-2"
            >
              Add Pinch
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between font-bold text-sm">
              <span>Peppermint Oil (drops)</span>
              <span className="text-emerald-600">{ingredients.peppermint} / 5</span>
            </div>
            <button 
              onClick={() => setIngredients({...ingredients, peppermint: Math.min(10, ingredients.peppermint + 1)})}
              className="w-full py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-medium flex justify-center items-center gap-2"
            >
              <Droplets className="w-4 h-4" /> Add 1 Drop
            </button>
          </div>
        </div>

        {/* Mixing Bowl Area */}
        <div className="flex-1 bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center relative overflow-hidden h-[500px] justify-center">
          
          {/* Progress Bar */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-3/4 max-w-md h-4 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
             <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          {/* The Mortar/Bowl */}
          <div className="relative mt-12 w-64 h-48">
            <div className="absolute inset-0 bg-slate-200 rounded-[50%] shadow-[inset_0_-20px_30px_rgba(0,0,0,0.1)] border-b-8 border-slate-300" />
            <div className="absolute top-2 left-2 right-2 bottom-6 bg-slate-300 rounded-[50%] shadow-[inset_0_20px_30px_rgba(0,0,0,0.1)] overflow-hidden flex items-end justify-center pb-4">
               {/* Paste visualization */}
               <div 
                  className="w-32 bg-slate-50 rounded-full transition-all duration-700 shadow-inner"
                  style={{ 
                    height: `${Math.max(10, progress * 0.8)}%`,
                    backgroundColor: isMixed ? '#f8fafc' : '#e2e8f0'
                  }}
               />
            </div>
            {/* Pestle */}
            <div className="absolute -top-12 left-1/2 w-6 h-32 bg-amber-700 rounded-full rotate-[15deg] shadow-lg origin-bottom transition-transform duration-300 hover:rotate-[-15deg] hover:-translate-x-4 z-10" />
          </div>

          <div className="mt-12 text-center max-w-sm">
            {isPerfect ? (
               <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl border border-emerald-200 font-bold animate-pulse">
                 Perfect Formula! You have created functional homemade toothpaste.
               </div>
            ) : progress > 100 ? (
               <div className="bg-red-100 text-red-800 p-4 rounded-xl border border-red-200 font-bold">
                 Too much! Stick to the recipe measurements.
               </div>
            ) : isMixed ? (
               <div className="bg-blue-100 text-blue-800 p-4 rounded-xl border border-blue-200 font-bold">
                 Almost there, check your measurements.
               </div>
            ) : (
               <div className="text-slate-500 font-medium">
                 Add ingredients to the mortar and mix them to form a paste.
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
