import { useState } from 'react';
import { RefreshCw, FlaskConical } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8ChemicalCar({ onExit }: LabProps) {
  const [bakingSodaAdded, setBakingSodaAdded] = useState(false);
  const [vinegarAdded, setVinegarAdded] = useState(false);
  const [sealed, setSealed] = useState(false);
  const [carPos, setCarPos] = useState(0);

  const isReady = bakingSodaAdded && vinegarAdded && sealed;

  const launch = () => {
    if (isReady) {
      setCarPos(100);
    }
  };

  const reset = () => {
    setBakingSodaAdded(false);
    setVinegarAdded(false);
    setSealed(false);
    setCarPos(0);
  };

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Act 11.8: Chemical Car" subtitle="Vinegar + Baking Soda propulsion" rightContent={<>{rightJsx}</>} />

      <div className="flex-1 flex flex-col p-6 gap-6 max-w-4xl mx-auto w-full">
        
        {/* Preparation Steps */}
        <div className="flex gap-4">
          <button 
            onClick={() => setVinegarAdded(true)}
            disabled={vinegarAdded || carPos > 0}
            className={`flex-1 p-4 rounded-xl font-bold border-2 transition-all ${vinegarAdded ? 'bg-sky-50 border-sky-500 text-sky-700' : 'bg-slate-50 border-slate-200 hover:border-sky-300 text-slate-600'}`}
          >
            1. Pour Vinegar
          </button>
          <button 
            onClick={() => setBakingSodaAdded(true)}
            disabled={bakingSodaAdded || !vinegarAdded || carPos > 0}
            className={`flex-1 p-4 rounded-xl font-bold border-2 transition-all ${bakingSodaAdded ? 'bg-sky-50 border-sky-500 text-sky-700' : 'bg-slate-50 border-slate-200 hover:border-sky-300 text-slate-600'}`}
          >
            2. Add Baking Soda
          </button>
          <button 
            onClick={() => setSealed(true)}
            disabled={sealed || !bakingSodaAdded || carPos > 0}
            className={`flex-1 p-4 rounded-xl font-bold border-2 transition-all ${sealed ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200 hover:border-emerald-300 text-slate-600'}`}
          >
            3. Seal Cap (with hole)
          </button>
        </div>

        {/* The Track */}
        <div className="flex-1 bg-slate-50 rounded-3xl shadow-xl border-4 border-slate-200 p-8 flex flex-col justify-end relative overflow-hidden h-[400px]">
          
          {/* Ground */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-slate-800" />
          <div className="absolute bottom-20 left-0 w-full border-b-4 border-dashed border-yellow-400" />

          {/* The Car */}
          <div 
            className="absolute bottom-24 flex flex-col items-center transition-all ease-out"
            style={{ 
              left: `${10 + carPos * 0.7}%`,
              transitionDuration: carPos > 0 ? '1.5s' : '0s'
            }}
          >
             
             {/* CO2 Gas trail */}
             {carPos > 0 && (
               <div className="absolute top-1/2 -left-32 w-32 h-16 flex items-center opacity-80 pointer-events-none">
                 <div className="w-4 h-4 bg-slate-50/80 rounded-full animate-ping mr-2" />
                 <div className="w-8 h-8 bg-slate-50/60 rounded-full animate-ping delay-75 mr-2" />
                 <div className="w-12 h-12 bg-slate-50/40 rounded-full animate-ping delay-150" />
               </div>
             )}

             {/* Bottle Chassis */}
             <div className="relative w-48 h-16 bg-sky-200/50 backdrop-blur-sm border-2 border-sky-300 rounded-l-3xl rounded-r-lg flex items-center justify-end px-2 z-10 shadow-lg overflow-hidden">
                {/* Vinegar/Reaction inside */}
                {vinegarAdded && (
                  <div className={`absolute bottom-0 left-0 w-full bg-blue-400/40 transition-all ${carPos > 0 ? 'h-full animate-[pulse_0.1s_infinite]' : 'h-1/3'}`}>
                    {bakingSodaAdded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="text-xs font-bold text-white opacity-50">CO₂</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Cap with hole (Nozzle facing left) */}
                <div className={`absolute -left-2 w-4 h-10 ${sealed ? 'bg-red-500' : 'bg-transparent'} rounded-l-sm border border-red-700 z-20 flex items-center justify-center`}>
                   {sealed && <div className="w-1 h-2 bg-black rounded-full" />}
                </div>
             </div>

             {/* Wheels (Pony beads) */}
             <div className="flex justify-between w-32 relative -mt-2 z-20">
               <div className={`w-8 h-8 bg-orange-400 rounded-full border-4 border-orange-600 shadow-md ${carPos > 0 ? 'animate-spin' : ''}`}>
                 <div className="w-full h-1 bg-orange-800/20 absolute top-1/2 -translate-y-1/2" />
                 <div className="w-1 h-full bg-orange-800/20 absolute left-1/2 -translate-x-1/2" />
               </div>
               <div className={`w-8 h-8 bg-orange-400 rounded-full border-4 border-orange-600 shadow-md ${carPos > 0 ? 'animate-spin' : ''}`}>
                 <div className="w-full h-1 bg-orange-800/20 absolute top-1/2 -translate-y-1/2" />
                 <div className="w-1 h-full bg-orange-800/20 absolute left-1/2 -translate-x-1/2" />
               </div>
             </div>
          </div>

          {/* Launch Controls */}
          {isReady && carPos === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
               <button 
                 onClick={launch}
                 className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-2xl tracking-widest uppercase rounded-2xl shadow-[0_10px_0_rgb(153,27,27)] active:shadow-[0_0px_0_rgb(153,27,27)] active:translate-y-2 transition-all flex items-center gap-2"
               >
                 <FlaskConical className="w-8 h-8" /> Shake & Launch
               </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
