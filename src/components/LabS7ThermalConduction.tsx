import { useState, useEffect } from 'react';
import { Flame, ThermometerSun } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7ThermalConduction({ onExit }: LabProps) {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: number;
    if (running && time < 100) {
      interval = window.setInterval(() => {
        setTime(t => Math.min(100, t + 1));
      }, 100);
    } else if (time === 100) {
      setRunning(false);
    }
    return () => clearInterval(interval);
  }, [running, time]);

  const metalMelt = Math.min(100, time * 2); // Melts fast
  const plasticMelt = Math.min(100, time * 0.5); // Melts slowly
  const woodMelt = 0; // Doesn't melt

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-amber-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 4: Thermal Conduction" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-amber-100 max-w-2xl w-full text-center mb-8">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Heat Transfer via Conduction</h2>
          <p className="text-slate-600 mb-6">A metal spoon, a plastic spoon, and a wooden spoon each have a solid cube of butter placed on their handles. Their bowls are immersed in boiling water. Watch to see which material conducts heat the fastest to melt the butter.</p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setRunning(!running)}
              disabled={time === 100}
              className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
            >
              <Flame className="w-5 h-5 mr-2" />
              {running ? 'Pause Heat' : time === 100 ? 'Experiment Complete' : 'Apply Boiling Water'}
            </button>
            <button 
              onClick={() => { setTime(0); setRunning(false); }}
              className="flex items-center px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Setup */}
        <div className="relative w-full max-w-3xl h-96 flex justify-center items-end pb-12 mt-8">
          
          {/* Glass Beaker */}
          <div className="absolute bottom-0 w-80 h-48 border-4 border-slate-300/60 bg-blue-50/30 rounded-b-3xl backdrop-blur-sm z-20 flex justify-center items-end">
            {/* Boiling Water */}
            <div className={`w-full transition-all duration-1000 rounded-b-2xl overflow-hidden relative ${time > 0 ? 'h-32 bg-red-500/20' : 'h-32 bg-blue-300/30'}`}>
              {running && (
                <div className="absolute inset-0 flex flex-wrap gap-4 p-2 justify-center content-end overflow-hidden opacity-50">
                   <div className="w-2 h-2 rounded-full bg-slate-50 animate-[bounce_0.5s_ease-in_infinite]"></div>
                   <div className="w-3 h-3 rounded-full bg-slate-50 animate-[bounce_0.6s_ease-in_infinite_0.1s]"></div>
                   <div className="w-1 h-1 rounded-full bg-slate-50 animate-[bounce_0.4s_ease-in_infinite_0.3s]"></div>
                   <div className="w-2 h-2 rounded-full bg-slate-50 animate-[bounce_0.7s_ease-in_infinite_0.2s]"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-8 absolute bottom-12 z-10 w-full justify-center">
             
             {/* Metal Spoon */}
             <div className="flex flex-col items-center relative transform -rotate-12 translate-y-8">
               <div className="font-bold text-slate-700 absolute -top-8 bg-slate-50/80 px-2 rounded z-20">Metal</div>
               <div className="relative">
                 {/* Butter */}
                 <div 
                   className="absolute -top-4 left-2 w-8 bg-yellow-300 rounded-sm shadow-sm transition-all duration-100 ease-linear z-20"
                   style={{ height: `${32 - (metalMelt/100 * 30)}px`, transform: `translateY(${metalMelt/100 * 30}px)`, opacity: 1 - metalMelt/200 }}
                 ></div>
                 <div className="w-12 h-64 bg-slate-300 rounded-full border border-slate-400 shadow-md"></div>
               </div>
             </div>

             {/* Plastic Spoon */}
             <div className="flex flex-col items-center relative translate-y-12 z-30">
               <div className="font-bold text-slate-700 absolute -top-8 bg-slate-50/80 px-2 rounded z-20">Plastic</div>
               <div className="relative">
                 {/* Butter */}
                 <div 
                   className="absolute -top-4 left-2 w-8 bg-yellow-300 rounded-sm shadow-sm transition-all duration-100 ease-linear z-20"
                   style={{ height: `${32 - (plasticMelt/100 * 30)}px`, transform: `translateY(${plasticMelt/100 * 30}px)`, opacity: 1 - plasticMelt/200 }}
                 ></div>
                 <div className="w-12 h-64 bg-red-400 rounded-full border border-red-500 shadow-md"></div>
               </div>
             </div>

             {/* Wooden Spoon */}
             <div className="flex flex-col items-center relative transform rotate-12 translate-y-8 z-10">
               <div className="font-bold text-slate-700 absolute -top-8 bg-slate-50/80 px-2 rounded z-20">Wood</div>
               <div className="relative">
                 {/* Butter */}
                 <div 
                   className="absolute -top-4 left-2 w-8 bg-yellow-300 rounded-sm shadow-sm transition-all duration-100 ease-linear z-20"
                   style={{ height: `${32 - (woodMelt/100 * 30)}px`, transform: `translateY(${woodMelt/100 * 30}px)` }}
                 ></div>
                 <div className="w-12 h-64 bg-amber-700 rounded-full border border-amber-800 shadow-md flex justify-center">
                    <div className="w-8 h-full border-l border-amber-800/30 rounded-full"></div>
                 </div>
               </div>
             </div>

          </div>
        </div>

        {time === 100 && (
          <div className="mt-4 p-6 bg-slate-50 shadow-lg text-slate-800 rounded-xl border-t-4 border-red-500 max-w-2xl text-center">
            <h4 className="font-bold text-lg mb-2 flex justify-center items-center"><ThermometerSun className="w-5 h-5 mr-2 text-red-500" /> Conclusion</h4>
            <p>The butter on the <strong>Metal Spoon</strong> melted very quickly! Metal is an excellent thermal conductor, allowing heat to rapidly travel up the handle. Plastic is a poor conductor (an insulator), so its butter melted slowly. Wood is a very strong insulator, so its butter didn't melt at all during the timeframe.</p>
          </div>
        )}
      </div>
    </div>
  );
}
