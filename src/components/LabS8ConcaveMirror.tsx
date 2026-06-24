import { useState } from 'react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8ConcaveMirror({ onExit }: LabProps) {
  const [distance, setDistance] = useState(30); // 0 close, 100 far
  
  // Focal point is roughly at 50
  const isInsideFocal = distance < 50;
  
  // Magnification and orientation
  // Close up (<50): Virtual, Upright, Magnified
  // Far (>50): Real, Inverted, Smaller as it gets further
  
  let scale = 1;
  let rotate = 0;
  let opacity = 1;
  
  if (isInsideFocal) {
    // Starts at 1, goes up to infinity at focal point
    scale = 1 + (distance / 50) * 1.5;
    rotate = 0;
  } else {
    // Flips at focal point
    rotate = 180;
    // Shrinks as it goes further away
    scale = 2.5 - ((distance - 50) / 50) * 1.5;
  }

  // Blur right exactly at focal point
  if (distance > 45 && distance < 55) {
    opacity = 1 - (5 - Math.abs(50 - distance)) / 5;
  }

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Act 9.5: Shaving Mirror" subtitle="Concave Mirror Reflection" />

      <div className="flex-1 flex flex-col p-6 gap-6 max-w-4xl mx-auto w-full items-center justify-center">
        
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 w-full mb-6">
          <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
            <span>Very Close</span>
            <span>Focal Point (Blurry)</span>
            <span>Far Away</span>
          </div>
          <input 
            type="range" min="0" max="100" value={distance} 
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>

        <div className="flex-1 bg-slate-100 rounded-2xl shadow-inner border border-slate-300 p-8 flex w-full relative overflow-hidden items-center justify-center">
          
          {/* Real world representation (Top-down view) */}
          <div className="absolute top-4 left-4 right-4 h-24 bg-slate-50 rounded-xl shadow-sm border border-slate-200 flex items-center px-4 gap-4">
             <div className="w-24 font-bold text-sm text-slate-500">Top-Down View:</div>
             <div className="flex-1 h-full relative">
               {/* Mirror */}
               <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-16 border-r-4 border-purple-500 rounded-r-full" />
               {/* Focal Point mark */}
               <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" style={{ right: '50%' }} />
               <span className="absolute top-[60%] text-xs text-red-500 font-bold" style={{ right: '48%' }}>F</span>
               {/* Person/Face */}
               <div className="absolute top-1/2 -translate-y-1/2 text-2xl" style={{ right: `${10 + distance * 0.8}%` }}>👱</div>
             </div>
          </div>

          {/* Mirror View */}
          <div className="w-80 h-80 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 shadow-2xl border-8 border-slate-300 relative flex items-center justify-center overflow-hidden mt-20 ring-4 ring-slate-100">
             
             {/* Reflection */}
             <div 
                className="text-[80px] transition-all duration-75"
                style={{ 
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  opacity: opacity,
                  filter: `blur(${(1 - opacity) * 10}px)`
                }}
             >
                👱
             </div>

             <div className="absolute inset-0 bg-slate-50/10 rounded-full shadow-[inset_0_20px_50px_rgba(255,255,255,0.5)] pointer-events-none" />
             <div className="absolute inset-0 rounded-full shadow-[inset_0_-20px_50px_rgba(0,0,0,0.1)] pointer-events-none" />
          </div>

          {/* Properties Panel */}
          <div className="absolute bottom-6 bg-slate-50/90 backdrop-blur px-6 py-4 rounded-xl border border-slate-200 shadow-lg text-center min-w-[250px]">
            <h3 className="font-bold text-slate-800 mb-2 border-b pb-2">Image Properties</h3>
            <div className="flex flex-col gap-1 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">Type:</span>
                <span className={isInsideFocal ? 'text-purple-600' : 'text-blue-600'}>{isInsideFocal ? 'Virtual' : 'Real'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Orientation:</span>
                <span className={isInsideFocal ? 'text-green-600' : 'text-red-600'}>{isInsideFocal ? 'Upright' : 'Inverted'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Size:</span>
                <span className="text-amber-600">{scale > 1.2 ? 'Magnified' : scale < 0.8 ? 'Diminished' : 'Same Size'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
