import { useState } from 'react';
import { Rocket } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC6CoordinateExp({ onExit }: LabProps) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const [inputX, setInputX] = useState('0');
  const [inputY, setInputY] = useState('0');

  const applyCoordinates = () => {
    const parsedX = parseInt(inputX) || 0;
    const parsedY = parseInt(inputY) || 0;
    
    // Clamp to logical scratch stage bounds (-240 to 240, -180 to 180)
    setX(Math.max(-240, Math.min(240, parsedX)));
    setY(Math.max(-180, Math.min(180, parsedY)));
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Coordinate Experimentation" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">
        

        <p className="text-slate-600 dark:text-slate-300 mb-8">Relocate the Rocket sprite to different coordinates on the Cartesian plane stage.</p>

        <div className="flex gap-8 flex-1">
          {/* Blocks Editor (Mock) */}
          <div className="w-80 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 flex flex-col overflow-hidden">
            <div className="bg-blue-500 text-white font-bold p-3 text-sm">Blocks</div>
            <div className="flex-1 p-6 flex flex-col gap-4 bg-slate-50 dark:bg-slate-900/50">
              
              <div className="bg-blue-600 rounded-lg shadow-sm border border-blue-700 p-4 w-full text-white font-bold text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span>go to x:</span>
                  <input 
                    type="number" 
                    value={inputX} 
                    onChange={e => setInputX(e.target.value)} 
                    className="w-16 px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 text-black dark:text-white font-mono border-none outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>y:</span>
                  <input 
                    type="number" 
                    value={inputY} 
                    onChange={e => setInputY(e.target.value)} 
                    className="w-16 px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 text-black dark:text-white font-mono border-none outline-none ml-5"
                  />
                </div>
              </div>

              <button 
                onClick={applyCoordinates}
                className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Execute Block
              </button>

            </div>
          </div>

          {/* Stage Area */}
          <div className="flex-1 flex flex-col">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-t-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 border-b-0 p-3 flex justify-between items-center bg-slate-100 dark:bg-slate-800">
              <span className="font-bold text-sm text-slate-600 dark:text-slate-300">Scratch Stage</span>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900 flex-1 rounded-b-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 relative overflow-hidden flex items-center justify-center">
              
              {/* Cartesian Grid Background */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                backgroundPosition: 'center center'
              }}></div>
              
              {/* Axes */}
              <div className="absolute left-0 right-0 h-0.5 bg-blue-300/50 top-1/2 -translate-y-1/2"></div>
              <div className="absolute top-0 bottom-0 w-0.5 bg-rose-300/50 left-1/2 -translate-x-1/2"></div>

              {/* Labels */}
              <div className="absolute top-2 left-1/2 ml-2 text-rose-500 font-bold text-xs opacity-50">y = 180</div>
              <div className="absolute bottom-2 left-1/2 ml-2 text-rose-500 font-bold text-xs opacity-50">y = -180</div>
              <div className="absolute right-2 top-1/2 mt-2 text-blue-500 font-bold text-xs opacity-50">x = 240</div>
              <div className="absolute left-2 top-1/2 mt-2 text-blue-500 font-bold text-xs opacity-50">x = -240</div>

              {/* Sprite (Rocket) */}
              {/* logical area: 480x360. We use percentages based on x (-240 to 240) and y (-180 to 180) */}
              <div 
                className="absolute w-12 h-12 flex items-center justify-center transition-all duration-1000 ease-in-out"
                style={{
                  left: `calc(50% + ${(x / 240) * 50}% - 24px)`,
                  top: `calc(50% - ${(y / 180) * 50}% - 24px)`, // -y because css top goes down
                }}
              >
                <div className="relative">
                  <Rocket className="w-12 h-12 text-blue-600" fill="#3b82f6" strokeWidth={1} />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white dark:bg-slate-700 dark:text-white px-2 py-0.5 rounded text-[10px] whitespace-nowrap opacity-90 font-mono">
                    ({x}, {y})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
