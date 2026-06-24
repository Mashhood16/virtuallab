import { useState, useEffect } from 'react';
import { ArrowLeft, Rocket } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC6MovementTracking({ onExit }: LabProps) {
  const [xPos, setXPos] = useState(0);
  const [counter, setCounter] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      setPressedKey(key);
      
      if (key === 'ArrowRight') {
        setXPos(x => Math.min(x + 20, 240));
        setCounter(c => c + 1);
      } else if (key === 'ArrowLeft') {
        setXPos(x => Math.max(x - 20, -240));
        setCounter(c => c - 1);
      }
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-800">
      <div className="flex-1 p-8 flex flex-col overflow-y-auto">
        <LabHeader onExit={onExit} title="Tracking Movement with Variables" />

        <h1 className="text-3xl font-bold mb-2">Tracking Movement with Variables</h1>
        <p className="text-slate-600 mb-8">Use the Left and Right Arrow keys. Watch how the 'counter' variable tracks the movement.</p>

        <div className="flex gap-8 flex-1">
          {/* Blocks Editor (Mock) */}
          <div className="w-80 bg-slate-50 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="bg-orange-500 text-white font-bold p-3 text-sm">Variables & Events</div>
            <div className="flex-1 p-6 flex flex-col gap-8 bg-slate-50/50">
              
              {/* Right Arrow Block */}
              <div>
                <div className="bg-amber-400 rounded-lg shadow-sm border border-amber-500 p-4 w-full text-amber-900 font-bold text-sm rounded-b-none pb-6 relative z-10">
                  <div className="absolute top-0 left-4 w-12 h-3 bg-amber-500 rounded-b-full"></div>
                  when [ right arrow ] key pressed
                </div>
                <div className="bg-orange-500 rounded-lg shadow-sm border border-orange-600 p-3 w-full text-white font-bold text-sm -mt-4 relative z-20 ml-2 mb-1">
                  change [ counter ] by (1)
                </div>
                <div className="bg-blue-500 rounded-lg shadow-sm border border-blue-600 p-3 w-full text-white font-bold text-sm ml-2 relative z-30">
                  change x by (20)
                </div>
              </div>

              {/* Left Arrow Block */}
              <div>
                <div className="bg-amber-400 rounded-lg shadow-sm border border-amber-500 p-4 w-full text-amber-900 font-bold text-sm rounded-b-none pb-6 relative z-10">
                  <div className="absolute top-0 left-4 w-12 h-3 bg-amber-500 rounded-b-full"></div>
                  when [ left arrow ] key pressed
                </div>
                <div className="bg-orange-500 rounded-lg shadow-sm border border-orange-600 p-3 w-full text-white font-bold text-sm -mt-4 relative z-20 ml-2 mb-1">
                  change [ counter ] by (-1)
                </div>
                <div className="bg-blue-500 rounded-lg shadow-sm border border-blue-600 p-3 w-full text-white font-bold text-sm ml-2 relative z-30">
                  change x by (-20)
                </div>
              </div>

            </div>
          </div>

          {/* Stage Area */}
          <div className="flex-1 flex flex-col">
            <div className="bg-slate-50 rounded-t-xl shadow-sm border border-slate-200 border-b-0 p-3 flex justify-between items-center bg-slate-100">
              <span className="font-bold text-sm text-slate-600">Scratch Stage</span>
              <div className="bg-slate-50 px-3 py-1 rounded border border-slate-300 font-bold text-slate-700 flex items-center gap-2">
                <span className="text-orange-500">counter</span>
                <span className="bg-orange-100 px-2 rounded text-orange-800">{counter}</span>
              </div>
            </div>
            
            <div className="bg-slate-50 flex-1 rounded-b-xl shadow-sm border border-slate-200 relative overflow-hidden flex items-center justify-center">
              
              <div className="absolute inset-0 bg-slate-900">
                {/* Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-slate-800 border-t-4 border-slate-700"></div>
              </div>

              <div className="absolute top-4 left-4 flex gap-2">
                <div className={`px-4 py-2 rounded-lg font-bold transition-colors ${pressedKey === 'ArrowLeft' ? 'bg-amber-400 text-amber-900' : 'bg-slate-800 text-slate-500'}`}>
                  &larr; Left
                </div>
                <div className={`px-4 py-2 rounded-lg font-bold transition-colors ${pressedKey === 'ArrowRight' ? 'bg-amber-400 text-amber-900' : 'bg-slate-800 text-slate-500'}`}>
                  Right &rarr;
                </div>
              </div>

              {/* Sprite (Rocket) */}
              <div 
                className="absolute transition-all duration-100 ease-linear"
                style={{
                  left: `calc(50% + ${(xPos / 240) * 50}% - 48px)`,
                  bottom: '25%'
                }}
              >
                <div className="relative">
                  <Rocket className="w-24 h-24 text-white transform rotate-45" fill="#ef4444" strokeWidth={1} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
