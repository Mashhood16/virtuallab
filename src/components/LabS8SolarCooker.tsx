import { useState } from 'react';
import { RefreshCw, Sun } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8SolarCooker({ onExit }: LabProps) {
  const [temperature, setTemperature] = useState(25);
  const [sunlight, setSunlight] = useState(false);

  // Increase temperature over time if sunlight is on
  // In a real app we'd use useEffect, but here we'll simulate via repeated clicks for simplicity or just a simple state toggle
  const handleSunlight = () => {
    setSunlight(!sunlight);
    if (!sunlight) {
      // Simulate heating up immediately for visual feedback
      setTemperature(100);
    } else {
      setTemperature(25);
    }
  };

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Act 11.5: Solar Cooker" subtitle="Parabolic mirror concentrating solar energy" />

      <div className="flex-1 flex flex-col p-6 gap-6 max-w-4xl mx-auto w-full items-center justify-center">
        
        <div className="w-full bg-sky-100 rounded-3xl shadow-xl border border-sky-200 p-8 flex flex-col items-center relative overflow-hidden h-[500px]">
          
          {/* The Sun */}
          <div className={`absolute top-10 left-10 transition-all duration-1000 ${sunlight ? 'opacity-100 scale-100' : 'opacity-20 scale-75'}`}>
             <Sun className="w-24 h-24 text-yellow-500 animate-[spin_10s_linear_infinite]" fill="currentColor" />
             <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-50 rounded-full" />
          </div>

          <div className="relative w-full h-full flex flex-col items-center justify-end pb-12">
            
            {/* Sun Rays focusing */}
            {sunlight && (
               <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                 <div className="absolute top-20 left-20 w-1 h-[400px] bg-yellow-400/60 rotate-[-30deg] origin-top blur-[1px]" />
                 <div className="absolute top-20 left-32 w-1 h-[400px] bg-yellow-400/60 rotate-[-15deg] origin-top blur-[1px]" />
                 <div className="absolute top-20 left-48 w-1 h-[400px] bg-yellow-400/60 rotate-[0deg] origin-top blur-[1px]" />
               </div>
            )}

            {/* Parabolic Reflector */}
            <div className="relative w-96 h-48 bg-gradient-to-b from-slate-200 to-slate-400 rounded-b-full shadow-[0_20px_30px_rgba(0,0,0,0.2)] border-b-8 border-slate-500 flex items-center justify-center z-10 overflow-hidden">
               {/* Foil texture */}
               <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBsNDAgNDBNNDAgMEwwIDQwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')]" />
               
               {/* Reflection hotspots when sun is on */}
               {sunlight && (
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-yellow-200/50 to-transparent" />
               )}

               {/* Cooking Pot (At focal point) */}
               <div className="absolute -top-4 w-24 h-20 bg-zinc-800 rounded-b-xl border-x-2 border-b-2 border-zinc-900 shadow-xl flex flex-col justify-end overflow-hidden">
                  {/* Boiling animation inside */}
                  <div className={`w-full bg-amber-700 transition-all duration-[3000ms] ${sunlight ? 'h-full' : 'h-1/2'}`}>
                     {sunlight && (
                       <div className="w-full h-full flex flex-wrap gap-1 p-1 opacity-50">
                         <div className="w-3 h-3 bg-slate-50 rounded-full animate-bounce" />
                         <div className="w-2 h-2 bg-slate-50 rounded-full animate-ping" />
                         <div className="w-4 h-4 bg-slate-50 rounded-full animate-bounce delay-75" />
                       </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Stand */}
            <div className="w-4 h-24 bg-slate-700 z-0" />
            <div className="w-48 h-4 bg-slate-800 rounded-full z-0" />

            {/* Temperature Gauge */}
            <div className="absolute bottom-10 right-10 bg-slate-50 px-6 py-4 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center gap-2">
               <span className="text-sm font-bold text-slate-500 uppercase">Pot Temp</span>
               <span className={`text-4xl font-black font-mono transition-colors duration-1000 ${temperature > 50 ? 'text-red-500' : 'text-blue-500'}`}>
                 {temperature}°C
               </span>
            </div>

          </div>

          <button 
            onClick={handleSunlight}
            className={`absolute bottom-10 left-10 px-8 py-3 rounded-full font-bold shadow-lg transition-transform active:scale-95 ${sunlight ? 'bg-slate-800 text-white' : 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900'}`}
          >
            {sunlight ? 'Block Sun' : 'Expose to Sun'}
          </button>

        </div>
      </div>
    </div>
  );
}
