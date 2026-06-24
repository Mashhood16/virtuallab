import { useState, useEffect } from 'react';
import { Wind, Droplets } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS6ParticleSimulation({ onExit }: LabProps) {
  const [simulation, setSimulation] = useState<'none' | 'dissolving' | 'diffusion'>('none');
  const [progress, setProgress] = useState(0); // 0 to 100

  useEffect(() => {
    let interval: any;
    if (simulation !== 'none' && progress < 100) {
      interval = setInterval(() => {
        setProgress(p => Math.min(p + 2, 100));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [simulation, progress]);

  const startDissolving = () => {
    setSimulation('dissolving');
    setProgress(0);
  };

  const startDiffusion = () => {
    setSimulation('diffusion');
    setProgress(0);
  };

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 5: Matter as Particles" />

      <div className="flex-1 flex flex-col p-8 items-center">
        <div className="flex gap-4 mb-8">
          <button 
            onClick={startDissolving}
            className={`px-6 py-3 rounded-xl border-2 font-bold flex items-center gap-2 ${simulation === 'dissolving' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300'}`}
          >
            <Droplets className="w-5 h-5" /> Dissolving Sugar
          </button>
          <button 
            onClick={startDiffusion}
            className={`px-6 py-3 rounded-xl border-2 font-bold flex items-center gap-2 ${simulation === 'diffusion' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300'}`}
          >
            <Wind className="w-5 h-5" /> Gas Diffusion
          </button>
        </div>

        {simulation === 'dissolving' && (
          <div className="w-full max-w-2xl bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Dissolving Sugar in Water</h2>
            <p className="text-slate-600 text-center mb-8">
              Watch as the brown sugar coating dissolves. The sugar particles are finding spaces between the water particles.
            </p>

            <div className="relative w-64 h-64 border-4 border-blue-200 rounded-b-3xl bg-blue-50/30 overflow-hidden flex items-center justify-center">
              {/* Water */}
              <div className="absolute bottom-0 w-full h-48 bg-blue-100/50 border-t border-blue-200 flex flex-wrap content-start pt-4 px-2 gap-1 justify-center">
                {/* Dissolved particles spread out based on progress */}
                {[...Array(Math.floor(progress / 2))].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-amber-600 opacity-60"></div>
                ))}
              </div>

              {/* Candy */}
              <div className="absolute bottom-4 flex items-center justify-center">
                {/* Chocolate center */}
                <div className="w-16 h-12 bg-amber-900 rounded-full shadow-inner absolute"></div>
                {/* Sugar coating shrinking */}
                <div 
                  className="w-20 h-16 bg-amber-600 rounded-full transition-all duration-100 ease-linear"
                  style={{ transform: `scale(${1 - (progress / 100)})`, opacity: 1 - (progress / 100) }}
                ></div>
              </div>
            </div>

            <div className="mt-8 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${progress}%` }}></div>
            </div>
            {progress === 100 && <p className="mt-4 text-blue-600 font-bold">Dissolving Complete! The sugar particles have spread evenly through the water.</p>}
          </div>
        )}

        {simulation === 'diffusion' && (
          <div className="w-full max-w-2xl bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">Diffusion of Air Freshener</h2>
            <p className="text-slate-600 text-center mb-8">
              Gas particles move quickly and randomly. Watch how the concentrated spray spreads to evenly fill the entire room.
            </p>

            <div className="relative w-96 h-64 border-2 border-slate-300 rounded bg-slate-50 overflow-hidden">
              {/* Spray nozzle */}
              <div className="absolute top-4 left-4 text-xs font-bold text-slate-400">Spray Corner</div>
              
              {/* Particles spreading */}
              {[...Array(100)].map((_, i) => {
                // Initial position: top-left corner
                // Final position: random everywhere
                const initialX = Math.random() * 20;
                const initialY = Math.random() * 20;
                
                const finalX = Math.random() * 380;
                const finalY = Math.random() * 240;

                const currentX = initialX + ((finalX - initialX) * (progress / 100));
                const currentY = initialY + ((finalY - initialY) * (progress / 100));

                return (
                  <div 
                    key={i} 
                    className="absolute w-3 h-3 rounded-full bg-indigo-500/60 transition-all duration-100"
                    style={{ left: currentX, top: currentY }}
                  ></div>
                );
              })}
            </div>

            <div className="mt-8 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${progress}%` }}></div>
            </div>
            {progress === 100 && <p className="mt-4 text-indigo-600 font-bold">Diffusion Complete! Equilibrium is reached.</p>}
          </div>
        )}

        {simulation === 'none' && (
          <div className="text-center text-slate-500 mt-12">
            Select a simulation above to observe particle behavior.
          </div>
        )}
      </div>
    </div>
  );
}
