import { useState, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7LoopAdjustments({ onExit }: LabProps) {
  const [repeatCount, setRepeatCount] = useState(10);
  const [moveAmount, setMoveAmount] = useState(10);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const timerRef = useRef<number | null>(null);

  const runCode = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setPosition(0);
    
    let currentIteration = 0;
    
    timerRef.current = window.setInterval(() => {
      currentIteration++;
      setPosition(prev => prev + moveAmount);
      
      if (currentIteration >= repeatCount) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsPlaying(false);
      }
    }, 300); // 300ms per loop iteration
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setPosition(0);
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Loop Adjustments" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto items-center">

        <div className="max-w-4xl w-full">
          <p className="text-slate-600 dark:text-slate-300 mb-8">Change the repeat count and move amount to see how the loop execution affects the sprite's final position.</p>

          <div className="flex gap-8">
            {/* Block Editor */}
            <div className="w-80 bg-slate-50 dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500">
              <h2 className="font-bold text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-wider text-sm">Scratch Code</h2>
              
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg font-mono text-sm border-2 border-slate-300 dark:border-slate-700 dark:border-slate-500">
                <div className="flex items-center text-yellow-600 font-bold mb-2 bg-yellow-100 px-2 py-1 rounded w-fit">
                  When 🏁 clicked
                </div>
                
                <div className="bg-orange-400 text-white p-3 rounded-lg rounded-tl-none font-bold">
                  <div className="flex items-center mb-2">
                    repeat 
                    <input 
                      type="number" 
                      value={repeatCount}
                      onChange={(e) => setRepeatCount(Math.max(1, Math.min(50, Number(e.target.value))))}
                      className="w-16 mx-2 px-2 py-1 text-slate-800 dark:text-slate-100 rounded outline-none text-center"
                    />
                  </div>
                  
                  <div className="bg-blue-500 text-white p-3 rounded ml-4 font-bold flex items-center shadow-inner">
                    move 
                    <input 
                      type="number" 
                      value={moveAmount}
                      onChange={(e) => setMoveAmount(Math.max(-50, Math.min(50, Number(e.target.value))))}
                      className="w-16 mx-2 px-2 py-1 text-slate-800 dark:text-slate-100 rounded outline-none text-center"
                    />
                    steps
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={runCode}
                  disabled={isPlaying}
                  className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-md disabled:opacity-50"
                >
                  <Play className="w-5 h-5 mr-2 fill-current" /> Run
                </button>
                <button 
                  onClick={reset}
                  className="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-lg flex items-center justify-center hover:bg-slate-300 dark:bg-slate-800 transition-colors shadow-sm"
                >
                  <RotateCcw className="w-5 h-5 mr-2" /> Reset
                </button>
              </div>
            </div>

            {/* Stage */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl shadow-xl border-4 border-slate-300 dark:border-slate-700 dark:border-slate-500 relative overflow-hidden flex flex-col">
              <div className="bg-slate-100 dark:bg-slate-800 flex-1 relative border-2 border-dashed border-slate-200 dark:border-slate-700 dark:border-slate-500 overflow-hidden">
                <div className="absolute inset-y-0 left-12 border-l-2 border-slate-300 dark:border-slate-700 dark:border-slate-500 border-dashed" />
                <span className="absolute bottom-2 left-2 text-xs font-bold text-slate-400">Start (0)</span>

                <div 
                  className="absolute w-16 h-16 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white font-bold transition-all duration-300 ease-linear z-10"
                  style={{
                    left: `calc(48px + ${position}px - 32px)`, // 48px offset for starting line
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                >
                  SPRITE
                </div>

                <div className="absolute top-4 right-4 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-lg shadow border border-slate-200 dark:border-slate-700 dark:border-slate-500 font-mono text-sm font-bold text-slate-600 dark:text-slate-300">
                  Total Moved: {position}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
