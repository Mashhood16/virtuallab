import { useState } from 'react';
import { Play } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7SpriteManipulation({ onExit }: LabProps) {
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  
  // Real coordinates (center is 0,0)
  const [visualX, setVisualX] = useState(0);
  const [visualY, setVisualY] = useState(0);

  const applyCoordinates = () => {
    // Bound constraints: -240 to 240 for X, -180 to 180 for Y (Standard Scratch Stage)
    let finalX = Math.max(-240, Math.min(240, posX));
    let finalY = Math.max(-180, Math.min(180, posY));
    setVisualX(finalX);
    setVisualY(-finalY); // Invert Y because CSS top is positive downwards, but Scratch Y is positive upwards
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Sprite Coordinate Manipulation" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto items-center">

        <p className="text-slate-600 dark:text-slate-300 mb-8">Change the X and Y coordinates to move the sprite across the 480x360 stage.</p>

        <div className="flex gap-8 max-w-5xl w-full">
          {/* Code/Input Panel */}
          <div className="w-80 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-6 flex flex-col gap-6">
            <h2 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-2">Properties</h2>
            
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500">
              <span className="font-bold text-blue-600 w-8">X:</span>
              <input 
                type="number" 
                value={posX} 
                onChange={(e) => setPosX(Number(e.target.value))}
                className="flex-1 border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500">
              <span className="font-bold text-emerald-600 w-8">Y:</span>
              <input 
                type="number" 
                value={posY} 
                onChange={(e) => setPosY(Number(e.target.value))}
                className="flex-1 border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>

            <button 
              onClick={applyCoordinates}
              className="mt-4 bg-purple-600 text-white font-bold py-3 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors shadow-md"
            >
              <Play className="w-5 h-5 mr-2 fill-current" /> Execute
            </button>
            
            <div className="mt-auto text-sm text-slate-500 dark:text-slate-400">
              <p className="mb-2"><strong>Limits:</strong></p>
              <ul className="list-disc pl-5">
                <li>X ranges from -240 to 240</li>
                <li>Y ranges from -180 to 180</li>
              </ul>
            </div>
          </div>

          {/* Stage Area */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-xl border-4 border-slate-300 dark:border-slate-700 dark:border-slate-500 p-4 relative flex items-center justify-center overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-20 pointer-events-none">
              <div className="border-r-2 border-b-2 border-blue-500"></div>
              <div className="border-b-2 border-blue-500"></div>
              <div className="border-r-2 border-blue-500"></div>
              <div></div>
            </div>
            <span className="absolute top-2 text-xs font-bold text-slate-400">Y = 180</span>
            <span className="absolute bottom-2 text-xs font-bold text-slate-400">Y = -180</span>
            <span className="absolute left-2 text-xs font-bold text-slate-400">X = -240</span>
            <span className="absolute right-2 text-xs font-bold text-slate-400">X = 240</span>

            {/* Stage size is effectively constrained by flex, but let's make a strict internal container */}
            <div className="w-[480px] h-[360px] bg-slate-50 dark:bg-slate-900 relative border-2 border-dashed border-slate-200 dark:border-slate-700 dark:border-slate-500 overflow-hidden">
              <div 
                className="absolute w-16 h-16 bg-orange-500 rounded-lg shadow-lg flex items-center justify-center text-white font-bold transition-all duration-500 ease-out z-10"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${visualX}px), calc(-50% + ${visualY}px))`
                }}
              >
                SPRITE
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
