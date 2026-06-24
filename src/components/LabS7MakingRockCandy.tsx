import { useState, useEffect } from 'react';
import { Clock, Diamond } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7MakingRockCandy({ onExit }: LabProps) {
  const [days, setDays] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: number;
    if (running && days < 7) {
      interval = window.setInterval(() => {
        setDays(d => Math.min(7, d + 1));
      }, 1000);
    } else if (days === 7) {
      setRunning(false);
    }
    return () => clearInterval(interval);
  }, [running, days]);

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-pink-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 7: Making Rock Candy" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-pink-100 max-w-2xl w-full text-center mb-8">
          <h2 className="text-2xl font-bold text-pink-800 mb-4">Crystallization</h2>
          <p className="text-slate-600 mb-6">A supersaturated solution of sugar and water is poured into jars. Seeded wooden sticks are dangled in. Over a week, as the water evaporates and cools, massive sugar crystals form.</p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setRunning(!running)}
              disabled={days === 7}
              className="flex items-center px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 font-medium"
            >
              <Clock className="w-5 h-5 mr-2" />
              {running ? 'Pause Time' : days === 7 ? 'Crystallization Complete' : 'Wait 7 Days'}
            </button>
            <button 
              onClick={() => { setDays(0); setRunning(false); }}
              className="flex items-center px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
            >
              Reset
            </button>
          </div>
          <div className="mt-4 font-bold text-lg text-slate-700">Time Elapsed: {days} Days</div>
        </div>

        <div className="flex gap-16 justify-center mt-12 w-full flex-wrap">
          
          {[
            { color: 'text-red-500', bg: 'bg-red-400', dropShadow: 'drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]' },
            { color: 'text-blue-500', bg: 'bg-blue-400', dropShadow: 'drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]' },
            { color: 'text-purple-500', bg: 'bg-purple-400', dropShadow: 'drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]' }
          ].map((theme, idx) => (
            <div key={idx} className="relative w-32 h-64 flex justify-center">
               
               {/* Stick & Crystals */}
               <div className="absolute top-4 w-2 h-56 bg-amber-200 z-10 flex flex-col justify-end items-center pb-4">
                  {/* Crystals growing */}
                  <div 
                    className="relative transition-all duration-1000 flex flex-col items-center justify-end"
                    style={{ height: `${Math.max(10, days * 20)}px`, width: `${Math.max(4, days * 8)}px` }}
                  >
                     <div className={`absolute inset-0 ${theme.bg} opacity-90 backdrop-blur-sm rounded ${theme.dropShadow} flex flex-wrap content-end overflow-hidden border border-white/20`} style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20%)' }}>
                       {/* Geometric facets to look like crystals */}
                       <div className="w-full h-1/2 bg-slate-50/20 absolute top-0 -rotate-12 transform origin-top-left"></div>
                       <div className="w-full h-1/2 bg-black/10 absolute bottom-0 rotate-12 transform origin-bottom-right"></div>
                     </div>
                  </div>
               </div>

               {/* Jar */}
               <div className="absolute bottom-0 w-32 h-40 border-4 border-slate-300 bg-slate-50/10 backdrop-blur-sm rounded-b-xl rounded-t-sm z-20 flex justify-center items-end shadow-inner overflow-hidden">
                 {/* Syrup level decreases slightly as water evaporates */}
                 <div 
                   className={`w-full transition-all duration-1000 ${theme.bg} opacity-50 border-t-2 border-white/40`}
                   style={{ height: `${100 - (days * 3)}%` }}
                 ></div>
               </div>
            </div>
          ))}

        </div>

        {days === 7 && (
          <div className="mt-16 p-6 bg-slate-50 shadow-lg text-slate-800 rounded-xl border-t-4 border-pink-500 max-w-2xl text-center">
            <h4 className="font-bold text-lg mb-2 flex justify-center items-center"><Diamond className="w-5 h-5 mr-2 text-pink-500" /> Conclusion</h4>
            <p>Hot water can dissolve much more sugar than cold water, creating a <strong>supersaturated solution</strong>. As the water cools and evaporates, it can no longer hold all that sugar. The sugar falls out of the solution and attaches to the seed crystals on the stick, growing massive geometric structures.</p>
          </div>
        )}
      </div>
    </div>
  );
}
