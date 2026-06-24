import { useState } from 'react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8MilkPlastic({ onExit }: LabProps) {
  const [vinegarDrops, setVinegarDrops] = useState(0);

  // Separation happens after 4 drops (cups) of vinegar
  const isSeparated = vinegarDrops >= 4;

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Act 11.3: Plastic from Milk" subtitle="Casein polymer extraction" />

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        
        <div className="bg-slate-50 p-8 rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center w-full max-w-lg">
          
          <div className="relative w-48 h-48 mb-8">
            {/* Beaker */}
            <div className="absolute inset-0 bg-slate-100/50 rounded-b-[40px] border-4 border-t-0 border-slate-300 flex flex-col justify-end overflow-hidden z-10">
               {/* Milk / Liquid */}
               <div className={`w-full transition-all duration-1000 flex items-center justify-center ${isSeparated ? 'h-3/4 bg-yellow-100/80 backdrop-blur-sm' : 'h-3/4 bg-slate-50 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.05)]'}`}>
                 
                 {/* Curds (Casein) */}
                 {isSeparated && (
                   <div className="w-24 h-16 bg-slate-50 border border-slate-100 rounded-3xl animate-bounce shadow-md flex items-center justify-center flex-wrap gap-1 p-2">
                     <div className="w-4 h-4 bg-slate-50 rounded-full" />
                     <div className="w-6 h-5 bg-slate-50 rounded-full" />
                     <div className="w-5 h-5 bg-slate-50 rounded-full" />
                     <div className="w-7 h-6 bg-slate-50 rounded-full" />
                   </div>
                 )}
               </div>
            </div>

            {/* Vinegar Drop Animation (only while adding) */}
            {vinegarDrops > 0 && !isSeparated && (
              <div key={vinegarDrops} className="absolute left-1/2 -translate-x-1/2 top-[-20px] w-3 h-4 bg-amber-200/60 rounded-full animate-[drop_0.5s_ease-in]" />
            )}
          </div>

          <div className="flex flex-col items-center gap-4 w-full">
            <button 
              onClick={() => setVinegarDrops(v => v + 1)}
              disabled={isSeparated}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-transform active:scale-95 ${isSeparated ? 'bg-slate-200 text-slate-400' : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300'}`}
            >
              Add Vinegar ({vinegarDrops}/4 cups)
            </button>

            {isSeparated && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl w-full">
                <h3 className="font-bold text-emerald-800 mb-2">Reaction Complete!</h3>
                <p className="text-sm text-emerald-700">The acid in the vinegar separated the milk into liquid whey and solid curds (Casein). These curds can be strained, dried, and kneaded into a natural, moldable plastic!</p>
              </div>
            )}
          </div>

        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes drop {
          0% { top: -40px; opacity: 1; }
          100% { top: 60px; opacity: 0; }
        }
      `}} />
    </div>
  );
}
