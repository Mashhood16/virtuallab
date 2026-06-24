import { useState } from 'react';
import { RefreshCw, Eye } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8Periscope({ onExit }: LabProps) {
  const [showRays, setShowRays] = useState(false);
  const [objectPos, setObjectPos] = useState(50); // 0 to 100

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Act 9.3: Making a Periscope" subtitle="See over obstacles using two 45° mirrors" />

      <div className="flex-1 flex flex-col p-6 gap-6 max-w-4xl mx-auto w-full">
        
        <div className="flex-1 bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center relative overflow-hidden">
          
          <div className="flex gap-4 items-center mb-8 bg-slate-100 p-4 rounded-xl shadow-inner w-full max-w-md">
            <span className="font-bold text-slate-600">Object Position:</span>
            <input 
              type="range" min="0" max="100" value={objectPos} 
              onChange={(e) => setObjectPos(Number(e.target.value))}
              className="flex-1 accent-indigo-600"
            />
          </div>

          <div className="relative w-full max-w-2xl h-96 flex items-center justify-center">
            
            {/* The Wall/Obstacle */}
            <div className="absolute left-[30%] top-1/4 w-8 h-3/4 bg-slate-800 rounded-t-sm z-30 flex flex-col items-center shadow-xl">
               <div className="text-xs text-slate-400 font-bold -rotate-90 mt-12 tracking-widest uppercase">Brick Wall</div>
            </div>

            {/* The Object (Apple) */}
            <div className="absolute left-10 z-20 flex flex-col items-center transition-all" style={{ top: `${10 + (objectPos * 0.4)}%` }}>
               <div className="text-4xl">🍎</div>
               {showRays && <div className="absolute w-full h-full animate-ping bg-red-400/20 rounded-full" />}
            </div>

            {/* The Periscope Tube */}
            <div className="absolute left-[45%] top-[10%] w-32 h-[80%] border-4 border-slate-400 bg-slate-200 rounded-sm z-10 flex flex-col justify-between">
              {/* Top Window */}
              <div className="w-12 h-16 bg-slate-50 border-y-4 border-l-4 border-slate-400 absolute top-4 -left-12 rounded-l-md" />
              {/* Bottom Window */}
              <div className="w-12 h-16 bg-slate-50 border-y-4 border-r-4 border-slate-400 absolute bottom-4 -right-12 rounded-r-md" />
              
              {/* Top Mirror */}
              <div className="absolute top-6 left-4 w-24 h-2 bg-blue-300 shadow-[0_0_4px_blue] rotate-45 transform origin-center border border-blue-400 rounded-full" />
              {/* Bottom Mirror */}
              <div className="absolute bottom-6 left-4 w-24 h-2 bg-blue-300 shadow-[0_0_4px_blue] rotate-45 transform origin-center border border-blue-400 rounded-full" />
            </div>

            {/* The Eye */}
            <div className="absolute right-10 bottom-[15%] z-20">
               <Eye className="w-16 h-16 text-slate-700" strokeWidth={1.5} />
            </div>

            {/* Light Rays */}
            {showRays && (
              <div className="absolute inset-0 z-40 pointer-events-none">
                {/* Ray from Object to Top Mirror */}
                <div className="absolute bg-yellow-400 h-1 shadow-[0_0_5px_yellow]" 
                     style={{ left: '80px', top: `${15 + (objectPos * 0.4)}%`, width: '40%', opacity: 0.8 }} />
                
                {/* Ray down the tube */}
                <div className="absolute bg-yellow-400 w-1 shadow-[0_0_5px_yellow]" 
                     style={{ left: '55%', top: `${15 + (objectPos * 0.4)}%`, height: `${65 - (objectPos * 0.4)}%`, opacity: 0.8 }} />
                
                {/* Ray from Bottom Mirror to Eye */}
                <div className="absolute bg-yellow-400 h-1 shadow-[0_0_5px_yellow]" 
                     style={{ left: '55%', bottom: '20%', width: '30%', opacity: 0.8 }} />
                     
                {/* Little moving photons */}
                <div className="absolute w-2 h-2 bg-slate-50 rounded-full shadow-[0_0_5px_white] animate-[photon1_2s_linear_infinite]" />
              </div>
            )}
            
          </div>

          <div className="mt-8">
             <button 
                onClick={() => setShowRays(!showRays)}
                className={`px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-95 ${showRays ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}
             >
                {showRays ? 'Hide Light Rays' : 'Show Light Rays'}
             </button>
          </div>

          {showRays && (
            <div className="mt-6 px-6 py-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-center animate-fade-in max-w-lg">
              <h3 className="font-bold mb-1">How it works</h3>
              <p className="text-sm">Light from the apple enters the top window, reflects 90° down the tube off the first 45° mirror, and reflects another 90° off the bottom mirror directly into your eye.</p>
            </div>
          )}

        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes photon1 {
          0% { left: 80px; top: calc(15% + ${objectPos * 0.4}%); opacity: 1; }
          30% { left: 55%; top: calc(15% + ${objectPos * 0.4}%); }
          80% { left: 55%; top: 80%; }
          100% { left: 85%; top: 80%; opacity: 0; }
        }
      `}} />
    </div>
  );
}
