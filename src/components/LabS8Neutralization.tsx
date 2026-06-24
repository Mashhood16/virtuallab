import { useState } from 'react';
import {AlertTriangle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8Neutralization({ onExit }: LabProps) {
  const [drops, setDrops] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  
  // Endpoint is around 10 drops
  const ENDPOINT = 10;
  
  const addDrop = () => {
    setIsAdding(true);
    setTimeout(() => {
      setDrops(d => d + 1);
      setIsAdding(false);
    }, 500);
  };

  // Determine color based on drops
  let solutionColor = 'bg-pink-400/80'; // Alkaline with phenolphthalein is pink
  if (drops >= ENDPOINT) {
    solutionColor = 'bg-slate-100/30'; // Colorless when neutralized/acidic
  }

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 font-sans">
      <LabHeader onExit={onExit} title="Act 7.3: Neutralization Reaction" subtitle="Titration of NaOH with HCl" />

      <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 max-w-6xl mx-auto w-full">
        
        <div className="flex-1 bg-slate-50 rounded-2xl shadow-sm border p-6 flex flex-col items-center justify-center relative min-h-[500px]">
          
          <div className="absolute top-4 left-4 bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-lg flex gap-2 items-center text-sm font-bold shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Teacher Demonstration Only (Corrosive NaOH)
          </div>

          <div className="relative w-64 h-96 flex flex-col items-center mt-12">
            
            {/* Burette (HCl) */}
            <div className="absolute top-0 w-8 h-48 border-x-2 border-t-2 border-slate-300 rounded-t-sm flex flex-col items-center bg-slate-50/50 backdrop-blur-sm z-20">
               {/* Markings */}
               {[1,2,3,4,5,6,7].map(m => <div key={m} className="w-full border-b border-slate-300/50 flex-1" />)}
               {/* Fluid */}
               <div className="absolute bottom-0 w-full bg-slate-200/50 transition-all duration-300" style={{ height: `${100 - (drops * 5)}%` }} />
               {/* Stopcock */}
               <div className="absolute -bottom-4 w-12 h-4 bg-slate-400 rounded-sm z-30" />
               {/* Droplet */}
               {isAdding && (
                 <div className="absolute -bottom-16 w-3 h-3 bg-slate-200 rounded-full animate-[fall_0.5s_linear_forwards]" />
               )}
               <div className="absolute -right-24 top-4 text-xs font-bold text-slate-500">HCl (Acid)</div>
            </div>

            {/* Flask (NaOH + Indicator) */}
            <div className="absolute bottom-0 w-32 h-32 border-4 border-slate-300 rounded-b-[40px] rounded-t-sm bg-slate-50/50 shadow-inner z-10 flex flex-col justify-end overflow-hidden">
               <div className={`w-full h-1/2 transition-colors duration-1000 ${solutionColor}`} />
               <div className="absolute -right-32 bottom-8 text-xs font-bold text-slate-500 text-center">NaOH (Base) +<br/>Phenolphthalein</div>
            </div>
            {/* Flask Neck */}
            <div className="absolute bottom-32 w-10 h-10 border-x-4 border-slate-300 z-10 bg-slate-50/50" />

          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={addDrop}
              disabled={isAdding || drops >= ENDPOINT + 3}
              className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 text-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              Add Drop of Acid
            </button>
            <p className="mt-2 text-slate-500 font-bold font-mono">Drops Added: {drops}</p>
          </div>

          {drops >= ENDPOINT && (
            <div className="mt-6 px-6 py-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center animate-fade-in max-w-sm">
              <h3 className="font-bold text-lg mb-1">End Point Reached!</h3>
              <p className="text-sm">
                The pink color completely disappeared. This shows that the acid has exactly neutralized the base to form salt and water.
              </p>
            </div>
          )}

        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fall { from { transform: translateY(0); opacity: 1; } to { transform: translateY(80px); opacity: 0; } }
      `}} />
    </div>
  );
}
