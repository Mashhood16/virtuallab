import { useState, useEffect } from 'react';
import { Clock, Search } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7CleaningCoins({ onExit }: LabProps) {
  const [hours, setHours] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: number;
    if (running && hours < 24) {
      interval = window.setInterval(() => {
        setHours(h => Math.min(24, h + 2));
      }, 300);
    } else if (hours === 24) {
      setRunning(false);
    }
    return () => clearInterval(interval);
  }, [running, hours]);

  // Effectiveness: Ketchup (acidic, high), Cola (acidic, med), Lemon (acidic, high), Vinegar+Salt (acidic+chloride, highest)
  const getTarnishOpacity = (effectiveness: number) => {
    // Starts at 1, goes down based on hours and effectiveness
    return Math.max(0, 1 - (hours / 24) * effectiveness);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-amber-50 font-sans dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Unit 7: Cleaning Coins with Solutions" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-amber-100 max-w-2xl w-full text-center mb-8">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Removing Copper Oxide Tarnish</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">Four heavily tarnished copper pennies are soaked in different everyday solutions for 24 hours. The weak acids react with the copper oxide tarnish, dissolving it.</p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setRunning(!running)}
              disabled={hours === 24}
              className="flex items-center px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 font-medium"
            >
              <Clock className="w-5 h-5 mr-2" />
              {running ? 'Pause Time' : hours === 24 ? 'Soak Complete' : 'Soak 24 Hours'}
            </button>
            <button 
              onClick={() => { setHours(0); setRunning(false); }}
              className="flex items-center px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:bg-slate-800 font-medium"
            >
              Reset
            </button>
          </div>
          <div className="mt-4 font-bold text-lg text-slate-700 dark:text-slate-200">Time Elapsed: {hours} Hours</div>
        </div>

        <div className="flex gap-8 justify-center mt-12 w-full flex-wrap max-w-6xl">
          
          {[
            { name: 'Ketchup', effect: 0.8, color: 'bg-red-600' },
            { name: 'Cola', effect: 0.5, color: 'bg-amber-900' },
            { name: 'Lemon Juice', effect: 0.9, color: 'bg-yellow-400' },
            { name: 'Vinegar + Salt', effect: 1.0, color: 'bg-slate-200 dark:bg-slate-800' },
          ].map((sol, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">{sol.name}</h3>
              
              <div className="relative w-40 h-40 border-4 border-slate-300 dark:border-slate-700 dark:border-slate-500 bg-slate-50 dark:bg-slate-900 rounded-full flex justify-center items-center shadow-inner overflow-hidden">
                 {/* Liquid */}
                 <div className={`absolute bottom-0 w-full h-full opacity-60 ${sol.color}`}></div>
                 
                 {/* Coin */}
                 <div className="relative w-24 h-24 rounded-full border-2 border-amber-700 bg-amber-500 flex justify-center items-center shadow-lg z-10 overflow-hidden">
                    {/* The shiny coin underneath */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-400"></div>
                    <div className="absolute inset-2 border border-amber-600/30 rounded-full flex items-center justify-center font-bold text-amber-700/50">1¢</div>
                    
                    {/* The Tarnish Overlay */}
                    <div 
                      className="absolute inset-0 bg-[#4a3b32] mix-blend-multiply transition-opacity duration-300"
                      style={{ opacity: getTarnishOpacity(sol.effect) }}
                    >
                      {/* Tarnish texture dots */}
                      <div className="w-full h-full opacity-50 bg-[radial-gradient(circle_at_20%_30%,_#2a1b12_1px,_transparent_1px)] bg-[length:4px_4px]"></div>
                    </div>
                 </div>
              </div>
            </div>
          ))}

        </div>

        {hours === 24 && (
          <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900 shadow-lg text-slate-800 dark:text-slate-100 rounded-xl border-t-4 border-amber-500 max-w-2xl text-center">
            <h4 className="font-bold text-lg mb-2 flex justify-center items-center"><Search className="w-5 h-5 mr-2 text-amber-500" /> Conclusion</h4>
            <p>The <strong>Vinegar and Salt</strong> solution cleaned the coin completely! Vinegar (acetic acid) dissolves the copper oxide, but adding salt provides chloride ions which drastically speeds up the chemical reaction. Lemon juice and Ketchup also worked well due to their acidic nature (citric acid and vinegar content).</p>
          </div>
        )}
      </div>
    </div>
  );
}
