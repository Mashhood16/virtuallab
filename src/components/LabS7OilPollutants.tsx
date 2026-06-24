import { useState } from 'react';
import { Droplets, Grid, Utensils } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7OilPollutants({ onExit }: LabProps) {
  const [method, setMethod] = useState<'none' | 'spoon' | 'cheesecloth' | 'sand'>('none');
  const [oilRemoved, setOilRemoved] = useState(0); // 0 to 100

  const applyMethod = (m: 'spoon' | 'cheesecloth' | 'sand') => {
    setMethod(m);
    // Spoon removes a little (20%), cheesecloth removes some (50%), sand clumps and removes lots (90%)
    if (m === 'spoon') setOilRemoved(20);
    else if (m === 'cheesecloth') setOilRemoved(50);
    else if (m === 'sand') setOilRemoved(90);
  };

  const reset = () => {
    setMethod('none');
    setOilRemoved(0);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-800 font-sans">
      <LabHeader onExit={onExit} variant="dark" title="Unit 7: Removing Oil Pollutants" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 max-w-2xl w-full text-center mb-8">
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">Cleaning Oil Spills</h2>
          <p className="text-slate-300 mb-6">Oil is less dense than water, so it floats on top forming a slick. Select different tools to try and clean up the oil spill from the water's surface.</p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <button 
              onClick={() => applyMethod('spoon')}
              className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 font-medium"
            >
              <Utensils className="w-4 h-4 mr-2" /> Skim with Spoon
            </button>
            <button 
              onClick={() => applyMethod('cheesecloth')}
              className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 font-medium"
            >
              <Grid className="w-4 h-4 mr-2" /> Drag Cheesecloth
            </button>
            <button 
              onClick={() => applyMethod('sand')}
              className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 font-medium"
            >
              <Droplets className="w-4 h-4 mr-2" /> Sprinkle Sand
            </button>
            <button 
              onClick={reset}
              className="flex items-center px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-600/40 font-medium ml-4"
            >
              Reset Spill
            </button>
          </div>
        </div>

        <div className="relative w-full max-w-4xl h-80 flex justify-center items-center bg-slate-900 rounded-3xl border-8 border-slate-700 overflow-hidden shadow-2xl">
          
          {/* Water */}
          <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
            {/* Grid to look like a tank */}
            <div className="w-full h-full opacity-10 bg-[linear-gradient(white_1px,_transparent_1px),_linear-gradient(90deg,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
          </div>

          {/* Oil Slick */}
          <div 
            className="absolute transition-all duration-1000 ease-in-out bg-yellow-600/80 backdrop-blur-sm shadow-[0_0_20px_rgba(202,138,4,0.5)] flex items-center justify-center overflow-hidden border border-yellow-500/50"
            style={{ 
              width: `${100 - oilRemoved}%`, 
              height: '100px', 
              top: '50px', 
              borderRadius: '50% 40% 60% 40% / 40% 50% 60% 50%' 
            }}
          >
             <span className="text-yellow-900 font-bold opacity-50 select-none tracking-widest">CRUDE OIL</span>
          </div>

          {/* Sinking Clumps (Sand only) */}
          {method === 'sand' && (
            <div className="absolute inset-0 overflow-hidden">
               {Array.from({ length: 20 }).map((_, i) => (
                 <div 
                   key={i} 
                   className="absolute w-6 h-6 bg-yellow-800 rounded-full blur-[1px] animate-[fall_2s_linear_forwards]"
                   style={{ left: `${10 + i * 4}%`, animationDelay: `${Math.random()}s`, top: '-20px' }}
                 ></div>
               ))}
               <style>{`
                 @keyframes fall {
                   to { transform: translateY(400px); }
                 }
               `}</style>
            </div>
          )}

          <div className="absolute bottom-4 right-6 text-slate-400 font-bold">
            Efficiency: {oilRemoved}% Removed
          </div>
        </div>

        {method !== 'none' && (
          <div className="mt-8 p-6 bg-slate-700 text-slate-200 rounded-xl border-l-4 border-emerald-500 max-w-2xl">
            {method === 'spoon' && <p>Skimming with a spoon only removes small amounts at a time and is highly inefficient for large spills.</p>}
            {method === 'cheesecloth' && <p>Dragging cheesecloth (a porous material) absorbs and traps oil, working better than a spoon but still leaving a significant slick.</p>}
            {method === 'sand' && <p>Sprinkling sand over the oil causes the sand particles to bind with the oil. The combined mass becomes denser than water, causing it to clump and sink to the bottom, clearing the surface.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
