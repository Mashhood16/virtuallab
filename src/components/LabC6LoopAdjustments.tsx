import { useState } from 'react';
import { Play, RotateCw } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC6LoopAdjustments({ onExit }: LabProps) {
  const [mode, setMode] = useState<'turn' | 'size'>('turn');
  const [isRunning, setIsRunning] = useState(false);
  const [iteration, setIteration] = useState(0);
  
  // Sprite state
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState(100);

  const runLoop = () => {
    if (isRunning) return;
    
    // Reset state before running
    setRotation(0);
    setSize(100);
    setIteration(0);
    setIsRunning(true);

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setIteration(i);
      
      if (mode === 'turn') {
        setRotation(r => r + 15); // Turn 15 degrees
      } else {
        setSize(s => s + 10); // Change size by 10
      }

      if (i >= 10) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 500); // 500ms per iteration to make it visible
  };

  const reset = () => {
    setRotation(0);
    setSize(100);
    setIteration(0);
    setIsRunning(false);
  };

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-800">
      <div className="flex-1 p-8 flex flex-col overflow-y-auto">
        <LabHeader onExit={onExit} title="Loop Adjustments" />

        <h1 className="text-3xl font-bold mb-2">Loop Adjustments</h1>
        <p className="text-slate-600 mb-8">Swap out the block inside the repeat loop and observe the different experimental outputs.</p>

        <div className="flex gap-8 flex-1">
          {/* Blocks Editor (Mock) */}
          <div className="w-80 flex flex-col gap-4">
            
            <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="bg-amber-500 text-white font-bold p-3 text-sm flex justify-between items-center">
                <span>Control & Motion/Looks</span>
              </div>
              <div className="p-6 flex flex-col gap-4 bg-slate-50/50 items-start">
                
                <div className="bg-amber-500 rounded-lg shadow-sm border border-amber-600 p-4 w-full text-white font-bold text-sm pb-10 relative z-10">
                  <div className="mb-2 flex items-center gap-2">
                    repeat <span className="bg-slate-50 text-black px-2 py-0.5 rounded">10</span>
                  </div>
                  
                  {/* Inside Loop */}
                  <div className="bg-slate-50/20 p-2 rounded absolute bottom-2 left-4 right-4 h-12 flex items-center justify-center border-2 border-dashed border-white/50 cursor-pointer">
                    {mode === 'turn' ? (
                       <div className="bg-blue-500 border border-blue-600 px-3 py-1 rounded w-full flex items-center gap-2 shadow-sm text-xs">
                         turn <RotateCw className="w-3 h-3" /> 15 degrees
                       </div>
                    ) : (
                       <div className="bg-purple-500 border border-purple-600 px-3 py-1 rounded w-full flex items-center shadow-sm text-xs">
                         change size by 10
                       </div>
                    )}
                  </div>
                </div>

                <div className="text-sm font-bold text-slate-500 mt-4 mb-2">Available Blocks (Click to Swap):</div>
                <button 
                  disabled={isRunning}
                  onClick={() => setMode('turn')}
                  className={`bg-blue-500 rounded-lg shadow-sm border border-blue-600 p-3 w-full text-white font-bold text-sm flex items-center gap-2 transition-transform ${mode !== 'turn' ? 'opacity-50 hover:opacity-100 hover:scale-105' : 'ring-2 ring-blue-300 ring-offset-2'}`}
                >
                  turn <RotateCw className="w-4 h-4" /> 15 degrees
                </button>
                <button 
                  disabled={isRunning}
                  onClick={() => setMode('size')}
                  className={`bg-purple-500 rounded-lg shadow-sm border border-purple-600 p-3 w-full text-white font-bold text-sm flex items-center gap-2 transition-transform ${mode !== 'size' ? 'opacity-50 hover:opacity-100 hover:scale-105' : 'ring-2 ring-purple-300 ring-offset-2'}`}
                >
                  change size by 10
                </button>

              </div>
            </div>

            <button 
              onClick={runLoop}
              disabled={isRunning}
              className="flex items-center justify-center gap-2 w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-sm disabled:opacity-50 transition-colors"
            >
              <Play className="w-6 h-6" fill="currentColor" />
              {isRunning ? 'Running...' : 'Run Script'}
            </button>
            
            <button 
              onClick={reset}
              disabled={isRunning}
              className="flex items-center justify-center w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl shadow-sm disabled:opacity-50 transition-colors text-sm"
            >
              Reset Sprite
            </button>

          </div>

          {/* Stage Area */}
          <div className="flex-1 flex flex-col">
            <div className="bg-slate-50 rounded-t-xl shadow-sm border border-slate-200 border-b-0 p-3 flex justify-between items-center bg-slate-100">
              <span className="font-bold text-sm text-slate-600">Scratch Stage</span>
              <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                <span>Iteration: {iteration}/10</span>
                <span>Size: {size}%</span>
                <span>Dir: {rotation}&deg;</span>
              </div>
            </div>
            
            <div className="bg-slate-50 flex-1 rounded-b-xl shadow-sm border border-slate-200 relative overflow-hidden flex items-center justify-center">
              
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(#e2e8f0 2px, transparent 2px)',
                backgroundSize: '30px 30px'
              }}></div>

              {/* The Sprite */}
              <div 
                className="transition-all duration-300 ease-linear flex flex-col items-center justify-center"
                style={{
                  transform: `scale(${size / 100}) rotate(${rotation}deg)`,
                }}
              >
                {/* A simple cat-like face using basic shapes */}
                <div className="w-24 h-24 bg-orange-400 rounded-full relative shadow-md">
                  {/* Ears */}
                  <div className="absolute -top-4 -left-2 w-8 h-10 bg-orange-400 rounded-t-full transform -rotate-12"></div>
                  <div className="absolute -top-4 -right-2 w-8 h-10 bg-orange-400 rounded-t-full transform rotate-12"></div>
                  {/* Eyes */}
                  <div className="absolute top-8 left-5 w-4 h-4 bg-slate-50 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full"></div></div>
                  <div className="absolute top-8 right-5 w-4 h-4 bg-slate-50 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full"></div></div>
                  {/* Nose */}
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 w-3 h-2 bg-pink-400 rounded-full"></div>
                  {/* Mouth */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 w-8 h-4 border-b-2 border-orange-800 rounded-full"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
