import { useState } from 'react';
import { Wind } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7MeasuringLungCapacity({ onExit }: LabProps) {
  const [breathing, setBreathing] = useState(false);
  const [capacity, setCapacity] = useState(0); // 0 to 100
  const [done, setDone] = useState(false);

  const startBreathing = () => {
    setBreathing(true);
    setCapacity(0);
    setDone(false);
    
    // Simulate blowing air over 3 seconds
    const interval = setInterval(() => {
      setCapacity(c => {
        if (c >= 80) { // Let's say lung capacity reaches 80% of this bottle
          clearInterval(interval);
          setBreathing(false);
          setDone(true);
          return 80;
        }
        return c + 2;
      });
    }, 50);
  };

  const reset = () => {
    setBreathing(false);
    setCapacity(0);
    setDone(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-blue-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 2: Measuring Lung Capacity" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-blue-100 max-w-2xl w-full text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Water Displacement Method</h2>
          <p className="text-slate-600 mb-6">Take a deep breath and blow into the tube. The air from your lungs will travel into the inverted bottle and push the water out. The volume of displaced water equals your lung capacity.</p>
          
          <div className="flex justify-center gap-4">
            <button 
              onMouseDown={startBreathing}
              disabled={breathing || done}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium active:scale-95 transition-transform"
            >
              <Wind className="w-5 h-5 mr-2" />
              {breathing ? 'Blowing...' : 'Take a Deep Breath & Blow'}
            </button>
            <button 
              onClick={reset}
              className="flex items-center px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Setup */}
        <div className="relative w-96 h-96 flex justify-center items-end mt-12">
          
          {/* Tub of water */}
          <div className="absolute bottom-0 w-80 h-32 border-b-4 border-l-4 border-r-4 border-slate-300 rounded-b-xl bg-blue-400/40 z-10 flex justify-center items-end">
             <div className="w-full h-28 bg-blue-500/60 border-t border-blue-400 relative overflow-hidden rounded-b-lg">
                {/* Bubbles escaping if blowing */}
                {breathing && (
                  <div className="absolute bottom-0 left-1/2 -ml-8 flex flex-col gap-2">
                    <div className="w-3 h-3 bg-slate-50/50 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-50/50 rounded-full animate-ping"></div>
                  </div>
                )}
             </div>
          </div>

          {/* Inverted Bottle */}
          <div className="absolute bottom-12 w-32 h-64 border-2 border-slate-300 bg-slate-50/20 backdrop-blur-sm rounded-t-3xl z-20 overflow-hidden flex flex-col justify-end">
             {/* Marks */}
             <div className="absolute right-0 top-0 h-full w-8 border-l border-slate-300/50 flex flex-col justify-between py-4 opacity-50">
               {[1,2,3,4,5,6].map(i => <div key={i} className="w-full border-t border-slate-400"></div>)}
             </div>

             {/* Air Pocket (pushes water down) */}
             <div 
               className="w-full bg-transparent transition-all duration-75"
               style={{ height: `${capacity}%` }}
             ></div>

             {/* Water left inside bottle */}
             <div 
               className="w-full bg-blue-500/80 transition-all duration-75 border-t-2 border-blue-400"
               style={{ height: `${100 - capacity}%` }}
             ></div>
          </div>

          {/* Rubber Tube */}
          <div className="absolute bottom-4 -left-16 w-48 h-32 border-b-8 border-r-8 border-amber-600/80 rounded-br-3xl z-30 pointer-events-none" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 80% 0, 80% 80%, 0 80%)' }}></div>
          <div className="absolute bottom-24 -left-20 text-slate-500 font-bold bg-slate-50 p-2 rounded shadow-sm z-40 border">Blow Here <Wind className="inline w-4 h-4" /></div>
        </div>

        {done && (
          <div className="mt-12 p-6 bg-slate-50 shadow-lg text-slate-800 rounded-xl border-l-4 border-blue-500 max-w-xl animate-fade-in">
            <h4 className="font-bold text-lg mb-2">Measurement Complete</h4>
            <p>You displaced <strong>{capacity * 30} mL</strong> of water! The average human lung capacity is around 3000 to 4000 mL, but taking a single deep breath and exhaling completely measures your <em>vital capacity</em>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
