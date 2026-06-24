import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7MineralsPlantGrowth({ onExit }: LabProps) {
  const [weeks, setWeeks] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: number;
    if (running && weeks < 4) {
      interval = window.setInterval(() => {
        setWeeks(w => Math.min(4, w + 1));
      }, 1000);
    } else if (weeks === 4) {
      setRunning(false);
    }
    return () => clearInterval(interval);
  }, [running, weeks]);

  // Scale calculations
  const baseScale = 1;
  const compostScale = baseScale + weeks * 0.4; // Grows fast
  const sandScale = baseScale + weeks * 0.1; // Stunted growth

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-orange-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 1: Minerals and Plant Growth" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-orange-100 max-w-2xl w-full text-center mb-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-4">Testing Soil Nutrients</h2>
          <p className="text-slate-600 mb-6">Observe two identical seedlings planted in DIY sub-irrigated planters (soda bottles with wicks). One is in pure sand, and the other in a compost-soil mix. Both get equal water and light.</p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setRunning(!running)}
              disabled={weeks === 4}
              className="flex items-center px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium"
            >
              <Clock className="w-5 h-5 mr-2" />
              {running ? 'Pause' : weeks === 4 ? 'Experiment Complete' : 'Run 4-Week Trial'}
            </button>
            <button 
              onClick={() => { setWeeks(0); setRunning(false); }}
              className="flex items-center px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
            >
              Reset
            </button>
          </div>
          <div className="mt-4 font-bold text-lg text-slate-700">Time Elapsed: {weeks} Weeks</div>
        </div>

        <div className="flex gap-20 items-end justify-center mt-12">
          
          {/* Bottle A (Sand) */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-64 flex flex-col items-center">
              
              {/* Plant (Stunted) */}
              <div 
                className="absolute bottom-40 transform-origin-bottom transition-transform duration-1000 ease-in-out z-20 flex flex-col items-center"
                style={{ transform: `scale(${sandScale})`, transformOrigin: 'bottom center' }}
              >
                <div className="w-2 h-16 bg-green-500 relative">
                  <div className="absolute top-2 -left-4 w-6 h-3 bg-yellow-300 rounded-full rotate-[-30deg]"></div>
                  <div className="absolute top-8 -right-4 w-6 h-3 bg-green-400 rounded-full rotate-[30deg]"></div>
                </div>
              </div>

              {/* Top Half (Inverted) */}
              <div className="absolute bottom-16 w-32 h-24 border-t border-l border-r border-slate-300/50 bg-slate-50/20 backdrop-blur-sm z-10 flex justify-center">
                 {/* Sand */}
                 <div className="absolute bottom-0 w-24 h-20 bg-amber-200 border-t-8 border-amber-300/50 rounded-b-xl" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}></div>
                 {/* Wick */}
                 <div className="absolute -bottom-4 w-2 h-8 bg-slate-100 border border-slate-300"></div>
              </div>

              {/* Bottom Half (Reservoir) */}
              <div className="absolute bottom-0 w-32 h-20 border-b-2 border-l-2 border-r-2 border-slate-300/80 bg-blue-50/50 rounded-b-xl">
                 <div className="absolute bottom-0 w-full h-12 bg-blue-300/50 rounded-b-lg"></div>
              </div>
            </div>
            <h3 className="font-bold text-slate-700 mt-4 text-center">Bottle A<br/><span className="text-sm font-medium text-amber-600">Pure Sand</span></h3>
          </div>

          {/* Bottle B (Compost Mix) */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-64 flex flex-col items-center">
              
              {/* Plant (Healthy) */}
              <div 
                className="absolute bottom-40 transform-origin-bottom transition-transform duration-1000 ease-in-out z-20 flex flex-col items-center"
                style={{ transform: `scale(${compostScale})`, transformOrigin: 'bottom center' }}
              >
                <div className="w-2 h-16 bg-green-700 relative">
                  <div className="absolute top-2 -left-6 w-8 h-4 bg-green-600 rounded-full rotate-[-30deg]"></div>
                  <div className="absolute top-6 -right-6 w-8 h-4 bg-green-600 rounded-full rotate-[30deg]"></div>
                  <div className="absolute top-10 -left-5 w-6 h-3 bg-green-500 rounded-full rotate-[-20deg]"></div>
                  <div className="absolute top-12 -right-5 w-6 h-3 bg-green-500 rounded-full rotate-[20deg]"></div>
                </div>
              </div>

              {/* Top Half (Inverted) */}
              <div className="absolute bottom-16 w-32 h-24 border-t border-l border-r border-slate-300/50 bg-slate-50/20 backdrop-blur-sm z-10 flex justify-center">
                 {/* Compost */}
                 <div className="absolute bottom-0 w-24 h-20 bg-stone-800 border-t-8 border-stone-900 rounded-b-xl" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}></div>
                 {/* Wick */}
                 <div className="absolute -bottom-4 w-2 h-8 bg-slate-100 border border-slate-300"></div>
              </div>

              {/* Bottom Half (Reservoir) */}
              <div className="absolute bottom-0 w-32 h-20 border-b-2 border-l-2 border-r-2 border-slate-300/80 bg-blue-50/50 rounded-b-xl">
                 <div className="absolute bottom-0 w-full h-12 bg-blue-300/50 rounded-b-lg"></div>
              </div>
            </div>
            <h3 className="font-bold text-slate-700 mt-4 text-center">Bottle B<br/><span className="text-sm font-medium text-stone-600">Compost-Soil Mix</span></h3>
          </div>

        </div>

        {weeks === 4 && (
          <div className="mt-12 p-6 bg-slate-50 shadow-lg text-slate-800 rounded-xl border-t-4 border-orange-500 max-w-xl">
            <h4 className="font-bold text-lg mb-2">Conclusion</h4>
            <p>The plant in the <strong>compost-soil mix</strong> grew significantly larger and greener. While both plants had water and sunlight, pure sand lacks essential mineral nutrients (like Nitrogen, Phosphorus, and Potassium). The compost provided these vital minerals, proving they are necessary for healthy plant growth!</p>
          </div>
        )}
      </div>
    </div>
  );
}
